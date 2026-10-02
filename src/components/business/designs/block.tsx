"use client";
import { useMemo } from "react";
import { rng } from "@/lib/format";
import { Brand, Contacts, type FaceProps, fitSize, FrontMeta, LocalName, Qr } from "../parts";

/*
 * Jaipur Block: Sanganeri-style hand block print on deckle-edged handmade
 * paper. The border is a run of individual "stamps" (`.fx-stamp`) so the
 * arrival animation can print them one by one. Two blocks, two colours: the
 * outline block (ink) and the dot block (accent2), deliberately a hair off
 * register, with an ink filter that leaves the speckled gaps of real printing.
 */

function petal(s: number) {
  return `M0,0 C${s * 0.34},${-s * 0.22} ${s * 0.34},${-s * 0.74} 0,${-s} C${-s * 0.34},${-s * 0.74} ${-s * 0.34},${-s * 0.22} 0,0Z`;
}

function Flower({ x, y, s, rot = 0, petals = 6 }: { x: number; y: number; s: number; rot?: number; petals?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="fx-stamp">
        <g className="blk-a">
          {Array.from({ length: petals }, (_, k) => (
            <path key={k} d={petal(s)} transform={`rotate(${(k * 360) / petals})`} />
          ))}
        </g>
        <circle className="blk-b" cx={0.8} cy={0.6} r={s * 0.26} />
      </g>
    </g>
  );
}

function Sprig({ x, y, s, rot = 0 }: { x: number; y: number; s: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="fx-stamp">
        <path className="blk-a" d={`M0,${s} C${s * 0.1},${s * 0.2} ${-s * 0.1},${-s * 0.4} 0,${-s}`} fill="none" strokeWidth={1.4} />
        <path className="blk-a" d={`M0,${s * 0.1} c${s * 0.5},${-s * 0.1} ${s * 0.7},${-s * 0.5} ${s * 0.6},${-s * 0.8} c${-s * 0.4},0 ${-s * 0.6},${s * 0.4} ${-s * 0.6},${s * 0.8}z`} />
        <path className="blk-a" d={`M0,${s * 0.5} c${-s * 0.5},${-s * 0.1} ${-s * 0.7},${-s * 0.5} ${-s * 0.6},${-s * 0.8} c${s * 0.4},0 ${s * 0.6},${s * 0.4} ${s * 0.6},${s * 0.8}z`} />
        <circle className="blk-b" cx={0.8} cy={-s + 0.6} r={s * 0.22} />
      </g>
    </g>
  );
}

function Paisley({ x, y, s, rot = 0, flip = false }: { x: number; y: number; s: number; rot?: number; flip?: boolean }) {
  const k = s / 24;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -k : k} ${k})`}>
      <g className="fx-stamp">
        <path className="blk-a" d="M2,-24 C18,-24 26,-8 22,8 C18,24 0,30 -10,22 C-20,14 -14,0 -2,2 C8,4 8,-8 0,-10 C-8,-12 -14,-16 2,-24Z" />
        <path className="blk-paper" d="M4,-17 C14,-16 18,-6 16,5 C13,16 2,21 -5,16 C-11,11 -8,5 -1,6 C9,8 13,-4 5,-12Z" />
        <circle className="blk-b" cx={6} cy={4} r={5} />
        <circle className="blk-b" cx={10} cy={-8} r={2.4} />
        <circle className="blk-b" cx={0} cy={13} r={2.4} />
      </g>
    </g>
  );
}

/** Motifs along the border band, alternating flower / sprig, corners get paisleys. */
function Border({ inset, step, s, seed }: { inset: number; step: number; s: number; seed: number }) {
  const items = useMemo(() => {
    const r = rng(seed);
    const out: { x: number; y: number; rot: number; kind: "f" | "s" }[] = [];
    const x0 = inset + 34;
    const x1 = 700 - inset - 34;
    const y0 = inset + 34;
    const y1 = 400 - inset - 34;
    const nx = Math.round((x1 - x0) / step);
    const ny = Math.round((y1 - y0) / step);
    const jit = () => (r() - 0.5) * 1.6; // hand placement is never perfect
    for (let i = 0; i <= nx; i++) out.push({ x: x0 + ((x1 - x0) * i) / nx + jit(), y: inset + jit(), rot: jit() * 2, kind: i % 2 ? "s" : "f" });
    for (let i = 1; i <= ny; i++) out.push({ x: 700 - inset + jit(), y: y0 + ((y1 - y0) * i) / ny - (y1 - y0) / ny / 2 + jit(), rot: 90 + jit() * 2, kind: i % 2 ? "s" : "f" });
    for (let i = nx; i >= 0; i--) out.push({ x: x0 + ((x1 - x0) * i) / nx + jit(), y: 400 - inset + jit(), rot: 180 + jit() * 2, kind: i % 2 ? "s" : "f" });
    for (let i = ny; i >= 1; i--) out.push({ x: inset + jit(), y: y0 + ((y1 - y0) * i) / ny - (y1 - y0) / ny / 2 + jit(), rot: 270 + jit() * 2, kind: i % 2 ? "s" : "f" });
    return out;
  }, [inset, step, seed]);
  const c = inset;
  return (
    <svg className="blk-svg" viewBox="0 0 700 400">
      <g className="blk-print">
        <g className="fx-stamp">
          <rect className="blk-line" x={c - 16} y={c - 16} width={700 - 2 * (c - 16)} height={400 - 2 * (c - 16)} rx={2} />
          <rect className="blk-line" x={c + 16} y={c + 16} width={700 - 2 * (c + 16)} height={400 - 2 * (c + 16)} rx={2} />
        </g>
        {items.map((m, i) => (m.kind === "f" ? <Flower key={i} x={m.x} y={m.y} s={s} rot={m.rot} /> : <Sprig key={i} x={m.x} y={m.y} s={s * 0.95} rot={m.rot} />))}
        <Paisley x={c} y={c} s={s * 1.25} rot={-45} />
        <Paisley x={700 - c} y={c} s={s * 1.25} rot={45} flip />
        <Paisley x={700 - c} y={400 - c} s={s * 1.25} rot={135} />
        <Paisley x={c} y={400 - c} s={s * 1.25} rot={-135} flip />
      </g>
    </svg>
  );
}

function Paper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="paper-grain" />
      <div className="paper-light" />
      {children}
      <div className="paper-sheen" />
    </>
  );
}

export const JaipurBlock = {
  Front: ({ d, p }: FaceProps) => (
    <Paper>
      <Border inset={34} step={30} s={10} seed={4} />
      <div className="blk-front">
        <Brand d={d} className="blk-logo">
          <svg className="blk-medallion blk-print" viewBox="-40 -40 80 80">
            <Flower x={0} y={0} s={26} petals={8} />
            <Flower x={0} y={0} s={13} petals={8} rot={22.5} />
          </svg>
        </Brand>
        <div className="blk-company fx-fade" style={{ fontSize: fitSize(d.company, 460, 64, 0.55) }}>
          {d.company}
        </div>
        <div className="blk-tag fx-fade">{d.tagline}</div>
        <FrontMeta d={d} className="fx-fade fm-inline blk-fm" qrColor={p.ink} />
      </div>
    </Paper>
  ),
  Back: ({ d }: FaceProps) => (
    <Paper>
      <svg className="blk-svg" viewBox="0 0 700 400">
        <g className="blk-print">
          <rect className="blk-line" x={22} y={22} width={656} height={356} rx={2} />
          <rect className="blk-line thin" x={30} y={30} width={640} height={340} rx={2} />
          <Paisley x={40} y={40} s={11} rot={-45} />
          <Paisley x={660} y={360} s={11} rot={135} />
        </g>
      </svg>
      <div className="blk-back">
        <div className="blk-back-main">
          <div className="blk-name">{d.name}</div>
          <LocalName d={d} />
          <div className="blk-title">{d.title}</div>
          <svg className="blk-rule blk-print" viewBox="0 0 200 16">
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} className={i % 2 ? "blk-b" : "blk-a"} cx={20 + i * 20} cy={8} r={i % 2 ? 2.2 : 3.2} />
            ))}
          </svg>
          <Contacts d={d} className="blk-contacts" />
        </div>
        <div className="blk-qr">
          <Qr d={d} color="currentColor" />
          <span>Scan to save</span>
        </div>
      </div>
    </Paper>
  ),
};
