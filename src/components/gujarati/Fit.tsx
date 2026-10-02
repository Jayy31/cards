"use client";

import { createElement, useLayoutEffect, useRef, type CSSProperties } from "react";

/**
 * Text that shrinks to fit its box. The box size comes from CSS (width + max-height, or nowrap
 * for one line); we step the font size down from `max` until nothing overflows, never below `min`.
 * Re-fits when the text changes and once web fonts have loaded (Gujarati fonts are wider than the fallback).
 */
export function Fit({
  text,
  max,
  min = Math.round(max * 0.5),
  as = "div",
  className,
  style,
}: {
  text: string;
  max: number;
  min?: number;
  as?: "div" | "span" | "p" | "h1" | "h2";
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let s = max;
      el.style.fontSize = `${s}px`;
      // Gujarati matras poke a few px out of the line box, so allow ~⅓ em of vertical spill
      // (a real extra line is ≥1.3 em, so it is still caught).
      while (s > min && (el.scrollHeight > el.clientHeight + s * 0.35 || el.scrollWidth > el.clientWidth + 1)) {
        s -= s > 24 ? 1 : 0.5;
        el.style.fontSize = `${s}px`;
      }
    };
    fit();
    let live = true;
    document.fonts?.ready.then(() => live && fit());
    return () => {
      live = false;
    };
  }, [text, max, min]);

  return createElement(as, { ref, className: `fit ${className ?? ""}`, style: { ...style, fontSize: max } }, text);
}
