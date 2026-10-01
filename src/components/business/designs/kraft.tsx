"use client";
import { useId } from "react";
import { Contacts, type FaceProps, FrontMeta, LocalName, monogram, Qr, scatter } from "../parts";

/*
 * Kraft & Stamp: recycled kraft board with fibres and flecks, a hand-inked
 * rubber stamp (eroded with the shared stamp filter, never perfectly straight),
 * typewriter text and a handwritten note. The stamp lands with a thump.
 */

function Kraft({ children, seed }: { children: React.ReactNode; seed: number }) {
  const flecks = scatter(160, seed, 700, 400);
  return (
    <>
      <div className="kr-base" />
      <div className="kr-fiber" />
      <svg className="kr-flecks" viewBox="0 0 700 400">
        {flecks.map((f, i) => (
          <ellipse key={i} cx={f.x} cy={f.y} rx={0.5 + f.s * 1.4} ry={0.4 + f.a * 0.8} transform={`rotate(${f.a * 180} ${f.x} ${f.y})`} fill={f.s > 0.7 ? "rgba(255,245,225,.55)" : "rgba(50,30,10,.45)"} />
        ))}
      </svg>
      {children}
      <div className="paper-sheen" />
      <div className="biz-edge" />
    </>
  );
}

function Stamp({ d }: FaceProps) {
  const id = useId().replace(/:/g, "");
  const text = `${d.company.toUpperCase()} ★ ${d.tagline.toUpperCase()} ★ `;
  return (
    <div className="fx-slam kr-stamp-wrap">
      <svg className="kr-stamp" viewBox="-110 -110 220 220">
        <defs>
          <path id={`ring${id}`} d="M0,-76 A76,76 0 1 1 -0.01,-76" />
        </defs>
        <g filter="url(#f-stamp)">
          <circle r={100} fill="none" strokeWidth={5} />
          <circle r={92} fill="none" strokeWidth={1.4} />
          <circle r={58} fill="none" strokeWidth={1.4} />
          <text fontSize={text.length > 44 ? 11 : 13.5} letterSpacing={1.5}>
            <textPath href={`#ring${id}`} textLength={470} lengthAdjust="spacing">
              {text}
            </textPath>
          </text>
          {!d.logo && (
            <>
              <text className="kr-stamp-mono" y={17} fontSize={48} textAnchor="middle">
                {monogram(d.company)}
              </text>
              <path d="M-34,30 H34" strokeWidth={1.4} />
            </>
          )}
        </g>
      </svg>
      {d.logo && <div className="kr-logo" style={{ WebkitMaskImage: `url(${JSON.stringify(d.logo)})`, maskImage: `url(${JSON.stringify(d.logo)})` }} />}
    </div>
  );
}

export const KraftStamp = {
  Front: (props: FaceProps) => {
    const { d } = props;
    return (
      <Kraft seed={9}>
        <Stamp {...props} />
        <div className="kr-front">
          <div className="kr-company fx-type">{d.company}</div>
          <div className="kr-rule" />
          <div className="kr-tag fx-type">{d.tagline}</div>
          <div className="kr-note fx-fade">{d.services.slice(0, 3).join(" • ")}</div>
          <FrontMeta d={d} className="fm-inline" qrColor={props.p.ink} />
        </div>
      </Kraft>
    );
  },
  Back: ({ d, p }: FaceProps) => (
    <Kraft seed={17}>
      <div className="kr-back">
        <div className="kr-back-main">
          <div className="kr-name">{d.name}</div>
          <LocalName d={d} />
          <div className="kr-title">{d.title}</div>
          <Contacts d={d} className="kr-contacts" />
        </div>
        <div className="kr-qr">
          <Qr d={d} color={p.ink} />
          <span>scan · save · say hi</span>
        </div>
      </div>
    </Kraft>
  ),
};
