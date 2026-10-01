import type { CSSProperties } from "react";
import type { Palette, Template } from "@/lib/types";
import { FOIL_STOPS, foilUrl } from "./ornaments";

/** Deeper, more saturated foil for light stock (hand-tuned, not just darkened). */
const LIGHT_FOIL: Record<Palette["foil"], string[]> = {
  gold: ["#6e4a0a", "#a67a1c", "#dcb24a", "#8c6414", "#f0d27a", "#7a560f", "#bf912e"],
  rosegold: ["#7a3a33", "#ad6258", "#e3a191", "#95524a", "#f1bfb1", "#80443d", "#c7867a"],
  silver: ["#43464d", "#7f848d", "#c9ccd3", "#61656e", "#e4e6ea", "#4d5159", "#9ba0a8"],
  copper: ["#5f2a0e", "#a55a28", "#df9660", "#86441b", "#f0b688", "#6d3314", "#bd7440"],
};

/**
 * Stops for foil *text*. On light stock real foil reads through its darker,
 * mirror-like areas, so the gradient is deepened there to keep type legible.
 */
export function foilStops(p: Palette) {
  const s = FOIL_STOPS[p.foil];
  return isDark(p.paper) ? s : LIGHT_FOIL[p.foil];
}

export function foilCss(p: Palette) {
  const s = foilStops(p);
  return `linear-gradient(110deg, ${s[0]} 0%, ${s[1]} 14%, ${s[2]} 24%, ${s[3]} 36%, ${s[1]} 46%, ${s[4]} 52%, ${s[5]} 62%, ${s[6]} 76%, ${s[2]} 86%, ${s[3]} 100%)`;
}

/** Is the paper dark (light ink on dark stock)? Used to tune shadows and contrast. */
export function isDark(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
}

export function themeVars(t: Template, p: Palette): CSSProperties {
  return {
    ["--paper" as string]: p.paper,
    ["--paper2" as string]: p.paper2,
    ["--ink" as string]: p.ink,
    ["--ink-soft" as string]: p.inkSoft,
    ["--accent" as string]: p.accent,
    ["--accent2" as string]: p.accent2,
    ["--surface" as string]: p.surface,
    ["--surface2" as string]: p.surface2,
    ["--envelope" as string]: p.envelope,
    ["--envelope2" as string]: p.envelope2,
    ["--wax" as string]: p.wax,
    ["--fd" as string]: t.fonts.display,
    ["--fs" as string]: t.fonts.script,
    ["--fb" as string]: t.fonts.body,
    ["--foil-grad" as string]: foilCss(p),
    ["--foil-solid" as string]: foilStops(p)[1],
    ["--foil-deep" as string]: FOIL_STOPS[p.foil][0],
  };
}

export const foilFill = (p: Palette) => foilUrl(p.foil);
