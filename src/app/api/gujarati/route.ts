import { NextResponse } from "next/server";
import { cleanCards, saveOrder } from "@/lib/gujStore";

/** POST { id?, cards } → saves the details applied to each design. Returns { id, paid }. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const cards = cleanCards(body?.cards);
  if (!cards) return NextResponse.json({ error: "Add your business name first." }, { status: 400 });
  const o = await saveOrder(typeof body?.id === "string" ? body.id : undefined, cards);
  return NextResponse.json({ id: o.id, paid: o.paid });
}
