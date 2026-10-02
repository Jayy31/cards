"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Roshni: an old-city rooftop on Diwali night. Havelis and
   chhatris, string lights, kandils, a parapet of diyas, and
   fireworks you can launch with a tap. (No moon: it's amavasya.)
   ============================================================ */

/** A clay diya with a flickering flame (class hooks for the intro). */
export function ClayDiya({ x, y, s = 1, clay = "#b5562b", lit = true, delay = 0 }: { x: number; y: number; s?: number; clay?: string; lit?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="fd-diya">
      {lit && (
        <g className="fd-flame">
          <g className="fd-flick" style={{ animationDelay: `${delay}s` }}>
            <ellipse cx={8} cy={-10} rx={14} ry={14} fill="#ffb347" opacity={0.25} />
            <path d="M8,-2 C12,-8 11,-14 8,-22 C5,-14 4,-8 8,-2Z" fill="#ffcf4d" />
            <path d="M8,-3 C10,-7 9.5,-11 8,-15 C6.5,-11 6,-7 8,-3Z" fill="#fff6d0" />
          </g>
        </g>
      )}
      <path d="M-14,0 Q0,12 16,0 Q20,-2 24,-6 Q18,-1 14,-1 Q0,-3 -14,0Z" fill={clay} />
      <path d="M-14,0 Q0,12 16,0" fill="none" stroke="#000" strokeOpacity={0.25} />
      {[-8, -2, 4, 10].map((dx) => (
        <circle key={dx} cx={dx} cy={4} r={1} fill="#ffe08a" opacity={0.8} />
      ))}
    </g>
  );
}

/** Hexagonal star kandil (lantern) with tassels. */
function Kandil({ x, y, color, size = 1 }: { x: number; y: number; color: string; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} className="rs-kandil">
      <line x1={0} y1={-60} x2={0} y2={-24} stroke="#1a1020" strokeWidth={1} />
      <circle r={30} fill={color} opacity={0.25} />
      <path d="M0,-24 L18,-8 L14,16 L0,26 L-14,16 L-18,-8Z" fill={color} />
      <path d="M0,-24 L0,26 M-18,-8 L14,16 M18,-8 L-14,16" stroke="#fff3c4" strokeWidth={0.8} opacity={0.6} />
      <path d="M0,-12 L8,-4 L6,8 L0,12 L-6,8 L-8,-4Z" fill="#fff3c4" opacity={0.65} />
      {[-10, -4, 2, 8].map((dx) => (
        <line key={dx} x1={dx} y1={20} x2={dx * 1.2} y2={40} stroke={color} strokeWidth={1.4} />
      ))}
    </g>
  );
}

/** Old-city skyline: havelis, domes, chhatris; every window can light up. */
function Skyline({ p }: { p: Palette }) {
  const r = rng(11);
  const far = mix(p.paper2, p.paper, 0.55);
  const near = mix(p.paper, "#000000", 0.45);
  const win = p.wax;
  const blocks: React.ReactNode[] = [];
  const windows: React.ReactNode[] = [];
  let x = -10;
  let i = 0;
  while (x < 510) {
    const w = 46 + r() * 50;
    const h = 120 + r() * 140;
    const top = 640 - h;
    const style = i % 3;
    blocks.push(<rect key={`b${i}`} x={R1(x)} y={R1(top)} width={R1(w)} height={R1(h + 20)} fill={near} />);
    if (style === 0) blocks.push(<path key={`d${i}`} d={`M${R1(x + w * 0.2)},${R1(top)} A${R1(w * 0.3)},${R1(w * 0.3)} 0 0 1 ${R1(x + w * 0.8)},${R1(top)}Z`} fill={near} />, <path key={`f${i}`} d={`M${R1(x + w / 2)},${R1(top - w * 0.3 - 10)} L${R1(x + w / 2 + 2)},${R1(top - w * 0.3)} L${R1(x + w / 2 - 2)},${R1(top - w * 0.3)}Z`} fill={near} />);
    if (style === 1) {
      // chhatri: small domed pavilion on pillars
      const cx = x + w / 2;
      blocks.push(
        <g key={`c${i}`} fill={near}>
          <rect x={R1(cx - 16)} y={R1(top - 22)} width={3} height={22} />
          <rect x={R1(cx + 13)} y={R1(top - 22)} width={3} height={22} />
          <rect x={R1(cx - 20)} y={R1(top - 26)} width={40} height={5} />
          <path d={`M${R1(cx - 16)},${R1(top - 26)} A16,16 0 0 1 ${R1(cx + 16)},${R1(top - 26)}Z`} />
        </g>,
      );
    }
    if (style === 2) blocks.push(<path key={`p${i}`} d={`M${R1(x)},${R1(top)} ${Array.from({ length: 6 }, (_, k) => `L${R1(x + (k + 0.5) * (w / 6))},${R1(top - 6)} L${R1(x + (k + 1) * (w / 6))},${R1(top)}`).join(" ")}`} fill={near} />);
    const cols = Math.max(2, Math.floor(w / 18));
    const rows = Math.floor(h / 34);
    for (let rr = 0; rr < rows; rr++)
      for (let cc = 0; cc < cols; cc++) {
        if (r() < 0.45) continue;
        const wx = x + 7 + cc * ((w - 14) / cols);
        const wy = top + 16 + rr * 34;
        windows.push(<path key={`w${i}-${rr}-${cc}`} className="rs-win" d={`M${R1(wx)},${R1(wy + 14)} L${R1(wx)},${R1(wy + 5)} A4,4 0 0 1 ${R1(wx + 8)},${R1(wy + 5)} L${R1(wx + 8)},${R1(wy + 14)}Z`} fill={win} />);
      }
    x += w + 2;
    i++;
  }
  return (
    <svg className="rs-skyline" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <filter id="rs-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M-10,520 L30,500 L60,508 L60,470 L90,470 L90,450 A20,20 0 0 1 130,450 L130,500 L180,490 L210,505 L260,480 L300,496 L340,470 L380,488 L420,460 L460,490 L510,478 L510,700 L-10,700Z" fill={far} />
      {blocks}
      <g filter="url(#rs-glow)">{windows}</g>
    </svg>
  );
}

/** Strands of fairy lights draped between rooftops. */
function StringLights({ p, strands }: { p: Palette; strands: [number, number, number, number, number][] }) {
  const cols = [p.wax, p.accent2, "#fff3c4", p.accent];
  return (
    <svg className="rs-lights" viewBox="0 0 500 700" width={500} height={700}>
      {strands.map(([x1, y1, x2, y2, sag], s) => {
        const n = Math.round((x2 - x1) / 14);
        const pts = Array.from({ length: n + 1 }, (_, k) => {
          const t = k / n;
          return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + sag * 4 * t * (1 - t)];
        });
        return (
          <g key={s}>
            <path d={`M${pts.map(([x, y]) => `${R1(x)},${R1(y)}`).join(" L")}`} fill="none" stroke="#120a18" strokeWidth={0.8} />
            {pts.map(([x, y], k) => (
              <g key={k} className="rs-bulb">
                <g className="twinkle" style={{ animationDelay: `${((k * 7 + s * 3) % 11) * 0.17}s` }}>
                  <circle cx={R1(x)} cy={R1(y + 3)} r={5} fill={cols[(k + s) % cols.length]} opacity={0.3} />
                  <circle cx={R1(x)} cy={R1(y + 3)} r={2} fill={cols[(k + s) % cols.length]} />
                </g>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- fireworks (live, frame-exact for video) ---------------- */

const FW_GAP = 1.15;
const FW_LIFE = 2.0;
type Burst = { x: number; y: number; t0: number; col: string; seed: number; n: number };

function burstAt(k: number, cols: string[]): Burst {
  const r = rng(k * 7919 + 13);
  return { x: 70 + r() * 360, y: 80 + r() * 200, t0: k * FW_GAP + r() * 0.4, col: cols[Math.floor(r() * cols.length)], seed: k, n: 46 + Math.floor(r() * 30) };
}

function drawBurst(ctx: CanvasRenderingContext2D, b: Burst, t: number) {
  const age = t - b.t0;
  if (age < 0 || age > FW_LIFE) return;
  const r = rng(b.seed * 31 + 7);
  // rising rocket trail for the first beat
  if (age < 0.35) {
    const k = age / 0.35;
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = "#ffe8b0";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(b.x, 660 - (660 - b.y) * k);
    ctx.lineTo(b.x, 660 - (660 - b.y) * Math.max(0, k - 0.18));
    ctx.stroke();
    return;
  }
  const a = age - 0.35;
  const fade = 1 - a / (FW_LIFE - 0.35);
  for (let i = 0; i < b.n; i++) {
    const ang = (i / b.n) * Math.PI * 2 + r() * 0.12;
    const sp = 70 + r() * 50;
    const d = sp * (1 - Math.exp(-a * 2.4));
    const x = b.x + Math.cos(ang) * d;
    const y = b.y + Math.sin(ang) * d + 26 * a * a;
    const tw = 0.6 + 0.4 * Math.sin(a * 30 + i);
    ctx.globalAlpha = Math.max(0, fade * tw);
    ctx.fillStyle = i % 5 === 0 ? "#fff6dc" : b.col;
    ctx.beginPath();
    ctx.arc(x, y, 1.7 * (0.6 + fade * 0.6), 0, Math.PI * 2);
    ctx.fill();
    // short comet tail
    ctx.globalAlpha = Math.max(0, fade * 0.35);
    ctx.strokeStyle = b.col;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(b.x + Math.cos(ang) * d * 0.82, b.y + Math.sin(ang) * d * 0.82 + 26 * a * a * 0.8);
    ctx.stroke();
  }
  if (a < 0.12) {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 60);
    g.addColorStop(0, "rgba(255,240,200,0.6)");
    g.addColorStop(1, "rgba(255,240,200,0)");
    ctx.globalAlpha = 1 - a / 0.12;
    ctx.fillStyle = g;
    ctx.fillRect(b.x - 60, b.y - 60, 120, 120);
  }
}

export function Fireworks({ p }: { p: Palette }) {
  const cols = [p.wax, p.accent2, p.accent, "#9be7ff", "#ffffff"];
  const taps = React.useRef<Burst[]>([]);
  return (
    <LiveCanvas
      width={500}
      height={700}
      className="rs-fw"
      onInit={() => {
        const on = (e: Event) => {
          const { x, y } = (e as CustomEvent).detail;
          taps.current.push({ x, y, t0: cardClock() - 0.35, col: cols[taps.current.length % cols.length], seed: 9000 + taps.current.length, n: 70 });
          taps.current = taps.current.slice(-8);
        };
        window.addEventListener("rs-launch", on);
        return () => window.removeEventListener("rs-launch", on);
      }}
      draw={(ctx, t, w, h) => {
        ctx.clearRect(0, 0, w, h);
        const k = Math.floor(t / FW_GAP);
        for (let j = k - 2; j <= k; j++) drawBurst(ctx, burstAt(j, cols), t);
        for (const b of taps.current) drawBurst(ctx, b, t);
        ctx.globalAlpha = 1;
      }}
    />
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const launch = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    window.dispatchEvent(new CustomEvent("rs-launch", { detail: { x: ((e.clientX - r.left) / r.width) * 500, y: ((e.clientY - r.top) / r.height) * 380 } }));
  };
  return (
    <div className="page-content cover wd-cover">
      <div className="rs-sky" />
      <svg className="rs-stars" viewBox="0 0 500 700" width={500} height={700}>
        {Array.from({ length: 60 }, (_, i) => {
          const r = rng(i * 17 + 3);
          return <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 420)} r={R1(0.4 + r())} fill="#fff" opacity={R1(0.3 + r() * 0.5)} />;
        })}
      </svg>
      <Fireworks p={p} />
      <Skyline p={p} />
      <StringLights
        p={p}
        strands={[
          [-10, 470, 200, 440, 40],
          [180, 430, 520, 470, 50],
          [-10, 540, 520, 520, 60],
        ]}
      />
      <svg className="rs-kandils" viewBox="0 0 500 700" width={500} height={700}>
        <Kandil x={92} y={500} color={p.accent2} />
        <Kandil x={404} y={490} color={p.wax} size={1.1} />
        <Kandil x={262} y={556} color={p.accent} size={0.8} />
      </svg>
      <div className="rs-parapet" />
      <svg className="rs-diyas" viewBox="0 0 500 700" width={500} height={700}>
        {Array.from({ length: 9 }, (_, i) => (
          <ClayDiya key={i} x={40 + i * 52} y={648} s={1.25} delay={i * 0.13} />
        ))}
      </svg>
      <div className="rs-dim" />
      <div className="rs-text">
        {d.mantra && <div className="rs-mantra">{d.mantra}</div>}
        <h1 className="rs-title foil-text">{d.eyebrow}</h1>
        {d.blessingLine && <p className="rs-wish">{d.blessingLine}</p>}
        <div className="rs-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="rs-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <div className="rs-tap" data-no-flip onPointerDown={launch} />
          <div className="rs-hint">Tap the sky for fireworks</div>
        </>
      )}
    </div>
  );
}

export const roshni: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="rs-sky inner" />
        <StringLights p={p} strands={[[-10, 22, 520, 30, 40]]} />
        <div className="rs-parapet inner" />
        <svg className="rs-diyas" viewBox="0 0 500 700" width={500} height={700}>
          {Array.from({ length: 7 }, (_, i) => (
            <ClayDiya key={i} x={60 + i * 64} y={676} s={1} delay={i * 0.2} />
          ))}
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="rs-sky inner" />
      <StringLights p={p} strands={[[-10, 300, 520, 320, 80]]} />
    </div>
  ),
};

/* ---------------- intro: the city lights up, then the first rocket ---------------- */

export const lightsup: IntroDef = {
  end: 2.6,
  burst: 1.8,
  hint: { x: 300, y: 540 },
  Over: () => (
    <svg className="in-part lu-burst" viewBox="-150 -150 300 300" width={300} height={300}>
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return <line key={i} x1={0} y1={0} x2={R1(cos(a) * 130)} y2={R1(sin(a) * 130)} stroke={i % 3 ? "#ffd27a" : "#ff8fc4"} strokeWidth={2} strokeLinecap="round" />;
      })}
      <circle r={10} fill="#fff6dc" />
    </svg>
  ),
  build: (q) => {
    const wins = q(".rs-win");
    const bulbs = q(".rs-bulb");
    const flames = q(".rs-diyas .fd-flame");
    gsap.set([...wins, ...bulbs], { opacity: 0 });
    gsap.set(flames, { scale: 0, transformOrigin: "50% 100%" });
    gsap.set(q(".rs-dim"), { opacity: 0.75 });
    gsap.set(q(".lu-burst"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(wins, { opacity: 1, duration: 0.15, stagger: { each: 0.012, from: "random" } }, 0.1)
      .to(q(".rs-dim"), { opacity: 0, duration: 1.4, ease: "power1.inOut" }, 0.2)
      .to(bulbs, { opacity: 1, duration: 0.2, stagger: { each: 0.01, from: "start" } }, 0.7)
      .to(flames, { scale: 1, duration: 0.3, stagger: 0.07, ease: "back.out(2)" }, 1.0)
      .to(q(".lu-burst"), { opacity: 1, scale: 0.3, duration: 0.05 }, 1.6)
      .to(q(".lu-burst"), { scale: 1.6, opacity: 0, duration: 0.9, ease: "power2.out" }, 1.65)
      .set([...wins, ...bulbs], { clearProps: "opacity" }, 2.55);
    return tl;
  },
};
