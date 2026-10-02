import { NextResponse } from "next/server";
import { createCard } from "@/lib/store";
import { validateCard } from "@/lib/validate";

export async function POST(req: Request) {
  const v = validateCard(await req.json().catch(() => null));
  if (typeof v === "string") return NextResponse.json({ error: v }, { status: 400 });
  const card = await createCard(v.templateId, v.data);
  return NextResponse.json({ id: card.id });
}
