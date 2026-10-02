"use client";
import React, { useState } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { plainDate, rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Chopda Pujan: the new year's bahi-khata. A top-bound red
   cloth ledger; a kumkum swastik, Shubh-Labh, and the first
   entries of the year written in ink, signed and stamped.
   ============================================================ */

/** Kumkum swastik with its four dots, drawn as brush strokes. */
export function Swastik({ color, size = 64, w = 7, className = "" }: { color: string; size?: number; w?: number; className?: string }) {
  const a = 30;
  const strokes = [`M0,${-a} L0,${a}`, `M${-a},0 L${a},0`, `M0,${-a} L${a},${-a}`, `M${a},0 L${a},${a}`, `M0,${a} L${-a},${a}`, `M${-a},0 L${-a},${-a}`];
  return (
    <svg className={`cp-swastik ${className}`} viewBox="-40 -40 80 80" width={size} height={size}>
      <g filter="url(#cp-rough)" stroke={color} strokeWidth={w} strokeLinecap="round" fill="none">
        {strokes.map((d, i) => (
          <path key={i} className="cp-sw" d={d} pathLength={1} />
        ))}
      </g>
      <g fill={color} filter="url(#cp-rough)" className="cp-dots">
        {[
          [15, -15],
          [15, 15],
          [-15, 15],
          [-15, -15],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={w * 0.62} />
        ))}
      </g>
    </svg>
  );
}

/** Shared SVG filters: rough brush edge and patchy rubber-stamp ink. */
function Defs() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="cp-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={3.2} />
        </filter>
        <filter id="cp-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={3} seed={9} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/** A violet rubber stamp with the family name around the ring. */
function Stamp({ name, year, label, rot = -12, className = "" }: { name: string; year: string; label: string; rot?: number; className?: string }) {
  const ring = `${name.toUpperCase()} ✦ SHUBH LABH ✦ `;
  const C = 2 * Math.PI * 38;
  return (
    <svg className={`cp-stamp ${className}`} viewBox="-56 -56 112 112" width={112} height={112} style={{ transform: `rotate(${rot}deg)` }}>
      <g filter="url(#cp-ink)" fill="none" stroke="#4b3fa0" strokeWidth={2.4}>
        <circle r={52} />
        <circle r={47} strokeWidth={1.2} />
        <circle r={28} strokeWidth={1.4} />
        <path id={`cp-ring-${rot}`} d="M0,-38 A38,38 0 1,1 -0.01,-38" stroke="none" />
        <text fill="#4b3fa0" stroke="none" fontSize={9.5} fontWeight={700} letterSpacing={1} className="cp-stamp-t">
          <textPath href={`#cp-ring-${rot}`} textLength={R1(C * 0.97)} lengthAdjust="spacingAndGlyphs">
            {ring}
          </textPath>
        </text>
        <text y={-4} textAnchor="middle" fill="#4b3fa0" stroke="none" fontSize={8} fontWeight={700} letterSpacing={1.4} className="cp-stamp-t">
          {label.toUpperCase()}
        </text>
        <text y={12} textAnchor="middle" fill="#4b3fa0" stroke="none" fontSize={15} fontWeight={700} className="cp-stamp-t">
          {year}
        </text>
      </g>
    </svg>
  );
}

const SCATTER = (() => {
  const r = rng(77);
  const spots = [
    [470, 560, 40],
    [26, 640, 34],
    [460, 110, 26],
  ];
  return spots.flatMap(([cx, cy, sp], k) =>
    Array.from({ length: 9 }, (_, i) => ({ x: R1(cx + (r() - 0.5) * sp * 2), y: R1(cy + (r() - 0.5) * sp * 2), rot: R1(r() * 180), kind: i % 3 === 0 ? "rice" : k === 1 && i % 2 ? "haldi" : "petal" })),
  );
})();

/** Binding along the top: red cloth, zari band, cotton stitches and a hanging tie. */
function Binding({ p }: { p: Palette }) {
  return (
    <div className="cp-bind" style={{ backgroundColor: p.wax }}>
      <div className="cp-zari" style={{ background: `linear-gradient(90deg, ${p.accent2}, ${mix(p.accent2, "#fff", 0.35)} 50%, ${p.accent2})` }} />
      <svg className="cp-stitch" viewBox="0 0 500 10" width={500} height={10}>
        {Array.from({ length: 31 }, (_, i) => (
          <path key={i} d={`M${12 + i * 15.8},2 l7,6`} stroke="#f4eee0" strokeWidth={1.6} strokeLinecap="round" />
        ))}
      </svg>
      <svg className="cp-tie" viewBox="0 0 30 90" width={30} height={90}>
        <path d="M15,0 C10,20 20,30 14,52 C10,64 18,74 15,86" fill="none" stroke="#f4eee0" strokeWidth={2} />
        <circle cx={15} cy={30} r={3} fill="#f4eee0" />
      </svg>
    </div>
  );
}

function shortDate(iso: string) {
  const d = plainDate(iso);
  return d ? `${d.day} ${d.mon} ${d.year}` : "";
}

function Page({ d, p, stamps, onStamp }: { d: InviteData; p: Palette; stamps: number; onStamp?: () => void }) {
  const env = useCardEnv();
  const year = d.mainDateTime.slice(0, 4);
  const rows: [string, string][] = [
    ["Opening balance of blessings", "∞"],
    ["Health, wealth & happiness", "Unlimited"],
    ["Sweet moments with you", "Plenty"],
  ];
  return (
    <div className="cp-paper" style={{ color: p.ink }}>
      <div className="cp-rules" />
      <div className="cp-margin" style={{ borderColor: p.accent }} />
      <div className="cp-amtcol" style={{ borderColor: p.accent }} />
      {d.mantra && (
        <div className="cp-mantra cp-w" style={{ color: p.accent }}>
          {d.mantra}
        </div>
      )}
      <div className="cp-sl" style={{ color: p.accent }}>
        <span className="cp-w">Shubh</span>
        <Swastik color={p.accent} size={78} />
        <span className="cp-w">Labh</span>
      </div>
      <h1 className="cp-title cp-w">{d.eyebrow}</h1>
      <div className="cp-date cp-w">
        {d.yearLabel ? `${d.yearLabel} · ` : ""}
        {shortDate(d.mainDateTime)}
      </div>
      <div className="cp-table">
        <div className="cp-row head cp-w" style={{ color: p.accent }}>
          <span>Particulars</span>
          <span>Amount</span>
        </div>
        {rows.map(([a, b]) => (
          <div key={a} className="cp-row cp-w">
            <span>{a}</span>
            <span>{b}</span>
          </div>
        ))}
        <div className="cp-row total cp-w" style={{ borderColor: p.ink }}>
          <span>Carried forward: love &amp; prosperity</span>
          <span>Always</span>
        </div>
      </div>
      {d.blessingLine && <p className="cp-note cp-w">{d.blessingLine}</p>}
      <div className="cp-sign cp-w">
        <span>{fromText(d, "with best wishes from")}</span>
        <b>{d.primary.name}</b>
        {env.guest && <i>for {env.guest}</i>}
      </div>
      <div className="cp-stamps">
        {Array.from({ length: stamps }, (_, i) => (
          <Stamp key={i} name={d.primary.name} year={year} label={d.eyebrow.replace(/^happy\s+/i, "")} rot={-12 + i * 17} className={i ? "again" : "first"} />
        ))}
      </div>
      {SCATTER.map((s, i) =>
        s.kind === "rice" ? (
          <i key={i} className="cp-rice" style={{ left: s.x, top: s.y, transform: `rotate(${s.rot}deg)` }} />
        ) : (
          <i key={i} className={`cp-petal ${s.kind}`} style={{ left: s.x, top: s.y, transform: `rotate(${s.rot}deg)` }} />
        ),
      )}
      {onStamp && <button type="button" className="cp-hit" data-no-flip aria-label="Stamp the ledger" onPointerDown={(e) => (e.stopPropagation(), onStamp())} />}
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [stamps, setStamps] = useState(1);
  const stamp = () => {
    setStamps((n) => (n >= 3 ? 1 : n + 1));
    requestAnimationFrame(() => {
      const last = document.querySelector(".cp-stamps .cp-stamp:last-child");
      if (last) gsap.fromTo(last, { scale: 1.7, opacity: 0 }, { scale: 1, opacity: 0.88, duration: 0.28, ease: "power4.in" });
      const paper = document.querySelector(".cp-paper");
      if (paper) gsap.fromTo(paper, { y: 2 }, { y: 0, duration: 0.25, ease: "bounce.out", delay: 0.26 });
    });
  };
  return (
    <div className="page-content cover wd-cover">
      <Defs />
      <Page d={d} p={p} stamps={stamps} onStamp={env.mode === "live" ? stamp : undefined} />
      <Binding p={p} />
      {env.mode === "live" && <div className="cp-hint">Tap the stamp</div>}
    </div>
  );
}

export const chopda: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="cp-paper inner" style={{ color: p.ink }}>
          <div className="cp-rules" />
          <div className="cp-margin" style={{ borderColor: p.accent }} />
        </div>
        <Binding p={p} />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="cp-paper inner">
        <div className="cp-rules" />
      </div>
    </div>
  ),
};

/* ---------------- intro: untie the thread, lift the red cover, write the first entries ---------------- */

export const khata: IntroDef = {
  end: 3.4,
  burst: 2.4,
  hint: { x: 300, y: 300 },
  Over: () => (
    <div className="in-part kh-wrap">
      <div className="kh-cover">
        <div className="kh-weave" />
        <div className="kh-border" />
        <div className="kh-face">
          <Swastik color="#e9c46a" size={120} w={5} />
          <div className="kh-label">Shubh Labh</div>
        </div>
        <i className="kh-thread v" />
        <i className="kh-thread h" />
        <i className="kh-knot" />
      </div>
    </div>
  ),
  build: (q) => {
    const words = q(".cp-paper .cp-w");
    gsap.set(words, { clipPath: "inset(-30% 100% -30% 0%)" });
    gsap.set(q(".cp-paper .cp-sw"), { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(q(".cp-paper .cp-dots circle"), { opacity: 0 });
    gsap.set(q(".cp-stamps .cp-stamp"), { opacity: 0 });
    gsap.set(q(".kh-cover"), { rotateX: 0, transformOrigin: "50% 0%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".kh-thread.v"), { scaleY: 0, duration: 0.45, ease: "power2.in" }, 0.25)
      .to(q(".kh-thread.h"), { scaleX: 0, duration: 0.45, ease: "power2.in" }, 0.35)
      .to(q(".kh-knot"), { y: 260, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.45)
      .to(q(".kh-cover"), { rotateX: 112, duration: 0.9, ease: "power2.inOut" }, 0.85)
      .to(q(".kh-cover"), { opacity: 0, duration: 0.3 }, 1.5)
      .to(q(".cp-paper .cp-sw"), { strokeDashoffset: 0, duration: 0.16, stagger: 0.09, ease: "none" }, 1.45)
      .to(q(".cp-paper .cp-dots circle"), { opacity: 1, duration: 0.08, stagger: 0.08 }, 2.0)
      .to(words, { clipPath: "inset(-30% 0% -30% 0%)", duration: 0.32, stagger: 0.1, ease: "power1.inOut" }, 1.6)
      .fromTo(q(".cp-stamps .cp-stamp"), { scale: 1.7, opacity: 0 }, { scale: 1, opacity: 0.88, duration: 0.25, ease: "power4.in" }, 2.95)
      .set(words, { clearProps: "clipPath" }, 3.35)
      .set(q(".cp-paper .cp-sw"), { clearProps: "strokeDasharray,strokeDashoffset" }, 3.35);
    return tl;
  },
};
