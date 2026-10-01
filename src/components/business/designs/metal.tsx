"use client";
import { useMemo } from "react";
import { Contacts, type FaceProps, FrontMeta, LocalName, monogram, Qr } from "../parts";

/*
 * Titan Metal: brushed metal card. The brushing is a stretched noise texture;
 * the anisotropic highlight is a vertical band that tracks the light, just as
 * a horizontally brushed sheet reflects. Type and the guilloché rosette are
 * "laser etched": recessed with a light lower lip and a dark upper lip.
 */

/** Guilloché: bands of phase-shifted sine rings that weave into a lattice, as on banknotes. */
function guilloche(bands: { r: number; amp: number; waves: number; lines: number }[]) {
  let d = "";
  for (const { r: R, amp, waves, lines } of bands) {
    for (let i = 0; i < lines; i++) {
      const ph = (i / lines) * Math.PI * 2;
      for (let s = 0; s <= 720; s++) {
        const th = (s / 720) * Math.PI * 2;
        const r = R + amp * Math.sin(waves * th + ph) + amp * 0.25 * Math.sin(waves * 3 * th - ph);
        d += `${s ? "L" : "M"}${(r * Math.cos(th)).toFixed(1)},${(r * Math.sin(th)).toFixed(1)}`;
      }
      d += "Z";
    }
  }
  return d;
}

function Metal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="metal-base" />
      <div className="metal-brush" />
      {children}
      <div className="metal-glint" />
      <div className="metal-glint thin" />
      <div className="biz-edge metal-edge" />
    </>
  );
}

export const TitanMetal = {
  Front: ({ d }: FaceProps) => {
    const rosette = useMemo(
      () =>
        guilloche([
          { r: 158, amp: 20, waves: 14, lines: 14 },
          { r: 104, amp: 13, waves: 22, lines: 12 },
        ]),
      [],
    );
    return (
      <Metal>
        <svg className="metal-rosette etched-svg" viewBox="-200 -200 400 400">
          <path d={rosette} fill="none" strokeWidth={0.7} />
          <circle r={186} fill="none" strokeWidth={1.2} />
          <circle r={130} fill="none" strokeWidth={0.6} />
          <circle r={74} fill="none" strokeWidth={1.2} />
          <circle r={68} fill="none" strokeWidth={0.5} />
        </svg>
        <div className="metal-front">
          {d.logo ? (
            <div className="biz-logo-img sm" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />
          ) : (
            <div className="metal-mark etched">
              <span>{monogram(d.company)}</span>
            </div>
          )}
          <div className="metal-brand">
            <div className="metal-company etched">{d.company}</div>
            <div className="metal-tag etched">{d.tagline}</div>
          </div>
        </div>
        {!d.front?.name && <div className="metal-serial etched">{d.name.toUpperCase()}</div>}
        <FrontMeta d={d} className="etched" />
      </Metal>
    );
  },
  Back: ({ d }: FaceProps) => (
    <Metal>
      <div className="metal-back">
        <div className="metal-back-main">
          <div className="metal-name etched">{d.name}</div>
          <LocalName d={d} className="biz-local etched" />
          <div className="metal-title etched">{d.title}</div>
          <div className="metal-rule" />
          <Contacts d={d} className="metal-contacts etched" />
        </div>
        <div className="metal-plate">
          <Qr d={d} color="#15171b" />
        </div>
      </div>
    </Metal>
  ),
};
