import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const booksPath = path.join(process.cwd(), "app", "data", "books.json");

// Helper function to safely read JSON
function readData(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// ✅ GET books published within a date range
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { success: false, message: "Start and end dates are required" },
        { status: 400 }
      );
    }

    const rawData = readData(booksPath);
    const books: { datePublished: string; [key: string]: any }[] = Array.isArray(rawData)
      ? rawData
      : rawData.books;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const filtered = books.filter((b) => {
      const pubDate = new Date(b.datePublished);
      return pubDate >= startDate && pubDate <= endDate;
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Error fetching books by date:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
