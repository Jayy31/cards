import { atan2, cos, rng, sin } from "./format";

/*
 * The night sky over a place at a moment: bright-star catalogue, constellation
 * lines, alt/az maths, a stereographic chart projection and the moon's phase
 * and position. Low-precision but true to the sky (good to ~0.5°).
 * All trig goes through the rounded helpers so server and client agree.
 */

const D = Math.PI / 180;
const asin = (x: number) => atan2(x, Math.sqrt(Math.max(0, 1 - x * x)));
const norm = (x: number) => ((x % 360) + 360) % 360;

/** [name, RA hours, Dec degrees, magnitude] */
export const STARS: [string, number, number, number][] = [
  ["Sirius", 6.752, -16.72, -1.46], ["Canopus", 6.399, -52.7, -0.72], ["Arcturus", 14.261, 19.18, -0.05], ["Alpha Centauri", 14.66, -60.83, -0.27],
  ["Vega", 18.616, 38.78, 0.03], ["Capella", 5.278, 46.0, 0.08], ["Rigel", 5.242, -8.2, 0.13], ["Procyon", 7.655, 5.22, 0.37],
  ["Achernar", 1.629, -57.24, 0.46], ["Betelgeuse", 5.919, 7.41, 0.5], ["Hadar", 14.064, -60.37, 0.61], ["Altair", 19.846, 8.87, 0.77],
  ["Acrux", 12.443, -63.1, 0.77], ["Aldebaran", 4.599, 16.51, 0.85], ["Antares", 16.49, -26.43, 0.96], ["Spica", 13.42, -11.16, 0.97],
  ["Pollux", 7.755, 28.03, 1.14], ["Fomalhaut", 22.961, -29.62, 1.16], ["Deneb", 20.69, 45.28, 1.25], ["Mimosa", 12.795, -59.69, 1.25],
  ["Regulus", 10.14, 11.97, 1.35], ["Adhara", 6.977, -28.97, 1.5], ["Castor", 7.577, 31.89, 1.58], ["Shaula", 17.56, -37.1, 1.62],
  ["Gacrux", 12.519, -57.11, 1.63], ["Bellatrix", 5.419, 6.35, 1.64], ["Elnath", 5.438, 28.61, 1.65], ["Alnilam", 5.604, -1.2, 1.69],
  ["Alnitak", 5.679, -1.94, 1.77], ["Alioth", 12.9, 55.96, 1.77], ["Dubhe", 11.062, 61.75, 1.79], ["Mirfak", 3.405, 49.86, 1.79],
  ["Wezen", 7.14, -26.39, 1.83], ["Sargas", 17.622, -43.0, 1.86], ["Kaus Australis", 18.403, -34.38, 1.85], ["Alkaid", 13.792, 49.31, 1.86],
  ["Menkalinan", 5.992, 44.95, 1.9], ["Alhena", 6.629, 16.4, 1.93], ["Polaris", 2.53, 89.26, 1.98], ["Mirzam", 6.378, -17.96, 1.98],
  ["Alphard", 9.46, -8.66, 1.99], ["Hamal", 2.12, 23.46, 2.0], ["Nunki", 18.921, -26.3, 2.05], ["Algieba", 10.333, 19.84, 2.08],
  ["Alpheratz", 0.14, 29.09, 2.06], ["Mirach", 1.162, 35.62, 2.05], ["Kochab", 14.845, 74.16, 2.08], ["Saiph", 5.796, -9.67, 2.09],
  ["Denebola", 11.818, 14.57, 2.13], ["Algol", 3.136, 40.96, 2.12], ["Almach", 2.065, 42.33, 2.1], ["Mizar", 13.399, 54.93, 2.23],
  ["Sadr", 20.37, 40.26, 2.23], ["Schedar", 0.675, 56.54, 2.24], ["Mintaka", 5.533, -0.3, 2.23], ["Alphecca", 15.578, 26.71, 2.23],
  ["Caph", 0.153, 59.15, 2.28], ["Dschubba", 16.006, -22.62, 2.29], ["Wei", 16.836, -34.29, 2.29], ["Merak", 11.031, 56.38, 2.37],
  ["Izar", 14.75, 27.07, 2.37], ["Kappa Sco", 17.708, -39.03, 2.41], ["Phecda", 11.897, 53.69, 2.44], ["Aludra", 7.402, -29.3, 2.45],
  ["Scheat", 23.063, 28.08, 2.42], ["Markab", 23.079, 15.21, 2.49], ["Gienah", 20.77, 33.97, 2.48], ["Gamma Cas", 0.945, 60.72, 2.15],
  ["Acrab", 16.091, -19.81, 2.62], ["Ascella", 19.043, -29.88, 2.6], ["Zosma", 11.235, 20.52, 2.56], ["Ruchbah", 1.43, 60.24, 2.68],
  ["Muphrid", 13.911, 18.4, 2.68], ["Lesath", 17.512, -37.3, 2.7], ["Mahasim", 5.995, 37.21, 2.62], ["Porrima", 12.694, -1.45, 2.74],
  ["Kaus Media", 18.35, -29.83, 2.72], ["Tarazed", 19.771, 10.61, 2.72], ["Hassaleh", 4.95, 33.17, 2.69], ["Algenib", 0.221, 15.18, 2.83],
  ["Kaus Borealis", 18.466, -25.42, 2.81], ["Vindemiatrix", 13.036, 10.96, 2.79], ["Sheratan", 1.911, 20.81, 2.64], ["Albireo", 19.512, 27.96, 3.05],
  ["Pherkad", 15.345, 71.83, 3.0], ["Seginus", 14.535, 38.31, 3.03], ["Alcyone", 3.791, 24.11, 2.87], ["Mebsuta", 6.383, 25.13, 3.06],
  ["Gomeisa", 7.453, 8.29, 2.89], ["Alnasl", 18.097, -30.42, 2.99], ["Delta Cyg", 19.75, 45.13, 2.87], ["Megrez", 12.257, 57.03, 3.31],
  ["Phi Sgr", 18.761, -26.99, 3.17], ["Tau Sgr", 19.116, -27.67, 3.32], ["Sulafat", 18.982, 32.69, 3.25], ["Sheliak", 18.835, 33.36, 3.52],
  ["Segin", 1.907, 63.67, 3.37], ["Meissa", 5.585, 9.93, 3.39], ["Ain", 4.477, 19.18, 3.53], ["Zeta Tau", 5.627, 21.14, 3.0],
  ["Wasat", 7.335, 21.98, 3.53], ["Chertan", 11.237, 15.43, 3.33], ["Eta Leo", 10.122, 16.76, 3.48], ["Adhafera", 10.278, 23.42, 3.43],
  ["Nekkar", 15.032, 40.39, 3.49], ["Alshain", 19.922, 6.41, 3.71], ["Delta Cru", 12.252, -58.75, 2.79],
];

const IDX = Object.fromEntries(STARS.map((s, i) => [s[0], i]));

/** Constellation figures as chains of star names. */
const FIGURES: string[][] = [
  ["Betelgeuse", "Bellatrix"], ["Betelgeuse", "Meissa", "Bellatrix"], ["Betelgeuse", "Alnitak", "Alnilam", "Mintaka", "Bellatrix"], ["Alnitak", "Saiph"], ["Mintaka", "Rigel"],
  ["Mirzam", "Sirius", "Wezen", "Aludra"], ["Sirius", "Adhara", "Wezen"], ["Procyon", "Gomeisa"],
  ["Castor", "Pollux", "Wasat", "Alhena"], ["Castor", "Mebsuta"],
  ["Aldebaran", "Ain", "Elnath"], ["Aldebaran", "Zeta Tau"],
  ["Capella", "Menkalinan", "Mahasim", "Elnath", "Hassaleh", "Capella"],
  ["Regulus", "Eta Leo", "Algieba", "Adhafera"], ["Algieba", "Zosma", "Denebola", "Chertan", "Regulus"], ["Zosma", "Chertan"],
  ["Dubhe", "Merak", "Phecda", "Megrez", "Dubhe"], ["Megrez", "Alioth", "Mizar", "Alkaid"], ["Kochab", "Pherkad"],
  ["Arcturus", "Izar", "Nekkar", "Seginus", "Arcturus"], ["Arcturus", "Muphrid"],
  ["Spica", "Porrima", "Vindemiatrix"],
  ["Acrab", "Dschubba", "Antares", "Wei", "Sargas", "Kappa Sco", "Shaula", "Lesath"],
  ["Vega", "Sheliak", "Sulafat", "Vega"],
  ["Deneb", "Sadr", "Albireo"], ["Gienah", "Sadr", "Delta Cyg"],
  ["Tarazed", "Altair", "Alshain"],
  ["Caph", "Schedar", "Gamma Cas", "Ruchbah", "Segin"],
  ["Markab", "Scheat", "Alpheratz", "Algenib", "Markab"], ["Alpheratz", "Mirach", "Almach"],
  ["Kaus Australis", "Ascella", "Phi Sgr", "Kaus Media", "Kaus Australis"], ["Kaus Media", "Kaus Borealis", "Phi Sgr", "Nunki", "Tau Sgr", "Ascella"], ["Kaus Media", "Alnasl", "Kaus Australis"],
  ["Acrux", "Gacrux"], ["Mimosa", "Delta Cru"], ["Alpha Centauri", "Hadar"], ["Mirfak", "Algol"], ["Hamal", "Sheratan"],
];

export const LINES: [number, number][] = FIGURES.flatMap((f) => f.slice(1).map((n, i) => [IDX[f[i]], IDX[n]] as [number, number])).filter(([a, b]) => a != null && b != null);

/** Faint background stars, fixed on the celestial sphere so they wheel with the sky. */
export const FAINT: [number, number, number][] = (() => {
  const r = rng(2026);
  return Array.from({ length: 1100 }, () => {
    const ra = r() * 24;
    const dec = asin(r() * 2 - 1) / D;
    return [ra, dec, 3.6 + r() * r() * 3];
  });
})();

/** Milky Way: dots scattered about the galactic plane, converted to RA/Dec. */
export const MILKY: [number, number][] = (() => {
  const r = rng(7);
  const dG = 27.12825 * D;
  const aG = 192.85948;
  const lN = 122.93192;
  return Array.from({ length: 1600 }, () => {
    const l = r() * 360;
    // concentrate toward the plane, and brighter toward the galactic centre
    const g = (r() + r() + r() - 1.5) * 2;
    const b = g * (6 + 6 * Math.abs(cos(((l - 0) / 2) * D))) * D;
    const dl = (lN - l) * D;
    const sinDec = sin(b) * sin(dG) + cos(b) * cos(dG) * cos(dl);
    const dec = asin(sinDec);
    const ra = aG + atan2(cos(b) * sin(dl), sin(b) * cos(dG) - cos(b) * sin(dG) * cos(dl)) / D;
    return [norm(ra) / 15, dec / D];
  });
})();

/** Rough coordinates of places a venue might name. */
const PLACES: [string, number, number][] = [
  ["mumbai", 19.08, 72.88], ["bandra", 19.06, 72.83], ["delhi", 28.61, 77.21], ["gurgaon", 28.46, 77.03], ["noida", 28.54, 77.39], ["ahmedabad", 23.02, 72.57],
  ["vadodara", 22.31, 73.18], ["surat", 21.17, 72.83], ["jaipur", 26.91, 75.79], ["udaipur", 24.59, 73.71], ["jodhpur", 26.24, 73.02], ["bengaluru", 12.97, 77.59],
  ["bangalore", 12.97, 77.59], ["chennai", 13.08, 80.27], ["kolkata", 22.57, 88.36], ["pune", 18.52, 73.86], ["hyderabad", 17.39, 78.49], ["goa", 15.49, 73.83],
  ["lucknow", 26.85, 80.95], ["amritsar", 31.63, 74.87], ["chandigarh", 30.73, 76.78], ["kochi", 9.93, 76.27], ["darbhanga", 26.15, 85.9], ["patna", 25.59, 85.14],
  ["havelock", 11.97, 92.99], ["andaman", 11.67, 92.74], ["shimla", 31.1, 77.17], ["manali", 32.24, 77.19], ["gulmarg", 34.05, 74.38], ["srinagar", 34.08, 74.8],
  ["rishikesh", 30.09, 78.27], ["jaisalmer", 26.92, 70.9], ["kumarakom", 9.62, 76.43], ["alleppey", 9.5, 76.34], ["kerala", 10.0, 76.3], ["kutch", 23.73, 69.86], ["rann", 23.73, 69.86], ["mussoorie", 30.46, 78.07], ["ooty", 11.41, 76.7], ["munnar", 10.09, 77.06], ["coorg", 12.34, 75.81], ["indore", 22.72, 75.86],
  ["bhopal", 23.26, 77.41], ["nagpur", 21.15, 79.09], ["dubai", 25.2, 55.27], ["bali", -8.34, 115.09], ["phuket", 7.88, 98.39], ["london", 51.51, -0.13],
];

export function placeOf(text: string): { lat: number; lon: number; name: string } {
  const t = text.toLowerCase();
  const hit = PLACES.find(([k]) => t.includes(k));
  return hit ? { lat: hit[1], lon: hit[2], name: hit[0].replace(/^\w/, (c) => c.toUpperCase()) } : { lat: 22.0, lon: 78.0, name: "India" };
}

/** Julian date from a local date-time string (YYYY-MM-DDTHH:mm) in the given UTC offset (hours). */
export function julian(local: string, tz = 5.5) {
  const [d, t = "20:00"] = local.split("T");
  const [Y, M, Dd] = d.split("-").map(Number);
  const [h, m] = t.split(":").map(Number);
  const ms = Date.UTC(Y, M - 1, Dd, h, m) - tz * 3600_000;
  return ms / 86400000 + 2440587.5;
}


/** Altitude and azimuth (degrees; azimuth from north through east). */
export function altAz(raH: number, decD: number, lat: number, lstD: number) {
  const ha = (lstD - raH * 15) * D;
  const dec = decD * D;
  const la = lat * D;
  const sinAlt = sin(dec) * sin(la) + cos(dec) * cos(la) * cos(ha);
  const alt = asin(sinAlt);
  const az = atan2(-sin(ha) * cos(dec), cos(la) * sin(dec) - sin(la) * cos(dec) * cos(ha));
  return { alt: alt / D, az: norm(az / D) };
}

export function lst(jd: number, lon: number) {
  return norm(280.46061837 + 360.98564736629 * (jd - 2451545.0) + lon);
}

/** Moon: equatorial position (low precision), age in days, illuminated fraction, and whether waxing. */
export function moon(jd: number) {
  const d = jd - 2451545.0;
  const L = norm(218.316 + 13.176396 * d);
  const Mm = norm(134.963 + 13.064993 * d) * D;
  const F = norm(93.272 + 13.22935 * d) * D;
  const lon = (L + 6.289 * sin(Mm)) * D;
  const lat = 5.128 * sin(F) * D;
  const e = 23.439 * D;
  const ra = atan2(sin(lon) * cos(e) - (sin(lat) / cos(lat)) * sin(e), cos(lon));
  const dec = asin(sin(lat) * cos(e) + cos(lat) * sin(e) * sin(lon));
  const syn = 29.530588853;
  const age = (((jd - 2451550.26) % syn) + syn) % syn;
  const illum = (1 - cos((2 * Math.PI * age) / syn)) / 2;
  const names = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
  const phase = names[Math.floor(((age / syn) * 8 + 0.5) % 8)];
  return { raH: norm(ra / D) / 15, dec: dec / D, age, illum, waxing: age < syn / 2, phase };
}

/** Stereographic projection from the zenith; horizon at radius R. East is on the left, as when looking up. */
export function project(alt: number, az: number, R: number) {
  const z = (90 - alt) * D;
  const r = R * (sin(z / 2) / cos(z / 2));
  return { x: -r * sin(az * D), y: -r * cos(az * D) };
}

export interface ChartStar {
  name: string;
  x: number;
  y: number;
  mag: number;
}

/** Everything a chart needs, for a date-time and place. */
export function skyChart(local: string, lat: number, lon: number, R: number) {
  const jd = julian(local);
  const s = lst(jd, lon);
  const place = (ra: number, dec: number) => {
    const { alt, az } = altAz(ra, dec, lat, s);
    return alt > -0.5 ? project(Math.max(alt, 0), az, R) : null;
  };
  const stars: (ChartStar | null)[] = STARS.map(([name, ra, dec, mag]) => {
    const p = place(ra, dec);
    return p ? { name, mag, x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 } : null;
  });
  const faint = FAINT.map(([ra, dec, mag]) => {
    const p = place(ra, dec);
    return p ? { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10, mag } : null;
  }).filter(Boolean) as { x: number; y: number; mag: number }[];
  const milky = MILKY.map(([ra, dec]) => {
    const p = place(ra, dec);
    return p ? { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 } : null;
  }).filter(Boolean) as { x: number; y: number }[];
  const lines = LINES.filter(([a, b]) => stars[a] && stars[b]).map(([a, b]) => [stars[a]!, stars[b]!] as [ChartStar, ChartStar]);
  const m = moon(jd);
  const mp = place(m.raH, m.dec);
  return { stars: stars.filter(Boolean) as ChartStar[], faint, milky, lines, moon: { ...m, pos: mp ? { x: Math.round(mp.x * 10) / 10, y: Math.round(mp.y * 10) / 10 } : null } };
}
