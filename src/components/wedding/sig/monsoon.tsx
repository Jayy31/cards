"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { fmtLongDate, rng } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { placeOf } from "@/lib/sky";
import { useCardEnv } from "@/components/card/CardEnv";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas } from "../live";

/* ============================================================
   Monsoon: a rain-streaked window at dusk, city lights, a red
   umbrella. Live rain runs down the glass.
   ============================================================ */

const R2 = (v: number) => Math.round(v * 100) / 100;

/** Out-of-focus city lights. */
function Bokeh({ p, n = 28, seed = 5, top = 300, bottom = 640 }: { p: Palette; n?: number; seed?: number; top?: number; bottom?: number }) {
  const r = rng(seed);
  const cols = [p.accent2, "#ffd27a", "#ff9e7a", p.wax, "#9fd3ff"];
  return (
    <svg className="mn-bokeh" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <radialGradient id="mn-bk" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const x = R2(r() * 500);
        const y = R2(top + r() * (bottom - top));
        const s = R2(5 + r() * 22);
        const c = cols[i % cols.length];
        return (
          <g key={i} className="mn-bk" style={{ animationDelay: `${R2(r() * 6)}s` }} opacity={R2(0.3 + r() * 0.45)}>
            <circle cx={x} cy={y} r={s} fill={c} />
            <circle cx={x} cy={y} r={s} fill="url(#mn-bk)" opacity={0.35} />
          </g>
        );
      })}
    </svg>
  );
}

/** Distant skyline with a few lit windows. */
function Skyline({ color, seed = 3 }: { color: string; seed?: number }) {
  const r = rng(seed);
  const blocks: React.ReactNode[] = [];
  let x = -10;
  while (x < 510) {
    const w = R2(26 + r() * 46);
    const h = R2(60 + r() * 150);
    blocks.push(<rect key={x} x={R2(x)} y={R2(560 - h)} width={w} height={h + 20} fill={color} />);
    for (let k = 0; k < 6; k++) if (r() > 0.55) blocks.push(<rect key={`${x}-${k}`} x={R2(x + 5 + r() * (w - 12))} y={R2(560 - h + 8 + r() * (h - 20))} width={3} height={4} fill="#ffd27a" opacity={0.7} />);
    x += w + 2;
  }
  return (
    <svg className="mn-sky" viewBox="0 0 500 700" width={500} height={700}>
      {blocks}
    </svg>
  );
}

/** A couple sharing a red umbrella, in silhouette. */
export function UmbrellaCouple({ width = 170, canopy, body = "#07090d" }: { width?: number; canopy: string; body?: string }) {
  return (
    <svg width={width} height={width * 1.25} viewBox="0 0 160 200" style={{ overflow: "visible" }}>
      <path d="M8,72 Q80,-12 152,72 Q134,63 116,72 Q98,63 80,72 Q62,63 44,72 Q26,63 8,72Z" fill={canopy} />
      <path d="M8,72 Q80,-12 152,72" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={1.2} />
      <g stroke="rgba(0,0,0,.35)" strokeWidth={1}>
        {[8, 44, 80, 116, 152].map((x) => (
          <line key={x} x1={80} y1={14} x2={x} y2={70} />
        ))}
      </g>
      <line x1={80} y1={8} x2={82} y2={124} stroke={body} strokeWidth={2.4} />
      <path d="M82,124 q0,8 -6,8" fill="none" stroke={body} strokeWidth={2.4} />
      <g fill={body}>
        <circle cx={66} cy={92} r={9.5} />
        <path d="M53,104 Q66,99 79,104 L83,172 L50,172Z" />
        <rect x={55} y={170} width={9} height={28} rx={2} />
        <rect x={67} y={170} width={9} height={28} rx={2} />
        <path d="M78,108 Q84,114 82,124" stroke={body} strokeWidth={6} strokeLinecap="round" fill="none" />
        <circle cx={97} cy={96} r={8.5} />
        <circle cx={104} cy={92} r={5} />
        <path d="M88,107 Q97,103 106,107 L118,198 L80,198Z" />
        <path d="M104,108 C116,116 122,140 120,160 C114,140 108,124 100,114Z" opacity={0.9} />
        <path d="M89,112 Q84,118 83,124" stroke={body} strokeWidth={5} strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/** Raindrops resting on the glass, lit from the top left. */
function Droplets({ n = 110, seed = 7, top = 0 }: { n?: number; seed?: number; top?: number }) {
  const r = rng(seed);
  return (
    <svg className="mn-drops" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <radialGradient id="mn-drop" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.35" stopColor="#cfe2ff" stopOpacity="0.18" />
          <stop offset="0.85" stopColor="#0b1422" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const x = R2(r() * 500);
        const y = R2(top + r() * (700 - top));
        const s = R2(1 + r() * r() * 5.5);
        const tall = r() > 0.85;
        return tall ? <ellipse key={i} cx={x} cy={y} rx={s} ry={R2(s * 1.6)} fill="url(#mn-drop)" /> : <circle key={i} cx={x} cy={y} r={s} fill="url(#mn-drop)" />;
      })}
    </svg>
  );
}

const RAIN = (() => {
  const r = rng(99);
  return {
    streaks: Array.from({ length: 150 }, () => ({ x: r() * 540, o: r(), v: 520 + r() * 420, l: 12 + r() * 20, a: 0.12 + r() * 0.2 })),
    slides: Array.from({ length: 16 }, () => ({ x: 20 + r() * 460, o: r(), v: 14 + r() * 40, s: 2.2 + r() * 2.6, trail: 30 + r() * 60 })),
  };
})();

function drawRain(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";
  for (const s of RAIN.streaks) {
    const y = ((s.o * (h + 60) + t * s.v) % (h + 60)) - 30;
    const x = (s.x + y * 0.12) % w;
    ctx.strokeStyle = `rgba(210,225,255,${s.a})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - s.l * 0.12, y - s.l);
    ctx.stroke();
  }
  for (const d of RAIN.slides) {
    const y = ((d.o * (h + 120) + t * d.v) % (h + 120)) - 60;
    const wob = Math.sin(t * 1.3 + d.o * 20) * 1.5;
    const g = ctx.createLinearGradient(0, y - d.trail, 0, y);
    g.addColorStop(0, "rgba(220,235,255,0)");
    g.addColorStop(1, "rgba(220,235,255,0.22)");
    ctx.strokeStyle = g;
    ctx.lineWidth = d.s * 0.7;
    ctx.beginPath();
    ctx.moveTo(d.x, y - d.trail);
    ctx.quadraticCurveTo(d.x + wob, y - d.trail / 2, d.x + wob * 0.5, y);
    ctx.stroke();
    const rg = ctx.createRadialGradient(d.x + wob * 0.5 - d.s * 0.3, y - d.s * 0.3, 0, d.x + wob * 0.5, y, d.s);
    rg.addColorStop(0, "rgba(255,255,255,0.9)");
    rg.addColorStop(0.5, "rgba(200,220,255,0.25)");
    rg.addColorStop(1, "rgba(10,20,35,0.35)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.ellipse(d.x + wob * 0.5, y, d.s, d.s * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  const city = main ? placeOf(`${main.venue} ${main.address}`).name : "";
  return (
    <div className="page-content cover wd-cover">
      <Skyline color={p.paper2} />
      <Bokeh p={p} />
      <div className="mn-street" />
      <div className="mn-couple">
        <UmbrellaCouple width={150} canopy={p.accent} />
      </div>
      <div className="mn-couple reflect">
        <UmbrellaCouple width={150} canopy={p.accent} />
      </div>
      <Droplets />
      <div className="mn-text">
        <div className="mn-eyebrow">{d.eyebrow}</div>
        <h1 className="mn-names">
          <span>{a.name}</span>
          {b?.name && (
            <>
              <i>&amp;</i>
              <span>{b.name}</span>
            </>
          )}
        </h1>
        <div className="mn-when">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
        {city && <div className="mn-city">{main?.venue}</div>}
        {env.guest && (
          <div className="cover-guest">
            <span>Dear</span> {env.guest}
          </div>
        )}
      </div>
      <div className="mn-rain">
        <LiveCanvas width={500} height={700} draw={drawRain} />
      </div>
    </div>
  );
}

export const monsoon: WedDesign = {
  Frame: ({ p, kind }) => (
    <>
      <div className="mn-bg" />
      {kind !== "cover" && <Bokeh p={p} n={14} seed={kind.length * 3} top={480} bottom={700} />}
      {kind !== "cover" && <Droplets n={70} seed={kind.length * 5 + 1} top={360} />}
      <div className="mn-fog" />
      <div className="mn-frame" />
    </>
  ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Bokeh p={p} n={20} seed={31} top={0} bottom={700} />
      <Droplets n={90} seed={33} />
    </div>
  ),
};

/* ---------------- intro: a wiper clears the rain ---------------- */

export const wiper: IntroDef = {
  end: 2.0,
  burst: 1.2,
  hint: { x: 300, y: 470 },
  Over: () => (
    <div className="in-part wi-wrap">
      <div className="wi-glass">
        <Droplets n={170} seed={61} />
        <div className="wi-drip" />
      </div>
      <div className="wi-arm">
        <i />
      </div>
      <div className="wi-flash" />
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.96, transformOrigin: "50% 50%" });
    gsap.set(q(".wi-arm"), { rotate: -95 });
    gsap.set(q(".wi-glass"), { "--sw": "0deg" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".wi-flash"), { opacity: 0.85, duration: 0.06 }, 0)
      .to(q(".wi-flash"), { opacity: 0, duration: 0.25 }, 0.08)
      .to(q(".wi-flash"), { opacity: 0.5, duration: 0.05 }, 0.38)
      .to(q(".wi-flash"), { opacity: 0, duration: 0.3 }, 0.44)
      .to(q(".wi-arm"), { rotate: 95, duration: 1.0, ease: "power1.inOut" }, 0.2)
      .to(q(".wi-glass"), { "--sw": "190deg", duration: 1.0, ease: "power1.inOut" }, 0.2)
      .to(q(".wi-arm"), { rotate: -95, duration: 0.7, ease: "power1.inOut" }, 1.25)
      .to(q(".wi-glass"), { opacity: 0, duration: 0.5 }, 1.2)
      .to(q(".wi-arm"), { opacity: 0, duration: 0.3 }, 1.7)
      .to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 0.8);
    return tl;
  },
};
