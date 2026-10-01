import { promises as fs } from "fs";
import path from "path";
import { UPLOADS } from "@/lib/store";

const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", mp3: "audio/mpeg", m4a: "audio/mp4", wav: "audio/wav", ogg: "audio/ogg" };

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[A-Za-z0-9_-]+\.(jpg|png|webp|mp3|m4a|wav|ogg)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(UPLOADS, name));
    return new Response(new Uint8Array(buf), { headers: { "content-type": MIME[name.split(".").pop()!], "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
