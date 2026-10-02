"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, fmtLongDate, rng, sin } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas } from "../live";
import { mix, R1 } from "./util";

/* ============================================================
   Firefly: a layered papercut forest at night. Each paper layer
   drifts with the phone's tilt; fireflies wander and blink.
   ============================================================ */

/** A ridge of paper-cut pines along a wavy line. */
function ridge(base: number, amp: number, seed: number, tree: number, density: number) {
  const r = rng(seed);
  let d = `M-20,700 L-20,${base}`;
  const step = 500 / density;
  for (let i = 0; i <= density + 1; i++) {
    const x = -20 + i * step;
    const y = base - amp * (0.5 + 0.5 * sin(i * 0.9 + seed)) - r() * amp * 0.4;
    const h = tree * (0.6 + r() * 0.7);
    const w = h * 0.36;
    d += ` L${R1(x - w)},${R1(y)} L${R1(x - w * 0.55)},${R1(y - h * 0.4)} L${R1(x - w * 0.75)},${R1(y - h * 0.4)} L${R1(x - w * 0.35)},${R1(y - h * 0.72)} L${R1(x - w * 0.5)},${R1(y - h * 0.72)} L${R1(x)},${R1(y - h)} L${R1(x + w * 0.5)},${R1(y - h * 0.72)} L${R1(x + w * 0.35)},${R1(y - h * 0.72)} L${R1(x + w * 0.75)},${R1(y - h * 0.4)} L${R1(x + w * 0.55)},${R1(y - h * 0.4)} L${R1(x + w)},${R1(y)}`;
  }
  return d + " L520,700Z";
}

function hills(base: number, amp: number, seed: number) {
  let d = `M-20,700 L-20,${base}`;
  for (let x = -20; x <= 520; x += 20) d += ` L${x},${R1(base - amp * (0.55 + 0.45 * sin(x / 70 + seed)) - amp * 0.3 * sin(x / 23 + seed * 2))}`;
  return d + " L520,700Z";
}

/** The diorama: sky & moon, far hills, forest, lake, near forest, and the swing tree. */
function Diorama({ p, full = true }: { p: Palette; full?: boolean }) {
  const sky = p.paper2;
  const fg = p.paper;
  const c = (t: number) => mix(sky, fg, t);
  const moon = p.accent2;
  const L = (k: number, children: React.ReactNode, cls = "") => (
    <svg className={`ff-layer ${cls}`} style={{ ["--k" as string]: k }} viewBox="0 0 500 700" width={500} height={700} preserveAspectRatio="none">
      {children}
    </svg>
  );
  const r = rng(12);
  return (
    <div className="ff-stage">
      {L(
        1,
        <>
          <defs>
            <linearGradient id="ff-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mix(sky, "#000", 0.35)} />
              <stop offset="0.6" stopColor={sky} />
              <stop offset="1" stopColor={mix(sky, moon, 0.25)} />
            </linearGradient>
            <radialGradient id="ff-moon" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={moon} stopOpacity="0.55" />
              <stop offset="1" stopColor={moon} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x={-20} y={-20} width={540} height={740} fill="url(#ff-sky)" />
          {Array.from({ length: 50 }, (_, i) => (
            <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 300)} r={R1(0.5 + r() * 1.1)} fill="#fff" opacity={R1(0.3 + r() * 0.6)} />
          ))}
          <circle cx={250} cy={136} r={150} fill="url(#ff-moon)" />
          <circle cx={250} cy={136} r={62} fill={moon} />
          <circle cx={226} cy={120} r={10} fill={mix(moon, sky, 0.12)} />
          <circle cx={268} cy={158} r={14} fill={mix(moon, sky, 0.1)} />
          <circle cx={276} cy={112} r={6} fill={mix(moon, sky, 0.12)} />
        </>,
        "sky",
      )}
      {L(2, <path d={hills(380, 70, 1)} fill={c(0.22)} />)}
      {L(3, <path d={ridge(430, 26, 3, 46, 26)} fill={c(0.4)} />)}
      {L(
        4,
        <>
          <rect x={-20} y={452} width={540} height={90} fill={mix(sky, "#000", 0.3)} />
          <ellipse cx={250} cy={470} rx={46} ry={6} fill={moon} opacity={0.5} />
          {[484, 496, 508, 520].map((y, i) => (
            <rect key={y} x={250 - (30 - i * 6)} y={y} width={(30 - i * 6) * 2} height={2} fill={moon} opacity={0.35 - i * 0.07} />
          ))}
        </>,
      )}
      {L(5, <path d={ridge(560, 30, 7, 92, 13)} fill={c(0.68)} />)}
      {full &&
        L(
          8,
          <>
            <path d={hills(640, 40, 11)} fill={fg} />
            {/* the swing tree */}
            <path d="M-20,700 C10,620 20,520 6,420 C0,370 10,330 40,300 L54,310 C30,340 26,380 34,430 C40,470 52,488 90,470 C150,444 230,420 300,410 L302,420 C232,432 160,456 104,488 C70,508 54,560 60,700Z" fill={fg} />
            {[
              [20, 300, 70],
              [70, 270, 60],
              [-10, 250, 60],
              [130, 300, 46],
              [40, 230, 50],
              [190, 360, 34],
              [250, 386, 28],
            ].map(([x, y, s], i) => (
              <circle key={i} cx={x} cy={y} r={s} fill={fg} />
            ))}
            <line x1={232} y1={424} x2={226} y2={556} stroke={fg} strokeWidth={2} />
            <line x1={284} y1={414} x2={290} y2={552} stroke={fg} strokeWidth={2} />
            <rect x={218} y={552} width={80} height={6} rx={2} fill={fg} />
            {/* the couple on the swing */}
            <g fill={fg}>
              <circle cx={246} cy={516} r={8} />
              <path d="M236,526 Q246,520 256,526 L258,552 L234,552Z" />
              <path d="M240,552 L236,578 M252,552 L250,580" stroke={fg} strokeWidth={5} strokeLinecap="round" />
              <circle cx={272} cy={518} r={7.5} />
              <circle cx={278} cy={512} r={4} />
              <path d="M262,528 Q272,522 282,528 L292,560 L260,556Z" />
              <path d="M268,558 L266,580 M280,558 L282,580" stroke={fg} strokeWidth={4.5} strokeLinecap="round" />
            </g>
            {/* grasses */}
            {Array.from({ length: 34 }, (_, i) => {
              const x = R1(110 + i * 12 + r() * 6);
              const h = R1(14 + r() * 26);
              return <path key={i} d={`M${x},660 q${R1((r() - 0.5) * 10)},${-h / 2} ${R1((r() - 0.5) * 16)},${-h}`} stroke={fg} strokeWidth={2.2} fill="none" />;
            })}
          </>,
          "front",
        )}
    </div>
  );
}

const FLIES = (() => {
  const r = rng(5);
  return Array.from({ length: 46 }, () => ({ x: r(), y: 0.38 + r() * 0.58, ax: 20 + r() * 40, ay: 10 + r() * 30, fx: 0.15 + r() * 0.35, fy: 0.2 + r() * 0.4, ph: r() * 6.28, b: 0.6 + r() * 1.4, s: 1.4 + r() * 1.6 }));
})();

function drawFlies(color: string) {
  return (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    for (const f of FLIES) {
      const x = f.x * w + Math.sin(t * f.fx + f.ph) * f.ax;
      const y = f.y * h + Math.cos(t * f.fy + f.ph * 1.3) * f.ay;
      const blink = Math.max(0, Math.sin(t * f.b + f.ph * 3));
      const a = 0.15 + blink * 0.85;
      const g = ctx.createRadialGradient(x, y, 0, x, y, f.s * 7);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = a * 0.55;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, f.s * 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = a;
      ctx.fillStyle = "#fffbe0";
      ctx.beginPath();
      ctx.arc(x, y, f.s * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  return (
    <div className="page-content cover wd-cover">
      <Diorama p={p} />
      <div className="ff-flies">
        <LiveCanvas width={500} height={700} draw={drawFlies(p.accent)} />
      </div>
      <div className="ff-text">
        <div className="ff-eyebrow">{d.eyebrow}</div>
        <h1 className="ff-names">
          {a.name}
          {b?.name && <i> &amp; </i>}
          {b?.name}
        </h1>
        <div className="ff-when">
          {fmtLongDate(d.mainDateTime.split("T")[0])}
          {main ? ` · ${main.venue}` : ""}
        </div>
        {env.guest && <div className="ff-guest">For {env.guest}</div>}
      </div>
    </div>
  );
}

export const firefly: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="ff-page-bg" />
        <svg className="ff-page-ridge" viewBox="0 0 500 700" width={500} height={700}>
          <path d={ridge(690, 16, kind.length * 3, 60, 14)} fill={mix(p.paper2, p.paper, 0.75)} opacity={0.9} />
        </svg>
        <div className="ff-page-flies">
          <LiveCanvas width={500} height={700} draw={drawFlies(p.accent)} stillAt={kind.length} />
        </div>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Diorama p={p} full={false} />
    </div>
  ),
};

/* ---------------- intro: fireflies gather and light the forest ---------------- */

const SWARM = (() => {
  const r = rng(31);
  return Array.from({ length: 40 }, () => {
    const a = r() * Math.PI * 2;
    return { x0: R1(300 + cos(a) * (360 + r() * 140)), y0: R1(450 + sin(a) * (480 + r() * 120)), gx: R1(300 + (r() - 0.5) * 60), gy: R1(450 + (r() - 0.5) * 60), ex: R1(300 + cos(a + 0.6) * (200 + r() * 260)), ey: R1(450 + sin(a + 0.6) * (260 + r() * 300)) };
  });
})();

export const fireflies: IntroDef = {
  end: 2.4,
  burst: 1.7,
  hint: { x: 300, y: 620 },
  Over: () => (
    <div className="in-part fi-wrap">
      <div className="fi-dark" />
      {SWARM.map((s, i) => (
        <i key={i} className="fi-fly" style={{ left: s.x0 - 9, top: s.y0 - 9 }} />
      ))}
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.95, transformOrigin: "50% 50%" });
    gsap.set(q(".fi-dark"), { "--rv": "0px" });
    const flies = q(".fi-fly");
    const tl = gsap.timeline({ paused: true });
    SWARM.forEach((s, i) => {
      tl.to(flies[i], { x: s.gx - s.x0, y: s.gy - s.y0, duration: 0.9, ease: "power2.inOut" }, (i % 10) * 0.02);
      tl.to(flies[i], { x: s.ex - s.x0, y: s.ey - s.y0, duration: 1.0, ease: "power2.out" }, 1.0);
      tl.to(flies[i], { opacity: 0, duration: 0.4 }, 1.75 + (i % 5) * 0.05);
    });
    tl.to(q(".fi-dark"), { "--rv": "900px", duration: 1.2, ease: "power2.in" }, 0.95).to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 1.1);
    return tl;
  },
};
