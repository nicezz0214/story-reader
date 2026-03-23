"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBook,
  decodeUploadBuffer,
  deleteBook,
  parseCommaSeparated,
  reparseBook,
  setBookStatus,
  updateBook,
  type BookStatus
} from "@/lib/mock-data";

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizeStatus(value: string): BookStatus {
  if (value === "published" || value === "unlisted") {
    return value;
  }
  return "draft";
}

function encodeSegment(value: string) {
  return encodeURIComponent(value);
}

function refreshBookPages(bookIdOrSlug?: string) {
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/shelf");
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/admin/analytics");

  if (bookIdOrSlug) {
    const encoded = encodeSegment(bookIdOrSlug);
    revalidatePath(`/book/${encoded}`);
    revalidatePath(`/admin/books/${encoded}`);
    revalidatePath(`/admin/books/${encoded}/chapters`);
  }
}

export async function createBookAction(formData: FormData) {
  const title = normalizeText(formData.get("title"));
  const author = normalizeText(formData.get("author"));
  const summary = normalizeText(formData.get("summary"));
  const categories = parseCommaSeparated(normalizeText(formData.get("categories")));
  const tags = parseCommaSeparated(normalizeText(formData.get("tags")));
  const status = normalizeStatus(normalizeText(formData.get("status")));
  const file = formData.get("file");

  if (!title || !author || !summary) {
    redirect("/admin/books/new?error=missing_fields");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/books/new?error=missing_file");
  }

  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".txt") && !fileName.endsWith(".md") && !fileName.endsWith(".markdown")) {
    redirect("/admin/books/new?error=invalid_format");
  }

  const rawText = decodeUploadBuffer(await file.arrayBuffer());
  if (!rawText.trim()) {
    redirect("/admin/books/new?error=empty_content");
  }

  const book = createBook({
    title,
    author,
    summary,
    categories,
    tags,
    status,
    rawText
  });

  refreshBookPages(book.slug);
  redirect(`/admin/books/${encodeSegment(book.slug)}?result=created`);
}

export async function updateBookAction(formData: FormData) {
  const id = normalizeText(formData.get("id"));
  const title = normalizeText(formData.get("title"));
  const author = normalizeText(formData.get("author"));
  const summary = normalizeText(formData.get("summary"));
  const categories = parseCommaSeparated(normalizeText(formData.get("categories")));
  const tags = parseCommaSeparated(normalizeText(formData.get("tags")));
  const status = normalizeStatus(normalizeText(formData.get("status")));
  const featured = normalizeText(formData.get("featured")) === "on";

  const book = updateBook({
    id,
    title,
    author,
    summary,
    categories,
    tags,
    status,
    featured
  });

  if (!book) {
    redirect("/admin/books?error=book_not_found");
  }

  refreshBookPages(book.slug);
  redirect(`/admin/books/${encodeSegment(book.slug)}?result=updated`);
}

export async function publishBookAction(formData: FormData) {
  const id = normalizeText(formData.get("id"));
  const book = setBookStatus(id, "published");

  if (!book) {
    redirect("/admin/books?error=book_not_found");
  }

  refreshBookPages(book.slug);
  redirect("/admin/books?result=published");
}

export async function unlistBookAction(formData: FormData) {
  const id = normalizeText(formData.get("id"));
  const book = setBookStatus(id, "unlisted");

  if (!book) {
    redirect("/admin/books?error=book_not_found");
  }

  refreshBookPages(book.slug);
  redirect("/admin/books?result=unlisted");
}

export async function draftBookAction(formData: FormData) {
  const id = normalizeText(formData.get("id"));
  const book = setBookStatus(id, "draft");

  if (!book) {
    redirect("/admin/books?error=book_not_found");
  }

  refreshBookPages(book.slug);
  redirect("/admin/books?result=draft");
}

export async function deleteBookAction(formData: FormData) {
  const id = normalizeText(formData.get("id"));
  const deleted = deleteBook(id);

  if (!deleted) {
    redirect("/admin/books?error=book_not_found");
  }

  refreshBookPages();
  redirect("/admin/books?result=deleted");
}

export async function reparseBookAction(formData: FormData) {
  const id = normalizeText(formData.get("id"));
  const redirectTo = normalizeText(formData.get("redirectTo"));
  const book = reparseBook(id);

  if (!book) {
    redirect("/admin/books?error=book_not_found");
  }

  refreshBookPages(book.slug);

  const encoded = encodeSegment(book.slug);
  if (redirectTo === "chapters") {
    redirect(`/admin/books/${encoded}/chapters?result=reparsed`);
  }

  redirect(`/admin/books/${encoded}?result=reparsed`);
}
