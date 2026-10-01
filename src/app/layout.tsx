import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Bodoni_Moda,
  Caveat,
  DM_Serif_Display,
  Fraunces,
  Josefin_Sans,
  Manrope,
  Michroma,
  Outfit,
  Space_Grotesk,
  Special_Elite,
  Syne,
  Tilt_Neon,
  Yatra_One,
  Cinzel,
  Cinzel_Decorative,
  Cormorant_Garamond,
  Great_Vibes,
  Inter,
  Italiana,
  Marcellus,
  Noto_Serif_Devanagari,
  Parisienne,
  Pinyon_Script,
  Playfair_Display,
  Rozha_One,
  Tenor_Sans,
  Yeseva_One,
  UnifrakturMaguntia,
  VT323,
  Old_Standard_TT,
} from "next/font/google";
import { GlobalDefs } from "@/components/card/ornaments";
import { BIZ_TEXTURE_CSS } from "@/components/business/textures";
import { bizFontVars } from "./bizFonts";
import { scriptFontVars } from "./scriptFonts";
import "./globals.css";
import "./card.css";
import "./viewer.css";
import "./app.css";
import "./business.css";
import "./biz-base.css";
import "./biz-trend.css";
import "./biz-heritage.css";
import "./biz-pro.css";
import "./wedding.css";
import "./signature.css";
import "./festival.css";

const cinzelDeco = Cinzel_Decorative({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-cinzel-deco" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--f-cinzel" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--f-cormorant" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--f-great-vibes" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--f-pinyon" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-playfair" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--f-marcellus" });
const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--f-italiana" });
const parisienne = Parisienne({ subsets: ["latin"], weight: "400", variable: "--f-parisienne" });
const deva = Noto_Serif_Devanagari({ subsets: ["devanagari"], weight: ["600"], variable: "--f-deva" });
const rozha = Rozha_One({ subsets: ["latin"], weight: "400", variable: "--f-rozha" });
const yeseva = Yeseva_One({ subsets: ["latin"], weight: "400", variable: "--f-yeseva" });
const tenor = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--f-tenor" });
const inter = Inter({ subsets: ["latin"], variable: "--f-ui" });
// business card faces
const syne = Syne({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--f-syne" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-manrope" });
const michroma = Michroma({ subsets: ["latin"], weight: "400", variable: "--f-michroma" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz", "SOFT"], variable: "--f-fraunces" });
const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--f-josefin" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--f-outfit" });
const tiltNeon = Tilt_Neon({ subsets: ["latin"], weight: "400", variable: "--f-tilt-neon" });
const space = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-space" });
const yatra = Yatra_One({ subsets: ["latin"], weight: "400", variable: "--f-yatra" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-dm-serif" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "800", "900"], variable: "--f-archivo" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"], variable: "--f-bodoni" });
const specialElite = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--f-special-elite" });
const fraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--f-fraktur" });
const vt323 = VT323({ subsets: ["latin"], weight: "400", variable: "--f-vt323" });
const oldStd = Old_Standard_TT({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--f-oldstd" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-caveat" });

const fontVars = [cinzelDeco, cinzel, cormorant, greatVibes, pinyon, playfair, marcellus, italiana, parisienne, deva, rozha, yeseva, tenor, inter, syne, manrope, michroma, fraunces, josefin, outfit, tiltNeon, space, yatra, dmSerif, archivo, bodoni, specialElite, caveat, fraktur, vt323, oldStd]
  .map((f) => f.variable)
  .concat(bizFontVars, scriptFontVars)
  .join(" ");

export const metadata: Metadata = {
  title: "Shubh Cards — Digital invitations that feel real",
  description: "Realistic digital wedding, engagement, griha pravesh and shop-opening invitations, plus digital business cards.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1b1410",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: BIZ_TEXTURE_CSS }} />
        <GlobalDefs />
        {children}
      </body>
    </html>
  );
}
