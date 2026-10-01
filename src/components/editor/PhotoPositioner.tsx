"use client";
import React, { useRef } from "react";

/**
 * Frame a photo by dragging it inside a window shaped like the area it will
 * fill, plus a zoom slider. Values are a focal point in % and a zoom factor,
 * applied with object-position / transform-origin on the real cover.
 */
export default function PhotoPositioner({
  src,
  aspect,
  x,
  y,
  zoom,
  onChange,
}: {
  src: string;
  /** width / height of the area the photo fills on the card */
  aspect: number;
  x: number;
  y: number;
  zoom: number;
  onChange: (v: { x: number; y: number; zoom: number }) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const down = (e: React.PointerEvent) => {
    drag.current = { px: e.clientX, py: e.clientY, x, y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = box.current;
    if (!d || !el) return;
    const r = el.getBoundingClientRect();
    // dragging the photo right reveals more of its left side, so the focal point moves left
    const k = 140 / zoom;
    onChange({ x: Math.round(clamp(d.x - ((e.clientX - d.px) / r.width) * k)), y: Math.round(clamp(d.y - ((e.clientY - d.py) / r.height) * k)), zoom });
  };
  const up = () => (drag.current = null);

  return (
    <div className="pp">
      <div ref={box} className="pp-box" style={{ aspectRatio: String(aspect) }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} style={{ objectPosition: `${x}% ${y}%`, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: `${x}% ${y}%` }} />
        <span className="pp-grid" aria-hidden />
        <span className="pp-tip">Drag to move</span>
      </div>
      <label className="pp-zoom">
        <span>Zoom</span>
        <input type="range" min={1} max={2.5} step={0.05} value={zoom} onChange={(e) => onChange({ x, y, zoom: Number(e.target.value) })} />
        <b>{zoom.toFixed(1)}×</b>
      </label>
      <button type="button" className="btn-ghost pp-reset" onClick={() => onChange({ x: 50, y: 35, zoom: 1 })}>
        Reset framing
      </button>
    </div>
  );
}
