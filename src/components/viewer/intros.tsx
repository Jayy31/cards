"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData, Palette, WedIntro } from "@/lib/types";
import { initials } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { foilFill, foilCss, isDark } from "@/components/card/theme";
import { WaxSeal } from "@/components/card/ornaments";
import { ENV, EnvelopeBack, EnvelopeFlap, EnvelopeFront, EnvelopeSeal } from "./Envelope";
import { alpona, gatefold, jaali, twirl, unfold } from "./intros2";
import { brush, pallu, popup, printer, veil } from "./intros3";
import { warp } from "@/components/wedding/sig/stargazer";
import { wiper } from "@/components/wedding/sig/monsoon";
import { leader } from "@/components/wedding/sig/premiere";
import { paparazzi } from "@/components/wedding/sig/coverstory";
import { mist } from "@/components/wedding/sig/glasshouse";
import { shake } from "@/components/wedding/sig/snowglobe";
import { mend } from "@/components/wedding/sig/kintsugi";
import { flock } from "@/components/wedding/sig/origami";
import { unfoldmap } from "@/components/wedding/sig/wanderlust";
import { fireflies } from "@/components/wedding/sig/firefly";
import { lightsup } from "@/components/festival/roshni";
import { drawrangoli } from "@/components/festival/rangoli";
import { coinrain } from "@/components/festival/swarna";
import { kindle } from "@/components/festival/pehladiya";
import { tearoff } from "@/components/festival/nayasaal";
import { sparkwrite } from "@/components/festival/phuljhadi";
import { fuse } from "@/components/festival/pataka";
import { unbox } from "@/components/festival/mithai";
import { aarti } from "@/components/festival/mandir";
import { switchon } from "@/components/festival/ghar";
import { release } from "@/components/festival/kandil";
import { ripple } from "@/components/festival/deepdaan";
import { boom } from "@/components/festival/sivakasi";
import { yantradraw } from "@/components/festival/yantra";
import { launchname } from "@/components/festival/aatish";
import { khata } from "@/components/festival/chopda";
import { inland } from "@/components/festival/chitthi";
import { spin as newsspin } from "@/components/festival/akhbaar";
import { lightbox } from "@/components/festival/kaagaz";
import { tvon } from "@/components/festival/tv";
import { Gulmohar, Fern, TempleBell, TempleBorder, Thoranam, LotusSide } from "@/components/wedding/art";

/**
 * How an invitation is revealed. Each intro draws layers under and over the
 * card (scene units, 600×900; the card sits at 50,100 and is 500×700) and
 * builds one paused GSAP timeline. Live playback plays it; video export seeks it.
 */

export interface IntroProps {
  p: Palette;
  data: InviteData;
  guest?: string;
  title: string;
}

export interface IntroDef {
  /** seconds until the card is fully revealed */
  end: number;
  /** when the petal burst starts */
  burst: number;
  /** "Tap to open" position, scene units */
  hint: { x: number; y: number };
  Under?: (p: IntroProps) => React.ReactNode;
  Over: (p: IntroProps) => React.ReactNode;
  build: (q: (s: string) => Element[], holder: HTMLElement, scene: { by: number }) => gsap.core.Timeline;
}

const mono = (d: InviteData) => {
  const [a, b] = coupleOrder(d);
  return initials(a.name, b?.name) || "✦";
};

/* ---------------- envelope (the original) ---------------- */

const envelope: IntroDef = {
  end: 3.7,
  burst: 2.35,
  hint: { x: ENV.x + ENV.w / 2, y: ENV.y + ENV.flapH - 14 },
  Under: ({ p }) => <EnvelopeBack p={p} />,
  Over: ({ p, data, guest, title }) => (
    <>
      <EnvelopeFront p={p} addressee={guest} from={title} />
      <EnvelopeFlap p={p} />
      <EnvelopeSeal p={p} text={initials(data.primary.name, data.secondary?.name) || "✦"} />
    </>
  ),
  build: (q, holder, scene) => {
    const dy = ENV.y + ENV.h / 2 - (scene.by + 350);
    gsap.set(holder, { y: dy, scale: 0.92, transformOrigin: "50% 50%" });
    gsap.set(q(".env-flap"), { rotateX: 0, transformOrigin: "50% 0%" });
    gsap.set(q(".env-flap-wrap"), { zIndex: 4 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".env-seal"), { scale: 1.07, duration: 0.25, ease: "power1.out" }, 0)
      .to(q(".seal-glow"), { opacity: 1, duration: 0.25 }, 0)
      .to(q(".seal-l"), { x: -16, y: 6, rotate: -22, opacity: 0, duration: 0.55, ease: "power2.in" }, 0.3)
      .to(q(".seal-r"), { x: 16, y: 6, rotate: 22, opacity: 0, duration: 0.55, ease: "power2.in" }, 0.3)
      .to(q(".seal-glow"), { opacity: 0, duration: 0.4 }, 0.45)
      .to(q(".env-flap-shadow"), { opacity: 0, duration: 0.4 }, 0.5)
      .to(q(".env-flap"), { rotateX: 180, duration: 1.0, ease: "power2.inOut" }, 0.5)
      .set(q(".env-flap-wrap"), { zIndex: 1 }, 1.0)
      .to(holder, { y: dy - 230, duration: 1.05, ease: "power2.out" }, 1.4)
      .to(q(".env-part"), { y: "+=820", rotate: 3, duration: 1.0, ease: "power2.in" }, 2.3)
      .to(q(".env-part"), { opacity: 0, duration: 0.3 }, 3.0)
      .to(holder, { y: 0, scale: 1, duration: 1.2, ease: "power3.inOut" }, 2.45);
    return tl;
  },
};

/* ---------------- temple doors (Kovil) ---------------- */

const doors: IntroDef = {
  end: 2.9,
  burst: 1.3,
  hint: { x: 300, y: 470 },
  Over: ({ p, data }) => {
    const fill = foilFill(p);
    return (
      <div className="in-part dr-wrap">
        <div className="dr-glow" />
        <div className="dr-door left">
          <DoorFace fill={fill} />
          <div className="dr-knocker" />
        </div>
        <div className="dr-door right">
          <DoorFace fill={fill} />
          <div className="dr-knocker" />
        </div>
        <div className="dr-frame">
          <div className="dr-lintel">
            <TempleBorder width={548} height={44} band={p.accent2} fill={fill} flip />
          </div>
          <div className="dr-thoranam">
            <Thoranam width={500} seed={5} />
          </div>
          <div className="dr-bell l">
            <TempleBell length={110} fill={fill} />
          </div>
          <div className="dr-bell r">
            <TempleBell length={110} fill={fill} />
          </div>
        </div>
        <div className="dr-mono foil-text">{mono(data)}</div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.9, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".dr-knocker"), { rotate: 16, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0)
      .to(q(".dr-mono"), { opacity: 0, scale: 1.2, duration: 0.4 }, 0.2)
      .to(q(".dr-glow"), { opacity: 1, duration: 0.6 }, 0.35)
      .to(q(".dr-door.left"), { rotateY: -112, duration: 1.5, ease: "power2.inOut" }, 0.5)
      .to(q(".dr-door.right"), { rotateY: 112, duration: 1.5, ease: "power2.inOut" }, 0.5)
      .to(q(".dr-bell"), { rotate: 7, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.5)
      .to(holder, { scale: 1, duration: 1.7, ease: "power2.inOut" }, 0.9)
      .to(q(".dr-frame, .dr-door"), { scale: 1.14, opacity: 0, duration: 0.8, ease: "power2.in" }, 1.85)
      .to(q(".dr-glow"), { opacity: 0, duration: 0.6 }, 2.0);
    return tl;
  },
};

function DoorFace({ fill }: { fill: string }) {
  return (
    <div className="dr-face">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`dr-panel p${i}`}>
          <div className="dr-studs" />
        </div>
      ))}
      <svg className="dr-band" viewBox="0 0 250 14" preserveAspectRatio="none">
        <rect width={250} height={14} fill={fill} filter="url(#f-foil)" />
      </svg>
    </div>
  );
}

/* ---------------- scroll unroll (Rajwada) ---------------- */

const SC = { top: 100 - 24, bottom: 800 - 24, rolled: 400 };

const scroll: IntroDef = {
  end: 3.5,
  burst: 2.4,
  hint: { x: 300, y: 520 },
  Over: ({ p, data }) => (
    <>
      <div className="in-part sc-rod top" style={{ ["--rod" as string]: p.paper2 }}>
        <i className="sc-knob l" />
        <i className="sc-knob r" />
      </div>
      <div className="in-part sc-rod bot" style={{ ["--rod" as string]: p.paper2 }}>
        <i className="sc-knob l" />
        <i className="sc-knob r" />
      </div>
      <div className="in-part sc-tie" style={{ ["--tie" as string]: p.accent }}>
        <div className="sc-tie-band" />
        <div className="sc-tie-seal">
          <WaxSeal size={84} color={p.wax} text={mono(data)} />
        </div>
      </div>
    </>
  ),
  build: (q, holder) => {
    gsap.set(holder, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(q(".sc-rod.top"), { y: SC.rolled });
    gsap.set(q(".sc-rod.bot"), { y: SC.rolled + 14 });
    gsap.set(q(".sc-tie"), { y: SC.rolled - 30 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".sc-tie-seal"), { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1 }, 0)
      .to(q(".sc-tie"), { y: SC.rolled + 120, rotate: 10, opacity: 0, duration: 0.55, ease: "power2.in" }, 0.25)
      .to(q(".sc-rod.top"), { y: SC.top, duration: 0.6, ease: "power2.inOut" }, 0.6)
      .to(q(".sc-rod.bot"), { y: SC.top + 2, duration: 0.6, ease: "power2.inOut" }, 0.6)
      .to(q(".sc-rod.bot"), { y: SC.bottom, duration: 1.4, ease: "power1.inOut" }, 1.2)
      .to(holder, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power1.inOut" }, 1.2)
      .to(q(".sc-rod.top"), { y: SC.top - 160, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.8)
      .to(q(".sc-rod.bot"), { y: SC.bottom + 160, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.8)
      .set(holder, { clearProps: "clipPath" }, 3.45);
    return tl;
  },
};

/* ---------------- flowers part (Gulmohar) ---------------- */

const BLOOMS: [number, number, number, number][] = [
  [300, 450, 190, 0],
  [170, 300, 170, 30],
  [430, 290, 160, -20],
  [150, 560, 180, 60],
  [450, 600, 175, -40],
  [300, 250, 140, 15],
  [300, 680, 150, 80],
  [110, 430, 130, -10],
  [490, 450, 135, 45],
  [210, 740, 130, 20],
  [400, 160, 120, -30],
  [190, 150, 120, 50],
  [420, 760, 125, -60],
];

const bloom: IntroDef = {
  end: 2.5,
  burst: 0.9,
  hint: { x: 300, y: 450 },
  Over: ({ p, data }) => (
    <div className="in-part bl-wrap">
      <div className="bl-veil" />
      {[
        [60, 220, 220, -30],
        [330, 180, 230, 200],
        [70, 600, 210, 20],
        [340, 640, 220, 160],
      ].map(([x, y, len, a], i) => (
        <div key={`f${i}`} className="bl-item" style={{ left: x, top: y }}>
          <Fern length={len} color={p.accent2} angle={a} seed={i + 2} />
        </div>
      ))}
      {BLOOMS.map(([x, y, s, r], i) => (
        <div key={i} className="bl-item bl-flower" style={{ left: x - s / 2, top: y - s / 2 }}>
          <Gulmohar size={s} petal={p.accent} deep={p.wax} rotate={r} seed={i + 1} />
        </div>
      ))}
      <div className="bl-tag">
        <span className="bl-tag-mono">{mono(data)}</span>
      </div>
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.86, y: 40, transformOrigin: "50% 50%" });
    const items = q(".bl-item");
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".bl-tag"), { scale: 0.6, opacity: 0, duration: 0.35, ease: "back.in(2)" }, 0);
    items.forEach((el, i) => {
      const e = el as HTMLElement;
      const x = e.offsetLeft + e.offsetWidth / 2 - 300;
      const y = e.offsetTop + e.offsetHeight / 2 - 450;
      const len = Math.hypot(x, y) || 1;
      const dist = 560;
      tl.to(e, { x: (x / len) * dist, y: (y / len) * dist, rotate: (i % 2 ? 1 : -1) * 110, scale: 1.25, opacity: 0, duration: 1.2, ease: "power2.in" }, 0.2 + (len / 400) * 0.35);
    });
    tl.to(q(".bl-veil"), { opacity: 0, duration: 1.0 }, 0.4).to(holder, { scale: 1, y: 0, duration: 1.6, ease: "power3.out" }, 0.6);
    return tl;
  },
};

/* ---------------- keepsake box (Ink & Ivory) ---------------- */

const box: IntroDef = {
  end: 3.6,
  burst: 2.6,
  hint: { x: 300, y: 560 },
  Under: ({ p }) => <div className="in-part bx-base" style={{ background: p.envelope }} />,
  Over: ({ p, data }) => {
    const lidPal = { ...p, paper: p.envelope };
    return (
      <>
        <div className="in-part bx-tissue l" />
        <div className="in-part bx-tissue r" />
        <div className={`in-part bx-lid ${isDark(p.envelope) ? "on-dark" : "on-light"}`} style={{ background: p.envelope, ["--lid-foil" as string]: foilCss(lidPal) }}>
          <div className="bx-lid-mono">{mono(data)}</div>
          <div className="bx-lid-line">{data.eyebrow}</div>
          <div className="bx-ribbon h" style={{ background: p.accent }} />
          <div className="bx-ribbon v" style={{ background: p.accent }} />
          <svg className="bx-bow" viewBox="-60 -30 120 60">
            <path d="M0,0 C-20,-28 -58,-24 -52,0 C-58,24 -20,28 0,0Z M0,0 C20,-28 58,-24 52,0 C58,24 20,28 0,0Z" fill={p.accent} />
            <path d="M0,0 C-18,-18 -44,-16 -40,0 M0,0 C18,-18 44,-16 40,0" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={2} />
            <rect x={-8} y={-9} width={16} height={18} rx={4} fill={p.accent} stroke="rgba(0,0,0,.2)" />
          </svg>
        </div>
      </>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.95, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".bx-bow"), { scale: 0, opacity: 0, rotate: 30, duration: 0.4, ease: "back.in(2)" }, 0)
      .to(q(".bx-ribbon.h"), { scaleX: 0, duration: 0.5, ease: "power2.in" }, 0.2)
      .to(q(".bx-ribbon.v"), { scaleY: 0, duration: 0.5, ease: "power2.in" }, 0.2)
      .to(q(".bx-lid"), { y: -18, scale: 1.03, boxShadow: "0 50px 80px rgba(0,0,0,.45)", duration: 0.4, ease: "power2.out" }, 0.7)
      .to(q(".bx-lid"), { y: -1050, rotate: -6, duration: 0.8, ease: "power2.in" }, 1.1)
      .to(q(".bx-tissue.l"), { rotateY: -172, duration: 0.8, ease: "power2.inOut" }, 1.8)
      .to(q(".bx-tissue.r"), { rotateY: 172, duration: 0.8, ease: "power2.inOut" }, 1.85)
      .to(q(".bx-tissue"), { opacity: 0, duration: 0.3 }, 2.5)
      .to(holder, { scale: 1, duration: 0.8, ease: "power2.out" }, 2.5)
      .to(q(".bx-base"), { y: 1000, duration: 0.8, ease: "power2.in" }, 2.8);
    return tl;
  },
};

/* ---------------- curtain rises (Pichwai) ---------------- */

const curtain: IntroDef = {
  end: 2.5,
  burst: 1.2,
  hint: { x: 300, y: 560 },
  Over: ({ p, data }) => {
    const fill = foilFill(p);
    return (
      <div className="in-part ct-wrap">
        <div className="ct-curtain" style={{ ["--ct" as string]: p.accent }}>
          <div className="ct-hem">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="ct-hem-lotus">
                <LotusSide size={46} petal="#f3a6bd" gold={fill} />
              </div>
            ))}
          </div>
          <div className="ct-fringe" />
          <div className="ct-medal">
            <span className="foil-text">{mono(data)}</span>
          </div>
        </div>
        <div className="ct-valance" style={{ ["--ct" as string]: p.accent }} />
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.94, transformOrigin: "50% 50%" });
    gsap.set(q(".ct-curtain"), { transformOrigin: "50% 0%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".ct-curtain"), { skewX: 2.5, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0)
      .to(q(".ct-medal"), { opacity: 0, scale: 0.85, duration: 0.3 }, 0.1)
      .to(q(".ct-curtain"), { y: -900, scaleY: 0.55, duration: 1.6, ease: "power2.inOut" }, 0.4)
      .to(holder, { scale: 1, duration: 1.6, ease: "power2.out" }, 0.6)
      .to(q(".ct-valance"), { y: -140, opacity: 0, duration: 0.6, ease: "power2.in" }, 1.7);
    return tl;
  },
};

export const INTROS: Record<WedIntro, IntroDef> = { envelope, doors, scroll, bloom, box, curtain, alpona, unfold, twirl, jaali, gatefold, pallu, veil, brush, popup, printer, warp, wiper, leader, paparazzi, mist, shake, mend, flock, unfoldmap, fireflies, lightsup, drawrangoli, coinrain, kindle, tearoff, sparkwrite, fuse, unbox, aarti, switchon, release, ripple, boom, yantradraw, launchname, khata, inland, newsspin, lightbox, tvon };
