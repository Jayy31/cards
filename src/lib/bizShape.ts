import type { BizShape, Template } from "./types";

/** Card canvas in card units. Landscape is the standard 3.5" × 2" (700 × 400). */
export const BIZ_SIZES: Record<BizShape, { w: number; h: number }> = {
  landscape: { w: 700, h: 400 },
  portrait: { w: 400, h: 700 },
  square: { w: 520, h: 520 },
};

export function bizShape(t: Template): BizShape {
  return t.biz?.shape ?? "landscape";
}

export function bizSize(t: Template) {
  return BIZ_SIZES[bizShape(t)];
}
