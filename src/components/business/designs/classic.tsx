"use client";
import { foilFill } from "@/components/card/theme";
import { Divider } from "@/components/card/ornaments";
import { Contacts, type FaceProps, FrontMeta, LocalName, monogram, Qr } from "../parts";

/* Noir Foil & Ivory Letterpress: the two original designs. */

function Surface({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      {children}
      <div className="biz-edge" />
      <div className="paper-sheen" />
    </>
  );
}

function LogoMark({ d, p }: FaceProps) {
  const fill = foilFill(p);
  if (d.logo) return <div className="biz-logo-img" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />;
  return (
    <div className="biz-logo">
      <svg viewBox="0 0 100 100" width={96} height={96} style={{ overflow: "visible" }}>
        <g filter="url(#f-foil)" fill="none" stroke={fill}>
          <path d="M50,4 L96,50 L50,96 L4,50Z" strokeWidth={2.2} />
          <path d="M50,12 L88,50 L50,88 L12,50Z" strokeWidth={0.8} />
        </g>
      </svg>
      <span className="biz-logo-text foil-text">{monogram(d.company)}</span>
    </div>
  );
}

function Back({ d, p, press }: FaceProps & { press: boolean }) {
  return (
    <Surface>
      <div className="biz-back">
        <div className="biz-back-main">
          {press ? <div className="biz-company-sm press">{d.company}</div> : null}
          <div className={`biz-name ${press ? "press" : "foil-text"}`}>{d.name}</div>
          <LocalName d={d} />
          <div className="biz-title">{d.title}</div>
          <Contacts d={d} />
        </div>
        <div className="biz-back-side">
          <div className="biz-qr-wrap">
            <Qr d={d} color={press ? p.ink : "#111"} />
          </div>
          <div className="biz-qr-label">Scan to save contact</div>
          {d.services.length > 0 && <div className="biz-services">{d.services.join(" · ")}</div>}
        </div>
      </div>
    </Surface>
  );
}

export const Noir = {
  Front: (props: FaceProps) => (
    <Surface>
      <div className="biz-front-noir">
        <LogoMark {...props} />
        <div className="biz-company foil-text">{props.d.company}</div>
        <Divider fill={foilFill(props.p)} width={160} kind="diamond" />
        <div className="biz-tagline">{props.d.tagline}</div>
      </div>
      <FrontMeta d={props.d} />
    </Surface>
  ),
  Back: (props: FaceProps) => <Back {...props} press={false} />,
};

export const Letterpress = {
  Front: ({ d, p }: FaceProps) => (
    <Surface>
      <div className="biz-front-lp">
        {d.logo && <div className="biz-logo-img sm" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />}
        <div className="biz-name press fx-ink">{d.name}</div>
        <div className="biz-title fx-ink">{d.title}</div>
        <div className="biz-rule fx-ink" />
        <div className="biz-company foil-text fx-ink">{d.company}</div>
        <div className="biz-tagline fx-ink">{d.tagline}</div>
      </div>
      <FrontMeta d={{ ...d, front: { ...d.front, name: false } }} qrColor={p.ink} />
    </Surface>
  ),
  Back: (props: FaceProps) => <Back {...props} press />,
};
