import { NextResponse } from "next/server";
import { getCard, updateCard } from "@/lib/store";
import { validateCard } from "@/lib/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const card = await getCard((await params).id);
  return card ? NextResponse.json(card) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, { params }: Ctx) {
  const v = validateCard(await req.json().catch(() => null));
  if (typeof v === "string") return NextResponse.json({ error: v }, { status: 400 });
  const card = await updateCard((await params).id, v.templateId, v.data);
  return card ? NextResponse.json({ id: card.id }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
