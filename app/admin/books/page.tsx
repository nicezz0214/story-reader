import Link from "next/link";

import {
  deleteBookAction,
  draftBookAction,
  publishBookAction,
  unlistBookAction
} from "@/app/admin/books/actions";
import { getBooks } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

type SearchParams = Promise<{ result?: string | string[]; error?: string | string[] }>;

function getNotice(searchParams: { result?: string | string[]; error?: string | string[] }) {
  const result = Array.isArray(searchParams.result) ? searchParams.result[0] : searchParams.result;
  const error = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  if (error === "book_not_found") {
    return { tone: "error", text: "目标小说不存在，可能已被删除。" };
  }

  switch (result) {
    case "published":
      return { tone: "success", text: "小说已上架。" };
    case "unlisted":
      return { tone: "success", text: "小说已下架。" };
    case "draft":
      return { tone: "success", text: "小说已转为草稿。" };
    case "deleted":
      return { tone: "success", text: "小说已删除。" };
    default:
      return null;
  }
}

export default async function AdminBooksPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const books = getBooks();
  const notice = getNotice(params);

  return (
    <section className="rounded-[28px] border border-black/6 bg-white/90 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-line)] pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
            Books
          </div>
          <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">小说管理</div>
        </div>
        <Link
          href="/admin/books/new"
          className="flex min-h-11 items-center rounded-full bg-[color:var(--color-brand)] px-5 text-sm font-medium text-white"
        >
          上传新小说
        </Link>
      </div>

      {notice ? (
        <div
          className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
            notice.tone === "error"
              ? "border border-red-200 bg-red-50 text-red-600"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--color-line)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--color-soft)] text-[color:var(--color-muted)]">
            <tr>
              <th className="px-4 py-4 font-medium">书名</th>
              <th className="px-4 py-4 font-medium">状态</th>
              <th className="px-4 py-4 font-medium">章节</th>
              <th className="px-4 py-4 font-medium">字数</th>
              <th className="px-4 py-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {books.map((book) => (
              <tr key={book.id} className="border-t border-[color:var(--color-line)] align-top">
                <td className="px-4 py-4">
                  <div className="text-[color:var(--color-ink)]">{book.title}</div>
                  <div className="text-[color:var(--color-muted)]">{book.author}</div>
                </td>
                <td className="px-4 py-4 text-[color:var(--color-muted)]">
                  {book.status === "published" ? "已上架" : book.status === "unlisted" ? "已下架" : "草稿"}
                </td>
                <td className="px-4 py-4 text-[color:var(--color-muted)]">{book.chapters.length}</td>
                <td className="px-4 py-4 text-[color:var(--color-muted)]">{formatNumber(book.wordCount)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/admin/books/${book.slug}`} className="text-[color:var(--color-brand)]">
                      编辑
                    </Link>
                    <Link href={`/admin/books/${book.slug}/chapters`} className="text-[color:var(--color-brand)]">
                      章节
                    </Link>
                    <form action={publishBookAction}>
                      <input type="hidden" name="id" value={book.id} />
                      <button type="submit" className="text-[color:var(--color-brand)]">
                        上架
                      </button>
                    </form>
                    <form action={unlistBookAction}>
                      <input type="hidden" name="id" value={book.id} />
                      <button type="submit" className="text-[color:var(--color-brand)]">
                        下架
                      </button>
                    </form>
                    <form action={draftBookAction}>
                      <input type="hidden" name="id" value={book.id} />
                      <button type="submit" className="text-[color:var(--color-brand)]">
                        草稿
                      </button>
                    </form>
                    <form action={deleteBookAction}>
                      <input type="hidden" name="id" value={book.id} />
                      <button type="submit" className="text-red-500">
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
