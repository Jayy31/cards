"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import { isDark } from "@/components/card/theme";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";
import { ClayDiya } from "./roshni";

/* ============================================================
   Rangoli: a big powder rangoli seen from above, ringed by
   diyas and marigold petals. Drawn ring by ring in the intro;
   tap to scatter petals.
   ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;
const petal = (len: number, w: number) => `M0,0 C${-w},${-len * 0.3} ${-w * 0.7},${-len * 0.85} 0,${-len} C${w * 0.7},${-len * 0.85} ${w},${-len * 0.3} 0,0Z`;
const PAISLEY = "M0,0 C-11,-6 -13,-24 0,-32 C13,-38 22,-24 13,-13 C8,-7 4,-2 0,0Z";

export const powderColors = (p: Palette) => [p.accent, p.accent2, "#ffd60a", p.wax, "#3a86ff", "#ffffff", "#80b918"];

/** The rangoli, centred at 0,0 (radius ~190). Each ring is a group the intro can animate. */
export function RangoliArt({ p, id = "rg" }: { p: Palette; id?: string }) {
  const c = powderColors(p);
  const [mag, saf, yel, teal, blue, white, green] = c;
  const ring = (n: number, r0: number, fn: (i: number, a: number) => React.ReactNode) => Array.from({ length: n }, (_, i) => <g key={i} transform={`rotate(${R1((i * 360) / n)}) translate(0 ${-r0})`}>{fn(i, (i * 360) / n)}</g>);
  const dots = (n: number, r: number, size: number, col: string) => Array.from({ length: n }, (_, i) => <circle key={i} cx={R1(cos(rad((i * 360) / n)) * r)} cy={R1(sin(rad((i * 360) / n)) * r)} r={size} fill={col} />);
  const scallop = (r: number, n: number) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const a0 = rad((i * 360) / n);
      const a1 = rad(((i + 1) * 360) / n);
      d += `${i ? "" : `M${R1(cos(a0) * r)},${R1(sin(a0) * r)}`} A${R1((r * Math.PI) / n)},${R1((r * Math.PI) / n)} 0 0 1 ${R1(cos(a1) * r)},${R1(sin(a1) * r)}`;
    }
    return d + "Z";
  };
  return (
    <g className="rg-art" filter={`url(#${id}-powder)`}>
      <g className="rg-ring">
        <circle r={200} fill={mix(p.paper, "#000", 0.25)} opacity={0.35} />
        {dots(48, 196, 2.4, white)}
      </g>
      <g className="rg-ring">
        {ring(8, 164, (i) => (
          <g>
            <path d={PAISLEY} transform="rotate(180) scale(1.05)" fill={i % 2 ? teal : blue} />
            <path d={PAISLEY} transform="rotate(180) scale(0.55) translate(0 6)" fill={white} opacity={0.9} />
            <circle cy={6} r={3} fill={yel} />
          </g>
        ))}
      </g>
      <g className="rg-ring">
        <path d={scallop(160, 36)} fill={mag} />
        <circle r={146} fill={mix(p.paper, "#000", 0.15)} />
        {dots(36, 153, 2.2, yel)}
      </g>
      <g className="rg-ring">
        {ring(24, 124, (i) => (
          <g>
            <path d={petal(26, 7)} transform="translate(0 12)" fill={green} />
            <path d="M0,12 L0,-10" stroke={white} strokeWidth={0.8} opacity={0.7} />
            {i % 2 === 0 && <circle cy={-18} r={2.4} fill={white} />}
          </g>
        ))}
      </g>
      <g className="rg-ring">
        <circle r={104} fill="none" stroke={blue} strokeWidth={11} />
        <circle r={104} fill="none" stroke={white} strokeWidth={2} strokeDasharray="2 6" />
      </g>
      <g className="rg-ring">
        {ring(16, 64, (i) => (
          <g>
            <path d={petal(34, 11)} fill={saf} />
            <path d={petal(18, 6)} transform="translate(0 -14)" fill={i % 2 ? teal : mag} />
          </g>
        ))}
      </g>
      <g className="rg-ring">
        <circle r={60} fill={white} opacity={0.95} />
        {dots(20, 60, 3, mag)}
      </g>
      <g className="rg-ring">
        {ring(8, 12, (i) => (
          <g>
            <path d={petal(44, 15)} fill={mag} />
            <path d={petal(30, 8)} transform="translate(0 -4)" fill={mix(mag, "#ffffff", 0.45)} />
            <path d="M0,-4 L0,-36" stroke={white} strokeWidth={1} opacity={0.8} />
          </g>
        ))}
        {ring(8, 30, () => (
          <circle r={3.4} fill={yel} />
        ))}
      </g>
      <g className="rg-ring">
        <circle r={14} fill={yel} />
        <circle r={7} fill={saf} />
        <circle r={2.6} fill={white} />
      </g>
    </g>
  );
}

const PETALS = (() => {
  const r = rng(301);
  return Array.from({ length: 34 }, () => ({ x: R1(r() * 500), y: R1(r() * 700), a: R1(r() * 360), s: R1(0.7 + r() * 0.8), c: r() > 0.3 ? "#ff9500" : "#ffc300" }));
})();

/** Tap-thrown marigold petals (live). */
function PetalToss() {
  const bursts = React.useRef<{ x: number; y: number; t0: number }[]>([]);
  return (
    <LiveCanvas
      width={500}
      height={700}
      className="rg-toss"
      onInit={() => {
        const on = (e: Event) => {
          const { x, y } = (e as CustomEvent).detail;
          bursts.current = [...bursts.current.slice(-5), { x, y, t0: cardClock() }];
        };
        window.addEventListener("rg-petals", on);
        return () => window.removeEventListener("rg-petals", on);
      }}
      draw={(ctx, t, w, h) => {
        ctx.clearRect(0, 0, w, h);
        for (const b of bursts.current) {
          const age = t - b.t0;
          if (age < 0 || age > 2.4) continue;
          const r = rng(Math.round(b.t0 * 1000));
          for (let i = 0; i < 26; i++) {
            const ang = r() * Math.PI * 2;
            const sp = 60 + r() * 120;
            const x = b.x + Math.cos(ang) * sp * age * 0.9;
            const y = b.y + Math.sin(ang) * sp * age * 0.6 + 70 * age * age;
            ctx.globalAlpha = Math.max(0, 1 - age / 2.4);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(age * 4 + i);
            ctx.fillStyle = i % 3 ? "#ff9500" : "#ffc300";
            ctx.beginPath();
            ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.globalAlpha = 1;
      }}
    />
  );
}

function Floor({ p }: { p: Palette }) {
  const dark = isDark(p.paper);
  return (
    <svg className="rg-floor" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <radialGradient id="rg-floor-light" cx="0.5" cy="0.53" r="0.75">
          <stop offset="0" stopColor={mix(p.paper, "#ffcf8a", dark ? 0.18 : 0.1)} />
          <stop offset="1" stopColor={mix(p.paper, "#000", dark ? 0.35 : 0.08)} />
        </radialGradient>
        <filter id="rg-stone">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="21" />
          <feColorMatrix values={`0 0 0 0 ${dark ? 1 : 0}  0 0 0 0 ${dark ? 1 : 0}  0 0 0 0 ${dark ? 1 : 0}  0 0 0 0.07 0`} />
        </filter>
      </defs>
      <rect width={500} height={700} fill="url(#rg-floor-light)" />
      <rect width={500} height={700} filter="url(#rg-stone)" />
      <g stroke="#000" strokeOpacity={dark ? 0.18 : 0.06} strokeWidth={1}>
        {[140, 280, 420, 560].map((y) => (
          <line key={y} x1={0} y1={y} x2={500} y2={y} />
        ))}
        {[125, 250, 375].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={700} />
        ))}
      </g>
      {PETALS.map((m, i) => (
        <ellipse key={i} cx={m.x} cy={m.y} rx={R1(6 * m.s)} ry={R1(3 * m.s)} transform={`rotate(${m.a} ${m.x} ${m.y})`} fill={m.c} opacity={0.85} />
      ))}
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const toss = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    window.dispatchEvent(new CustomEvent("rg-petals", { detail: { x: ((e.clientX - r.left) / r.width) * 500, y: ((e.clientY - r.top) / r.height) * 700 } }));
  };
  return (
    <div className="page-content cover wd-cover">
      <Floor p={p} />
      <svg className="rg-main" viewBox="0 0 500 700" width={500} height={700}>
        <defs>
          <filter id="rg-powder" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" result="d" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.4 0 0 0 1.5" result="m" />
            <feComposite in="d" in2="m" operator="in" />
          </filter>
        </defs>
        <g transform="translate(250 372)">
          <RangoliArt p={p} />
        </g>
        <g className="rg-diyas">
          {Array.from({ length: 8 }, (_, i) => {
            const a = rad(i * 45 - 90);
            return <ClayDiya key={i} x={R1(250 + cos(a) * 208 - 4)} y={R1(372 + sin(a) * 208 + 10)} s={1.35} delay={i * 0.11} />;
          })}
        </g>
      </svg>
      <PetalToss />
      <div className="rg-text top">
        {d.mantra && <div className="rg-mantra">{d.mantra}</div>}
        <h1 className="rg-title foil-text">{d.eyebrow}</h1>
      </div>
      <div className="rg-text bottom">
        {d.blessingLine && <p className="rg-wish">{d.blessingLine}</p>}
        <div className="rg-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="rg-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <div className="rg-tap" data-no-flip onPointerDown={toss} />
          <div className="rg-hint">Tap to shower petals</div>
        </>
      )}
    </div>
  );
}

export const rangoli: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <Floor p={p} />
        <svg className="rg-corner" viewBox="-200 -200 400 400" width={300} height={300}>
          <defs>
            <filter id={`rgc-powder`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
            </filter>
          </defs>
          <RangoliArt p={p} id="rgc" />
        </svg>
        <svg className="rg-corner b" viewBox="-200 -200 400 400" width={300} height={300}>
          <RangoliArt p={p} id="rgc" />
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Floor p={p} />
    </div>
  ),
};

/* ---------------- intro: the rangoli is drawn, the diyas light in a circle ---------------- */

export const drawrangoli: IntroDef = {
  end: 2.7,
  burst: 2.2,
  hint: { x: 300, y: 472 },
  Over: () => <div className="in-part dr2-veil" />,
  build: (q) => {
    const rings = q(".rg-main .rg-ring").reverse();
    const flames = q(".rg-diyas .fd-flame");
    gsap.set(rings, { opacity: 0, scale: 0.55, transformOrigin: "0px 0px", svgOrigin: "0 0" });
    gsap.set(flames, { scale: 0, transformOrigin: "50% 100%" });
    gsap.set(q(".rg-text"), { opacity: 0, y: 10 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".dr2-veil"), { opacity: 0, duration: 0.6 }, 0)
      .to(rings, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.14, ease: "back.out(1.6)" }, 0.1)
      .to(flames, { scale: 1, duration: 0.25, stagger: 0.09, ease: "back.out(2)" }, 1.3)
      .to(q(".rg-text"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, 1.9)
      .set(q(".rg-text"), { clearProps: "opacity,transform" }, 2.65);
    return tl;
  },
};
