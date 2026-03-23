import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";

async function unlockAdmin(formData: FormData) {
  "use server";

  const token = String(formData.get("token") ?? "");
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN ?? "story-reader-admin";

  if (token !== expectedToken) {
    redirect("/admin");
  }

  const cookieStore = await cookies();
  cookieStore.set("story-reader-admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  redirect("/admin");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("story-reader-admin")?.value;
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN ?? "story-reader-admin";

  if (adminToken !== expectedToken) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full rounded-[32px] border border-black/6 bg-white/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
            Admin Access
          </div>
          <h1 className="mt-4 font-serif text-4xl text-[color:var(--color-ink)]">输入后台管理口令</h1>
          <p className="mt-4 text-base leading-8 text-[color:var(--color-muted)]">
            当前版本未接入完整用户系统，后台采用简单口令保护。请在 `.env` 中配置
            `ADMIN_ACCESS_TOKEN`，默认值为 `story-reader-admin`。
          </p>
          <form action={unlockAdmin} className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
            <input
              type="password"
              name="token"
              placeholder="输入后台口令"
              className="min-h-14 rounded-2xl border border-[color:var(--color-line)] px-5 outline-none transition focus:border-[color:var(--color-brand)]"
            />
            <button
              type="submit"
              className="min-h-14 rounded-2xl bg-[color:var(--color-brand)] px-6 text-sm font-medium text-white"
            >
              进入后台
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
            Admin
          </div>
          <h1 className="mt-2 font-serif text-4xl text-[color:var(--color-ink)]">Story Reader 后台</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm text-[color:var(--color-muted)]">
            简单管理口令接入
          </div>
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-soft)]"
          >
            返回首页
          </Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <AdminNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
