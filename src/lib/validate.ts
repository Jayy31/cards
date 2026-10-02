import { getTemplate } from "./templates";
import type { CardData } from "./types";

/** Minimal shape check on user-submitted card data (the editor is the only writer). */
export function validateCard(body: unknown): { templateId: string; data: CardData } | string {
  if (!body || typeof body !== "object") return "Invalid body";
  const { templateId, data } = body as { templateId?: string; data?: CardData };
  const t = templateId ? getTemplate(templateId) : undefined;
  if (!t) return "Unknown template";
  if (!data || typeof data !== "object") return "Missing data";
  if (data.kind !== t.sample.kind) return "Data does not match template";
  if (JSON.stringify(data).length > 200_000) return "Card is too large";
  if (data.kind === "invite") {
    if (!data.primary?.name?.trim()) return "Please add a name";
    if (!Array.isArray(data.events)) return "Invalid events";
  } else if (!data.name?.trim()) return "Please add a name";
  return { templateId: t.id, data };
}
