"use client";
import React, { useState } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "@/components/wedding/sig/util";
import { ClayDiya } from "./roshni";

/* ============================================================
   Pehla Diya: one brass diya in the dark. Its light reveals the
   greeting; tap to light a row of diyas, one by one.
   ============================================================ */

/** Card coordinates of the big flame (the glow and the intro centre on it). */
export const FLAME = { x: 377, y: 436 };

/** A living flame: glow, outer, middle and white-hot core, with a blue root. */
export function Flame({ scale = 1 }: { scale?: number }) {
  return (
    <svg className="pd-flame" viewBox="-30 -90 60 100" width={60 * scale} height={100 * scale} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="pd-fglow" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff8a1e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pd-fout" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff7a00" />
          <stop offset="1" stopColor="#ff3d00" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <g className="pd-flick">
        <ellipse cx={0} cy={-34} rx={34} ry={50} fill="url(#pd-fglow)" />
        <path d="M0,4 C16,-10 14,-34 0,-78 C-14,-34 -16,-10 0,4Z" fill="url(#pd-fout)" />
        <path d="M0,2 C11,-10 10,-28 0,-58 C-10,-28 -11,-10 0,2Z" fill="#ffc53d" />
        <path d="M0,0 C6,-8 6,-20 0,-38 C-6,-20 -6,-8 0,0Z" fill="#fff7dc" />
        <ellipse cx={0} cy={-2} rx={4} ry={5} fill="#5a8cff" opacity={0.7} />
      </g>
    </svg>
  );
}

/** A polished brass diya, side view, spout to the right. */
export function BrassDiya({ width = 300 }: { width?: number }) {
  return (
    <svg className="pd-diya" viewBox="0 0 260 170" width={width} height={(width * 170) / 260} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pd-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a3408" />
          <stop offset="0.3" stopColor="#c8892a" />
          <stop offset="0.5" stopColor="#ffe08a" />
          <stop offset="0.68" stopColor="#b8781c" />
          <stop offset="1" stopColor="#4a2a06" />
        </linearGradient>
        <linearGradient id="pd-oil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2408" />
          <stop offset="1" stopColor="#8a5a12" />
        </linearGradient>
        <radialGradient id="pd-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={130} cy={160} rx={150} ry={16} fill="url(#pd-floor)" />
      <ellipse cx={112} cy={156} rx={46} ry={8} fill="#000" opacity={0.5} />
      <path d="M86,140 L138,140 L146,154 L78,154Z" fill="url(#pd-brass)" />
      <path d="M20,68 Q28,138 110,140 Q172,140 198,96 L248,60 Q238,54 222,58 L202,68 Q162,82 110,82 Q52,82 20,68Z" fill="url(#pd-brass)" />
      <ellipse cx={110} cy={70} rx={90} ry={13} fill="url(#pd-brass)" />
      <ellipse cx={110} cy={71} rx={80} ry={9} fill="url(#pd-oil)" />
      <path d="M32,92 Q110,118 186,96" fill="none" stroke="#5a3408" strokeOpacity={0.55} strokeWidth={1.4} />
      {Array.from({ length: 13 }, (_, i) => {
        const t = i / 12;
        return <circle key={i} cx={R1(40 + t * 140)} cy={R1(100 + sin(t * Math.PI) * 10)} r={2} fill="#ffe7a0" opacity={0.75} />;
      })}
      <path d="M40,84 Q70,120 130,124" fill="none" stroke="#fff3c4" strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
      <path d="M232,60 Q238,52 240,44" stroke="#2a1a08" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const total = 7;
  const [lit, setLit] = useState(env.mode === "live" ? 0 : total);
  const done = lit >= total;
  return (
    <div className="page-content cover wd-cover">
      <div className="pd-bg" />
      <div className="pd-glow" style={{ left: FLAME.x - 260, top: FLAME.y - 300 }} />
      <svg className="pd-smoke" viewBox="0 0 60 200" width={60} height={200} style={{ left: FLAME.x - 30, top: FLAME.y - 280 }}>
        <path d="M30,200 C10,160 50,130 30,90 C14,58 44,30 30,0" fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={3} />
      </svg>
      <div className="pd-diya-wrap">
        <BrassDiya width={300} />
      </div>
      <div className="pd-flame-wrap" style={{ left: FLAME.x - 30, top: FLAME.y - 90 }}>
        <Flame />
      </div>
      <div className="pd-text">
        {d.mantra && <div className="pd-mantra">{d.mantra}</div>}
        <h1 className="pd-title foil-text">{d.eyebrow}</h1>
        {d.blessingLine && <p className="pd-wish">{d.blessingLine}</p>}
        <div className="pd-from">
          <span>{fromText(d, "with love from")}</span> {d.primary.name}
        </div>
        {env.guest && <div className="pd-guest">For {env.guest}</div>}
      </div>
      <svg className="pd-row" viewBox="0 0 500 700" width={500} height={700}>
        {Array.from({ length: total }, (_, i) => (
          <g key={i} className={i < lit ? "on" : "off"}>
            <ClayDiya x={58 + i * 64} y={660} s={1.3} lit={i < lit} delay={i * 0.17} clay={mix(p.paper2, "#b5562b", 0.6)} />
          </g>
        ))}
      </svg>
      {env.mode === "live" && (
        <>
          <div className="pd-tap" data-no-flip onPointerDown={() => setLit((n) => Math.min(total, n + 1))} />
          <div className={`pd-hint ${done ? "done" : ""}`}>{done ? "Shubh Deepavali! ✨" : `Tap to light the diyas · ${lit}/${total}`}</div>
        </>
      )}
    </div>
  );
}

export const pehladiya: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="pd-bg" />
        <div className="pd-glow inner" />
        <svg className="pd-row" viewBox="0 0 500 700" width={500} height={700}>
          {[0, 1, 2].map((i) => (
            <ClayDiya key={i} x={190 + i * 60} y={672} s={1} delay={i * 0.3} />
          ))}
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="pd-bg" />
      <div className="pd-glow inner" />
    </div>
  ),
};

/* ---------------- intro: a spark, then the flame's light fills the card ---------------- */

const SPARKS = (() => {
  const r = rng(61);
  return Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + r() * 0.3;
    const L = 30 + r() * 40;
    return { x: R1(cos(a) * L), y: R1(sin(a) * L) };
  });
})();

export const kindle: IntroDef = {
  end: 2.4,
  burst: 1.8,
  hint: { x: 300, y: 380 },
  Over: () => (
    <div className="in-part kd-wrap" style={{ ["--fx" as string]: `${FLAME.x + 50}px`, ["--fy" as string]: `${FLAME.y + 100 - 40}px` }}>
      <div className="kd-dark" />
      <div className="kd-ember" style={{ left: FLAME.x + 50 - 6, top: FLAME.y + 100 - 12 }} />
      <svg className="kd-sparks" viewBox="-80 -80 160 160" width={160} height={160} style={{ left: FLAME.x + 50 - 80, top: FLAME.y + 100 - 86 }}>
        {SPARKS.map((s, i) => (
          <line key={i} x1={0} y1={0} x2={s.x} y2={s.y} stroke={i % 2 ? "#ffd27a" : "#fff3c4"} strokeWidth={1.6} strokeLinecap="round" />
        ))}
      </svg>
    </div>
  ),
  build: (q) => {
    gsap.set(q(".pd-flame"), { scale: 0, transformOrigin: "50% 95%" });
    gsap.set(q(".kd-dark"), { "--rv": "0px" });
    gsap.set(q(".kd-sparks"), { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".kd-sparks"), { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" }, 0.05)
      .to(q(".kd-sparks"), { opacity: 0, duration: 0.3 }, 0.25)
      .to(q(".kd-ember"), { opacity: 0, duration: 0.3 }, 0.3)
      .to(q(".pd-flame"), { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, 0.25)
      .to(q(".kd-dark"), { "--rv": "140px", duration: 0.5, ease: "power2.out" }, 0.3)
      .to(q(".kd-dark"), { "--rv": "120px", duration: 0.15, yoyo: true, repeat: 1 }, 0.8)
      .to(q(".kd-dark"), { "--rv": "1100px", duration: 1.2, ease: "power2.in" }, 1.1)
      .set(q(".pd-flame"), { clearProps: "transform" }, 2.35);
    return tl;
  },
};
