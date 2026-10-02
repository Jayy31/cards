"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { foilFill } from "@/components/card/theme";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";
import { paintCoin } from "./swarna";

/* ============================================================
   Shree Yantra: Dhanteras blessings in sacred geometry. Nine
   interlocking triangles, two lotus rings and the bhupura, drawn
   in gold, with a stream of gold pouring into the bindu.
   ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;
const S = 104;
/** Card coordinates of the bindu (centre of the yantra). */
const CENTRE = { x: 250, y: 352 };

const UP: [number, number][] = [
  [-0.95, 0.58],
  [-0.72, 0.4],
  [-0.5, 0.24],
  [-0.27, 0.1],
];
const DOWN: [number, number][] = [
  [0.95, -0.58],
  [0.76, -0.42],
  [0.58, -0.28],
  [0.4, -0.14],
  [0.22, -0.02],
];

const tri = (apex: number, base: number, k: number) => {
  const w = Math.sqrt(Math.max(0, 1 - base * base)) * k;
  return `M0,${R1(apex * S)} L${R1(w * S)},${R1(base * S)} L${R1(-w * S)},${R1(base * S)}Z`;
};

const petal = (r0: number, r1: number, a: number, half: number) => {
  const p0 = [cos(rad(a - half)) * r0 * S, sin(rad(a - half)) * r0 * S];
  const p1 = [cos(rad(a + half)) * r0 * S, sin(rad(a + half)) * r0 * S];
  const tip = [cos(rad(a)) * r1 * S, sin(rad(a)) * r1 * S];
  const c0 = [cos(rad(a - half * 0.9)) * r1 * 0.98 * S, sin(rad(a - half * 0.9)) * r1 * 0.98 * S];
  const c1 = [cos(rad(a + half * 0.9)) * r1 * 0.98 * S, sin(rad(a + half * 0.9)) * r1 * 0.98 * S];
  return `M${R1(p0[0])},${R1(p0[1])} Q${R1(c0[0])},${R1(c0[1])} ${R1(tip[0])},${R1(tip[1])} Q${R1(c1[0])},${R1(c1[1])} ${R1(p1[0])},${R1(p1[1])}`;
};

/** The bhupura: a square of three lines with a T-shaped gate on each side. */
const bhupura = (h: number) => {
  const g = 0.32;
  const d = 0.16;
  const H = h * S;
  const G = g * S;
  const D = d * S;
  return `M${-H},${-H} L${-G},${-H} L${-G},${-H - D} L${G},${-H - D} L${G},${-H} L${H},${-H} L${H},${-G} L${H + D},${-G} L${H + D},${G} L${H},${G} L${H},${H} L${G},${H} L${G},${H + D} L${-G},${H + D} L${-G},${H} L${-H},${H} L${-H},${G} L${-H - D},${G} L${-H - D},${-G} L${-H},${-G}Z`;
};

export function YantraArt({ p }: { p: Palette }) {
  const fill = foilFill(p);
  const line = { fill: "none", stroke: fill, strokeWidth: 1.6, strokeLinejoin: "round" as const, pathLength: 1, className: "yt-line" };
  return (
    <svg className="yt-art" viewBox="-200 -200 400 400" width={400} height={400}>
      <defs>
        <filter id="yt-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="yt-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter="url(#yt-glow)">
        {/* bhupura and the three circles */}
        <g className="yt-ring r5">
          {[1.78, 1.7, 1.62].map((h) => (
            <path key={h} d={bhupura(h)} {...line} />
          ))}
        </g>
        <g className="yt-ring r4">
          {[1.54, 1.49, 1.44].map((r) => (
            <circle key={r} r={r * S} {...line} />
          ))}
        </g>
        {/* 16 and 8 lotus petals */}
        <g className="yt-ring r3">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={petal(1.2, 1.42, i * 22.5 - 90, 11) } {...line} fill={mix(p.accent, "#000", 0.2)} fillOpacity={0.18} />
          ))}
          <circle r={1.2 * S} {...line} />
        </g>
        <g className="yt-ring r2">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={petal(1.0, 1.2, i * 45 - 90 + 22.5, 22)} {...line} fill={p.accent} fillOpacity={0.14} />
          ))}
          <circle r={1.0 * S} {...line} />
        </g>
        {/* the nine triangles */}
        <g className="yt-ring r1">
          {DOWN.map(([a, b], i) => (
            <path key={`d${i}`} d={tri(a, b, 0.98 - i * 0.1)} {...line} fill={p.accent} fillOpacity={0.12} />
          ))}
          {UP.map(([a, b], i) => (
            <path key={`u${i}`} d={tri(a, b, 0.98 - i * 0.12)} {...line} fill="#f3c64a" fillOpacity={0.08} />
          ))}
        </g>
      </g>
      <g className="yt-ring r0">
        <circle r={22} fill="url(#yt-core)" className="yt-pulse" />
        <circle r={4} fill={fill} filter="url(#f-foil)" />
      </g>
    </svg>
  );
}

const DUST = (() => {
  const r = rng(551);
  return Array.from({ length: 70 }, () => ({ x: R1(r() * 500), y: R1(r() * 700), s: R1(0.6 + r() * 1.6), d: R1(r() * 4) }));
})();

/** Gold pouring down into the bindu, sparkling where it lands. */
function drawStream(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, boostAt: number) {
  ctx.clearRect(0, 0, w, h);
  const boost = t - boostAt >= 0 && t - boostAt < 3 ? 1 - (t - boostAt) / 3 : 0;
  const f0 = Math.floor(t * 30);
  const n = 3 + Math.round(boost * 5);
  for (let j = 0; j < 30; j++) {
    const f = f0 - j;
    const age = (t * 30 - f) / 30;
    for (let i = 0; i < n; i++) {
      const r = rng(((f * 613 + i * 71) >>> 0) + 9);
      const dur = 0.9 + r() * 0.3;
      if (age > dur) continue;
      const k = age / dur;
      const x = CENTRE.x + (r() - 0.5) * 50 * (1 - k * 0.8);
      const y = 96 + (CENTRE.y - 96) * k * k;
      ctx.globalAlpha = k > 0.9 ? (1 - k) * 10 : Math.min(1, k * 6);
      paintCoin(ctx, x, y, 5 + r() * 4, Math.abs(Math.sin(age * 14 + i)), r() * 6);
    }
  }
  const g = ctx.createRadialGradient(CENTRE.x, CENTRE.y, 0, CENTRE.x, CENTRE.y, 70 + boost * 40);
  g.addColorStop(0, `rgba(255,236,170,${0.55 + boost * 0.3})`);
  g.addColorStop(1, "rgba(255,190,90,0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(CENTRE.x, CENTRE.y, 110, 0, Math.PI * 2);
  ctx.fill();
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const boost = useRef(-99);
  const bless = () => {
    boost.current = cardClock();
    const art = document.querySelector(".yt-art");
    if (art) gsap.fromTo(art, { scale: 1.06, filter: "brightness(1.6)" }, { scale: 1, filter: "brightness(1)", duration: 1.2, ease: "power2.out", transformOrigin: "50% 50%" });
  };
  return (
    <div className="page-content cover wd-cover">
      <div className="yt-bg" />
      <svg className="yt-dust" viewBox="0 0 500 700" width={500} height={700}>
        {DUST.map((s, i) => (
          <circle key={i} className="twinkle" style={{ animationDelay: `${s.d}s` }} cx={s.x} cy={s.y} r={s.s} fill="#ffe7a0" />
        ))}
      </svg>
      <div className="yt-art-wrap">
        <YantraArt p={p} />
      </div>
      <LiveCanvas width={500} height={700} className="yt-stream" draw={(ctx, t, w, h) => drawStream(ctx, t, w, h, boost.current)} />
      <div className="yt-top">
        {d.logo ? <div className="yt-logo" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} /> : d.mantra && <div className="yt-mantra">{d.mantra}</div>}
        <h1 className="yt-title foil-text">{d.eyebrow}</h1>
      </div>
      <div className="yt-bottom">
        {d.blessingLine && <p className="yt-wish">{d.blessingLine}</p>}
        <div className="yt-from">
          <span>{fromText(d, "with blessings from")}</span> {d.primary.name}
        </div>
        {env.guest && <div className="yt-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <button type="button" className="yt-hit" data-no-flip aria-label="Receive blessings" onPointerDown={(e) => (e.stopPropagation(), bless())} />
          <div className="yt-hint">Tap the yantra for blessings</div>
        </>
      )}
    </div>
  );
}

export const yantra: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="yt-bg" />
        <div className="yt-corner tl">
          <YantraArt p={p} />
        </div>
        <div className="yt-corner br">
          <YantraArt p={p} />
        </div>
        <div className="yt-border" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="yt-bg" />
      <div className="yt-back">
        <YantraArt p={p} />
      </div>
    </div>
  ),
};

/* ---------------- intro: drawn from the bindu outward, then the gold begins ---------------- */

export const yantradraw: IntroDef = {
  end: 2.7,
  burst: 2.1,
  hint: { x: 300, y: 640 },
  Over: () => <div className="in-part yd-veil" />,
  build: (q) => {
    const lines = q(".yt-art-wrap .yt-line");
    const rings = ["r0", "r1", "r2", "r3", "r4", "r5"].map((r) => q(`.yt-art-wrap .yt-ring.${r}`)[0]).filter(Boolean);
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(q(".yt-art-wrap .yt-ring.r0"), { scale: 0, transformOrigin: "50% 50%", svgOrigin: "0 0" });
    gsap.set(q(".yt-stream, .yt-top, .yt-bottom"), { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".yd-veil"), { opacity: 0, duration: 0.6 }, 0)
      .to(q(".yt-art-wrap .yt-ring.r0"), { scale: 1, duration: 0.4, ease: "back.out(3)" }, 0.1);
    rings.slice(1).forEach((g, i) => {
      tl.to(g.querySelectorAll(".yt-line"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.01, ease: "power1.inOut" }, 0.3 + i * 0.28);
    });
    tl.to(q(".yt-art-wrap .yt-art"), { filter: "brightness(1.8)", duration: 0.2, yoyo: true, repeat: 1 }, 1.95)
      .to(q(".yt-stream"), { opacity: 1, duration: 0.6 }, 1.8)
      .to(q(".yt-top, .yt-bottom"), { opacity: 1, duration: 0.6, stagger: 0.15 }, 1.9)
      .set([...lines, ...q(".yt-stream, .yt-top, .yt-bottom")], { clearProps: "strokeDasharray,strokeDashoffset,opacity" }, 2.65);
    return tl;
  },
};
