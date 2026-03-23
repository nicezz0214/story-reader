import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteBookAction,
  draftBookAction,
  publishBookAction,
  reparseBookAction,
  unlistBookAction,
  updateBookAction
} from "@/app/admin/books/actions";
import { getBookById } from "@/lib/mock-data";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ result?: string | string[] }>;

function getNotice(result: string | string[] | undefined) {
  const value = Array.isArray(result) ? result[0] : result;
  if (value === "created") return "小说已上传并完成章节拆分。";
  if (value === "updated") return "小说信息已保存。";
  if (value === "reparsed") return "已按当前规则重新解析章节，可前往章节管理查看结果。";
  return "";
}

export default async function AdminBookEditPage({
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
              Edit Book
            </div>
            <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">{book.title}</div>
            <div className="mt-3 text-sm text-[color:var(--color-muted)]">{book.author}</div>
          </div>
          <Link
            href={`/admin/books/${encodeURIComponent(book.slug)}/chapters`}
            className="flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-soft)]"
          >
            查看章节
          </Link>
        </div>
      </div>

      {notice ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      ) : null}

      <form action={updateBookAction} className="mt-6 grid gap-5">
        <input type="hidden" name="id" value={book.id} />
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">书名</span>
            <input name="title" defaultValue={book.title} className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">作者</span>
            <input name="author" defaultValue={book.author} className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4" />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm text-[color:var(--color-ink)]">简介</span>
          <textarea
            name="summary"
            rows={6}
            defaultValue={book.summary}
            className="rounded-2xl border border-[color:var(--color-line)] px-4 py-3"
          />
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">分类</span>
            <input
              name="categories"
              defaultValue={book.categories.join(", ")}
              className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">标签</span>
            <input
              name="tags"
              defaultValue={book.tags.join(", ")}
              className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4"
            />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-end">
          <label className="grid gap-2">
            <span className="text-sm text-[color:var(--color-ink)]">状态</span>
            <select name="status" defaultValue={book.status} className="min-h-12 rounded-2xl border border-[color:var(--color-line)] px-4">
              <option value="draft">草稿</option>
              <option value="published">已上架</option>
              <option value="unlisted">已下架</option>
            </select>
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[color:var(--color-line)] px-4 text-sm text-[color:var(--color-ink)]">
            <input type="checkbox" name="featured" defaultChecked={book.featured} />
            编辑精选推荐
          </label>
        </div>
        <div>
          <button type="submit" className="min-h-11 rounded-full bg-[color:var(--color-brand)] px-5 text-sm font-medium text-white">
            保存修改
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-[color:var(--color-line)] pt-6">
        <form action={publishBookAction}>
          <input type="hidden" name="id" value={book.id} />
          <button type="submit" className="min-h-11 rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)]">
            上架
          </button>
        </form>
        <form action={unlistBookAction}>
          <input type="hidden" name="id" value={book.id} />
          <button type="submit" className="min-h-11 rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)]">
            下架
          </button>
        </form>
        <form action={draftBookAction}>
          <input type="hidden" name="id" value={book.id} />
          <button type="submit" className="min-h-11 rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)]">
            转草稿
          </button>
        </form>
        <form action={reparseBookAction}>
          <input type="hidden" name="id" value={book.id} />
          <button type="submit" className="min-h-11 rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)]">
            重新解析章节
          </button>
        </form>
        <form action={deleteBookAction}>
          <input type="hidden" name="id" value={book.id} />
          <button type="submit" className="min-h-11 rounded-full border border-red-200 px-5 text-sm text-red-500">
            删除
          </button>
        </form>
      </div>
    </section>
  );
}
