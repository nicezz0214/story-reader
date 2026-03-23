import Link from "next/link";

import { StatCard } from "@/components/stat-card";
import { getAnalyticsSnapshot, getBooks } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function AdminDashboardPage() {
  const analytics = getAnalyticsSnapshot();
  const books = getBooks();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="总 PV" value={formatNumber(analytics.pageViews)} hint="按日汇总的站点访问" />
        <StatCard label="阅读会话" value={formatNumber(analytics.readingSessions)} hint="章节阅读与翻页行为" />
        <StatCard label="平均阅读时长" value={`${analytics.avgReadingMinutes} 分钟`} hint="基于阅读事件估算" />
        <StatCard label="完读率" value={`${analytics.completionRate}%`} hint="热门作品的平均完成度" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-black/6 bg-white/90 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
                Book Pipeline
              </div>
              <div className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">内容状态一览</div>
            </div>
            <Link href="/admin/books/new" className="text-sm text-[color:var(--color-brand)]">
              上传小说
            </Link>
          </div>
          <div className="mt-6 grid gap-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[color:var(--color-line)] px-4 py-4"
              >
                <div>
                  <div className="text-lg text-[color:var(--color-ink)]">{book.title}</div>
                  <div className="text-sm text-[color:var(--color-muted)]">{book.author}</div>
                </div>
                <div className="rounded-full bg-[color:var(--color-soft)] px-4 py-2 text-sm text-[color:var(--color-brand)]">
                  {book.status === "published" ? "已上架" : "草稿"}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/6 bg-white/90 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
            Current Status
          </div>
          <div className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">当前上传链路</div>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--color-muted)]">
            <li>1. 后台已支持 TXT / Markdown 上传与自动拆章。</li>
            <li>2. 书籍信息会持久化到工作区本地数据文件。</li>
            <li>3. 上架、下架、草稿、删除已在后台管理页可用。</li>
            <li>4. Prisma schema 已保留，后续可迁移到 PostgreSQL。</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
