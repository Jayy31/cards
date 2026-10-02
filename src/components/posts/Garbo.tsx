"use client";

import { useId } from "react";
import { POST_W, type PostBrand, type PostRatio, type PostText } from "@/lib/posts";
import { Brand, Fit, Offer, Squeeze, r2, seeded } from "./common";

/*
 * Navratri · "Garbo": red bandhani cloth (tie-dye dots, soft folds), a lit terracotta garbo pot whose
 * holes throw dots of light onto the cloth, and two lacquered dandiya sticks crossed behind it.
 * Structure: the business comes FIRST, on an embroidered mirror-work patch sewn on at the top; the
 * greeting (Gujarati + English) sits in the middle; the garbo rises from the bottom edge.
 * Recomposition: the pot grows with the shape; in the story it runs into the bottom (covered) zone.
 */

type Geo = { h: number; patchTop: number; patchH: number; textTop: number; textBottom: number; potBase: number; potS: number };
const GEO: Record<PostRatio, Geo> = {
  "1x1": { h: 1080, patchTop: 34, patchH: 262, textTop: 316, textBottom: 704, potBase: 1128, potS: 0.95 },
  "4x5": { h: 1350, patchTop: 40, patchH: 300, textTop: 372, textBottom: 870, potBase: 1392, potS: 1.15 },
  "9x16": { h: 1920, patchTop: 262, patchH: 320, textTop: 616, textBottom: 1150, potBase: 1890, potS: 1.5 },
};

/** Pot outline, origin at the bottom centre, y up is negative. Half-width at height y (for hole placement). */
const POT = "M-60 -372 C-70 -335 -192 -300 -186 -196 C-182 -96 -122 -22 -72 0 L72 0 C122 -22 182 -96 186 -196 C192 -300 70 -335 60 -372 Z";
function halfW(y: number) {
  // rough fit of the outline above
  const t = -y;
  if (t > 340) return 70;
  if (t > 196) return 70 + (186 - 70) * Math.sin(((340 - t) / 144) * (Math.PI / 2));
  return 72 + (186 - 72) * Math.sin((t / 196) * (Math.PI / 2));
}

type Hole = { x: number; y: number; r: number; shape: "o" | "v" | "d" };
function holes(): Hole[] {
  const out: Hole[] = [];
  const rows: [number, number, Hole["shape"], number][] = [
    [-318, 9, "o", 5.5],
    [-282, 13, "v", 7],
    [-240, 15, "o", 6.5],
    [-200, 16, "d", 8],
    [-160, 15, "o", 6.5],
    [-120, 13, "v", 7],
    [-82, 11, "o", 5.5],
    [-46, 9, "o", 4.5],
  ];
  for (const [y, n, shape, r] of rows) {
    const w = halfW(y) - 10;
    for (let i = 0; i < n; i++) {
      const th = -1.35 + (2.7 * (i + 0.5)) / n;
      const c = Math.cos(th);
      out.push({ x: r2(Math.sin(th) * w), y, r: r2(r * (0.35 + 0.65 * c)), shape });
    }
  }
  return out;
}
const HOLES = holes();

function Dandiya({ x1, y1, x2, y2, id, k }: { x1: number; y1: number; x2: number; y2: number; id: string; k: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const bands = Math.floor(len / 26);
  const cols = k ? ["#1f7a3e", "#f2b705", "#c0172b"] : ["#c0172b", "#f2b705", "#1d4fa0"];
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${r2(a)})`}>
      <rect x="4" y="-7" width={len} height="18" rx="9" fill="#000" opacity=".3" filter={`url(#${id}-soft)`} />
      <rect x="0" y="-9" width={len} height="18" rx="9" fill={cols[0]} />
      {Array.from({ length: bands }, (_, i) => (
        <path key={i} d={`M${i * 26 + 4} -9 l12 0 l-8 18 l-12 0 z`} fill={cols[1 + (i % 2)]} />
      ))}
      <rect x="0" y="-9" width={len} height="18" rx="9" fill={`url(#${id}-lac)`} />
      {/* ghungroo bells + tassel at both ends */}
      {[18, len - 18].map((bx) => (
        <g key={bx}>
          {[-1, 1].map((s) => (
            <circle key={s} cx={bx} cy={s * 15} r="7" fill={`url(#${id}-brass)`} />
          ))}
        </g>
      ))}
      <path d={`M${len} 0 l26 -6 l0 12 z`} fill="#e8b018" />
      {[-5, -1, 3, 7].map((dy) => (
        <path key={dy} d={`M${len + 22} ${dy * 0.6} q16 ${dy} 30 ${dy * 3}`} stroke="#d4243a" strokeWidth="3" fill="none" />
      ))}
    </g>
  );
}

export function Garbo({ ratio, b, t }: { ratio: PostRatio; b: PostBrand; t: PostText }) {
  const id = "gb" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = GEO[ratio];
  const { h } = g;
  const potTop = g.potBase - 400 * g.potS;
  const potMid = g.potBase - 200 * g.potS;
  // dots of light thrown on the cloth
  const rnd = seeded(h);
  const spots = Array.from({ length: 150 }, () => {
    const a = rnd() * Math.PI * 2;
    const d = 230 * g.potS + rnd() * 520 * g.potS;
    return { x: r2(540 + Math.cos(a) * d * 1.1), y: r2(potMid + Math.sin(a) * d * 0.8), r: r2(3 + rnd() * 6), o: r2(0.25 + 0.6 * (1 - d / (750 * g.potS))) };
  }).filter((s) => s.y < g.potBase + 40 && s.o > 0.05);
  const pt = g.patchTop;
  const ph = g.patchH;
  const mirrors = Array.from({ length: 13 }, (_, i) => 40 + 10 + (i * (POST_W - 100)) / 12);

  return (
    <div className={`pc pc-garbo r-${ratio}`} style={{ height: h }}>
      <svg className="pc-art" width={POST_W} height={h} viewBox={`0 0 ${POST_W} ${h}`} aria-hidden>
        <defs>
          {/* bandhani: clusters of tied dots; displaced so no two dots are quite alike */}
          <pattern id={`${id}-bnd`} width="120" height="104" patternUnits="userSpaceOnUse">
            {[
              [30, 26, "#fff4dc"],
              [90, 78, "#ffd23a"],
            ].map(([cx, cy, c]) => (
              <g key={cx as number}>
                {Array.from({ length: 8 }, (_, k) => {
                  const a = (k * Math.PI) / 4;
                  return <circle key={k} cx={r2((cx as number) + Math.cos(a) * 15)} cy={r2((cy as number) + Math.sin(a) * 15)} r="3.6" fill={c as string} />;
                })}
                <circle cx={cx} cy={cy} r="5" fill={c as string} />
                <circle cx={cx} cy={cy} r="1.4" fill="#7a0a12" />
              </g>
            ))}
            {[
              [90, 26],
              [30, 78],
            ].map(([x, y]) => (
              <g key={x + "-" + y} fill="#fff4dc">
                <circle cx={x} cy={y - 9} r="2.6" />
                <circle cx={x} cy={y + 9} r="2.6" />
                <circle cx={x - 9} cy={y} r="2.6" />
                <circle cx={x + 9} cy={y} r="2.6" />
              </g>
            ))}
          </pattern>
          <filter id={`${id}-tie`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="d" />
            <feGaussianBlur in="d" stdDeviation=".7" />
          </filter>
          {/* cloth folds: soft light over a low-frequency height map */}
          <filter id={`${id}-folds`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.006" numOctaves="2" seed="11" result="n" />
            <feDiffuseLighting in="n" surfaceScale="38" lightingColor="#fff" result="l">
              <feDistantLight azimuth="235" elevation="38" />
            </feDiffuseLighting>
            <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" />
          </filter>
          <filter id={`${id}-weave`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1 0.9" numOctaves="1" seed="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 -.22" />
          </filter>
          <filter id={`${id}-soft`}>
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={`${id}-clay`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="7" />
            <feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .07  0 0 0 0 .02  0 0 0 .9 -.35" />
          </filter>
          <radialGradient id={`${id}-cloth`} cx="50%" cy="58%" r="75%">
            <stop offset="0" stopColor="#c8131f" />
            <stop offset=".7" stopColor="#9e0c1a" />
            <stop offset="1" stopColor="#5e0610" />
          </radialGradient>
          <radialGradient id={`${id}-pot`} cx="-60" cy="-260" r="260" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e2864a" />
            <stop offset=".45" stopColor="#b5522a" />
            <stop offset="1" stopColor="#5a200c" />
          </radialGradient>
          <radialGradient id={`${id}-potShade`} cx="-50" cy="-250" r="300" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".12" />
            <stop offset=".5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#1a0602" stopOpacity=".55" />
          </radialGradient>
          <radialGradient id={`${id}-scrim`}>
            <stop offset="0" stopColor="#4a040c" stopOpacity=".85" />
            <stop offset=".6" stopColor="#5e0610" stopOpacity=".6" />
            <stop offset="1" stopColor="#5e0610" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-hole`}>
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset=".5" stopColor="#ffd65a" />
            <stop offset="1" stopColor="#ff9a1f" />
          </radialGradient>
          <radialGradient id={`${id}-spot`}>
            <stop offset="0" stopColor="#ffe9a6" stopOpacity="1" />
            <stop offset="1" stopColor="#ffb340" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-aura`}>
            <stop offset="0" stopColor="#ffb347" stopOpacity=".55" />
            <stop offset=".5" stopColor="#ff7a1a" stopOpacity=".18" />
            <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fff2b0" />
            <stop offset=".45" stopColor="#ffb02e" />
            <stop offset="1" stopColor="#e2470f" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id={`${id}-lac`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".3" stopColor="#fff" stopOpacity=".05" />
            <stop offset=".75" stopColor="#000" stopOpacity=".1" />
            <stop offset="1" stopColor="#000" stopOpacity=".45" />
          </linearGradient>
          <radialGradient id={`${id}-brass`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff2b8" />
            <stop offset=".45" stopColor="#d9a43a" />
            <stop offset="1" stopColor="#6e440c" />
          </radialGradient>
          <radialGradient id={`${id}-mirror`} cx=".35" cy=".3" r=".9">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".35" stopColor="#c9d3dc" />
            <stop offset=".7" stopColor="#6f7f8e" />
            <stop offset="1" stopColor="#dfe6ec" />
          </radialGradient>
          <clipPath id={`${id}-potclip`}>
            <path d={POT} />
          </clipPath>
        </defs>

        {/* cloth */}
        <rect width={POST_W} height={h} fill={`url(#${id}-cloth)`} />
        <rect width={POST_W} height={h} fill={`url(#${id}-bnd)`} filter={`url(#${id}-tie)`} opacity=".92" />
        <rect width={POST_W} height={h} filter={`url(#${id}-weave)`} />
        <rect width={POST_W} height={h} filter={`url(#${id}-folds)`} style={{ mixBlendMode: "multiply" }} opacity=".55" />

        {/* a darker veil of cloth behind the greeting, so the dots don't fight the words */}
        <ellipse cx="540" cy={(g.textTop + g.textBottom) / 2} rx="560" ry={(g.textBottom - g.textTop) * 0.62} fill={`url(#${id}-scrim)`} />

        {/* light thrown by the garbo */}
        <ellipse cx="540" cy={potMid} rx={560 * g.potS} ry={460 * g.potS} fill={`url(#${id}-aura)`} style={{ mixBlendMode: "screen" }} />
        <g style={{ mixBlendMode: "screen" }}>
          {spots.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r * 2.2} fill={`url(#${id}-spot)`} opacity={s.o} />
          ))}
        </g>

        {/* mirror-work patch (business details sit on it) */}
        <g>
          <rect x="44" y={pt + 8} width={POST_W - 88} height={ph} rx="6" fill="#000" opacity=".4" filter={`url(#${id}-soft)`} />
          <rect x="40" y={pt} width={POST_W - 80} height={ph} rx="6" fill="#f4e8cf" />
          <rect x="40" y={pt} width={POST_W - 80} height={ph} rx="6" filter={`url(#${id}-weave)`} opacity=".7" />
          {/* chain-stitch borders */}
          <rect x="52" y={pt + 12} width={POST_W - 104} height={ph - 24} rx="4" fill="none" stroke="#1f7a3e" strokeWidth="5" strokeDasharray="7 3" />
          <rect x="62" y={pt + 22} width={POST_W - 124} height={ph - 44} rx="3" fill="none" stroke="#e8a317" strokeWidth="3" strokeDasharray="5 3" />
          <rect x="40" y={pt} width={POST_W - 80} height={ph} rx="6" fill="none" stroke="#7a0a12" strokeWidth="3" strokeDasharray="2 6" />
          {/* mirrors (abhla) along top and bottom edges, each held by a ring of buttonhole stitches */}
          {mirrors.map((x) =>
            [pt + 1, pt + ph - 1].map((y) => (
              <g key={x + "-" + y} transform={`translate(${r2(x)} ${y})`}>
                <circle r="15" fill="#c0172b" />
                {Array.from({ length: 16 }, (_, k) => (
                  <line key={k} x1="0" y1="-10" x2="0" y2="-15" stroke="#f2b705" strokeWidth="2" transform={`rotate(${k * 22.5})`} />
                ))}
                <circle r="9.5" fill={`url(#${id}-mirror)`} />
                <path d="M-5 -4 L-1 -7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
              </g>
            )),
          )}
        </g>

        {/* dandiya crossed behind the pot */}
        <Dandiya x1={540 - 340 * g.potS} y1={potMid - 150 * g.potS} x2={540 + 320 * g.potS} y2={potMid + 120 * g.potS} id={id} k={0} />
        <Dandiya x1={540 + 340 * g.potS} y1={potMid - 150 * g.potS} x2={540 - 320 * g.potS} y2={potMid + 120 * g.potS} id={id} k={1} />

        {/* garbo */}
        <g transform={`translate(540 ${g.potBase}) scale(${g.potS})`}>
          <ellipse cx="0" cy="-4" rx="200" ry="26" fill="#000" opacity=".45" filter={`url(#${id}-soft)`} />
          <path d={POT} fill={`url(#${id}-pot)`} />
          <path d={POT} filter={`url(#${id}-clay)`} />
          <g clipPath={`url(#${id}-potclip)`}>
            {/* painted bands */}
            {[-340, -262, -180, -102].map((y) => (
              <g key={y}>
                <ellipse cx="0" cy={y} rx={halfW(y) + 6} ry="14" fill="none" stroke="#f6ead2" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
                <ellipse cx="0" cy={y + 6} rx={halfW(y) + 6} ry="14" fill="none" stroke="#e2a51c" strokeWidth="2.5" opacity=".9" />
              </g>
            ))}
            {/* light through the holes */}
            <g filter={`url(#${id}-glow)`} opacity=".55">
              {HOLES.map((o, i) => (
                <circle key={i} cx={o.x} cy={o.y} r={o.r * 2.2} fill="#ffb340" />
              ))}
            </g>
            {HOLES.map((o, i) =>
              o.shape === "o" ? (
                <circle key={i} cx={o.x} cy={o.y} r={o.r} fill={`url(#${id}-hole)`} />
              ) : o.shape === "v" ? (
                <path key={i} d={`M${o.x - o.r} ${o.y - o.r * 0.7} L${o.x + o.r} ${o.y - o.r * 0.7} L${o.x} ${o.y + o.r} Z`} fill={`url(#${id}-hole)`} />
              ) : (
                <path key={i} d={`M${o.x} ${o.y - o.r * 1.3} L${o.x + o.r * 0.75} ${o.y} L${o.x} ${o.y + o.r * 1.3} L${o.x - o.r * 0.75} ${o.y} Z`} fill={`url(#${id}-hole)`} />
              ),
            )}
            {/* shading over the round body */}
            <rect x="-200" y="-380" width="400" height="380" fill={`url(#${id}-potShade)`} />
          </g>
          {/* mouth with the diya inside */}
          <ellipse cx="0" cy="-372" rx="76" ry="17" fill="#8a3a18" />
          <ellipse cx="0" cy="-373" rx="62" ry="11" fill="#ffcf6a" />
          <ellipse cx="0" cy="-371" rx="50" ry="7" fill="#ff9a2a" opacity=".7" />
          <circle cx="0" cy="-420" r="70" fill={`url(#${id}-aura)`} />
          <path d="M0 -376 C-12 -392 -11 -420 0 -452 C11 -420 12 -392 0 -376Z" fill={`url(#${id}-flame)`} />
          <path d="M0 -378 C-5 -386 -5 -397 0 -408 C5 -397 5 -386 0 -378Z" fill="#fffbe8" />
        </g>
      </svg>

      <Brand b={b} className="gb-brand" style={{ top: pt + 30, height: ph - 60 }} />
      <Offer text={b.offer} className="gb-offer" style={{ top: pt + ph - 22 }} />

      <Squeeze className="gb-text" style={{ top: g.textTop + (b.offer ? 26 : 0), height: g.textBottom - g.textTop - (b.offer ? 26 : 0) }} deps={[t.local, t.heading, t.wish, t.message, ratio]}>
        {t.local && <Fit as="h1" className="gb-local" text={t.local} max={ratio === "1x1" ? 104 : ratio === "4x5" ? 118 : 132} min={50} />}
        <Fit className="gb-head" text={t.heading} max={ratio === "9x16" ? 50 : 44} min={28} />
        {t.wish && <Fit as="p" className="gb-wish" text={t.wish} max={ratio === "9x16" ? 40 : 34} min={24} />}
        {t.message && <Fit as="p" className="gb-msg" text={t.message} max={ratio === "9x16" ? 32 : 27} min={20} />}
      </Squeeze>
    </div>
  );
}
