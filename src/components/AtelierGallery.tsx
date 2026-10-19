"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Painting } from "@/lib/content";
import Reveal from "./Reveal";
import Lightbox, { type LightboxItem } from "./Lightbox";

function placard(p: Painting) {
  return [p.medium, p.category, [p.month, p.year].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(" · ");
}

export default function AtelierGallery({ paintings }: { paintings: Painting[] }) {
  const [open, setOpen] = useState<LightboxItem | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
      {paintings.map((painting, i) => {
        const flipped = i % 2 === 1;
        return (
          <Reveal key={painting.slug}>
            <article
              className={clsx(
                "flex flex-col gap-6 py-14 md:items-end md:gap-12 md:py-20",
                flipped ? "md:flex-row-reverse" : "md:flex-row"
              )}
            >
              <button
                onClick={() =>
                  setOpen({
                    image: painting.image,
                    title: painting.title,
                    meta: placard(painting),
                  })
                }
                className="group relative w-full cursor-zoom-in md:w-3/5"
                aria-label={`View ${painting.title}`}
              >
                {/* Gallery frame */}
                <div className="border border-world-hairline bg-world-surface p-3 shadow-[0_20px_50px_-24px_rgba(34,29,24,0.45)] transition-transform duration-500 group-hover:-translate-y-1 md:p-5">
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: painting.aspect }}
                  >
                    <Image
                      src={painting.image}
                      alt={painting.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </button>

              <div className={clsx("md:w-2/5 md:pb-6", flipped && "md:text-right")}>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-world-muted">
                  {String(i + 1).padStart(2, "0")} / {painting.category}
                </div>
                <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
                  {painting.title}
                </h2>
                <div className="mt-5 inline-block border-t border-world-accent pt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-world-muted">
                  {placard(painting)}
                </div>
                {painting.description && (
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-world-muted">
                    {painting.description}
                  </p>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}

      <Lightbox item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
