import "server-only";
import { isSafeId } from "./store";
import { getTemplate } from "./templates";

/** Builds the internal URL headless Chrome loads for a card or a template sample. Returns null for unknown ids. */
export function internalUrl(origin: string, route: "print" | "render", q: { card?: string | null; template?: string | null; palette?: string | null; to?: string | null }) {
  const params = new URLSearchParams();
  if (q.to) params.set("to", q.to.slice(0, 80));
  if (q.card) {
    if (!isSafeId(q.card)) return null;
    if (route === "print") return `${origin}/print?card=${q.card}&${params}`;
    params.set("render", "1");
    return `${origin}/i/${q.card}?${params}`;
  }
  const t = q.template ? getTemplate(q.template) : undefined;
  if (!t) return null;
  if (q.palette && t.palettes.some((p) => p.id === q.palette)) params.set("palette", q.palette);
  if (route === "print") return `${origin}/print?template=${t.id}&${params}`;
  params.set("render", "1");
  return `${origin}/preview/${t.id}?${params}`;
}
