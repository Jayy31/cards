"use client";

import type { CSSProperties, ReactNode } from "react";
import { firstName, gujPalette, initial, peopleOf, type GujCardData, type GujPerson, type GujPhoneLabel } from "@/lib/gujarati";
import { Fit } from "./Fit";

/*
 * Eight single-side Gujarati visiting cards, 700 × 400 (3.5 × 2 in).
 * Rules every design follows, because one set of details is applied to all of them:
 *  - no trade-specific motifs (a kirana's details must look right on the "clinic" design too);
 *  - every text slot shrinks to fit (<Fit>), and empty fields leave no gap;
 *  - everything important stays 28 px inside the edge (≈3.5 mm print safe zone).
 */

/* ---------- shared bits ---------- */

const ICONS = {
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z",
  landline: "M2.5 9.6C2.5 6.8 6.8 4.5 12 4.5s9.5 2.3 9.5 5.1v1.9h-4.3V9.6c-1.3-.5-3.1-.8-5.2-.8s-3.9.3-5.2.8v1.9H2.5zM6.6 12.3h10.8l2.6 7.2H4zM12 13.6a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z",
  whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.9a8.1 8.1 0 1 1-4.2 15l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 0 1 12 3.9zM8.9 7.3c-.2 0-.5 0-.8.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.6 0 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.6-.4-2.1-1c-.3-.1-.5-.2-.7.1l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5z",
  mail: "M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm1.4 2 7.6 5.3L19.6 7H4.4zM20 8.7l-7.4 5.1a1 1 0 0 1-1.2 0L4 8.7V17h16V8.7z",
  pin: "M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z",
};
type IconName = keyof typeof ICONS;
const PHONE_ICON: Record<GujPhoneLabel, IconName> = { mobile: "phone", office: "landline", whatsapp: "whatsapp" };
/** Printed prefixes on the traditional designs (Pedhi, Toran); WhatsApp gets its icon instead. */
const PHONE_PREFIX: Record<GujPhoneLabel, string> = { mobile: "મો. ", office: "ફોન ", whatsapp: "" };

export function Icon({ name, size = 14 }: { name: IconName; size?: number }) {
  return (
    <svg className="gc-ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d={ICONS[name]} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Logo if uploaded, otherwise a monogram from the business name (or nothing when `optional`). */
function Mark({ d, className, optional }: { d: GujCardData; className?: string; optional?: boolean }) {
  if (d.logo) return <span className={`gc-mark has-logo ${className ?? ""}`}><img src={d.logo} alt="" /></span>;
  if (optional) return null;
  return (
    <span className={`gc-mark ${className ?? ""}`}>
      <b>{initial(d.business)}</b>
    </span>
  );
}

/**
 * Phone numbers as lines: one per person and label, numbers joined with " · ".
 * With several people, each line is tagged with the person's first name ("રમેશભાઈ: 98250 12345").
 */
type PhoneLine = { label: GujPhoneLabel; numbers: string[]; who?: string };
function phoneLines(d: GujCardData): PhoneLine[] {
  const ps = peopleOf(d);
  const multi = ps.length > 1;
  const out: PhoneLine[] = [];
  for (const p of ps) {
    const groups = new Map<GujPhoneLabel, string[]>();
    for (const ph of p.phones) {
      const l = ph.label ?? "mobile";
      groups.set(l, [...(groups.get(l) ?? []), ph.number.trim()]);
    }
    for (const [label, numbers] of groups) out.push({ label, numbers, who: multi ? firstName(p.name) || undefined : undefined });
  }
  return out;
}
const lineText = (l: PhoneLine, sep = " · ", prefix = "") => `${l.who ? `${l.who}: ` : ""}${prefix}${l.numbers.join(sep)}`;

type Row = { k: IconName; text: string; cls: string };

/** Stacked contact lines with icons. Phones and email stay on one line each; the address may take two. */
function Contacts({ d, size = 14, icon = 13, className }: { d: GujCardData; size?: number; icon?: number; className?: string }) {
  const list: Row[] = phoneLines(d).map((l) => ({ k: PHONE_ICON[l.label], text: lineText(l), cls: "gc-phone" }));
  if (d.email) list.push({ k: "mail", text: d.email, cls: "gc-email" });
  if (d.address) list.push({ k: "pin", text: d.address, cls: "gc-addr" });
  if (!list.length) return null;
  // more lines → a little smaller, so the block still fits its column
  const k = list.length >= 6 ? 0.8 : list.length === 5 ? 0.88 : 1;
  return (
    <div className={`gc-contacts ${className ?? ""}`}>
      {list.map((r, i) => (
        <div key={i} className={`gc-row ${r.cls}`}>
          <i className="gc-ib">
            <Icon name={r.k} size={icon} />
          </i>
          <Fit as="span" text={r.text} max={size * k} min={size * k * 0.62} />
        </div>
      ))}
    </div>
  );
}

/** Names (and titles) of everyone on the card, stacked. */
function Owner({ d, max = 18, className }: { d: GujCardData; max?: number; className?: string }) {
  const ps = peopleOf(d).filter((p) => p.name || p.role);
  if (!ps.length) return null;
  const m = ps.length > 1 ? max * 0.86 : max;
  return (
    <div className={`gc-owner ${ps.length > 1 ? "many" : ""} ${className ?? ""}`}>
      {ps.map((p, i) => (
        <div key={i} className="gc-person">
          {p.name && <Fit className="gc-oname" text={p.name} max={m} />}
          {p.role && <Fit className="gc-orole" text={p.role} max={Math.round(m * 0.74)} />}
        </div>
      ))}
    </div>
  );
}

function Desc({ d, max = 16, className }: { d: GujCardData; max?: number; className?: string }) {
  if (!d.description) return null;
  return <Fit className={`gc-desc ${className ?? ""}`} text={d.description} max={max} min={max * 0.62} />;
}

function Card({ id, children, flat, vars }: { id: string; children: ReactNode; flat?: boolean; vars?: Record<string, string> }) {
  return (
    <div className={`gc gc-${id} ${flat ? "flat" : ""}`} style={vars as CSSProperties}>
      {children}
    </div>
  );
}

/* ---------- 1. Pedhi: the classic bazaar card (pure Gujarati) ---------- */
/** Phone lines of one person in the traditional style: "મો. ૯૮૨૫૦ ૧૨૩૪૫", "ફોન …", WhatsApp with its icon. */
function PedhiNumbers({ p, max }: { p: GujPerson; max: number }) {
  return (
    <>
      {phoneLines({ business: "", people: [p] }).map((l, i) => (
        <div key={i} className="pd-num">
          {l.label === "whatsapp" && <Icon name="whatsapp" size={Math.round(max * 0.8)} />}
          <Fit as="span" text={lineText(l, ", ", PHONE_PREFIX[l.label])} max={max} min={max * 0.6} />
        </div>
      ))}
    </>
  );
}

/** Top corners: one person → name left, numbers right; 2–3 people → a block each (left, right, centre). */
function PedhiTop({ d }: { d: GujCardData }) {
  const ps = peopleOf(d);
  if (!ps.length) return <div className="pd-top" />;
  if (ps.length === 1)
    return (
      <div className="pd-top">
        <Owner d={d} max={20} />
        <div className="pd-nums">
          <PedhiNumbers p={ps[0]} max={20} />
        </div>
      </div>
    );
  return (
    <div className={`pd-top many n${ps.length}`}>
      {ps.map((p, i) => (
        <div key={i} className="pd-person">
          {p.name && <Fit className="gc-oname" text={p.name} max={ps.length > 2 ? 16 : 18} />}
          {p.role && <Fit className="gc-orole" text={p.role} max={12} />}
          <PedhiNumbers p={p} max={ps.length > 2 ? 15 : 17} />
        </div>
      ))}
    </div>
  );
}
function Pedhi({ d }: { d: GujCardData }) {
  return (
    <>
      <div className="pd-frame" />
      <PedhiTop d={d} />
      <div className="pd-mid">
        <div className="pd-head">
          <Mark d={d} optional />
          <Fit as="h1" className="gc-biz" text={d.business} max={54} min={26} />
        </div>
        <svg className="pd-rule" viewBox="0 0 300 12" aria-hidden>
          <path d="M0 6h128M172 6h128" stroke="currentColor" strokeWidth="1.6" />
          <path d="M150 0l7 6-7 6-7-6z M136 6l4-3 4 3-4 3z M164 6l-4-3-4 3 4 3z" fill="currentColor" />
        </svg>
        <Desc d={d} max={19.5} />
      </div>
      {(d.address || d.email) && (
        <div className="pd-band">
          {d.address && <Fit as="span" className="pd-addr" text={d.address} max={17.5} min={11} />}
          {d.email && <Fit as="span" className="pd-mail" text={d.email} max={15.5} min={11} />}
        </div>
      )}
    </>
  );
}

/* ---------- 2. Sonu Chandi: maroon & gold, ornate frame (pure Gujarati) ---------- */
function Corner({ className }: { className: string }) {
  return (
    <svg className={`sc-corner ${className}`} viewBox="0 0 60 60" aria-hidden>
      <path d="M4 56V22C4 12 12 4 22 4h34" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 56V24c0-8 6-14 14-14h32" fill="none" stroke="currentColor" strokeWidth=".8" />
      <path d="M17 17c6-8 18-6 18 3 0 6-8 7-10 2-1-3 2-5 4-3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="17" cy="17" r="2.6" fill="currentColor" />
      <circle cx="40" cy="10" r="1.4" fill="currentColor" />
      <circle cx="10" cy="40" r="1.4" fill="currentColor" />
    </svg>
  );
}

function SonuChandi({ d }: { d: GujCardData }) {
  return (
    <>
      <div className="sc-frame" />
      <Corner className="tl" />
      <Corner className="tr" />
      <Corner className="bl" />
      <Corner className="br" />
      <div className="sc-left">
        <div className="sc-medal">
          <Mark d={d} />
        </div>
        <Owner d={d} max={19} />
      </div>
      <div className="sc-right">
        <Fit as="h1" className="gc-biz" text={d.business} max={46} min={22} />
        <svg className="sc-rule" viewBox="0 0 260 10" aria-hidden>
          <path d="M0 5h112M148 5h112" stroke="currentColor" strokeWidth="1" />
          <path d="M130 0l6 5-6 5-6-5z" fill="currentColor" />
          <circle cx="118" cy="5" r="1.6" fill="currentColor" />
          <circle cx="142" cy="5" r="1.6" fill="currentColor" />
        </svg>
        <Desc d={d} max={18} />
        <Contacts d={d} size={17} icon={15} />
      </div>
    </>
  );
}

/* ---------- 3. Keri: paisley panel, saree border (pure Gujarati) ---------- */
function Paisley({ x, y, s, r }: { x: number; y: number; s: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 18C-14 18-18 2-10-8 0-20 18-22 14-34 26-22 22 4 10 14 6 17 3 18 0 18z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M0 10C-7 10-9 2-5-4 0-10 8-11 7-17 12-10 10 2 4 7z" fill="currentColor" opacity=".55" />
      <circle cx="-2" cy="2" r="2" style={{ fill: "var(--gold)" }} />
    </g>
  );
}

function Keri({ d }: { d: GujCardData }) {
  const spots = [
    [44, 52, 1, -20], [130, 34, 0.8, 30], [96, 120, 1.1, 10], [30, 190, 0.9, -40], [150, 200, 0.75, 60],
    [80, 270, 1, -10], [140, 330, 0.85, 25], [40, 360, 0.8, -30], [170, 110, 0.6, -60],
  ];
  return (
    <>
      <div className="kr-panel">
        <svg className="kr-pattern" viewBox="0 0 200 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
          {spots.map(([x, y, s, r], i) => (
            <Paisley key={i} x={x} y={y} s={s} r={r} />
          ))}
        </svg>
        <svg className="kr-edge" viewBox="0 0 24 400" preserveAspectRatio="none" aria-hidden>
          <path d={`M0 0${Array.from({ length: 20 }, (_, i) => `Q24 ${i * 20 + 10} 0 ${i * 20 + 20}`).join("")}V400H0z`} fill="currentColor" />
        </svg>
        <div className="kr-medal">
          <Mark d={d} />
        </div>
      </div>
      <div className="kr-body">
        <Fit as="h1" className="gc-biz" text={d.business} max={44} min={20} />
        <Owner d={d} max={20} />
        <Desc d={d} max={17} />
        <Contacts d={d} size={16.5} icon={15} />
      </div>
      <svg className="kr-border" viewBox="0 0 500 16" preserveAspectRatio="none" aria-hidden>
        <rect width="500" height="16" style={{ fill: "var(--second)" }} />
        <path d={Array.from({ length: 50 }, (_, i) => `M${i * 10} 16l5-9 5 9z`).join("")} style={{ fill: "var(--panel)" }} />
        <path d={Array.from({ length: 50 }, (_, i) => `M${i * 10 + 5} 5.5l1.6-1.6 1.6 1.6-1.6 1.6z`).join("")} style={{ fill: "var(--gold)" }} transform="translate(-1.6 0)" />
      </svg>
    </>
  );
}

/* ---------- 4. Toran: marigold & mango-leaf toran (pure Gujarati) ---------- */
function ToranArt() {
  const n = 14;
  const step = 700 / n;
  return (
    <svg className="tr-toran" viewBox="0 0 700 70" aria-hidden>
      <path d="M0 8Q350 22 700 8" fill="none" stroke="#8a5a20" strokeWidth="2" />
      {Array.from({ length: n }, (_, i) => {
        const x = step * (i + 0.5);
        const y = 8 + 14 * (1 - ((x - 350) / 350) ** 2) * 0.5;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0 0C-10 14-9 32 0 44 9 32 10 14 0 0z" style={{ fill: i % 2 ? "var(--leaf1)" : "var(--leaf2)" }} />
            <path d="M0 3V42" style={{ stroke: "var(--leaf-vein)" }} strokeWidth=".9" />
            <path d="M0 14l-5-4M0 22l-6-4M0 30l-5-4M0 14l5-4M0 22l6-4M0 30l5-4" style={{ stroke: "var(--leaf-vein)" }} strokeWidth=".6" />
          </g>
        );
      })}
      {Array.from({ length: n + 1 }, (_, i) => {
        const x = step * i;
        const y = 8 + 14 * (1 - ((x - 350) / 350) ** 2) * 0.5;
        const c = i % 2 ? "var(--fl2)" : "var(--fl1)";
        return (
          <g key={`m${i}`} transform={`translate(${x} ${y + 4})`}>
            <circle r="10" style={{ fill: c }} />
            <circle r="10" fill="none" style={{ stroke: "var(--fl-core)" }} strokeWidth=".8" strokeDasharray="2 2.4" opacity=".7" />
            <circle r="6" fill="none" style={{ stroke: "var(--band-dot)" }} strokeWidth="1" strokeDasharray="1.5 2" opacity=".8" />
            <circle r="2.4" style={{ fill: "var(--fl-core)" }} />
          </g>
        );
      })}
    </svg>
  );
}

function Toran({ d }: { d: GujCardData }) {
  const ps = peopleOf(d).filter((p) => p.name);
  const names = ps.length === 1 && ps[0].role ? `${ps[0].name} · ${ps[0].role}` : ps.map((p) => p.name).join(" · ");
  const lines = phoneLines(d);
  return (
    <>
      <ToranArt />
      <div className="tr-body">
        <div className="tr-head">
          <Mark d={d} optional />
          <Fit as="h1" className="gc-biz" text={d.business} max={56} min={26} />
        </div>
        {names && <Fit className="tr-owner" text={names} max={20} />}
        <Desc d={d} max={17.5} />
        <div className="tr-contact">
          {lines.map((l, i) => (
            <span key={i} className="tr-phone">
              {l.label === "whatsapp" && <Icon name="whatsapp" size={17} />}
              <Fit as="span" text={lineText(l, ", ", PHONE_PREFIX[l.label])} max={lines.length > 2 ? 17 : 20} min={12} />
            </span>
          ))}
          {d.email && <Fit as="span" className="tr-mail" text={d.email} max={16} min={11} />}
        </div>
        {d.address && <Fit className="tr-addr" text={d.address} max={16.5} min={11} />}
      </div>
      <div className="tr-band" />
    </>
  );
}

/* ---------- 5. Nakkar: bold blue band, yellow stripe (mixed) ---------- */
function Nakkar({ d }: { d: GujCardData }) {
  return (
    <>
      <div className="nk-band">
        <Mark d={d} />
        <Owner d={d} max={19} />
      </div>
      <div className="nk-stripe" />
      <div className="nk-body">
        <Fit as="h1" className="gc-biz" text={d.business} max={44} min={20} />
        <Desc d={d} max={18} />
        <Contacts d={d} size={17} icon={14} />
      </div>
    </>
  );
}

/* ---------- 6. Tulsi: white & green, calm waves (mixed) ---------- */
function Tulsi({ d }: { d: GujCardData }) {
  return (
    <>
      <svg className="tl-waves" viewBox="0 0 300 220" aria-hidden>
        <path d="M300 30C210 40 200 120 120 150 70 168 30 190 0 220h300z" style={{ fill: "var(--w1)" }} />
        <path d="M300 80C230 90 220 160 150 180 110 192 80 205 60 220h240z" style={{ fill: "var(--w2)" }} opacity=".75" />
        <path d="M300 130C250 140 240 190 190 210l-30 10h140z" style={{ fill: "var(--g)" }} />
        <path d="M244 52c10-20 34-24 44-20-4 14-22 30-44 20zM244 52c-6-16 2-34 12-40 6 12 2 32-12 40z" style={{ fill: "var(--g-mid)" }} opacity=".5" />
      </svg>
      <div className="tl-body">
        <div className="tl-head">
          <Mark d={d} />
          <Fit as="h1" className="gc-biz" text={d.business} max={38} min={18} />
        </div>
        <i className="tl-line" />
        <Owner d={d} max={23} />
        <Desc d={d} max={17} />
        <Contacts d={d} size={16.5} icon={14} />
      </div>
    </>
  );
}

/* ---------- 7. Pathshala: sunny, friendly shapes (mixed) ---------- */
function Pathshala({ d }: { d: GujCardData }) {
  return (
    <>
      <svg className="ps-shapes" viewBox="0 0 700 400" aria-hidden>
        <path d="M590-40C700-60 790 20 755 140 725 240 625 222 588 172 550 122 474 108 492 40 502 0 542-30 590-40z" style={{ fill: "var(--main)" }} />
        <circle cx="30" cy="390" r="74" style={{ fill: "var(--pop)" }} />
        <circle cx="660" cy="372" r="40" style={{ fill: "var(--sun)" }} />
        <path d="M120 372c30-24 60 24 90 0s60 24 90 0" fill="none" style={{ stroke: "var(--main)" }} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" />
        <g style={{ fill: "var(--pop)" }}>
          <circle cx="470" cy="226" r="5" />
          <circle cx="490" cy="250" r="3" />
          <circle cx="612" cy="268" r="4" />
        </g>
        <path d="M430 34l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z" style={{ fill: "var(--sun)" }} />
      </svg>
      <div className="ps-mark">
        <Mark d={d} />
      </div>
      <div className="ps-body">
        <Fit as="h1" className="gc-biz" text={d.business} max={46} min={20} />
        <Owner d={d} max={20} />
        <Desc d={d} max={17} />
        <div className="ps-chips">
          {phoneLines(d).map((l, i, all) => (
            <span key={i} className="ps-chip">
              <Icon name={PHONE_ICON[l.label]} size={14} />
              <Fit as="span" text={lineText(l)} max={all.length > 2 ? 14.5 : 16.5} min={10} />
            </span>
          ))}
          {d.email && (
            <span className="ps-chip">
              <Icon name="mail" size={14} />
              <Fit as="span" text={d.email} max={15.5} min={10.5} />
            </span>
          )}
        </div>
        {d.address && (
          <div className="ps-addr">
            <Icon name="pin" size={15} />
            <Fit as="span" text={d.address} max={16} min={11} />
          </div>
        )}
      </div>
    </>
  );
}

/* ---------- 8. Shilp: charcoal & champagne, architectural lines (mixed) ---------- */
function Shilp({ d }: { d: GujCardData }) {
  return (
    <>
      <svg className="sh-lines" viewBox="0 0 700 400" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth=".7">
          <path d="M470 0L700 230M520 0L700 180M570 0L700 130M620 0L700 80" />
          <path d="M700 0L560 140 620 200" />
        </g>
      </svg>
      <div className="sh-left">
        <Fit as="h1" className="gc-biz" text={d.business} max={40} min={18} />
        <i className="sh-rule" />
        <Desc d={d} max={17} />
        <Owner d={d} max={20} className="sh-own" />
      </div>
      <div className="sh-right">
        <div className="sh-mark">
          <Mark d={d} />
        </div>
        <Contacts d={d} size={16} icon={14} />
      </div>
    </>
  );
}

/* ---------- registry ---------- */

export const GUJ_DESIGNS: Record<string, (p: { d: GujCardData }) => ReactNode> = {
  "gu-pedhi": Pedhi,
  "gu-sonu": SonuChandi,
  "gu-keri": Keri,
  "gu-toran": Toran,
  "gu-nakkar": Nakkar,
  "gu-tulsi": Tulsi,
  "gu-pathshala": Pathshala,
  "gu-shilp": Shilp,
};

/** One card at its true size (700 × 400). `flat` drops the paper grain (for print export). */
export function GujCard({ id, d, flat, theme }: { id: string; d: GujCardData; flat?: boolean; theme?: string }) {
  const D = GUJ_DESIGNS[id];
  if (!D) return null;
  return (
    <Card id={id} flat={flat} vars={gujPalette(id, theme)?.vars}>
      <D d={d} />
    </Card>
  );
}
