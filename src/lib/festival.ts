import type { EventItem, FestivalKind, InviteData, SymbolKind } from "./types";

/**
 * Festival greeting presets: heading, wish line, a default message and the date.
 * Dates are for 2026 (Diwali on 8 November); users can change any of them.
 */
export interface FestivalPreset {
  id: FestivalKind;
  label: string;
  eyebrow: string;
  mantra: string;
  wish: string;
  message: string;
  date: string;
  symbol: SymbolKind;
  yearLabel?: string;
  closing: string;
}

export const FESTIVALS: FestivalPreset[] = [
  {
    id: "dhanteras",
    label: "Dhanteras",
    eyebrow: "Happy Dhanteras",
    mantra: "|| Shubh Labh ||",
    wish: "May Goddess Lakshmi fill your home with wealth, health and happiness",
    message: "On this auspicious Dhanteras, may every coin you count be a blessing and every day ahead shine like gold. Wishing you and your family prosperity in abundance.",
    date: "2026-11-06T18:30",
    symbol: "kalash",
    closing: "With best wishes",
  },
  {
    id: "diwali",
    label: "Diwali",
    eyebrow: "Happy Diwali",
    mantra: "|| Shubh Deepavali ||",
    wish: "May the festival of lights brighten your life with joy, love and prosperity",
    message: "As the diyas glow and the sky lights up, may your home be filled with warmth, your heart with peace and your year with new beginnings. Wishing you a sparkling Diwali!",
    date: "2026-11-08T19:00",
    symbol: "diya",
    closing: "With love and light",
  },
  {
    id: "nutanvarsh",
    label: "New Year (Nutan Varsh)",
    eyebrow: "Saal Mubarak",
    mantra: "|| Nutan Varshabhinandan ||",
    wish: "Wishing you a happy and prosperous new year",
    message: "May this new year bring fresh hopes, new dreams and countless reasons to smile. Here's to a year of good health, success and togetherness.",
    date: "2026-11-10T08:00",
    symbol: "diya",
    yearLabel: "Vikram Samvat 2083",
    closing: "Warm wishes",
  },
  {
    id: "bhaidooj",
    label: "Bhai Dooj",
    eyebrow: "Happy Bhai Dooj",
    mantra: "|| Shubh Bhai Dooj ||",
    wish: "Celebrating the bond between brothers and sisters",
    message: "To the one who has always had my back: thank you for the laughter, the fights and the forever kind of love. Happy Bhai Dooj!",
    date: "2026-11-11T12:00",
    symbol: "diya",
    closing: "With love",
  },
  {
    id: "newyear",
    label: "Happy New Year (1 Jan)",
    eyebrow: "Happy New Year",
    mantra: "",
    wish: "Cheers to new beginnings",
    message: "Here's to twelve new chapters, 365 new chances and a whole lot of happiness. May the year ahead be your best one yet!",
    date: "2027-01-01T00:00",
    symbol: "none",
    yearLabel: "2027",
    closing: "Cheers",
  },
];

export const festival = (id?: FestivalKind) => FESTIVALS.find((f) => f.id === id) ?? FESTIVALS[1];

/** Applies a festival's wording and date to a greeting (the sender and any celebration are kept). */
export function applyFestival(d: InviteData, id: FestivalKind) {
  const f = festival(id);
  d.festival = id;
  d.eyebrow = f.eyebrow;
  d.mantra = f.mantra;
  d.blessingLine = f.wish;
  d.message = f.message;
  d.mainDateTime = f.date;
  d.symbol = f.symbol;
  d.yearLabel = f.yearLabel;
  d.closing.title = f.closing;
}

/** A sample greeting: the Mehta family's Diwali wishes, with an optional get-together. */
export function festivalSample(palette: string, id: FestivalKind, over: Partial<InviteData> = {}): InviteData {
  const f = festival(id);
  const party: EventItem[] = [
    { id: "f1", kind: "puja", name: "Lakshmi Puja & Diwali Dinner", date: f.date.split("T")[0], time: "19:00", venue: "Mehta Niwas", address: "14, Shanti Park Society, Paldi, Ahmedabad", dressCode: "Festive" },
  ];
  return {
    kind: "invite",
    palette,
    festival: id,
    symbol: f.symbol,
    mantra: f.mantra,
    blessingLine: f.wish,
    eyebrow: f.eyebrow,
    hosts: "",
    inviteText: "",
    primary: { name: "The Mehta Family", subtitle: "Rajesh, Sunita, Aarav & Myra" },
    joiner: "&",
    message: f.message,
    yearLabel: f.yearLabel,
    mainDateTime: f.date,
    mainEventId: "f1",
    events: party,
    family: { enabled: false, title: "From all of us", names: [], kidsTitle: "", kids: [] },
    rsvp: { enabled: true, deadline: undefined, contacts: [{ name: "Rajesh Mehta", phone: "+91 98250 12345" }] },
    closing: { title: f.closing, names: ["The Mehta Family"] },
    music: "santoor",
    effects: { petals: false },
    hashtag: "",
    ...over,
  };
}

/** The words before the sender's name on a greeting cover (the design's own default if unset). */
export const fromText = (d: Pick<InviteData, "fromPrefix">, fallback = "from") => d.fromPrefix?.trim() || fallback;

/** Ready-made sign-off phrases offered in the editor. */
export const FROM_PREFIXES = ["from", "with love from", "warm wishes from", "with best wishes from", "from our family to yours,"];
