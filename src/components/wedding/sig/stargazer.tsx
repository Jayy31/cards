"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, fmtLongDate, fmtTime, rng, sin } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { placeOf, skyChart } from "@/lib/sky";
import { useCardEnv } from "@/components/card/CardEnv";
import { foilFill, isDark } from "@/components/card/theme";
import { DoubleBorder } from "@/components/card/ornaments";
import type { WedDesign } from "../designs";
import type { IntroDef } from "@/components/viewer/intros";
import { cardClock } from "../live";

/* ============================================================
   Stargazer: the real sky over the venue at the wedding hour.
   ============================================================ */

const venueText = (d: InviteData) => {
  const e = d.events.find((x) => x.id === d.mainEventId) ?? d.events[0];
  return e ? `${e.venue} ${e.address}` : "";
};

/** Moon disc with the true phase (lit limb on the right while waxing). */
export function MoonPhase({ r = 10, illum, waxing, lit, dark }: { r?: number; illum: number; waxing: boolean; lit: string; dark: string }) {
  const rx = Math.abs(r * (1 - 2 * illum));
  const d = `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${illum < 0.5 ? 0 : 1} 0,${-r}Z`;
  return (
    <g>
      <circle r={r} fill={dark} stroke={lit} strokeOpacity={0.5} strokeWidth={0.6} />
      <path d={d} fill={lit} transform={waxing ? undefined : "scale(-1,1)"} />
    </g>
  );
}

/** Circular star chart: stars, constellations, moon, horizon ring with compass ticks. */
export function StarChart({ d, p, size = 380, labels = true }: { d: InviteData; p: Palette; size?: number; labels?: boolean }) {
  const R = size / 2 - 24;
  const place = placeOf(venueText(d));
  const sky = skyChart(d.mainDateTime, place.lat, place.lon, R);
  const dark = isDark(p.paper);
  const starC = dark ? "#fffaf0" : p.ink;
  const fill = foilFill(p);
  const id = "sg" + size;
  const drawField = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.filter = "blur(5px)";
    ctx.globalAlpha = dark ? 0.12 : 0.08;
    ctx.fillStyle = dark ? "#c9d4ff" : p.inkSoft;
    for (const m of sky.milky) {
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.filter = "none";
    ctx.fillStyle = starC;
    sky.milky.forEach((m, i) => {
      if (i % 3) return;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(m.x, m.y, 0.8, 0.8);
    });
    for (const f of sky.faint) {
      ctx.globalAlpha = Math.max(0.25, 0.9 - (f.mag - 3.6) * 0.22);
      ctx.beginPath();
      ctx.arc(f.x, f.y, Math.max(0.3, 1.3 - (f.mag - 3.6) * 0.38), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
  return (
    <div className="sg-chart-box" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} className="sg-disc">
        <defs>
          <radialGradient id={`${id}-disc`} cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor={dark ? p.paper2 : "#ffffff"} />
            <stop offset="0.75" stopColor={dark ? p.paper : p.paper2} />
            <stop offset="1" stopColor={dark ? "#000" : p.paper2} stopOpacity={dark ? 0.6 : 1} />
          </radialGradient>
        </defs>
        <circle r={R} fill={`url(#${id}-disc)`} />
      </svg>
      <StaticCanvas width={size} height={size} draw={drawField} deps={[d.mainDateTime, p.id, size]} />
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} className="sg-chart">
      <defs>
        <radialGradient id={`${id}-disc`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor={dark ? p.paper2 : "#ffffff"} />
          <stop offset="0.75" stopColor={dark ? p.paper : p.paper2} />
          <stop offset="1" stopColor={dark ? "#000" : p.paper2} stopOpacity={dark ? 0.6 : 1} />
        </radialGradient>
        <filter id={`${id}-glow`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id={`${id}-mw`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g fill="none" stroke={starC} strokeOpacity={0.12} strokeWidth={0.6} strokeDasharray="2 3">
        <circle r={R * 0.268} />
        <circle r={R * 0.577} />
        <line x1={-R} y1={0} x2={R} y2={0} />
        <line x1={0} y1={-R} x2={0} y2={R} />
      </g>
      <g stroke={dark ? p.accent2 : p.inkSoft} strokeOpacity={dark ? 0.6 : 0.55} strokeWidth={0.75}>
        {sky.lines.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        ))}
      </g>
      <g>
        {sky.stars.map((s, i) => {
          const r = Math.max(0.7, 3.4 - s.mag * 0.85);
          return (
            <g key={i} className={s.mag < 1.6 ? "twinkle" : undefined} style={s.mag < 1.6 ? { animationDelay: `${(i % 7) * 0.4}s` } : undefined}>
              {s.mag < 1.4 && <circle cx={s.x} cy={s.y} r={r * 2.6} fill={starC} opacity={0.35} filter={`url(#${id}-glow)`} />}
              <circle cx={s.x} cy={s.y} r={r} fill={starC} />
            </g>
          );
        })}
      </g>
      {labels &&
        sky.stars
          .filter((s) => s.mag < 0.9)
          .map((s) => (
            <text key={s.name} x={s.x + 5} y={s.y - 4} className="sg-label" fill={p.inkSoft}>
              {s.name}
            </text>
          ))}
      {sky.moon.pos && (
        <g transform={`translate(${sky.moon.pos.x} ${sky.moon.pos.y})`}>
          <circle r={18} fill={starC} opacity={0.18} filter={`url(#${id}-glow)`} />
          <MoonPhase r={9} illum={sky.moon.illum} waxing={sky.moon.waxing} lit={dark ? "#fff6dc" : p.ink} dark={dark ? p.paper : p.paper2} />
        </g>
      )}
      <circle r={R} fill="none" stroke={fill} strokeWidth={1.6} filter="url(#f-foil)" />
      <circle r={R + 17} fill="none" stroke={fill} strokeWidth={0.8} filter="url(#f-foil)" />
      <g stroke={fill} filter="url(#f-foil)">
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          const len = i % 3 === 0 ? 7 : 3.5;
          return <line key={i} x1={sin(a) * R} y1={-cos(a) * R} x2={sin(a) * (R + len)} y2={-cos(a) * (R + len)} strokeWidth={i % 3 === 0 ? 1.1 : 0.6} />;
        })}
      </g>
      <g className="sg-cardinal" fill={p.ink}>
        <text x={0} y={-R - 6}>N</text>
        <text x={-R - 9} y={3}>E</text>
        <text x={0} y={R + 14}>S</text>
        <text x={R + 9} y={3}>W</text>
      </g>
    </svg>
    </div>
  );
}

/** A canvas painted once (and again if its inputs change). */
function StaticCanvas({ width, height, draw, deps }: { width: number; height: number; draw: (ctx: CanvasRenderingContext2D) => void; deps: unknown[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = width * dpr;
    c.height = height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return <canvas ref={ref} className="sg-field" style={{ width, height }} />;
}

/** Scattered page stars (decor, not astronomy). */
function Dust({ n = 140, seed = 9, color }: { n?: number; seed?: number; color: string }) {
  const r = rng(seed);
  return (
    <svg className="sg-dust" viewBox="0 0 500 700" width={500} height={700}>
      {Array.from({ length: n }, (_, i) => {
        const x = Math.round(r() * 5000) / 10;
        const y = Math.round(r() * 7000) / 10;
        const s = Math.round((0.3 + r() * r() * 1.4) * 100) / 100;
        return <circle key={i} cx={x} cy={y} r={s} fill={color} opacity={0.35 + (i % 5) * 0.12} className={i % 9 === 0 ? "twinkle" : undefined} style={i % 9 === 0 ? { animationDelay: `${(i % 11) * 0.3}s` } : undefined} />;
      })}
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; t: unknown; p: Palette }) {
  const env = useCardEnv();
  const [a, b] = coupleOrder(d);
  const place = placeOf(venueText(d));
  const sky = skyChart(d.mainDateTime, place.lat, place.lon, 100);
  const dark = isDark(p.paper);
  const [, time = "20:00"] = d.mainDateTime.split("T");
  return (
    <div className="page-content cover wd-cover">
      <div className="sg-chart-wrap">
        <StarChart d={d} p={p} size={372} />
      </div>
      <div className="sg-shoot" />
      <div className="sg-text">
        <div className="sg-eyebrow">{d.eyebrow}</div>
        <h1 className="sg-names foil-text">
          {a.name}
          {b?.name && (
            <>
              <span className="sg-amp"> &amp; </span>
              {b.name}
            </>
          )}
        </h1>
        <div className="sg-when">
          {fmtLongDate(d.mainDateTime.split("T")[0])} · {fmtTime(time)}
        </div>
        <div className="sg-coords">
          <svg width={20} height={20} viewBox="-11 -11 22 22">
            <MoonPhase r={8} illum={sky.moon.illum} waxing={sky.moon.waxing} lit={dark ? "#fff6dc" : p.ink} dark={dark ? p.paper2 : p.paper2} />
          </svg>
          <span>
            {place.name} · {Math.abs(place.lat).toFixed(2)}°{place.lat >= 0 ? "N" : "S"} {Math.abs(place.lon).toFixed(2)}°{place.lon >= 0 ? "E" : "W"} · {sky.moon.phase}
          </span>
        </div>
        {env.guest && (
          <div className="cover-guest">
            <span>Dear</span> {env.guest}
          </div>
        )}
      </div>
    </div>
  );
}

export const stargazer: WedDesign = {
  Frame: ({ p, kind }) => (
    <>
      <div className="sg-nebula" />
      <Dust n={kind === "cover" ? 160 : 90} seed={kind.length * 7 + 3} color={isDark(p.paper) ? "#fffaf0" : p.inkSoft} />
      <DoubleBorder fill={foilFill(p)} inset={14} gap={5} beads={false} />
    </>
  ),
  Cover: ({ d, t, p }) => <Cover d={d} t={t} p={p} />,
  Back: ({ p }) => (
    <div className="wd-back-mark">
      <Dust n={120} seed={77} color={isDark(p.paper) ? "#fffaf0" : p.inkSoft} />
    </div>
  ),
};

/* ---------------- intro: warp through the stars ---------------- */

function WarpCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = 600 * dpr;
    c.height = 900 * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(42);
    const stars = Array.from({ length: 420 }, () => ({ a: r() * Math.PI * 2, d: Math.pow(r(), 0.6), s: 0.4 + r() * 1.4 }));
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = Number(c.dataset.p || 0);
      const t = cardClock();
      ctx.clearRect(0, 0, 600, 900);
      const g = ctx.createRadialGradient(300, 450, 0, 300, 450, 520);
      g.addColorStop(0, "rgba(40,50,110,0.55)");
      g.addColorStop(1, "rgba(3,5,15,0.98)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 600, 900);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      for (const st of stars) {
        const dist = ((st.d + p * p * 1.6) % 1.2) * 520;
        const x = 300 + Math.cos(st.a) * dist;
        const y = 450 + Math.sin(st.a) * dist;
        const len = p * p * 160 * (dist / 520);
        const tw = 0.55 + 0.45 * Math.sin(t * 2 + st.a * 7);
        ctx.globalAlpha = Math.min(1, 0.25 + dist / 400) * (p > 0 ? 1 : tw);
        if (len > 1) {
          ctx.lineWidth = st.s;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - Math.cos(st.a) * len, y - Math.sin(st.a) * len);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, st.s * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [color]);
  return <canvas ref={ref} className="wp-canvas" data-p="0" style={{ width: 600, height: 900 }} />;
}

export const warp: IntroDef = {
  end: 2.5,
  burst: 1.9,
  hint: { x: 300, y: 600 },
  Over: ({ data }) => {
    const [a, b] = coupleOrder(data);
    return (
      <div className="in-part wp-wrap">
        <WarpCanvas color="#fffaf0" />
        <div className="wp-title">
          <span>{data.eyebrow}</span>
          <b>
            {a.name}
            {b?.name ? ` & ${b.name}` : ""}
          </b>
        </div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.04, opacity: 0, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".wp-title"), { opacity: 0, scale: 1.3, duration: 0.5, ease: "power2.in" }, 0)
      .to(q(".wp-canvas"), { attr: { "data-p": 1 }, duration: 1.6, ease: "power1.in" }, 0.1)
      .to(holder, { opacity: 1, duration: 0.3 }, 1.1)
      .to(holder, { scale: 1, duration: 1.1, ease: "expo.out" }, 1.1)
      .to(q(".wp-wrap"), { opacity: 0, duration: 0.6 }, 1.75)
      .set(holder, { clearProps: "opacity" }, 2.45);
    return tl;
  },
};
