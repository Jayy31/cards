"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";
import { ClayDiya } from "./roshni";

/* ============================================================
   Deep Daan: leaf-boat diyas drift down a river at night past
   a ghat. Tap the water to send ripples and float a diya.
   ============================================================ */

const SHORE = 318;

/** A leaf boat (dona) with marigolds and a lit diya. */
function paintDona(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, t: number, ph: number) {
  // reflection streak first
  const fl = 0.75 + 0.25 * Math.sin(t * 11 + ph);
  for (let k = 0; k < 7; k++) {
    ctx.globalAlpha = 0.22 * fl * (1 - k / 7);
    ctx.fillStyle = "#ffb347";
    const wob = Math.sin(t * 3 + k + ph) * 2.5 * s;
    ctx.fillRect(x - 3 * s + wob, y + 6 * s + k * 5 * s, 6 * s, 2.4 * s);
  }
  ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(x, y - 10 * s, 0, x, y - 10 * s, 30 * s);
  g.addColorStop(0, "rgba(255,200,110,0.4)");
  g.addColorStop(1, "rgba(255,160,60,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y - 10 * s, 30 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2f5a2a";
  ctx.beginPath();
  ctx.moveTo(x - 16 * s, y - 2 * s);
  ctx.quadraticCurveTo(x, y + 8 * s, x + 16 * s, y - 2 * s);
  ctx.quadraticCurveTo(x, y + 2 * s, x - 16 * s, y - 2 * s);
  ctx.fill();
  for (const [dx, col] of [
    [-9, "#f39c12"],
    [9, "#e85d04"],
    [-4, "#ffb703"],
  ] as const) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x + dx * s, y - 1 * s, 2.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#b5562b";
  ctx.beginPath();
  ctx.ellipse(x + 2 * s, y - 3 * s, 4.5 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  const f = 1 + 0.12 * Math.sin(t * 19 + ph);
  ctx.fillStyle = "#ffc53d";
  ctx.beginPath();
  ctx.moveTo(x + 2 * s, y - 4 * s);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 2 * s, y - 4 * s - 9 * s * f);
  ctx.quadraticCurveTo(x - 1 * s, y - 8 * s, x + 2 * s, y - 4 * s);
  ctx.fill();
}

const BOATS = (() => {
  const r = rng(707);
  return Array.from({ length: 16 }, (_, i) => {
    const lane = i % 6;
    return { lane, off: r(), sp: 8 + r() * 10 + lane * 2, ph: r() * 6.28 };
  });
})();
const GLINT = (() => {
  const r = rng(808);
  return Array.from({ length: 90 }, () => ({ x: r() * 500, y: SHORE + 10 + Math.pow(r(), 0.8) * 380, l: 6 + r() * 22, ph: r() * 6.28 }));
})();

function drawRiver(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, taps: { x: number; y: number; t0: number }[]) {
  ctx.clearRect(0, 0, w, h);
  for (const g of GLINT) {
    const a = 0.08 + 0.12 * (0.5 + 0.5 * Math.sin(t * 1.5 + g.ph));
    ctx.globalAlpha = a;
    ctx.fillStyle = "#ffd8a0";
    ctx.fillRect(((g.x + t * 6) % (w + 40)) - 20, g.y, g.l, 1.2);
  }
  // ripples from taps
  for (const p of taps) {
    const age = t - p.t0;
    if (age < 0 || age > 3) continue;
    for (let k = 0; k < 3; k++) {
      const a = age - k * 0.35;
      if (a < 0) continue;
      ctx.globalAlpha = Math.max(0, 0.6 * (1 - a / 2.4));
      ctx.strokeStyle = "#ffe2b0";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, a * 60, a * 18, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // drifting boats, far lanes first
  const items: { x: number; y: number; s: number; ph: number }[] = [];
  for (const b of BOATS) {
    const y = SHORE + 30 + b.lane * 58;
    const s = 0.55 + b.lane * 0.17;
    const x = ((b.off * (w + 80) + t * b.sp) % (w + 80)) - 40;
    items.push({ x, y, s, ph: b.ph });
  }
  for (const p of taps) {
    const age = t - p.t0;
    if (age < 0) continue;
    const s = 0.55 + ((p.y - SHORE - 30) / 58) * 0.17;
    items.push({ x: p.x + age * 14, y: p.y + Math.sin(age * 2) * 2, s: Math.max(0.5, s), ph: p.t0 });
  }
  items.sort((a, b) => a.y - b.y);
  for (const it of items) if (it.x > -40 && it.x < w + 40) paintDona(ctx, it.x, it.y + Math.sin(t * 1.6 + it.ph) * 1.5, it.s, t, it.ph);
  ctx.globalAlpha = 1;
}

function Ghat({ p }: { p: Palette }) {
  const r = rng(91);
  const bank = mix(p.paper, "#000", 0.35);
  return (
    <svg className="dd-ghat" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <linearGradient id="dd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(p.paper, "#000", 0.3)} />
          <stop offset="1" stopColor={p.paper2} />
        </linearGradient>
        <linearGradient id="dd-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(p.paper2, "#000", 0.3)} />
          <stop offset="1" stopColor={mix(p.paper, "#000", 0.55)} />
        </linearGradient>
      </defs>
      <rect width={500} height={SHORE} fill="url(#dd-sky)" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 230)} r={R1(0.4 + r())} fill="#fff" opacity={R1(0.25 + r() * 0.5)} />
      ))}
      {/* far bank: ghat steps, chhatris, a row of lamps */}
      <g fill={bank}>
        <path d={`M0,${SHORE} L0,262 L40,262 L40,250 L90,250 L90,268 L150,268 L150,240 A22,22 0 0 1 194,240 L194,270 L260,270 L260,256 L300,256 L300,232 A26,26 0 0 1 352,232 L352,266 L420,266 L420,250 L470,250 L470,262 L500,262 L500,${SHORE}Z`} />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={0} y={286 + k * 8} width={500} height={4} fill={mix(bank, "#fff", 0.05)} />
        ))}
      </g>
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} className="twinkle" style={{ animationDelay: `${(i % 7) * 0.3}s` }} cx={14 + i * 22.4} cy={R1(278 + (i % 3) * 8)} r={1.8} fill="#ffcf6b" />
      ))}
      <rect y={SHORE} width={500} height={700 - SHORE} fill="url(#dd-water)" />
      {/* near ghat steps, bottom left */}
      <g fill={mix(bank, "#000", 0.2)}>
        <path d="M-10,700 L-10,560 L80,560 L80,590 L140,590 L140,622 L200,622 L200,660 L250,660 L250,700Z" />
      </g>
      <g stroke={mix(bank, "#fff", 0.12)} strokeWidth={1.5}>
        <line x1={-10} y1={560} x2={80} y2={560} />
        <line x1={80} y1={590} x2={140} y2={590} />
        <line x1={140} y1={622} x2={200} y2={622} />
        <line x1={200} y1={660} x2={250} y2={660} />
      </g>
      {[
        [20, 560],
        [56, 560],
        [100, 590],
        [126, 590],
        [160, 622],
        [186, 622],
        [220, 660],
      ].map(([x, y], i) => (
        <ClayDiya key={i} x={x} y={y} s={1.05} delay={i * 0.17} />
      ))}
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const taps = useRef<{ x: number; y: number; t0: number }[]>([]);
  const tap = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 500;
    const y = SHORE + 40 + ((e.clientY - r.top) / r.height) * (700 - SHORE - 120);
    taps.current = [...taps.current.slice(-6), { x, y, t0: cardClock() }];
  };
  return (
    <div className="page-content cover wd-cover">
      <Ghat p={p} />
      <LiveCanvas width={500} height={700} className="dd-river" draw={(ctx, t, w, h) => drawRiver(ctx, t, w, h, taps.current)} />
      <div className="dd-text">
        {d.mantra && <div className="dd-mantra">{d.mantra}</div>}
        <h1 className="dd-title foil-text">{d.eyebrow}</h1>
        {d.blessingLine && <p className="dd-wish">{d.blessingLine}</p>}
        <div className="dd-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="dd-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <div className="dd-tap" data-no-flip onPointerDown={tap} />
          <div className="dd-hint">Tap the water to float a diya</div>
        </>
      )}
    </div>
  );
}

export const deepdaan: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="dd-page" />
        <LiveCanvas width={500} height={700} className="dd-river dim" stillAt={kind.length * 2} draw={(ctx, t, w, h) => drawRiver(ctx, t, w, h, [])} />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="dd-page" />
    </div>
  ),
};

/* ---------------- intro: one diya meets the water, ripples open the night ---------------- */

export const ripple: IntroDef = {
  end: 2.4,
  burst: 1.8,
  hint: { x: 300, y: 450 },
  Over: () => (
    <div className="in-part rp-wrap">
      <div className="rp-dark" />
      <svg className="rp-rings" viewBox="-200 -60 400 120" width={400} height={120}>
        {[0, 1, 2].map((k) => (
          <ellipse key={k} className="rp-ring" rx={60} ry={18} fill="none" stroke="#ffe2b0" strokeWidth={2} />
        ))}
      </svg>
      <div className="rp-diya">
        <svg viewBox="-20 -30 40 40" width={60} height={60}>
          <ellipse cx={0} cy={4} rx={16} ry={4} fill="#2f5a2a" />
          <ellipse cx={2} cy={0} rx={6} ry={2.6} fill="#b5562b" />
          <path d="M2,-1 C6,-6 5,-12 2,-20 C-1,-12 -2,-6 2,-1Z" fill="#ffc53d" />
        </svg>
      </div>
    </div>
  ),
  build: (q) => {
    gsap.set(q(".rp-dark"), { "--rv": "0px" });
    gsap.set(q(".rp-ring"), { scale: 0.1, opacity: 0, transformOrigin: "50% 50%", svgOrigin: "0 0" });
    gsap.set(q(".rp-diya"), { y: -120, opacity: 0 });
    gsap.set(q(".dd-text"), { opacity: 0, y: 10 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".rp-diya"), { y: 0, opacity: 1, duration: 0.5, ease: "power2.in" }, 0)
      .fromTo(q(".rp-ring"), { scale: 0.2, opacity: 0.9 }, { scale: 6, opacity: 0, duration: 1.4, stagger: 0.3, ease: "power2.out" }, 0.5)
      .to(q(".rp-dark"), { "--rv": "1000px", duration: 1.5, ease: "power2.in" }, 0.6)
      .to(q(".rp-diya"), { opacity: 0, duration: 0.4 }, 1.6)
      .to(q(".dd-text"), { opacity: 1, y: 0, duration: 0.7 }, 1.5)
      .set(q(".dd-text"), { clearProps: "opacity,transform" }, 2.35);
    return tl;
  },
};
