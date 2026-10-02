import { NextResponse } from "next/server";
import { getOrder } from "@/lib/gujStore";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const o = await getOrder((await params).id);
  if (!o) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: o.id, paid: o.paid });
}
