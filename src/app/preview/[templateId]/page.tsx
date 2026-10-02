import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveCard } from "@/lib/resolve";
import CardView from "@/components/viewer/CardView";
import PreviewBanner from "@/components/viewer/PreviewBanner";

type Params = { params: Promise<{ templateId: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { templateId } = await params;
  const r = await resolveCard({ template: templateId });
  return { title: r ? `${r.template.name} · Preview` : "Preview" };
}

export default async function PreviewPage({ params, searchParams }: Params) {
  const { templateId } = await params;
  const q = await searchParams;
  const r = await resolveCard({ template: templateId, palette: q.palette, demo: q.demo });
  if (!r) notFound();
  return (
    <>
      <CardView templateId={r.template.id} data={r.data} guest={q.to} render={q.render === "1"} />
      {q.render !== "1" && <PreviewBanner templateId={r.template.id} palette={r.data.palette} />}
    </>
  );
}
