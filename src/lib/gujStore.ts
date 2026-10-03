import "server-only";
import { createHmac, randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { DATA_DIR, isSafeId } from "./store";
import { GUJ_MAX_PEOPLE, GUJ_MAX_PHONES, GUJ_MAX_PHONES_EACH, GUJ_TEMPLATES, type GujCardData, type GujPerson, type GujPhoneLabel } from "./gujarati";

/**
 * One Gujarati visiting-card "order": the details applied to each design, and whether the ₹99 unlock is paid.
 * Stored as .data/gujarati/<id>.json, like the rest of the MVP (no database yet).
 */
export interface GujOrder {
  id: string;
  /** details per design id (Apply to all writes the same details to every design) */
  cards: Record<string, GujCardData>;
  paid: boolean;
  paidAt?: string;
  /** payment reference: "mock" until a real gateway is connected */
  payment?: string;
  createdAt: string;
  updatedAt: string;
}

const DIR = path.join(DATA_DIR, "gujarati");
const file = (id: string) => path.join(DIR, `${id}.json`);

export async function getOrder(id: string): Promise<GujOrder | null> {
  if (!isSafeId(id)) return null;
  try {
    return JSON.parse(await fs.readFile(file(id), "utf8"));
  } catch {
    return null;
  }
}

async function write(o: GujOrder) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(file(o.id), JSON.stringify(o, null, 2));
  return o;
}

/** Create (no id / unknown id) or replace the details of an order. Payment state is never taken from the client. */
export async function saveOrder(id: string | undefined, cards: Record<string, GujCardData>) {
  const now = new Date().toISOString();
  const old = id ? await getOrder(id) : null;
  return write(old ? { ...old, cards, updatedAt: now } : { id: nanoid(14), cards, paid: false, createdAt: now, updatedAt: now });
}

export async function markPaid(id: string, payment: string) {
  const o = await getOrder(id);
  if (!o) return null;
  if (o.paid) return o;
  return write({ ...o, paid: true, payment, paidAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}

/* ---------- input checks ---------- */

const LIMITS: Record<Exclude<keyof GujCardData, "logo" | "people">, number> = { business: 80, owner: 80, role: 80, description: 400, phone: 60, email: 100, address: 220 };
// only our own uploads: headless Chrome loads the logo, so never let it fetch an arbitrary URL
const LOGO = /^\/api\/uploads\/[A-Za-z0-9_-]+\.(png|jpg|webp)$/;

function cleanCard(x: unknown): GujCardData | null {
  if (!x || typeof x !== "object") return null;
  const src = x as Record<string, unknown>;
  const d: Partial<GujCardData> = {};
  for (const [k, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    const v = src[k];
    if (typeof v === "string" && v.trim()) d[k] = v.trim().slice(0, max);
  }
  if (typeof src.logo === "string" && LOGO.test(src.logo)) d.logo = src.logo;
  const people = cleanPeople(src.people);
  if (people.length) {
    // `people` replaces the older single-owner fields
    d.people = people;
    delete d.owner;
    delete d.role;
    delete d.phone;
  }
  return d.business ? (d as GujCardData) : null;
}

const LABELS: GujPhoneLabel[] = ["mobile", "office", "whatsapp"];
const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

/** Up to 3 people, 2 numbers each, 4 numbers in all (the card limits). */
function cleanPeople(x: unknown): GujPerson[] {
  if (!Array.isArray(x)) return [];
  let total = 0;
  const out: GujPerson[] = [];
  for (const raw of x.slice(0, GUJ_MAX_PEOPLE)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const phones = (Array.isArray(r.phones) ? r.phones : [])
      .map((ph) => ({ number: str((ph as Record<string, unknown>)?.number, 30), label: (ph as Record<string, unknown>)?.label }))
      .filter((ph): ph is { number: string; label: unknown } => !!ph.number)
      .slice(0, GUJ_MAX_PHONES_EACH)
      .slice(0, Math.max(0, GUJ_MAX_PHONES - total))
      .map((ph) => (LABELS.includes(ph.label as GujPhoneLabel) && ph.label !== "mobile" ? { number: ph.number, label: ph.label as GujPhoneLabel } : { number: ph.number }));
    total += phones.length;
    const p: GujPerson = { name: str(r.name, 80), role: str(r.role, 80), phones };
    if (!p.name) delete p.name;
    if (!p.role) delete p.role;
    if (p.name || p.role || phones.length) out.push(p);
  }
  return out;
}

/** Keeps only known designs with a valid business name. */
export function cleanCards(x: unknown): Record<string, GujCardData> | null {
  if (!x || typeof x !== "object") return null;
  const out: Record<string, GujCardData> = {};
  for (const t of GUJ_TEMPLATES) {
    const c = cleanCard((x as Record<string, unknown>)[t.id]);
    if (c) out[t.id] = c;
  }
  return Object.keys(out).length ? out : null;
}

/* ---------- print-page access ---------- */

// The print page shows the card without a watermark, so only headless Chrome (holding this key) may open it.
const g = globalThis as unknown as { __gujKey?: string };
const KEY = process.env.GUJ_PRINT_SECRET || (g.__gujKey ??= randomBytes(24).toString("hex"));

export function printToken(id: string, t: string) {
  return createHmac("sha256", KEY).update(`${id}:${t}`).digest("base64url").slice(0, 32);
}
export function checkPrintToken(id: string, t: string, k: string | undefined) {
  return !!k && k === printToken(id, t);
}

/** Mock payments are allowed in development, or when GUJ_MOCK_PAY=1 is set (until a real gateway is connected). */
export function mockPayAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.GUJ_MOCK_PAY === "1";
}
