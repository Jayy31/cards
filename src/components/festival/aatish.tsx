"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { cardClock } from "@/components/wedding/live";
import { mix, R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Aatishbazi: rockets go up, and their sparks gather in the sky
   to spell the greeting, then the family's name; the letters hold,
   twinkle and fall away like real firework embers.
   ============================================================ */

const CYCLE = 10;
type Pt = { x: number; y: number };

/** Sample a line of text into points (where the glyphs are), at the given font and centre. */
function sampleText(text: string, font: string, cx: number, cy: number, maxW: number, step: number): Pt[] {
  const c = document.createElement("canvas");
  c.width = 500;
  c.height = 160;
  const ctx = c.getContext("2d")!;
  let size = 80;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (; size > 18; size -= 2) {
    ctx.font = font.replace("{s}", String(size));
    if (ctx.measureText(text).width <= maxW) break;
  }
  ctx.fillStyle = "#fff";
  ctx.fillText(text, 250, 80);
  const img = ctx.getImageData(0, 0, 500, 160).data;
  const pts: Pt[] = [];
  for (let y = 0; y < 160; y += step)
    for (let x = 0; x < 500; x += step) {
      if (img[(y * 500 + x) * 4 + 3] > 140) pts.push({ x: cx + (x - 250), y: cy + (y - 80) });
    }
  return pts;
}

function burst(ctx: CanvasRenderingContext2D, x: number, y: number, age: number, col: string, seed: number, n = 40) {
  if (age < 0 || age > 1.8) return;
  const r = rng(seed);
  const fade = 1 - age / 1.8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.2;
    const d = (60 + r() * 30) * (1 - Math.exp(-age * 2.6));
    ctx.globalAlpha = Math.max(0, fade) * (0.6 + 0.4 * Math.sin(age * 26 + i));
    ctx.fillStyle = i % 4 ? col : "#fff";
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d + 24 * age * age, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** The particle text canvas. `start` (clock seconds) restarts the show; the intro sets it. */
function SkyWriter({ d, p }: { d: InviteData; p: Palette }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const env = useCardEnv();
  useEffect(() => {
    const c = ref.current!;
    const W = 500;
    const H = 700;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let lines: { pts: Pt[]; seeds: { dl: number; tw: number }[]; origin: Pt; t0: number }[] = [];
    let start = 0;
    const taps: { x: number; y: number; t0: number }[] = [];
    const cols = [p.accent2, p.wax, p.accent, "#9be7ff"];
    let raf = 0;
    const build = () => {
      const script = getComputedStyle(c).getPropertyValue("--fs").trim() || "cursive";
      const display = getComputedStyle(c).getPropertyValue("--fd").trim() || "serif";
      const l1 = sampleText(d.eyebrow, `400 {s}px ${script}`, 250, 190, 430, 4);
      const l2 = sampleText(d.primary.name, `600 {s}px ${display}`, 250, 300, 400, 3);
      const mk = (pts: Pt[], origin: Pt, t0: number, seed: number) => {
        const r = rng(seed);
        return { pts, origin, t0, seeds: pts.map(() => ({ dl: r() * 0.5, tw: r() * 6.28 })) };
      };
      lines = [mk(l1, { x: 250, y: 200 }, 0.75, 11), mk(l2, { x: 250, y: 300 }, 1.85, 22)];
    };
    const onStart = (e: Event) => (start = (e as CustomEvent).detail);
    const onTap = (e: Event) => taps.push({ ...(e as CustomEvent).detail, t0: cardClock() });
    window.addEventListener("at-start", onStart);
    window.addEventListener("at-tap", onTap);
    const dotScale = env.mode === "thumb" ? 2.2 : 1;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const lt = (((t - start) % CYCLE) + CYCLE) % CYCLE;
      // rockets rising to where each line forms
      for (const L of lines) {
        const rise = lt - (L.t0 - 0.7);
        if (rise >= 0 && rise < 0.7) {
          const k = rise / 0.7;
          const e = 1 - (1 - k) * (1 - k);
          const y = 680 - (680 - L.origin.y) * e;
          ctx.globalAlpha = 1;
          ctx.strokeStyle = "rgba(255,220,150,0.85)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(L.origin.x, y);
          ctx.lineTo(L.origin.x, y + 30);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "lighter";
      for (const [li, L] of lines.entries()) {
        const a = lt - L.t0;
        if (a < 0) continue;
        const col = li === 0 ? p.wax : p.accent2;
        for (let i = 0; i < L.pts.length; i++) {
          const s = L.seeds[i];
          const tp = L.pts[i];
          const fly = Math.min(1, Math.max(0, (a - s.dl * 0.6) / 1.1));
          const e = 1 - Math.pow(1 - fly, 3);
          let x = L.origin.x + (tp.x - L.origin.x) * e;
          let y = L.origin.y + (tp.y - L.origin.y) * e;
          let alpha = Math.min(1, a * 4);
          const fallStart = 6.4 - L.t0 + li * 0.3;
          if (a > fallStart) {
            const f = a - fallStart;
            y += 40 * f * f + f * 10;
            x += Math.sin(s.tw + f * 3) * 4 * f;
            alpha *= Math.max(0, 1 - f / 1.8);
          }
          if (alpha <= 0) continue;
          const tw = fly >= 1 ? 0.55 + 0.45 * Math.sin(t * 7 + s.tw) : 1;
          ctx.globalAlpha = alpha * tw;
          ctx.fillStyle = fly < 1 ? "#fff6dc" : i % 5 ? col : "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, (li === 0 ? 1.7 : 1.5) * dotScale, 0, Math.PI * 2);
          ctx.fill();
        }
        // the flash where each rocket opens
        if (a < 0.25) {
          const g = ctx.createRadialGradient(L.origin.x, L.origin.y, 0, L.origin.x, L.origin.y, 140);
          g.addColorStop(0, `rgba(255,240,200,${0.6 * (1 - a / 0.25)})`);
          g.addColorStop(1, "rgba(255,240,200,0)");
          ctx.globalAlpha = 1;
          ctx.fillStyle = g;
          ctx.fillRect(L.origin.x - 140, L.origin.y - 140, 280, 280);
        }
      }
      // background bursts and taps
      const k = Math.floor(t / 1.7);
      for (let j = k - 1; j <= k; j++) {
        const r = rng(j * 131 + 7);
        burst(ctx, 60 + r() * 380, 380 + r() * 90, t - j * 1.7 - r() * 0.4, cols[j & 3], j + 50, 28);
      }
      for (const tp of taps.slice(-6)) burst(ctx, tp.x, tp.y, t - tp.t0, cols[Math.round(tp.t0 * 10) & 3], Math.round(tp.t0 * 100), 50);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };
    let ready = false;
    document.fonts.ready.then(() => {
      build();
      ready = true;
      if (env.mode === "thumb") draw(4.2);
    });
    if (env.mode !== "thumb") {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (ready) draw(cardClock());
      };
      loop();
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("at-start", onStart);
      window.removeEventListener("at-tap", onTap);
    };
  }, [d.eyebrow, d.primary.name, p.accent2, p.wax, p.accent, env.mode]);
  return <canvas ref={ref} className="at-canvas" style={{ width: 500, height: 700 }} />;
}

function Skyline({ p }: { p: Palette }) {
  const r = rng(61);
  const c = mix(p.paper, "#000", 0.5);
  let x = -10;
  const blocks: React.ReactNode[] = [];
  let i = 0;
  while (x < 510) {
    const w = 30 + r() * 46;
    const h = 40 + r() * 90;
    blocks.push(<rect key={i} x={R1(x)} y={R1(700 - 70 - h)} width={R1(w)} height={R1(h + 80)} fill={c} />);
    if (i % 4 === 1) blocks.push(<path key={`d${i}`} d={`M${R1(x + w * 0.15)},${R1(630 - h)} A${R1(w * 0.35)},${R1(w * 0.35)} 0 0 1 ${R1(x + w * 0.85)},${R1(630 - h)}Z`} fill={c} />);
    for (let k = 0; k < 4; k++) if (r() > 0.5) blocks.push(<rect key={`w${i}-${k}`} x={R1(x + 6 + r() * (w - 14))} y={R1(640 - h + r() * (h - 10))} width={3} height={4} fill={p.wax} opacity={0.8} />);
    x += w + 3;
    i++;
  }
  return (
    <svg className="at-skyline" viewBox="0 0 500 700" width={500} height={700}>
      {blocks}
      <rect y={668} width={500} height={32} fill={mix(c, "#000", 0.3)} />
    </svg>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const tap = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    window.dispatchEvent(new CustomEvent("at-tap", { detail: { x: ((e.clientX - r.left) / r.width) * 500, y: ((e.clientY - r.top) / r.height) * 520 } }));
  };
  return (
    <div className="page-content cover wd-cover">
      <div className="at-sky" />
      <svg className="at-stars" viewBox="0 0 500 700" width={500} height={700}>
        {Array.from({ length: 60 }, (_, i) => {
          const r = rng(i * 7 + 2);
          return <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 520)} r={R1(0.4 + r())} fill="#fff" opacity={R1(0.2 + r() * 0.5)} />;
        })}
      </svg>
      <SkyWriter d={d} p={p} />
      <Skyline p={p} />
      <h1 className="sr-only">{d.eyebrow}</h1>
      <div className="at-pre">{fromText(d)}</div>
      <div className="at-bottom">
        {d.blessingLine && <p className="at-wish">{d.blessingLine}</p>}
        {env.guest && <div className="at-guest">For {env.guest}</div>}
      </div>
      {env.mode === "live" && (
        <>
          <div className="at-tap" data-no-flip onPointerDown={tap} />
          <div className="at-hint">Tap the sky for more fireworks</div>
        </>
      )}
    </div>
  );
}

export const aatish: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="at-sky inner" />
        <div className="at-glow" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="at-sky inner" />
    </div>
  ),
};

/* ---------------- intro: darkness, then the first rocket spells the greeting ---------------- */

export const launchname: IntroDef = {
  end: 3.4,
  burst: 2.8,
  hint: { x: 300, y: 450 },
  Over: () => <div className="in-part ln-veil" />,
  build: (q) => {
    gsap.set(q(".at-bottom"), { opacity: 0, y: 10 });
    gsap.set(q(".at-pre"), { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.call(() => window.dispatchEvent(new CustomEvent("at-start", { detail: cardClock() })), [], 0)
      .to(q(".ln-veil"), { opacity: 0, duration: 0.7 }, 0.05)
      .to(q(".at-pre"), { opacity: 1, duration: 0.5 }, 1.7)
      .to(q(".at-bottom"), { opacity: 1, y: 0, duration: 0.7 }, 2.6)
      .set(q(".at-bottom, .at-pre"), { clearProps: "opacity,transform" }, 3.35);
    return tl;
  },
};
