"use client";
import { useId, useMemo } from "react";
import { rng } from "@/lib/format";
import { isDark } from "@/components/card/theme";
import { Avatar, Brand, Contacts, type FaceProps, fitSize, FrontMeta, LocalName, monogram, Qr, scatter, StdBack, twoLines } from "../parts";

/*
 * Trend collection: what is popular in card design right now: mesh
 * gradients, glassmorphism, bento grids, neo-brutalism, Y2K chrome, 70s
 * revival, Art Deco, Japanese minimalism, topographic lines, terrazzo,
 * Memphis, duotone photography. Everything is drawn in code.
 */

const site = (d: FaceProps["d"]) => d.website.replace(/^https?:\/\//, "");
const qrInk = (p: FaceProps["p"]) => (isDark(p.paper) ? "#111" : p.ink);

/* ---------------------------------------------------------------- Aurora */
export const Aurora = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="au-mesh">
        <i className="m1" />
        <i className="m2" />
        <i className="m3" />
        <i className="m4" />
      </div>
      <div className="bz-grain" />
      <div className="au-top">
        <Brand d={d} className="au-logo fx-pop">
          <div className="au-mark fx-pop">{monogram(d.company)}</div>
        </Brand>
        <span className="au-site fx-fade">{site(d)} ↗</span>
      </div>
      <div className="au-main">
        <div className="au-company fx-fade" style={{ fontSize: fitSize(d.company, 560, 58, 0.58) }}>
          {d.company}
        </div>
        <div className="au-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-light au-fm" />
      <div className="bz-sheen" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="au-mesh dim">
        <i className="m1" />
        <i className="m2" />
        <i className="m3" />
        <i className="m4" />
      </div>
      <div className="bz-grain" />
      <StdBack d={d} qrColor="#10121a" />
      <div className="bz-sheen" />
    </>
  ),
};

/* ---------------------------------------------------------------- Sunset (portrait) */
export const Sunset = {
  Front: ({ d }: FaceProps) => {
    const words = d.company.split(/\s+/);
    const longest = words.reduce((m, w) => Math.max(m, w.length), 1);
    return (
      <>
        <div className="ss-sky" />
        <svg className="bz-svg ss-arcs" viewBox="0 0 400 700">
          {[150, 190, 230].map((r, i) => (
            <circle key={r} cx={290} cy={250} r={r} fill="none" strokeWidth={1} opacity={0.5 - i * 0.12} className="fx-draw" />
          ))}
          <circle cx={290} cy={250} r={96} className="ss-sun fx-pop" />
        </svg>
        <div className="bz-grain" />
        <div className="ss-top">
          <Brand d={d} className="ss-logo">
            <span className="ss-mono">{monogram(d.company)}</span>
          </Brand>
        </div>
        <div className="ss-bottom">
          <div className="ss-company" style={{ fontSize: Math.min(64, Math.floor(330 / (longest * 0.52))) }}>
            {words.map((w, i) => (
              <span key={i} className="fx-fade">
                {w}
              </span>
            ))}
          </div>
          <div className="ss-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light ss-fm" />
        <div className="bz-sheen" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="ss-sky soft" />
      <div className="bz-grain" />
      <StdBack d={d} qrColor="#2a1020" />
    </>
  ),
};

/* ---------------------------------------------------------------- Glassmorphism */
export const Glass = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="gl-bg" />
      <i className="gl-orb o1 fx-pop" />
      <i className="gl-orb o2 fx-pop" />
      <i className="gl-orb o3 fx-pop" />
      <div className="gl-panel fx-fade">
        <Brand d={d} className="gl-logo">
          <div className="gl-mark">{monogram(d.company)}</div>
        </Brand>
        <div>
          <div className="gl-company" style={{ fontSize: fitSize(d.company, 330, 40, 0.55) }}>
            {d.company}
          </div>
          <div className="gl-tag">{d.tagline}</div>
        </div>
      </div>
      <FrontMeta d={d} className="fm-light" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="gl-bg" />
      <i className="gl-orb o2" />
      <div className="gl-panel back" />
      <StdBack d={d} qrColor="#1a1030" />
    </>
  ),
};

/* ---------------------------------------------------------------- Bento grid */
export const Bento = {
  Front: ({ d, p }: FaceProps) => (
    <div className="bn-grid">
      <div className="bn-tile bn-hero fx-item">
        <Brand d={d} className="bn-logo">
          <div className="bn-mark">{monogram(d.company)}</div>
        </Brand>
        <div>
          <div className="bn-company" style={{ fontSize: fitSize(d.company, 250, 32, 0.56) }}>
            {d.company}
          </div>
          <div className="bn-tag">{d.tagline}</div>
        </div>
      </div>
      <div className="bn-tile bn-services fx-item">
        <span className="bn-label">What we do</span>
        <div className="bn-chips">
          {d.services.slice(0, 5).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
      <div className="bn-tile bn-qr fx-item">
        <Qr d={d} color={p.ink} />
        <span>Save contact</span>
      </div>
      <div className="bn-tile bn-web fx-item">
        {d.front?.name || d.front?.contact ? (
          <FrontMeta d={{ ...d, front: { ...d.front, qr: false } }} className="fm-inline bn-fm" />
        ) : (
          <>
            <span className="bn-label">Find us</span>
            <b>{site(d)}</b>
          </>
        )}
      </div>
    </div>
  ),
  Back: ({ d, p }: FaceProps) => (
    <div className="bn-grid back">
      <div className="bn-tile bn-person fx-item">
        <div className="bn-name">{d.name}</div>
        <LocalName d={d} />
        <div className="bn-title">{d.title}</div>
      </div>
      <div className="bn-tile bn-contacts fx-item">
        <Contacts d={d} className="bn-list" />
      </div>
      <div className="bn-tile bn-qr fx-item">
        <Qr d={d} color={p.ink} />
        <span>Scan me</span>
      </div>
    </div>
  ),
};

/* ---------------------------------------------------------------- Neo-brutalism */
export const Brutal = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="br-dots" />
      <svg className="bz-svg br-squiggle" viewBox="0 0 700 400">
        <path d="M430,330 q20,-30 40,0 t40,0 t40,0 t40,0" fill="none" strokeWidth={6} strokeLinecap="round" className="fx-pop" />
      </svg>
      <div className="br-box fx-pop">
        <Brand d={d} className="br-logo" />
        <div className="br-company" style={{ fontSize: fitSize(d.company, 380, 50, 0.66) }}>
          {d.company}
        </div>
        <div className="br-tag">{d.tagline}</div>
      </div>
      <div className="br-sticker fx-pop">
        <span>{monogram(d.company)}</span>
      </div>
      <div className="br-site fx-pop">{site(d)}</div>
      <FrontMeta d={d} className="br-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="br-dots light" />
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};

/* ---------------------------------------------------------------- Y2K chrome */
function Sparkle({ x, y, s, cls = "" }: { x: number; y: number; s: number; cls?: string }) {
  return <path className={`y2-spark fx-pop ${cls}`} d={`M${x},${y - s} C${x + s * 0.12},${y - s * 0.12} ${x + s * 0.12},${y - s * 0.12} ${x + s},${y} C${x + s * 0.12},${y + s * 0.12} ${x + s * 0.12},${y + s * 0.12} ${x},${y + s} C${x - s * 0.12},${y + s * 0.12} ${x - s * 0.12},${y + s * 0.12} ${x - s},${y} C${x - s * 0.12},${y - s * 0.12} ${x - s * 0.12},${y - s * 0.12} ${x},${y - s}Z`} />;
}

function ChromeDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`chr${id}`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.28" stopColor="#c9cfdc" />
        <stop offset="0.46" stopColor="#4a4f5c" />
        <stop offset="0.5" stopColor="#1d2029" />
        <stop offset="0.56" stopColor="#dfe5f1" />
        <stop offset="0.78" stopColor="#8d95a8" />
        <stop offset="1" stopColor="#f5f7fb" />
      </linearGradient>
    </defs>
  );
}

export const ChromeY2K = {
  Front: ({ d }: FaceProps) => {
    const id = useId().replace(/:/g, "");
    return (
      <>
        <div className="y2-bg" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          <ChromeDefs id={id} />
          <path className="fx-pop" fill={`url(#chr${id})`} d="M560,40 C640,30 690,90 668,160 C650,216 690,250 660,300 C628,352 560,356 520,318 C486,286 440,300 420,260 C396,212 440,180 470,150 C500,120 480,50 560,40Z" />
          <path fill="#fff" opacity={0.7} d="M560,62 C600,58 630,78 628,100 C610,86 590,80 560,84Z" />
          <Sparkle x={84} y={70} s={16} />
          <Sparkle x={620} y={345} s={22} />
          <Sparkle x={455} y={96} s={11} />
          <Sparkle x={300} y={330} s={9} cls="dim" />
        </svg>
        <div className="y2-main">
          <Brand d={d} className="y2-logo" />
          <div className="y2-company" style={{ fontSize: fitSize(d.company, 460, 50, 0.78) }}>
            {d.company}
          </div>
          <div className="y2-tag">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light fm-left" />
        <div className="bz-sheen" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="y2-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <Sparkle x={650} y={50} s={14} />
        <Sparkle x={612} y={80} s={7} cls="dim" />
      </svg>
      <StdBack d={d} qrColor="#101018" />
    </>
  ),
};

/* ---------------------------------------------------------------- Groovy 70s */
function Rainbow({ cx, cy, r0, w, flip = false }: { cx: number; cy: number; r0: number; w: number; flip?: boolean }) {
  const cols = ["var(--accent)", "var(--accent2)", "var(--g3)", "var(--g4)"];
  return (
    <g>
      {cols.map((c, i) => {
        const r = r0 + i * w;
        return <path key={i} className="fx-draw" d={flip ? `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx},${cy - r}` : `M${cx},${cy - r} A${r},${r} 0 0 1 ${cx + r},${cy}`} fill="none" stroke={c} strokeWidth={w - 2} strokeLinecap="butt" />;
      })}
    </g>
  );
}

export const Groovy = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="gr-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <Rainbow cx={700} cy={400} r0={70} w={34} flip />
        <path className="gr-wave fx-draw" d="M40,70 q30,-24 60,0 t60,0 t60,0" />
        <path className="gr-wave fx-draw" d="M40,92 q30,-24 60,0 t60,0 t60,0" />
      </svg>
      <div className="bz-grain" />
      <div className="gr-main">
        <Brand d={d} className="gr-logo" />
        <div className="gr-company fx-fade" style={{ fontSize: fitSize(d.company, 400, 56, 0.6) }}>
          {d.company}
        </div>
        <div className="gr-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-left gr-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="gr-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <Rainbow cx={0} cy={400} r0={24} w={16} />
      </svg>
      <div className="bz-grain" />
      <StdBack d={d} qrColor="#3a200e" />
    </>
  ),
};

/* ---------------------------------------------------------------- Gatsby Deco (portrait) */
function DecoName({ text }: { text: string }) {
  const [l1, l2] = twoLines(text);
  return (
    <div className="dc-company foil-text gild" style={{ fontSize: fitSize(l1.length > l2.length ? l1 : l2, 300, 40, 0.78) }}>
      <span>{l1}</span>
      {l2 && <span>{l2}</span>}
    </div>
  );
}

function DecoFan() {
  const rays = Array.from({ length: 17 }, (_, i) => {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 17;
    return `M200,250 L${(200 + Math.cos(a) * 170).toFixed(1)},${(250 + Math.sin(a) * 170).toFixed(1)}`;
  });
  return (
    <g filter="url(#f-foil)" fill="none" stroke="url(#foil-gold)">
      {rays.map((r, i) => (
        <path key={i} d={r} strokeWidth={i % 2 ? 0.8 : 1.6} className="fx-draw" />
      ))}
      <path d="M40,250 A160,160 0 0 1 360,250" strokeWidth={2} className="fx-draw" />
      <path d="M80,250 A120,120 0 0 1 320,250" strokeWidth={1} className="fx-draw" />
      <path d="M150,250 A50,50 0 0 1 250,250" strokeWidth={1.6} className="fx-draw" />
      <path d="M40,250 H360" strokeWidth={1.2} />
      <path d="M24,24 H376 V676 H24Z M34,34 H366 V666 H34Z" strokeWidth={1} />
      <path d="M24,70 H54 V24 M346,24 V54 H376 M24,630 H54 V676 M376,630 H346 V676" strokeWidth={1.4} />
    </g>
  );
}

export const GatsbyDeco = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="dc-bg" />
      <svg className="bz-svg" viewBox="0 0 400 700">
        <DecoFan />
      </svg>
      <div className="dc-main">
        <Brand d={d} className="dc-logo" />
        <DecoName text={d.company} />
        <svg viewBox="0 0 160 14" className="dc-div">
          <g fill="url(#foil-gold)">
            <path d="M0,7 H62 L70,1 L78,7 L70,13 L62,7 M98,7 H160 M82,7 L90,1 L98,7 L90,13Z" stroke="url(#foil-gold)" strokeWidth={1} />
          </g>
        </svg>
        <div className="dc-tag">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-center dc-fm" />
      <div className="paper-sheen" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="dc-bg" />
      <svg className="bz-svg" viewBox="0 0 400 700">
        <g fill="none" stroke="url(#foil-gold)" filter="url(#f-foil)">
          <path d="M24,24 H376 V676 H24Z M34,34 H366 V666 H34Z" strokeWidth={1} />
        </g>
      </svg>
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};

/* ---------------------------------------------------------------- Zen ensō (square) */
function ensoPaths(cx: number, cy: number, r: number) {
  const out: { d: string; w: number; o: number }[] = [];
  const rr = rng(12);
  for (let k = 0; k < 7; k++) {
    const dr = (rr() - 0.5) * 9;
    const start = (-70 + rr() * 6) * (Math.PI / 180);
    const end = start + (318 - k * 5 - rr() * 10) * (Math.PI / 180);
    let d = "";
    for (let i = 0; i <= 90; i++) {
      const t = start + ((end - start) * i) / 90;
      const wob = 1 + 0.02 * Math.sin(t * 3 + k);
      d += `${i ? "L" : "M"}${(cx + (r + dr) * wob * Math.cos(t)).toFixed(1)},${(cy + (r + dr) * wob * Math.sin(t)).toFixed(1)}`;
    }
    out.push({ d, w: 16 - k * 1.6, o: 0.25 + 0.12 * (7 - k) * 0.15 });
  }
  return out;
}

export const Enso = {
  Front: ({ d }: FaceProps) => {
    const strokes = useMemo(() => ensoPaths(260, 222, 150), []);
    return (
      <>
        <div className="en-paper" />
        <svg className="bz-svg" viewBox="0 0 520 520">
          <g className="en-ink" filter="url(#f-brush)">
            {strokes.map((s, i) => (
              <path key={i} d={s.d} strokeWidth={s.w} opacity={i === 0 ? 0.95 : s.o} fill="none" strokeLinecap="round" className="fx-draw" />
            ))}
          </g>
        </svg>
        <div className="en-center">
          <Brand d={d} className="en-logo">
            <span className="en-mono fx-fade">{monogram(d.company)}</span>
          </Brand>
        </div>
        <div className="en-company fx-fade" style={{ fontSize: fitSize(d.company, 380, 30, 0.62) }}>
          {d.company}
        </div>
        <div className="en-tag fx-fade">{d.tagline}</div>
        <div className="en-hanko fx-pop">
          <span>{d.name.slice(0, 1)}</span>
        </div>
        <FrontMeta d={d} className="fm-left en-fm" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="en-paper" />
      <StdBack d={d} qrColor="#1b1b1b" />
      <div className="en-hanko small">
        <span>{d.name.slice(0, 1)}</span>
      </div>
    </>
  ),
};

/* ---------------------------------------------------------------- Mono minimal (portrait) */
export const MonoMinimal = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <div className="mo-center">
        <Brand d={d} className="mo-logo">
          <div className="mo-mark fx-fade">{monogram(d.company)}</div>
        </Brand>
        <div className="mo-company fx-fade">{d.company}</div>
      </div>
      <div className="mo-line" />
      <div className="mo-foot fx-fade">{site(d)}</div>
      <FrontMeta d={d} className="fm-center mo-fm" />
    </>
  ),
  Back: ({ d, p }: FaceProps) => (
    <>
      <div className="paper-grain" />
      <StdBack d={d} qrColor={qrInk(p)} rule={<div className="mo-rule" />} />
    </>
  ),
};

/* ---------------------------------------------------------------- Topographic */
/** Marching squares over a sum of hills: real, non-crossing contour lines. */
function contours(w: number, h: number, seed: number, levels: number) {
  const r = rng(seed);
  const hills = Array.from({ length: 5 }, () => ({ x: r() * w, y: r() * h, s: 60 + r() * 140, a: 0.5 + r() }));
  const f = (x: number, y: number) => hills.reduce((v, k) => v + k.a * Math.exp(-((x - k.x) ** 2 + (y - k.y) ** 2) / (2 * k.s * k.s)), 0) + 0.06 * Math.sin(x * 0.02) * Math.cos(y * 0.03);
  const c = 8;
  const nx = Math.ceil(w / c) + 1;
  const ny = Math.ceil(h / c) + 1;
  const g: number[] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) g.push(f(i * c, j * c));
  const max = Math.max(...g);
  const paths: string[] = [];
  for (let L = 1; L <= levels; L++) {
    const t = (max * L) / (levels + 1);
    let d = "";
    for (let j = 0; j < ny - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        const v = [g[j * nx + i], g[j * nx + i + 1], g[(j + 1) * nx + i + 1], g[(j + 1) * nx + i]];
        const idx = (v[0] > t ? 8 : 0) | (v[1] > t ? 4 : 0) | (v[2] > t ? 2 : 0) | (v[3] > t ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const x = i * c;
        const y = j * c;
        const lerp = (a: number, b: number) => (t - a) / (b - a);
        const T = [x + c * lerp(v[0], v[1]), y];
        const R = [x + c, y + c * lerp(v[1], v[2])];
        const B = [x + c * lerp(v[3], v[2]), y + c];
        const Lf = [x, y + c * lerp(v[0], v[3])];
        const seg = (a: number[], b: number[]) => (d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`);
        const table: Record<number, [number[], number[]][]> = {
          1: [[Lf, B]], 2: [[B, R]], 3: [[Lf, R]], 4: [[T, R]], 5: [[Lf, T], [B, R]], 6: [[T, B]], 7: [[Lf, T]],
          8: [[Lf, T]], 9: [[T, B]], 10: [[T, R], [Lf, B]], 11: [[T, R]], 12: [[Lf, R]], 13: [[B, R]], 14: [[Lf, B]],
        };
        table[idx].forEach(([a, b]) => seg(a, b));
      }
    paths.push(d);
  }
  return paths;
}

export const Topo = {
  Front: ({ d, w, h }: FaceProps) => {
    const lines = useMemo(() => contours(w, h, 7, 11), [w, h]);
    return (
      <>
        <div className="tp-bg" />
        <svg className="bz-svg tp-lines" viewBox={`0 0 ${w} ${h}`}>
          {lines.map((l, i) => (
            <path key={i} d={l} className={`fx-draw ${i % 4 === 3 ? "idx" : ""}`} />
          ))}
        </svg>
        <div className="tp-main">
          <Brand d={d} className="tp-logo" />
          <div className="tp-company fx-fade" style={{ fontSize: fitSize(d.company, 420, 46, 0.56) }}>
            {d.company}
          </div>
          <div className="tp-tag fx-fade">{d.tagline}</div>
        </div>
        <div className="tp-coord fx-fade">N 23°01′ · E 72°34′</div>
        <FrontMeta d={d} className="tp-fm" />
      </>
    );
  },
  Back: ({ d, w, h }: FaceProps) => {
    const lines = useMemo(() => contours(w, h, 19, 7), [w, h]);
    return (
      <>
        <div className="tp-bg" />
        <svg className="bz-svg tp-lines faint" viewBox={`0 0 ${w} ${h}`}>
          {lines.map((l, i) => (
            <path key={i} d={l} />
          ))}
        </svg>
        <StdBack d={d} qrColor="#15201a" />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Terrazzo */
function chips(seed: number, w: number, h: number, avoid: { x: number; y: number; w: number; h: number }, n: number) {
  const r = rng(seed);
  const out: { d: string; c: number }[] = [];
  let tries = 0;
  while (out.length < n && tries++ < n * 6) {
    const x = r() * w;
    const y = r() * h;
    if (x > avoid.x - 8 && x < avoid.x + avoid.w + 8 && y > avoid.y - 8 && y < avoid.y + avoid.h + 8) continue;
    const s = 4 + r() ** 2 * 20;
    const k = 4 + Math.floor(r() * 4);
    const rot = r() * Math.PI;
    let d = "";
    for (let i = 0; i < k; i++) {
      const a = rot + (i / k) * Math.PI * 2 + (r() - 0.5) * 0.7;
      const rr = s * (0.6 + r() * 0.5);
      d += `${i ? "L" : "M"}${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
    }
    out.push({ d: d + "Z", c: Math.floor(r() * 4) });
  }
  return out;
}

export const Terrazzo = {
  Front: ({ d }: FaceProps) => {
    const cs = useMemo(() => chips(3, 700, 400, { x: 150, y: 120, w: 400, h: 160 }, 110), []);
    return (
      <>
        <div className="tz-bg" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          {cs.map((c, i) => (
            <path key={i} d={c.d} className={`tz-c${c.c} fx-pop`} />
          ))}
        </svg>
        <div className="tz-label fx-fade">
          <Brand d={d} className="tz-logo" />
          <div className="tz-company" style={{ fontSize: fitSize(d.company, 340, 40, 0.52) }}>
            {d.company}
          </div>
          <div className="tz-tag">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="tz-fm" />
        <div className="paper-sheen" />
      </>
    );
  },
  Back: ({ d, p }: FaceProps) => {
    const cs = useMemo(() => chips(8, 700, 400, { x: 30, y: 30, w: 640, h: 340 }, 70), []);
    return (
      <>
        <div className="tz-bg" />
        <svg className="bz-svg" viewBox="0 0 700 400">
          {cs.map((c, i) => (
            <path key={i} d={c.d} className={`tz-c${c.c}`} />
          ))}
        </svg>
        <div className="tz-panel" />
        <StdBack d={d} qrColor={p.ink} />
      </>
    );
  },
};

/* ---------------------------------------------------------------- Memphis */
export const Memphis = {
  Front: ({ d }: FaceProps) => (
    <>
      <div className="mp-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <g className="mp-dots fx-pop">
          {Array.from({ length: 20 }, (_, i) => (
            <circle key={i} cx={560 + (i % 5) * 18} cy={40 + Math.floor(i / 5) * 18} r={3.5} />
          ))}
        </g>
        <path className="mp-sq fx-pop" d="M40,330 q15,-30 30,0 t30,0 t30,0 t30,0 t30,0" />
        <path className="mp-tri fx-pop" d="M590,300 L640,380 L540,380Z" />
        <circle className="mp-ring fx-pop" cx={80} cy={70} r={34} />
        <path className="mp-half fx-pop" d="M470,40 a40,40 0 0 1 80,0Z" />
        <path className="mp-zig fx-pop" d="M250,370 l20,-20 l20,20 l20,-20 l20,20 l20,-20" />
        <rect className="mp-conf a fx-pop" x={420} y={330} width={30} height={10} transform="rotate(-24 435 335)" />
        <rect className="mp-conf b fx-pop" x={150} y={40} width={24} height={9} transform="rotate(30 162 44)" />
        <circle className="mp-solid fx-pop" cx={650} cy={200} r={14} />
      </svg>
      <div className="mp-main">
        <Brand d={d} className="mp-logo" />
        <div className="mp-company fx-fade" style={{ fontSize: fitSize(d.company, 460, 56, 0.6) }}>
          {d.company}
        </div>
        <div className="mp-tag fx-fade">{d.tagline}</div>
      </div>
      <FrontMeta d={d} className="fm-left mp-fm" />
    </>
  ),
  Back: ({ d }: FaceProps) => (
    <>
      <div className="mp-bg" />
      <svg className="bz-svg" viewBox="0 0 700 400">
        <path className="mp-sq" d="M540,370 q15,-30 30,0 t30,0 t30,0 t30,0" />
        <circle className="mp-ring" cx={660} cy={40} r={22} />
      </svg>
      <StdBack d={d} qrColor="#1b1b2b" />
    </>
  ),
};

/* ---------------------------------------------------------------- Duotone photo */
export const Duotone = {
  Front: ({ d, p }: FaceProps) => {
    const [l1, l2] = twoLines(d.company);
    return (
      <>
        <div className="du-photo">
          <Avatar d={d} p={p} className="du-img" scene />
          <div className="du-light" />
          <div className="du-dark" />
        </div>
        <div className="du-shade" />
        <div className="du-main">
          <Brand d={d} className="du-logo" />
          <div className="du-company" style={{ fontSize: fitSize(l1.length > l2.length ? l1 : l2, 460, 84, 0.5) }}>
            <span className="fx-fade">{l1}</span>
            {l2 && <span className="fx-fade">{l2}</span>}
          </div>
          <div className="du-tag fx-fade">{d.tagline}</div>
        </div>
        <FrontMeta d={d} className="fm-light" />
      </>
    );
  },
  Back: ({ d }: FaceProps) => (
    <>
      <div className="du-back" />
      <StdBack d={d} qrColor="#111" />
    </>
  ),
};
