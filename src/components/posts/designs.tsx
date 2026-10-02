"use client";

import type { PostBrand, PostRatio, PostText } from "@/lib/posts";
import { Dahan } from "./Dahan";
import { Dwaar } from "./Dwaar";
import { Garbo } from "./Garbo";
import { Paatiyu } from "./Paatiyu";
import { Thali } from "./Thali";

type Design = (p: { ratio: PostRatio; b: PostBrand; t: PostText }) => React.ReactElement;

/** Template id → design. Each design draws itself at 1080 px wide and the shape's full height. */
export const POST_DESIGNS: Record<string, Design> = {
  "navratri-garbo": Garbo,
  "dussehra-dahan": Dahan,
  "dhanteras-thali": Thali,
  "diwali-dwaar": Dwaar,
  "bestu-paatiyu": Paatiyu,
};

export function PostCard({ id, ratio, b, t, flat }: { id: string; ratio: PostRatio; b: PostBrand; t: PostText; flat?: boolean }) {
  const D = POST_DESIGNS[id];
  if (!D) return null;
  return (
    <div className={flat ? "pc-flat" : undefined}>
      <D ratio={ratio} b={b} t={t} />
    </div>
  );
}
