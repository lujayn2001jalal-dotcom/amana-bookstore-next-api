import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

// Helper: Read JSON file fresh each time
function readData(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : parsed.books;
}

// Helper: Write JSON file (keep structure { books: [...] })
function writeData(filePath: string, books: any[]) {
  fs.writeFileSync(filePath, JSON.stringify({ books }, null, 2), "utf-8");
}

// ✅ GET all books
export async function GET() {
  const books = readData(booksPath);
  return NextResponse.json({ success: true, data: books });
}

// ✅ POST new book
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      author,
      description,
      price,
      image,
      isbn,
      genre,
      tags,
      datePublished,
      pages,
      language,
      publisher,
      rating,
      reviewCount,
      inStock,
      featured,
    } = body;

    if (!title || !author) {
      return NextResponse.json(
        { success: false, message: "Title and author are required" },
        { status: 400 }
      );
    }

    const books = readData(booksPath);

    const newBook = {
      id: books.length ? String(parseInt(books[books.length - 1].id) + 1) : "1",
      title,
      author,
      description: description || "",
      price: price || 0,
      image: image || "",
      isbn: isbn || "",
      genre: genre || [],
      tags: tags || [],
      datePublished: datePublished || null,
      pages: pages || 0,
      language: language || "Unknown",
      publisher: publisher || "Unknown",
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      inStock: inStock !== undefined ? inStock : true,
      featured: featured || false,
    };

    books.push(newBook);
    writeData(booksPath, books);

    return NextResponse.json({ success: true, data: newBook }, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
