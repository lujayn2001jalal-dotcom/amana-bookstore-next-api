import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");
const reviewsPath = path.join(process.cwd(), "app", "data", "reviews.json");

// ✅ GET reviews for a specific book
export async function GET(req: NextRequest) {
  try {
    // Extract book ID from URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // gets [id] from /api/books/[id]/reviews

    if (!id) {
      return NextResponse.json({ success: false, message: "Book ID is required" }, { status: 400 });
    }

    // Read books
    const rawBooks = fs.readFileSync(booksPath, "utf-8");
    const dataBooks = JSON.parse(rawBooks);
    const books: { id: string; [key: string]: any }[] = Array.isArray(dataBooks)
      ? dataBooks
      : dataBooks.books;

    const book = books.find((b) => Number(b.id) === Number(id));
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }

    // Read reviews
    const rawReviews = fs.readFileSync(reviewsPath, "utf-8");
    const dataReviews = JSON.parse(rawReviews);
    const reviews: { bookId: string | number; [key: string]: any }[] = Array.isArray(dataReviews)
      ? dataReviews
      : dataReviews.reviews;

    const bookReviews = reviews.filter((r) => Number(r.bookId) === Number(id));

    return NextResponse.json({ success: true, data: bookReviews });
  } catch (error) {
    console.error("Error reading reviews:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
