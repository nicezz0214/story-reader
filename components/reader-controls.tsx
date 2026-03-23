import Link from "next/link";

export function ReaderControls({
  previousHref,
  nextHref,
  bookHref
}: {
  previousHref?: string;
  nextHref?: string;
  bookHref: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-[color:var(--color-paper)]/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">
        <Link
          href={previousHref ?? bookHref}
          className="flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--color-line)] text-sm text-[color:var(--color-ink)]"
        >
          上一章
        </Link>
        <Link
          href={bookHref}
          className="flex min-h-11 items-center justify-center rounded-2xl bg-[color:var(--color-brand)] text-sm font-medium text-white"
        >
          目录
        </Link>
        <Link
          href={nextHref ?? bookHref}
          className="flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--color-line)] text-sm text-[color:var(--color-ink)]"
        >
          下一章
        </Link>
      </div>
    </div>
  );
}
