import Link from "next/link";
import { getTemplate } from "@/lib/templates";
import DownloadButton from "@/components/DownloadButton";

export default function PreviewBanner({ templateId, palette }: { templateId: string; palette: string }) {
  const t = getTemplate(templateId)!;
  return (
    <div className="preview-banner">
      <Link href={`/?cat=${t.category}#designs`} className="pb-back">
        ← All designs
      </Link>
      <div className="pb-palettes">
        {t.palettes.map((p) => (
          <Link key={p.id} href={`/preview/${t.id}?palette=${p.id}`} className={p.id === palette ? "sw on" : "sw"} style={{ background: `linear-gradient(135deg, ${p.paper} 50%, ${p.envelope2} 50%)` }} title={p.label} />
        ))}
      </div>
      <DownloadButton kind={t.sample.kind} template={t.id} palette={palette} variant="banner" />
      <Link href={`/create/${t.id}?palette=${palette}`} className="pb-cta">
        Customise this
      </Link>
    </div>
  );
}
