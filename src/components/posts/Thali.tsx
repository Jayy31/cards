"use client";

import { useId } from "react";
import { POST_W, type PostBrand, type PostRatio, type PostText } from "@/lib/posts";
import { Fit, FitName, Icon, Offer, Squeeze, initialOf, r2, seeded, splitHeading, type IconName } from "./common";

/*
 * Dhanteras · "Thali": seen from straight above. An embossed brass puja thali on peacock-green silk,
 * silver coins, a katori of kumkum, grains of rice and a few marigold petals around it.
 * Structure: CENTRED and SPLIT. Logo + business name head the post; the greeting is ENGRAVED into the
 * brass; numbers, address and links sit below the thali.
 * Recomposition: the thali takes the height it gets; in the story, coins spill into the covered zones.
 */

type Geo = { h: number; headTop: number; headH: number; cy: number; r: number; footTop: number; footBottom: number };
const GEO: Record<PostRatio, Geo> = {
  "1x1": { h: 1080, headTop: 36, headH: 150, cy: 494, r: 300, footTop: 820, footBottom: 1052 },
  "4x5": { h: 1350, headTop: 44, headH: 170, cy: 628, r: 380, footTop: 1040, footBottom: 1318 },
  "9x16": { h: 1920, headTop: 262, headH: 190, cy: 912, r: 440, footTop: 1380, footBottom: 1576 },
};

function Coin({ x, y, r, rot, id, gold }: { x: number; y: number; r: number; rot: number; id: string; gold?: boolean }) {
  const face = gold ? `url(#${id}-goldc)` : `url(#${id}-silver)`;
  const dark = gold ? "#7a4d0e" : "#5d6772";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} cy={r * 0.12} fill="#000" opacity=".45" filter={`url(#${id}-sh)`} />
      <circle r={r} fill={face} />
      <circle r={r * 0.86} fill="none" stroke={dark} strokeWidth={r * 0.05} opacity=".6" />
      {Array.from({ length: 28 }, (_, k) => (
        <circle key={k} cx="0" cy={-r * 0.93} r={r * 0.028} fill={dark} opacity=".55" transform={`rotate(${k * (360 / 28)})`} />
      ))}
      {/* embossed lotus */}
      <g opacity=".75">
        {[-60, -30, 0, 30, 60].map((a) => (
          <path key={a} d={`M0 ${r * 0.35} C${-r * 0.16} ${r * 0.05} ${-r * 0.1} ${-r * 0.3} 0 ${-r * 0.42} C${r * 0.1} ${-r * 0.3} ${r * 0.16} ${r * 0.05} 0 ${r * 0.35}Z`} fill="none" stroke={dark} strokeWidth={r * 0.045} transform={`rotate(${a} 0 ${r * 0.35})`} />
        ))}
        <path d={`M${-r * 0.5} ${r * 0.42} H${r * 0.5}`} stroke={dark} strokeWidth={r * 0.05} />
      </g>
      <circle r={r} fill={`url(#${id}-sheen)`} />
    </g>
  );
}

export function Thali({ ratio, b, t }: { ratio: PostRatio; b: PostBrand; t: PostText }) {
  const id = "th" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = GEO[ratio];
  const { h, cy, r } = g;
  const rnd = seeded(h * 3);
  const lobes = 36;
  const [lead, word] = splitHeading(t.heading);

  // coins: a few on the rim, the rest on the silk around the thali
  const coins: { x: number; y: number; r: number; rot: number; gold?: boolean }[] = [];
  const rimR = r * 0.9;
  [-36, -20, 28, 44, 150].forEach((a, i) => {
    const rad = (a * Math.PI) / 180;
    coins.push({ x: r2(540 + Math.cos(rad) * rimR), y: r2(cy + Math.sin(rad) * rimR), r: r * 0.085, rot: Math.round(rnd() * 360), gold: i === 1 });
  });
  const around: [number, number, number, boolean?][] =
    ratio === "1x1"
      ? [[110, cy - 150, 34], [62, cy + 30, 30], [975, cy + 150, 34, true], [1030, cy - 30, 28], [150, cy + 230, 26]]
      : [[110, cy - 220, 38], [70, cy - 40, 32], [150, cy + 300, 30, true], [970, cy + 210, 38], [1020, cy + 30, 30], [940, cy - 320, 28, true]];
  around.forEach(([x, y, cr, gold]) => coins.push({ x, y: r2(y), r: cr, rot: Math.round(rnd() * 360), gold }));
  if (ratio === "9x16") {
    [[170, 1740, 40], [300, 1820, 34, true], [820, 1760, 42], [940, 1860, 30], [560, 1880, 36], [120, 180, 34], [960, 140, 38, true]].forEach(([x, y, cr, gold]) =>
      coins.push({ x: x as number, y: y as number, r: cr as number, rot: Math.round(rnd() * 360), gold: !!gold }),
    );
  }
  const rice = Array.from({ length: 70 }, () => {
    const a = rnd() * Math.PI * 2;
    const d = r * (1.04 + rnd() * 0.35);
    return { x: r2(540 + Math.cos(a) * d), y: r2(cy + Math.sin(a) * d), a: Math.round(rnd() * 180) };
  });
  const petals = Array.from({ length: 26 }, () => {
    const a = rnd() * Math.PI * 2;
    const d = r * (1.02 + rnd() * 0.5);
    return { x: r2(540 + Math.cos(a) * d), y: r2(cy + Math.sin(a) * d), a: Math.round(rnd() * 360), c: rnd() > 0.5 ? "#f39a12" : "#e8670c", s: r2(0.8 + rnd() * 0.6) };
  });

  // keep loose rice and petals out from under the business name and the contacts
  const clear = (p: { y: number }) => p.y > g.headTop + g.headH + 10 && p.y < g.footTop - 50;
  const riceC = rice.filter(clear);
  const petalsC = petals.filter(clear);
  const phones = (b.phones ?? []).filter(Boolean);
  const foot: [IconName, string][] = [];
  if (b.address) foot.push(["pin", b.address]);
  if (b.social) foot.push(["insta", b.social]);
  if (b.website) foot.push(["web", b.website]);

  return (
    <div className={`pc pc-thali r-${ratio}`} style={{ height: h }}>
      <svg className="pc-art" width={POST_W} height={h} viewBox={`0 0 ${POST_W} ${h}`} aria-hidden>
        <defs>
          <radialGradient id={`${id}-silk`} cx="50%" cy={`${(cy / h) * 100}%`} r="80%">
            <stop offset="0" stopColor="#13715f" />
            <stop offset=".6" stopColor="#0b4f45" />
            <stop offset="1" stopColor="#05261f" />
          </radialGradient>
          {/* silk: fine weave + broad soft sheen across the folds */}
          <filter id={`${id}-sheenF`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.008" numOctaves="2" seed="21" result="n" />
            <feSpecularLighting in="n" surfaceScale="30" specularConstant=".9" specularExponent="14" lightingColor="#9fe8d0" result="s">
              <feDistantLight azimuth="225" elevation="40" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={`${id}-weave`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4 0.25" numOctaves="1" seed="3" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 -.18" />
          </filter>
          <pattern id={`${id}-buta`} width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M45 30 C52 38 52 50 45 58 C38 50 38 38 45 30Z M45 60 v6" fill="none" stroke="#d9b45a" strokeWidth="1.4" opacity=".35" />
            <circle cx="0" cy="0" r="2" fill="#d9b45a" opacity=".3" />
            <circle cx="90" cy="90" r="2" fill="#d9b45a" opacity=".3" />
          </pattern>
          <filter id={`${id}-sh`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={`${id}-hammer`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="13" result="n" />
            <feDiffuseLighting in="n" surfaceScale="2.4" lightingColor="#fff">
              <feDistantLight azimuth="225" elevation="55" />
            </feDiffuseLighting>
          </filter>
          <radialGradient id={`${id}-brass`} cx="38%" cy="32%" r="80%">
            <stop offset="0" stopColor="#fff1b5" />
            <stop offset=".25" stopColor="#f0c75a" />
            <stop offset=".6" stopColor="#c89028" />
            <stop offset="1" stopColor="#7c5110" />
          </radialGradient>
          <radialGradient id={`${id}-lobe`} cx="40%" cy="30%" r="80%">
            <stop offset="0" stopColor="#fff4c4" />
            <stop offset=".4" stopColor="#e2b245" />
            <stop offset="1" stopColor="#8a5a12" />
          </radialGradient>
          <radialGradient id={`${id}-silver`} cx="35%" cy="30%" r="85%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".4" stopColor="#d6dde4" />
            <stop offset=".8" stopColor="#8d99a6" />
            <stop offset="1" stopColor="#c7d0d8" />
          </radialGradient>
          <radialGradient id={`${id}-goldc`} cx="35%" cy="30%" r="85%">
            <stop offset="0" stopColor="#fff6c8" />
            <stop offset=".4" stopColor="#f2c650" />
            <stop offset=".8" stopColor="#b5800e" />
            <stop offset="1" stopColor="#f0c75a" />
          </radialGradient>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset=".35" stopColor="#fff" stopOpacity="0" />
            <stop offset=".7" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".2" />
          </linearGradient>
          <radialGradient id={`${id}-kumkum`} cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#ff3b2a" />
            <stop offset="1" stopColor="#a50f12" />
          </radialGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#fff2b0" stopOpacity=".95" />
            <stop offset=".3" stopColor="#ffb340" stopOpacity=".5" />
            <stop offset="1" stopColor="#ff8a1a" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-powder`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="6" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
          </filter>
        </defs>

        {/* silk */}
        <rect width={POST_W} height={h} fill={`url(#${id}-silk)`} />
        <rect width={POST_W} height={h} fill={`url(#${id}-buta)`} />
        <rect width={POST_W} height={h} filter={`url(#${id}-weave)`} />
        <rect width={POST_W} height={h} filter={`url(#${id}-sheenF)`} style={{ mixBlendMode: "screen" }} opacity=".35" />

        {/* rice + petals on the silk */}
        {riceC.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx="4.2" ry="1.9" fill="#f4eedd" transform={`rotate(${p.a} ${p.x} ${p.y})`} />
        ))}
        {petalsC.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(${p.s})`}>
            <path d="M0 0 C6 -4 14 -4 18 0 C14 5 6 5 0 0Z" fill={p.c} />
            <path d="M2 0 C8 -1 12 -1 16 0" stroke="#b5420a" strokeWidth=".8" fill="none" opacity=".6" />
          </g>
        ))}

        {/* the thali */}
        <circle cx="540" cy={cy + r * 0.04} r={r * 1.01} fill="#000" opacity=".55" filter={`url(#${id}-sh)`} />
        <circle cx="540" cy={cy} r={r} fill={`url(#${id}-brass)`} />
        {/* repoussé lobes on the rim */}
        {Array.from({ length: lobes }, (_, k) => (
          <g key={k} transform={`rotate(${r2((360 / lobes) * k)} 540 ${cy})`}>
            <ellipse cx="540" cy={cy - r * 0.9} rx={r * 0.062} ry={r * 0.075} fill={`url(#${id}-lobe)`} />
            <circle cx="540" cy={cy - r * 0.79} r={r * 0.012} fill="#7c5110" />
          </g>
        ))}
        <circle cx="540" cy={cy} r={r * 0.99} fill="none" stroke="#6e440c" strokeWidth="3" />
        <circle cx="540" cy={cy} r={r * 0.82} fill="none" stroke="#fff0b8" strokeWidth="2" opacity=".7" />
        <circle cx="540" cy={cy} r={r * 0.815} fill="none" stroke="#6e440c" strokeWidth="2.5" />
        {/* the flat well: hammered, with an engraved border of tiny leaves */}
        <circle cx="540" cy={cy} r={r * 0.76} fill={`url(#${id}-brass)`} />
        <circle cx="540" cy={cy} r={r * 0.76} filter={`url(#${id}-hammer)`} style={{ mixBlendMode: "multiply" }} opacity=".45" />
        {Array.from({ length: 60 }, (_, k) => (
          <path key={k} d={`M540 ${cy - r * 0.73} q4 -6 0 -12 q-4 6 0 12`} fill="#7c5110" opacity=".55" transform={`rotate(${k * 6} 540 ${cy})`} />
        ))}
        <circle cx="540" cy={cy} r={r * 0.68} fill="none" stroke="#7c5110" strokeWidth="1.5" opacity=".6" />
        {/* light on the brass from the diya, and a broad specular streak */}
        <ellipse cx={540 - r * 0.25} cy={cy - r * 0.3} rx={r * 0.55} ry={r * 0.35} fill="#fff" opacity=".18" transform={`rotate(-35 ${540 - r * 0.25} ${cy - r * 0.3})`} filter={`url(#${id}-sh)`} />

        {/* on the rim: katori of kumkum, a small diya seen from above */}
        {(() => {
          const a = (-150 * Math.PI) / 180;
          const kx = r2(540 + Math.cos(a) * r * 0.88);
          const ky = r2(cy + Math.sin(a) * r * 0.88);
          const d = (-122 * Math.PI) / 180;
          const dx = r2(540 + Math.cos(d) * r * 1.0);
          const dy = r2(cy + Math.sin(d) * r * 1.0);
          const kr = r * 0.11;
          return (
            <>
              <circle cx={kx} cy={ky + 5} r={kr * 1.05} fill="#000" opacity=".45" filter={`url(#${id}-sh)`} />
              <circle cx={kx} cy={ky} r={kr} fill={`url(#${id}-lobe)`} />
              <circle cx={kx} cy={ky} r={kr * 0.78} fill={`url(#${id}-kumkum)`} filter={`url(#${id}-powder)`} />
              <circle cx={dx} cy={dy} r={r * 0.32} fill={`url(#${id}-glow)`} style={{ mixBlendMode: "screen" }} />
              <circle cx={dx} cy={dy + 4} r={r * 0.075} fill="#000" opacity=".4" filter={`url(#${id}-sh)`} />
              <circle cx={dx} cy={dy} r={r * 0.075} fill="#a8481c" />
              <circle cx={dx} cy={dy} r={r * 0.055} fill="#5a3a0a" />
              <circle cx={dx} cy={dy} r={r * 0.03} fill="#fff6c8" />
              <circle cx={dx} cy={dy} r={r * 0.016} fill="#fff" />
            </>
          );
        })()}

        {coins.map((c, i) => (
          <Coin key={i} {...c} id={id} />
        ))}
      </svg>

      {/* business head */}
      <div className="th-head" style={{ top: g.headTop, height: g.headH }}>
        <span className={`pc-logo ${b.logo ? "has-logo" : ""}`}>{b.logo ? <img src={b.logo} alt="" /> : <b>{initialOf(b.business)}</b>}</span>
        <div className="th-who">
          <FitName className="pc-biz" text={b.business} max={ratio === "9x16" ? 66 : 58} min={28} />
          {b.owner && <Fit className="pc-owner" text={b.owner} max={25} min={17} />}
        </div>
      </div>

      {/* greeting engraved in the brass */}
      <Squeeze className="th-text" style={{ top: cy - r * 0.6, height: r * 1.2, left: 540 - r * 0.62, width: r * 1.24 }} deps={[t.heading, t.wish, t.message, ratio]}>
        {lead && <Fit className="th-lead" text={lead} max={Math.round(r * 0.17)} min={26} />}
        <Fit as="h1" className="th-word" text={word} max={Math.round(r * 0.27)} min={40} />
        <span className="th-rule" />
        {t.wish && <Fit as="p" className="th-wish" text={t.wish} max={Math.round(r * 0.1)} min={20} />}
        {t.message && <Fit as="p" className="th-msg" text={t.message} max={Math.round(r * 0.085)} min={17} />}
      </Squeeze>

      <Offer text={b.offer} className="th-offer" style={{ top: g.footTop - 34 }} />

      {/* contacts below the thali */}
      <Squeeze className={`th-foot ${b.offer ? "has-offer" : ""}`} style={{ top: g.footTop, height: g.footBottom - g.footTop }} deps={[JSON.stringify(b), ratio]}>
        {b.services && <Fit className="pc-services" text={b.services} max={26} min={18} />}
        {phones.length > 0 && (
          <div className="th-phones">
            <Icon name="phone" size={30} />
            <Fit text={phones.join("   |   ")} max={!b.services && !foot.length ? 56 : 40} min={24} />
          </div>
        )}
        {foot.length > 0 && (
          <div className="pc-foot">
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
