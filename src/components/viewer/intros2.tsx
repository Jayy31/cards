"use client";
import React from "react";
import gsap from "gsap";
import type { InviteData } from "@/lib/types";
import { initials } from "@/lib/format";
import { coupleOrder } from "@/lib/wedding";
import { foilFill, isDark } from "@/components/card/theme";
import { Crescent } from "@/components/card/ornaments";
import type { IntroDef } from "./intros";
import { AlponaLotus, BandhaniField, Girih, LacePanel, Mirror, PhulkariBand, Sparkles, StitchStar } from "@/components/wedding/art2";

/* Batch 2 intros. Same contract as intros.tsx: scene 600×900, card at 50,100 (500×700). */

const mono = (d: InviteData) => {
  const [a, b] = coupleOrder(d);
  return initials(a.name, b?.name) || "✦";
};

/* ---------------- alpona painted, then lifted (Alpona) ---------------- */

export const alpona: IntroDef = {
  end: 2.8,
  burst: 1.9,
  hint: { x: 300, y: 610 },
  Over: ({ p, data }) => (
    <div className="in-part ap-wrap" style={{ ["--ground" as string]: isDark(p.paper) ? p.paper : p.accent }}>
      <div className="ap-ground" />
      <div className="ap-lotus">
        <AlponaLotus size={440} color="#fffaf0" width={2.6} />
      </div>
      <div className="ap-title">
        <span className="ap-eyebrow">{data.eyebrow}</span>
        <span className="ap-mono">{mono(data)}</span>
      </div>
    </div>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.9, transformOrigin: "50% 50%" });
    gsap.set(q(".ap-wrap .ap"), { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(q(".ap-wrap .ap-dot"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".ap-title"), { opacity: 0, y: 20, duration: 0.35 }, 0)
      .to(q(".ap-wrap .ap"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.022, ease: "power1.inOut" }, 0.15)
      .to(q(".ap-wrap .ap-dot"), { scale: 1, duration: 0.25, stagger: 0.02, ease: "back.out(3)" }, 0.8)
      .to(q(".ap-wrap"), { scale: 1.3, opacity: 0, duration: 0.75, ease: "power2.in" }, 1.85)
      .to(holder, { scale: 1, duration: 0.9, ease: "power2.out" }, 1.85);
    return tl;
  },
};

/* ---------------- embroidered bundle unfolds (Phulkari) ---------------- */

export const unfold: IntroDef = {
  end: 2.4,
  burst: 1.5,
  hint: { x: 300, y: 560 },
  Over: ({ p }) => {
    const colors = [p.accent, p.accent2, p.wax];
    return (
      <div className="in-part uf-wrap" style={{ ["--cloth" as string]: p.accent2 }}>
        {(["l", "r", "t", "b"] as const).map((k) => (
          <div key={k} className={`uf-flap ${k}`}>
            <div className="uf-band">
              <PhulkariBand width={k === "l" || k === "r" ? 700 : 500} height={46} colors={[p.accent, p.wax, p.paper]} ground={p.paper2} />
            </div>
          </div>
        ))}
        <svg className="uf-seams" viewBox="0 0 500 700" preserveAspectRatio="none">
          <path d="M0,0 L250,350 L500,0 M0,700 L250,350 L500,700" fill="none" stroke={p.wax} strokeWidth={2} strokeDasharray="7 5" />
        </svg>
        <div className="uf-knot">
          <StitchStar size={110} colors={colors} />
          <i className="uf-tassel l" style={{ background: p.accent }} />
          <i className="uf-tassel r" style={{ background: p.accent2 }} />
        </div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.94, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".uf-knot"), { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1 }, 0)
      .to(q(".uf-knot"), { scale: 0, rotate: 90, opacity: 0, duration: 0.35, ease: "back.in(2)" }, 0.3)
      .to(q(".uf-seams"), { opacity: 0, duration: 0.25 }, 0.4)
      .to(q(".uf-flap.t"), { rotateX: 160, duration: 0.8, ease: "power2.inOut" }, 0.5)
      .to(q(".uf-flap.b"), { rotateX: -160, duration: 0.8, ease: "power2.inOut" }, 0.6)
      .to(q(".uf-flap.t, .uf-flap.b"), { opacity: 0, duration: 0.3 }, 1.1)
      .to(q(".uf-flap.l"), { rotateY: -160, duration: 0.8, ease: "power2.inOut" }, 1.0)
      .to(q(".uf-flap.r"), { rotateY: 160, duration: 0.8, ease: "power2.inOut" }, 1.1)
      .to(q(".uf-flap.l, .uf-flap.r"), { opacity: 0, duration: 0.3 }, 1.6)
      .to(holder, { scale: 1, duration: 1.2, ease: "power2.out" }, 1.1);
    return tl;
  },
};

/* ---------------- mirror-work skirt twirls away (Bandhej) ---------------- */

export const twirl: IntroDef = {
  end: 2.3,
  burst: 1.0,
  hint: { x: 300, y: 610 },
  Over: ({ p, data }) => (
    <>
      <div className="in-part tw-disc">
        <div className="tw-spin">
          <div className="tw-ring outer" style={{ background: p.accent }}>
            <BandhaniField width={880} height={880} dot="#fff4d6" dot2={p.accent2} tile={30} />
          </div>
          <div className="tw-ring mid" style={{ background: p.accent2 }} />
          <div className="tw-ring inner" style={{ background: p.paper }}>
            <BandhaniField width={470} height={470} dot="#fff4d6" dot2={p.accent2} tile={24} />
          </div>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="tw-mirror" style={{ transform: `rotate(${i * 18}deg) translateY(-262px)` }}>
              <Mirror size={34} thread={p.accent} />
            </div>
          ))}
        </div>
        <div className="tw-medal" style={{ background: p.paper }}>
          <span>{mono(data)}</span>
        </div>
      </div>
      <div className="in-part tw-sparkle">
        <Sparkles width={600} height={900} n={40} seed={11} />
      </div>
    </>
  ),
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.3, rotate: -200, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(q(".tw-sparkle"), { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".tw-medal"), { scale: 0, duration: 0.3, ease: "back.in(2)" }, 0)
      .to(q(".tw-disc"), { rotate: 540, scale: 1.7, opacity: 0, duration: 1.4, ease: "power2.in" }, 0.15)
      .to(q(".tw-sparkle"), { opacity: 1, duration: 0.3 }, 0.6)
      .to(q(".tw-sparkle"), { opacity: 0, duration: 0.6 }, 1.6)
      .to(holder, { scale: 1, rotate: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.6)
      .set(holder, { clearProps: "opacity" }, 2.2);
    return tl;
  },
};

/* ---------------- lattice screens slide apart (Noor) ---------------- */

export const jaali: IntroDef = {
  end: 2.1,
  burst: 1.0,
  hint: { x: 300, y: 600 },
  Over: ({ p }) => {
    const fill = foilFill(p);
    return (
      <div className="in-part jl-wrap">
        <div className="jl-glow" />
        {(["tl", "tr", "bl", "br"] as const).map((k) => (
          <div key={k} className={`jl-panel ${k}`} style={{ background: p.paper }}>
            <Girih width={272} height={372} stroke={p.inkSoft} tile={46} weight={1.2} />
          </div>
        ))}
        <div className="jl-medal" style={{ background: p.paper }}>
          <Crescent size={70} fill={fill} />
        </div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.94, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    const d = { x: 330, y: 440 };
    tl.to(q(".jl-medal"), { rotate: 45, scale: 0.4, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
      .to(q(".jl-glow"), { opacity: 1, duration: 0.4 }, 0.3)
      .to(q(".jl-panel.tl"), { x: -d.x, y: -d.y, duration: 1.2, ease: "power2.inOut" }, 0.4)
      .to(q(".jl-panel.tr"), { x: d.x, y: -d.y, duration: 1.2, ease: "power2.inOut" }, 0.45)
      .to(q(".jl-panel.bl"), { x: -d.x, y: d.y, duration: 1.2, ease: "power2.inOut" }, 0.5)
      .to(q(".jl-panel.br"), { x: d.x, y: d.y, duration: 1.2, ease: "power2.inOut" }, 0.55)
      .to(q(".jl-glow"), { opacity: 0, duration: 0.5 }, 1.4)
      .to(holder, { scale: 1, duration: 1.3, ease: "power2.out" }, 0.6);
    return tl;
  },
};

/* ---------------- belly band slips, lace gatefold opens (Jaali Lace) ---------------- */

export const gatefold: IntroDef = {
  end: 2.3,
  burst: 1.3,
  hint: { x: 300, y: 620 },
  Over: ({ p, data }) => {
    const fill = foilFill(p);
    return (
      <div className="in-part gf-wrap">
        <div className="gf-panel l">
          <LacePanel width={250} height={700} fill={fill} tile={42} border={16} />
        </div>
        <div className="gf-panel r">
          <LacePanel width={250} height={700} fill={fill} tile={42} border={16} />
        </div>
        <div className="gf-band" style={{ background: p.accent2 }}>
          <div className="gf-tag" style={{ background: p.paper }}>
            <span className="foil-text">{mono(data)}</span>
          </div>
        </div>
      </div>
    );
  },
  build: (q, holder) => {
    gsap.set(holder, { scale: 0.96, transformOrigin: "50% 50%" });
    const tl = gsap.timeline({ paused: true });
    tl.to(q(".gf-band"), { y: 420, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.1)
      .to(q(".gf-panel.l"), { rotateY: -165, duration: 1.1, ease: "power2.inOut" }, 0.6)
      .to(q(".gf-panel.r"), { rotateY: 165, duration: 1.1, ease: "power2.inOut" }, 0.65)
      .to(q(".gf-panel"), { opacity: 0, duration: 0.4 }, 1.7)
      .to(holder, { scale: 1, duration: 1.0, ease: "power2.out" }, 1.0);
    return tl;
  },
};
