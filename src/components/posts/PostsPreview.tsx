"use client";

import { useEffect, useRef, useState } from "react";
import { POST_RATIOS, POST_TEMPLATES, POST_W, stressText, type PostBrand } from "@/lib/posts";
import { PostCard } from "./designs";

/** A post drawn at its true pixel size (1080 wide) and scaled to the width of its slot. */
function Scaled({ h, children }: { h: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / POST_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="ps-stage" style={{ aspectRatio: `${POST_W} / ${h}` }}>
      <div className="ps-scale" style={{ transform: `scale(${k})`, visibility: k ? "visible" : "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/** Step 1 preview: every template in every shape, with sample or stress data. */
export default function PostsPreview({ brand, text }: { brand: PostBrand; text?: "long" | "min" }) {
  return (
    <div className="ps-list">
      {POST_TEMPLATES.map((tp) => (
        <section key={tp.id} className="ps-tpl">
          <h2>
            {tp.festival} · <em>{tp.name}</em>
          </h2>
          <p className="ps-medium">{tp.medium}</p>
          <div className="ps-row">
            {POST_RATIOS.map((r) => (
              <figure key={r.id} className={`ps-fig r-${r.id}`}>
                <Scaled h={r.h}>
                  <PostCard id={tp.id} ratio={r.id} b={brand} t={text ? stressText(tp.text, text) : tp.text} />
                </Scaled>
                <figcaption>
                  <b>{r.label}</b> {POST_W} × {r.h} <span>{r.use}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
