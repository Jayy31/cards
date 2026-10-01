import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveCard } from "@/lib/resolve";
import { inviteTitle } from "@/lib/format";
import CardView from "@/components/viewer/CardView";
import { forAudience } from "@/lib/wedding";

type Params = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { id } = await params;
  const q = await searchParams;
  const r = await resolveCard({ card: id });
  if (!r) return { title: "Invitation" };
  const d = r.data;
  const title = d.kind === "invite" ? `${d.eyebrow} · ${inviteTitle(d)}` : `${d.name} · ${d.company}`;
  const description = d.kind === "invite" ? (q.to ? `Dear ${q.to}, you are cordially invited.` : "You are cordially invited. Tap to open your invitation.") : d.title;
  const image = `/api/export?card=${id}&format=png&page=0&og=1`;
  return { title, description, openGraph: { title, description, images: [{ url: image, width: 1000, height: 1400 }] }, twitter: { card: "summary_large_image", title, description, images: [image] } };
}

export default async function InvitePage({ params, searchParams }: Params) {
  const { id } = await params;
  const q = await searchParams;
  const r = await resolveCard({ card: id });
  if (!r) notFound();
  // family-only events are left out unless the link was made for close family (`g=family`)
  const data = r.data.kind === "invite" ? forAudience(r.data, q.g) : r.data;
  return <CardView templateId={r.template.id} data={data} cardId={id} guest={q.to} render={q.render === "1"} />;
}
