"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type { Template } from "@/lib/types";
import { getPalette } from "@/lib/templates";
import { CardEnvProvider } from "@/components/card/CardEnv";
import { buildPages, InvitePage } from "@/components/card/InvitePages";
import { BusinessFace } from "@/components/business/BusinessFaces";
import { themeVars } from "@/components/card/theme";
import { bizSize } from "@/lib/bizShape";

/** Static cover render of a template, scaled to its container. Business cards turn over on hover. */
export default function Thumb({ t }: { t: Template }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.4);
  const [seen, setSeen] = useState(false);
  const d = t.sample;
  const p = getPalette(t, d.palette);
  const { w, h } = d.kind === "invite" ? { w: 500, h: 700 } : bizSize(t);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setK(Math.min((r.width * (d.kind === "invite" ? 0.78 : 0.84)) / w, (r.height * 0.84) / h));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // only build the (heavy, SVG-filtered) card once it scrolls near the viewport
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setSeen(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [w, h, d.kind]);
  return (
    <CardEnvProvider value={{ mode: "thumb", now: 0 }}>
      <div ref={ref} className={`tcard-thumb stage backdrop-${t.backdrop} ${d.kind === "business" ? `bzs-${t.biz?.design ?? "noir"}` : ""}`} style={themeVars(t, p)}>
        <div className="backdrop-surface" />
        <div className="backdrop-light" />
        {!seen ? null : d.kind === "invite" ? (
          <div className="thumb-scale" style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${k})` }}>
            <InvitePage spec={buildPages(t, d)[0]} d={d} t={t} p={p} index={0} />
          </div>
        ) : (
          <div className="thumb-scale biz" style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${k})`, ["--r" as string]: `${t.biz?.radius ?? 10}px` }}>
            <div className="thumb-flip">
              <div className="thumb-side">
                <BusinessFace side="front" d={d} t={t} p={p} />
              </div>
              <div className="thumb-side back">
                <BusinessFace side="back" d={d} t={t} p={p} />
              </div>
            </div>
          </div>
        )}
      </div>
    </CardEnvProvider>
  );
}
