"use client";
import { useMemo } from "react";
import { rng } from "@/lib/format";
import { leafPath } from "@/components/card/ornaments";
import { Avatar, Brand, Contacts, contactRows, type FaceProps, fitSize, FrontMeta, LocalName, monogram, Qr, scatter, socialRows, StdBack, twoLines } from "../parts";

/*
 * Profession collection: cards shaped around what a doctor, advocate, agent,
 * salon, gym, café, developer, architect, photographer, tutor, astrologer,
 * shopkeeper, travel agent, DJ, café loyalty, electronics, organic brand,
 * garage, consultant or insurance advisor actually needs on a card.
 */

const site = (d: FaceProps["d"]) => d.website.replace(/^https?:\/\//, "");

/* ---------------------------------------------------------------- Clinic */
export const Clinic = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="cl-band" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <path className="cl-ecg fx-draw" d="M40,318 H260 l12,-10 l10,10 h18 l10,-58 l14,96 l12,-60 l8,22 h24 l12,-12 l14,12 H660" />
      </svg>
      <div className="cl-top">
        <Brand d={d} className="cl-logo">
          <div className="cl-cross fx-pop">
            <span />
            <span />
          </div>
        </Brand>
        <div>
          <div className="cl-company fx-fade">{d.company}</div>
          <div className="cl-tag fx-fade">{d.tagline}</div>
        </div>
      </div>
      <div className="cl-doc">
        <div className="cl-name fx-fade" style={{ fontSize: fitSize(d.name, 520, 40, 0.55) }}>
          {d.name}
        </div>
        <div className="cl-title fx-fade">{d.title}</div>
      </div>
      <FrontMeta d={{ ...d, front: { ...d.front, name: false } }} className="cl-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="cl-band" />
      <StdBack d={d} qrColor={p.ink} qrLabel="Book / save contact" />
    </>
  ),
};

/* ---------------------------------------------------------------- Advocate */
function Scales() {
  return (
    <g className="av-art" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className="fx-draw" d="M60,14 V102 M36,104 H84 M44,110 H76" />
      <circle className="fx-draw" cx={60} cy={12} r={4} />
      <path className="fx-draw" d="M14,28 H106" />
      <path className="fx-draw" d="M22,28 L8,64 M22,28 L36,64 M98,28 L84,64 M98,28 L112,64" />
      <path className="fx-draw" d="M4,64 Q22,82 40,64Z M80,64 Q98,82 116,64Z" />
    </g>
  );
}

export const Advocate = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="av-frame" />
      <div className="av-main">
        <Brand d={d} className="av-logo">
          <svg viewBox="0 0 120 116" width={92} height={90}>
            <Scales />
          </svg>
        </Brand>
        <div className="av-name fx-fade" style={{ fontSize: fitSize(d.name, 520, 34, 0.62) }}>
          {d.name}
        </div>
        <div className="av-title fx-fade">{d.title}</div>
        <div className="av-rule fx-fade" />
        <div className="av-company fx-fade">{d.company}</div>
      </div>
      <FrontMeta d={{ ...d, front: { ...d.front, name: false } }} className="av-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="av-frame" />
      <StdBack d={d} qrColor={p.paper === "#111111" ? "#111" : "#111"} />
    </>
  ),
};

/* ---------------------------------------------------------------- Skyline (real estate) */
function skyline(seed: number, w: number, base: number) {
  const r = rng(seed);
  const out: { x: number; w: number; h: number; win: [number, number][] ; spire: boolean }[] = [];
  let x = -10;
  while (x < w) {
    const bw = 26 + r() * 46;
    const bh = 50 + r() ** 1.6 * 150;
    const win: [number, number][] = [];
    for (let wy = base - bh + 10; wy < base - 10; wy += 13)
      for (let wx = x + 6; wx < x + bw - 8; wx += 10) if (r() > 0.55) win.push([wx, wy]);
    out.push({ x, w: bw, h: bh, win, spire: r() > 0.8 });
    x += bw + 2 + r() * 4;
  }
  return out;
}

export const Skyline = {
  Front: ({ d }: FaceProps) => {
    const city = useMemo(() => skyline(5, 700, 400), []);
    return (
      <>
        <div className="sk-sky" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <circle cx={600} cy={70} r={26} className="sk-moon fx-pop" />
          {city.map((b, i) => (
            <g key={i} className="fx-pop">
              <rect x={b.x} y={400 - b.h} width={b.w} height={b.h} className="sk-bldg" />
              {b.spire && <path d={`M${b.x + b.w / 2},${400 - b.h - 22} v22`} className="sk-spire" />}
              {b.win.map(([x, y], k) => (
                <rect key={k} x={x} y={y} width={4} height={6} className="sk-win" />
              ))}
            </g>
          ))}
        </svg>
        <div className="sk-main">
          <Brand d={d} className="sk-logo">
            <svg viewBox="0 0 40 40" width={44} height={44} className="sk-mark fx-pop">
              <path d="M4,36 V18 L20,6 L36,18 V36 H26 V24 H14 V36Z" />
            </svg>
          </Brand>
          <div className="sk-company fx-fade" style={{ fontSize: fitSize(d.company, 460, 34, 0.7) }}>
            {d.company}
          </div>
          <div className="sk-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light sk-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => {
    const city = useMemo(() => skyline(11, 700, 400), []);
    return (
      <>
        <div className="sk-sky" />
        <svg className="bz-svg sk-faint" viewBox="0 0 700 400">
          {city.map((b, i) => (
            <rect key={i} x={b.x} y={400 - b.h * 0.35} width={b.w} height={b.h} className="sk-bldg" />
          ))}
        </svg>
        <StdBack d={d} qrColor="#0f1b33" />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Salon */
export const Salon = {
  Front: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="sl-arch" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g className="sl-art" fill="none" strokeWidth={1.6} strokeLinecap="round" transform="translate(350 70)">
          <circle className="fx-draw" cx={-14} cy={26} r={8} />
          <circle className="fx-draw" cx={14} cy={26} r={8} />
          <path className="fx-draw" d="M-9,19 L12,-30 M9,19 L-12,-30" />
        </g>
      </svg>
      <div className="sl-main">
        <Brand d={d} className="sl-logo" />
        <div className="sl-company foil-text fx-fade" style={{ fontSize: fitSize(d.company, 380, 62, 0.42) }}>
          {d.company}
        </div>
        <div className="sl-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-center sl-fm" qrColor={p.ink} />
      <div className="paper-sheen" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <StdBack d={d} qrColor={p.ink} qrLabel="Book an appointment" />
      <div className="paper-sheen" />
    </>
  ),
};

/* ---------------------------------------------------------------- Fitness */
export const Fitness = {
  Front: ({ d }: FaceProps) => {
    const [l1, l2] = twoLines(d.company);
    return (
      <>
        <div className="ft-bg" />
        <div className="ft-slash a fx-pop" />
        <div className="ft-slash b fx-pop" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <g className="ft-bell fx-pop" transform="translate(560 90) rotate(-30)">
            <rect x={-44} y={-4} width={88} height={8} rx={2} />
            <rect x={-40} y={-20} width={12} height={40} rx={3} />
            <rect x={-54} y={-14} width={12} height={28} rx={3} />
            <rect x={28} y={-20} width={12} height={40} rx={3} />
            <rect x={42} y={-14} width={12} height={28} rx={3} />
          </g>
        </svg>
        <div className="ft-main">
          <Brand d={d} className="ft-logo" />
          <div className="ft-company" style={{ fontSize: fitSize(l1.length > l2.length ? l1 : l2, 440, 86, 0.46) }}>
            <span className="fx-pop">{l1}</span>
            {l2 && <span className="fx-pop accent">{l2}</span>}
          </div>
          <div className="ft-tag">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-left fm-light" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="ft-bg" />
      <div className="ft-slash c" />
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};

/* ---------------------------------------------------------------- Chalkboard café */
export const Chalk = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="ch-board" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g className="ch-art" filter="url(#f-chalk)" fill="none" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path className="fx-draw" d="M520,190 h90 v46 a45,45 0 0 1 -45,45 h0 a45,45 0 0 1 -45,-45z" />
          <path className="fx-draw" d="M610,204 a18,16 0 0 1 0,32" />
          <path className="fx-draw" d="M506,296 h118" />
          <path className="fx-draw" d="M544,176 c-8,-12 8,-18 0,-32 M566,176 c-8,-12 8,-18 0,-32 M588,176 c-8,-12 8,-18 0,-32" />
          <path className="fx-draw" d="M70,300 C140,286 240,296 340,288" />
          <path className="fx-draw" d="M640,64 l4,10 l11,1 l-8,7 l3,11 l-10,-6 l-10,6 l3,-11 l-8,-7 l11,-1z" />
        </g>
      </svg>
      <div className="ch-main">
        <Brand d={d} className="ch-logo" />
        <div className="ch-company fx-fade" style={{ fontSize: fitSize(d.company, 400, 52, 0.6) }}>
          {d.company}
        </div>
        <div className="ch-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-left fm-light ch-fm" />
      <div className="ch-frame" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="ch-board" />
      <StdBack d={d} qrColor="#1d2a24" />
      <div className="ch-frame" />
    </>
  ),
};

/* ---------------------------------------------------------------- Developer terminal */
export const Terminal = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="tm-bg" />
      <div className="tm-bar">
        <i />
        <i />
        <i />
        <span>~/{site(d) || "hello"} — zsh</span>
      </div>
      <div className="tm-body">
        <div className="tm-line">
          <b>➜</b> <em>~</em> whoami
        </div>
        <div className="tm-company fx-type" style={{ fontSize: fitSize(d.company, 560, 42, 0.62) }}>
          {d.company}
        </div>
        <div className="tm-line">
          <b>➜</b> <em>~</em> cat about.txt
        </div>
        <div className="tm-out fx-type">{d.tagline}</div>
        <div className="tm-line">
          <b>➜</b> <em>~</em> <span className="tm-cursor" />
        </div>
      </div>
      <FrontMeta d={d} className="fm-light tm-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => {
    const rows: [string, string][] = [
      ["name", d.name],
      ["role", d.title],
      ...contactRows(d).map((r) => [r.kind === "mail" ? "email" : r.kind === "pin" ? "address" : r.kind === "web" ? "web" : "phone", r.value] as [string, string]),
      ...(d.extras ?? []).filter((x) => x.value).map((x) => [x.label.toLowerCase().replace(/\W+/g, "_"), x.value] as [string, string]),
      ...socialRows(d).map((s) => [s.kind, `@${s.value}`] as [string, string]),
    ];
    return (
      <>
        <div className="tm-bg" />
        <div className="tm-bar">
          <i />
          <i />
          <i />
          <span>contact.json</span>
        </div>
        <div className={`tm-json ${rows.length > 7 ? "dense" : ""}`}>
          <div>{"{"}</div>
          {rows.map(([k, v], i) => (
            <div key={k + i} className="tm-kv">
              <span className="k">&quot;{k}&quot;</span>: <span className="v">&quot;{v}&quot;</span>
              {i < rows.length - 1 ? "," : ""}
            </div>
          ))}
          <div>{"}"}</div>
        </div>
        <div className="tm-qr">
          <Qr d={d} color={p.paper} />
        </div>
      </>
    );
  },
};

/* ---------------------------------------------------------------- Blueprint */
export const Blueprint = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="bp-grid" />
      <svg className="bz-svg bp-art" viewBox="0 0 700 400">
        <g fill="none" strokeWidth={1.6}>
          <path className="fx-draw" d="M70,330 V190 L170,120 L270,190 V330 Z" />
          <path className="fx-draw" d="M50,204 L170,114 L290,204" />
          <path className="fx-draw" d="M150,330 V270 H190 V330" />
          <path className="fx-draw" d="M96,210 h36 v34 h-36z M208,210 h36 v34 h-36z M114,210 v34 M96,227 h36 M226,210 v34 M208,227 h36" />
          <path className="fx-draw" d="M40,330 H300" />
        </g>
        <g className="bp-dim" fill="none" strokeWidth={0.9}>
          <path className="fx-draw" d="M70,356 H270 M70,350 v12 M270,350 v12 M70,356 l8,-4 v8z M270,356 l-8,-4 v8z" />
          <path className="fx-draw" d="M300,120 V330 M294,120 h12 M294,330 h12" />
        </g>
        <text x={170} y={374} className="bp-txt" textAnchor="middle">
          12 400
        </text>
        <text x={316} y={230} className="bp-txt" transform="rotate(90 316 230)" textAnchor="middle">
          8 750
        </text>
      </svg>
      <div className="bp-block fx-fade">
        <div className="bp-row head">
          <Brand d={d} className="bp-logo" />
          <span>Project</span>
        </div>
        <div className="bp-company" style={{ fontSize: fitSize(d.company, 250, 26, 0.64) }}>
          {d.company}
        </div>
        <div className="bp-row">
          <span>{d.tagline}</span>
        </div>
        <div className="bp-row split">
          <span>Scale 1:100</span>
          <span>Sheet A-01</span>
        </div>
      </div>
      <FrontMeta d={d} className="fm-light bp-fm" qrColor="#123a6b" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="bp-grid" />
      <StdBack d={d} qrColor="#123a6b" />
    </>
  ),
};

/* ---------------------------------------------------------------- Aperture (photographer) */
function Iris({ r0, r1, n = 7 }: { r0: number; r1: number; n?: number }) {
  const blades = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const b = ((i + 1) / n) * Math.PI * 2;
    const tw = 0.62;
    const pt = (r: number, t: number) => `${(Math.cos(t) * r).toFixed(1)},${(Math.sin(t) * r).toFixed(1)}`;
    return `M${pt(r1, a)} L${pt(r1, b + 0.15)} L${pt(r0, b + tw)} L${pt(r0, a + tw)}Z`;
  });
  return (
    <g className="ap-iris">
      <g className="fx-spin">
        {blades.map((b, i) => (
          <path key={i} d={b} className={i % 2 ? "ap-blade b" : "ap-blade"} />
        ))}
      </g>
      <circle r={r1} className="ap-ring" />
      <circle r={r1 + 10} className="ap-ring thin" />
    </g>
  );
}

export const Aperture = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="ap-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g transform="translate(530 200)">
          <Iris r0={26} r1={110} />
        </g>
        <path className="ap-bracket" d="M30,70 V30 H70 M630,30 H670 V70 M670,330 V370 H630 M70,370 H30 V330" />
      </svg>
      <div className="ap-rec fx-fade">
        <i /> REC <span>00:00:24:12</span>
      </div>
      <div className="ap-main">
        <Brand d={d} className="ap-logo" />
        <div className="ap-company fx-pop" style={{ fontSize: fitSize(d.company, 330, 70, 0.46) }}>
          {d.company}
        </div>
        <div className="ap-tag fx-fade">{d.tagline}</div>
      </div>
      <div className="ap-meta fx-fade">F/1.8 · 1/250 · ISO 200</div>
      <FrontMeta d={d} className="fm-left fm-light ap-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="ap-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <path className="ap-bracket" d="M30,60 V30 H60 M640,30 H670 V60 M670,340 V370 H640 M60,370 H30 V340" />
      </svg>
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};

/* ---------------------------------------------------------------- Notebook (tutor) */
export const Notebook = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="nb-paper" />
      <div className="nb-holes">
        <i />
        <i />
        <i />
      </div>
      <svg className="bz-svg nb-ink" viewBox="0 0 700 400">
        <path className="fx-draw" d="M112,206 C190,196 290,210 380,200 C420,196 440,202 452,198" fill="none" strokeWidth={3} strokeLinecap="round" />
        <path className="fx-draw" d="M600,56 l6,14 l15,1 l-11,10 l4,15 l-14,-8 l-14,8 l4,-15 l-11,-10 l15,-1z" fill="none" strokeWidth={2} />
        <path className="fx-draw" d="M420,300 q30,-40 70,-22 M480,270 l12,8 l-14,6" fill="none" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <div className="nb-main">
        <Brand d={d} className="nb-logo" />
        <div className="nb-company fx-type" style={{ fontSize: fitSize(d.company, 380, 50, 0.5) }}>
          {d.company}
        </div>
        <div className="nb-tag fx-type">{d.tagline}</div>
      </div>
      <div className="nb-sticky fx-fade">
        {d.services.slice(0, 4).map((s) => (
          <div key={s}>✓ {s}</div>
        ))}
      </div>
      <FrontMeta d={d} className="fm-left nb-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="nb-paper" />
      <div className="nb-holes">
        <i />
        <i />
        <i />
      </div>
      <StdBack d={d} qrColor="#1f3b8c" />
    </>
  ),
};

/* ---------------------------------------------------------------- Jyotish (astrologer) */
const ZODIAC = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const f1 = (n: number) => n.toFixed(1);

function ZodiacWheel({ r }: { r: number }) {
  return (
    <g className="zd-wheel">
      <g className="fx-spin">
        <circle r={r} className="zd-line" />
        <circle r={r - 34} className="zd-line" />
        <circle r={r - 40} className="zd-line thin" />
        <circle r={r * 0.34} className="zd-line" />
        {ZODIAC.map((z, i) => {
          const a = (i / 12) * Math.PI * 2;
          const m = a + Math.PI / 12;
          return (
            <g key={z}>
              <path d={`M${f1(Math.cos(a) * (r - 34))},${f1(Math.sin(a) * (r - 34))} L${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)}`} className="zd-line" />
              <path d={`M${f1(Math.cos(a) * r * 0.34)},${f1(Math.sin(a) * r * 0.34)} L${f1(Math.cos(a) * (r - 40))},${f1(Math.sin(a) * (r - 40))}`} className="zd-line thin" />
              <text x={f1(Math.cos(m) * (r - 17))} y={f1(Math.sin(m) * (r - 17) + 6)} textAnchor="middle" className="zd-glyph" transform={`rotate(${f1((m * 180) / Math.PI + 90)} ${f1(Math.cos(m) * (r - 17))} ${f1(Math.sin(m) * (r - 17))})`}>
                {z + "︎"}
              </text>
            </g>
          );
        })}
      </g>
      <circle r={r * 0.22} className="zd-sun" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <path key={i} d={`M${f1(Math.cos(a) * r * 0.25)},${f1(Math.sin(a) * r * 0.25)} L${f1(Math.cos(a) * r * 0.31)},${f1(Math.sin(a) * r * 0.31)}`} className="zd-ray" />;
      })}
    </g>
  );
}

export const Jyotish = {
  Front: ({ d }: FaceProps) => {
    const stars = useMemo(() => scatter(70, 3, 700, 400), []);
    return (
      <>
        <div className="zd-sky" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={0.5 + s.s * 1.3} className="zd-star" opacity={0.3 + s.a * 0.7} />
          ))}
          <g transform="translate(560 200)" filter="url(#f-foil)">
            <ZodiacWheel r={168} />
          </g>
        </svg>
        <div className="zd-main">
          <Brand d={d} className="zd-logo" />
          <div className="zd-company foil-text fx-fade" style={{ fontSize: fitSize(d.company, 320, 36, 0.72) }}>
            {d.company}
          </div>
          <div className="zd-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-left fm-light zd-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => {
    const stars = useMemo(() => scatter(50, 8, 700, 400), []);
    return (
      <>
        <div className="zd-sky" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={0.5 + s.s} className="zd-star" opacity={0.2 + s.a * 0.5} />
          ))}
        </svg>
        <StdBack d={d} qrColor="#141436" />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Dukaan (shop) */
function Awning({ w, h }: { w: number; h: number }) {
  const n = 14;
  const sw = w / n;
  return (
    <g className="dk-awning">
      {Array.from({ length: n }, (_, i) => (
        <g key={i} className="fx-item">
          <rect x={i * sw} y={0} width={sw} height={h} className={i % 2 ? "dk-a" : "dk-b"} />
          <path d={`M${i * sw},${h} a${sw / 2},${sw / 2.4} 0 0 0 ${sw},0Z`} className={i % 2 ? "dk-a" : "dk-b"} />
        </g>
      ))}
      <rect x={0} y={0} width={w} height={8} className="dk-rod" />
    </g>
  );
}

export const Dukaan = {
  Front: ({ d }: FaceProps) => {
    const line = [d.phone, d.address].filter(Boolean).join("   •   ");
    return (
      <>
        <div className="paper-grain" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <Awning w={700} h={62} />
        </svg>
        <div className="dk-board fx-fade">
          <Brand d={d} className="dk-logo" />
          <div className="dk-company" style={{ fontSize: fitSize(d.company, 520, 54, 0.54) }}>
            {d.company}
          </div>
          <div className="dk-tag">{d.tagline}</div>
          {d.services.length > 0 && (
            <div className="dk-items">
              {d.services.slice(0, 4).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="dk-strip fx-item">{line}</div>
        <FrontMeta d={{ ...d, front: { ...d.front, contact: false } }} className="dk-fm" />
      </>
    );
  },
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <Awning w={700} h={30} />
      </svg>
      <StdBack d={d} qrColor={p.ink} qrLabel="Order on WhatsApp" />
    </>
  ),
};

/* ---------------------------------------------------------------- Boarding pass */
function barcode(seed: string, n = 46) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const r = rng(h >>> 0);
  return Array.from({ length: n }, () => 1 + Math.floor(r() * 3));
}

export const Boarding = {
  Front: ({ d }: FaceProps) => {
    const bars = barcode(d.name + d.company);
    const code = monogram(d.company).padEnd(3, "X").slice(0, 3);
    let x = 0;
    return (
      <>
        <div className="bd2-bg" />
        <div className="bd2-head">
          <Brand d={d} className="bd2-logo">
            <svg viewBox="0 0 24 24" width={20} height={20} className="bd2-plane">
              <path d="M2,13 L9,12 L14,3 H16.5 L13.5,12 L20,12 L22,9 H23.5 L22.5,13 L23.5,17 H22 L20,14 L13.5,14 L16.5,23 H14 L9,14 L2,13Z" transform="rotate(-90 12 12) translate(0 -1)" />
            </svg>
          </Brand>
          <span>{d.company}</span>
          <b>Boarding pass</b>
        </div>
        <div className="bd2-route fx-item">
          <div>
            <small>From</small>
            <strong>{code}</strong>
          </div>
          <svg viewBox="0 0 60 12" className="bd2-arrow">
            <path d="M0,6 H52 M46,1 L54,6 L46,11" fill="none" strokeWidth={1.6} />
          </svg>
          <div>
            <small>To</small>
            <strong>YOU</strong>
          </div>
        </div>
        <div className="bd2-fields">
          <div className="fx-item">
            <small>Passenger</small>
            <b>{d.name}</b>
          </div>
          <div className="fx-item">
            <small>Class</small>
            <b>{d.title}</b>
          </div>
          <div className="fx-item">
            <small>{d.front?.contact ? "Contact" : "Gate"}</small>
            <b>{d.front?.contact ? d.phone || d.email : site(d)}</b>
          </div>
        </div>
        <div className="bd2-stub">
          <small>Seat</small>
          <strong>1A</strong>
          {d.front?.qr ? (
            <div className="bd2-qr">
              <Qr d={d} color="#111" />
            </div>
          ) : (
            <svg viewBox={`0 0 ${bars.reduce((s, b) => s + b + 1, 0)} 40`} preserveAspectRatio="none" className="bd2-bars">
              {bars.map((b, i) => {
                const r = <rect key={i} x={x} y={0} width={b} height={40} />;
                x += b + 1;
                return r;
              })}
            </svg>
          )}
          <span className="bd2-tag">{d.tagline}</span>
        </div>
      </>
    );
  },
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="bd2-bg" />
      <div className="bd2-edge" />
      <StdBack d={d} qrColor={p.ink} qrLabel="Scan to board" />
    </>
  ),
};

/* ---------------------------------------------------------------- Vinyl (square) */
export const Vinyl = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="vn-bg" />
      <div className="vn-record fx-spin">
        <div className="vn-grooves" />
        <div className="vn-label">
          <Brand d={d} className="vn-logo" />
          <div className="vn-company" style={{ fontSize: fitSize(d.company, 150, 26, 0.56, 12) }}>
            {d.company}
          </div>
          <div className="vn-tag">{d.tagline}</div>
          <i className="vn-hole" />
        </div>
      </div>
      <div className="vn-sheen" />
      <div className="vn-side fx-fade">
        <span>Side A</span>
        <span>33⅓ RPM</span>
      </div>
      <FrontMeta d={d} className="fm-light vn-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="vn-bg" />
      <div className="vn-tracks">
        <span>Side B</span>
      </div>
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};

/* ---------------------------------------------------------------- Loyalty card (café) */
export const Loyalty = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="ly-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g className="ly-beans">
          {scatter(18, 5, 700, 400)
            .filter((b) => b.x > 470 || b.y > 330)
            .map((b, i) => (
              <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.a * 180})`} className="fx-pop">
                <ellipse rx={9} ry={6} />
                <path d="M-8,0 C-3,-3 3,3 8,0" />
              </g>
            ))}
        </g>
      </svg>
      <div className="ly-main">
        <Brand d={d} className="ly-logo">
          <svg viewBox="0 0 64 64" width={64} height={64} className="ly-cup fx-pop">
            <path d="M12,24 H46 V38 A17,17 0 0 1 29,55 A17,17 0 0 1 12,38Z" />
            <path d="M46,28 h4 a7,7 0 0 1 0,14 h-5" fill="none" strokeWidth={4} />
            <path d="M22,8 c-4,5 4,7 0,12 M31,6 c-4,5 4,7 0,12 M40,8 c-4,5 4,7 0,12" fill="none" strokeWidth={2.6} strokeLinecap="round" />
          </svg>
        </Brand>
        <div className="ly-company fx-fade" style={{ fontSize: fitSize(d.company, 380, 50, 0.56) }}>
          {d.company}
        </div>
        <div className="ly-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="ly-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="ly-bg light" />
      <div className="ly-back">
        <div className="ly-head">
          <b>Loyalty card</b>
          <span>Collect 9 stamps, the 10th is on us</span>
        </div>
        <div className="ly-stamps">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} className={`${i < 3 ? "on" : ""} ${i === 9 ? "gift" : ""} fx-pop`}>
              {i === 9 ? "★" : i < 3 ? "✓" : ""}
            </i>
          ))}
        </div>
        <div className="ly-foot">
          <div>
            <div className="ly-name">{d.name}</div>
            <LocalName d={d} />
            <Contacts d={d} className="ly-contacts" socials={false} />
          </div>
          <div className="ly-qr">
            <Qr d={d} color={p.ink} />
          </div>
        </div>
      </div>
    </>
  ),
};

/* ---------------------------------------------------------------- Circuit */
function traces(seed: number) {
  const r = rng(seed);
  const out: { d: string; end: [number, number] }[] = [];
  const cx = 520;
  const cy = 200;
  for (let i = 0; i < 26; i++) {
    const side = i % 4;
    const k = Math.floor(i / 4);
    // start on the chip edge
    let x = side === 0 ? cx - 70 : side === 1 ? cx + 70 : cx - 54 + (k * 108) / 6;
    let y = side === 2 ? cy - 70 : side === 3 ? cy + 70 : cy - 54 + (k * 108) / 6;
    let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    const dx = side === 0 ? -1 : side === 1 ? 1 : 0;
    const dy = side === 2 ? -1 : side === 3 ? 1 : 0;
    const l1 = 20 + r() * 40;
    x += dx * l1;
    y += dy * l1;
    d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    const diag = (r() > 0.5 ? 1 : -1) * (14 + r() * 26);
    x += dx ? dx * Math.abs(diag) : diag;
    y += dy ? dy * Math.abs(diag) : diag;
    d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    const l2 = 30 + r() * 90;
    x += dx * l2;
    y += dy * l2;
    d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    out.push({ d, end: [x, y] });
  }
  return out;
}

export const Circuit = {
  Front: ({ d }: FaceProps) => {
    const ts = useMemo(() => traces(4), []);
    return (
      <>
        <div className="ci-pcb" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <g className="ci-traces">
            {ts.map((t, i) => (
              <g key={i}>
                <path d={t.d} className="fx-draw" />
                <circle cx={t.end[0]} cy={t.end[1]} r={4.5} className="ci-pad fx-pop" />
              </g>
            ))}
          </g>
          <g transform="translate(520 200)">
            <rect x={-70} y={-70} width={140} height={140} rx={6} className="ci-chip" />
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i}>
                <rect x={-58 + i * 18} y={-78} width={6} height={8} className="ci-pin" />
                <rect x={-58 + i * 18} y={70} width={6} height={8} className="ci-pin" />
                <rect x={-78} y={-58 + i * 18} width={8} height={6} className="ci-pin" />
                <rect x={70} y={-58 + i * 18} width={8} height={6} className="ci-pin" />
              </g>
            ))}
            <circle cx={-54} cy={-54} r={4} className="ci-dot" />
          </g>
        </svg>
        <div className="ci-chiptext">
          <Brand d={d} className="ci-logo">
            <span>{monogram(d.company)}</span>
          </Brand>
        </div>
        <div className="ci-main">
          <div className="ci-company fx-fade" style={{ fontSize: fitSize(d.company, 330, 34, 0.74) }}>
            {d.company}
          </div>
          <div className="ci-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-left fm-light ci-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="ci-pcb" />
      <StdBack d={d} qrColor="#0b2a20" />
    </>
  ),
};

/* ---------------------------------------------------------------- Botanical */
function Sprig({ x, y, len, angle, flip = false, seed }: { x: number; y: number; len: number; angle: number; flip?: boolean; seed: number }) {
  const r = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const bend = Math.sin(t * Math.PI) * len * 0.12 * (flip ? -1 : 1);
    const a = (angle * Math.PI) / 180;
    pts.push([x + Math.cos(a) * len * t - Math.sin(a) * bend, y + Math.sin(a) * len * t + Math.cos(a) * bend]);
  }
  const stem = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
  const leaves: string[] = [];
  for (let i = 2; i < 20; i += 2) {
    const [px, py] = pts[i];
    const side = (i / 2) % 2 ? 1 : -1;
    const la = angle + side * (40 + r() * 15);
    leaves.push(leafPath(px, py, 26 - i * 0.6 + r() * 6, 9, la));
  }
  leaves.push(leafPath(pts[20][0], pts[20][1], 22, 8, angle));
  return (
    <g>
      <path d={stem} className="bt-stem fx-draw" />
      {leaves.map((l, i) => (
        <path key={i} d={l} className="bt-leaf fx-draw" />
      ))}
    </g>
  );
}

export const Botanical = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <Sprig x={40} y={380} len={220} angle={-62} seed={3} />
        <Sprig x={90} y={400} len={150} angle={-80} flip seed={7} />
        <Sprig x={690} y={10} len={200} angle={128} seed={11} />
        <Sprig x={640} y={-10} len={130} angle={105} flip seed={13} />
      </svg>
      <div className="bt-main">
        <Brand d={d} className="bt-logo" />
        <div className="bt-company fx-fade" style={{ fontSize: fitSize(d.company, 420, 48, 0.56) }}>
          {d.company}
        </div>
        <div className="bt-rule fx-fade" />
        <div className="bt-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="bt-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <Sprig x={700} y={-6} len={120} angle={128} seed={21} />
      </svg>
      <StdBack d={d} qrColor={p.ink} />
    </>
  ),
};

/* ---------------------------------------------------------------- Carbon (garage) */
export const Carbon = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="cb-weave" />
      <div className="cb-stripe a" />
      <div className="cb-stripe b" />
      <div className="cb-flag" />
      <div className="cb-main">
        <Brand d={d} className="cb-logo" />
        <div className="cb-company fx-fade" style={{ fontSize: fitSize(d.company, 460, 50, 0.62) }}>
          {d.company}
        </div>
        <div className="cb-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-light cb-fm" />
      <div className="cb-clear" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="cb-weave" />
      <div className="cb-stripe c" />
      <StdBack d={d} qrColor="#111" />
      <div className="cb-clear" />
    </>
  ),
};

/* ---------------------------------------------------------------- Portrait (photo) */
export const Portrait = {
  Front: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="pt-arc" />
      <div className="pt-photo fx-pop">
        <Avatar d={d} p={p} className="pt-img" />
      </div>
      <div className="pt-main">
        <div className="pt-name fx-item" style={{ fontSize: fitSize(d.name, 330, 38, 0.56) }}>
          {d.name}
        </div>
        <LocalName d={d} className="biz-local pt-local fx-item" />
        <div className="pt-title fx-item">{d.title}</div>
        <div className="pt-rule fx-item" />
        <div className="pt-company fx-item">
          <Brand d={d} className="pt-logo" />
          <span>{d.company}</span>
        </div>
        <div className="pt-line fx-item">{[d.phone, d.email].filter(Boolean).join("  ·  ")}</div>
      </div>
      <FrontMeta d={{ ...d, front: { qr: d.front?.qr } }} />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <StdBack d={d} qrColor={p.ink} />
    </>
  ),
};

/* ---------------------------------------------------------------- Photo split */
export const PhotoSplit = {
  Front: ({ d, p }: FaceProps) => (
    <>
      <div className="ps-photo">
        <Avatar d={d} p={p} className="ps-img" scene />
      </div>
      <div className="ps-panel" />
      <div className="ps-main">
        <Brand d={d} className="ps-logo" />
        <div className="ps-company fx-fade" style={{ fontSize: fitSize(d.company, 290, 40, 0.6) }}>
          {d.company}
        </div>
        <div className="ps-tag fx-fade">{d.tagline}</div>
        <div className="ps-name fx-fade">{d.name}</div>
        <div className="ps-title fx-fade">{d.title}</div>
      </div>
      <FrontMeta d={{ ...d, front: { ...d.front, name: false } }} className="fm-light" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="ps-back" />
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};

/* ---------------------------------------------------------------- Shield (insurance / finance) */
export const Shield = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="sh-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g transform="translate(540 200)">
          <circle r={150} className="sh-halo" />
          <path className="sh-shield fx-draw" d="M0,-88 C30,-70 56,-66 76,-66 C76,6 54,58 0,90 C-54,58 -76,6 -76,-66 C-56,-66 -30,-70 0,-88Z" />
          <path className="sh-check fx-draw" d="M-30,0 L-8,22 L34,-24" />
        </g>
      </svg>
      <div className="sh-main">
        <Brand d={d} className="sh-logo" />
        <div className="sh-company fx-item" style={{ fontSize: fitSize(d.company, 380, 38, 0.6) }}>
          {d.company}
        </div>
        <div className="sh-tag fx-item">{d.tagline}</div>
        <div className="sh-person fx-item">
          <b>{d.name}</b>
          <span>{d.title}</span>
        </div>
      </div>
      <FrontMeta d={{ ...d, front: { ...d.front, name: false } }} className="fm-light sh-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="sh-bg light" />
      <StdBack d={d} qrColor={p.paper} />
    </>
  ),
};
