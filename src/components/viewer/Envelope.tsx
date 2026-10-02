"use client";
import React, { useId } from "react";
import type { Palette } from "@/lib/types";
import { foilCss, isDark } from "@/components/card/theme";
import { leafPath, WaxSeal } from "@/components/card/ornaments";

/**
 * Envelope in four stacked layers so the card can live *inside* it:
 *   back (liner)  <  card  <  front pocket  <  top flap  <  wax seal
 * The flap drops behind the card once it passes 90° (handled by the timeline).
 */

export const ENV = { x: 40, y: 150, w: 520, h: 700, flapH: 330 };

function Liner({ p }: { p: Palette }) {
  const id = useId().replace(/:/g, "");
  const fg = isDark(p.envelope2) ? "rgba(255,230,170,0.28)" : "rgba(0,0,0,0.12)";
  return (
    <svg width="100%" height="100%" className="env-liner-svg" preserveAspectRatio="none">
      <defs>
        <pattern id={`ln-${id}`} width="44" height="44" patternUnits="userSpaceOnUse">
          <g fill={fg}>
            <path d={leafPath(22, 22, 12, 4, -90)} />
            <path d={leafPath(22, 22, 12, 4, 90)} />
            <path d={leafPath(22, 22, 12, 4, 0)} />
            <path d={leafPath(22, 22, 12, 4, 180)} />
            <circle cx={0} cy={0} r={2} />
            <circle cx={44} cy={0} r={2} />
            <circle cx={0} cy={44} r={2} />
            <circle cx={44} cy={44} r={2} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={p.envelope2} />
      <rect width="100%" height="100%" fill={`url(#ln-${id})`} />
    </svg>
  );
}

export function EnvelopeBack({ p }: { p: Palette }) {
  return (
    <div className="env-part env-back" style={{ left: ENV.x, top: ENV.y, width: ENV.w, height: ENV.h }}>
      <Liner p={p} />
      <div className="env-inner-shadow" />
    </div>
  );
}

export function EnvelopeFront({ p, addressee, from }: { p: Palette; addressee?: string; from: string }) {
  const envPal = { ...p, paper: p.envelope };
  const foil = foilCss(envPal);
  return (
    <div className="env-part env-front" style={{ left: ENV.x, top: ENV.y, width: ENV.w, height: ENV.h, ["--env-foil" as string]: foil }}>
      <div className="env-sides">
        <div className="env-side left" />
        <div className="env-side right" />
      </div>
      <div className="env-bottom-wrap">
        <div className="env-bottom" />
      </div>
      <div className={`env-address ${isDark(p.envelope) ? "on-dark" : "on-light"}`}>
        {addressee ? (
          <>
            <span className="env-to">To,</span>
            <span className="env-name">{addressee}</span>
          </>
        ) : (
          <>
            <span className="env-to">You are cordially invited</span>
            <span className="env-name">{from}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function EnvelopeFlap({ p }: { p: Palette }) {
  return (
    <div className="env-part env-flap-wrap" style={{ left: ENV.x, top: ENV.y, width: ENV.w, height: ENV.flapH }}>
      <div className="env-flap-shadow">
        <i />
      </div>
      <div className="env-flap">
        <div className="env-flap-face env-flap-out" />
        <div className="env-flap-face env-flap-in">
          <Liner p={p} />
        </div>
      </div>
    </div>
  );
}

export function EnvelopeSeal({ p, text }: { p: Palette; text: string }) {
  const size = 104;
  const style = { left: ENV.x + ENV.w / 2 - size / 2, top: ENV.y + ENV.flapH - size / 2 - 14, width: size, height: size };
  return (
    <div className="env-part env-seal" style={style}>
      <div className="seal-half seal-l">
        <WaxSeal size={size} color={p.wax} text={text} />
      </div>
      <div className="seal-half seal-r">
        <WaxSeal size={size} color={p.wax} text={text} />
      </div>
      <div className="seal-glow" />
    </div>
  );
}
