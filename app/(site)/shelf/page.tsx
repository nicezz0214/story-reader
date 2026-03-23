import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { getPublicShelfBooks } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function ShelfPage() {
  const books = getPublicShelfBooks();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Shelf"
        title="公共书架与最近阅读入口"
        description="当前阶段不引入用户体系，书架以公开推荐、最近阅读占位和收藏位展示为主，便于后续平滑接入个人账户。"
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-black/6 bg-white/85 p-6">
          <div className="flex items-center justify-between border-b border-[color:var(--color-line)] pb-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                Public Shelf
              </div>
              <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">公开可读作品</div>
            </div>
            <div className="text-sm text-[color:var(--color-muted)]">{formatNumber(books.length)} 部</div>
          </div>
          <div className="mt-6 grid gap-4">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.slug}/${book.chapters[0].slug}`}
                className="rounded-[24px] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] p-5 transition hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-2xl text-[color:var(--color-ink)]">{book.title}</div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted)]">{book.author}</div>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-sm text-[color:var(--color-brand)]">
                    {book.completion}% 完读率
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[color:var(--color-muted)]">{book.summary}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-black/6 bg-white/90 p-6">
            <div className="font-serif text-3xl text-[color:var(--color-ink)]">最近阅读</div>
            <div className="mt-4 text-sm leading-7 text-[color:var(--color-muted)]">
              首版使用本地缓存记录最近一次章节访问，后续接入用户体系后可无缝切换为云端同步。
            </div>
            <div className="mt-6 rounded-[24px] border border-dashed border-[color:var(--color-line)] p-4 text-sm text-[color:var(--color-muted)]">
              当前骨架阶段使用 mock 数据展示，下一步接入真实持久化存储。
            </div>
          </div>
          <div className="rounded-[32px] border border-black/6 bg-white/90 p-6">
            <div className="font-serif text-3xl text-[color:var(--color-ink)]">收藏占位</div>
            <ul className="mt-5 space-y-3 text-sm text-[color:var(--color-muted)]">
              <li>支持后续扩展为用户收藏夹</li>
              <li>当前不依赖登录，保留信息架构与布局位置</li>
              <li>便于未来增加同步、分组与阅读历史</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
