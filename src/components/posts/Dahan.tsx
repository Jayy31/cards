"use client";

import { useId } from "react";
import { POST_W, type PostBrand, type PostRatio, type PostText } from "@/lib/posts";
import { Brand, Fit, Offer, Squeeze, r2, seeded, splitHeading } from "./common";

/*
 * Dussehra · "Dahan": the Ramlila ground at dusk. A ten-headed Ravan effigy of coloured paper on a
 * bamboo frame stands on the right; the fire has just caught at its feet and embers rise into the sky.
 * Structure: SPLIT. Greeting and a stacked brand card share a left column; the effigy owns the right.
 * Recomposition: the effigy is scaled to the shape's height; the crowd and ground stay at the bottom
 * (in the story they sit in the covered bottom zone).
 */

type Geo = { h: number; ground: number; effS: number; effX: number; textTop: number; textBottom: number; brandTop: number; brandBottom: number };
const GEO: Record<PostRatio, Geo> = {
  "1x1": { h: 1080, ground: 1000, effS: 0.9, effX: 815, textTop: 56, textBottom: 452, brandTop: 494, brandBottom: 1046 },
  "4x5": { h: 1350, ground: 1260, effS: 0.98, effX: 842, textTop: 70, textBottom: 600, brandTop: 650, brandBottom: 1300 },
  "9x16": { h: 1920, ground: 1690, effS: 1.02, effX: 840, textTop: 270, textBottom: 880, brandTop: 960, brandBottom: 1572 },
};

/* effigy in local units: x centred, y = 0 at crown top, 1000 at the feet */
const HEAD_COL = ["#f2d7b6", "#e9c9a2", "#f2d7b6", "#e3bf98", "#ecd0ae"];

function Head({ x, y, s, main, id }: { x: number; y: number; s: number; main?: boolean; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* crown: gold paper with coloured foil stones */}
      <path d="M-62 -6 L-58 -70 L-36 -46 L-18 -96 L0 -60 L18 -96 L36 -46 L58 -70 L62 -6 Z" fill={`url(#${id}-gold)`} stroke="#7a4a08" strokeWidth="2" />
      <path d="M-62 -6 L62 -6 L60 8 L-60 8 Z" fill="#b8172a" />
      {[-40, -14, 14, 40].map((cx, i) => (
        <circle key={cx} cx={cx} cy={1} r="5" fill={i % 2 ? "#1f7a3e" : "#1d4fa0"} stroke="#ffe08a" strokeWidth="1.5" />
      ))}
      <circle cx="0" cy="-40" r="9" fill="#b8172a" stroke="#ffe08a" strokeWidth="2" />
      {/* face */}
      <path d="M-56 8 C-60 60 -44 120 0 132 C44 120 60 60 56 8 Z" fill={HEAD_COL[Math.abs(Math.round(x)) % 5]} />
      <path d="M-56 8 C-60 60 -44 120 0 132 C44 120 60 60 56 8 Z" fill={`url(#${id}-faceShade)`} />
      {/* angry brows, big eyes, tilak */}
      <path d="M-44 36 Q-24 20 -6 34" stroke="#1a0d06" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M44 36 Q24 20 6 34" stroke="#1a0d06" strokeWidth="6" fill="none" strokeLinecap="round" />
      {[-24, 24].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy="50" rx="13" ry="9" fill="#fff" stroke="#1a0d06" strokeWidth="2.5" />
          <circle cx={ex + (ex < 0 ? 2 : -2)} cy="51" r="5.5" fill="#1a0d06" />
          <circle cx={ex + (ex < 0 ? 0 : -4)} cy="49" r="1.6" fill="#fff" />
        </g>
      ))}
      <path d="M-5 14 L0 40 L5 14 Z" fill="#c8171f" />
      <path d="M-4 58 Q0 78 4 58" stroke="#8a4a2a" strokeWidth="2.5" fill="none" />
      {/* the mustache */}
      <path d="M0 84 C-18 76 -36 78 -50 90 C-40 86 -30 90 -20 94 C-12 92 -4 90 0 92 C4 90 12 92 20 94 C30 90 40 86 50 90 C36 78 18 76 0 84 Z" fill="#140a05" />
      <path d="M-14 104 Q0 112 14 104" stroke="#9e1418" strokeWidth="5" fill="none" strokeLinecap="round" />
      {main && <path d="M-50 92 q-12 2 -16 -10 M50 92 q12 2 16 -10" stroke="#140a05" strokeWidth="5" fill="none" strokeLinecap="round" />}
      {/* earrings */}
      <circle cx="-58" cy="70" r="8" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="4" />
      <circle cx="58" cy="70" r="8" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="4" />
    </g>
  );
}

function Effigy({ id }: { id: string }) {
  const side = [1, 2, 3, 4];
  return (
    <g>
      {/* bamboo frame + guy ropes */}
      <g stroke="#c9a46a" strokeWidth="9" strokeLinecap="round">
        <line x1="-70" y1="860" x2="-80" y2="1000" />
        <line x1="70" y1="860" x2="80" y2="1000" />
        <line x1="-80" y1="940" x2="80" y2="940" strokeWidth="6" />
      </g>
      <g stroke="#3a2a1a" strokeWidth="2" opacity=".55">
        <line x1="-150" y1="560" x2="-420" y2="1000" />
        <line x1="150" y1="560" x2="420" y2="1000" />
      </g>
      {/* skirt: pleated coloured paper */}
      <path d="M-150 640 L150 640 L210 880 L-210 880 Z" fill="#c8171f" />
      {Array.from({ length: 12 }, (_, i) => {
        const x0 = -150 + i * 25;
        const x1 = -210 + i * 35;
        return <path key={i} d={`M${x0} 640 L${x0 + 12} 640 L${x1 + 17} 880 L${x1} 880 Z`} fill={i % 3 === 0 ? "#f2b705" : i % 3 === 1 ? "#1f7a3e" : "#e8551e"} opacity=".9" />;
      })}
      <path d="M-210 870 L210 870 L210 884 L-210 884 Z" fill={`url(#${id}-gold)`} />
      {/* torso: armour of paper strips */}
      <path d="M-120 330 L120 330 L150 650 L-150 650 Z" fill="#1d4fa0" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${-120 + i * 30} 330 L${-108 + i * 30} 330 L${-138 + i * 37 + 12} 650 L${-150 + i * 37} 650 Z`} fill={i % 2 ? "#e8551e" : "#7a1fa0"} opacity=".55" />
      ))}
      <circle cx="0" cy="460" r="62" fill={`url(#${id}-gold)`} stroke="#7a4a08" strokeWidth="3" />
      <circle cx="0" cy="460" r="40" fill="#b8172a" />
      <circle cx="0" cy="460" r="18" fill={`url(#${id}-gold)`} />
      <path d="M-126 380 L126 380" stroke={`url(#${id}-gold)`} strokeWidth="10" />
      <path d="M-146 620 L146 620" stroke={`url(#${id}-gold)`} strokeWidth="12" />
      {/* arms: sword raised on the right, shield on the left */}
      <path d="M120 340 C170 360 190 420 200 470 L172 478 C160 430 146 400 116 392 Z" fill="#e3bf98" />
      <path d="M-120 340 C-170 360 -186 430 -190 500 L-162 504 C-158 440 -146 404 -116 392 Z" fill="#e3bf98" />
      <circle cx="-178" cy="520" r="64" fill={`url(#${id}-gold)`} stroke="#7a4a08" strokeWidth="4" />
      <circle cx="-178" cy="520" r="44" fill="#1f7a3e" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx="-178" cy="496" r="6" fill={`url(#${id}-gold)`} transform={`rotate(${a} -178 520)`} />
      ))}
      <g transform="translate(188 476) rotate(-14)">
        <rect x="-6" y="-300" width="12" height="300" fill="#dfe6ec" stroke="#6f7f8e" strokeWidth="2" />
        <path d="M-6 -300 L0 -330 L6 -300 Z" fill="#dfe6ec" />
        <rect x="-26" y="-6" width="52" height="12" fill={`url(#${id}-gold)`} />
        <rect x="-7" y="6" width="14" height="40" fill="#5a2a0c" />
      </g>
      {/* necklace collar */}
      <path d="M-110 330 Q0 400 110 330" stroke={`url(#${id}-gold)`} strokeWidth="14" fill="none" />
      <path d="M-90 340 Q0 420 90 340" stroke="#b8172a" strokeWidth="6" fill="none" strokeDasharray="10 6" />
      {/* ten heads: four each side behind, the main one in front */}
      {side.map((k) => (
        <g key={k}>
          <Head x={-k * 66} y={196 + k * 12} s={0.8 - k * 0.04} id={id} />
          <Head x={k * 66} y={196 + k * 12} s={0.8 - k * 0.04} id={id} />
        </g>
      )).reverse()}
      <Head x={0} y={190} s={1.06} main id={id} />
    </g>
  );
}

export function Dahan({ ratio, b, t }: { ratio: PostRatio; b: PostBrand; t: PostText }) {
  const id = "dh" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = GEO[ratio];
  const { h, ground, effS, effX } = g;
  const effTop = ground - 1000 * effS;
  const rnd = seeded(h + 5);
  const embers = Array.from({ length: 70 }, () => ({
    x: r2(effX + (rnd() - 0.5) * 520),
    y: r2(ground - 80 - rnd() * (ground - effTop) * 0.95),
    r: r2(1.4 + rnd() * 3.2),
    o: r2(0.4 + rnd() * 0.6),
  }));
  const crowd = [0, 1, 2].flatMap((row) =>
    Array.from({ length: 34 }, (_, i) => ({ x: r2(i * 33 + (row % 2) * 16 + rnd() * 14 - 7), y: r2(ground + 30 + row * 26 + rnd() * 10), s: r2(1 + row * 0.22 + rnd() * 0.25), row })),
  );
  const [lead, word] = splitHeading(t.heading);

  return (
    <div className={`pc pc-dahan r-${ratio}`} style={{ height: h }}>
      <svg className="pc-art" width={POST_W} height={h} viewBox={`0 0 ${POST_W} ${h}`} aria-hidden>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b1238" />
            <stop offset=".38" stopColor="#4a1f4f" />
            <stop offset=".66" stopColor="#a8364a" />
            <stop offset=".86" stopColor="#ec7a32" />
            <stop offset="1" stopColor="#ffbf5a" />
          </linearGradient>
          <radialGradient id={`${id}-sun`} cx={effX} cy={ground - 40} r={700} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffd27a" stopOpacity=".9" />
            <stop offset=".35" stopColor="#ff8a3a" stopOpacity=".35" />
            <stop offset="1" stopColor="#ff8a3a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0a8" />
            <stop offset=".4" stopColor="#e2a92a" />
            <stop offset=".7" stopColor="#b77a10" />
            <stop offset="1" stopColor="#ffd86a" />
          </linearGradient>
          <linearGradient id={`${id}-faceShade`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff9a4a" stopOpacity=".28" />
            <stop offset=".5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#2a0c18" stopOpacity=".35" />
          </linearGradient>
          <linearGradient id={`${id}-fire`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fff3b0" />
            <stop offset=".3" stopColor="#ffb02a" />
            <stop offset=".7" stopColor="#e2470f" />
            <stop offset="1" stopColor="#8a1a08" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-paper`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="3" seed="3" result="n" />
            <feDiffuseLighting in="n" surfaceScale="5" lightingColor="#fff" result="l">
              <feDistantLight azimuth="200" elevation="50" />
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.15" k2="0" k3="0" k4="0" result="m" />
            <feComposite in="m" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={`${id}-cloud`} x="-20%" y="-50%" width="140%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="4" seed="9" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .62  0 0 0 0 .5  0 0 0 1.8 -.95" />
          </filter>
          <filter id={`${id}-smoke`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="80" />
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id={`${id}-flick`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.035 0.07" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="40" />
          </filter>
          <filter id={`${id}-glowF`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".35" stopColor="#fff" stopOpacity="1" />
            <stop offset=".75" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-cloudMask`} maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill={`url(#${id}-fade)`} />
          </mask>
          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <clipPath id={`${id}-effclip`}>
            <rect x="-460" y="0" width="920" height="900" />
          </clipPath>
        </defs>

        <rect width={POST_W} height={h} fill={`url(#${id}-sky)`} />
        <rect width={POST_W} height={h} fill={`url(#${id}-sun)`} />
        {/* streaks of evening cloud */}
        <g mask={`url(#${id}-cloudMask)`}>
          <rect x="0" y={ground * 0.38} width={POST_W} height={ground * 0.5} filter={`url(#${id}-cloud)`} opacity=".45" />
        </g>
        {/* first stars */}
        {Array.from({ length: 26 }, (_, i) => {
          const x = r2(rnd() * POST_W);
          const y = r2(rnd() * ground * 0.32);
          return <circle key={i} cx={x} cy={y} r={r2(0.8 + rnd() * 1.4)} fill="#fff" opacity={r2(0.4 + rnd() * 0.5)} />;
        })}

        {/* smoke behind the effigy */}
        <ellipse cx={effX - 40} cy={effTop + 380 * effS} rx={260 * effS} ry={460 * effS} fill="#2a1a24" opacity=".35" filter={`url(#${id}-glowF)`} />

        {/* the effigy */}
        <g transform={`translate(${effX} ${effTop}) scale(${effS})`}>
          <g filter={`url(#${id}-paper)`}>
            <Effigy id={id} />
          </g>
          {/* fire at the feet */}
          <path d="M-280 1000 C-250 900 -160 780 0 700 C160 780 250 900 280 1000 Z" fill="#ff7a1a" opacity=".75" filter={`url(#${id}-glowF)`} />
          <g filter={`url(#${id}-flick)`}>
            <path d="M-260 1000 C-240 900 -200 860 -170 760 C-150 820 -120 840 -100 700 C-80 780 -40 790 -20 640 C10 760 40 760 60 680 C90 790 120 800 150 730 C170 820 210 880 260 1000 Z" fill={`url(#${id}-fire)`} />
            <path d="M-160 1000 C-140 930 -110 900 -90 840 C-70 880 -40 880 -20 800 C10 880 40 880 70 820 C90 900 120 930 160 1000 Z" fill="#fff0a0" opacity=".85" />
          </g>
          <ellipse cx="0" cy="920" rx="460" ry="240" fill="#ff9a3a" opacity=".4" filter={`url(#${id}-glowF)`} style={{ mixBlendMode: "screen" }} />
        </g>
        {/* embers */}
        <g style={{ mixBlendMode: "screen" }}>
          {embers.map((e, i) => (
            <circle key={i} cx={e.x} cy={e.y} r={e.r} fill="#ffcf5a" opacity={e.o} />
          ))}
        </g>

        {/* ground + crowd silhouettes */}
        <rect x="0" y={ground} width={POST_W} height={h - ground} fill="#1a0e10" />
        <rect x="0" y={ground} width={POST_W} height={h - ground} fill={`url(#${id}-sun)`} opacity=".25" />
        <g fill="#120a0c">
          {crowd.map((c, i) => (
            <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`} fill={c.row === 0 ? "#2a1418" : c.row === 1 ? "#1c0e12" : "#120a0c"}>
              <ellipse cx="0" cy="-30" rx="10" ry="12" />
              <path d="M-24 40 C-24 0 -16 -14 0 -16 C16 -14 24 0 24 40 Z" />
            </g>
          ))}
          {[effX - 160, effX + 210, 120].map((x) => (
            <g key={x} transform={`translate(${x} ${ground + 10})`}>
              <path d="M8 -20 L24 -70" stroke="#120a0c" strokeWidth="9" strokeLinecap="round" />
              <rect x="16" y="-96" width="18" height="30" rx="3" fill="#cfe3ff" opacity=".85" transform="rotate(14 25 -81)" />
            </g>
          ))}
        </g>
        <rect x="0" y={ground - 30} width={POST_W} height="60" fill="#ff9a3a" opacity=".18" filter={`url(#${id}-blur)`} />
      </svg>

      <Squeeze className="dh-text" style={{ top: g.textTop, height: g.textBottom - g.textTop }} deps={[t.heading, t.wish, t.message, ratio]}>
        {lead && <Fit className="dh-lead" text={lead} max={ratio === "9x16" ? 50 : 44} min={26} />}
        <Fit as="h1" className="dh-word" text={word} max={ratio === "1x1" ? 112 : ratio === "4x5" ? 124 : 140} min={54} />
        <span className="dh-rule" />
        {t.wish && <Fit as="p" className="dh-wish" text={t.wish} max={ratio === "9x16" ? 38 : 32} min={22} />}
        {t.message && <Fit as="p" className="dh-msg" text={t.message} max={ratio === "9x16" ? 30 : 26} min={19} />}
      </Squeeze>

      <div className="dh-card" style={{ top: g.brandTop, height: g.brandBottom - g.brandTop }}>
        <Offer text={b.offer} className="dh-offer" />
        <Brand b={b} className="dh-brand is-stack" />
      </div>
    </div>
  );
}
