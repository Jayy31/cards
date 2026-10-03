import { notFound } from "next/navigation";
import { checkPrintToken, getOrder } from "@/lib/gujStore";
import { GujCard } from "@/components/gujarati/designs";
import "../../gujarati.css";

export const dynamic = "force-dynamic";

/** Bare, watermark-free card for headless Chrome exports. Needs the server's print token (`k`). */
export default async function GujPrint({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { id = "", t = "", k, theme } = await searchParams;
  if (!checkPrintToken(id, t, k)) notFound();
  const d = (await getOrder(id))?.cards[t];
  if (!d) notFound();
  return (
    <div style={{ padding: 20, background: "transparent" }}>
      <style>{"html, body { background: transparent !important; margin: 0; }"}</style>
      <GujCard id={t} d={d} theme={theme} flat />
    </div>
  );
}
