"use client";
import { useId, useMemo } from "react";
import { rng } from "@/lib/format";
import { Contacts, type FaceProps, FrontMeta, LocalName, monogram, Qr } from "../parts";

/*
 * Walnut Engrave: wood veneer with laser-burned artwork. Everything that is
 * burned sits in `.wood-burn`, which is revealed top-to-bottom by `--burn`
 * (0..1) while a glowing laser line (`--beam`) tracks the cut, so the card
 * is visibly engraved as it arrives. Static renders default to fully burned.
 */

/** Wobbly concentric tree rings, like an end-grain slice. */
function treeRings(r0: number, n: number, seed: number) {
  const r = rng(seed);
  const out: string[] = [];
  const ph = Array.from({ length: 4 }, () => r() * Math.PI * 2);
  for (let i = 1; i <= n; i++) {
    const R = (r0 * i) / n;
    let d = "";
    for (let s = 0; s <= 120; s++) {
      const th = (s / 120) * Math.PI * 2;
      const w = 1 + 0.05 * Math.sin(3 * th + ph[0]) + 0.035 * Math.sin(5 * th + ph[1] + i * 0.3) + 0.02 * Math.sin(9 * th + ph[2]);
      d += `${s ? "L" : "M"}${(R * w * Math.cos(th)).toFixed(1)},${(R * w * 0.94 * Math.sin(th)).toFixed(1)}`;
    }
    out.push(d + "Z");
  }
  return out;
}

function Wood({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wood-base" />
      <div className="wood-grain" />
      <div className="wood-figure" />
      <div className="wood-burn">{children}</div>
      <div className="wood-laser" />
      <div className="wood-oil" />
      <div className="biz-edge" />
    </>
  );
}

export const WalnutEngrave = {
  Front: ({ d }: FaceProps) => {
    const id = useId().replace(/:/g, "");
    const rings = useMemo(() => treeRings(74, 9, 5), []);
    return (
      <Wood>
        <svg className="wood-badge burned-svg" viewBox="-160 -160 320 320">
          <defs>
            <path id={`top${id}`} d="M-118,0 A118,118 0 0 1 118,0" />
            <path id={`bot${id}`} d="M-128,0 A128,128 0 0 0 128,0" />
          </defs>
          <circle r={150} fill="none" strokeWidth={3} />
          <circle r={142} fill="none" strokeWidth={1} />
          <circle r={96} fill="none" strokeWidth={1.5} />
          {rings.map((r, i) => (
            <path key={i} d={r} fill="none" strokeWidth={i % 3 === 0 ? 1.4 : 0.7} opacity={0.85} />
          ))}
          <text className="wood-arc" fontSize={24} letterSpacing={5} textAnchor="middle">
            <textPath href={`#top${id}`} startOffset="50%">
              {d.company.toUpperCase()}
            </textPath>
          </text>
          <text className="wood-arc sm" fontSize={13} letterSpacing={3} textAnchor="middle">
            <textPath href={`#bot${id}`} startOffset="50%">
              {d.tagline.toUpperCase()}
            </textPath>
          </text>
          <circle cx={-133} cy={0} r={3.5} className="fill" />
          <circle cx={133} cy={0} r={3.5} className="fill" />
          <circle r={44} className="fill" />
          {!d.logo && (
            <text className="wood-mono" y={16} fontSize={44} textAnchor="middle">
              {monogram(d.company)}
            </text>
          )}
        </svg>
        {d.logo && <div className="wood-logo" style={{ WebkitMaskImage: `url(${JSON.stringify(d.logo)})`, maskImage: `url(${JSON.stringify(d.logo)})` }} />}
        <FrontMeta d={d} qrColor="#2a1406" />
      </Wood>
    );
  },
  Back: ({ d }: FaceProps) => (
    <Wood>
      <div className="wood-back">
        <div className="wood-back-main">
          <div className="wood-name">{d.name}</div>
          <LocalName d={d} />
          <div className="wood-title">{d.title}</div>
          <svg className="wood-rule burned-svg" viewBox="0 0 240 12">
            <path d="M0,6 H100 M140,6 H240" strokeWidth={1.2} />
            <path d="M110,6 l10,-5 l10,5 l-10,5z" className="fill" />
          </svg>
          <Contacts d={d} className="wood-contacts" />
        </div>
        <div className="wood-inlay">
          <Qr d={d} color="#2a1406" />
          <span>{d.company}</span>
        </div>
      </div>
    </Wood>
  ),
};
