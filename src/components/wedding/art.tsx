"use client";
import React, { useId } from "react";
import { cos, rng, sin } from "@/lib/format";
import { leafPath } from "@/components/card/ornaments";

/*
 * Procedural motifs for the wedding collection. Everything is drawn in SVG from
 * code (no stock art) so it stays crisp at any size and recolours per palette.
 * `fill` is usually a foil url (`url(#foil-gold)`), giving the hot-foil look.
 */

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

/* ================= Kovil (South Indian temple) ================= */

/** Temple tower: tiers of niches narrowing to a barrel vault and three kalasams. */
export function Gopuram({ width = 200, fill, hole = "var(--paper)", opacity = 1 }: { width?: number; fill: string; hole?: string; opacity?: number }) {
  const tiers = 5;
  return (
    <svg width={width} height={width * 1.12} viewBox="0 0 200 224" style={{ opacity }}>
      <g fill={fill}>
        {[80, 100, 120].map((x) => (
          <path key={x} d={`M${x},4 L${x + 3},14 Q${x + 7},18 ${x + 5},24 L${x - 5},24 Q${x - 7},18 ${x - 3},14Z`} />
        ))}
        <path d="M58,44 Q100,14 142,44 L142,50 L58,50Z" />
        {Array.from({ length: tiers }, (_, i) => {
          const wt = 92 + i * 22;
          const wb = wt + 14;
          const y0 = 52 + i * 32;
          const y1 = y0 + 30;
          const n = 3 + i;
          return (
            <g key={i}>
              <rect x={100 - wt / 2 - 6} y={y0 - 3} width={wt + 12} height={4} rx={1} />
              <path d={`M${100 - wt / 2},${y0} L${100 + wt / 2},${y0} L${100 + wb / 2},${y1} L${100 - wb / 2},${y1}Z`} />
              {Array.from({ length: n }, (_, k) => {
                const x = 100 - wt / 2 + ((k + 0.5) * wt) / n;
                return <path key={k} d={`M${x - 4},${y1 - 4} L${x - 4},${y0 + 11} A4,4 0 0 1 ${x + 4},${y0 + 11} L${x + 4},${y1 - 4}Z`} fill={hole} />;
              })}
            </g>
          );
        })}
        <rect x={20} y={212} width={160} height={12} />
        <path d="M92,224 L92,214 A8,8 0 0 1 108,214 L108,224Z" fill={hole} />
      </g>
    </svg>
  );
}

/** Kanjivaram zari border: a silk band with a row of temple spikes. */
export function TempleBorder({ width, height = 52, band, fill, flip = false }: { width: number; height?: number; band: string; fill: string; flip?: boolean }) {
  const id = uid(useId());
  const u = 26;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined }}>
      <defs>
        <pattern id={`tb-${id}`} width={u} height={height} patternUnits="userSpaceOnUse">
          <path d={`M0,${height - 8} L${u / 2},${height - 30} L${u},${height - 8}Z`} fill={fill} />
          <path d={`M${u * 0.3},${height - 8} L${u / 2},${height - 20} L${u * 0.7},${height - 8}Z`} fill={band} />
          <circle cx={u / 2} cy={height - 34} r={2} fill={fill} />
          <circle cx={0} cy={12} r={1.6} fill={fill} />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={band} />
      <rect width={width} height={height} fill={`url(#tb-${id})`} />
      <g filter="url(#f-foil)" fill={fill}>
        <rect y={0} width={width} height={5} />
        <rect y={height - 8} width={width} height={3} />
        <rect y={height - 3} width={width} height={1.2} />
      </g>
    </svg>
  );
}

/** Mango-leaf thoranam strung across a doorway, with marigolds. */
export function Thoranam({ width, leaf = "#3f7d2c", flower = "#f39c12", seed = 2 }: { width: number; leaf?: string; flower?: string; seed?: number }) {
  const r = rng(seed);
  const n = Math.floor(width / 20);
  const y = (x: number) => 6 + sin((x / width) * Math.PI) * 12;
  return (
    <svg width={width} height={62} viewBox={`0 0 ${width} 62`} style={{ display: "block", overflow: "visible" }}>
      <path d={`M0,6 Q${width / 2},30 ${width},6`} stroke="#7a5a2a" strokeWidth={1.4} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const x = 10 + i * 20;
        const flowerHere = i % 3 === 1;
        return flowerHere ? (
          <g key={i}>
            <circle cx={x} cy={y(x) + 7} r={6.5} fill={flower} />
            <circle cx={x} cy={y(x) + 7} r={3} fill="#c0560c" opacity={0.6} />
          </g>
        ) : (
          <g key={i}>
            <path d={leafPath(x, y(x), 34 + r() * 8, 8.5, 90 + (r() - 0.5) * 14)} fill={leaf} />
            <path d={`M${x},${y(x)} L${x + (r() - 0.5) * 3},${y(x) + 30}`} stroke="rgba(255,255,255,.35)" strokeWidth={0.8} />
          </g>
        );
      })}
    </svg>
  );
}

/** Kuthuvilakku: tall brass lamp with five flames. */
export function Kuthuvilakku({ height = 150, fill }: { height?: number; fill: string }) {
  const flames = [8, 19, 30, 41, 52];
  return (
    <svg width={height * 0.4} height={height} viewBox="0 0 60 150" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="kv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff9a1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={30} cy={30} rx={40} ry={26} fill="url(#kv-glow)" className="flicker" />
      {flames.map((x, i) => (
        <path key={i} className="flicker" style={{ animationDelay: `${i * 0.21}s` }} d={`M${x},38 C${x + 4},31 ${x + 3},25 ${x},19 C${x - 3},25 ${x - 4},31 ${x},38Z`} fill="#ffcf4d" />
      ))}
      <g filter="url(#f-foil)" fill={fill}>
        <path d="M30,0 L34,9 L30,14 L26,9Z" />
        <ellipse cx={30} cy={16} rx={6} ry={2} />
        <rect x={28} y={16} width={4} height={22} />
        <path d="M6,40 Q30,58 54,40Z" />
        <ellipse cx={30} cy={40} rx={24} ry={4.5} />
        <rect x={28} y={50} width={4} height={72} />
        {[64, 86, 106].map((y) => (
          <ellipse key={y} cx={30} cy={y} rx={6} ry={3.6} />
        ))}
        <ellipse cx={30} cy={124} rx={12} ry={3.5} />
        <path d="M15,128 L45,128 L52,141 L8,141Z" />
        <ellipse cx={30} cy={144} rx={25} ry={5} />
      </g>
    </svg>
  );
}

/** Hanging temple bell on a chain. */
export function TempleBell({ length = 90, fill }: { length?: number; fill: string }) {
  const chain = Math.max(10, length - 50);
  return (
    <svg width={40} height={length} viewBox={`0 0 40 ${length}`} style={{ overflow: "visible" }}>
      <g filter="url(#f-foil)" fill={fill}>
        {Array.from({ length: Math.floor(chain / 6) }, (_, i) => (
          <ellipse key={i} cx={20} cy={3 + i * 6} rx={2} ry={3} fill="none" stroke={fill} strokeWidth={1.3} />
        ))}
        <path d={`M20,${chain} C9,${chain + 2} 9,${chain + 18} 6,${chain + 32} L34,${chain + 32} C31,${chain + 18} 31,${chain + 2} 20,${chain}Z`} />
        <rect x={3} y={chain + 32} width={34} height={4} rx={2} />
        <circle cx={20} cy={chain + 42} r={4} />
      </g>
    </svg>
  );
}

/** Rice-flour kolam: a lotus of loops around a dot grid. */
export function Kolam({ size = 120, color = "#fffaf0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120">
      <g fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" filter="url(#f-chalk)">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx={0} cy={-24} rx={9} ry={20} transform={`rotate(${i * 45})`} />
        ))}
        <circle r={10} />
        <circle r={50} strokeDasharray="1 7" strokeWidth={2.4} />
      </g>
      <g fill={color} filter="url(#f-chalk)">
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={cos(((i * 45 + 22.5) * Math.PI) / 180) * 36} cy={sin(((i * 45 + 22.5) * Math.PI) / 180) * 36} r={2.4} />
        ))}
        <circle r={2.6} />
      </g>
    </svg>
  );
}

/* ================= Rajwada (Rajasthani royal) ================= */

/** Mewar sun: a disc with alternating straight and flame rays. */
export function MewarSun({ size = 120, fill, hole = "var(--paper)" }: { size?: number; fill: string; hole?: string }) {
  const rays = 16;
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120">
      <g filter="url(#f-foil)" fill={fill}>
        {Array.from({ length: rays }, (_, i) => {
          const a = (i / rays) * 360;
          return i % 2 ? (
            <path key={i} d="M-4,-30 C-8,-38 2,-42 -2,-50 C6,-44 4,-36 4,-30Z" transform={`rotate(${a})`} />
          ) : (
            <path key={i} d="M-5,-30 L0,-58 L5,-30Z" transform={`rotate(${a})`} />
          );
        })}
        <circle r={29} />
        <circle r={23} fill={hole} />
        <circle r={20} />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M-0.8,-6 L0,-17 L0.8,-6Z" fill={hole} transform={`rotate(${i * 15})`} />
        ))}
        <circle r={5} fill={hole} />
      </g>
    </svg>
  );
}

/** Decorated elephant, side view facing right, trunk raised. */
export function Elephant({ width = 140, fill, cloth, hole = "var(--paper)", flip = false }: { width?: number; fill: string; cloth: string; hole?: string; flip?: boolean }) {
  return (
    <svg width={width} height={width * 0.75} viewBox="0 0 124 92" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <g filter="url(#f-foil)">
        <path
          fill={fill}
          d="M14,30 C14,18 30,12 48,12 C62,12 72,14 80,16 C86,8 104,8 108,22 C110,30 108,38 106,42 L104,48 C100,54 92,56 88,56 L88,84 L78,84 L78,64 L74,64 L74,84 L64,84 L64,62 C56,65 50,65 44,62 L44,84 L34,84 L34,64 L28,62 L26,84 L16,84 L16,58 C12,50 12,40 14,30Z"
        />
        <path d="M104,40 C110,54 118,56 121,46 C122,39 118,35 114,37" fill="none" stroke={fill} strokeWidth={7} strokeLinecap="round" />
        <path d="M14,32 C8,38 8,48 10,56" fill="none" stroke={fill} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <path d="M103,46 C106,51 110,52 113,50" fill="none" stroke="#fffaf0" strokeWidth={2.6} strokeLinecap="round" />
      <path d="M84,22 C78,24 76,40 82,47 C88,45 92,34 90,24Z" fill="#000" opacity={0.18} />
      <circle cx={99} cy={24} r={1.8} fill={hole} />
      {/* jhool: saddle cloth with a foil border and tassels */}
      <path d="M34,13 L68,14 L70,47 L32,47Z" fill={cloth} />
      <path d="M34,13 L68,14 L70,47 L32,47Z" fill="none" stroke={fill} strokeWidth={2.4} filter="url(#f-foil)" />
      {[36, 42, 48, 54, 60, 66].map((x) => (
        <circle key={x} cx={x} cy={50} r={1.8} fill={fill} filter="url(#f-foil)" />
      ))}
      <circle cx={51} cy={30} r={6} fill="none" stroke={fill} strokeWidth={1.6} filter="url(#f-foil)" />
      {/* forehead ornament and anklets */}
      <path d="M92,12 L100,10 L104,18 L96,20Z" fill={cloth} />
      {[20, 38, 68, 82].map((x) => (
        <rect key={x} x={x - 4} y={76} width={10} height={2.4} fill={hole} opacity={0.7} />
      ))}
    </svg>
  );
}

/** Rajput multifoil (cusped) arch, drawn as a double foil line. */
export function CuspedArch({ width, height, fill, lobes = 11 }: { width: number; height: number; fill: string; lobes?: number }) {
  const R = width / 2;
  const cy = R;
  const pts = Array.from({ length: lobes + 1 }, (_, i) => {
    const a = Math.PI + (i / lobes) * Math.PI;
    return [R + cos(a) * R, cy + sin(a) * R];
  });
  const lobe = (R * Math.PI) / lobes / 1.7;
  const path = (inset: number) => {
    const s = (v: number[]) => [R + (v[0] - R) * (1 - inset / R), cy + (v[1] - cy) * (1 - inset / R)];
    const p = pts.map(s);
    let d = `M${inset},${height} L${p[0][0]},${p[0][1]}`;
    for (let i = 1; i < p.length; i++) d += ` A${lobe},${lobe} 0 0 1 ${p[i][0]},${p[i][1]}`;
    d += ` L${width - inset},${height}`;
    return d;
  };
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <g fill="none" stroke={fill} filter="url(#f-foil)">
        <path d={path(0)} strokeWidth={3} />
        <path d={path(9)} strokeWidth={1} />
      </g>
    </svg>
  );
}

/** Block-print buti strip (vermilion), tiled along a border. */
export function ButiBand({ width, height = 18, color, fill }: { width: number; height?: number; color: string; fill: string }) {
  const id = uid(useId());
  const u = height * 1.4;
  const h = height;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <pattern id={`bb-${id}`} width={u} height={h} patternUnits="userSpaceOnUse">
          <circle cx={u / 2} cy={h / 2} r={h * 0.18} fill={color} />
          {[0, 90, 180, 270].map((a) => (
            <ellipse key={a} cx={u / 2} cy={h / 2 - h * 0.28} rx={h * 0.09} ry={h * 0.16} fill={color} transform={`rotate(${a} ${u / 2} ${h / 2})`} />
          ))}
          <circle cx={0} cy={h / 2} r={h * 0.07} fill={color} />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#bb-${id})`} filter="url(#f-blockink)" />
      <g fill={fill} filter="url(#f-foil)">
        <rect width={width} height={1.4} />
        <rect y={height - 1.4} width={width} height={1.4} />
      </g>
    </svg>
  );
}

/** Marigold string swag (between the elephants' trunks). */
export function MarigoldSwag({ width, sag = 30, color = "#f39c12" }: { width: number; sag?: number; color?: string }) {
  const n = Math.floor(width / 9);
  return (
    <svg width={width} height={sag + 14} viewBox={`0 0 ${width} ${sag + 14}`} style={{ overflow: "visible" }}>
      {Array.from({ length: n + 1 }, (_, i) => {
        const t = i / n;
        const x = t * width;
        const y = 6 + sin(t * Math.PI) * sag;
        return <circle key={i} cx={x} cy={y} r={5} fill={i % 4 === 0 ? "#c0392b" : color} />;
      })}
    </svg>
  );
}

/* ================= Gulmohar (watercolour florals) ================= */

/** A gulmohar blossom: four flame petals and one streaked standard petal, long stamens. */
export function Gulmohar({ size = 80, petal = "#e8572a", deep = "#b8321e", rotate = 0, seed = 1 }: { size?: number; petal?: string; deep?: string; rotate?: number; seed?: number }) {
  const id = uid(useId());
  const r = rng(seed);
  const petalD = "M0,0 C-15,-8 -22,-34 -10,-45 C-4,-50 4,-50 10,-45 C22,-34 15,-8 0,0Z";
  return (
    <svg width={size} height={size} viewBox="-55 -55 110 110" style={{ transform: `rotate(${rotate}deg)`, overflow: "visible" }}>
      <defs>
        <radialGradient id={`gp-${id}`} cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor={deep} />
          <stop offset="0.7" stopColor={petal} />
          <stop offset="1" stopColor={petal} stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <g filter="url(#f-wc)">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={petalD} transform={`rotate(${i * 72 + (r() - 0.5) * 10}) scale(${0.9 + r() * 0.2})`} fill={i === 0 ? "#fbf1dc" : `url(#gp-${id})`} opacity={0.92} />
        ))}
        {Array.from({ length: 7 }, (_, k) => (
          <path key={k} d={`M0,-6 L${(k - 3) * 3},-36`} stroke={deep} strokeWidth={1.4} opacity={0.75} />
        ))}
      </g>
      {Array.from({ length: 9 }, (_, k) => {
        const a = ((k / 9) * 140 + 200) * (Math.PI / 180);
        const L = 30 + r() * 10;
        const x = cos(a) * L;
        const y = sin(a) * L;
        return (
          <g key={k}>
            <path d={`M0,0 Q${x * 0.4 + 6},${y * 0.5} ${x},${y}`} stroke={deep} strokeWidth={1} fill="none" />
            <ellipse cx={x} cy={y} rx={1.6} ry={2.6} fill="#7a2a12" />
          </g>
        );
      })}
    </svg>
  );
}

/** Bipinnate gulmohar leaf: a curved rachis with fine paired leaflets. */
export function Fern({ length = 120, color = "#7d9a5a", angle = 0, curl = 0.18, seed = 3 }: { length?: number; color?: string; angle?: number; curl?: number; seed?: number }) {
  const r = rng(seed);
  const n = Math.floor(length / 7);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return { x: t * length, y: sin(t * Math.PI * 0.9) * length * curl, t };
  });
  return (
    <svg width={length * 1.1} height={length * 1.1} viewBox={`${-length * 0.05} ${-length * 0.55} ${length * 1.1} ${length * 1.1}`} style={{ transform: `rotate(${angle}deg)`, overflow: "visible" }}>
      <g filter="url(#f-wc)">
        <path d={`M0,0 ${pts.map((p) => `L${p.x},${p.y}`).join(" ")}`} stroke={color} strokeWidth={1.4} fill="none" />
        {pts.slice(1, -1).map((p, i) => {
          const s = 1 - p.t * 0.7;
          const len = 9 * s + r() * 2;
          return (
            <g key={i} fill={color} opacity={0.85}>
              <ellipse cx={p.x} cy={p.y - len / 2} rx={2 * s + 0.6} ry={len / 2} transform={`rotate(22 ${p.x} ${p.y})`} />
              <ellipse cx={p.x} cy={p.y + len / 2} rx={2 * s + 0.6} ry={len / 2} transform={`rotate(-22 ${p.x} ${p.y})`} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Soft watercolour wash: an irregular blob with bleeding edges. */
export function Wash({ width, height, color, seed = 1, opacity = 0.35 }: { width: number; height: number; color: string; seed?: number; opacity?: number }) {
  const r = rng(seed);
  const n = 14;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 0.75 + r() * 0.25;
    return [width / 2 + cos(a) * (width / 2) * k, height / 2 + sin(a) * (height / 2) * k];
  });
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    d += ` Q${a[0]},${a[1]} ${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <path d={d + "Z"} fill={color} opacity={opacity} filter="url(#f-wc)" />
      <path d={d + "Z"} fill="none" stroke={color} strokeWidth={2} opacity={opacity * 0.8} filter="url(#f-wc)" />
    </svg>
  );
}

/** A gulmohar spray: ferns, blossoms and buds arranged as one corner piece. */
export function GulmoharSpray({ width = 260, petal, deep, leaf, seed = 1, flip = false }: { width?: number; petal: string; deep: string; leaf: string; seed?: number; flip?: boolean }) {
  const r = rng(seed * 13 + 1);
  const s = width / 260;
  const flowers = [
    [40, 40, 74, 0],
    [104, 26, 56, 40],
    [26, 106, 58, -30],
    [150, 64, 40, 80],
    [70, 92, 46, 15],
  ];
  return (
    <div className="gm-spray" style={{ width, height: width * 0.8, transform: flip ? "scale(-1,-1)" : undefined }}>
      {[
        [10, 40, 170, 18],
        [20, 30, 150, 48],
        [30, 60, 120, -20],
        [0, 20, 110, 70],
      ].map(([x, y, len, a], i) => (
        <div key={`f${i}`} className="gm-abs" style={{ left: x * s, top: y * s }}>
          <Fern length={len * s} color={leaf} angle={a} seed={seed + i} />
        </div>
      ))}
      {flowers.map(([x, y, sz, rot], i) => (
        <div key={i} className="gm-abs" style={{ left: (x - sz / 2) * s, top: (y - sz / 2) * s }}>
          <Gulmohar size={sz * s} petal={petal} deep={deep} rotate={rot + r() * 20} seed={seed + i * 3} />
        </div>
      ))}
      {[
        [178, 30],
        [130, 110],
        [190, 82],
      ].map(([x, y], i) => (
        <svg key={`b${i}`} className="gm-abs" style={{ left: x * s, top: y * s }} width={14 * s} height={14 * s} viewBox="-7 -7 14 14">
          <circle r={5} fill={deep} filter="url(#f-wc)" />
        </svg>
      ))}
    </div>
  );
}

/* ================= Ink & Ivory (minimal) ================= */

/** Single-line laurel wreath, open at the top. */
export function Laurel({ size = 220, color, stroke = 1.1 }: { size?: number; color: string; stroke?: number }) {
  const R = 96;
  const leaves: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 13; i++) {
      const a = (90 + side * (18 + i * 10.5)) * (Math.PI / 180);
      const x = cos(a) * R;
      const y = sin(a) * R;
      const tangent = (a * 180) / Math.PI + (side > 0 ? 90 : -90);
      const k = 1 - i * 0.035;
      leaves.push(<path key={`${side}o${i}`} d={leafPath(x, y, 22 * k, 6 * k, tangent - side * 28)} />);
      leaves.push(<path key={`${side}i${i}`} d={leafPath(x, y, 18 * k, 5 * k, tangent + side * 32)} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox="-120 -120 240 240">
      <g fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round">
        {[-1, 1].map((side) => (
          <path
            key={side}
            d={Array.from({ length: 30 }, (_, i) => {
              const a = (90 + side * (10 + i * 4.8)) * (Math.PI / 180);
              return `${i ? "L" : "M"}${cos(a) * R},${sin(a) * R}`;
            }).join(" ")}
          />
        ))}
        {leaves}
      </g>
    </svg>
  );
}

/* ================= Pichwai (Nathdwara folk art) ================= */

/** Side-view lotus: a fan of pointed petals with gold outlines. */
export function LotusSide({ size = 90, petal = "#e98aa5", tip = "#fde7ee", gold }: { size?: number; petal?: string; tip?: string; gold: string }) {
  const id = uid(useId());
  const petals = [
    [-62, 34],
    [62, 34],
    [-40, 44],
    [40, 44],
    [-18, 50],
    [18, 50],
    [0, 54],
  ];
  return (
    <svg width={size} height={size * 0.8} viewBox="-60 -56 120 96" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`lp-${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={petal} />
          <stop offset="1" stopColor={tip} />
        </linearGradient>
      </defs>
      {petals.map(([a, L], i) => (
        <g key={i} transform={`translate(0 30) rotate(${a})`}>
          <path d={`M0,0 C-${L * 0.32},-${L * 0.35} -${L * 0.22},-${L * 0.8} 0,-${L} C${L * 0.22},-${L * 0.8} ${L * 0.32},-${L * 0.35} 0,0Z`} fill={`url(#lp-${id})`} stroke={gold} strokeWidth={1.2} />
          <path d={`M0,-4 L0,-${L * 0.85}`} stroke={petal} strokeWidth={0.8} opacity={0.6} />
        </g>
      ))}
      <path d="M-14,30 Q0,40 14,30 Q0,34 -14,30Z" fill="#3e7a4a" />
    </svg>
  );
}

/** Top-down full-bloom lotus, used as a mandala behind text. */
export function LotusTop({ size = 300, fill, opacity = 1, rings = 3 }: { size?: number; fill: string; opacity?: number; rings?: number }) {
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ opacity }}>
      <g fill="none" stroke={fill} strokeWidth={1.1}>
        {Array.from({ length: rings }, (_, ring) => {
          const n = 8 + ring * 4;
          const L = 40 + ring * 22;
          return Array.from({ length: n }, (_, i) => (
            <path key={`${ring}-${i}`} transform={`rotate(${(i / n) * 360 + ring * 11})`} d={`M0,-${L - 34} C-${10 + ring * 3},-${L - 18} -${8 + ring * 2},-${L - 4} 0,-${L} C${8 + ring * 2},-${L - 4} ${10 + ring * 3},-${L - 18} 0,-${L - 34}Z`} />
          ));
        })}
        <circle r={10} />
        <circle r={4} fill={fill} />
      </g>
    </svg>
  );
}

/** Lily pad seen from above, with a notch and veins. */
export function LotusLeaf({ width = 70, color = "#2f6b4a", vein = "#6fae7f", rotate = 0 }: { width?: number; color?: string; vein?: string; rotate?: number }) {
  return (
    <svg width={width} height={width * 0.5} viewBox="-50 -25 100 50" style={{ transform: `rotate(${rotate}deg)`, overflow: "visible" }}>
      <path d="M0,0 L44,-6 A46,22 0 1,1 44,6Z" fill={color} />
      <g stroke={vein} strokeWidth={0.9} opacity={0.8}>
        {[-150, -110, -70, -30, 30, 70, 110, 150, 180].map((a) => (
          <line key={a} x1={0} y1={0} x2={cos((a * Math.PI) / 180) * 42} y2={sin((a * Math.PI) / 180) * 20} />
        ))}
      </g>
    </svg>
  );
}

/** Pichwai cow: white folk-art cow facing right, with a bell collar and cloth. */
export function Cow({ width = 120, body = "#f8f1e4", line = "#3b2a1a", cloth = "#c2185b", gold, flip = false }: { width?: number; body?: string; line?: string; cloth?: string; gold: string; flip?: boolean }) {
  return (
    <svg width={width} height={width * 0.75} viewBox="0 0 124 92" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <path d="M100,16 C96,9 97,4 101,1 M106,16 C108,9 111,6 115,5" fill="none" stroke={line} strokeWidth={2.4} strokeLinecap="round" />
      <path
        fill={body}
        stroke={line}
        strokeWidth={1.4}
        d="M22,30 C30,24 70,24 84,26 L92,20 C96,14 104,13 108,18 L115,30 C116,36 113,40 108,40 C104,40 100,38 97,40 L89,50 C87,56 85,60 83,62 L83,86 L78,86 L76,64 L71,64 L71,86 L66,86 L64,62 C52,64 40,64 32,62 L32,86 L27,86 L26,64 L22,64 L22,86 L17,86 L16,60 C14,50 16,36 22,30Z"
      />
      <path d="M22,33 C13,42 13,60 16,70" fill="none" stroke={line} strokeWidth={1.4} />
      <path d="M14,68 L18,76 L20,68Z" fill={line} />
      <path d="M97,22 C92,20 88,22 86,25 C90,27 94,26 97,24Z" fill={body} stroke={line} strokeWidth={1.2} />
      <circle cx={104} cy={24} r={1.6} fill={line} />
      {/* saddle cloth */}
      <path d="M38,26 C50,25 62,25 72,26 L70,52 C58,54 48,54 40,52Z" fill={cloth} />
      <path d="M38,26 C50,25 62,25 72,26 L70,52 C58,54 48,54 40,52Z" fill="none" stroke={gold} strokeWidth={2} filter="url(#f-foil)" />
      {[44, 50, 56, 62, 68].map((x) => (
        <circle key={x} cx={x} cy={39} r={1.6} fill={gold} filter="url(#f-foil)" />
      ))}
      {/* bell collar */}
      <path d="M92,38 Q96,46 90,52" fill="none" stroke={gold} strokeWidth={2.2} filter="url(#f-foil)" />
      <circle cx={90} cy={55} r={3.4} fill={gold} filter="url(#f-foil)" />
      {[22, 31, 70, 82].map((x) => (
        <rect key={x} x={x - 4.5} y={79} width={7} height={2.2} fill={gold} filter="url(#f-foil)" />
      ))}
    </svg>
  );
}

/** Jasmine strands hanging in swags from the top edge. */
export function JasmineSwags({ width, swags = 4, drop = 34, color = "#fffaf0", bud = "#f6c343" }: { width: number; swags?: number; drop?: number; color?: string; bud?: string }) {
  const w = width / swags;
  return (
    <svg width={width} height={drop + 40} viewBox={`0 0 ${width} ${drop + 40}`} style={{ display: "block", overflow: "visible" }}>
      {Array.from({ length: swags }, (_, s) =>
        Array.from({ length: 15 }, (_, i) => {
          const t = i / 14;
          return <circle key={`${s}-${i}`} cx={s * w + t * w} cy={4 + sin(t * Math.PI) * drop} r={3} fill={color} />;
        }),
      )}
      {Array.from({ length: swags + 1 }, (_, s) => (
        <g key={`t${s}`}>
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={s * w} cy={8 + i * 6} r={2.6} fill={color} />
          ))}
          <circle cx={s * w} cy={42} r={4} fill={bud} />
        </g>
      ))}
    </svg>
  );
}

/** Lotus pond band: water, pads, buds and side-view lotuses. */
export function LotusPond({ width, height = 120, water, gold, petal, seed = 4 }: { width: number; height?: number; water: string; gold: string; petal: string; seed?: number }) {
  const r = rng(seed);
  const n = Math.round(width / 70);
  return (
    <div className="pw-pond" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <rect y={height * 0.35} width={width} height={height * 0.65} fill={water} />
        <g stroke={gold} strokeWidth={1} fill="none" opacity={0.55} filter="url(#f-foil)">
          {Array.from({ length: 6 }, (_, k) => {
            const y = height * 0.42 + k * (height * 0.1);
            let d = `M0,${y}`;
            for (let x = 0; x <= width; x += 16) d += ` Q${x + 4},${y - 3} ${x + 8},${y} T${x + 16},${y}`;
            return <path key={k} d={d} />;
          })}
        </g>
        <path d={`M0,${height * 0.35} L${width},${height * 0.35}`} stroke={gold} strokeWidth={2} filter="url(#f-foil)" />
      </svg>
      {Array.from({ length: n * 2 }, (_, i) => (
        <div key={`l${i}`} className="pw-abs" style={{ left: r() * (width - 60), top: height * 0.45 + r() * height * 0.38 }}>
          <LotusLeaf width={50 + r() * 26} rotate={(r() - 0.5) * 30} />
        </div>
      ))}
      {Array.from({ length: n }, (_, i) => {
        const x = ((i + 0.5) / n) * width;
        const sz = 56 + r() * 18;
        return (
          <div key={`f${i}`} className="pw-abs" style={{ left: x - sz / 2, top: height * 0.3 - sz * 0.5 + r() * 14 }}>
            <LotusSide size={sz} petal={petal} gold={gold} />
          </div>
        );
      })}
    </div>
  );
}
