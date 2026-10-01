"use client";
import React from "react";
import gsap from "gsap";
import type { EventItem, InviteData, Palette } from "@/lib/types";
import { dateParts, fmtTime } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { useCardEnv } from "@/components/card/CardEnv";
import { foilFill } from "@/components/card/theme";
import { Laurel } from "../art";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";

/* ============================================================
   Premiere: the wedding as a film premiere. Poster cover,
   showtimes for the events, a credits roll for the family.
   ============================================================ */

const famName = (d: InviteData) => d.closing.names[0] || d.hosts;

function Grain() {
  return (
    <svg className="pm-grain" width={500} height={700} viewBox="0 0 500 700">
      <filter id="pm-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
      </filter>
      <rect width={500} height={700} filter="url(#pm-noise)" />
    </svg>
  );
}

/** Festival-style laurel with a two-line award. */
function Award({ top, bottom, color }: { top: string; bottom: string; color: string }) {
  return (
    <div className="pm-award">
      <Laurel size={86} color={color} stroke={1} />
      <span>
        <small>{top}</small>
        {bottom}
      </span>
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const [y, m, dd] = d.mainDateTime.split("T")[0].split("-");
  const fam = famName(d);
  return (
    <div className="page-content cover wd-cover pm-cover">
      <div className="pm-beam l" />
      <div className="pm-beam r" />
      <div className="pm-present">{d.hosts} present</div>
      {d.quote && <div className="pm-tag">{d.quote}</div>}
      <div className="pm-awards">
        <Award top="Official selection" bottom="Wedding of the Year" color={p.inkSoft} />
        <Award top="Winner" bottom="Best Love Story" color={p.inkSoft} />
      </div>
      <h1 className="pm-title foil-text">
        <span>{a.name}</span>
        {b?.name && (
          <>
            <i>&amp;</i>
            <span>{b.name}</span>
          </>
        )}
      </h1>
      <div className="pm-release">
        <small>In cinemas</small>
        <b>
          {dd}.{m}.{y}
        </b>
      </div>
      <div className="pm-billing">
        <p>
          <span>{fam}</span> present <span>a destiny production</span>
        </p>
        <p className="big">
          {a.name} {b?.name ? <>&nbsp;·&nbsp; {b.name}</> : null}
        </p>
        <p>
          music by <span>the band baaja</span> costumes by <span>the mothers</span> catering by <span>grandma&apos;s recipes</span> edited by <span>the cousins</span> produced by <span>{fam}</span> directed by <span>destiny</span>
        </p>
      </div>
      <div className="pm-rating">
        <b>U</b> Unconditional love
      </div>
      {env.guest && <div className="pm-guest">Reserved for {env.guest}</div>}
      <Grain />
    </div>
  );
}

function Showtimes({ d, events = [], first }: { d: InviteData; events?: EventItem[]; first?: boolean }) {
  return (
    <div className="page-content pm-show">
      <div className="pm-kicker">{first ? "Now showing" : "More shows"}</div>
      <h2 className="pm-h2">Showtimes</h2>
      <div className="pm-list">
        {events.map((e) => {
          const dp = dateParts(e.date);
          return (
            <div key={e.id} className="pm-row">
              <div className="pm-date">
                <small>{dp.month.slice(0, 3)}</small>
                <b>{dp.day}</b>
                <small>{dp.weekday.slice(0, 3)}</small>
              </div>
              <div className="pm-info">
                <b>{e.name}</b>
                <span>{e.venue}</span>
                {e.dressCode && <em>Dress code · {e.dressCode}</em>}
                {e.note && <em>{e.note}</em>}
              </div>
              <div className="pm-time">{fmtTime(e.time)}</div>
            </div>
          );
        })}
      </div>
      <Grain />
    </div>
  );
}

function Credits({ d }: { d: InviteData }) {
  return (
    <div className="page-content pm-credits">
      <div className="pm-kicker">With</div>
      <h2 className="pm-h2">{d.family.title}</h2>
      <ul>
        {d.family.names.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      {d.family.kids.length > 0 && (
        <>
          <div className="pm-kicker">And introducing</div>
          <div className="pm-kids">{d.family.kids.join(" · ")}</div>
          {d.family.kidsLine && <p className="pm-line">“{d.family.kidsLine}”</p>}
        </>
      )}
      <Grain />
    </div>
  );
}

function TheEnd({ d }: { d: InviteData }) {
  return (
    <div className="page-content pm-end">
      <div className="pm-kicker">{d.closing.title}</div>
      <div className="pm-end-names">
        {d.closing.names.map((n, i) => (
          <div key={i} className={i ? "sub" : "main foil-text"}>
            {n}
          </div>
        ))}
      </div>
      <div className="pm-fin">The beginning</div>
      <p className="pm-line">…of happily ever after. Your presence will make it a blockbuster.</p>
      <Grain />
    </div>
  );
}

export const premiere: WedDesign = {
  Frame: ({ kind }) => (
    <>
      <div className="pm-vignette" />
      {kind !== "cover" && (
        <>
          <div className="pm-perf l" />
          <div className="pm-perf r" />
        </>
      )}
    </>
  ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark pm-back">
      <span>★</span>
    </div>
  ),
  Pages: {
    events: ({ d, events, first }) => <Showtimes d={d} events={events} first={first} />,
    family: ({ d }) => <Credits d={d} />,
    closing: ({ d }) => <TheEnd d={d} />,
  },
};

/* ---------------- intro: film countdown leader ---------------- */

export const leader: IntroDef = {
  end: 2.6,
  burst: 2.2,
  hint: { x: 300, y: 700 },
  Over: ({ p }) => (
    <div className="in-part ld-wrap">
      <div className="ld-frame">
        <div className="ld-sweep" />
        <svg className="ld-cross" viewBox="0 0 400 400" width={400} height={400}>
          <circle cx={200} cy={200} r={150} fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} />
          <circle cx={200} cy={200} r={120} fill="none" stroke="#fff" strokeWidth={2} opacity={0.6} />
          <line x1={0} y1={200} x2={400} y2={200} stroke="#fff" strokeWidth={2} opacity={0.6} />
          <line x1={200} y1={0} x2={200} y2={400} stroke="#fff" strokeWidth={2} opacity={0.6} />
        </svg>
        {[5, 4, 3, 2, 1].map((n) => (
          <span key={n} className={`ld-num n${n}`}>
            {n}
          </span>
        ))}
      </div>
      <div className="ld-scratch" />
      <div className="ld-flash" style={{ background: p.envelope }} />
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.92, transformOrigin: "50% 50%" });
    gsap.set(q(".ld-num"), { opacity: 0 });
    gsap.set(q(".ld-num.n5"), { opacity: 1 });
    const tl = gsap.timeline({ paused: true });
    [5, 4, 3, 2, 1].forEach((n, i) => {
      const t0 = i * 0.32;
      tl.set(q(".ld-num"), { opacity: 0 }, t0).set(q(`.ld-num.n${n}`), { opacity: 1 }, t0);
      tl.fromTo(q(".ld-sweep"), { "--a": "0deg" }, { "--a": "360deg", duration: 0.32, ease: "none" }, t0);
    });
    tl.to(q(".ld-frame"), { opacity: 0, duration: 0.1 }, 1.6)
      .to(q(".ld-flash"), { opacity: 1, duration: 0.08 }, 1.62)
      .to(q(".ld-flash"), { opacity: 0, duration: 0.6 }, 1.72)
      .to(q(".ld-wrap"), { backgroundColor: "rgba(0,0,0,0)", duration: 0.5 }, 1.7)
      .to(q(".ld-scratch"), { opacity: 0, duration: 0.4 }, 1.7)
      .to(holder, { scale: 1, duration: 0.9, ease: "power2.out" }, 1.7);
    return tl;
  },
};
