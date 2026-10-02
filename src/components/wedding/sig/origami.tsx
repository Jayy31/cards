"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { fmtLongDate, rng } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { isDark } from "@/components/card/theme";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "./util";

/* ============================================================
   Origami: folded-paper geometry and strings of paper cranes
   (senbazuru, a thousand cranes for a long and happy life).
   ============================================================ */

/** A folded paper crane in flight, faceted so each fold catches the light differently. */
export function Crane({ size = 120, color, flap = true, flip = false }: { size?: number; color: string; flap?: boolean; flip?: boolean }) {
  const L = mix(color, "#ffffff", 0.38);
  const M = color;
  const D = mix(color, "#000000", 0.22);
  const DD = mix(color, "#000000", 0.38);
  const f = (pts: string, c: string) => <path d={`M${pts}Z`} fill={c} />;
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <g className={flap ? "cr-wing back" : undefined}>
        {f("100,62 154,8 114,70", D)}
        {f("114,70 154,8 126,66", DD)}
      </g>
      {f("70,80 100,62 130,80", L)}
      {f("70,80 130,80 100,94", D)}
      {f("78,82 24,40 72,76", M)}
      {f("24,40 12,54 30,46", DD)}
      {f("122,82 186,42 128,76", M)}
      {f("122,82 186,42 126,88", D)}
      <g className={flap ? "cr-wing front" : undefined}>
        {f("100,62 46,2 86,70", L)}
        {f("86,70 46,2 74,66", M)}
      </g>
    </svg>
  );
}

const crColors = (p: Palette) => [p.accent, p.accent2, p.wax, mix(p.accent, p.wax, 0.5), mix(p.accent2, "#ffffff", 0.3)];

/** A hanging string of cranes and beads. */
function Senbazuru({ x, len, n, colors, seed }: { x: number; len: number; n: number; colors: string[]; seed: number }) {
  const r = rng(seed);
  return (
    <div className="or-string" style={{ left: x, height: len }}>
      <i className="or-thread" />
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="or-hang" style={{ top: 24 + (i * (len - 50)) / n, animationDelay: `${R1(r() * 3)}s` }}>
          <Crane size={46} color={colors[(i + seed) % colors.length]} flap={false} flip={i % 2 === 1} />
          <b className="or-bead" />
        </div>
      ))}
    </div>
  );
}

/** Paper with fold creases and faceted light. */
function Creases({ p }: { p: Palette }) {
  const dark = isDark(p.paper);
  const hi = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)";
  const lo = dark ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.06)";
  return (
    <svg className="or-creases" viewBox="0 0 500 700" width={500} height={700}>
      <path d="M0,0 L250,350 L0,700Z" fill={lo} />
      <path d="M500,0 L250,350 L500,700Z" fill={hi} opacity={0.6} />
      <path d="M0,0 L500,0 L250,350Z" fill={hi} opacity={0.4} />
      <g strokeWidth={1}>
        <line x1={0} y1={0} x2={500} y2={700} stroke={hi} />
        <line x1={0.8} y1={0} x2={500.8} y2={700} stroke={lo} />
        <line x1={500} y1={0} x2={0} y2={700} stroke={hi} />
        <line x1={500.8} y1={0} x2={0.8} y2={700} stroke={lo} />
        <line x1={250} y1={0} x2={250} y2={700} stroke={hi} opacity={0.6} />
        <line x1={0} y1={350} x2={500} y2={350} stroke={lo} opacity={0.7} />
      </g>
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const cols = crColors(p);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  return (
    <div className="page-content cover wd-cover">
      <Senbazuru x={38} len={420} n={5} colors={cols} seed={1} />
      <Senbazuru x={92} len={300} n={4} colors={cols} seed={3} />
      <Senbazuru x={404} len={330} n={4} colors={cols} seed={5} />
      <Senbazuru x={456} len={450} n={6} colors={cols} seed={2} />
      <div className="or-hero">
        <Crane size={250} color={p.accent} flap={false} />
      </div>
      <div className="or-shadow" />
      <div className="or-text">
        <div className="or-eyebrow">{d.eyebrow}</div>
        <h1 className="or-names">
          <span>{a.name}</span>
          {b?.name && (
            <>
              <i>&amp;</i>
              <span>{b.name}</span>
            </>
          )}
        </h1>
        <div className="or-when">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
        {main && <div className="or-where">{main.venue}</div>}
        {env.guest && <div className="or-guest">For {env.guest}</div>}
      </div>
    </div>
  );
}

export const origami: WedDesign = {
  Frame: ({ p, kind }) => (
    <>
      <Creases p={p} />
      {kind !== "cover" && (
        <>
          <div className="or-corner tl">
            <Crane size={70} color={crColors(p)[kind.length % 5]} flap={false} />
          </div>
          <div className="or-corner br">
            <Crane size={56} color={crColors(p)[(kind.length + 2) % 5]} flap={false} flip />
          </div>
        </>
      )}
    </>
  ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Creases p={p} />
      <Crane size={160} color={p.accent2} flap={false} />
    </div>
  ),
};

/* ---------------- intro: a flock of cranes takes off ---------------- */

const FLOCK = (() => {
  const r = rng(1000);
  return Array.from({ length: 28 }, (_, i) => {
    const x = 70 + r() * 460;
    const y = 120 + r() * 660;
    const ang = Math.atan2(y - 450, x - 300) + (r() - 0.5) * 0.8;
    return { x: R1(x), y: R1(y), s: R1(48 + r() * 46), c: i % 5, dx: R1(Math.cos(ang) * (520 + r() * 300)), dy: R1(Math.sin(ang) * (520 + r() * 300) - 260), rot: R1((r() - 0.5) * 50), t: R1(0.04 + (Math.hypot(x - 300, y - 450) / 420) * 0.35 + r() * 0.12) };
  });
})();

export const flock: IntroDef = {
  end: 2.2,
  burst: 1.3,
  hint: { x: 300, y: 450 },
  Over: ({ p }) => {
    const cols = crColors(p);
    return (
      <div className="in-part fk-wrap">
        <div className="fk-sheet" style={{ background: p.paper2 }}>
          <Creases p={p} />
        </div>
        {FLOCK.map((f, i) => (
          <div key={i} className="fk-crane" style={{ left: f.x - f.s / 2, top: f.y - f.s * 0.35 }}>
            <Crane size={f.s} color={cols[f.c]} flip={f.dx < 0} />
          </div>
        ))}
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.94, transformOrigin: "50% 50%" });
    const cranes = q(".fk-crane");
    const tl = gsap.timeline({ paused: true });
    FLOCK.forEach((f, i) => {
      tl.to(cranes[i], { x: f.dx, y: f.dy, rotate: f.rot, scale: 1.4, duration: 1.3, ease: "power2.in" }, f.t);
      tl.to(cranes[i], { opacity: 0, duration: 0.3 }, f.t + 1.0);
    });
    tl.to(q(".fk-sheet"), { opacity: 0, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, 0.5).to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 0.7);
    return tl;
  },
};
