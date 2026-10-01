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

/* ============================================================
   Akash Kandil: sky lanterns rise over a still lake at dusk,
   mirrored in the water. Tap to release your own wish.
   ============================================================ */

const WATER = 560;

/** One paper sky lantern with its flame and glow. */
function paintLantern(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, a: number, flick: number) {
  const w = 16 * s;
  const h = 22 * s;
  const g = ctx.createRadialGradient(x, y, 0, x, y, 34 * s);
  g.addColorStop(0, `rgba(255,190,90,${0.45 * a})`);
  g.addColorStop(1, "rgba(255,150,60,0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 34 * s, 0, Math.PI * 2);
  ctx.fill();
  const body = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2);
  body.addColorStop(0, `rgba(255,140,50,${a})`);
  body.addColorStop(0.6, `rgba(255,205,110,${a})`);
  body.addColorStop(1, `rgba(255,240,190,${a})`);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - h / 2 + 3 * s);
  ctx.quadraticCurveTo(x, y - h / 2 - 3 * s, x + w / 2, y - h / 2 + 3 * s);
  ctx.lineTo(x + w * 0.36, y + h / 2);
  ctx.lineTo(x - w * 0.36, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `rgba(255,250,220,${a * (0.7 + 0.3 * flick)})`;
  ctx.beginPath();
  ctx.ellipse(x, y + h / 2 - 2 * s, 2.6 * s, 3.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

const FIELD = (() => {
  const r = rng(4040);
  return Array.from({ length: 40 }, () => ({ x: 20 + r() * 460, sp: 9 + r() * 14, off: r(), s: 0.45 + r() * 0.9, ph: r() * 6.28, sway: 6 + r() * 14 }));
})();

function drawSky(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, wishes: { x: number; t0: number }[]) {
  ctx.clearRect(0, 0, w, h);
  const all: { x: number; y: number; s: number; a: number; f: number }[] = [];
  const travel = WATER + 60;
  for (const l of FIELD) {
    const k = (((t * l.sp) / travel + l.off) % 1 + 1) % 1;
    const y = WATER - 20 - k * travel;
    const s = l.s * (1 - k * 0.45);
    const a = Math.min(1, (1 - k) * 2.2) * Math.min(1, k * 6 + 0.2);
    all.push({ x: l.x + Math.sin(t * 0.4 + l.ph) * l.sway, y, s, a, f: Math.sin(t * 9 + l.ph) });
  }
  for (const wsh of wishes) {
    const age = t - wsh.t0;
    if (age < 0 || age > 26) continue;
    const y = WATER - 30 - age * 26;
    all.push({ x: wsh.x + Math.sin(age * 0.6) * 12, y, s: 1.5 * (1 - age / 40), a: Math.min(1, (26 - age) / 6), f: Math.sin(age * 9) });
  }
  all.sort((p, q) => p.s - q.s);
  for (const l of all) if (l.y < WATER) paintLantern(ctx, l.x, l.y, l.s, l.a, l.f);
  // their reflections, broken up by the water
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, WATER, w, h - WATER);
  ctx.clip();
  for (const l of all) {
    const ry = WATER + (WATER - l.y) * 0.55;
    if (ry > h) continue;
    for (let k = -2; k <= 2; k++) {
      const wob = Math.sin(t * 2 + l.x * 0.05 + k) * 3;
      ctx.globalAlpha = 0.18 * l.a;
      ctx.fillStyle = "#ffc46b";
      ctx.fillRect(l.x - 5 * l.s + wob, ry + k * 3 * l.s, 10 * l.s, 1.6 * l.s);
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function Scene({ p }: { p: Palette }) {
  const r = rng(12);
  const hill = mix(p.paper, "#000", 0.35);
  return (
    <svg className="ak-scene" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <linearGradient id="ak-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(p.paper, "#000", 0.25)} />
          <stop offset="0.55" stopColor={p.paper2} />
          <stop offset="0.8" stopColor={mix(p.paper2, p.accent, 0.4)} />
        </linearGradient>
        <linearGradient id="ak-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(p.paper2, "#000", 0.35)} />
          <stop offset="1" stopColor={mix(p.paper, "#000", 0.5)} />
        </linearGradient>
      </defs>
      <rect width={500} height={WATER} fill="url(#ak-sky)" />
      {Array.from({ length: 50 }, (_, i) => (
        <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 320)} r={R1(0.4 + r())} fill="#fff" opacity={R1(0.25 + r() * 0.5)} />
      ))}
      <path d={`M0,${WATER} L0,520 C60,500 110,512 160,496 C220,478 280,500 330,486 C390,470 440,492 500,480 L500,${WATER}Z`} fill={hill} />
      <path d={`M0,${WATER} L0,540 C90,528 170,544 250,534 C330,524 420,540 500,532 L500,${WATER}Z`} fill={mix(hill, "#000", 0.3)} />
      <rect y={WATER} width={500} height={700 - WATER} fill="url(#ak-lake)" />
      <g stroke="#fff" strokeOpacity={0.06}>
        {[575, 595, 620, 650, 685].map((y) => (
          <line key={y} x1={0} y1={y} x2={500} y2={y} />
        ))}
      </g>
      {/* the jetty and the family releasing a lantern */}
      <path d="M-10,700 L-10,640 L210,630 L220,642 L0,700Z" fill="#1a120c" />
      {[20, 70, 120, 170].map((x) => (
        <rect key={x} x={x} y={636} width={5} height={60} fill="#120c08" />
      ))}
      <g fill="#0c0806">
        <circle cx={120} cy={566} r={8} />
        <path d="M110,576 Q120,572 130,576 L134,632 L106,632Z" />
        <circle cx={150} cy={572} r={7} />
        <path d="M141,581 Q150,577 159,581 L166,632 L136,632Z" />
        <circle cx={92} cy={590} r={5.5} />
        <path d="M86,597 Q92,594 98,597 L100,632 L84,632Z" />
        <path d="M118,578 L132,552 M152,582 L140,552" stroke="#0c0806" strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const wishes = useRef<{ x: number; t0: number }[]>([]);
  const release = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    wishes.current = [...wishes.current.slice(-6), { x: ((e.clientX - r.left) / r.width) * 500, t0: cardClock() }];
  };
  return (
    <div className="page-content cover wd-cover">
      <Scene p={p} />
      <LiveCanvas width={500} height={700} className="ak-sky" draw={(ctx, t, w, h) => drawSky(ctx, t, w, h, wishes.current)} />
      <div className="ak-glow" />
      <div className="ak-text">
        {d.mantra && <div className="ak-mantra">{d.mantra}</div>}
        <h1 className="ak-title foil-text">{d.eyebrow}</h1>
        {d.blessingLine && <p className="ak-wish">{d.blessingLine}</p>}
        <div className="ak-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="ak-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <div className="ak-tap" data-no-flip onPointerDown={release} />
          <div className="ak-hint">Tap to release a lantern with your wish</div>
        </>
      )}
    </div>
  );
}

export const kandil: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="ak-page" />
        <LiveCanvas width={500} height={700} className="ak-sky dim" stillAt={kind.length * 3} draw={(ctx, t, w, h) => drawSky(ctx, t * 0.7, w, h, [])} />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="ak-page" />
    </div>
  ),
};

/* ---------------- intro: one lantern lifts from the jetty, the sky follows ---------------- */

export const release: IntroDef = {
  end: 2.6,
  burst: 2.0,
  hint: { x: 300, y: 420 },
  Over: () => (
    <div className="in-part rl-wrap">
      <div className="rl-dark" />
      <div className="rl-lantern">
        <i />
      </div>
    </div>
  ),
  build: (q) => {
    gsap.set(q(".ak-text"), { opacity: 0, y: 14 });
    gsap.set(q(".rl-lantern"), { x: 0, y: 0, scale: 1 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".rl-lantern"), { y: -440, x: 30, scale: 0.55, duration: 2.0, ease: "power1.inOut" }, 0.1)
      .to(q(".rl-lantern"), { opacity: 0, duration: 0.5 }, 1.8)
      .to(q(".rl-dark"), { opacity: 0, duration: 1.6, ease: "power1.inOut" }, 0.5)
      .to(q(".ak-text"), { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 1.4)
      .set(q(".ak-text"), { clearProps: "opacity,transform" }, 2.55);
    return tl;
  },
};
