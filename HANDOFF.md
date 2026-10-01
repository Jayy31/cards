# Handoff (status as of 2026-10-01)

Read this first when continuing. `README.md` covers how to run the app; this file covers
what was built in the business-card push, what's verified, and what's left.

## Where things stand
- **55 business card designs** (12 original + 43 new), all rendering front + back, typecheck clean
  (`npx tsc --noEmit`). Every design was screenshot-reviewed with sample data **and** with every
  optional field filled (`?demo=full`).
- Gallery lists **13 categories** (5 live, 8 "coming soon") with search + Industry / Effect / Style /
  Format filters. Business thumbnails flip on hover and render lazily.
- **Download button**: preview banner + public business card page (PNG both sides / front / back, PDF).

## What a user can put on a business card now
`BusinessData` in `src/lib/types.ts`:
logo · photo · name in a regional script (`nameLocal`) · second phone (`phone2`) · up to 3 extra
labelled lines (`extras`: GSTIN, Reg. No., RERA, Timings…) · socials (Instagram, LinkedIn, Facebook,
YouTube, X) · brand colour (`brand`, overrides the palette accent) · front extras
(`front: { name, contact, qr }` puts name/contact/QR on the front too).
All editable in the editor (`src/components/editor/Editor.tsx`: sections Front, Photo, Contact, Extra
details, Social; brand colour + searchable design list in Design).

## Architecture (business cards)
| Piece | File |
| --- | --- |
| Template list (palettes, fonts, shape, motion, tags) | `src/lib/businessTemplates.ts` |
| Sample person per design | `src/lib/samples.ts` → `PERSONAS` |
| Card shapes (landscape 700×400, portrait 400×700, square 520×520) | `src/lib/bizShape.ts` |
| Face dispatcher (+ brand colour) | `src/components/business/BusinessFaces.tsx` |
| Design registry | `src/components/business/designs/index.ts` |
| Designs | `designs/classic, holo, metal, walnut, acrylic, neon, block, layers, swiss, marble, kraft` (original), `designs/trend.tsx` (14), `designs/heritage.tsx` (8), `designs/pro.tsx` (21) |
| Shared parts (Contacts w/ extras+socials, Brand/logo slot, FrontMeta, Avatar, StdBack, QR, vCard) | `src/components/business/parts.tsx` |
| Entrances & flips (GSAP, incl. SplitText / DrawSVG / CustomWiggle) | `src/components/business/motion.ts` |
| Viewer (3D thickness/edges, shapes, download) | `src/components/business/BusinessViewer.tsx` |
| Procedural textures (wood, metal, marble, felt) | `src/components/business/textures.ts` |
| SVG filters (foil, block ink, stamp, brush, chalk) | `src/components/card/ornaments.tsx` → `GlobalDefs` |
| Styles | `src/app/business.css` (original 12 + gallery/filters/download), `biz-base.css` (shared parts, front-extra placement), `biz-trend.css`, `biz-heritage.css`, `biz-pro.css` |
| Extra fonts (Google Fonts, not preloaded) | `src/app/bizFonts.ts` |
| Demo overlay for testing | `src/lib/resolve.ts` → `?demo=full` on `/preview/<id>` and `/print?template=<id>` |

### Adding a design (recipe)
1. Write `{ Front, Back }` in a `designs/*.tsx` file. Use `Brand` (logo slot), `FrontMeta`,
   `StdBack` (or your own back with `Contacts` + `LocalName` + `Qr`). Mark animatable bits with
   `fx-fade`, `fx-pop`, `fx-draw` (SVG paths), `fx-item`, `fx-type`, `fx-spin`, `fx-layer`, `fx-stamp`.
   Any marker the chosen entrance doesn't choreograph still gets a default animation.
2. Register it in `designs/index.ts`.
3. Add a `biz(...)` entry in `businessTemplates.ts` (enter, flip, thick, radius, edge, shape, palettes,
   styles, effects, industries, `photo: true` if it has a photo slot) and a persona in `samples.ts`.
4. Style it under `.bz-<design>` in one of the css files.
5. Check it with `/print?template=<id>&demo=full` and `/preview/<id>?render=1` (seek frames).

## Known issues / pending
- **Jyotish Stars (zodiac wheel)**: glyphs render correctly live and in PNG/PDF. In very small
  video frames (640px) the tiny foil glyphs can look smudged; check at 1080p if it matters.
- MP4 export for business cards: **verified** (Neon Sign sample, 720×1280, 10 s, ~50 s to render).
  The dashboard now offers the video for business cards too. Landscape cards sit fairly small in the
  9:16 frame; a zoom-in or a "both sides" layout for video would use the space better.
- Effect filter is grouped (Materials / Print & craft / Motion / Layout & format / Look & pattern) in
  `src/components/Gallery.tsx` → `EFFECT_GROUPS`; new effect names land in "Look & pattern" unless added.
- Photo designs show a drawn placeholder until the user uploads a photo.
- No production concerns addressed yet (DB, auth, payments), same as before.

## Wedding category (in progress)
Plan: ~50 designs built **in batches of 5**. Step 1 (content model) is **done** (2026-10-01);
next is **batch 1: the first 5 new wedding designs**, each with its own look and its own motion.

### Step 1: content model (done)
New optional fields on `InviteData` / `EventItem` / `PersonBlock` (`src/lib/types.ts`), so old cards still load:
- `tradition` (hindu, jain, sikh, muslim, christian, civil) and `hostSide` (groom, bride, both).
  A bride's-family card names the bride first (`coupleOrder`).
- `PersonBlock.nameLocal`: the name in a regional script, shown under the name. Noto Serif fonts for
  Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali, Gurmukhi, Odia and Arabic are in
  `src/app/scriptFonts.ts`. They are not preloaded; each downloads only when a name uses that script.
- Events: `kind` (18 types: haldi, mehendi, sangeet, baraat, pheras, anand karaj, nikah, walima,
  church, reception…), `dressCode`, `mapUrl` (exact Google Maps link), and `audience: "family"`
  (family-only events).
- Family-only events are dropped server-side in `app/i/[id]/page.tsx` unless the link has `&g=family`.
  The dashboard guest list has a "Family" tick per guest. In **dev**, React's debug payload still
  contains the raw card file; production builds don't.
- `story` page (title, text, up to 6 polaroid photos) and `info` page "Good to know"
  (up to 6 label/value lines, `hashtag`, `livestream`). Pages are added in `buildPages` only when filled.
- New symbols: swastik, khanda, crescent & star, cross (`ornaments.tsx`).
- `src/lib/wedding.ts`: `TRADITIONS` presets (symbol, mantra, wording, the usual event programme),
  `EVENT_KINDS`, `applyTradition`, `coupleOrder`, `hostLine`, `forAudience`, `INFO_LABELS`.
- Editor: tradition chips, "Use the usual X events", "Card sent by", local-script names, event type,
  dress code, map link, family-only toggle, and the "Our story & photos" and "Good to know" sections.
- `?demo=full` now also fills invites (local names, couple photo, 6 story photos, info lines,
  hashtag, livestream, dress codes).
- Verified: typecheck clean; all pages screenshot-checked on Royal Jharokha with `demo=full`; the four
  symbols and the local-script names checked on all 3 wedding designs.

### Batch 1: 5 designs (done 2026-10-01)
| Design (id) | Look | Intro | Page turn | Reveal |
| --- | --- | --- | --- | --- |
| Kovil (`kovil`) | Kanjivaram zari border, gopuram, brass lamps, bells, kolam | temple doors swing open | `lift` (palm-leaf flip up) | glow |
| Rajwada (`rajwada`) | parchment, Mewar sun, cusped arch, elephants, block-print border | ribbon unties, scroll unrolls | `rise` (pages scroll up) | stamp |
| Gulmohar (`gulmohar`) | watercolour flame-tree sprays, soft arch | wreath of blossoms flies apart | `dissolve` | bloom |
| Ink & Ivory (`ink-ivory`) | letterpress, debossed monogram, laurel | keepsake box: ribbon, lid, tissue | `stack` (tossed aside) | type |
| Pichwai (`pichwai`) | lotus pond, jasmine swags, cows, lotus mandala | fabric curtain rises | `swipe` | float |

Architecture (wedding designs):
- `Template.wed = { design, intro, turn, reveal }` (`types.ts`); templates in `src/lib/weddingTemplates.ts`.
- Intros: `src/components/viewer/intros.tsx` → `INTROS` (envelope, doors, scroll, bloom, box, curtain).
  Each has Under/Over layers (scene 600×900, card at 50,100), one paused GSAP timeline, `end`, `burst`, `hint`.
  Video export seeks the same timeline; `videoDuration(pages, intro.end)`.
- Page turns: `Book.tsx` `turn` prop. `leaf` is the original; the others go through `applyMove`, which is
  progress-driven, so drag, tap and video all work.
- Reveal: `REVEALS` in `InviteViewer.tsx`. It animates `.page-content > *` after a page turn (live mode only).
- Designs: `src/components/wedding/designs.tsx` → `WED_DESIGNS[design] = { Cover, Frame, Back }`.
  Inner pages reuse the shared layouts, restyled under `.wd-<design>` in `src/app/wedding.css` (which also holds the intro CSS).
- Art: `src/components/wedding/art.tsx`, procedural SVG. **Use `sin`/`cos` from format.ts, never `Math.sin`**:
  raw Math.sin differs between Node and Chrome and causes hydration mismatches.
- Old 3 designs (no `wed`) still use envelope + leaf, verified.

Adding a wedding design: write `{ Cover, Frame, Back }` in designs.tsx (add motifs to art.tsx), add CSS under
`.wd-<id>`, add a template with `wed` in weddingTemplates.ts (pick or add an intro/turn/reveal), then check
`/print?template=<id>&demo=full`, and seek frames with `/preview/<id>?render=1` + `window.__card.seek(t)`.

### Batch 2: 5 designs (done 2026-10-01)
| Design (id) | Look | Intro | Page turn | Reveal |
| --- | --- | --- | --- | --- |
| Alpona (`alpona`) | Bengali lal-paar border, alpona lotus, Prajapati, fish pair, topor & mukut | `alpona`: lotus painted stroke by stroke, then lifts | `fan` (bottom-left corner) | sweep (clip wipe) |
| Phulkari (`phulkari`) | satin-stitch bagh bands, stitch stars, golden kaleere | `unfold`: embroidered 4-flap cloth bundle | `flipdown` (calendar) | drop (bounce) |
| Bandhej (`bandhej`) | bandhani dots, mirror-work panel, garbo lamp, dandiya | `twirl`: mirror-work ghagra disc spins away | `twirl` | pop |
| Noor (`noor`) | girih star lattice, pointed arch, lanterns (Nikah) | `jaali`: four lattice screens slide apart | `zoom` | spin (tiles flip) |
| Jaali Lace (`jaali-lace`) | metallic laser-cut lace over the card, arch window | `gatefold`: belly band slips, lace panels open | `drop` (falls away) | zoom |

- Art: `src/components/wedding/art2.tsx`. Designs: `designs2.tsx` (`WED_DESIGNS_2`, merged in InvitePages to avoid
  a circular import). Intros: `src/components/viewer/intros2.tsx` (registered in `INTROS`). CSS: end of `wedding.css`.
- Every sample now has its own family, RSVP contacts and "good to know" notes (no leftover Mehta family).
- Verified: typecheck; all pages screenshot-checked; intro and turn frames seeked for all 5.
- Total wedding designs: 13 (3 original + 10 new).

### Batch 3: 5 designs (done 2026-10-01)
| Design (id) | Look | Intro | Page turn | Reveal |
| --- | --- | --- | --- | --- |
| Paithani (`paithani`) | Maharashtrian silk, lotus zari border, peacocks, pearl mundavalya | `pallu`: silk pallu sweeps off | `diagonal` (flips over its diagonal) | rise |
| Grace (`grace`) | Christian: stained-glass window, doves, bells, lily of the valley | `veil`: sheer lace veil lifts, doves fly | `iris` (clip circle closes) | blur |
| Madhubani (`mithila`) | Mithila folk: hatched border, sun face, fish pair, lotus | `brush`: brush-stroke mask paints the card in | `wipe` (clip wipe) | ink (scaleX) |
| Saath (`saath`) | illustrated faceless couple under a floral arch | `popup`: card tilts up, `.pu-layer`s stand up | `turnover` (postcard, about the centre) | slide |
| Jet Set (`jet-set`) | boarding pass: From/To codes, gate, seat, barcode stub, guest named as passenger | `printer`: printed out of a kiosk slot | `edge` (spins edge-on) | flap (split-flap) |

- Art: `art3.tsx`; designs: `designs3.tsx` (`WED_DESIGNS_3`); intros: `intros3.tsx`.
- The popup intro animates `.pu-layer` elements inside the cover page (scaleY from the bottom; real 3D is flattened by the page's overflow).
- The Jet Set cover is notched with a CSS mask on `.wd-jetset.kind-cover`.
- Total wedding designs: 18 (3 original + 15 new). 15 intros, 16 page turns, 20 reveals now exist.

### Signature collection: 10 premium designs (done 2026-10-01)
The user asked for "highest-level", non-religious, never-seen-before designs. They lead the gallery with a
"✦ Signature" badge (`Template.signature`), sorted first. Templates: `src/lib/signatureTemplates.ts`.
Code: `src/components/wedding/sig/<design>.tsx` (design + its intro in one file), registry `sig/index.tsx`.
CSS: `src/app/signature.css`.

| Design (id) | Concept | Intro | Turn | Reveal | Special |
| --- | --- | --- | --- | --- | --- |
| Stargazer (`stargazer`) | real star chart for the wedding date/time/venue | `warp` (canvas starfield) | `orbit` | twinkle | `lib/sky.ts`: ~110 stars, constellations, Milky Way by galactic coords, moon phase and position; venue → coordinates via `placeOf` |
| Monsoon (`monsoon`) | rain on a window at dusk, red umbrella couple | `wiper` (conic-mask windshield wiper) | `pour` | drip | live rain canvas, bokeh, droplets |
| Premiere (`premiere`) | film-premiere poster | `leader` (5-4-3-2-1 countdown) | `reel` | credits | custom Showtimes / Credits / The End pages |
| Cover Story (`cover-story`) | luxury magazine wedding issue | `paparazzi` (flashes) | `peel` | unveil | uses the couple photo if uploaded, else profile art; custom Couple / Contents / Contributors pages |
| Glasshouse (`glasshouse`) | Victorian conservatory, layered jungle | `mist` (fog wiped, heart first) | `frost` | condense | wipe the fog with a finger (live), tilt parallax |
| Snow Globe (`snow-globe`) | alpine chalet in a glass dome | `shake` (globe shakes, zoom inside) | `drift` | flurry | live snow; tap the globe or shake the phone to swirl (`globe-stir` event) |
| Kintsugi (`kintsugi`) | dark ceramic mended with gold | `mend` (shards assemble, gold flows) | `crack` (jagged clip) | gild | one crack network (`PTS/SEAMS/SHARDS`) drives both the card and the intro shards; glints run along the seams |
| Origami (`origami`) | paper cranes, folded creases | `flock` (28 cranes take off) | `plane` | unfold | senbazuru strings, faceted crane |
| Wanderlust (`wanderlust`) | illustrated map, two routes meeting at the venue | `unfoldmap` (2-fold map opens) | `pan` | pin | procedural islands, compass rose, cartouche |
| Firefly (`firefly`) | layered papercut night forest, swing couple | `fireflies` (swarm, radial reveal) | `recede` | glowin | live fireflies, per-layer tilt parallax |

Infrastructure added for these:
- `WedDesign.Pages` lets a design replace the shared inner page of a kind (used by Premiere and Cover Story).
- `components/wedding/live.tsx`: `LiveCanvas` + `cardClock()`. Video export sets `window.__cardTime` in `seek`,
  so live canvases render frame-exact. Thumbnails draw one still frame.
- Design registry in InvitePages is lazy (a Proxy) so circular imports can't leave it half-built.
- `.sig` class on Signature pages (hides the fallback diya on closing pages).
- Performance: the star chart draws faint stars and the Milky Way on a canvas (SVG for bright stars only).
  Preview pages load in ~7 s on the dev server; production should be faster. Worth profiling on a real phone.
- Verified: typecheck; every page screenshot-checked; intro and turn frames seeked for all 10.

### Later (parked by the user)
- More regional batches (Art Deco, pookalam, Warli/Kalamkari, pattachitra, gamosa…), and regional-language headings.
