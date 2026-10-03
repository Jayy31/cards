"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  GUJ_MAX_PEOPLE,
  GUJ_MAX_PHONES,
  GUJ_MAX_PHONES_EACH,
  GUJ_PALETTES,
  GUJ_TEMPLATES,
  GUJ_W,
  gujPalette,
  peopleOf,
  type GujCardData,
  type GujPerson,
  type GujPhoneLabel,
} from "@/lib/gujarati";
import { uploadFile } from "@/components/editor/fields";
import { GujCard } from "./designs";

const STORE = "gj-studio-v1";
const DESC_SOFT_MAX = 160;
const DOWNLOADS: ["pdf" | "png" | "digital", string, string][] = [
  ["pdf", "Print PDF", "for the print shop"],
  ["png", "PNG", "600 dpi"],
  ["digital", "WhatsApp", "image"],
];

/** The form keeps every field as a plain string; empty ones are dropped when applied. */
type FPhone = { number: string; label: GujPhoneLabel };
type FPerson = { name: string; role: string; phones: FPhone[] };
type TextKey = "business" | "description" | "email" | "address";
type Form = Record<TextKey, string> & { people: FPerson[]; logo?: string };
const blankPhone = (): FPhone => ({ number: "", label: "mobile" });
const blankPerson = (withPhone = true): FPerson => ({ name: "", role: "", phones: withPhone ? [blankPhone()] : [] });
const EMPTY: Form = { business: "", description: "", email: "", address: "", people: [blankPerson()] };
const PHONE_LABELS: [GujPhoneLabel, string][] = [
  ["mobile", "મોબાઇલ"],
  ["office", "દુકાન / ઓફિસ"],
  ["whatsapp", "WhatsApp"],
];

function toForm(d?: GujCardData): Form {
  if (!d) return EMPTY;
  const people = peopleOf(d).map((p) => ({ name: p.name ?? "", role: p.role ?? "", phones: p.phones.map((x) => ({ number: x.number, label: x.label ?? "mobile" })) }));
  if (people[0] && !people[0].phones.length) people[0].phones.push(blankPhone());
  return { business: d.business ?? "", description: d.description ?? "", email: d.email ?? "", address: d.address ?? "", logo: d.logo, people: people.length ? people : EMPTY.people };
}
const tidy = (v: string) => v.trim().replace(/[ \t]+/g, " ");
function toData(f: Form): GujCardData {
  const d: GujCardData = { business: tidy(f.business) };
  for (const k of ["description", "email", "address"] as const) {
    const v = tidy(f[k]);
    if (v) d[k] = v;
  }
  const people: GujPerson[] = f.people
    .map((p) => {
      const out: GujPerson = { phones: p.phones.filter((x) => tidy(x.number)).map((x) => (x.label === "mobile" ? { number: tidy(x.number) } : { number: tidy(x.number), label: x.label })) };
      if (tidy(p.name)) out.name = tidy(p.name);
      if (tidy(p.role)) out.role = tidy(p.role);
      return out;
    })
    .filter((p) => p.name || p.role || p.phones.length);
  if (people.length) d.people = people;
  if (f.logo) d.logo = f.logo;
  return d;
}
const same = (a: GujCardData | undefined, b: GujCardData) => !!a && JSON.stringify(a) === JSON.stringify(b);

/** A card drawn at its true 700 × 400 size and scaled to the width of its slot. */
function Scaled({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / GUJ_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="gj-stage">
      <div className="gj-scale" style={{ transform: `scale(${k})`, visibility: k ? "visible" : "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, sub, hint, children }: { label: string; sub?: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="gj-field">
      <span className="gj-label">
        {label} {sub && <small>{sub}</small>}
      </span>
      {children}
      {hint && <span className="gj-hint">{hint}</span>}
    </label>
  );
}

/**
 * Every Gujarati design, with the details form on the right.
 * "Apply to all" puts the details on every design; unticked, they go on the selected design only.
 * `preset` (the ?fill= stress data) starts the page already applied to all.
 */
export default function GujStudio({ preset }: { preset?: GujCardData }) {
  const [form, setForm] = useState<Form>(() => toForm(preset));
  const [applied, setApplied] = useState<Record<string, GujCardData>>(() => (preset ? Object.fromEntries(GUJ_TEMPLATES.map((t) => [t.id, preset])) : {}));
  const [all, setAll] = useState(true);
  /** colour theme per design (palette id); missing = the design's original colours */
  const [themes, setThemes] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState(GUJ_TEMPLATES[0].id);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(!!preset);
  const [order, setOrder] = useState<{ id: string; paid: boolean } | null>(null);
  const [paying, setPaying] = useState(false);
  const [dl, setDl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  // restore the last session (per browser; not with ?fill= test data)
  useEffect(() => {
    if (preset) return;
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || "null");
      if (s?.form) setForm(toForm(s.form));
      if (s?.applied) setApplied(s.applied);
      if (typeof s?.all === "boolean") setAll(s.all);
      if (s?.themes && typeof s.themes === "object") setThemes(s.themes);
      // the server is the source of truth for payment
      if (typeof s?.orderId === "string")
        fetch(`/api/gujarati/${s.orderId}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((o) => o && setOrder({ id: o.id, paid: !!o.paid }))
          .catch(() => {});
    } catch {}
    setLoaded(true);
  }, [preset]);
  useEffect(() => {
    if (!loaded || preset) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ form, applied, all, themes, orderId: order?.id }));
    } catch {}
  }, [form, applied, all, themes, order, loaded, preset]);

  /** Saves the applied details on the server (needed for downloads). */
  async function sync(cards: Record<string, GujCardData>) {
    if (preset) return order;
    const r = await fetch("/api/gujarati", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: order?.id, cards }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "Could not save your details");
    const o = { id: j.id as string, paid: !!j.paid };
    setOrder(o);
    return o;
  }

  const set = (k: TextKey) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setMsg(null);
  };

  /** Edit a copy of the people list (fn mutates the copy). */
  const editPeople = (fn: (ps: FPerson[]) => unknown) => {
    setForm((f) => {
      const ps = structuredClone(f.people);
      fn(ps);
      return { ...f, people: ps.length ? ps : [blankPerson()] };
    });
    setMsg(null);
  };
  const phoneCount = form.people.reduce((n, p) => n + p.phones.length, 0);

  const data = toData(form);
  const targets = all ? GUJ_TEMPLATES.map((t) => t.id) : [selected];
  const pending = targets.some((id) => !same(applied[id], data));
  const selName = GUJ_TEMPLATES.find((t) => t.id === selected)?.name;

  function apply(e: FormEvent) {
    e.preventDefault();
    if (!data.business) {
      setErr("Please enter your business name.");
      return;
    }
    setErr(null);
    const next = { ...applied, ...Object.fromEntries(targets.map((id) => [id, data])) };
    setApplied(next);
    setMsg(all ? `Applied to all ${GUJ_TEMPLATES.length} designs ✓` : `Applied to ${selName} ✓`);
    sync(next).catch((x) => setErr(x instanceof Error ? x.message : "Could not save your details"));
    // on a phone the form sits above the cards: bring them into view
    if (window.matchMedia("(max-width: 960px)").matches) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    setForm(EMPTY);
    setApplied({});
    setMsg(null);
    setErr(null);
  }

  async function unlock() {
    setPaying(true);
    setErr(null);
    try {
      const o = order ?? (await sync(applied));
      if (!o) return;
      const r = await fetch(`/api/gujarati/${o.id}/unlock`, { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Payment failed");
      setOrder({ id: o.id, paid: !!j.paid });
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  async function download(t: string, format: "pdf" | "png" | "digital") {
    if (!order) return;
    const key = `${t}:${format}`;
    setDl(key);
    try {
      const r = await fetch(`/api/gujarati/${order.id}/download?t=${t}&format=${format}&theme=${themes[t] ?? ""}`);
      if (!r.ok) throw new Error((await r.text()) || "Download failed");
      const cd = r.headers.get("content-disposition") ?? "";
      const m = /filename\*=UTF-8''([^;]+)/.exec(cd);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(await r.blob());
      a.download = m ? decodeURIComponent(m[1]) : `${t}.${format === "pdf" ? "pdf" : "png"}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Download failed");
    } finally {
      setDl(null);
    }
  }

  async function onLogo(f?: File) {
    if (!f) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadFile(f, "image");
      setForm((x) => ({ ...x, logo: url }));
      setMsg(null);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Logo upload failed");
    } finally {
      setBusy(false);
    }
  }

  const emailOk = !form.email.trim() || /^\S+@\S+\.\S+$/.test(form.email.trim());
  const descLen = form.description.trim().length;
  const nApplied = Object.keys(applied).length;
  const paid = !!order?.paid;

  return (
    <div className="gj-layout">
      <section ref={gridRef} className="gj-grid" aria-label="Designs">
        {GUJ_TEMPLATES.map((t) => {
          const mine = !!applied[t.id];
          return (
            <figure key={t.id} className={`gj-item ${!all && selected === t.id ? "sel" : ""}`}>
              <button type="button" className="gj-pick" onClick={() => setSelected(t.id)} aria-pressed={selected === t.id} aria-label={`Select ${t.name}`}>
                <Scaled>
                  <GujCard id={t.id} d={applied[t.id] ?? t.sample} theme={themes[t.id]} />
                </Scaled>
                {mine && !paid && <span className="gj-wm" aria-hidden />}
              </button>
              <figcaption>
                <b>{t.name}</b>
                <span>{mine ? "Your details" : `Sample: ${t.trade}`}</span>
                <em className="gj-tag">{t.lang === "gu" ? "ગુજરાતી" : "ગુજરાતી + English"}</em>
              </figcaption>
              <div className="gj-themes" role="radiogroup" aria-label={`${t.name} colours`}>
                {GUJ_PALETTES[t.id].map((pl) => {
                  const on = gujPalette(t.id, themes[t.id]).id === pl.id;
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      title={pl.name}
                      className={on ? "on" : ""}
                      style={{ background: `linear-gradient(135deg, ${pl.swatch[0]} 50%, ${pl.swatch[1]} 50%)` }}
                      onClick={() => setThemes((x) => ({ ...x, [t.id]: pl.id }))}
                    />
                  );
                })}
                <span>{gujPalette(t.id, themes[t.id]).name}</span>
              </div>
              {mine && paid && (
                <div className="gj-dl">
                  {DOWNLOADS.map(([f, label, sub]) => (
                    <button key={f} type="button" onClick={() => download(t.id, f)} disabled={!!dl}>
                      {dl === `${t.id}:${f}` ? "Preparing…" : label}
                      <small>{sub}</small>
                    </button>
                  ))}
                </div>
              )}
            </figure>
          );
        })}
      </section>

      <aside className="gj-side">
        <form className="gj-form" onSubmit={apply} noValidate>
          <div className="gj-form-head">
            <h2>તમારી વિગતો</h2>
            <p>Your details, in Gujarati or English. Typing or copy-paste both work. Empty fields are left off the card.</p>
          </div>

          <Field label="વ્યવસાયનું નામ" sub="Business name *">
            <input value={form.business} onChange={set("business")} placeholder="શ્રી ઉમિયા ટ્રેડર્સ" required aria-invalid={!!err && !data.business} />
          </Field>

          <div className="gj-people">
            {form.people.map((p, i) => (
              <fieldset key={i} className="gj-person">
                <legend>
                  {form.people.length > 1 ? `વ્યક્તિ ${i + 1}` : "નામ અને મોબાઇલ"} <small>{form.people.length > 1 ? `Person ${i + 1}` : "Owner & phone"}</small>
                </legend>
                {form.people.length > 1 && (
                  <button type="button" className="gj-x" onClick={() => editPeople((ps) => ps.splice(i, 1))} aria-label={`Remove person ${i + 1}`} title="Remove this person">
                    ×
                  </button>
                )}
                <div className="gj-two">
                  <Field label="નામ" sub="Name">
                    <input value={p.name} onChange={(e) => editPeople((ps) => (ps[i].name = e.target.value))} placeholder={i ? "સુરેશભાઈ પટેલ" : "રમેશભાઈ પટેલ"} />
                  </Field>
                  <Field label="હોદ્દો" sub="Title / degree">
                    <input value={p.role} onChange={(e) => editPeople((ps) => (ps[i].role = e.target.value))} placeholder="પ્રોપ્રાઇટર" />
                  </Field>
                </div>
                {p.phones.map((ph, j) => (
                  <div key={j} className="gj-phone">
                    <input
                      value={ph.number}
                      onChange={(e) => editPeople((ps) => (ps[i].phones[j].number = e.target.value))}
                      placeholder="98250 12345"
                      inputMode="tel"
                      aria-label={`Phone ${j + 1} of person ${i + 1}`}
                    />
                    <select value={ph.label} onChange={(e) => editPeople((ps) => (ps[i].phones[j].label = e.target.value as GujPhoneLabel))} aria-label="Number type">
                      {PHONE_LABELS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    {(j > 0 || i > 0) && (
                      <button type="button" className="gj-x sm" onClick={() => editPeople((ps) => ps[i].phones.splice(j, 1))} aria-label="Remove this number" title="Remove this number">
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {p.phones.length < GUJ_MAX_PHONES_EACH && phoneCount < GUJ_MAX_PHONES && (
                  <button type="button" className="gj-add" onClick={() => editPeople((ps) => ps[i].phones.push(blankPhone()))}>
                    + Add another number
                  </button>
                )}
              </fieldset>
            ))}
            {form.people.length < GUJ_MAX_PEOPLE && (
              <button type="button" className="gj-add person" onClick={() => editPeople((ps) => ps.push(blankPerson(phoneCount < GUJ_MAX_PHONES)))}>
                + Add another person
              </button>
            )}
            <span className="gj-hint">
              Up to {GUJ_MAX_PEOPLE} people and {GUJ_MAX_PHONES} numbers, so the card stays readable. “દુકાન / ઓફિસ” and WhatsApp numbers print with their own icon.
            </span>
          </div>
          <Field
            label="વર્ણન"
            sub="What you do"
            hint={<span className={descLen > DESC_SOFT_MAX ? "warn" : ""}>{descLen > DESC_SOFT_MAX ? `${descLen} characters: the text will print smaller. Under ${DESC_SOFT_MAX} reads best.` : `Services, products or timings. ${descLen}/${DESC_SOFT_MAX}`}</span>}
          >
            <textarea rows={3} value={form.description} onChange={set("description")} placeholder="અહીં અનાજ, કઠોળ, તેલ, મસાલા તથા કરિયાણાની તમામ ચીજવસ્તુઓ મળશે." />
          </Field>
          <Field label="ઈમેલ" sub="Email" hint={!emailOk ? <span className="warn">This doesn’t look like an email address.</span> : undefined}>
            <input value={form.email} onChange={set("email")} placeholder="name@gmail.com" inputMode="email" autoCapitalize="off" spellCheck={false} />
          </Field>
          <Field label="સરનામું" sub="Address / location">
            <textarea rows={2} value={form.address} onChange={set("address")} placeholder="૧૨, સરદાર માર્કેટ, સ્ટેશન રોડ, આણંદ" />
          </Field>

          <div className="gj-field">
            <span className="gj-label">
              લોગો <small>Logo (optional)</small>
            </span>
            <div className="gj-logo">
              {form.logo ? <span className="gj-logo-prev" style={{ backgroundImage: `url(${JSON.stringify(form.logo)})` }} /> : <span className="gj-logo-prev none">No logo: the first letter is used</span>}
              <button type="button" className="gj-btn ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
                {busy ? "Uploading…" : form.logo ? "Replace" : "Upload"}
              </button>
              {form.logo && (
                <button type="button" className="gj-btn ghost" onClick={() => setForm((f) => ({ ...f, logo: undefined }))}>
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  onLogo(f);
                }}
              />
            </div>
            <span className="gj-hint">A PNG with a transparent background looks best.</span>
          </div>

          <div className="gj-apply">
            <label className="gj-check">
              <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
              <span>
                Apply to all designs
                <small>{all ? `Your details go on all ${GUJ_TEMPLATES.length} cards.` : `Only on the selected card: ${selName}. Click a card to choose.`}</small>
              </span>
            </label>
            {err && <p className="gj-err">{err}</p>}
            <button type="submit" className="gj-btn primary" disabled={busy}>
              {!pending && nApplied ? "Applied" : all ? "Apply to all designs" : `Apply to ${selName}`}
            </button>
            {msg && !pending && <p className="gj-ok">{msg}</p>}
            {nApplied > 0 && !preset && (
              <div className={`gj-unlock ${paid ? "paid" : ""}`}>
                {paid ? (
                  <>
                    <b>✓ Unlocked: all {GUJ_TEMPLATES.length} designs</b>
                    <span>Use the download buttons under each card. If you change your details, apply them again and download again.</span>
                  </>
                ) : (
                  <>
                    <b>Download without the watermark</b>
                    <ul>
                      <li>All {GUJ_TEMPLATES.length} designs with your details</li>
                      <li>Print-ready PDF for the print shop (3 mm bleed + crop marks)</li>
                      <li>600 dpi PNG and a WhatsApp image</li>
                    </ul>
                    <button type="button" className="gj-btn pay" onClick={unlock} disabled={paying || pending}>
                      {paying ? "Unlocking…" : "Unlock for ₹99"}
                    </button>
                    {pending && <span className="gj-note">Apply your changes first.</span>}
                    {process.env.NODE_ENV !== "production" && <span className="gj-note">Test mode: no payment gateway is connected, so this unlocks for free.</span>}
                  </>
                )}
              </div>
            )}
            {nApplied > 0 && (
              <button type="button" className="gj-link" onClick={reset}>
                Clear my details and show the samples again
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}
