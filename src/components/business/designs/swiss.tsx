"use client";
import { isDark } from "@/components/card/theme";
import { Brand, Contacts, type FaceProps, fitSize, FrontMeta, LocalName, monogram, Qr, twoLines } from "../parts";

/*
 * Swiss Grid: International Typographic Style. A 12-column grid, one accent
 * block finished in spot-UV gloss (only the block reflects the moving light),
 * flush-left type. The arrival is kinetic typography (GSAP SplitText).
 */

export const SwissGrid = {
  Front: ({ d, p }: FaceProps) => {
    const [l1, l2] = twoLines(d.company);
    const size = fitSize(l1.length > l2.length ? l1 : l2, 380, 62, 0.6);
    return (
      <>
        <div className="paper-grain" />
        <div className="sw-block fx-wipe">
          <div className="sw-gloss" />
          <Brand d={d} className="sw-logo">
            <span className="sw-mono">{monogram(d.company)}</span>
          </Brand>
        </div>
        <div className="sw-grid" />
        <div className="sw-index fx-line">
          <span>01</span>
          <span>{d.tagline}</span>
        </div>
        <div className="sw-company" style={{ fontSize: size }}>
          <span className="fx-split">{l1}</span>
          {l2 && <span className="fx-split">{l2}</span>}
        </div>
        <FrontMeta d={d} className="sw-fm" qrColor={isDark(p.paper) ? "#f2f2f2" : p.ink} />
        <div className="sw-foot fx-line">
          <span>{d.website.replace(/^https?:\/\//, "")}</span>
          <span className="sw-dot" />
        </div>
        <div className="biz-edge" />
      </>
    );
  },
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="sw-grid" />
      <div className="sw-back">
        <div className="sw-name">{d.name}</div>
        <LocalName d={d} />
        <div className="sw-title">{d.title}</div>
        <div className="sw-rule" />
        <Contacts d={d} className="sw-contacts" icons={false} />
      </div>
      <div className="sw-qr">
        <Qr d={d} color={isDark(p.paper) ? "#111" : p.ink} />
      </div>
      <div className="sw-corner">
        <div className="sw-gloss" />
      </div>
      <div className="biz-edge" />
    </>
  ),
};
