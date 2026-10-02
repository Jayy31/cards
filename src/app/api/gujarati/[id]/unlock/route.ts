import { NextResponse } from "next/server";
import { getOrder, markPaid, mockPayAllowed } from "@/lib/gujStore";

/**
 * ₹99 unlock. No payment gateway is connected yet, so this is a mock that marks the order paid
 * (development only, or GUJ_MOCK_PAY=1).
 * With a real gateway (e.g. Razorpay): create the order on the server, open Checkout on the page, then verify
 * the payment signature here before calling markPaid(id, paymentId).
 */
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await getOrder(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!mockPayAllowed()) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 501 });
  const o = await markPaid(id, "mock");
  return NextResponse.json({ id, paid: !!o?.paid });
}
