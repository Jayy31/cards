/*
 * Gujarati business cards: single-side, print-first visiting cards.
 * The user fills one set of details and it is applied to every design at once,
 * so every design must work for any trade (no trade-specific motifs) and any text length.
 * Card size: 3.5 × 2 in, drawn at 700 × 400 (200 px/in). Export at 3× for 600 dpi print.
 */

export type GujPhoneLabel = "mobile" | "office" | "whatsapp";
export interface GujPhone {
  number: string;
  /** shown as an icon: handset, desk telephone or WhatsApp (default mobile) */
  label?: GujPhoneLabel;
}
export interface GujPerson {
  name?: string;
  /** title or degree: પ્રોપ્રાઇટર, M.B.B.S., Managing Director… */
  role?: string;
  phones: GujPhone[];
}

/** Card limits: more than this no longer reads at 3.5 × 2 in. */
export const GUJ_MAX_PEOPLE = 3;
export const GUJ_MAX_PHONES_EACH = 2;
export const GUJ_MAX_PHONES = 4;

export interface GujCardData {
  /** firm / shop name: the headline of every design */
  business: string;
  /** owners / partners with their numbers (up to 3 people, 2 numbers each, 4 numbers in all) */
  people?: GujPerson[];
  /** single owner, older shape (still read; `people` wins when present) */
  owner?: string;
  role?: string;
  /** what the business does: services, products or timings, 1–3 lines */
  description?: string;
  /** single phone, older shape */
  phone?: string;
  email?: string;
  /** location / full address */
  address?: string;
  /** logo image (URL or data URI) */
  logo?: string;
}

export type GujLang = "gu" | "mix";

export interface GujTemplate {
  id: string;
  name: string;
  /** trade the sample is written for; the design itself suits any business */
  trade: string;
  lang: GujLang;
  sample: GujCardData;
}

export const GUJ_W = 700;
export const GUJ_H = 400;

export const GUJ_TEMPLATES: GujTemplate[] = [
  {
    id: "gu-pedhi",
    name: "Pedhi",
    trade: "Kirana & traders",
    lang: "gu",
    sample: {
      business: "શ્રી ઉમિયા ટ્રેડર્સ",
      people: [
        { name: "રમેશભાઈ પટેલ", phones: [{ number: "૯૮૨૫૦ ૧૨૩૪૫" }] },
        { name: "સુરેશભાઈ પટેલ", phones: [{ number: "૯૪૨૭૦ ૫૫૬૬૭" }] },
      ],
      description: "અહીં અનાજ, કઠોળ, તેલ, મસાલા તથા કરિયાણાની તમામ ચીજવસ્તુઓ હોલસેલ તથા છૂટક ભાવે મળશે.",
      address: "૧૨, સરદાર માર્કેટ, સ્ટેશન રોડ, આણંદ - ૩૮૮૦૦૧",
    },
  },
  {
    id: "gu-sonu",
    name: "Sonu Chandi",
    trade: "Jewellers",
    lang: "gu",
    sample: {
      business: "શ્રી અંબિકા જ્વેલર્સ",
      owner: "હસમુખભાઈ સોની",
      description: "૯૧૬ હોલમાર્ક સોના-ચાંદીના દાગીના, ડાયમંડ જ્વેલરી તથા જૂના દાગીનાના શ્રેષ્ઠ ભાવ.",
      phone: "૯૮૭૯૧ ૪૫૬૭૮",
      address: "માંડવી ચોક, મેઈન બજાર, રાજકોટ",
    },
  },
  {
    id: "gu-keri",
    name: "Keri",
    trade: "Saree & textile",
    lang: "gu",
    sample: {
      business: "રાધિકા સાડી સેન્ટર",
      owner: "કિશોરભાઈ ઠક્કર",
      description: "બનારસી, પટોળા, બાંધણી તથા ડિઝાઇનર સાડીઓ અને ડ્રેસ મટીરીયલનો વિશાળ સંગ્રહ.",
      phone: "૯૪૨૭૦ ૮૮૯૯૦",
      email: "radhikasaree@gmail.com",
      address: "રતનપોળ, ગાંધી રોડ, અમદાવાદ",
    },
  },
  {
    id: "gu-toran",
    name: "Toran",
    trade: "Caterers & decorators",
    lang: "gu",
    sample: {
      business: "શ્રીજી કેટરર્સ",
      owner: "મહેશભાઈ જોષી (મહારાજ)",
      description: "લગ્ન, જનોઈ, સીમંત તથા દરેક શુભ પ્રસંગ માટે ગુજરાતી, કાઠિયાવાડી, પંજાબી અને ચાઇનીઝ ભોજનના ઓર્ડર લેવામાં આવે છે.",
      phone: "૯૮૯૮૩ ૨૧૦૦૫",
      address: "૧૫, ગોકુલ સોસાયટી, વાઘોડિયા રોડ, વડોદરા",
    },
  },
  {
    id: "gu-nakkar",
    name: "Nakkar",
    trade: "Hardware & electrical",
    lang: "mix",
    sample: {
      business: "જય ખોડિયાર હાર્ડવેર",
      people: [{ name: "Bharat Patel", phones: [{ number: "98250 67890" }, { number: "0260 2431122", label: "office" }] }],
      description: "પ્લમ્બિંગ, ઇલેક્ટ્રિકલ, સેનિટરી તથા કન્સ્ટ્રક્શનનો તમામ સામાન વાજબી ભાવે.",
      email: "jaykhodiyarhw@gmail.com",
      address: "Shop 4, GIDC Main Road, Vapi, Gujarat 396195",
    },
  },
  {
    id: "gu-tulsi",
    name: "Tulsi",
    trade: "Doctors & clinics",
    lang: "mix",
    sample: {
      business: "શ્રીજી ક્લિનિક",
      owner: "Dr. Nilesh Shah",
      role: "M.B.B.S., M.D. (Medicine)",
      description: "સમય: સવારે ૧૦ થી ૧ • સાંજે ૫ થી ૮ (રવિવારે બંધ)",
      phone: "079 2654 3210",
      email: "shreejiclinic@gmail.com",
      address: "1st Floor, Sahjanand Complex, Maninagar, Ahmedabad",
    },
  },
  {
    id: "gu-pathshala",
    name: "Pathshala",
    trade: "Tuition & education",
    lang: "mix",
    sample: {
      business: "જ્ઞાનદીપ ક્લાસીસ",
      owner: "Prof. Hetal Desai",
      role: "M.Sc., B.Ed.",
      description: "ધોરણ ૮ થી ૧૨ (ગુજરાતી તથા અંગ્રેજી માધ્યમ) ગણિત, વિજ્ઞાન અને અંગ્રેજી માટે ખાસ બેચ.",
      phone: "99099 11223",
      email: "gnandeepclasses@gmail.com",
      address: "B-12, Shivam Arcade, Adajan, Surat",
    },
  },
  {
    id: "gu-shilp",
    name: "Shilp",
    trade: "Builders & real estate",
    lang: "mix",
    sample: {
      business: "Shivalay Infracon",
      owner: "નરેશભાઈ પટેલ",
      role: "Managing Director",
      description: "રેસિડેન્શિયલ તથા કમર્શિયલ પ્રોજેક્ટ્સ • પ્લોટિંગ • રી-ડેવલપમેન્ટ",
      phone: "+91 98240 55667",
      email: "info@shivalayinfra.in",
      address: "Shivalay House, Science City Road, Ahmedabad",
    },
  },
];

/** The people on a card, from `people` or the older owner/role/phone fields. Empty entries are dropped. */
export function peopleOf(d: GujCardData): GujPerson[] {
  const src: GujPerson[] = d.people?.length ? d.people : [{ name: d.owner, role: d.role, phones: d.phone ? [{ number: d.phone }] : [] }];
  return src
    .map((p) => ({ name: p.name?.trim() || undefined, role: p.role?.trim() || undefined, phones: p.phones.filter((x) => x.number.trim()) }))
    .filter((p) => p.name || p.role || p.phones.length);
}

/** First word of a name ("રમેશભાઈ પટેલ" → "રમેશભાઈ"), used to tag numbers when a card has several people. */
export const firstName = (n?: string) => (n ? n.replace(/^(ડૉ\.|ડો\.|Dr\.?|Prof\.?|પ્રો\.)\s*/i, "").split(/\s+/)[0] : "");

/** Stress-test data (`?fill=long` / `?fill=min` / `?fill=team` on /gujarati). */
export const GUJ_STRESS: Record<string, GujCardData> = {
  long: {
    business: "શ્રી જલારામ ટ્રેડિંગ એન્ડ જનરલ સપ્લાય કંપની",
    owner: "પ્રવીણચંદ્ર જયંતીલાલ ચંદારાણા",
    role: "પ્રોપ્રાઇટર તથા મેનેજિંગ પાર્ટનર",
    description:
      "અહીં અનાજ, કઠોળ, તેલ, મસાલા, ડ્રાયફ્રૂટ, પૂજાપો તથા કરિયાણાની તમામ ચીજવસ્તુઓ હોલસેલ તથા છૂટક ભાવે મળશે. હોમ ડિલિવરીની સુવિધા ઉપલબ્ધ છે. દરેક તહેવારમાં ખાસ ઓફર.",
    phone: "૯૮૨૫૦ ૧૨૩૪૫, ૯૪૨૭૦ ૫૫૬૬૭",
    email: "shreejalaramtrading.generalsupply@gmail.com",
    address: "દુકાન નં. ૧૨-૧૩, સરદાર પટેલ શોપિંગ સેન્ટર, જૂના બસ સ્ટેશન સામે, સ્ટેશન રોડ, આણંદ - ૩૮૮૦૦૧",
  },
  min: {
    business: "ગણેશ સ્ટોર્સ",
    phone: "98250 12345",
  },
  team: {
    business: "શ્રી ખોડિયાર ઇલેક્ટ્રિક એન્ડ હાર્ડવેર",
    people: [
      { name: "રમેશભાઈ પટેલ", role: "પ્રોપ્રાઇટર", phones: [{ number: "98250 12345" }, { number: "94270 55667", label: "whatsapp" }] },
      { name: "સુરેશભાઈ પટેલ", phones: [{ number: "99090 11223" }] },
      { name: "જયેશ પટેલ", phones: [{ number: "02692 245678", label: "office" }] },
    ],
    description: "ઇલેક્ટ્રિકલ, પ્લમ્બિંગ તથા સેનિટરીનો તમામ સામાન હોલસેલ તથા છૂટક ભાવે મળશે.",
    email: "khodiyarelectric@gmail.com",
    address: "૧૨, સરદાર માર્કેટ, સ્ટેશન રોડ, આણંદ - ૩૮૮૦૦૧",
  },
};

/** First visible letter (grapheme), for the monogram shown when there is no logo. */
export function initial(s: string): string {
  const t = s.replace(/^(શ્રી|શ્રીમતી|ડૉ\.|ડો\.|Shree|Shri|Sri|Dr\.?)\s+/i, "").trim() || s.trim();
  if (!t) return "";
  // Hand-rolled so server and browser agree (ICU versions split Gujarati conjuncts differently).
  const cs = Array.from(t);
  let out = cs[0];
  // keep nukta + virama conjuncts (જ્ઞ), drop vowel signs so the monogram is a clean letter
  const mark = (c: string) => /[઼્]/.test(c);
  for (let i = 1; i < cs.length; i++) {
    if (mark(cs[i])) out += cs[i];
    else if (out.endsWith("્") && /[ક-હ]/.test(cs[i])) out += cs[i];
    else break;
  }
  return out.toUpperCase();
}

/* ---------- colour themes ---------- */

/** A colour theme: CSS custom properties set on the card root (each design reads its own set). */
export interface GujPalette {
  id: string;
  name: string;
  /** two colours for the picker dot */
  swatch: [string, string];
  vars: Record<string, string>;
}

const pal = (id: string, name: string, swatch: [string, string], vars: Record<string, string>): GujPalette => ({ id, name, swatch, vars });

/** First palette of each design is its original look. */
export const GUJ_PALETTES: Record<string, GujPalette[]> = {
  "gu-pedhi": [
    pal("classic", "Lal-Vadli", ["#c4122f", "#1d3a8a"], { "--accent": "#c4122f", "--ink": "#1d3a8a", "--bg1": "#fffbe6", "--bg2": "#fff3c2", "--on-accent": "#fff8dc" }),
    pal("kesar", "Kesar", ["#c2410c", "#5b1a1a"], { "--accent": "#c2410c", "--ink": "#5b1a1a", "--bg1": "#fffaf0", "--bg2": "#ffe9c7", "--on-accent": "#fff7e6" }),
    pal("leelo", "Leelo", ["#166534", "#14365a"], { "--accent": "#166534", "--ink": "#14365a", "--bg1": "#fbfef4", "--bg2": "#eaf6d6", "--on-accent": "#f4fbe9" }),
    pal("neelam", "Neelam", ["#1e3a8a", "#7f1d1d"], { "--accent": "#1e3a8a", "--ink": "#7f1d1d", "--bg1": "#f8faff", "--bg2": "#e3ebfb", "--on-accent": "#eef3ff" }),
  ],
  "gu-sonu": [
    pal("maroon", "Maroon & gold", ["#6b1426", "#e2bd63"], { "--bg-a": "#4a0b18", "--bg-b": "#6b1426", "--bg-c": "#3d0813", "--glow": "rgba(140, 26, 48, 0.9)", "--metal": "#e2bd63", "--metal-hi": "#fbe7a8", "--metal-lo": "#a8822f", "--text": "#f6e7c8", "--soft": "#f3e1bd" }),
    pal("emerald", "Emerald & gold", ["#0b4a36", "#e2bd63"], { "--bg-a": "#062b20", "--bg-b": "#0b4a36", "--bg-c": "#04221a", "--glow": "rgba(20, 110, 80, 0.75)", "--metal": "#e2bd63", "--metal-hi": "#fbe7a8", "--metal-lo": "#a8822f", "--text": "#f1ead2", "--soft": "#e6dfc4" }),
    pal("navy", "Navy & silver", ["#13234a", "#d6dbe3"], { "--bg-a": "#0b1530", "--bg-b": "#16295a", "--bg-c": "#081024", "--glow": "rgba(50, 80, 160, 0.7)", "--metal": "#c9d1dc", "--metal-hi": "#f7f9fc", "--metal-lo": "#8792a3", "--text": "#eef1f6", "--soft": "#d9dee8" }),
    pal("black", "Black & gold", ["#151313", "#e2bd63"], { "--bg-a": "#0d0c0c", "--bg-b": "#221e1c", "--bg-c": "#080707", "--glow": "rgba(90, 70, 40, 0.55)", "--metal": "#e2bd63", "--metal-hi": "#fbe7a8", "--metal-lo": "#a8822f", "--text": "#f3ead6", "--soft": "#ddd3bd" }),
  ],
  "gu-keri": [
    pal("rani", "Rani & green", ["#a3134f", "#0f5c4b"], { "--panel": "#a3134f", "--panel-hi": "#b5185a", "--panel-lo": "#7e0d3c", "--edge": "#8f1045", "--motif": "#d84a83", "--second": "#0f5c4b", "--gold": "#f2c14e", "--paper1": "#fffaf3", "--paper2": "#fbeedd", "--text": "#3b2330", "--desc": "#5a4049" }),
    pal("peacock", "Peacock", ["#0b5d6b", "#b45309"], { "--panel": "#0b5d6b", "--panel-hi": "#0f7383", "--panel-lo": "#06414b", "--edge": "#084a55", "--motif": "#3c95a3", "--second": "#9a3412", "--gold": "#f2c14e", "--paper1": "#f7fcfb", "--paper2": "#e3f1ef", "--text": "#1f3133", "--desc": "#3f5557" }),
    pal("galgota", "Galgota", ["#c2410c", "#14532d"], { "--panel": "#c2410c", "--panel-hi": "#d9530f", "--panel-lo": "#8f2f08", "--edge": "#a8380a", "--motif": "#f08a4b", "--second": "#14532d", "--gold": "#fde047", "--paper1": "#fffbf3", "--paper2": "#fdeedb", "--text": "#3a2516", "--desc": "#5a4030" }),
    pal("indigo", "Indigo", ["#2b2f77", "#be123c"], { "--panel": "#2b2f77", "--panel-hi": "#383d94", "--panel-lo": "#1c1f52", "--edge": "#22265f", "--motif": "#5b60b8", "--second": "#be123c", "--gold": "#f2c14e", "--paper1": "#fafaff", "--paper2": "#eceefb", "--text": "#23243a", "--desc": "#44465c" }),
  ],
  "gu-toran": [
    pal("galgota", "Galgota", ["#ea580c", "#166534"], { "--fl1": "#ea580c", "--fl2": "#f59e0b", "--fl-core": "#9a3412", "--leaf1": "#2f7d32", "--leaf2": "#3d9140", "--leaf-vein": "#1d5420", "--head": "#c2410c", "--second": "#166534", "--text": "#4a2a12", "--desc": "#5b3a1e", "--band1": "#ea580c", "--band2": "#c2410c", "--band-dot": "#fde68a", "--bg1": "#fffdf6", "--bg2": "#fff4dc" }),
    pal("gulab", "Gulab", ["#e11d48", "#166534"], { "--fl1": "#e11d48", "--fl2": "#fb7185", "--fl-core": "#881337", "--leaf1": "#2f7d32", "--leaf2": "#3d9140", "--leaf-vein": "#1d5420", "--head": "#be123c", "--second": "#166534", "--text": "#4a1d2a", "--desc": "#5e2f3c", "--band1": "#e11d48", "--band2": "#be123c", "--band-dot": "#fecdd3", "--bg1": "#fffafb", "--bg2": "#ffeef1" }),
    pal("mogra", "Mogra", ["#f8fafc", "#15803d"], { "--fl1": "#ffffff", "--fl2": "#fef9c3", "--fl-core": "#ca8a04", "--leaf1": "#2f7d32", "--leaf2": "#3d9140", "--leaf-vein": "#1d5420", "--head": "#15803d", "--second": "#a16207", "--text": "#1f3a26", "--desc": "#33503b", "--band1": "#16a34a", "--band2": "#15803d", "--band-dot": "#fef9c3", "--bg1": "#fbfdf8", "--bg2": "#eef6e6" }),
    pal("lal", "Lal", ["#b91c1c", "#a16207"], { "--fl1": "#dc2626", "--fl2": "#f59e0b", "--fl-core": "#7f1d1d", "--leaf1": "#2f7d32", "--leaf2": "#3d9140", "--leaf-vein": "#1d5420", "--head": "#991b1b", "--second": "#a16207", "--text": "#3f1a12", "--desc": "#55291e", "--band1": "#b91c1c", "--band2": "#7f1d1d", "--band-dot": "#fde68a", "--bg1": "#fffcf5", "--bg2": "#fdf0dc" }),
  ],
  "gu-nakkar": [
    pal("blue", "Blue & yellow", ["#0b4ea2", "#ffc400"], { "--main": "#0b4ea2", "--main-hi": "#1561c4", "--main-lo": "#083a7a", "--pop": "#ffc400" }),
    pal("red", "Red & black", ["#c1121f", "#1f1f1f"], { "--main": "#c1121f", "--main-hi": "#d9202e", "--main-lo": "#8a0c16", "--pop": "#1f1f1f" }),
    pal("green", "Green & lime", ["#15703a", "#a3e635"], { "--main": "#15703a", "--main-hi": "#1c8a48", "--main-lo": "#0d4f28", "--pop": "#a3e635" }),
    pal("black", "Black & orange", ["#1c1c1e", "#ff7a00"], { "--main": "#1c1c1e", "--main-hi": "#2c2c30", "--main-lo": "#0c0c0d", "--pop": "#ff7a00" }),
  ],
  "gu-tulsi": [
    pal("teal", "Teal", ["#0f766e", "#5eead4"], { "--g": "#0f766e", "--g-dark": "#0d5c56", "--g-mid": "#14b8a6", "--w1": "#ccfbf1", "--w2": "#5eead4" }),
    pal("blue", "Blue", ["#1d4ed8", "#93c5fd"], { "--g": "#1d4ed8", "--g-dark": "#1e3a8a", "--g-mid": "#3b82f6", "--w1": "#dbeafe", "--w2": "#93c5fd" }),
    pal("purple", "Purple", ["#6d28d9", "#c4b5fd"], { "--g": "#6d28d9", "--g-dark": "#4c1d95", "--g-mid": "#8b5cf6", "--w1": "#ede9fe", "--w2": "#c4b5fd" }),
    pal("rose", "Rose", ["#be123c", "#fda4af"], { "--g": "#be123c", "--g-dark": "#881337", "--g-mid": "#f43f5e", "--w1": "#ffe4e6", "--w2": "#fda4af" }),
  ],
  "gu-pathshala": [
    pal("sunny", "Sunny", ["#0e7c86", "#ffc94a"], { "--bg": "#fff8e1", "--main": "#0e7c86", "--head": "#0b4f6c", "--pop": "#ff6b4a", "--sun": "#ffc94a", "--text": "#334155" }),
    pal("sky", "Sky", ["#2563eb", "#fb923c"], { "--bg": "#eff6ff", "--main": "#2563eb", "--head": "#1e3a8a", "--pop": "#f97316", "--sun": "#fbbf24", "--text": "#334155" }),
    pal("lavender", "Lavender", ["#7c3aed", "#f472b6"], { "--bg": "#f6f1ff", "--main": "#7c3aed", "--head": "#4c1d95", "--pop": "#ec4899", "--sun": "#fcd34d", "--text": "#3b3355" }),
    pal("mint", "Mint", ["#059669", "#f97316"], { "--bg": "#ecfdf5", "--main": "#059669", "--head": "#065f46", "--pop": "#f97316", "--sun": "#fde047", "--text": "#2f4a3f" }),
  ],
  "gu-shilp": [
    pal("charcoal", "Charcoal & copper", ["#1d2228", "#c9a46a"], { "--bg1": "#22272e", "--bg2": "#15181c", "--metal": "#c9a46a", "--head": "#f5efe3", "--text": "#ddd6c9", "--desc": "#b9b3a8", "--muted": "#9a958c", "--hatch": "rgba(255, 255, 255, 0.018)", "--logo-bg": "#f5efe3" }),
    pal("navy", "Navy & gold", ["#14213d", "#d4a72c"], { "--bg1": "#1a2a4d", "--bg2": "#0d1630", "--metal": "#d4a72c", "--head": "#f7f3e8", "--text": "#dfe3ec", "--desc": "#b4bccd", "--muted": "#8e98ad", "--hatch": "rgba(255, 255, 255, 0.02)", "--logo-bg": "#f7f3e8" }),
    pal("forest", "Forest & brass", ["#1c2b22", "#c8a96a"], { "--bg1": "#22352a", "--bg2": "#121d16", "--metal": "#c8a96a", "--head": "#f1ede2", "--text": "#d9dccf", "--desc": "#adb4a4", "--muted": "#8c947f", "--hatch": "rgba(255, 255, 255, 0.018)", "--logo-bg": "#f1ede2" }),
    pal("ivory", "Ivory & black", ["#f3eee4", "#1a1a1a"], { "--bg1": "#f8f5ee", "--bg2": "#ebe5d8", "--metal": "#8a6d3b", "--head": "#161616", "--text": "#2a2a2a", "--desc": "#55524c", "--muted": "#77736b", "--hatch": "rgba(0, 0, 0, 0.025)", "--logo-bg": "#ffffff" }),
  ],
};

export function gujPalette(templateId: string, id?: string): GujPalette {
  const list = GUJ_PALETTES[templateId] ?? [];
  return list.find((p) => p.id === id) ?? list[0];
}
