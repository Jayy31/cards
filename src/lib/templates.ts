import type { Palette, Template } from "./types";
import { engagementSample, grihaSample, shopSample, weddingSample } from "./samples";
import { BUSINESS_TEMPLATES } from "./businessTemplates";
import { WEDDING_TEMPLATES } from "./weddingTemplates";
import { SIGNATURE_TEMPLATES } from "./signatureTemplates";

const P = (p: Palette) => p;

export const TEMPLATES: Template[] = [
  {
    id: "royal-jharokha",
    name: "Royal Jharokha",
    category: "wedding",
    tagline: "Velvet card, Mughal arch, hot-foil gold",
    paper: "velvet",
    ornament: "jharokha",
    backdrop: "silk",
    petals: "rose",
    fonts: { display: "var(--f-cinzel-deco)", script: "var(--f-great-vibes)", body: "var(--f-cormorant)" },
    palettes: [
      P({ id: "maroon", label: "Maroon", paper: "#6e1424", paper2: "#430914", ink: "#f4e6c8", inkSoft: "#dcc497", accent: "#b8323f", accent2: "#1f5e45", foil: "gold", surface: "#2b090f", surface2: "#5a1320", envelope: "#efe3cc", envelope2: "#6e1424", wax: "#7d1020" }),
      P({ id: "emerald", label: "Emerald", paper: "#0f4a3a", paper2: "#072a21", ink: "#f2e7c9", inkSoft: "#cdbb8e", accent: "#c0392b", accent2: "#0b3a2d", foil: "gold", surface: "#08201a", surface2: "#134236", envelope: "#f0e6d0", envelope2: "#0f4a3a", wax: "#8f1d1d" }),
      P({ id: "sapphire", label: "Sapphire", paper: "#1c2b6e", paper2: "#0e1640", ink: "#f3ead2", inkSoft: "#cbbd96", accent: "#b8323f", accent2: "#0e1640", foil: "gold", surface: "#0a1030", surface2: "#1c2a66", envelope: "#efe6d3", envelope2: "#1c2b6e", wax: "#7d1020" }),
    ],
    styles: ["Luxury", "Traditional"],
    effects: ["Envelope & wax seal", "Page turn", "Hot foil", "Petals"],
    sample: weddingSample("maroon"),
  },
  {
    id: "ivory-blossom",
    name: "Ivory Blossom",
    category: "wedding",
    tagline: "Handmade cotton paper, watercolour florals",
    paper: "handmade",
    ornament: "blossom",
    backdrop: "linen",
    petals: "rose",
    fonts: { display: "var(--f-playfair)", script: "var(--f-pinyon)", body: "var(--f-cormorant)" },
    palettes: [
      P({ id: "blush", label: "Blush", paper: "#fbf6ee", paper2: "#f1e4d4", ink: "#5a3a36", inkSoft: "#8c6d66", accent: "#e7a1a6", accent2: "#8fa382", foil: "gold", surface: "#e9ddd0", surface2: "#d6c2ae", envelope: "#f6eee4", envelope2: "#e8c4c0", wax: "#b0606e" }),
      P({ id: "sage", label: "Sage", paper: "#f8f6ef", paper2: "#e6eadb", ink: "#3f4a3c", inkSoft: "#6f7a69", accent: "#ecc0ae", accent2: "#7d9471", foil: "gold", surface: "#dfe3d5", surface2: "#c6ccb8", envelope: "#f3f1e8", envelope2: "#b9c7ab", wax: "#5f7552" }),
      P({ id: "peach", label: "Peach", paper: "#fdf5ec", paper2: "#f5e0ca", ink: "#6b3f2a", inkSoft: "#9a7160", accent: "#f0a47a", accent2: "#9aaf8a", foil: "copper", surface: "#efdcc8", surface2: "#dcc1a6", envelope: "#fbf0e4", envelope2: "#f0b896", wax: "#b5623e" }),
    ],
    styles: ["Floral", "Minimal"],
    effects: ["Envelope & wax seal", "Page turn", "Watercolour", "Petals"],
    sample: weddingSample("blush"),
  },
  {
    id: "midnight-mandala",
    name: "Midnight Mandala",
    category: "wedding",
    tagline: "Silk-finish card with a laser-cut mandala",
    paper: "silk",
    ornament: "mandala",
    backdrop: "velvet",
    petals: "gold",
    fonts: { display: "var(--f-cinzel)", script: "var(--f-parisienne)", body: "var(--f-marcellus)" },
    palettes: [
      P({ id: "navy", label: "Midnight", paper: "#15213f", paper2: "#0a1128", ink: "#efe2c0", inkSoft: "#bda97d", accent: "#c8a24a", accent2: "#2a3d73", foil: "gold", surface: "#060a16", surface2: "#16203e", envelope: "#1a2748", envelope2: "#b8913c", wax: "#a7812f" }),
      P({ id: "onyx", label: "Onyx", paper: "#171717", paper2: "#080808", ink: "#eee3c8", inkSoft: "#a89a7a", accent: "#c8a24a", accent2: "#333", foil: "gold", surface: "#0a0a0a", surface2: "#222", envelope: "#1d1d1d", envelope2: "#b8913c", wax: "#9c7a2a" }),
      P({ id: "plum", label: "Plum", paper: "#3d1538", paper2: "#220a1f", ink: "#f3e4cf", inkSoft: "#cfae9f", accent: "#d49aa9", accent2: "#5e2356", foil: "rosegold", surface: "#160714", surface2: "#3a1435", envelope: "#452041", envelope2: "#c48f86", wax: "#b0707a" }),
    ],
    styles: ["Luxury", "Traditional"],
    effects: ["Envelope & wax seal", "Page turn", "Laser-cut", "Hot foil"],
    sample: weddingSample("navy"),
  },
  {
    id: "rose-gold-rings",
    name: "Forever Rings",
    category: "engagement",
    tagline: "Pearl card with rose-gold art-deco lines",
    paper: "pearl",
    ornament: "deco",
    backdrop: "marble",
    petals: "rose",
    fonts: { display: "var(--f-italiana)", script: "var(--f-great-vibes)", body: "var(--f-cormorant)" },
    palettes: [
      P({ id: "blush", label: "Blush", paper: "#f8ebe6", paper2: "#eed5cd", ink: "#5b3b3f", inkSoft: "#8f6b6f", accent: "#d8a7a0", accent2: "#b7787a", foil: "rosegold", surface: "#ece0db", surface2: "#d9c5be", envelope: "#f4e4de", envelope2: "#c98d86", wax: "#a85f6b" }),
      P({ id: "lilac", label: "Lilac", paper: "#f0eaf5", paper2: "#ddd2e8", ink: "#43385a", inkSoft: "#75698c", accent: "#b9a5d3", accent2: "#8a73ad", foil: "silver", surface: "#e4dfea", surface2: "#cdc3d9", envelope: "#ece6f2", envelope2: "#8a73ad", wax: "#6d5a91" }),
      P({ id: "champagne", label: "Champagne", paper: "#f7f0e3", paper2: "#e9dbc0", ink: "#4a3b2a", inkSoft: "#7d6a52", accent: "#d9c29a", accent2: "#a8875a", foil: "gold", surface: "#ebe2d4", surface2: "#d6c7b0", envelope: "#f5ecdc", envelope2: "#b8925a", wax: "#8f6d3a" }),
    ],
    styles: ["Modern", "Luxury"],
    effects: ["Envelope & wax seal", "Page turn", "Pearl shimmer"],
    sample: engagementSample("blush"),
  },
  {
    id: "marigold-mangal",
    name: "Marigold Mangal",
    category: "shop-opening",
    tagline: "Festive toran of marigolds & mango leaves",
    paper: "cotton",
    ornament: "toran",
    backdrop: "wood",
    petals: "marigold",
    fonts: { display: "var(--f-yeseva)", script: "var(--f-great-vibes)", body: "var(--f-cormorant)" },
    palettes: [
      P({ id: "saffron", label: "Saffron", paper: "#fff3dc", paper2: "#fbd9a4", ink: "#7a1f0e", inkSoft: "#a4553a", accent: "#f28c0f", accent2: "#3e7d2c", foil: "gold", surface: "#4a2812", surface2: "#7d4a24", envelope: "#b3261e", envelope2: "#f5b041", wax: "#d4a017" }),
      P({ id: "crimson", label: "Crimson", paper: "#7f1016", paper2: "#55090e", ink: "#fbe7b5", inkSoft: "#f1c27d", accent: "#f5a623", accent2: "#3e7d2c", foil: "gold", surface: "#2e0708", surface2: "#5a1012", envelope: "#f7e3b0", envelope2: "#7f1016", wax: "#7f1016" }),
    ],
    styles: ["Traditional", "Festive"],
    effects: ["Envelope & wax seal", "Page turn", "Petals"],
    sample: shopSample("saffron"),
  },
  {
    id: "shubh-aangan",
    name: "Shubh Aangan",
    category: "griha-pravesh",
    tagline: "Rangoli, kalash and a festive toran",
    paper: "cotton",
    ornament: "rangoli",
    backdrop: "wood",
    petals: "marigold",
    fonts: { display: "var(--f-rozha)", script: "var(--f-great-vibes)", body: "var(--f-cormorant)" },
    palettes: [
      P({ id: "turmeric", label: "Turmeric", paper: "#fdf3d7", paper2: "#f5d98a", ink: "#5b2c0f", inkSoft: "#8d5a33", accent: "#d9480f", accent2: "#1f7a6d", foil: "gold", surface: "#3d2413", surface2: "#6e4526", envelope: "#f2c14e", envelope2: "#d9480f", wax: "#a61e1e" }),
      P({ id: "teal", label: "Peacock", paper: "#0f5257", paper2: "#083b3f", ink: "#fdf0d0", inkSoft: "#d8c08a", accent: "#f4a259", accent2: "#e76f51", foil: "gold", surface: "#05282b", surface2: "#0e4b50", envelope: "#f3e6c9", envelope2: "#0f5257", wax: "#a61e1e" }),
    ],
    styles: ["Traditional", "Festive"],
    effects: ["Envelope & wax seal", "Page turn", "Petals"],
    sample: grihaSample("turmeric"),
  },
  ...SIGNATURE_TEMPLATES,
  ...WEDDING_TEMPLATES,
  ...BUSINESS_TEMPLATES,
];

export interface CategoryInfo {
  id: string;
  label: string;
  blurb: string;
  /** no designs yet: shown in the filter as "coming soon" */
  soon?: boolean;
}

/** Every occasion we plan to cover. Live ones first, then what's coming next. */
export const CATEGORIES: CategoryInfo[] = [
  { id: "business", label: "Business Cards", blurb: "Digital visiting cards with QR & save-contact" },
  { id: "wedding", label: "Wedding", blurb: "Multi-event wedding cards with every ritual" },
  { id: "engagement", label: "Engagement", blurb: "Ring ceremony & roka invitations" },
  { id: "shop-opening", label: "Shop Opening", blurb: "Inaugurations & grand openings" },
  { id: "griha-pravesh", label: "Griha Pravesh", blurb: "Housewarming & vastu puja" },
  { id: "birthday", label: "Birthday", blurb: "Kids' parties, milestone birthdays", soon: true },
  { id: "anniversary", label: "Anniversary", blurb: "Silver & golden jubilees", soon: true },
  { id: "baby-shower", label: "Godh Bharai", blurb: "Baby shower & seemantham", soon: true },
  { id: "naming", label: "Naamkaran", blurb: "Naming & cradle ceremonies", soon: true },
  { id: "upanayan", label: "Janeu / Upanayan", blurb: "Sacred thread ceremony", soon: true },
  { id: "puja", label: "Puja & Katha", blurb: "Satyanarayan katha, jagran, havan", soon: true },
  { id: "festival", label: "Festival Greetings", blurb: "Diwali, Eid, Christmas, Navratri", soon: true },
  { id: "corporate", label: "Corporate Events", blurb: "Launches, conferences, annual days", soon: true },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getPalette(t: Template, id?: string): Palette {
  return t.palettes.find((p) => p.id === id) ?? t.palettes[0];
}

export function categoryLabel(c: string) {
  return CATEGORIES.find((x) => x.id === c)?.label ?? c;
}
