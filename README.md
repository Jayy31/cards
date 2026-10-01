# Shubh Cards — realistic digital invitations & business cards

An MVP of a digital card studio for Indian occasions: wedding, engagement, griha pravesh,
shop opening, and digital business cards. The goal is **visual realism**: cards should feel
like real paper, foil and wax, not a flat template.

## Run it

```bash
npm install
npm run dev          # http://localhost:3100
# or production
npm run build && npm start
```

Requirements: Node 18.18+ and Google Chrome/Chromium installed (used headlessly for PDF, PNG
and MP4 export). Set `CHROME_PATH` if Chrome isn't at a standard location. `ffmpeg` ships
via `ffmpeg-static`, so nothing else needs installing.

## What's inside

| Route | What it is |
| --- | --- |
| `/` | Landing page with a live, openable envelope and the template gallery |
| `/preview/[template]` | Full guest experience for a template with sample data (`?palette=`, `?to=Guest`) |
| `/create/[template]` | Editor: form + live page preview; each section flips the preview to its page |
| `/cards/[id]` | Owner dashboard: share link, per-guest links, downloads, RSVP list |
| `/i/[id]` | The public card guests open (`?to=Sharma%20Family` personalises the envelope and cover) |
| `/print?card=` | Flat print sheet used by PDF/PNG export |

### Guest experience
- Envelope in layers (liner, pocket, flap, wax seal). Tap to open: the seal cracks, the flap lifts, the card rises out, and the envelope drops away.
- Multi-page booklet with a 3D page turn you can drag with a finger, tap, or step through with arrow keys. It has turn shading, curl highlight and a cast shadow.
- Light-reactive foil and paper sheen that follow the phone's tilt (gyroscope) or the mouse.
- Falling rose / marigold petals or gold confetti.
- Procedural background music (santoor in Raag Bhupali, or tanpura drone), or the host's own upload.
- Live countdown, venue map card with directions, per-event "View on map", add-to-calendar (.ics / Google).
- RSVP sheet (attending / maybe / decline, guest count, which events, blessings message).
- Guest's name on the envelope ("To, Sharma Family") and cover.

### Templates (8)
Royal Jharokha, Ivory Blossom, Midnight Mandala (wedding) · Forever Rings (engagement) ·
Marigold Mangal (shop opening) · Shubh Aangan (griha pravesh) · Noir Foil, Ivory Letterpress
(business). Each has 2–3 palettes.

Tradition options: Shri Ganesh (two public-domain Raja Ravi Varma paintings), Om, Kalash,
Lotus, Diya, or an uploaded deity/symbol. Also mantra line, family (nimantrak) list, and the
kids' line.

### Business cards (55 designs)
See **`HANDOFF.md`** for the full list, architecture, how to add a design, and what's pending.
Logo, photo, regional-language name, extra lines (GSTIN / Reg. No. / hours), socials, brand colour and
"show on front" options work across every design; cards come landscape, vertical or square.

#### The first 12 (each a different physical card)
Every design has its own material, layout, arrival and flip (`src/lib/businessTemplates.ts` → `BizSpec`,
faces in `src/components/business/designs/`, choreography in `src/components/business/motion.ts`):

| Design | Material | Arrives by | Turns over by |
| --- | --- | --- | --- |
| Noir Foil | triplex black, hot foil | drop | classic flip |
| Ivory Letterpress | cotton, deep impression | press + ink-in | lift-turn |
| Holo Prism | holographic foil + glitter (tilt-reactive) | 3D spin-in | spin |
| Titan Metal | brushed metal, guilloché, laser etch | wallet slide + clink | heavy flip |
| Walnut Engrave | wood veneer, laser burn | laser engraves line by line | vertical flip |
| Clear Acrylic | frosted acrylic, glowing edges | rise | float |
| Neon Sign | neon tubes on black board | tubes bend on (DrawSVG) + flicker | glitch cut |
| Jaipur Block | handmade paper, 2-colour block print | motifs stamped one by one | hinge |
| Paper Layers | die-cut layers with parallax | layers stack | tumble |
| Swiss Grid | typographic grid, spot-UV gloss | kinetic type (SplitText) | card swap |
| Carrara Gold | marble, gilded edges | gold glint sweep | pauses edge-on |
| Kraft & Stamp | kraft, rubber stamp, typewriter | typed + stamp slam | toss |

Cards have real thickness (edge slices), so gilded/metal/wood edges show while turning. Everything is
free/open source: GSAP 3 (incl. SplitText, DrawSVG, CustomWiggle — free since 3.13), Google Fonts (OFL),
SVG turbulence textures generated in code (`src/components/business/textures.ts`).

### Exports
- **MP4 for WhatsApp.** The live viewer is rendered frame by frame in headless Chrome: `window.__card.seek(t)` makes every animation a pure function of time, and the frames are piped to ffmpeg with the same synthesised music. 720×1280 by default; `?hd=1` gives 1080×1920.
- **PDF** (all pages, print-ready) and **PNG** per page, or `page=all` for both sides on one image.
- A **Download** button on every preview and on the public business card page (PNG both sides / front / back, PDF).
- **Link preview (OG image)** of the cover, for WhatsApp/Telegram link cards.

## How realism is achieved (no stock assets)
- `src/components/card/ornaments.tsx`: every ornament is generated from geometry. That covers the Mughal cusped arch, corner flourishes, mandalas, rangoli, marigold toran, watercolour florals, kalash, lotus, diya, rings, wax seal, and art-deco frame.
- SVG filters: a **specular-lit foil bevel**, a **watercolour** wobble with pigment granulation, **wax** gloss and a pressed seal, and **letterpress**.
- `src/app/card.css`: paper stocks (velvet, silk, pearl, handmade with deckled edges, cotton, linen, matte) built from procedural `feTurbulence` textures. Foil gradients are tuned separately for dark and light stock.
- Everything is authored on a fixed 500×700 "card unit" canvas and scaled as a whole, so web, PDF, PNG and MP4 are pixel-consistent.

## Project layout
```
src/lib/          types, templates & palettes, sample data, formatting, file store, music synth, render (PDF/PNG/MP4)
src/components/card/      pages, ornaments, theme tokens
src/components/viewer/    InviteViewer (orchestration), Book (page turn), Envelope, petals, RSVP sheet, music
src/components/business/  business card faces & viewer (flip, save contact, QR)
src/components/editor/    Editor, form fields, Dashboard
src/app/          routes + API (cards, rsvp, upload, export, video)
```

## Deliberately out of scope for this MVP
- **Database.** Cards, RSVPs and uploads are JSON/files under `.data/`. `src/lib/store.ts` is the only module to swap for Postgres/S3.
- **Auth, payments, pricing.** Anyone with a dashboard URL can edit that card.
- **Languages other than English.** Sarvam translation/transliteration would plug into the editor.
- **Job queue.** Video jobs run in-process, one Chrome tab each. For scale, move `startVideo` to a worker service. Rendering is CPU-bound, at roughly 0.3 s per 720p frame on 4 cores.

## Asset credits
See `public/art/CREDITS.md`. The Ganesha art is public domain (Raja Ravi Varma / Ravi Varma
Press). Everything else is generated in code. Uploaded music must be owned or licensed by the host.
