"use client";

import { useId } from "react";
import { POST_W, type PostBrand, type PostRatio, type PostText } from "@/lib/posts";
import { Fit, FitName, Icon, Squeeze, r2, seeded, type IconName } from "./common";

/*
 * Bestu Varas · "Paatiyu": a sign-painter's enamel signboard (paatiyu) hanging by two chains from an
 * iron rod on a lime-washed wall, freshly repainted for the New Year. Chrome-yellow ground, green and
 * red border, painted corner flowers, "શ્રી" at the top, bolts, a little rust at the edges.
 * Structure: BUSINESS-FIRST. The business name is the sign itself; the New Year greeting
 * (Gujarati + English) and the numbers are painted underneath it.
 * Recomposition: the board stretches to the shape; in the story the chains hang through the top
 * covered zone and painted content stops above the bottom one.
 */

type Geo = { h: number; top: number; bottom: number; contentBottom: number };
const GEO: Record<PostRatio, Geo> = {
  "1x1": { h: 1080, top: 108, bottom: 1052, contentBottom: 1000 },
  "4x5": { h: 1350, top: 116, bottom: 1318, contentBottom: 1262 },
  "9x16": { h: 1920, top: 300, bottom: 1866, contentBottom: 1572 },
};
const BX = 44;
const BW = POST_W - 2 * BX;

function Chain({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const n = Math.max(2, Math.floor((y2 - y1) / 22));
  const step = (y2 - y1) / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={r2(y1 + step * (i + 0.5))}
          rx={i % 2 ? 3 : 8}
          ry={r2(step * 0.62)}
          fill="none"
          stroke={i % 2 ? "#3b3b3b" : "#555"}
          strokeWidth="4"
        />
      ))}
    </g>
  );
}

function Flower({ x, y, s, rot }: { x: number; y: number; s: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {[-50, 50].map((a) => (
        <path key={a} d="M0 0 C10 -14 30 -16 42 -4 C30 4 12 6 0 0Z" fill="#1f7a3e" transform={`rotate(${a + 180})`} />
      ))}
      {Array.from({ length: 6 }, (_, k) => (
        <ellipse key={k} cx="0" cy="-13" rx="8" ry="13" fill="#d81f26" stroke="#8a0a10" strokeWidth="1.2" transform={`rotate(${k * 60})`} />
      ))}
      <circle r="7" fill="#1b3f8f" />
      <circle r="3" fill="#fff" />
    </g>
  );
}

export function Paatiyu({ ratio, b, t }: { ratio: PostRatio; b: PostBrand; t: PostText }) {
  const id = "pt" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = GEO[ratio];
  const { h, top, bottom } = g;
  const bh = bottom - top;
  const rnd = seeded(h + 11);
  const scratches = Array.from({ length: 18 }, () => ({ x: r2(BX + 40 + rnd() * (BW - 80)), y: r2(top + 40 + rnd() * (bh - 80)), l: r2(10 + rnd() * 40), a: Math.round(rnd() * 180) }));
  const k = ratio === "1x1" ? 1 : ratio === "4x5" ? 1.2 : 1.45;
  const phones = (b.phones ?? []).filter(Boolean);
  const foot: [IconName, string][] = [];
  if (b.address) foot.push(["pin", b.address]);
  if (b.social) foot.push(["insta", b.social]);
  if (b.website) foot.push(["web", b.website]);
  const strip = [b.owner, b.services].filter(Boolean).join("  ✦  ");
  const hookY = top + 30;

  return (
    <div className={`pc pc-paatiyu r-${ratio}`} style={{ height: h }}>
      <svg className="pc-art" width={POST_W} height={h} viewBox={`0 0 ${POST_W} ${h}`} aria-hidden>
        <defs>
          <filter id={`${id}-lime`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="4" seed="8" result="big" />
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="fine" />
            <feColorMatrix in="big" type="matrix" values="0 0 0 0 .62  0 0 0 0 .56  0 0 0 0 .45  0 0 0 1.2 -.5" result="b" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 .3  0 0 0 0 .26  0 0 0 0 .2  0 0 0 .8 -.3" result="f" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="f" />
            </feMerge>
          </filter>
          <pattern id={`${id}-brick`} width="120" height="48" patternUnits="userSpaceOnUse">
            <rect width="120" height="48" fill="#cfc6b4" />
            <rect x="2" y="2" width="56" height="20" fill="#a9553a" />
            <rect x="62" y="2" width="56" height="20" fill="#b45f40" />
            <rect x="-28" y="26" width="56" height="20" fill="#9c4b33" />
            <rect x="32" y="26" width="56" height="20" fill="#b0583a" />
            <rect x="92" y="26" width="56" height="20" fill="#a3513a" />
          </pattern>
          {/* plaster has fallen off in patches, showing brick */}
          <filter id={`${id}-peel`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="4" seed="17" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  9 0 0 0 -5.4" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
          <filter id={`${id}-sh`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id={`${id}-rust`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="5" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 .55  0 0 0 0 .25  0 0 0 0 .08  5 0 0 0 -3.1" />
          </filter>
          <filter id={`${id}-enamel`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.3" numOctaves="2" seed="4" />
            <feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .35  0 0 0 0 0  0 0 0 .35 -.1" />
          </filter>
          <linearGradient id={`${id}-yellow`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd534" />
            <stop offset=".5" stopColor="#f7c21b" />
            <stop offset="1" stopColor="#e8a90c" />
          </linearGradient>
          <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset=".25" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-bolt`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#e6e6e6" />
            <stop offset=".5" stopColor="#8a8a8a" />
            <stop offset="1" stopColor="#3a3a3a" />
          </radialGradient>
          <linearGradient id={`${id}-rod`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6a6a6a" />
            <stop offset=".4" stopColor="#2c2c2c" />
            <stop offset="1" stopColor="#111" />
          </linearGradient>
          <mask id={`${id}-edge`} maskUnits="userSpaceOnUse" x="0" y="0" width={POST_W} height={h}>
            <rect x={BX} y={top} width={BW} height={bh} fill="none" stroke="#fff" strokeWidth="40" filter={`url(#${id}-sh)`} />
          </mask>
          <clipPath id={`${id}-board`}>
            <rect x={BX} y={top} width={BW} height={bh} rx="10" />
          </clipPath>
          <linearGradient id={`${id}-wallLight`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6dc" stopOpacity=".3" />
            <stop offset="1" stopColor="#5a4020" stopOpacity=".25" />
          </linearGradient>
        </defs>

        {/* wall */}
        <rect width={POST_W} height={h} fill="#ece4d2" />
        <rect width={POST_W} height={h} fill={`url(#${id}-brick)`} filter={`url(#${id}-peel)`} />
        <rect width={POST_W} height={h} filter={`url(#${id}-lime)`} opacity=".5" />
        <rect width={POST_W} height={h} fill={`url(#${id}-wallLight)`} />

        {/* iron rod with wall brackets, chains to the board */}
        <rect x="0" y={top - (ratio === "9x16" ? 240 : 78)} width={POST_W} height="14" fill="#000" opacity=".25" filter={`url(#${id}-sh)`} transform="translate(0 10)" />
        <rect x="0" y={top - (ratio === "9x16" ? 240 : 78)} width={POST_W} height="14" rx="7" fill={`url(#${id}-rod)`} />
        {[90, POST_W - 90].map((x) => (
          <g key={x}>
            <Chain x={x} y1={top - (ratio === "9x16" ? 234 : 72)} y2={hookY} />
          </g>
        ))}

        {/* board */}
        <rect x={BX + 6} y={top + 18} width={BW} height={bh} rx="10" fill="#000" opacity=".45" filter={`url(#${id}-sh)`} />
        <g clipPath={`url(#${id}-board)`}>
          <rect x={BX} y={top} width={BW} height={bh} fill={`url(#${id}-yellow)`} />
          <rect x={BX} y={top} width={BW} height={bh} filter={`url(#${id}-enamel)`} />
          {/* painted borders */}
          <rect x={BX + 9} y={top + 9} width={BW - 18} height={bh - 18} rx="6" fill="none" stroke="#14773a" strokeWidth="16" />
          <rect x={BX + 25} y={top + 25} width={BW - 50} height={bh - 50} rx="4" fill="none" stroke="#d81f26" strokeWidth="6" />
          <rect x={BX + 34} y={top + 34} width={BW - 68} height={bh - 68} rx="3" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
          {/* corner flowers */}
          <Flower x={BX + 62} y={top + 62} s={1} rot={-45} />
          <Flower x={BX + BW - 62} y={top + 62} s={1} rot={45} />
          <Flower x={BX + 62} y={bottom - 62} s={1} rot={-135} />
          <Flower x={BX + BW - 62} y={bottom - 62} s={1} rot={135} />
          {/* rust creeping in from the edges, scratches, enamel gloss */}
          <rect x={BX} y={top} width={BW} height={bh} filter={`url(#${id}-rust)`} opacity=".8" mask={`url(#${id}-edge)`} />
          {scratches.map((s, i) => (
            <line key={i} x1={s.x} y1={s.y} x2={r2(s.x + Math.cos(s.a) * s.l)} y2={r2(s.y + Math.sin(s.a) * s.l)} stroke="#fff6c8" strokeWidth="1.2" opacity=".55" />
          ))}
          <rect x={BX} y={top} width={BW} height={bh} fill={`url(#${id}-gloss)`} />
        </g>
        {/* hooks + bolts */}
        {[90, POST_W - 90].map((x) => (
          <g key={x}>
            <path d={`M${x} ${hookY - 8} q0 -14 0 -2`} stroke="#3b3b3b" strokeWidth="5" fill="none" />
            <circle cx={x} cy={hookY} r="11" fill={`url(#${id}-bolt)`} />
            <path d={`M${x - 6} ${hookY} h12`} stroke="#222" strokeWidth="2" />
          </g>
        ))}
        {[
          [BX + 18, bottom - 18],
          [BX + BW - 18, bottom - 18],
        ].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="8" fill={`url(#${id}-bolt)`} />
            <path d={`M${x - 5} ${y} h10`} stroke="#222" strokeWidth="1.6" />
          </g>
        ))}
      </svg>

      {/* the painted lettering */}
      <Squeeze className="pt-paint" style={{ top: top + 50, height: g.contentBottom - top - 50 }} deps={[JSON.stringify(b), t.local, t.heading, t.wish, t.message, ratio]}>
        <span className="pt-shree">શ્રી</span>
        <div className="pt-name">
          {b.logo && (
            <span className="pt-logo">
              <img src={b.logo} alt="" />
            </span>
          )}
          <FitName className="pt-biz" text={b.business} max={Math.round(92 * k)} min={40} />
        </div>
        {strip && <Fit className="pt-strip" text={strip} max={Math.round(26 * k)} min={17} />}
        <div className="pt-greet">
          {t.local && <Fit as="h1" className="pt-local" text={t.local} max={Math.round(70 * k)} min={34} />}
          <Fit className="pt-head" text={t.heading} max={Math.round(58 * k)} min={30} />
          {t.wish && <Fit as="p" className="pt-wish" text={t.wish} max={Math.round(28 * k)} min={19} />}
          {t.message && <Fit as="p" className="pt-msg" text={t.message} max={Math.round(24 * k)} min={17} />}
        </div>
        {b.offer && <Fit className="pt-offer" text={b.offer} max={Math.round(28 * k)} min={17} />}
        {phones.length > 0 && (
          <div className="pt-phones">
            <Icon name="phone" size={Math.round(34 * k)} />
            <Fit text={phones.join("  •  ")} max={Math.round(46 * k)} min={24} />
          </div>
        )}
        {foot.length > 0 && (
          <div className="pc-foot pt-foot">
            {foot.map(([ic, text]) => (
              <span key={ic}>
                <Icon name={ic} size={22} />
                <span>{text}</span>
              </span>
            ))}
          </div>
        )}
      </Squeeze>
    </div>
  );
}
