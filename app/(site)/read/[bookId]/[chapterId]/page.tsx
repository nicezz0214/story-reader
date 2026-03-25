import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader-shell";
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
  const chapterLinks = book.chapters.map((item) => ({
    id: item.id,
    title: item.title,
    order: item.order,
    href: `/read/${book.slug}/${item.slug}`
  }));

  return (
    <ReaderShell
      book={{
        id: book.id,
        slug: book.slug,
        title: book.title
      }}
      chapter={{
        id: chapter.id,
        slug: chapter.slug,
        title: chapter.title,
        readingMinutes: chapter.readingMinutes,
        content: chapter.content
      }}
      previousHref={previousChapter ? `/read/${book.slug}/${previousChapter.slug}` : undefined}
      nextHref={nextChapter ? `/read/${book.slug}/${nextChapter.slug}` : undefined}
      bookHref={`/book/${book.slug}`}
      chapters={chapterLinks}
    />
  );
}
