import { StatCard } from "@/components/stat-card";
import { getAnalyticsSnapshot } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function AnalyticsPage() {
  const analytics = getAnalyticsSnapshot();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="总 PV" value={formatNumber(analytics.pageViews)} hint="书籍详情与阅读页曝光" />
        <StatCard label="阅读会话" value={formatNumber(analytics.readingSessions)} hint="有效阅读行为记录" />
        <StatCard label="平均时长" value={`${analytics.avgReadingMinutes} 分钟`} hint="估算阅读时间" />
        <StatCard label="完读率" value={`${analytics.completionRate}%`} hint="关注章节流失" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-black/6 bg-white/90 p-6">
          <div className="font-serif text-3xl text-[color:var(--color-ink)]">热门书籍</div>
          <div className="mt-6 space-y-4">
            {analytics.trendingBooks.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-[color:var(--color-muted)]">
                  <span>{item.label}</span>
                  <span>{formatNumber(item.value)}</span>
                </div>
                <div className="h-3 rounded-full bg-[color:var(--color-soft)]">
                  <div
                    className="h-3 rounded-full bg-[color:var(--color-brand)]"
                    style={{ width: `${Math.min(item.value / 50, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/6 bg-white/90 p-6">
          <div className="font-serif text-3xl text-[color:var(--color-ink)]">热门章节</div>
          <div className="mt-6 space-y-4">
            {analytics.trendingChapters.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-[color:var(--color-muted)]">
                  <span>{item.label}</span>
                  <span>{formatNumber(item.value)}</span>
                </div>
                <div className="h-3 rounded-full bg-[color:var(--color-soft)]">
                  <div
                    className="h-3 rounded-full bg-[color:var(--color-accent)]"
                    style={{ width: `${Math.min(item.value / 25, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
