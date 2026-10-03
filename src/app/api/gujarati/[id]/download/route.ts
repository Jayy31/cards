import { getOrder, printToken } from "@/lib/gujStore";
import { digitalPng, printPdf, printPng } from "@/lib/gujRender";
import { GUJ_TEMPLATES, gujPalette } from "@/lib/gujarati";

export const runtime = "nodejs";
export const maxDuration = 120;

/** GET /api/gujarati/:id/download?t=<design>&format=pdf|png|digital (paid orders only) */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = new URL(req.url);
  const t = GUJ_TEMPLATES.find((x) => x.id === u.searchParams.get("t"));
  const o = await getOrder(id);
  if (!o || !t || !o.cards[t.id]) return new Response("Not found", { status: 404 });
  if (!o.paid) return new Response("Unlock the designs to download", { status: 402 });

  const format = u.searchParams.get("format") ?? "pdf";
  const theme = gujPalette(t.id, u.searchParams.get("theme") ?? undefined);
  const url = `${u.origin}/gujarati/print?id=${id}&t=${t.id}&theme=${theme.id}&k=${printToken(id, t.id)}`;
  const base = `${o.cards[t.id].business} - ${t.name}`.replace(/[\\/:*?"<>|]+/g, " ").trim();
  const disp = (name: string) => `attachment; filename="${t.id}${name.slice(name.lastIndexOf("."))}"; filename*=UTF-8''${encodeURIComponent(name)}`;
  try {
    if (format === "pdf") {
      const pdf = await printPdf(url);
      return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": disp(`${base} (print).pdf`) } });
    }
    const png = format === "digital" ? await digitalPng(url) : await printPng(url);
    const name = format === "digital" ? `${base} (WhatsApp).png` : `${base} (600 dpi).png`;
    return new Response(new Uint8Array(png), { headers: { "content-type": "image/png", "content-disposition": disp(name) } });
  } catch (e) {
    return new Response(`Export failed: ${e instanceof Error ? e.message : e}`, { status: 500 });
  }
}
