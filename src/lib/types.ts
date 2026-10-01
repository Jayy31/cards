export type Category = "wedding" | "engagement" | "griha-pravesh" | "shop-opening" | "business";

export type SymbolKind =
  | "ganesha"
  | "ganesha-riddhi"
  | "om"
  | "kalash"
  | "lotus"
  | "diya"
  | "swastik"
  | "khanda"
  | "crescent"
  | "cross"
  | "custom"
  | "none";

export type MusicKind = "santoor" | "tanpura" | "custom" | "none";

/** Faith / community: picks the default symbol, wording and event list. */
export type Tradition = "hindu" | "jain" | "sikh" | "muslim" | "christian" | "civil";

/** Which family sends the card: decides whose name comes first. */
export type HostSide = "groom" | "bride" | "both";

/** What an event is, so designs can give it its own icon and colour. */
export type EventKind =
  | "ganesh"
  | "mandap"
  | "haldi"
  | "mehendi"
  | "sangeet"
  | "mameru"
  | "chooda"
  | "tilak"
  | "baraat"
  | "wedding"
  | "anand-karaj"
  | "nikah"
  | "walima"
  | "church"
  | "reception"
  | "cocktail"
  | "puja"
  | "other";

export interface EventItem {
  id: string;
  name: string;
  kind?: EventKind;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm, 24h */
  time: string;
  venue: string;
  address: string;
  note?: string;
  dressCode?: string;
  /** exact Google Maps share link; beats searching by venue + address */
  mapUrl?: string;
  /** "family": shown only on links made for close family & friends */
  audience?: "all" | "family";
}

export interface PersonBlock {
  name: string;
  /** name in a regional script, e.g. "रोहन" */
  nameLocal?: string;
  subtitle?: string;
  parents?: string;
}

export interface InviteData {
  kind: "invite";
  palette: string;
  symbol: SymbolKind;
  symbolImage?: string;
  mantra: string;
  blessingLine: string;
  eyebrow: string;
  hosts: string;
  inviteText: string;
  primary: PersonBlock;
  secondary?: PersonBlock;
  joiner: string;
  photo?: string;
  quote?: string;
  /** YYYY-MM-DDTHH:mm, local time of the main ceremony (drives the countdown) */
  mainDateTime: string;
  /** id of the event whose venue is featured on the venue page */
  mainEventId?: string;
  events: EventItem[];
  family: {
    enabled: boolean;
    title: string;
    names: string[];
    kidsTitle: string;
    kids: string[];
    /** the little ones' line, e.g. "Do come to our Chachu's wedding!" */
    kidsLine?: string;
  };
  rsvp: {
    enabled: boolean;
    deadline?: string;
    contacts: { name: string; phone: string }[];
  };
  closing: { title: string; names: string[] };
  /* ---- wedding extras (all optional; older cards have none) ---- */
  tradition?: Tradition;
  hostSide?: HostSide;
  /** #RohanWedsAnanya */
  hashtag?: string;
  /** live-stream link for guests who can't travel */
  livestream?: string;
  /** "Our story" page: a few lines and up to 6 photos */
  story?: { enabled: boolean; title: string; text: string; photos: string[] };
  /** "Good to know": stay, travel, parking, gifts… */
  info?: { label: string; value: string }[];
  music: MusicKind;
  musicUrl?: string;
  effects: { petals: boolean };
}

export interface BusinessData {
  kind: "business";
  palette: string;
  name: string;
  title: string;
  company: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  logo?: string;
  /** headshot / shop / product photo, used by designs with a photo slot */
  photo?: string;
  services: string[];
  socials: { instagram?: string; linkedin?: string; facebook?: string; youtube?: string; x?: string };
  /** second number (landline, office) */
  phone2?: string;
  /** name in a regional script, e.g. "अदिति शर्मा" */
  nameLocal?: string;
  /** brand colour: replaces the palette accent */
  brand?: string;
  /** extra labelled lines: GSTIN, Reg. No., Clinic hours, License… */
  extras?: { label: string; value: string }[];
  /** what else to print on the front, beside the brand */
  front?: { name?: boolean; contact?: boolean; qr?: boolean };
}

export type CardData = InviteData | BusinessData;

export interface StoredCard {
  id: string;
  templateId: string;
  data: CardData;
  createdAt: string;
  updatedAt: string;
}

export interface Rsvp {
  id: string;
  name: string;
  phone?: string;
  attending: "yes" | "no" | "maybe";
  guests: number;
  events: string[];
  message?: string;
  invitedAs?: string;
  createdAt: string;
}

/* ---------------- Visual theme ---------------- */

export type Foil = "gold" | "rosegold" | "silver" | "copper";
export type PaperKind = "velvet" | "handmade" | "silk" | "pearl" | "linen" | "cotton" | "matte";
export type OrnamentStyle = "jharokha" | "blossom" | "mandala" | "deco" | "toran" | "rangoli" | "none";
export type Backdrop = "silk" | "linen" | "velvet" | "marble" | "wood" | "slate" | "studio" | "concrete" | "paper" | "felt";
export type PetalKind = "rose" | "marigold" | "gold" | "jasmine";

export interface Palette {
  id: string;
  label: string;
  /** base paper colour */
  paper: string;
  /** secondary paper colour for gradients / insets */
  paper2: string;
  /** main text colour */
  ink: string;
  /** muted text colour */
  inkSoft: string;
  /** accent colour (watercolour, rangoli, wax) */
  accent: string;
  accent2: string;
  foil: Foil;
  /** backdrop surface colour */
  surface: string;
  surface2: string;
  /** envelope paper + liner */
  envelope: string;
  envelope2: string;
  wax: string;
}

export interface Fonts {
  display: string;
  script: string;
  body: string;
}

/** How a business card arrives on screen. Each design has its own. */
export type BizEnter =
  | "drop"
  | "press"
  | "spin"
  | "slide"
  | "burn"
  | "rise"
  | "neon"
  | "block"
  | "stack"
  | "typeset"
  | "gild"
  | "slam"
  | "bloom"
  | "draw"
  | "cascade"
  | "type"
  | "zoom"
  | "wipe";
/** How a business card turns over to its back. */
export type BizFlip = "classic" | "lift" | "spin" | "heavy" | "vertical" | "float" | "glitch" | "hinge" | "tumble" | "swap" | "edge" | "toss" | "pop" | "deal";

/** Card format: standard 3.5×2 landscape, vertical, or square. */
export type BizShape = "landscape" | "portrait" | "square";

export interface BizSpec {
  /** key into the design registry (components/business/designs) */
  design: string;
  enter: BizEnter;
  flip: BizFlip;
  /** card thickness in card units (edge becomes visible while turning) */
  thick: number;
  /** corner radius in card units */
  radius: number;
  /** edge colour: CSS colour, or "foil" for gilded / painted edges */
  edge: string;
  shape?: BizShape;
}

/** How an invitation is revealed before the first page. */
export type WedIntro = "envelope" | "doors" | "scroll" | "bloom" | "box" | "curtain" | "alpona" | "unfold" | "twirl" | "jaali" | "gatefold" | "pallu" | "veil" | "brush" | "popup" | "printer" | "warp" | "wiper" | "leader" | "paparazzi" | "mist" | "shake" | "mend" | "flock" | "unfoldmap" | "fireflies";
/** How an invitation moves from one page to the next. */
export type WedTurn = "leaf" | "lift" | "rise" | "dissolve" | "stack" | "swipe" | "fan" | "flipdown" | "twirl" | "zoom" | "drop" | "diagonal" | "iris" | "wipe" | "turnover" | "edge" | "orbit" | "pour" | "reel" | "peel" | "frost" | "drift" | "crack" | "plane" | "pan" | "recede";
/** How a page's content arrives once it is on top. */
export type WedReveal = "glow" | "stamp" | "bloom" | "type" | "float" | "sweep" | "drop" | "pop" | "spin" | "zoom" | "rise" | "blur" | "ink" | "slide" | "flap" | "twinkle" | "drip" | "credits" | "unveil" | "condense" | "flurry" | "gild" | "unfold" | "pin" | "glowin";

export interface WedSpec {
  /** key into the wedding design registry (components/wedding) */
  design: string;
  intro: WedIntro;
  turn: WedTurn;
  reveal: WedReveal;
}

export interface Template {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  paper: PaperKind;
  ornament: OrnamentStyle;
  backdrop: Backdrop;
  petals: PetalKind;
  fonts: Fonts;
  palettes: Palette[];
  sample: CardData;
  /** gallery filters */
  styles: string[];
  effects: string[];
  /** who the design is made for (gallery filter) */
  industries?: string[];
  /** has a photo slot */
  photo?: boolean;
  biz?: BizSpec;
  wed?: WedSpec;
  /** part of the Signature collection (premium, shown first with a badge) */
  signature?: boolean;
}
