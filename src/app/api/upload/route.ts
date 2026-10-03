import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/store";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
};

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  // Blob, not File: Node 18 has no global File (the check threw and every upload 500ed)
  if (!(file instanceof Blob)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  if (file.size > 12 * 1024 * 1024) return NextResponse.json({ error: "File is larger than 12 MB" }, { status: 413 });
  const name = await saveUpload(Buffer.from(await file.arrayBuffer()), ext);
  return NextResponse.json({ url: `/api/uploads/${name}` });
}
