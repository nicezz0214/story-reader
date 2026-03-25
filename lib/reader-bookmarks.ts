export type ReaderSavedLocation = {
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  chapterId: string;
  chapterSlug: string;
  chapterTitle: string;
  paragraphIndex: number;
  previewText: string;
  updatedAt: string;
};

export type ReaderBookmark = ReaderSavedLocation & {
  id: string;
  createdAt: string;
};

type ContinueMap = Record<string, ReaderSavedLocation>;

const CONTINUE_STORAGE_KEY = "story-reader:continue-reading";
const BOOKMARK_STORAGE_KEY = "story-reader:bookmarks";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T) {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function readContinueMap() {
  return readJson<ContinueMap>(CONTINUE_STORAGE_KEY, {});
}

function readBookmarks() {
  return readJson<ReaderBookmark[]>(BOOKMARK_STORAGE_KEY, []);
}

function normalizePreviewText(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 72);
}

export function buildReaderLocationHref(location: Pick<ReaderSavedLocation, "bookSlug" | "chapterSlug" | "paragraphIndex">) {
  return `/read/${location.bookSlug}/${location.chapterSlug}#p-${location.paragraphIndex}`;
}

export function getContinuePosition(bookId: string) {
  const location = readContinueMap()[bookId];
  return location ?? null;
}

export function saveContinuePosition(location: Omit<ReaderSavedLocation, "updatedAt">) {
  const continueMap = readContinueMap();
  const nextLocation: ReaderSavedLocation = {
    ...location,
    previewText: normalizePreviewText(location.previewText),
    updatedAt: new Date().toISOString()
  };

  continueMap[location.bookId] = nextLocation;
  writeJson(CONTINUE_STORAGE_KEY, continueMap);

  return nextLocation;
}

export function listBookmarksForBook(bookId: string) {
  return readBookmarks()
    .filter((bookmark) => bookmark.bookId === bookId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function saveManualBookmark(location: Omit<ReaderSavedLocation, "updatedAt">) {
  const bookmarks = readBookmarks();
  const now = new Date().toISOString();
  const previewText = normalizePreviewText(location.previewText);
  const existingIndex = bookmarks.findIndex(
    (bookmark) =>
      bookmark.bookId === location.bookId &&
      bookmark.chapterId === location.chapterId &&
      bookmark.paragraphIndex === location.paragraphIndex
  );

  if (existingIndex >= 0) {
    const existing = bookmarks[existingIndex];
    const nextBookmark: ReaderBookmark = {
      ...existing,
      ...location,
      previewText,
      updatedAt: now
    };

    bookmarks.splice(existingIndex, 1);
    bookmarks.unshift(nextBookmark);
    writeJson(BOOKMARK_STORAGE_KEY, bookmarks);
    return nextBookmark;
  }

  const bookmark: ReaderBookmark = {
    ...location,
    previewText,
    id: `bookmark-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now
  };

  bookmarks.unshift(bookmark);
  writeJson(BOOKMARK_STORAGE_KEY, bookmarks);
  return bookmark;
}

export function removeManualBookmark(bookmarkId: string) {
  const bookmarks = readBookmarks().filter((bookmark) => bookmark.id !== bookmarkId);
  writeJson(BOOKMARK_STORAGE_KEY, bookmarks);
}
