"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Film } from "@/lib/content";
import FilmPlayer, { isPlayable } from "./FilmPlayer";
import PlayCue from "./PlayCue";

/**
 * Opening of the Screening Room: condensed title-card type, then a dark
 * house with the screen at its far wall. When the house scrolls into view the
 * projector turns on — the lamp strikes, the room catches the light, and the
 * featured film pulls into focus.
 */
export default function ScreeningHero({
  featured,
  blurb,
}: {
  featured?: Film;
  blurb: string;
}) {
  const houseRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const house = houseRef.current;
    if (!house) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.55 }
    );
    observer.observe(house);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-32 md:pt-44">
      <div className="mx-auto max-w-6xl px-5 text-center md:px-10">
        <p className="type-label flex justify-center gap-3">
          <span className="text-world-accent">III</span>
          <span className="text-world-muted">Film</span>
        </p>
        <h1 className="mt-5 font-grotesk text-[clamp(3.25rem,15vw,11.5rem)] font-bold uppercase leading-[0.84] tracking-[-0.015em] font-stretch-extra-condensed">
          The Screening
          <br />
          Room
        </h1>
        <p className="mx-auto mt-8 max-w-md text-balance text-[15px] leading-relaxed text-world-muted">
          {blurb}
        </p>
      </div>

      {/* The house */}
      <div className="mx-auto mt-12 max-w-6xl px-5 md:mt-16 md:px-10">
        <div
          ref={houseRef}
          data-on={on || undefined}
          className="house relative overflow-hidden rounded-[3px] bg-[#070608]"
        >
          {/* The screen's light falling on the walls of the room */}
          <div
            aria-hidden
            className="room-light pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_40%,rgba(255,236,205,0.11),transparent_72%)]"
          />

          {/* Screen */}
          <div className="relative px-[7%] pb-[15%] pt-[6%]">
            <div className="relative aspect-[2.39/1] overflow-hidden bg-[#121014] ring-1 ring-white/[0.04]">
              <div className="picture absolute inset-0">
                {featured &&
                  (featured.video ? (
                    <video
                      src={featured.video}
                      poster={featured.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={featured.poster}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 900px"
                      className="kenburns object-cover"
                    />
                  ))}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
              </div>
              {/* Bare lamp light before the picture resolves */}
              <div aria-hidden className="lamp pointer-events-none absolute inset-0 bg-[#fff3dc]" />
              {featured && isPlayable(featured) && (
                <PlayCue title={featured.title} onPlay={() => setPlaying(true)} />
              )}
            </div>
          </div>

          {/* Projector haze over the house */}
          <div
            aria-hidden
            className="room-light pointer-events-none absolute inset-x-[7%] bottom-0 top-[45%] bg-[linear-gradient(to_bottom,rgba(255,240,210,0.07),transparent_85%)] blur-xl [clip-path:polygon(0_0,100%_0,64%_100%,36%_100%)]"
          />

          {/* Seats */}
          <div aria-hidden className="seats absolute inset-x-0 bottom-0 h-[44px] md:h-[60px]" />
        </div>

        {/* What's on screen, captioned like a programme note */}
        {featured && (
          <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-world-hairline pt-4">
            <p className="type-label flex min-w-0 gap-3">
              <span className="shrink-0 text-world-accent">Now showing</span>
              <span className="truncate text-world-ink">{featured.title}</span>
            </p>
            <p className="type-label shrink-0 tabular-nums text-world-muted">
              {[featured.year, featured.runtime].filter(Boolean).join(" · ")}
            </p>
          </div>
        )}
      </div>

      <FilmPlayer film={playing && featured ? featured : null} onClose={() => setPlaying(false)} />
    </section>
  );
}
