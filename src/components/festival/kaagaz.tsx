"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Kaagaz: a layered paper-cut lightbox. Moon and fireworks, a
   town of domes and havelis, strings of kandils and a family
   with sparklers, each cut from paper and lit from inside.
   Move or tilt the phone to look into it.
   ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;

/** Colours of the paper layers, front darkest, and the light behind them. */
function tones(p: Palette) {
  const base = p.paper;
  return {
    light: p.accent2,
    glow: p.accent,
    fire: mix(base, p.accent2, 0.55),
    hills: mix(base, p.accent, 0.5),
    town: mix(base, p.accent, 0.22),
    kandil: mix(base, "#000000", 0.1),
    folk: mix(base, "#000000", 0.45),
    front: mix(base, "#000000", 0.55),
  };
}

/** A pointed, cusped (multifoil) arch opening, traced clockwise from the bottom left. */
function archPath(x0: number, x1: number, spring: number, apex: number, bottom: number, lobes = 4) {
  const half = (x1 - x0) / 2;
  const mid = x0 + half;
  const rise = spring - apex;
  // left arc centre on the spring line such that it passes through (x0, spring) and (mid, apex)
  const c = (half * half + rise * rise) / (2 * half);
  const R = c;
  const cl = x0 + c;
  const cr = x1 - c;
  const aEnd = Math.atan2(apex - spring, mid - cl);
  const pts: [number, number][] = [];
  for (let i = 0; i <= lobes; i++) {
    const a = Math.PI + ((aEnd + 2 * Math.PI - Math.PI) * i) / lobes;
    pts.push([cl + cos(a) * R, spring + sin(a) * R]);
  }
  const right = pts
    .slice(0, -1)
    .reverse()
    .map(([x, y]) => [2 * mid - x, y] as [number, number]);
  let d = `M${x0},${bottom} L${x0},${spring}`;
  const lobe = (to: [number, number], from: [number, number]) => {
    const r = Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.62;
    return ` A${R1(r)},${R1(r)} 0 0 1 ${R1(to[0])},${R1(to[1])}`;
  };
  let prev: [number, number] = [x0, spring];
  for (const p of [...pts.slice(1), ...right]) {
    d += lobe(p, prev);
    prev = p;
  }
  d += ` L${x1},${bottom} Z`;
  void cr;
  return d;
}

const ARCH = archPath(60, 440, 360, 150, 566, 7);

/** Little perforations along the arch, where the light leaks through. */
const PERF = (() => {
  const out: [number, number][] = [];
  for (let y = 556; y > 370; y -= 16) out.push([46, y], [454, y]);
  const half = 204;
  const rise = 224;
  const c = (half * half + rise * rise) / (2 * half);
  const cl = 46 + c;
  const aEnd = Math.atan2(-rise, 250 - cl) + 2 * Math.PI;
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + ((aEnd - Math.PI) * i) / 14;
    const x = cl + cos(a) * c;
    const y = 360 + sin(a) * c;
    out.push([R1(x), R1(y)], [R1(500 - x), R1(y)]);
  }
  return out;
})();

function Star({ x, y, r, n = 8 }: { x: number; y: number; r: number; n?: number }) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = rad((i * 180) / n - 90);
    const rr = i % 2 ? r * 0.38 : r;
    return `${R1(x + cos(a) * rr)},${R1(y + sin(a) * rr)}`;
  });
  return <polygon points={pts.join(" ")} />;
}

/** Paper-cut firework: petal rays around a hollow centre. */
function PaperBurst({ x, y, r, n = 14 }: { x: number; y: number; r: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = rad((i * 360) / n);
        const x1 = x + cos(a) * r * 0.32;
        const y1 = y + sin(a) * r * 0.32;
        const x2 = x + cos(a) * r;
        const y2 = y + sin(a) * r;
        const nx = -sin(a) * r * 0.06;
        const ny = cos(a) * r * 0.06;
        return <path key={i} d={`M${R1(x1)},${R1(y1)} Q${R1((x1 + x2) / 2 + nx)},${R1((y1 + y2) / 2 + ny)} ${R1(x2)},${R1(y2)} Q${R1((x1 + x2) / 2 - nx)},${R1((y1 + y2) / 2 - ny)} ${R1(x1)},${R1(y1)}Z`} />;
      })}
      {Array.from({ length: n }, (_, i) => {
        const a = rad((i * 360) / n + 180 / n);
        return <circle key={`d${i}`} cx={R1(x + cos(a) * r * 1.12)} cy={R1(y + sin(a) * r * 1.12)} r={R1(r * 0.05)} />;
      })}
    </g>
  );
}

/** The town: havelis, a temple shikhara, domes and chhatris, with cut windows. */
function townPath() {
  const r = rng(808);
  let d = "";
  let holes = "";
  const ground = 520;
  const blocks: [number, number, string][] = [
    [0, 70, "haveli"],
    [70, 56, "dome"],
    [126, 44, "flat"],
    [170, 70, "shikhara"],
    [240, 50, "chhatri"],
    [290, 64, "haveli"],
    [354, 52, "dome"],
    [406, 94, "haveli"],
  ];
  for (const [x, w, kind] of blocks) {
    const h = kind === "shikhara" ? 120 : kind === "dome" ? 92 : kind === "chhatri" ? 84 : 70 + Math.round(r() * 40);
    const top = ground - h;
    d += `M${x},${ground} L${x},${top} L${x + w},${top} L${x + w},${ground}Z`;
    if (kind === "dome") d += `M${x + 4},${top} Q${x + w / 2},${top - w * 0.95} ${x + w - 4},${top}Z M${x + w / 2 - 1.5},${R1(top - w * 0.5)} L${x + w / 2 - 1.5},${R1(top - w * 0.75)} L${x + w / 2 + 1.5},${R1(top - w * 0.75)} L${x + w / 2 + 1.5},${R1(top - w * 0.5)}Z`;
    if (kind === "shikhara") d += `M${x + 8},${top} C${x + 12},${top - 70} ${x + w / 2 - 4},${top - 96} ${x + w / 2},${top - 110} C${x + w / 2 + 4},${top - 96} ${x + w - 12},${top - 70} ${x + w - 8},${top}Z M${x + w / 2 - 1},${top - 108} L${x + w / 2 - 1},${top - 128} L${x + w / 2 + 14},${top - 122} L${x + w / 2 + 1},${top - 116} L${x + w / 2 + 1},${top - 108}Z`;
    if (kind === "chhatri") d += `M${x - 4},${top} L${x + w + 4},${top} L${x + w - 6},${top - 8} Q${x + w / 2},${top - 40} ${x + 6},${top - 8}Z`;
    if (kind === "haveli") d += `M${x - 3},${top} L${x + w + 3},${top} L${x + w + 3},${top - 6} L${x - 3},${top - 6}Z`;
    // arched windows as holes (counter-clockwise so evenodd cuts them)
    const cols = Math.max(1, Math.floor(w / 18));
    const rows = Math.max(1, Math.floor((h - 26) / 26));
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        if (r() < 0.3) continue;
        const wx = x + 6 + i * ((w - 12) / cols) + ((w - 12) / cols - 8) / 2;
        const wy = top + 14 + j * 26;
        holes += `M${R1(wx)},${wy + 14} L${R1(wx)},${wy + 4} Q${R1(wx + 4)},${wy - 2} ${R1(wx + 8)},${wy + 4} L${R1(wx + 8)},${wy + 14}Z`;
      }
  }
  d += `M0,${ground} L500,${ground} L500,700 L0,700Z`;
  return d + holes;
}
const TOWN = townPath();

/** A paper kandil (star lantern) with cut-out pattern and a tassel. */
function Kandil({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path fillRule="evenodd" d="M0,-24 L16,-6 L12,18 L0,26 L-12,18 L-16,-6Z M0,-12 L6,-2 L0,8 L-6,-2Z M-9,6 L-6,13 L-11,12Z M9,6 L11,12 L6,13Z" />
      <path d="M-2,26 L-3,44 L0,48 L3,44 L2,26Z" />
    </g>
  );
}

/** Two strings of kandils hanging in catenaries across the top of the scene. */
function Strings() {
  const garland = (y0: number, sag: number, n: number, off: number) => {
    const pts = Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n;
      return [R1(off + t * (500 - 2 * off)), R1(y0 + 4 * sag * t * (1 - t))] as [number, number];
    });
    return (
      <g>
        <path d={`M${off - 30},${y0 - 6} Q250,${y0 + sag * 2} ${530 - off},${y0 - 6}`} fill="none" stroke="currentColor" strokeWidth={2} />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 0.8} y={y} width={1.6} height={10} />
            <Kandil x={x} y={y + 34} s={i % 2 ? 0.75 : 0.9} />
          </g>
        ))}
      </g>
    );
  };
  return (
    <>
      {garland(196, 48, 5, 78)}
      {garland(252, 30, 4, 64)}
    </>
  );
}

/** The family in front: a mother with an aarti thali, two children with sparklers, diyas and a rangoli. */
function Folk() {
  return (
    <g>
      {/* rangoli on the ground, with cut petals */}
      <path
        fillRule="evenodd"
        d={
          "M190,556 A60,14 0 1,1 310,556 A60,14 0 1,1 190,556Z " +
          Array.from({ length: 10 }, (_, i) => {
            const a = rad(i * 36);
            const x = 250 + cos(a) * 40;
            const y = 556 + sin(a) * 9;
            return `M${R1(x - 6)},${R1(y)} Q${R1(x)},${R1(y - 4)} ${R1(x + 6)},${R1(y)} Q${R1(x)},${R1(y + 4)} ${R1(x - 6)},${R1(y)}Z`;
          }).join(" ") +
          " M240,556 A10,3 0 1,1 260,556 A10,3 0 1,1 240,556Z"
        }
      />
      {/* mother in a saree holding an aarti thali */}
      <g>
        <circle cx={130} cy={428} r={11} />
        <circle cx={120} cy={424} r={6} />
        <path d="M118,440 Q130,434 142,440 L150,476 L160,560 L100,560 L108,500 L112,470Z" />
        <path d="M138,442 Q160,452 168,462 L170,468 L162,468 L146,458Z" />
        <path d="M150,466 L196,466 L196,470 L150,470Z" />
        <path d="M172,466 C168,456 172,450 175,442 C178,450 182,456 178,466Z" className="kg-flamecut" />
        <path d="M118,444 Q104,470 118,500 Q124,474 128,450Z" />
      </g>
      {/* child with a sparkler */}
      <g>
        <circle cx={330} cy={474} r={9} />
        <path d="M321,486 Q330,480 339,486 L346,522 L314,522Z" />
        <rect x={320} y={522} width={6} height={36} />
        <rect x={334} y={522} width={6} height={36} />
        <path d="M338,490 L360,470 L364,474 L342,496Z" />
        <path d="M360,470 L384,440" stroke="currentColor" strokeWidth={2} />
        <Star x={386} y={436} r={16} n={10} />
      </g>
      {/* little one */}
      <g>
        <circle cx={402} cy={500} r={7.5} />
        <path d="M394,510 Q402,505 410,510 L418,540 L386,540Z" />
        <rect x={394} y={540} width={5} height={18} />
        <rect x={405} y={540} width={5} height={18} />
        <path d="M410,514 L428,496 L431,499 L414,518Z" />
        <path d="M428,496 L440,476" stroke="currentColor" strokeWidth={1.6} />
        <Star x={442} y={472} r={11} n={8} />
      </g>
      {/* diyas along the ground */}
      {[70, 96, 200, 300, 446, 470].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 10},556 Q${x},568 ${x + 10},556Z`} />
          <path d={`M${x},552 C${x - 4},546 ${x - 2},540 ${x},534 C${x + 2},540 ${x + 4},546 ${x},552Z`} />
        </g>
      ))}
    </g>
  );
}

/** Scalloped inner opening for the inside pages. */
const INNER = (() => {
  const x0 = 36;
  const y0 = 36;
  const x1 = 464;
  const y1 = 664;
  const r = 9;
  let d = `M0,0 L500,0 L500,700 L0,700Z M${x0},${y0}`;
  for (let x = x0; x < x1; x += 2 * r) d += ` A${r},${r} 0 0 0 ${Math.min(x + 2 * r, x1)},${y0}`;
  for (let y = y0; y < y1; y += 2 * r) d += ` A${r},${r} 0 0 0 ${x1},${Math.min(y + 2 * r, y1)}`;
  for (let x = x1; x > x0; x -= 2 * r) d += ` A${r},${r} 0 0 0 ${Math.max(x - 2 * r, x0)},${y1}`;
  for (let y = y1; y > y0; y -= 2 * r) d += ` A${r},${r} 0 0 0 ${x0},${Math.max(y - 2 * r, y0)}`;
  return d + "Z";
})();

/** Drives the parallax: pointer or tilt when live, a slow sway always (frame-exact in video). */
function useParallax(root: React.RefObject<HTMLDivElement | null>) {
  const env = useCardEnv();
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (env.mode === "thumb") {
      el.style.setProperty("--px", "0.35");
      el.style.setProperty("--py", "-0.2");
      return;
    }
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let last = -1e9;
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      if (!b.width) return;
      tx = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - 0.5) * 2));
      last = performance.now();
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      last = performance.now();
    };
    const live = env.mode === "live";
    if (live) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("deviceorientation", onTilt);
    }
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = cardClock();
      const idle = performance.now() - last > 2500;
      const sx = Math.sin(t * 0.45) * 0.7;
      const sy = Math.cos(t * 0.33) * 0.35;
      const gx = idle || !live ? sx : tx;
      const gy = idle || !live ? sy : ty;
      cx += (gx - cx) * (live ? 0.08 : 1);
      cy += (gy - cy) * (live ? 0.08 : 1);
      el.style.setProperty("--px", cx.toFixed(3));
      el.style.setProperty("--py", cy.toFixed(3));
      el.style.setProperty("--fl", (0.93 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 13.1)).toFixed(3));
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      if (live) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("deviceorientation", onTilt);
      }
    };
  }, [root, env.mode]);
}

function Box({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref);
  const c = tones(p);
  const r = rng(5);
  return (
    <div className="kg-box" ref={ref}>
      <div className="kg-l kg-glow" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 46%, ${mix(c.light, "#fff", 0.45)}, ${c.light} 35%, ${c.glow} 75%, ${mix(c.glow, "#000", 0.4)})` }}>
        <i className="kg-moon" />
        <svg viewBox="0 0 500 700" width={500} height={700}>
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={R1(60 + r() * 380)} cy={R1(180 + r() * 220)} r={R1(0.8 + r() * 1.4)} fill="#fff" opacity={0.8} />
          ))}
        </svg>
      </div>
      <svg className="kg-l kg-fire" style={{ ["--d" as string]: -9 }} viewBox="0 0 500 700" width={500} height={700} fill={c.fire}>
        <PaperBurst x={162} y={286} r={54} />
        <PaperBurst x={348} y={252} r={42} n={12} />
        <PaperBurst x={286} y={352} r={26} n={10} />
        <path d="M0,700 L0,470 C80,440 140,462 200,446 C270,428 330,452 400,436 C450,426 480,440 500,436 L500,700Z" fill={c.hills} />
      </svg>
      <svg className="kg-l kg-town" style={{ ["--d" as string]: -4 }} viewBox="0 0 500 700" width={500} height={700}>
        <path d={TOWN} fill={c.town} fillRule="evenodd" />
      </svg>
      <svg className="kg-l kg-kandil" style={{ ["--d" as string]: 2, color: c.kandil }} viewBox="0 0 500 700" width={500} height={700} fill={c.kandil}>
        <Strings />
      </svg>
      <svg className="kg-l kg-folk" style={{ ["--d" as string]: 6, color: c.folk }} viewBox="0 0 500 700" width={500} height={700} fill={c.folk}>
        <Folk />
      </svg>
      <svg className="kg-l kg-front" style={{ ["--d" as string]: 10 }} viewBox="0 0 500 700" width={500} height={700}>
        <path d={`M-30,-30 L530,-30 L530,730 L-30,730Z ${ARCH}`} fill={c.front} fillRule="evenodd" />
        <g fill={mix(c.light, "#fff", 0.3)} className="kg-perf">
          {PERF.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.4} />
          ))}
        </g>
      </svg>
      <div className="kg-text top" style={{ color: mix(c.light, "#fff", 0.35), ["--d" as string]: 10 } as React.CSSProperties}>
        {d.mantra && <div className="kg-mantra">{d.mantra}</div>}
        <h1 className="kg-title">{d.eyebrow}</h1>
      </div>
      <div className="kg-text bottom" style={{ color: mix(c.light, "#fff", 0.35), ["--d" as string]: 10 } as React.CSSProperties}>
        {d.blessingLine && <p className="kg-wish">{d.blessingLine}</p>}
        <div className="kg-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="kg-guest">for {env.guest}</div>}
      </div>
      <div className="kg-paper" />
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  return (
    <div className="page-content cover wd-cover">
      <Box d={d} p={p} />
      {env.mode === "live" && <div className="kg-hint">Move or tilt to look inside</div>}
    </div>
  );
}

export const kaagaz: WedDesign = {
  Frame: ({ p, kind }) => {
    if (kind === "cover") return null;
    const c = tones(p);
    return (
      <>
        <div className="kg-l kg-glow inner" style={{ background: `radial-gradient(ellipse at 50% 50%, ${mix(c.light, "#fff", 0.65)}, ${mix(c.light, "#fff", 0.25)} 60%, ${c.light})` }} />
        <svg className="kg-l kg-front inner" viewBox="0 0 500 700" width={500} height={700}>
          <path d={INNER} fill={c.front} fillRule="evenodd" />
        </svg>
        <div className="kg-paper" />
      </>
    );
  },
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="kg-l kg-glow inner" style={{ background: tones(p).front }} />
    </div>
  ),
};

/* ---------------- intro: pull the cord, the light inside comes on layer by layer ---------------- */

export const lightbox: IntroDef = {
  end: 2.9,
  burst: 2.2,
  hint: { x: 300, y: 450 },
  Over: () => (
    <div className="in-part ls-cord">
      <i />
      <b />
    </div>
  ),
  build: (q) => {
    const layers = [".kg-glow", ".kg-fire", ".kg-town", ".kg-kandil", ".kg-folk", ".kg-front"].map((s) => q(`.kg-box ${s}`)[0]).filter(Boolean);
    const text = q(".kg-box .kg-text");
    const base = layers.map((l) => {
      const f = getComputedStyle(l).filter;
      return f && f !== "none" ? f : "";
    });
    layers.forEach((l, i) => gsap.set(l, { filter: `brightness(0.08) ${base[i]}` }));
    gsap.set(text, { opacity: 0 });
    gsap.set(q(".kg-box .kg-perf"), { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".ls-cord"), { y: 26, duration: 0.18, ease: "power2.in" }, 0.15)
      .to(q(".ls-cord"), { y: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" }, 0.33)
      .to(q(".ls-cord"), { opacity: 0, duration: 0.4 }, 1.2)
      .to(layers[0], { filter: `brightness(1) ${base[0]}`, duration: 0.5, ease: "power2.out" }, 0.36);
    layers.slice(1).forEach((l, i) => tl.to(l, { filter: `brightness(1) ${base[i + 1]}`, duration: 0.45, ease: "power2.out" }, 0.62 + i * 0.22));
    tl.to(q(".kg-box .kg-perf"), { opacity: 1, duration: 0.4 }, 1.7)
      .to(text, { opacity: 1, duration: 0.6, stagger: 0.2 }, 1.8)
      .set([...layers, ...text, ...q(".kg-box .kg-perf")], { clearProps: "filter,opacity" }, 2.85);
    return tl;
  },
};
