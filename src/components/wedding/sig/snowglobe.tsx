"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { fmtLongDate, initials, rng } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { isDark } from "@/components/card/theme";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { cardClock } from "../live";
import { mix, R1 } from "./util";

/* ============================================================
   Snow Globe: a tiny alpine chalet in a glass dome. Live snow,
   tap (or shake the phone) to send it swirling.
   ============================================================ */

/** Pine tree with snow on its tiers. */
function Pine({ x, y, s, fill, snow }: { x: number; y: number; s: number; fill: string; snow: string }) {
  const tiers = [0, 1, 2];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2} y={-4} width={4} height={8} fill="#3b2a1e" />
      {tiers.map((i) => {
        const w = 22 - i * 5;
        const ty = -6 - i * 12;
        return (
          <g key={i}>
            <path d={`M${-w},${ty} L0,${ty - 20} L${w},${ty}Z`} fill={fill} />
            <path d={`M${-w * 0.7},${ty - 6} Q0,${ty - 12} ${w * 0.7},${ty - 6} L${w * 0.45},${ty - 9} L0,${ty - 20} L${-w * 0.45},${ty - 9}Z`} fill={snow} opacity={0.9} />
          </g>
        );
      })}
    </g>
  );
}

/** The globe: dome with an alpine scene, glass highlights and a wooden base. Snow is drawn separately. */
export function GlobeArt({ p, d, id = "gl" }: { p: Palette; d: InviteData; id?: string }) {
  const [a, b] = coupleOrder(d);
  const night = mix(p.paper2, "#0a1426", 0.35);
  const pine = "#1f4a3a";
  const snow = "#f4f8ff";
  const warm = p.wax;
  return (
    <svg viewBox="0 0 400 470" width={400} height={470} className="gl-art" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-dome`}>
          <circle cx={200} cy={200} r={178} />
        </clipPath>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night} />
          <stop offset="0.7" stopColor={mix(p.paper2, p.accent2, 0.35)} />
        </linearGradient>
        <radialGradient id={`${id}-glass`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.82" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor={p.accent2} stopOpacity="0.45" />
        </radialGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2215" />
          <stop offset="0.35" stopColor="#7a4a2a" />
          <stop offset="0.55" stopColor="#9a6238" />
          <stop offset="1" stopColor="#3a2215" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5a1a" />
          <stop offset="0.45" stopColor="#f3d98a" />
          <stop offset="0.6" stopColor="#c99a3a" />
          <stop offset="1" stopColor="#6b4c14" />
        </linearGradient>
        <radialGradient id={`${id}-win`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c2" />
          <stop offset="1" stopColor={warm} />
        </radialGradient>
      </defs>
      {/* base */}
      <ellipse cx={200} cy={448} rx={176} ry={16} fill="#000" opacity={0.35} />
      <path d="M58,350 L342,350 L372,440 L28,440Z" fill={`url(#${id}-wood)`} />
      <rect x={52} y={340} width={296} height={16} rx={4} fill={`url(#${id}-brass)`} />
      <rect x={30} y={432} width={340} height={10} rx={3} fill={`url(#${id}-brass)`} />
      <rect x={140} y={372} width={120} height={46} rx={6} fill={`url(#${id}-brass)`} />
      <rect x={146} y={378} width={108} height={34} rx={4} fill="none" stroke="#5a3e0c" strokeWidth={1} opacity={0.6} />
      <text x={200} y={402} textAnchor="middle" className="gl-plate">
        {initials(a.name, b?.name).split("").join(" ♥ ")}
      </text>
      {/* the world inside */}
      <g clipPath={`url(#${id}-dome)`}>
        <rect x={0} y={0} width={400} height={400} fill={`url(#${id}-sky)`} />
        <circle cx={120} cy={92} r={18} fill="#fff8e1" opacity={0.92} />
        <circle cx={120} cy={92} r={34} fill="#fff8e1" opacity={0.12} />
        {Array.from({ length: 30 }, (_, i) => {
          const r = rng(i * 13 + 5);
          return <circle key={i} cx={R1(40 + r() * 320)} cy={R1(30 + r() * 140)} r={R1(0.5 + r())} fill="#fff" opacity={0.7} />;
        })}
        <path d="M0,250 L60,190 L100,225 L160,160 L210,215 L260,170 L320,228 L360,196 L400,236 L400,300 L0,300Z" fill={mix(p.paper2, "#ffffff", 0.55)} />
        <path d="M60,190 L72,202 L84,198 L100,225 M160,160 L176,180 L190,176 L210,215 M260,170 L276,186 L290,182 L320,228" fill="none" stroke="#fff" strokeWidth={2} opacity={0.8} />
        <path d="M0,300 Q100,262 200,282 Q300,300 400,270 L400,400 L0,400Z" fill={snow} />
        <path d="M0,330 Q120,300 220,318 Q320,334 400,306 L400,400 L0,400Z" fill="#dfe9f6" />
        <Pine x={70} y={300} s={1.5} fill={pine} snow={snow} />
        <Pine x={100} y={312} s={1.1} fill={mix(pine, "#000", 0.2)} snow={snow} />
        <Pine x={318} y={296} s={1.7} fill={pine} snow={snow} />
        <Pine x={290} y={312} s={1.05} fill={mix(pine, "#000", 0.2)} snow={snow} />
        <Pine x={348} y={316} s={1.15} fill={mix(pine, "#000", 0.1)} snow={snow} />
        {/* chalet */}
        <g transform="translate(200 290)">
          <rect x={-46} y={-44} width={92} height={50} fill="#6b3f22" />
          {[-34, -22, -10, 2, 14, 26, 38].map((y, i) => (
            <line key={i} x1={-46} y1={-44 + i * 7} x2={46} y2={-44 + i * 7} stroke="#4a2a16" strokeWidth={1} opacity={0.6} />
          ))}
          <path d="M-58,-40 L0,-86 L58,-40 L50,-36 L0,-74 L-50,-36Z" fill="#4a2a16" />
          <path d="M-62,-38 L0,-90 L62,-38 L56,-30 L0,-78 L-56,-30Z" fill={snow} />
          <rect x={22} y={-86} width={10} height={22} fill="#5a3a26" />
          <rect x={20} y={-90} width={14} height={6} fill={snow} />
          <rect x={-34} y={-30} width={18} height={16} fill={`url(#${id}-win)`} />
          <rect x={16} y={-30} width={18} height={16} fill={`url(#${id}-win)`} />
          <path d="M-6,6 L-6,-18 Q0,-24 6,-18 L6,6Z" fill={`url(#${id}-win)`} />
          <circle cx={0} cy={-58} r={7} fill={`url(#${id}-win)`} />
          <ellipse cx={0} cy={-6} rx={70} ry={30} fill={warm} opacity={0.12} />
        </g>
        {/* string lights */}
        <path d="M150,252 Q200,266 250,252" fill="none" stroke="#2a1a10" strokeWidth={0.8} />
        {Array.from({ length: 9 }, (_, i) => {
          const t = i / 8;
          const x = 150 + t * 100;
          const y = 252 + Math.round(4 * (1 - (2 * t - 1) * (2 * t - 1)) * 3.5 * 10) / 10;
          return <circle key={i} cx={x} cy={y + 2} r={2} fill={[p.accent, warm, p.accent2][i % 3]} className="twinkle" style={{ animationDelay: `${i * 0.2}s` }} />;
        })}
        {/* the couple */}
        <g transform="translate(200 334)" fill="#1a1414">
          <circle cx={-7} cy={-24} r={3.6} />
          <path d="M-12,-20 L-2,-20 L-1,0 L-13,0Z" />
          <circle cx={7} cy={-23} r={3.4} />
          <path d="M2,-19 L12,-19 L15,0 L-1,0Z" fill="#7a1a26" />
          <path d="M-9,-19 L9,-18" stroke={p.accent} strokeWidth={2} />
        </g>
        {/* settled snow and glass */}
        <path d="M22,330 Q200,300 378,330 L378,400 L22,400Z" fill="#fff" opacity={0.6} />
      </g>
      <circle cx={200} cy={200} r={178} fill={`url(#${id}-glass)`} />
      <path d="M78,118 A150,150 0 0 1 176,48" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.28} />
      <path d="M70,150 A150,150 0 0 1 74,134" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.4} />
      <ellipse cx={300} cy={300} rx={22} ry={9} transform="rotate(-40 300 300)" fill="#fff" opacity={0.14} />
      <circle cx={200} cy={200} r={178} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={1.5} />
    </svg>
  );
}

const FLAKES = (() => {
  const r = rng(77);
  return Array.from({ length: 170 }, () => ({ x: r(), y: r(), v: 0.04 + r() * 0.08, s: 0.8 + r() * 2.2, ph: r() * 6.28, a: r() }));
})();
const OUT = (() => {
  const r = rng(78);
  return Array.from({ length: 70 }, () => ({ x: r(), y: r(), v: 18 + r() * 30, s: 1 + r() * 2.6, ph: r() * 6.28 }));
})();

/**
 * Snow for the cover: big soft flakes outside, and fine flakes inside the
 * dome that swirl when `swirl` (seconds of clock time) is recent.
 */
function drawSnow(ctx: CanvasRenderingContext2D, t: number, w: number, h: number, globe: { cx: number; cy: number; r: number }, swirlAt: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  for (const f of OUT) {
    const y = ((f.y * h + t * f.v) % (h + 20)) - 10;
    const x = f.x * w + Math.sin(t * 0.6 + f.ph) * 14;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(x, y, f.s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(globe.cx, globe.cy, globe.r - 2, 0, Math.PI * 2);
  ctx.clip();
  const since = t - swirlAt;
  const sw = since >= 0 && since < 4 ? Math.pow(1 - since / 4, 1.5) : 0;
  for (const f of FLAKES) {
    // calm: drift down and settle; swirl: orbit the centre, lifted
    const fall = ((f.y + t * f.v) % 1) * 2 - 1;
    let x = globe.cx + (f.x * 2 - 1) * globe.r * 0.9 + Math.sin(t * 0.8 + f.ph) * 6;
    let y = globe.cy + fall * globe.r * 0.9;
    if (sw > 0) {
      const ang = f.ph + since * (2.6 + f.a * 2) * (f.a > 0.5 ? 1 : -1);
      const rad = globe.r * (0.2 + f.a * 0.7);
      x = x * (1 - sw) + (globe.cx + Math.cos(ang) * rad) * sw;
      y = y * (1 - sw) + (globe.cy - 20 + Math.sin(ang) * rad * 0.8) * sw;
    }
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(x, y, f.s * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

/** Live snow canvas for a globe placed at (gx, gy) on a w×h surface; tap/shake stirs it. */
function GlobeSnow({ w, h, gx, gy, interactive = true, swirlAttr = false }: { w: number; h: number; gx: number; gy: number; interactive?: boolean; swirlAttr?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const env = useCardEnv();
  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const globe = { cx: gx + 200, cy: gy + 200, r: 178 };
    let swirlAt = -99;
    if (env.mode === "thumb") {
      drawSnow(ctx, 3, w, h, globe, swirlAt);
      return;
    }
    const stir = () => (swirlAt = cardClock());
    let lastShake = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const m = Math.abs(a.x ?? 0) + Math.abs(a.y ?? 0) + Math.abs(a.z ?? 0);
      if (m > 32 && performance.now() - lastShake > 1500) {
        lastShake = performance.now();
        stir();
      }
    };
    if (interactive && env.mode === "live") {
      window.addEventListener("globe-stir", stir);
      window.addEventListener("devicemotion", onMotion);
    }
    let raf = 0;
    let started = -99;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (swirlAttr) {
        // the intro flips data-swirl to 1: the swirl starts at that moment
        if (c.dataset.swirl === "1") {
          if (started < 0) started = cardClock();
        } else started = -99;
        swirlAt = started;
      }
      drawSnow(ctx, cardClock(), w, h, globe, swirlAt);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("globe-stir", stir);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [w, h, gx, gy, interactive, swirlAttr, env.mode]);
  return <canvas ref={ref} className="gl-snow" data-swirl="0" style={{ width: w, height: h }} />;
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  return (
    <div className="page-content cover wd-cover">
      <div className="gl-globe">
        <GlobeArt p={p} d={d} />
      </div>
      <GlobeSnow w={500} h={700} gx={50} gy={34} />
      {env.mode === "live" && <div className="gl-hit" data-no-flip onPointerDown={() => window.dispatchEvent(new Event("globe-stir"))} />}
      <div className="gl-text">
        <div className="gl-eyebrow">{d.eyebrow}</div>
        <h1 className="gl-names foil-text">
          {a.name}
          {b?.name && <i> &amp; </i>}
          {b?.name}
        </h1>
        <div className="gl-when">
          {fmtLongDate(d.mainDateTime.split("T")[0])}
          {main ? ` · ${main.venue}` : ""}
        </div>
        {env.mode === "live" && <div className="gl-hint">Tap the globe to make it snow</div>}
        {env.guest && (
          <div className="cover-guest">
            <span>Dear</span> {env.guest}
          </div>
        )}
      </div>
    </div>
  );
}

function Flurry({ n = 60, seed = 4 }: { n?: number; seed?: number }) {
  const r = rng(seed);
  return (
    <svg className="gl-flurry" viewBox="0 0 500 700" width={500} height={700}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 700)} r={R1(0.8 + r() * 2.2)} fill="#fff" opacity={R1(0.2 + r() * 0.5)} />
      ))}
    </svg>
  );
}

export const snowglobe: WedDesign = {
  Frame: ({ kind }) => (
    <>
      <div className="gl-bg" />
      {kind !== "cover" && <Flurry n={70} seed={kind.length * 7} />}
      <div className="gl-frost" />
    </>
  ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Flurry n={90} seed={91} />
    </div>
  ),
};

/* ---------------- intro: shake the globe, fall inside ---------------- */

export const shake: IntroDef = {
  end: 2.3,
  burst: 1.6,
  hint: { x: 300, y: 700 },
  Over: ({ p, data }) => (
    <div className="in-part sh-wrap">
      <div className="sh-globe">
        <GlobeArt p={p} d={data} id="glx" />
        <GlobeSnow w={400} h={470} gx={0} gy={0} interactive={false} swirlAttr />
      </div>
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.85, opacity: 0, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".sh-globe"), { rotate: 7, duration: 0.1, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0)
      .to(q(".sh-wrap .gl-snow"), { attr: { "data-swirl": 1 }, duration: 0.01 }, 0)
      .to(q(".sh-globe"), { scale: 3.4, opacity: 0, duration: 0.9, ease: "power2.in" }, 0.85)
      .to(holder, { opacity: 1, duration: 0.4 }, 1.25)
      .to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 1.2)
      .to(q(".sh-wrap"), { opacity: 0, duration: 0.6 }, 1.2)
      .set(holder, { clearProps: "opacity" }, 2.25);
    return tl;
  },
};
