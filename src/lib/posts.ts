/*
 * Festival business posts: static social-media images (no video) with the business's details applied.
 * One template = one design that recomposes for each platform shape (not scaled or cropped).
 * Every size is 1080 px wide, so the brand block is identical in all shapes; only the height changes.
 */

export const POST_W = 1080;

export type PostRatio = "1x1" | "4x5" | "9x16";

export const POST_RATIOS: { id: PostRatio; h: number; label: string; use: string }[] = [
  { id: "1x1", h: 1080, label: "Square", use: "Instagram & Facebook post · WhatsApp" },
  { id: "4x5", h: 1350, label: "Portrait", use: "Instagram & Facebook feed" },
  { id: "9x16", h: 1920, label: "Story", use: "WhatsApp Status · Instagram Story" },
];
export const ratioH = (r: PostRatio) => POST_RATIOS.find((x) => x.id === r)!.h;

/**
 * Story safe zone: Instagram/WhatsApp draw their own name bar and reply box over roughly the top 250 px
 * and bottom 340 px of a 1080 × 1920 story. Art may go there; text and the brand block may not.
 */
export const STORY_SAFE = { top: 250, bottom: 340 };

/** The business details. Applied to every template at once. */
export type PostBrand = {
  business: string;
  owner?: string;
  services?: string;
  phones?: string[]; // up to 2
  address?: string;
  social?: string; // Instagram / Facebook handle
  website?: string;
  offer?: string; // "Diwali Sale: flat 20% off till 15 Nov"
  logo?: string;
};

/** The festival text on a template. Defaults come from the template; the user can edit every line. */
export type PostText = {
  /** Gujarati line on the mixed-language templates (Navratri, Bestu Varas). */
  local?: string;
  heading: string;
  wish?: string;
  message?: string;
};

export type PostTemplate = {
  id: string;
  name: string;
  festival: string;
  date: string; // 2026, approximate until checked against a panchang
  medium: string;
  lang: "en" | "mix";
  text: PostText;
};

export const POST_TEMPLATES: PostTemplate[] = [
  {
    id: "navratri-garbo",
    name: "Garbo",
    festival: "Navratri",
    date: "2026-10-11",
    medium: "red bandhani cloth, a lit terracotta garbo throwing dots of light, lacquered dandiya; brand on a mirror-work patch at the top",
    lang: "mix",
    text: {
      local: "શુભ નવરાત્રી",
      heading: "Happy Navratri",
      wish: "Nine nights of garba, devotion and joy. May Maa Amba bless you and your family.",
    },
  },
  {
    id: "dussehra-dahan",
    name: "Dahan",
    festival: "Dussehra",
    date: "2026-10-20",
    medium: "the Ramlila ground at dusk: a ten-headed paper-and-bamboo Ravan catching fire; text and brand in a column beside it",
    lang: "en",
    text: {
      heading: "Happy Dussehra",
      wish: "May the fire of Vijayadashami burn away every worry, and may truth and goodness always win.",
    },
  },
  {
    id: "dhanteras-thali",
    name: "Thali",
    festival: "Dhanteras",
    date: "2026-11-06",
    medium: "top-down: an embossed brass puja thali on peacock-green silk with silver coins, kumkum and rice; greeting engraved in the brass",
    lang: "en",
    text: {
      heading: "Shubh Dhanteras",
      wish: "May Lakshmi and Kuber fill your home with wealth, health and good fortune.",
    },
  },
  {
    id: "diwali-dwaar",
    name: "Dwaar",
    festival: "Diwali",
    date: "2026-11-08",
    medium: "a home's doorway on Diwali night: carved teak frame, marigold toran, clay diyas on the step",
    lang: "en",
    text: {
      heading: "Happy Diwali",
      wish: "May the glow of a thousand diyas fill your home with joy, good health and prosperity.",
      message: "Thank you for your trust all year.",
    },
  },
  {
    id: "bestu-paatiyu",
    name: "Paatiyu",
    festival: "Bestu Varas",
    date: "2026-11-10",
    medium: "a hand-painted enamel shop signboard hanging on a lime-washed wall; the business name is the sign",
    lang: "mix",
    text: {
      local: "નૂતન વર્ષાભિનંદન",
      heading: "Saal Mubarak",
      wish: "Wishing you a prosperous New Year, Vikram Samvat 2083.",
    },
  },
];
export const postTemplate = (id: string) => POST_TEMPLATES.find((t) => t.id === id);

export const POST_SAMPLE: PostBrand = {
  business: "Patel Electronics",
  owner: "Rakesh Patel",
  services: "LED TVs · ACs · Fridges · Washing Machines",
  phones: ["98250 12345", "079 2656 7788"],
  address: "12, Sardar Complex, C.G. Road, Navrangpura, Ahmedabad",
  social: "@patelelectronics",
  website: "patelelectronics.in",
  offer: "Diwali Offer: up to 25% off + free delivery",
};

/** Stress data for the ?fill= test pills: brand details, plus how to stretch each template's own text. */
export const POST_STRESS: Record<string, { brand: PostBrand; text: "long" | "min" }> = {
  long: {
    brand: {
      business: "Shree Mahalaxmi Gold & Diamond Jewellers Private Limited",
      owner: "Prop. Bhaveshkumar Jayantilal Soni & Sons",
      services: "Gold, Diamond & Silver Jewellery · Hallmarked Ornaments · Custom Bridal Sets · Old Gold Exchange · Silver Utensils",
      phones: ["+91 98250 12345", "+91 079 2656 7788"],
      address: "Shop No. 14–15, Ground Floor, Shree Krishna Shopping Centre, Opp. Swaminarayan Mandir, Mavdi Main Road, Rajkot – 360004",
      social: "@shreemahalaxmijewellersrajkot",
      website: "www.shreemahalaxmijewellers.co.in",
      offer: "Dhanteras & Diwali Mega Offer: 0% making charges on gold jewellery + free silver coin on every purchase above ₹50,000",
    },
    text: "long",
  },
  min: { brand: { business: "Ravi Tailors", phones: ["98765 43210"] }, text: "min" },
};

/** A template's text stretched for testing: very long lines, or the heading alone. */
export function stressText(t: PostText, mode: "long" | "min"): PostText {
  if (mode === "min") return { local: t.local, heading: t.heading };
  return {
    local: t.local ? "આપને અને આપના પરિવારને " + t.local + "ની હાર્દિક શુભકામનાઓ" : undefined,
    heading: "Wishing You a Very " + t.heading,
    wish: "May this festival bless your home with wealth, your heart with peace, and your family with good health, happiness and success in the year ahead.",
    message: "With warm regards and heartfelt thanks to all our valued customers, friends and well-wishers for your continued trust and support.",
  };
}
