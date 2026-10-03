import "server-only";
import { browser } from "./render";
import { GUJ_H, GUJ_W } from "./gujarati";

/*
 * Exports for the Gujarati visiting cards (3.5 × 2 in), rendered by headless Chrome from the same React card:
 *  - print PNG: 600 dpi (2100 × 1200), tagged as 600 dpi
 *  - print PDF: 600 dpi artwork + 3 mm bleed (edge pixels extended) + crop marks, the format print shops ask for
 *  - digital PNG: 1400 × 800 with rounded corners, for WhatsApp / Instagram
 */

const DPI = 600;
const SCALE = DPI / 200; // cards are drawn at 200 px per inch
const MM = 25.4;
const TRIM = { w: 88.9, h: 50.8 }; // 3.5 × 2 in
const BLEED = 3;
const MARKS = 6; // space around the bleed for crop marks

async function shoot(url: string, scale: number, digital = false) {
  const page = await (await browser()).newPage();
  try {
    await page.setViewport({ width: GUJ_W + 40, height: GUJ_H + 40, deviceScaleFactor: scale });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 90_000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 150)); // let <Fit> re-measure after the fonts settle
    const el = await page.$(".gc");
    if (!el) throw new Error("Card did not render");
    if (!digital) await page.addStyleTag({ content: ".gc { border-radius: 0 !important; }" });
    return (await el.screenshot({ type: "png", omitBackground: digital })) as Buffer;
  } finally {
    await page.close();
  }
}

/* ---------- PNG dpi tag (pHYs chunk) ---------- */

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf: Buffer) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
/** Inserts a pHYs chunk after IHDR so print software reads the file as `dpi`. */
function withDpi(png: Buffer, dpi: number) {
  const ppm = Math.round(dpi / 0.0254);
  const data = Buffer.alloc(9);
  data.writeUInt32BE(ppm, 0);
  data.writeUInt32BE(ppm, 4);
  data[8] = 1; // unit: metre
  const type = Buffer.from("pHYs");
  const chunk = Buffer.alloc(21);
  chunk.writeUInt32BE(9, 0);
  type.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([type, data])), 17);
  const ihdrEnd = 8 + 25; // signature + IHDR chunk
  return Buffer.concat([png.subarray(0, ihdrEnd), chunk, png.subarray(ihdrEnd)]);
}

/* ---------- exports ---------- */

export async function printPng(url: string) {
  return withDpi(await shoot(url, SCALE), DPI);
}

export async function digitalPng(url: string) {
  return shoot(url, 2, true);
}

/** Bleed by extending the card's edge pixels outward (exact colour match at the trim), then crop marks. */
export async function printPdf(url: string) {
  const art = await shoot(url, SCALE);
  const page = await (await browser()).newPage();
  try {
    const bleedPx = Math.round((BLEED / MM) * DPI);
    const dataUrl = await page.evaluate(
      async (src: string, b: number) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const w = img.width;
        const h = img.height;
        const c = document.createElement("canvas");
        c.width = w + 2 * b;
        c.height = h + 2 * b;
        const x = c.getContext("2d")!;
        x.imageSmoothingEnabled = false;
        // edges: stretch the outermost 1 px row/column across the bleed
        x.drawImage(img, 0, 0, w, 1, b, 0, w, b);
        x.drawImage(img, 0, h - 1, w, 1, b, h + b, w, b);
        x.drawImage(img, 0, 0, 1, h, 0, b, b, h);
        x.drawImage(img, w - 1, 0, 1, h, w + b, b, b, h);
        // corners: the corner pixel
        x.drawImage(img, 0, 0, 1, 1, 0, 0, b, b);
        x.drawImage(img, w - 1, 0, 1, 1, w + b, 0, b, b);
        x.drawImage(img, 0, h - 1, 1, 1, 0, h + b, b, b);
        x.drawImage(img, w - 1, h - 1, 1, 1, w + b, h + b, b, b);
        x.drawImage(img, b, b);
        return c.toDataURL("image/png");
      },
      `data:image/png;base64,${art.toString("base64")}`,
      bleedPx,
    );

    const pw = TRIM.w + 2 * (BLEED + MARKS);
    const ph = TRIM.h + 2 * (BLEED + MARKS);
    const o = BLEED + MARKS; // trim edge offset from the page edge
    const len = MARKS - 1; // marks stop 1 mm short of the bleed
    const xs = [o, o + TRIM.w];
    const ys = [o, o + TRIM.h];
    const lines = [
      ...xs.flatMap((x) => [`M${x} 0V${len}`, `M${x} ${ph - len}V${ph}`]),
      ...ys.flatMap((y) => [`M0 ${y}H${len}`, `M${pw - len} ${y}H${pw}`]),
    ].join("");
    await page.setContent(
      `<!doctype html><html><head><style>
        @page { size: ${pw}mm ${ph}mm; margin: 0 }
        html, body { margin: 0; width: ${pw}mm; height: ${ph}mm; background: #fff; }
        img { position: absolute; left: ${MARKS}mm; top: ${MARKS}mm; width: ${TRIM.w + 2 * BLEED}mm; height: ${TRIM.h + 2 * BLEED}mm; }
        svg { position: absolute; inset: 0; width: ${pw}mm; height: ${ph}mm; }
      </style></head><body>
        <img src="${dataUrl}">
        <svg viewBox="0 0 ${pw} ${ph}"><path d="${lines}" stroke="#000" stroke-width="0.1" fill="none"/></svg>
      </body></html>`,
      { waitUntil: "load" },
    );
    return await page.pdf({ width: `${pw}mm`, height: `${ph}mm`, printBackground: true, preferCSSPageSize: true });
  } finally {
    await page.close();
  }
}
