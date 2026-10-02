"use client";
import { getTemplate } from "@/lib/templates";
import InviteViewer from "@/components/viewer/InviteViewer";
import type { InviteData } from "@/lib/types";

export default function HeroDemo() {
  const t = getTemplate("royal-jharokha")!;
  return <InviteViewer templateId={t.id} data={{ ...(t.sample as InviteData), music: "none" }} mode="live" guest="Sharma Family" />;
}
