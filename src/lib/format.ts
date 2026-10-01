import type { EventItem, InviteData } from "./types";

function toDate(date: string, time = "00:00") {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
}

export function parseLocal(dt: string) {
  const [date, time] = dt.split("T");
  return toDate(date, time);
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function fmtLongDate(date: string) {
  if (!date) return "";
  const d = toDate(date);
  const wd = d.toLocaleDateString("en-IN", { weekday: "long" });
  const mo = d.toLocaleDateString("en-IN", { month: "long" });
  return `${wd}, ${ordinal(d.getDate())} ${mo} ${d.getFullYear()}`;
}

export function fmtShortDate(date: string) {
  if (!date) return "";
  const d = toDate(date);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function dateParts(date: string) {
  const d = toDate(date);
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-IN", { month: "long" }),
    year: String(d.getFullYear()),
  };
}

export function fmtTime(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function initials(a?: string, b?: string) {
  const f = (s?: string) => (s ?? "").trim().charAt(0).toUpperCase();
  return [f(a), f(b)].filter(Boolean).join("");
}

export function mapsUrl(e: Pick<EventItem, "venue" | "address">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.venue}, ${e.address}`)}`;
}

export function mapsEmbedUrl(e: Pick<EventItem, "venue" | "address">) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${e.venue}, ${e.address}`)}&z=15&output=embed`;
}

function icsStamp(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

export function googleCalendarUrl(e: EventItem, title: string) {
  const start = toDate(e.date, e.time);
  const end = new Date(start.getTime() + 3 * 3600 * 1000);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.name} · ${title}`,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    location: `${e.venue}, ${e.address}`,
    details: e.note ?? "",
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function buildIcs(data: InviteData, title: string) {
  const esc = (s: string) => s.replace(/[,;\\]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Shubh Cards//EN", "CALSCALE:GREGORIAN"];
  for (const e of data.events) {
    const start = toDate(e.date, e.time);
    const end = new Date(start.getTime() + 3 * 3600 * 1000);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}-${icsStamp(start)}@shubhcards`,
      `DTSTAMP:${icsStamp(new Date())}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${esc(`${e.name} · ${title}`)}`,
      `LOCATION:${esc(`${e.venue}, ${e.address}`)}`,
      e.note ? `DESCRIPTION:${esc(e.note)}` : "",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

export function inviteTitle(d: InviteData) {
  return d.secondary?.name ? `${d.primary.name} ${d.joiner || "&"} ${d.secondary.name}` : d.primary.name;
}

export function countdownParts(target: Date, now: Date) {
  let s = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes * 60;
  return { days, hours, minutes, seconds };
}

/** Deterministic PRNG so ornaments and petals render identically everywhere (incl. video frames). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

/**
 * Trig rounded to 1e-9. Node and the browser can disagree in the last ulp of
 * Math.cos/sin, which would cause SSR hydration mismatches in SVG coordinates.
 */
const R9 = (n: number) => Math.round(n * 1e9) / 1e9;
export const cos = (a: number) => R9(Math.cos(a));
export const sin = (a: number) => R9(Math.sin(a));
export const atan2 = (y: number, x: number) => R9(Math.atan2(y, x));
