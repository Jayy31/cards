"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { atan2, cos, fmtLongDate, rng, sin } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { placeOf } from "@/lib/sky";
import { useCardEnv } from "@/components/card/CardEnv";
import { isDark } from "@/components/card/theme";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "./util";

/* ============================================================
   Wanderlust: an illustrated map of two journeys that meet at
   the wedding. Folded map intro; the route draws itself.
   ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;

/** Smooth organic island outline. */
function blob(cx: number, cy: number, r: number, seed: number, n = 22) {
  const rr = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 0.7 + rr() * 0.42 + 0.12 * sin(a * 3 + seed);
    return [cx + cos(a) * r * k * 1.15, cy + sin(a) * r * k * 0.9];
  });
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % n];
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    d += i === 0 ? `M${R1(mx)},${R1(my)}` : ` Q${R1(p0[0])},${R1(p0[1])} ${R1(mx)},${R1(my)}`;
  }
  const p0 = pts[0];
  const m0 = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
  return `${d} Q${R1(p0[0])},${R1(p0[1])} ${R1(m0[0])},${R1(m0[1])}Z`;
}

function Compass({ x, y, r, ink, accent }: { x: number; y: number; r: number; ink: string; accent: string }) {
  const point = (a: number, len: number, w: number, i: number) => {
    const tip = [cos(rad(a - 90)) * len, sin(rad(a - 90)) * len];
    const l = [cos(rad(a - 90 - 90)) * w, sin(rad(a - 90 - 90)) * w];
    const rr = [cos(rad(a - 90 + 90)) * w, sin(rad(a - 90 + 90)) * w];
    return (
      <g key={i}>
        <path d={`M0,0 L${R1(l[0])},${R1(l[1])} L${R1(tip[0])},${R1(tip[1])}Z`} fill={ink} />
        <path d={`M0,0 L${R1(rr[0])},${R1(rr[1])} L${R1(tip[0])},${R1(tip[1])}Z`} fill="#fffaf0" stroke={ink} strokeWidth={0.6} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 0.78} fill="none" stroke={ink} strokeWidth={0.8} />
      <circle r={r * 0.7} fill="none" stroke={ink} strokeWidth={0.5} strokeDasharray="2 2" />
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a, i) => point(a, r * 0.5, r * 0.07, i))}
      {[45, 135, 225, 315].map((a, i) => point(a, r * 0.66, r * 0.1, 10 + i))}
      {[0, 90, 180, 270].map((a, i) => point(a, r, r * 0.14, 20 + i))}
      <circle r={r * 0.08} fill={accent} />
      <text y={-r - 5} textAnchor="middle" className="wl-n" fill={ink}>
        N
      </text>
    </g>
  );
}

function Pin({ x, y, color, label, heart = false }: { x: number; y: number; color: string; label: string; heart?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className="wl-pin">
      <ellipse cx={0} cy={2} rx={6} ry={2} fill="#000" opacity={0.25} />
      {heart ? (
        <path d="M0,0 C-14,-12 -12,-26 -4,-26 C-1,-26 0,-23 0,-21 C0,-23 1,-26 4,-26 C12,-26 14,-12 0,0Z" fill={color} stroke="#fff" strokeWidth={1.4} />
      ) : (
        <>
          <path d="M0,0 C-10,-14 -10,-26 0,-28 C10,-26 10,-14 0,0Z" fill={color} stroke="#fff" strokeWidth={1.2} />
          <circle cx={0} cy={-18} r={4} fill="#fff" />
        </>
      )}
      <g transform="translate(0 -40)">
        <rect x={-label.length * 3.6 - 8} y={-9} width={label.length * 7.2 + 16} height={16} rx={8} fill="#fffaf0" stroke={color} strokeWidth={1} />
        <text textAnchor="middle" y={3} className="wl-label" fill="#3b2f22">
          {label}
        </text>
      </g>
    </g>
  );
}

/** The whole map (500×700), shared by the card and the folding intro. */
export function MapArt({ d, p, id = "wl" }: { d: InviteData; p: Palette; id?: string }) {
  const [a, b] = coupleOrder(d);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  const city = main ? placeOf(`${main.venue} ${main.address}`).name : "Forever";
  const sea = p.accent2;
  const land = p.paper2;
  const ink = isDark(land) ? "#f4ead8" : "#3b2f22";
  const seaInk = mix(sea, "#000000", 0.25);
  const r = rng(808);
  const A = { x: 108, y: 150 };
  const B = { x: 392, y: 172 };
  const C = { x: 250, y: 372 };
  const route = (s: { x: number; y: number }, e: { x: number; y: number }, bend: number) => {
    const mx = (s.x + e.x) / 2 + (e.y - s.y) * bend;
    const my = (s.y + e.y) / 2 - (e.x - s.x) * bend;
    return { d: `M${s.x},${s.y} Q${R1(mx)},${R1(my)} ${e.x},${e.y}`, mx: (s.x + 2 * mx + e.x) / 4, my: (s.y + 2 * my + e.y) / 4, ang: atan2(e.y - s.y, e.x - s.x) };
  };
  const r1 = route(A, C, 0.25);
  const r2 = route(B, C, -0.25);
  const lands = [
    { cx: 116, cy: 150, r: 92, seed: 3, name: `${a.name}'s Shire` },
    { cx: 392, cy: 168, r: 96, seed: 8, name: b ? `${b.name}'s Isle` : "Far Isle" },
    { cx: 250, cy: 372, r: 96, seed: 13, name: city },
  ];
  return (
    <svg viewBox="0 0 500 700" width={500} height={700} className="wl-map">
      <defs>
        <pattern id={`${id}-waves`} width={34} height={22} patternUnits="userSpaceOnUse">
          <path d="M2,12 q5,-5 10,0 t10,0" fill="none" stroke={seaInk} strokeWidth={0.9} opacity={0.35} />
        </pattern>
        <filter id={`${id}-paper`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.12 0" />
        </filter>
      </defs>
      <rect width={500} height={700} fill={sea} />
      <rect width={500} height={700} fill={`url(#${id}-waves)`} />
      <g stroke={seaInk} strokeWidth={0.5} opacity={0.35} strokeDasharray="3 4">
        {[70, 140, 210, 280, 350, 420, 490, 560, 630].map((y) => (
          <line key={y} x1={0} y1={y} x2={500} y2={y} />
        ))}
        {[83, 166, 250, 333, 416].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={700} />
        ))}
      </g>
      {lands.map((l, i) => (
        <g key={i}>
          <path d={blob(l.cx, l.cy, l.r * 1.12, l.seed)} fill="none" stroke={mix(sea, "#ffffff", 0.45)} strokeWidth={6} opacity={0.6} />
          <path d={blob(l.cx, l.cy, l.r, l.seed)} fill={land} stroke={ink} strokeWidth={1.6} />
          <path d={blob(l.cx, l.cy, l.r * 0.9, l.seed)} fill="none" stroke={ink} strokeWidth={0.6} strokeDasharray="1.5 3" opacity={0.6} />
          {Array.from({ length: 5 }, (_, k) => {
            const ang = r() * Math.PI * 2;
            const dist = r() * l.r * 0.45;
            const x = R1(l.cx + cos(ang) * dist);
            const y = R1(l.cy + sin(ang) * dist * 0.8);
            return k % 2 ? (
              <g key={k} transform={`translate(${x} ${y})`}>
                <path d="M-9,0 L0,-14 L9,0Z" fill={mix(land, ink, 0.18)} stroke={ink} strokeWidth={0.8} />
                <path d="M-3,-9 L0,-14 L3,-9" fill="#fff" />
              </g>
            ) : (
              <g key={k} transform={`translate(${x} ${y})`}>
                <line x1={0} y1={0} x2={0} y2={-5} stroke={ink} strokeWidth={0.8} />
                <circle cx={0} cy={-8} r={4.4} fill={mix(land, "#4f7a3a", 0.6)} stroke={ink} strokeWidth={0.6} />
              </g>
            );
          })}
          <text x={l.cx} y={l.cy + l.r * 0.62} textAnchor="middle" className="wl-land" fill={ink}>
            {l.name}
          </text>
        </g>
      ))}
      {/* the two journeys */}
      <g fill="none" stroke={p.accent} strokeWidth={2.2} strokeLinecap="round">
        <path d={r1.d} strokeDasharray="6 6" className="wl-route" />
        <path d={r2.d} strokeDasharray="6 6" className="wl-route" />
      </g>
      <g transform={`translate(${R1(r1.mx)} ${R1(r1.my)}) rotate(${R1((r1.ang * 180) / Math.PI)})`} fill={p.accent}>
        <path d="M9,0 L-6,-6 L-3,0 L-6,6Z" />
      </g>
      <g transform={`translate(${R1(r2.mx)} ${R1(r2.my)}) rotate(${R1((r2.ang * 180) / Math.PI)})`} fill={p.accent}>
        <path d="M9,0 L-6,-6 L-3,0 L-6,6Z" />
      </g>
      {/* sea life and sky */}
      <g transform="translate(60 330)">
        <path d="M-16,8 L16,8 L10,16 L-10,16Z" fill={mix(land, "#7a4a2a", 0.6)} stroke={ink} strokeWidth={0.8} />
        <path d="M0,8 L0,-22 L14,6Z" fill="#fffaf0" stroke={ink} strokeWidth={0.8} />
        <path d="M-1,8 L-1,-16 L-12,6Z" fill={p.accent} />
      </g>
      <g transform="translate(445 300)" stroke={seaInk} fill="none" strokeWidth={1.2}>
        <path d="M-10,0 C-6,-10 6,-10 10,0" />
        <path d="M0,-6 C-4,-16 -10,-16 -12,-12 M0,-6 C4,-16 10,-16 12,-12" />
      </g>
      <g transform="translate(250 70)">
        <path d="M-18,0 C-18,-26 18,-26 18,0 C18,12 6,18 3,26 L-3,26 C-6,18 -18,12 -18,0Z" fill={p.accent} stroke={ink} strokeWidth={0.8} />
        <path d="M-6,-21 C-10,-6 -8,12 -3,26 M6,-21 C10,-6 8,12 3,26" fill="none" stroke="#fffaf0" strokeWidth={4} opacity={0.9} />
        <rect x={-5} y={32} width={10} height={7} fill={mix(land, "#7a4a2a", 0.6)} stroke={ink} strokeWidth={0.8} />
        <path d="M-3,26 L-4,32 M3,26 L4,32" stroke={ink} strokeWidth={0.6} />
      </g>
      <Compass x={432} y={420} r={40} ink={ink === "#3b2f22" ? "#3b2f22" : "#2a2016"} accent={p.accent} />
      <Pin x={A.x} y={A.y} color={p.accent} label={a.name} />
      {b && <Pin x={B.x} y={B.y} color={p.accent} label={b.name} />}
      <Pin x={C.x} y={C.y} color={p.accent} label={city} heart />
      {/* neatline: classic checkered map border */}
      <rect x={8} y={8} width={484} height={684} fill="none" stroke="#2a2016" strokeWidth={6} />
      <rect x={8} y={8} width={484} height={684} fill="none" stroke="#fffaf0" strokeWidth={4} strokeDasharray="22 22" />
      <rect x={14} y={14} width={472} height={672} fill="none" stroke="#2a2016" strokeWidth={1} />
      <rect width={500} height={700} filter={`url(#${id}-paper)`} />
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  return (
    <div className="page-content cover wd-cover">
      <MapArt d={d} p={p} />
      <div className="wl-cartouche">
        <div className="wl-eyebrow">{d.eyebrow}</div>
        <h1 className="wl-names">
          {a.name}
          {b?.name && <i> &amp; </i>}
          {b?.name}
        </h1>
        <div className="wl-when">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
        <div className="wl-scale">
          <span>
            <i />
            <i />
            <i />
            <i />
          </span>
          Scale: 1 cm = 1,000 kisses
        </div>
        {env.guest && <div className="wl-guest">A map for {env.guest}</div>}
      </div>
    </div>
  );
}

export const wanderlust: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="wl-page-sea" />
        <svg className="wl-neat" viewBox="0 0 500 700" width={500} height={700}>
          <rect x={8} y={8} width={484} height={684} fill="none" stroke="#2a2016" strokeWidth={5} />
          <rect x={8} y={8} width={484} height={684} fill="none" stroke="#fffaf0" strokeWidth={3} strokeDasharray="22 22" />
          <rect x={13} y={13} width={474} height={674} fill="none" stroke="#2a2016" strokeWidth={1} />
          <g transform="translate(438 640)">
            <Compass x={0} y={0} r={26} ink="#3b2f22" accent={p.accent} />
          </g>
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => <div className="wd-back-mark wl-back" />,
};

/* ---------------- intro: the folded map opens out ---------------- */

export const unfoldmap: IntroDef = {
  end: 2.3,
  burst: 1.7,
  hint: { x: 300, y: 300 },
  Over: ({ p, data }) => {
    const [a, b] = coupleOrder(data);
    const map = (dx: number, dy: number) => (
      <div className="um-map" style={{ left: -dx, top: -dy }}>
        <MapArt d={data} p={p} id={`um${dx}${dy}`} />
      </div>
    );
    return (
      <div className="in-part um-wrap">
        <div className="um-panel a">{map(0, 0)}</div>
        <div className="um-panel b">
          <div className="um-face">{map(250, 0)}</div>
          <div className="um-face um-back" style={{ background: p.paper }} />
        </div>
        <div className="um-panel c">
          <div className="um-face">{map(0, 350)}</div>
          <div className="um-face um-back um-cover" style={{ background: p.paper }}>
            <span>A map to</span>
            <b>
              {a.name}
              {b?.name ? ` & ${b.name}` : ""}
            </b>
            <span>wedding</span>
          </div>
        </div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { opacity: 0 });
    gsap.set(q(".um-panel.b"), { rotateY: -180 });
    gsap.set(q(".um-panel.c"), { rotateX: 180 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".um-panel.c"), { rotateX: 0, duration: 0.8, ease: "power2.inOut" }, 0.1)
      .to(q(".um-panel.b"), { rotateY: 0, duration: 0.8, ease: "power2.inOut" }, 0.75)
      .set(holder, { opacity: 1 }, 1.7)
      .to(q(".um-wrap"), { opacity: 0, duration: 0.5 }, 1.75)
      .set(holder, { clearProps: "opacity" }, 2.28);
    return tl;
  },
};
