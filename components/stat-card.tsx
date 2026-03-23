export function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-[24px] border border-black/6 bg-white/90 p-5">
      <div className="text-sm text-[color:var(--color-muted)]">{label}</div>
      <div className="mt-3 font-serif text-4xl text-[color:var(--color-ink)]">{value}</div>
      <div className="mt-4 text-sm text-[color:var(--color-muted)]">{hint}</div>
    </article>
  );
}
