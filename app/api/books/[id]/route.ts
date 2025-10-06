import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

// ✅ GET single book by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Read JSON file
    const rawData = fs.readFileSync(booksPath, "utf-8");
    const data = JSON.parse(rawData);
    const books: {
      id: string;
      title: string;
      author: string;
      [key: string]: any;
    }[] = Array.isArray(data) ? data : data.books;

    // Find the book
    const book = books.find((b) => Number(b.id) === Number(params.id));

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error("Error reading books:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}