"use client";
import { getPalette, getTemplate } from "@/lib/templates";
import type { CardData } from "@/lib/types";
import { CardEnvProvider } from "@/components/card/CardEnv";
import { buildPages, InvitePage } from "@/components/card/InvitePages";
import { BusinessFace } from "@/components/business/BusinessFaces";
import { bizSize } from "@/lib/bizShape";

export default function PrintSheet({ templateId, data, guest }: { templateId: string; data: CardData; guest?: string }) {
  const t = getTemplate(templateId)!;
  const p = getPalette(t, data.palette);
  // Freeze the clock so countdowns are stable in exports.
  return (
    <CardEnvProvider value={{ mode: "print", now: Date.now(), guest }}>
      <div className="print-sheet mode-print">
        {data.kind === "invite"
          ? buildPages(t, data).map((spec, i) => (
              <div className="print-page" key={spec.key} data-page={i}>
                <InvitePage spec={spec} d={data} t={t} p={p} index={i} />
              </div>
            ))
          : (["front", "back"] as const).map((side, i) => (
              <div className="print-page biz" key={side} data-page={i} style={{ width: bizSize(t).w, height: bizSize(t).h }}>
                <BusinessFace side={side} d={data} t={t} p={p} />
              </div>
            ))}
      </div>
    </CardEnvProvider>
  );
}
