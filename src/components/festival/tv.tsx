"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { cos, rng, sin } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { LiveCanvas, cardClock } from "@/components/wedding/live";
import { R1 } from "@/components/wedding/sig/util";

/* ============================================================
   Shubh TV: an 80s wooden-cabinet TV in a living room dressed for
   Diwali. It powers on, tunes through static and rolls into the
   family's own "Diwali Special". Turn the knob to change channel.
   ============================================================ */

const SW = 262;
const SH = 222;

type Fonts = { vt: string; disp: string; name: string };
type TvState = { onAt: number; ch: number; switchAt: number; fonts: Fonts | null; snow: HTMLCanvasElement | null };

function fit(ctx: CanvasRenderingContext2D, text: string, font: (s: number) => string, max: number, start: number) {
  let s = start;
  for (; s > 8; s -= 1) {
    ctx.font = font(s);
    if (ctx.measureText(text).width <= max) break;
  }
  return s;
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function chSpecial(ctx: CanvasRenderingContext2D, t: number, d: InviteData, f: Fonts) {
  const g = ctx.createRadialGradient(SW / 2, SH * 0.45, 10, SW / 2, SH * 0.45, SW * 0.75);
  g.addColorStop(0, "#c2185b");
  g.addColorStop(1, "#3b0a45");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);
  ctx.save();
  ctx.translate(SW / 2, SH * 0.45);
  ctx.rotate(t * 0.15);
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = i % 2 ? "rgba(255,138,0,0.45)" : "rgba(255,214,0,0.18)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, SW, (i / 18) * Math.PI * 2, ((i + 1) / 18) * Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // sparkles
  const r = rng(12);
  ctx.fillStyle = "#fff8d0";
  for (let i = 0; i < 14; i++) {
    const x = r() * SW;
    const y = 18 + r() * (SH - 50);
    const k = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
    ctx.globalAlpha = k;
    sparkle(ctx, x, y, 2 + k * 3);
  }
  ctx.globalAlpha = 1;
  // title
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const title = d.eyebrow;
  const s = fit(ctx, title, (n) => `${n}px ${f.disp}`, SW - 30, 40);
  ctx.font = `${s}px ${f.disp}`;
  const y = SH * 0.36 + Math.sin(t * 1.4) * 2;
  ctx.fillStyle = "#4a0418";
  ctx.fillText(title, SW / 2 + 3, y + 3);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#7a0a1e";
  ctx.lineJoin = "round";
  ctx.strokeText(title, SW / 2, y);
  const tg = ctx.createLinearGradient(0, y - s / 2, 0, y + s / 2);
  tg.addColorStop(0, "#fffbe0");
  tg.addColorStop(0.5, "#ffd400");
  tg.addColorStop(1, "#ff9a00");
  ctx.fillStyle = tg;
  ctx.fillText(title, SW / 2, y);
  ctx.font = `15px ${f.vt}`;
  ctx.fillStyle = "#ffe9f2";
  ctx.fillText("A SPECIAL BROADCAST " + fromText(d).toUpperCase(), SW / 2, SH * 0.55);
  const ns = fit(ctx, d.primary.name, (n) => `${n}px ${f.name}`, SW - 30, 24);
  ctx.font = `${ns}px ${f.name}`;
  ctx.fillStyle = "#2a0010";
  ctx.fillText(d.primary.name, SW / 2 + 1.5, SH * 0.67 + 1.5);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(d.primary.name, SW / 2, SH * 0.67);
  // channel bug and live dot
  ctx.textAlign = "left";
  ctx.font = `14px ${f.vt}`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("SHUBH TV", 10, 14);
  ctx.textAlign = "right";
  if (Math.floor(t * 1.5) % 2 === 0) {
    ctx.fillStyle = "#ff3b3b";
    ctx.beginPath();
    ctx.arc(SW - 40, 14, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillText("LIVE", SW - 10, 14);
  // ticker
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, SH - 24, SW, 24);
  ctx.fillStyle = "#ffd400";
  ctx.fillRect(0, SH - 24, 54, 24);
  ctx.textAlign = "left";
  ctx.font = `16px ${f.vt}`;
  const msg = `${d.blessingLine || "Wishing you light, love and laughter"}   ✦   ${fromText(d)} ${d.primary.name}   ✦   `;
  const mw = ctx.measureText(msg).width;
  ctx.save();
  ctx.beginPath();
  ctx.rect(54, SH - 24, SW - 54, 24);
  ctx.clip();
  ctx.fillStyle = "#ffffff";
  const off = (t * 38) % mw;
  ctx.fillText(msg, 54 + 8 - off, SH - 11);
  ctx.fillText(msg, 54 + 8 - off + mw, SH - 11);
  ctx.restore();
  ctx.fillStyle = "#1e3a8a";
  ctx.fillText("NEWS", 9, SH - 11);
}

function chFireworks(ctx: CanvasRenderingContext2D, t: number, f: Fonts) {
  const g = ctx.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, "#05081e");
  g.addColorStop(1, "#1d1f4a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);
  const cols = ["#ffd400", "#ff4fa0", "#7df9ff", "#ff8a00", "#b388ff"];
  ctx.globalCompositeOperation = "lighter";
  const k0 = Math.floor(t / 0.8);
  for (let k = k0 - 3; k <= k0; k++) {
    const r = rng(k * 97 + 5);
    const bx = 30 + r() * (SW - 60);
    const by = 30 + r() * 80;
    const age = t - k * 0.8 - r() * 0.3;
    if (age < 0 || age > 2.2) continue;
    const col = cols[Math.abs(k) % cols.length];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const d = 52 * (1 - Math.exp(-age * 2.8));
      ctx.globalAlpha = Math.max(0, 1 - age / 2.2);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(bx + Math.cos(a) * d, by + Math.sin(a) * d + 14 * age * age, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#03040e";
  let x = 0;
  let i = 0;
  while (x < SW) {
    const w = 16 + ((i * 29) % 20);
    const h = 26 + ((i * 41) % 34);
    ctx.fillRect(x, SH - 30 - h, w, h + 30);
    ctx.fillStyle = "#ffcf6b";
    for (let j = 0; j < 3; j++) ctx.fillRect(x + 4 + ((j * 7) % (w - 6)), SH - 30 - h + 6 + j * 9, 2, 3);
    ctx.fillStyle = "#03040e";
    x += w + 2;
    i++;
  }
  ctx.fillStyle = "rgba(200,16,46,0.92)";
  ctx.fillRect(10, SH - 46, 120, 18);
  ctx.fillStyle = "rgba(10,10,30,0.85)";
  ctx.fillRect(10, SH - 28, SW - 20, 20);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `15px ${f.vt}`;
  ctx.fillStyle = "#fff";
  ctx.fillText("● LIVE  FIREWORKS", 16, SH - 37);
  ctx.fillText("Tonight: 100% chance of fireworks", 16, SH - 18);
}

function chBars(ctx: CanvasRenderingContext2D, t: number, since: number, d: InviteData, f: Fonts) {
  const bars = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];
  const bw = SW / 7;
  bars.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * bw, 0, bw + 1, SH * 0.72);
  });
  ["#0000c0", "#131313", "#c000c0", "#131313", "#00c0c0", "#131313", "#c0c0c0"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * bw, SH * 0.72, bw + 1, SH * 0.08);
  });
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, SH * 0.8, SW, SH * 0.2);
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(28, 56, SW - 56, 92);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.strokeRect(31, 59, SW - 62, 86);
  const p = Math.min(1, (since % 6) / 4);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `20px ${f.vt}`;
  ctx.fillText(p < 1 ? "PLEASE STAND BY" : d.eyebrow.toUpperCase() + "!", SW / 2, 78);
  ctx.font = `15px ${f.vt}`;
  ctx.fillText(p < 1 ? "Blessings are loading..." : "Blessings delivered: 100%", SW / 2, 100);
  ctx.strokeRect(50, 116, SW - 100, 14);
  ctx.fillStyle = "#ffd400";
  ctx.fillRect(52, 118, (SW - 104) * p, 10);
  void t;
}

function drawSnow(ctx: CanvasRenderingContext2D, st: TvState, t: number) {
  if (!st.snow) {
    st.snow = document.createElement("canvas");
    st.snow.width = 131;
    st.snow.height = 111;
  }
  const s = st.snow.getContext("2d")!;
  const img = s.createImageData(131, 111);
  const r = rng(Math.floor(t * 30) * 7919 + 1);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(r() * 255);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  s.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(st.snow, 0, 0, SW, SH);
  ctx.imageSmoothingEnabled = true;
}

function drawScreen(ctx: CanvasRenderingContext2D, t: number, st: TvState, d: InviteData) {
  const f = st.fonts;
  ctx.clearRect(0, 0, SW, SH);
  const age = t - st.onAt;
  if (age < 0 || !f) {
    ctx.fillStyle = "#1a201c";
    ctx.fillRect(0, 0, SW, SH);
    return;
  }
  const program = (tt: number) => {
    if (st.ch === 2) chFireworks(ctx, tt, f);
    else if (st.ch === 3) chBars(ctx, tt, tt - st.switchAt, d, f);
    else chSpecial(ctx, tt, d, f);
  };
  if (age < 0.3) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SW, SH);
    const k = age / 0.3;
    const h = 2 + (SH - 2) * k * k;
    ctx.fillStyle = "#f4fbff";
    ctx.fillRect(0, SH / 2 - h / 2, SW, h);
  } else if (age < 1.1) {
    drawSnow(ctx, st, t);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, ((age * 300) % (SH + 30)) - 30, SW, 22);
  } else if (age < 1.7) {
    const k = (age - 1.1) / 0.6;
    const off = (1 - k) * (1 - k) * SH * 2.2;
    const o = off % SH;
    ctx.save();
    ctx.translate(0, o);
    program(t);
    ctx.restore();
    ctx.save();
    ctx.translate(0, o - SH);
    program(t);
    ctx.restore();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, o - 8, SW, 12);
  } else if (t - st.switchAt < 0.35) {
    drawSnow(ctx, st, t);
  } else {
    // a little horizontal wobble now and then, like a real set
    const wob = Math.sin(t * 0.7) > 0.985 ? Math.sin(t * 90) * 3 : 0;
    ctx.save();
    ctx.translate(wob, 0);
    program(t);
    ctx.restore();
  }
  // channel number on screen after a change
  const since = t - Math.max(st.switchAt, st.onAt + 1.7);
  if (since >= 0 && since < 2.4 && age >= 1.7) {
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = `24px ${f.vt}`;
    ctx.fillStyle = "#003300";
    ctx.fillText(`CH 0${st.ch}`, SW - 12, 40);
    ctx.fillStyle = "#3dff6e";
    ctx.fillText(`CH 0${st.ch}`, SW - 13, 39);
  }
  // scanlines, flicker and vignette
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  for (let y = 0; y < SH; y += 3) ctx.fillRect(0, y, SW, 1);
  ctx.fillStyle = `rgba(255,255,255,${(0.015 + 0.015 * Math.sin(t * 60)).toFixed(3)})`;
  ctx.fillRect(0, 0, SW, SH);
  const v = ctx.createRadialGradient(SW / 2, SH / 2, SH * 0.35, SW / 2, SH / 2, SW * 0.72);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, SW, SH);
}

/** Marigold-and-mango-leaf toran along the top. */
function Toran() {
  const r = rng(21);
  return (
    <svg className="tv-toran" viewBox="0 0 500 90" width={500} height={90}>
      <path d="M0,10 Q250,34 500,10" fill="none" stroke="#6b4a1a" strokeWidth={2} />
      {Array.from({ length: 17 }, (_, i) => {
        const x = 14 + i * 29.5;
        const y = 10 + 24 * (1 - Math.pow((x - 250) / 250, 2));
        const long = i % 2 === 0;
        return (
          <g key={i}>
            {long && <path d={`M${R1(x)},${R1(y)} q-9,26 0,${46 + R1(r() * 8)} q9,-26 0,-${46}Z`} fill="#2f7a2a" stroke="#1d5a1a" strokeWidth={0.8} />}
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={R1(x)} cy={R1(y + 6 + k * 9)} r={k === 1 ? 6 : 5.5} fill={k % 2 ? "#f59e0b" : "#f97316"} stroke="#c2410c" strokeWidth={0.8} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function Lights() {
  const cols = ["#ff5252", "#ffd740", "#69f0ae", "#40c4ff", "#ff80ab"];
  return (
    <svg className="tv-lights" viewBox="0 0 500 60" width={500} height={60}>
      <path d="M-10,6 Q250,58 510,6" fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
      {Array.from({ length: 20 }, (_, i) => {
        const tt = (i + 0.5) / 20;
        const x = -10 + tt * 520;
        const y = 6 + 104 * tt * (1 - tt) * 0.5 + 2;
        return (
          <g key={i} className="twinkle" style={{ animationDelay: `${(i % 5) * 0.3}s` }}>
            <circle cx={R1(x)} cy={R1(y + 5)} r={7} fill={cols[i % 5]} opacity={0.3} />
            <ellipse cx={R1(x)} cy={R1(y + 5)} rx={2.6} ry={3.6} fill={cols[i % 5]} />
          </g>
        );
      })}
    </svg>
  );
}

function Doily({ y, w = 300, className = "" }: { y: number; w?: number; className?: string }) {
  const n = Math.round(w / 14);
  return (
    <svg className={`tv-doily ${className}`} viewBox={`0 0 ${w} 30`} width={w} height={30} style={{ top: y }}>
      <path d={`M0,0 L${w},0 L${w},14 ` + Array.from({ length: n }, (_, i) => `A7,7 0 0 1 ${R1(w - (i + 1) * (w / n))},14`).join(" ") + " Z"} fill="#fbf8f0" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={R1((i + 0.5) * (w / n))} cy={11} r={2.2} fill="rgba(0,0,0,0.18)" />
      ))}
      {Array.from({ length: n * 2 }, (_, i) => (
        <circle key={`h${i}`} cx={R1((i + 0.5) * (w / n / 2))} cy={4} r={1.1} fill="rgba(0,0,0,0.14)" />
      ))}
    </svg>
  );
}

function Vase() {
  return (
    <svg className="tv-vase" viewBox="0 0 70 90" width={70} height={90}>
      <path d="M26,90 C18,80 20,66 28,58 L42,58 C50,66 52,80 44,90Z" fill="rgba(170,220,230,0.55)" stroke="rgba(255,255,255,0.6)" />
      <path d="M35,58 L30,20 M35,58 L44,14 M35,58 L22,30 M35,58 L52,32" stroke="#2f7a2a" strokeWidth={1.6} />
      {[
        [30, 18, "#e91e63"],
        [44, 12, "#ff5252"],
        [21, 28, "#ffb300"],
        [53, 30, "#e91e63"],
      ].map(([x, y, c], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={R1((x as number) + cos((a * Math.PI) / 180) * 4)} cy={R1((y as number) + sin((a * Math.PI) / 180) * 4)} r={3.6} fill={c as string} />
          ))}
          <circle cx={x as number} cy={y as number} r={2.4} fill="#fff59d" />
        </g>
      ))}
      <path d="M30,44 q-12,-4 -14,-12 q10,2 14,12Z M40,40 q12,-6 16,-2 q-8,6 -16,2Z" fill="#43a047" />
    </svg>
  );
}

function Cabinet({ d }: { d: InviteData }) {
  const env = useCardEnv();
  const st = useRef<TvState>({ onAt: -1e9, ch: 1, switchAt: -1e9, fonts: null, snow: null });
  const [knob, setKnob] = useState(0);
  const change = () => {
    const s = st.current;
    s.ch = (s.ch % 3) + 1;
    s.switchAt = cardClock();
    setKnob((k) => k + 30);
  };
  return (
    <div className="tv-set">
      <svg className="tv-antenna" viewBox="0 0 260 160" width={260} height={160}>
        <path d="M130,150 L42,10" stroke="#b9b9b9" strokeWidth={3} />
        <path d="M130,150 L228,22" stroke="#d4d4d4" strokeWidth={3} />
        <circle cx={42} cy={10} r={5} fill="#d4d4d4" />
        <circle cx={228} cy={22} r={5} fill="#d4d4d4" />
        <ellipse cx={130} cy={154} rx={30} ry={12} fill="#2a2a2a" />
        <ellipse cx={130} cy={150} rx={24} ry={8} fill="#444" />
      </svg>
      <div className="tv-cab">
        <div className="tv-veneer" />
        <div className="tv-bezel">
          <LiveCanvas
            width={SW}
            height={SH}
            className="tv-screen"
            stillAt={4}
            onInit={(c) => {
              const css = getComputedStyle(document.documentElement);
              const fonts = { vt: css.getPropertyValue("--f-vt323").trim() || "monospace", disp: css.getPropertyValue("--f-shrikhand").trim() || "serif", name: css.getPropertyValue("--f-yeseva").trim() || "serif" };
              Promise.all([`20px ${fonts.vt}`, `30px ${fonts.disp}`, `20px ${fonts.name}`].map((x) => document.fonts.load(x).catch(() => null))).then(() => {
                st.current.fonts = fonts;
                if (env.mode === "thumb") drawScreen(c.getContext("2d")!, 4, st.current, d);
              });
              const on = (e: Event) => {
                st.current.onAt = (e as CustomEvent).detail;
                st.current.ch = 1;
              };
              window.addEventListener("tv-on", on);
              return () => window.removeEventListener("tv-on", on);
            }}
            draw={(ctx, t) => drawScreen(ctx, t, st.current, d)}
          />
          <div className="tv-glass" />
        </div>
        <div className="tv-panel">
          <div className="tv-brand">SHUBH</div>
          <i className="tv-led" />
          <div className="tv-knob big" style={{ transform: `rotate(${knob}deg)` }}>
            <b />
          </div>
          <div className="tv-dial">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} style={{ transform: `rotate(${i * 30}deg) translateY(-33px)` }} />
            ))}
          </div>
          <div className="tv-knob small">
            <b />
          </div>
          <div className="tv-grille" />
        </div>
      </div>
      <div className="tv-lace" />
      <Vase />
      {env.mode === "live" && (
        <>
          <button type="button" className="tv-hit" data-no-flip aria-label="Change channel" onPointerDown={(e) => (e.stopPropagation(), change())} />
          <div className="tv-tip">Turn the knob</div>
        </>
      )}
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  return (
    <div className="page-content cover wd-cover">
      <div className="tv-wall" />
      <Toran />
      <Lights />
      <div className="tv-table">
        <div className="tv-tabletop" />
      </div>
      <Doily y={524} w={360} />
      <Cabinet d={d} />
      <h1 className="sr-only">{d.eyebrow}</h1>
      <div className="tv-caption">
        {d.blessingLine && <p>{d.blessingLine}</p>}
        <div className="tv-from">
          <span>{fromText(d)}</span> {d.primary.name}
        </div>
        {env.guest && <div className="tv-guest">for {env.guest}</div>}
      </div>
    </div>
  );
}

export const tv: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="tv-wall" />
        <div className="tv-sheet" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="tv-wall" />
    </div>
  ),
};

/* ---------------- intro: the room is dark, the set warms up and tunes in ---------------- */

export const tvon: IntroDef = {
  end: 2.4,
  burst: 2.0,
  hint: { x: 300, y: 640 },
  Over: () => <div className="in-part tvo-dark" />,
  build: (q) => {
    gsap.set(q(".tv-led"), { opacity: 0.2 });
    gsap.set(q(".tv-caption"), { opacity: 0, y: 10 });
    const tl = gsap.timeline({ paused: true });
    tl.call(() => window.dispatchEvent(new CustomEvent("tv-on", { detail: cardClock() + 0.35 })), [], 0.01)
      .to(q(".tv-led"), { opacity: 1, duration: 0.05 }, 0.3)
      .to(q(".tvo-dark"), { opacity: 0, duration: 1.4, ease: "power1.inOut" }, 0.6)
      .to(q(".tv-caption"), { opacity: 1, y: 0, duration: 0.6 }, 1.7)
      .set(q(".tv-led, .tv-caption"), { clearProps: "opacity,transform" }, 2.35);
    return tl;
  },
};
