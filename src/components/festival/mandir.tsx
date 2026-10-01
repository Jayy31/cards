"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { InviteData, Palette, Template } from "@/lib/types";
import { rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import { foilFill } from "@/components/card/theme";
import { SymbolMark } from "@/components/card/InvitePages";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";

if (typeof window !== "undefined") gsap.registerPlugin(MotionPathPlugin);

/* ============================================================
   Pooja Mandir: a carved wooden home temple. The aarti thali
   circles with a trail of flame, incense curls, petals fall;
   tap to ring the bells.
   ============================================================ */

/** Aarti orbit, in card coordinates. */
const ORBIT = { cx: 250, cy: 548, rx: 96, ry: 30 };

function Mandir({ p }: { p: Palette }) {
  const wood = "#7a4520";
  const woodD = "#4a2610";
  const fill = foilFill(p);
  return (
    <svg className="pm2-mandir" viewBox="0 0 380 470" width={380} height={470} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pm2-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={woodD} />
          <stop offset="0.3" stopColor={wood} />
          <stop offset="0.55" stopColor="#a8693a" />
          <stop offset="0.8" stopColor={wood} />
          <stop offset="1" stopColor={woodD} />
        </linearGradient>
        <radialGradient id="pm2-velvet" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor={mix(p.accent, "#ffffff", 0.08)} />
          <stop offset="1" stopColor={mix(p.accent, "#000000", 0.55)} />
        </radialGradient>
        <radialGradient id="pm2-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2c0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* roof: tiered canopy with a kalash finial */}
      <g fill="url(#pm2-wood)" stroke={woodD} strokeWidth={1}>
        <path d="M190,6 L198,22 L190,30 L182,22Z" fill={fill} filter="url(#f-foil)" stroke="none" />
        <ellipse cx={190} cy={36} rx={14} ry={6} fill={fill} filter="url(#f-foil)" stroke="none" />
        <path d="M120,96 Q190,24 260,96Z" />
        <path d="M84,128 Q190,58 296,128Z" />
        <rect x={60} y={126} width={260} height={18} rx={3} />
      </g>
      <g fill={fill} filter="url(#f-foil)">
        {Array.from({ length: 13 }, (_, i) => (
          <circle key={i} cx={70 + i * 20} cy={152} r={3} />
        ))}
      </g>
      {/* sanctum */}
      <rect x={70} y={144} width={240} height={252} fill="url(#pm2-velvet)" />
      <circle cx={190} cy={262} r={96} fill="url(#pm2-halo)" className="pm2-halo" />
      {/* scalloped arch */}
      <path d="M70,144 L310,144 L310,214 Q290,176 270,196 Q250,166 230,190 Q210,160 190,186 Q170,160 150,190 Q130,166 110,196 Q90,176 70,214Z" fill="url(#pm2-wood)" stroke={woodD} />
      {/* pillars */}
      {[48, 312].map((x) => (
        <g key={x}>
          <rect x={x} y={140} width={22} height={262} fill="url(#pm2-wood)" stroke={woodD} />
          {[180, 230, 280, 330, 380].map((y) => (
            <rect key={y} x={x - 3} y={y} width={28} height={6} rx={2} fill={wood} stroke={woodD} />
          ))}
        </g>
      ))}
      {/* base with steps */}
      <g fill="url(#pm2-wood)" stroke={woodD}>
        <rect x={36} y={396} width={308} height={22} rx={3} />
        <rect x={24} y={418} width={332} height={22} rx={3} />
        <rect x={12} y={440} width={356} height={24} rx={3} />
      </g>
      <g fill={fill} filter="url(#f-foil)">
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={`M${44 + i * 22},404 l5,6 l-5,6 l-5,-6Z`} />
        ))}
      </g>
      {/* marigold garlands on the pillars */}
      {[59, 323].map((x) =>
        Array.from({ length: 13 }, (_, i) => <circle key={`${x}-${i}`} cx={R1(x + sin(i * 0.9) * 4)} cy={150 + i * 19} r={6} fill={i % 3 === 0 ? "#d6451b" : "#f39c12"} />),
      )}
      {/* swag across the arch */}
      {Array.from({ length: 21 }, (_, i) => {
        const t = i / 20;
        return <circle key={`s${i}`} cx={R1(70 + t * 240)} cy={R1(150 + Math.round(4 * t * (1 - t) * 3400) / 100)} r={5.5} fill={i % 3 === 0 ? "#fff3d0" : "#f39c12"} />;
      })}
    </svg>
  );
}

function Bell({ x }: { x: number }) {
  return (
    <svg className="pm2-bell" viewBox="0 0 40 90" width={40} height={90} style={{ left: x - 20 }}>
      <g className="pm2-sway">
        <line x1={20} y1={0} x2={20} y2={44} stroke="#c9a24a" strokeWidth={1.4} />
        <g filter="url(#f-foil)" fill="url(#foil-gold)">
          <path d="M20,44 C9,46 9,62 6,76 L34,76 C31,62 31,46 20,44Z" />
          <rect x={3} y={75} width={34} height={4} rx={2} />
          <circle cx={20} cy={84} r={3.6} />
        </g>
      </g>
    </svg>
  );
}

const PETAL_SEEDS = (() => {
  const r = rng(77);
  return Array.from({ length: 26 }, () => ({ x: r() * 500, sp: 30 + r() * 40, ph: r() * 6.28, rot: r() * 6, col: r() > 0.5 ? "#e63946" : r() > 0.5 ? "#f39c12" : "#ffb703", o: r() }));
})();

/** Aarti thali, its trail of flame, and petals: all on one live canvas. */
function drawAarti(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, bellAt: number) {
  ctx.clearRect(0, 0, w, h);
  // petals drift down (more after a bell ring)
  const burst = t - bellAt < 3 && t - bellAt >= 0 ? 1 : 0;
  for (const s of PETAL_SEEDS.slice(0, burst ? 26 : 12)) {
    const y = ((s.o * h + t * s.sp) % (h + 40)) - 20;
    const x = s.x + Math.sin(t * 0.8 + s.ph) * 20;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 1.2 + s.rot);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = s.col;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // the trail: positions over the last 0.9 s
  const pos = (tt: number) => {
    const a = tt * 1.7;
    return { x: ORBIT.cx + Math.cos(a) * ORBIT.rx, y: ORBIT.cy + Math.sin(a) * ORBIT.ry - 26, a };
  };
  ctx.globalCompositeOperation = "lighter";
  for (let i = 40; i > 0; i--) {
    const q = pos(t - i * 0.022);
    const k = 1 - i / 40;
    ctx.globalAlpha = k * 0.5;
    ctx.fillStyle = i % 2 ? "#ffb347" : "#ffd27a";
    ctx.beginPath();
    ctx.arc(q.x, q.y, 5 * k + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  // the thali itself (in front when it swings low, it scales a touch)
  const c = pos(t);
  const sc = 0.9 + 0.12 * Math.sin(c.a);
  ctx.save();
  ctx.translate(c.x, c.y + 26);
  ctx.scale(sc, sc);
  ctx.globalAlpha = 1;
  const g = ctx.createLinearGradient(-44, 0, 44, 0);
  g.addColorStop(0, "#7a4e10");
  g.addColorStop(0.45, "#ffe08a");
  g.addColorStop(1, "#8a5a12");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, 44, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(90,55,10,0.45)";
  ctx.beginPath();
  ctx.ellipse(0, -1, 36, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // kumkum, rice, flowers
  ctx.fillStyle = "#c8102e";
  ctx.beginPath();
  ctx.ellipse(-20, -3, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff6e0";
  ctx.beginPath();
  ctx.ellipse(20, -3, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const [fx, fy, col] of [
    [-10, 4, "#f39c12"],
    [12, 5, "#e63946"],
    [-26, 4, "#f39c12"],
  ] as const) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(fx, fy, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // the diya and its flame
  ctx.fillStyle = "#b5562b";
  ctx.beginPath();
  ctx.ellipse(0, -6, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  const fl = 1 + 0.1 * Math.sin(t * 23) + 0.06 * Math.sin(t * 37);
  const fg = ctx.createRadialGradient(0, -18, 0, 0, -18, 26);
  fg.addColorStop(0, "rgba(255,240,190,0.9)");
  fg.addColorStop(1, "rgba(255,150,40,0)");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.arc(0, -18, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffc53d";
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.quadraticCurveTo(7, -16, 0, -8 - 20 * fl);
  ctx.quadraticCurveTo(-7, -16, 0, -8);
  ctx.fill();
  ctx.fillStyle = "#fff7dc";
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.quadraticCurveTo(3.5, -14, 0, -9 - 11 * fl);
  ctx.quadraticCurveTo(-3.5, -14, 0, -9);
  ctx.fill();
  ctx.restore();
}

function Cover({ d, t, p }: { d: InviteData; t: Template; p: Palette }) {
  const env = useCardEnv();
  const bell = useRef(-99);
  const ring = () => {
    bell.current = cardClock();
    const el = document.querySelectorAll(".pm2-bell");
    el.forEach((b) => gsap.fromTo(b, { rotate: -18 }, { rotate: 0, duration: 1.6, ease: "elastic.out(1.2, 0.2)", transformOrigin: "50% 0%" }));
    const r = document.querySelector(".pm2-ripple");
    if (r) gsap.fromTo(r, { scale: 0.3, opacity: 0.8 }, { scale: 2.6, opacity: 0, duration: 1.2, ease: "power2.out" });
  };
  return (
    <div className="page-content cover wd-cover">
      <div className="pm2-wall" />
      <div className="pm2-mandir-wrap">
        <Mandir p={p} />
        <div className="pm2-deity">
          <SymbolMark d={{ ...d, symbol: d.symbol === "none" ? "ganesha-riddhi" : d.symbol }} t={t} p={p} size={1.05} />
        </div>
      </div>
      <Bell x={150} />
      <Bell x={350} />
      <div className="pm2-ripple" />
      <svg className="pm2-incense" viewBox="0 0 80 200" width={80} height={200}>
        <rect x={34} y={186} width={12} height={10} rx={2} fill="#7a4520" />
        <line x1={36} y1={188} x2={30} y2={120} stroke="#5a2a14" strokeWidth={1.6} />
        <line x1={44} y1={188} x2={50} y2={124} stroke="#5a2a14" strokeWidth={1.6} />
        <circle cx={30} cy={120} r={1.6} fill="#ff6a2a" />
        <circle cx={50} cy={124} r={1.6} fill="#ff6a2a" />
        <path className="pm2-smoke" d="M30,118 C20,96 40,80 30,56 C22,38 38,20 30,0" fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={2.4} />
        <path className="pm2-smoke b" d="M50,122 C60,100 42,84 52,60 C60,42 46,24 52,4" fill="none" stroke="#fff" strokeOpacity={0.24} strokeWidth={2} />
      </svg>
      <LiveCanvas width={500} height={700} className="pm2-aarti" draw={(ctx, tt, w, h) => drawAarti(ctx, tt, w, h, bell.current)} />
      <div className="pm2-top">
        {d.mantra && <div className="pm2-mantra">{d.mantra}</div>}
        <h1 className="pm2-title foil-text">{d.eyebrow}</h1>
      </div>
      <div className="pm2-bottom">
        {d.blessingLine && <p className="pm2-wish">{d.blessingLine}</p>}
        <div className="pm2-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="pm2-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <button type="button" className="pm2-hit" data-no-flip aria-label="Ring the bell" onPointerDown={(e) => (e.stopPropagation(), ring())} />
          <div className="pm2-hint">Tap the bells 🔔</div>
        </>
      )}
    </div>
  );
}

export const mandir: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="pm2-wall" />
        <svg className="pm2-toran" viewBox="0 0 500 60" width={500} height={60}>
          {Array.from({ length: 26 }, (_, i) => {
            const t = i / 25;
            return <circle key={i} cx={R1(10 + t * 480)} cy={R1(14 + 4 * t * (1 - t) * 28)} r={6} fill={i % 3 === 0 ? "#d6451b" : "#f39c12"} />;
          })}
        </svg>
      </>
    ),
  Cover: ({ d, t, p }) => <Cover d={d} t={t} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="pm2-wall" />
    </div>
  ),
};

/* ---------------- intro: the aarti traces a circle of light that opens the scene ---------------- */

const CIRCLE = "M300,560 C360,560 400,580 400,600 C400,620 360,640 300,640 C240,640 200,620 200,600 C200,580 240,560 300,560";

export const aarti: IntroDef = {
  end: 2.5,
  burst: 1.7,
  hint: { x: 300, y: 450 },
  Over: () => (
    <div className="in-part aa-wrap">
      <div className="aa-dark" />
      <svg className="aa-svg" viewBox="0 0 600 900" width={600} height={900}>
        <path className="aa-ring" d={CIRCLE} fill="none" stroke="#ffd27a" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" filter="url(#aa-glow)" />
        <defs>
          <filter id="aa-glow" x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="aa-flame">
          <circle r={18} fill="#ffb347" opacity={0.35} />
          <path d="M0,4 C7,-4 6,-12 0,-22 C-6,-12 -7,-4 0,4Z" fill="#ffc53d" />
          <path d="M0,2 C3,-3 3,-8 0,-13 C-3,-8 -3,-3 0,2Z" fill="#fff7dc" />
        </g>
      </svg>
    </div>
  ),
  build: (q) => {
    gsap.set(q(".aa-flame"), { x: 300, y: 560 });
    gsap.set(q(".aa-dark"), { "--rv": "0px" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".aa-flame"), { motionPath: { path: CIRCLE }, duration: 1.1, ease: "power1.inOut" }, 0.1)
      .to(q(".aa-ring"), { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, 0.1)
      .to(q(".aa-svg"), { scale: 6, opacity: 0, transformOrigin: "300px 600px", duration: 0.9, ease: "power2.in" }, 1.25)
      .to(q(".aa-dark"), { "--rv": "1000px", duration: 1.0, ease: "power2.in" }, 1.25)
      .fromTo(q(".pm2-bell"), { rotate: -16, transformOrigin: "50% 0%" }, { rotate: 0, duration: 1.4, ease: "elastic.out(1.2, 0.2)" }, 1.6);
    return tl;
  },
};
