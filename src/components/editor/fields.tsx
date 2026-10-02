"use client";
import React, { useRef, useState } from "react";
import { Icon } from "@/components/viewer/icons";

export function Text({ label, value, onChange, placeholder, hint, multiline, rows = 3, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; multiline?: boolean; rows?: number; type?: string }) {
  return (
    <label className="ef">
      <span className="ef-label">{label}</span>
      {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} /> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
      {hint && <span className="ef-hint">{hint}</span>}
    </label>
  );
}

/** One entry per line ↔ string[] */
export function Lines({ label, value, onChange, placeholder, hint, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string; rows?: number }) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <Text
      label={label}
      value={text}
      multiline
      rows={rows}
      placeholder={placeholder}
      hint={hint ?? "One per line"}
      onChange={(v) => {
        setText(v);
        onChange(v.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
    />
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="ef-toggle">
      <span>
        <span className="ef-label">{label}</span>
        {hint && <span className="ef-hint">{hint}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden />
    </label>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="ef-row">{children}</div>;
}

async function resizeImage(file: File, max = 1400): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * k);
    c.height = Math.round(img.height * k);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res) => c.toBlob((b) => res(b!), file.type === "image/png" ? "image/png" : "image/jpeg", 0.86));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadFile(file: File, kind: "image" | "audio") {
  const body = new FormData();
  body.append("file", kind === "image" ? new File([await resizeImage(file)], file.name, { type: file.type === "image/png" ? "image/png" : "image/jpeg" }) : file);
  const res = await fetch("/api/upload", { method: "POST", body });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || "Upload failed");
  return j.url as string;
}

export function Upload({ label, value, onChange, kind = "image", hint }: { label: string; value?: string; onChange: (url?: string) => void; kind?: "image" | "audio"; hint?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="ef">
      <span className="ef-label">{label}</span>
      <div className="ef-upload">
        {value && kind === "image" && <div className="ef-thumb" style={{ backgroundImage: `url(${JSON.stringify(value)})` }} />}
        {value && kind === "audio" && <audio src={value} controls className="ef-audio" />}
        <button type="button" className="btn-ghost" onClick={() => ref.current?.click()} disabled={busy}>
          <Icon name={kind === "image" ? "image" : "music"} size={16} /> {busy ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button type="button" className="btn-ghost danger" onClick={() => onChange(undefined)}>
            Remove
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "audio/*"}
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setBusy(true);
            setErr(null);
            try {
              onChange(await uploadFile(f, kind));
            } catch (x) {
              setErr(x instanceof Error ? x.message : "Upload failed");
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
      {hint && <span className="ef-hint">{hint}</span>}
      {err && <span className="ef-err">{err}</span>}
    </div>
  );
}

export function Section({ id, title, subtitle, open, onOpen, children }: { id: string; title: string; subtitle?: string; open: boolean; onOpen: (id: string) => void; children: React.ReactNode }) {
  return (
    <section className={`es ${open ? "open" : ""}`}>
      <button type="button" className="es-head" onClick={() => onOpen(open ? "" : id)} aria-expanded={open}>
        <span>
          <span className="es-title">{title}</span>
          {subtitle && <span className="es-sub">{subtitle}</span>}
        </span>
        <Icon name={open ? "up" : "down"} size={18} />
      </button>
      {open && <div className="es-body">{children}</div>}
    </section>
  );
}
