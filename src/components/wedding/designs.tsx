"use client";
import React from "react";
import type { InviteData, Palette, Template } from "@/lib/types";
import { fmtLongDate, initials } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { foilFill } from "@/components/card/theme";
import { Divider, DoubleBorder } from "@/components/card/ornaments";
import type { PageKind } from "@/components/card/InvitePages";
import { SymbolMark } from "@/components/card/InvitePages";
import {
  ButiBand,
  Cow,
  CuspedArch,
  Elephant,
  Gopuram,
  GulmoharSpray,
  JasmineSwags,
  Kolam,
  Kuthuvilakku,
  Laurel,
  LotusPond,
  LotusTop,
  MarigoldSwag,
  MewarSun,
  TempleBell,
  TempleBorder,
  Thoranam,
  Wash,
} from "./art";

/**
 * Wedding design registry. A design supplies its own cover, the decoration
 * around every page (Frame) and the back of a leaf; the inner pages reuse the
 * shared layouts and are restyled under `.wd-<design>` in wedding.css.
 */

type P = { d: InviteData; t: Template; p: Palette };
type FrameP = { t: Template; p: Palette; kind: PageKind };

export interface WedDesign {
  Cover: (props: P) => React.ReactNode;
  Frame: (props: FrameP) => React.ReactNode;
  Back: (props: { p: Palette }) => React.ReactNode;
  /** optional bespoke inner pages, replacing the shared layout for that kind */
  Pages?: Partial<Record<PageKind, (props: P & { events?: import("@/lib/types").EventItem[]; first?: boolean }) => React.ReactNode>>;
}

/** Mantra, symbol, heading, the couple, the date and the guest's name. */
export function CoverText({ d, t, p, symbol = 0.8, divider = "lotus" as "lotus" | "diamond" | "dots" | "none", className = "" }: P & { symbol?: number; divider?: "lotus" | "diamond" | "dots" | "none"; className?: string }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const fill = foilFill(p);
  return (
    <div className={`wd-stack ${className}`}>
      {d.mantra && <div className="mantra foil-text">{d.mantra}</div>}
      {symbol > 0 && d.symbol !== "none" && <SymbolMark d={d} t={t} p={p} size={symbol} />}
      <div className="eyebrow">{d.eyebrow}</div>
      {b?.name ? (
        <h1 className="names-script foil-text">
          <span>{a.name}</span>
          <span className="joiner">{d.joiner || "&"}</span>
          <span>{b.name}</span>
        </h1>
      ) : (
        <h1 className="title-display foil-text">{a.name}</h1>
      )}
      {divider !== "none" && <Divider fill={fill} width={180} kind={divider} />}
      <div className="cover-date">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
      {env.guest && (
        <div className="cover-guest">
          <span>Dear</span> {env.guest}
        </div>
      )}
    </div>
  );
}

/* ================= Kovil ================= */

const kovil: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    const h = kind === "cover" ? 58 : 40;
    return (
      <>
        <div className="kv-band top">
          <TempleBorder width={500} height={h} band={p.accent2} fill={fill} flip />
        </div>
        <div className="kv-band bottom">
          <TempleBorder width={500} height={h} band={p.accent2} fill={fill} />
        </div>
        <div className="kv-side l" />
        <div className="kv-side r" />
        {kind !== "cover" && (
          <div className="kv-kolam-corner">
            <Kolam size={70} color={p.inkSoft} />
          </div>
        )}
      </>
    );
  },
  Cover: (props) => {
    const fill = foilFill(props.p);
    return (
      <div className="page-content cover wd-cover">
        <div className="kv-gopuram">
          <Gopuram width={340} fill={fill} hole={props.p.paper} opacity={0.13} />
        </div>
        <div className="kv-thoranam">
          <Thoranam width={440} seed={3} />
        </div>
        <div className="kv-bell l">
          <TempleBell length={104} fill={fill} />
        </div>
        <div className="kv-bell r">
          <TempleBell length={104} fill={fill} />
        </div>
        <div className="kv-lamp l">
          <Kuthuvilakku height={150} fill={fill} />
        </div>
        <div className="kv-lamp r">
          <Kuthuvilakku height={150} fill={fill} />
        </div>
        <div className="kv-kolam">
          <Kolam size={96} color={props.p.inkSoft} />
        </div>
        <CoverText {...props} symbol={0.78} />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Kolam size={200} color={p.inkSoft} />
    </div>
  ),
};

/* ================= Rajwada ================= */

const rajwada: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    return (
      <>
        <DoubleBorder fill={fill} inset={12} gap={5} beads={false} />
        <div className="rj-buti top">
          <ButiBand width={436} color={p.accent} fill={fill} />
        </div>
        <div className="rj-buti bottom">
          <ButiBand width={436} color={p.accent} fill={fill} />
        </div>
        <div className="rj-buti left">
          <ButiBand width={636} color={p.accent} fill={fill} />
        </div>
        <div className="rj-buti right">
          <ButiBand width={636} color={p.accent} fill={fill} />
        </div>
        {kind !== "cover" && (
          <div className="rj-sun-small">
            <MewarSun size={58} fill={fill} hole={p.paper} />
          </div>
        )}
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="rj-arch">
          <CuspedArch width={370} height={500} fill={fill} />
        </div>
        <div className="rj-sun">
          <MewarSun size={112} fill={fill} hole={p.paper} />
        </div>
        <div className="rj-ele l">
          <Elephant width={146} fill={fill} cloth={p.accent} hole={p.paper} />
        </div>
        <div className="rj-ele r">
          <Elephant width={146} fill={fill} cloth={p.accent} hole={p.paper} flip />
        </div>
        <div className="rj-swag">
          <MarigoldSwag width={92} sag={22} />
        </div>
        <CoverText {...props} symbol={0.6} divider="diamond" />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <MewarSun size={190} fill={foilFill(p)} hole={p.paper} />
    </div>
  ),
};

/* ================= Gulmohar ================= */

const gulmohar: WedDesign = {
  Frame: ({ p, kind }) => {
    const cover = kind === "cover";
    return (
      <>
        <div className="gm-wash a">
          <Wash width={320} height={260} color={p.accent} seed={3} opacity={0.18} />
        </div>
        <div className="gm-wash b">
          <Wash width={300} height={240} color={p.accent2} seed={8} opacity={0.2} />
        </div>
        <div className="gm-line" />
        {cover && (
          <svg className="gm-arch" viewBox="0 0 330 520" preserveAspectRatio="none">
            <path d="M0,520 L0,165 A165,165 0 0 1 330,165 L330,520Z" fill="var(--paper2)" opacity={0.65} />
            <path d="M8,520 L8,165 A157,157 0 0 1 322,165 L322,520" fill="none" stroke={foilFill(p)} strokeWidth={1.4} filter="url(#f-foil)" />
          </svg>
        )}
        <div className="gm-corner tr">
          <GulmoharSpray width={cover ? 250 : 170} petal={p.accent} deep={p.wax} leaf={p.accent2} seed={cover ? 2 : 5} />
        </div>
        <div className="gm-corner bl">
          <GulmoharSpray width={cover ? 250 : 170} petal={p.accent} deep={p.wax} leaf={p.accent2} seed={cover ? 7 : 9} flip />
        </div>
      </>
    );
  },
  Cover: (props) => (
    <div className="page-content cover wd-cover">
      <CoverText {...props} symbol={0.62} divider="dots" />
    </div>
  ),
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Wash width={260} height={220} color={p.accent} seed={5} opacity={0.25} />
    </div>
  ),
};

/* ================= Ink & Ivory ================= */

const ink: WedDesign = {
  Frame: ({ kind }) => (
    <>
      <div className="ii-rule" />
      {kind === "cover" && <div className="ii-rule inner" />}
    </>
  ),
  Cover: ({ d, t, p }) => {
    const env = useCardEnv();
    const [a, b] = coupleOrder(d);
    const ini = initials(a.name, b?.name);
    const [y, m, dd] = d.mainDateTime.split("T")[0].split("-");
    return (
      <div className="page-content cover wd-cover">
        <div className="ii-top">
          {d.symbol !== "none" && <SymbolMark d={d} t={t} p={p} size={0.42} />}
          {d.mantra && <div className="mantra">{d.mantra}</div>}
          <div className="eyebrow">{d.eyebrow}</div>
        </div>
        <div className="ii-mono">
          <Laurel size={300} color={p.inkSoft} />
          <div className="ii-letters">
            {ini.split("").map((c, i) => (
              <span key={i} className={i ? "two" : "one"}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <h1 className="ii-names">
          {a.name}
          {b?.name && (
            <>
              <span className="joiner"> {d.joiner === "weds" ? "&" : d.joiner || "&"} </span>
              {b.name}
            </>
          )}
        </h1>
        <div className="ii-date">
          {dd} <i>·</i> {m} <i>·</i> {y}
        </div>
        {env.guest && (
          <div className="cover-guest">
            <span>For</span> {env.guest}
          </div>
        )}
      </div>
    );
  },
  Back: () => <div className="wd-back-mark ii-back" />,
};

/* ================= Pichwai ================= */

const pichwai: WedDesign = {
  Frame: ({ p, kind }) => {
    const fill = foilFill(p);
    const cover = kind === "cover";
    return (
      <>
        <DoubleBorder fill={fill} inset={14} gap={6} beads={!cover} />
        <div className="pw-swags">
          <JasmineSwags width={444} swags={cover ? 5 : 4} drop={cover ? 30 : 22} />
        </div>
        <div className="pw-pond-wrap" style={{ height: cover ? 150 : 74 }}>
          <LotusPond width={468} height={cover ? 150 : 74} water={p.paper2} gold={fill} petal={p.accent2} seed={cover ? 4 : 6} />
        </div>
      </>
    );
  },
  Cover: (props) => {
    const { p } = props;
    const fill = foilFill(p);
    return (
      <div className="page-content cover wd-cover">
        <div className="pw-mandala">
          <LotusTop size={400} fill={fill} opacity={0.3} />
        </div>
        <div className="pw-cow l">
          <Cow width={118} cloth={p.accent} gold={fill} />
        </div>
        <div className="pw-cow r">
          <Cow width={118} cloth={p.accent} gold={fill} flip />
        </div>
        <CoverText {...props} symbol={0.66} />
      </div>
    );
  },
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <LotusTop size={220} fill={foilFill(p)} opacity={0.35} />
    </div>
  ),
};

export const WED_DESIGNS: Record<string, WedDesign> = { kovil, rajwada, gulmohar, ink, pichwai };
