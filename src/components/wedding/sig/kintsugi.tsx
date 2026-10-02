"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, fmtLongDate, initials, rng, sin } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { foilFill, isDark } from "@/components/card/theme";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "./util";

/* ============================================================
   Kintsugi: dark ceramic mended with rivers of gold.
   The same crack network draws the card and the intro's shards,
   so the pieces fly together into exactly the seams you see.
   ============================================================ */

type Pt = [number, number];
const PTS: Record<string, Pt> = {
  B0: [0, 0], B1: [230, 0], B2: [420, 0], B3: [500, 0], B4: [500, 150], B5: [500, 470], B6: [500, 700],
  B7: [300, 700], B8: [90, 700], B9: [0, 700], B10: [0, 520], B11: [0, 260], P1: [90, 120], M: [470, 250], P2: [390, 610],
};
// the seams flow around the edges so the central shard holds the names untouched
const SEAMS: [string, string][] = [["B1", "P1"], ["B11", "P1"], ["P1", "M"], ["B4", "M"], ["M", "P2"], ["B5", "P2"], ["B7", "P2"], ["B8", "P2"], ["B10", "P1"]];
const SHARDS: string[][] = [
  ["B0", "B1", "P1", "B11"],
  ["B1", "B2", "B3", "B4", "M", "P1"],
  ["B4", "B5", "P2", "M"],
  ["B5", "B6", "B7", "P2"],
  ["B7", "B8", "P2"],
  ["B8", "B9", "B10", "P1", "M", "P2"],
  ["B10", "B11", "P1"],
];

const isSeam = (a: string, b: string) => SEAMS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/** Jagged points between two named points; the same whichever way it's walked. */
function jag(a: string, b: string): Pt[] {
  const [k1, k2] = a < b ? [a, b] : [b, a];
  const r = rng([...(k1 + k2)].reduce((s, c) => s * 31 + c.charCodeAt(0), 7) >>> 0);
  const [x1, y1] = PTS[k1];
  const [x2, y2] = PTS[k2];
  const n = 7;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const pts: Pt[] = [];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const amp = (r() - 0.5) * 26 * sin(t * Math.PI);
    pts.push([R1(x1 + (x2 - x1) * t + nx * amp), R1(y1 + (y2 - y1) * t + ny * amp)]);
  }
  return a < b ? pts : pts.reverse();
}

const seamPath = (a: string, b: string, dx = 0, dy = 0) => {
  const pts = [PTS[a], ...jag(a, b), PTS[b]];
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${R1(x + dx)},${R1(y + dy)}`).join(" ");
};

const shardPath = (s: string[], dx = 0, dy = 0) => {
  const pts: Pt[] = [];
  s.forEach((name, i) => {
    const next = s[(i + 1) % s.length];
    pts.push(PTS[name]);
    if (isSeam(name, next)) pts.push(...jag(name, next));
  });
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${R1(x + dx)},${R1(y + dy)}`).join(" ") + "Z";
};

/** Fine hairline cracks branching off the seams. */
const HAIR = (() => {
  const r = rng(404);
  return SEAMS.slice(0, 7).map(([a, b]) => {
    const pts = jag(a, b);
    const [sx, sy] = pts[2 + Math.floor(r() * 3)];
    let x = sx;
    let y = sy;
    let d = `M${x},${y}`;
    const ang = r() * Math.PI * 2;
    for (let i = 0; i < 4; i++) {
      x = R1(x + Math.round(cos(ang + (r() - 0.5)) * 1600) / 100);
      y = R1(y + Math.round(sin(ang + (r() - 0.5)) * 1600) / 100);
      d += ` L${x},${y}`;
    }
    return d;
  });
})();

/** The gold: soft underglow, the seam itself, a bright edge, and glints running along it. */
function Seams({ p, live = true }: { p: Palette; live?: boolean }) {
  const fill = foilFill(p);
  return (
    <svg className="kt-seams" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <filter id="kt-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        <g stroke="#f7c35c" strokeWidth={9} opacity={0.35} filter="url(#kt-glow)">
          {SEAMS.map(([a, b]) => (
            <path key={a + b} d={seamPath(a, b)} />
          ))}
        </g>
        <g stroke={fill} strokeWidth={3.4} filter="url(#f-foil)">
          {SEAMS.map(([a, b]) => (
            <path key={a + b} d={seamPath(a, b)} />
          ))}
          {HAIR.map((d, i) => (
            <path key={i} d={d} strokeWidth={1.4} />
          ))}
        </g>
        <g stroke="#fff6d0" strokeWidth={0.8} opacity={0.7}>
          {SEAMS.map(([a, b]) => (
            <path key={a + b} d={seamPath(a, b, -0.6, -0.6)} />
          ))}
        </g>
        {live && (
          <g stroke="#fffbe8" strokeWidth={2.2} className="kt-glints">
            {SEAMS.map(([a, b], i) => (
              <path key={a + b} d={seamPath(a, b)} pathLength={1} style={{ animationDelay: `${(i * 0.73) % 4}s` }} />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

/** Glazed ceramic surface: depth, pooling and fine crackle. */
function Glaze({ p }: { p: Palette }) {
  const dark = isDark(p.paper);
  return (
    <svg className="kt-glaze" viewBox="0 0 500 700" width={500} height={700}>
      <defs>
        <radialGradient id="kt-pool" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stopColor={mix(p.paper, "#ffffff", dark ? 0.12 : 0.5)} />
          <stop offset="0.6" stopColor={p.paper} />
          <stop offset="1" stopColor={mix(p.paper, "#000000", dark ? 0.5 : 0.12)} />
        </radialGradient>
        <filter id="kt-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="11" />
          <feColorMatrix values={`0 0 0 0 ${dark ? 1 : 0}  0 0 0 0 ${dark ? 1 : 0}  0 0 0 0 ${dark ? 1 : 0}  0 0 0 0.09 0`} />
        </filter>
      </defs>
      <rect width={500} height={700} fill="url(#kt-pool)" />
      <rect width={500} height={700} filter="url(#kt-grain)" />
      <ellipse cx={160} cy={120} rx={220} ry={90} fill="#fff" opacity={dark ? 0.05 : 0.18} transform="rotate(-20 160 120)" />
    </svg>
  );
}

/** Hanko-style seal with the couple's initials. */
function Seal({ text, color }: { text: string; color: string }) {
  return (
    <div className="kt-seal" style={{ background: color }}>
      <span>{text}</span>
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  return (
    <div className="page-content cover wd-cover">
      <div className="kt-text">
        <div className="kt-eyebrow">{d.eyebrow}</div>
        <h1 className="kt-names foil-text">
          <span>{a.name}</span>
          {b?.name && (
            <>
              <i>&amp;</i>
              <span>{b.name}</span>
            </>
          )}
        </h1>
        <div className="kt-rule" />
        <div className="kt-when">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
        {main && <div className="kt-where">{main.venue}</div>}
        {env.guest && <div className="kt-guest">For {env.guest}</div>}
      </div>
      {d.quote && <div className="kt-quote">{d.quote}</div>}
      <Seal text={initials(a.name, b?.name)} color={p.accent} />
    </div>
  );
}

export const kintsugi: WedDesign = {
  Frame: ({ p, kind }) => (
    <>
      <Glaze p={p} />
      {kind === "cover" ? (
        <Seams p={p} />
      ) : (
        <svg className="kt-seams" viewBox="0 0 500 700" width={500} height={700}>
          <g fill="none" stroke={foilFill(p)} strokeWidth={2.6} filter="url(#f-foil)" opacity={0.9}>
            <path d={seamPath("B11", "P1")} />
            <path d={seamPath("B5", "P2")} />
            <path d={seamPath("B7", "P2")} />
          </g>
        </svg>
      )}
    </>
  ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <Glaze p={p} />
      <Seams p={p} live={false} />
    </div>
  ),
};

/* ---------------- intro: shards fly together, gold flows in ---------------- */

const SCATTER = (() => {
  const r = rng(5150);
  return SHARDS.map(() => ({ dx: (r() - 0.5) * 900, dy: (r() - 0.5) * 1100, rot: (r() - 0.5) * 120 }));
})();

export const mend: IntroDef = {
  end: 2.6,
  burst: 2.0,
  hint: { x: 300, y: 450 },
  Over: ({ p }) => {
    const fill = foilFill(p);
    const dark = isDark(p.paper);
    return (
      <svg className="in-part kt-intro" viewBox="0 0 500 700" width={500} height={700}>
        <defs>
          <linearGradient id="kt-shard" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={mix(p.paper, "#ffffff", dark ? 0.14 : 0.4)} />
            <stop offset="1" stopColor={mix(p.paper, "#000000", dark ? 0.35 : 0.1)} />
          </linearGradient>
        </defs>
        {SHARDS.map((s, i) => (
          <path key={i} className="kt-shard" d={shardPath(s)} fill="url(#kt-shard)" stroke={mix(p.paper, "#000", 0.4)} strokeWidth={0.8} />
        ))}
        <g fill="none" stroke={fill} strokeWidth={3.6} strokeLinecap="round" filter="url(#f-foil)">
          {SEAMS.map(([a, b]) => (
            <path key={a + b} className="kt-flow" d={seamPath(a, b)} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
          ))}
        </g>
      </svg>
    );
  },
  build: (q, holder) => {
    // the card stays hidden until the bowl is whole again
    gsap.set(holder, { opacity: 0 });
    const shards = q(".kt-shard");
    shards.forEach((el, i) => gsap.set(el, { x: SCATTER[i].dx, y: SCATTER[i].dy, rotate: SCATTER[i].rot, transformOrigin: "50% 50%", opacity: 0.9 }));
    const tl = gsap.timeline({ paused: true });
    shards.forEach((el, i) => tl.to(el, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.05 + i * 0.06));
    tl.to(q(".kt-flow"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.05, ease: "power1.inOut" }, 1.05)
      .to(q(".kt-intro"), { filter: "brightness(1.35)", duration: 0.25, yoyo: true, repeat: 1 }, 1.7)
      .set(holder, { opacity: 1 }, 1.95)
      .to(q(".kt-intro"), { opacity: 0, duration: 0.5 }, 2.05)
      .set(holder, { clearProps: "opacity" }, 2.58);
    return tl;
  },
};
