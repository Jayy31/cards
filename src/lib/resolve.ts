import "server-only";
import { getCard } from "./store";
import { getTemplate } from "./templates";
import type { CardData, InviteData, Template } from "./types";

/** Loads either a saved card (`card`) or a template's sample (`template`), with optional palette override. */
/** A generic logo used to preview how a design handles an uploaded logo. */
const DEMO_LOGO =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'><circle cx='30' cy='30' r='22' fill='#e4572e'/><circle cx='46' cy='30' r='22' fill='#17bebb' fill-opacity='.85'/><text x='74' y='38' font-family='Arial' font-weight='700' font-size='22' fill='#2b2b2b'>logo</text></svg>",
  );

/**
 * `demo=full` fills every optional field (logo, second phone, extras, socials,
 * front extras) so a design can be checked against the busiest real card.
 */
/** Placeholder photo: a soft gradient with a number, so layouts can be judged without real pictures. */
const demoPhoto = (i: number) => {
  const hues = [18, 340, 200, 140, 40, 280];
  const h = hues[i % hues.length];
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><defs><linearGradient id='g' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},55%,72%)'/><stop offset='1' stop-color='hsl(${h + 30},45%,42%)'/></linearGradient></defs><rect width='400' height='500' fill='url(#g)'/><circle cx='200' cy='200' r='70' fill='rgba(255,255,255,.35)'/><rect x='90' y='300' width='220' height='160' rx='100' fill='rgba(255,255,255,.35)'/><text x='370' y='480' text-anchor='end' font-family='Arial' font-size='40' fill='rgba(255,255,255,.8)'>${i + 1}</text></svg>`,
    )
  );
};

function demoInvite(d: InviteData, full: boolean): InviteData {
  if (!full) return d;
  const couple = !!d.secondary?.name;
  return {
    ...d,
    primary: { ...d.primary, nameLocal: d.primary.nameLocal ?? "रोहन" },
    secondary: d.secondary && { ...d.secondary, nameLocal: d.secondary.nameLocal ?? "अनन्या" },
    photo: d.photo ?? demoPhoto(0),
    events: d.events.map((e, i) => ({ ...e, dressCode: e.dressCode ?? (i % 2 ? "Pastels" : undefined), note: e.note ?? (i === 0 ? "Lunch to follow" : undefined) })),
    story: couple ? { enabled: true, title: "Our Story", text: "We met at a friend's Navratri garba in 2019, argued about the best dhokla in town, and have been arguing happily ever since. Now we'd love you beside us as we begin forever.", photos: [1, 2, 3, 4, 5, 6].map(demoPhoto) } : d.story,
    info: [
      ...(d.info ?? []),
      { label: "Travel", value: "Ahmedabad airport is 25 minutes away; cabs will be arranged" },
      { label: "Parking", value: "Valet parking at all venues" },
      { label: "Kids", value: "A supervised play area at the reception" },
    ].slice(0, 6),
    hashtag: d.hashtag ?? "#ForeverUs",
    livestream: d.livestream ?? "https://youtube.com/live/our-wedding",
  };
}

function demoFill(data: CardData, level: string): CardData {
  if (data.kind === "invite") return demoInvite(data, level === "full");
  const full = level === "full";
  return {
    ...data,
    logo: data.logo ?? DEMO_LOGO,
    phone2: full ? "+91 79 2630 1234" : data.phone2,
    nameLocal: data.nameLocal ?? (full ? "नमस्ते" : undefined),
    extras: full ? [...(data.extras ?? []), { label: "GSTIN", value: "24ABCDE1234F1Z5" }, { label: "Hours", value: "Mon–Sat · 10am–7pm" }].slice(0, 3) : data.extras,
    socials: full ? { instagram: "yourbrand", linkedin: "your-name", youtube: "yourchannel", ...data.socials } : data.socials,
    front: { name: true, contact: true, qr: true },
  };
}

export async function resolveCard(q: { card?: string; template?: string; palette?: string; demo?: string }): Promise<{ template: Template; data: CardData; cardId?: string } | null> {
  if (q.card) {
    const c = await getCard(q.card);
    if (!c) return null;
    const t = getTemplate(c.templateId);
    if (!t) return null;
    return { template: t, data: c.data, cardId: c.id };
  }
  const t = q.template ? getTemplate(q.template) : undefined;
  if (!t) return null;
  let data = structuredClone(t.sample);
  if (q.palette) data.palette = q.palette;
  if (q.demo) data = demoFill(data, q.demo);
  return { template: t, data };
}
