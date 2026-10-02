"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData } from "@/lib/types";
import { initials } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { foilFill, isDark } from "@/components/card/theme";
import type { IntroDef } from "./intros";
import { Dove, MadhuFish, MadhuSun, Peacock } from "@/components/wedding/art3";

/* Batch 3 intros. Same contract as intros.tsx: scene 600×900, card at 50,100 (500×700). */

const mono = (d: InviteData) => {
  const [a, b] = coupleOrder(d);
  return initials(a.name, b?.name) || "✦";
};

/* ---------------- silk pallu sweeps off (Paithani) ---------------- */

export const pallu: IntroDef = {
  end: 2.0,
  burst: 1.0,
  hint: { x: 300, y: 600 },
  Over: ({ p, data }) => {
    const fill = foilFill(p);
    return (
      <div className="in-part pl-wrap">
        <div className="pl-cloth" style={{ ["--silk" as string]: p.paper, ["--zari" as string]: p.accent2 }}>
          <div className="pl-zari" />
          <div className="pl-peacocks">
            {[0, 1, 2].map((i) => (
              <Peacock key={i} width={110} fill={fill} flip={i % 2 === 1} />
            ))}
          </div>
          <div className="pl-mono foil-text">{mono(data)}</div>
          <div className="pl-fringe" />
        </div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.93, transformOrigin: "50% 50%" });
    gsap.set(q(".pl-cloth"), { transformOrigin: "0% 0%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".pl-cloth"), { skewY: 1.6, duration: 0.15, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0)
      .to(q(".pl-mono"), { opacity: 0, duration: 0.25 }, 0.1)
      .to(q(".pl-cloth"), { x: 900, y: 520, rotate: 20, skewX: -10, duration: 1.4, ease: "power2.in" }, 0.3)
      .to(holder, { scale: 1, duration: 1.2, ease: "power2.out" }, 0.7);
    return tl;
  },
};

/* ---------------- lace veil lifts, doves fly (Grace) ---------------- */

export const veil: IntroDef = {
  end: 2.3,
  burst: 1.2,
  hint: { x: 300, y: 620 },
  Over: ({ data }) => (
    <div className="in-part vl-wrap">
      <div className="vl-veil">
        <span className="vl-mono">{mono(data)}</span>
      </div>
      <div className="vl-dove l">
        <Dove width={96} />
      </div>
      <div className="vl-dove r">
        <Dove width={96} flip />
      </div>
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.95, transformOrigin: "50% 50%" });
    gsap.set(q(".vl-dove"), { opacity: 0, scale: 0.4 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".vl-mono"), { opacity: 0, duration: 0.3 }, 0)
      .to(q(".vl-veil"), { rotateX: -172, duration: 1.4, ease: "power2.inOut" }, 0.2)
      .to(q(".vl-veil"), { opacity: 0, duration: 0.4 }, 1.3)
      .to(q(".vl-dove"), { opacity: 1, scale: 1, duration: 0.3 }, 0.4)
      .to(q(".vl-dove.l"), { x: -380, y: -520, rotate: -14, duration: 1.5, ease: "power1.in" }, 0.45)
      .to(q(".vl-dove.r"), { x: 380, y: -560, rotate: 14, duration: 1.5, ease: "power1.in" }, 0.5)
      .to(holder, { scale: 1, duration: 1.2, ease: "power2.out" }, 0.9);
    return tl;
  },
};

/* ---------------- brush strokes paint the card in (Madhubani) ---------------- */

const STROKES = [
  "M-60,120 L660,40",
  "M-60,300 L660,220",
  "M-60,480 L660,400",
  "M-60,660 L660,580",
  "M-60,840 L660,760",
  "M-60,1000 L660,920",
];

export const brush: IntroDef = {
  end: 2.2,
  burst: 1.6,
  hint: { x: 300, y: 640 },
  Over: ({ p }) => {
    const line = isDark(p.paper) ? "#fff6e0" : "#1a1a1a";
    return (
      <svg className="in-part br-wrap" viewBox="0 0 600 900" width={600} height={900}>
        <defs>
          <mask id="br-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={600} height={900}>
            <rect width={600} height={900} fill="#fff" />
            <g fill="none" stroke="#000" strokeWidth={210} strokeLinecap="round">
              {STROKES.map((d, i) => (
                <path key={i} className="br-stroke" d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
              ))}
            </g>
          </mask>
        </defs>
        <g mask="url(#br-mask)">
          <rect x={40} y={90} width={520} height={720} rx={4} fill={p.paper2} />
          <rect x={40} y={90} width={520} height={720} rx={4} fill="none" stroke={line} strokeWidth={3} />
          <svg x={245} y={250} width={110} height={110} overflow="visible">
            <MadhuSun size={110} line={line} />
          </svg>
          <svg x={140} y={430} width={150} height={93} overflow="visible">
            <MadhuFish width={150} line={line} />
          </svg>
          <g transform="translate(460 430) scale(-1 1)">
            <svg width={150} height={93} overflow="visible">
              <MadhuFish width={150} line={line} />
            </svg>
          </g>
        </g>
      </svg>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.96, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".br-stroke"), { strokeDashoffset: 0, duration: 0.45, stagger: 0.22, ease: "power1.inOut" }, 0.1).to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 0.9);
    return tl;
  },
};

/* ---------------- pop-up book: the card tilts up, the scene stands (Saath) ---------------- */

export const popup: IntroDef = {
  end: 2.2,
  burst: 1.5,
  hint: { x: 300, y: 760 },
  Over: () => <div className="in-part pu-shadow" />,
  build: (q, holder) => {
    gsap.set(holder, { rotateX: 56, y: 90, scale: 0.86, transformPerspective: 1100, transformOrigin: "50% 100%" });
    gsap.set(q(".pu-layer"), { scaleY: 0, transformOrigin: "50% 100%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(holder, { rotateX: 0, y: 0, scale: 1, duration: 1.2, ease: "power2.out" }, 0)
      .to(q(".pu-shadow"), { opacity: 0, duration: 0.6 }, 0.4)
      .to(q(".pu-layer"), { scaleY: 1, duration: 0.6, stagger: 0.16, ease: "back.out(1.8)" }, 0.75);
    return tl;
  },
};

/* ---------------- printed from a kiosk slot (Jet Set) ---------------- */

export const printer: IntroDef = {
  end: 2.5,
  burst: 2.1,
  hint: { x: 300, y: 300 },
  Over: ({ p }) => (
    <div className="in-part pr-slot" style={{ ["--led" as string]: p.accent2 }}>
      <i className="pr-led" />
      <span className="pr-label">Printing your pass…</span>
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { y: -700, clipPath: "inset(100% 0% 0% 0%)" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".pr-led"), { opacity: 0.2, duration: 0.12, yoyo: true, repeat: 5 }, 0)
      .to(holder, { y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "steps(20)" }, 0.25)
      .to(q(".pr-slot"), { y: -220, opacity: 0, duration: 0.5, ease: "power2.in" }, 1.95)
      .set(holder, { clearProps: "clipPath" }, 2.45);
    return tl;
  },
};
