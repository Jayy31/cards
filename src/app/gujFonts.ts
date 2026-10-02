import {
  Anek_Gujarati,
  Baloo_Bhai_2,
  Farsan,
  Hind_Vadodara,
  Kumar_One,
  Mogra,
  Mukta_Vaani,
  Noto_Serif_Gujarati,
  Rasa,
  Shrikhand,
} from "next/font/google";

/*
 * Gujarati typefaces for the single-side Gujarati business cards (all Google Fonts, SIL OFL).
 * Every family carries Latin too, so mixed Gujarati/English text stays in one typeface.
 * Not preloaded: only the Gujarati cards page downloads them.
 */
const gu_hind = Hind_Vadodara({ preload: false, subsets: ["gujarati", "latin"], weight: ["400", "500", "600", "700"], variable: "--f-gu-hind" });
const gu_mukta = Mukta_Vaani({ preload: false, subsets: ["gujarati", "latin"], weight: ["400", "500", "700", "800"], variable: "--f-gu-mukta" });
const gu_baloo = Baloo_Bhai_2({ preload: false, subsets: ["gujarati", "latin"], weight: ["500", "600", "700", "800"], variable: "--f-gu-baloo" });
const gu_rasa = Rasa({ preload: false, subsets: ["gujarati", "latin"], weight: ["400", "500", "600", "700"], variable: "--f-gu-rasa" });
const gu_shrikhand = Shrikhand({ preload: false, subsets: ["gujarati", "latin"], weight: "400", variable: "--f-gu-shrikhand" });
const gu_anek = Anek_Gujarati({ preload: false, subsets: ["gujarati", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--f-gu-anek" });
const gu_farsan = Farsan({ preload: false, subsets: ["gujarati", "latin"], weight: "400", variable: "--f-gu-farsan" });
const gu_kumar = Kumar_One({ preload: false, subsets: ["gujarati", "latin"], weight: "400", variable: "--f-gu-kumar" });
const gu_noto = Noto_Serif_Gujarati({ preload: false, subsets: ["gujarati", "latin"], weight: ["400", "600", "700", "800"], variable: "--f-gu-noto" });
const gu_mogra = Mogra({ preload: false, subsets: ["gujarati", "latin"], weight: "400", variable: "--f-gu-mogra" });

export const gujFontVars = [gu_hind, gu_mukta, gu_baloo, gu_rasa, gu_shrikhand, gu_anek, gu_farsan, gu_kumar, gu_noto, gu_mogra]
  .map((f) => f.variable)
  .join(" ");
