"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { PostBrand } from "@/lib/posts";
import { Fit } from "@/components/gujarati/Fit";

export { Fit };

/** Deterministic random numbers, so the server and the browser draw the same art. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Round for SVG output (keeps server and client markup identical). */
export const r2 = (n: number) => Math.round(n * 100) / 100;

const ICONS = {
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z",
  pin: "M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z",
  insta: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.3-3.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z",
  web: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-2.3 2.4A8 8 0 0 0 4.1 11h3.4c.1-2.4.9-4.8 2.2-6.6zm4.6 0c1.3 1.8 2.1 4.2 2.2 6.6h3.4a8 8 0 0 0-5.6-6.6zM12 4.3c-1.3 1.6-2.3 4-2.5 6.7h5c-.2-2.7-1.2-5.1-2.5-6.7zM4.1 13a8 8 0 0 0 5.6 6.6c-1.3-1.8-2.1-4.2-2.2-6.6H4.1zm5.4 0c.2 2.7 1.2 5.1 2.5 6.7 1.3-1.6 2.3-4 2.5-6.7h-5zm7 0c-.1 2.4-.9 4.8-2.2 6.6a8 8 0 0 0 5.6-6.6h-3.4z",
};
export type IconName = keyof typeof ICONS;
export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg className="pc-ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d={ICONS[name]} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** First letter of the business name, for a monogram when there is no logo. */
export const initialOf = (s: string) => (s.trim().replace(/^(shree|shri|sri|the)\s+/i, "")[0] ?? "").toUpperCase();

/**
 * Business name: stays on one line, shrinking to ~70% of `max`; only longer names wrap onto a
 * second line (then shrink further, down to `min`).
 */
export function FitName({ text, max, min, className }: { text: string; max: number; min: number; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let s = max;
      el.style.whiteSpace = "nowrap";
      el.style.fontSize = `${s}px`;
      while (s > max * 0.7 && el.scrollWidth > el.clientWidth + 1) el.style.fontSize = `${(s -= 1)}px`;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      el.style.whiteSpace = "normal";
      s = Math.round(max * 0.82);
      el.style.fontSize = `${s}px`;
      while (s > min && el.scrollHeight > el.clientHeight + s * 0.3) el.style.fontSize = `${(s -= 1)}px`;
    };
    fit();
    let live = true;
    document.fonts?.ready.then(() => live && fit());
    return () => {
      live = false;
    };
  }, [text, max, min]);
  return (
    <h2 ref={ref} className={`fit ${className ?? ""}`} style={{ fontSize: max }}>
      {text}
    </h2>
  );
}

/**
 * Scales its content down (uniformly, from the centre) when it is taller than its box.
 * The festival text has several fitted lines; this keeps the whole stack inside the art's text area.
 */
export function Squeeze({ children, className, style, deps }: { children: ReactNode; className?: string; style?: CSSProperties; deps: unknown[] }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    const fit = () => {
      const cs = getComputedStyle(b);
      const room = b.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const k = Math.min(1, room / Math.max(1, i.offsetHeight));
      i.style.transform = k < 1 ? `scale(${k})` : "";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(i);
    let live = true;
    document.fonts?.ready.then(() => live && fit());
    return () => {
      live = false;
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return (
    <div ref={box} className={`pc-squeeze ${className ?? ""}`} style={style}>
      <div ref={inner} className="pc-squeeze-in">
        {children}
      </div>
    </div>
  );
}

/**
 * The business block: logo | name, owner, services | phone numbers, then a footer line with address,
 * social handle and website. Same markup in every template and shape (all shapes are 1080 wide);
 * templates restyle it with CSS. Empty fields leave no gaps; if everything together is still too tall
 * for the template's box, the whole block scales down a little.
 */
export function Brand({ b, className, style }: { b: PostBrand; className?: string; style?: CSSProperties }) {
  const phones = (b.phones ?? []).filter(Boolean);
  const foot: [IconName, string, string][] = [];
  if (b.address) foot.push(["pin", b.address, "pc-addr"]);
  if (b.social) foot.push(["insta", b.social, "pc-social"]);
  if (b.website) foot.push(["web", b.website, "pc-web"]);
  // only a name and a number: let them be big rather than float in an empty band
  const sparse = !b.owner && !b.services && foot.length === 0;
  const k = sparse ? 1.3 : 1;
  return (
    <Squeeze className={`pc-brand ${sparse ? "is-sparse" : ""} ${b.offer ? "has-offer" : ""} ${className ?? ""}`} style={style} deps={[JSON.stringify(b)]}>
      <div className="pc-main">
        <span className={`pc-logo ${b.logo ? "has-logo" : ""}`}>{b.logo ? <img src={b.logo} alt="" /> : <b>{initialOf(b.business)}</b>}</span>
        <div className="pc-who">
          <FitName className="pc-biz" text={b.business} max={Math.round(58 * k)} min={26} />
          {b.owner && <Fit className="pc-owner" text={b.owner} max={25} min={18} />}
          {b.services && <Fit className="pc-services" text={b.services} max={24} min={17} />}
        </div>
        {phones.length > 0 && (
          <div className="pc-phones">
            {phones.map((p, i) => (
              <div key={i} className="pc-phone">
                <Icon name="phone" size={28} />
                <Fit text={p} max={Math.round(36 * k)} min={22} />
              </div>
            ))}
          </div>
        )}
      </div>
      {foot.length > 0 && (
        <div className="pc-foot">
          {foot.map(([ic, text, cls]) => (
            <span key={cls} className={cls}>
              <Icon name={ic} size={22} />
              <span>{text}</span>
            </span>
          ))}
        </div>
      )}
    </Squeeze>
  );
}

/** Optional sale/offer ribbon. */
export function Offer({ text, className, style }: { text?: string; className?: string; style?: CSSProperties }) {
  if (!text) return null;
  return (
    <div className={`pc-offer ${className ?? ""}`} style={style}>
      <Fit text={text} max={30} min={16} />
    </div>
  );
}

/**
 * Heading with a two-voice treatment: "Happy Diwali" → script "Happy" over display "Diwali".
 * The last word is the festival word; everything before it is the script line. One word → display only.
 */
export function splitHeading(h: string): [string, string] {
  const w = h.trim().split(/\s+/);
  if (w.length < 2) return ["", h.trim()];
  return [w.slice(0, -1).join(" "), w[w.length - 1]];
}
