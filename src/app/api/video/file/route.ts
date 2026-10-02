import { promises as fs } from "fs";
import path from "path";
import { RENDERS } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!/^[A-Za-z0-9_-]{4,120}$/.test(key)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(RENDERS, `${key}.mp4`));
    return new Response(new Uint8Array(buf), { headers: { "content-type": "video/mp4", "content-disposition": `attachment; filename="invitation.mp4"` } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
