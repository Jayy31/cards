import React from "react";
import { atan2, cos, rng, sin } from "@/lib/format";
import type { Foil } from "@/lib/types";

/* ==========================================================================
   Procedural ornament library.
   Everything here is generated from geometry (no stock art), so it is
   resolution-independent, recolourable per palette and license-free.
   ========================================================================== */

export const FOIL_STOPS: Record<Foil, string[]> = {
  gold: ["#7a5a1c", "#c9a24a", "#f7e7a8", "#b8892b", "#fff3c4", "#a07b2c", "#e0bf66"],
  rosegold: ["#84463f", "#cf9383", "#f9dccf", "#b16a61", "#ffe9e1", "#955750", "#dca597"],
  silver: ["#63666c", "#bfc3c9", "#f4f5f7", "#8f939b", "#ffffff", "#72767e", "#d6d9de"],
  copper: ["#6e3517", "#c0733c", "#f3c29c", "#a4582a", "#ffd8bb", "#84431f", "#d58f5c"],
};

export const foilUrl = (f: Foil) => `url(#foil-${f})`;

/** Mount once per document: shared gradients & filters referenced by every card. */
export function GlobalDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden focusable="false">
      <defs>
        {(Object.keys(FOIL_STOPS) as Foil[]).map((f) => (
          <linearGradient key={f} id={`foil-${f}`} x1="0" y1="0" x2="1" y2="1">
            {FOIL_STOPS[f].map((c, i, a) => (
              <stop key={i} offset={i / (a.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
        ))}
        {(Object.keys(FOIL_STOPS) as Foil[]).map((f) => (
          <radialGradient key={f} id={`foilr-${f}`} cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor={FOIL_STOPS[f][4]} />
            <stop offset="0.45" stopColor={FOIL_STOPS[f][1]} />
            <stop offset="1" stopColor={FOIL_STOPS[f][0]} />
          </radialGradient>
        ))}

        {/* Hot-foil bevel: blurred alpha → specular light → composited back over the fill. */}
        {/* Watercolour: wobbly bleeding edges, slightly soft. */}
        <filter id="f-wc" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.6" />
        </filter>
        {/* Sumi brush: bristle streaks along the stroke and dry-brush gaps. */}
        <filter id="f-brush" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="9" result="f" />
          <feColorMatrix in="f" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.62" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        {/* Chalk / rice flour: powdery, broken line. */}
        <filter id="f-chalk" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 1.75" result="m" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" result="d" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        {/* Hand block printing: speckled ink coverage and slightly ragged edges. */}
        <filter id="f-blockink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.15" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        {/* Rubber stamp: uneven inking, worn patches and a soft spread. */}
        <filter id="f-stamp" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="8" result="big" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="2" result="fine" />
          <feComposite in="big" in2="fine" operator="arithmetic" k1="0" k2="0.65" k3="0.55" k4="0" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.75" result="m" />
          <feDisplacementMap in="SourceGraphic" in2="big" scale="3" result="d" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        <filter id="f-foil" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.7" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="2.4" specularConstant="0.95" specularExponent="16" lightingColor="#fffbe8" result="spec">
            <feDistantLight azimuth="225" elevation="48" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" result="lit" />
          <feDropShadow in="lit" dx="0" dy="0.9" stdDeviation="0.5" floodColor="#000" floodOpacity="0.38" />
        </filter>

        {/* Letterpress: ink pressed into paper (inner shadow + light rim below). */}
        <filter id="f-press" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset in="SourceAlpha" dy="0.8" result="off" />
          <feGaussianBlur in="off" stdDeviation="0.5" result="ob" />
          <feComposite in="SourceAlpha" in2="ob" operator="out" result="inner" />
          <feFlood floodColor="#000" floodOpacity="0.45" />
          <feComposite in2="inner" operator="in" result="shadow" />
          <feComposite in="shadow" in2="SourceGraphic" operator="over" />
        </filter>

        {/* Watercolour: wobbly edges + pigment granulation. */}
        <filter id="f-watercolor" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.25" result="grainA" />
          <feComposite in="wobbly" in2="grainA" operator="in" result="grained" />
          <feGaussianBlur in="grained" stdDeviation="0.35" />
        </filter>

        {/* Wax: glossy bulge. */}
        <filter id="f-wax" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b" />
          <feSpecularLighting in="b" surfaceScale="5" specularConstant="0.8" specularExponent="22" lightingColor="#fff" result="s">
            <fePointLight x="-40" y="-60" z="120" />
          </feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="si" />
          <feComposite in="SourceGraphic" in2="si" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="0" result="lit" />
          <feDropShadow in="lit" dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.45" />
        </filter>

        {/* Pressed seal impression inside the wax. */}
        <filter id="f-seal-press" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset in="SourceAlpha" dx="-0.8" dy="-0.8" result="o1" />
          <feFlood floodColor="#fff" floodOpacity="0.35" />
          <feComposite in2="o1" operator="in" result="hi" />
          <feOffset in="SourceAlpha" dx="0.9" dy="0.9" result="o2" />
          <feFlood floodColor="#000" floodOpacity="0.55" />
          <feComposite in2="o2" operator="in" result="lo" />
          <feMerge>
            <feMergeNode in="lo" />
            <feMergeNode in="hi" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ---------------- geometry helpers ---------------- */

type Pt = [number, number];
const f2 = (n: number) => Math.round(n * 100) / 100;

function spiral(cx: number, cy: number, r0: number, turns: number, start: number, dir = 1, steps = 48): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + dir * t * turns * Math.PI * 2;
    const r = r0 * (1 - t * 0.82);
    pts.push([cx + r * cos(a), cy + r * sin(a)]);
  }
  return pts;
}

/** Catmull-Rom → cubic bezier so procedural point lists render as silky curves. */
function smooth(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M${f2(pts[0][0])},${f2(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f2(c1[0])},${f2(c1[1])} ${f2(c2[0])},${f2(c2[1])} ${f2(p2[0])},${f2(p2[1])}`;
  }
  return d;
}

/** Teardrop leaf with its base at (x,y) pointing along `angle` (degrees). */
export function leafPath(x: number, y: number, len: number, width: number, angle: number) {
  const a = (angle * Math.PI) / 180;
  const ca = cos(a);
  const sa = sin(a);
  const P = (u: number, v: number): string => `${f2(x + u * ca - v * sa)},${f2(y + u * sa + v * ca)}`;
  return `M${P(0, 0)} C${P(len * 0.25, -width)} ${P(len * 0.75, -width * 0.8)} ${P(len, 0)} C${P(len * 0.75, width * 0.8)} ${P(len * 0.25, width)} ${P(0, 0)}Z`;
}

/* ---------------- corner flourish ---------------- */

export function CornerFlourish({ size = 110, fill }: { size?: number; fill: string }) {
  const arm = (swap: boolean) => {
    const T = (p: Pt): Pt => (swap ? [p[1], p[0]] : p);
    const stem = (
      [
        [10, 10],
        [34, 12],
        [58, 16],
        [78, 26],
        [88, 38],
      ] as Pt[]
    ).map(T);
    const curl = spiral(80, 40, 9, 1.15, 0.2, 1).map(T);
    const inner = spiral(40, 30, 6, 1.0, Math.PI, -1).map(T);
    const innerStem = (
      [
        [22, 20],
        [30, 26],
        [38, 34],
      ] as Pt[]
    ).map(T);
    const lv = (x: number, y: number, l: number, w: number, ang: number) => {
      const [px, py] = T([x, y]);
      return leafPath(px, py, l, w, swap ? 90 - ang : ang);
    };
    return (
      <>
        <path d={smooth([...stem, ...curl.slice(1)])} fill="none" stroke={fill} strokeWidth={2.2} strokeLinecap="round" />
        <path d={smooth([...innerStem, ...inner])} fill="none" stroke={fill} strokeWidth={1.4} strokeLinecap="round" />
        <path d={lv(44, 14, 18, 4.5, -28)} fill={fill} />
        <path d={lv(62, 19, 15, 4, 42)} fill={fill} />
        <path d={lv(28, 12, 12, 3, -40)} fill={fill} />
        <circle cx={T([96, 50])[0]} cy={T([96, 50])[1]} r={2} fill={fill} />
        <circle cx={T([102, 58])[0]} cy={T([102, 58])[1]} r={1.3} fill={fill} />
      </>
    );
  };
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)">
        {arm(false)}
        {arm(true)}
        <path d={leafPath(8, 8, 26, 7, 45)} fill={fill} />
        <circle cx={6} cy={6} r={3.2} fill={fill} />
      </g>
    </svg>
  );
}

export function Corners({ fill, size = 96, inset = 14 }: { fill: string; size?: number; inset?: number }) {
  const s = { position: "absolute" as const, width: size, height: size };
  return (
    <>
      <div style={{ ...s, top: inset, left: inset }}>
        <CornerFlourish size={size} fill={fill} />
      </div>
      <div style={{ ...s, top: inset, right: inset, transform: "scaleX(-1)" }}>
        <CornerFlourish size={size} fill={fill} />
      </div>
      <div style={{ ...s, bottom: inset, left: inset, transform: "scaleY(-1)" }}>
        <CornerFlourish size={size} fill={fill} />
      </div>
      <div style={{ ...s, bottom: inset, right: inset, transform: "scale(-1,-1)" }}>
        <CornerFlourish size={size} fill={fill} />
      </div>
    </>
  );
}

/* ---------------- borders ---------------- */

export function DoubleBorder({ fill, inset = 16, gap = 6, beads = true }: { fill: string; inset?: number; gap?: number; beads?: boolean }) {
  const W = 500;
  const H = 700;
  const i2 = inset + gap;
  const beadList: React.ReactNode[] = [];
  if (beads) {
    const bi = inset + gap / 2;
    const step = 9;
    for (let x = bi + 30; x < W - bi - 30; x += step) {
      beadList.push(<circle key={`t${x}`} cx={x} cy={bi} r={0.9} />, <circle key={`b${x}`} cx={x} cy={H - bi} r={0.9} />);
    }
    for (let y = bi + 30; y < H - bi - 30; y += step) {
      beadList.push(<circle key={`l${y}`} cx={bi} cy={y} r={0.9} />, <circle key={`r${y}`} cx={W - bi} cy={y} r={0.9} />);
    }
  }
  return (
    <svg className="abs-fill" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <g filter="url(#f-foil)" fill="none" stroke={fill}>
        <rect x={inset} y={inset} width={W - inset * 2} height={H - inset * 2} strokeWidth={2} rx={2} />
        <rect x={i2} y={i2} width={W - i2 * 2} height={H - i2 * 2} strokeWidth={0.8} rx={1} />
        <g fill={fill} stroke="none">{beadList}</g>
      </g>
    </svg>
  );
}

/* ---------------- dividers ---------------- */

export function Divider({ fill, width = 220, kind = "lotus" }: { fill: string; width?: number; kind?: "lotus" | "diamond" | "dots" }) {
  const c = width / 2;
  return (
    <svg width={width} height={24} viewBox={`0 0 ${width} 24`} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill} stroke={fill}>
        <path d={`M4,12 Q${c * 0.5},${9} ${c - 22},12`} strokeWidth={1.1} fill="none" />
        <path d={`M${width - 4},12 Q${c * 1.5},${9} ${c + 22},12`} strokeWidth={1.1} fill="none" />
        <circle cx={4} cy={12} r={1.6} stroke="none" />
        <circle cx={width - 4} cy={12} r={1.6} stroke="none" />
        {kind === "lotus" && (
          <g stroke="none">
            <path d={leafPath(c, 17, 13, 4.2, -90)} />
            <path d={leafPath(c - 1, 17, 12, 3.6, -125)} />
            <path d={leafPath(c + 1, 17, 12, 3.6, -55)} />
            <path d={leafPath(c - 2, 17, 11, 3, -160)} />
            <path d={leafPath(c + 2, 17, 11, 3, -20)} />
            <circle cx={c - 16} cy={12} r={1.5} />
            <circle cx={c + 16} cy={12} r={1.5} />
          </g>
        )}
        {kind === "diamond" && (
          <g stroke="none">
            <path d={`M${c},4 L${c + 7},12 L${c},20 L${c - 7},12Z`} />
            <path d={`M${c - 14},12 L${c - 10},8.5 L${c - 6},12 L${c - 10},15.5Z`} />
            <path d={`M${c + 14},12 L${c + 10},8.5 L${c + 6},12 L${c + 10},15.5Z`} />
          </g>
        )}
        {kind === "dots" && (
          <g stroke="none">
            <circle cx={c} cy={12} r={3} />
            <circle cx={c - 10} cy={12} r={1.8} />
            <circle cx={c + 10} cy={12} r={1.8} />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ---------------- Mughal jharokha arch ---------------- */

function archCurve(W: number, S: number, R: number, steps: number): Pt[] {
  // Left half of a pointed (drop) arch: circle centred at (R, S) from angle π up to the apex.
  const apexY = S - Math.sqrt(R * R - (R - W / 2) ** 2);
  const a0 = Math.PI;
  const a1 = atan2(apexY - S, W / 2 - R);
  const end = a1 < 0 ? a1 + 2 * Math.PI : a1;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (end - a0) * (i / steps);
    pts.push([R + R * cos(a), S + R * sin(a)]);
  }
  return pts;
}

export function JharokhaArch({ fill, width = 380, height = 560 }: { fill: string; width?: number; height?: number }) {
  const W = width;
  const S = 170; // spring line
  const R = W * 0.68;
  const left = archCurve(W, S, R, 9);
  const right = left.map(([x, y]) => [W - x, y] as Pt).reverse();
  const pts = [...left, ...right.slice(1)];
  // Cusped (multifoil) inner edge: small inward-bulging arcs between arch samples.
  let cusp = `M0,${height} L0,${S}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i + 1];
    const chord = Math.hypot(x1 - pts[i][0], y1 - pts[i][1]);
    cusp += ` A${f2(chord * 0.58)},${f2(chord * 0.58)} 0 0 0 ${f2(x1)},${f2(y1)}`;
  }
  cusp += ` L${W},${height}`;

  const outerLeft = archCurve(W + 28, S, (W + 28) * 0.68, 24).map(([x, y]) => [x - 14, y - 10] as Pt);
  const outerRight = outerLeft.map(([x, y]) => [W - x, y] as Pt).reverse();
  const outer = `M-14,${height} L-14,${S - 10} ` + smooth([...outerLeft, ...outerRight.slice(1)]).replace(/^M[^C]+/, "") + ` L${W + 14},${height}`;
  const apex = outerLeft[outerLeft.length - 1];

  return (
    <svg width={W} height={height} viewBox={`-30 -60 ${W + 60} ${height + 60}`} style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill="none" stroke={fill} strokeLinejoin="round">
        <path d={outer} strokeWidth={2.4} />
        <path d={cusp} strokeWidth={1.3} />
        {/* finial */}
        <g fill={fill} stroke="none">
          <path d={leafPath(apex[0], apex[1] - 2, 26, 6, -90)} />
          <circle cx={apex[0]} cy={apex[1] - 34} r={3} />
          <path d={leafPath(apex[0] - 3, apex[1] - 6, 16, 3.5, -140)} />
          <path d={leafPath(apex[0] + 3, apex[1] - 6, 16, 3.5, -40)} />
        </g>
        {/* capitals of the pillars */}
        {[-14, W + 14].map((x) => (
          <g key={x} fill={fill} stroke="none">
            <rect x={x - 9} y={S - 4} width={18} height={4} rx={1} />
            <rect x={x - 6} y={S + 2} width={12} height={3} rx={1} />
            <path d={leafPath(x, S - 6, 14, 4, -90)} />
          </g>
        ))}
        {/* hanging bells from the spring line */}
        {[W * 0.16, W * 0.84].map((x) => (
          <g key={x} fill={fill} stroke="none">
            <rect x={x - 0.4} y={S - 6} width={0.8} height={22} />
            <path d={`M${x - 5},${S + 26} Q${x},${S + 10} ${x + 5},${S + 26} Z`} />
            <circle cx={x} cy={S + 28} r={1.4} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------------- Mandala ---------------- */

export function Mandala({
  size = 300,
  fill,
  seed = 5,
  opacity = 1,
  colors,
  filter = "url(#f-foil)",
}: {
  size?: number;
  fill: string;
  seed?: number;
  opacity?: number;
  colors?: string[];
  filter?: string;
}) {
  const r = rng(seed);
  const rings: React.ReactNode[] = [];
  const R = 150;
  const layers = [
    { rad: 18, n: 8, kind: "petal", len: 16, w: 6 },
    { rad: 34, n: 16, kind: "dot" },
    { rad: 40, n: 12, kind: "petal", len: 26, w: 8 },
    { rad: 70, n: 24, kind: "scallop" },
    { rad: 76, n: 16, kind: "petal", len: 30, w: 7 },
    { rad: 110, n: 32, kind: "dot" },
    { rad: 116, n: 24, kind: "leaf", len: 24, w: 5 },
    { rad: 142, n: 48, kind: "scallop" },
  ];
  layers.forEach((L, li) => {
    const col = colors ? colors[li % colors.length] : fill;
    const offset = r() * 0.5;
    const items: React.ReactNode[] = [];
    for (let i = 0; i < L.n; i++) {
      const a = ((i + offset) / L.n) * 360;
      const rad = (a * Math.PI) / 180;
      const x = R + L.rad * cos(rad);
      const y = R + L.rad * sin(rad);
      if (L.kind === "petal" || L.kind === "leaf") {
        items.push(<path key={i} d={leafPath(x, y, L.len!, L.w!, a)} fill={L.kind === "leaf" ? "none" : col} stroke={col} strokeWidth={L.kind === "leaf" ? 1.1 : 0} />);
        if (L.kind === "petal") items.push(<path key={`v${i}`} d={leafPath(x + 3 * cos(rad), y + 3 * sin(rad), L.len! * 0.55, L.w! * 0.35, a)} fill="rgba(0,0,0,0.18)" />);
      } else if (L.kind === "dot") {
        items.push(<circle key={i} cx={x} cy={y} r={1.8} fill={col} />);
      } else {
        const a2 = (((i + 1 + offset) / L.n) * 360 * Math.PI) / 180;
        const x2 = R + L.rad * cos(a2);
        const y2 = R + L.rad * sin(a2);
        const ch = Math.hypot(x2 - x, y2 - y);
        items.push(<path key={i} d={`M${f2(x)},${f2(y)} A${f2(ch / 2)},${f2(ch / 2)} 0 0 1 ${f2(x2)},${f2(y2)}`} fill="none" stroke={col} strokeWidth={1.2} />);
      }
    }
    rings.push(<g key={li}>{items}</g>);
  });
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible", opacity }}>
      <g filter={filter}>
        <circle cx={R} cy={R} r={7} fill={colors ? colors[0] : fill} />
        <circle cx={R} cy={R} r={30} fill="none" stroke={colors ? colors[1 % colors.length] : fill} strokeWidth={1} />
        <circle cx={R} cy={R} r={66} fill="none" stroke={colors ? colors[2 % colors.length] : fill} strokeWidth={1.4} />
        <circle cx={R} cy={R} r={106} fill="none" stroke={colors ? colors[3 % colors.length] : fill} strokeWidth={0.9} />
        {rings}
      </g>
    </svg>
  );
}

/* ---------------- Watercolour florals ---------------- */

function Blossom({ x, y, r, color, center, rot, seed }: { x: number; y: number; r: number; color: string; center: string; rot: number; seed: number }) {
  const rr = rng(seed);
  const petals = 5 + Math.floor(rr() * 2);
  const out: React.ReactNode[] = [];
  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i < petals; i++) {
      const a = rot + (i / petals) * 360 + layer * (180 / petals);
      const len = r * (layer ? 0.72 : 1) * (0.88 + rr() * 0.2);
      out.push(<path key={`${layer}-${i}`} d={leafPath(x, y, len, len * 0.55, a)} fill={color} opacity={layer ? 0.8 : 0.62} />);
    }
  }
  out.push(<circle key="c" cx={x} cy={y} r={r * 0.18} fill={center} opacity={0.85} />);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    out.push(<circle key={`s${i}`} cx={x + cos(a) * r * 0.28} cy={y + sin(a) * r * 0.28} r={r * 0.04} fill={center} />);
  }
  return <g>{out}</g>;
}

export function FloralCluster({ width = 260, flower, leaf, seed = 1, flip = false }: { width?: number; flower: string; leaf: string; seed?: number; flip?: boolean }) {
  const r = rng(seed);
  const leaves: React.ReactNode[] = [];
  const stems: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const x = 20 + t * 200;
    const y = 30 + sin(t * 3) * 18 + r() * 10;
    const ang = -60 + r() * 120 + (i % 2 ? 180 : 0);
    leaves.push(<path key={i} d={leafPath(x, y, 24 + r() * 16, 7 + r() * 4, ang)} fill={leaf} opacity={0.7 + r() * 0.3} />);
  }
  stems.push(
    <path
      key="s"
      d={smooth([
        [10, 40],
        [60, 26],
        [120, 44],
        [180, 30],
        [236, 46],
      ])}
      fill="none"
      stroke={leaf}
      strokeWidth={1.4}
      opacity={0.7}
    />,
  );
  return (
    <svg width={width} height={width * 0.42} viewBox="0 0 260 110" style={{ overflow: "visible", transform: flip ? "scale(-1,1)" : undefined }}>
      <g filter="url(#f-watercolor)">
        {stems}
        {leaves}
        <Blossom x={70} y={40} r={30} color={flower} center={leaf} rot={r() * 60} seed={seed + 1} />
        <Blossom x={130} y={52} r={22} color={flower} center={leaf} rot={r() * 60} seed={seed + 2} />
        <Blossom x={30} y={52} r={18} color={flower} center={leaf} rot={r() * 60} seed={seed + 3} />
        <Blossom x={188} y={36} r={16} color={flower} center={leaf} rot={r() * 60} seed={seed + 4} />
        {[
          [104, 22],
          [160, 60],
          [214, 42],
          [48, 18],
        ].map(([bx, by], i) => (
          <circle key={i} cx={bx} cy={by} r={4 + r() * 2} fill={flower} opacity={0.6} />
        ))}
      </g>
    </svg>
  );
}

/* ---------------- Toran (marigold garland) ---------------- */

function Marigold({ x, y, r, c1, c2 }: { x: number; y: number; r: number; c1: string; c2: string }) {
  const ring = (rad: number, n: number, col: string, w: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return <ellipse key={`${rad}-${i}`} cx={x + cos(a) * rad} cy={y + sin(a) * rad} rx={w} ry={w * 0.7} fill={col} transform={`rotate(${(a * 180) / Math.PI} ${x + cos(a) * rad} ${y + sin(a) * rad})`} />;
    });
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c2} />
      {ring(r * 0.78, 14, c1, r * 0.3)}
      {ring(r * 0.48, 9, c2, r * 0.27)}
      {ring(r * 0.2, 5, c1, r * 0.2)}
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill="#fff" opacity={0.18} />
    </g>
  );
}

export function Toran({ width = 500, marigold = "#f28c0f", leaf = "#3e7d2c", seed = 3 }: { width?: number; marigold?: string; leaf?: string; seed?: number }) {
  const r = rng(seed);
  const loops = 5;
  const lw = width / loops;
  const items: React.ReactNode[] = [];
  const dark = "#c2410c";
  // main rope of marigolds along scalloped loops
  for (let l = 0; l < loops; l++) {
    const x0 = l * lw;
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = x0 + t * lw;
      const y = 10 + sin(t * Math.PI) * 26;
      items.push(<Marigold key={`m${l}-${i}`} x={x} y={y} r={7.5} c1={i % 3 === 1 ? "#facc15" : marigold} c2={dark} />);
    }
  }
  // mango leaves hanging from each loop
  for (let l = 0; l <= loops; l++) {
    const x = l * lw;
    items.push(<path key={`lf${l}`} d={leafPath(x, 12, 34, 7.5, 90 + (r() - 0.5) * 12)} fill={leaf} />);
    items.push(<path key={`lv${l}`} d={`M${x},14 L${x},44`} stroke="rgba(0,0,0,.25)" strokeWidth={0.8} />);
    // hanging strand: 3 marigolds + a small bell
    for (let k = 0; k < 3; k++) items.push(<Marigold key={`h${l}-${k}`} x={x} y={52 + k * 13} r={6} c1={k === 1 ? "#facc15" : marigold} c2={dark} />);
  }
  for (let l = 0; l < loops; l++) {
    const x = l * lw + lw / 2;
    items.push(<path key={`ml${l}`} d={leafPath(x - 3, 38, 22, 6, 100)} fill={leaf} opacity={0.9} />);
    items.push(<path key={`mr${l}`} d={leafPath(x + 3, 38, 22, 6, 80)} fill={leaf} opacity={0.9} />);
  }
  return (
    <svg width={width} height={100} viewBox={`0 0 ${width} 100`} style={{ overflow: "visible", filter: "drop-shadow(0 3px 2px rgba(0,0,0,.28))" }}>
      <path d={`M0,8 ${Array.from({ length: loops }, (_, l) => `Q${l * lw + lw / 2},${58} ${(l + 1) * lw},8`).join(" ")}`} fill="none" stroke="#7c2d12" strokeWidth={1} />
      {items}
    </svg>
  );
}

/* ---------------- Rangoli ---------------- */

export function Rangoli({ size = 220, colors }: { size?: number; colors: string[] }) {
  return <Mandala size={size} fill={colors[0]} colors={colors} seed={9} filter="url(#f-watercolor)" />;
}

/* ---------------- Art-deco frame ---------------- */

export function DecoFrame({ fill }: { fill: string }) {
  const W = 500;
  const H = 700;
  const i = 22;
  const step = (x: number, y: number, sx: number, sy: number) =>
    `M${x},${y + sy * 60} L${x},${y + sy * 18} L${x + sx * 10},${y + sy * 18} L${x + sx * 10},${y + sy * 10} L${x + sx * 18},${y + sy * 10} L${x + sx * 18},${y} L${x + sx * 60},${y}`;
  const fan: React.ReactNode[] = [];
  for (let k = 0; k <= 12; k++) {
    const a = Math.PI + (k / 12) * Math.PI;
    fan.push(<line key={k} x1={W / 2} y1={i + 70} x2={W / 2 + cos(a) * 60} y2={i + 70 + sin(a) * 60} strokeWidth={0.7} />);
  }
  return (
    <svg className="abs-fill" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <g filter="url(#f-foil)" fill="none" stroke={fill}>
        <rect x={i} y={i} width={W - 2 * i} height={H - 2 * i} strokeWidth={1.2} />
        <rect x={i + 8} y={i + 8} width={W - 2 * i - 16} height={H - 2 * i - 16} strokeWidth={0.6} />
        <path d={step(i + 14, i + 14, 1, 1)} strokeWidth={1.4} />
        <path d={step(W - i - 14, i + 14, -1, 1)} strokeWidth={1.4} />
        <path d={step(i + 14, H - i - 14, 1, -1)} strokeWidth={1.4} />
        <path d={step(W - i - 14, H - i - 14, -1, -1)} strokeWidth={1.4} />
        <g opacity={0.55}>{fan}</g>
        <path d={`M${W / 2 - 64},${i + 70} A64,64 0 0 1 ${W / 2 + 64},${i + 70}`} strokeWidth={1.1} />
        <path d={`M${W / 2 - 40},${H - i - 30} L${W / 2},${H - i - 14} L${W / 2 + 40},${H - i - 30}`} strokeWidth={1} />
      </g>
    </svg>
  );
}

/* ---------------- Symbols ---------------- */

export function Kalash({ size = 120, fill, leaf = "#3e7d2c", accent = "#c0392b" }: { size?: number; fill: string; leaf?: string; accent?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ overflow: "visible" }}>
      {/* mango leaves */}
      {[-60, -35, -12, 12, 35, 60].map((a, i) => (
        <path key={i} d={leafPath(50, 40, 32, 7, -90 + a)} fill={leaf} opacity={0.95} />
      ))}
      {/* coconut */}
      <ellipse cx={50} cy={30} rx={13} ry={16} fill="#8b5a2b" />
      <path d="M40,24 Q50,6 60,24" fill="#6b4220" />
      {/* pot */}
      <g filter="url(#f-foil)">
        <path d="M30,44 Q30,40 34,40 L66,40 Q70,40 70,44 L68,50 Q90,62 88,82 Q86,104 50,108 Q14,104 12,82 Q10,62 32,50 Z" fill={fill} />
        <rect x={30} y={38} width={40} height={6} rx={2} fill={fill} />
      </g>
      {/* swastik-free auspicious mark: kumkum band + dots */}
      <path d="M16,74 Q50,86 84,74" stroke={accent} strokeWidth={3} fill="none" opacity={0.85} />
      {[30, 42, 50, 58, 70].map((x, i) => (
        <circle key={i} cx={x} cy={92 - Math.abs(50 - x) * 0.15} r={2} fill={accent} />
      ))}
    </svg>
  );
}

export function Lotus({ size = 120, fill }: { size?: number; fill: string }) {
  const petals = [-80, -55, -30, -8, 8, 30, 55, 80];
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 120 84" style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)">
        {petals.map((a, i) => (
          <path key={i} d={leafPath(60, 70, Math.abs(a) > 60 ? 38 : 52, 13, -90 + a)} fill={fill} stroke="rgba(0,0,0,.25)" strokeWidth={0.6} />
        ))}
        <path d={leafPath(60, 70, 58, 14, -90)} fill={fill} stroke="rgba(0,0,0,.25)" strokeWidth={0.6} />
        <path d="M22,74 Q60,86 98,74" fill="none" stroke={fill} strokeWidth={2} />
      </g>
    </svg>
  );
}

export function Diya({ size = 110, fill }: { size?: number; fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="diya-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff7c2" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffb347" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff8c00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={50} cy={34} r={30} fill="url(#diya-glow)" className="flicker" />
      <path d="M50,14 C58,28 58,38 50,46 C42,38 42,28 50,14Z" fill="#ffcf4d" className="flicker" />
      <path d="M50,26 C54,33 54,39 50,44 C46,39 46,33 50,26Z" fill="#fff4c9" />
      <g filter="url(#f-foil)">
        <path d="M14,56 Q50,52 86,56 Q82,82 50,84 Q18,82 14,56Z" fill={fill} />
        <path d="M86,56 Q96,52 98,46 Q92,58 84,62Z" fill={fill} />
        <path d="M36,84 L64,84 L60,92 L40,92Z" fill={fill} />
      </g>
    </svg>
  );
}

export function Rings({ size = 150, fill }: { size?: number; fill: string }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 160 120" style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill="none" stroke={fill}>
        <circle cx={62} cy={70} r={36} strokeWidth={7} />
        <circle cx={98} cy={70} r={36} strokeWidth={7} />
        <circle cx={62} cy={70} r={36} strokeWidth={1} stroke="rgba(255,255,255,.55)" />
      </g>
      {/* solitaire */}
      <g transform="translate(62 26)">
        <path d="M-10,0 L-6,-7 L6,-7 L10,0 L0,12Z" fill="#fdfdff" stroke="#b9c2d0" strokeWidth={0.8} />
        <path d="M-10,0 L10,0 M-6,-7 L-3,0 L0,12 M6,-7 L3,0 L0,12 M-3,0 L0,-7 L3,0" stroke="#aab4c4" strokeWidth={0.5} fill="none" />
        <circle cx={-3} cy={-4} r={1.3} fill="#fff" className="sparkle" />
      </g>
    </svg>
  );
}

/** Irregular wax blob with a pressed monogram. */
export function WaxSeal({ size = 92, color, text }: { size?: number; color: string; text: string }) {
  const r = rng(text.length * 13 + 5);
  const pts: Pt[] = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const rad = 44 + (r() - 0.5) * 7;
    pts.push([50 + cos(a) * rad, 50 + sin(a) * rad]);
  }
  const blob = smooth([...pts, pts[0], pts[1]]) + "Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`wax-${color.replace("#", "")}`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor={color} stopOpacity="0.85" />
          <stop offset="0.6" stopColor={color} />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <g filter="url(#f-wax)">
        <path d={blob} fill={`url(#wax-${color.replace("#", "")})`} />
      </g>
      <circle cx={50} cy={50} r={30} fill={color} filter="url(#f-seal-press)" />
      <circle cx={50} cy={50} r={27} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={1} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={50 + cos(a) * 24} cy={50 + sin(a) * 24} r={0.9} fill="rgba(0,0,0,.35)" />;
      })}
      <text x={50} y={58} textAnchor="middle" fontSize={text.length > 1 ? 22 : 26} fill={color} filter="url(#f-seal-press)" style={{ fontFamily: "var(--f-cinzel-deco)", fontWeight: 700 }}>
        {text}
      </text>
    </svg>
  );
}

/* ---- faith symbols for wedding covers (simple foil marks) ---- */

export function Swastik({ size = 100, fill, accent }: { size?: number; fill: string; accent: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g filter="url(#f-foil)" fill={fill}>
        <path d="M45,12 H55 V45 H88 V55 H55 V88 H45 V55 H12 V45 H45Z" />
        <path d="M45,12 H84 V22 H45Z M78,45 H88 V84 H78Z M16,78 H55 V88 H16Z M12,16 H22 V55 H12Z" />
      </g>
      {[[30, 30], [70, 30], [30, 70], [70, 70]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4.5} fill={accent} />
      ))}
    </svg>
  );
}

export function Khanda({ size = 100, fill }: { size?: number; fill: string }) {
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 105">
      <g filter="url(#f-foil)" fill={fill}>
        {/* chakkar */}
        <path fillRule="evenodd" d="M50,32 a26,26 0 1,0 0.01,0Z M50,39 a19,19 0 1,1 -0.01,0Z" />
        {/* double-edged khanda */}
        <path d="M50,4 L57,18 L55.5,74 L44.5,74 L43,18Z" />
        <rect x={40} y={73} width={20} height={4} rx={1.5} />
        <rect x={47.5} y={77} width={5} height={10} rx={1} />
        {/* two kirpans */}
        <path d="M46,96 C22,86 10,62 20,36 C18,62 30,80 50,90Z" />
        <path d="M54,96 C78,86 90,62 80,36 C82,62 70,80 50,90Z" />
        <circle cx={44} cy={97} r={3.2} />
        <circle cx={56} cy={97} r={3.2} />
      </g>
    </svg>
  );
}

export function Crescent({ size = 100, fill }: { size?: number; fill: string }) {
  const star = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 5 : 12;
    return `${68 + Math.cos(a) * r},${40 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <mask id="crescent-cut">
          <rect width={100} height={100} fill="#fff" />
          <circle cx={58} cy={45} r={30} fill="#000" />
        </mask>
      </defs>
      <g filter="url(#f-foil)" fill={fill}>
        <circle cx={44} cy={52} r={36} mask="url(#crescent-cut)" />
        <polygon points={star} />
      </g>
    </svg>
  );
}

export function Cross({ size = 100, fill }: { size?: number; fill: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
      <g filter="url(#f-foil)" fill={fill}>
        <path fillRule="evenodd" d="M50,14 a22,22 0 1,0 0.01,0Z M50,18 a18,18 0 1,1 -0.01,0Z" opacity={0.85} />
        <path d="M45,6 Q50,2 55,6 L54,30 L74,29 Q78,34 74,39 L54,38 L56,104 Q50,110 44,104 L46,38 L26,39 Q22,34 26,29 L46,30Z" />
      </g>
    </svg>
  );
}
