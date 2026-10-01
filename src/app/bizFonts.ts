import {
  Allura,
  Anton,
  Bebas_Neue,
  DM_Sans,
  EB_Garamond,
  Fredericka_the_Great,
  Fredoka,
  JetBrains_Mono,
  Jost,
  Kalam,
  Limelight,
  Montserrat,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Orbitron,
  Plus_Jakarta_Sans,
  Poiret_One,
  Righteous,
  Russo_One,
  Shippori_Mincho,
  Shrikhand,
  Sora,
  Space_Mono,
  Unbounded,
} from "next/font/google";

/*
 * Extra typefaces for the business card collection (all Google Fonts, SIL OFL).
 * Not preloaded: a page only downloads the files its cards actually use.
 */
const f_sora = Sora({ preload: false, subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--f-sora" });
const f_jost = Jost({ preload: false, subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-jost" });
const f_jakarta = Plus_Jakarta_Sans({ preload: false, subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--f-jakarta" });
const f_space_mono = Space_Mono({ preload: false, subsets: ["latin"], weight: ["400", "700"], variable: "--f-space-mono" });
const f_unbounded = Unbounded({ preload: false, subsets: ["latin"], weight: ["500", "700", "900"], variable: "--f-unbounded" });
const f_shrikhand = Shrikhand({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-shrikhand" });
const f_poiret = Poiret_One({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-poiret" });
const f_limelight = Limelight({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-limelight" });
const f_shippori = Shippori_Mincho({ preload: false, subsets: ["latin"], weight: ["400", "600", "800"], variable: "--f-shippori" });
const f_dm_sans = DM_Sans({ preload: false, subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-dm-sans" });
const f_anton = Anton({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-anton" });
const f_bebas = Bebas_Neue({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-bebas" });
const f_jetbrains = JetBrains_Mono({ preload: false, subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-jetbrains" });
const f_kalam = Kalam({ preload: false, subsets: ["latin", "devanagari"], weight: ["400", "700"], variable: "--f-kalam" });
const f_fredericka = Fredericka_the_Great({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-fredericka" });
const f_garamond = EB_Garamond({ preload: false, subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--f-garamond" });
const f_montserrat = Montserrat({ preload: false, subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--f-montserrat" });
const f_allura = Allura({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-allura" });
const f_orbitron = Orbitron({ preload: false, subsets: ["latin"], weight: ["500", "700", "900"], variable: "--f-orbitron" });
const f_russo = Russo_One({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-russo" });
const f_fredoka = Fredoka({ preload: false, subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-fredoka" });
const f_righteous = Righteous({ preload: false, subsets: ["latin"], weight: "400", variable: "--f-righteous" });
const f_noto_deva = Noto_Sans_Devanagari({ preload: false, subsets: ["devanagari"], weight: ["500", "700"], variable: "--f-noto-deva" });
const f_noto_guj = Noto_Sans_Gujarati({ preload: false, subsets: ["gujarati"], weight: ["500", "700"], variable: "--f-noto-guj" });

export const bizFontVars = [f_sora, f_jost, f_jakarta, f_space_mono, f_unbounded, f_shrikhand, f_poiret, f_limelight, f_shippori, f_dm_sans, f_anton, f_bebas, f_jetbrains, f_kalam, f_fredericka, f_garamond, f_montserrat, f_allura, f_orbitron, f_russo, f_fredoka, f_righteous, f_noto_deva, f_noto_guj].map((f) => f.variable).join(" ");
