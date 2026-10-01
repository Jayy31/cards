"use client";
import type { CardData } from "@/lib/types";
import InviteViewer from "./InviteViewer";
import BusinessViewer from "@/components/business/BusinessViewer";

/** Full-screen public view of any card (invite or business). */
export default function CardView({ templateId, data, cardId, guest, render }: { templateId: string; data: CardData; cardId?: string; guest?: string; render?: boolean }) {
  return (
    <main className={`viewer-page ${render ? "is-render" : ""}`}>
      {data.kind === "invite" ? (
        <InviteViewer templateId={templateId} data={data} cardId={cardId} guest={guest} mode={render ? "render" : "live"} />
      ) : (
        <BusinessViewer templateId={templateId} data={data} cardId={cardId} mode={render ? "render" : "live"} />
      )}
    </main>
  );
}
