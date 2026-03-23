import Link from "next/link";
import { notFound } from "next/navigation";

import { reparseBookAction } from "@/app/admin/books/actions";
import { getBookById } from "@/lib/mock-data";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ result?: string | string[] }>;

function getNotice(result: string | string[] | undefined) {
  const value = Array.isArray(result) ? result[0] : result;
  if (value === "reparsed") return "已按最新规则重新解析章节。";
  return "";
}

export default async function AdminBookChaptersPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { result } = await searchParams;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  const notice = getNotice(result);

  return (
    <section className="rounded-[28px] border border-black/6 bg-white/90 p-6">
      <div className="border-b border-[color:var(--color-line)] pb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
              Chapters
            </div>
            <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">{book.title} 章节管理</div>
            <div className="mt-3 text-sm text-[color:var(--color-muted)]">
              当前共解析 {book.chapters.length} 章。章节在上传时按标题自动拆分，当前版本暂不提供逐章在线编辑。
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <form action={reparseBookAction}>
              <input type="hidden" name="id" value={book.id} />
              <input type="hidden" name="redirectTo" value="chapters" />
              <button
                type="submit"
                className="min-h-11 rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-soft)]"
              >
                重新解析章节
              </button>
            </form>
            <Link
              href={`/admin/books/${encodeURIComponent(book.slug)}`}
              className="flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-soft)]"
            >
              返回书籍设置
            </Link>
          </div>
        </div>
      </div>

      {notice ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {book.chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="rounded-[22px] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-5 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm text-[color:var(--color-muted)]">第 {chapter.order} 章</div>
                <div className="mt-1 text-lg text-[color:var(--color-ink)]">{chapter.title}</div>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm text-[color:var(--color-muted)]">
                {chapter.readingMinutes} 分钟
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-muted)]">{chapter.excerpt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
