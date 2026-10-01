"use client";
import React, { useId } from "react";
import { cos, rng, sin } from "@/lib/format";

/*
 * Wedding collection, batch 2 motifs: Bengali alpona, Punjabi phulkari,
 * Gujarati bandhani, Islamic geometry, and laser-cut lace. All procedural SVG.
 * Use `sin`/`cos` from format.ts (rounded) so server and client markup match.
 */

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");
const rad = (d: number) => (d * Math.PI) / 180;

/* ================= Alpona (Bengali) ================= */

/** Circular alpona: lotus centre, ring of curls, dots and a scalloped rim. Paths carry pathLength=1 for drawing. */
export function AlponaLotus({ size = 240, color = "#fffaf0", width = 2.4, className = "" }: { size?: number; color?: string; width?: number; className?: string }) {
  const L = 1;
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" className={className}>
      <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 8 }, (_, i) => (
          <g key={`p${i}`} transform={`rotate(${i * 45})`}>
            <path className="ap" pathLength={L} d="M0,-13 C-15,-22 -13,-40 0,-49 C13,-40 15,-22 0,-13Z" />
            <path className="ap" pathLength={L} d="M0,-19 L0,-40" />
          </g>
        ))}
        <circle className="ap" pathLength={L} r={55} />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={`c${i}`} className="ap" pathLength={L} transform={`rotate(${i * 22.5})`} d="M0,-59 C-9,-64 -7,-75 0,-77 C7,-75 9,-64 0,-59Z" />
        ))}
        <path
          className="ap"
          pathLength={L}
          d={Array.from({ length: 24 }, (_, i) => {
            const a0 = rad(i * 15 - 90);
            const a1 = rad((i + 1) * 15 - 90);
            return `${i ? "" : `M${cos(a0) * 90},${sin(a0) * 90}`} A12,12 0 0 1 ${cos(a1) * 90},${sin(a1) * 90}`;
          }).join(" ")}
        />
      </g>
      <g fill={color}>
        <circle r={8} className="ap-dot" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} className="ap-dot" cx={cos(rad(i * 22.5 + 11.25 - 90)) * 83} cy={sin(rad(i * 22.5 + 11.25 - 90)) * 83} r={2.6} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={`d${i}`} className="ap-dot" cx={cos(rad(i * 45 + 22.5 - 90)) * 36} cy={sin(rad(i * 45 + 22.5 - 90)) * 36} r={2.4} />
        ))}
      </g>
    </svg>
  );
}

/** Alpona border strip: a wavy vine with leaf loops and dots. */
export function AlponaVine({ width, height = 34, color = "#fffaf0" }: { width: number; height?: number; color?: string }) {
  const mid = height / 2;
  const per = 46;
  let d = `M0,${mid}`;
  for (let x = 0; x <= width; x += 4) d += ` L${x},${mid + sin((x / per) * Math.PI * 2) * 6}`;
  const loops: React.ReactNode[] = [];
  for (let i = 0; i * (per / 2) < width; i++) {
    const x = i * (per / 2) + per / 4;
    const up = i % 2 === 0;
    const y = mid + (up ? -6 : 6);
    loops.push(<path key={i} d={`M${x},${y} C${x - 6},${y + (up ? -6 : 6)} ${x - 2},${y + (up ? -13 : 13)} ${x + 2},${y + (up ? -13 : 13)} C${x + 6},${y + (up ? -10 : 10)} ${x + 4},${y + (up ? -4 : 4)} ${x},${y}Z`} />);
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <g fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round">
        <path d={d} />
        {loops}
      </g>
      <g fill={color}>
        {Array.from({ length: Math.floor(width / per) + 1 }, (_, i) => (
          <circle key={i} cx={i * per} cy={mid} r={2} />
        ))}
      </g>
    </svg>
  );
}

/** Corner swirl of the alpona frame. */
export function AlponaCorner({ size = 90, color = "#fffaf0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
        <path d="M6,94 C6,40 40,6 94,6" />
        <path d="M18,94 C18,50 50,18 94,18" opacity={0.7} />
        <path d="M30,60 C30,40 46,30 60,30 C52,36 48,44 50,52 C42,50 34,54 30,60Z" />
        <path d="M22,40 C14,34 16,22 26,22 C26,30 30,34 36,34" />
        <path d="M40,22 C34,14 22,16 22,26" />
      </g>
      <g fill={color}>
        <circle cx={60} cy={52} r={3} />
        <circle cx={70} cy={30} r={2.4} />
        <circle cx={30} cy={70} r={2.4} />
        <circle cx={44} cy={44} r={2} />
      </g>
    </svg>
  );
}

/** Prajapati: the butterfly that blesses a Bengali wedding card. */
export function Prajapati({ size = 80, fill, hole = "var(--paper)" }: { size?: number; fill: string; hole?: string }) {
  const wing = (
    <>
      <path d="M2,-3 C18,-40 50,-36 46,-10 C44,3 22,5 2,0Z" />
      <path d="M2,3 C22,5 38,16 28,33 C20,43 6,27 2,7Z" />
    </>
  );
  return (
    <svg width={size} height={size * 0.8} viewBox="-50 -40 100 80" style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill}>
        {wing}
        <g transform="scale(-1,1)">{wing}</g>
        <ellipse rx={3.4} ry={15} />
        <path d="M-1,-13 C-4,-24 -10,-30 -15,-31 M1,-13 C4,-24 10,-30 15,-31" fill="none" stroke={fill} strokeWidth={1.4} />
      </g>
      <g fill={hole}>
        {[1, -1].map((s) => (
          <g key={s} transform={`scale(${s},1)`}>
            <circle cx={30} cy={-15} r={5} />
            <circle cx={18} cy={-22} r={2.6} />
            <circle cx={20} cy={16} r={3.6} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** A pair of fish arching toward each other (joda maach), a Bengali sign of plenty. */
export function FishPair({ width = 160, fill, hole = "var(--paper)" }: { width?: number; fill: string; hole?: string }) {
  const fish = (
    <g>
      <path d="M8,30 C26,10 66,10 84,27 L100,15 L95,30 L100,45 L84,33 C66,50 26,50 8,30Z" />
      <path d="M40,14 C46,4 58,4 64,14Z" />
      <circle cx={20} cy={27} r={3} fill={hole} />
      <path d="M30,19 Q25,30 30,41" fill="none" stroke={hole} strokeWidth={1.6} />
      {[44, 56, 68].map((x) => (
        <path key={x} d={`M${x},20 Q${x - 5},30 ${x},40`} fill="none" stroke={hole} strokeWidth={1.1} opacity={0.8} />
      ))}
    </g>
  );
  return (
    <svg width={width} height={width * 0.42} viewBox="0 0 220 92" style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill}>
        <g transform="translate(112 46) rotate(-16) scale(-1 1) translate(0 -40)">{fish}</g>
        <g transform="translate(108 46) rotate(16) translate(0 -40)">{fish}</g>
      </g>
    </svg>
  );
}

/** Topor (groom's sola-pith crown) and mukut (bride's crown). */
export function Topor({ height = 110, fill, hole = "var(--paper)" }: { height?: number; fill: string; hole?: string }) {
  return (
    <svg width={height * 0.5} height={height} viewBox="0 0 60 120">
      <g filter="url(#f-foil)" fill={fill}>
        <path d="M30,0 L34,8 L30,14 L26,8Z" />
        <path d="M30,12 L52,102 Q30,110 8,102Z" />
        <rect x={6} y={100} width={48} height={10} rx={2} />
      </g>
      <g fill="none" stroke={hole} strokeWidth={1.4}>
        {[36, 58, 80].map((y) => {
          const half = 4 + (y - 12) * 0.245;
          return <path key={y} d={`M${30 - half},${y} ${Array.from({ length: 6 }, (_, i) => `Q${30 - half + ((i + 0.5) * half) / 3},${y + 5} ${30 - half + ((i + 1) * half) / 3},${y}`).join(" ")}`} />;
        })}
      </g>
      <g fill={hole}>
        {[24, 46, 68, 90].map((y) => (
          <circle key={y} cx={30} cy={y} r={2.2} />
        ))}
      </g>
    </svg>
  );
}

export function Mukut({ width = 90, fill, hole = "var(--paper)" }: { width?: number; fill: string; hole?: string }) {
  return (
    <svg width={width} height={width * 0.66} viewBox="0 0 90 60">
      <g filter="url(#f-foil)" fill={fill}>
        <path d="M5,52 L5,30 Q15,8 25,28 Q35,2 45,26 Q55,2 65,28 Q75,8 85,30 L85,52Z" />
        <rect x={2} y={50} width={86} height={8} rx={2} />
      </g>
      <g fill={hole}>
        {[15, 35, 55, 75].map((x, i) => (
          <circle key={i} cx={x} cy={38} r={3} />
        ))}
        {[25, 45, 65].map((x) => (
          <path key={x} d={`M${x},30 L${x + 3},38 L${x},44 L${x - 3},38Z`} />
        ))}
      </g>
    </svg>
  );
}

/* ================= Phulkari (Punjabi) ================= */

/** Satin-stitch hatch patterns, one per thread colour and direction. */
function Hatches({ id, colors }: { id: string; colors: string[] }) {
  return (
    <>
      {colors.map((c, i) =>
        [0, 90].map((a) => (
          <pattern key={`${i}-${a}`} id={`${id}-h${i}-${a}`} width={2.2} height={2.2} patternUnits="userSpaceOnUse" patternTransform={`rotate(${a + 45})`}>
            <rect width={2.2} height={2.2} fill={c} opacity={0.35} />
            <line x1={0} y1={1.1} x2={2.2} y2={1.1} stroke={c} strokeWidth={1.4} />
          </pattern>
        )),
      )}
    </>
  );
}

/** Embroidered diamond (bagh motif): four hatched triangles around a contrasting core. */
function Bagh({ id, cx, cy, r, a, b }: { id: string; cx: number; cy: number; r: number; a: number; b: number }) {
  const tri = (dx1: number, dy1: number, dx2: number, dy2: number) => `M${cx},${cy} L${cx + dx1},${cy + dy1} L${cx + dx2},${cy + dy2}Z`;
  const k = r * 0.42;
  return (
    <g>
      <path d={tri(0, -r, r, 0)} fill={`url(#${id}-h${a}-0)`} />
      <path d={tri(r, 0, 0, r)} fill={`url(#${id}-h${a}-90)`} />
      <path d={tri(0, r, -r, 0)} fill={`url(#${id}-h${a}-0)`} />
      <path d={tri(-r, 0, 0, -r)} fill={`url(#${id}-h${a}-90)`} />
      <path d={`M${cx},${cy - k} L${cx + k},${cy} L${cx},${cy + k} L${cx - k},${cy}Z`} fill={`url(#${id}-h${b}-0)`} />
    </g>
  );
}

export function PhulkariBand({ width, height = 70, colors, ground }: { width: number; height?: number; colors: string[]; ground: string }) {
  const id = uid(useId());
  const h = height;
  const r = h * 0.4;
  const n = Math.ceil(width / h) + 1;
  const off = (width - (n - 1) * h) / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <Hatches id={id} colors={colors} />
      </defs>
      <rect width={width} height={height} fill={ground} />
      {Array.from({ length: n }, (_, i) => (
        <Bagh key={i} id={id} cx={off + i * h} cy={h / 2} r={r} a={i % colors.length} b={(i + 1) % colors.length} />
      ))}
      {Array.from({ length: n - 1 }, (_, i) => {
        const x = off + i * h + h / 2;
        const s = h * 0.13;
        return <path key={`s${i}`} d={`M${x},${h / 2 - s} L${x + s},${h / 2} L${x},${h / 2 + s} L${x - s},${h / 2}Z`} fill={`url(#${id}-h${(i + 2) % colors.length}-90)`} />;
      })}
      <g stroke={colors[0]} strokeWidth={1.6} strokeDasharray="5 3">
        <line x1={0} y1={3} x2={width} y2={3} />
        <line x1={0} y1={h - 3} x2={width} y2={h - 3} />
      </g>
    </svg>
  );
}

/** Eight-petal phulkari star; each petal hatched along its own direction. */
export function StitchStar({ size = 80, colors }: { size?: number; colors: string[] }) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100">
      <defs>
        {Array.from({ length: 8 }, (_, i) => (
          <pattern key={i} id={`${id}-p${i}`} width={2.4} height={2.4} patternUnits="userSpaceOnUse" patternTransform={`rotate(${i * 45 + 90})`}>
            <rect width={2.4} height={2.4} fill={colors[i % 2]} opacity={0.35} />
            <line x1={0} y1={1.2} x2={2.4} y2={1.2} stroke={colors[i % 2]} strokeWidth={1.5} />
          </pattern>
        ))}
      </defs>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0,0 L-9,-22 L0,-46 L9,-22Z" transform={`rotate(${i * 45})`} fill={`url(#${id}-p${i})`} />
      ))}
      <circle r={7} fill={colors[2] ?? colors[0]} />
    </svg>
  );
}

/** Kaleera: the golden bridal hanging, a chain, a dome and dangling leaves. */
export function Kaleera({ height = 150, fill }: { height?: number; fill: string }) {
  const chain = height - 64;
  return (
    <svg width={44} height={height} viewBox={`0 0 44 ${height}`} style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill}>
        {Array.from({ length: Math.floor(chain / 7) }, (_, i) => (
          <circle key={i} cx={22} cy={4 + i * 7} r={2.4} />
        ))}
        <circle cx={22} cy={chain + 2} r={5} />
        <path d={`M4,${chain + 26} Q22,${chain - 4} 40,${chain + 26} Q22,${chain + 20} 4,${chain + 26}Z`} />
        {[6, 14, 22, 30, 38].map((x, i) => {
          const len = 14 + (2 - Math.abs(i - 2)) * 7;
          const y0 = chain + 25;
          return (
            <g key={x}>
              <line x1={x} y1={y0} x2={x} y2={y0 + len} stroke={fill} strokeWidth={0.9} />
              <path d={`M${x},${y0 + len} C${x - 4},${y0 + len + 4} ${x - 3},${y0 + len + 11} ${x},${y0 + len + 14} C${x + 3},${y0 + len + 11} ${x + 4},${y0 + len + 4} ${x},${y0 + len}Z`} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ================= Bandhani (Gujarati) ================= */

/** Tie-dye field: nine-dot rosettes with single dots between. */
export function BandhaniField({ width, height, dot = "#fff4d6", dot2 = "#f6c343", tile = 28 }: { width: number; height: number; dot?: string; dot2?: string; tile?: number }) {
  const id = uid(useId());
  const t = tile;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <pattern id={`bf-${id}`} width={t} height={t} patternUnits="userSpaceOnUse">
          <circle cx={t / 2} cy={t / 2} r={t * 0.065} fill={dot2} />
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={t / 2 + cos(rad(i * 45)) * t * 0.19} cy={t / 2 + sin(rad(i * 45)) * t * 0.19} r={t * 0.05} fill={dot} />
          ))}
          <circle cx={0} cy={0} r={t * 0.045} fill={dot} />
          <circle cx={t} cy={0} r={t * 0.045} fill={dot} />
          <circle cx={0} cy={t} r={t * 0.045} fill={dot} />
          <circle cx={t} cy={t} r={t * 0.045} fill={dot} />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#bf-${id})`} />
    </svg>
  );
}

/** Abhla: a little round mirror ringed with buttonhole stitches. */
export function Mirror({ size = 26, thread = "#f6c343" }: { size?: number; thread?: string }) {
  const id = uid(useId());
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100">
      <defs>
        <radialGradient id={`mr-${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9d1d9" />
          <stop offset="0.75" stopColor="#8a949e" />
          <stop offset="1" stopColor="#e6ebf0" />
        </radialGradient>
      </defs>
      <circle r={30} fill={`url(#mr-${id})`} />
      <g stroke={thread} strokeWidth={4.5} strokeLinecap="round">
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={cos(rad(i * 20)) * 33} y1={sin(rad(i * 20)) * 33} x2={cos(rad(i * 20)) * 47} y2={sin(rad(i * 20)) * 47} />
        ))}
      </g>
      <circle r={32} fill="none" stroke={thread} strokeWidth={3} />
    </svg>
  );
}

/** Garbo: the perforated clay pot with a lamp inside, carried in garba. */
export function Garbo({ size = 90, fill, glow = "#ffd36b" }: { size?: number; fill: string; glow?: string }) {
  const holes: React.ReactNode[] = [];
  for (let row = 0; row < 4; row++) {
    const y = 46 + row * 10;
    const n = row === 0 || row === 3 ? 5 : 7;
    const span = row === 0 || row === 3 ? 30 : 42;
    for (let i = 0; i < n; i++) holes.push(<circle key={`${row}-${i}`} cx={30 - span / 2 + (i * span) / (n - 1)} cy={y} r={row === 1 || row === 2 ? 2.4 : 1.8} />);
  }
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 92" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="garbo-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff9a1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={30} cy={14} rx={22} ry={18} fill="url(#garbo-glow)" className="flicker" />
      <path d="M30,2 C35,10 35,16 30,22 C25,16 25,10 30,2Z" fill="#ffcf4d" className="flicker" />
      <g filter="url(#f-foil)" fill={fill}>
        <path d="M20,30 C2,40 2,78 30,86 C58,78 58,40 40,30 L41,24 L19,24Z" />
        <ellipse cx={30} cy={24} rx={13} ry={3} />
      </g>
      <g fill={glow} className="flicker">
        {holes}
      </g>
    </svg>
  );
}

/** A pair of dandiya sticks, striped in thread colours, crossed. */
export function Dandiya({ length = 130, colors }: { length?: number; colors: string[] }) {
  const stick = (rot: number) => (
    <g transform={`rotate(${rot})`}>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={-length / 2 + (i * length) / 10} y={-4} width={length / 10 + 0.5} height={8} fill={colors[i % colors.length]} />
      ))}
      <rect x={-length / 2} y={-4} width={length} height={8} rx={4} fill="none" stroke="rgba(0,0,0,.25)" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={(s * length) / 2} cy={0} r={5} fill={colors[0]} stroke="rgba(0,0,0,.25)" />
          <path d={`M${(s * length) / 2},4 l-3,12 l6,0Z`} fill={colors[1]} />
        </g>
      ))}
    </g>
  );
  return (
    <svg width={length} height={length * 0.6} viewBox={`${-length / 2 - 8} ${-length * 0.3} ${length + 16} ${length * 0.6}`} style={{ overflow: "visible" }}>
      {stick(-22)}
      {stick(22)}
    </svg>
  );
}

/* ================= Noor (Islamic geometry) ================= */

/** Girih lattice of eight-point stars, tiled. */
export function Girih({ width, height, stroke, tile = 48, weight = 1 }: { width: number; height: number; stroke: string; tile?: number; weight?: number }) {
  const id = uid(useId());
  const t = tile;
  const c = t / 2;
  const r = t * 0.3;
  const sq = (a: number) =>
    Array.from({ length: 4 }, (_, i) => {
      const ang = rad(a + i * 90);
      return `${i ? "L" : "M"}${c + cos(ang) * r},${c + sin(ang) * r}`;
    }).join(" ") + "Z";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <pattern id={`gr-${id}`} width={t} height={t} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={stroke} strokeWidth={weight}>
            <path d={sq(0)} />
            <path d={sq(45)} />
            <path d={`M${c},${c - r} L${c},0 M${c},${c + r} L${c},${t} M${c - r},${c} L0,${c} M${c + r},${c} L${t},${c}`} />
            <circle cx={c} cy={c} r={r * 0.38} />
            <path d={`M0,${t * 0.18} L${t * 0.18},0 M${t - t * 0.18},0 L${t},${t * 0.18} M${t},${t - t * 0.18} L${t - t * 0.18},${t} M${t * 0.18},${t} L0,${t - t * 0.18}`} />
          </g>
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#gr-${id})`} />
    </svg>
  );
}

/** Pointed (ogee) arch, drawn as a double foil line with a finial. */
export function PointedArch({ width, height, fill }: { width: number; height: number; fill: string }) {
  const path = (i: number) => {
    const w = width - i * 2;
    const h0 = width * 0.55;
    const R = w * 0.82;
    return `M${i},${height} L${i},${h0} A${R},${R} 0 0 1 ${width / 2},${i * 1.6} A${R},${R} 0 0 1 ${width - i},${h0} L${width - i},${height}`;
  };
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <g fill="none" stroke={fill} filter="url(#f-foil)">
        <path d={path(0)} strokeWidth={2.6} />
        <path d={path(9)} strokeWidth={1} />
      </g>
      <g fill={fill} filter="url(#f-foil)">
        <path d={`M${width / 2},-26 L${width / 2 + 5},-12 L${width / 2},-4 L${width / 2 - 5},-12Z`} />
        <circle cx={width / 2} cy={-30} r={3} />
      </g>
    </svg>
  );
}

/** Fanoos: a hanging lantern with glowing cut windows. */
export function Lantern({ height = 130, fill, glow = "#ffcf6b" }: { height?: number; fill: string; glow?: string }) {
  const chain = height - 96;
  return (
    <svg width={44} height={height} viewBox={`0 0 44 ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="ln-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe6a0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffb040" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={22} cy={chain + 46} rx={34} ry={36} fill="url(#ln-glow)" className="flicker" />
      <line x1={22} y1={0} x2={22} y2={chain + 6} stroke={fill} strokeWidth={1.2} />
      <g transform={`translate(0 ${chain})`}>
        <path d="M10,24 L34,24 L38,52 L30,74 L14,74 L6,52Z" fill={glow} className="flicker" opacity={0.95} />
        <g filter="url(#f-foil)" fill={fill}>
          <path d="M10,22 Q22,4 34,22Z" />
          <circle cx={22} cy={6} r={3} />
          <path d="M10,24 L34,24 L38,52 L30,74 L14,74 L6,52Z M13,28 L20,28 L20,48 L11,48Z M24,28 L31,28 L33,48 L24,48Z M11,54 L20,54 L20,70 L16,70Z M24,54 L33,54 L28,70 L24,70Z" fillRule="evenodd" />
          <path d="M14,74 L30,74 L22,90Z" />
          <circle cx={22} cy={94} r={2.6} />
        </g>
      </g>
    </svg>
  );
}

/* ================= Jaali Lace (laser-cut) ================= */

/** Hole pattern of a laser-cut lace: petal rosettes with diamonds between. Black = cut. */
function LaceHoles({ id, t }: { id: string; t: number }) {
  const c = t / 2;
  return (
    <pattern id={id} width={t} height={t} patternUnits="userSpaceOnUse">
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx={c} cy={c - t * 0.2} rx={t * 0.06} ry={t * 0.13} transform={`rotate(${i * 60} ${c} ${c})`} fill="#000" />
      ))}
      <circle cx={c} cy={c} r={t * 0.05} fill="#000" />
      {[
        [0, 0],
        [t, 0],
        [0, t],
        [t, t],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x},${y - t * 0.1} L${x + t * 0.07},${y} L${x},${y + t * 0.1} L${x - t * 0.07},${y}Z`} fill="#000" />
      ))}
      {[
        [c, 0],
        [0, c],
        [t, c],
        [c, t],
      ].map(([x, y], i) => (
        <circle key={`m${i}`} cx={x} cy={y} r={t * 0.035} fill="#000" />
      ))}
    </pattern>
  );
}

/**
 * Laser-cut panel: a metallic sheet with lace cut-outs and an optional window.
 * Whatever is beneath shows through the holes (the page paper).
 */
export function LacePanel({
  width,
  height,
  fill,
  tile = 40,
  border = 22,
  window: win,
  scallop,
}: {
  width: number;
  height: number;
  fill: string;
  tile?: number;
  border?: number;
  window?: { x: number; y: number; w: number; h: number };
  /** scalloped edge on "top" or "bottom" */
  scallop?: "top" | "bottom";
}) {
  const id = uid(useId());
  const archPath = win ? `M${win.x},${win.y + win.h} L${win.x},${win.y + win.w / 2} A${win.w / 2},${win.w / 2} 0 0 1 ${win.x + win.w},${win.y + win.w / 2} L${win.x + win.w},${win.y + win.h}Z` : "";
  const sc = (() => {
    if (!scallop) return "";
    const r = 9;
    const n = Math.ceil(width / (r * 2));
    const y = scallop === "bottom" ? height : 0;
    let d = `M0,${y}`;
    for (let i = 0; i < n; i++) d += ` A${r},${r} 0 0 ${scallop === "bottom" ? 1 : 0} ${(i + 1) * r * 2},${y}`;
    return d + "Z";
  })();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="lace-panel" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <LaceHoles id={`lh-${id}`} t={tile} />
        <mask id={`lm-${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <rect width={width} height={height} fill="#fff" />
          <rect x={border} y={border} width={width - border * 2} height={height - border * 2} fill={`url(#lh-${id})`} />
          {win && <path d={archPath} fill="#000" />}
          {sc && <path d={sc} fill="#000" />}
        </mask>
      </defs>
      <rect width={width} height={height} fill={fill} mask={`url(#lm-${id})`} />
      {win && <path d={archPath} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={1} transform="translate(0.6 0.8)" />}
    </svg>
  );
}

/** Scatter of tiny sparkles (mirror glints / sequins), deterministic. */
export function Sparkles({ width, height, n = 24, color = "#fff", seed = 3 }: { width: number; height: number; n?: number; color?: string; seed?: number }) {
  const r = rng(seed);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * width;
        const y = r() * height;
        const s = 2 + r() * 4;
        return <path key={i} className="twinkle" style={{ animationDelay: `${(r() * 3).toFixed(2)}s` }} d={`M${x},${y - s} L${x + s * 0.25},${y} L${x},${y + s} L${x - s * 0.25},${y}Z M${x - s},${y} L${x},${y + s * 0.25} L${x + s},${y} L${x},${y - s * 0.25}Z`} fill={color} />;
      })}
    </svg>
  );
}
