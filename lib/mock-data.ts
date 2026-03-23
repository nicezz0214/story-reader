import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type BookStatus = "published" | "draft" | "unlisted";
export type ChapterStatus = "published" | "draft";

export type Chapter = {
  id: string;
  bookId: string;
  slug: string;
  title: string;
  order: number;
  excerpt: string;
  content: string[];
  readingMinutes: number;
  status: ChapterStatus;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  summary: string;
  coverTone: string;
  status: BookStatus;
  categories: string[];
  tags: string[];
  wordCount: number;
  readingMinutes: number;
  shelfLabel: string;
  featured: boolean;
  completion: number;
  chapters: Chapter[];
  sourceText?: string;
};

export type CreateBookInput = {
  title: string;
  author: string;
  summary: string;
  categories: string[];
  tags: string[];
  status: BookStatus;
  rawText: string;
};

export type UpdateBookInput = {
  id: string;
  title: string;
  author: string;
  summary: string;
  categories: string[];
  tags: string[];
  status: BookStatus;
  featured: boolean;
};

const STORE_PATH = path.join(process.cwd(), "data", "library.json");
const COVER_TONES = [
  "from-teal-700 via-teal-600 to-emerald-500",
  "from-orange-700 via-amber-600 to-yellow-500",
  "from-slate-800 via-slate-700 to-sky-500",
  "from-rose-700 via-pink-600 to-orange-400",
  "from-indigo-700 via-violet-700 to-sky-500"
] as const;

const defaultBooks: Book[] = [
  {
    id: "book-mist-city",
    slug: "mist-city-archive",
    title: "雾城档案",
    author: "林折舟",
    summary:
      "一座终年被潮雾包裹的海港城市里，档案修复师意外卷入一宗跨越三十年的失踪案。故事以城市记忆、旧报纸与失落手稿为线索推进。",
    coverTone: "from-teal-700 via-teal-600 to-emerald-500",
    status: "published",
    categories: ["悬疑", "都市"],
    tags: ["慢热", "调查", "档案"],
    wordCount: 218000,
    readingMinutes: 780,
    shelfLabel: "编辑精选",
    featured: true,
    completion: 68,
    chapters: [
      {
        id: "chapter-mist-1",
        bookId: "book-mist-city",
        slug: "harbor-at-dawn",
        title: "第一章 港口的清晨",
        order: 1,
        excerpt: "清晨五点，第一班拖轮还没进港，档案馆的大门已经被海风吹得作响。",
        content: [
          "清晨五点，第一班拖轮还没进港，档案馆的大门已经被海风吹得作响。",
          "沈知野推开铁门时，旧报纸在木箱里发出干燥的摩擦声，仿佛城市在背后悄悄翻身。",
          "这一周送来的卷宗比往常更多，封条上全是失效多年的编号，而最上面那一份，写着一行本不该出现的名字。"
        ],
        readingMinutes: 18,
        status: "published"
      },
      {
        id: "chapter-mist-2",
        bookId: "book-mist-city",
        slug: "the-name-on-paper",
        title: "第二章 纸上的名字",
        order: 2,
        excerpt: "泛黄纸页的角落里，有人用蓝墨水补写了一行日期，日期正好停在失踪案发生的前夜。",
        content: [
          "泛黄纸页的角落里，有人用蓝墨水补写了一行日期，日期正好停在失踪案发生的前夜。",
          "那并不是档案员惯用的笔迹，字形细长，收笔却异常用力，像是在迟疑之后又强行给出结论。",
          "他把纸张举到窗边，海雾把阳光磨成淡银色，一切都像刚从水底被打捞上来。"
        ],
        readingMinutes: 20,
        status: "published"
      }
    ]
  },
  {
    id: "book-lantern",
    slug: "lantern-over-river",
    title: "河灯长明",
    author: "顾未迟",
    summary:
      "一场古镇水灾后，返乡的建筑师与地方志编修员共同修复被冲毁的祠堂，也逐渐拼出家族与河道的隐秘历史。",
    coverTone: "from-orange-700 via-amber-600 to-yellow-500",
    status: "published",
    categories: ["历史", "治愈"],
    tags: ["家族", "古镇", "人文"],
    wordCount: 164000,
    readingMinutes: 620,
    shelfLabel: "新书上架",
    featured: true,
    completion: 42,
    chapters: [
      {
        id: "chapter-lantern-1",
        bookId: "book-lantern",
        slug: "return-to-the-river",
        title: "第一章 回到河埠头",
        order: 1,
        excerpt: "她离开古镇十年，第一次再看见河埠头时，潮线已经漫过了青石台阶。",
        content: [
          "她离开古镇十年，第一次再看见河埠头时，潮线已经漫过了青石台阶。",
          "旧祠堂门槛上还压着退水后的泥痕，一层一层像沉默的年轮。",
          "镇上的老人说，河道会记住每一次改道，也会在深夜把被人忘掉的名字慢慢推回来。"
        ],
        readingMinutes: 16,
        status: "published"
      }
    ]
  },
  {
    id: "book-star-map",
    slug: "star-map-bookstore",
    title: "星图旧书店",
    author: "周临",
    summary:
      "一家只在雨天营业的旧书店，接待的不是寻找绝版书的人，而是寻找某个过去版本的自己的人。",
    coverTone: "from-slate-800 via-slate-700 to-sky-500",
    status: "draft",
    categories: ["幻想", "成长"],
    tags: ["书店", "奇遇", "短章"],
    wordCount: 92000,
    readingMinutes: 360,
    shelfLabel: "即将上架",
    featured: false,
    completion: 15,
    chapters: [
      {
        id: "chapter-star-1",
        bookId: "book-star-map",
        slug: "the-rain-door",
        title: "第一章 雨门",
        order: 1,
        excerpt: "那扇门只有在下雨的时候才会出现，像一页被突然翻开的目录。",
        content: [
          "那扇门只有在下雨的时候才会出现，像一页被突然翻开的目录。",
          "少年躲雨时无意推开木门，风铃没响，书页却自己开始翻动。",
          "柜台后的老板只问了一句，你今天想找书，还是想找一个还没发生的决定。"
        ],
        readingMinutes: 14,
        status: "draft"
      }
    ]
  }
];

function normalizeText(rawText: string) {
  return rawText.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
}

function decodeUploadedText(bytes: Uint8Array) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("gb18030").decode(bytes);
  }
}

export function decodeUploadBuffer(buffer: ArrayBuffer) {
  return decodeUploadedText(new Uint8Array(buffer));
}

function safeSlug(input: string, fallback: string) {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[#*_`~]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function splitList(value: string) {
  return value
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLookupValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function wordCountFromParagraphs(paragraphs: string[]) {
  return paragraphs.join("").replace(/\s+/g, "").length;
}

function readingMinutesFromWordCount(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 420));
}

function chapterTitleFromLine(line: string) {
  return line
    .trim()
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\*\*(.+)\*\*$/u, "$1")
    .replace(/^__(.+)__$/u, "$1")
    .replace(/^[【\[](.+)[】\]]$/u, "$1")
    .trim();
}

function isChapterHeading(line: string) {
  const value = chapterTitleFromLine(line);
  return /^(第[\d一二三四五六七八九十百千万零两〇]+[章节回卷部篇集]\s*.+|第\s*[\d]+\s*[章节回卷部篇集]\s*.+|Chapter\s*\d+.*|序章.*|楔子.*|尾声.*|番外.*)$/i.test(value);
}

function paragraphsFromText(input: string) {
  return input
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
    .filter(Boolean);
}

function createChapters(bookId: string, rawText: string, status: BookStatus) {
  const text = normalizeText(rawText);
  const lines = text.split("\n");
  const chapters: Array<{ title: string; body: string[] }> = [];
  let currentTitle = "正文";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (isChapterHeading(line)) {
      if (currentLines.join("").trim()) {
        chapters.push({ title: currentTitle, body: currentLines });
      }
      currentTitle = chapterTitleFromLine(line);
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }

  if (currentLines.join("").trim()) {
    chapters.push({ title: currentTitle, body: currentLines });
  }

  if (chapters.length === 0) {
    chapters.push({ title: "正文", body: lines });
  }

  return chapters.map((chapter, index) => {
    const paragraphs = paragraphsFromText(chapter.body.join("\n"));
    const excerpt = paragraphs[0] ?? "暂无摘要";
    const wordCount = wordCountFromParagraphs(paragraphs);

    return {
      id: `${bookId}-chapter-${index + 1}`,
      bookId,
      slug: `chapter-${index + 1}`,
      title: chapter.title,
      order: index + 1,
      excerpt,
      content: paragraphs,
      readingMinutes: readingMinutesFromWordCount(wordCount),
      status: status === "published" ? "published" : "draft"
    } satisfies Chapter;
  });
}

function sourceTextFromBook(book: Book) {
  if (book.sourceText?.trim()) {
    return normalizeText(book.sourceText);
  }

  return normalizeText(
    book.chapters
      .map((chapter) => (chapter.title === "正文" ? chapter.content.join("\n\n") : [chapter.title, ...chapter.content].join("\n\n")))
      .join("\n\n")
  );
}

function shelfLabelFromStatus(status: BookStatus) {
  if (status === "published") return "新书上架";
  if (status === "unlisted") return "暂不公开";
  return "草稿待整理";
}

function coverToneFromSeed(seed: string) {
  const value = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return COVER_TONES[value % COVER_TONES.length];
}

function ensureStoreDir() {
  const dirPath = path.dirname(STORE_PATH);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function readStore() {
  if (!existsSync(STORE_PATH)) {
    return structuredClone(defaultBooks);
  }

  return JSON.parse(readFileSync(STORE_PATH, "utf-8")) as Book[];
}

function writeStore(books: Book[]) {
  ensureStoreDir();
  writeFileSync(STORE_PATH, JSON.stringify(books, null, 2), "utf-8");
}

export function getBooks() {
  return readStore();
}

export function getFeaturedBooks() {
  return getBooks().filter((book) => book.featured && book.status === "published");
}

export function getPublicShelfBooks() {
  return getBooks().filter((book) => book.status === "published");
}

export function getBookById(idOrSlug: string) {
  const lookupValue = normalizeLookupValue(idOrSlug);
  return getBooks().find((book) => book.id === lookupValue || book.slug === lookupValue);
}

export function getPublicBookById(idOrSlug: string) {
  const lookupValue = normalizeLookupValue(idOrSlug);
  return getPublicShelfBooks().find((book) => book.id === lookupValue || book.slug === lookupValue);
}

export function searchBooks(query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return getPublicShelfBooks();
  }

  return getPublicShelfBooks().filter((book) => {
    const fields = [book.title, book.author, book.summary, ...book.tags];
    return fields.some((field) => field.toLowerCase().includes(keyword));
  });
}

export function getChapter(bookId: string, chapterIdOrSlug: string) {
  const book = getBookById(bookId);
  return book?.chapters.find(
    (chapter) => chapter.id === chapterIdOrSlug || chapter.slug === chapterIdOrSlug
  );
}

export function createBook(input: CreateBookInput) {
  const currentBooks = getBooks();
  const id = `book-${Date.now().toString(36)}`;
  const slug = safeSlug(input.title, id);
  const chapters = createChapters(id, input.rawText, input.status);
  const wordCount = chapters.reduce((sum, chapter) => sum + wordCountFromParagraphs(chapter.content), 0);
  const readingMinutes = chapters.reduce((sum, chapter) => sum + chapter.readingMinutes, 0);

  const book: Book = {
    id,
    slug,
    title: input.title.trim(),
    author: input.author.trim(),
    summary: input.summary.trim(),
    coverTone: coverToneFromSeed(input.title),
    status: input.status,
    categories: input.categories.length ? input.categories : ["未分类"],
    tags: input.tags,
    wordCount,
    readingMinutes,
    shelfLabel: shelfLabelFromStatus(input.status),
    featured: false,
    completion: 0,
    chapters,
    sourceText: normalizeText(input.rawText)
  };

  currentBooks.unshift(book);
  writeStore(currentBooks);
  return book;
}

export function updateBook(input: UpdateBookInput) {
  const currentBooks = getBooks();
  const index = currentBooks.findIndex((book) => book.id === input.id || book.slug === input.id);

  if (index < 0) {
    return null;
  }

  const current = currentBooks[index];
  const next: Book = {
    ...current,
    title: input.title.trim(),
    author: input.author.trim(),
    summary: input.summary.trim(),
    status: input.status,
    categories: input.categories.length ? input.categories : ["未分类"],
    tags: input.tags,
    featured: input.featured,
    shelfLabel: shelfLabelFromStatus(input.status)
  };

  currentBooks[index] = next;
  writeStore(currentBooks);
  return next;
}

export function setBookStatus(id: string, status: BookStatus) {
  const book = getBookById(id);
  if (!book) {
    return null;
  }

  return updateBook({
    id: book.id,
    title: book.title,
    author: book.author,
    summary: book.summary,
    categories: book.categories,
    tags: book.tags,
    status,
    featured: status === "published" ? book.featured : false
  });
}

export function reparseBook(id: string) {
  const lookupValue = normalizeLookupValue(id);
  const currentBooks = getBooks();
  const index = currentBooks.findIndex((book) => book.id === lookupValue || book.slug === lookupValue);

  if (index < 0) {
    return null;
  }

  const current = currentBooks[index];
  const sourceText = sourceTextFromBook(current);
  const chapters = createChapters(current.id, sourceText, current.status);
  const wordCount = chapters.reduce((sum, chapter) => sum + wordCountFromParagraphs(chapter.content), 0);
  const readingMinutes = chapters.reduce((sum, chapter) => sum + chapter.readingMinutes, 0);

  const next: Book = {
    ...current,
    sourceText,
    chapters,
    wordCount,
    readingMinutes
  };

  currentBooks[index] = next;
  writeStore(currentBooks);
  return next;
}

export function deleteBook(id: string) {
  const lookupValue = normalizeLookupValue(id);
  const currentBooks = getBooks();
  const nextBooks = currentBooks.filter((book) => book.id !== lookupValue && book.slug !== lookupValue);
  if (nextBooks.length === currentBooks.length) {
    return false;
  }
  writeStore(nextBooks);
  return true;
}

export function getAnalyticsSnapshot() {
  const books = getBooks();
  const publishedBooks = books.filter((book) => book.status === "published");
  const totalWords = publishedBooks.reduce((sum, book) => sum + book.wordCount, 0);
  const totalChapters = publishedBooks.reduce((sum, book) => sum + book.chapters.length, 0);

  return {
    pageViews: totalWords * 2,
    readingSessions: totalChapters * 96,
    avgReadingMinutes: publishedBooks.length ? Math.round(publishedBooks.reduce((sum, book) => sum + book.readingMinutes, 0) / publishedBooks.length) : 0,
    completionRate: publishedBooks.length ? Math.round(publishedBooks.reduce((sum, book) => sum + book.completion, 0) / publishedBooks.length) : 0,
    trendingBooks: books.slice(0, 3).map((book, index) => ({
      label: book.title,
      value: Math.max(480, book.wordCount - index * 3200)
    })),
    trendingChapters: books
      .flatMap((book) => book.chapters.map((chapter) => ({ label: chapter.title, value: chapter.readingMinutes * 90 })))
      .slice(0, 3)
  };
}

export function parseCommaSeparated(value: string) {
  return splitList(value);
}
