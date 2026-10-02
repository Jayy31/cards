"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import { foilFill, isDark } from "@/components/card/theme";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Swarna: Dhanteras gold. A kalash brimming with coins, Lakshmi's
   footprints walking in, Shubh–Labh, and a slot for a business
   logo. Coins rain in the intro; tap to drop more.
   ============================================================ */

/** Paint one gold coin on a canvas, tilted by `tilt` (1 = face-on). */
export function paintCoin(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tilt: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(1, Math.max(0.12, tilt));
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, "#fff3b8");
  g.addColorStop(0.45, "#e6b84a");
  g.addColorStop(1, "#8a5a12");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(90,55,8,0.7)";
  ctx.lineWidth = r * 0.12;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(120,75,10,0.55)";
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    const a = (i / 6) * Math.PI * 2;
    ctx.ellipse(Math.cos(a) * r * 0.32, Math.sin(a) * r * 0.32, r * 0.12, r * 0.26, a + Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** SVG coin for the static artwork. */
function Coin({ x, y, r, tilt = 1, rot = 0, id = "sw" }: { x: number; y: number; r: number; tilt?: number; rot?: number; id?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1 ${tilt})`}>
      <circle r={r} fill={`url(#${id}-coin)`} />
      <circle r={r * 0.78} fill="none" stroke="#5a3708" strokeOpacity={0.55} strokeWidth={r * 0.1} />
      <circle r={r * 0.2} fill="#7a4e0c" opacity={0.5} />
    </g>
  );
}

/** Lakshmi's footprint: an alta-red foot with toes, a white dotted outline and a lotus on the sole. */
function Foot({ x, y, rot, flip, color }: { x: number; y: number; rot: number; flip?: boolean; color: string }) {
  const sole = "M0,0 C-11,-1 -14,-16 -12,-30 C-10,-44 -4,-54 4,-54 C12,-54 16,-44 15,-30 C14,-18 11,-8 8,-2 C5,2 3,2 0,0Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1.25 : 1.25} 1.25)`} className="sw-foot">
      <path d={sole} fill={color} />
      <path d={sole} fill="none" stroke="#fff4e0" strokeWidth={1.1} strokeDasharray="0.1 3.2" strokeLinecap="round" transform="translate(1 -2) scale(0.86)" />
      {[
        [-7, -60, 4.6],
        [1, -64, 3.8],
        [8, -62, 3.3],
        [13.5, -57, 2.8],
        [17, -50, 2.4],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} />
      ))}
      <g transform="translate(2 -28)" fill="#fff4e0" opacity={0.9}>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-3.4} rx={1.6} ry={3.4} transform={`rotate(${a})`} />
        ))}
        <circle r={1.4} fill={color} />
      </g>
    </g>
  );
}

/** The kalash brimming with coins. */
function Kalash({ id = "sw", fill }: { id?: string; fill: string }) {
  const r = rng(77);
  const heap = Array.from({ length: 26 }, (_, i) => {
    const t = i / 26;
    const x = R1((r() - 0.5) * 120 * (1 - t * 0.6));
    const y = R1(-8 - t * 46 - r() * 6);
    return <Coin key={i} x={x} y={y} r={R1(11 + r() * 4)} tilt={R1(0.35 + r() * 0.3)} rot={R1((r() - 0.5) * 30)} id={id} />;
  });
  const spill = [
    [-96, 128, 13, 0.4, -10],
    [-70, 140, 12, 0.35, 15],
    [84, 132, 13, 0.4, 8],
    [110, 142, 11, 0.32, -12],
    [-30, 146, 12, 0.3, 4],
    [40, 150, 12, 0.3, -6],
  ];
  return (
    <g className="sw-kalash">
      <ellipse cx={0} cy={150} rx={150} ry={18} fill="#000" opacity={0.3} />
      {spill.map(([x, y, rr, t, rot], i) => (
        <Coin key={`s${i}`} x={x} y={y} r={rr} tilt={t} rot={rot} id={id} />
      ))}
      <g className="sw-leaves">
        {[-62, -38, -14, 14, 38, 62].map((a, i) => (
          <path key={i} d="M0,0 C-9,-16 -8,-44 0,-62 C8,-44 9,-16 0,0Z" transform={`translate(0 -18) rotate(${a})`} fill={i % 2 ? "#2f6b2a" : "#3e8a36"} stroke="#1f4a1c" strokeWidth={0.8} />
        ))}
      </g>
      <g filter="url(#f-foil)">
        <path d="M-58,10 C-104,30 -110,104 -60,132 C-30,148 30,148 60,132 C110,104 104,30 58,10 L50,-2 L-50,-2Z" fill={fill} />
        <rect x={-62} y={-10} width={124} height={14} rx={6} fill={fill} />
        <path d="M-92,66 Q0,92 92,66" fill="none" stroke="#5a3708" strokeOpacity={0.4} strokeWidth={3} />
        <path d="M-96,80 Q0,106 96,80" fill="none" stroke="#5a3708" strokeOpacity={0.3} strokeWidth={1.5} />
      </g>
      <path d="M-56,6 Q0,18 56,6" fill="none" stroke="#c8102e" strokeWidth={4} />
      <path d="M-56,10 Q0,22 56,10" fill="none" stroke="#f2c14e" strokeWidth={2} />
      <path d="M40,14 q6,10 2,22 M46,13 q8,10 6,20" fill="none" stroke="#c8102e" strokeWidth={2} strokeLinecap="round" />
      {[-60, -30, 0, 30, 60].map((x, i) => (
        <g key={i} transform={`translate(${x} ${74 + Math.abs(x) * -0.1})`}>
          <path d="M0,-7 L5,0 L0,7 L-5,0Z" fill="#c8102e" opacity={0.85} />
          <circle r={1.6} fill="#ffe7a0" />
        </g>
      ))}
      <path d="M-84,104 Q0,128 84,104" fill="none" stroke="#5a3708" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="2 4" />
      {heap}
    </g>
  );
}

const SPARK = (() => {
  const r = rng(888);
  return Array.from({ length: 40 }, () => ({ x: R1(r() * 500), y: R1(r() * 700), s: R1(1 + r() * 2.4), d: R1(r() * 4) }));
})();

/** Live gold coins: a gentle drift, plus coins dropped by a tap that bounce and settle. */
function CoinDrift() {
  const drops = useRef<{ x: number; t0: number; r: number; rot: number; floor: number }[]>([]);
  return (
    <LiveCanvas
      width={500}
      height={700}
      className="sw-drift"
      onInit={() => {
        const on = (e: Event) => {
          const { x } = (e as CustomEvent).detail;
          const t = cardClock();
          const r = rng(Math.round(t * 1000));
          for (let i = 0; i < 7; i++) drops.current.push({ x: x + (r() - 0.5) * 120, t0: t + i * 0.06, r: 9 + r() * 5, rot: r() * 6, floor: 640 + r() * 30 });
          drops.current = drops.current.slice(-40);
        };
        window.addEventListener("sw-coins", on);
        return () => window.removeEventListener("sw-coins", on);
      }}
      draw={(ctx, t, w, h) => {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < 9; i++) {
          const r = rng(i * 41 + 3);
          const speed = 28 + r() * 30;
          const y = ((r() * h + t * speed) % (h + 40)) - 20;
          const x = r() * w + Math.sin(t * 0.7 + i) * 14;
          ctx.globalAlpha = 0.55;
          paintCoin(ctx, x, y, 6 + r() * 4, Math.abs(Math.sin(t * 2.2 + i)), 0);
        }
        for (const c of drops.current) {
          const age = t - c.t0;
          if (age < 0) continue;
          const g = 900;
          let y = -20 + 0.5 * g * age * age;
          let tilt = Math.abs(Math.sin(age * 9 + c.rot));
          if (y > c.floor) {
            // one small bounce, then rest
            const tHit = Math.sqrt((2 * (c.floor + 20)) / g);
            const after = age - tHit;
            const v = g * tHit * 0.28;
            y = c.floor - Math.max(0, v * after - 0.5 * g * after * after);
            tilt = after > 0.5 ? 0.3 : tilt;
          }
          ctx.globalAlpha = 1;
          paintCoin(ctx, c.x, y, c.r, tilt, c.rot);
        }
        ctx.globalAlpha = 1;
      }}
    />
  );
}

function Velvet({ p }: { p: Palette }) {
  const dark = isDark(p.paper);
  return (
    <svg className="sw-velvet" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <radialGradient id="sw-vel" cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor={mix(p.paper, "#ffffff", dark ? 0.12 : 0.4)} />
          <stop offset="1" stopColor={mix(p.paper, "#000000", dark ? 0.45 : 0.1)} />
        </radialGradient>
        <pattern id="sw-damask" width={60} height={60} patternUnits="userSpaceOnUse">
          <path d="M30,8 C40,18 40,26 30,32 C20,26 20,18 30,8Z M30,32 C38,38 44,48 30,54 C16,48 22,38 30,32Z M0,30 C6,24 12,24 14,30 C12,36 6,36 0,30Z M60,30 C54,24 48,24 46,30 C48,36 54,36 60,30Z" fill={dark ? "#ffffff" : "#000000"} opacity={dark ? 0.035 : 0.04} />
        </pattern>
      </defs>
      <rect width={500} height={700} fill="url(#sw-vel)" />
      <rect width={500} height={700} fill="url(#sw-damask)" />
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const fill = foilFill(p);
  const drop = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    window.dispatchEvent(new CustomEvent("sw-coins", { detail: { x: ((e.clientX - r.left) / r.width) * 500 } }));
  };
  const alta = p.accent;
  return (
    <div className="page-content cover wd-cover">
      <Velvet p={p} />
      <svg className="sw-sparks" viewBox="0 0 500 700" width={500} height={700}>
        {SPARK.map((s, i) => (
          <path key={i} className="twinkle" style={{ animationDelay: `${s.d}s` }} d={`M${s.x},${s.y - s.s * 2} L${s.x + s.s * 0.5},${s.y} L${s.x},${s.y + s.s * 2} L${s.x - s.s * 0.5},${s.y}Z M${s.x - s.s * 2},${s.y} L${s.x},${s.y + s.s * 0.5} L${s.x + s.s * 2},${s.y} L${s.x},${s.y - s.s * 0.5}Z`} fill="#ffe7a0" />
        ))}
      </svg>
      <CoinDrift />
      <svg className="sw-main" viewBox="0 0 500 700" width={500} height={700}>
        <defs>
          <radialGradient id="sw-coin" cx="0.35" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#fff3b8" />
            <stop offset="0.45" stopColor="#e6b84a" />
            <stop offset="1" stopColor="#8a5a12" />
          </radialGradient>
        </defs>
        <g transform="translate(250 390)">
          <Kalash fill={fill} />
        </g>
        {[
          [88, 668, -24],
          [128, 594, -30],
        ].map(([x, y, rot], i) => (
          <g key={`l${i}`}>
            <Foot x={x - 12} y={y} rot={rot} color={alta} />
            <Foot x={x + 18} y={y - 20} rot={rot} flip color={alta} />
          </g>
        ))}
        {[
          [412, 668, 24],
          [372, 594, 30],
        ].map(([x, y, rot], i) => (
          <g key={`r${i}`}>
            <Foot x={x - 18} y={y - 20} rot={rot} color={alta} />
            <Foot x={x + 12} y={y} rot={rot} flip color={alta} />
          </g>
        ))}
      </svg>
      <div className="sw-shubh left foil-text">Shubh</div>
      <div className="sw-shubh right foil-text">Labh</div>
      <div className="sw-top">
        {d.logo ? <div className="sw-logo" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} /> : d.mantra && <div className="sw-mantra">{d.mantra}</div>}
        <h1 className="sw-title foil-text">{d.eyebrow}</h1>
        {d.blessingLine && <p className="sw-wish">{d.blessingLine}</p>}
      </div>
      <div className="sw-from">
        <span>{fromText(d, "with best wishes from")}</span>
        <b className="foil-text">{d.primary.name}</b>
        {env.guest && <em>For {env.guest}</em>}
      </div>
      {env.mode === "live" && (
        <>
          <div className="sw-tap" data-no-flip onPointerDown={drop} />
          <div className="sw-hint">Tap for a shower of gold</div>
        </>
      )}
    </div>
  );
}

export const swarna: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <Velvet p={p} />
        <div className="sw-border" />
        <svg className="sw-corner-coins" viewBox="0 0 500 700" width={500} height={700}>
          <defs>
            <radialGradient id="swi-coin" cx="0.35" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#fff3b8" />
              <stop offset="0.45" stopColor="#e6b84a" />
              <stop offset="1" stopColor="#8a5a12" />
            </radialGradient>
          </defs>
          {[
            [40, 660, 14, 0.4],
            [64, 672, 12, 0.35],
            [26, 678, 11, 0.3],
            [460, 662, 14, 0.4],
            [438, 674, 12, 0.35],
          ].map(([x, y, r, t], i) => (
            <Coin key={i} x={x} y={y} r={r} tilt={t} id="swi" />
          ))}
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Velvet p={p} />
    </div>
  ),
};

/* ---------------- intro: a shower of gold coins ---------------- */

function CoinRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = 600 * dpr;
    c.height = 900 * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(4242);
    const coins = Array.from({ length: 220 }, () => ({ x: 20 + r() * 560, start: r() * 0.55, floor: 900 - Math.pow(r(), 1.6) * 520, rr: 10 + r() * 9, rot: r() * 6, spin: 5 + r() * 8, ang: r() * Math.PI * 2 }));
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = Number(c.dataset.p || 0);
      ctx.clearRect(0, 0, 600, 900);
      for (const k of coins) {
        const tt = Math.max(0, p - k.start) * 2.4;
        if (p <= k.start) continue;
        let y = -30 + 0.5 * 1800 * tt * tt;
        let x = k.x;
        let tilt = Math.abs(Math.sin(tt * k.spin + k.rot));
        if (y >= k.floor) {
          y = k.floor;
          tilt = 0.35;
        }
        if (p > 0.78) {
          // the heap bursts outward
          const b = (p - 0.78) / 0.22;
          x += Math.cos(k.ang) * b * 420;
          y += Math.sin(k.ang) * b * 420 - 200 * b;
          ctx.globalAlpha = 1 - b;
        } else ctx.globalAlpha = 1;
        paintCoin(ctx, x, y, k.rr, tilt, k.rot);
      }
      ctx.globalAlpha = 1;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="cr-canvas" data-p="0" style={{ width: 600, height: 900 }} />;
}

export const coinrain: IntroDef = {
  end: 2.6,
  burst: 2.1,
  hint: { x: 300, y: 470 },
  Over: ({ p, data }) => (
    <div className="in-part cr-wrap">
      <div className="cr-veil" style={{ background: mix(p.paper, "#000", 0.3) }}>
        <div className="cr-title foil-text">{data.eyebrow}</div>
      </div>
      <CoinRain />
      <div className="cr-flash" />
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { opacity: 0, scale: 0.94, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".cr-title"), { opacity: 0, duration: 0.3 }, 0)
      .to(q(".cr-canvas"), { attr: { "data-p": 0.78 }, duration: 1.5, ease: "none" }, 0.05)
      .to(q(".cr-flash"), { opacity: 0.85, duration: 0.08 }, 1.55)
      .to(q(".cr-flash"), { opacity: 0, duration: 0.6 }, 1.65)
      .set(holder, { opacity: 1 }, 1.6)
      .to(q(".cr-veil"), { opacity: 0, duration: 0.4 }, 1.6)
      .to(q(".cr-canvas"), { attr: { "data-p": 1 }, duration: 0.8, ease: "power2.out" }, 1.6)
      .to(holder, { scale: 1, duration: 0.9, ease: "power2.out" }, 1.6)
      .set(holder, { clearProps: "opacity" }, 2.55);
    return tl;
  },
};
