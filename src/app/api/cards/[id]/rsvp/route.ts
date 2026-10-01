import { NextResponse } from "next/server";
import { addRsvp, getCard, listRsvps } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function GET(_: Request, { params }: Ctx) {
  return NextResponse.json(await listRsvps((await params).id));
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!(await getCard(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(b.name, 120);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const attending = b.attending === "no" || b.attending === "maybe" ? b.attending : "yes";
  const entry = await addRsvp(id, {
    name,
    phone: str(b.phone, 30),
    attending,
    guests: Math.max(0, Math.min(50, Number(b.guests) || 0)),
    events: Array.isArray(b.events) ? b.events.filter((x): x is string => typeof x === "string").slice(0, 20) : [],
    message: str(b.message, 1000),
    invitedAs: str(b.invitedAs, 120) || undefined,
  });
  return NextResponse.json(entry);
}
