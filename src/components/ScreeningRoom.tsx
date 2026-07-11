"use client";

import Image from "next/image";
import type { Film } from "@/lib/content";
import Reveal from "./Reveal";

export default function ScreeningRoom({ films }: { films: Film[] }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
      {films.map((film, i) => (
        <Reveal key={film.slug}>
          <article className="py-14 md:py-20">
            {/* Letterboxed 2.39:1 frame */}
            <div className="group relative overflow-hidden bg-black">
              <div className="relative aspect-video md:aspect-[2.39/1]">
                {film.video ? (
                  <video
                    src={film.video}
                    poster={film.poster}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <Image
                    src={film.poster}
                    alt={film.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="kenburns object-cover"
                  />
                )}
                {/* Vignette */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
              </div>
              {film.sample === "true" && (
                <span className="absolute right-4 top-4 border border-white/30 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white/60">
                  Sample entry
                </span>
              )}
            </div>

            {/* Title card */}
            <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-world-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">
                  {film.title}
                </h2>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-world-muted">
                {[film.role, film.year, film.runtime && `${film.runtime} min`]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          </article>
        </Reveal>
      ))}

      <Reveal>
        <p className="border-t border-world-hairline pt-8 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-world-muted">
          Full films screened on request — get in touch
        </p>
      </Reveal>
    </div>
  );
}
