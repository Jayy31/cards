import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCard } from "@/lib/store";
import { getTemplate } from "@/lib/templates";
import Editor from "@/components/editor/Editor";

type Params = { params: Promise<{ templateId: string }>; searchParams: Promise<Record<string, string | undefined>> };

export const metadata: Metadata = { title: "Customise your card · Shubh Cards" };

export default async function CreatePage({ params, searchParams }: Params) {
  const { templateId } = await params;
  const q = await searchParams;
  if (q.card) {
    const c = await getCard(q.card);
    if (!c) notFound();
    return <Editor templateId={c.templateId} initialData={c.data} cardId={c.id} />;
  }
  const t = getTemplate(templateId);
  if (!t) notFound();
  const data = structuredClone(t.sample);
  if (q.palette && t.palettes.some((p) => p.id === q.palette)) data.palette = q.palette;
  return <Editor templateId={t.id} initialData={data} />;
}
