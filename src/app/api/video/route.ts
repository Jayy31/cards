import { NextResponse } from "next/server";
import { resolveCard } from "@/lib/resolve";
import { getJob, startVideo } from "@/lib/render";
import { internalUrl } from "@/lib/exportUrl";
import { getCard } from "@/lib/store";

export const runtime = "nodejs";

async function jobKey(q: { card?: string | null; template?: string | null; palette?: string | null; to?: string | null; hd?: boolean }) {
  const guest = (q.to ? `-${Buffer.from(q.to).toString("base64url").slice(0, 24)}` : "") + (q.hd ? "-hd" : "");
  if (q.card) {
    const c = await getCard(q.card);
    return c ? `${c.id}-${Date.parse(c.updatedAt).toString(36)}${guest}` : null;
  }
  return q.template ? `sample-${q.template}-${q.palette ?? "default"}${guest}` : null;
}

function query(req: Request) {
  const u = new URL(req.url);
  return { origin: u.origin, card: u.searchParams.get("card"), template: u.searchParams.get("template"), palette: u.searchParams.get("palette"), to: u.searchParams.get("to"), hd: u.searchParams.get("hd") === "1" };
}

/** POST starts (or reuses) a render job; GET polls it. */
export async function POST(req: Request) {
  const q = query(req);
  const r = await resolveCard({ card: q.card ?? undefined, template: q.card ? undefined : q.template ?? undefined, palette: q.palette ?? undefined });
  const url = internalUrl(q.origin, "render", q);
  const key = await jobKey(q);
  if (!r || !url || !key) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const job = startVideo(key, url, r.data, { hd: q.hd });
  return NextResponse.json({ key, status: job.status, progress: job.progress, error: job.error });
}

export async function GET(req: Request) {
  const q = query(req);
  const key = await jobKey(q);
  const job = key ? getJob(key) : undefined;
  if (!job) return NextResponse.json({ status: "none" });
  return NextResponse.json({ key, status: job.status, progress: job.progress, error: job.error });
}
