import Link from "next/link";

import { BookCard } from "@/components/book-card";
import { SectionTitle } from "@/components/section-title";
import { getFeaturedBooks, getPublicShelfBooks } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function HomePage() {
  const featuredBooks = getFeaturedBooks();
  const shelfBooks = getPublicShelfBooks();
  const heroBook = featuredBooks[0];

  return (
    <div className="pb-20">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div className="space-y-8 pt-2">
            <div className="space-y-5">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                Story Reader Platform
              </div>
              <h1 className="max-w-3xl font-serif text-5xl leading-tight text-[color:var(--color-ink)] sm:text-6xl">
                一个为长篇阅读而生的小说与书籍在线翻阅平台
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--color-muted)] sm:text-lg sm:leading-9">
                首页、搜索、书架、详情、章节阅读与后台管理在同一套产品语言下协同工作，首版即支持移动端阅读体验与内容运营。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search"
                className="flex min-h-11 items-center rounded-full bg-[color:var(--color-brand)] px-6 text-sm font-medium text-white transition hover:opacity-90"
              >
                开始探索书库
              </Link>
              <Link
                href="/admin"
                className="flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-6 text-sm text-[color:var(--color-ink)] transition hover:bg-white"
              >
                进入后台
              </Link>
            </div>
            <div className="grid gap-3 text-sm text-[color:var(--color-muted)] sm:grid-cols-3">
              <div className="rounded-[22px] border border-black/6 bg-white/75 px-4 py-4">纸张感阅读界面</div>
              <div className="rounded-[22px] border border-black/6 bg-white/75 px-4 py-4">搜索与书架快速切换</div>
              <div className="rounded-[22px] border border-black/6 bg-white/75 px-4 py-4">后台上传与内容管理</div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-black/6 bg-white/88 p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                    This Week
                  </div>
                  <div className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">本周推荐</div>
                </div>
                <div className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm text-[color:var(--color-muted)]">
                  {shelfBooks.length} 部公开作品
                </div>
              </div>
              {heroBook ? (
                <div className="mt-6 grid gap-5 md:grid-cols-[180px_1fr]">
                  <Link
                    href={`/book/${heroBook.slug}`}
                    className={`rounded-[26px] bg-gradient-to-br ${heroBook.coverTone} p-5 text-white transition hover:opacity-95`}
                  >
                    <div className="text-xs uppercase tracking-[0.3em] text-white/70">{heroBook.shelfLabel}</div>
                    <div className="mt-16 font-serif text-3xl leading-tight">{heroBook.title}</div>
                    <div className="mt-3 text-sm text-white/80">{heroBook.author}</div>
                  </Link>
                  <div className="space-y-4">
                    <p className="text-base leading-8 text-[color:var(--color-muted)]">{heroBook.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {heroBook.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-xs text-[color:var(--color-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        href={`/read/${heroBook.slug}/${heroBook.chapters[0].slug}`}
                        className="flex min-h-11 items-center rounded-full bg-[color:var(--color-brand)] px-5 text-sm font-medium text-white"
                      >
                        直接阅读
                      </Link>
                      <Link
                        href={`/book/${heroBook.slug}`}
                        className="flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-5 text-sm text-[color:var(--color-ink)]"
                      >
                        查看简介
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-black/6 bg-[color:var(--color-paper)] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                  Quick Entry
                </div>
                <div className="mt-3 font-serif text-2xl text-[color:var(--color-ink)]">首屏直达</div>
                <div className="mt-4 grid gap-3">
                  <Link href="/search" className="rounded-[18px] border border-[color:var(--color-line)] px-4 py-3 text-sm text-[color:var(--color-ink)] transition hover:bg-white">
                    去搜索页查找作品
                  </Link>
                  <Link href="/shelf" className="rounded-[18px] border border-[color:var(--color-line)] px-4 py-3 text-sm text-[color:var(--color-ink)] transition hover:bg-white">
                    去书架页继续阅读
                  </Link>
                </div>
              </div>
              <div className="rounded-[28px] border border-black/6 bg-white/88 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                  Fresh Picks
                </div>
                <div className="mt-3 font-serif text-2xl text-[color:var(--color-ink)]">推荐书单</div>
                <div className="mt-4 grid gap-3">
                  {featuredBooks.slice(0, 2).map((book) => (
                    <Link
                      key={book.id}
                      href={`/book/${book.slug}`}
                      className="rounded-[18px] border border-[color:var(--color-line)] px-4 py-3 transition hover:bg-[color:var(--color-paper)]"
                    >
                      <div className="text-base text-[color:var(--color-ink)]">{book.title}</div>
                      <div className="mt-1 text-sm text-[color:var(--color-muted)]">{book.author}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Featured"
          title="首屏聚焦编辑精选与持续更新的书架"
          description="前台首页优先呈现精选书目、最近更新和分类入口，后台管理页负责内容上架、章节编排和热度观察。"
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-black/6 bg-white/80 p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-[color:var(--color-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                Public Shelf
              </div>
              <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">公共书架</h2>
            </div>
            <div className="text-sm text-[color:var(--color-muted)]">
              当前公开可浏览作品 {formatNumber(shelfBooks.length)} 部
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shelfBooks.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.slug}/${book.chapters[0].slug}`}
                className="rounded-[24px] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] p-5 transition hover:border-black/10 hover:bg-white"
              >
                <div className="text-sm text-[color:var(--color-muted)]">{book.author}</div>
                <div className="mt-2 font-serif text-2xl text-[color:var(--color-ink)]">{book.title}</div>
                <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--color-muted)]">
                  <span>{book.categories.join(" / ")}</span>
                  <span>{book.readingMinutes} 分钟</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
