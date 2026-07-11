"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photograph } from "@/lib/content";
import Reveal from "./Reveal";
import Lightbox, { type LightboxItem } from "./Lightbox";

export default function DarkroomGallery({
  groups,
}: {
  groups: { client: string; photos: Photograph[] }[];
}) {
  const [open, setOpen] = useState<LightboxItem | null>(null);

  // Running frame number across all groups, computed without render-time mutation
  const groupOffsets: number[] = [];
  groups.reduce((offset, group, i) => {
    groupOffsets[i] = offset;
    return offset + group.photos.length;
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 md:px-10">
      {groups.map((group, groupIndex) => (
        <section key={group.client} className="py-10 md:py-14">
          <Reveal>
            <div className="mb-6 flex items-baseline justify-between border-b border-world-hairline pb-3">
              <h2 className="font-serif text-2xl md:text-3xl">{group.client}</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-world-muted">
                {group.photos.length} frame{group.photos.length > 1 ? "s" : ""}
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.photos.map((photo, photoIndex) => {
              const frame = groupOffsets[groupIndex] + photoIndex + 1;
              const stamp = `№ ${String(frame).padStart(3, "0")}`;
              return (
                <Reveal key={photo.slug}>
                  <button
                    onClick={() =>
                      setOpen({
                        image: photo.image,
                        title: photo.title,
                        meta: [photo.client, photo.category]
                          .filter(Boolean)
                          .join(" · "),
                      })
                    }
                    className="group relative block w-full cursor-zoom-in overflow-hidden bg-world-surface"
                    aria-label={`View ${photo.title}`}
                  >
                    <div className="relative aspect-4/3">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover brightness-90 transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-100"
                      />
                    </div>
                    {/* Contact-sheet stamp on hover */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/85 px-4 py-3 transition-transform duration-400 md:translate-y-full md:group-hover:translate-y-0">
                      <span className="text-sm text-white">{photo.title}</span>
                      <span className="font-mono text-[10px] tracking-[0.25em] text-white/50">
                        {stamp}
                      </span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>
      ))}

      <Lightbox item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
