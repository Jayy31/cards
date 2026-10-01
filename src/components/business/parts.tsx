"use client";
import React, { useId, useMemo } from "react";
import QRCode from "qrcode";
import type { BusinessData, Palette, Template } from "@/lib/types";
import { rng } from "@/lib/format";

export interface FaceProps {
  d: BusinessData;
  t: Template;
  p: Palette;
  /** canvas size in card units (700×400, 400×700 or 520×520) */
  w: number;
  h: number;
}

/** MECARD payload: scanning the QR with any phone camera offers "Add contact". */
export function mecard(d: BusinessData) {
  const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
  const parts = [
    `N:${esc(d.name)}`,
    d.company && `ORG:${esc(d.company)}`,
    d.phone && `TEL:${d.phone.replace(/\s/g, "")}`,
    d.email && `EMAIL:${esc(d.email)}`,
    d.website && `URL:${esc(d.website.startsWith("http") ? d.website : `https://${d.website}`)}`,
    d.address && `ADR:${esc(d.address)}`,
  ].filter(Boolean);
  return `MECARD:${parts.join(";")};;`;
}

export function vcard(d: BusinessData) {
  const [first, ...rest] = d.name.split(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${d.name}`,
    d.company && `ORG:${d.company}`,
    d.title && `TITLE:${d.title}`,
    d.phone && `TEL;TYPE=CELL:${d.phone.replace(/\s/g, "")}`,
    d.email && `EMAIL;TYPE=INTERNET:${d.email}`,
    d.website && `URL:${d.website.startsWith("http") ? d.website : `https://${d.website}`}`,
    d.address && `ADR;TYPE=WORK:;;${d.address};;;;`,
    d.socials.instagram && `X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${d.socials.instagram}`,
    d.socials.linkedin && `X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/${d.socials.linkedin}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function Qr({ d, color, className = "biz-qr" }: { d: BusinessData; color: string; className?: string }) {
  const text = mecard(d);
  const { size, path } = useMemo(() => {
    const q = QRCode.create(text, { errorCorrectionLevel: "M" });
    const n = q.modules.size;
    let s = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.data[y * n + x]) s += `M${x},${y}h1v1h-1z`;
    return { size: n, path: s };
  }, [text]);
  return (
    <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} className={className} shapeRendering="crispEdges">
      <path d={path} fill={color} />
    </svg>
  );
}

export type ContactKind = "phone" | "mail" | "web" | "pin";
export type SocialKind = "instagram" | "linkedin" | "facebook" | "youtube" | "x";

const ICONS: Record<ContactKind | SocialKind, string> = {
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3z M3 6l9 7 9-7",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18",
  pin: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  instagram: "M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M17 7h.01",
  linkedin: "M4 4h16v16H4z M8 10v6 M8 7.5v.01 M12 16v-6 M12 12.5a2.5 2.5 0 0 1 5 0V16",
  facebook: "M14 21v-8h3l.5-3H14V8.5c0-1 .4-1.5 1.5-1.5H17.5V4.2A20 20 0 0 0 15 4c-2.6 0-4 1.5-4 4.2V10H8v3h3v8",
  youtube: "M3 8.5A3.5 3.5 0 0 1 6.5 5h11A3.5 3.5 0 0 1 21 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 15.5z M10 9l5 3-5 3z",
  x: "M4 4l16 16 M20 4L4 20",
};

export const ContactIcon = ({ kind, className = "biz-icon" }: { kind: ContactKind | SocialKind; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[kind]} />
  </svg>
);

/** The contact lines a card shows, in print order. */
export function contactRows(d: BusinessData): { kind: ContactKind; label: string; value: string }[] {
  const phone = [d.phone, d.phone2].filter(Boolean).join("  /  ");
  return [
    phone && { kind: "phone" as const, label: "T", value: phone },
    d.email && { kind: "mail" as const, label: "E", value: d.email },
    d.website && { kind: "web" as const, label: "W", value: d.website.replace(/^https?:\/\//, "") },
    d.address && { kind: "pin" as const, label: "A", value: d.address },
  ].filter(Boolean) as { kind: ContactKind; label: string; value: string }[];
}

export function socialRows(d: BusinessData): { kind: SocialKind; value: string }[] {
  const s = d.socials ?? {};
  return (["instagram", "linkedin", "facebook", "youtube", "x"] as SocialKind[]).filter((k) => s[k]?.trim()).map((k) => ({ kind: k, value: s[k]!.trim().replace(/^@/, "") }));
}

const extrasOf = (d: BusinessData) => (d.extras ?? []).filter((x) => x.label.trim() || x.value.trim());

/**
 * Contact block used by every design: contacts, extra labelled lines (GSTIN,
 * Reg. No., hours…) and social handles. It tightens itself as lines are added,
 * so a card with everything filled in still fits.
 */
export function Contacts({ d, className = "biz-contacts", icons = true, socials = true, extras = true }: { d: BusinessData; className?: string; icons?: boolean; socials?: boolean; extras?: boolean }) {
  const rows = contactRows(d);
  const xs = extras ? extrasOf(d) : [];
  const soc = socials ? socialRows(d) : [];
  const n = rows.length + xs.length + (soc.length ? 1 : 0);
  return (
    <div className={`${className} ${n > 6 ? "dense xdense" : n > 5 ? "dense" : ""}`}>
      {rows.map((r) => (
        <div key={r.kind}>
          {icons ? <ContactIcon kind={r.kind} /> : <b>{r.label}</b>}
          <span>{r.value}</span>
        </div>
      ))}
      {xs.map((x, i) => (
        <div key={`x${i}`} className="biz-extra">
          {icons ? <i className="biz-xl">{x.label}</i> : <b>{x.label.slice(0, 1).toUpperCase()}</b>}
          <span>
            {!icons && x.label ? `${x.label}: ` : ""}
            {x.value}
          </span>
        </div>
      ))}
      {soc.length > 0 && (
        <div className="biz-soc">
          {soc.map((s) => (
            <span key={s.kind}>
              <ContactIcon kind={s.kind} />
              {s.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** The name in a regional script, when given. */
export function LocalName({ d, className = "biz-local" }: { d: BusinessData; className?: string }) {
  return d.nameLocal?.trim() ? <div className={className}>{d.nameLocal}</div> : null;
}

/** The user's logo if uploaded, otherwise the design's own mark (children). */
export function Brand({ d, className = "", children }: { d: BusinessData; className?: string; children?: React.ReactNode }) {
  if (d.logo) return <div className={`biz-logo-up ${className}`} style={{ backgroundImage: `url(${JSON.stringify(d.logo)})` }} role="img" aria-label={`${d.company} logo`} />;
  return <>{children}</>;
}

/**
 * Optional extras on the front, chosen in the editor: name & designation,
 * a contact line, a small QR. Each design positions `.fm` where it fits.
 */
export function FrontMeta({ d, className = "", qrColor = "#111" }: { d: BusinessData; className?: string; qrColor?: string }) {
  const f = d.front ?? {};
  if (!f.name && !f.contact && !f.qr) return null;
  const line = [d.phone, d.email || d.website].filter(Boolean).join("  ·  ");
  return (
    <div className={`fm ${className}`}>
      {(f.name || f.contact) && (
        <div className="fm-text">
          {f.name && <div className="fm-name">{d.name}</div>}
          {f.name && d.title && <div className="fm-title">{d.title}</div>}
          {f.contact && line && <div className="fm-contact">{line}</div>}
        </div>
      )}
      {f.qr && (
        <div className="fm-qr">
          <Qr d={d} color={qrColor} />
        </div>
      )}
    </div>
  );
}

/** Uploaded photo, or a drawn portrait placeholder in the palette's colours. */
export function Avatar({ d, p, className = "", scene = false }: { d: BusinessData; p: Palette; className?: string; scene?: boolean }) {
  const gid = `av${useId().replace(/:/g, "")}`;
  if (d.photo) return <div className={`biz-photo ${className}`} style={{ backgroundImage: `url(${JSON.stringify(d.photo)})` }} role="img" aria-label={d.name} />;
  if (scene)
    return (
      <div className={`biz-photo ${className}`}>
        <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.7" stopColor="#bbb" />
            </linearGradient>
          </defs>
          <rect width="160" height="100" fill={`url(#${gid})`} />
          <circle cx="112" cy="38" r="14" fill="#fff" />
          <path d="M0,70 L30,48 L52,60 L84,34 L116,58 L140,46 L160,56 V100 H0Z" fill="#8a8a8a" />
          <path d="M0,82 L40,64 L70,76 L104,60 L160,80 V100 H0Z" fill="#555" />
          <path d="M0,92 C40,84 90,96 160,88 V100 H0Z" fill="#2a2a2a" />
          <g fill="#1b1b1b">
            <circle cx="62" cy="67.5" r="2.2" />
            <path d="M60,70 h4 l1.2,9 h-1.6 l-.8,6 h-1.6 l-.8,-6 h-1.6z" />
          </g>
        </svg>
      </div>
    );
  return (
    <div className={`biz-photo ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.accent} stopOpacity={0.35} />
            <stop offset="1" stopColor={p.accent} stopOpacity={0.75} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gid})`} />
        <path d="M18,100 C20,78 34,70 50,70 C66,70 80,78 82,100Z" fill={p.ink} opacity={0.82} />
        <path d="M44,60 h12 v12 c-4,3 -8,3 -12,0z" fill={p.ink} opacity={0.6} />
        <ellipse cx="50" cy="44" rx="15" ry="18" fill={p.ink} opacity={0.7} />
        <path d="M34,42 C33,26 44,22 51,22 C62,22 68,30 66,43 C63,34 56,31 49,32 C42,33 37,36 34,42Z" fill={p.ink} opacity={0.95} />
      </svg>
    </div>
  );
}

/**
 * A well-proportioned back side most designs share: name, local name,
 * designation, contacts and a QR. Designs style it through `.bz-<design> .sb-*`
 * and can add their own decoration around it.
 */
export function StdBack({ d, qrColor = "#111", qrLabel, rule, before, className = "" }: { d: BusinessData; qrColor?: string; qrLabel?: string; rule?: React.ReactNode; before?: React.ReactNode; className?: string }) {
  return (
    <div className={`sb ${className}`}>
      <div className="sb-main">
        {before}
        <div className="sb-name">{d.name}</div>
        <LocalName d={d} className="sb-local" />
        {d.title && <div className="sb-title">{d.title}</div>}
        {rule ?? <div className="sb-rule" />}
        <Contacts d={d} className="sb-contacts" />
      </div>
      <div className="sb-side">
        <div className="sb-qr">
          <Qr d={d} color={qrColor} />
        </div>
        {qrLabel && <span className="sb-qr-label">{qrLabel}</span>}
      </div>
    </div>
  );
}

/** Up to two initials from a company or person name ("Desai & Associates" → "DA"). */
export function monogram(s: string) {
  const words = s
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 || /\p{Lu}/u.test(w));
  const ini = words.map((w) => w[0].toUpperCase());
  return (ini.length > 1 ? ini[0] + ini[ini.length - 1] : ini[0] ?? "") || s.slice(0, 1).toUpperCase();
}

/** Deterministic scatter of points, for glitter, flecks, etc. */
export function scatter(n: number, seed: number, w: number, h: number) {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({ x: r() * w, y: r() * h, s: r(), a: r() }));
}

/** Splits a name onto two balanced lines for display type ("Malhotra Capital" → ["Malhotra", "Capital"]). */
export function twoLines(s: string): [string, string] {
  const w = s.trim().split(/\s+/);
  if (w.length < 2) return [s, ""];
  let best = 1;
  let diff = Infinity;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(" ").length;
    const b = w.slice(i).join(" ").length;
    if (Math.abs(a - b) < diff) {
      diff = Math.abs(a - b);
      best = i;
    }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
}

/** Font size that fits `text` into `width` card units, given an average glyph width ratio. */
export function fitSize(text: string, width: number, max: number, ratio = 0.6, min = 12) {
  const n = Math.max(1, text.length);
  return Math.max(min, Math.min(max, Math.floor(width / (n * ratio))));
}
