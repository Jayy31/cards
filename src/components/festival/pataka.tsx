"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { InviteData, Palette } from "@/lib/types";
import { rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";
import { ClayDiya } from "./roshni";

if (typeof window !== "undefined") gsap.registerPlugin(MotionPathPlugin);

/* ============================================================
   Pataka: a courtyard on cracker night. Anaar fountains erupt,
   chakris spin, rockets go up from bottles. Tap one to light it.
   ============================================================ */

type Cracker = { id: string; kind: "anaar" | "chakri" | "rocket"; x: number; y: number; offset: number };
const CRACKERS: Cracker[] = [
  { id: "a1", kind: "anaar", x: 112, y: 566, offset: 0 },
  { id: "a2", kind: "anaar", x: 250, y: 596, offset: 2.6 },
  { id: "a3", kind: "anaar", x: 388, y: 566, offset: 5.2 },
  { id: "c1", kind: "chakri", x: 176, y: 648, offset: 1.2 },
  { id: "c2", kind: "chakri", x: 328, y: 656, offset: 4.4 },
  { id: "r1", kind: "rocket", x: 452, y: 612, offset: 0.8 },
];

const CYCLE = 7.8;
const ON = 5.2;

/** How strongly a cracker burns at time t: on an auto schedule, or for 6 s after a tap. */
function strength(c: Cracker, t: number, taps: Record<string, number>) {
  const tap = taps[c.id];
  if (tap !== undefined && t - tap >= 0 && t - tap < 6) {
    const a = t - tap;
    return Math.min(1, a * 3) * Math.min(1, (6 - a) * 1.5);
  }
  const ph = ((t + CYCLE - c.offset) % CYCLE + CYCLE) % CYCLE;
  if (ph > ON) return 0;
  return Math.min(1, ph * 2.5) * Math.min(1, (ON - ph) * 1.6);
}

function fountain(ctx: CanvasRenderingContext2D, c: Cracker, t: number, s: number) {
  if (s <= 0) return;
  const f0 = Math.floor(t * 60);
  const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 160);
  g.addColorStop(0, `rgba(255,200,110,${0.35 * s})`);
  g.addColorStop(1, "rgba(255,160,60,0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(c.x - 160, c.y - 160, 320, 320);
  for (let j = 0; j < 72; j++) {
    const f = f0 - j;
    const age = (t * 60 - f) / 60;
    for (let i = 0; i < 6; i++) {
      const r = rng(((f * 977 + i * 131 + c.x * 7) >>> 0) + 3);
      const life = 0.7 + r() * 0.6;
      if (age > life) continue;
      const vx = (r() - 0.5) * 120;
      const vy = -(240 + r() * 220) * s;
      const x = c.x + vx * age;
      const y = c.y - 18 + vy * age + 300 * age * age;
      const k = age / life;
      ctx.globalAlpha = (1 - k) * s;
      ctx.fillStyle = k < 0.3 ? "#fffbe8" : r() > 0.7 ? "#ffd27a" : "#ffad42";
      ctx.beginPath();
      ctx.arc(x, y, 1.6 * (1 - k * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function chakri(ctx: CanvasRenderingContext2D, c: Cracker, t: number, s: number) {
  if (s <= 0) return;
  const spin = t * 26;
  const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 90);
  g.addColorStop(0, `rgba(170,255,170,${0.3 * s})`);
  g.addColorStop(1, "rgba(120,255,140,0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(c.x - 90, c.y - 90, 180, 180);
  const f0 = Math.floor(t * 60);
  for (let j = 0; j < 22; j++) {
    const f = f0 - j;
    const age = (t * 60 - f) / 60;
    const a0 = (f / 60) * 26;
    for (let i = 0; i < 4; i++) {
      const r = rng(((f * 389 + i * 17 + c.x) >>> 0) + 5);
      const life = 0.25 + r() * 0.2;
      if (age > life) continue;
      const a = a0 + (i * Math.PI) / 2;
      const ex = c.x + Math.cos(a) * 12;
      const ey = c.y + Math.sin(a) * 5;
      const ta = a + Math.PI / 2;
      const sp = 160 + r() * 80;
      const x = ex + Math.cos(ta) * sp * age;
      const y = ey + Math.sin(ta) * sp * age * 0.45 - 20 * age;
      ctx.globalAlpha = (1 - age / life) * s;
      ctx.fillStyle = i % 2 ? "#c8ffb0" : "#fff3b0";
      ctx.fillRect(x - 1, y - 1, 2.2, 2.2);
    }
  }
  ctx.globalAlpha = s;
  ctx.strokeStyle = "#fff8d0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(c.x, c.y, 14, 6, 0, spin, spin + 4);
  ctx.stroke();
}

function rocket(ctx: CanvasRenderingContext2D, c: Cracker, t: number, taps: Record<string, number>, cols: string[]) {
  const launches: number[] = [];
  const period = 3.4;
  const k = Math.floor((t - c.offset) / period);
  launches.push(c.offset + k * period, c.offset + (k - 1) * period);
  if (taps[c.id] !== undefined) launches.push(taps[c.id]);
  for (const t0 of launches) {
    const age = t - t0;
    if (age < 0 || age > 2.6) continue;
    const r = rng(Math.round(t0 * 100) + 11);
    const tx = 120 + r() * 260;
    const ty = 110 + r() * 110;
    if (age < 0.8) {
      const p = age / 0.8;
      const e = 1 - (1 - p) * (1 - p);
      const x = c.x + (tx - c.x) * e;
      const y = c.y - 40 + (ty - c.y + 40) * e;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,220,150,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (tx - c.x) * 0.06, y + 26);
      ctx.stroke();
      ctx.fillStyle = "#fff6dc";
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    const a = age - 0.8;
    const fade = 1 - a / 1.8;
    const col = cols[Math.floor(r() * cols.length)];
    const n = 64;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const sp = 80 + (i % 3) * 18;
      const d = sp * (1 - Math.exp(-a * 2.6));
      const x = tx + Math.cos(ang) * d;
      const y = ty + Math.sin(ang) * d + 30 * a * a;
      ctx.globalAlpha = Math.max(0, fade) * (0.6 + 0.4 * Math.sin(a * 24 + i));
      ctx.fillStyle = i % 4 ? col : "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** The clay anaar (paper-wrapped cone), the coiled chakri, the rocket in its bottle. */
function CrackerArt({ c, p }: { c: Cracker; p: Palette }) {
  if (c.kind === "anaar")
    return (
      <g transform={`translate(${c.x} ${c.y})`}>
        <ellipse cx={0} cy={4} rx={20} ry={5} fill="#000" opacity={0.4} />
        <path d="M-16,4 L16,4 L7,-22 L-7,-22Z" fill="#b5562b" />
        <path d="M-14,-2 L14,-2 L12,-8 L-12,-8Z" fill={p.accent} />
        <path d="M-10,-12 L10,-12 L9,-16 L-9,-16Z" fill={p.accent2} />
        <ellipse cx={0} cy={-22} rx={7} ry={2.2} fill="#3a1a0c" />
      </g>
    );
  if (c.kind === "chakri")
    return (
      <g transform={`translate(${c.x} ${c.y})`}>
        <ellipse cx={0} cy={3} rx={18} ry={5} fill="#000" opacity={0.35} />
        <ellipse cx={0} cy={0} rx={15} ry={6} fill={p.accent2} />
        <ellipse cx={0} cy={0} rx={10} ry={4} fill="none" stroke={p.accent} strokeWidth={2} />
        <ellipse cx={0} cy={0} rx={5} ry={2} fill="none" stroke="#fff3c4" strokeWidth={1.2} />
      </g>
    );
  return (
    <g transform={`translate(${c.x} ${c.y})`}>
      <ellipse cx={0} cy={4} rx={14} ry={4} fill="#000" opacity={0.4} />
      <path d="M-9,4 L9,4 L9,-20 Q9,-28 4,-32 L4,-42 L-4,-42 L-4,-32 Q-9,-28 -9,-20Z" fill="#7fb3a0" opacity={0.55} stroke="#cfe8de" strokeWidth={0.8} />
      <line x1={0} y1={-10} x2={2} y2={-76} stroke="#8a5a2a" strokeWidth={1.4} />
      <rect x={-1.5} y={-98} width={7} height={24} rx={2} fill={p.accent} transform="rotate(4)" />
      <path d="M-1.5,-98 L5.5,-98 L2,-106Z" fill="#fff3c4" transform="rotate(4)" />
    </g>
  );
}

function Courtyard({ p }: { p: Palette }) {
  const wall = mix(p.paper2, "#000", 0.25);
  const floorA = mix(p.paper, "#000", 0.2);
  return (
    <svg className="pk-yard" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <linearGradient id="pk-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(p.paper2, "#000", 0.45)} />
          <stop offset="1" stopColor={floorA} />
        </linearGradient>
      </defs>
      <rect y={300} width={500} height={220} fill={wall} />
      {[70, 190, 310, 430].map((x) => (
        <g key={x}>
          <path d={`M${x - 26},470 L${x - 26},380 A26,26 0 0 1 ${x + 26},380 L${x + 26},470Z`} fill={mix(wall, "#000", 0.35)} />
          <path d={`M${x - 26},470 L${x - 26},380 A26,26 0 0 1 ${x + 26},380 L${x + 26},470Z`} fill="none" stroke={mix(wall, "#fff", 0.15)} strokeWidth={1} />
          <ClayDiya x={x - 4} y={466} s={1.1} delay={x / 200} />
        </g>
      ))}
      <rect y={296} width={500} height={8} fill={mix(wall, "#fff", 0.08)} />
      <path d="M0,520 L500,520 L500,700 L0,700Z" fill="url(#pk-floor)" />
      <g stroke="#000" strokeOpacity={0.25}>
        {[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((k) => (
          <line key={k} x1={250 + k * 60} y1={520} x2={250 + k * 170} y2={700} />
        ))}
        {[540, 566, 600, 646].map((y) => (
          <line key={y} x1={0} y1={y} x2={500} y2={y} />
        ))}
      </g>
      <ellipse cx={250} cy={620} rx={150} ry={34} fill="none" stroke="#fff4e0" strokeOpacity={0.18} strokeWidth={3} strokeDasharray="2 8" />
      <ellipse cx={250} cy={620} rx={100} ry={22} fill="none" stroke={p.accent} strokeOpacity={0.25} strokeWidth={6} />
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const taps = useRef<Record<string, number>>({});
  const cols = [p.accent, p.accent2, "#ffd27a", "#9be7ff", "#ff8fc4"];
  return (
    <div className="page-content cover wd-cover">
      <div className="pk-sky" />
      <Courtyard p={p} />
      <svg className="pk-crackers" viewBox="0 0 500 700" width={500} height={700}>
        {CRACKERS.map((c) => (
          <CrackerArt key={c.id} c={c} p={p} />
        ))}
      </svg>
      <LiveCanvas
        width={500}
        height={700}
        className="pk-fx"
        draw={(ctx, t, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = "lighter";
          for (const c of CRACKERS) {
            if (c.kind === "anaar") fountain(ctx, c, t, strength(c, t, taps.current));
            else if (c.kind === "chakri") chakri(ctx, c, t, strength(c, t, taps.current));
            else rocket(ctx, c, t, taps.current, cols);
          }
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }}
      />
      <div className="pk-smoke a" />
      <div className="pk-smoke b" />
      <div className="pk-text">
        {d.mantra && <div className="pk-mantra">{d.mantra}</div>}
        <h1 className="pk-title">{d.eyebrow}</h1>
        {d.blessingLine && <p className="pk-wish">{d.blessingLine}</p>}
        <div className="pk-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="pk-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" &&
        CRACKERS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="pk-hit"
            data-no-flip
            aria-label={`Light the ${c.kind}`}
            style={{ left: c.x - 30, top: c.y - (c.kind === "rocket" ? 110 : 50), height: c.kind === "rocket" ? 130 : 70 }}
            onPointerDown={(e) => {
              e.stopPropagation();
              taps.current = { ...taps.current, [c.id]: cardClock() };
            }}
          />
        ))}
      {env.mode === "live" && <div className="pk-hint">Tap a cracker to light it</div>}
    </div>
  );
}

export const pataka: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="pk-sky inner" />
        <LiveCanvas
          width={500}
          height={700}
          className="pk-fx"
          stillAt={kind.length * 1.3}
          draw={(ctx, t, w, h) => {
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = "lighter";
            rocket(ctx, { id: "x", kind: "rocket", x: 470, y: 720, offset: kind.length * 0.4 }, t, {}, [p.accent, p.accent2, "#ffd27a"]);
            ctx.globalCompositeOperation = "source-over";
          }}
        />
        <div className="pk-ground" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="pk-sky inner" />
    </div>
  ),
};

/* ---------------- intro: light the fuse ---------------- */

const FUSE = "M-10,640 C60,700 120,600 180,640 C220,668 236,626 250,598";

export const fuse: IntroDef = {
  end: 2.4,
  burst: 1.6,
  hint: { x: 300, y: 420 },
  Over: () => (
    <div className="in-part fz-wrap">
      <div className="fz-dark" />
      <svg className="fz-svg" viewBox="0 0 500 700" width={500} height={700}>
        <path className="fz-line" d={FUSE} fill="none" stroke="#c9b48a" strokeWidth={2} strokeDasharray="4 3" />
        <path className="fz-burnt" d={FUSE} fill="none" stroke="#2a1a10" strokeWidth={2.4} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        <g className="fz-spark">
          <circle r={14} fill="#ffb347" opacity={0.35} />
          <circle r={4} fill="#fff6dc" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line key={a} x1={0} y1={0} x2={10} y2={0} stroke="#ffe08a" strokeWidth={1.4} transform={`rotate(${a})`} />
          ))}
        </g>
      </svg>
      <div className="fz-flash" />
    </div>
  ),
  build: (q) => {
    gsap.set(q(".fz-spark"), { x: -10, y: 640 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".fz-spark"), { motionPath: { path: FUSE, autoRotate: false }, duration: 1.1, ease: "none" }, 0.1)
      .to(q(".fz-burnt"), { strokeDashoffset: 0, duration: 1.1, ease: "none" }, 0.1)
      .to(q(".fz-spark"), { scale: 2.4, opacity: 0, duration: 0.2 }, 1.2)
      .to(q(".fz-flash"), { opacity: 0.8, duration: 0.06 }, 1.22)
      .to(q(".fz-flash"), { opacity: 0, duration: 0.5 }, 1.3)
      .to(q(".fz-dark"), { opacity: 0, duration: 0.9, ease: "power2.out" }, 1.25)
      .to(q(".fz-svg"), { opacity: 0, duration: 0.4 }, 1.4);
    return tl;
  },
};
