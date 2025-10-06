import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

// Helper to read JSON
function readData(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ✅ GET books that are featured
export async function GET() {
  const data = readData(booksPath);
  const books = Array.isArray(data) ? data : data.books;

  const featuredBooks = books.filter((b: { featured: boolean }) => b.featured === true);

  return NextResponse.json({ success: true, data: featuredBooks });
}
