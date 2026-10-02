import type { CSSProperties } from "react";

/*
 * Procedural material textures for business cards: SVG turbulence rendered
 * once by the browser as a background image. No stock photos, so there is
 * nothing to license, they recolour with the palette, and the files stay tiny.
 */

const url = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;

/** Brushed metal: noise stretched along x into fine streaks (light and dark sets). */
const brush = (light: boolean, seed: number) =>
  url(`<svg xmlns='http://www.w3.org/2000/svg' width='700' height='200'>
    <filter id='b' x='0' y='0' width='100%' height='100%'>
      <feTurbulence type='fractalNoise' baseFrequency='.0012 .95' numOctaves='2' seed='${seed}' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 ${light ? 1 : 0} 0 0 0 0 ${light ? 1 : 0} 0 0 0 0 ${light ? 1 : 0} ${light ? "2.4 0 0 0 -1.25" : "-2.4 0 0 0 1.15"}'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#b)'/></svg>`);

/** Wood: irregular grain lines bent by low-frequency noise, plus pores. */
const woodLines = url(`<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='400'>
  <defs>
    <pattern id='p' width='1400' height='26' patternUnits='userSpaceOnUse'>
      <rect y='0' width='1400' height='1.8' fill='#000' opacity='.55'/>
      <rect y='6' width='1400' height='.8' fill='#000' opacity='.35'/>
      <rect y='12' width='1400' height='1.3' fill='#000' opacity='.45'/>
      <rect y='19' width='1400' height='.6' fill='#000' opacity='.3'/>
      <rect y='22' width='1400' height='2.6' fill='#000' opacity='.18'/>
    </pattern>
    <filter id='f' x='-5%' y='-5%' width='110%' height='110%'>
      <feTurbulence type='fractalNoise' baseFrequency='.0016 .014' numOctaves='3' seed='4'/>
      <feDisplacementMap in='SourceGraphic' scale='70' xChannelSelector='R' yChannelSelector='G'/>
    </filter>
  </defs>
  <rect width='100%' height='100%' fill='url(#p)' filter='url(#f)'/></svg>`);

const woodPores = url(`<svg xmlns='http://www.w3.org/2000/svg' width='900' height='300'>
  <filter id='w'><feTurbulence type='fractalNoise' baseFrequency='.004 .32' numOctaves='3' seed='9' stitchTiles='stitch'/>
  <feColorMatrix values='0 0 0 0 .08 0 0 0 0 .04 0 0 0 0 .01 2.8 0 0 0 -1.3'/></filter>
  <rect width='100%' height='100%' filter='url(#w)'/></svg>`);

/** Broad light/dark figure in the veneer. */
const woodFigure = url(`<svg xmlns='http://www.w3.org/2000/svg' width='700' height='400'>
  <filter id='w'><feTurbulence type='fractalNoise' baseFrequency='.0022 .02' numOctaves='3' seed='21' stitchTiles='stitch'/>
  <feColorMatrix values='0 0 0 0 1 0 0 0 0 .86 0 0 0 0 .62 2 0 0 0 -.75'/></filter>
  <rect width='100%' height='100%' filter='url(#w)'/></svg>`);

/** Marble: thin veins (used as a mask, so they take the palette's vein colour). */
const veins = (seed: number) =>
  url(`<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600'>
  <filter id='m'><feTurbulence type='turbulence' baseFrequency='.0045 .009' numOctaves='5' seed='${seed}' stitchTiles='stitch'/>
  <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -7 0 0 0 1.02'/></filter>
  <rect width='100%' height='100%' filter='url(#m)'/></svg>`);

const cloud = url(`<svg xmlns='http://www.w3.org/2000/svg' width='700' height='400'>
  <filter id='c'><feTurbulence type='fractalNoise' baseFrequency='.005' numOctaves='4' seed='3' stitchTiles='stitch'/>
  <feColorMatrix values='0 0 0 0 .45 0 0 0 0 .42 0 0 0 0 .4 1.5 0 0 0 -.5'/></filter>
  <rect width='100%' height='100%' filter='url(#c)'/></svg>`);

/** Felt / leather desk under the metal card. */
const felt = url(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='4' seed='5' stitchTiles='stitch'/>
  <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/></filter>
  <rect width='100%' height='100%' filter='url(#n)'/></svg>`);

export const BIZ_TEXTURES: CSSProperties = {
  ["--tex-brush-l" as string]: brush(true, 3),
  ["--tex-brush-d" as string]: brush(false, 8),
  ["--tex-wood-lines" as string]: woodLines,
  ["--tex-wood-pores" as string]: woodPores,
  ["--tex-wood-figure" as string]: woodFigure,
  ["--tex-veins" as string]: veins(8),
  ["--tex-veins2" as string]: veins(27),
  ["--tex-cloud" as string]: cloud,
  ["--tex-felt" as string]: felt,
};

/** The textures as one `:root { … }` rule, mounted once in the root layout. */
export const BIZ_TEXTURE_CSS = `:root{${Object.entries(BIZ_TEXTURES)
  .map(([k, v]) => `${k}:${v}`)
  .join(";")}}`;
