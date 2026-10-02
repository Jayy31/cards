"use client";
import React, { useRef } from "react";
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
   Sivakasi: retro firecracker-box label art. Sunburst, bold slab
   type, misregistered print, halftone and wear, with your family
   name as the "brand". Tap the fuse: BOOM.
   ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;

/** Print-style illustration: an anaar spraying stars, two rockets and a chakri, in flat colours with ink outlines. */
function Illustration({ p }: { p: Palette }) {
  const ink = "#1a1410";
  const r = rng(3);
  return (
    <svg className="sv-art" viewBox="-160 -150 320 300" width={320} height={300}>
      <defs>
        <pattern id="sv-dots" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx={2.5} cy={2.5} r={1.1} fill={ink} opacity={0.35} />
        </pattern>
      </defs>
      {/* stars bursting from the anaar */}
      {Array.from({ length: 26 }, (_, i) => {
        const a = rad(-160 + (i / 25) * 140);
        const d = 70 + r() * 70;
        const x = R1(cos(a) * d);
        const y = R1(sin(a) * d - 20);
        const s = R1(4 + r() * 6);
        return <path key={i} d={`M${x},${y - s} L${x + s * 0.3},${y - s * 0.3} L${x + s},${y} L${x + s * 0.3},${y + s * 0.3} L${x},${y + s} L${x - s * 0.3},${y + s * 0.3} L${x - s},${y} L${x - s * 0.3},${y - s * 0.3}Z`} fill={i % 3 ? p.accent2 : "#ffffff"} stroke={ink} strokeWidth={1} />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const a = rad(-150 + i * 15);
        return <line key={`r${i}`} x1={0} y1={-10} x2={R1(cos(a) * 80)} y2={R1(sin(a) * 80 - 10)} stroke={ink} strokeWidth={1.6} strokeDasharray="5 4" />;
      })}
      {/* the anaar */}
      <path d="M-46,110 L46,110 L22,20 L-22,20Z" fill={p.accent} stroke={ink} strokeWidth={2.4} />
      <path d="M-46,110 L46,110 L22,20 L-22,20Z" fill="url(#sv-dots)" />
      <path d="M-40,88 L40,88 M-33,62 L33,62 M-27,40 L27,40" stroke="#ffffff" strokeWidth={4} />
      <path d="M-40,88 L40,88 M-33,62 L33,62 M-27,40 L27,40" stroke={ink} strokeWidth={1} opacity={0.5} />
      <ellipse cx={0} cy={20} rx={22} ry={6} fill="#3a2a1a" stroke={ink} strokeWidth={2} />
      <path d="M-14,14 C-6,-30 6,-30 14,14Z" fill="#fff3a0" stroke={ink} strokeWidth={1.6} />
      {/* rockets */}
      {[
        [-120, -40, -30],
        [118, -60, 28],
      ].map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <path d="M-7,30 L-7,-14 L0,-30 L7,-14 L7,30Z" fill={i ? p.accent2 : "#2a7de1"} stroke={ink} strokeWidth={2} />
          <path d="M-7,30 L-14,40 L-7,36Z M7,30 L14,40 L7,36Z" fill={p.accent} stroke={ink} strokeWidth={1.4} />
          <line x1={0} y1={36} x2={0} y2={92} stroke={ink} strokeWidth={2} />
          <path d="M-5,40 C-12,54 12,58 0,74" fill="none" stroke="#ff8a1e" strokeWidth={3} />
        </g>
      ))}
      {/* chakri */}
      <g transform="translate(-104 92)">
        <circle r={22} fill="#7bd389" stroke={ink} strokeWidth={2} />
        <path d="M0,0 m-16,0 a16,16 0 1,0 32,0 a12,12 0 1,0 -24,0 a8,8 0 1,0 16,0" fill="none" stroke={ink} strokeWidth={1.6} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={R1(cos(rad(i * 45)) * 24)} y1={R1(sin(rad(i * 45)) * 24)} x2={R1(cos(rad(i * 45 + 20)) * 38)} y2={R1(sin(rad(i * 45 + 20)) * 38)} stroke="#ffd400" strokeWidth={3} />
        ))}
      </g>
    </svg>
  );
}

function Label({ d, p }: { d: InviteData; p: Palette }) {
  const ink = "#1a1410";
  const fam = d.primary.name.toUpperCase();
  return (
    <div className="sv-label" style={{ background: p.paper }}>
      <svg className="sv-burst" viewBox="-300 -300 600 600" width={600} height={600}>
        {Array.from({ length: 28 }, (_, i) => (
          <path key={i} d={`M0,0 L${R1(cos(rad(i * (360 / 28))) * 420)},${R1(sin(rad(i * (360 / 28))) * 420)} L${R1(cos(rad((i + 0.5) * (360 / 28))) * 420)},${R1(sin(rad((i + 0.5) * (360 / 28))) * 420)}Z`} fill={i % 2 ? p.paper2 : p.paper} />
        ))}
      </svg>
      <div className="sv-frame" style={{ borderColor: p.accent2, outlineColor: ink }} />
      <div className="sv-zig top" />
      <div className="sv-zig bottom" />
      <div className="sv-banner" style={{ background: p.accent }}>
        <span>{fromText(d, "with wishes from")}</span>
        <b>{fam}</b>
      </div>
      <div className="sv-art-wrap">
        <Illustration p={p} />
      </div>
      <div className="sv-title">
        <span className="sv-t-c" aria-hidden>
          {d.eyebrow}
        </span>
        <span className="sv-t-m" aria-hidden>
          {d.eyebrow}
        </span>
        <h1 className="sv-t" style={{ color: p.accent }}>
          {d.eyebrow}
        </h1>
      </div>
      {d.blessingLine && <p className="sv-wish">{d.blessingLine}</p>}
      <div className="sv-badges">
        <div className="sv-badge" style={{ background: p.accent2 }}>
          <b>No. 1</b>
          <span>Wishes</span>
        </div>
        <div className="sv-strip" style={{ background: ink }}>
          Deluxe quality · 100% joy · Made with love
        </div>
        <div className="sv-badge" style={{ background: "#2a7de1", color: "#fff" }}>
          <b>{d.mainDateTime.slice(0, 4)}</b>
          <span>Special</span>
        </div>
      </div>
      <div className="sv-fine">Light with love · Share with family · Keep away from gloom · Lic. No. DIWALI/{d.mainDateTime.slice(0, 4)}</div>
      <div className="sv-halftone" />
      <div className="sv-wear" />
    </div>
  );
}

/** BOOM: a burst of sparks and confetti from the top of the box. */
function drawBoom(ctx: CanvasRenderingContext2D, t: number, t0: number, cols: string[]) {
  const age = t - t0;
  if (age < 0 || age > 2.2) return;
  const r = rng(Math.round(t0 * 997) + 1);
  for (let i = 0; i < 120; i++) {
    const a = r() * Math.PI * 2;
    const sp = 160 + r() * 340;
    const x = 250 + Math.cos(a) * sp * age;
    const y = 300 + Math.sin(a) * sp * age * 0.8 + 260 * age * age;
    ctx.globalAlpha = Math.max(0, 1 - age / 2.2);
    ctx.fillStyle = cols[i % cols.length];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(age * 8 + i);
    ctx.fillRect(-4, -2, i % 3 ? 8 : 4, i % 3 ? 4 : 4);
    ctx.restore();
  }
  if (age < 0.18) {
    ctx.globalAlpha = 1 - age / 0.18;
    ctx.fillStyle = "#fffbe8";
    ctx.fillRect(0, 0, 500, 700);
  }
  ctx.globalAlpha = 1;
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const boom = useRef(-99);
  const light = () => {
    const t = cardClock();
    boom.current = t + 0.9;
    const tip = document.querySelector(".sv-spark");
    const lbl = document.querySelector(".sv-label");
    if (tip) gsap.fromTo(tip, { y: 0, opacity: 1 }, { y: 40, opacity: 0, duration: 0.9, ease: "none" });
    if (lbl)
      gsap
        .timeline()
        .to(lbl, { x: 3, duration: 0.04, repeat: 9, yoyo: true }, 0.5)
        .fromTo(lbl, { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }, 0.9);
  };
  return (
    <div className="page-content cover wd-cover">
      <div className="sv-table" />
      <Label d={d} p={p} />
      <svg className="sv-fuse" viewBox="0 0 40 70" width={40} height={70}>
        <path d="M20,70 C14,52 28,40 18,22 C12,12 22,6 20,0" fill="none" stroke="#6b5a3a" strokeWidth={4} />
        <path d="M20,70 C14,52 28,40 18,22 C12,12 22,6 20,0" fill="none" stroke="#c9b48a" strokeWidth={1.4} strokeDasharray="3 3" />
      </svg>
      <div className="sv-spark" />
      <LiveCanvas width={500} height={700} className="sv-boom" draw={(ctx, t, w, h) => (ctx.clearRect(0, 0, w, h), drawBoom(ctx, t, boom.current, [p.accent, p.accent2, "#2a7de1", "#7bd389", "#ffffff"]))} />
      {env.guest && <div className="sv-guest">For {env.guest}</div>}
      {env.mode === "live" && (
        <>
          <button type="button" className="sv-hit" data-no-flip aria-label="Light the fuse" onPointerDown={(e) => (e.stopPropagation(), light())} />
          <div className="sv-hint">Tap the fuse 💥</div>
        </>
      )}
    </div>
  );
}

export const sivakasi: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="sv-page" style={{ background: p.paper }} />
        <div className="sv-frame inner" style={{ borderColor: p.accent2, outlineColor: "#1a1410" }} />
        <div className="sv-zig top" />
        <div className="sv-zig bottom" />
        <div className="sv-halftone" />
        <div className="sv-wear" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="sv-page" style={{ background: p.paper2 }} />
      <div className="sv-halftone" />
    </div>
  ),
};

/* ---------------- intro: light the fuse, shake, BOOM ---------------- */

export const boom: IntroDef = {
  end: 2.4,
  burst: 1.3,
  hint: { x: 300, y: 450 },
  Over: () => (
    <div className="in-part bm-wrap">
      <div className="bm-spark" />
      <div className="bm-flash" />
      <svg className="bm-pow" viewBox="-100 -100 200 200" width={240} height={240}>
        <path d={Array.from({ length: 24 }, (_, i) => `${i ? "L" : "M"}${R1(cos(rad(i * 15)) * (i % 2 ? 56 : 92))},${R1(sin(rad(i * 15)) * (i % 2 ? 56 : 92))}`).join(" ") + "Z"} fill="#ffd400" stroke="#1a1410" strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" className="bm-text">
          BOOM!
        </text>
      </svg>
    </div>
  ),
  build: (q) => {
    gsap.set(q(".bm-pow"), { scale: 0, rotate: -20, transformOrigin: "50% 50%" });
    gsap.set(q(".sv-label"), { transformOrigin: "50% 60%" });
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(q(".bm-spark"), { y: 0, opacity: 1 }, { y: 46, opacity: 1, duration: 0.8, ease: "none" }, 0.05)
      .to(q(".bm-spark"), { opacity: 0, duration: 0.1 }, 0.85)
      .to(q(".sv-label"), { x: 4, rotate: 0.6, duration: 0.04, repeat: 11, yoyo: true }, 0.4)
      .to(q(".bm-flash"), { opacity: 1, duration: 0.05 }, 0.9)
      .to(q(".bm-flash"), { opacity: 0, duration: 0.5 }, 0.97)
      .to(q(".bm-pow"), { scale: 1.2, rotate: 8, duration: 0.3, ease: "back.out(3)" }, 0.92)
      .to(q(".bm-pow"), { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" }, 1.6)
      .fromTo(q(".sv-label"), { scale: 1.12 }, { scale: 1, x: 0, rotate: 0, duration: 0.8, ease: "elastic.out(1, 0.45)" }, 0.95)
      .set(q(".sv-label"), { clearProps: "transform" }, 2.35);
    return tl;
  },
};
