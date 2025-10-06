import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // ✅ Read JSON file
    const rawData = fs.readFileSync(booksPath, "utf-8");
    const data = JSON.parse(rawData);
    const books = Array.isArray(data) ? data : data.books;

    // ✅ Find the book (using Number comparison for safety)
    const book = books.find(
      (b: { id: string | number }) => Number(b.id) === Number(context.params.id)
    );

    // ✅ Handle not found
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    // ✅ Return found book
    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error("Error reading books:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
