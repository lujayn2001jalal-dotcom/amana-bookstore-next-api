import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const reviewsPath = path.join(process.cwd(), "app", "data", "reviews.json");

// Helper to read JSON
function readData(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// Helper to write JSON
function writeData(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

// ✅ GET all reviews
export async function GET(req: NextRequest) {
  try {
    const rawData = readData(reviewsPath);
    const reviews: { [key: string]: any }[] = Array.isArray(rawData) ? rawData : rawData.reviews;

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, author, title, comment, rating, verified } = body;

    if (!bookId || !author || !title || !comment || !rating) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const rawData = readData(reviewsPath);
    const reviews: { [key: string]: any }[] = Array.isArray(rawData) ? rawData : rawData.reviews;

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
    writeData(reviewsPath, { reviews }); // maintain the same structure

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}