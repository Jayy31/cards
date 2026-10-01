"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { plainDate, rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef, IntroProps } from "@/components/viewer/intros";
import { mix, R1 } from "@/components/wedding/sig/util";
import { ClayDiya } from "./roshni";

/* ============================================================
   Chitthi: a blue inland letter on the desk, torn open along its
   perforations and unfolded; a handwritten Diwali letter in ink,
   with a printed stamp and the family's own postmark.
   ============================================================ */

const W = 440;
const H = 620;

/** Torn perforations down both long edges. */
const EDGE = (() => {
  const r = rng(31);
  const right: string[] = [];
  const left: string[] = [];
  for (let y = 0; y <= H; y += 5) right.push(`${R1(W - r() * 2.6)}px ${y}px`);
  for (let y = H; y >= 0; y -= 5) left.push(`${R1(r() * 2.6)}px ${y}px`);
  return `polygon(${[...right, ...left].join(", ")})`;
})();

function dmy(iso: string) {
  const d = plainDate(iso);
  if (!d) return { pm: "", pin: "" };
  const dd = String(d.day).padStart(2, "0");
  const yy = String(d.year).slice(2);
  return { pm: `${dd} ${d.mon.toUpperCase()} ${yy}`, pin: `${dd}${String(d.mm).padStart(2, "0")}${yy}` };
}

/** The printed postage stamp: a diya on a night-blue ground with perforated edges. */
function PostStamp({ p, year, label }: { p: Palette; year: string; label: string }) {
  const holes: React.ReactNode[] = [];
  for (let i = 0; i <= 9; i++) {
    holes.push(<circle key={`t${i}`} cx={R1(i * 9.6)} cy={0} r={2.6} />, <circle key={`b${i}`} cx={R1(i * 9.6)} cy={108} r={2.6} />);
  }
  for (let i = 0; i <= 11; i++) {
    holes.push(<circle key={`l${i}`} cx={0} cy={R1(i * 9.8)} r={2.6} />, <circle key={`r${i}`} cx={86} cy={R1(i * 9.8)} r={2.6} />);
  }
  return (
    <svg className="ch-stamp" viewBox="-4 -4 94 116" width={94} height={116}>
      <defs>
        <mask id="ch-perf">
          <rect x={-4} y={-4} width={94} height={116} fill="#fff" />
          <g fill="#000">{holes}</g>
        </mask>
        <linearGradient id="ch-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(p.accent2, "#000", 0.55)} />
          <stop offset="1" stopColor={mix(p.accent2, "#000", 0.2)} />
        </linearGradient>
      </defs>
      <g mask="url(#ch-perf)">
        <rect x={0} y={0} width={86} height={108} fill="#fbf7ee" />
        <rect x={6} y={6} width={74} height={96} fill="url(#ch-night)" />
        {[
          [18, 22],
          [64, 16],
          [72, 40],
          [26, 44],
          [48, 30],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 1 : 1.5} fill="#fff6d0" />
        ))}
        <circle cx={43} cy={64} r={22} fill="#ffcf6b" opacity={0.18} />
        <ClayDiya x={43} y={76} s={1.5} />
        <text x={43} y={20} textAnchor="middle" className="ch-stamp-t big">
          {label.toUpperCase()}
        </text>
        <text x={12} y={97} className="ch-stamp-t">
          {year}
        </text>
        <text x={74} y={97} textAnchor="end" className="ch-stamp-t">
          ∞
        </text>
      </g>
    </svg>
  );
}

/** The family's own circular postmark with wavy cancellation lines. */
function Postmark({ name, date, ink }: { name: string; date: string; ink: string }) {
  const ring = `${name.toUpperCase()} P.O. ✦ WITH LOVE ✦ `;
  return (
    <svg className="ch-postmark" viewBox="-150 -44 196 88" width={196} height={88}>
      <g fill="none" stroke={ink} strokeWidth={1.8} filter="url(#ch-ink)">
        {[-16, -6, 4, 14].map((y) => (
          <path key={y} d={`M-128,${y} q12,-7 24,0 t24,0 t24,0 t24,0`} />
        ))}
        <circle r={38} />
        <circle r={24} strokeWidth={1.1} />
        <path id="ch-pm-ring" d="M0,-31 A31,31 0 1,1 -0.01,-31" stroke="none" />
        <text fill={ink} stroke="none" fontSize={8} fontWeight={700} className="ch-pm-t">
          <textPath href="#ch-pm-ring" textLength={R1(2 * Math.PI * 31 * 0.97)} lengthAdjust="spacingAndGlyphs">
            {ring}
          </textPath>
        </text>
        <text y={3.5} textAnchor="middle" fill={ink} stroke="none" fontSize={9.5} fontWeight={700} className="ch-pm-t">
          {date}
        </text>
      </g>
    </svg>
  );
}

function Defs() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="ch-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={3} seed={3} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.5" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/** Little ink doodles: a diya, sparkles and a heart. */
function Doodles({ ink }: { ink: string }) {
  return (
    <svg className="ch-doodle" viewBox="0 0 120 70" width={120} height={70}>
      <g fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="ch-dd">
        <path d="M20,52 Q45,68 70,52 Q45,58 20,52Z" pathLength={1} />
        <path d="M45,50 C38,42 42,34 45,26 C48,34 52,42 45,50Z" pathLength={1} />
        <path d="M45,20 L45,14 M35,24 L31,20 M55,24 L59,20" pathLength={1} />
        <path d="M92,18 l0,10 M87,23 l10,0 M104,40 l0,7 M100.5,43.5 l7,0" pathLength={1} />
        <path d="M86,56 c-4,-5 -10,0 -5,5 l5,4 l5,-4 c5,-5 -1,-10 -5,-5Z" pathLength={1} />
      </g>
    </svg>
  );
}

function Pen() {
  return (
    <svg className="ch-pen" viewBox="0 0 40 260" width={40} height={260}>
      <defs>
        <linearGradient id="ch-pen-b" x1="0" x2="1">
          <stop offset="0" stopColor="#2b0d10" />
          <stop offset="0.45" stopColor="#7a2430" />
          <stop offset="1" stopColor="#1e0709" />
        </linearGradient>
        <linearGradient id="ch-pen-g" x1="0" x2="1">
          <stop offset="0" stopColor="#8a6a2a" />
          <stop offset="0.5" stopColor="#f3d98a" />
          <stop offset="1" stopColor="#8a6a2a" />
        </linearGradient>
      </defs>
      <path d="M20,258 L13,214 L27,214Z" fill="url(#ch-pen-g)" />
      <path d="M20,256 L20,226" stroke="#3a2a10" strokeWidth={0.8} />
      <rect x={11} y={150} width={18} height={66} rx={4} fill="url(#ch-pen-b)" />
      <rect x={10} y={142} width={20} height={9} fill="url(#ch-pen-g)" />
      <rect x={10} y={12} width={20} height={132} rx={8} fill="url(#ch-pen-b)" />
      <rect x={27} y={22} width={4} height={84} rx={2} fill="url(#ch-pen-g)" />
      <rect x={10} y={30} width={20} height={4} fill="url(#ch-pen-g)" />
    </svg>
  );
}

function Marigold({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const r = rng(Math.round(x * 7 + y));
  return (
    <svg className="ch-flower" viewBox="-40 -40 80 80" width={80 * s} height={80 * s} style={{ left: x, top: y }}>
      {[30, 24, 18, 12, 7].map((rr, k) => (
        <g key={k}>
          {Array.from({ length: 16 - k }, (_, i) => {
            const a = (i / (16 - k)) * 360 + k * 11;
            return <ellipse key={i} cx={0} cy={-rr * 0.62} rx={rr * 0.24} ry={rr * 0.42} transform={`rotate(${R1(a + r() * 8)})`} fill={k % 2 ? "#f59e0b" : "#f97316"} stroke="#c2410c" strokeWidth={0.6} />;
          })}
        </g>
      ))}
      <circle r={4} fill="#b45309" />
    </svg>
  );
}

function Letter({ d, p, guest }: { d: InviteData; p: Palette; guest?: string }) {
  const { pm, pin } = dmy(d.mainDateTime);
  const year = d.mainDateTime.slice(0, 4);
  const short = d.eyebrow.replace(/^happy\s+/i, "") || "Diwali";
  return (
    <div className="ch-paper" style={{ clipPath: EDGE, background: p.paper, color: p.ink }}>
      <div className="ch-tex" />
      <div className="ch-crease a" />
      <div className="ch-crease b" />
      <div className="ch-print" style={{ color: p.accent }}>
        <b>INLAND LETTER CARD</b>
        <span>Open with a smile · Contains love</span>
      </div>
      <div className="ch-stampbox">
        <PostStamp p={p} year={year} label={short} />
        <Postmark name={d.primary.name} date={pm} ink={p.wax} />
      </div>
      <div className="ch-to" style={{ borderColor: p.accent }}>
        <span className="ch-lbl" style={{ color: p.accent }}>
          To,
        </span>
        <div className="ch-line">
          <i className="ch-w">{guest || "All our dear ones"}</i>
        </div>
        <div className="ch-line">
          <i className="ch-w">wherever you are, with love</i>
        </div>
        <div className="ch-pin" style={{ color: p.accent }}>
          PIN
          {pin.split("").map((c, i) => (
            <span key={i} style={{ borderColor: p.accent }}>
              <i className="ch-w">{c}</i>
            </span>
          ))}
        </div>
      </div>
      <div className="ch-body">
        <div className="ch-dear ch-w">Dear {guest || "all of you"},</div>
        <div className="ch-headrow">
          <h1 className="ch-title ch-w">{d.eyebrow}!</h1>
          <Doodles ink={p.ink} />
        </div>
        <svg className="ch-squiggle" viewBox="0 0 260 12" width={260} height={12}>
          <path className="ch-dd" d="M2,8 C30,0 50,12 80,6 S130,0 160,6 S220,10 258,4" fill="none" stroke={p.ink} strokeWidth={2} strokeLinecap="round" pathLength={1} />
        </svg>
        {d.blessingLine && <p className="ch-text ch-w">{d.blessingLine}.</p>}
        <p className="ch-text ch-w">Sending you a little light and a lot of love, all the way from our home to yours.</p>
      </div>
      <div className="ch-sign">
        <span className="ch-w">{fromText(d, "With love,")}</span>
        <b className="ch-w">{d.primary.name}</b>
        {d.primary.subtitle && <i className="ch-w">{d.primary.subtitle}</i>}
      </div>
      <div className="ch-ps ch-w">P.S. Save some mithai for us!</div>
    </div>
  );
}

function Desk() {
  return (
    <div className="ch-desk">
      <div className="ch-grain" />
      <div className="ch-light" />
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const thump = () => {
    const m = document.querySelector(".ch-postmark");
    if (m) gsap.fromTo(m, { scale: 1.35, opacity: 0.3 }, { scale: 1, opacity: 0.85, duration: 0.25, ease: "power4.in", transformOrigin: "75% 50%" });
    const s = document.querySelector(".ch-sheet");
    if (s) gsap.fromTo(s, { y: 2 }, { y: 0, duration: 0.3, ease: "bounce.out", delay: 0.24 });
  };
  return (
    <div className="page-content cover wd-cover">
      <Defs />
      <Desk />
      <svg className="ch-diya" viewBox="0 0 140 110" width={140} height={110}>
        <ellipse cx={70} cy={92} rx={50} ry={9} fill="rgba(0,0,0,0.35)" />
        <ClayDiya x={70} y={84} s={2.1} />
      </svg>
      <div className="ch-sheet">
        <Letter d={d} p={p} guest={env.guest} />
      </div>
      <Marigold x={-26} y={-20} s={1.3} />
      <div className="ch-petals">
        {[
          [70, 10, 30],
          [96, 26, 110],
          [10, 92, 200],
        ].map(([x, y, r], i) => (
          <i key={i} style={{ left: x, top: y, transform: `rotate(${r}deg)` }} />
        ))}
      </div>
      <Pen />
      {env.mode === "live" && (
        <>
          <button type="button" className="ch-hit" data-no-flip aria-label="Postmark the letter" onPointerDown={(e) => (e.stopPropagation(), thump())} />
          <div className="ch-hint">Tap the stamp</div>
        </>
      )}
    </div>
  );
}

export const chitthi: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <Desk />
        <div className="ch-sheet inner">
          <div className="ch-paper" style={{ clipPath: EDGE, background: p.paper }}>
            <div className="ch-tex" />
            <div className="ch-rule" />
            <div className="ch-crease a" />
            <div className="ch-crease b" />
          </div>
        </div>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Desk />
    </div>
  ),
};

/* ---------------- intro: the folded letter is torn open and unfolded ---------------- */

function Folded({ p, data, guest }: IntroProps) {
  return (
    <div className="in-part il-wrap">
      <div className="il-top">
        <div className="il-back" style={{ background: p.paper, color: p.accent }}>
          <div className="ch-tex" />
          <div className="il-addr">
            <b>INLAND LETTER CARD</b>
            <span>To,</span>
            <i style={{ color: p.ink }}>{guest || "All our dear ones"}</i>
            <em>from {data.primary.name}</em>
          </div>
          <div className="il-mini">
            <PostStamp p={p} year={data.mainDateTime.slice(0, 4)} label={data.eyebrow.replace(/^happy\s+/i, "") || "Diwali"} />
          </div>
          <div className="il-strip" style={{ background: p.paper }} />
          <div className="il-strip l" style={{ background: p.paper }} />
        </div>
      </div>
    </div>
  );
}

export const inland: IntroDef = {
  end: 3.3,
  burst: 2.5,
  hint: { x: 300, y: 450 },
  Over: (props) => <Folded {...props} />,
  build: (q) => {
    const sheet = q(".ch-sheet");
    const words = q(".ch-sheet .ch-w");
    const dd = q(".ch-sheet .ch-dd");
    gsap.set(sheet, { clipPath: "inset(33.4% -8% 33.4% -8%)" });
    gsap.set(words, { clipPath: "inset(-40% 100% -40% 0%)" });
    gsap.set(dd, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(q(".ch-postmark"), { opacity: 0 });
    gsap.set(q(".il-top"), { rotateX: 180, transformOrigin: "50% 100%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".il-strip:not(.l)"), { y: -260, x: 40, rotate: 18, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.25)
      .to(q(".il-strip.l"), { y: -260, x: -40, rotate: -18, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.4)
      .to(q(".il-top"), { rotateX: 90, duration: 0.32, ease: "power1.in" }, 0.95)
      .to(sheet, { clipPath: "inset(-8% -8% 33.4% -8%)", duration: 0.34, ease: "power1.out" }, 1.27)
      .to(sheet, { clipPath: "inset(-8% -8% -8% -8%)", duration: 0.5, ease: "power2.out" }, 1.6)
      .to(words, { clipPath: "inset(-40% 0% -40% 0%)", duration: 0.28, stagger: 0.07, ease: "power1.inOut" }, 1.8)
      .to(dd, { strokeDashoffset: 0, duration: 0.3, stagger: 0.06, ease: "none" }, 2.2)
      .fromTo(q(".ch-postmark"), { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.24, ease: "power4.in", transformOrigin: "75% 50%" }, 2.95)
      .set([...sheet, ...words], { clearProps: "clipPath" }, 3.28)
      .set(dd, { clearProps: "strokeDasharray,strokeDashoffset" }, 3.28);
    return tl;
  },
};
