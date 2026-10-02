"use client";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import type { BizEnter, BizFlip, BizSpec } from "@/lib/types";

/*
 * Choreography for business cards. Every design has its own entrance and its
 * own way of turning over (see BizSpec). Everything is built on one GSAP
 * timeline, so the same motion plays live and can be seeked frame-by-frame
 * for MP4 export.
 *
 *   card  = .biz-tilt   (entrance: position / arrival)
 *   flip  = .biz-flip   (turning over)
 *   root  = .biz-card   (CSS variables the faces read: --burn, --beam, --neon, --sweep, --glitch)
 *
 * Note: opacity/filter on a preserve-3d element flattens it, so nothing here
 * fades an element while it is rotated. Arrivals that rotate use distance instead.
 */

let registered = false;
function register() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(SplitText, DrawSVGPlugin, CustomEase, CustomWiggle);
  CustomWiggle.create("thump", { wiggles: 5, type: "easeOut" });
  registered = true;
}

export interface MotionRefs {
  root: HTMLElement;
  card: HTMLElement;
  flip: HTMLElement;
  /** card width in card units */
  w: number;
}

export function prepareFlip(spec: BizSpec, r: MotionRefs) {
  register();
  gsap.set(r.flip, { transformOrigin: spec.flip === "hinge" ? "0% 50%" : "50% 50%" });
}

/** Adds the design's arrival at time 0. Returns a cleanup for DOM splitting. */
export function addEnter(tl: gsap.core.Timeline, kind: BizEnter, r: MotionRefs): () => void {
  register();
  const { root, card } = r;
  // remember which markers this entrance choreographs; the rest get a default treatment below
  const used = new Set<string>();
  const q = (el: HTMLElement, sel: string) => {
    used.add(sel);
    return Array.from(el.querySelectorAll<HTMLElement | SVGElement>(`.bz-front ${sel}`));
  };
  const splits: SplitText[] = [];
  const drop = (d = 0.9) => tl.fromTo(card, { y: -50, scale: 1.1, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: d, ease: "power3.out" }, 0);

  switch (kind) {
    case "drop":
      drop(1.1);
      break;

    case "press": {
      tl.fromTo(card, { y: -24, scale: 1.08, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, 0);
      // the platen comes down: a quick squash, then each line of type "inks" in
      tl.to(card, { keyframes: { scale: [1, 0.985, 1] }, duration: 0.35, ease: "power2.inOut" }, 0.85);
      tl.fromTo(q(root, ".fx-ink"), { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 0.9);
      break;
    }

    case "spin":
      tl.fromTo(card, { rotationY: -540, z: -2600, y: -40 }, { rotationY: 0, z: 0, y: 0, duration: 2, ease: "expo.out" }, 0);
      break;

    case "slide":
      // pulled from a wallet, set down with a metallic "clink"
      tl.fromTo(card, { x: 1000, y: 40, rotationZ: 16 }, { x: 0, y: 0, rotationZ: 0, duration: 1.05, ease: "power4.out" }, 0);
      tl.to(card, { rotationZ: -1.4, duration: 0.1, ease: "power1.out" }, 0.9);
      tl.to(card, { rotationZ: 0, duration: 0.6, ease: "elastic.out(1.1, 0.35)" }, ">");
      break;

    case "burn":
      drop(0.7);
      tl.fromTo(root, { "--burn": 0, "--beam": 1 }, { "--burn": 1, duration: 2.6, ease: "none" }, 0.6);
      tl.to(root, { "--beam": 0, duration: 0.35 }, ">");
      break;

    case "rise":
      tl.fromTo(card, { y: 520, rotationX: 62, z: -320 }, { y: 0, rotationX: 0, z: 0, duration: 1.6, ease: "expo.out" }, 0);
      break;

    case "neon":
      drop(0.7);
      tl.fromTo(root, { "--neon": 0 }, { "--neon": 0, duration: 0.01 }, 0);
      tl.fromTo(q(root, ".fx-draw"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 1.3, ease: "power2.inOut" }, 0.4);
      tl.to(
        root,
        {
          keyframes: [
            { "--neon": 1, duration: 0.05 },
            { "--neon": 0.05, duration: 0.09 },
            { "--neon": 0.85, duration: 0.05 },
            { "--neon": 0, duration: 0.22 },
            { "--neon": 1, duration: 0.04 },
            { "--neon": 0.35, duration: 0.12 },
            { "--neon": 1, duration: 0.25 },
          ],
        },
        1.75,
      );
      break;

    case "block":
      drop(0.6);
      tl.fromTo(q(root, ".fx-stamp"), { opacity: 0, scale: 1.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.16, ease: "power3.in", stagger: 0.028 }, 0.45);
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, ">-0.2");
      break;

    case "stack":
      tl.fromTo(card, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
      tl.fromTo(q(root, ".fx-layer"), { y: 150 }, { y: 0, duration: 1, stagger: 0.13, ease: "back.out(1.25)" }, 0.25);
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, 1.1);
      break;

    case "typeset": {
      drop(0.6);
      tl.fromTo(q(root, ".fx-wipe"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.8, ease: "expo.inOut" }, 0.3);
      const targets = q(root, ".fx-split");
      if (targets.length) {
        const s = new SplitText(targets, { type: "chars", mask: "chars" });
        splits.push(s);
        tl.fromTo(s.chars, { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.028, ease: "expo.out" }, 0.75);
      }
      tl.fromTo(q(root, ".fx-line"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 1.3);
      break;
    }

    case "gild":
      tl.fromTo(card, { rotationY: -40, rotationX: 14, z: -320, y: -30 }, { rotationY: 0, rotationX: 0, z: 0, y: 0, duration: 1.6, ease: "power3.out" }, 0);
      tl.fromTo(root, { "--sweep": -0.4 }, { "--sweep": 1.4, duration: 1.5, ease: "power2.inOut" }, 1);
      break;

    case "slam": {
      drop(0.5);
      const targets = q(root, ".fx-type");
      if (targets.length) {
        const s = new SplitText(targets, { type: "chars" });
        splits.push(s);
        tl.fromTo(s.chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.035, ease: "none" }, 0.5);
      }
      tl.fromTo(q(root, ".fx-slam"), { scale: 2.4, opacity: 0, rotation: -16 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.26, ease: "power4.in" }, ">+0.15");
      tl.fromTo(card, { x: 0 }, { x: 6, duration: 0.45, ease: "thump" }, ">");
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, ">-0.2");
      break;
    }

    case "bloom":
      // the card opens up from the centre, then its elements pop in
      tl.fromTo(card, { scale: 0.55, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.5)" }, 0);
      {
        const pops = q(root, ".fx-pop");
        tl.fromTo(pops, { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.6, stagger: Math.min(0.08, 1.4 / Math.max(1, pops.length)), ease: "back.out(2.2)" }, 0.45);
      }
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, ">-0.3");
      break;

    case "draw":
      // line art is drawn stroke by stroke (DrawSVG), then the type settles in
      drop(0.7);
      tl.fromTo(q(root, ".fx-draw"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, stagger: 0.06, ease: "power1.inOut" }, 0.35);
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, 1.1);
      break;

    case "cascade":
      // content slides in line by line, like a well-set page
      tl.fromTo(card, { y: 40, rotationX: 18, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0);
      tl.fromTo(q(root, ".fx-item"), { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: "power3.out" }, 0.5);
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, ">-0.2");
      break;

    case "type": {
      // typed out on a terminal / typewriter
      drop(0.6);
      const targets = q(root, ".fx-type");
      if (targets.length) {
        const s = new SplitText(targets, { type: "chars" });
        splits.push(s);
        tl.fromTo(s.chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.03, ease: "none" }, 0.6);
      }
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.1 }, ">");
      break;
    }

    case "zoom":
      // flicked onto the table: spins down from above and lands
      tl.fromTo(card, { scale: 2.6, rotationZ: -28, y: -120, opacity: 0 }, { scale: 1, rotationZ: 0, y: 0, opacity: 1, duration: 0.9, ease: "power3.in" }, 0);
      tl.to(card, { keyframes: { scale: [1, 1.03, 1] }, duration: 0.3, ease: "power1.out" }, ">");
      tl.fromTo(q(root, ".fx-pop"), { scale: 0.3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.07, ease: "back.out(2)" }, ">-0.1");
      break;

    case "wipe":
      // printed in one pass: a reveal sweeps across the face
      drop(0.6);
      tl.fromTo(root, { "--wipe": 0 }, { "--wipe": 1, duration: 1.4, ease: "power2.inOut" }, 0.5);
      tl.fromTo(q(root, ".fx-fade"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, 1.4);
      break;
  }

  // markers the chosen entrance didn't use still come alive, so any design works with any entrance
  const rest = (sel: string) => (used.has(sel) ? [] : q(root, sel));
  const draws = rest(".fx-draw");
  if (draws.length) tl.fromTo(draws, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, stagger: Math.min(0.06, 0.8 / draws.length), ease: "power1.inOut" }, 0.45);
  const pops = rest(".fx-pop");
  if (pops.length) tl.fromTo(pops, { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.55, stagger: Math.min(0.08, 1 / pops.length), ease: "back.out(2)" }, 0.55);
  const items = rest(".fx-item");
  if (items.length) tl.fromTo(items, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: Math.min(0.08, 0.9 / items.length), ease: "power3.out" }, 0.6);
  const fades = rest(".fx-fade");
  if (fades.length) tl.fromTo(fades, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.9);
  const types = rest(".fx-type");
  if (types.length) tl.fromTo(types, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.15 }, 0.8);

  // shared extras any design can opt into
  // spinning parts (camera iris, zodiac wheel, record) turn via a CSS variable,
  // so SVG groups rotate about their own centre (transform-box: fill-box)
  if (q(root, ".fx-spin").length) tl.fromTo(root, { "--spin": -540 }, { "--spin": 0, duration: 2.6, ease: "power3.out" }, 0.2);
  const count = q(root, ".fx-count");
  count.forEach((el) => {
    const end = Number(el.dataset?.to ?? 0);
    if (!end) return;
    const o = { v: 0 };
    tl.to(o, { v: end, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) }, 0.8);
  });
  return () => splits.forEach((s) => s.revert());
}

/** Adds the design's turn to `toBack` (true) or back to the front, at `at`. */
export function addFlip(tl: gsap.core.Timeline, kind: BizFlip, r: MotionRefs, toBack: boolean, at: number | string = ">") {
  register();
  const { flip, card, root } = r;
  const a = toBack ? 180 : 0;
  const lift = (z: number, d: number) => tl.to(flip, { keyframes: { z: [0, z, 0] }, duration: d, ease: "sine.inOut" }, "<");

  switch (kind) {
    case "classic":
      tl.to(flip, { rotationY: a, duration: 0.9, ease: "power2.inOut" }, at);
      break;
    case "lift":
      tl.to(flip, { rotationY: a, duration: 1.05, ease: "power2.inOut" }, at);
      lift(130, 1.05);
      break;
    case "spin":
      tl.to(flip, { rotationY: "+=540", duration: 1.5, ease: "expo.inOut" }, at);
      lift(220, 1.5);
      break;
    case "heavy":
      tl.to(flip, { rotationY: a, duration: 1.15, ease: "back.out(1.7)" }, at);
      tl.to(card, { keyframes: { y: [0, -28, 0] }, duration: 0.8, ease: "power2.inOut" }, "<");
      break;
    case "vertical":
      tl.to(flip, { rotationX: a, duration: 1, ease: "power2.inOut" }, at);
      lift(90, 1);
      break;
    case "float":
      tl.to(flip, { rotationY: a, duration: 1.7, ease: "sine.inOut" }, at);
      tl.to(flip, { keyframes: { y: [0, -34, 0], rotationZ: [0, 5, 0] }, duration: 1.7, ease: "sine.inOut" }, "<");
      break;
    case "glitch":
      tl.set(root, { attr: { "data-glitch": "1" } }, at);
      tl.to(
        root,
        {
          keyframes: [
            { "--glitch": 1, duration: 0.05 },
            { "--glitch": -0.7, duration: 0.05 },
            { "--glitch": 0.5, duration: 0.05 },
            { "--glitch": -1, duration: 0.05 },
            { "--glitch": 0.3, duration: 0.05 },
            { "--glitch": 0, duration: 0.06 },
          ],
        },
        "<",
      );
      tl.set(flip, { rotationY: a }, "<0.15");
      tl.set(root, { attr: { "data-glitch": "0" } }, "<0.2");
      break;
    case "hinge":
      tl.to(flip, { rotationY: a, x: toBack ? r.w : 0, duration: 1.2, ease: "power2.inOut" }, at);
      lift(60, 1.2);
      break;
    case "tumble":
      tl.to(flip, { rotationY: a, rotationZ: toBack ? 360 : 0, duration: 1.3, ease: "power3.inOut" }, at);
      lift(160, 1.3);
      break;
    case "swap":
      // dealt like playing cards: out to the left, the other side comes in from the right
      tl.to(flip, { x: -1100, rotationZ: -10, duration: 0.42, ease: "power2.in" }, at);
      tl.set(flip, { rotationY: a, x: 1100, rotationZ: 10 });
      tl.to(flip, { x: 0, rotationZ: 0, duration: 0.6, ease: "power3.out" });
      break;
    case "edge":
      // pauses edge-on so the gilded edge catches the light
      tl.to(flip, { rotationY: 88, duration: 0.6, ease: "power2.in" }, at);
      tl.fromTo(root, { "--sweep": -0.4 }, { "--sweep": 1.4, duration: 0.9, ease: "power1.inOut" }, "<0.3");
      tl.to(flip, { rotationY: a, duration: 0.65, ease: "power2.out" }, "<0.6");
      break;
    case "pop":
      // shrinks, snaps over and bounces back to size
      tl.to(flip, { scale: 0.82, duration: 0.25, ease: "power2.in" }, at);
      tl.to(flip, { rotationY: a, duration: 0.5, ease: "power2.inOut" });
      tl.to(flip, { scale: 1, duration: 0.55, ease: "back.out(2.4)" }, "<0.35");
      break;
    case "deal":
      // slides down off the table and the other side slides up from below
      tl.to(flip, { y: 900, rotationZ: 6, duration: 0.45, ease: "power2.in" }, at);
      tl.set(flip, { rotationY: a, y: -900, rotationZ: -6 });
      tl.to(flip, { y: 0, rotationZ: 0, duration: 0.65, ease: "power3.out" });
      break;
    case "toss":
      tl.to(flip, { rotationY: a, duration: 0.95, ease: "power1.inOut" }, at);
      tl.to(card, { keyframes: { y: [0, -160, 0], rotationZ: [0, -9, 0] }, duration: 0.95, ease: "power1.inOut" }, "<");
      tl.to(card, { y: -12, duration: 0.12, ease: "power1.out" });
      tl.to(card, { y: 0, duration: 0.28, ease: "bounce.out" });
      break;
  }
}
