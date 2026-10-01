"use client";
import React, { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, fmtLongDate, rng, sin } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { isDark } from "@/components/card/theme";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";

/* ============================================================
   Glasshouse: a Victorian conservatory. Wrought-iron arches,
   a layered jungle behind misted glass you can wipe clean.
   ============================================================ */

const R1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

/** Monstera leaf: heart-shaped with deep edge slits and holes cut right through. */
export function Monstera({ size = 120, color, vein, rotate = 0, seed = 1 }: { size?: number; color: string; vein: string; rotate?: number; seed?: number }) {
  const id = useId().replace(/:/g, "");
  const r = rng(seed);
  const outline = "M0,8 C-8,-2 -28,-6 -44,4 C-62,16 -68,44 -60,70 C-52,94 -26,110 0,116 C26,110 52,94 60,70 C68,44 62,16 44,4 C28,-6 8,-2 0,8Z";
  const edge = (y: number) => 60 - ((y - 58) * (y - 58)) / 95;
  const slits: string[] = [];
  const holes: React.ReactNode[] = [];
  for (const s of [-1, 1]) {
    const n = 5 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) {
      const y = 20 + (i * 82) / n + r() * 4;
      const ex = s * (edge(y) + 6);
      const ix = s * (9 + r() * 6);
      const w = 4 + r() * 3.5;
      slits.push(`M${R1(ex)},${R1(y - w)} L${R1(ix)},${R1(y + 9)} L${R1(ix)},${R1(y + 11)} L${R1(ex)},${R1(y + w + 2)}Z`);
      if (i % 2 === 1 && i < n - 1) holes.push(<ellipse key={`${s}-${i}`} cx={R1(s * (22 + r() * 10))} cy={R1(y + 16)} rx={R1(2 + r() * 1.6)} ry={R1(5 + r() * 3)} transform={`rotate(${s * 30} ${R1(s * 26)} ${R1(y + 16)})`} fill="#000" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox="-70 -40 140 160" style={{ transform: `rotate(${rotate}deg)`, overflow: "visible" }}>
      <defs>
        <mask id={`mo-${id}`}>
          <path d={outline} fill="#fff" />
          {slits.map((d, i) => (
            <path key={i} d={d} fill="#000" />
          ))}
          {holes}
        </mask>
        <radialGradient id={`mg-${id}`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <path d="M0,8 C-1,-10 -3,-24 -2,-40" stroke={color} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <g mask={`url(#mo-${id})`}>
        <path d={outline} fill={color} />
        <path d={outline} fill={`url(#mg-${id})`} />
        <path d="M0,8 C1,40 0,80 0,114" stroke={vein} strokeWidth={1.8} opacity={0.55} fill="none" />
        {[-1, 1].map((s) => [26, 44, 62, 80].map((y) => <path key={`${s}${y}`} d={`M0,${y} Q${s * 20},${y + 2} ${s * 46},${y + 14}`} stroke={vein} strokeWidth={0.8} opacity={0.35} fill="none" />))}
      </g>
    </svg>
  );
}

/** Pothos vine trailing down from above, heart leaves alternating. */
export function Pothos({ length = 260, color, seed = 3 }: { length?: number; color: string; seed?: number }) {
  const r = rng(seed);
  const n = Math.floor(length / 26);
  const pts = Array.from({ length: n + 1 }, (_, i) => ({ x: R1(sin(i * 0.7 + seed) * 10), y: R1((i * length) / n) }));
  return (
    <svg width={60} height={length + 20} viewBox={`-30 0 60 ${length + 20}`} style={{ overflow: "visible" }}>
      <path d={pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ")} stroke={color} strokeWidth={1.6} fill="none" />
      {pts.slice(1).map((p, i) => {
        const s = i % 2 ? 1 : -1;
        const k = 0.7 + r() * 0.5;
        return <path key={i} transform={`translate(${p.x} ${p.y}) rotate(${s * (50 + r() * 30)}) scale(${R1(k * 10) / 10})`} d="M0,0 C-7,-3 -12,4 -10,10 C-8,16 -2,19 0,22 C2,19 8,16 10,10 C12,4 7,-3 0,0Z" fill={color} />;
      })}
    </svg>
  );
}

/** Palm frond: an arching rib with long leaflets. */
export function PalmFrond({ length = 200, color, angle = 0, seed = 2 }: { length?: number; color: string; angle?: number; seed?: number }) {
  const r = rng(seed);
  const n = 22;
  const pt = (t: number) => ({ x: t * length, y: -sin(t * Math.PI * 0.75) * length * 0.22 });
  return (
    <svg width={length * 1.2} height={length} viewBox={`-10 ${-length * 0.6} ${length * 1.2} ${length}`} style={{ transform: `rotate(${angle}deg)`, overflow: "visible" }}>
      <path d={Array.from({ length: 21 }, (_, i) => `${i ? "L" : "M"}${R1(pt(i / 20).x)},${R1(pt(i / 20).y)}`).join(" ")} stroke={color} strokeWidth={2.2} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = 0.08 + (i / n) * 0.9;
        const p = pt(t);
        const L = length * 0.36 * (1 - t * 0.6) + r() * 6;
        return [-1, 1].map((s) => {
          const a = rad(s * (58 - t * 30) + 20);
          return <path key={`${i}${s}`} d={`M${R1(p.x)},${R1(p.y)} Q${R1(p.x + cos(a) * L * 0.5 + 4)},${R1(p.y + sin(a) * L * 0.5)} ${R1(p.x + cos(a) * L)},${R1(p.y + sin(a) * L)}`} stroke={color} strokeWidth={3.2} strokeLinecap="round" fill="none" opacity={0.92} />;
        });
      })}
    </svg>
  );
}

/** Bird of paradise flower. */
export function BirdOfParadise({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <path d="M50,100 C50,80 46,64 40,56" stroke="#3f6b3a" strokeWidth={4} fill="none" />
      <path d="M40,56 C56,52 80,48 96,52 C80,58 58,62 40,60Z" fill="#5b7f4a" />
      <path d="M40,56 C56,52 80,48 96,52" fill="none" stroke="#9c4b8a" strokeWidth={2} />
      {[
        [58, 52, 46, 14],
        [64, 51, 60, 10],
        [70, 50, 72, 14],
      ].map(([x0, y0, x1, y1], i) => (
        <path key={i} d={`M${x0},${y0} L${x1},${y1} L${x0 + 6},${y0 - 2}Z`} fill={i === 1 ? "#ff8c1a" : "#ffa53a"} />
      ))}
      <path d="M62,51 L58,22 L66,50Z" fill="#3c5fcf" />
    </svg>
  );
}

/** Wrought-iron conservatory façade: arch with fanlight, mullions, transoms and scrolls. */
function IronFrame({ iron, hi, full = true }: { iron: string; hi: string; full?: boolean }) {
  const cx = 250;
  const cy = 262;
  const R = 222;
  const spokes = Array.from({ length: 13 }, (_, i) => rad(180 + (i / 12) * 180));
  const arch = (r: number) => `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`;
  const cols = [28, 112, 196, 304, 388, 472];
  const scroll = (x: number, y: number, s: number) => `M${x},${y} c${8 * s},-10 ${22 * s},-8 ${22 * s},4 c0,8 ${-10 * s},10 ${-14 * s},4 c${-3 * s},-4 0,${-8 * s} ${5 * s},${-6 * s}`;
  const lines = (
    <>
      <path d={arch(R)} />
      {full && <path d={arch(R - 70)} strokeWidth={3} />}
      {full && <path d={arch(66)} strokeWidth={3} />}
      {full &&
        spokes.map((a, i) => (
          <line key={i} x1={R1(cx + cos(a) * 66)} y1={R1(cy + sin(a) * 66)} x2={R1(cx + cos(a) * R)} y2={R1(cy + sin(a) * R)} strokeWidth={2.4} />
        ))}
      {cols.map((x) => (
        <line key={x} x1={x} y1={cy} x2={x} y2={700} strokeWidth={x === 28 || x === 472 ? 7 : 3.4} />
      ))}
      <line x1={0} y1={cy} x2={500} y2={cy} strokeWidth={6} />
      {full && <line x1={28} y1={470} x2={472} y2={470} strokeWidth={3} />}
      <path d={scroll(40, 120, 1)} strokeWidth={2.4} />
      <path d={scroll(460, 120, -1)} strokeWidth={2.4} />
      <path d={scroll(52, 200, 0.8)} strokeWidth={2} />
      <path d={scroll(448, 200, -0.8)} strokeWidth={2} />
    </>
  );
  return (
    <svg className="gh-iron" viewBox="0 0 500 700" width={500} height={700}>
      <g fill="none" stroke={iron} strokeWidth={8} strokeLinecap="round">
        {lines}
      </g>
      <g fill="none" stroke={hi} strokeWidth={1} strokeLinecap="round" opacity={0.45} transform="translate(-1.2 -1.2)">
        {lines}
      </g>
      <g fill={iron}>
        <path d={`M${cx},16 L${cx + 7},34 L${cx},40 L${cx - 7},34Z`} />
        <circle cx={cx} cy={cy - 66} r={8} />
      </g>
    </svg>
  );
}

/** The jungle behind the glass: back, middle and front layers, with aerial perspective. */
function Jungle({ p, dense = true }: { p: Palette; dense?: boolean }) {
  const dark = isDark(p.paper);
  const back = dark ? "#2a5444" : "#b7cdb2";
  const mid = dark ? "#2f6544" : "#86a97e";
  const front = dark ? "#1f4a30" : "#55804f";
  const vine = dark ? "#3d7a4e" : "#6d9a64";
  const vein = dark ? "#b6e0b8" : "#eef6ea";
  return (
    <div className="gh-jungle">
      <div className="gh-layer back">
        {[
          [-40, 120, 280, -28, 3],
          [250, 100, 280, 208, 4],
          [150, 40, 220, -84, 5],
          [60, 250, 240, -50, 13],
          [300, 240, 230, 222, 14],
        ].map(([x, y, l, a, sd], i) => (
          <div key={i} className="gh-abs" style={{ left: x, top: y }}>
            <PalmFrond length={l} color={back} angle={a} seed={sd} />
          </div>
        ))}
        <div className="gh-abs" style={{ left: 170, top: 260 }}>
          <Monstera size={170} color={back} vein={vein} rotate={8} seed={31} />
        </div>
      </div>
      <div className="gh-layer mid">
        {[
          [-50, 330, 200, -40, 2],
          [340, 300, 210, 42, 6],
          [190, 470, 190, 4, 17],
          [60, 420, 170, -12, 19],
          [300, 440, 170, 18, 23],
        ].map(([x, y, sz, rot, sd], i) => (
          <div key={i} className="gh-abs" style={{ left: x, top: y }}>
            <Monstera size={sz} color={mid} vein={vein} rotate={rot} seed={sd} />
          </div>
        ))}
        {dense && (
          <>
            <div className="gh-abs" style={{ left: 280, top: 160 }}>
              <PalmFrond length={200} color={mid} angle={196} seed={8} />
            </div>
            <div className="gh-abs" style={{ left: -10, top: 190 }}>
              <PalmFrond length={190} color={mid} angle={-14} seed={9} />
            </div>
          </>
        )}
      </div>
      <div className="gh-layer front">
        {[
          [-70, 520, 240, -62, 9],
          [330, 540, 230, 58, 11],
          [120, 590, 190, -20, 27],
          [240, 600, 180, 26, 29],
        ].map(([x, y, sz, rot, sd], i) => (
          <div key={i} className="gh-abs" style={{ left: x, top: y }}>
            <Monstera size={sz} color={front} vein={vein} rotate={rot} seed={sd} />
          </div>
        ))}
        {dense && (
          <>
            <div className="gh-abs" style={{ left: 40, top: 486 }}>
              <BirdOfParadise size={92} />
            </div>
            <div className="gh-abs" style={{ left: 372, top: 470, transform: "scaleX(-1)" }}>
              <BirdOfParadise size={84} />
            </div>
          </>
        )}
      </div>
      <div className="gh-layer vines">
        {[
          [70, 250, 230, 2],
          [130, 250, 150, 5],
          [360, 250, 200, 7],
          [425, 250, 260, 11],
        ].map(([x, y, l, sd], i) => (
          <div key={i} className="gh-abs" style={{ left: x - 30, top: y }}>
            <Pothos length={l} color={vine} seed={sd} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Condensation({ n = 160, seed = 13 }: { n?: number; seed?: number }) {
  const r = rng(seed);
  return (
    <svg className="gh-drops" viewBox="0 0 500 700" width={500} height={700}>
      {Array.from({ length: n }, (_, i) => {
        const y = R1(Math.pow(r(), 0.6) * 700);
        return <circle key={i} cx={R1(r() * 500)} cy={y} r={R1(0.6 + r() * r() * 2.6)} fill="#fff" opacity={R1(0.25 + r() * 0.4)} />;
      })}
    </svg>
  );
}

/** Live: fog on the glass that a finger (or mouse) wipes away and that slowly returns. */
function FogGlass() {
  const env = useCardEnv();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || env.mode !== "live") return;
    const W = 500;
    const H = 700;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fog = (a: number) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(236,242,238,${a})`;
      ctx.fillRect(0, 0, W, H);
    };
    fog(0.42);
    let last: { x: number; y: number } | null = null;
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };
    const wipe = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineWidth = 46;
      ctx.strokeStyle = "rgba(0,0,0,0.9)";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };
    const down = (e: PointerEvent) => {
      last = pos(e);
      c.setPointerCapture(e.pointerId);
      e.stopPropagation();
    };
    const move = (e: PointerEvent) => {
      if (!last) return;
      const p = pos(e);
      wipe(last, p);
      last = p;
    };
    const up = () => (last = null);
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    // the mist creeps back
    const iv = setInterval(() => fog(0.012), 120);
    return () => {
      clearInterval(iv);
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, [env.mode]);
  if (env.mode !== "live") return <div className="gh-fog-still" />;
  return (
    <>
      <canvas ref={ref} className="gh-fog" data-no-flip style={{ width: 500, height: 700 }} />
      <div className="gh-hint">Wipe the glass</div>
    </>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const dark = isDark(p.paper);
  return (
    <div className="page-content cover wd-cover">
      <div className="gh-sky" />
      <Jungle p={p} />
      <div className="gh-rays" />
      <div className="gh-glow" />
      <Condensation />
      <FogGlass />
      <IronFrame iron={dark ? "#0e1612" : "#f7f5ee"} hi={dark ? "#9fb5a6" : "#ffffff"} />
      <div className="gh-plaque">
        <div className="gh-eyebrow">{d.eyebrow}</div>
        <h1 className="gh-names">
          {a.name}
          {b?.name && (
            <>
              <i> &amp; </i>
              {b.name}
            </>
          )}
        </h1>
        <div className="gh-when">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
        {env.guest && <div className="gh-guest">For {env.guest}</div>}
      </div>
    </div>
  );
}

export const glasshouse: WedDesign = {
  Frame: ({ p, kind }) => {
    if (kind === "cover") return null;
    const dark = isDark(p.paper);
    return (
      <>
        <div className="gh-corner tl">
          <Monstera size={150} color={dark ? "#2d5a3d" : "#8fb088"} vein={dark ? "#a6d6a8" : "#eef6ea"} rotate={150} seed={kind.length} />
        </div>
        <div className="gh-corner br">
          <Monstera size={150} color={dark ? "#3f7d4f" : "#7fa278"} vein={dark ? "#a6d6a8" : "#eef6ea"} rotate={-30} seed={kind.length + 4} />
        </div>
        <Condensation n={60} seed={kind.length * 3} />
        <svg className="gh-iron" viewBox="0 0 500 700" width={500} height={700}>
          <g fill="none" stroke={dark ? "#0e1612" : "#e8e4d8"} strokeWidth={10}>
            <rect x={10} y={10} width={480} height={680} rx={4} />
          </g>
          <g fill="none" stroke={dark ? "#9fb5a6" : "#fff"} strokeWidth={1} opacity={0.5}>
            <rect x={5.5} y={5.5} width={489} height={689} rx={6} />
          </g>
        </svg>
      </>
    );
  },
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Monstera size={220} color={isDark(p.paper) ? "#2d5a3d" : "#8fb088"} vein="#eef6ea" rotate={10} seed={21} />
    </div>
  ),
};

/* ---------------- intro: misted glass, wiped by hand ---------------- */

const WIPES = ["M300,330 C270,290 220,300 220,340 C220,380 270,400 300,440 C330,400 380,380 380,340 C380,300 330,290 300,330Z", "M40,180 C200,150 400,170 560,140", "M40,560 C220,600 380,540 560,600", "M60,760 C240,720 380,790 560,740", "M60,40 C240,80 380,20 560,60"];

export const mist: IntroDef = {
  end: 2.4,
  burst: 1.8,
  hint: { x: 300, y: 650 },
  Over: () => (
    <svg className="in-part ms-wrap" viewBox="0 0 600 900" width={600} height={900}>
      <defs>
        <filter id="ms-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id="ms-fog" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#eef3ef" stopOpacity="0.9" />
          <stop offset="1" stopColor="#d7e0da" stopOpacity="0.97" />
        </radialGradient>
        <mask id="ms-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={600} height={900}>
          <rect width={600} height={900} fill="#fff" />
          <g fill="none" stroke="#000" strokeLinecap="round" filter="url(#ms-soft)">
            {WIPES.map((d, i) => (
              <path key={i} className="ms-wipe" d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" strokeWidth={i === 0 ? 46 : 120} />
            ))}
          </g>
        </mask>
      </defs>
      <g mask="url(#ms-mask)" className="ms-fogg">
        <rect x={30} y={80} width={540} height={740} rx={6} fill="url(#ms-fog)" />
        {Array.from({ length: 140 }, (_, i) => {
          const r = rng(i + 3);
          return <circle key={i} cx={R1(30 + r() * 540)} cy={R1(80 + r() * 740)} r={R1(0.8 + r() * 2.4)} fill="#ffffff" opacity={0.8} />;
        })}
      </g>
    </svg>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.96, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    const w = q(".ms-wipe");
    tl.to(w[0], { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, 0.05);
    w.slice(1).forEach((el, i) => tl.to(el, { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" }, 0.85 + i * 0.16));
    tl.to(q(".ms-fogg"), { opacity: 0, duration: 0.6 }, 1.6).to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 1.2);
    return tl;
  },
};
