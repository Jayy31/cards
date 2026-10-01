"use client";
import React, { useState } from "react";
import gsap from "gsap";
import type { InviteData, Palette } from "@/lib/types";
import { rng } from "@/lib/format";
import { useCardEnv } from "@/components/card/CardEnv";
import { fromText } from "@/lib/festival";
import type { WedDesign } from "@/components/wedding/designs";
import type { IntroDef } from "@/components/viewer/intros";
import { mix, R1 } from "@/components/wedding/sig/util";
import { Fireworks } from "./roshni";
import { RangoliArt } from "./rangoli";

/* ============================================================
   Diwali Ghar: a real 3D house (CSS 3D) dressed for Diwali.
   Fairy lights chase along every edge, windows glow, kandils
   sway; it turns slowly. Tap to change the lights.
   ============================================================ */

type Mode = "warm" | "multi" | "chase";

/** A face of a box: a wall with windows, a door, and a string of bulbs along its top edge. */
function Wall({ w, h, tone, windows, door, balcony, bulbs = true }: { w: number; h: number; tone: string; windows: number; door?: boolean; balcony?: boolean; bulbs?: boolean }) {
  const cols = Math.max(1, windows);
  return (
    <div className="g3-wall" style={{ width: w, height: h, background: tone }}>
      <div className="g3-windows" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} className="g3-win-slot">
            {door && i === Math.floor(cols / 2) ? (
              <div className="g3-door">
                <i className="g3-toran" />
              </div>
            ) : (
              <div className="g3-win" />
            )}
          </div>
        ))}
      </div>
      {balcony && <div className="g3-rail" />}
      {bulbs && <div className="g3-bulbs" />}
    </div>
  );
}

/** A box built from six faces; the front face is the one we decorate most. */
function Box({ w, h, d, x = 0, y = 0, z = 0, wall, roof, front, side }: { w: number; h: number; d: number; x?: number; y?: number; z?: number; wall: string; roof: string; front: React.ReactNode; side: React.ReactNode }) {
  const face = (tf: string, fw: number, fh: number, child: React.ReactNode, cls = "") => (
    <div className={`g3-face ${cls}`} style={{ width: fw, height: fh, marginLeft: -fw / 2, marginTop: -fh / 2, transform: tf }}>
      {child}
    </div>
  );
  return (
    <div className="g3-box" style={{ transform: `translate3d(${x}px, ${y}px, ${z}px)` }}>
      {face(`translateZ(${d / 2}px)`, w, h, front, "front")}
      {face(`rotateY(180deg) translateZ(${d / 2}px)`, w, h, <div className="g3-plain" style={{ background: mix(wall, "#000", 0.35) }} />)}
      {face(`rotateY(90deg) translateZ(${w / 2}px)`, d, h, side, "side")}
      {face(`rotateY(-90deg) translateZ(${w / 2}px)`, d, h, <div className="g3-plain" style={{ background: mix(wall, "#000", 0.3) }} />)}
      {face(`rotateX(90deg) translateZ(${h / 2}px)`, w, d, <div className="g3-roof" style={{ background: roof }}><div className="g3-bulbs edge" /></div>, "top")}
    </div>
  );
}

function House({ p, mode }: { p: Palette; mode: Mode }) {
  const wall = p.envelope;
  const wallF = mix(wall, "#000", 0.08);
  const wallS = mix(wall, "#000", 0.32);
  const roof = mix(wall, "#000", 0.45);
  return (
    <div className={`g3-house mode-${mode}`}>
      {/* ground: courtyard with a rangoli and a row of diyas */}
      <div className="g3-ground" style={{ background: mix(p.paper, "#000", 0.2) }}>
        <svg viewBox="-200 -200 400 400" width={180} height={180} className="g3-rangoli">
          <RangoliArt p={p} id="g3r" />
        </svg>
        <div className="g3-path-diyas" />
      </div>
      <Box w={250} h={110} d={150} y={-55} wall={wall} roof={roof} front={<Wall w={250} h={110} tone={wallF} windows={3} door />} side={<Wall w={150} h={110} tone={wallS} windows={2} />} />
      <Box w={200} h={92} d={120} y={-156} wall={wall} roof={roof} front={<Wall w={200} h={92} tone={wallF} windows={3} balcony />} side={<Wall w={120} h={92} tone={wallS} windows={2} />} />
      {/* rooftop parapet */}
      <Box w={208} h={14} d={128} y={-209} wall={wall} roof={mix(roof, "#000", 0.1)} front={<div className="g3-plain" style={{ background: wallF }}><div className="g3-bulbs" /></div>} side={<div className="g3-plain" style={{ background: wallS }}><div className="g3-bulbs" /></div>} />
      {/* kandils at the porch */}
      {[-70, 70].map((x) => (
        <div key={x} className="g3-kandil" style={{ transform: `translate3d(${x}px, -96px, 86px)` }}>
          <i />
        </div>
      ))}
    </div>
  );
}

function Stars() {
  const r = rng(29);
  return (
    <svg className="g3-stars" viewBox="0 0 500 700" width={500} height={700}>
      {Array.from({ length: 50 }, (_, i) => (
        <circle key={i} cx={R1(r() * 500)} cy={R1(r() * 360)} r={R1(0.4 + r())} fill="#fff" opacity={R1(0.3 + r() * 0.5)} />
      ))}
    </svg>
  );
}

const MODES: Mode[] = ["warm", "multi", "chase"];

function Cover({ d, p }: { d: InviteData; p: Palette }) {
  const env = useCardEnv();
  const [mode, setMode] = useState<Mode>("warm");
  return (
    <div className="page-content cover wd-cover">
      <div className="g3-sky" />
      <Stars />
      <Fireworks p={p} />
      <div className="g3-scene">
        <div className="g3-cam">
          <House p={p} mode={mode} />
        </div>
      </div>
      <div className="g3-text">
        {d.mantra && <div className="g3-mantra">{d.mantra}</div>}
        <h1 className="g3-title foil-text">{d.eyebrow}</h1>
        {d.blessingLine && <p className="g3-wish">{d.blessingLine}</p>}
      </div>
      <div className="g3-from">
        <span>{fromText(d)}</span> {d.primary.name}
        {env.guest && <em>For {env.guest}</em>}
      </div>
      {env.mode === "live" && (
        <>
          <button type="button" className="g3-hit" data-no-flip aria-label="Change the lights" onPointerDown={(e) => (e.stopPropagation(), setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]))} />
          <div className="g3-hint">Tap the house to change the lights</div>
        </>
      )}
    </div>
  );
}

export const ghar: WedDesign = {
  Frame: ({ kind }) =>
    kind === "cover" ? null : (
      <>
        <div className="g3-sky inner" />
        <Stars />
        <div className="g3-eaves" />
      </>
    ),
  Cover: ({ d, p }) => <Cover d={d} p={p} />,
  Back: () => (
    <div className="wd-back-mark" style={{ opacity: 1 }}>
      <div className="g3-sky inner" />
      <Stars />
    </div>
  ),
};

/* ---------------- intro: the house switches on, floor by floor ---------------- */

export const switchon: IntroDef = {
  end: 2.6,
  burst: 2.0,
  hint: { x: 300, y: 640 },
  Over: () => <div className="in-part so-veil" />,
  build: (q) => {
    const wins = q(".g3-win, .g3-door");
    const bulbs = q(".g3-bulbs, .g3-path-diyas, .g3-kandil i");
    gsap.set([...wins, ...bulbs], { opacity: 0 });
    gsap.set(q(".g3-cam"), { rotateY: -50, scale: 0.78, y: 40 });
    gsap.set(q(".g3-text, .g3-from"), { opacity: 0, y: 12 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".so-veil"), { opacity: 0, duration: 1.4 }, 0.1)
      .to(q(".g3-cam"), { rotateY: 0, scale: 1, y: 0, duration: 1.8, ease: "power2.inOut" }, 0.05)
      .to(wins, { opacity: 1, duration: 0.12, stagger: { each: 0.06, from: "end" } }, 0.5)
      .to(bulbs, { opacity: 1, duration: 0.2, stagger: 0.04 }, 1.2)
      .to(q(".g3-text, .g3-from"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, 1.7)
      .set([...wins, ...bulbs, ...q(".g3-text, .g3-from")], { clearProps: "opacity,transform" }, 2.55);
    return tl;
  },
};
