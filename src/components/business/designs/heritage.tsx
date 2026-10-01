"use client";
import { useId, useMemo } from "react";
import { rng } from "@/lib/format";
import { foilFill } from "@/components/card/theme";
import { Diya, WaxSeal } from "@/components/card/ornaments";
import { Brand, type FaceProps, fitSize, FrontMeta, monogram, StdBack, twoLines } from "../parts";

/*
 * Indian heritage collection: folk and craft traditions redrawn as
 * procedural art, not clip-art: Warli, Mughal jaali, Bandhani, Ajrakh,
 * Kanjivaram zari, Kolam, Madhubani, and a ribbon-and-wax-seal luxury card.
 */

/* ---------------------------------------------------------------- Warli */
function warliFigure(x: number, y: number, rot: number, s = 1) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s})`}>
      <circle cx={0} cy={-24} r={4.2} />
      <path d="M-6,-18 L6,-18 L0,-8Z M0,-8 L-6.5,2 L6.5,2Z" />
      <path d="M-3.5,2 L-6,12 M3.5,2 L6,12" fill="none" strokeWidth={1.5} />
    </g>
  );
}

function WarliDance({ cx, cy }: { cx: number; cy: number }) {
  const rings = [
    { R: 118, n: 16, s: 1 },
    { R: 70, n: 10, s: 0.85 },
  ];
  const arms: string[] = [];
  const figs: React.ReactNode[] = [];
  rings.forEach(({ R, n, s }, ri) => {
    const sh = (k: number, side: number) => {
      const a = (k / n) * Math.PI * 2 + ri * 0.2;
      const rr = R - 17 * s;
      const ta = a + (side * 6 * s) / rr;
      return [cx + Math.cos(ta) * rr, cy + Math.sin(ta) * rr];
    };
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + ri * 0.2;
      figs.push(<g key={`${ri}-${k}`}>{warliFigure(cx + Math.cos(a) * R, cy + Math.sin(a) * R, (a * 180) / Math.PI - 90 + 180, s)}</g>);
      const [x1, y1] = sh(k, 1);
      const [x2, y2] = sh((k + 1) % n, -1);
      const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * 0.06;
      const my = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * 0.06;
      arms.push(`M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`);
    }
  });
  return (
    <g className="wl-art">
      <g className="fx-fade">{figs}</g>
      <path d={arms.join(" ")} fill="none" strokeWidth={1.4} className="fx-draw" />
      {/* the tarpa player at the centre */}
      <g className="fx-fade">
        {warliFigure(cx, cy + 4, 0, 1.1)}
        <path d={`M${cx + 5},${cy - 14} l18,-14 l3,4 l-18,13z`} />
      </g>
    </g>
  );
}

export const Warli = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="wl-wall" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <WarliDance cx={528} cy={200} />
        <g className="wl-art fx-fade">
          <circle cx={70} cy={62} r={14} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <path key={i} d={`M${(70 + Math.cos(a) * 19).toFixed(1)},${(62 + Math.sin(a) * 19).toFixed(1)} L${(70 + Math.cos(a) * 27).toFixed(1)},${(62 + Math.sin(a) * 27).toFixed(1)}`} strokeWidth={1.6} />;
          })}
        </g>
        <path className="wl-ground fx-draw" d="M40,352 H330" />
      </svg>
      <div className="wl-main">
        <Brand d={d} className="wl-logo" />
        <div className="wl-company fx-fade" style={{ fontSize: fitSize(d.company, 300, 48, 0.55) }}>
          {d.company}
        </div>
        <div className="wl-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-left fm-light wl-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="wl-wall" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g className="wl-art faint">
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>{warliFigure(420 + i * 26, 386, 0, 0.7)}</g>
          ))}
        </g>
      </svg>
      <StdBack d={d} qrColor="#5a2412" />
    </>
  ),
};

/* ---------------------------------------------------------------- Mughal jaali */
function JaaliPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width={36} height={36} patternUnits="userSpaceOnUse">
      <rect width={36} height={36} className="jl-stone" />
      <path className="jl-hole" d="M18,5 L21.5,14.5 L31,18 L21.5,21.5 L18,31 L14.5,21.5 L5,18 L14.5,14.5Z" />
      <path className="jl-hole" d="M0,0 L4,0 L0,4Z M36,0 L32,0 L36,4Z M0,36 L4,36 L0,32Z M36,36 L32,36 L36,32Z" />
      <circle className="jl-hole" cx={18} cy={18} r={2.2} />
    </pattern>
  );
}

export const Jaali = {
  Front: ({ d }: FaceProps) => {
    const id = `jl${useId().replace(/:/g, "")}`;
    const arch = "M232,372 V178 C232,124 290,92 350,40 C410,92 468,124 468,178 V372Z";
    return (
      <>
        <svg className="bz-svg" viewBox="0 0 700 400">
          <defs>
            <JaaliPattern id={id} />
          </defs>
          <rect width={700} height={400} fill={`url(#${id})`} />
          <rect x={18} y={18} width={664} height={364} className="jl-frame" />
          <path d={arch} className="jl-arch" />
          <path d={arch} className="jl-arch-line fx-draw" />
          <path d="M246,372 V182 C246,134 298,106 350,60 C402,106 454,134 454,182 V372" className="jl-arch-line thin fx-draw" />
        </svg>
        <div className="jl-main">
          <Brand d={d} className="jl-logo">
            <span className="jl-mono fx-fade">{monogram(d.company)}</span>
          </Brand>
          <div className="jl-company fx-fade" style={{ fontSize: fitSize(d.company, 200, 24, 0.72, 13) }}>
            {d.company}
          </div>
          <div className="jl-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light jl-fm" />
        <div className="paper-sheen" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => {
    const id = `jl${useId().replace(/:/g, "")}`;
    return (
      <>
        <svg className="bz-svg" viewBox="0 0 700 400">
          <defs>
            <JaaliPattern id={id} />
          </defs>
          <rect width={700} height={400} fill={`url(#${id})`} />
          <rect x={22} y={22} width={656} height={356} rx={4} className="jl-panel" />
        </svg>
        <StdBack d={d} qrColor="#4a1d12" />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Bandhani */
function bandhaniRows(w: number, h: number, seed: number, avoid?: { x: number; y: number; w: number; h: number }) {
  const r = rng(seed);
  const rows: { x: number; y: number; big: boolean }[][] = [];
  const step = 34;
  for (let j = 0, y = 10; y < h + 20; j++, y += step * 0.72) {
    const row: { x: number; y: number; big: boolean }[] = [];
    for (let x = (j % 2) * (step / 2) + 8; x < w + 20; x += step) {
      if (avoid && x > avoid.x - 14 && x < avoid.x + avoid.w + 14 && y > avoid.y - 14 && y < avoid.y + avoid.h + 14) continue;
      row.push({ x: x + (r() - 0.5) * 3, y: y + (r() - 0.5) * 3, big: (j + Math.round(x / step)) % 3 === 0 });
    }
    rows.push(row);
  }
  return rows;
}

function BandhaniCluster({ x, y, big }: { x: number; y: number; big: boolean }) {
  const n = 8;
  const rr = big ? 6.5 : 5;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <circle key={i} cx={x + Math.cos(a) * rr} cy={y + Math.sin(a) * rr} r={big ? 1.9 : 1.5} className={big ? "bd-y" : "bd-w"} />;
      })}
      <circle cx={x} cy={y} r={big ? 2.3 : 1.7} className={big ? "bd-w" : "bd-y"} />
    </g>
  );
}

export const Bandhani = {
  Front: ({ d }: FaceProps) => {
    const rows = useMemo(() => bandhaniRows(700, 400, 4, { x: 170, y: 90, w: 360, h: 220 }), []);
    return (
      <>
        <div className="bd-cloth" />
        <svg className="bz-svg bd-dots" viewBox="0 0 700 400">
          {rows.map((row, j) => (
            <g key={j} className="fx-pop">
              {row.map((c, i) => (
                <BandhaniCluster key={i} {...c} />
              ))}
            </g>
          ))}
        </svg>
        <div className="bd-panel fx-fade">
          <Brand d={d} className="bd-logo" />
          <div className="bd-company" style={{ fontSize: fitSize(d.company, 300, 42, 0.56) }}>
            {d.company}
          </div>
          <div className="bd-tag">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light bd-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => {
    const rows = useMemo(() => bandhaniRows(700, 400, 9, { x: 26, y: 26, w: 648, h: 348 }), []);
    return (
      <>
        <div className="bd-cloth" />
        <svg className="bz-svg bd-dots" viewBox="0 0 700 400">
          {rows.map((row, j) => (
            <g key={j}>
              {row.map((c, i) => (
                <BandhaniCluster key={i} {...c} />
              ))}
            </g>
          ))}
        </svg>
        <div className="bd-panel back" />
        <StdBack d={d} qrColor="#5c0f1a" />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Ajrakh */
function AjrakhTile({ x, y, s }: { x: number; y: number; s: number }) {
  const h = s / 2;
  const star = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? h * 0.42 : h * 0.8;
    return `${(x + h + Math.cos(a) * r).toFixed(1)},${(y + h + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <g className="fx-stamp">
      <rect x={x} y={y} width={s} height={s} className="aj-cell" />
      <circle cx={x + h} cy={y + h} r={h * 0.92} className="aj-ring" />
      <polygon points={star} className="aj-star" />
      <circle cx={x + h} cy={y + h} r={h * 0.2} className="aj-eye" />
      {[
        [x, y],
        [x + s, y],
        [x, y + s],
        [x + s, y + s],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={h * 0.18} className="aj-dot" />
      ))}
    </g>
  );
}

export const Ajrakh = {
  Front: ({ d }: FaceProps) => {
    const s = 50;
    const cols = [0, 1, 2];
    const rows = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
      <>
        <div className="aj-base" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          {rows.map((j) =>
            cols.map((i) => (
              <g key={`${i}-${j}`}>
                <AjrakhTile x={i * s} y={j * s} s={s} />
                <AjrakhTile x={550 + i * s} y={j * s} s={s} />
              </g>
            )),
          )}
          <path d="M150,0 V400 M550,0 V400" className="aj-band" />
          <path d="M160,0 V400 M540,0 V400" className="aj-band thin" />
        </svg>
        <div className="aj-main">
          <Brand d={d} className="aj-logo" />
          <div className="aj-company fx-fade" style={{ fontSize: fitSize(d.company, 330, 46, 0.56) }}>
            {d.company}
          </div>
          <div className="aj-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-center fm-light aj-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="aj-base" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        {Array.from({ length: 14 }, (_, i) => (
          <AjrakhTile key={i} x={i * 50} y={350} s={50} />
        ))}
        <path d="M0,346 H700" className="aj-band" />
      </svg>
      <StdBack d={d} qrColor="#1c2340" />
    </>
  ),
};

/* ---------------------------------------------------------------- Kanjivaram (portrait) */
function ZariBorder({ y, h, flip = false }: { y: number; h: number; flip?: boolean }) {
  const tri = Array.from({ length: 16 }, (_, i) => {
    const x = i * 25 + 12.5;
    const base = flip ? y + 16 : y + h - 16;
    const tip = flip ? y + h - 22 : y + 22;
    return `M${x - 11},${base} L${x},${tip} L${x + 11},${base}Z`;
  }).join(" ");
  return (
    <g>
      <rect x={0} y={y} width={400} height={h} className="kj-pallu" />
      <g filter="url(#f-foil)" fill="url(#foil-gold)">
        <rect x={0} y={flip ? y + h - 8 : y} width={400} height={8} />
        <rect x={0} y={flip ? y + h - 14 : y + 10} width={400} height={2} />
        <path d={tri} />
        <rect x={0} y={flip ? y : y + h - 6} width={400} height={6} />
      </g>
    </g>
  );
}

export const Kanjivaram = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="kj-silk" />
      <svg className="bz-svg" viewBox="0 0 400 700">
        <g filter="url(#f-foil)" fill="url(#foil-gold)" className="kj-buttas">
          {Array.from({ length: 30 }, (_, i) => {
            const x = 40 + (i % 5) * 80 + (Math.floor(i / 5) % 2) * 40;
            const y = 150 + Math.floor(i / 5) * 58;
            if (y > 470 || (y > 230 && y < 440 && x > 60 && x < 340)) return null;
            return <path key={i} d={`M${x},${y - 7} C${x + 6},${y - 3} ${x + 5},${y + 5} ${x},${y + 7} C${x - 5},${y + 5} ${x - 6},${y - 3} ${x},${y - 7}Z`} />;
          })}
        </g>
        <ZariBorder y={0} h={120} flip />
        <ZariBorder y={560} h={140} />
      </svg>
      <div className="kj-main">
        <Brand d={d} className="kj-logo" />
        <div className="kj-company foil-text gild" style={{ fontSize: fitSize(twoLines(d.company).reduce((a, b) => (a.length > b.length ? a : b)), 320, 44, 0.74) }}>
          {twoLines(d.company).map((l, i) => l && <span key={i}>{l}</span>)}
        </div>
        <div className="kj-tag">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-center fm-light kj-fm" />
      <div className="kj-sheen" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="kj-silk" />
      <svg className="bz-svg" viewBox="0 0 400 700">
        <ZariBorder y={620} h={80} />
      </svg>
      <StdBack d={d} qrColor="#3b0a1c" />
      <div className="kj-sheen" />
    </>
  ),
};

/* ---------------------------------------------------------------- Kolam */
function kolamPaths(n: number, s: number) {
  const L = (n - 1) * s;
  const ln: string[] = [];
  for (let j = 0; j <= n; j++) {
    const y0 = j * s - s / 2;
    let a = `M${-s / 2},${y0}`;
    let b = `M${y0},${-s / 2}`;
    for (let i = 0; i <= n; i++) {
      const x = i * s - s / 2;
      const up = (i + j) % 2 ? -1 : 1;
      a += ` Q${x + s / 2},${y0 + (up * s) / 2.2} ${x + s},${y0}`;
      b += ` Q${y0 + (up * s) / 2.2},${x + s / 2} ${y0},${x + s}`;
    }
    ln.push(a, b);
  }
  const loop = `M${-s},${-s / 2} Q${-s},${-s} ${-s / 2},${-s} H${L + s / 2} Q${L + s},${-s} ${L + s},${-s / 2} V${L + s / 2} Q${L + s},${L + s} ${L + s / 2},${L + s} H${-s / 2} Q${-s},${L + s} ${-s},${L + s / 2}Z`;
  return { lines: ln, loop, L };
}

export const Kolam = {
  Front: ({ d, p }: FaceProps) => {
    const n = 5;
    const s = 30;
    const k = useMemo(() => kolamPaths(n, s), []);
    return (
      <>
        <div className="kl-floor" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <g transform={`translate(520 200) rotate(45) translate(${-k.L / 2} ${-k.L / 2})`} className="kl-art" filter="url(#f-chalk)">
            <path d={k.loop} className="fx-draw" />
            {k.lines.map((l, i) => (
              <path key={i} d={l} className="fx-draw" />
            ))}
            {Array.from({ length: n * n }, (_, i) => (
              <circle key={i} cx={(i % n) * s} cy={Math.floor(i / n) * s} r={2.6} className="kl-dot" />
            ))}
            {[
              [-s * 1.6, -s * 1.6],
              [k.L + s * 1.6, -s * 1.6],
              [-s * 1.6, k.L + s * 1.6],
              [k.L + s * 1.6, k.L + s * 1.6],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={9} className="fx-draw" />
            ))}
          </g>
        </svg>
        <div className="kl-main">
          <div className="kl-diya fx-fade">
            <Brand d={d} className="kl-logo">
              <Diya size={56} fill={foilFill(p)} />
            </Brand>
          </div>
          <div className="kl-company fx-fade" style={{ fontSize: fitSize(d.company, 320, 44, 0.58) }}>
            {d.company}
          </div>
          <div className="kl-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-left fm-light kl-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => {
    const k = useMemo(() => kolamPaths(3, 22), []);
    return (
      <>
        <div className="kl-floor" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <g transform={`translate(640 60) rotate(45) translate(${-k.L / 2} ${-k.L / 2})`} className="kl-art faint" filter="url(#f-chalk)">
            <path d={k.loop} />
            {k.lines.map((l, i) => (
              <path key={i} d={l} />
            ))}
          </g>
        </svg>
        <StdBack d={d} qrColor="#1f2226" />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Madhubani */
function MadhubaniBorder({ w, h, band }: { w: number; h: number; band: number }) {
  const saw: string[] = [];
  const t = 14;
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.floor(len / t);
    const ux = (x1 - x0) / len;
    const uy = (y1 - y0) / len;
    const nx = -uy;
    const ny = ux;
    for (let i = 0; i < n; i++) {
      const ax = x0 + ux * i * t;
      const ay = y0 + uy * i * t;
      saw.push(`M${ax.toFixed(1)},${ay.toFixed(1)} L${(ax + ux * t / 2 + nx * band * 0.8).toFixed(1)},${(ay + uy * t / 2 + ny * band * 0.8).toFixed(1)} L${(ax + ux * t).toFixed(1)},${(ay + uy * t).toFixed(1)}Z`);
    }
  };
  const o = 12;
  edge(o, o, w - o, o);
  edge(w - o, o, w - o, h - o);
  edge(w - o, h - o, o, h - o);
  edge(o, h - o, o, o);
  return (
    <g className="mb2-border">
      <rect x={o} y={o} width={w - 2 * o} height={h - 2 * o} className="mb2-line fx-draw" />
      <rect x={o + band} y={o + band} width={w - 2 * (o + band)} height={h - 2 * (o + band)} className="mb2-line fx-draw" />
      <path d={saw.filter((_, i) => i % 2 === 0).join(" ")} className="mb2-red" />
      <path d={saw.filter((_, i) => i % 2 === 1).join(" ")} className="mb2-yellow" />
      <rect x={o + band + 6} y={o + band + 6} width={w - 2 * (o + band + 6)} height={h - 2 * (o + band + 6)} className="mb2-line thin" />
    </g>
  );
}

function Fish({ x, y, rot, flip = false }: { x: number; y: number; rot: number; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  const body = "M-44,0 C-24,-24 18,-24 40,0 C18,24 -24,24 -44,0Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
      <defs>
        <clipPath id={`fb${id}`}>
          <path d={body} />
        </clipPath>
      </defs>
      <path d="M40,0 L62,-18 L56,0 L62,18Z" className="mb2-fin fx-draw" />
      <path d={body} className="mb2-body fx-draw" />
      <g clipPath={`url(#fb${id})`} className="mb2-scale">
        {Array.from({ length: 5 }, (_, c) =>
          Array.from({ length: 4 }, (_, r) => <path key={`${c}-${r}`} d={`M${-10 + c * 10},${-20 + r * 10} a6,6 0 0 0 0,10`} />),
        )}
      </g>
      <path d="M-18,-19 C-12,-6 -12,6 -18,19" className="mb2-gill" />
      <circle cx={-30} cy={-4} r={4.5} className="mb2-eye" />
      <circle cx={-30} cy={-4} r={1.8} className="mb2-pupil" />
      <path d="M-4,-17 l6,-12 l8,10 M-4,17 l6,12 l8,-10" className="mb2-gill" />
    </g>
  );
}

export const Madhubani = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <MadhubaniBorder w={700} h={400} band={18} />
        <circle cx={520} cy={200} r={92} className="mb2-halo fx-draw" />
        <Fish x={520} y={158} rot={0} />
        <Fish x={520} y={242} rot={0} flip />
      </svg>
      <div className="mb2-main">
        <Brand d={d} className="mb2-logo" />
        <div className="mb2-company fx-fade" style={{ fontSize: fitSize(d.company, 300, 46, 0.56) }}>
          {d.company}
        </div>
        <div className="mb2-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-left mb2-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <MadhubaniBorder w={700} h={400} band={12} />
      </svg>
      <StdBack d={d} qrColor="#1a1a1a" />
    </>
  ),
};

/* ---------------------------------------------------------------- Ribbon & wax seal */
export const RibbonSeal = {
  Front: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      <div className="rs-ribbon" />
      <div className="rs-seal fx-pop">
        <WaxSeal size={112} color={p.accent} text={monogram(d.company)} />
      </div>
      <div className="rs-main">
        <Brand d={d} className="rs-logo" />
        <div className="rs-company foil-text fx-fade" style={{ fontSize: fitSize(d.company, 400, 40, 0.6) }}>
          {d.company}
        </div>
        <div className="rs-rule fx-fade" />
        <div className="rs-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-left rs-fm" qrColor={p.ink} />
      <div className="paper-sheen" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      <div className="rs-ribbon back" />
      <StdBack d={d} qrColor={p.ink} />
      <div className="paper-sheen" />
    </>
  ),
};
