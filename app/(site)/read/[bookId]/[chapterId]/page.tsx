import Link from "next/link";
import { notFound } from "next/navigation";

import { ReaderControls } from "@/components/reader-controls";
import { getPublicBookById } from "@/lib/mock-data";

type Params = Promise<{ bookId: string; chapterId: string }>;

export default async function ReaderPage({ params }: { params: Params }) {
  const { bookId, chapterId } = await params;
  const book = getPublicBookById(bookId);
  const chapter = book?.chapters.find((item) => item.slug === chapterId || item.id === chapterId);

  if (!book || !chapter) {
    notFound();
  }

  const chapterIndex = book.chapters.findIndex((item) => item.id === chapter.id);
  const previousChapter = chapterIndex > 0 ? book.chapters[chapterIndex - 1] : undefined;
  const nextChapter = chapterIndex < book.chapters.length - 1 ? book.chapters[chapterIndex + 1] : undefined;

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--color-muted)]">
          <Link href={`/book/${book.slug}`} className="transition hover:text-[color:var(--color-ink)]">
            返回简介
          </Link>
          <div>移动端正文不低于 16px，操作按钮保持 44x44 热区</div>
        </div>
        <article className="reader-paper rounded-[36px] border border-black/6 px-6 py-8 shadow-[var(--shadow-soft)] sm:px-10 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="text-sm uppercase tracking-[0.3em] text-[color:var(--color-brand)]">{book.title}</div>
            <h1 className="mt-4 font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">{chapter.title}</h1>
            <div className="mt-4 text-sm text-[color:var(--color-muted)]">
              预计阅读 {chapter.readingMinutes} 分钟
            </div>
            <div className="mt-10 space-y-7 text-base leading-9 text-[color:var(--color-ink)] sm:text-[17px]">
              {chapter.content.map((paragraph, index) => (
                <p key={`${chapter.id}-${index}`}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-12 grid gap-4 border-t border-[color:var(--color-line)] pt-8 sm:grid-cols-3">
              <Link
                href={previousChapter ? `/read/${book.slug}/${previousChapter.slug}` : `/book/${book.slug}`}
                className="flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--color-line)] text-sm"
              >
                上一章
              </Link>
              <Link
                href={`/book/${book.slug}`}
                className="flex min-h-11 items-center justify-center rounded-2xl bg-[color:var(--color-brand)] text-sm font-medium text-white"
              >
                查看目录
              </Link>
              <Link
                href={nextChapter ? `/read/${book.slug}/${nextChapter.slug}` : `/book/${book.slug}`}
                className="flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--color-line)] text-sm"
              >
                下一章
              </Link>
            </div>
          </div>
        </article>
      </div>
      <ReaderControls
        previousHref={previousChapter ? `/read/${book.slug}/${previousChapter.slug}` : undefined}
        nextHref={nextChapter ? `/read/${book.slug}/${nextChapter.slug}` : undefined}
        bookHref={`/book/${book.slug}`}
      />
    </div>
  );
}
