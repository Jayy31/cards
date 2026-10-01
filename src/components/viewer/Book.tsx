"use client";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import type { WedTurn } from "@/lib/types";

/**
 * Hinged booklet with a 3D page turn.
 *
 * Each leaf rotates around its left edge. All visual state is a pure function
 * of a per-leaf progress value (0 = closed/unturned, 1 = turned), so the same
 * code drives finger-dragging, tap/keyboard turns and frame-exact video
 * rendering (`setProgress` from a seek function).
 */

export interface BookHandle {
  setProgress: (leaf: number, p: number) => void;
  goTo: (index: number, animate?: boolean) => void;
  next: () => void;
  prev: () => void;
}

interface Props {
  pages: React.ReactNode[];
  back: React.ReactNode;
  index: number;
  onIndexChange?: (i: number) => void;
  interactive?: boolean;
  width?: number;
  height?: number;
  /** scale of the book on screen, so drag distance maps to page width */
  scale?: number;
  /** page-turn style (default: hinged leaf) */
  turn?: WedTurn;
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

const Book = forwardRef<BookHandle, Props>(function Book({ pages, back, index, onIndexChange, interactive = true, width = 500, height = 700, scale = 1, turn = "leaf" }, ref) {
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef<number[]>(pages.map((_, i) => (i < index ? 1 : 0)));
  const indexRef = useRef(index);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const n = pages.length;

  if (progress.current.length !== n) {
    progress.current = pages.map((_, i) => (i < indexRef.current ? 1 : 0));
  }

  /** The non-hinged turns: the page leaves, and the one beneath settles forward. */
  const applyMove = useCallback(
    (i: number) => {
      const el = leafRefs.current[i];
      if (!el) return;
      const p = progress.current[i];
      const turning = p > 0 && p < 1;
      const arc = Math.sin(p * Math.PI);
      // how far the page above has gone: this page rises to meet the viewer
      const above = i > 0 ? progress.current[i - 1] : 1;
      const k = p > 0 ? 1 : 0.94 + 0.06 * above;
      let tf = "";
      let op = 1;
      let clip = "";
      let filter = "";
      switch (turn) {
        case "lift": // palm-leaf manuscript: hinged at the top edge, flips up and over
          tf = `translateZ(${arc * 40}px) rotateX(${180 * p}deg)`;
          break;
        case "rise": // scroll: the page travels up and tips away
          tf = `translateY(${-p * 820}px) rotateX(${p * 18}deg) translateZ(${arc * 30}px)`;
          break;
        case "dissolve":
          tf = `scale(${1 + p * 0.06})`;
          op = 1 - p;
          break;
        case "stack": // lifted off the pile and tossed aside
          tf = `translate(${-p * 660}px, ${-arc * 46}px) rotate(${-p * 16}deg) translateZ(${arc * 60}px)`;
          break;
        case "swipe":
          tf = `translateX(${-p * 600}px) translateZ(${-p * 120}px) rotateY(${p * 38}deg)`;
          break;
        case "fan": // hand fan: swings away around the bottom-left corner
          tf = `rotate(${-p * 115}deg) translateZ(${arc * 30}px)`;
          break;
        case "flipdown": // calendar: hinged at the bottom edge, falls toward the viewer
          tf = `translateZ(${arc * 40}px) rotateX(${-180 * p}deg)`;
          break;
        case "twirl": // garba: spins away while shrinking
          tf = `rotate(${-p * 220}deg) scale(${1 - p * 0.7})`;
          op = 1 - p * p;
          break;
        case "zoom": // through the arch: grows past the viewer and fades
          tf = `scale(${1 + p * 0.7})`;
          op = Math.max(0, 1 - p * 1.4);
          break;
        case "drop": // falls under its own weight, tipping off the corner
          tf = `translate(${p * 40}px, ${p * p * 980}px) rotate(${p * 14}deg)`;
          break;
        case "diagonal": // flips over its own diagonal, hinged at the bottom-left corner
          tf = `translateZ(${arc * 40}px) rotate3d(1, -1, 0, ${-180 * p}deg)`;
          break;
        case "iris": // closes like a camera iris onto the page beneath
          tf = `scale(${1 + p * 0.04})`;
          clip = `circle(${((1 - p) * 76).toFixed(2)}% at 50% 50%)`;
          break;
        case "wipe": // brushed away from right to left
          clip = `inset(0% ${(p * 100).toFixed(2)}% 0% 0%)`;
          break;
        case "turnover": // turned over like a postcard, about its centre
          tf = `translateZ(${arc * 70}px) rotateY(${-180 * p}deg)`;
          break;
        case "edge": // spun edge-on and gone
          tf = `translateX(${-p * 90}px) rotateY(${-90 * p}deg) scale(${1 - p * 0.08})`;
          break;
        case "orbit": // swings away around a point far behind the page, into space
          tf = `rotateY(${-75 * p}deg)`;
          op = 1 - p * p;
          break;
        case "pour": // slides down the glass like a sheet of rain
          tf = `translateY(${p * p * 820}px) scaleY(${1 + p * 0.1})`;
          op = 1 - p * 0.4;
          break;
        case "reel": { // film advancing frame by frame
          const s = Math.round(p * 7) / 7;
          tf = `translateY(${-s * 760}px)`;
          op = p > 0 && p < 1 && Math.round(p * 14) % 2 ? 0.86 : 1;
          break;
        }
        case "peel": // peeled from the bottom-right corner across the other diagonal
          tf = `translateZ(${arc * 40}px) rotate3d(1, 1, 0, ${180 * p}deg)`;
          break;
        case "drift": // floats up and away like a snowflake
          tf = `translate(${(Math.sin(p * Math.PI) * 40).toFixed(1)}px, ${-p * 820}px) rotate(${(Math.sin(p * Math.PI * 2) * 6).toFixed(2)}deg)`;
          op = 1 - p * 0.3;
          break;
        case "crack": { // split away along a jagged gold seam
          const jit = [0, 6, -4, 8, -6, 4, 0];
          const pts = jit.map((j, i) => `${((1 - p) * 112 - 6 + j * Math.sin(p * Math.PI)).toFixed(2)}% ${(i * 100) / 6}%`);
          clip = `polygon(0% 0%, ${pts.join(", ")}, 0% 100%)`;
          break;
        }
        case "plane": // folds into a paper plane and flies off
          tf = `translate(${-p * 640}px, ${-p * p * 520}px) rotate(${-p * 28}deg) rotateX(${p * 55}deg) scale(${1 - p * 0.55})`;
          break;
        case "pan": // the map slides away as if panned
          tf = `translate(${-p * 560}px, ${-p * 240}px) rotate(${-p * 5}deg)`;
          op = 1 - p * 0.4;
          break;
        case "recede": // sinks back into the forest's depth
          tf = `translateZ(${-p * 700}px) translateY(${-p * 60}px)`;
          op = 1 - p;
          break;
        case "frost": // mists over, then fades
          tf = `scale(${1 + p * 0.03})`;
          filter = `blur(${(p * 7).toFixed(2)}px) brightness(${(1 + p * 0.7).toFixed(2)})`;
          op = 1 - p;
          break;
      }
      el.style.transform = p > 0 ? tf : `scale(${k})`;
      el.style.opacity = String(op);
      el.style.filter = p > 0 && p < 1 ? filter : "";
      el.style.clipPath = p > 0 && p < 1 ? clip : p >= 1 && clip ? "inset(50%)" : "";
      el.style.zIndex = String(turning ? 500 : p >= 1 ? 100 + i : n - i);
      const front = el.querySelector<HTMLElement>(".leaf-shade-front");
      if (front) front.style.opacity = turn === "dissolve" || turn === "zoom" || turn === "twirl" || turn === "iris" || turn === "wipe" || turn === "frost" || turn === "orbit" || turn === "reel" || turn === "crack" || turn === "recede" ? "0" : String((1 - k) * 4 + arc * 0.25);
    },
    [n, turn],
  );

  const apply = useCallback(
    (i: number) => {
      if (turn !== "leaf") {
        applyMove(i);
        applyMove(i + 1);
        return;
      }
      const el = leafRefs.current[i];
      if (!el) return;
      const p = progress.current[i];
      const turning = p > 0 && p < 1;
      const arc = Math.sin(p * Math.PI);
      // A turning page lifts off the stack and bows slightly toward the viewer.
      el.style.transform = `translateZ(${arc * 30}px) rotateY(${-180 * p}deg) skewY(${arc * -1.4}deg)`;
      el.style.zIndex = String(turning ? 500 : p >= 1 ? 100 + i : n - i);
      const front = el.querySelector<HTMLElement>(".leaf-shade-front");
      const backShade = el.querySelector<HTMLElement>(".leaf-shade-back");
      const curl = el.querySelector<HTMLElement>(".leaf-curl");
      if (front) front.style.opacity = String(clamp(p * 1.1) * 0.55);
      if (backShade) backShade.style.opacity = String((1 - p) * 0.5);
      if (curl) curl.style.opacity = String(arc * 0.9);
      // shadow cast by this leaf on the page beneath it
      const under = leafRefs.current[i + 1]?.querySelector<HTMLElement>(".leaf-cast");
      if (under) {
        under.style.opacity = String(arc * 0.75);
        under.style.transform = `scaleX(${clamp(1 - p + 0.15)})`;
      }
    },
    [n, turn, applyMove],
  );

  /**
   * Only the leaves that can actually be seen are painted: anything turning,
   * the first unturned leaf and the one under it. Everything else is hidden so
   * the moving light (foil sheen) doesn't repaint pages nobody can see.
   */
  const updateVisibility = useCallback(() => {
    const pr = progress.current;
    let top = pr.findIndex((v) => v < 1);
    if (top < 0) top = n - 1;
    for (let i = 0; i < n; i++) {
      const el = leafRefs.current[i];
      if (!el) continue;
      const turning = pr[i] > 0 && pr[i] < 1;
      const show = turning || i === top || i === top + 1 || (pr[i] < 1 && i > 0 && pr[i - 1] > 0 && pr[i - 1] < 1);
      el.style.visibility = show ? "visible" : "hidden";
    }
  }, [n]);

  const applyAll = useCallback(() => {
    for (let i = 0; i < n; i++) apply(i);
    updateVisibility();
  }, [apply, n, updateVisibility]);

  const setProgress = useCallback(
    (leaf: number, p: number) => {
      if (leaf < 0 || leaf >= n) return;
      progress.current[leaf] = clamp(p);
      apply(leaf);
      updateVisibility();
    },
    [apply, n, updateVisibility],
  );

  const animateLeaf = useCallback(
    (leaf: number, to: number, done?: () => void, duration = 0.9) => {
      tweenRef.current?.kill();
      const o = { p: progress.current[leaf] };
      tweenRef.current = gsap.to(o, {
        p: to,
        duration: duration * Math.max(0.35, Math.abs(to - o.p)),
        ease: "power2.inOut",
        onUpdate: () => setProgress(leaf, o.p),
        onComplete: done,
      });
    },
    [setProgress],
  );

  const commit = useCallback(
    (i: number) => {
      indexRef.current = i;
      onIndexChange?.(i);
    },
    [onIndexChange],
  );

  const goTo = useCallback(
    (target: number, animate = true) => {
      target = Math.max(0, Math.min(n - 1, target));
      const cur = indexRef.current;
      if (target === cur) return;
      if (!animate || Math.abs(target - cur) > 1) {
        tweenRef.current?.kill();
        for (let i = 0; i < n; i++) progress.current[i] = i < target ? 1 : 0;
        applyAll();
        commit(target);
        return;
      }
      if (target > cur) animateLeaf(cur, 1, () => commit(target));
      else animateLeaf(target, 0, () => commit(target));
    },
    [animateLeaf, applyAll, commit, n],
  );

  useImperativeHandle(ref, () => ({ setProgress, goTo, next: () => goTo(indexRef.current + 1), prev: () => goTo(indexRef.current - 1) }), [setProgress, goTo]);

  // external index changes (editor jumping to a section)
  useEffect(() => {
    if (index !== indexRef.current) goTo(index, Math.abs(index - indexRef.current) === 1);
  }, [index, goTo]);

  useEffect(() => {
    applyAll();
  }, [applyAll, pages]);

  /* ---------------- gestures ---------------- */
  const drag = useRef<{ x: number; y: number; leaf: number; dir: 1 | -1 | 0; moved: boolean; t: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    if ((e.target as HTMLElement).closest("[data-no-flip]")) return;
    drag.current = { x: e.clientX, y: e.clientY, leaf: -1, dir: 0, moved: false, t: performance.now() };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      d.moved = true;
      d.dir = dx < 0 ? 1 : -1;
      d.leaf = d.dir === 1 ? indexRef.current : indexRef.current - 1;
      if (d.leaf < 0 || d.leaf >= n - (d.dir === 1 ? 1 : 0)) {
        d.leaf = -1;
        return;
      }
      tweenRef.current?.kill();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.leaf < 0) return;
    const w = width * scale;
    const p = d.dir === 1 ? clamp(-dx / w) : clamp(1 - dx / w);
    setProgress(d.leaf, p);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // tap: right side → next, left side → previous
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      goTo(indexRef.current + (x > 0.4 ? 1 : -1));
      return;
    }
    if (d.leaf < 0) return;
    const p = progress.current[d.leaf];
    const fast = performance.now() - d.t < 250;
    if (d.dir === 1) {
      if (p > 0.3 || fast) animateLeaf(d.leaf, 1, () => commit(d.leaf + 1), 0.7);
      else animateLeaf(d.leaf, 0, undefined, 0.5);
    } else {
      if (p < 0.7 || fast) animateLeaf(d.leaf, 0, () => commit(d.leaf), 0.7);
      else animateLeaf(d.leaf, 1, undefined, 0.5);
    }
  };

  useEffect(() => {
    if (!interactive) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input,textarea,select")) return;
      if (e.key === "ArrowRight") goTo(indexRef.current + 1);
      if (e.key === "ArrowLeft") goTo(indexRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interactive, goTo]);

  return (
    <div
      className={`book turn-${turn}`}
      style={{ width, height }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
    >
      <div className="book-stack-edge" />
      {pages.map((page, i) => (
        <div
          key={i}
          className="leaf"
          ref={(el) => {
            leafRefs.current[i] = el;
          }}
          style={{ zIndex: n - i }}
        >
          <div className="leaf-face leaf-front">
            {page}
            <div className="leaf-cast" />
            <div className="leaf-shade-front" />
            <div className="leaf-curl" />
          </div>
          <div className="leaf-face leaf-backside">
            {back}
            <div className="leaf-shade-back" />
          </div>
        </div>
      ))}
    </div>
  );
});

export default Book;
