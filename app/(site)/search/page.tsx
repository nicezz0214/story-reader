import Link from "next/link";

import { searchBooks } from "@/lib/mock-data";

type SearchParams = Promise<{ q?: string | string[] }>;

function normalizeQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = normalizeQuery(q);
  const books = searchBooks(query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-black/6 bg-white/80 p-6 sm:p-8">
        <div className="max-w-2xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
            Search
          </div>
          <h1 className="font-serif text-4xl text-[color:var(--color-ink)]">搜索书名、作者、简介与标签</h1>
          <p className="text-base leading-8 text-[color:var(--color-muted)]">
            首版搜索范围严格控制在书名、作者、简介和标签，保证实现简单且结果明确，后续再扩展全文检索。
          </p>
        </div>
        <form action="/search" className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="试试输入：档案、古镇、书店"
            className="min-h-14 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-5 outline-none transition focus:border-[color:var(--color-brand)]"
          />
          <button
            type="submit"
            className="min-h-14 rounded-2xl bg-[color:var(--color-brand)] px-6 text-sm font-medium text-white"
          >
            搜索
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/book/${book.slug}`}
            className="grid gap-5 rounded-[28px] border border-black/6 bg-white/90 p-5 transition hover:border-black/10 md:grid-cols-[220px_1fr]"
          >
            <div className={`rounded-[24px] bg-gradient-to-br ${book.coverTone} p-6 text-white`}>
              <div className="text-xs uppercase tracking-[0.3em] text-white/75">{book.shelfLabel}</div>
              <div className="mt-16 font-serif text-3xl">{book.title}</div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[color:var(--color-muted)]">{book.author}</div>
                <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">{book.title}</div>
              </div>
              <p className="text-base leading-8 text-[color:var(--color-muted)]">{book.summary}</p>
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
