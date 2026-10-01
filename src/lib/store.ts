import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type { CardData, Rsvp, StoredCard } from "./types";

/**
 * File-backed store. Deliberately tiny: the MVP skips the database, so every
 * card is a JSON file under .data/. Swap this module for Postgres later — the
 * rest of the app only talks to these functions.
 */
export const DATA_DIR = path.join(process.cwd(), ".data");
const CARDS = path.join(DATA_DIR, "cards");
const RSVPS = path.join(DATA_DIR, "rsvps");
export const UPLOADS = path.join(DATA_DIR, "uploads");
export const RENDERS = path.join(DATA_DIR, "renders");

const SAFE_ID = /^[A-Za-z0-9_-]{4,40}$/;

async function ensure(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export function isSafeId(id: string) {
  return SAFE_ID.test(id);
}

export async function createCard(templateId: string, data: CardData): Promise<StoredCard> {
  await ensure(CARDS);
  const now = new Date().toISOString();
  const card: StoredCard = { id: nanoid(10), templateId, data, createdAt: now, updatedAt: now };
  await fs.writeFile(path.join(CARDS, `${card.id}.json`), JSON.stringify(card, null, 2));
  return card;
}

export async function getCard(id: string): Promise<StoredCard | null> {
  if (!isSafeId(id)) return null;
  try {
    return JSON.parse(await fs.readFile(path.join(CARDS, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

export async function updateCard(id: string, templateId: string, data: CardData) {
  const card = await getCard(id);
  if (!card) return null;
  const next: StoredCard = { ...card, templateId, data, updatedAt: new Date().toISOString() };
  await fs.writeFile(path.join(CARDS, `${id}.json`), JSON.stringify(next, null, 2));
  return next;
}

export async function listRsvps(cardId: string): Promise<Rsvp[]> {
  if (!isSafeId(cardId)) return [];
  try {
    return JSON.parse(await fs.readFile(path.join(RSVPS, `${cardId}.json`), "utf8"));
  } catch {
    return [];
  }
}

export async function addRsvp(cardId: string, r: Omit<Rsvp, "id" | "createdAt">) {
  await ensure(RSVPS);
  const all = await listRsvps(cardId);
  const entry: Rsvp = { ...r, id: nanoid(8), createdAt: new Date().toISOString() };
  all.push(entry);
  await fs.writeFile(path.join(RSVPS, `${cardId}.json`), JSON.stringify(all, null, 2));
  return entry;
}

export async function saveUpload(buf: Buffer, ext: string) {
  await ensure(UPLOADS);
  const name = `${nanoid(12)}.${ext}`;
  await fs.writeFile(path.join(UPLOADS, name), buf);
  return name;
}
