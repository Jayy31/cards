import {
  Noto_Naskh_Arabic,
  Noto_Serif_Bengali,
  Noto_Serif_Gujarati,
  Noto_Serif_Gurmukhi,
  Noto_Serif_Kannada,
  Noto_Serif_Malayalam,
  Noto_Serif_Oriya,
  Noto_Serif_Tamil,
  Noto_Serif_Telugu,
} from "next/font/google";

/*
 * Regional scripts for names written in the family's own language (SIL OFL).
 * Script-only subsets with unicode-range, not preloaded: a browser downloads a
 * file only when a card actually contains that script.
 */
const guj = Noto_Serif_Gujarati({ preload: false, subsets: ["gujarati"], weight: ["600"], variable: "--f-s-guj" });
const tam = Noto_Serif_Tamil({ preload: false, subsets: ["tamil"], weight: ["600"], variable: "--f-s-tam" });
const tel = Noto_Serif_Telugu({ preload: false, subsets: ["telugu"], weight: ["600"], variable: "--f-s-tel" });
const kan = Noto_Serif_Kannada({ preload: false, subsets: ["kannada"], weight: ["600"], variable: "--f-s-kan" });
const mal = Noto_Serif_Malayalam({ preload: false, subsets: ["malayalam"], weight: ["600"], variable: "--f-s-mal" });
const ben = Noto_Serif_Bengali({ preload: false, subsets: ["bengali"], weight: ["600"], variable: "--f-s-ben" });
const gur = Noto_Serif_Gurmukhi({ preload: false, subsets: ["gurmukhi"], weight: ["600"], variable: "--f-s-gur" });
const ori = Noto_Serif_Oriya({ preload: false, subsets: ["oriya"], weight: ["600"], variable: "--f-s-ori" });
const ara = Noto_Naskh_Arabic({ preload: false, subsets: ["arabic"], weight: ["600"], variable: "--f-s-ara" });

export const scriptFontVars = [guj, tam, tel, kan, mal, ben, gur, ori, ara].map((f) => f.variable).join(" ");
