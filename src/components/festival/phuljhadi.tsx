"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { cardClock } from "@/components/wedding/live";
import { R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Phuljhadi: a sparkler writes the greeting in light, like a
   long-exposure photograph. Draw with your own sparkler.
   ============================================================ */

/** Where the sparkler rests on the card once the writing is done. */
const REST = { x: 404, y: 452 };

/**
 * Sparkler sparks, deterministic in time (frame-exact in video): every
 * 1/60 s a handful of sparks leave the tip, fly out, fork and fade.
 */
export function drawSparks(ctx: CanvasRenderingContext2D, t: number, x: number, y: number, intensity = 1) {
  const f0 = Math.floor(t * 60);
  ctx.lineCap = "round";
  for (let j = 0; j < 26; j++) {
    const f = f0 - j;
    const age = (t * 60 - f) / 60;
    for (let i = 0; i < Math.round(7 * intensity); i++) {
      const r = rng(((f * 131 + i * 7919) >>> 0) + 1);
      const life = 0.18 + r() * 0.28;
      if (age > life) continue;
      const a = r() * Math.PI * 2;
      const sp = 120 + r() * 220;
      const k = age / life;
      const d = sp * age;
      const px = x + Math.cos(a) * d;
      const py = y + Math.sin(a) * d + 160 * age * age;
      const len = 4 + r() * 8;
      ctx.globalAlpha = (1 - k) * 0.95;
      ctx.strokeStyle = k < 0.35 ? "#fffbe8" : "#ffc86b";
      ctx.lineWidth = 1.2 * (1 - k * 0.5);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - Math.cos(a) * len, py - Math.sin(a) * len);
      ctx.stroke();
      // the little forks that make a sparkler look like a sparkler
      if (r() > 0.55 && k > 0.4) {
        const b = a + (r() - 0.5) * 1.6;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(b) * len * 0.8, py + Math.sin(b) * len * 0.8);
        ctx.stroke();
      }
    }
  }
  const g = ctx.createRadialGradient(x, y, 0, x, y, 40 * intensity);
  g.addColorStop(0, "rgba(255,250,220,0.95)");
  g.addColorStop(0.25, "rgba(255,190,90,0.45)");
  g.addColorStop(1, "rgba(255,140,40,0)");
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 40 * intensity, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/** Sparks at the resting tip, plus finger-drawn light trails that slowly fade. */
function SparkCanvas({ draw }: { draw: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const zone = useRef<HTMLDivElement>(null);
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
    // persistent layer for the light trails
    const trail = document.createElement("canvas");
    trail.width = W * dpr;
    trail.height = H * dpr;
    const tctx = trail.getContext("2d")!;
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let tip = { ...REST };
    let last: { x: number; y: number } | null = null;
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };
    const down = (e: PointerEvent) => {
      last = pos(e);
      tip = last;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.stopPropagation();
    };
    const move = (e: PointerEvent) => {
      if (!last) return;
      const p = pos(e);
      tctx.lineCap = "round";
      tctx.lineJoin = "round";
      for (const [w, col] of [
        [10, "rgba(255,140,40,0.18)"],
        [5, "rgba(255,190,90,0.5)"],
        [2, "rgba(255,248,220,0.95)"],
      ] as const) {
        tctx.strokeStyle = col;
        tctx.lineWidth = w;
        tctx.beginPath();
        tctx.moveTo(last.x, last.y);
        tctx.lineTo(p.x, p.y);
        tctx.stroke();
      }
      last = p;
      tip = p;
    };
    const up = () => {
      last = null;
      setTimeout(() => (tip = { ...REST }), 1200);
    };
    // drawing happens in a central zone; the edges stay free for turning the page
    const z = zone.current;
    if (draw && env.mode === "live" && z) {
      z.addEventListener("pointerdown", down);
      z.addEventListener("pointermove", move);
      z.addEventListener("pointerup", up);
      z.addEventListener("pointercancel", up);
    }
    if (env.mode === "thumb") {
      drawSparks(ctx, 3, REST.x, REST.y);
      return;
    }
    let raf = 0;
    let lastFade = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = cardClock();
      if (t - lastFade > 0.05) {
        // the long exposure lets go of its light slowly
        tctx.globalCompositeOperation = "destination-out";
        tctx.fillStyle = "rgba(0,0,0,0.02)";
        tctx.fillRect(0, 0, W, H);
        tctx.globalCompositeOperation = "source-over";
        lastFade = t;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(trail, 0, 0, W, H);
      drawSparks(ctx, t, tip.x, tip.y);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      z?.removeEventListener("pointerdown", down);
      z?.removeEventListener("pointermove", move);
      z?.removeEventListener("pointerup", up);
      z?.removeEventListener("pointercancel", up);
    };
  }, [draw, env.mode]);
  return (
    <>
      <canvas ref={ref} className="ph-sparks" style={{ width: 500, height: 700 }} />
      {draw && env.mode === "live" && <div ref={zone} className="ph-zone" data-no-flip />}
    </>
  );
}

/** The sparkler: a wire with its grey coating burning down to a glowing tip. */
function Stick() {
  return (
    <svg className="ph-stick" viewBox="0 0 500 700" width={500} height={700}>
      <line x1={REST.x} y1={REST.y} x2={560} y2={760} stroke="#6b6f76" strokeWidth={2.2} />
      <line x1={REST.x + 6} y1={REST.y + 8} x2={470} y2={560} stroke="#3a3c40" strokeWidth={6} strokeLinecap="round" />
      <line x1={REST.x + 6} y1={REST.y + 8} x2={470} y2={560} stroke="#8a8d94" strokeWidth={1} opacity={0.5} />
    </svg>
  );
}

function Bokeh() {
  const r = rng(71);
  return (
    <svg className="ph-bokeh" viewBox="0 0 500 700" width={500} height={700}>
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={R1(r() * 500)} cy={R1(520 + r() * 200)} r={R1(6 + r() * 20)} fill={i % 3 ? "#ffb347" : "#ff7a3a"} opacity={R1(0.12 + r() * 0.25)} />
      ))}
    </svg>
  );
}

function splitTitle(s: string) {
  const w = s.trim().split(/\s+/);
  if (w.length < 2) return [s, ""];
  return [w[0], w.slice(1).join(" ")];
}

function Cover({ d }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [l1, l2] = splitTitle(d.eyebrow);
  return (
    <div className="page-content cover wd-cover">
      <div className="ph-bg" />
      <Bokeh />
      <div className="ph-smoke" />
      <div className="ph-text">
        {d.mantra && <div className="ph-mantra">{d.mantra}</div>}
        <div className="ph-line l1">
          <span>{l1}</span>
        </div>
        {l2 && (
          <div className="ph-line l2">
            <span>{l2}</span>
          </div>
        )}
        <div className="ph-line l3">
          <span>{d.primary.name}</span>
        </div>
        {d.blessingLine && <p className="ph-wish">{d.blessingLine}</p>}
        {env.guest && <div className="ph-guest">For {env.guest}</div>}
      </div>
      <Stick />
      <SparkCanvas draw />
      {env.mode === "live" && <div className="ph-hint">Draw with the sparkler ✨</div>}
    </div>
  );
}

export const phuljhadi: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="ph-bg" />
        <Bokeh />
        <svg className="ph-trail" viewBox="0 0 500 700" width={500} height={700}>
          <path d="M-20,640 C80,600 140,690 240,640 C330,596 400,680 520,630" fill="none" stroke="#ffcf7a" strokeWidth={2} opacity={0.5} filter="url(#ph-glow)" />
          <defs>
            <filter id="ph-glow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="ph-bg" />
      <Bokeh />
    </div>
  ),
};

/* ---------------- intro: the sparkler writes the greeting ---------------- */

function TipCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = 600 * dpr;
    c.height = 900 * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, 600, 900);
      const x = Number(c.dataset.x || 0);
      const y = Number(c.dataset.y || 0);
      const on = Number(c.dataset.on || 1);
      if (on > 0.01) drawSparks(ctx, cardClock(), x, y, 0.6 + on * 0.6);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="sk-canvas" data-x="160" data-y="330" data-on="0.5" style={{ width: 600, height: 900 }} />;
}

export const sparkwrite: IntroDef = {
  end: 3.0,
  burst: 2.6,
  hint: { x: 300, y: 560 },
  Over: () => (
    <div className="in-part sk-wrap">
      <TipCanvas />
    </div>
  ),
  build: (q, holder) => {
    const lines = q(".ph-text .ph-line");
    const canvas = q(".sk-canvas")[0] as HTMLCanvasElement;
    const scene = holder.parentElement!;
    gsap.set(lines, { clipPath: "inset(-20% 100% -20% 0%)" });
    gsap.set(q(".ph-stick, .ph-sparks, .ph-wish, .ph-mantra, .ph-guest"), { opacity: 0 });
    // where a line is on the scene (fonts may load late, so measure as we go)
    const box = (el: Element) => {
      const s = scene.getBoundingClientRect();
      const k = s.width / 600;
      const r = (el.querySelector("span") ?? el).getBoundingClientRect();
      return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
    };
    const tl = gsap.timeline({ paused: true });
    const spans: [number, number][] = [];
    let t = 0.15;
    lines.forEach((el, i) => {
      const dur = i === lines.length - 1 ? 0.7 : 0.85;
      spans.push([t, dur]);
      const pr = { p: 0 };
      tl.to(
        pr,
        {
          p: 1,
          duration: dur,
          ease: "power1.inOut",
          onUpdate: () => {
            const b = box(el);
            gsap.set(el, { clipPath: `inset(-20% ${(100 - pr.p * 100).toFixed(2)}% -20% 0%)` });
            const x = b.x + b.w * pr.p;
            // the tip loops through the letters as it writes
            const y = b.y + b.h * (0.55 + 0.28 * Math.sin(pr.p * Math.PI * (i === 0 ? 7 : 9)));
            canvas.dataset.x = x.toFixed(1);
            canvas.dataset.y = y.toFixed(1);
            canvas.dataset.on = "1";
          },
        },
        t,
      );
      t += dur + 0.08;
    });
    // glide to where it rests, then hand over to the card's own sparkler
    const rest = { p: 0 };
    tl.to(
      rest,
      {
        p: 1,
        duration: 0.35,
        ease: "power2.inOut",
        onUpdate: () => {
          const last = box(lines[lines.length - 1]);
          const sx = last.x + last.w;
          const sy = last.y + last.h * 0.55;
          canvas.dataset.x = (sx + (REST.x + 50 - sx) * rest.p).toFixed(1);
          canvas.dataset.y = (sy + (REST.y + 100 - sy) * rest.p).toFixed(1);
        },
      },
      t,
    )
      .to(q(".ph-stick, .ph-sparks, .ph-wish, .ph-mantra, .ph-guest"), { opacity: 1, duration: 0.4 }, t + 0.25)
      .to(canvas, { attr: { "data-on": 0 }, duration: 0.3 }, t + 0.35)
      .set(lines, { clearProps: "clipPath" }, 2.95);
    return tl;
  },
};
