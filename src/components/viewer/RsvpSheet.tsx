"use client";
import { useState } from "react";
import type { InviteData } from "@/lib/types";
import { fmtShortDate } from "@/lib/format";
import { Icon } from "./icons";

export default function RsvpSheet({ open, onClose, data, cardId, guest }: { open: boolean; onClose: () => void; data: InviteData; cardId?: string; guest?: string }) {
  const [name, setName] = useState(guest ?? "");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "maybe">("yes");
  const [guests, setGuests] = useState(2);
  const [events, setEvents] = useState<string[]>(data.events.map((e) => e.id));
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setState("sending");
    try {
      if (cardId) {
        const res = await fetch(`/api/cards/${cardId}/rsvp`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, phone, attending, guests: attending === "no" ? 0 : guests, events: attending === "no" ? [] : events, message, invitedAs: guest }),
        });
        if (!res.ok) throw new Error();
      }
      setState("done");
    } catch {
      setState("error");
    }
  };

  const toggleEvent = (id: string) => setEvents((ev) => (ev.includes(id) ? ev.filter((x) => x !== id) : [...ev, id]));

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="RSVP">
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        {state === "done" ? (
          <div className="sheet-done">
            <div className="sheet-done-mark">
              <Icon name="check" size={30} />
            </div>
            <h3>{attending === "no" ? "We'll miss you!" : "Thank you!"}</h3>
            <p>{attending === "no" ? "Thank you for letting us know. Your blessings mean a lot." : "Your response has been sent to the family. We can't wait to celebrate with you."}</p>
            <button className="btn-primary" onClick={onClose}>
              Back to the invitation
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3>Will you join us?</h3>
            {data.rsvp.deadline && <p className="sheet-sub">Kindly respond by {fmtShortDate(data.rsvp.deadline)}</p>}
            <label className="field">
              <span>Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sharma Family" required />
            </label>
            <label className="field">
              <span>Phone (optional)</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="+91" />
            </label>
            <div className="seg">
              {(["yes", "maybe", "no"] as const).map((a) => (
                <button type="button" key={a} className={attending === a ? "on" : ""} onClick={() => setAttending(a)}>
                  {a === "yes" ? "Joyfully accept" : a === "maybe" ? "Maybe" : "Regretfully decline"}
                </button>
              ))}
            </div>
            {attending !== "no" && (
              <>
                <div className="field">
                  <span>Number of guests</span>
                  <div className="stepper">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                      −
                    </button>
                    <strong>{guests}</strong>
                    <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))}>
                      +
                    </button>
                  </div>
                </div>
                {data.events.length > 1 && (
                  <div className="field">
                    <span>Attending</span>
                    <div className="chips">
                      {data.events.map((e) => (
                        <button type="button" key={e.id} className={events.includes(e.id) ? "chip on" : "chip"} onClick={() => toggleEvent(e.id)}>
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <label className="field">
              <span>Blessings / message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Wishing you a lifetime of happiness…" />
            </label>
            {state === "error" && <p className="form-error">Couldn&apos;t send right now. Please try again.</p>}
            <button className="btn-primary wide" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send RSVP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
