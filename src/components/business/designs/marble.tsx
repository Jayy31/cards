"use client";
import { foilFill } from "@/components/card/theme";
import { Contacts, type FaceProps, fitSize, FrontMeta, LocalName, monogram, Qr } from "../parts";

/*
 * Carrara Gold: stone-look stock with veins in two depths, hot-foil gold
 * (bevelled with the shared foil filter) and gilded edges, visible whenever
 * the card turns. `--sweep` runs a polishing glint across the foil.
 */

function Stone({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-base" />
      <div className="mb-cloud" />
      <div className="mb-veins" />
      <div className="mb-veins fine" />
      {children}
      <div className="paper-sheen" />
      <div className="biz-edge mb-edge" />
    </>
  );
}

function Crest({ d, p }: FaceProps) {
  const fill = foilFill(p);
  const oct = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) * (2 * i + 1);
    return `${(Math.cos(a) * 58).toFixed(1)},${(Math.sin(a) * 58).toFixed(1)}`;
  }).join(" ");
  const oct2 = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) * (2 * i + 1);
    return `${(Math.cos(a) * 52).toFixed(1)},${(Math.sin(a) * 52).toFixed(1)}`;
  }).join(" ");
  return (
    <div className="mb-crest">
      <svg viewBox="-70 -70 140 140" width={128} height={128}>
        <g filter="url(#f-foil)" fill="none" stroke={fill}>
          <polygon points={oct} strokeWidth={2.4} />
          <polygon points={oct2} strokeWidth={0.8} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI / 4) * i;
            return <circle key={i} cx={Math.cos(a) * 64} cy={Math.sin(a) * 64} r={1.6} fill={fill} stroke="none" />;
          })}
        </g>
      </svg>
      <span className="mb-mono foil-text gild">{monogram(d.company)}</span>
    </div>
  );
}

export const CarraraGold = {
  Front: (props: FaceProps) => {
    const { d } = props;
    return (
      <Stone>
        <div className="mb-front">
          {d.logo ? <div className="biz-logo-img" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} /> : <Crest {...props} />}
          <div className="mb-company foil-text gild" style={{ fontSize: fitSize(d.company, 540, 34, 0.9) }}>
            {d.company}
          </div>
          <div className="mb-tag">{d.tagline}</div>
        </div>
        <FrontMeta d={d} />
      </Stone>
    );
  },
  Back: ({ d, p }: FaceProps) => (
    <Stone>
      <div className="mb-back">
        <div className="mb-back-main">
          <div className="mb-name foil-text gild">{d.name}</div>
          <LocalName d={d} />
          <div className="mb-title">{d.title}</div>
          <svg className="mb-rule" viewBox="0 0 220 10">
            <g filter="url(#f-foil)" stroke={foilFill(p)} fill={foilFill(p)}>
              <path d="M0,5 H96 M124,5 H220" strokeWidth={1} />
              <path d="M110,0 L115,5 L110,10 L105,5Z" stroke="none" />
            </g>
          </svg>
          <Contacts d={d} className="mb-contacts" />
        </div>
        <div className="mb-qr">
          <Qr d={d} color="#1a1712" />
        </div>
      </div>
    </Stone>
  ),
};
