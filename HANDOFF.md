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

Cover Story options (added after the user's request): `InviteData.magazine` = { layout: classic | minimal | block,
photo: natural | mono | duotone, tag, headline, teaser, feature, inside, extra }. Blank lines fall back to automatic
text (`coverLineDefaults`). Duotone is an SVG filter built from the palette (darkest ink → light accent).
Edited in the editor's "Magazine cover" section, which only shows for this design.
Photo framing: `magazine.photoX / photoY` (focal point, %) and `photoZoom` (1–2.5), applied by `CoverPhoto`
(an <img> with object-position + scale around the focal point). The editor control is
`components/editor/PhotoPositioner.tsx`: drag inside a window shaped like the layout's photo area, a zoom slider,
and a reset. It's reusable for any future photo slot.

Infrastructure added for these:
- `WedDesign.Pages` lets a design replace the shared inner page of a kind (used by Premiere and Cover Story).
- `components/wedding/live.tsx`: `LiveCanvas` + `cardClock()`. Video export sets `window.__cardTime` in `seek`,
  so live canvases render frame-exact. Thumbnails draw one still frame.
- Design registry in InvitePages is lazy (a Proxy) so circular imports can't leave it half-built.
- `.sig` class on Signature pages (hides the fallback diya on closing pages).
- Performance: the star chart draws faint stars and the Milky Way on a canvas (SVG for bright stars only).
  Preview pages load in ~7 s on the dev server; production should be faster. Worth profiling on a real phone.
- Verified: typecheck; every page screenshot-checked; intro and turn frames seeked for all 10.

## Festival Greetings (live, all Signature) (2026-10-01)
For Dhanteras, Diwali and the New Year (Navratri deliberately left out). Five designs:

| Design (id) | Concept | Intro | Turn | Reveal | Interaction |
| --- | --- | --- | --- | --- | --- |
| Roshni (`roshni`) | old-city rooftop at night, string lights, kandils, diya parapet (no moon: amavasya) | `lightsup` (windows switch on, first rocket) | `launch` | spark | tap the sky → fireworks (`rs-launch` event) |
| Rangoli (`rangoli-utsav`) | top-down powder rangoli ringed by diyas | `drawrangoli` (rings drawn, diyas light in a circle) | `mandala` | powder | tap → marigold petals (`rg-petals`) |
| Swarna (`swarna`) | Dhanteras kalash of coins, Lakshmi footprints, Shubh–Labh, logo slot | `coinrain` (canvas coin shower) | `coin` | gleam | tap → gold coins fall and bounce (`sw-coins`) |
| Pehla Diya (`pehla-diya`) | one brass diya in the dark | `kindle` (spark, flame, light fills the card) | `snuff` | kindle | tap → light a row of 7 diyas one by one |
| Naya Saal (`naya-saal`) | tear-off calendar, Samvat 2082 → 2083 sunrise | `tearoff` (old page torn, confetti) | `tear` | dawn | works for 1 Jan too (year label) |

How greetings work (they reuse `InviteData`, with category `festival`):
- `lib/festival.ts`: `FESTIVALS` presets (heading, mantra, wish, message, 2026 date, symbol, year label, sign-off) +
  `applyFestival` + `festivalSample`. **Dates assumed**: Dhanteras 6 Nov, Diwali 8 Nov, Nutan Varsh 10 Nov,
  Bhai Dooj 11 Nov 2026. Verify against a panchang before launch.
- New fields: `festival`, `message`, `logo`, `yearLabel`. The sender is `primary.name` (+ `primary.subtitle`), the heading
  `eyebrow`, the wish `blessingLine`, the sign-off `closing.title`.
- Pages (`buildPages`): cover → **message** (new shared `Message` page with logo/photo, wish, note, sign-off, and
  "Diwali is N days away") → optional celebration (events) + venue/RSVP → family → wishes (closing).
- Editor: festival chips in "Blessing & cover"; a "Your greeting" section replaces the couple section; the family section
  is enabled; events are titled "Celebration (optional)".
- Sharing: WhatsApp text, link preview (title/description) and viewer bar are greeting-aware (no "cordially invited",
  no calendar button without events).
- Code: `src/components/festival/*.tsx` (registry `index.tsx`), templates `src/lib/festivalTemplates.ts`, CSS `src/app/festival.css`.
- Intros that light up cover elements target them inside the book (`.rs-win`, `.rg-ring`, `.pd-flame`…). CSS animations
  live on inner groups (`.fd-flick`, twinkle) so they don't override the intro's inline styles.

### Diwali collection (15 more, in chunks of 5). Chunk 1 done (2026-10-01)
| Design (id) | Concept | Intro | Turn | Reveal | Interaction |
| --- | --- | --- | --- | --- | --- |
| Phuljhadi (`phuljhadi`) | a sparkler writes the greeting in light (long exposure) | `sparkwrite` (tip writes each line; clip reveal) | `smoke` | write | draw light trails with a finger (central zone) |
| Pataka (`pataka`) | courtyard cracker night: anaar, chakri, bottle rocket | `fuse` (spark runs along a fuse, MotionPath) | `blast` | crackle | tap a cracker to light it |
| Mithai Box (`mithai-box`) | luxury sweet box, 9 procedural mithais, silver varq | `unbox` (ribbon, lid hinges open, sweets pop) | `cube` | sweet | tap to eat a sweet (counter) |
| Pooja Mandir (`pooja-mandir`) | carved mandir with deity image, aarti thali + flame trail, incense, petals | `aarti` (light ring traced, then expands) | `swing` | bless | tap to ring the bells |
| Diwali Ghar (`diwali-ghar`) | real CSS 3D house with chasing fairy lights, kandils, rangoli | `switchon` (floor by floor, camera swings in) | `dolly` | lights | tap to cycle light modes |

**Important fix:** video export now seeks intro timelines with events ON (`seek(t, false)` in InviteViewer), so
`onUpdate`-driven intros (Phuljhadi's writing) render in MP4. Before, they only worked live.

**Greetings are broadcast** (family to everyone: WhatsApp/Status/Instagram), not per-guest. `fromPrefix` field +
`fromText(d)` on every cover; editor "Words before your name" chips; dashboard leads with "For Status & Instagram"
(video, cover PNG, message PNG); personal links are a collapsed `<details>`.

Chunk 2 (done) — files `kandil.tsx`, `deepdaan.tsx`, `sivakasi.tsx`, `yantra.tsx`, `aatish.tsx`:

| Template | Look | Intro | Turn | Reveal | Live interaction |
| --- | --- | --- | --- | --- | --- |
| Akash Kandil (`akash-kandil`) | dusk lake, 40 canvas sky lanterns + reflections, family on a jetty | `release` | `glide` | warmth | tap to release a lantern |
| Deep Daan (`deep-daan`) | night river, ghat + chhatris, drifting leaf-boat diyas | `ripple` (mask opens from rings) | `current` | wave | tap water: ripples + new diya |
| Sivakasi (`sivakasi`) | retro cracker-box label, family as the "brand", CMY misregistration, halftone | `boom` | `fallback` (topples forward) | slap | tap the fuse: BOOM confetti |
| Shree Yantra (`shree-yantra`, dhanteras) | gold yantra (9 triangles, lotus rings, bhupura), coin stream into bindu | `yantradraw` (rings draw outward) | `gilded` | radiate | tap yantra: pulse + more gold |
| Aatishbazi (`aatishbazi`) | rockets whose sparks form greeting + family name (text sampled from offscreen canvas), 10 s cycle | `launchname` (dispatches `at-start`) | `fizzle` | sparkle | tap sky: bursts (`at-tap`) |

Note: backward `rotateX` turns hide behind the next leaf (preserve-3d) — tip forward instead.
`paintCoin` is now exported from swarna.tsx.

Chunk 3 (DONE). The user rejected Neo/Kaleidoscope/Bazaar/Noir and asked for "beyond imagination": each card its own
medium, real + welcoming + charming, not the same particle effects everywhere. Greetings go to groups AND individual chats,
so every cover also greets a named recipient (`?to=` / personal links). The dashboard "Send it personally" panel is now open by default.

| Template | Medium | Intro | Turn | Reveal | Live interaction |
| --- | --- | --- | --- | --- | --- |
| Chopda Pujan (`chopda-pujan`, `chopda.tsx`) | top-bound red bahi-khata: kumkum swastik, Shubh-Labh, ledger entries ("Opening balance of blessings ∞"), violet rubber stamp | `khata` (thread untied, cover lifts, ink writes) | `flipup` | ledger | tap stamp: re-stamp (up to 3) |
| Chitthi (`chitthi`, `chitthi.tsx`) | blue inland letter on a desk; handwritten letter, printed diya stamp, family P.O. postmark, "Dear {guest}" | `inland` (strip tears, flaps unfold) | `fold` | pen | tap stamp: postmark thump |
| Diwali Times (`diwali-times`, `akhbaar.tsx`) | vintage broadsheet, Fraktur masthead (by festival), halftone canvas photo, funny local news, "{guest}'s edition" | `newsspin` | `spinout` | press | tap masthead: spin again |
| Kaagaz (`kaagaz`, `kaagaz.tsx`) | paper-cut lightbox: 6 layers (glow/moon, paper fireworks+hills, town with cut windows, kandil strings, family, cusped jharokha front) | `lightbox` (pull cord; layers light back→front) | `dive` | papercut | pointer/tilt parallax; idle sway (frame-exact) |
| Shubh TV (`shubh-tv`, `tv.tsx`) | 80s wooden TV in a Diwali living room; canvas screen: CRT power-on, static, roll; 3 channels (Diwali Special + ticker, Fireworks Live, Please stand by) | `tvon` (dispatches `tv-on`) | `crtoff` | tune | tap knob: change channel |

Notes from chunk 3:
- New fonts in layout.tsx: `--f-fraktur` (UnifrakturMaguntia), `--f-vt323`, `--f-oldstd` (Old Standard TT).
- `mix()` in wedding/sig/util now accepts 3-digit hex (it silently produced wrong colours for "#fff" before).
- Use `plainDate()` from lib/format.ts on covers, never `toLocaleDateString` with several fields: server/client ICU
  differences caused a hydration error.
- Canvas text needs the font's real family: read `--f-*` from computed style and `document.fonts.load()` first;
  thumbnails must redraw after the fonts load (see tv.tsx onInit).

Chunk 3 pending (planned for 2026-10-02):
1. User runs a full MP4 export (watch Shubh TV and Kaagaz) and tests taps on a real phone.
2. Kaagaz: add an iOS `DeviceOrientationEvent.requestPermission()` prompt (e.g. on first tap) so tilt works on iPhone.
3. Make the fixed fun text editable: Chopda ledger rows, Diwali Times stories/weather, Chitthi P.S., TV ticker labels.
4. Chopda `flipup` turn: content overlaps mid-turn, so fade or dim the content during the flip.
5. Check a possible Chitthi inner-page crease over a text line (probably the reveal caught mid-frame).

Ideas not built yet (for later chunks): scratch-to-reveal greeting card, pop-up book, gramophone record.

### Later (parked by the user)
- More regional batches (Art Deco, pookalam, Warli/Kalamkari, pattachitra, gamosa…), and regional-language headings.

## Gujarati visiting cards (single side) — step 1 done (2026-10-02)
New category: print-first, single-side 3.5 × 2 in cards in Gujarati. Product plan (user's): the user fills one
side form (business name, owner, location, phone, email, logo, description) and "Apply to all" puts it on every
design at once; ₹99 unlocks all designs. Built **step by step**; step 1 = the templates only.

- Route `/gujarati` (linked from the gallery's category rail). `?fill=long` / `?fill=min` are stress tests.
- Data + templates: `src/lib/gujarati.ts` (`GujCardData`, `GUJ_TEMPLATES` with a realistic sample each, `GUJ_STRESS`,
  `initial()` monogram: hand-rolled so server/browser agree on Gujarati conjuncts).
- Designs: `src/components/gujarati/designs.tsx` → `GUJ_DESIGNS`, `<GujCard id d flat>` (700 × 400; `flat` drops paper grain for print).
- `Fit.tsx`: shrink-to-fit text (allows ~0.35 em vertical spill because Gujarati matras overflow the line box).
- Page grid: `GujStudio.tsx` (takes `data`, which will come from the side form in step 2). CSS `src/app/gujarati.css`.
- Fonts `src/app/gujFonts.ts` (Hind Vadodara, Mukta Vaani, Baloo Bhai 2, Rasa, Shrikhand, Anek Gujarati, Farsan,
  Kumar One, Noto Serif Gujarati, Mogra), applied on the page wrapper only.

| id | Name | Sample trade | Lang | Look |
| --- | --- | --- | --- | --- |
| gu-pedhi | Pedhi | kirana/traders | gu | cream, red double border, owner + મો. in top corners, red address band |
| gu-sonu | Sonu Chandi | jewellers | gu | maroon, gold gradient text, ornate corners, gold medallion |
| gu-keri | Keri | saree/textile | gu | rani-pink paisley panel, scalloped edge, kangura border |
| gu-toran | Toran | caterers | gu | marigold + mango-leaf toran, orange dotted band |
| gu-nakkar | Nakkar | hardware | mix | blue band, yellow slash, icon badges |
| gu-tulsi | Tulsi | clinic | mix | white, teal waves, minimal |
| gu-pathshala | Pathshala | tuition | mix | sunny, teal blob, pill chips |
| gu-shilp | Shilp | builder | mix | charcoal + champagne, line geometry |

Rules: no trade-specific motifs (details are applied to all designs), every slot shrinks to fit, empty fields leave
no gaps, 28 px safe zone. Text sizes are set for print (200 px/in, so body text 16–19 px ≈ 6–7 pt).
Verified: typecheck, no console errors, screenshots with sample / long / minimal data.

### Step 2: side form + Apply to all (done 2026-10-02)
- `GujStudio.tsx`: sticky right-side form (business*, owner, title/degree, description with a soft 160-char hint,
  phone, email with a format warning, address, logo upload via `/api/upload`). "Apply to all designs" (default on)
  puts the details on all 8; unticked, only on the selected card (click a card to select it; orange outline).
  Empty fields are dropped. Form + applied details + checkbox persist in localStorage (`gj-studio-v1`).
  "Clear my details" brings back the samples. On phones the form sits first and Apply scrolls to the cards.
- `?fill=` test pills show in development only.
- **Fixed a pre-existing bug:** `/api/upload` returned 500 for every upload (all editors), because Node 18 has no
  global `File`; the check is now `instanceof Blob`.
- Verified in Chrome: typing Gujarati, logo upload, apply-all, apply-one, reload restore, 390 px phone (no sideways scroll), no console errors.

### Step 3 + 4: downloads, watermark, ₹99 unlock (done 2026-10-02)
- Orders: `src/lib/gujStore.ts` → `.data/gujarati/<id>.json` = { cards (details per design), paid, payment }.
  Input is cleaned server-side (length limits; logo must be one of our `/api/uploads/...` files, so headless Chrome
  never fetches an outside URL). The page keeps the order id in localStorage and asks the server whether it's paid.
- API: `POST /api/gujarati` (save applied details) · `GET /api/gujarati/:id` · `POST /api/gujarati/:id/unlock` ·
  `GET /api/gujarati/:id/download?t=<design>&format=pdf|png|digital` (402 until paid; UTF-8 Gujarati file names).
- Print page `/gujarati/print?id&t&k`: bare card without a watermark; `k` is an HMAC only the server knows
  (`GUJ_PRINT_SECRET`, else a random key per process).
- Exports (`src/lib/gujRender.ts`, reuses the shared headless Chrome from render.ts, now exported as `browser()`):
  - Print PDF: 600 dpi artwork, **3 mm bleed made by extending the card's edge pixels**, crop marks; page 106.9 × 68.8 mm.
  - PNG: 2100 × 1200, tagged 600 dpi (pHYs chunk).  - WhatsApp: 1400 × 800, rounded corners, transparent outside.
- Screen: cards with the user's details show a "SHUBH CARDS · PREVIEW" watermark until paid (on-screen only; downloads
  are the protected part). Side panel has the unlock box; per-card download buttons appear once paid.
- **Payment is a mock**: `unlock` marks the order paid without charging (allowed in development, or with GUJ_MOCK_PAY=1;
  returns 501 in production otherwise). To go live: Razorpay order on the server → Checkout on the page → verify the
  signature in the unlock route → `markPaid(id, paymentId)`.
- Verified: API (402/404/bad logo stripped), PDF size + 602 ppi image + crop marks visually, PNG 2100×1200 @600 dpi,
  browser flow (watermark → unlock → PDF + WhatsApp downloads → reload keeps paid), no console errors.

### Colour themes (done 2026-10-02)
- 4 themes per design in `GUJ_PALETTES` (`src/lib/gujarati.ts`); the first is the original look. A theme is a set of
  CSS custom properties put on the card root (`GujCard theme=`); the design CSS and SVG art read only those variables
  (SVG uses `style={{ fill: "var(--x)" }}`, since var() in presentation attributes isn't reliable).
  Pedhi: Lal-Vadli, Kesar, Leelo, Neelam · Sonu Chandi: Maroon, Emerald, Navy & silver, Black & gold · Keri: Rani,
  Peacock, Galgota, Indigo · Toran: Galgota, Gulab, Mogra, Lal · Nakkar: Blue & yellow, Red & black, Green & lime,
  Black & orange · Tulsi: Teal, Blue, Purple, Rose · Pathshala: Sunny, Sky, Lavender, Mint · Shilp: Charcoal & copper,
  Navy & gold, Forest & brass, Ivory & black.
- UI: colour dots under each card (per design, works on samples too), saved in localStorage; downloads pass
  `&theme=` → print page. Verified: all 32 combinations screenshot-checked; downloaded image uses the chosen theme.

### Several people & numbers (done 2026-10-02)
- `GujCardData.people: GujPerson[]` ({ name?, role?, phones: { number, label?: mobile | office | whatsapp }[] }).
  Limits: 3 people, 2 numbers each, 4 numbers in all (`GUJ_MAX_*`, enforced in the form and in `cleanPeople` on the
  server). The older owner/role/phone fields still load: `peopleOf(d)` reads either shape (old saved forms too).
- Cards: `Owner` stacks every person's name + title; `phoneLines` makes one line per person per label, tagged with the
  first name when there are several people ("રમેશભાઈ: 98250 12345"); the icon shows the label (handset / desk phone /
  WhatsApp). Pedhi puts people in the classic corners (left / centre / right) with "મો." / "ફોન" prefixes; Toran
  wraps the numbers centred; Pathshala makes a chip per line. Contacts shrink a little when there are 5–6 lines.
- Samples now show it: Pedhi has two partners, Nakkar a mobile + shop number. Test pill `?fill=team` (3 people, 4 numbers).
- Form: a box per person (name, title, numbers with a type select), "+ Add another number", "+ Add another person", ×
  to remove. Verified: limits, remove, apply, reload, legacy restore, PDF download, phone layout, no console errors.

Open decisions for the user (parked for after the MVP): real payment gateway + keys; whether details can still be edited after paying (now: yes);
A4 sheet of 10 cards for home printing; more phone numbers; deity line; Gujarati transliteration.

## Festival business posts (static images) — step 1 done (2026-10-02)
Plan agreed with the user: like the Gujarati cards (side form → Apply to all), but social-media IMAGES (no video).
5 templates: Navratri, Dussehra, Dhanteras, Diwali, Bestu Varas. English; Navratri + Bestu Varas mixed Gujarati/English.
Every text on a template is editable (greeting heading, wish, message; defaults from the template). No pricing/unlock in this MVP.
Shapes: 1:1 1080², 4:5 1080×1350, 9:16 1080×1920 (Facebook 1.91:1 left out). All 1080 wide, so the brand block is
the same everywhere; each design **recomposes** vertically (not scaled). Story: text + brand stay out of the top 250 /
bottom 340 px (`STORY_SAFE`); only art goes there.

- Route `/posts` (`?fill=long|min` stress pills, dev only). Not yet linked from the gallery.
- `src/lib/posts.ts`: `PostBrand` (business, owner, services, phones[≤2], address, social, website, offer, logo),
  `PostText` (heading, wish, message), `POST_RATIOS`, `POST_TEMPLATES`, `POST_SAMPLE`, `POST_STRESS`.
- `src/components/posts/common.tsx`: `Brand` (logo | name/owner/services | phones, footer: address · social · web;
  sparse data → bigger), `Offer` ribbon, `FitName` (1 line down to 70%, then 2 lines), `Squeeze` (scales a whole stack
  down if it overflows its box), `splitHeading` ("Happy Diwali" → script "Happy" + display "Diwali"), `seeded()`.
- `designs.tsx` → `POST_DESIGNS` / `<PostCard id ratio b t>`; `PostsPreview.tsx` shows each template in all shapes.
- **Diwali · Dwaar** (`Dwaar.tsx`): indigo lime-wash wall, carved teak frame + brass studs, doors open on a lit room,
  procedural marigold toran (ruffle filter) + mango leaves, side garlands that lengthen with the shape, Shubh–Labh in
  kumkum, clay diyas on a kota-stone step. Story: brand becomes an inset card; floor with powder rangoli fills the
  bottom (unsafe) zone. Geometry per shape in `GEO`.
- Verified: typecheck, no console errors, screenshots of all 3 shapes × sample / long / minimal.

### Step 2: the other 4 templates (done 2026-10-02)
User asked for a DIFFERENT design AND layout structure for each, to compare and pick from. Order on the page = festival date.

| Template (file) | Medium | Structure | Brand |
| --- | --- | --- | --- |
| Navratri · Garbo (`Garbo.tsx`) | red bandhani (displaced dot pattern + fold lighting), lit terracotta garbo throwing light dots, lacquered dandiya | brand FIRST at top, greeting middle, pot rising from bottom | `Brand` on an embroidered mirror-work patch |
| Dussehra · Dahan (`Dahan.tsx`) | dusk Ramlila ground, 10-headed paper/bamboo Ravan, fire at feet, embers, crowd | SPLIT: text + brand in a left column, effigy right | `Brand` with `is-stack` in a dark card |
| Dhanteras · Thali (`Thali.tsx`) | top-down embossed brass thali on peacock-green silk, silver/gold coins, kumkum katori, diya, rice, petals | CENTRED: logo + name head, greeting ENGRAVED in the brass, contacts below | custom split head/foot |
| Diwali · Dwaar (`Dwaar.tsx`) | doorway (step 1) | stacked: art + bottom band | `Brand` band |
| Bestu Varas · Paatiyu (`Paatiyu.tsx`) | hand-painted enamel signboard on chains, lime-wash wall with brick showing | BUSINESS-FIRST: the name is the sign | custom painted lettering |

- `PostText.local` = Gujarati line (Navratri "શુભ નવરાત્રી", Bestu Varas "નૂતન વર્ષાભિનંદન"); page wrapper loads `gujFontVars`.
  Kumar One shaped "વર્ષાભિનંદન" badly → Baloo Bhai 2 800 on the signboard.
- Stress text is now per template: `stressText(tpl.text, "long" | "min")`.
- Long festival text is line-clamped with "…" (CSS block at the end of posts.css).
- Verified: typecheck, no console errors, all 15 posts screenshot-checked with sample / long / minimal data.

Next: user picks/adjusts designs → step 3 side form + Apply to all (+ per-template text edit) → step 4 PNG per shape,
ZIP of all, mobile Share.
