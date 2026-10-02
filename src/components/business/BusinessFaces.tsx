"use client";
import type { BizSpec, BusinessData, Palette, Template } from "@/lib/types";
import { isDark, themeVars } from "@/components/card/theme";
import { DESIGNS } from "./designs";
import { bizShape, BIZ_SIZES } from "@/lib/bizShape";

export { mecard, vcard } from "./parts";

export const DEFAULT_BIZ: BizSpec = { design: "noir", enter: "drop", flip: "classic", thick: 4, radius: 10, edge: "foil" };

export function bizSpec(t: Template): BizSpec {
  return t.biz ?? DEFAULT_BIZ;
}

/** The palette with the user's brand colour (if any) as its accent. */
export function withBrand(p: Palette, d: BusinessData): Palette {
  return d.brand ? { ...p, accent: d.brand, envelope2: d.brand, wax: d.brand } : p;
}

/** One side of a business card on its canvas (landscape 700 × 400 ≈ 3.5" × 2", portrait or square). */
export function BusinessFace({ side, d, t, p: base }: { side: "front" | "back"; d: BusinessData; t: Template; p: Palette }) {
  const spec = bizSpec(t);
  const p = withBrand(base, d);
  const shape = bizShape(t);
  const { w, h } = BIZ_SIZES[shape];
  const design = DESIGNS[spec.design] ?? DESIGNS.noir;
  const Face = side === "front" ? design.Front : design.Back;
  const legacy = spec.design === "noir" ? "biz-noir" : spec.design === "letterpress" ? "biz-letterpress" : "";
  return (
    <div
      className={`card-page biz-face bz-${spec.design} bz-${side} shape-${shape} paper-${t.paper} ${isDark(p.paper) ? "is-dark" : "is-light"} ${legacy} ${d.logo ? "has-logo" : ""} ${side === "front" && (d.front?.name || d.front?.contact || d.front?.qr) ? "has-fm" : ""}`}
      style={{ ...themeVars(t, p), width: w, height: h, ["--r" as string]: `${spec.radius}px` }}
    >
      <Face d={d} t={t} p={p} w={w} h={h} />
    </div>
  );
}
