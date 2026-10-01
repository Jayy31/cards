"use client";
import { Contacts, type FaceProps, fitSize, FrontMeta, LocalName, Qr } from "../parts";

/*
 * Neon Sign: glass tubes mounted on a matte black board. Each tube is drawn
 * twice: the unlit glass, and the lit gas on top with its opacity driven by
 * `--neon` (0..1), so the sign can flicker on. The frame tube is an SVG path
 * that is "bent" into place with DrawSVG on arrival.
 */

function framePath(gap: number) {
  const l = 350 - gap;
  const r = 350 + gap;
  return `M${l},360 H74 Q40,360 40,326 V74 Q40,40 74,40 H626 Q660,40 660,74 V326 Q660,360 626,360 H${r}`;
}

function Tube({ d, className }: { d: string; className: string }) {
  return (
    <svg className={`neon-svg ${className}`} viewBox="0 0 700 400" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} className="fx-draw" />
    </svg>
  );
}

function Board({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="neon-board" />
      <div className="neon-spill" />
      {children}
      <div className="neon-screws">
        <i style={{ left: 22, top: 22 }} />
        <i style={{ right: 22, top: 22 }} />
        <i style={{ left: 22, bottom: 22 }} />
        <i style={{ right: 22, bottom: 22 }} />
      </div>
      <div className="biz-edge" />
    </>
  );
}

export const NeonSign = {
  Front: ({ d }: FaceProps) => {
    const gap = Math.min(250, d.tagline.length * 4.4 + 26);
    const path = framePath(gap);
    const size = fitSize(d.company, 540, 92, 0.5);
    return (
      <Board>
        <Tube d={path} className="tube-off accent" />
        <Tube d={path} className="tube-on accent" />
        {d.logo && <div className="neon-logo" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />}
        <FrontMeta d={d} />
        <div className="neon-word">
          <span className="neon-off" style={{ fontSize: size }}>
            {d.company}
          </span>
          <span className="neon-on" style={{ fontSize: size }}>
            {d.company}
          </span>
        </div>
        <div className="neon-tag">
          <span className="neon-off">{d.tagline}</span>
          <span className="neon-on accent">{d.tagline}</span>
        </div>
      </Board>
    );
  },
  Back: ({ d }: FaceProps) => (
    <Board>
      <div className="neon-back">
        <div className="neon-back-main">
          <div className="neon-name">{d.name}</div>
          <LocalName d={d} />
          <div className="neon-title">
            <span className="neon-off">{d.title}</span>
            <span className="neon-on accent">{d.title}</span>
          </div>
          <Contacts d={d} className="neon-contacts" />
        </div>
        <div className="neon-qr">
          <Qr d={d} color="#101014" />
        </div>
      </div>
    </Board>
  ),
};
