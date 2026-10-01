"use client";
import React from "react";
import type { Palette } from "@/lib/types";
import { fmtShortDate, fmtTime } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { foilFill, isDark } from "@/components/card/theme";
import { DoubleBorder } from "@/components/card/ornaments";
import { SymbolMark } from "@/components/card/InvitePages";
import { Wash } from "./art";
import { CoverText, type WedDesign } from "./designs";
import { Barcode, Bush, Couple, Dove, FloralArch, LilySprig, MadhuBorder, MadhuFish, MadhuLotus, MadhuSun, Mundavalya, PaithaniBorder, Peacock, Plane, StainedGlass, WeddingBells } from "./art3";

/* Wedding collection, batch 3 designs. Same contract as designs.tsx. */

/** Madhubani line colour: black ink on light paper, cream on dark. */
const ink = (p: Palette) => (isDark(p.paper) ? "#fff6e0" : "#1a1a1a");

/* ================= Paithani ================= */

const paithani: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    const h = kind === "cover" ? 66 : 44;
    return (
      <>
        <div className="pt-band top">
          <PaithaniBorder width={500} height={h} band={p.accent2} fill={fill} flip />
        </div>
        <div className="pt-band bottom">
          <PaithaniBorder width={500} height={h} band={p.accent2} fill={fill} />
        </div>
        <div className="pt-side l" />
        <div className="pt-side r" />
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="pt-mund l">
          <Mundavalya height={160} gold={fill} />
        </div>
        <div className="pt-mund r">
          <Mundavalya height={130} gold={fill} />
        </div>
        <div className="pt-peacock l">
          <Peacock width={128} fill={fill} eye={p.accent2} />
        </div>
        <div className="pt-peacock r">
          <Peacock width={128} fill={fill} eye={p.accent2} flip />
        </div>
        <CoverText {...props} symbol={0.66} />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Peacock width={200} fill={foilFill(p)} eye={p.accent2} />
    </div>
  ),
};

/* ================= Grace (Christian) ================= */

const grace: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    return (
      <>
        <DoubleBorder fill={fill} inset={16} gap={5} beads={false} />
        <div className="gr-lily tl">
          <LilySprig size={kind === "cover" ? 130 : 96} leaf={p.accent2} />
        </div>
        <div className="gr-lily br">
          <LilySprig size={kind === "cover" ? 130 : 96} leaf={p.accent2} flip />
        </div>
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="gr-window">
          <StainedGlass width={170} height={210} colors={[p.accent, p.accent2, "#7fa7c9", "#e9c46a", "#c97b84"]} fill={fill} />
        </div>
        <div className="gr-dove l">
          <Dove width={70} line={isDark(p.paper) ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.25)"} />
        </div>
        <div className="gr-dove r">
          <Dove width={70} flip line={isDark(p.paper) ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.25)"} />
        </div>
        <div className="gr-bells">
          <WeddingBells width={96} fill={fill} ribbon={p.paper2} />
        </div>
        <CoverText {...props} symbol={0} divider="diamond" />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <WeddingBells width={160} fill={foilFill(p)} ribbon={p.paper2} />
    </div>
  ),
};

/* ================= Madhubani ================= */

const madhubani: WedDesign = {
  Frame: ({ p, kind }) => (
    <>
      <MadhuBorder width={500} height={700} line={ink(p)} band={kind === "cover" ? 26 : 18} />
      {kind !== "cover" && (
        <div className="mb-corner">
          <MadhuLotus size={56} line={ink(p)} />
        </div>
      )}
    </>
  ),
  Cover: (props) => {
    const line = ink(props.p);
    return (
      <div className="page-content cover wd-cover">
        <div className="mb-sun">
          <MadhuSun size={112} line={line} />
        </div>
        <div className="mb-fish l">
          <MadhuFish width={132} line={line} />
        </div>
        <div className="mb-fish r">
          <MadhuFish width={132} line={line} flip />
        </div>
        <div className="mb-lotus">
          <MadhuLotus size={72} line={line} />
        </div>
        <CoverText {...props} symbol={0.6} divider="dots" />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark" style={{ opacity: 0.8 }}>
      <MadhuSun size={180} line={ink(p)} />
    </div>
  ),
};

/* ================= Saath (illustrated couple) ================= */

const blooms = (p: Palette) => [p.accent, p.wax, "#f6d6a8", p.accent2, "#fbe3e8"];

const saath: WedDesign = {
  Frame: ({ p, kind }) => (
    <>
      <div className="sa-wash a">
        <Wash width={300} height={240} color={p.accent} seed={4} opacity={0.16} />
      </div>
      <div className="sa-wash b">
        <Wash width={300} height={240} color={p.accent2} seed={9} opacity={0.18} />
      </div>
      <div className="sa-line" />
      {kind !== "cover" && (
        <div className="sa-bush">
          <Bush width={110} colors={blooms(p)} leaf={p.inkSoft} seed={6} />
        </div>
      )}
    </>
  ),
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="sa-arch pu-layer">
          <FloralArch width={340} height={300} colors={blooms(p)} leaf={p.inkSoft} />
        </div>
        <div className="sa-couple pu-layer">
          <Couple width={196} lehenga={p.accent} stole={p.wax} gold={fill} />
        </div>
        <div className="sa-bush l pu-layer">
          <Bush width={130} colors={blooms(p)} leaf={p.inkSoft} seed={3} />
        </div>
        <div className="sa-bush r pu-layer">
          <Bush width={130} colors={blooms(p)} leaf={p.inkSoft} seed={8} />
        </div>
        <CoverText {...props} symbol={0} divider="none" />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Bush width={200} colors={blooms(p)} leaf={p.inkSoft} seed={5} />
    </div>
  ),
};

/* ================= Jet Set (boarding pass) ================= */

const code = (s: string) => (s.replace(/[^A-Za-z]/g, "").slice(0, 3) || "LOV").toUpperCase();

const jetset: WedDesign = {
  Frame: ({ kind }) => (
    <>
      <div className={`js-head ${kind === "cover" ? "big" : ""}`}>
        <Plane size={kind === "cover" ? 26 : 18} color="currentColor" />
        <span className="js-dash" />
        <Plane size={kind === "cover" ? 26 : 18} color="currentColor" />
      </div>
      {kind !== "cover" && <div className="js-perf" />}
    </>
  ),
  Cover: ({ d, t, p }) => {
    const env = useCardEnv();
    const [a, b] = coupleOrder(d);
    const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
    const flight = (d.hashtag?.trim() || "#Forever").replace(/^#?/, "#");
    return (
      <div className="page-content cover wd-cover js-cover">
        <div className="js-title">
          <span>{d.eyebrow}</span>
          <span className="js-flight">{flight}</span>
        </div>
        {d.symbol !== "none" && (
          <div className="js-symbol">
            <SymbolMark d={d} t={t} p={p} size={0.5} />
          </div>
        )}
        <div className="js-route">
          <div className="js-city">
            <span className="js-lbl">From</span>
            <span className="js-code">{code(a.name)}</span>
            <span className="js-sub">{a.name}</span>
          </div>
          <div className="js-arc">
            <svg viewBox="0 0 120 40" width={120} height={40}>
              <path d="M4,34 Q60,-6 116,34" fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 4" />
            </svg>
            <span className="js-plane">
              <Plane size={26} color="currentColor" />
            </span>
          </div>
          <div className="js-city">
            <span className="js-lbl">To</span>
            <span className="js-code">{b ? code(b.name) : "WED"}</span>
            <span className="js-sub">{b?.name ?? ""}</span>
          </div>
        </div>
        <div className="js-names">
          {a.name}
          {b?.name && <span> &amp; {b.name}</span>}
        </div>
        <div className="js-grid">
          <div>
            <span className="js-lbl">Date</span>
            <b>{fmtShortDate(d.mainDateTime.split("T")[0])}</b>
          </div>
          <div>
            <span className="js-lbl">Boarding</span>
            <b>{main ? fmtTime(main.time) : fmtTime(d.mainDateTime.split("T")[1] ?? "18:00")}</b>
          </div>
          <div className="wide">
            <span className="js-lbl">Gate</span>
            <b>{main?.venue || "To be announced"}</b>
          </div>
          <div>
            <span className="js-lbl">Seat</span>
            <b>Front row</b>
          </div>
          <div>
            <span className="js-lbl">Class</span>
            <b>Family</b>
          </div>
        </div>
        <div className="js-stub">
          <div className="js-pax">
            <span className="js-lbl">Passenger</span>
            <b>{env.guest || "Our favourite people"}</b>
          </div>
          <Barcode width={250} height={40} color={p.ink} seed={a.name.length * 7 + (b?.name.length ?? 3)} />
        </div>
      </div>
    );
  },
  Back: () => (
    <div className="wd-back-mark js-back">
      <Plane size={120} color="currentColor" />
    </div>
  ),
};

export const WED_DESIGNS_3: Record<string, WedDesign> = { paithani, grace, madhubani, saath, jetset };
