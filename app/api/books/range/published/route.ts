import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to your JSON file
const booksPath = path.join(process.cwd(), "app", "data", "books.json");

// Helper function to safely read data
function readData(filePath: string) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

export async function GET(req: Request) {
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
  const books = Array.isArray(rawData) ? rawData : rawData.books;

  const startDate = new Date(start);
  const endDate = new Date(end);

  // ✅ TypeScript fix: explicitly type `b`
  const filtered = books.filter((b: { datePublished: string }) => {
    const pubDate = new Date(b.datePublished);
    return pubDate >= startDate && pubDate <= endDate;
  });

  return NextResponse.json({ success: true, data: filtered });
}
