import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

export async function GET() {
  const data = JSON.parse(fs.readFileSync(booksPath, "utf-8"));
  const books = Array.isArray(data) ? data : data.books;

  // sort by rating * reviewCount
  const sorted = [...books].sort((a, b) => {
    const scoreA = (a.rating || 0) * (a.reviewCount || 0);
    const scoreB = (b.rating || 0) * (b.reviewCount || 0);
    return scoreB - scoreA;
  });

  return NextResponse.json({ success: true, data: sorted.slice(0, 10) });
}
