import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WorldShell from "@/components/WorldShell";
import Reveal from "@/components/Reveal";
import {
  getFilms,
  getPaintings,
  getPhotographsByClient,
  getSiteForDisplay,
  photographyYears,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Halil Bagosi — painter, photographer, and filmmaker.",
};

function mailto(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default function AboutPage() {
  const paintings = getPaintings();
  const shoots = getPhotographsByClient();
  const films = getFilms();
  const pictures = shoots.reduce((n, g) => n + g.photos.length, 0);
  const site = getSiteForDisplay();
  const years = photographyYears(site);
  const bio = site.bio.split(/\n\s*\n/).filter((p) => p.trim());

  // Each room is previewed in its own world's palette and type (scoped via
  // data-world), so the About page reads as the three rooms side by side.
  const rooms = [
    {
      world: "art",
      href: "/art",
      numeral: "I",
      discipline: "Painting",
      title: "The Atelier",
      titleClass: "font-serif text-[2.5rem] leading-none tracking-[-0.02em]",
      image: paintings[0]?.image,
      fact: plural(paintings.length, "painting"),
      surface: "border border-world-hairline",
    },
    {
      world: "photography",
      href: "/photography",
      numeral: "II",
      discipline: "Photography",
      title: "The Darkroom",
      titleClass:
        "font-grotesk text-2xl font-extrabold uppercase leading-none tracking-[-0.03em] font-stretch-expanded",
      image: shoots[0]?.photos[0]?.image,
      fact: `${plural(shoots.length, "shoot")} · ${plural(pictures, "picture")}`,
      surface:
        "bg-[radial-gradient(90%_70%_at_100%_0%,rgba(255,58,30,0.2),transparent_70%)]",
    },
    {
      world: "film",
      href: "/film",
      numeral: "III",
      discipline: "Film",
      title: "The Screening Room",
      titleClass:
        "font-grotesk text-[2.75rem] font-bold uppercase leading-[0.85] tracking-[-0.01em] font-stretch-extra-condensed",
      image: films[0]?.poster,
      fact: plural(films.length, "film"),
      surface:
        "bg-[radial-gradient(80%_60%_at_50%_0%,rgba(233,180,92,0.14),transparent_70%)]",
    },
  ] as const;

  const enquiries = [
    ["Commission a painting", "Painting commission"],
    ["Book a photo shoot", "Photography booking"],
    ["Request a film session", "Film session request"],
  ] as const;

  return (
    <WorldShell world="about">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-10 md:pt-44">
        {/* Name, with each discipline set in its own room's type */}
        <Reveal>
          <p className="type-label flex gap-3">
            <span className="text-world-accent">IV</span>
            <span className="text-world-muted">About</span>
          </p>
          <h1 className="mt-5 font-serif text-[clamp(3rem,12vw,8rem)] leading-[0.92] tracking-[-0.02em]">
            Halil Bagosi
          </h1>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 md:mt-8">
            <span className="font-serif text-2xl italic text-[#b1502a] md:text-4xl">
              Painter
            </span>
            <span aria-hidden className="text-world-muted">·</span>
            <span className="font-grotesk text-lg font-extrabold uppercase tracking-[-0.03em] font-stretch-expanded md:text-3xl">
              Photographer
            </span>
            <span aria-hidden className="text-world-muted">·</span>
            <span className="font-grotesk text-2xl font-bold uppercase tracking-[-0.01em] font-stretch-extra-condensed md:text-[2.6rem]">
              Filmmaker
            </span>
          </p>
        </Reveal>

        {/* Portrait and bio */}
        <div className="mt-14 grid gap-10 border-t border-world-hairline pt-10 md:mt-20 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-4/5 overflow-hidden bg-world-surface">
              {site.portrait && (
                <Image
                  src={site.portrait}
                  alt="Halil Bagosi"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-[30%_center]"
                />
              )}
            </div>
          </Reveal>

          <Reveal className="md:col-span-6 md:col-start-7">
            <div className="space-y-5 text-[17px] leading-relaxed text-world-ink/90">
              {bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-world-hairline pt-6">
              {[
                ["Paintings", paintings.length],
                ["Shoots", shoots.length],
                ["Years", years],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="type-label text-world-muted">{label}</dt>
                  <dd className="mt-2 font-serif text-4xl tabular-nums tracking-[-0.02em]">
                    {String(value).padStart(2, "0")}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* The three rooms */}
        <section className="mt-24 md:mt-32">
          <Reveal>
            <h2 className="type-label text-world-muted">The three rooms</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rooms.map((room) => (
              <Reveal key={room.world}>
                <Link
                  href={room.href}
                  data-world={room.world}
                  className={`group flex h-full flex-col bg-world-bg p-5 text-world-ink transition-transform duration-200 active:scale-[0.99] md:p-6 ${room.surface}`}
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-world-surface">
                    {room.image && (
                      <Image
                        src={room.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="type-label mt-6 flex gap-3">
                    <span className="text-world-accent">{room.numeral}</span>
                    <span className="text-world-muted">{room.discipline}</span>
                  </p>
                  <h3 className={`mt-3 ${room.titleClass}`}>{room.title}</h3>
                  <div className="type-label mt-auto flex items-baseline justify-between gap-4 pt-10">
                    <span className="text-world-muted">{room.fact}</span>
                    <span className="text-world-accent transition-transform duration-300 group-hover:translate-x-1">
                      Enter →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="mt-24 grid scroll-mt-28 gap-10 border-t border-world-hairline pt-10 md:mt-32 md:grid-cols-12 md:gap-6"
        >
          <Reveal className="md:col-span-5">
            <h2 className="type-label text-world-muted">Contact</h2>
            <p className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
              Let&apos;s make something.
            </p>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7">
            <ul className="divide-y divide-world-hairline border-y border-world-hairline">
              {enquiries.map(([label, subject]) => (
                <li key={label}>
                  <a
                    href={mailto(site.email, subject)}
                    className="group flex items-baseline justify-between gap-4 py-4 text-lg transition-colors hover:text-world-accent"
                  >
                    {label}
                    <span className="type-label text-world-accent transition-transform duration-300 group-hover:translate-x-1">
                      Write →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <span className="type-label text-world-muted">Email</span>
              <span className="break-all font-serif text-xl underline decoration-world-accent decoration-1 underline-offset-4 transition-opacity hover:opacity-70">
                {site.email}
              </span>
            </a>
          </Reveal>
        </section>
      </div>
    </WorldShell>
  );
}
