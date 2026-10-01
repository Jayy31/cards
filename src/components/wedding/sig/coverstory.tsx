"use client";
import React, { useId } from "react";
import gsap from "gsap";
import type { EventItem, InviteData, Palette } from "@/lib/types";
import { cos, dateParts, fmtTime, rng, sin } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { Barcode } from "../art3";

/* ============================================================
   Cover Story: a luxury fashion-magazine wedding issue.
   ============================================================ */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** A head-and-shoulders profile facing right (0..200 × 0..420). */
const PROFILE =
  "M0,420 L0,300 C12,290 30,280 40,262 C30,232 20,192 24,152 C28,92 70,52 120,52 C150,54 168,74 170,104 C172,118 170,128 176,140 L192,168 C194,173 189,177 182,178 C185,186 184,190 180,194 C187,198 185,204 178,206 C180,214 176,222 168,226 C160,232 148,236 140,240 C136,256 138,276 150,300 C170,330 200,350 200,420Z";

/** Two profiles leaning in, with halftone shading and hair details. */
function Profiles({ p }: { p: Palette }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="cs-art" viewBox="0 0 500 460" width={500} height={460}>
      <defs>
        <pattern id={`ht-${id}`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx={3.5} cy={3.5} r={1.5} fill="#fff" opacity={0.22} />
        </pattern>
        <clipPath id={`cg-${id}`}>
          <path d={PROFILE} transform="translate(46 40)" />
        </clipPath>
        <clipPath id={`cb-${id}`}>
          <path d={PROFILE} transform="translate(454 40) scale(-1 1)" />
        </clipPath>
      </defs>
      <circle cx={250} cy={250} r={176} fill={p.accent2} />
      <circle cx={250} cy={250} r={176} fill="none" stroke={p.ink} strokeOpacity={0.15} />
      {/* groom */}
      <g>
        <path d={PROFILE} transform="translate(46 40)" fill={p.ink} />
        <g clipPath={`url(#cg-${id})`}>
          <rect width={500} height={460} fill={`url(#ht-${id})`} />
          <path d="M60,90 C80,70 130,70 170,96 C150,82 110,80 80,104Z" fill="#000" opacity={0.25} />
        </g>
        <path d="M70,96 C86,62 140,60 170,94 C150,86 128,84 104,92 C90,96 80,104 74,114Z" fill={p.ink} />
      </g>
      {/* bride */}
      <g>
        <path d={PROFILE} transform="translate(454 40) scale(-1 1)" fill={p.accent} />
        <g clipPath={`url(#cb-${id})`}>
          <rect width={500} height={460} fill={`url(#ht-${id})`} />
        </g>
        <path d="M430,200 C446,150 440,100 404,80 C376,66 336,74 322,104 C350,92 380,96 398,116 C412,134 414,170 404,196Z" fill={p.ink} />
        <circle cx={428} cy={150} r={26} fill={p.ink} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={428 + Math.round(cos(i * 0.9) * 2700) / 100} cy={150 + Math.round(sin(i * 0.9) * 2700) / 100} r={4} fill="#fffaf0" />
        ))}
        <circle cx={316} cy={228} r={3.4} fill="#e9c46a" />
        <path d="M316,232 L316,246" stroke="#e9c46a" strokeWidth={1.4} />
      </g>
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const [y, m, dd] = d.mainDateTime.split("T")[0].split("-");
  const mast = b?.name ? `${a.name}&${b.name}` : a.name;
  const size = Math.min(92, Math.round(470 / (mast.length * 0.6)));
  const days = new Set(d.events.map((e) => e.date)).size;
  const names = d.events.map((e) => e.name).slice(0, 4).join(" · ");
  return (
    <div className="page-content cover wd-cover cs-cover">
      <div className="cs-dateline">
        <span>The Wedding Issue</span>
        <span>
          {MONTHS[Number(m) - 1]} {y}
        </span>
        <span>No. 01</span>
      </div>
      <h1 className="cs-mast" style={{ fontSize: size }}>
        {mast.toUpperCase()}
      </h1>
      {d.photo ? <div className="cs-photo" style={{ backgroundImage: `url(${JSON.stringify(d.photo)})` }} /> : <Profiles p={p} />}
      <div className="cs-lines left">
        <span className="cs-tag">Exclusive</span>
        <b className="cs-big">The Wedding of the Year</b>
        <span className="cs-small">
          {d.events.length} celebrations · {days} {days === 1 ? "day" : "days"} of love
        </span>
      </div>
      <div className="cs-lines right">
        <b className="cs-mid">
          {a.name}
          {b?.name ? ` & ${b.name}` : ""} on love, family &amp; forever
        </b>
        <span className="cs-small">Inside: {names}</span>
        <span className="cs-plus">+ RSVP inside</span>
      </div>
      <div className="cs-foot">
        <span className="cs-price">{env.guest ? `For ${env.guest}` : "Priceless"}</span>
        <div className="cs-barcode">
          <Barcode width={84} height={28} color="#111" seed={Number(dd) * 31 + Number(m)} />
          <small>
            {dd}·{m}·{y.slice(2)}
          </small>
        </div>
      </div>
    </div>
  );
}

function Couple({ d }: { d: InviteData }) {
  const [a, b] = coupleOrder(d);
  return (
    <div className="page-content cs-feature">
      <div className="cs-kicker">Cover story</div>
      <h2 className="cs-h2">
        Meet <i>{a.name}</i>
        {b?.name && (
          <>
            {" "}
            &amp; <i>{b.name}</i>
          </>
        )}
      </h2>
      <p className="cs-standfirst">
        <span className="cs-drop">{d.blessingLine.charAt(0)}</span>
        {d.blessingLine.slice(1)}, <b>{d.hosts}</b> {d.inviteText}{" "}
        <b>
          {a.name}
          {b?.name ? ` and ${b.name}` : ""}
        </b>
        .
      </p>
      <div className="cs-people">
        {[a, b].filter(Boolean).map((x, i) => (
          <div key={i}>
            <b>{x!.name}</b>
            {x!.nameLocal && <span className="person-local">{x!.nameLocal}</span>}
            {x!.subtitle && <span>{x!.subtitle}</span>}
            {x!.parents && <span>{x!.parents}</span>}
          </div>
        ))}
      </div>
      {d.quote && <blockquote className="cs-pull">“{d.quote}”</blockquote>}
    </div>
  );
}

function Contents({ events = [], first }: { events?: EventItem[]; first?: boolean }) {
  return (
    <div className="page-content cs-contents">
      <div className="cs-kicker">The Wedding Issue</div>
      <h2 className="cs-h2 big">{first ? "Contents" : "Contents, cont."}</h2>
      <div className="cs-toc">
        {events.map((e) => {
          const dp = dateParts(e.date);
          return (
            <div key={e.id} className="cs-entry">
              <span className="cs-no">{dp.day}</span>
              <div>
                <b>{e.name}</b>
                <span>
                  {dp.weekday} · {fmtTime(e.time)} — {e.venue}
                </span>
                {(e.dressCode || e.note) && <em>{e.dressCode ? `Dress code: ${e.dressCode}` : e.note}</em>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Contributors({ d }: { d: InviteData }) {
  return (
    <div className="page-content cs-staff">
      <div className="cs-kicker">Masthead</div>
      <h2 className="cs-h2">{d.family.title}</h2>
      <ul>
        {d.family.names.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      {d.family.kids.length > 0 && (
        <>
          <div className="cs-kicker">{d.family.kidsTitle || "Junior editors"}</div>
          <div className="cs-kids">{d.family.kids.join(" · ")}</div>
          {d.family.kidsLine && <p className="cs-small">“{d.family.kidsLine}”</p>}
        </>
      )}
    </div>
  );
}

export const coverstory: WedDesign = {
  Frame: ({ kind }) => (kind === "cover" ? null : <div className="cs-folio-line" />),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => <div className="wd-back-mark cs-back" />,
  Pages: {
    names: ({ d }) => <Couple d={d} />,
    events: ({ events, first }) => <Contents events={events} first={first} />,
    family: ({ d }) => <Contributors d={d} />,
  },
};

/* ---------------- intro: paparazzi flashes ---------------- */

const FLASHES = (() => {
  const r = rng(17);
  return Array.from({ length: 14 }, (_, i) => ({ x: 40 + r() * 520, y: 80 + r() * 740, s: 0.6 + r() * 0.9, t: 0.05 + i * 0.07 + r() * 0.05 }));
})();

export const paparazzi: IntroDef = {
  end: 2.2,
  burst: 1.8,
  hint: { x: 300, y: 450 },
  Over: () => (
    <div className="in-part fl-wrap">
      {FLASHES.map((f, i) => (
        <i key={i} className="fl-flash" style={{ left: f.x - 80, top: f.y - 80, transform: `scale(${f.s})` }} />
      ))}
      <div className="fl-white" />
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { y: 960, rotate: -5, transformOrigin: "50% 100%" });
    const tl = gsap.timeline({ paused: true });
    const fl = q(".fl-flash");
    FLASHES.forEach((f, i) => {
      tl.to(fl[i], { opacity: 1, duration: 0.03 }, f.t).to(fl[i], { opacity: 0, duration: 0.22 }, f.t + 0.05);
    });
    tl.to(q(".fl-white"), { opacity: 0.9, duration: 0.05 }, 1.15)
      .to(q(".fl-white"), { opacity: 0, duration: 0.5 }, 1.22)
      .to(holder, { y: 0, rotate: 0, duration: 1.0, ease: "power3.out" }, 1.0)
      .to(q(".fl-wrap"), { backgroundColor: "rgba(0,0,0,0)", duration: 0.6 }, 1.3);
    return tl;
  },
};
