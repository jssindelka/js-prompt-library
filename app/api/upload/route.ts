import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  // Store at max 2000px wide, high quality — saves Cloudinary storage.
  // Further format optimisation (WebP/AVIF) is applied at delivery via URL.
  const result = await cloudinary.uploader.upload(base64, {
    folder: "prompt-library",
    transformation: [
      { width: 2000, crop: "limit" },
      { quality: "auto:best" },
    ],
  });

  return NextResponse.json({
    path: result.secure_url,        // original URL stored in DB
    originalUrl: result.secure_url, // same — used for download
  });
}
