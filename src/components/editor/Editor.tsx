"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BusinessData, CardData, Category, EventItem, EventKind, HostSide, InviteData, SymbolKind } from "@/lib/types";
import { applyTradition, EVENT_KINDS, eventKind, hostLine, INFO_LABELS, TRADITIONS } from "@/lib/wedding";
import { getPalette, getTemplate, TEMPLATES } from "@/lib/templates";
import { uid } from "@/lib/format";
import { buildPages } from "@/components/card/InvitePages";
import InviteViewer from "@/components/viewer/InviteViewer";
import BusinessViewer from "@/components/business/BusinessViewer";
import { Icon } from "@/components/viewer/icons";
import { Lines, Row, Section, Text, Toggle, Upload } from "./fields";

const LABELS: Record<Category, { primary: string; primarySub: string; primaryPar: string; secondary?: string; secondarySub?: string; secondaryPar?: string }> = {
  wedding: { primary: "Groom's name", primarySub: "Groom's parents", primaryPar: "Grandparents / family line", secondary: "Bride's name", secondarySub: "Bride's parents", secondaryPar: "Grandparents / family line" },
  engagement: { primary: "Groom-to-be", primarySub: "His parents", primaryPar: "Family line", secondary: "Bride-to-be", secondarySub: "Her parents", secondaryPar: "Family line" },
  "shop-opening": { primary: "Shop / business name", primarySub: "What you sell (tagline)", primaryPar: "" },
  "griha-pravesh": { primary: "Name of the home", primarySub: "Address", primaryPar: "" },
  business: { primary: "", primarySub: "", primaryPar: "" },
};

const SYMBOLS: { id: SymbolKind; label: string }[] = [
  { id: "ganesha", label: "Shri Ganesh" },
  { id: "ganesha-riddhi", label: "Ganesh with Riddhi-Siddhi" },
  { id: "om", label: "Om" },
  { id: "kalash", label: "Kalash" },
  { id: "lotus", label: "Lotus" },
  { id: "diya", label: "Diya" },
  { id: "swastik", label: "Swastik" },
  { id: "khanda", label: "Khanda" },
  { id: "crescent", label: "Crescent & star" },
  { id: "cross", label: "Cross" },
  { id: "custom", label: "Upload deity / symbol" },
  { id: "none", label: "None" },
];

const SYMBOL_THUMB: Partial<Record<SymbolKind, string>> = {
  ganesha: "/art/ganesha-mangalmurti.jpg",
  "ganesha-riddhi": "/art/ganesha-riddhi-siddhi.jpg",
};
const SYMBOL_GLYPH: Partial<Record<SymbolKind, string>> = { om: "ॐ", kalash: "⚱", lotus: "❀", diya: "🪔", swastik: "卐", khanda: "☬", crescent: "☪", cross: "✝", custom: "＋", none: "—" };

export default function Editor({ templateId: initialTemplate, initialData, cardId }: { templateId: string; initialData: CardData; cardId?: string }) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState(initialTemplate);
  const [data, setData] = useState<CardData>(initialData);
  const [open, setOpen] = useState("design");
  const [page, setPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [designQuery, setDesignQuery] = useState("");
  const t = getTemplate(templateId)!;
  const siblings = TEMPLATES.filter((x) => x.sample.kind === t.sample.kind);
  const dq = designQuery.trim().toLowerCase();
  const shownDesigns = dq ? siblings.filter((s) => [s.name, s.tagline, ...s.styles, ...s.effects, ...(s.industries ?? [])].join(" ").toLowerCase().includes(dq)) : siblings;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = useCallback((fn: (d: CardData) => CardData) => {
    setData((d) => fn(structuredClone(d)));
    setDirty(true);
  }, []);

  const inv = data.kind === "invite" ? data : null;
  const biz = data.kind === "business" ? data : null;
  const setInv = (fn: (d: InviteData) => void) =>
    update((d) => {
      fn(d as InviteData);
      return d;
    });
  const setBiz = (fn: (d: BusinessData) => void) =>
    update((d) => {
      fn(d as BusinessData);
      return d;
    });

  // Map form sections → the page they affect, so the preview follows the user.
  const specs = useMemo(() => (inv ? buildPages(t, inv) : []), [t, inv]);
  const openSection = (id: string) => {
    setOpen(id);
    if (!inv) {
      setPage(["contact", "extras", "social"].includes(id) ? 1 : 0);
      return;
    }
    const find = (k: string) => Math.max(0, specs.findIndex((s) => s.kind === k));
    const map: Record<string, number> = { design: 0, blessing: 0, people: 1, story: find("story"), events: find("events"), family: find("family"), rsvp: find("venue"), info: find("info"), closing: specs.length - 1 };
    if (id in map) setPage(map[id]);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(cardId ? `/api/cards/${cardId}` : "/api/cards", {
        method: cardId ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId, data }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Could not save");
      setDirty(false);
      router.push(`/cards/${j.id}${cardId ? "" : "?new=1"}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
      setSaving(false);
    }
  };

  const L = LABELS[t.category];
  const isWedding = t.category === "wedding";
  const palette = getPalette(t, data.palette);

  return (
    <div className="editor">
      <header className="ed-top">
        <Link href="/" className="brand-sm">
          <span className="brand-mark">✦</span> Shubh Cards
        </Link>
        <div className="ed-top-mid">
          <span className="ed-tpl">{t.name}</span>
          {dirty && <span className="ed-dirty">Unsaved changes</span>}
        </div>
        <div className="ed-top-actions">
          <button className="btn-ghost only-mobile" onClick={() => setMobilePreview((v) => !v)}>
            <Icon name={mobilePreview ? "edit" : "eye"} size={16} /> {mobilePreview ? "Edit" : "Preview"}
          </button>
          <button className="btn-ghost" onClick={() => setPlaying(true)}>
            <Icon name="replay" size={16} /> Play
          </button>
          <button className="btn-primary sm" onClick={save} disabled={saving}>
            {saving ? "Saving…" : cardId ? "Save changes" : "Save & share"}
          </button>
        </div>
      </header>
      {error && <div className="ed-error">{error}</div>}

      <div className={`ed-main ${mobilePreview ? "show-preview" : ""}`}>
        <aside className="ed-form">
          <Section id="design" title="Design" subtitle={`${t.name} · ${palette.label}`} open={open === "design"} onOpen={openSection}>
            <div className="ef">
              <span className="ef-label">Colour</span>
              <div className="swatches">
                {t.palettes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={p.id === data.palette ? "swatch on" : "swatch"}
                    style={{ background: `linear-gradient(135deg, ${p.paper} 55%, ${p.envelope2} 55%)` }}
                    onClick={() => update((d) => ({ ...d, palette: p.id }))}
                    title={p.label}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {biz && (
              <div className="ef">
                <span className="ef-label">Brand colour</span>
                <div className="brand-color">
                  <input type="color" value={biz.brand ?? palette.accent} onChange={(e) => setBiz((d) => (d.brand = e.target.value))} aria-label="Brand colour" />
                  <span>{biz.brand ? biz.brand.toUpperCase() : "From the palette"}</span>
                  {biz.brand && (
                    <button type="button" className="btn-ghost sm" onClick={() => setBiz((d) => (d.brand = undefined))}>
                      Reset
                    </button>
                  )}
                </div>
                <span className="ef-hint">Match your logo: replaces the design&apos;s accent colour everywhere on the card.</span>
              </div>
            )}
            <div className="ef">
              <span className="ef-label">Design {siblings.length > 8 && <em className="ef-count">{siblings.length} designs</em>}</span>
              {siblings.length > 8 && <input className="tpl-search" placeholder="Search: doctor, gold, minimal, vertical, neon…" value={designQuery} onChange={(e) => setDesignQuery(e.target.value)} />}
              <div className="tpl-pick">
                {shownDesigns.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={s.id === templateId ? "on" : ""}
                    onClick={() => {
                      setTemplateId(s.id);
                      update((d) => ({ ...d, palette: s.palettes[0].id }));
                    }}
                  >
                    <strong>
                      {s.name}
                      {s.biz?.shape && s.biz.shape !== "landscape" && <i className="tpl-shape">{s.biz.shape === "portrait" ? "Vertical" : "Square"}</i>}
                      {s.photo && <i className="tpl-shape">Photo</i>}
                    </strong>
                    <span>{s.tagline}</span>
                  </button>
                ))}
              </div>
            </div>
            {inv && (
              <>
                <Toggle label="Falling petals" hint="Showered as the envelope opens" checked={inv.effects.petals} onChange={(v) => setInv((d) => (d.effects.petals = v))} />
                <label className="ef">
                  <span className="ef-label">Background music</span>
                  <select value={inv.music} onChange={(e) => setInv((d) => (d.music = e.target.value as InviteData["music"]))}>
                    <option value="santoor">Santoor · Raag Bhupali</option>
                    <option value="tanpura">Tanpura drone & temple bells</option>
                    <option value="custom">Upload my own</option>
                    <option value="none">No music</option>
                  </select>
                </label>
                {inv.music === "custom" && <Upload label="Music file" kind="audio" value={inv.musicUrl} onChange={(u) => setInv((d) => (d.musicUrl = u))} hint="MP3 / M4A, up to 12 MB. Use music you have the rights to." />}
              </>
            )}
          </Section>

          {inv && (
            <>
              <Section id="blessing" title="Blessing & cover" subtitle={isWedding && inv.tradition ? `${TRADITIONS.find((x) => x.id === inv.tradition)?.label} · deity, mantra, heading` : "Deity, mantra and heading"} open={open === "blessing"} onOpen={openSection}>
                {isWedding && (
                  <div className="ef">
                    <span className="ef-label">Tradition</span>
                    <div className="chips">
                      {TRADITIONS.map((tr) => (
                        <button key={tr.id} type="button" className={`chip ${inv.tradition === tr.id ? "on" : ""}`} onClick={() => setInv((d) => applyTradition(d, tr.id, false))}>
                          {tr.label}
                        </button>
                      ))}
                    </div>
                    <span className="ef-hint">Sets the symbol, mantra and wording; you can edit them below.</span>
                    {inv.tradition && (
                      <button
                        type="button"
                        className="btn-ghost wide"
                        onClick={() => {
                          if (confirm("Replace your events with the usual programme for this tradition? Dates are set around your main ceremony date.")) setInv((d) => applyTradition(d, d.tradition!, true));
                        }}
                      >
                        Use the usual {TRADITIONS.find((x) => x.id === inv.tradition)?.label} events
                      </button>
                    )}
                  </div>
                )}
                <div className="ef">
                  <span className="ef-label">Symbol at the top</span>
                  <div className="sym-grid">
                    {SYMBOLS.map((s) => (
                      <button key={s.id} type="button" className={inv.symbol === s.id ? "on" : ""} onClick={() => setInv((d) => (d.symbol = s.id))} title={s.label}>
                        {SYMBOL_THUMB[s.id] ? <span className="sym-img" style={{ backgroundImage: `url(${SYMBOL_THUMB[s.id]})` }} /> : <span className="sym-glyph">{SYMBOL_GLYPH[s.id]}</span>}
                        <span className="sym-label">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {inv.symbol === "custom" && <Upload label="Your image" value={inv.symbolImage} onChange={(u) => setInv((d) => (d.symbolImage = u))} hint="e.g. your Kuldevi, Sai Baba, Khanda, Bismillah — shown in the gold medallion" />}
                <Text label="Mantra / invocation" value={inv.mantra} onChange={(v) => setInv((d) => (d.mantra = v))} placeholder="|| Shri Ganeshaya Namah ||" />
                <Text label="Heading" value={inv.eyebrow} onChange={(v) => setInv((d) => (d.eyebrow = v))} placeholder="Wedding Invitation" />
              </Section>

              <Section id="people" title={inv.secondary ? "Couple & families" : "Main details"} subtitle={inv.secondary ? `${inv.primary.name} & ${inv.secondary.name}` : inv.primary.name} open={open === "people"} onOpen={openSection}>
                {isWedding && inv.secondary && (
                  <div className="ef">
                    <span className="ef-label">Card sent by</span>
                    <div className="chips">
                      {(["groom", "bride", "both"] as HostSide[]).map((side) => (
                        <button
                          key={side}
                          type="button"
                          className={`chip ${(inv.hostSide ?? "groom") === side ? "on" : ""}`}
                          onClick={() =>
                            setInv((d) => {
                              // keep a custom invitation line; only swap our own default wording
                              if ((["groom", "bride", "both"] as HostSide[]).some((x) => hostLine(x) === d.inviteText)) d.inviteText = hostLine(side);
                              d.hostSide = side;
                            })
                          }
                        >
                          {side === "groom" ? "Groom's family" : side === "bride" ? "Bride's family" : "Both families"}
                        </button>
                      ))}
                    </div>
                    <span className="ef-hint">The sending family&apos;s child is named first.</span>
                  </div>
                )}
                <Text label="Blessing line" value={inv.blessingLine} onChange={(v) => setInv((d) => (d.blessingLine = v))} />
                <Text label="Hosted by" value={inv.hosts} onChange={(v) => setInv((d) => (d.hosts = v))} placeholder="Mr. & Mrs. …" />
                <Text label="Invitation line" value={inv.inviteText} onChange={(v) => setInv((d) => (d.inviteText = v))} multiline rows={2} />
                <div className="ef-group">
                  <Text label={L.primary} value={inv.primary.name} onChange={(v) => setInv((d) => (d.primary.name = v))} />
                  {inv.secondary && <Text label="Name in your language (optional)" value={inv.primary.nameLocal ?? ""} onChange={(v) => setInv((d) => (d.primary.nameLocal = v || undefined))} placeholder="रोहन / રોહન / ரோஹன்" />}
                  <Text label={L.primarySub} value={inv.primary.subtitle ?? ""} onChange={(v) => setInv((d) => (d.primary.subtitle = v))} />
                  {L.primaryPar && <Text label={L.primaryPar} value={inv.primary.parents ?? ""} onChange={(v) => setInv((d) => (d.primary.parents = v))} />}
                </div>
                {inv.secondary && L.secondary && (
                  <>
                    <Text label="Joining word" value={inv.joiner} onChange={(v) => setInv((d) => (d.joiner = v))} hint={'e.g. "weds", "&", "with"'} />
                    <div className="ef-group">
                      <Text label={L.secondary} value={inv.secondary.name} onChange={(v) => setInv((d) => (d.secondary!.name = v))} />
                      <Text label="Name in your language (optional)" value={inv.secondary.nameLocal ?? ""} onChange={(v) => setInv((d) => (d.secondary!.nameLocal = v || undefined))} placeholder="अनन्या / અનન્યા" />
                      <Text label={L.secondarySub!} value={inv.secondary.subtitle ?? ""} onChange={(v) => setInv((d) => (d.secondary!.subtitle = v))} />
                      <Text label={L.secondaryPar!} value={inv.secondary.parents ?? ""} onChange={(v) => setInv((d) => (d.secondary!.parents = v))} />
                    </div>
                  </>
                )}
                <Upload label={inv.secondary ? "Couple photo (optional)" : "Photo (optional)"} value={inv.photo} onChange={(u) => setInv((d) => (d.photo = u))} hint={inv.secondary ? "Shown in a gold medallion. Without a photo, a monogram is used." : undefined} />
                <Text label="Quote" value={inv.quote ?? ""} onChange={(v) => setInv((d) => (d.quote = v))} multiline rows={2} />
                <Text label="Main ceremony date & time" type="datetime-local" value={inv.mainDateTime} onChange={(v) => setInv((d) => (d.mainDateTime = v))} hint="Drives the live countdown" />
              </Section>

              {inv.secondary && (
                <Section id="story" title="Our story & photos" subtitle={inv.story?.enabled ? `${inv.story.photos.length} photo${inv.story.photos.length === 1 ? "" : "s"}` : "Optional page"} open={open === "story"} onOpen={openSection}>
                  <Toggle label="Add an “Our story” page" checked={!!inv.story?.enabled} onChange={(v) => setInv((d) => (d.story = { title: "Our Story", text: "", photos: [], ...d.story, enabled: v }))} />
                  {inv.story?.enabled && (
                    <>
                      <Text label="Title" value={inv.story.title} onChange={(v) => setInv((d) => (d.story!.title = v))} placeholder="Our Story" />
                      <Text label="A few lines" value={inv.story.text} onChange={(v) => setInv((d) => (d.story!.text = v))} multiline rows={4} placeholder="How you met, the proposal…" hint="Keep it short: about 5 lines fit with photos" />
                      {inv.story.photos.map((ph, i) => (
                        <Upload key={i} label={`Photo ${i + 1}`} value={ph} onChange={(u) => setInv((d) => (u ? (d.story!.photos[i] = u) : void d.story!.photos.splice(i, 1)))} />
                      ))}
                      {inv.story.photos.length < 6 && <Upload key={`new-${inv.story.photos.length}`} label={inv.story.photos.length ? "Add another photo" : "Photos (up to 6)"} onChange={(u) => u && setInv((d) => void d.story!.photos.push(u))} />}
                    </>
                  )}
                </Section>
              )}

              <Section id="events" title="Events" subtitle={`${inv.events.length} event${inv.events.length === 1 ? "" : "s"}`} open={open === "events"} onOpen={openSection}>
                {inv.events.map((e, i) => (
                  <EventEditor
                    key={e.id}
                    e={e}
                    isMain={inv.mainEventId === e.id}
                    wedding={isWedding}
                    first={i === 0}
                    last={i === inv.events.length - 1}
                    onChange={(fn) => setInv((d) => fn(d.events[i]))}
                    onMain={() => setInv((d) => (d.mainEventId = e.id))}
                    onMove={(dir) =>
                      setInv((d) => {
                        const [x] = d.events.splice(i, 1);
                        d.events.splice(i + dir, 0, x);
                      })
                    }
                    onRemove={() => setInv((d) => void d.events.splice(i, 1))}
                  />
                ))}
                <button
                  type="button"
                  className="btn-ghost wide"
                  onClick={() =>
                    setInv((d) =>
                      d.events.push({ id: uid("e"), name: "New event", date: d.mainDateTime.split("T")[0], time: "18:00", venue: "", address: "" }),
                    )
                  }
                >
                  <Icon name="plus" size={16} /> Add event
                </button>
              </Section>

              {(t.category === "wedding" || t.category === "griha-pravesh") && (
                <Section id="family" title="Family & little ones" subtitle={inv.family.enabled ? `${inv.family.names.length} names` : "Hidden"} open={open === "family"} onOpen={openSection}>
                  <Toggle label="Show family page" checked={inv.family.enabled} onChange={(v) => setInv((d) => (d.family.enabled = v))} />
                  {inv.family.enabled && (
                    <>
                      <Text label="Title" value={inv.family.title} onChange={(v) => setInv((d) => (d.family.title = v))} placeholder="With Warm Regards" />
                      <Lines label="Family names" value={inv.family.names} onChange={(v) => setInv((d) => (d.family.names = v))} rows={5} />
                      <Text label="Kids' heading" value={inv.family.kidsTitle} onChange={(v) => setInv((d) => (d.family.kidsTitle = v))} placeholder="Eagerly Awaiting" />
                      <Lines label="Kids' names" value={inv.family.kids} onChange={(v) => setInv((d) => (d.family.kids = v))} rows={3} />
                      <Text label="The little ones' line" value={inv.family.kidsLine ?? ""} onChange={(v) => setInv((d) => (d.family.kidsLine = v))} placeholder="Do come to our Chachu's wedding!" />
                    </>
                  )}
                </Section>
              )}

              <Section id="rsvp" title="RSVP & contacts" subtitle={inv.rsvp.enabled ? "Guests can respond" : "Off"} open={open === "rsvp"} onOpen={openSection}>
                <Toggle label="Collect RSVPs" hint="Guests reply from the card; you see the list on your dashboard" checked={inv.rsvp.enabled} onChange={(v) => setInv((d) => (d.rsvp.enabled = v))} />
                {inv.rsvp.enabled && (
                  <>
                    <Text label="Reply by" type="date" value={inv.rsvp.deadline ?? ""} onChange={(v) => setInv((d) => (d.rsvp.deadline = v || undefined))} />
                    {inv.rsvp.contacts.map((c, i) => (
                      <Row key={i}>
                        <Text label="Contact name" value={c.name} onChange={(v) => setInv((d) => (d.rsvp.contacts[i].name = v))} />
                        <Text label="Phone" type="tel" value={c.phone} onChange={(v) => setInv((d) => (d.rsvp.contacts[i].phone = v))} />
                        <button type="button" className="icon-btn" aria-label="Remove contact" onClick={() => setInv((d) => void d.rsvp.contacts.splice(i, 1))}>
                          <Icon name="trash" size={16} />
                        </button>
                      </Row>
                    ))}
                    {inv.rsvp.contacts.length < 4 && (
                      <button type="button" className="btn-ghost wide" onClick={() => setInv((d) => d.rsvp.contacts.push({ name: "", phone: "" }))}>
                        <Icon name="plus" size={16} /> Add contact
                      </button>
                    )}
                  </>
                )}
              </Section>

              {isWedding && (
                <Section id="info" title="Good to know" subtitle={(inv.info ?? []).length || inv.hashtag ? "Stay, travel, hashtag…" : "Optional page"} open={open === "info"} onOpen={openSection}>
                  <datalist id="info-labels">
                    {INFO_LABELS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                  {(inv.info ?? []).map((r, i) => (
                    <Row key={i}>
                      <label className="ef" style={{ maxWidth: 130 }}>
                        <span className="ef-label">Label</span>
                        <input list="info-labels" value={r.label} onChange={(e) => setInv((d) => (d.info![i].label = e.target.value))} />
                      </label>
                      <Text label="Details" value={r.value} onChange={(v) => setInv((d) => (d.info![i].value = v))} />
                      <button type="button" className="icon-btn" aria-label="Remove line" onClick={() => setInv((d) => void d.info!.splice(i, 1))}>
                        <Icon name="trash" size={16} />
                      </button>
                    </Row>
                  ))}
                  {(inv.info ?? []).length < 6 && (
                    <button type="button" className="btn-ghost wide" onClick={() => setInv((d) => void (d.info = [...(d.info ?? []), { label: INFO_LABELS.find((l) => !(d.info ?? []).some((x) => x.label === l)) ?? "", value: "" }]))}>
                      <Icon name="plus" size={16} /> Add a line (stay, travel, gifts…)
                    </button>
                  )}
                  <Text label="Wedding hashtag" value={inv.hashtag ?? ""} onChange={(v) => setInv((d) => (d.hashtag = v || undefined))} placeholder="#RohanWedsAnanya" />
                  <Text label="Live-stream link" type="url" value={inv.livestream ?? ""} onChange={(v) => setInv((d) => (d.livestream = v || undefined))} placeholder="https://youtube.com/live/…" hint="For guests who can't travel" />
                </Section>
              )}

              <Section id="closing" title="Closing page" subtitle={inv.closing.title} open={open === "closing"} onOpen={openSection}>
                <Text label="Title" value={inv.closing.title} onChange={(v) => setInv((d) => (d.closing.title = v))} placeholder="With Best Compliments From" />
                <Lines label="Names" value={inv.closing.names} onChange={(v) => setInv((d) => (d.closing.names = v))} rows={3} hint="First line is highlighted" />
              </Section>
            </>
          )}

          {biz && (
            <>
              <Section id="front" title="Front" subtitle={biz.company} open={open === "front"} onOpen={openSection}>
                <Text label="Company / brand" value={biz.company} onChange={(v) => setBiz((d) => (d.company = v))} />
                <Text label="Tagline" value={biz.tagline} onChange={(v) => setBiz((d) => (d.tagline = v))} />
                <Upload label="Logo (optional)" value={biz.logo} onChange={(u) => setBiz((d) => (d.logo = u))} hint="PNG with a transparent background works best. Stamp, wood and neon designs print it in their own ink. Without a logo, each design draws its own mark." />
                <div className="ef">
                  <span className="ef-label">Also show on the front</span>
                  <div className="ef-checks">
                    {(
                      [
                        ["name", "Name & designation"],
                        ["contact", "Phone & email"],
                        ["qr", "QR code"],
                      ] as const
                    ).map(([k, label]) => (
                      <label key={k} className={biz.front?.[k] ? "on" : ""}>
                        <input type="checkbox" checked={!!biz.front?.[k]} onChange={(e) => setBiz((d) => (d.front = { ...d.front, [k]: e.target.checked }))} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <span className="ef-hint">For single-sided printing or when the front is what people see first. Each design places these where they fit.</span>
                </div>
              </Section>
              <Section id="photo" title="Photo" subtitle={biz.photo ? "Added" : t.photo ? "This design has a photo slot" : "Optional"} open={open === "photo"} onOpen={openSection}>
                <Upload label="Your photo" value={biz.photo} onChange={(u) => setBiz((d) => (d.photo = u))} hint={t.photo ? "Shown on the front of this design." : "Used by photo designs such as Portrait Pro, Photo Split and Duotone Photo. Switch design to see it."} />
              </Section>
              <Section id="contact" title="Contact details" subtitle={biz.name} open={open === "contact"} onOpen={openSection}>
                <Text label="Full name" value={biz.name} onChange={(v) => setBiz((d) => (d.name = v))} />
                <Text label="Name in your language (optional)" value={biz.nameLocal ?? ""} onChange={(v) => setBiz((d) => (d.nameLocal = v || undefined))} placeholder="e.g. अदिति शर्मा · અદિતિ શર્મા" hint="Hindi, Marathi, Gujarati and more, printed under your name." />
                <Text label="Designation" value={biz.title} onChange={(v) => setBiz((d) => (d.title = v))} />
                <Row>
                  <Text label="Phone" type="tel" value={biz.phone} onChange={(v) => setBiz((d) => (d.phone = v))} />
                  <Text label="Second phone / landline" type="tel" value={biz.phone2 ?? ""} onChange={(v) => setBiz((d) => (d.phone2 = v || undefined))} />
                </Row>
                <Text label="WhatsApp" type="tel" value={biz.whatsapp} onChange={(v) => setBiz((d) => (d.whatsapp = v))} />
                <Text label="Email" type="email" value={biz.email} onChange={(v) => setBiz((d) => (d.email = v))} />
                <Text label="Website" value={biz.website} onChange={(v) => setBiz((d) => (d.website = v))} />
                <Text label="Address" value={biz.address} onChange={(v) => setBiz((d) => (d.address = v))} multiline rows={2} />
                <Lines label="Services" value={biz.services} onChange={(v) => setBiz((d) => (d.services = v))} rows={3} />
              </Section>
              <Section id="extras" title="Extra details" subtitle={(biz.extras ?? []).length ? `${biz.extras!.length} added` : "GSTIN, Reg. No., hours…"} open={open === "extras"} onOpen={openSection}>
                {(biz.extras ?? []).map((x, i) => (
                  <Row key={i}>
                    <Text label="Label" value={x.label} onChange={(v) => setBiz((d) => (d.extras![i].label = v))} placeholder="GSTIN" />
                    <Text label="Value" value={x.value} onChange={(v) => setBiz((d) => (d.extras![i].value = v))} />
                    <button type="button" className="icon-btn" aria-label="Remove" onClick={() => setBiz((d) => void d.extras!.splice(i, 1))}>
                      <Icon name="trash" size={16} />
                    </button>
                  </Row>
                ))}
                {(biz.extras ?? []).length < 3 && (
                  <div className="ef-suggest">
                    {["GSTIN", "Reg. No.", "RERA", "Timings", "License No.", "Enrol. No.", "Other"]
                      .filter((l) => !(biz.extras ?? []).some((x) => x.label === l))
                      .map((l) => (
                        <button key={l} type="button" onClick={() => setBiz((d) => (d.extras = [...(d.extras ?? []), { label: l === "Other" ? "" : l, value: "" }]))}>
                          <Icon name="plus" size={14} /> {l}
                        </button>
                      ))}
                  </div>
                )}
                <span className="ef-hint">Up to 3 lines, printed with your contacts. Doctors, advocates, agents and shops usually need one.</span>
              </Section>
              <Section id="social" title="Social" subtitle={Object.values(biz.socials).filter(Boolean).length ? `${Object.values(biz.socials).filter(Boolean).length} linked` : "Optional"} open={open === "social"} onOpen={openSection}>
                <Row>
                  <Text label="Instagram" value={biz.socials.instagram ?? ""} onChange={(v) => setBiz((d) => (d.socials.instagram = v))} placeholder="handle" />
                  <Text label="LinkedIn" value={biz.socials.linkedin ?? ""} onChange={(v) => setBiz((d) => (d.socials.linkedin = v))} placeholder="profile id" />
                </Row>
                <Row>
                  <Text label="Facebook" value={biz.socials.facebook ?? ""} onChange={(v) => setBiz((d) => (d.socials.facebook = v))} placeholder="page" />
                  <Text label="YouTube" value={biz.socials.youtube ?? ""} onChange={(v) => setBiz((d) => (d.socials.youtube = v))} placeholder="channel" />
                </Row>
                <Text label="X (Twitter)" value={biz.socials.x ?? ""} onChange={(v) => setBiz((d) => (d.socials.x = v))} placeholder="handle" />
              </Section>
            </>
          )}
          <div className="ed-form-foot">
            <button className="btn-primary wide" onClick={save} disabled={saving}>
              {saving ? "Saving…" : cardId ? "Save changes" : "Save & get share link"}
            </button>
          </div>
        </aside>

        <section className="ed-preview">
          <div className="ed-preview-stage">
            {inv ? <InviteViewer templateId={templateId} data={inv} mode="editor" flat index={page} onIndexChange={setPage} /> : <BusinessViewer templateId={templateId} data={biz!} mode="editor" flat />}
          </div>
          {inv && (
            <div className="ed-pages">
              {specs.map((s, i) => (
                <button key={s.key} className={i === page ? "on" : ""} onClick={() => setPage(i)}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
          {biz && <p className="ed-note">Tap the card to see the back · the QR saves your contact straight to a phone</p>}
        </section>
      </div>

      {playing && (
        <div className="play-overlay">
          <button className="play-close" onClick={() => setPlaying(false)} aria-label="Close preview">
            <Icon name="close" />
          </button>
          {inv ? <InviteViewer templateId={templateId} data={inv} mode="live" /> : <BusinessViewer templateId={templateId} data={biz!} mode="live" />}
        </div>
      )}
    </div>
  );
}

function EventEditor({
  e,
  isMain,
  first,
  last,
  onChange,
  onMain,
  onMove,
  onRemove,
  wedding,
}: {
  wedding: boolean;
  e: EventItem;
  isMain: boolean;
  first: boolean;
  last: boolean;
  onChange: (fn: (e: EventItem) => void) => void;
  onMain: () => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="ev-card">
      <div className="ev-head">
        <input className="ev-name" value={e.name} onChange={(x) => onChange((ev) => (ev.name = x.target.value))} aria-label="Event name" />
        <div className="ev-tools">
          <button type="button" className="icon-btn" disabled={first} onClick={() => onMove(-1)} aria-label="Move up">
            <Icon name="up" size={16} />
          </button>
          <button type="button" className="icon-btn" disabled={last} onClick={() => onMove(1)} aria-label="Move down">
            <Icon name="down" size={16} />
          </button>
          <button type="button" className="icon-btn" onClick={onRemove} aria-label="Remove event">
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
      {wedding && (
        <label className="ef">
          <span className="ef-label">Type of event</span>
          <select
            value={e.kind ?? "other"}
            onChange={(x) =>
              onChange((ev) => {
                const next = eventKind(x.target.value as EventKind)!;
                const prev = eventKind(ev.kind);
                // rename only if the name was still a default
                if (!ev.name.trim() || ev.name === "New event" || ev.name === prev?.name) ev.name = next.name;
                if (!ev.dressCode || ev.dressCode === prev?.dress) ev.dressCode = next.dress;
                ev.kind = next.id;
              })
            }
          >
            {EVENT_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <Row>
        <Text label="Date" type="date" value={e.date} onChange={(v) => onChange((ev) => (ev.date = v))} />
        <Text label="Time" type="time" value={e.time} onChange={(v) => onChange((ev) => (ev.time = v))} />
      </Row>
      <Text label="Venue" value={e.venue} onChange={(v) => onChange((ev) => (ev.venue = v))} />
      <Text label="Address" value={e.address} onChange={(v) => onChange((ev) => (ev.address = v))} hint="Used for the map & directions" />
      <Text label="Map link (optional)" type="url" value={e.mapUrl ?? ""} onChange={(v) => onChange((ev) => (ev.mapUrl = v || undefined))} placeholder="https://maps.app.goo.gl/…" hint="Paste the Google Maps share link for exact directions" />
      <Text label="Note (optional)" value={e.note ?? ""} onChange={(v) => onChange((ev) => (ev.note = v || undefined))} placeholder="Muhurat time, lunch to follow…" />
      {wedding && <Text label="Dress code (optional)" value={e.dressCode ?? ""} onChange={(v) => onChange((ev) => (ev.dressCode = v || undefined))} placeholder="Shades of yellow" />}
      {wedding && <Toggle label="Close family & friends only" hint="Hidden on normal links; shown on links you mark “Family” in your dashboard" checked={e.audience === "family"} onChange={(v) => onChange((ev) => (ev.audience = v ? "family" : undefined))} />}
      <label className="ev-main">
        <input type="radio" checked={isMain} onChange={onMain} /> Feature this venue on the “Save the Date” page
      </label>
    </div>
  );
}
