"use client";
import React, { useId } from "react";
import { cos, rng, sin } from "@/lib/format";
import { LotusSide } from "./art";

/*
 * Wedding collection, batch 3 motifs: Paithani silk, Christian lace & glass,
 * Madhubani folk line art, an illustrated couple, and boarding-pass parts.
 * Procedural SVG; use rounded `sin`/`cos` so server and client markup match.
 */

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");
const rad = (d: number) => (d * Math.PI) / 180;

/* ================= Paithani (Maharashtrian) ================= */

/** Paithani peacock: standing, facing right, long tail trailing behind. */
export function Peacock({ width = 130, fill, eye = "#1b6f8a", flip = false }: { width?: number; fill: string; eye?: string; flip?: boolean }) {
  const eyes = [
    [30, 92],
    [18, 104],
    [40, 102],
    [8, 114],
    [28, 114],
  ];
  return (
    <svg width={width} height={width} viewBox="0 0 120 120" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill}>
        <path d="M46,70 C32,82 16,96 2,118 L48,118 C50,104 52,92 56,84Z" />
        <ellipse cx={58} cy={74} rx={17} ry={13} transform="rotate(-24 58 74)" />
        <path d="M64,66 Q56,46 66,28" fill="none" stroke={fill} strokeWidth={9} strokeLinecap="round" />
        <circle cx={68} cy={24} r={6.5} />
        <path d="M73,22 L82,25 L73,27Z" />
        {[-24, -6, 12].map((a, i) => (
          <g key={i} transform={`rotate(${a} 67 18)`}>
            <line x1={67} y1={18} x2={67} y2={6} stroke={fill} strokeWidth={1.2} />
            <circle cx={67} cy={5} r={2.2} />
          </g>
        ))}
        <path d="M56,86 L54,104 M62,86 L64,104" stroke={fill} strokeWidth={2.2} />
      </g>
      {eyes.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={5} ry={6} fill={eye} />
          <ellipse cx={x} cy={y + 1} rx={2.2} ry={2.8} fill="#0d2f4a" />
        </g>
      ))}
      <path d="M50,66 C56,64 64,70 66,78" fill="none" stroke={eye} strokeWidth={2.4} opacity={0.8} />
    </svg>
  );
}

/** Paithani border: silk band with zari teeth and a row of gold lotuses. */
export function PaithaniBorder({ width, height = 64, band, fill, flip = false }: { width: number; height?: number; band: string; fill: string; flip?: boolean }) {
  const id = uid(useId());
  const n = Math.max(3, Math.round(width / 62));
  return (
    <div style={{ position: "relative", width, height, transform: flip ? "scaleY(-1)" : undefined }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`pt-${id}`} width={12} height={10} patternUnits="userSpaceOnUse">
            <path d="M0,10 L6,0 L12,10Z" fill={fill} />
          </pattern>
          <pattern id={`ps-${id}`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={8} height={8} fill={band} />
            <rect width={1.4} height={8} fill={fill} opacity={0.35} />
          </pattern>
        </defs>
        <rect width={width} height={height} fill={`url(#ps-${id})`} />
        <g filter="url(#f-foil)">
          <rect y={height - 10} width={width} height={10} fill={`url(#pt-${id})`} />
          <rect y={0} width={width} height={4} fill={fill} />
          <rect y={height - 13} width={width} height={2} fill={fill} />
        </g>
      </svg>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: ((i + 0.5) * width) / n - 21, top: 8 }}>
          <LotusSide size={42} petal="#d4a72c" tip="#fff1b8" gold={fill} />
        </div>
      ))}
    </div>
  );
}

/** Mundavalya: strings of pearls tied across a Maharashtrian bride's and groom's forehead. */
export function Mundavalya({ height = 150, gold }: { height?: number; gold: string }) {
  const n = Math.floor((height - 34) / 9);
  return (
    <svg width={34} height={height} viewBox={`0 0 34 ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="pearl" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#efe8dc" />
          <stop offset="1" stopColor="#b9ad98" />
        </radialGradient>
      </defs>
      {[9, 25].map((x) =>
        Array.from({ length: n }, (_, i) => <circle key={`${x}-${i}`} cx={x} cy={5 + i * 9} r={4.2} fill="url(#pearl)" />),
      )}
      <g filter="url(#f-foil)" fill={gold}>
        <circle cx={17} cy={n * 9 + 6} r={6} />
        <path d={`M11,${n * 9 + 10} L23,${n * 9 + 10} L19,${height} L15,${height}Z`} />
      </g>
    </svg>
  );
}

/* ================= Grace (Christian) ================= */

/** Dove in flight, facing right. */
export function Dove({ width = 90, color = "#ffffff", line = "rgba(0,0,0,.25)", flip = false }: { width?: number; color?: string; line?: string; flip?: boolean }) {
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 100 70" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <g fill={color} stroke={line} strokeWidth={1} strokeLinejoin="round">
        <path d="M10,42 L0,33 L2,46Z" />
        <path d="M10,42 C26,31 52,31 70,35 L86,29 L82,37 C86,41 80,47 72,47 C56,53 30,53 10,42Z" />
        <path d="M36,37 C38,10 58,-2 74,3 C64,13 58,26 54,37Z" />
        <path d="M30,38 C26,18 36,6 46,4 C42,16 42,28 44,38Z" opacity={0.9} />
      </g>
      <circle cx={76} cy={36} r={1.4} fill="#333" />
    </svg>
  );
}

/** Two wedding bells tied with a bow. */
export function WeddingBells({ width = 110, fill, ribbon = "#ffffff" }: { width?: number; fill: string; ribbon?: string }) {
  const bell = (
    <g>
      <path d="M0,0 C-14,2 -16,22 -19,38 L19,38 C16,22 14,2 0,0Z" />
      <rect x={-21} y={37} width={42} height={5} rx={2.5} />
      <circle cx={0} cy={46} r={4.4} />
      <circle cx={0} cy={-2} r={3} />
    </g>
  );
  return (
    <svg width={width} height={width * 0.75} viewBox="-60 -24 120 90" style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill}>
        <g transform="translate(-20 -6) rotate(-18)">{bell}</g>
        <g transform="translate(20 -6) rotate(18)">{bell}</g>
      </g>
      <g fill={ribbon} stroke="rgba(0,0,0,.18)" strokeWidth={0.8}>
        <path d="M0,-12 C-14,-26 -30,-20 -24,-10 C-20,-4 -8,-8 0,-12Z" />
        <path d="M0,-12 C14,-26 30,-20 24,-10 C20,-4 8,-8 0,-12Z" />
        <path d="M-2,-12 L-12,14 L-6,12 L0,-8Z M2,-12 L12,14 L6,12 L0,-8Z" />
        <circle cx={0} cy={-12} r={4} />
      </g>
    </svg>
  );
}

/** Lily of the valley: an arching stem of little bells and two long leaves. */
export function LilySprig({ size = 120, leaf = "#7d9a6a", flower = "#ffffff", flip = false }: { size?: number; leaf?: string; flower?: string; flip?: boolean }) {
  const bells = Array.from({ length: 6 }, (_, i) => {
    const t = 0.25 + i * 0.13;
    const x = 20 + t * 70;
    const y = 30 + sin(t * Math.PI * 0.8) * -18 + t * 10;
    return [x, y + 8 + i * 1.2];
  });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: flip ? "scale(-1,-1)" : undefined, overflow: "visible" }}>
      <path d="M10,118 C14,80 30,40 70,10 C46,44 30,82 26,118Z" fill={leaf} opacity={0.9} />
      <path d="M18,118 C30,90 60,70 104,66 C70,78 44,96 32,118Z" fill={leaf} opacity={0.7} />
      <path d="M14,116 C20,70 40,34 96,30" fill="none" stroke={leaf} strokeWidth={1.6} />
      {bells.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y - 9} x2={x} y2={y - 3} stroke={leaf} strokeWidth={1} />
          <path d={`M${x - 5},${y + 4} C${x - 5},${y - 4} ${x + 5},${y - 4} ${x + 5},${y + 4} Q${x + 3},${y + 2} ${x + 1.5},${y + 5} Q${x},${y + 2} ${x - 1.5},${y + 5} Q${x - 3},${y + 2} ${x - 5},${y + 4}Z`} fill={flower} stroke="rgba(0,0,0,.4)" strokeWidth={0.8} />
        </g>
      ))}
    </svg>
  );
}

/** Stained-glass pointed window with a rose of coloured panes and lead lines. */
export function StainedGlass({ width = 200, height = 240, colors, lead = "#2b2b2b", fill }: { width?: number; height?: number; colors: string[]; lead?: string; fill: string }) {
  const id = uid(useId());
  const h0 = width * 0.55;
  const R = width * 0.82;
  const arch = `M0,${height} L0,${h0} A${R},${R} 0 0 1 ${width / 2},0 A${R},${R} 0 0 1 ${width},${h0} L${width},${height}Z`;
  const cx = width / 2;
  const cy = h0 * 0.95;
  const panes: React.ReactNode[] = [];
  const n = 12;
  for (let ring = 0; ring < 3; ring++) {
    const r0 = ring * 34;
    const r1 = r0 + 34;
    for (let i = 0; i < n; i++) {
      const a0 = rad((i / n) * 360);
      const a1 = rad(((i + 1) / n) * 360);
      panes.push(
        <path
          key={`${ring}-${i}`}
          d={`M${cx + cos(a0) * r0},${cy + sin(a0) * r0} L${cx + cos(a0) * r1},${cy + sin(a0) * r1} A${r1},${r1} 0 0 1 ${cx + cos(a1) * r1},${cy + sin(a1) * r1} L${cx + cos(a1) * r0},${cy + sin(a1) * r0}${r0 ? ` A${r0},${r0} 0 0 0 ${cx + cos(a0) * r0},${cy + sin(a0) * r0}` : ""}Z`}
          fill={colors[(i + ring * 2) % colors.length]}
          opacity={0.78}
        />,
      );
    }
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`sg-${id}`}>
          <path d={arch} />
        </clipPath>
      </defs>
      <g clipPath={`url(#sg-${id})`}>
        <rect width={width} height={height} fill={colors[0]} opacity={0.5} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={(i * width) / 8} y={h0 + 20} width={width / 8} height={height} fill={colors[(i + 1) % colors.length]} opacity={0.55} />
        ))}
        {panes}
        <g stroke={lead} strokeWidth={2} fill="none">
          {[34, 68, 102].map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <line key={i} x1={cx} y1={cy} x2={cx + cos(rad((i / n) * 360)) * 110} y2={cy + sin(rad((i / n) * 360)) * 110} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`v${i}`} x1={((i + 1) * width) / 8} y1={h0 + 20} x2={((i + 1) * width) / 8} y2={height} />
          ))}
          <line x1={0} y1={h0 + 20} x2={width} y2={h0 + 20} />
        </g>
      </g>
      <path d={arch} fill="none" stroke={fill} strokeWidth={5} filter="url(#f-foil)" />
      <g fill={fill} filter="url(#f-foil)">
        <rect x={cx - 2.5} y={-34} width={5} height={30} />
        <rect x={cx - 10} y={-26} width={20} height={5} />
      </g>
    </svg>
  );
}

/* ================= Madhubani (Mithila folk) ================= */

const MB = { red: "#c62828", yellow: "#f9a825", green: "#2e7d32", pink: "#d81b60", blue: "#1565c0" };

/** Madhubani double-line border: teeth, hatching and a red inner band. */
export function MadhuBorder({ width, height, line, band = 24 }: { width: number; height: number; line: string; band?: number }) {
  const id = uid(useId());
  const o = 12;
  const i = o + band;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id={`mt-${id}`} width={16} height={band} patternUnits="userSpaceOnUse">
          <path d={`M0,${band} L8,0 L16,${band}Z`} fill={MB.red} stroke={line} strokeWidth={1.4} />
          <path d={`M8,0 L16,${band} L16,0Z M0,0 L8,0 L0,${band}Z`} fill={MB.yellow} stroke={line} strokeWidth={1.4} />
        </pattern>
        <pattern id={`mh-${id}`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={5} stroke={line} strokeWidth={1.2} />
        </pattern>
      </defs>
      <path fillRule="evenodd" d={`M${o},${o} H${width - o} V${height - o} H${o}Z M${i},${i} H${width - i} V${height - i} H${i}Z`} fill={`url(#mt-${id})`} />
      <path fillRule="evenodd" d={`M${i},${i} H${width - i} V${height - i} H${i}Z M${i + 8},${i + 8} H${width - i - 8} V${height - i - 8} H${i + 8}Z`} fill={`url(#mh-${id})`} />
      <g fill="none" stroke={line} strokeWidth={2.4}>
        <rect x={o} y={o} width={width - o * 2} height={height - o * 2} />
        <rect x={i} y={i} width={width - i * 2} height={height - i * 2} />
        <rect x={i + 8} y={i + 8} width={width - (i + 8) * 2} height={height - (i + 8) * 2} strokeWidth={1.4} />
      </g>
    </svg>
  );
}

/** Madhubani sun: a face in a disc with red and yellow rays. */
export function MadhuSun({ size = 110, line }: { size?: number; line: string }) {
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120">
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M-6,-30 L0,-56 L6,-30Z" transform={`rotate(${i * 22.5})`} fill={i % 2 ? MB.red : MB.yellow} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      ))}
      <circle r={30} fill={MB.yellow} stroke={line} strokeWidth={2.4} />
      <circle r={25} fill="none" stroke={MB.red} strokeWidth={3} strokeDasharray="2 3" />
      <g fill="none" stroke={line} strokeWidth={1.8} strokeLinecap="round">
        <path d="M-15,-6 Q-9,-12 -3,-6 Q-9,-2 -15,-6Z" fill="#fff" />
        <path d="M3,-6 Q9,-12 15,-6 Q9,-2 3,-6Z" fill="#fff" />
        <path d="M-17,-11 Q-9,-17 -2,-11 M2,-11 Q9,-17 17,-11" />
        <path d="M0,-4 Q-3,6 2,8" />
        <path d="M-7,14 Q0,19 7,14 Q0,12 -7,14Z" fill={MB.red} />
      </g>
      <circle cx={-9} cy={-6} r={1.8} fill={line} />
      <circle cx={9} cy={-6} r={1.8} fill={line} />
    </svg>
  );
}

/** Madhubani fish facing right: bold outline, scales, stripes and a big eye. */
export function MadhuFish({ width = 130, line, body = MB.green, stripe = MB.red, flip = false }: { width?: number; line: string; body?: string; stripe?: string; flip?: boolean }) {
  const id = uid(useId());
  const outline = "M10,40 C30,8 80,6 110,34 C112,38 112,42 110,46 C80,74 30,72 10,40Z";
  return (
    <svg width={width} height={width * 0.62} viewBox="-30 0 150 80" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <defs>
        <clipPath id={`mf-${id}`}>
          <path d={outline} />
        </clipPath>
      </defs>
      <path d="M12,40 L-26,12 L-18,40 L-26,68Z" fill={stripe} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      <g stroke={line} strokeWidth={1.2}>
        {[-20, -12, -4].map((x) => (
          <line key={x} x1={x} y1={22 + (x + 20) * 0.6} x2={x} y2={58 - (x + 20) * 0.6} />
        ))}
      </g>
      <path d="M48,14 C54,0 72,0 80,14Z" fill={MB.yellow} stroke={line} strokeWidth={2} />
      <path d="M50,66 C56,78 70,78 76,66Z" fill={MB.yellow} stroke={line} strokeWidth={2} />
      <path d={outline} fill={body} />
      <g clipPath={`url(#mf-${id})`}>
        {[30, 44, 58, 72].map((x, i) => (
          <rect key={x} x={x} y={0} width={7} height={80} fill={i % 2 ? MB.yellow : stripe} />
        ))}
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 3 }, (_, c) => <path key={`${r}-${c}`} d={`M${36 + c * 14},${22 + r * 11} q5,5 0,10`} fill="none" stroke={line} strokeWidth={1.2} />),
        )}
      </g>
      <path d={outline} fill="none" stroke={line} strokeWidth={2.6} />
      <path d="M88,18 Q80,40 88,62" fill="none" stroke={line} strokeWidth={2} />
      <circle cx={98} cy={36} r={7} fill="#fff" stroke={line} strokeWidth={2} />
      <circle cx={99} cy={36} r={3} fill={line} />
    </svg>
  );
}

/** Madhubani lotus: outlined petals with hatching. */
export function MadhuLotus({ size = 90, line, petal = MB.pink }: { size?: number; line: string; petal?: string }) {
  const id = uid(useId());
  return (
    <svg width={size} height={size * 0.8} viewBox="-60 -56 120 96" style={{ overflow: "visible" }}>
      <defs>
        <pattern id={`ml-${id}`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={line} strokeWidth={0.8} />
        </pattern>
      </defs>
      {[
        [-60, 38],
        [60, 38],
        [-32, 48],
        [32, 48],
        [0, 54],
      ].map(([a, L], i) => (
        <g key={i} transform={`translate(0 30) rotate(${a})`}>
          <path d={`M0,0 C-${L * 0.36},-${L * 0.4} -${L * 0.24},-${L * 0.82} 0,-${L} C${L * 0.24},-${L * 0.82} ${L * 0.36},-${L * 0.4} 0,0Z`} fill={i === 4 ? MB.yellow : petal} stroke={line} strokeWidth={2} />
          <path d={`M0,-6 C-${L * 0.16},-${L * 0.4} -${L * 0.1},-${L * 0.7} 0,-${L * 0.82} C${L * 0.1},-${L * 0.7} ${L * 0.16},-${L * 0.4} 0,-6Z`} fill={`url(#ml-${id})`} stroke={line} strokeWidth={1} />
        </g>
      ))}
      <path d="M-26,30 Q0,44 26,30 Q0,36 -26,30Z" fill={MB.green} stroke={line} strokeWidth={2} />
    </svg>
  );
}

/* ================= Saath (illustrated couple) ================= */

const SKIN = "#d9a27a";

/** A faceless illustrated couple holding hands: groom in sherwani & safa, bride in lehenga. */
export function Couple({ width = 210, lehenga, sherwani = "#f3e3c3", stole, gold }: { width?: number; lehenga: string; sherwani?: string; stole: string; gold: string }) {
  return (
    <svg width={width} height={width * 1.05} viewBox="0 0 200 210" style={{ overflow: "visible" }}>
      {/* groom */}
      <g>
        <rect x={52} y={170} width={9} height={30} fill="#efe6d4" />
        <rect x={64} y={170} width={9} height={30} fill="#e6dcc8" />
        <path d="M48,200 L62,200 L62,206 L44,206Z M64,200 L78,200 L80,206 L64,206Z" fill={gold} />
        <path d="M38,66 L86,66 L94,172 L30,172Z" fill={sherwani} />
        <path d="M62,66 L62,172" stroke={gold} strokeWidth={1.4} />
        {[80, 96, 112, 128, 144].map((y) => (
          <circle key={y} cx={62} cy={y} r={1.6} fill={gold} />
        ))}
        <path d="M40,66 L54,66 L90,152 L80,160Z" fill={stole} opacity={0.92} />
        <path d="M38,68 C30,90 30,116 34,134" stroke={sherwani} strokeWidth={12} strokeLinecap="round" fill="none" />
        <circle cx={34} cy={138} r={5.5} fill={SKIN} />
        <path d="M86,70 C96,90 100,108 104,120" stroke={sherwani} strokeWidth={12} strokeLinecap="round" fill="none" />
        <rect x={56} y={52} width={12} height={14} fill={SKIN} />
        <circle cx={62} cy={42} r={15} fill={SKIN} />
        <path d="M45,40 Q45,20 62,19 Q81,20 79,40 Q62,32 45,40Z" fill={stole} />
        <path d="M45,40 Q62,30 79,40" stroke={gold} strokeWidth={2} fill="none" />
        <path d="M70,22 C74,10 82,6 86,4 C82,12 80,18 74,24Z" fill={gold} />
        <circle cx={66} cy={26} r={2.6} fill={gold} />
      </g>
      {/* bride */}
      <g>
        <path d="M112,112 L156,112 L182,204 L86,204Z" fill={lehenga} />
        <path d="M88,196 L180,196 L182,204 L86,204Z" fill={gold} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={104 + i * 15} cy={160} r={2.2} fill={gold} />
        ))}
        <path d="M116,66 L152,66 L156,112 L112,112Z" fill={lehenga} />
        <rect x={128} y={52} width={12} height={14} fill={SKIN} />
        <circle cx={134} cy={42} r={14} fill={SKIN} />
        <path d="M120,40 Q120,24 134,24 Q150,24 148,42 C156,60 160,90 166,150 C150,120 140,90 138,60 Q130,44 120,40Z" fill={stole} opacity={0.82} />
        <path d="M120,40 Q120,24 134,24 Q150,24 148,42" fill="none" stroke={gold} strokeWidth={2} />
        <path d="M116,70 C106,90 104,108 104,120" stroke={SKIN} strokeWidth={7} strokeLinecap="round" fill="none" />
        <circle cx={104} cy={122} r={5.5} fill={SKIN} />
        <circle cx={134} cy={31} r={2.4} fill={gold} />
      </g>
    </svg>
  );
}

/** Arch of pastel blooms and leaves (the couple stands beneath it). */
export function FloralArch({ width = 360, height = 330, colors, leaf = "#8fae8b", seed = 4 }: { width?: number; height?: number; colors: string[]; leaf?: string; seed?: number }) {
  const r = rng(seed);
  const R = width / 2 - 20;
  const cx = width / 2;
  const cy = R + 20;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 22; i++) {
    const a = rad(180 + (i / 22) * 180);
    pts.push([cx + cos(a) * R, cy + sin(a) * R, i]);
  }
  for (let y = cy + 20; y < height - 10; y += 26) {
    pts.push([cx - R, y, 30 + y], [cx + R, y, 31 + y]);
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <path d={`M${cx - R},${height} L${cx - R},${cy} A${R},${R} 0 0 1 ${cx + R},${cy} L${cx + R},${height}`} fill="none" stroke={leaf} strokeWidth={3} />
      {pts.map(([x, y], i) => {
        const a = r() * 360;
        return (
          <g key={`l${i}`} transform={`translate(${x} ${y}) rotate(${a})`}>
            <ellipse cx={12} cy={0} rx={11} ry={4.5} fill={leaf} opacity={0.85} />
          </g>
        );
      })}
      {pts.map(([x, y], i) => {
        const c = colors[i % colors.length];
        const s = 7 + r() * 6;
        return (
          <g key={`f${i}`} transform={`translate(${x + (r() - 0.5) * 8} ${y + (r() - 0.5) * 8})`}>
            {Array.from({ length: 5 }, (_, k) => (
              <circle key={k} cx={cos(rad(k * 72)) * s * 0.55} cy={sin(rad(k * 72)) * s * 0.55} r={s * 0.55} fill={c} />
            ))}
            <circle r={s * 0.32} fill="#fff6d8" />
          </g>
        );
      })}
    </svg>
  );
}

/** Low bush of blooms for the foreground corners. */
export function Bush({ width = 120, colors, leaf = "#8fae8b", seed = 2 }: { width?: number; colors: string[]; leaf?: string; seed?: number }) {
  const r = rng(seed);
  return (
    <svg width={width} height={width * 0.6} viewBox="0 0 120 72" style={{ overflow: "visible" }}>
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={`l${i}`} cx={10 + r() * 100} cy={40 + r() * 28} rx={16} ry={7} fill={leaf} transform={`rotate(${(r() - 0.5) * 60} 60 50)`} opacity={0.9} />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 14 + r() * 92;
        const y = 24 + r() * 34;
        const s = 8 + r() * 6;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {Array.from({ length: 5 }, (_, k) => (
              <circle key={k} cx={cos(rad(k * 72)) * s * 0.55} cy={sin(rad(k * 72)) * s * 0.55} r={s * 0.55} fill={colors[i % colors.length]} />
            ))}
            <circle r={s * 0.3} fill="#fff6d8" />
          </g>
        );
      })}
    </svg>
  );
}

/* ================= Jet Set (boarding pass) ================= */

/** Simple airliner silhouette, nose to the right. */
export function Plane({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill={color} d="M21.5,12 C21.5,11.2 20.8,10.6 20,10.6 L14.6,10.6 L9.6,3 L7.6,3 L10.2,10.6 L5.2,10.6 L3.6,8.4 L2,8.4 L3,12 L2,15.6 L3.6,15.6 L5.2,13.4 L10.2,13.4 L7.6,21 L9.6,21 L14.6,13.4 L20,13.4 C20.8,13.4 21.5,12.8 21.5,12Z" />
    </svg>
  );
}

/** Barcode from a seed (decorative). */
export function Barcode({ width = 300, height = 54, color = "#111", seed = 7 }: { width?: number; height?: number; color?: string; seed?: number }) {
  const r = rng(seed);
  const bars: React.ReactNode[] = [];
  let x = 0;
  while (x < width) {
    const w = 1 + Math.floor(r() * 3.2);
    if (r() > 0.38) bars.push(<rect key={x} x={x} y={0} width={w} height={height} fill={color} />);
    x += w + 1;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {bars}
    </svg>
  );
}
