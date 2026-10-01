"use client";
import { Contacts, type FaceProps, fitSize, FrontMeta, LocalName, Qr } from "../parts";

/*
 * Clear Acrylic: a tinted, see-through card. The colourful studio behind it
 * is re-painted inside the card, blurred, so it reads as frosted acrylic in
 * every medium (live, PNG, PDF), not only where backdrop-filter works.
 * Polished edges catch the light; the print is UV ink, slightly raised.
 */

function Glass({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="acr-behind">
        <i className="b1" />
        <i className="b2" />
        <i className="b3" />
      </div>
      <div className="acr-tint" />
      <div className="acr-frost" />
      {children}
      <div className="acr-glare" />
      <div className="acr-edge" />
    </>
  );
}

export const ClearAcrylic = {
  Front: ({ d }: FaceProps) => (
    <Glass>
      <div className="acr-front">
        {d.logo ? (
          <div className="biz-logo-img" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />
        ) : (
          <div className="acr-mark uv">
            <i />
            <i />
            <i />
          </div>
        )}
        <div className="acr-company uv" style={{ fontSize: fitSize(d.company, 520, 60, 0.52) }}>
          {d.company}
        </div>
        <div className="acr-tag uv">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="uv" qrColor="#10131a" />
    </Glass>
  ),
  Back: ({ d }: FaceProps) => (
    <Glass>
      <div className="acr-back">
        <div className="acr-back-main">
          <div className="acr-name uv">{d.name}</div>
          <LocalName d={d} />
          <div className="acr-title uv">{d.title}</div>
          <Contacts d={d} className="acr-contacts uv" />
        </div>
        <div className="acr-qr">
          <Qr d={d} color="#10131a" />
        </div>
      </div>
    </Glass>
  ),
};
