"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, fmtLongDate, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { Thoranam } from "@/components/wedding/art";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Naya Saal: a tear-off wall calendar. The old year's page is
   torn away to reveal a sunrise, a toran and the new year.
   ============================================================ */

/** "Vikram Samvat 2083" → { label: "Vikram Samvat", num: 2083 }; falls back to the date's year. */
export function yearParts(d: InviteData) {
  const m = (d.yearLabel ?? "").match(/^(.*?)(\d{4})\s*$/);
  if (m) return { label: m[1].trim(), num: Number(m[2]) };
  return { label: "", num: Number(d.mainDateTime.slice(0, 4)) };
}

/** Binding strip with rings and the torn stubs of earlier pages. */
function Binding({ p }: { p: Palette }) {
  const r = rng(5);
  const jag = (y: number, amp: number) => {
    let s = `M0,0 L500,0 L500,${y}`;
    for (let x = 500; x >= 0; x -= 10) s += ` L${x},${R1(y + (r() - 0.3) * amp)}`;
    return s + "Z";
  };
  return (
    <svg className="ns-binding" viewBox="0 0 500 70" width={500} height={70}>
      <path d={jag(58, 7)} fill={mix(p.paper, "#000", 0.08)} />
      <path d={jag(52, 6)} fill={mix(p.paper, "#000", 0.04)} />
      <rect width={500} height={42} fill={mix(p.accent, "#000", 0.45)} />
      <rect y={36} width={500} height={6} fill="#000" opacity={0.25} />
      {[150, 350].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={44} rx={9} ry={4} fill="#000" opacity={0.4} />
          <path d={`M${x - 8},44 C${x - 10},18 ${x + 10},18 ${x + 8},44`} fill="none" stroke="#d9dde2" strokeWidth={4} />
          <path d={`M${x - 8},44 C${x - 10},18 ${x + 10},18 ${x + 8},44`} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.7} />
        </g>
      ))}
    </svg>
  );
}

/** Sunrise (or, for the old year, a muted sunset) over hills and fields. */
function Horizon({ p, old = false }: { p: Palette; old?: boolean }) {
  const sun = old ? mix(p.accent, "#7a6a80", 0.55) : p.accent;
  const skyTop = old ? mix(p.paper, "#8a80a0", 0.45) : mix(p.paper, p.wax, 0.35);
  const skyLow = old ? mix(p.paper, "#c8a0a0", 0.35) : mix(p.paper, p.accent, 0.25);
  const hill1 = old ? "#8a8898" : mix(p.accent2, "#ffffff", 0.35);
  const hill2 = old ? "#6a6878" : p.accent2;
  const field = old ? "#7a7868" : mix(p.accent2, "#c9b458", 0.45);
  return (
    <svg className="ns-horizon" viewBox="0 0 440 190" width={440} height={190}>
      <defs>
        <linearGradient id={`ns-sky-${old ? "o" : "n"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyLow} />
        </linearGradient>
        <clipPath id={`ns-clip-${old ? "o" : "n"}`}>
          <rect width={440} height={190} rx={10} />
        </clipPath>
      </defs>
      <g clipPath={`url(#ns-clip-${old ? "o" : "n"})`}>
        <rect width={440} height={190} fill={`url(#ns-sky-${old ? "o" : "n"})`} />
        {!old && (
          <g stroke={sun} strokeWidth={2} opacity={0.35} className="ns-rays">
            {Array.from({ length: 13 }, (_, i) => {
              const a = Math.PI + (i / 12) * Math.PI;
              return <line key={i} x1={220} y1={120} x2={R1(220 + cos(a) * 260)} y2={R1(120 + sin(a) * 260)} />;
            })}
          </g>
        )}
        <circle cx={220} cy={old ? 138 : 120} r={44} fill={sun} className={old ? undefined : "ns-sun"} />
        <path d="M0,120 C60,96 120,104 180,118 C240,132 300,92 360,100 C400,104 420,110 440,108 L440,190 L0,190Z" fill={hill1} />
        <path d="M0,140 C80,120 150,138 220,140 C300,142 360,124 440,132 L440,190 L0,190Z" fill={hill2} />
        <path d="M0,160 C120,150 300,152 440,158 L440,190 L0,190Z" fill={field} />
        <g stroke="#000" strokeOpacity={0.12}>
          {[166, 174, 182].map((y) => (
            <path key={y} d={`M0,${y} C120,${y - 6} 300,${y - 4} 440,${y}`} fill="none" />
          ))}
        </g>
        {!old && (
          <g fill="none" stroke="#3a2a20" strokeWidth={1.6} strokeLinecap="round" className="ns-birds">
            {[
              [120, 50, 1],
              [140, 40, 0.8],
              [300, 46, 1],
              [318, 58, 0.7],
              [104, 64, 0.6],
            ].map(([x, y, s], i) => (
              <path key={i} d={`M${x - 8 * s},${y - 4 * s} Q${x - 4 * s},${y - 6 * s} ${x},${y} Q${x + 4 * s},${y - 6 * s} ${x + 8 * s},${y - 4 * s}`} />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

/** One calendar page (500×700). `old` draws the outgoing year. */
export function CalendarPage({ d, p, old = false, guest }: { d: InviteData; p: Palette; old?: boolean; guest?: string }) {
  const y = yearParts(d);
  const num = old ? y.num - 1 : y.num;
  return (
    <div className={`ns-page ${old ? "old" : ""}`}>
      <Binding p={p} />
      {!old && (
        <div className="ns-toran">
          <Thoranam width={440} seed={7} />
        </div>
      )}
      <div className="ns-year">
        {y.label && <span>{y.label}</span>}
        <b>{num}</b>
      </div>
      <div className="ns-horizon-wrap">
        <Horizon p={p} old={old} />
      </div>
      {old ? (
        <div className="ns-old-note">
          <span>Thank you for the memories</span>
          <b>Goodbye {num}</b>
        </div>
      ) : (
        <div className="ns-text">
          <h1 className="ns-title">{d.eyebrow}</h1>
          {d.mantra && <div className="ns-mantra">{d.mantra}</div>}
          {d.blessingLine && <p className="ns-wish">{d.blessingLine}</p>}
          <div className="ns-from">
            <span>{fromText(d)}</span> {d.primary.name}
          </div>
          <div className="ns-date">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
          {guest && <div className="ns-guest">For {guest}</div>}
        </div>
      )}
      <div className="ns-curl" />
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  return (
    <div className="page-content cover wd-cover">
      <CalendarPage d={d} p={p} guest={env.guest} />
    </div>
  );
}

export const nayasaal: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="ns-bg" />
        <Binding p={p} />
        <div className="ns-toran inner">
          <Thoranam width={440} seed={kind.length} />
        </div>
        <div className="ns-curl" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="ns-bg" />
      <Binding p={p} />
    </div>
  ),
};

/* ---------------- intro: tear off the old year ---------------- */

const CONFETTI = (() => {
  const r = rng(2083);
  return Array.from({ length: 40 }, () => ({ x: R1(r() * 600), dx: R1((r() - 0.5) * 240), dy: R1(500 + r() * 400), rot: R1((r() - 0.5) * 720), c: ["#e4572e", "#f2a541", "#2a9d8f", "#ffd166", "#ef476f"][Math.floor(r() * 5)], w: R1(5 + r() * 6) }));
})();

export const tearoff: IntroDef = {
  end: 2.4,
  burst: 1.3,
  hint: { x: 300, y: 560 },
  Over: ({ p, data }) => (
    <div className="in-part to-wrap">
      <div className="to-page">
        <CalendarPage d={data} p={p} old />
      </div>
      {CONFETTI.map((c, i) => (
        <i key={i} className="to-bit" style={{ left: c.x, top: -20, width: c.w, height: c.w * 0.5, background: c.c }} />
      ))}
    </div>
  ),
  build: (q) => {
    gsap.set(q(".to-page"), { transformOrigin: "0% 0%" });
    const bits = q(".to-bit");
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".to-page"), { rotate: 1.5, duration: 0.08, yoyo: true, repeat: 1 }, 0)
      .to(q(".to-page"), { rotate: -24, x: -40, y: 980, duration: 1.2, ease: "power2.in" }, 0.2);
    CONFETTI.forEach((c, i) => tl.to(bits[i], { x: c.dx, y: c.dy, rotate: c.rot, duration: 1.6, ease: "power1.in" }, 0.9 + (i % 10) * 0.03));
    tl.to(q(".to-bit"), { opacity: 0, duration: 0.4 }, 2.0);
    return tl;
  },
};
