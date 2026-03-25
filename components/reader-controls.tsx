"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpenText,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  List,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

import { buildReaderLocationHref } from "@/lib/reader-bookmarks";
import type { ReaderBookmark, ReaderSavedLocation } from "@/lib/reader-bookmarks";

type ReaderChapterItem = {
  id: string;
  title: string;
  order: number;
  href: string;
};

type ReaderControlsProps = {
  previousHref?: string;
  nextHref?: string;
  bookHref: string;
  activeChapterId: string;
  activeParagraphIndex: number;
  currentLocationHref: string;
  currentPreviewText: string;
  bookmarks: ReaderBookmark[];
  continueLocation: ReaderSavedLocation | null;
  isCurrentLocationBookmarked: boolean;
  onToggleCurrentBookmark: () => void;
  onRemoveBookmark: (bookmarkId: string) => void;
  chapters: ReaderChapterItem[];
};

type DrawerTab = "catalog" | "bookmarks";

function formatBookmarkTime(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function ReaderControls({
  previousHref,
  nextHref,
  bookHref,
  activeChapterId,
  activeParagraphIndex,
  currentLocationHref,
  currentPreviewText,
  bookmarks,
  continueLocation,
  isCurrentLocationBookmarked,
  onToggleCurrentBookmark,
  onRemoveBookmark,
  chapters
}: ReaderControlsProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>("catalog");

  const openDrawer = (nextTab: DrawerTab) => {
    setActiveTab(nextTab);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    const handleKeyNavigation = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.closest("input, textarea, select, [contenteditable='true']") != null;

      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isTyping) {
        return;
      }

      if (event.key === "Escape" && isDrawerOpen) {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key === "b") {
        event.preventDefault();
        onToggleCurrentBookmark();
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
    };

    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [isDrawerOpen, nextHref, onToggleCurrentBookmark, previousHref, router]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isDrawerOpen]);

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 hidden flex-col gap-3 md:flex md:bottom-auto md:right-6 md:top-1/2 md:-translate-y-1/2">
        <button
          type="button"
          aria-label={isCurrentLocationBookmarked ? "取消当前书签" : "保存当前书签"}
          aria-pressed={isCurrentLocationBookmarked}
          onClick={onToggleCurrentBookmark}
          className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-[var(--shadow-soft)] backdrop-blur transition ${
            isCurrentLocationBookmarked
              ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)] text-white"
              : "border-[color:var(--color-line)] bg-white/95 text-[color:var(--color-ink)] hover:border-[color:var(--color-brand)] hover:text-[color:var(--color-brand)]"
          }`}
        >
          {isCurrentLocationBookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
        <button
          type="button"
          aria-label="打开阅读工具"
          aria-expanded={isDrawerOpen}
          onClick={() => openDrawer("catalog")}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-white/95 text-[color:var(--color-ink)] shadow-[var(--shadow-soft)] backdrop-blur transition hover:border-[color:var(--color-brand)] hover:text-[color:var(--color-brand)]"
        >
          <List className="h-5 w-5" />
        </button>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="关闭抽屉"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/30"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-black/10 bg-[color:var(--color-paper)] shadow-2xl">
            <div className="border-b border-[color:var(--color-line)] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-brand)]">
                    Reader Tools
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                    目录、续读位置与手动书签
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="关闭阅读工具面板"
                  onClick={closeDrawer}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)] transition hover:border-[color:var(--color-brand)] hover:text-[color:var(--color-brand)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-full bg-white/70 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeTab === "catalog"
                      ? "bg-[color:var(--color-brand)] text-white"
                      : "text-[color:var(--color-muted)]"
                  }`}
                >
                  目录
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bookmarks")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeTab === "bookmarks"
                      ? "bg-[color:var(--color-brand)] text-white"
                      : "text-[color:var(--color-muted)]"
                  }`}
                >
                  书签
                </button>
              </div>
            </div>

            <div className="border-b border-[color:var(--color-line)] px-5 py-4">
              <Link
                href={bookHref}
                onClick={closeDrawer}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--color-brand)] px-4 text-sm font-medium text-white"
              >
                <BookOpenText className="h-4 w-4" />
                返回书籍详情
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {activeTab === "catalog" ? (
                <div className="grid gap-3">
                  {chapters.map((chapter) => {
                    const isActive = chapter.id === activeChapterId;

                    return (
                      <Link
                        key={chapter.id}
                        href={chapter.href}
                        onClick={closeDrawer}
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
              ) : (
                <div className="grid gap-4">
                  <section className="rounded-[24px] border border-[color:var(--color-line)] bg-white/80 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand)]">
                      Current Position
                    </div>
                    <div className="mt-2 text-base text-[color:var(--color-ink)]">
                      当前定位第 {activeParagraphIndex + 1} 段
                    </div>
                    <div className="mt-2 text-sm leading-7 text-[color:var(--color-muted)]">
                      {currentPreviewText}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={onToggleCurrentBookmark}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${
                          isCurrentLocationBookmarked
                            ? "bg-[color:var(--color-brand)] text-white"
                            : "border border-[color:var(--color-line)] text-[color:var(--color-ink)]"
                        }`}
                      >
                        {isCurrentLocationBookmarked ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                        {isCurrentLocationBookmarked ? "取消当前书签" : "保存当前书签"}
                      </button>
                      <Link
                        href={currentLocationHref}
                        onClick={closeDrawer}
                        className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--color-line)] px-4 text-sm text-[color:var(--color-ink)]"
                      >
                        定位正文
                      </Link>
                    </div>
                  </section>

                  {continueLocation ? (
                    <section className="rounded-[24px] border border-[color:var(--color-line)] bg-white/80 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand)]">
                        Continue Reading
                      </div>
                      <div className="mt-2 text-base text-[color:var(--color-ink)]">
                        {continueLocation.chapterTitle}
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                        第 {continueLocation.paragraphIndex + 1} 段 ·{" "}
                        {formatBookmarkTime(continueLocation.updatedAt)}
                      </div>
                      <div className="mt-3 text-sm leading-7 text-[color:var(--color-muted)]">
                        {continueLocation.previewText}
                      </div>
                      <Link
                        href={buildReaderLocationHref(continueLocation)}
                        onClick={closeDrawer}
                        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[color:var(--color-brand)] px-4 text-sm font-medium text-white"
                      >
                        跳转到续读位置
                      </Link>
                    </section>
                  ) : null}

                  <section className="grid gap-3">
                    {bookmarks.length > 0 ? (
                      bookmarks.map((bookmark) => (
                        <div
                          key={bookmark.id}
                          className="rounded-[24px] border border-[color:var(--color-line)] bg-white/80 p-4"
                        >
                          <Link
                            href={buildReaderLocationHref(bookmark)}
                            onClick={closeDrawer}
                            className="block"
                          >
                            <div className="text-sm text-[color:var(--color-muted)]">
                              {bookmark.chapterTitle}
                            </div>
                            <div className="mt-1 text-base text-[color:var(--color-ink)]">
                              第 {bookmark.paragraphIndex + 1} 段
                            </div>
                            <div className="mt-2 text-sm leading-7 text-[color:var(--color-muted)]">
                              {bookmark.previewText}
                            </div>
                            <div className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                              保存于 {formatBookmarkTime(bookmark.updatedAt)}
                            </div>
                          </Link>
                          <button
                            type="button"
                            onClick={() => onRemoveBookmark(bookmark.id)}
                            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 text-sm text-[color:var(--color-muted)] transition hover:border-red-300 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            删除书签
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-[color:var(--color-line)] bg-white/50 px-4 py-8 text-sm leading-7 text-[color:var(--color-muted)]">
                        还没有手动书签。阅读到关键段落时，点击固定保存按钮即可立即标记当前位置。
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-[color:var(--color-paper)]/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-3">
          <Link
            href={previousHref ?? bookHref}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[color:var(--color-line)] text-sm text-[color:var(--color-ink)]"
          >
            <ChevronLeft className="h-4 w-4" />
            上一章
          </Link>
          <button
            type="button"
            aria-label={isCurrentLocationBookmarked ? "取消当前书签" : "保存当前书签"}
            aria-pressed={isCurrentLocationBookmarked}
            onClick={onToggleCurrentBookmark}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl text-sm font-medium transition ${
              isCurrentLocationBookmarked
                ? "bg-[color:var(--color-brand)] text-white"
                : "border border-[color:var(--color-line)] text-[color:var(--color-ink)]"
            }`}
          >
            {isCurrentLocationBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            保存
          </button>
          <button
            type="button"
            onClick={() => openDrawer("catalog")}
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
