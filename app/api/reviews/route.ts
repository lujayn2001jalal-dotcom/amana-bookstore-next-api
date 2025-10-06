import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const reviewsPath = path.join(process.cwd(), "app", "data", "reviews.json");

// Helper to read JSON
function readData(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Helper to write JSON
function writeData(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ GET all reviews
export async function GET() {
  const data = readData(reviewsPath);
  const reviews = Array.isArray(data) ? data : data.reviews;
  return NextResponse.json({ success: true, data: reviews });
}

// ✅ POST new review
export async function POST(req: Request) {
  const body = await req.json();
  const { bookId, author, title, comment, rating, verified } = body;

  if (!bookId || !author || !title || !comment || !rating) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  const reviewsData = readData(reviewsPath);
  const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews;

  const newReview = {
    id: `review-${reviews.length + 1}`,
    bookId,
    author,
    title,
    comment,
    rating,
    verified: verified || false,
    timestamp: new Date().toISOString(),
  };

  reviews.push(newReview);
  writeData(reviewsPath, { reviews }); // save back in same structure

  return NextResponse.json({ success: true, data: newReview }, { status: 201 });
}
