"use client";

import { useId } from "react";
import { POST_W, type PostBrand, type PostRatio, type PostText } from "@/lib/posts";
import { Brand, Fit, Offer, Squeeze, r2, seeded, splitHeading } from "./common";

/*
 * Diwali · "Dwaar": a home's doorway on Diwali night.
 * Indigo lime-washed wall, carved teak door frame with brass studs, doors open onto a warm lit room,
 * a marigold-and-mango-leaf toran across the top, long marigold strings down both posts, Shubh–Labh in
 * kumkum on the wall, and clay diyas along the stone threshold.
 *
 * Recomposition: the door simply gets taller with the shape (more room for the greeting, longer
 * side garlands). In the story shape the threshold opens onto a floor with a powder rangoli, which
 * sits in the bottom zone Instagram/WhatsApp cover with their reply box, so nothing readable goes there.
 */

type Geo = {
  h: number;
  step: number; // top of the stone threshold
  brandTop: number;
  brandH: number;
  textTop: number;
  textBottom: number;
  strand: number; // flowers per hanging toran strand
  card: boolean; // brand as an inset card on the floor (story) vs a full-width band
};
const GEO: Record<PostRatio, Geo> = {
  "1x1": { h: 1080, step: 712, brandTop: 772, brandH: 308, textTop: 236, textBottom: 652, strand: 2, card: false },
  "4x5": { h: 1350, step: 930, brandTop: 990, brandH: 360, textTop: 268, textBottom: 866, strand: 3, card: false },
  "9x16": { h: 1920, step: 1150, brandTop: 1236, brandH: 330, textTop: 420, textBottom: 1060, strand: 5, card: true },
};

// door frame (x)
const POST_L = 108;
const POST_W_ = 88;
const POST_R = POST_W - POST_L - POST_W_;
const LINTEL_Y = 26;
const LINTEL_H = 76;
const OPEN_L = POST_L + POST_W_;
const OPEN_R = POST_R;
const OPEN_TOP = LINTEL_Y + LINTEL_H;

type Flower = { x: number; y: number; s: number; rot: number; c: 0 | 1 };

function toran(g: Geo, rnd: () => number) {
  const flowers: Flower[] = [];
  const leaves: { x: number; y: number; rot: number; s: number }[] = [];
  const strandLeaves: { x: number; y: number; rot: number; s: number }[] = [];
  const add = (x: number, y: number, s: number, c: 0 | 1) => flowers.push({ x: r2(x), y: r2(y), s: r2(s * (0.92 + rnd() * 0.16)), rot: Math.round(rnd() * 360), c });

  // mango leaves hanging from the lintel, full width
  for (let x = 84; x <= POST_W - 84; x += 38) leaves.push({ x, y: OPEN_TOP - 6, rot: Math.round((rnd() - 0.5) * 16), s: r2(0.9 + rnd() * 0.25) });

  // scalloped marigold swag across the opening
  const n = 6;
  const x0 = OPEN_L - 30;
  const w = (OPEN_R + 30 - x0) / n;
  const top = OPEN_TOP + 6;
  for (let i = 0; i < n; i++) {
    const steps = 7;
    for (let k = i === 0 ? 0 : 1; k <= steps; k++) {
      const t = k / steps;
      add(x0 + w * (i + t), top + 4 * 46 * t * (1 - t), 17, (i + k) % 2 ? 0 : 1);
    }
  }
  // short strands at the inner points of the swag
  for (let i = 1; i < n; i++) {
    const x = x0 + w * i;
    let y = top;
    for (let k = 1; k <= g.strand; k++) {
      y += 27;
      add(x, y, 14.5, k % 2 ? 1 : 0);
    }
    strandLeaves.push({ x, y: y + 10, rot: Math.round((rnd() - 0.5) * 10), s: 0.78 });
  }
  // long strings down both door posts, to just above the diyas
  for (const x of [POST_L + POST_W_ / 2, POST_R + POST_W_ / 2]) {
    for (let y = OPEN_TOP + 34; y < g.step - 120; y += 29) add(x + Math.sin(y / 37) * 1.5, y, 16, Math.round(y / 29) % 2 ? 0 : 1);
    strandLeaves.push({ x, y: g.step - 112, rot: 0, s: 0.8 });
  }
  return { flowers, leaves, strandLeaves };
}

/** Petals of one marigold (drawn once into a <symbol>). Ruffled by a displacement filter. */
function marigoldPetals(seed: number) {
  const rnd = seeded(seed);
  const rings = [
    { r: 15, n: 17, l: 9, w: 7.5 },
    { r: 11.5, n: 15, l: 8, w: 7 },
    { r: 8, n: 12, l: 7, w: 6 },
    { r: 4.6, n: 8, l: 5.5, w: 4.6 },
  ];
  const out: { cx: number; cy: number; rx: number; ry: number; a: number; ring: number }[] = [];
  rings.forEach((rg, ring) => {
    const off = rnd() * 360;
    for (let i = 0; i < rg.n; i++) {
      const a = off + (360 / rg.n) * i + (rnd() - 0.5) * 8;
      const rad = (a * Math.PI) / 180;
      const d = rg.r - rg.l / 2 + 1;
      out.push({ cx: r2(Math.cos(rad) * d), cy: r2(Math.sin(rad) * d), rx: r2(rg.l / 2 + rnd()), ry: r2(rg.w / 2), a: Math.round(a), ring });
    }
  });
  return out;
}
const PETALS = marigoldPetals(7);

function Diya({ x, y, id }: { x: number; y: number; id: string }) {
  // clay bowl with a pinched spout, painted rim, cotton wick and a flame
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="4" rx="40" ry="7" fill="#000" opacity=".35" filter={`url(#${id}-blur4)`} />
      <path d="M-34 -14 Q-30 6 0 7 Q30 6 34 -14 Q38 -17 44 -20 Q30 -10 34 -14 Q20 -18 0 -18 Q-20 -18 -34 -14Z" fill={`url(#${id}-clay)`} />
      <ellipse cx="-1" cy="-15" rx="33" ry="5.5" fill="#5b2410" />
      <ellipse cx="-1" cy="-15.5" rx="29" ry="4" fill="#2b1206" />
      <ellipse cx="-1" cy="-16" rx="26" ry="2.8" fill="#8a5a12" opacity=".7" />
      <path d="M-33 -12 Q0 -5 33 -12" stroke="#f1e2c0" strokeWidth="1.6" strokeDasharray="1.5 5" fill="none" opacity=".8" />
      <path d="M-30 -5 Q0 3 30 -5" stroke="#a03218" strokeWidth="2.2" fill="none" opacity=".7" />
      <path d="M31 -17 l9 -5" stroke="#3a1a08" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="-60" r="70" fill={`url(#${id}-halo)`} />
      <path d="M40 -23 C33 -33 34 -48 40 -66 C46 -48 47 -33 40 -23Z" fill={`url(#${id}-flame)`} />
      <path d="M40 -25 C37 -30 37 -37 40 -44 C43 -37 43 -30 40 -25Z" fill="#fffbe8" />
      <ellipse cx="40" cy="-24" rx="2.5" ry="3.5" fill="#3a6fd8" opacity=".55" />
    </g>
  );
}

/** Powder rangoli seen at a low angle (story shape only, in the bottom zone). */
function Rangoli({ cx, cy, id }: { cx: number; cy: number; id: string }) {
  const rings: { r: number; n: number; c: string; w: number; l: number }[] = [
    { r: 300, n: 32, c: "#f2a71b", w: 18, l: 44 },
    { r: 250, n: 28, c: "#d4246a", w: 20, l: 48 },
    { r: 196, n: 22, c: "#1e8c74", w: 22, l: 50 },
    { r: 140, n: 16, c: "#f4f1e8", w: 20, l: 46 },
    { r: 88, n: 12, c: "#e2501f", w: 22, l: 46 },
  ];
  return (
    <g transform={`translate(${cx} ${cy}) scale(1 0.36)`} filter={`url(#${id}-powder)`}>
      <circle r="342" fill="none" stroke="#f4f1e8" strokeWidth="6" strokeDasharray="2 14" strokeLinecap="round" />
      <circle r="322" fill="#7c1b2c" opacity=".9" />
      {rings.map((rg, i) => (
        <g key={i}>
          {Array.from({ length: rg.n }, (_, k) => {
            const a = (360 / rg.n) * k + (i % 2 ? 180 / rg.n : 0);
            return <ellipse key={k} cx="0" cy={-rg.r + rg.l / 2} rx={rg.w} ry={rg.l / 2} fill={rg.c} transform={`rotate(${r2(a)})`} />;
          })}
        </g>
      ))}
      <circle r="58" fill="#f2a71b" />
      <circle r="40" fill="#7c1b2c" />
      <circle r="22" fill="#f4f1e8" />
      {Array.from({ length: 24 }, (_, k) => (
        <circle key={k} cx="0" cy="-332" r="5" fill="#f4f1e8" transform={`rotate(${k * 15})`} />
      ))}
    </g>
  );
}

export function Dwaar({ ratio, b, t }: { ratio: PostRatio; b: PostBrand; t: PostText }) {
  const id = "dw" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = GEO[ratio];
  const { h, step } = g;
  const rnd = seeded(ratio.length * 31 + h);
  const { flowers, leaves, strandLeaves } = toran(g, rnd);
  const diyaX = [64, 198, 332, 466, 614, 748, 882, 1016];
  const midText = (g.textTop + g.textBottom) / 2;
  const [lead, word] = splitHeading(t.heading);
  const floor = g.card;

  return (
    <div className={`pc pc-dwaar r-${ratio}`} style={{ height: h }}>
      <svg className="pc-art" width={POST_W} height={h} viewBox={`0 0 ${POST_W} ${h}`} aria-hidden>
        <defs>
          {/* textures */}
          <filter id={`${id}-plaster`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="3" result="big" />
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="5" result="fine" />
            <feColorMatrix in="big" type="matrix" values="0 0 0 0 .55  0 0 0 0 .62  0 0 0 0 .78  0 0 0 1.1 -.5" result="blotch" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.32" result="grit" />
            <feMerge>
              <feMergeNode in="blotch" />
              <feMergeNode in="grit" />
            </feMerge>
          </filter>
          <filter id={`${id}-grainV`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.22 0.009" numOctaves="3" seed="9" />
            <feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .05  0 0 0 0 .01  1.6 0 0 0 -.62" />
          </filter>
          <filter id={`${id}-grainH`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.22" numOctaves="3" seed="4" />
            <feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .05  0 0 0 0 .01  1.6 0 0 0 -.62" />
          </filter>
          <filter id={`${id}-stone`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.5" numOctaves="3" seed="12" />
            <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .12  0 0 0 0 .1  0 0 0 .8 -.3" />
          </filter>
          <filter id={`${id}-ruffle`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.6" numOctaves="2" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
          <filter id={`${id}-kumkum`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.2 -.75" result="holes" />
            <feComposite in="d" in2="holes" operator="out" />
          </filter>
          <filter id={`${id}-powder`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="6" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.5 -1.05" result="grain" />
            <feComposite in="d" in2="grain" operator="out" />
          </filter>
          <filter id={`${id}-blur4`}>
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id={`${id}-blur10`}>
            <feGaussianBlur stdDeviation="10" />
          </filter>

          {/* light */}
          <radialGradient id={`${id}-room`} cx="540" cy={midText} r={Math.max(560, (step - OPEN_TOP) * 0.75)} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff4d6" />
            <stop offset=".45" stopColor="#fcd793" />
            <stop offset=".8" stopColor="#e09a45" />
            <stop offset="1" stopColor="#a65a22" />
          </radialGradient>
          <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141f38" />
            <stop offset=".6" stopColor="#1f3159" />
            <stop offset="1" stopColor="#2a3a5e" />
          </linearGradient>
          <radialGradient id={`${id}-warm`}>
            <stop offset="0" stopColor="#ffb257" stopOpacity=".55" />
            <stop offset=".5" stopColor="#ff8a2a" stopOpacity=".16" />
            <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-halo`}>
            <stop offset="0" stopColor="#ffe9a8" stopOpacity=".8" />
            <stop offset=".25" stopColor="#ffb347" stopOpacity=".3" />
            <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffd25a" />
            <stop offset=".5" stopColor="#ff9a1f" />
            <stop offset="1" stopColor="#e2470f" stopOpacity=".85" />
          </linearGradient>
          <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c8642e" />
            <stop offset=".6" stopColor="#8f3a17" />
            <stop offset="1" stopColor="#4d1b08" />
          </linearGradient>

          {/* wood */}
          <linearGradient id={`${id}-postL`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b1b0a" />
            <stop offset=".3" stopColor="#7a3f1b" />
            <stop offset=".55" stopColor="#8e4c22" />
            <stop offset="1" stopColor="#4a220c" />
          </linearGradient>
          <linearGradient id={`${id}-postR`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#2c1307" />
            <stop offset=".3" stopColor="#6a3517" />
            <stop offset=".55" stopColor="#7e421d" />
            <stop offset="1" stopColor="#4a220c" />
          </linearGradient>
          <linearGradient id={`${id}-lintel`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a1a09" />
            <stop offset=".35" stopColor="#7a3f1b" />
            <stop offset=".7" stopColor="#5d2d12" />
            <stop offset="1" stopColor="#2a1206" />
          </linearGradient>
          <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f8a2a" />
            <stop offset=".55" stopColor="#2f6a1c" />
            <stop offset="1" stopColor="#1c4512" />
          </linearGradient>
          <radialGradient id={`${id}-brass`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff2b8" />
            <stop offset=".4" stopColor="#d9a43a" />
            <stop offset="1" stopColor="#7a4d0e" />
          </radialGradient>
          <radialGradient id={`${id}-mgShade`} cx=".38" cy=".34" r=".7">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset=".55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#5a1a00" stopOpacity=".45" />
          </radialGradient>
          <linearGradient id={`${id}-leaf2`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3e7a22" />
            <stop offset="1" stopColor="#24561a" />
          </linearGradient>

          {/* marigold: orange (0) and yellow (1) */}
          {[
            ["#d9560a", "#f07a12", "#f79a2a", "#b94706"],
            ["#e69a06", "#f6b51a", "#ffd04a", "#c87b05"],
          ].map((c, k) => (
            <symbol key={k} id={`${id}-mg${k}`} viewBox="-19 -19 38 38" overflow="visible">
              <g filter={`url(#${id}-ruffle)`}>
                <circle r="16.5" fill={c[3]} />
                {PETALS.map((p, i) => (
                  <ellipse key={i} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} transform={`rotate(${p.a} ${p.cx} ${p.cy})`} fill={c[p.ring === 0 ? 0 : p.ring === 3 ? 2 : 1]} stroke={c[3]} strokeWidth=".7" />
                ))}
              </g>
              <circle r="16.5" fill={`url(#${id}-mgShade)`} />
            </symbol>
          ))}
          <symbol id={`${id}-mleaf`} viewBox="-12 0 24 70" overflow="visible">
            <path d="M0 0 C11 10 12 44 0 70 C-12 44 -11 10 0 0Z" fill={`url(#${id}-leaf)`} />
            <path d="M0 3 L0 66" stroke="#a8cf6a" strokeWidth="1.2" opacity=".55" />
            <path d="M0 0 C11 10 12 44 0 70" stroke="#173a0d" strokeWidth="1" fill="none" opacity=".5" />
          </symbol>
          <clipPath id={`${id}-open`}>
            <rect x={OPEN_L} y={OPEN_TOP} width={OPEN_R - OPEN_L} height={step - OPEN_TOP} />
          </clipPath>
        </defs>

        {/* wall */}
        <rect width={POST_W} height={h} fill={`url(#${id}-wall)`} />
        <rect width={POST_W} height={h} filter={`url(#${id}-plaster)`} opacity=".55" />

        {/* the lit room through the open doors */}
        <g clipPath={`url(#${id}-open)`}>
          <rect x={OPEN_L} y={OPEN_TOP} width={OPEN_R - OPEN_L} height={step - OPEN_TOP} fill={`url(#${id}-room)`} />
          <rect x={OPEN_L} y={OPEN_TOP} width={OPEN_R - OPEN_L} height={step - OPEN_TOP} filter={`url(#${id}-plaster)`} opacity=".08" />
          {/* far floor line and a soft shadow from the frame */}
          <rect x={OPEN_L} y={step - 56} width={OPEN_R - OPEN_L} height="56" fill="#b0652a" opacity=".35" />
          <rect x={OPEN_L} y={OPEN_TOP} width={OPEN_R - OPEN_L} height="40" fill="#5a2a0c" opacity=".35" filter={`url(#${id}-blur10)`} />
          {/* door leaves swung inward (seen edge-on in perspective) */}
          {[
            [OPEN_L, 1],
            [OPEN_R, -1],
          ].map(([x, dir]) => (
            <g key={x}>
              <path
                d={`M${x} ${OPEN_TOP} L${x + dir * 52} ${OPEN_TOP + 26} L${x + dir * 52} ${step - 18} L${x} ${step} Z`}
                fill={dir > 0 ? "#4a220c" : "#3a1a08"}
              />
              <path d={`M${x} ${OPEN_TOP} L${x + dir * 52} ${OPEN_TOP + 26} L${x + dir * 52} ${step - 18} L${x} ${step} Z`} filter={`url(#${id}-grainV)`} opacity=".9" />
              {Array.from({ length: Math.floor((step - OPEN_TOP - 60) / 110) }, (_, k) => {
                const y = OPEN_TOP + 50 + k * 110;
                return (
                  <g key={k}>
                    <path d={`M${x + dir * 12} ${y + 6} L${x + dir * 42} ${y + 18} L${x + dir * 42} ${y + 86} L${x + dir * 12} ${y + 92} Z`} fill="none" stroke="#7a4420" strokeWidth="2" opacity=".8" />
                    <circle cx={x + dir * 27} cy={y + 50} r="4" fill={`url(#${id}-brass)`} />
                  </g>
                );
              })}
              <rect x={dir > 0 ? x + 50 : x - 52} y={OPEN_TOP + 26} width="2" height={step - OPEN_TOP - 44} fill="#ffcf7a" opacity=".5" />
            </g>
          ))}
        </g>

        {/* warm diya light spilling onto the wall and frame */}
        {diyaX.map((x) => (
          <ellipse key={x} cx={x + 40} cy={step - 60} rx="150" ry="220" fill={`url(#${id}-warm)`} style={{ mixBlendMode: "screen" }} />
        ))}

        {/* Shubh – Labh in kumkum on the wall */}
        <g filter={`url(#${id}-kumkum)`} fill="#ef4a2b" fontFamily="var(--f-deva), serif" fontSize="58" textAnchor="middle" stroke="#ef4a2b" strokeWidth="1.2">
          <text x={POST_L / 2 - 2} y={midText}>शुभ</text>
          <text x={POST_W - POST_L / 2 + 2} y={midText}>लाभ</text>
        </g>

        {/* door posts: carved teak */}
        {[
          [POST_L, `${id}-postL`],
          [POST_R, `${id}-postR`],
        ].map(([x, grad]) => {
          const px = x as number;
          return (
            <g key={px}>
              <rect x={px + 6} y={LINTEL_Y} width={POST_W_} height={step - LINTEL_Y} fill="#000" opacity=".4" filter={`url(#${id}-blur10)`} />
              <rect x={px} y={LINTEL_Y} width={POST_W_} height={step - LINTEL_Y} fill={`url(#${grad})`} />
              <rect x={px} y={LINTEL_Y} width={POST_W_} height={step - LINTEL_Y} filter={`url(#${id}-grainV)`} />
              {/* stepped mouldings */}
              <rect x={px + 10} y={OPEN_TOP} width="3" height={step - OPEN_TOP} fill="#c27a3e" opacity=".55" />
              <rect x={px + POST_W_ - 13} y={OPEN_TOP} width="3" height={step - OPEN_TOP} fill="#1d0b03" opacity=".6" />
              {/* carved bead column */}
              {Array.from({ length: Math.floor((step - OPEN_TOP - 30) / 26) }, (_, k) => (
                <g key={k}>
                  <rect x={px + 30} y={OPEN_TOP + 18 + k * 26} width="28" height="20" rx="10" fill="#5a2a10" />
                  <rect x={px + 32} y={OPEN_TOP + 19 + k * 26} width="22" height="9" rx="4.5" fill="#b06a32" opacity=".55" />
                </g>
              ))}
            </g>
          );
        })}

        {/* lintel with brass studs */}
        <rect x={POST_L - 34} y={LINTEL_Y + 8} width={POST_W - 2 * (POST_L - 34)} height={LINTEL_H} fill="#000" opacity=".45" filter={`url(#${id}-blur10)`} />
        <rect x={POST_L - 34} y={LINTEL_Y} width={POST_W - 2 * (POST_L - 34)} height={LINTEL_H} fill={`url(#${id}-lintel)`} />
        <rect x={POST_L - 34} y={LINTEL_Y} width={POST_W - 2 * (POST_L - 34)} height={LINTEL_H} filter={`url(#${id}-grainH)`} />
        <rect x={POST_L - 34} y={LINTEL_Y + 14} width={POST_W - 2 * (POST_L - 34)} height="2.5" fill="#c27a3e" opacity=".5" />
        <rect x={POST_L - 34} y={LINTEL_Y + LINTEL_H - 18} width={POST_W - 2 * (POST_L - 34)} height="2.5" fill="#1d0b03" opacity=".6" />
        {Array.from({ length: 23 }, (_, k) => (
          <circle key={k} cx={POST_L - 10 + k * 40} cy={LINTEL_Y + 38} r="6.5" fill={`url(#${id}-brass)`} />
        ))}

        {/* toran: leaves behind, flowers in front */}
        {leaves.map((l, i) => (
          <use key={i} href={`#${id}-mleaf`} x="-12" y="0" width="24" height="70" transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`} />
        ))}
        {strandLeaves.map((l, i) => (
          <use key={i} href={`#${id}-mleaf`} x="-12" y="0" width="24" height="70" transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`} />
        ))}
        {/* threads */}
        <g stroke="#e8d7b0" strokeWidth="1.3" opacity=".5">
          {[POST_L + POST_W_ / 2, POST_R + POST_W_ / 2].map((x) => (
            <line key={x} x1={x} y1={OPEN_TOP} x2={x} y2={step - 112} />
          ))}
        </g>
        {flowers.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
            <circle r={f.s} cy="4" fill="#000" opacity=".25" filter={`url(#${id}-blur4)`} />
            <use href={`#${id}-mg${f.c}`} x={-f.s} y={-f.s} width={f.s * 2} height={f.s * 2} />
          </g>
        ))}

        {/* threshold: kota stone step */}
        <rect x="0" y={step} width={POST_W} height="22" fill="#9a9a86" />
        <rect x="0" y={step} width={POST_W} height="22" filter={`url(#${id}-stone)`} />
        <rect x="0" y={step + 22} width={POST_W} height="44" fill="#55584c" />
        <rect x="0" y={step + 22} width={POST_W} height="44" filter={`url(#${id}-stone)`} />
        <rect x="0" y={step + 21} width={POST_W} height="2" fill="#d9d4bc" opacity=".6" />
        {/* floor + rangoli (story) */}
        {floor && (
          <>
            <rect x="0" y={step + 66} width={POST_W} height={h - step - 66} fill="#3b3a35" />
            <rect x="0" y={step + 66} width={POST_W} height={h - step - 66} filter={`url(#${id}-stone)`} opacity=".8" />
            <rect x="0" y={step + 66} width={POST_W} height="30" fill="#000" opacity=".35" filter={`url(#${id}-blur10)`} />
            <Rangoli cx={540} cy={h - 170} id={id} />
            {[150, 930].map((x) => (
              <Diya key={x} x={x - 40} y={h - 170} id={id} />
            ))}
            <ellipse cx="540" cy={h - 170} rx="520" ry="230" fill={`url(#${id}-warm)`} style={{ mixBlendMode: "screen" }} />
          </>
        )}

        {/* diyas on the step */}
        {diyaX.map((x) => (
          <Diya key={x} x={x - 40} y={step + 13} id={id} />
        ))}
      </svg>

      {/* greeting, inside the lit doorway */}
      <Squeeze className="dw-text" style={{ top: g.textTop, height: g.textBottom - g.textTop }} deps={[t.heading, t.wish, t.message, ratio]}>
        {lead && <Fit className="dw-lead" text={lead} max={ratio === "1x1" ? 66 : ratio === "4x5" ? 80 : 92} min={40} />}
        <Fit as="h1" className="dw-word" text={word} max={ratio === "1x1" ? 104 : ratio === "4x5" ? 128 : 150} min={52} />
        <svg className="dw-orn" viewBox="0 0 300 24" width="300" height="24" aria-hidden>
          <path d="M10 12 H128 M172 12 H290" stroke="currentColor" strokeWidth="1.6" />
          <path d="M150 2 L160 12 L150 22 L140 12 Z" fill="currentColor" />
          <circle cx="132" cy="12" r="3" fill="currentColor" />
          <circle cx="168" cy="12" r="3" fill="currentColor" />
        </svg>
        {t.wish && <Fit as="p" className="dw-wish" text={t.wish} max={ratio === "9x16" ? 42 : ratio === "4x5" ? 37 : 34} min={24} />}
        {t.message && <Fit as="p" className="dw-msg" text={t.message} max={ratio === "9x16" ? 32 : 27} min={20} />}
      </Squeeze>

      <Offer text={b.offer} className="dw-offer" style={{ top: g.brandTop - (g.card ? 30 : 28) }} />
      <Brand
        b={b}
        className={`dw-brand ${g.card ? "is-card" : ""}`}
        style={{ top: g.brandTop, height: g.brandH }}
      />
    </div>
  );
}
