import Link from "next/link";

import type { Book } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/6 bg-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-black/10 hover:bg-white">
      <div
        className={`h-48 bg-gradient-to-br ${book.coverTone} p-6 text-white`}
        aria-hidden="true"
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/75">{book.shelfLabel}</div>
        <div className="mt-16 font-serif text-3xl leading-tight">{book.title}</div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <div className="text-sm text-[color:var(--color-muted)]">{book.author}</div>
          <p className="line-clamp-3 text-sm leading-7 text-[color:var(--color-muted)]">{book.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-xs text-[color:var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-[color:var(--color-muted)]">
          <span>{formatNumber(book.wordCount)} 字</span>
          <Link href={`/book/${book.slug}`} className="font-medium text-[color:var(--color-brand)]">
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
