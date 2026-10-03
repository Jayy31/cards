# Festival Posts for Business: status and what's left

Last updated: 2026-10-02 · Page: http://localhost:3100/posts (dev: `?fill=long` / `?fill=min` test buttons)
Technical details: see the "Festival business posts" section in `HANDOFF.md`.

## The idea (agreed)
A business fills one side form (name, owner, phones, logo, address, services, offer, Instagram, website), ticks
"Apply to all", and sees its details on every festival post at once. Each post comes in the sizes social media needs.
Static images only (no video). Like the Gujarati visiting cards flow.

## Decisions made
- 5 templates for the MVP: Navratri, Dussehra, Dhanteras, Diwali, Bestu Varas.
- English; Navratri and Bestu Varas are mixed Gujarati + English.
- Every text on a template is editable (greeting heading, Gujarati line, wish, message); the template only gives defaults.
- Sizes: Square 1080×1080, Portrait 1080×1350, Story 1080×1920. Facebook landscape (1.91:1) left out.
- Each design rearranges itself per size (not scaled/cropped). Story keeps text out of the top 250 px and bottom 340 px
  (Instagram/WhatsApp cover those).
- No pricing, watermark or unlock in this MVP (decide later).
- Realistic designs, each a different real medium, no repeated effects, no neon.

## Done
### Step 1: base + Diwali (done)
- Data model, sizes, sample + stress data, shared brand block, shrink-to-fit text.
- **Diwali · Dwaar**: doorway with carved teak frame, marigold toran, Shubh–Labh, clay diyas; brand band at the bottom.

### Step 2: the other 4, each with a different layout (done)
| Template | Look | Layout |
| --- | --- | --- |
| Navratri · Garbo | red bandhani, lit garbo pot throwing light dots, dandiya | business details FIRST on a mirror-work patch at the top |
| Dussehra · Dahan | dusk Ramlila ground, 10-headed Ravan catching fire, crowd | SPLIT: text + business card left, effigy right |
| Dhanteras · Thali | top-down brass thali on green silk, coins, kumkum, diya | CENTRED: logo + name on top, greeting engraved in brass, contacts below |
| Diwali · Dwaar | doorway, toran, diyas | greeting in the doorway, business band at the bottom |
| Bestu Varas · Paatiyu | hand-painted yellow shop signboard on chains | BUSINESS NAME IS THE SIGN, greeting painted under it |

Checked: all 15 posts (5 × 3 sizes) with sample, very long and minimal data; no console errors.

## Left to build
### Step 3: side form + Apply to all (next)
- Side form: business name*, owner, services, up to 2 phones, address, Instagram, website, offer line, logo upload.
- "Apply to all" (default on) / apply to the selected post only.
- Per-template text editing: Gujarati line (mixed templates), heading, wish, message; "reset to default".
- Size tabs (Square | Portrait | Story) over the grid; click a post to see all 3 sizes side by side.
- Save form in the browser (like Gujarati), "Clear my details".
- Link `/posts` from the gallery's category rail.

### Step 4: downloads
- PNG per post per size at exact pixels (headless Chrome, reusing the Gujarati render setup).
- "Download all sizes" ZIP per post, and maybe "all posts" ZIP.
- Mobile Share button (opens WhatsApp / Instagram with the image).
- Server-side order save + clean input (like `gujStore`).

### Step 5: polish + checks
- Check festival dates for 2026 against a panchang (now approximate: Navratri 11 Oct, Dussehra 20 Oct,
  Dhanteras 6 Nov, Diwali 8 Nov, Bestu Varas 10 Nov). Show the next festival first.
- Test on a real phone (390 px layout, typing Gujarati, share).
- Test with a real uploaded logo on every template (only monograms tested so far).

## Known issues (small)
- Very long details: business name, owner, services and offer get cut with "…" in some sizes.
- Dussehra's Ravan looks more like an illustration than a photo (least realistic of the five).
- In the Story size, the bottom of the signboard (Paatiyu) is plain yellow. That strip is covered by the app's reply box anyway.

## For you to pick / decide
1. **Which layouts to keep?** Keep all 5 as they are, or move some templates to the layout you like best
   (business-first top patch / split column / centred / bottom band / business-name-as-sign).
2. **Design changes** per template (colours, more realism on Ravan, etc.).
3. **Colour themes per template** (like the Gujarati cards' 4 themes each)? Yes / no / later.
4. **Offer line**: keep it on every template, or only on the ones where it looks best?
5. **Gujarati**: keep only Navratri + Bestu Varas mixed, or add a Gujarati line option to all?
6. **Facebook landscape 1.91:1**: still skip for the MVP?
7. **Next festivals after these 5** (e.g. Bhai Dooj, Dev Diwali, Uttarayan, Holi): when, and how many per festival?
8. **Pricing / watermark / unlock**: parked; decide after the MVP.
