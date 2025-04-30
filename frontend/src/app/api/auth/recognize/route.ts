// src/app/api/recognize/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // or 'nodejs' if you need dependencies

export async function POST(req: Request) {
  const form = await req.formData();
  const photo = form.get("photo") as Blob;
  if (!(photo instanceof Blob)) {
    return NextResponse.json({ error: "No photo provided" }, { status: 400 });
  }

  // TODO: send `photo` to your vision service (Google Vision, AWS Rekognition, your own ML)
  // For now, stub:
  const fakeResult = {
    id: "13",
    name: "Catan: Settlers of Catan",
    thumbnail: "https://cf.geekdo-images.com/…/catan.jpg"
  };

  return NextResponse.json(fakeResult);
}
