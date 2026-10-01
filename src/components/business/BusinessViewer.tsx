"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { BizSpec, BusinessData } from "@/lib/types";
import { getPalette, getTemplate } from "@/lib/templates";
import { CardEnvProvider, type CardMode } from "@/components/card/CardEnv";
import { themeVars } from "@/components/card/theme";
import { Icon } from "@/components/viewer/icons";
import DownloadButton from "@/components/DownloadButton";
import { bizSpec, BusinessFace, vcard, withBrand } from "./BusinessFaces";
import { bizShape, BIZ_SIZES } from "@/lib/bizShape";
import { addEnter, addFlip, type MotionRefs, prepareFlip } from "./motion";

export const BUSINESS_VIDEO_DURATION = 10;

function edgeBackground(spec: BizSpec) {
  switch (spec.edge) {
    case "foil":
      return "var(--foil-grad)";
    case "metal":
      return "linear-gradient(90deg, var(--paper2), var(--paper) 40%, #fff 50%, var(--paper) 60%, var(--paper2))";
    case "wood":
      return "linear-gradient(90deg, var(--paper2), color-mix(in srgb, var(--paper) 80%, #000))";
    case "glass":
      return "rgba(255, 255, 255, 0.5)";
    default:
      return spec.edge;
  }
}

/** Stacked slices between the two faces: the card's visible thickness when it turns. */
function Edge({ spec }: { spec: BizSpec }) {
  const n = Math.max(2, Math.round(spec.thick)) + 1;
  const bg = edgeBackground(spec);
  const half = spec.thick / 2 - 0.4; // stop short of the faces so they never z-fight
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="biz-slice" style={{ background: bg, transform: `translateZ(${(-half + (2 * half * i) / (n - 1)).toFixed(2)}px)` }} />
      ))}
    </>
  );
}

export default function BusinessViewer({ templateId, data, cardId, mode = "live", flat = false }: { templateId: string; data: BusinessData; cardId?: string; mode?: CardMode; flat?: boolean }) {
  const t = getTemplate(templateId)!;
  const p = withBrand(getPalette(t, data.palette), data);
  const spec = bizSpec(t);
  const shape = bizShape(t);
  const { w: W, h: H } = BIZ_SIZES[shape];
  const render = mode === "render";
  const stageRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [flipped, setFlipped] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const flipTl = useRef<gsap.core.Timeline | null>(null);

  const refs = (): MotionRefs => ({ root: rootRef.current!, card: cardRef.current!, flip: flipRef.current!, w: W });

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min((r.width - 32) / W, (r.height - 32) / H, 1.1));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, H]);

  // Each design arrives in its own way; in render mode the whole 10 s film is one timeline.
  useLayoutEffect(() => {
    const r = refs();
    flipTl.current?.kill();
    gsap.set([r.flip, r.card], { clearProps: "transform" });
    gsap.set(r.root, { attr: { "data-glitch": "0" } });
    setFlipped(false);
    prepareFlip(spec, r);
    if (flat) return;
    const tl = gsap.timeline({ paused: true });
    const undo = addEnter(tl, spec.enter, r);
    if (render) {
      addFlip(tl, spec.flip, r, true, 3.8);
      addFlip(tl, spec.flip, r, false, 7.2);
      tl.to({}, { duration: 0.01 }, BUSINESS_VIDEO_DURATION - 0.01);
    }
    tlRef.current = tl;
    if (!render) tl.play();
    return () => {
      tl.kill();
      undo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, flat, templateId]);

  // the neon sign buzzes now and then
  useEffect(() => {
    if (render || flat || spec.design !== "neon") return;
    let id = 0;
    const buzz = () => {
      id = window.setTimeout(
        () => {
          const root = rootRef.current;
          if (root && !tlRef.current?.isActive())
            gsap.to(root, { keyframes: [{ "--neon": 0.25, duration: 0.05 }, { "--neon": 1, duration: 0.05 }, { "--neon": 0.5, duration: 0.07 }, { "--neon": 1, duration: 0.1 }] });
          buzz();
        },
        3500 + Math.random() * 5000,
      );
    };
    buzz();
    return () => clearTimeout(id);
  }, [render, flat, spec.design]);

  const flip = () => {
    if (render) return;
    const next = !flipped;
    setFlipped(next);
    flipTl.current?.progress(1).kill();
    const tl = gsap.timeline();
    addFlip(tl, spec.flip, refs(), next, 0);
    flipTl.current = tl;
  };

  // light follows pointer / tilt
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (render) {
      window.__card = {
        duration: BUSINESS_VIDEO_DURATION,
        ready: false,
        seek: (time: number) => {
          tlRef.current?.seek(time, true);
          stage.style.setProperty("--lx", (0.35 + Math.sin(time * 0.6) * 0.3).toFixed(3));
          stage.style.setProperty("--ly", (0.3 + Math.cos(time * 0.5) * 0.1).toFixed(3));
        },
      };
      document.fonts.ready.then(() => {
        window.__card!.seek(0);
        window.__card!.ready = true;
      });
      return;
    }
    let raf = 0;
    let tx = 0.3,
      ty = 0.3,
      lx = 0.3,
      ly = 0.3,
      last = 0;
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
      if (now - last > 3000) {
        tx = 0.35 + Math.sin(now / 2600) * 0.28;
        ty = 0.3 + Math.cos(now / 3400) * 0.12;
      }
      const nx = lx + (tx - lx) * 0.07;
      const ny = ly + (ty - ly) * 0.07;
      if (Math.abs(nx - lx) < 0.002 && Math.abs(ny - ly) < 0.002) return;
      lx = nx;
      ly = ny;
      stage.style.setProperty("--lx", lx.toFixed(3));
      stage.style.setProperty("--ly", ly.toFixed(3));
      if (tiltRef.current && !flat) tiltRef.current.style.transform = `rotateY(${((lx - 0.5) * 10).toFixed(2)}deg) rotateX(${((0.5 - ly) * 8).toFixed(2)}deg)`;
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

  const tel = data.phone.replace(/[^\d+]/g, "");
  const wa = data.whatsapp.replace(/[^\d]/g, "");
  const site = data.website ? (data.website.startsWith("http") ? data.website : `https://${data.website}`) : "";
  const saveContact = () => {
    const blob = new Blob([vcard(data)], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.name.replace(/\s+/g, "-")}.vcf`;
    a.click();
  };
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${data.name} · ${data.company}`, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${data.name} · ${data.company}\n${url}`)}`, "_blank");
  };

  const axis = spec.flip === "vertical" ? "axis-x" : "axis-y";

  return (
    <CardEnvProvider value={{ mode }}>
      <div ref={stageRef} className={`stage biz-stage bzs-${spec.design} bzshape-${shape} backdrop-${t.backdrop} mode-${mode} ${flat ? "flat" : ""}`} style={themeVars(t, p)}>
        <div className="backdrop-surface" />
        <div className="backdrop-light" />
        <div ref={areaRef} className="biz-area">
          <div className="biz-scaler" style={{ width: W * scale, height: H * scale }}>
            <div
              ref={rootRef}
              className={`biz-card ${axis}`}
              style={{ width: W, height: H, transform: `scale(${scale})`, ["--thick" as string]: `${spec.thick}px`, ["--r" as string]: `${spec.radius}px` }}
              onClick={flip}
            >
              <div ref={cardRef} className="biz-tilt">
                <div ref={tiltRef} className="biz-flip-tilt">
                  <div className="biz-shadow" />
                  <div ref={flipRef} className="biz-flip">
                    <Edge spec={spec} />
                    <div className="biz-side biz-side-front">
                      <BusinessFace side="front" d={data} t={t} p={p} />
                    </div>
                    <div className="biz-side biz-side-back">
                      <BusinessFace side="back" d={data} t={t} p={p} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!render && !flat && <div className="biz-hint">Tap the card to flip</div>}
        </div>
        {!render && !flat && (
          <div className="biz-actions">
            <div className="biz-act-row">
              <button className="biz-act primary" onClick={saveContact}>
                <Icon name="contact" /> Save contact
              </button>
              {cardId && <DownloadButton kind="business" card={cardId} variant="act" />}
            </div>
            <div className="biz-act-grid">
              {tel && (
                <a className="biz-act" href={`tel:${tel}`}>
                  <Icon name="phone" /> Call
                </a>
              )}
              {wa && (
                <a className="biz-act" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" /> WhatsApp
                </a>
              )}
              {data.email && (
                <a className="biz-act" href={`mailto:${data.email}`}>
                  <Icon name="mail" /> Email
                </a>
              )}
              {site && (
                <a className="biz-act" href={site} target="_blank" rel="noreferrer">
                  <Icon name="web" /> Website
                </a>
              )}
              {data.address && (
                <a className="biz-act" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`} target="_blank" rel="noreferrer">
                  <Icon name="map" /> Directions
                </a>
              )}
              <button className="biz-act" onClick={share}>
                <Icon name="share" /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </CardEnvProvider>
  );
}
