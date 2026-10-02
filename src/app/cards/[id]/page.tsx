import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCard, listRsvps } from "@/lib/store";
import { getTemplate } from "@/lib/templates";
import Dashboard from "@/components/editor/Dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your card · Shubh Cards", robots: { index: false } };

export default async function CardDashboard({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const q = await searchParams;
  const card = await getCard(id);
  if (!card || !getTemplate(card.templateId)) notFound();
  const rsvps = card.data.kind === "invite" ? await listRsvps(id) : [];
  return <Dashboard card={card} rsvps={rsvps} isNew={q.new === "1"} />;
}
