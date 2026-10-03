import "server-only";
import { spawn } from "child_process";
import { promises as fs, existsSync } from "fs";
import os from "os";
import path from "path";
import puppeteer, { type Browser } from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";
import { encodeWav, synthesize } from "./music";
import { RENDERS, UPLOADS } from "./store";
import type { CardData } from "./types";

/**
 * Server-side rendering of exports with headless Chrome — the exact same React
 * components as the live card, so PNG / PDF / MP4 match what guests see.
 */

const CHROME = process.env.CHROME_PATH || ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium"].find((p) => existsSync(p)) || "google-chrome";

const g = globalThis as unknown as { __browser?: Promise<Browser>; __jobs?: Map<string, VideoJob> };

<<<<<<< HEAD
async function browser() {
=======
export async function browser() {
>>>>>>> master
  if (!g.__browser) {
    g.__browser = puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none", "--force-color-profile=srgb"],
    });
    g.__browser.then((b) => b.on("disconnected", () => (g.__browser = undefined))).catch(() => (g.__browser = undefined));
  }
  return g.__browser;
}

async function openPage(url: string, width: number, height: number, scale: number) {
  const b = await browser();
  const page = await b.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

/** `size` is the page in card units: 500×700 for invitations, the card's own size for business cards. */
export async function exportPdf(printUrl: string, size: { w: number; h: number }) {
  const page = await openPage(printUrl, 800, 900, 1);
  try {
    await page.addStyleTag({ content: `@page { size: ${size.w}px ${size.h}px; margin: 0 }` });
    return await page.pdf({ width: `${size.w}px`, height: `${size.h}px`, printBackground: true, preferCSSPageSize: true });
  } finally {
    await page.close();
  }
}

/** pageIndex -1 = every page on one sheet (e.g. both sides of a business card). */
export async function exportPng(printUrl: string, pageIndex: number, scale = 2) {
  const page = await openPage(printUrl, 800, 900, scale);
  try {
    if (pageIndex < 0) {
      const sheet = await page.$(".print-sheet");
      return (await sheet!.screenshot({ type: "png" })) as Buffer;
    }
    const els = await page.$$(".print-page");
    const el = els[Math.max(0, Math.min(els.length - 1, pageIndex))];
    return (await el.screenshot({ type: "png" })) as Buffer;
  } finally {
    await page.close();
  }
}

/* ---------------- video ---------------- */

export interface VideoJob {
  key: string;
  status: "rendering" | "encoding" | "done" | "error";
  progress: number;
  file?: string;
  error?: string;
}

const jobs = (g.__jobs ??= new Map<string, VideoJob>());

export function getJob(key: string) {
  return jobs.get(key);
}

async function audioTrack(data: CardData, seconds: number): Promise<string | null> {
  if (data.kind !== "invite" || data.music === "none") return null;
  if (data.music === "custom") {
    const name = data.musicUrl?.split("/").pop();
    const f = name ? path.join(UPLOADS, name) : "";
    return f && existsSync(f) ? f : null;
  }
  const sr = 22050;
  const loop = synthesize(data.music, 32, sr);
  const total = new Float32Array(Math.ceil(seconds * sr));
  for (let i = 0; i < total.length; i++) total[i] = loop[i % loop.length];
  const f = path.join(os.tmpdir(), `shubh-audio-${Date.now()}.wav`);
  await fs.writeFile(f, encodeWav(total, sr));
  return f;
}

function ffmpeg(args: string[], stdin = false) {
  const ff = spawn(ffmpegPath as unknown as string, ["-y", "-loglevel", "error", ...args], { stdio: [stdin ? "pipe" : "ignore", "ignore", "pipe"] });
  let err = "";
  ff.stderr!.on("data", (d) => (err = (err + d).slice(-2000)));
  const done = new Promise<void>((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}: ${err}`)))));
  return { ff, done };
}

/**
 * Renders the live viewer frame-by-frame: `window.__card.seek(t)` puts every
 * animation (envelope, page turns, petals, light) at time t, then Chrome takes
 * a screenshot that is piped straight into ffmpeg. Frames are split across
 * several tabs in parallel, encoded as segments, then joined with the music.
 */
export function startVideo(key: string, renderUrl: string, data: CardData, opts: { fps?: number; hd?: boolean } = {}) {
  const fps = opts.fps ?? 30;
  const existing = jobs.get(key);
  if (existing && existing.status !== "error") return existing;
  const job: VideoJob = { key, status: "rendering", progress: 0 };
  jobs.set(key, job);

  (async () => {
    await fs.mkdir(RENDERS, { recursive: true });
    const out = path.join(RENDERS, `${key}.mp4`);
    if (existsSync(out)) {
      Object.assign(job, { status: "done", progress: 1, file: out });
      return;
    }
    // Headless Chrome shares one software GPU process, so extra tabs mostly contend;
    // scale out with more machines/containers instead (RENDER_WORKERS to override).
    const workers = Math.max(1, Math.min(8, Number(process.env.RENDER_WORKERS) || 1));
    const scale = opts.hd ? 2 : 4 / 3; // 1080×1920 or 720×1280
    const pages = await Promise.all(Array.from({ length: workers }, () => openPage(renderUrl, 540, 960, scale)));
    const tmpFiles: string[] = [];
    let audio: string | null = null;
    try {
      await Promise.all(pages.map((pg) => pg.waitForFunction(() => window.__card?.ready === true, { timeout: 60_000 })));
      const duration = await pages[0].evaluate(() => window.__card!.duration);
      const frames = Math.ceil(duration * fps);
      const chunk = Math.ceil(frames / workers);
      let rendered = 0;

      await Promise.all(
        pages.map(async (pg, w) => {
          const from = w * chunk;
          const to = Math.min(frames, from + chunk);
          if (from >= to) return;
          const seg = `${out}.seg${w}.mp4`;
          tmpFiles.push(seg);
          const { ff, done } = ffmpeg(["-f", "image2pipe", "-framerate", String(fps), "-i", "-", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(fps), seg], true);
          for (let f = from; f < to; f++) {
            await pg.evaluate((t) => window.__card!.seek(t), f / fps);
            const shot = (await pg.screenshot({ type: "jpeg", quality: 92 })) as Buffer;
            if (!ff.stdin!.write(shot)) await new Promise((r) => ff.stdin!.once("drain", r));
            rendered++;
            job.progress = rendered / frames;
          }
          ff.stdin!.end();
          await done;
        }),
      );

      job.status = "encoding";
      tmpFiles.sort();
      const list = `${out}.txt`;
      tmpFiles.push(list);
      await fs.writeFile(list, tmpFiles.filter((f) => f.endsWith(".mp4")).map((f) => `file '${f}'`).join("\n"));
      audio = await audioTrack(data, duration);
      const args = ["-f", "concat", "-safe", "0", "-i", list];
      if (audio) args.push("-i", audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "160k", "-af", `afade=t=in:d=1.5,afade=t=out:st=${Math.max(0, duration - 2.5).toFixed(2)}:d=2.5`, "-shortest");
      args.push("-c:v", "copy", "-movflags", "+faststart", `${out}.part.mp4`);
      await ffmpeg(args).done;
      await fs.rename(`${out}.part.mp4`, out);
      Object.assign(job, { status: "done", progress: 1, file: out });
    } catch (e) {
      Object.assign(job, { status: "error", error: e instanceof Error ? e.message.slice(0, 400) : String(e) });
    } finally {
      await Promise.all(pages.map((pg) => pg.close().catch(() => {})));
      for (const f of tmpFiles) fs.unlink(f).catch(() => {});
      if (audio && audio.startsWith(os.tmpdir())) fs.unlink(audio).catch(() => {});
    }
  })().catch((e) => Object.assign(job, { status: "error", error: String(e) }));

  return job;
}
