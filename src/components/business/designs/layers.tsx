"use client";
import { useMemo } from "react";
import { rng } from "@/lib/format";
import { Contacts, type FaceProps, FrontMeta, LocalName, Qr } from "../parts";

/*
 * Paper Layers: die-cut paper sheets stacked with foam spacers. Every layer
 * casts a real shadow on the one behind it and shifts with the light/tilt by
 * its depth (parallax), so the card has physical depth on a phone.
 */

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
}

function ridge(base: number, amp: number, seed: number, w = 780) {
  const r = rng(seed);
  const waves = Array.from({ length: 4 }, (_, i) => ({ f: (0.004 + r() * 0.006) * (i + 1), a: amp / (i + 1.3), ph: r() * Math.PI * 2 }));
  let d = `M-40,420 L-40,${base}`;
  for (let x = -40; x <= w - 40; x += 10) {
    const y = base + waves.reduce((s, v) => s + v.a * Math.sin(x * v.f + v.ph), 0);
    d += ` L${x},${y.toFixed(1)}`;
  }
  return d + ` L${w - 40},420Z`;
}

function Layers({ p, count, top, gap, amp, seed }: FaceProps & { count: number; top: number; gap: number; amp: number; seed: number }) {
  const layers = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ d: ridge(top + i * gap, amp * (1 - i * 0.08), seed + i * 13), c: mix(p.accent, p.accent2, count === 1 ? 1 : i / (count - 1)), depth: i + 1 })),
    [p.accent, p.accent2, count, top, gap, amp, seed],
  );
  return (
    <>
      {layers.map((l, i) => (
        <svg key={i} className="lay-sheet fx-layer" viewBox="-40 0 780 420" style={{ ["--depth" as string]: l.depth, zIndex: 2 + i }}>
          <path d={l.d} fill={l.c} />
        </svg>
      ))}
    </>
  );
}

export const PaperLayers = {
  Front: (props: FaceProps) => {
    const { d, p } = props;
    return (
      <>
        <div className="lay-sky" />
        <div className="lay-sun fx-layer" style={{ background: mix(p.paper, p.accent, 0.55) }} />
        <div className="lay-front">
          {d.logo && <div className="biz-logo-img sm" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />}
          <div className="lay-company fx-fade">{d.company}</div>
          <div className="lay-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light" />
        <Layers {...props} count={5} top={200} gap={38} amp={34} seed={3} />
        <div className="lay-site">{d.website.replace(/^https?:\/\//, "")}</div>
        <div className="paper-grain" />
        <div className="paper-sheen" />
        <div className="biz-edge" />
      </>
    );
  },
  Back: (props: FaceProps) => {
    const { d, p } = props;
    return (
      <>
        <div className="lay-sky" />
        <div className="lay-back">
          <div className="lay-back-main">
            <div className="lay-name">{d.name}</div>
            <LocalName d={d} />
            <div className="lay-title">{d.title}</div>
            <Contacts d={d} className="lay-contacts" />
          </div>
          <div className="lay-qr">
            <Qr d={d} color={p.ink} />
          </div>
        </div>
        <Layers {...props} count={3} top={342} gap={16} amp={10} seed={31} />
        <div className="paper-grain" />
        <div className="paper-sheen" />
        <div className="biz-edge" />
      </>
    );
  },
};
