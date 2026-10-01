"use client";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { InviteData } from "@/lib/types";
import { getPalette, getTemplate } from "@/lib/templates";
import { buildIcs, googleCalendarUrl, initials, inviteTitle } from "@/lib/format";
import { CardEnvProvider, type CardMode } from "@/components/card/CardEnv";
import { buildPages, InvitePage, LeafBack } from "@/components/card/InvitePages";
import { themeVars } from "@/components/card/theme";
import Book, { type BookHandle } from "./Book";
import { INTROS } from "./intros";
import type { WedReveal } from "@/lib/types";
import { drawPetals, makePetals } from "./petals";
import { useMusic } from "./useMusic";
import RsvpSheet from "./RsvpSheet";
import { Icon } from "./icons";

/* Scene geometry (design units). */
const INTRO_SCENE = { w: 600, h: 900, bx: 50, by: 100 };
const FLAT_SCENE = { w: 540, h: 740, bx: 20, by: 20 };

/* Video schedule (seconds); the intro's own length comes first. */
const HOLD_COVER = 1.6;
const FLIP = 1.4;
const HOLD = 3.2;
const HOLD_LAST = 3.5;

export function videoDuration(pageCount: number, introEnd = INTROS.envelope.end) {
  return introEnd + HOLD_COVER + (pageCount - 1) * (FLIP + HOLD) - HOLD + HOLD_LAST;
}

/** How a page's content arrives once it is on top (live only). */
const REVEALS: Record<WedReveal, gsap.TweenVars> = {
  glow: { opacity: 0, y: 8, filter: "brightness(1.8)", duration: 0.55, stagger: 0.045, ease: "power2.out" },
  stamp: { opacity: 0, scale: 1.2, duration: 0.35, stagger: 0.04, ease: "back.out(2.2)" },
  bloom: { opacity: 0, scale: 0.94, y: 6, duration: 0.6, stagger: 0.05, ease: "power3.out" },
  type: { opacity: 0, letterSpacing: "0.3em", duration: 0.6, stagger: 0.04, ease: "power2.out" },
  float: { opacity: 0, y: 14, rotate: -1, duration: 0.65, stagger: 0.055, ease: "sine.out" },
  sweep: { clipPath: "inset(0% 100% 0% 0%)", duration: 0.6, stagger: 0.06, ease: "power2.inOut" },
  drop: { opacity: 0, y: -22, duration: 0.6, stagger: 0.05, ease: "bounce.out" },
  pop: { opacity: 0, scale: 0.55, duration: 0.45, stagger: 0.045, ease: "back.out(3)" },
  spin: { opacity: 0, rotateX: 90, transformPerspective: 600, duration: 0.55, stagger: 0.05, ease: "power2.out" },
  zoom: { opacity: 0, scale: 1.14, duration: 0.6, stagger: 0.045, ease: "power2.out" },
  rise: { opacity: 0, y: 30, duration: 0.7, stagger: 0.05, ease: "expo.out" },
  blur: { opacity: 0, filter: "blur(6px)", duration: 0.7, stagger: 0.05, ease: "power2.out" },
  ink: { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, stagger: 0.05, ease: "power3.out" },
  slide: { opacity: 0, x: -40, duration: 0.55, stagger: 0.05, ease: "power3.out" },
  flap: { rotateX: -90, transformPerspective: 500, transformOrigin: "50% 0%", duration: 0.35, stagger: 0.035, ease: "back.out(2)" },
  twinkle: { opacity: 0, scale: 0.97, filter: "brightness(2.6)", duration: 0.9, stagger: 0.07, ease: "expo.out" },
  drip: { opacity: 0, y: -14, filter: "blur(3px)", duration: 0.7, stagger: 0.06, ease: "power2.out" },
  credits: { opacity: 0, y: 26, duration: 0.9, stagger: 0.12, ease: "power1.out" },
  unveil: { clipPath: "inset(100% 0% 0% 0%)", duration: 0.6, stagger: 0.06, ease: "power3.out" },
  condense: { opacity: 0, filter: "blur(8px) brightness(1.4)", duration: 0.8, stagger: 0.06, ease: "power2.out" },
  flurry: { opacity: 0, y: -18, x: () => gsap.utils.random(-10, 10), duration: 0.9, stagger: 0.07, ease: "sine.out" },
  gild: { opacity: 0, y: 4, filter: "brightness(2.4) saturate(0.4)", duration: 0.9, stagger: 0.07, ease: "power2.out" },
  unfold: { opacity: 0, rotateY: -90, transformOrigin: "0% 50%", transformPerspective: 700, duration: 0.6, stagger: 0.06, ease: "power3.out" },
  pin: { opacity: 0, scale: 0.6, y: -24, duration: 0.6, stagger: 0.06, ease: "back.out(2.5)" },
  glowin: { opacity: 0, filter: "drop-shadow(0 0 14px rgba(255,215,106,0.9)) brightness(1.7)", duration: 1, stagger: 0.08, ease: "power2.out" },
  spark: { opacity: 0, scale: 0.88, filter: "brightness(3)", duration: 0.55, stagger: 0.05, ease: "power3.out" },
  powder: { opacity: 0, scale: 1.04, filter: "blur(5px) saturate(2)", duration: 0.8, stagger: 0.06, ease: "power2.out" },
  gleam: { opacity: 0, y: 6, filter: "brightness(2.2) sepia(0.6)", duration: 0.8, stagger: 0.06, ease: "power2.out" },
  kindle: { opacity: 0, filter: "brightness(0.3) sepia(1)", duration: 1, stagger: 0.08, ease: "power2.out" },
  dawn: { opacity: 0, y: 10, filter: "brightness(0.6) saturate(0.6)", duration: 0.9, stagger: 0.07, ease: "power2.out" },
  write: { clipPath: "inset(-10% 100% -10% 0%)", filter: "brightness(1.8)", duration: 0.7, stagger: 0.09, ease: "power1.inOut" },
  crackle: { opacity: 0, scale: 0.94, duration: 0.4, stagger: 0.05, ease: "steps(4)" },
  sweet: { opacity: 0, y: -12, scale: 0.9, duration: 0.7, stagger: 0.06, ease: "elastic.out(1, 0.6)" },
  bless: { opacity: 0, y: -8, filter: "brightness(1.6) sepia(0.4)", duration: 0.8, stagger: 0.07, ease: "power2.out" },
  lights: { opacity: 0, filter: "brightness(2.5)", duration: 0.45, stagger: 0.05, ease: "steps(3)" },
  warmth: { opacity: 0, y: 14, scale: 0.97, filter: "brightness(1.8) sepia(0.5)", duration: 0.9, stagger: 0.07, ease: "power2.out" },
  wave: { opacity: 0, scaleY: 0.6, filter: "blur(2px)", duration: 0.7, stagger: 0.06, ease: "sine.out" },
  slap: { opacity: 0, scale: 1.6, rotate: -8, duration: 0.35, stagger: 0.05, ease: "back.out(1.4)" },
  radiate: { opacity: 0, scale: 0.8, filter: "drop-shadow(0 0 18px rgba(255,210,120,0.9))", duration: 0.8, stagger: 0.07, ease: "power3.out" },
  ledger: { clipPath: "inset(-10% 100% -10% 0%)", duration: 0.9, stagger: 0.12, ease: "power1.inOut" },
  pen: { clipPath: "inset(-10% 100% -10% 0%)", filter: "blur(1.5px)", duration: 0.8, stagger: 0.1, ease: "power1.inOut" },
  press: { opacity: 0, scale: 1.05, filter: "blur(4px)", duration: 0.5, stagger: 0.07, ease: "power2.out" },
  papercut: { opacity: 0, y: 18, scale: 0.94, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" },
  tune: { opacity: 0, scaleY: 0.05, filter: "brightness(3)", duration: 0.45, stagger: 0.06, ease: "power3.out" },
  sparkle: { opacity: 0, duration: 0.5, stagger: { each: 0.06, from: "random" }, ease: "steps(5)" },
};

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

declare global {
  interface Window {
    __card?: { duration: number; seek: (t: number) => void; ready: boolean };
    /** video export: the frame's time in seconds (live canvases read it instead of the wall clock) */
    __cardTime?: number;
  }
}

interface Props {
  templateId: string;
  data: InviteData;
  cardId?: string;
  guest?: string;
  mode?: CardMode;
  /** skip the envelope (editor preview) */
  flat?: boolean;
  index?: number;
  onIndexChange?: (i: number) => void;
}

export default function InviteViewer({ templateId, data, cardId, guest, mode = "live", flat = false, index: indexProp, onIndexChange }: Props) {
  const t = getTemplate(templateId)!;
  const p = getPalette(t, data.palette);
  const specs = useMemo(() => buildPages(t, data), [t, data]);
  const scene = flat ? FLAT_SCENE : INTRO_SCENE;
  const render = mode === "render";
  const intro = INTROS[t.wed?.intro ?? "envelope"];

  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bookRef = useRef<BookHandle>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const burstAt = useRef<number | null>(null);
  const phaseRef = useRef<string>(flat ? "open" : "closed");

  const [scale, setScale] = useState(0.5);
  const [phase, setPhase] = useState<"closed" | "opening" | "open">(flat ? "open" : "closed");
  const [idx, setIdx] = useState(indexProp ?? 0);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const music = useMusic(render || flat ? "none" : data.music, data.musicUrl);
  const petals = useMemo(() => makePetals(render ? 46 : 38, 7), [render]);
  const petalsOn = data.effects.petals && !flat;

  useEffect(() => {
    if (indexProp !== undefined) setIdx(indexProp);
  }, [indexProp]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const handleIndex = useCallback(
    (i: number) => {
      setIdx(i);
      onIndexChange?.(i);
    },
    [onIndexChange],
  );

  /* ---------- fit scene to stage ---------- */
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      const reserve = mode === "live" && !flat ? 76 : 0;
      setScale(Math.min(r.width / scene.w, (r.height - reserve) / scene.h));
      const c = canvasRef.current;
      if (c) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        c.width = r.width * dpr;
        c.height = r.height * dpr;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scene.w, scene.h, mode, flat]);

  /* ---------- intro timeline (envelope, doors, scroll…) ---------- */
  useLayoutEffect(() => {
    if (flat || !sceneRef.current || !holderRef.current) return;
    const q = gsap.utils.selector(sceneRef.current);
    const tl = intro.build(q, holderRef.current, scene);
    tl.to(q(".tap-hint"), { opacity: 0, duration: 0.3 }, 0);
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, [flat, scene, intro]);

  const openEnvelope = useCallback(() => {
    if (phase !== "closed" || !tlRef.current) return;
    setPhase("opening");
    music.start();
    // iOS needs a gesture to allow tilt-driven lighting
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    DOE?.requestPermission?.().catch(() => {});
    const tl = tlRef.current;
    tl.eventCallback("onComplete", () => setPhase("open"));
    tl.call(() => (burstAt.current = performance.now()), [], intro.burst);
    tl.play(0);
  }, [phase, music, intro]);

  /* ---------- petals (live) ---------- */
  useEffect(() => {
    if (render || !petalsOn) return;
    let raf = 0;
    const loop = () => {
      const c = canvasRef.current;
      if (c && burstAt.current !== null) {
        const ctx = c.getContext("2d")!;
        drawPetals(ctx, c.width, c.height, (performance.now() - burstAt.current) / 1000, petals, t.petals, c.width / 600);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [render, petalsOn, petals, t.petals]);

  /* ---------- light & tilt (live) ---------- */
  useEffect(() => {
    if (render) return;
    const stage = stageRef.current;
    if (!stage) return;
    let tx = 0.3,
      ty = 0.25,
      lx = 0.3,
      ly = 0.25,
      last = 0,
      raf = 0,
      setX = -1,
      setY = -1;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      last = performance.now();
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = 0.5 + Math.max(-1, Math.min(1, e.gamma / 35)) * 0.45;
      ty = 0.5 + Math.max(-1, Math.min(1, (e.beta - 45) / 35)) * 0.45;
      last = performance.now();
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      // keep the GPU free for the envelope choreography
      if (phaseRef.current === "opening") return;
      if (now - last > 3000) {
        // idle: let the light drift slowly so foil keeps glinting
        tx = 0.35 + Math.sin(now / 2600) * 0.25;
        ty = 0.3 + Math.cos(now / 3400) * 0.12;
      }
      lx += (tx - lx) * 0.06;
      ly += (ty - ly) * 0.06;
      // skip sub-perceptual changes: every write repaints the foil
      if (Math.abs(lx - setX) < 0.003 && Math.abs(ly - setY) < 0.003) return;
      setX = lx;
      setY = ly;
      stage.style.setProperty("--lx", lx.toFixed(3));
      stage.style.setProperty("--ly", ly.toFixed(3));
      if (tiltRef.current && !flat) tiltRef.current.style.transform = `rotateY(${((lx - 0.5) * 7).toFixed(2)}deg) rotateX(${((0.5 - ly) * 5).toFixed(2)}deg)`;
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [render, flat]);

  /* ---------- deterministic seek for video export ---------- */
  useEffect(() => {
    if (!render) return;
    const n = specs.length;
    const seek = (time: number) => {
      window.__cardTime = time;
      tlRef.current?.seek(Math.min(time, tlRef.current.duration()), false);
      for (let k = 0; k < n - 1; k++) {
        const s = intro.end + HOLD_COVER + k * (FLIP + HOLD);
        bookRef.current?.setProgress(k, ease(Math.max(0, Math.min(1, (time - s) / FLIP))));
      }
      const stage = stageRef.current!;
      const lx = 0.32 + Math.sin(time * 0.55) * 0.24;
      const ly = 0.28 + Math.cos(time * 0.4) * 0.1;
      stage.style.setProperty("--lx", lx.toFixed(3));
      stage.style.setProperty("--ly", ly.toFixed(3));
      if (tiltRef.current) tiltRef.current.style.transform = `rotateY(${((lx - 0.5) * 6).toFixed(2)}deg) rotateX(${((0.5 - ly) * 4).toFixed(2)}deg)`;
      const c = canvasRef.current;
      if (c && petalsOn) drawPetals(c.getContext("2d")!, c.width, c.height, time - intro.burst, petals, t.petals, c.width / 600);
    };
    const api = { duration: videoDuration(n, intro.end), seek, ready: false };
    window.__card = api;
    const urls = [data.photo, data.symbolImage, data.symbol === "ganesha" ? "/art/ganesha-mangalmurti.jpg" : data.symbol === "ganesha-riddhi" ? "/art/ganesha-riddhi-siddhi.jpg" : undefined].filter(Boolean) as string[];
    Promise.all([
      document.fonts.ready,
      ...urls.map(
        (u) =>
          new Promise<void>((res) => {
            const im = new Image();
            im.onload = im.onerror = () => res();
            im.src = u;
          }),
      ),
    ]).then(() => {
      seek(0);
      api.ready = true;
    });
  }, [render, specs.length, petals, petalsOn, t.petals, data, intro]);

  /* ---------- each page's content arrives in the design's own way ---------- */
  const reveal = t.wed?.reveal;
  const seen = useRef(-1);
  useEffect(() => {
    if (mode !== "live" || flat || phase !== "open" || !reveal) return;
    if (seen.current === idx) return;
    const first = seen.current < 0;
    seen.current = idx;
    if (first) return; // the intro has just revealed the cover
    const leaf = stageRef.current?.querySelectorAll(".leaf")[idx];
    const items = leaf?.querySelectorAll(".leaf-front .page-content > *");
    if (!items?.length) return;
    // wait for the turn to finish, then bring the content in
    const v = REVEALS[reveal];
    const clear = "opacity,transform,transformOrigin,filter,letterSpacing,clipPath";
    // a clip has no "from nothing" value, so sweep is tweened explicitly
    const tw = v.clipPath ? gsap.fromTo(items, { clipPath: v.clipPath, ...(v.filter ? { filter: v.filter } : {}) }, { clipPath: "inset(-10% 0% -10% 0%)", ...(v.filter ? { filter: "brightness(1)" } : {}), duration: v.duration, stagger: v.stagger, ease: v.ease, delay: 0.2, clearProps: clear }) : gsap.from(items, { ...v, delay: 0.2, clearProps: clear });
    return () => {
      tw.progress(1).kill();
    };
  }, [idx, phase, mode, flat, reveal]);

  /* ---------- actions ---------- */
  const title = inviteTitle(data);
  const share = async () => {
    const url = window.location.href;
    const text = `${data.eyebrow}: ${title}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank");
  };
  const saveDate = () => {
    if (data.events.length === 1) {
      window.open(googleCalendarUrl(data.events[0], title), "_blank");
      return;
    }
    const blob = new Blob([buildIcs(data, title)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/\s+/g, "-")}.ics`;
    a.click();
    setToast("Calendar file downloaded — open it to add all events");
    setTimeout(() => setToast(null), 3200);
  };

  const pages = specs.map((s, i) => <InvitePage key={s.key} spec={s} d={data} t={t} p={p} index={i} />);

  return (
    <CardEnvProvider value={{ mode, guest, onRsvp: () => setRsvpOpen(true), now: render ? Date.now() : undefined }}>
      <div
        ref={stageRef}
        className={`stage backdrop-${t.backdrop} mode-${mode} ${flat ? "flat" : ""} phase-${phase}`}
        style={themeVars(t, p)}
        onClick={phase === "closed" && !render ? openEnvelope : undefined}
      >
        <div className="backdrop-surface" />
        <div className="backdrop-light" />
        <div ref={sceneRef} className="scene" style={{ width: scene.w, height: scene.h, transform: `translate(-50%, -50%) scale(${scale})`, top: mode === "live" && !flat ? `calc(50% - 38px)` : "50%" }}>
          {!flat && phase !== "open" && intro.Under?.({ p, data, guest, title })}
          <div ref={holderRef} className="book-holder" style={{ left: scene.bx, top: scene.by }}>
            <div ref={tiltRef} className="tilt">
              <div className="card-shadow" />
              <Book ref={bookRef} pages={pages} back={<LeafBack t={t} p={p} />} index={idx} onIndexChange={handleIndex} interactive={!render && phase === "open"} scale={scale} turn={t.wed?.turn} />
            </div>
          </div>
          {!flat && phase !== "open" && (
            <>
              {intro.Over({ p, data, guest, title })}
              {!render && (
                <div className="tap-hint" style={{ left: intro.hint.x, top: intro.hint.y }}>
                  <span className="tap-ring" />
                  <span className="tap-label">Tap to open</span>
                </div>
              )}
            </>
          )}
        </div>
        {petalsOn && <canvas ref={canvasRef} className="petal-canvas" />}

        {mode === "live" && !flat && phase === "open" && (
          <div className="viewer-bar" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => bookRef.current?.prev()} disabled={idx === 0} aria-label="Previous page">
              <Icon name="prev" />
            </button>
            <div className="dots" aria-label={`Page ${idx + 1} of ${specs.length}`}>
              {specs.map((s, i) => (
                <button key={s.key} className={i === idx ? "dot on" : "dot"} onClick={() => bookRef.current?.goTo(i)} aria-label={s.label} />
              ))}
            </div>
            <button onClick={() => bookRef.current?.next()} disabled={idx === specs.length - 1} aria-label="Next page">
              <Icon name="next" />
            </button>
            <span className="bar-sep" />
            {music.available && (
              <button onClick={music.toggle} aria-label={music.playing ? "Mute music" : "Play music"} className={music.playing ? "on" : ""}>
                <Icon name={music.playing ? "music" : "mute"} />
              </button>
            )}
            {data.events.length > 0 && (
              <button onClick={saveDate} aria-label="Save the date">
                <Icon name="calendar" />
              </button>
            )}
            {data.rsvp.enabled && (
              <button className="bar-rsvp" onClick={() => setRsvpOpen(true)}>
                RSVP
              </button>
            )}
            <button onClick={share} aria-label="Share">
              <Icon name="share" />
            </button>
          </div>
        )}
        {toast && <div className="toast">{toast}</div>}
        <RsvpSheet open={rsvpOpen} onClose={() => setRsvpOpen(false)} data={data} cardId={cardId} guest={guest} />
      </div>
    </CardEnvProvider>
  );
}
