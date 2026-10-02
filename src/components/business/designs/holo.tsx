"use client";
import { Contacts, type FaceProps, fitSize, FrontMeta, LocalName, Qr, scatter, twoLines } from "../parts";

/*
 * Holo Prism: holographic foil (a rainbow diffraction gradient whose phase
 * follows the light position --lx/--ly) plus two glitter layers that
 * cross-fade as the card tilts, so the sparkle "moves" like real foil.
 */

function Glitter({ seed }: { seed: number }) {
  const a = scatter(90, seed, 700, 400);
  const b = scatter(90, seed + 7, 700, 400);
  const dot = (g: { x: number; y: number; s: number }, i: number) => {
    const r = 0.6 + g.s * 1.6;
    return g.s > 0.86 ? (
      <path key={i} d={`M${g.x},${g.y - r * 3}L${g.x + r * 0.5},${g.y}L${g.x},${g.y + r * 3}L${g.x - r * 0.5},${g.y}Z M${g.x - r * 3},${g.y}L${g.x},${g.y - r * 0.5}L${g.x + r * 3},${g.y}L${g.x},${g.y + r * 0.5}Z`} />
    ) : (
      <circle key={i} cx={g.x} cy={g.y} r={r} />
    );
  };
  return (
    <svg className="holo-glitter" viewBox="0 0 700 400" fill="#fff">
      <g className="g-a">{a.map(dot)}</g>
      <g className="g-b">{b.map(dot)}</g>
    </svg>
  );
}

function Holo({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`holo ${className}`} style={style} />;
}

export const HoloPrism = {
  Front: ({ d }: FaceProps) => {
    const [l1, l2] = twoLines(d.company);
    const size = fitSize(l1.length > l2.length ? l1 : l2, 400, 70, 1.2);
    return (
      <>
        <div className="paper-grain" />
        <div className="holo-disc-wrap">
          <Holo className="holo-disc" />
          <Holo className="holo-ring" />
          <Holo className="holo-tri" />
        </div>
        <div className="holo-front">
          {d.logo && <div className="biz-logo-img sm" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />}
          <div className="holo-word holo-text" style={{ fontSize: size }}>
            <span>{l1}</span>
            {l2 && <span>{l2}</span>}
          </div>
          <div className="holo-tag">{d.tagline}</div>
        </div>
        {!(d.front?.name || d.front?.contact || d.front?.qr) && <div className="holo-foot">{d.website.replace(/^https?:\/\//, "")}</div>}
        <FrontMeta d={d} className="fm-left" />
        <Glitter seed={11} />
        <div className="holo-shine" />
        <div className="biz-edge" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <Holo className="holo-stripe" />
      <div className="holo-back">
        <div className="holo-back-main">
          <div className="holo-name">{d.name}</div>
          <LocalName d={d} />
          <div className="holo-title">{d.title}</div>
          <Holo className="holo-bar" />
          <Contacts d={d} className="holo-contacts" />
        </div>
        <div className="holo-qr">
          <Holo className="holo-qr-ring" />
          <div className="holo-qr-inner">
            <Qr d={d} color="#15151c" />
          </div>
          <span>{d.company}</span>
        </div>
      </div>
      <Glitter seed={23} />
      <div className="holo-shine" />
      <div className="biz-edge" />
    </>
  ),
};
