import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

export async function GET(req: NextRequest) {
  try {
    // Extract ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // gets the [id] from /api/books/[id]

    if (!id) {
      return NextResponse.json({ success: false, message: "Book ID is required" }, { status: 400 });
    }

    // Read books
    const rawData = fs.readFileSync(booksPath, "utf-8");
    const data = JSON.parse(rawData);
    const books: { id: string; title: string; author: string; [key: string]: any }[] = Array.isArray(data)
      ? data
      : data.books;

    // Find book
    const book = books.find((b) => Number(b.id) === Number(id));

    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error("Error reading books:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
