import type { FaceProps } from "../parts";
import { Letterpress, Noir } from "./classic";
import { HoloPrism } from "./holo";
import { TitanMetal } from "./metal";
import { WalnutEngrave } from "./walnut";
import { ClearAcrylic } from "./acrylic";
import { NeonSign } from "./neon";
import { JaipurBlock } from "./block";
import { PaperLayers } from "./layers";
import { SwissGrid } from "./swiss";
import { CarraraGold } from "./marble";
import { KraftStamp } from "./kraft";
import { Aurora, Bento, Brutal, ChromeY2K, Duotone, Enso, GatsbyDeco, Glass, Groovy, Memphis, MonoMinimal, Sunset, Terrazzo, Topo } from "./trend";
import { Ajrakh, Bandhani, Jaali, Kanjivaram, Kolam, Madhubani, RibbonSeal, Warli } from "./heritage";
import { Advocate, Aperture, Blueprint, Boarding, Botanical, Carbon, Chalk, Circuit, Clinic, Dukaan, Fitness, Jyotish, Loyalty, Notebook, PhotoSplit, Portrait, Salon, Shield, Skyline, Terminal, Vinyl } from "./pro";

export interface Design {
  Front: (p: FaceProps) => React.ReactNode;
  Back: (p: FaceProps) => React.ReactNode;
}

/** Keyed by `Template.biz.design`. */
export const DESIGNS: Record<string, Design> = {
  noir: Noir,
  letterpress: Letterpress,
  holo: HoloPrism,
  metal: TitanMetal,
  walnut: WalnutEngrave,
  acrylic: ClearAcrylic,
  neon: NeonSign,
  block: JaipurBlock,
  layers: PaperLayers,
  swiss: SwissGrid,
  marble: CarraraGold,
  kraft: KraftStamp,
  // trend
  aurora: Aurora,
  sunset: Sunset,
  glass: Glass,
  bento: Bento,
  brutal: Brutal,
  chrome: ChromeY2K,
  groovy: Groovy,
  deco: GatsbyDeco,
  enso: Enso,
  mono: MonoMinimal,
  topo: Topo,
  terrazzo: Terrazzo,
  memphis: Memphis,
  duotone: Duotone,
  // heritage
  warli: Warli,
  jaali: Jaali,
  bandhani: Bandhani,
  ajrakh: Ajrakh,
  kanjivaram: Kanjivaram,
  kolam: Kolam,
  madhubani: Madhubani,
  seal: RibbonSeal,
  // professions
  clinic: Clinic,
  advocate: Advocate,
  skyline: Skyline,
  salon: Salon,
  fitness: Fitness,
  chalk: Chalk,
  terminal: Terminal,
  blueprint: Blueprint,
  aperture: Aperture,
  notebook: Notebook,
  jyotish: Jyotish,
  dukaan: Dukaan,
  boarding: Boarding,
  vinyl: Vinyl,
  loyalty: Loyalty,
  circuit: Circuit,
  botanical: Botanical,
  carbon: Carbon,
  portrait: Portrait,
  split: PhotoSplit,
  shield: Shield,
};
