"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import type { FestivalKind, InviteData, Palette } from "@/lib/types";
import { plainDate } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";

/* ============================================================
   Diwali Times: a vintage broadsheet that spins in like an old
   film, the family's greeting as the banner headline, a halftone
   photo of the night sky and some very local news.
   ============================================================ */

const PAPER_NAME: Record<FestivalKind, string> = {
  dhanteras: "The Dhanteras Times",
  diwali: "The Diwali Times",
  nutanvarsh: "The New Year Times",
  bhaidooj: "The Bhai Dooj Times",
  newyear: "The New Year Times",
};

export const paperName = (d: InviteData) => PAPER_NAME[d.festival ?? "diwali"] ?? "The Diwali Times";

function longDate(iso: string) {
  const d = plainDate(iso);
  return d ? `${d.weekday}, ${d.day} ${d.month} ${d.year}`.toUpperCase() : "";
}

/** Night over the city in printed halftone: fireworks, a skyline with lit windows and a row of diyas. */
function paintHalftone(c: HTMLCanvasElement, ink: string, paper: string) {
  const W = c.width;
  const H = c.height;
  const o = document.createElement("canvas");
  o.width = W;
  o.height = H;
  const g = o.getContext("2d")!;
  // the scene as a greyscale light map
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#0a0a0a");
  sky.addColorStop(1, "#3a3a3a");
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  const bursts = [
    [W * 0.24, H * 0.3, H * 0.26],
    [W * 0.68, H * 0.22, H * 0.32],
    [W * 0.9, H * 0.46, H * 0.18],
  ];
  for (const [x, y, r] of bursts) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r * 1.3);
    rg.addColorStop(0, "rgba(255,255,255,0.65)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = "#fff";
    g.lineCap = "round";
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      g.lineWidth = 2.2;
      g.beginPath();
      g.moveTo(x + Math.cos(a) * r * 0.25, y + Math.sin(a) * r * 0.25);
      g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r + r * 0.12);
      g.stroke();
    }
  }
  // skyline
  g.fillStyle = "#050505";
  let x = 0;
  let k = 0;
  while (x < W) {
    const w = 22 + ((k * 37) % 30);
    const h = H * (0.22 + ((k * 53) % 17) / 60);
    g.fillRect(x, H - h, w, h);
    if (k % 4 === 2) {
      g.beginPath();
      g.arc(x + w / 2, H - h, w * 0.38, Math.PI, 0);
      g.fill();
    }
    g.fillStyle = "#e8e8e8";
    for (let j = 0; j < 5; j++) g.fillRect(x + 4 + ((j * 7 + k * 3) % (w - 8)), H - h + 6 + ((j * 13 + k * 5) % (h * 0.6)), 3, 4);
    g.fillStyle = "#050505";
    x += w + 2;
    k++;
  }
  // a row of diyas along the parapet
  for (let i = 0; i < 14; i++) {
    const dx = 10 + i * (W / 14);
    const rg = g.createRadialGradient(dx, H - 8, 0, dx, H - 8, 14);
    rg.addColorStop(0, "rgba(255,255,255,0.95)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(dx - 14, H - 22, 28, 28);
  }
  // print it as rotated halftone dots
  const img = g.getImageData(0, 0, W, H).data;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ink;
  const step = 3.3 * (W / 300);
  const ang = Math.PI / 4;
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const R = Math.hypot(W, H);
  for (let u = -R; u < R; u += step)
    for (let v = -R; v < R; v += step) {
      const px = u * ca - v * sa + W / 2;
      const py = u * sa + v * ca + H / 2;
      if (px < 0 || py < 0 || px >= W || py >= H) continue;
      const L = img[(Math.floor(py) * W + Math.floor(px)) * 4] / 255;
      const rad = (1 - L) * step * 0.62;
      if (rad < 0.25) continue;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fill();
    }
}

function Photo({ ink, paper }: { ink: string; paper: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(300 * dpr);
    c.height = Math.round(168 * dpr);
    paintHalftone(c, ink, paper);
  }, [ink, paper]);
  return <canvas ref={ref} className="nt-photo" style={{ width: 300, height: 168 }} />;
}

function Front({ d, p, guest }: { d: InviteData; p: Palette; guest?: string }) {
  const fam = d.primary.name;
  return (
    <div className="nt-paper" style={{ color: p.ink }}>
      <div className="nt-age" />
      <div className="nt-mast-row">
        <div className="nt-ear">
          <b>Weather</b>
          Sky: 100% chance of fireworks
        </div>
        <div className="nt-mast">{paperName(d)}</div>
        <div className="nt-ear r">
          <b>Price</b>
          One smile
        </div>
      </div>
      <div className="nt-dateline">
        <span>Vol. {d.mainDateTime.slice(0, 4)} · No. 1</span>
        <span>{longDate(d.mainDateTime)}</span>
        <span>{guest ? `${guest}'s edition` : "Special edition"}</span>
      </div>
      <div className="nt-kicker">
        {fromText(d, "from")} {fam}
      </div>
      <h1 className="nt-head">{d.eyebrow}!</h1>
      {d.blessingLine && (
        <p className="nt-deck">
          &ldquo;{d.blessingLine}&rdquo; <i>— {fam}</i>
        </p>
      )}
      <div className="nt-main">
        <div className="nt-side">
          <div className="nt-box">
            <b>Tonight&apos;s forecast</b>
            Clear skies with heavy showers of anaar and phuljhadi. Humidity: 90% mithai.
          </div>
          <div className="nt-box mk">
            <b>Markets</b>
            <span>
              Sensex of Happiness <em>▲ ∞</em>
            </span>
            <span>
              Mithai Index <em>▲ 108%</em>
            </span>
            <span>
              Smiles (24K) <em>▲ 999</em>
            </span>
          </div>
        </div>
        <figure className="nt-fig">
          <Photo ink={p.ink} paper={p.paper} />
          <figcaption>Skies over the city light up as families celebrate the festival of lights. (Photo: our terrace)</figcaption>
        </figure>
      </div>
      <div className="nt-cols">
        <article>
          <h2>Mithai Prices Hit Sweet Record</h2>
          <p>Kaju katli traded at an all-time high this week as households stocked up. Experts advise &ldquo;just one more piece&rdquo;. All diet plans postponed until further notice.</p>
        </article>
        <article>
          <h2>Brightest Home on the Street</h2>
          <p>Neighbours confirm the {fam} home is lit &ldquo;like never before&rdquo;. The rangoli at the door drew crowds, and at least two aunties taking photos.</p>
        </article>
        <article>
          <h2>Hugs at an All-Time High</h2>
          <p>Phones ring, doors open and chai is served without pause. Sources report record laughter and not a single empty plate in the city.</p>
        </article>
      </div>
      <div className="nt-classified">
        <b>WANTED:</b> your company for chai, chakli and long stories. Apply in person to {fam}. No experience needed.
      </div>
      <div className="nt-fold" />
    </div>
  );
}

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const spin = () => {
    const el = document.querySelector(".nt-paper");
    if (el) gsap.fromTo(el, { scale: 0.05, rotate: -1080 }, { scale: 1, rotate: -1.2, duration: 1.4, ease: "power2.out" });
  };
  return (
    <div className="page-content cover wd-cover">
      <div className="nt-bg" />
      <Front d={d} p={p} guest={env.guest} />
      {env.mode === "live" && (
        <>
          <button type="button" className="nt-hit" data-no-flip aria-label="Spin the paper again" onPointerDown={(e) => (e.stopPropagation(), spin())} />
          <div className="nt-hint">Tap the masthead</div>
        </>
      )}
    </div>
  );
}

export const akhbaar: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="nt-bg" />
        <div className="nt-paper inner">
          <div className="nt-age" />
          <div className="nt-run">
            <span>Continued from the front page</span>
            <span>Special festive edition</span>
          </div>
          <div className="nt-fold" />
        </div>
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="nt-bg" />
    </div>
  ),
};

/* ---------------- intro: the classic spinning front page ---------------- */

export const spin: IntroDef = {
  end: 2.4,
  burst: 1.7,
  hint: { x: 300, y: 450 },
  Over: () => (
    <div className="in-part sp-film">
      <i className="sp-scratch a" />
      <i className="sp-scratch b" />
    </div>
  ),
  build: (q) => {
    const paper = q(".nt-paper");
    gsap.set(paper, { scale: 0.03, rotate: -1440 });
    const tl = gsap.timeline({ paused: true });
    tl.to(paper, { scale: 1.06, rotate: -1.2, duration: 1.5, ease: "power2.out" }, 0.1)
      .to(paper, { scale: 1, duration: 0.25, ease: "power2.inOut" }, 1.6)
      .to(q(".sp-film"), { opacity: 0, duration: 0.6 }, 1.7)
      .set(paper, { clearProps: "transform" }, 2.35);
    return tl;
  },
};
