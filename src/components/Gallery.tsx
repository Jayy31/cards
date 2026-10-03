"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, categoryLabel, TEMPLATES } from "@/lib/templates";
import Thumb from "./Thumb";
<<<<<<< HEAD
=======
import { GUJ_TEMPLATES } from "@/lib/gujarati";
>>>>>>> master

const uniq = (xs: string[]) => [...new Set(xs)];

/** Effect names grouped for the dropdown (anything unlisted falls under "Look & pattern"). */
const EFFECT_GROUPS: [string, string[]][] = [
  ["Materials", ["Hot foil", "Metal", "Wood veneer", "Marble", "Holographic", "Transparent", "Carbon fibre", "Silk", "Recycled paper", "Handmade paper", "Letterpress", "Chrome", "Pearl shimmer", "Glassmorphism", "Clear-coat shine", "Glowing edges"]],
  ["Print & craft", ["Block print", "Rubber stamp", "Laser engraved", "Laser etched", "Brush ink", "Chalk", "Folk art", "Tie-dye dots", "Wax seal", "Gilded edges", "Painted edge", "Spot gloss", "Handwriting", "Watercolour", "Laser-cut", "Zari border", "Monogram", "Embroidery", "Mirror work", "Stained glass", "Illustration"]],
  ["Motion", ["Kinetic type", "Typing", "Glitch", "Spin", "Line drawing", "Pop", "Parallax", "Tilt-reactive", "Light-up windows", "Motion slashes", "Glow", "Neon glow", "Glitter", "Page turn", "Envelope & wax seal", "Petals", "Temple doors", "Scroll unroll", "Flowers part", "Keepsake box", "Curtain rise", "Palm-leaf flip", "Scroll pages", "Dissolve", "Card stack", "Swipe", "Alpona painting", "Fan turn", "Cloth unfold", "Calendar flip", "Garba twirl", "Twirl turn", "Lattice screens", "Zoom turn", "Gatefold", "Drop turn", "Silk pallu", "Diagonal flip", "Lace veil", "Iris turn", "Brush reveal", "Wipe turn", "Pop-up", "Turnover", "Ticket printer", "Edge turn", "Warp intro", "Orbit turn", "Live rain", "Windshield wiper", "Pour turn", "Countdown leader", "Reel turn", "Paparazzi flashes", "Peel turn", "Misted intro", "Wipe the glass", "Frost turn", "Tilt parallax", "Live snow", "Shake to swirl", "Snow globe intro", "Drift turn", "Shards assemble", "Crack turn", "Flock intro", "Paper-plane turn", "Fold reveal", "Folded map intro", "Pan turn", "Live fireflies", "Recede turn"]],
  ["Layout & format", ["Bento layout", "More info on front", "Vertical card", "Square card", "Photo", "Duotone photo", "Diagonal split", "Whitespace", "Ticket", "Barcode", "Loyalty stamps", "Bold type", "Layered 3D"]],
];
function groupEffects(effects: string[]) {
  const known = new Set(EFFECT_GROUPS.flatMap(([, l]) => l));
  const groups = EFFECT_GROUPS.map(([g, l]) => [g, effects.filter((e) => l.includes(e))] as [string, string[]]);
  groups.push(["Look & pattern", effects.filter((e) => !known.has(e))]);
  return groups.filter(([, l]) => l.length);
}

const SHAPES = [
  { id: "landscape", label: "Landscape" },
  { id: "portrait", label: "Vertical" },
  { id: "square", label: "Square" },
  { id: "photo", label: "With photo" },
];

export default function Gallery() {
  const [cat, setCat] = useState("all");
  const [style, setStyle] = useState<string | null>(null);
  const [effect, setEffect] = useState("");
  const [industry, setIndustry] = useState("");
  const [shape, setShape] = useState("");
  const [query, setQuery] = useState("");

  // deep link: /?cat=business#designs
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat");
    if (c && CATEGORIES.some((x) => x.id === c)) setCat(c);
  }, []);

  const clear = () => {
    setStyle(null);
    setEffect("");
    setIndustry("");
    setShape("");
    setQuery("");
  };
  const choose = (id: string) => {
    setCat(id);
    clear();
    const u = new URL(window.location.href);
    if (id === "all") u.searchParams.delete("cat");
    else u.searchParams.set("cat", id);
    window.history.replaceState(null, "", u);
  };

  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.id, TEMPLATES.filter((t) => t.category === c.id).length])), []);
  const inCat = TEMPLATES.filter((t) => cat === "all" || t.category === cat);
  const styles = uniq(inCat.flatMap((t) => t.styles)).sort();
  const effects = uniq(inCat.flatMap((t) => t.effects)).sort();
  const industries = uniq(inCat.flatMap((t) => t.industries ?? [])).sort((a, b) => (a === "Any business" ? 1 : b === "Any business" ? -1 : a.localeCompare(b)));
  const hasShapes = inCat.some((t) => t.biz);
  const q = query.trim().toLowerCase();
  const list = inCat.filter(
    (t) =>
      (!style || t.styles.includes(style)) &&
      (!effect || t.effects.includes(effect)) &&
      (!industry || (t.industries ?? []).includes(industry) || (t.industries ?? []).includes("Any business")) &&
      (!shape || (shape === "photo" ? !!t.photo : (t.biz?.shape ?? "landscape") === shape && t.sample.kind === "business")) &&
      (!q || [t.name, t.tagline, ...t.styles, ...t.effects, ...(t.industries ?? [])].join(" ").toLowerCase().includes(q)),
  );
  // the Signature collection leads
  list.sort((a, b) => Number(!!b.signature) - Number(!!a.signature));
  // designs made for the chosen industry first, general-purpose ones after
  if (industry) list.sort((a, b) => Number((b.industries ?? []).includes(industry)) - Number((a.industries ?? []).includes(industry)));
  const info = CATEGORIES.find((c) => c.id === cat);
  const live = CATEGORIES.filter((c) => !c.soon);
  const soon = CATEGORIES.filter((c) => c.soon);
  const filtered = !!(style || effect || industry || shape || q);

  return (
    <>
      <div className="cat-rail" role="tablist" aria-label="Categories">
        <button role="tab" aria-selected={cat === "all"} className={cat === "all" ? "on" : ""} onClick={() => choose("all")}>
          All designs <i>{TEMPLATES.length}</i>
        </button>
        {live.map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} className={cat === c.id ? "on" : ""} onClick={() => choose(c.id)}>
            {c.label} <i>{counts[c.id]}</i>
          </button>
        ))}
<<<<<<< HEAD
=======
        {/* single-side Gujarati cards live on their own page (fill once, see every design) */}
        <Link href="/gujarati" className="cat-link" role="tab" aria-selected={false}>
          ગુજરાતી Visiting Cards <i>{GUJ_TEMPLATES.length}</i>
        </Link>
>>>>>>> master
        <span className="cat-sep">Coming soon</span>
        {soon.map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} className={`soon ${cat === c.id ? "on" : ""}`} onClick={() => choose(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {info && !info.soon && <p className="cat-blurb">{info.blurb}</p>}

      {inCat.length > 0 && (
        <div className="filters">
          <div className="filter-top">
            <input className="filter-search" type="search" placeholder={cat === "business" ? "Search designs: doctor, gold, neon, minimal…" : "Search designs…"} value={query} onChange={(e) => setQuery(e.target.value)} />
            {industries.length > 0 && (
              <select className="filter-select" value={industry} onChange={(e) => setIndustry(e.target.value)} aria-label="Industry">
                <option value="">All industries</option>
                {industries
                  .filter((i) => i !== "Any business")
                  .map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
              </select>
            )}
            <select className="filter-select" value={effect} onChange={(e) => setEffect(e.target.value)} aria-label="Effect">
              <option value="">Any effect</option>
              {groupEffects(effects).map(([g, list]) => (
                <optgroup key={g} label={g}>
                  {list.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Style</span>
            <div className="filter-chips">
              {styles.map((s) => (
                <button key={s} className={style === s ? "on" : ""} onClick={() => setStyle(style === s ? null : s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {hasShapes && (
            <div className="filter-group">
              <span className="filter-label">Format</span>
              <div className="filter-chips">
                {SHAPES.map((s) => (
                  <button key={s.id} className={shape === s.id ? "on" : ""} onClick={() => setShape(shape === s.id ? "" : s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="filter-meta">
            <span>
              {list.length} design{list.length === 1 ? "" : "s"}
            </span>
            {filtered && (
              <button className="filter-clear" onClick={clear}>
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {info?.soon ? (
        <div className="soon-card">
          <h3>{info.label} designs are on the way</h3>
          <p>{info.blurb}. We&apos;re designing these one category at a time, so each one gets its own look and effects.</p>
          <button className="btn-ghost" onClick={() => choose("all")}>
            See all live designs
          </button>
        </div>
      ) : (
        <div className="l-grid">
          {list.map((t) => (
            <article key={t.id} className={`tcard ${t.sample.kind === "business" ? "is-biz" : ""} ${t.biz?.shape && t.biz.shape !== "landscape" ? `is-${t.biz.shape}` : ""}`}>
              <Link href={`/preview/${t.id}`} className="tcard-link" aria-label={`Preview ${t.name}`}>
                {t.signature && <span className="tcard-badge">✦ Signature</span>}
                <Thumb t={t} />
              </Link>
              <div className="tcard-body">
                <div className="tcard-top">
                  <h3>{t.name}</h3>
                  <span className="tcard-cat">{categoryLabel(t.category)}</span>
                </div>
                <p>{t.tagline}</p>
                <div className="tcard-fx">
                  {t.effects.slice(0, 3).map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </div>
                <div className="tcard-pals">
                  {t.palettes.map((p) => (
                    <span key={p.id} title={p.label} style={{ background: `linear-gradient(135deg, ${p.paper} 50%, ${p.envelope2} 50%)` }} />
                  ))}
                </div>
                <div className="tcard-actions">
                  <Link className="btn-ghost" href={`/preview/${t.id}`}>
                    Preview
                  </Link>
                  <Link className="btn-primary sm" href={`/create/${t.id}`}>
                    Customise
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {list.length === 0 && <p className="muted">No designs match these filters.</p>}
        </div>
      )}
    </>
  );
}
