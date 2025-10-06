import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

// Helper to safely read JSON
function readData(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// ✅ GET books that are featured
export async function GET(req: NextRequest) {
  try {
    const rawData = readData(booksPath);
    const books: { featured: boolean; [key: string]: any }[] = Array.isArray(rawData)
      ? rawData
      : rawData.books;

    const featuredBooks = books.filter((b) => b.featured === true);

    return NextResponse.json({ success: true, data: featuredBooks });
  } catch (error) {
    console.error("Error fetching featured books:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
