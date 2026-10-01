import { notFound } from "next/navigation";
import { resolveCard } from "@/lib/resolve";
import PrintSheet from "@/components/viewer/PrintSheet";

export const dynamic = "force-dynamic";

/** Flat, animation-free rendering of every page. Used for PDF / PNG export (via headless Chrome). */
export default async function PrintPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const r = await resolveCard(q);
  if (!r) notFound();
  return <PrintSheet templateId={r.template.id} data={r.data} guest={q.to} />;
}
