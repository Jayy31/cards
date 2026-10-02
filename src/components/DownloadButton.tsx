"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/viewer/icons";

type Option = { label: string; hint: string; query: string };

const OPTIONS: Record<"business" | "invite", Option[]> = {
  business: [
    { label: "Both sides", hint: "PNG image", query: "format=png&page=all" },
    { label: "Front", hint: "PNG image", query: "format=png&page=0" },
    { label: "Back", hint: "PNG image", query: "format=png&page=1" },
    { label: "Print file", hint: "PDF · front & back", query: "format=pdf" },
  ],
  invite: [
    { label: "Cover", hint: "PNG image", query: "format=png&page=0" },
    { label: "All pages", hint: "PDF", query: "format=pdf" },
  ],
};

/**
 * One "Download" button with a small menu of formats. Files are rendered on the
 * server by headless Chrome from the same components, so they match the card exactly.
 */
export default function DownloadButton({ kind, card, template, palette, variant = "ghost" }: { kind: "business" | "invite"; card?: string; template?: string; palette?: string; variant?: "ghost" | "act" | "banner" }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  const source = card ? `card=${encodeURIComponent(card)}` : `template=${encodeURIComponent(template ?? "")}${palette ? `&palette=${encodeURIComponent(palette)}` : ""}`;

  const download = async (o: Option) => {
    setBusy(o.label);
    setError(null);
    try {
      const res = await fetch(`/api/export?${source}&${o.query}`);
      if (!res.ok) throw new Error((await res.text()) || "Export failed");
      const blob = await res.blob();
      const name = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") ?? "")?.[1] ?? `card.${o.query.includes("pdf") ? "pdf" : "png"}`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message.slice(0, 140) : "Export failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div ref={ref} className={`dl-wrap dl-${variant}`} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="dl-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} disabled={!!busy}>
        {busy ? <span className="dl-spin" /> : <Icon name="download" size={18} />}
        {busy ? "Preparing…" : "Download"}
      </button>
      {open && (
        <div className="dl-menu" role="menu">
          {OPTIONS[kind].map((o) => (
            <button key={o.label} type="button" role="menuitem" onClick={() => download(o)} disabled={!!busy}>
              <Icon name={o.query.includes("pdf") ? "file" : "image"} size={18} />
              <span>
                <b>{o.label}</b>
                <small>{busy === o.label ? "Preparing…" : o.hint}</small>
              </span>
            </button>
          ))}
          {error && <p className="dl-err">{error}</p>}
        </div>
      )}
    </div>
  );
}
