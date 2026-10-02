"use client";
import React, { useState } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import { foilFill } from "@/components/card/theme";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Mithai Box: a luxury box of Diwali sweets. The lid hinges open
   in 3D; tap a sweet to have one (leave some for others!).
   ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;

/** Scalloped paper cup. */
function Cup({ col }: { col: string }) {
  const n = 18;
  const pt = (i: number) => [R1(cos(rad((i * 360) / n)) * 47), R1(sin(rad((i * 360) / n)) * 47)];
  let d = `M${pt(0).join(",")}`;
  for (let i = 1; i <= n; i++) d += ` A8.5,8.5 0 0 1 ${pt(i).join(",")}`;
  return (
    <g>
      <circle r={50} fill="#000" opacity={0.18} transform="translate(2 3)" />
      <path d={d + "Z"} fill={col} />
      <circle r={40} fill={mix(col, "#000", 0.08)} />
      <circle r={40} fill="none" stroke="#000" strokeOpacity={0.08} strokeWidth={3} />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(i);
        return <line key={i} x1={R1(x * 0.86)} y1={R1(y * 0.86)} x2={x} y2={y} stroke="#000" strokeOpacity={0.06} />;
      })}
    </g>
  );
}

/** Nine sweets, each drawn from simple shapes and highlights. */
export const SWEETS: { name: string; draw: () => React.ReactNode }[] = [
  {
    name: "Kaju katli",
    draw: () => (
      <g>
        {[
          [-8, -6],
          [8, 8],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0,-22 L26,0 L0,22 L-26,0Z" fill="#c9b79a" transform="translate(1.5 2)" />
            <path d="M0,-22 L26,0 L0,22 L-26,0Z" fill="#ece2cf" />
            <path className="mb-varq" d="M0,-22 L26,0 L0,22 L-26,0Z" fill="url(#mb-varq)" />
          </g>
        ))}
      </g>
    ),
  },
  {
    name: "Motichoor laddoo",
    draw: () => {
      const r = rng(9);
      return (
        <g>
          <circle r={28} fill="#f39c12" />
          {Array.from({ length: 70 }, (_, i) => {
            const a = r() * Math.PI * 2;
            const d = Math.sqrt(r()) * 26;
            return <circle key={i} cx={R1(cos(a) * d)} cy={R1(sin(a) * d)} r={1.6} fill={r() > 0.5 ? "#ffb347" : "#d9790a"} />;
          })}
          <ellipse cx={-9} cy={-10} rx={9} ry={6} fill="#fff" opacity={0.25} />
        </g>
      );
    },
  },
  {
    name: "Jalebi",
    draw: () => {
      let d = "M0,0";
      for (let a = 0; a < Math.PI * 5; a += 0.3) d += ` L${R1(cos(a) * a * 2.2)},${R1(sin(a) * a * 2.2)}`;
      return (
        <g>
          <path d={d} fill="none" stroke="#c45f0a" strokeWidth={8} strokeLinecap="round" transform="translate(1 2)" />
          <path d={d} fill="none" stroke="#f0861a" strokeWidth={7} strokeLinecap="round" />
          <path d={d} fill="none" stroke="#ffd08a" strokeWidth={2} strokeLinecap="round" opacity={0.7} transform="translate(-1 -1.5)" />
        </g>
      );
    },
  },
  {
    name: "Gulab jamun",
    draw: () => (
      <g>
        <ellipse rx={36} ry={30} fill="#c97a1a" opacity={0.55} />
        {[
          [-12, 2],
          [13, -4],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={15} fill="#4a1e0c" />
            <circle r={15} fill="url(#mb-gloss)" />
          </g>
        ))}
      </g>
    ),
  },
  {
    name: "Pista barfi",
    draw: () => {
      const r = rng(4);
      return (
        <g>
          {[
            [-10, -8],
            [10, 10],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${i ? 8 : -6})`}>
              <rect x={-19} y={-19} width={38} height={38} rx={3} fill="#d9c6a5" transform="translate(1.5 2)" />
              <rect x={-19} y={-19} width={38} height={38} rx={3} fill="#f7ead6" />
              {Array.from({ length: 6 }, (_, k) => (
                <rect key={k} x={R1(-14 + r() * 24)} y={R1(-14 + r() * 24)} width={6} height={2.2} rx={1} fill="#7fb24a" transform={`rotate(${R1(r() * 180)})`} />
              ))}
            </g>
          ))}
        </g>
      );
    },
  },
  {
    name: "Soan papdi",
    draw: () => (
      <g>
        <rect x={-24} y={-22} width={48} height={44} rx={4} fill="#d9a441" transform="translate(2 2)" />
        <rect x={-24} y={-22} width={48} height={44} rx={4} fill="#f1cb6b" />
        {[-14, -6, 2, 10, 18].map((y) => (
          <path key={y} d={`M-22,${y - 4} q11,-3 22,0 t22,0`} fill="none" stroke="#c99a3a" strokeWidth={1.2} opacity={0.8} />
        ))}
        <circle cx={-6} cy={-14} r={2} fill="#7fb24a" />
        <circle cx={8} cy={-12} r={1.6} fill="#7fb24a" />
      </g>
    ),
  },
  {
    name: "Kesar peda",
    draw: () => (
      <g>
        {[
          [-12, -6],
          [12, 8],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse rx={17} ry={15} fill="#c98a3a" transform="translate(1.5 2)" />
            <ellipse rx={17} ry={15} fill="#e8b46a" />
            <ellipse rx={6} ry={5} fill="#c98a3a" opacity={0.7} />
            <path d="M-3,-2 l6,4 M2,-4 l-2,7" stroke="#d6451b" strokeWidth={1.2} />
          </g>
        ))}
      </g>
    ),
  },
  {
    name: "Rasgulla",
    draw: () => (
      <g>
        <ellipse rx={36} ry={30} fill="#f3ead2" opacity={0.6} />
        {[
          [-12, 3],
          [12, -3],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={15} fill="#fffaf0" />
            <circle r={15} fill="url(#mb-gloss)" opacity={0.6} />
            <circle r={15} fill="none" stroke="#e6dcc4" />
          </g>
        ))}
      </g>
    ),
  },
  {
    name: "Mysore pak",
    draw: () => {
      const r = rng(8);
      return (
        <g transform="rotate(-6)">
          <rect x={-24} y={-20} width={48} height={40} rx={4} fill="#c9901a" transform="translate(2 2)" />
          <rect x={-24} y={-20} width={48} height={40} rx={4} fill="#efb42e" />
          {Array.from({ length: 26 }, (_, k) => (
            <circle key={k} cx={R1(-20 + r() * 40)} cy={R1(-16 + r() * 32)} r={R1(0.8 + r() * 1.4)} fill="#c9901a" opacity={0.8} />
          ))}
        </g>
      );
    },
  },
];

/** Brocade printed on the lid: a jaali of paisleys. */
function Brocade({ id, col }: { id: string; col: string }) {
  return (
    <pattern id={id} width={36} height={36} patternUnits="userSpaceOnUse">
      <path d="M18,4 C26,10 26,18 18,22 C12,18 12,10 18,4Z M0,22 C6,26 6,32 0,36 M36,22 C30,26 30,32 36,36" fill="none" stroke={col} strokeWidth={1} opacity={0.22} />
      <circle cx={18} cy={30} r={1.6} fill={col} opacity={0.3} />
      <circle cx={0} cy={6} r={1.2} fill={col} opacity={0.6} />
      <circle cx={36} cy={6} r={1.2} fill={col} opacity={0.6} />
    </pattern>
  );
}

/** The printed lid face: brocade, a gold frame, the greeting and the sender. */
export function LidFace({ d, p, w = 420, h = 210 }: { d: InviteData; p: Palette; w?: number; h?: number }) {
  const fill = foilFill(p);
  return (
    <div className="mb-lid-face" style={{ width: w, height: h }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="mb-lid-art">
        <defs>
          <Brocade id="mb-brocade" col={p.accent2} />
        </defs>
        <rect width={w} height={h} rx={8} fill={p.envelope2} />
        <rect width={w} height={h} rx={8} fill="url(#mb-brocade)" />
        <rect x={12} y={12} width={w - 24} height={h - 24} rx={5} fill="none" stroke={fill} strokeWidth={2.4} filter="url(#f-foil)" />
        <rect x={18} y={18} width={w - 36} height={h - 36} rx={3} fill="none" stroke={fill} strokeWidth={0.8} filter="url(#f-foil)" />
      </svg>
      <div className="mb-lid-text">
        {d.mantra && <span className="mb-lid-mantra">{d.mantra}</span>}
        <b className="mb-lid-title foil-text">{d.eyebrow}</b>
        <span className="mb-lid-from">{fromText(d)} {d.primary.name}</span>
      </div>
    </div>
  );
}

function BoxDefs() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <linearGradient id="mb-varq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#dfe4ea" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="mb-gloss" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const CELL = 124;
const BOX = { x: 40, y: 262, w: 420, h: 420 };

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [eaten, setEaten] = useState<number[]>([]);
  const left = SWEETS.length - eaten.length;
  const cups = [p.accent2, "#fff4e0", p.wax, "#fff4e0", p.accent2, "#fff4e0", p.wax, "#fff4e0", p.accent2];
  return (
    <div className="page-content cover wd-cover">
      <BoxDefs />
      <div className="mb-table" />
      <div className="mb-lid-wrap">
        <LidFace d={d} p={p} />
      </div>
      <div className="mb-box" style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, background: p.envelope2 }}>
        <div className="mb-tissue" />
        <svg className="mb-grid" viewBox={`0 0 ${CELL * 3} ${CELL * 3}`} width={CELL * 3} height={CELL * 3}>
          {SWEETS.map((s, i) => {
            const cx = (i % 3) * CELL + CELL / 2;
            const cy = Math.floor(i / 3) * CELL + CELL / 2;
            const gone = eaten.includes(i);
            return (
              <g key={s.name} transform={`translate(${cx} ${cy})`}>
                <Cup col={cups[i]} />
                <g className={`mb-sweet ${gone ? "gone" : ""}`}>{s.draw()}</g>
                {gone && (
                  <g className="mb-crumbs">
                    {[
                      [-8, 4],
                      [6, -6],
                      [10, 8],
                      [-4, -10],
                    ].map(([x, y], k) => (
                      <circle key={k} cx={x} cy={y} r={1.6} fill="#c9a46a" />
                    ))}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {d.blessingLine && <p className="mb-wish">{d.blessingLine}</p>}
      {env.guest && <div className="mb-guest">For {env.guest}</div>}
      {env.mode === "live" && (
        <>
          {SWEETS.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className="mb-hit"
              data-no-flip
              aria-label={`Have a ${s.name}`}
              style={{ left: BOX.x + 24 + (i % 3) * CELL, top: BOX.y + 24 + Math.floor(i / 3) * CELL, width: CELL, height: CELL }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setEaten((xs) => (xs.includes(i) ? xs : [...xs, i]));
              }}
            />
          ))}
          <div className="mb-hint">{left === SWEETS.length ? "Tap a sweet to have one" : left > 0 ? `${SWEETS[eaten[eaten.length - 1]].name}! ${left} left: save some for others 😄` : "You ate them all! Happy Diwali 😄"}</div>
        </>
      )}
    </div>
  );
}

export const mithai: WedDesign = {
  Frame: ({ p, kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="mb-table" />
        <div className="mb-paper" style={{ background: p.paper }} />
        <svg className="mb-corner" viewBox="-60 -60 120 120" width={110} height={110}>
          <BoxDefsInline />
          <Cup col={p.accent2} />
          {SWEETS[kind.length % SWEETS.length].draw()}
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="mb-table" />
    </div>
  ),
};

function BoxDefsInline() {
  return (
    <defs>
      <linearGradient id="mbi-varq" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
      </linearGradient>
    </defs>
  );
}

/* ---------------- intro: untie the ribbon, the lid swings open ---------------- */

export const unbox: IntroDef = {
  end: 2.6,
  burst: 2.0,
  hint: { x: 300, y: 560 },
  Over: ({ p, data }) => (
    <div className="in-part ub-wrap">
      <div className="ub-lid">
        <div className="ub-lid-top" style={{ background: p.envelope2 }}>
          <LidFace d={data} p={p} w={420} h={430} />
          <div className="ub-ribbon h" style={{ background: p.accent }} />
          <div className="ub-ribbon v" style={{ background: p.accent }} />
          <svg className="ub-bow" viewBox="-60 -30 120 60">
            <path d="M0,0 C-20,-28 -58,-24 -52,0 C-58,24 -20,28 0,0Z M0,0 C20,-28 58,-24 52,0 C58,24 20,28 0,0Z" fill={p.accent} />
            <rect x={-8} y={-9} width={16} height={18} rx={4} fill={p.accent} stroke="rgba(0,0,0,.2)" />
          </svg>
        </div>
      </div>
    </div>
  ),
  build: (q) => {
    gsap.set(q(".mb-sweet"), { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(q(".mb-lid-wrap"), { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".ub-bow"), { scale: 0, rotate: 40, opacity: 0, duration: 0.4, ease: "back.in(2)" }, 0)
      .to(q(".ub-ribbon.h"), { scaleX: 0, duration: 0.45 }, 0.2)
      .to(q(".ub-ribbon.v"), { scaleY: 0, duration: 0.45 }, 0.2)
      .to(q(".ub-lid"), { rotateX: 112, duration: 1.0, ease: "power2.inOut" }, 0.6)
      .to(q(".ub-lid"), { opacity: 0, duration: 0.3 }, 1.4)
      .to(q(".mb-lid-wrap"), { opacity: 1, duration: 0.4 }, 1.35)
      .to(q(".mb-sweet"), { scale: 1, duration: 0.45, stagger: 0.07, ease: "back.out(2.2)" }, 1.3)
      .set(q(".mb-sweet"), { clearProps: "transform" }, 2.55);
    return tl;
  },
};
