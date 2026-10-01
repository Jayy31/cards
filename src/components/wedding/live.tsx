"use client";
import React, { useEffect, useRef } from "react";
import { useCardEnv } from "@/components/card/CardEnv";

/** Seconds on the card's clock: the video frame's time when exporting, else the wall clock. */
export function cardClock() {
  if (typeof window !== "undefined" && window.__cardTime != null) return window.__cardTime;
  return typeof performance !== "undefined" ? performance.now() / 1000 : 0;
}

/**
 * A canvas redrawn every frame from the card clock, so live animation (rain,
 * snow, fireflies, fog) also renders frame-exact in video export. Thumbnails
 * draw a single still frame.
 */
export function LiveCanvas({
  width,
  height,
  draw,
  className = "",
  stillAt = 3,
  onInit,
  style,
  noFlip = false,
}: {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;
  className?: string;
  stillAt?: number;
  onInit?: (canvas: HTMLCanvasElement) => (() => void) | void;
  style?: React.CSSProperties;
  /** pointer gestures on the canvas don't turn the page */
  noFlip?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const env = useCardEnv();
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = width * dpr;
    c.height = height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cleanup = onInit?.(c);
    if (env.mode === "thumb") {
      drawRef.current(ctx, stillAt, width, height);
      return () => cleanup?.();
    }
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver((es) => (visible = es.some((e) => e.isIntersecting)));
    io.observe(c);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      // skip pages that are hidden (turned away) or offscreen
      if (!visible || c.offsetParent === null || getComputedStyle(c.closest(".leaf") ?? c).visibility === "hidden") return;
      drawRef.current(ctx, cardClock(), width, height);
    };
    drawRef.current(ctx, cardClock(), width, height);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, env.mode, stillAt]);
  return <canvas ref={ref} className={className} style={{ width, height, ...style }} {...(noFlip ? { "data-no-flip": true } : {})} />;
}
