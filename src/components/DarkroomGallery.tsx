"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { Photograph } from "@/lib/content";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";

/** Hand-drawn box, slightly overshooting where the pencil started. */
const GREASE_PATH =
  "M4,7 C28,3 66,5 97,3 C98,34 96,68 98,96 C66,98 31,96 3,97 C2,70 4,36 2,5 C9,4 14,6 19,9";

export default function DarkroomGallery({
  groups,
}: {
  groups: { client: string; photos: Photograph[] }[];
}) {
  // Which shoot and picture is full screen; stepping wraps within that shoot
  const [open, setOpen] = useState<{ group: number; photo: number } | null>(null);
  const step = useCallback(
    (by: number) =>
      setOpen((o) => {
        if (!o) return o;
        const count = groups[o.group].photos.length;
        return { ...o, photo: (o.photo + by + count) % count };
      }),
    [groups]
  );
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);
  const close = useCallback(() => setOpen(null), []);

  // Running frame number across all shoots, computed without render-time mutation
  const groupOffsets: number[] = [];
  groups.reduce((offset, group, i) => {
    groupOffsets[i] = offset;
    return offset + group.photos.length;
  }, 0);

  const openPhoto = open ? groups[open.group]?.photos[open.photo] : undefined;
  const openFrame = open
    ? String(groupOffsets[open.group] + open.photo + 1).padStart(2, "0")
    : null;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 md:px-10 md:pt-16">
      {groups.map((group, groupIndex) => (
        <section key={group.client} className="py-8 md:py-12">
          {/* Contact sheet: one sheet of paper per shoot */}
          <div className="rounded-[2px] bg-world-surface p-4 shadow-[0_30px_80px_-40px_rgba(255,58,30,0.25)] md:p-8">
            <Reveal>
              <header className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-world-hairline pb-4 md:mb-8">
                <div>
                  <div className="type-label text-world-accent">
                    Shoot {String(groupIndex + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-2 font-grotesk text-xl font-bold uppercase tracking-[-0.02em] font-stretch-expanded md:text-3xl">
                    {group.client}
                  </h2>
                </div>
                <span className="type-label text-world-muted">
                  {group.photos.length} picture{group.photos.length > 1 ? "s" : ""}
                </span>
              </header>
            </Reveal>

            {/* Strips of film, cut where they wrap. Rows are justified: each
                frame grows in proportion to its aspect ratio, so a row fills
                the sheet at one shared height (capped so a lone frame stays
                within the screen) */}
            <div className="flex flex-wrap gap-y-8 [--row-h:190px] sm:[--row-h:230px] lg:[--row-h:270px]">
              {group.photos.map((photo, photoIndex) => {
                const frame = groupOffsets[groupIndex] + photoIndex + 1;
                const n = String(frame).padStart(2, "0");
                return (
                  <figure
                    key={photo.slug}
                    className="min-w-0"
                    style={{
                      flex: `${photo.aspect} 1 calc(${photo.aspect} * var(--row-h) + 10px)`,
                      maxWidth: `min(100%, calc(${photo.aspect} * 70vh + 10px))`,
                    }}
                  >
                    <button
                      onClick={() => setOpen({ group: groupIndex, photo: photoIndex })}
                      className="group relative block w-full cursor-zoom-in bg-[#040303] px-[5px] pb-7 pt-[18px] outline-none"
                      aria-label={`View ${photo.title || `frame ${n}`}`}
                    >
                      <div className="sprockets absolute inset-x-0 top-[5px]" />

                      <div
                        className="relative w-full overflow-visible"
                        style={{ aspectRatio: photo.aspect }}
                      >
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={photo.image}
                            alt={photo.title || [photo.client, photo.category].filter(Boolean).join(", ")}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="develop object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>
                        <svg
                          aria-hidden
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          className="grease-mark pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] overflow-visible"
                        >
                          <path
                            d={GREASE_PATH}
                            fill="none"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>

                      {/* Edge print */}
                      <div className="absolute inset-x-0 bottom-[15px] flex justify-between px-2.5 font-mono text-[8px] leading-none tracking-[0.2em] text-[#f0dcc8]/50">
                        <span>{n}</span>
                        <span>▸ {n}A</span>
                      </div>
                      <div className="sprockets absolute inset-x-0 bottom-[4px]" />
                    </button>

                    <figcaption className="type-label mt-3 px-1.5">
                      <span className="text-world-accent">{n}</span>{" "}
                      {photo.title && <span className="text-world-ink/85">{photo.title}</span>}
                      {photo.category && (
                        <span className="block text-world-muted">{photo.category}</span>
                      )}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <Lightbox
        item={
          openPhoto && openFrame !== null
            ? {
                image: openPhoto.image,
                title: openPhoto.title,
                meta: [`Frame ${openFrame}`, openPhoto.client, openPhoto.category]
                  .filter(Boolean)
                  .join(" · "),
              }
            : null
        }
        onClose={close}
        {...(open && groups[open.group].photos.length > 1 && {
          onPrev: prev,
          onNext: next,
          position: `${open.photo + 1} / ${groups[open.group].photos.length}`,
        })}
      />
    </div>
  );
}
