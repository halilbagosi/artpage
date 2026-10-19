"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Film } from "@/lib/content";
import Reveal from "./Reveal";
import FilmPlayer, { isPlayable } from "./FilmPlayer";
import PlayCue from "./PlayCue";

export default function ScreeningRoom({ films }: { films: Film[] }) {
  const [playing, setPlaying] = useState<Film | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-10 md:pt-20">
      <Reveal>
        <h2 className="type-label text-center text-world-muted">
          Tonight&apos;s programme
        </h2>
      </Reveal>

      {films.map((film, i) => {
        const credits = [
          ["Role", film.role],
          ["Year", film.year],
          ["Runtime", film.runtime],
        ].filter(([, value]) => value);
        const playable = isPlayable(film);

        return (
          <Reveal key={film.slug}>
            <article className="py-14 md:py-20">
              <div className="type-label mb-5 flex items-center gap-4">
                <span className="text-world-accent">
                  Reel {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-world-hairline" />
                {film.sample === "true" && (
                  <span className="text-world-muted">Sample entry</span>
                )}
              </div>

              {/* Letterboxed 2.39:1 frame */}
              <div
                className="group relative overflow-hidden bg-black shadow-[0_40px_100px_-50px_rgba(233,180,92,0.35)]"
                onMouseEnter={(e) => e.currentTarget.querySelector("video")?.play().catch(() => {})}
                onMouseLeave={(e) => e.currentTarget.querySelector("video")?.pause()}
              >
                <div className="relative aspect-video md:aspect-[2.39/1]">
                  {film.video ? (
                    <video
                      src={film.video}
                      poster={film.poster}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={film.poster}
                      alt={film.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 1100px"
                      className="kenburns object-cover"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]" />
                  {playable && <PlayCue title={film.title} onPlay={() => setPlaying(film)} />}
                </div>
              </div>

              {/* Title card + credits */}
              <div className="mt-10 text-center md:mt-14">
                <h3 className="font-grotesk text-[clamp(2.75rem,9vw,6rem)] font-bold uppercase leading-[0.85] tracking-[-0.01em] font-stretch-extra-condensed">
                  {film.title}
                </h3>
                <dl className="type-label mx-auto mt-8 grid max-w-xl grid-cols-[1fr_auto_1fr] items-baseline gap-x-4 gap-y-2.5">
                  {credits.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-right text-world-muted">{label}</dt>
                      <span aria-hidden className="text-world-accent">
                        ·
                      </span>
                      <dd className="text-left text-world-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </Reveal>
        );
      })}

      {/* End card */}
      <Reveal>
        <div className="mt-8 border-t border-world-hairline pt-16 text-center">
          <p className="font-serif text-6xl italic md:text-7xl">Fin.</p>
          <p className="type-label mt-6 text-world-muted">
            Full films screened on request
          </p>
          <Link
            href="/about#contact"
            className="type-label mt-8 inline-block rounded-full border border-world-accent/50 px-5 py-2.5 text-world-accent transition-[background-color,color,transform] duration-200 hover:bg-world-accent hover:text-world-bg active:scale-[0.97]"
          >
            Request a session →
          </Link>
        </div>
      </Reveal>

      <FilmPlayer film={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
