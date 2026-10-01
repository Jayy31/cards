import { rng } from "@/lib/format";
import type { PetalKind } from "@/lib/types";

/**
 * Falling-petal particles as a pure function of time: `draw(t)` renders the
 * exact same frame for the same t, which keeps video exports deterministic.
 */

interface Petal {
  x0: number;
  start: number;
  speed: number;
  sway: number;
  swayF: number;
  phase: number;
  spin: number;
  tumble: number;
  size: number;
  hue: number;
}

const PALETTES: Record<PetalKind, string[][]> = {
  rose: [
    ["#b3122e", "#e0405a"],
    ["#c21d3a", "#f06a80"],
    ["#9e0f28", "#d63350"],
    ["#e87a90", "#f8b7c4"],
  ],
  marigold: [
    ["#e65c00", "#ff9f1c"],
    ["#f28c0f", "#ffc94a"],
    ["#d94f00", "#ff8a00"],
  ],
  gold: [
    ["#8a6a1f", "#f5dd8f"],
    ["#b8892b", "#fff1bd"],
    ["#a07b2c", "#e8c86a"],
  ],
  jasmine: [
    ["#e9e4d8", "#ffffff"],
    ["#f0ead9", "#fffdf6"],
  ],
};

export function makePetals(count: number, seed = 7): Petal[] {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => ({
    x0: r(),
    // first ~40% arrive as a burst, the rest trickle in
    start: i < count * 0.4 ? r() * 0.8 : 0.8 + r() * 7,
    speed: 0.1 + r() * 0.1,
    sway: 0.02 + r() * 0.05,
    swayF: 0.6 + r() * 1.2,
    phase: r() * Math.PI * 2,
    spin: (r() - 0.5) * 3,
    tumble: 1 + r() * 2.5,
    size: 0.7 + r() * 0.7,
    hue: Math.floor(r() * 4),
  }));
}

function drawPetal(ctx: CanvasRenderingContext2D, kind: PetalKind, s: number, cols: string[], flip: number) {
  if (kind === "gold") {
    // foil confetti: brightness follows the tumble for a glinting look
    ctx.fillStyle = flip > 0 ? cols[1] : cols[0];
    ctx.fillRect(-s * 0.35, -s * 0.6, s * 0.7, s * 1.2);
    return;
  }
  const g = ctx.createLinearGradient(0, -s, 0, s);
  g.addColorStop(0, cols[1]);
  g.addColorStop(1, cols[0]);
  ctx.fillStyle = g;
  ctx.beginPath();
  if (kind === "marigold") {
    // ruffled edge
    ctx.moveTo(0, s * 0.9);
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI + (k / 6) * Math.PI;
      const rr = s * (k % 2 ? 0.8 : 0.95);
      ctx.lineTo(Math.cos(a) * rr * 0.7, Math.sin(a) * rr + s * 0.1);
    }
    ctx.closePath();
  } else {
    // rose / jasmine petal: rounded heart-ish teardrop
    ctx.moveTo(0, s);
    ctx.bezierCurveTo(-s * 0.95, s * 0.3, -s * 0.75, -s * 0.9, 0, -s * 0.7);
    ctx.bezierCurveTo(s * 0.75, -s * 0.9, s * 0.95, s * 0.3, 0, s);
  }
  ctx.fill();
  // soft vein highlight
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = s * 0.06;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.8);
  ctx.quadraticCurveTo(s * 0.1, 0, 0, -s * 0.4);
  ctx.stroke();
}

export function drawPetals(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, petals: Petal[], kind: PetalKind, unit: number) {
  ctx.clearRect(0, 0, w, h);
  if (t <= 0) return;
  const cols = PALETTES[kind];
  const base = unit * (kind === "gold" ? 9 : 14);
  for (const p of petals) {
    const age = t - p.start;
    if (age < 0) continue;
    const travel = (h + base * 4) / (p.speed * h);
    const a = age % travel;
    const y = -base * 2 + a * p.speed * h;
    const x = (p.x0 + Math.sin(a * p.swayF + p.phase) * p.sway) * w;
    const flip = Math.cos(a * p.tumble + p.phase);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.phase + a * p.spin);
    ctx.scale(Math.max(0.15, Math.abs(flip)), 1);
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = unit * 3;
    ctx.shadowOffsetY = unit * 2;
    drawPetal(ctx, kind, base * p.size, cols[p.hue % cols.length], flip);
    ctx.restore();
  }
}
