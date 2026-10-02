"use client";
import React from "react";
import type { EventItem, InviteData, Palette, PersonBlock, Template } from "@/lib/types";
import { cos, sin, countdownParts, dateParts, fmtLongDate, fmtShortDate, fmtTime, initials, mapsUrl, parseLocal, rng } from "@/lib/format";
import { useCardEnv, useNow } from "./CardEnv";
import { foilFill, isDark, themeVars } from "./theme";
import {
  Corners,
  Crescent,
  Cross,
  DecoFrame,
  Diya,
  Divider,
  DoubleBorder,
  FloralCluster,
  JharokhaArch,
  Kalash,
  Khanda,
  Lotus,
  Mandala,
  Rangoli,
  Rings,
  Swastik,
  Toran,
} from "./ornaments";
import { coupleOrder } from "@/lib/wedding";
import { festival } from "@/lib/festival";
import { WED_DESIGNS as WD1 } from "@/components/wedding/designs";
import { WED_DESIGNS_2 } from "@/components/wedding/designs2";
import { WED_DESIGNS_3 } from "@/components/wedding/designs3";

import { SIGNATURE_DESIGNS } from "@/components/wedding/sig";
import { FESTIVAL_DESIGNS } from "@/components/festival";

// built on first use, so modules that import this one (a cycle) are fully loaded by then
let registry: Record<string, import("@/components/wedding/designs").WedDesign> | null = null;
const WED_DESIGNS = new Proxy({} as Record<string, import("@/components/wedding/designs").WedDesign>, {
  get: (_t, k: string) => (registry ??= { ...WD1, ...WED_DESIGNS_2, ...WED_DESIGNS_3, ...SIGNATURE_DESIGNS, ...FESTIVAL_DESIGNS })[k],
});

export type PageKind = "cover" | "names" | "message" | "story" | "events" | "family" | "venue" | "info" | "closing";

export interface PageSpec {
  key: string;
  kind: PageKind;
  label: string;
  events?: EventItem[];
}

const EVENTS_PER_PAGE = 3;

/** Turns data into the ordered list of physical pages of the booklet. */
export function buildPages(t: Template, d: InviteData): PageSpec[] {
  const pages: PageSpec[] = [{ key: "cover", kind: "cover", label: "Cover" }];
  if (t.category === "festival") {
    // a greeting: cover, the message, an optional celebration, family, sign-off
    pages.push({ key: "message", kind: "message", label: "Message" });
    const evs = d.events;
    for (let i = 0; i < Math.ceil(evs.length / EVENTS_PER_PAGE); i++) {
      pages.push({ key: `events-${i}`, kind: "events", label: i ? "Celebration (cont.)" : "Celebration", events: evs.slice(i * EVENTS_PER_PAGE, (i + 1) * EVENTS_PER_PAGE) });
    }
    if (evs.length) pages.push({ key: "venue", kind: "venue", label: "Venue & RSVP" });
    if (d.family.enabled && (d.family.names.length || d.family.kids.length)) pages.push({ key: "family", kind: "family", label: "Family" });
    pages.push({ key: "closing", kind: "closing", label: "Wishes" });
    return pages;
  }
  pages.push({ key: "names", kind: "names", label: d.secondary?.name ? "Couple" : "Invitation" });
  if (hasStory(d)) pages.push({ key: "story", kind: "story", label: d.story!.title || "Our Story" });
  const evs = d.events;
  for (let i = 0; i < Math.max(1, Math.ceil(evs.length / EVENTS_PER_PAGE)); i++) {
    pages.push({ key: `events-${i}`, kind: "events", label: i ? "Events (cont.)" : "Events", events: evs.slice(i * EVENTS_PER_PAGE, (i + 1) * EVENTS_PER_PAGE) });
  }
  if (d.family.enabled && (d.family.names.length || d.family.kids.length)) pages.push({ key: "family", kind: "family", label: "Family" });
  pages.push({ key: "venue", kind: "venue", label: "Venue & RSVP" });
  if (hasInfo(d)) pages.push({ key: "info", kind: "info", label: "Good to Know" });
  pages.push({ key: "closing", kind: "closing", label: "Blessings" });
  return pages;
}

export const hasStory = (d: InviteData) => !!d.story?.enabled && !!(d.story.text.trim() || d.story.photos.length);
export const hasInfo = (d: InviteData) => !!((d.info ?? []).some((i) => i.value.trim()) || d.hashtag?.trim() || d.livestream?.trim());

/** Event link: the exact map link if the user pasted one, else a search for venue + address. */
const eventMap = (e: EventItem) => e.mapUrl?.trim() || mapsUrl(e);

/* ---------------- shared bits ---------------- */

export function Paper({ t, p, children, className = "" }: { t: Template; p: Palette; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-page paper-${t.paper} orn-${t.ornament} ${t.wed ? `wd wd-${t.wed.design}` : ""} ${t.signature ? "sig" : ""} ${isDark(p.paper) ? "is-dark" : "is-light"} ${className}`} style={themeVars(t, p)}>
      <div className="paper-grain" />
      <div className="paper-light" />
      {children}
      <div className="paper-sheen" />
    </div>
  );
}

function Frame({ t, p, kind }: { t: Template; p: Palette; kind: PageKind }) {
  const fill = foilFill(p);
  switch (t.ornament) {
    case "jharokha":
      return (
        <>
          <DoubleBorder fill={fill} />
          <Corners fill={fill} size={kind === "cover" ? 104 : 88} inset={20} />
        </>
      );
    case "blossom":
      return (
        <>
          <DoubleBorder fill={fill} inset={18} gap={5} beads={false} />
          <div className="floral tl">
            <FloralCluster width={kind === "cover" ? 340 : 250} flower={p.accent} leaf={p.accent2} seed={kind.length * 3 + 1} />
          </div>
          <div className="floral br">
            <FloralCluster width={kind === "cover" ? 340 : 250} flower={p.accent} leaf={p.accent2} seed={kind.length * 5 + 2} flip />
          </div>
        </>
      );
    case "mandala":
      return (
        <>
          <DoubleBorder fill={fill} inset={16} gap={7} />
          <div className="mandala-corner tl">
            <Mandala size={220} fill={fill} seed={3} opacity={0.9} />
          </div>
          <div className="mandala-corner br">
            <Mandala size={220} fill={fill} seed={3} opacity={0.9} />
          </div>
        </>
      );
    case "deco":
      return <DecoFrame fill={fill} />;
    case "toran":
    case "rangoli":
      return (
        <>
          <DoubleBorder fill={fill} inset={14} gap={6} />
          <div className="toran-top">
            <Toran width={472} marigold={t.ornament === "toran" ? p.accent : "#f28c0f"} leaf={t.ornament === "toran" ? p.accent2 : "#2f6b2a"} seed={kind.length} />
          </div>
          {t.ornament === "rangoli" && kind !== "cover" && (
            <div className="rangoli-bottom">
              <Rangoli size={240} colors={[p.accent, p.accent2, "#f4b400", p.accent, "#c2185b"]} />
            </div>
          )}
        </>
      );
  }
}

export function SymbolMark({ d, t, p, size = 1 }: { d: InviteData; t: Template; p: Palette; size?: number }) {
  const fill = foilFill(p);
  const framed = (src: string, pos: string) => (
    <div className="deity" style={{ width: 118 * size, height: 150 * size }}>
      <div className="deity-img" style={{ backgroundImage: `url(${JSON.stringify(src)})`, backgroundPosition: pos }} />
      <svg className="deity-frame" viewBox="0 0 118 150" preserveAspectRatio="none">
        <g filter="url(#f-foil)">
          <ellipse cx={59} cy={75} rx={55} ry={71} fill="none" stroke={fill} strokeWidth={5} />
          <ellipse cx={59} cy={75} rx={49} ry={65} fill="none" stroke={fill} strokeWidth={1} />
          {Array.from({ length: 40 }, (_, i) => {
            const a = (i / 40) * Math.PI * 2;
            return <circle key={i} cx={59 + cos(a) * 55} cy={75 + sin(a) * 71} r={1.7} fill={fill} />;
          })}
        </g>
      </svg>
    </div>
  );
  switch (d.symbol) {
    case "ganesha":
      return framed("/art/ganesha-mangalmurti.jpg", "47% 14%");
    case "ganesha-riddhi":
      return framed("/art/ganesha-riddhi-siddhi.jpg", "50% 30%");
    case "custom":
      return d.symbolImage ? framed(d.symbolImage, "50% 30%") : null;
    case "om":
      return <div className="om foil-text" style={{ fontSize: 76 * size }}>ॐ</div>;
    case "kalash":
      return <Kalash size={96 * size} fill={fill} leaf={t.ornament === "toran" || t.ornament === "rangoli" ? p.accent2 : "#3e7d2c"} accent={p.accent} />;
    case "lotus":
      return <Lotus size={110 * size} fill={fill} />;
    case "diya":
      return <Diya size={96 * size} fill={fill} />;
    case "swastik":
      return <Swastik size={88 * size} fill={fill} accent={p.accent} />;
    case "khanda":
      return <Khanda size={92 * size} fill={fill} />;
    case "crescent":
      return <Crescent size={92 * size} fill={fill} />;
    case "cross":
      return <Cross size={80 * size} fill={fill} />;
    default:
      return null;
  }
}

function Monogram({ d, p }: { d: InviteData; p: Palette }) {
  const fill = foilFill(p);
  return (
    <div className="monogram">
      <svg viewBox="0 0 120 120" width={112} height={112}>
        <g filter="url(#f-foil)" fill="none" stroke={fill}>
          <circle cx={60} cy={60} r={54} strokeWidth={2.2} />
          <circle cx={60} cy={60} r={49} strokeWidth={0.8} />
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2;
            return <circle key={i} cx={60 + cos(a) * 58} cy={60 + sin(a) * 58} r={1.2} fill={fill} stroke="none" />;
          })}
        </g>
      </svg>
      <span className="monogram-text foil-text">{initials(coupleOrder(d)[0].name, coupleOrder(d)[1]?.name).split("").join(" · ")}</span>
    </div>
  );
}

function Photo({ src }: { src: string }) {
  return (
    <div className="photo-medallion">
      <div className="photo-img" style={{ backgroundImage: `url(${JSON.stringify(src)})` }} />
    </div>
  );
}

/* ---------------- pages ---------------- */

function Cover({ d, t, p }: { d: InviteData; t: Template; p: Palette }) {
  const env = useCardEnv();
  const fill = foilFill(p);
  const main = d.mainDateTime.split("T")[0];
  return (
    <div className="page-content cover">
      {t.ornament === "jharokha" && (
        <div className="arch-wrap">
          <JharokhaArch fill={fill} width={372} height={560} />
        </div>
      )}
      {t.ornament === "mandala" && (
        <div className="cover-mandala">
          <Mandala size={430} fill={fill} seed={11} opacity={0.22} filter="none" />
        </div>
      )}
      {t.ornament === "rangoli" && (
        <div className="cover-rangoli">
          <Rangoli size={380} colors={[p.accent, p.accent2, "#f4b400", "#c2185b", p.accent]} />
        </div>
      )}
      <div className="cover-stack">
        {d.mantra && <div className="mantra foil-text">{d.mantra}</div>}
        {t.ornament === "deco" && d.symbol === "none" ? <Rings size={150} fill={fill} /> : <SymbolMark d={d} t={t} p={p} size={t.ornament === "jharokha" ? 0.95 : 0.9} />}
        <div className="eyebrow">{d.eyebrow}</div>
        {d.secondary?.name ? (
          <h1 className="names-script foil-text">
            <span>{coupleOrder(d)[0].name}</span>
            <span className="joiner">{d.joiner || "&"}</span>
            <span>{coupleOrder(d)[1]!.name}</span>
          </h1>
        ) : (
          <h1 className="title-display foil-text">{d.primary.name}</h1>
        )}
        <Divider fill={fill} width={200} kind={t.ornament === "deco" ? "diamond" : "lotus"} />
        <div className="cover-date">{fmtLongDate(main)}</div>
        {env.guest && (
          <div className="cover-guest">
            <span>Dear</span> {env.guest}
          </div>
        )}
      </div>
    </div>
  );
}

function Names({ d, t, p }: { d: InviteData; t: Template; p: Palette }) {
  const fill = foilFill(p);
  const couple = !!d.secondary?.name;
  const [first, second] = coupleOrder(d);
  return (
    <div className="page-content names">
      <p className="blessing">{d.blessingLine}</p>
      <div className="hosts">{d.hosts}</div>
      <p className="invite-text">{d.inviteText}</p>
      {d.photo ? <Photo src={d.photo} /> : couple ? <Monogram d={d} p={p} /> : <SymbolMark d={{ ...d, symbol: d.symbol === "none" ? "diya" : d.symbol }} t={t} p={p} size={0.7} />}
      {couple ? (
        <>
          <Person b={first} />
          <div className="joiner-big foil-text">{d.joiner || "&"}</div>
          <Person b={second!} />
        </>
      ) : (
        <div className="person solo">
          <div className="title-display foil-text">{d.primary.name}</div>
          {d.primary.subtitle && <div className="person-sub">{d.primary.subtitle}</div>}
        </div>
      )}
      <Divider fill={fill} width={170} kind="dots" />
      {d.quote && <p className="quote">“{d.quote}”</p>}
    </div>
  );
}

function Person({ b }: { b: PersonBlock }) {
  return (
    <div className="person">
      <div className="person-name foil-text">{b.name}</div>
      {b.nameLocal && <div className="person-local">{b.nameLocal}</div>}
      {b.subtitle && <div className="person-sub">{b.subtitle}</div>}
      {b.parents && <div className="person-par">{b.parents}</div>}
    </div>
  );
}

function EventBlock({ e, t, p }: { e: EventItem; t: Template; p: Palette }) {
  const env = useCardEnv();
  const dp = dateParts(e.date);
  const fill = foilFill(p);
  const interactive = env.mode === "live";
  return (
    <div className="event">
      <div className="event-date">
        <svg className="event-badge" viewBox="0 0 70 84">
          <g filter="url(#f-foil)" fill="none" stroke={fill}>
            <path d="M6,20 Q6,6 20,6 L50,6 Q64,6 64,20 L64,64 Q64,78 50,78 L20,78 Q6,78 6,64Z" strokeWidth={1.6} />
            <path d="M11,22 Q11,11 22,11 L48,11 Q59,11 59,22 L59,62 Q59,73 48,73 L22,73 Q11,73 11,62Z" strokeWidth={0.6} />
          </g>
        </svg>
        <span className="ed-day foil-text">{dp.day}</span>
        <span className="ed-mon">{dp.month.slice(0, 3)}</span>
      </div>
      <div className="event-body">
        <div className="event-name foil-text">{e.name}</div>
        <div className="event-when">
          {dp.weekday} · {fmtTime(e.time)}
        </div>
        <div className="event-venue">{e.venue}</div>
        <div className="event-addr">{e.address}</div>
        {e.note && <div className="event-note">{e.note}</div>}
        {e.dressCode && (
          <div className="event-dress">
            <span>Dress code</span> {e.dressCode}
          </div>
        )}
        {interactive && (
          <a className="event-map" href={eventMap(e)} target="_blank" rel="noreferrer" data-no-flip>
            View on map →
          </a>
        )}
      </div>
    </div>
  );
}

function Events({ d, t, p, events, first }: { d: InviteData; t: Template; p: Palette; events: EventItem[]; first: boolean }) {
  const fill = foilFill(p);
  return (
    <div className={`page-content events ${events.length <= 2 ? "few" : ""}`}>
      <div className="page-eyebrow">{first ? (t.category === "festival" ? "Celebrate With Us" : d.secondary?.name ? "The Celebrations" : "Programme") : "Celebrations Continue"}</div>
      <Divider fill={fill} width={180} kind="lotus" />
      <div className={`event-list n${events.length}`}>
        {events.map((e) => (
          <EventBlock key={e.id} e={e} t={t} p={p} />
        ))}
        {events.length === 0 && <div className="event-empty">Add your events to see them here</div>}
      </div>
    </div>
  );
}

function Family({ d, p }: { d: InviteData; p: Palette }) {
  const fill = foilFill(p);
  const many = d.family.names.length > 6;
  return (
    <div className="page-content family">
      <div className="page-eyebrow">{d.family.title}</div>
      <Divider fill={fill} width={180} kind="lotus" />
      <ul className={`family-list ${many ? "many" : ""}`}>
        {d.family.names.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      {d.family.kids.length > 0 && (
        <>
          <Divider fill={fill} width={120} kind="dots" />
          <div className="kids-title">{d.family.kidsTitle}</div>
          <div className="kids foil-text">{d.family.kids.join(" · ")}</div>
          {d.family.kidsLine && <p className="kids-line">“{d.family.kidsLine}”</p>}
        </>
      )}
    </div>
  );
}

function Countdown({ target, p }: { target: string; p: Palette }) {
  const now = useNow(1000);
  const c = countdownParts(parseLocal(target), new Date(now));
  const cells: [number, string][] = [
    [c.days, "Days"],
    [c.hours, "Hours"],
    [c.minutes, "Mins"],
    [c.seconds, "Secs"],
  ];
  return (
    <div className="countdown">
      {cells.map(([v, l]) => (
        <div className="cd-cell" key={l}>
          <span className="cd-v foil-text" suppressHydrationWarning>
            {String(v).padStart(2, "0")}
          </span>
          <span className="cd-l">{l}</span>
        </div>
      ))}
    </div>
  );
}

function MapIllustration({ e, p }: { e: EventItem; p: Palette }) {
  const env = useCardEnv();
  const r = rng(e.venue.length * 7 + e.address.length);
  const roads: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const horizontal = i % 2 === 0;
    const pos = 12 + r() * 96;
    roads.push(
      horizontal ? (
        <path key={i} d={`M-5,${pos} Q110,${pos + (r() - 0.5) * 30} 225,${pos + (r() - 0.5) * 20}`} />
      ) : (
        <path key={i} d={`M${pos * 1.8},-5 Q${pos * 1.8 + (r() - 0.5) * 40},60 ${pos * 1.8 + (r() - 0.5) * 30},125`} />
      ),
    );
  }
  const fill = foilFill(p);
  const inner = (
    <svg viewBox="0 0 220 120" className="map-svg">
      <rect width={220} height={120} fill="var(--paper2)" opacity={0.55} />
      <path d="M-5,95 C40,80 70,110 120,92 S190,70 230,84" fill="none" stroke="var(--accent2)" strokeWidth={9} opacity={0.25} />
      <g fill="none" stroke="var(--ink-soft)" strokeWidth={2.4} opacity={0.35}>
        {roads}
      </g>
      <g transform="translate(110 58)" filter="url(#f-foil)">
        <path d="M0,0 C-11,-14 -11,-30 0,-32 C11,-30 11,-14 0,0Z" fill={fill} />
        <circle cx={0} cy={-21} r={4} fill="var(--paper)" />
      </g>
      <ellipse cx={110} cy={60} rx={10} ry={3} fill="#000" opacity={0.2} />
    </svg>
  );
  return env.mode === "live" ? (
    <a href={eventMap(e)} target="_blank" rel="noreferrer" className="map-card" data-no-flip>
      {inner}
      <span className="map-cta">Tap for directions</span>
    </a>
  ) : (
    <div className="map-card">{inner}</div>
  );
}

function Venue({ d, t, p }: { d: InviteData; t: Template; p: Palette }) {
  const env = useCardEnv();
  const fill = foilFill(p);
  const main = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  return (
    <div className="page-content venue">
      <div className="page-eyebrow">Save the Date</div>
      <div className="venue-date foil-text">{fmtLongDate(d.mainDateTime.split("T")[0])}</div>
      <Countdown target={d.mainDateTime} p={p} />
      <Divider fill={fill} width={160} kind="dots" />
      {main && (
        <>
          <div className="venue-name foil-text">{main.venue}</div>
          <div className="venue-addr">{main.address}</div>
          <MapIllustration e={main} p={p} />
        </>
      )}
      {d.rsvp.enabled && (
        <div className="rsvp-block">
          {env.mode === "live" && env.onRsvp ? (
            <button className="rsvp-btn" onClick={env.onRsvp} data-no-flip>
              Kindly RSVP
            </button>
          ) : (
            <div className="rsvp-title">Kindly RSVP</div>
          )}
          {d.rsvp.deadline && <div className="rsvp-by">by {fmtShortDate(d.rsvp.deadline)}</div>}
          <div className="rsvp-contacts">
            {d.rsvp.contacts.map((c, i) => (
              <span key={i}>
                {c.name} · {env.mode === "live" ? <a href={`tel:${c.phone.replace(/\s/g, "")}`} data-no-flip>{c.phone}</a> : c.phone}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Story({ d, p }: { d: InviteData; p: Palette }) {
  const fill = foilFill(p);
  const st = d.story!;
  const photos = st.photos.slice(0, 6);
  return (
    <div className="page-content story">
      <div className="page-eyebrow">{st.title || "Our Story"}</div>
      <Divider fill={fill} width={170} kind="lotus" />
      {st.text.trim() && <p className={`story-text ${photos.length ? "" : "solo"}`}>{st.text}</p>}
      {photos.length > 0 && (
        <div className={`story-photos n${photos.length}`}>
          {photos.map((src, i) => (
            <div key={i} className="polaroid" style={{ "--tilt": `${((i * 37) % 9) - 4}deg` } as React.CSSProperties}>
              <div className="polaroid-img" style={{ backgroundImage: `url(${JSON.stringify(src)})` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const fill = foilFill(p);
  const rows = (d.info ?? []).filter((i) => i.value.trim()).slice(0, 6);
  const live = d.livestream?.trim();
  return (
    <div className="page-content info">
      <div className="page-eyebrow">Good to Know</div>
      <Divider fill={fill} width={170} kind="lotus" />
      {rows.length > 0 && (
        <dl className={`info-list ${rows.length > 4 ? "many" : ""}`}>
          {rows.map((r, i) => (
            <div key={i} className="info-row">
              <dt className="foil-text">{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {live && (
        <div className="info-live">
          <span>Can&apos;t make it? Watch live</span>
          {env.mode === "live" ? (
            <a href={live} target="_blank" rel="noreferrer" data-no-flip className="rsvp-btn">
              Join the live stream
            </a>
          ) : (
            <div className="info-live-url">{live.replace(/^https?:\/\//, "")}</div>
          )}
        </div>
      )}
      {d.hashtag?.trim() && (
        <div className="info-tag">
          <span>Share your moments</span>
          <div className="foil-text">{d.hashtag.trim().startsWith("#") ? d.hashtag.trim() : `#${d.hashtag.trim()}`}</div>
        </div>
      )}
    </div>
  );
}

/** A greeting's message page: wish, photo or logo, the note, and who it's from. */
function Message({ d, p }: { d: InviteData; p: Palette }) {
  const fill = foilFill(p);
  const now = useNow(60000);
  const days = Math.ceil((parseLocal(d.mainDateTime).getTime() - now) / 86400000);
  const fest = festival(d.festival);
  return (
    <div className="page-content message">
      {d.logo && <div className="msg-logo" style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} />}
      <div className="page-eyebrow">{d.eyebrow}</div>
      <Divider fill={fill} width={170} kind="lotus" />
      {d.blessingLine && <p className="msg-wish">{d.blessingLine}</p>}
      {d.photo && <Photo src={d.photo} />}
      {d.message && <p className={`msg-text ${d.photo ? "with-photo" : ""}`}>{d.message}</p>}
      <div className="msg-from">
        <span>{d.closing.title || "With love"},</span>
        <b className="foil-text">{d.primary.name}</b>
        {d.primary.subtitle && <em>{d.primary.subtitle}</em>}
      </div>
      {days > 0 && days < 120 && (
        <div className="msg-count" suppressHydrationWarning>
          {fest.label.replace(/ \(.*\)$/, "")} is {days} {days === 1 ? "day" : "days"} away
        </div>
      )}
    </div>
  );
}

function Closing({ d, t, p }: { d: InviteData; t: Template; p: Palette }) {
  const fill = foilFill(p);
  return (
    <div className="page-content closing">
      <SymbolMark d={{ ...d, symbol: d.symbol === "none" || d.symbol === "ganesha" || d.symbol === "ganesha-riddhi" || d.symbol === "custom" ? "diya" : d.symbol }} t={t} p={p} size={0.9} />
      <div className="page-eyebrow">{d.closing.title}</div>
      <Divider fill={fill} width={180} kind="lotus" />
      <div className="closing-names">
        {d.closing.names.map((n, i) => (
          <div key={i} className={i === 0 ? "closing-main foil-text" : "closing-sub"}>
            {n}
          </div>
        ))}
      </div>
      <p className="closing-note">{t.category === "festival" ? d.blessingLine || "Wishing you and your loved ones joy and light." : "Your presence and blessings will make the occasion complete."}</p>
    </div>
  );
}

export function InvitePage({ spec, d, t, p, index }: { spec: PageSpec; d: InviteData; t: Template; p: Palette; index: number }) {
  const wd = t.wed ? WED_DESIGNS[t.wed.design] : undefined;
  let body: React.ReactNode;
  const custom = spec.kind !== "cover" ? wd?.Pages?.[spec.kind] : undefined;
  if (custom) body = custom({ d, t, p, events: spec.events, first: spec.key === "events-0" });
  else switch (spec.kind) {
    case "cover":
      body = wd ? wd.Cover({ d, t, p }) : <Cover d={d} t={t} p={p} />;
      break;
    case "names":
      body = <Names d={d} t={t} p={p} />;
      break;
    case "events":
      body = <Events d={d} t={t} p={p} events={spec.events ?? []} first={spec.key === "events-0"} />;
      break;
    case "family":
      body = <Family d={d} p={p} />;
      break;
    case "venue":
      body = <Venue d={d} t={t} p={p} />;
      break;
    case "story":
      body = <Story d={d} p={p} />;
      break;
    case "message":
      body = <Message d={d} p={p} />;
      break;
    case "info":
      body = <Info d={d} p={p} />;
      break;
    case "closing":
      body = <Closing d={d} t={t} p={p} />;
      break;
  }
  return (
    <Paper t={t} p={p} className={`kind-${spec.kind}`}>
      {wd ? wd.Frame({ t, p, kind: spec.kind }) : <Frame t={t} p={p} kind={spec.kind} />}
      {body}
      {index > 0 && <div className="folio">{index + 1}</div>}
    </Paper>
  );
}

/** Plain back of a leaf (what you see mid-flip). */
export function LeafBack({ t, p }: { t: Template; p: Palette }) {
  const wd = t.wed ? WED_DESIGNS[t.wed.design] : undefined;
  if (wd)
    return (
      <Paper t={t} p={p} className="leaf-back">
        {wd.Back({ p })}
      </Paper>
    );
  return (
    <Paper t={t} p={p} className="leaf-back">
      <div className="back-mark">
        <Mandala size={180} fill={foilFill(p)} seed={4} opacity={0.18} filter="none" />
      </div>
    </Paper>
  );
}
