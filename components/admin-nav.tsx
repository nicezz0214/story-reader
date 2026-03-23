import Link from "next/link";

const links = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/books", label: "小说管理" },
  { href: "/admin/books/new", label: "上传小说" },
  { href: "/admin/analytics", label: "分析页" }
];

export function AdminNav() {
  return (
    <aside className="rounded-[28px] border border-black/6 bg-white/90 p-4">
      <div className="mb-5 border-b border-[color:var(--color-line)] pb-4">
        <div className="font-serif text-2xl text-[color:var(--color-ink)]">后台管理</div>
        <div className="mt-2 text-sm text-[color:var(--color-muted)]">首版使用简单管理口令接入。</div>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-11 items-center rounded-2xl px-4 text-sm text-[color:var(--color-muted)] transition hover:bg-[color:var(--color-soft)] hover:text-[color:var(--color-ink)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
