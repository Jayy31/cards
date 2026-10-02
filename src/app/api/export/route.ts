import { resolveCard } from "@/lib/resolve";
import { exportPdf, exportPng } from "@/lib/render";
import { internalUrl } from "@/lib/exportUrl";
import { bizSize } from "@/lib/bizShape";

export const runtime = "nodejs";
export const maxDuration = 120;

/** GET /api/export?card=ID|template=ID&format=png|pdf&page=N|all[&to=Guest] */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const q = { card: u.searchParams.get("card"), template: u.searchParams.get("template"), palette: u.searchParams.get("palette"), to: u.searchParams.get("to") };
  const r = await resolveCard({ card: q.card ?? undefined, template: q.card ? undefined : q.template ?? undefined, palette: q.palette ?? undefined });
  const url = internalUrl(u.origin, "print", q);
  if (!r || !url) return new Response("Not found", { status: 404 });
  const name = (r.data.kind === "invite" ? r.data.primary.name : r.data.name).replace(/[^\w]+/g, "-");
  try {
    if (u.searchParams.get("format") === "pdf") {
      const pdf = await exportPdf(url, r.data.kind === "business" ? bizSize(r.template) : { w: 500, h: 700 });
      return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="${name}.pdf"` } });
    }
    const all = u.searchParams.get("page") === "all";
    const page = all ? -1 : Number(u.searchParams.get("page") ?? 0) || 0;
    const og = u.searchParams.get("og") === "1";
    const png = await exportPng(url, page, og ? 1.5 : 2.5);
    return new Response(new Uint8Array(png), {
      headers: {
        "content-type": "image/png",
        "cache-control": og ? "public, max-age=3600" : "no-store",
        ...(og ? {} : { "content-disposition": `attachment; filename="${name}-${all ? "card" : r.data.kind === "business" ? (page ? "back" : "front") : `page-${page + 1}`}.png"` }),
      },
    });
  } catch (e) {
    return new Response(`Export failed: ${e instanceof Error ? e.message : e}`, { status: 500 });
  }
}
