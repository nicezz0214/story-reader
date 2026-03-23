export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
        {eyebrow}
      </div>
      <h2 className="font-serif text-3xl text-[color:var(--color-ink)] sm:text-4xl">{title}</h2>
      <p className="text-base leading-8 text-[color:var(--color-muted)]">{description}</p>
    </div>
  );
}
