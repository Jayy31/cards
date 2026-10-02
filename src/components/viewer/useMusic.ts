"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicKind } from "@/lib/types";
import { synthesize } from "@/lib/music";

/** Background music: procedural track (Web Audio) or an uploaded file. Must be started from a user gesture. */
export function useMusic(kind: MusicKind, url?: string) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bufRef = useRef<Float32Array | null>(null);
  const available = kind !== "none" && !(kind === "custom" && !url);

  // Synthesise ahead of time (off the tap) so opening the envelope never stutters.
  useEffect(() => {
    if (kind !== "santoor" && kind !== "tanpura") return;
    const id = setTimeout(() => {
      bufRef.current = synthesize(kind, 32, 22050);
    }, 400);
    return () => clearTimeout(id);
  }, [kind]);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    if (gainRef.current && ctx) gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    const src = srcRef.current;
    setTimeout(() => src?.stop(), 700);
    srcRef.current = null;
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (!available) return;
    if (kind === "custom" && url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.7;
      }
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new Ctx();
    ctxRef.current = ctx;
    ctx.resume();
    const data = bufRef.current ?? synthesize(kind as "santoor" | "tanpura", 32, 22050);
    bufRef.current = data;
    const buf = ctx.createBuffer(1, data.length, 22050);
    buf.copyToChannel(data as Float32Array<ArrayBuffer>, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5);
    src.connect(gain).connect(ctx.destination);
    src.start();
    srcRef.current = src;
    gainRef.current = gain;
    setPlaying(true);
  }, [available, kind, url]);

  const toggle = useCallback(() => (playing ? stop() : start()), [playing, start, stop]);

  useEffect(
    () => () => {
      srcRef.current?.stop();
      audioRef.current?.pause();
      ctxRef.current?.close();
    },
    [],
  );

  return { playing, start, stop, toggle, available };
}
