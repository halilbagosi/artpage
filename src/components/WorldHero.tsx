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
    <section className="mx-auto max-w-6xl px-5 pb-4 pt-28 md:px-10 md:pt-44">
      <Reveal>
        <p className="type-label flex gap-3">
          <span className="text-world-accent">{numeral}</span>
          <span className="text-world-muted">{subtitle}</span>
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.75rem,13vw,4.5rem)] leading-[0.95] tracking-tight md:text-[9rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-world-muted md:text-base">
          {blurb}
        </p>
      </Reveal>
    </section>
  );
}
