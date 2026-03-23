"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenText, ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";

type ReaderChapterItem = {
  id: string;
  title: string;
  order: number;
  href: string;
};

export function ReaderControls({
  previousHref,
  nextHref,
  bookHref,
  activeChapterId,
  chapters
}: {
  previousHref?: string;
  nextHref?: string;
  bookHref: string;
  activeChapterId: string;
  chapters: ReaderChapterItem[];
}) {
  const router = useRouter();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const handleKeyNavigation = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const isTyping =
      target?.closest("input, textarea, select, [contenteditable='true']") != null;

    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isTyping) {
      return;
    }

    if (event.key === "Escape" && isCatalogOpen) {
      event.preventDefault();
      setIsCatalogOpen(false);
      return;
    }

    if (event.key === "ArrowLeft" && previousHref) {
      event.preventDefault();
      router.push(previousHref);
      return;
    }

    if (event.key === "ArrowRight" && nextHref) {
      event.preventDefault();
      router.push(nextHref);
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, []);

  useEffect(() => {
    if (!isCatalogOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isCatalogOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="打开目录"
        aria-expanded={isCatalogOpen}
        onClick={() => setIsCatalogOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-white/95 text-[color:var(--color-ink)] shadow-[var(--shadow-soft)] backdrop-blur transition hover:border-[color:var(--color-brand)] hover:text-[color:var(--color-brand)] md:bottom-auto md:right-6 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2"
      >
        <List className="h-5 w-5" />
      </button>

      {isCatalogOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="关闭目录"
            onClick={() => setIsCatalogOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-black/10 bg-[color:var(--color-paper)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-brand)]">
                  阅读目录
                </div>
                <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                  可直接跳转到任意章节
                </div>
              </div>
              <button
                type="button"
                aria-label="关闭目录面板"
                onClick={() => setIsCatalogOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)] transition hover:border-[color:var(--color-brand)] hover:text-[color:var(--color-brand)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-[color:var(--color-line)] px-5 py-4">
              <Link
                href={bookHref}
                onClick={() => setIsCatalogOpen(false)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--color-brand)] px-4 text-sm font-medium text-white"
              >
                <BookOpenText className="h-4 w-4" />
                返回书籍详情
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-3">
                {chapters.map((chapter) => {
                  const isActive = chapter.id === activeChapterId;

                  return (
                    <Link
                      key={chapter.id}
                      href={chapter.href}
                      onClick={() => setIsCatalogOpen(false)}
                      className={`rounded-[22px] border px-4 py-4 transition ${
                        isActive
                          ? "border-[color:var(--color-brand)] bg-[color:var(--color-soft)]"
                          : "border-[color:var(--color-line)] bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                        第 {chapter.order} 章
                      </div>
                      <div className="mt-2 text-base leading-7 text-[color:var(--color-ink)]">
                        {chapter.title}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-[color:var(--color-paper)]/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">
          <Link
            href={previousHref ?? bookHref}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--color-line)] text-sm text-[color:var(--color-ink)]"
          >
            <ChevronLeft className="h-4 w-4" />
            上一章
          </Link>
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[color:var(--color-brand)] text-sm font-medium text-white"
          >
            <List className="h-4 w-4" />
            目录
          </button>
          <Link
            href={nextHref ?? bookHref}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--color-line)] text-sm text-[color:var(--color-ink)]"
          >
            下一章
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
