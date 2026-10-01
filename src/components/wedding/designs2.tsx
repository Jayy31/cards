"use client";
import React from "react";
import type { Palette } from "@/lib/types";
import { foilFill, isDark } from "@/components/card/theme";
import { DoubleBorder } from "@/components/card/ornaments";
import { CoverText, type WedDesign } from "./designs";
import { AlponaCorner, AlponaLotus, AlponaVine, BandhaniField, Dandiya, FishPair, Garbo, Girih, Kaleera, LacePanel, Lantern, Mirror, Mukut, PhulkariBand, PointedArch, Prajapati, StitchStar, Topor } from "./art2";

/* Wedding collection, batch 2 designs. Same contract as designs.tsx. */

/** Alpona is painted in white on dark stock and in the accent red on light stock. */
const paint = (p: Palette) => (isDark(p.paper) ? "#fffaf0" : p.accent);

/* ================= Alpona (Bengali) ================= */

const alpona: WedDesign = {
  Frame: ({ p, kind }) => {
    const c = paint(p);
    return (
      <>
        <div className="al-paar" style={{ borderColor: p.accent2 }} />
        <div className="al-vine top">
          <AlponaVine width={440} height={22} color={p.paper} />
        </div>
        <div className="al-vine bottom">
          <AlponaVine width={440} height={22} color={p.paper} />
        </div>
        {(["tl", "tr", "bl", "br"] as const).map((k) => (
          <div key={k} className={`al-corner ${k}`}>
            <AlponaCorner size={kind === "cover" ? 86 : 64} color={c} />
          </div>
        ))}
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="al-lotus">
          <AlponaLotus size={420} color={paint(p)} width={2} />
        </div>
        <div className="al-butterfly">
          <Prajapati size={84} fill={fill} hole={p.paper} />
        </div>
        <div className="al-topor">
          <Topor height={104} fill={fill} hole={p.paper} />
        </div>
        <div className="al-mukut">
          <Mukut width={84} fill={fill} hole={p.paper} />
        </div>
        <div className="al-fish">
          <FishPair width={150} fill={fill} hole={p.paper} />
        </div>
        <CoverText {...props} symbol={0.6} divider="dots" />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <AlponaLotus size={260} color={paint(p)} width={2} />
    </div>
  ),
};

/* ================= Phulkari (Punjabi) ================= */

const threads = (p: Palette) => [p.accent, p.accent2, p.wax];

const phulkari: WedDesign = {
  Frame: ({ p, kind }) => {
    const h = kind === "cover" ? 76 : 46;
    return (
      <>
        <div className="pk-band top">
          <PhulkariBand width={500} height={h} colors={threads(p)} ground={p.paper2} />
        </div>
        <div className="pk-band bottom">
          <PhulkariBand width={500} height={h} colors={threads(p)} ground={p.paper2} />
        </div>
        <div className="pk-stitch" style={{ borderColor: p.accent }} />
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="pk-kaleera l">
          <Kaleera height={176} fill={fill} />
        </div>
        <div className="pk-kaleera r">
          <Kaleera height={150} fill={fill} />
        </div>
        <div className="pk-stars">
          {[0, 1, 2].map((i) => (
            <StitchStar key={i} size={i === 1 ? 74 : 54} colors={i === 1 ? [p.accent, p.wax, p.accent2] : [p.accent2, p.accent, p.wax]} />
          ))}
        </div>
        <CoverText {...props} symbol={0.7} />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <StitchStar size={180} colors={threads(p)} />
    </div>
  ),
};

/* ================= Bandhej (Gujarati) ================= */

const MIRRORS_COVER = (() => {
  const pts: [number, number][] = [];
  const x0 = 58,
    y0 = 128,
    w = 384,
    h = 470,
    step = 38;
  for (let x = x0; x <= x0 + w + 0.1; x += w / Math.round(w / step)) pts.push([x, y0], [x, y0 + h]);
  for (let y = y0 + h / Math.round(h / step); y < y0 + h - 1; y += h / Math.round(h / step)) pts.push([x0, y], [x0 + w, y]);
  return pts;
})();

const bandhej: WedDesign = {
  Frame: ({ p, kind }) => {
    const cover = kind === "cover";
    return (
      <>
        <div className="bj-field">
          <BandhaniField width={500} height={700} dot="#fff4d6" dot2={p.accent2} tile={26} />
        </div>
        <div className={`bj-panel ${cover ? "cover" : ""}`} style={{ background: p.paper2, borderColor: p.accent2 }} />
        {(cover ? MIRRORS_COVER : [
          [30, 30],
          [470, 30],
          [30, 670],
          [470, 670],
          [250, 30],
          [250, 670],
        ]).map(([x, y], i) => (
          <div key={i} className="bj-mirror" style={{ left: x - 13, top: y - 13 }}>
            <Mirror size={26} thread={p.accent2} />
          </div>
        ))}
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="bj-garbo">
          <Garbo size={84} fill={fill} />
        </div>
        <div className="bj-dandiya">
          <Dandiya length={150} colors={[p.accent2, "#fff4d6", p.accent, "#f6c343"]} />
        </div>
        <CoverText {...props} symbol={0.62} />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 0.8 }}>
      <BandhaniField width={500} height={700} dot="#fff4d6" dot2={p.accent2} tile={26} />
    </div>
  ),
};

/* ================= Noor (Nikah) ================= */

const noor: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    return (
      <>
        <div className="nr-girih">
          <Girih width={500} height={700} stroke={p.inkSoft} tile={50} />
        </div>
        <div className="nr-veil" />
        <DoubleBorder fill={fill} inset={14} gap={6} beads={false} />
        {kind === "cover" && (
          <svg className="nr-arch-fill" viewBox="0 0 360 520" preserveAspectRatio="none">
            <path d="M0,520 L0,198 A295,295 0 0 1 180,0 A295,295 0 0 1 360,198 L360,520Z" fill="var(--paper)" />
          </svg>
        )}
      </>
    );
  },
  Cover: (props) => {
    const fill = foilFill(props.p);
    return (
      <div className="page-content cover wd-cover">
        <div className="nr-arch">
          <PointedArch width={360} height={520} fill={fill} />
        </div>
        <div className="nr-lantern l">
          <Lantern height={168} fill={fill} />
        </div>
        <div className="nr-lantern r">
          <Lantern height={140} fill={fill} />
        </div>
        <CoverText {...props} symbol={0.7} divider="diamond" />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Girih width={500} height={700} stroke={p.inkSoft} tile={50} />
    </div>
  ),
};

/* ================= Jaali Lace (laser-cut) ================= */

const lace: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    if (kind === "cover")
      return (
        <div className="lc-cover">
          <LacePanel width={500} height={700} fill={fill} tile={40} border={18} window={{ x: 96, y: 118, w: 308, h: 482 }} />
        </div>
      );
    return (
      <>
        <div className="lc-band top">
          <LacePanel width={500} height={78} fill={fill} tile={30} border={8} scallop="bottom" />
        </div>
        <div className="lc-band bottom">
          <LacePanel width={500} height={78} fill={fill} tile={30} border={8} scallop="top" />
        </div>
        <div className="lc-line" />
      </>
    );
  },
  Cover: (props) => (
    <div className="page-content cover wd-cover">
      <CoverText {...props} symbol={0.6} divider="diamond" />
    </div>
  ),
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <LacePanel width={500} height={700} fill={foilFill(p)} tile={40} border={18} />
    </div>
  ),
};

export const WED_DESIGNS_2: Record<string, WedDesign> = { alpona, phulkari, bandhej, noor, lace };
