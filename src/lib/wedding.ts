import type { EventItem, EventKind, HostSide, InviteData, PersonBlock, SymbolKind, Tradition } from "./types";

/** Event types: label for the editor, a default name, and a dress-code hint. */
export const EVENT_KINDS: { id: EventKind; label: string; name: string; dress?: string }[] = [
  { id: "ganesh", label: "Ganesh Sthapana", name: "Ganesh Sthapana" },
  { id: "mandap", label: "Mandap Muhurat", name: "Mandap Muhurat" },
  { id: "puja", label: "Puja / Grah Shanti", name: "Grah Shanti Puja" },
  { id: "haldi", label: "Haldi", name: "Haldi", dress: "Shades of yellow" },
  { id: "mehendi", label: "Mehendi", name: "Mehendi", dress: "Greens & florals" },
  { id: "sangeet", label: "Sangeet / Garba", name: "Sangeet Sandhya", dress: "Indo-western glam" },
  { id: "mameru", label: "Mameru / Mayra", name: "Mameru" },
  { id: "chooda", label: "Chooda", name: "Chooda Ceremony" },
  { id: "tilak", label: "Tilak / Sagai", name: "Tilak" },
  { id: "baraat", label: "Baraat", name: "Baraat Prasthan", dress: "Safa will be provided" },
  { id: "wedding", label: "Wedding (Pheras)", name: "Shubh Vivah" },
  { id: "anand-karaj", label: "Anand Karaj", name: "Anand Karaj", dress: "Heads covered in the Gurdwara" },
  { id: "nikah", label: "Nikah", name: "Nikah" },
  { id: "walima", label: "Walima", name: "Walima" },
  { id: "church", label: "Church Wedding", name: "Holy Matrimony" },
  { id: "reception", label: "Reception", name: "Reception", dress: "Formal / festive" },
  { id: "cocktail", label: "Cocktail Party", name: "Cocktail Evening", dress: "Black tie" },
  { id: "other", label: "Other", name: "Celebration" },
];

export const eventKind = (k?: EventKind) => EVENT_KINDS.find((x) => x.id === k);

/** Default texts and programme for each tradition. Applied from the editor; the user can edit everything after. */
export interface TraditionPreset {
  id: Tradition;
  label: string;
  symbol: SymbolKind;
  mantra: string;
  blessingLine: string;
  joiner: string;
  eyebrow: string;
  closingTitle: string;
  /** event kinds with a day offset from the main day and a time */
  programme: [EventKind, number, string][];
}

export const TRADITIONS: TraditionPreset[] = [
  {
    id: "hindu",
    label: "Hindu",
    symbol: "ganesha",
    mantra: "|| Shri Ganeshaya Namah ||",
    blessingLine: "With the divine blessings of Lord Ganesha and the grace of our elders",
    joiner: "weds",
    eyebrow: "Wedding Invitation",
    closingTitle: "With Best Compliments From",
    programme: [["ganesh", -2, "09:00"], ["haldi", -2, "16:00"], ["mehendi", -1, "11:00"], ["sangeet", -1, "19:30"], ["wedding", 0, "19:30"], ["reception", 1, "19:00"]],
  },
  {
    id: "jain",
    label: "Jain",
    symbol: "swastik",
    mantra: "|| Namo Arihantanam ||",
    blessingLine: "With the blessings of Bhagwan Mahavir and the grace of our elders",
    joiner: "weds",
    eyebrow: "Shubh Vivah",
    closingTitle: "With Warm Regards",
    programme: [["puja", -2, "09:00"], ["mameru", -1, "11:00"], ["sangeet", -1, "19:30"], ["wedding", 0, "11:00"], ["reception", 0, "18:30"]],
  },
  {
    id: "sikh",
    label: "Sikh",
    symbol: "khanda",
    mantra: "Ik Onkar",
    blessingLine: "With the blessings of Waheguru and the grace of our elders",
    joiner: "&",
    eyebrow: "Anand Karaj",
    closingTitle: "With Love & Regards",
    programme: [["chooda", -1, "10:00"], ["mehendi", -1, "16:00"], ["sangeet", -1, "20:00"], ["anand-karaj", 0, "10:00"], ["reception", 0, "19:30"]],
  },
  {
    id: "muslim",
    label: "Muslim",
    symbol: "crescent",
    mantra: "Bismillah ir-Rahman ir-Rahim",
    blessingLine: "With the blessings of Allah and the duas of our elders",
    joiner: "&",
    eyebrow: "Nikah Invitation",
    closingTitle: "With Best Compliments From",
    programme: [["haldi", -2, "16:00"], ["mehendi", -1, "19:00"], ["nikah", 0, "13:00"], ["walima", 1, "20:00"]],
  },
  {
    id: "christian",
    label: "Christian",
    symbol: "cross",
    mantra: "What God has joined together, let no one separate",
    blessingLine: "By the grace of God and with the blessings of our families",
    joiner: "&",
    eyebrow: "Wedding Invitation",
    closingTitle: "With Love From",
    programme: [["church", 0, "16:00"], ["reception", 0, "19:30"]],
  },
  {
    id: "civil",
    label: "Non-religious",
    symbol: "none",
    mantra: "",
    blessingLine: "Together with their families",
    joiner: "&",
    eyebrow: "Save the Date",
    closingTitle: "See You There",
    programme: [["sangeet", -1, "19:30"], ["wedding", 0, "18:00"], ["reception", 0, "20:00"]],
  },
];

export const tradition = (id?: Tradition) => TRADITIONS.find((x) => x.id === id) ?? TRADITIONS[0];

function shiftDate(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** Applies a tradition's wording (and optionally its programme of events) to a card. */
export function applyTradition(d: InviteData, id: Tradition, withEvents: boolean) {
  const pre = tradition(id);
  d.tradition = id;
  d.symbol = pre.symbol;
  d.mantra = pre.mantra;
  d.blessingLine = pre.blessingLine;
  d.joiner = pre.joiner;
  d.eyebrow = pre.eyebrow;
  d.closing.title = pre.closingTitle;
  if (!withEvents) return;
  const main = d.mainDateTime.split("T")[0];
  const venue = d.events.find((e) => e.id === d.mainEventId) ?? d.events[0];
  d.events = pre.programme.map(([kind, off, time], i): EventItem => {
    const k = eventKind(kind)!;
    return { id: `e${i + 1}`, kind, name: k.name, date: shiftDate(main, off), time, venue: venue?.venue ?? "", address: venue?.address ?? "", dressCode: k.dress };
  });
  const mainEv = d.events.find((e) => e.date === main && ["wedding", "anand-karaj", "nikah", "church"].includes(e.kind!)) ?? d.events[0];
  d.mainEventId = mainEv?.id;
}

/** The couple in display order: a bride's-family card names the bride first. */
export function coupleOrder(d: InviteData): [PersonBlock, PersonBlock | undefined] {
  if (d.hostSide === "bride" && d.secondary?.name) return [d.secondary, d.primary];
  return [d.primary, d.secondary];
}

/** Default invitation line for who is hosting. */
export function hostLine(side: HostSide): string {
  if (side === "bride") return "request the honour of your presence at the wedding of their daughter";
  if (side === "groom") return "request the honour of your presence at the wedding of their son";
  return "together with their families, joyfully invite you to celebrate the wedding of";
}

/**
 * What a guest may see. Links made without `g=family` drop family-only events,
 * so the details never reach the page at all.
 */
export function forAudience(d: InviteData, audience?: string): InviteData {
  if (audience === "family" || !d.events.some((e) => e.audience === "family")) return d;
  const events = d.events.filter((e) => e.audience !== "family");
  const mainEventId = events.some((e) => e.id === d.mainEventId) ? d.mainEventId : events[0]?.id;
  return { ...d, events, mainEventId };
}

/** Suggested labels for the "Good to know" lines. */
export const INFO_LABELS = ["Stay", "Travel", "Parking", "Dress code", "Gifts", "Weather", "Kids", "Contact"];
