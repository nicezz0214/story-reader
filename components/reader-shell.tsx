"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ReaderControls } from "@/components/reader-controls";
import {
  buildReaderLocationHref,
  getContinuePosition,
  listBookmarksForBook,
  removeManualBookmark,
  saveContinuePosition,
  saveManualBookmark
} from "@/lib/reader-bookmarks";
import type { ReaderBookmark, ReaderSavedLocation } from "@/lib/reader-bookmarks";

type ReaderShellProps = {
  book: {
    id: string;
    slug: string;
    title: string;
  };
  chapter: {
    id: string;
    slug: string;
    title: string;
    readingMinutes: number;
    content: string[];
  };
  previousHref?: string;
  nextHref?: string;
  bookHref: string;
  chapters: Array<{
    id: string;
    title: string;
    order: number;
    href: string;
  }>;
};

function formatBookmarkTime(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function parseParagraphIndexFromHash() {
  if (typeof window === "undefined") {
    return null;
  }

  const matched = window.location.hash.match(/^#p-(\d+)$/);
  if (!matched) {
    return null;
  }

  return Number.parseInt(matched[1], 10);
}

export function ReaderShell({
  book,
  chapter,
  previousHref,
  nextHref,
  bookHref,
  chapters
}: ReaderShellProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<ReaderBookmark[]>([]);
  const [continuePosition, setContinuePosition] = useState<ReaderSavedLocation | null>(null);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [isReadyToPersist, setIsReadyToPersist] = useState(false);

  const activeParagraphText = chapter.content[activeParagraphIndex] ?? chapter.content[0] ?? "";
  const currentLocationHref = buildReaderLocationHref({
    bookSlug: book.slug,
    chapterSlug: chapter.slug,
    paragraphIndex: activeParagraphIndex
  });
  const currentBookmark = bookmarks.find(
    (bookmark) =>
      bookmark.chapterId === chapter.id && bookmark.paragraphIndex === activeParagraphIndex
  );
  const crossChapterContinue =
    continuePosition && continuePosition.chapterId !== chapter.id ? continuePosition : null;

  useEffect(() => {
    const nextBookmarks = listBookmarksForBook(book.id);
    const storedContinuePosition = getContinuePosition(book.id);
    const hashParagraphIndex = parseParagraphIndexFromHash();
    let readyTimer = 0;

    const frame = window.requestAnimationFrame(() => {
      setBookmarks(nextBookmarks);
      setContinuePosition(storedContinuePosition);
      setResumeNotice(null);
      setIsReadyToPersist(false);

      if (hashParagraphIndex != null) {
        setActiveParagraphIndex(hashParagraphIndex);
        setIsReadyToPersist(true);
        return;
      }

      if (
        storedContinuePosition &&
        storedContinuePosition.chapterId === chapter.id &&
        storedContinuePosition.paragraphIndex > 0
      ) {
        setActiveParagraphIndex(storedContinuePosition.paragraphIndex);
        setResumeNotice(`已定位到上次阅读位置，第 ${storedContinuePosition.paragraphIndex + 1} 段`);

        readyTimer = window.setTimeout(() => {
          document
            .getElementById(`p-${storedContinuePosition.paragraphIndex}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
          setIsReadyToPersist(true);
        }, 180);

        return;
      }

      setActiveParagraphIndex(0);
      setIsReadyToPersist(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(readyTimer);
    };
  }, [book.id, chapter.id]);

  useEffect(() => {
    if (!resumeNotice) {
      return;
    }

    const timer = window.setTimeout(() => setResumeNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [resumeNotice]);

  useEffect(() => {
    let animationFrame = 0;

    const syncActiveParagraph = () => {
      const article = articleRef.current;
      if (!article) {
        return;
      }

      const paragraphNodes = Array.from(
        article.querySelectorAll<HTMLElement>("[data-reader-paragraph='true']")
      );

      if (paragraphNodes.length === 0) {
        return;
      }

      const threshold = window.innerWidth < 768 ? 170 : 220;
      let nextIndex = 0;

      paragraphNodes.forEach((paragraphNode, index) => {
        if (paragraphNode.getBoundingClientRect().top - threshold <= 0) {
          nextIndex = index;
        }
      });

      setActiveParagraphIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex
      );
    };

    const scheduleSync = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(syncActiveParagraph);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [chapter.id]);

  useEffect(() => {
    if (!isReadyToPersist) {
      return;
    }

    saveContinuePosition({
      bookId: book.id,
      bookSlug: book.slug,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      paragraphIndex: activeParagraphIndex,
      previewText: activeParagraphText
    });
  }, [
    activeParagraphIndex,
    activeParagraphText,
    book.id,
    book.slug,
    book.title,
    chapter.id,
    chapter.slug,
    chapter.title,
    isReadyToPersist
  ]);

  const toggleBookmark = () => {
    if (currentBookmark) {
      removeManualBookmark(currentBookmark.id);
      setBookmarks(listBookmarksForBook(book.id));
      return;
    }

    saveManualBookmark({
      bookId: book.id,
      bookSlug: book.slug,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      paragraphIndex: activeParagraphIndex,
      previewText: activeParagraphText
    });

    setBookmarks(listBookmarksForBook(book.id));
  };

  const deleteBookmark = (bookmarkId: string) => {
    removeManualBookmark(bookmarkId);
    setBookmarks(listBookmarksForBook(book.id));
  };

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--color-muted)]">
          <Link href={bookHref} className="transition hover:text-[color:var(--color-ink)]">
            返回简介
          </Link>
          <div>支持自动续读、段落书签与移动端快捷访问</div>
        </div>

        {crossChapterContinue ? (
          <div className="mb-6 rounded-[28px] border border-[color:var(--color-line)] bg-white/80 p-4 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-brand)]">
                  Continue Reading
                </div>
                <div className="mt-2 text-base text-[color:var(--color-ink)]">
                  上次读到《{crossChapterContinue.chapterTitle}》第{" "}
                  {crossChapterContinue.paragraphIndex + 1} 段
                </div>
                <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                  {crossChapterContinue.previewText}
                </div>
              </div>
              <Link
                href={buildReaderLocationHref(crossChapterContinue)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--color-brand)] px-5 text-sm font-medium text-white"
              >
                <History className="h-4 w-4" />
                继续阅读
              </Link>
            </div>
          </div>
        ) : null}

        <article
          ref={articleRef}
          className="reader-paper rounded-[36px] border border-black/6 px-6 py-8 shadow-[var(--shadow-soft)] sm:px-10 sm:py-12"
        >
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-[color:var(--color-brand)]">
                  {book.title}
                </div>
                <h1 className="mt-4 font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
                  {chapter.title}
                </h1>
                <div className="mt-4 text-sm text-[color:var(--color-muted)]">
                  预计阅读 {chapter.readingMinutes} 分钟
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-[color:var(--color-line)] bg-white/80 px-4 py-3 text-sm text-[color:var(--color-muted)]">
                  当前定位第 {activeParagraphIndex + 1} 段
                </div>
              </div>
            </div>

            {resumeNotice ? (
              <div className="mt-6 inline-flex rounded-full bg-[color:var(--color-soft)] px-4 py-2 text-sm text-[color:var(--color-brand)]">
                {resumeNotice}
              </div>
            ) : null}

            <div className="mt-10 space-y-7 text-base leading-9 text-[color:var(--color-ink)] sm:text-[17px]">
              {chapter.content.map((paragraph, index) => {
                const isActive = index === activeParagraphIndex;
                const isMarked = bookmarks.some(
                  (bookmark) =>
                    bookmark.chapterId === chapter.id && bookmark.paragraphIndex === index
                );

                return (
                  <p
                    key={`${chapter.id}-${index}`}
                    id={`p-${index}`}
                    data-reader-paragraph="true"
                    className={`scroll-mt-28 rounded-[20px] px-3 py-2 transition ${
                      isActive ? "bg-white/55 shadow-[inset_0_0_0_1px_rgba(13,148,136,0.12)]" : ""
                    } ${isMarked ? "reader-bookmark-mark" : ""}`}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 grid gap-4 border-t border-[color:var(--color-line)] pt-8 sm:grid-cols-3">
              <Link
                href={previousHref ?? bookHref}
                className="flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--color-line)] text-sm"
              >
                上一章
              </Link>
              <Link
                href={bookHref}
                className="flex min-h-11 items-center justify-center rounded-2xl bg-[color:var(--color-brand)] text-sm font-medium text-white"
              >
                查看目录
              </Link>
              <Link
                href={nextHref ?? bookHref}
                className="flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--color-line)] text-sm"
              >
                下一章
              </Link>
            </div>

            {bookmarks.length > 0 ? (
              <div className="mt-6 text-sm text-[color:var(--color-muted)]">
                当前作品已保存 {bookmarks.length} 个书签，最近更新于{" "}
                {formatBookmarkTime(bookmarks[0].updatedAt)}
              </div>
            ) : null}
          </div>
        </article>
      </div>

      <ReaderControls
        previousHref={previousHref}
        nextHref={nextHref}
        bookHref={bookHref}
        activeChapterId={chapter.id}
        activeParagraphIndex={activeParagraphIndex}
        currentLocationHref={currentLocationHref}
        currentPreviewText={activeParagraphText}
        bookmarks={bookmarks}
        continueLocation={continuePosition}
        isCurrentLocationBookmarked={currentBookmark != null}
        onToggleCurrentBookmark={toggleBookmark}
        onRemoveBookmark={deleteBookmark}
        chapters={chapters}
      />
    </div>
  );
}
