import Reveal from "./Reveal";

/** Oversized editorial opening section shared by the three worlds. */
export default function WorldHero({
  numeral,
  title,
  subtitle,
  blurb,
}: {
  numeral: string;
  title: string;
  subtitle: string;
  blurb: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-4 pt-32 md:px-10 md:pt-44">
      <Reveal>
        <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-world-accent">
          {numeral} — {subtitle}
        </div>
        <h1 className="mt-4 font-serif text-6xl leading-[0.95] tracking-tight md:text-[9rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-world-muted md:text-base">
          {blurb}
        </p>
      </Reveal>
    </section>
  );
}
