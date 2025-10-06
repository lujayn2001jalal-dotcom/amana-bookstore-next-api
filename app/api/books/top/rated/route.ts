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

// ✅ GET top 10 rated books (rating * reviewCount)
export async function GET(req: NextRequest) {
  try {
    const data = readData(booksPath);
    const books: { rating?: number; reviewCount?: number; [key: string]: any }[] = Array.isArray(data)
      ? data
      : data.books;

    // Sort by rating * reviewCount
    const sorted = [...books].sort((a, b) => {
      const scoreA = (a.rating || 0) * (a.reviewCount || 0);
      const scoreB = (b.rating || 0) * (b.reviewCount || 0);
      return scoreB - scoreA;
    });

    return NextResponse.json({ success: true, data: sorted.slice(0, 10) });
  } catch (error) {
    console.error("Error fetching top rated books:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
