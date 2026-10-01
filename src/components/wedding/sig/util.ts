/** Mix two #rrggbb colours (t = 0 → a, 1 → b). Deterministic, so safe for server markup. */
export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
  const [r1, g1, b1] = ch(pa);
  const [r2, g2, b2] = ch(pb);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `#${((1 << 24) | (c(r1, r2) << 16) | (c(g1, g2) << 8) | c(b1, b2)).toString(16).slice(1)}`;
}

export const R1 = (v: number) => Math.round(v * 10) / 10;
