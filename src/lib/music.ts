import { rng } from "./format";

/**
 * Procedural, royalty-free background music.
 *
 * Both tracks are synthesised with Karplus–Strong plucked strings, so the exact
 * same audio is produced in the browser (live playback) and on the server
 * (muxed into the exported MP4). No licensed audio is needed.
 *
 *  - "tanpura": the classic four-string drone (Pa · Sa · Sa · low Sa) with jawari buzz
 *  - "santoor": tanpura drone + a gentle generative melody in Raag Bhupali
 */

export type SynthKind = "santoor" | "tanpura";

const SA = 138.59; // C#3 — a common tanpura tonic

function pluck(
  out: Float32Array,
  sr: number,
  startSec: number,
  freq: number,
  opts: { amp: number; decay: number; bright: number; dur: number; buzz?: number; seed: number },
) {
  const start = Math.floor(startSec * sr);
  const len = Math.min(out.length - start, Math.floor(opts.dur * sr));
  if (len <= 0) return;
  const N = Math.max(2, Math.round(sr / freq));
  const buf = new Float32Array(N);
  const r = rng(opts.seed);
  // Filtered noise burst: `bright` controls how much high-frequency energy the pluck has.
  let prev = 0;
  for (let i = 0; i < N; i++) {
    const n = r() * 2 - 1;
    prev = prev + opts.bright * (n - prev);
    buf[i] = prev;
  }
  const buzz = opts.buzz ?? 0;
  for (let i = 0; i < len; i++) {
    const idx = i % N;
    const nxt = (idx + 1) % N;
    const v = buf[idx];
    buf[idx] = (buf[idx] + buf[nxt]) * 0.5 * opts.decay;
    // Jawari: a soft asymmetric non-linearity adds the tanpura's shimmering overtones.
    const shaped = buzz ? v + buzz * (Math.tanh(v * 4) * 0.25 - v * 0.2) : v;
    const attack = Math.min(1, i / (sr * 0.004));
    const release = i > len - sr * 0.3 ? (len - i) / (sr * 0.3) : 1;
    out[start + i] += shaped * opts.amp * attack * release;
  }
}

function bell(out: Float32Array, sr: number, startSec: number, freq: number, amp: number) {
  const start = Math.floor(startSec * sr);
  const len = Math.min(out.length - start, Math.floor(sr * 4));
  const partials = [
    [1, 1, 1.4],
    [2.0, 0.5, 1.0],
    [2.76, 0.35, 0.8],
    [5.4, 0.18, 0.4],
    [8.93, 0.08, 0.25],
  ];
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    let s = 0;
    for (const [m, a, d] of partials) s += a * Math.sin(2 * Math.PI * freq * m * t) * Math.exp(-t / d);
    out[start + i] += s * amp * Math.min(1, i / (sr * 0.002));
  }
}

/** Small Schroeder reverb: 4 damped combs + 2 allpasses. */
function reverb(input: Float32Array, sr: number, wet = 0.28) {
  const k = sr / 44100;
  const combs = [1116, 1188, 1277, 1356].map((d) => Math.round(d * k));
  const allp = [556, 441].map((d) => Math.round(d * k));
  const out = new Float32Array(input.length);
  for (const d of combs) {
    const b = new Float32Array(d);
    let idx = 0;
    let store = 0;
    for (let i = 0; i < input.length; i++) {
      const y = b[idx];
      store = y * 0.8 + store * 0.2;
      b[idx] = input[i] + store * 0.8;
      out[i] += y * 0.25;
      idx = (idx + 1) % d;
    }
  }
  for (const d of allp) {
    const b = new Float32Array(d);
    let idx = 0;
    for (let i = 0; i < out.length; i++) {
      const bo = b[idx];
      const y = -out[i] + bo;
      b[idx] = out[i] + bo * 0.5;
      out[i] = y;
      idx = (idx + 1) % d;
    }
  }
  const mix = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) mix[i] = input[i] * (1 - wet) + out[i] * wet;
  return mix;
}

export function synthesize(kind: SynthKind, seconds = 32, sr = 22050): Float32Array {
  const tail = 3;
  const total = seconds + tail;
  const raw = new Float32Array(Math.ceil(total * sr));

  // Tanpura drone: Pa (lower) · Sa · Sa · Sa (lower octave), one cycle every 4 s.
  const cycle = [SA * 0.75, SA, SA, SA * 0.5];
  let seed = 11;
  for (let t = 0; t < total; t += 4) {
    cycle.forEach((f, i) => {
      pluck(raw, sr, t + i * 1.0, f, {
        amp: kind === "tanpura" ? 0.55 : 0.32,
        decay: 0.9992,
        bright: 0.55,
        dur: 5.5,
        buzz: 1,
        seed: seed++,
      });
    });
  }

  if (kind === "santoor") {
    // Raag Bhupali (S R G P D) — pentatonic, bright and auspicious.
    const scale = [0, 2, 4, 7, 9, 12, 14, 16];
    const r = rng(2024);
    let deg = 2;
    let t = 1.2;
    while (t < total - 1) {
      const phrase = 4 + Math.floor(r() * 5);
      for (let i = 0; i < phrase && t < total - 1; i++) {
        deg = Math.max(0, Math.min(scale.length - 1, deg + Math.floor(r() * 5) - 2));
        const f = SA * 2 * Math.pow(2, scale[deg] / 12);
        const opts = { amp: 0.42, decay: 0.9965, bright: 0.9, dur: 2.2, seed: seed++ };
        pluck(raw, sr, t, f, opts);
        // Santoor players often double-strike a note (quick tremolo).
        if (r() < 0.3) pluck(raw, sr, t + 0.11, f, { ...opts, amp: 0.26, seed: seed++ });
        t += [0.34, 0.5, 0.5, 0.68][Math.floor(r() * 4)];
      }
      t += 0.8 + r() * 0.9; // breathe between phrases
    }
  } else {
    for (let t = 2; t < total; t += 8) bell(raw, sr, t, 880, 0.05);
  }

  const wet = reverb(raw, sr);

  // Seamless loop: cross-fade the tail back over the head.
  const n = Math.floor(seconds * sr);
  const fade = Math.floor(tail * sr);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = wet[i];
  for (let i = 0; i < fade; i++) {
    const a = i / fade;
    out[i] = wet[i] * a + wet[n + i] * (1 - a);
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const g = peak > 0 ? 0.8 / peak : 1;
  for (let i = 0; i < n; i++) out[i] *= g;
  return out;
}

/** 16-bit PCM mono WAV. */
export function encodeWav(samples: Float32Array, sr: number): Uint8Array {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  v.setUint32(4, 36 + samples.length * 2, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  w(36, "data");
  v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Uint8Array(buf);
}
