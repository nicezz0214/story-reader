import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicBookById } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const book = getPublicBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className={`rounded-[32px] bg-gradient-to-br ${book.coverTone} p-8 text-white shadow-[var(--shadow-soft)]`}>
          <div className="text-xs uppercase tracking-[0.35em] text-white/75">{book.shelfLabel}</div>
          <div className="mt-24 font-serif text-5xl leading-tight">{book.title}</div>
          <div className="mt-4 text-base text-white/80">{book.author}</div>
        </div>
        <div className="rounded-[32px] border border-black/6 bg-white/90 p-6 sm:p-8">
          <div className="flex flex-wrap gap-3">
            {book.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-[color:var(--color-soft)] px-4 py-2 text-sm text-[color:var(--color-brand)]"
              >
                {category}
              </span>
            ))}
          </div>
          <h1 className="mt-6 font-serif text-5xl text-[color:var(--color-ink)]">{book.title}</h1>
          <p className="mt-6 text-base leading-8 text-[color:var(--color-muted)]">{book.summary}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[color:var(--color-line)] p-4">
              <div className="text-sm text-[color:var(--color-muted)]">字数</div>
              <div className="mt-2 font-serif text-3xl">{formatNumber(book.wordCount)}</div>
            </div>
            <div className="rounded-[24px] border border-[color:var(--color-line)] p-4">
              <div className="text-sm text-[color:var(--color-muted)]">预计阅读</div>
              <div className="mt-2 font-serif text-3xl">{book.readingMinutes} 分钟</div>
            </div>
            <div className="rounded-[24px] border border-[color:var(--color-line)] p-4">
              <div className="text-sm text-[color:var(--color-muted)]">当前状态</div>
              <div className="mt-2 font-serif text-3xl">{book.status === "published" ? "已上架" : "草稿"}</div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/read/${book.slug}/${book.chapters[0].slug}`}
              className="flex min-h-11 items-center rounded-full bg-[color:var(--color-brand)] px-6 text-sm font-medium text-white"
            >
              开始阅读
            </Link>
            <Link
              href="/shelf"
              className="flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-6 text-sm text-[color:var(--color-ink)]"
            >
              返回书架
            </Link>
          </div>
          <div className="mt-10 border-t border-[color:var(--color-line)] pt-8">
            <div className="font-serif text-3xl text-[color:var(--color-ink)]">章节目录</div>
            <div className="mt-5 grid gap-3">
              {book.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/read/${book.slug}/${chapter.slug}`}
                  className="rounded-[20px] border border-[color:var(--color-line)] px-5 py-4 transition hover:bg-[color:var(--color-paper)]"
                >
                  <div className="text-sm text-[color:var(--color-muted)]">第 {chapter.order} 章</div>
                  <div className="mt-1 text-lg text-[color:var(--color-ink)]">{chapter.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
