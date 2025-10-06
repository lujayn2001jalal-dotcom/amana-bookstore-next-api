import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");
const reviewsPath = path.join(process.cwd(), "app", "data", "reviews.json");

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Read books
  const rawBooks = JSON.parse(fs.readFileSync(booksPath, "utf-8"));
  const books = Array.isArray(rawBooks) ? rawBooks : rawBooks.books;

  const book = books.find((b: any) => Number(b.id) === Number(params.id));
  if (!book) {
    return NextResponse.json(
      { success: false, message: "Book not found" },
      { status: 404 }
    );
  }

  // Read reviews
  const rawReviews = JSON.parse(fs.readFileSync(reviewsPath, "utf-8"));
  const reviews = Array.isArray(rawReviews) ? rawReviews : rawReviews.reviews;

  const bookReviews = reviews.filter((r: any) => Number(r.bookId) === Number(params.id));

  return NextResponse.json({ success: true, data: bookReviews });
}
