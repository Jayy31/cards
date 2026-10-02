"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Rsvp, StoredCard } from "@/lib/types";
import { getTemplate } from "@/lib/templates";
import { inviteTitle } from "@/lib/format";
import { buildPages } from "@/components/card/InvitePages";
import InviteViewer from "@/components/viewer/InviteViewer";
import BusinessViewer from "@/components/business/BusinessViewer";
import { Icon } from "@/components/viewer/icons";

function useOrigin() {
  const [o, setO] = useState("");
  useEffect(() => setO(window.location.origin), []);
  return o;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn-ghost"
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      <Icon name={done ? "check" : "copy"} size={16} /> {done ? "Copied" : label}
    </button>
  );
}

function VideoExport({ cardId }: { cardId: string }) {
  const [state, setState] = useState<{ status: string; progress: number; key?: string; error?: string }>({ status: "none", progress: 0 });
  useEffect(() => {
    fetch(`/api/video?card=${cardId}`)
      .then((r) => r.json())
      .then(setState)
      .catch(() => {});
  }, [cardId]);
  useEffect(() => {
    if (state.status !== "rendering" && state.status !== "encoding") return;
    const id = setInterval(async () => {
      const j = await fetch(`/api/video?card=${cardId}`).then((r) => r.json());
      setState(j);
    }, 2000);
    return () => clearInterval(id);
  }, [state.status, cardId]);
  const start = async () => {
    setState({ status: "rendering", progress: 0 });
    const j = await fetch(`/api/video?card=${cardId}`, { method: "POST" }).then((r) => r.json());
    setState(j);
  };
  if (state.status === "done" && state.key)
    return (
      <a className="btn-primary" href={`/api/video/file?key=${state.key}`}>
        <Icon name="download" size={18} /> Download video (MP4)
      </a>
    );
  if (state.status === "rendering" || state.status === "encoding")
    return (
      <div>
        <div className="progress">
          <i style={{ width: `${Math.round(state.progress * 100)}%` }} />
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          {state.status === "encoding" ? "Adding music & finishing…" : `Rendering frames · ${Math.round(state.progress * 100)}%`} — you can keep using this page.
        </p>
      </div>
    );
  return (
    <div>
      <button className="btn-primary" onClick={start}>
        <Icon name="video" size={18} /> Create WhatsApp video
      </button>
      {state.status === "error" && <p className="form-error">Video failed: {state.error}</p>}
    </div>
  );
}

export default function Dashboard({ card, rsvps, isNew }: { card: StoredCard; rsvps: Rsvp[]; isNew: boolean }) {
  const t = getTemplate(card.templateId)!;
  const d = card.data;
  const origin = useOrigin();
  const link = `${origin}/i/${card.id}`;
  const title = d.kind === "invite" ? inviteTitle(d) : `${d.name} · ${d.company}`;
  const [guestText, setGuestText] = useState("");
  /** guests whose link also shows family-only events */
  const [family, setFamily] = useState<Set<string>>(new Set());
  const hasPrivate = d.kind === "invite" && d.events.some((e) => e.audience === "family");
  const guests = guestText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const pages = useMemo(() => (d.kind === "invite" ? buildPages(t, d) : [{ key: "front", label: "Front" }, { key: "back", label: "Back" }]), [t, d]);
  const greeting = t.category === "festival";
  const waText = (url: string, who?: string) =>
    d.kind !== "invite"
      ? `${d.name} · ${d.company}\n${url}`
      : greeting
        ? `${who ? `Dear ${who},\n` : ""}${d.eyebrow}! 🪔 A little something from ${d.primary.name}.\n\nOpen your greeting: ${url}`
        : `${who ? `Dear ${who},\n` : ""}You are cordially invited — ${d.eyebrow}: ${title} 🙏\n\nOpen your invitation: ${url}`;

  const stats = useMemo(() => {
    const yes = rsvps.filter((r) => r.attending === "yes");
    return {
      responses: rsvps.length,
      attending: yes.length,
      guests: yes.reduce((s, r) => s + (r.guests || 0), 0),
      declined: rsvps.filter((r) => r.attending === "no").length,
    };
  }, [rsvps]);

  return (
    <div className="dash">
      <nav className="dash-nav">
        <Link href="/" className="brand-sm">
          <span className="brand-mark">✦</span> Shubh Cards
        </Link>
        <Link href={`/create/${t.id}?card=${card.id}`} className="btn-ghost">
          <Icon name="edit" size={16} /> Edit card
        </Link>
      </nav>
      <div className="dash-hero">
        <div className="dash-card-prev">{d.kind === "invite" ? <InviteViewer templateId={t.id} data={d} mode="thumb" flat /> : <BusinessViewer templateId={t.id} data={d} mode="thumb" flat />}</div>
        <div className="dash-col">
          <div className="dash-panel">
            {isNew && <div className="dash-new">{greeting ? "Your greeting is ready! Share it on WhatsApp, or download it below for your Status and Instagram." : "Your card is live! Share the link below — every guest gets the full envelope experience."}</div>}
            <h2>{title}</h2>
            <div className="linkbox">
              <input readOnly value={link} onFocus={(e) => e.target.select()} />
              <CopyButton text={link} />
            </div>
            <div className="btn-row">
              <a className="btn-primary btn-wa" href={`https://wa.me/?text=${encodeURIComponent(waText(link))}`} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} /> Share on WhatsApp
              </a>
              <a className="btn-ghost" href={`/i/${card.id}`} target="_blank" rel="noreferrer">
                <Icon name="eye" size={16} /> Open card
              </a>
            </div>
          </div>

          {greeting && (
            <div className="dash-panel">
              <h3>For Status &amp; Instagram</h3>
              <p className="muted">Download the animated video for WhatsApp Status and Instagram Stories or Reels, or the cover image for a post.</p>
              <VideoExport cardId={card.id} />
              <div className="dl-grid">
                <a className="btn-ghost" href={`/api/export?card=${card.id}&format=png&page=0`}>
                  <Icon name="image" size={16} /> Cover image
                </a>
                <a className="btn-ghost" href={`/api/export?card=${card.id}&format=png&page=1`}>
                  <Icon name="image" size={16} /> Message image
                </a>
              </div>
            </div>
          )}

          {d.kind === "invite" && (
            <details className="dash-panel" open>
              <summary>
                <h3>{greeting ? "Send it personally" : "Personal invitations"}</h3>
              </summary>
              <p className="muted">{greeting ? "Sending to someone in a private chat? Add their name and they get their own copy that greets them by name (“For Sharma Uncle”, or “Dear Priya,” on letter designs). Paste one name per line, then send each link." : "Each guest sees their name on the envelope (“To, Sharma Family”) and on the cover. Paste one name per line."}{hasPrivate && " Tick “Family” for guests who should also see your family-only events."}</p>
              <textarea className="ef" style={{ font: "inherit", padding: 10, borderRadius: 10, border: "1px solid var(--ui-line)", minHeight: 90 }} value={guestText} onChange={(e) => setGuestText(e.target.value)} placeholder={"Sharma Family\nMr. & Mrs. Patel\nRiya & Kunal"} />
              {guests.length > 0 && (
                <div className="guest-list">
                  {guests.map((g, i) => {
                    const fam = hasPrivate && family.has(g);
                    const url = `${link}?to=${encodeURIComponent(g)}${fam ? "&g=family" : ""}`;
                    return (
                      <div className="guest-row" key={i}>
                        <span>{g}</span>
                        {hasPrivate && (
                          <label className="guest-fam" title="Also show family-only events">
                            <input
                              type="checkbox"
                              checked={fam}
                              onChange={(e) =>
                                setFamily((s) => {
                                  const n = new Set(s);
                                  if (e.target.checked) n.add(g);
                                  else n.delete(g);
                                  return n;
                                })
                              }
                            />{" "}
                            Family
                          </label>
                        )}
                        <CopyButton text={url} label="Link" />
                        <a className="btn-ghost" href={`https://wa.me/?text=${encodeURIComponent(waText(url, g))}`} target="_blank" rel="noreferrer">
                          <Icon name="whatsapp" size={16} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </details>
          )}

          <div className="dash-panel">
            <h3>{greeting ? "More downloads" : "Downloads"}</h3>
            <p className="muted">{d.kind === "invite" ? "For relatives who prefer forwarding a video or image on WhatsApp — and a print-ready PDF." : "A 10-second animated video for WhatsApp status, a print-ready PDF (front & back) or images."}</p>
            {!greeting && <VideoExport cardId={card.id} />}
            <div className="dl-grid">
              <a className="btn-ghost" href={`/api/export?card=${card.id}&format=pdf`}>
                <Icon name="file" size={16} /> PDF (all pages)
              </a>
              {pages.map((p, i) => (
                <a key={p.key} className="btn-ghost" href={`/api/export?card=${card.id}&format=png&page=${i}`}>
                  <Icon name="image" size={16} /> {p.label}
                </a>
              ))}
            </div>
          </div>

          {d.kind === "invite" && d.rsvp.enabled && (
            <div className="dash-panel">
              <h3>RSVPs</h3>
              <div className="stats">
                <div className="stat">
                  <strong>{stats.responses}</strong>
                  <span>Responses</span>
                </div>
                <div className="stat">
                  <strong>{stats.attending}</strong>
                  <span>Attending</span>
                </div>
                <div className="stat">
                  <strong>{stats.guests}</strong>
                  <span>Total guests</span>
                </div>
                <div className="stat">
                  <strong>{stats.declined}</strong>
                  <span>Declined</span>
                </div>
              </div>
              {rsvps.length === 0 ? (
                <p className="muted">No responses yet. They appear here as guests reply from the card.</p>
              ) : (
                <table className="rsvp-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Reply</th>
                      <th>Guests</th>
                      <th className="hide-sm">Events</th>
                      <th className="hide-sm">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...rsvps].reverse().map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.name}</strong>
                          {r.phone && <div className="muted">{r.phone}</div>}
                        </td>
                        <td>
                          <span className={`pill ${r.attending}`}>{r.attending === "yes" ? "Attending" : r.attending === "no" ? "Declined" : "Maybe"}</span>
                        </td>
                        <td>{r.attending === "no" ? "—" : r.guests}</td>
                        <td className="hide-sm">{r.events.map((id) => d.events.find((e) => e.id === id)?.name).filter(Boolean).join(", ")}</td>
                        <td className="hide-sm">{r.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
