import Reveal from "./Reveal";

/** Edge print along the hero's film strip: the shoots, numbered, on repeat. */
function edgePrint(shoots: string[], minLength = 8) {
  const marks = shoots.map(
    (client, i) => `${String(i + 1).padStart(2, "0")}  ▸ ${client}`
  );
  if (marks.length === 0) return [];
  const out: string[] = [];
  while (out.length < minLength) out.push(...marks);
  return out;
}

/**
 * Opening of the Darkroom: wide film-box type over a hairline, the facts of
 * the practice set in columns, and a strip of film — edge-printed with the
 * shoots themselves — creeping across the bench.
 */
export default function DarkroomHero({
  shoots,
  pictures,
  years,
  blurb,
}: {
  shoots: string[];
  pictures: number;
  years: number;
  blurb: string;
}) {
  const marks = edgePrint(shoots);
  const facts = [
    ["Shoots", shoots.length],
    ["Pictures", pictures],
    ["Years", years],
  ] as const;

  return (
    <section className="pt-32 md:pt-44">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="type-label flex gap-3">
            <span className="text-world-accent">II</span>
            <span className="text-world-muted">Photography</span>
          </p>

          <h1 className="mt-5 font-grotesk text-[clamp(2.75rem,10.5vw,9rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em] font-stretch-expanded">
            The
            <br />
            Darkroom
          </h1>

          <div className="mt-12 grid gap-10 border-t border-world-hairline pt-6 md:mt-16 md:grid-cols-12 md:gap-6">
            <p className="max-w-md text-[15px] leading-relaxed text-world-muted md:col-span-5">
              {blurb}
            </p>
            <dl className="grid grid-cols-3 gap-6 md:col-span-5 md:col-start-8">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="type-label text-world-muted">{label}</dt>
                  <dd className="mt-2 font-grotesk text-3xl font-semibold tabular-nums tracking-[-0.02em] font-stretch-expanded md:text-4xl">
                    {String(value).padStart(2, "0")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      {/* A length of film drifting across the bench */}
      <div
        aria-hidden
        className="relative mt-16 overflow-hidden bg-[#040303] py-1.5 md:mt-24"
      >
        <div className="sprockets" />
        <div className="film-ticker flex w-max whitespace-pre py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f0dcc8]/40">
          {[...marks, ...marks].map((mark, i) => (
            <span key={i} className="px-8">
              {mark}
            </span>
          ))}
        </div>
        <div className="sprockets" />
      </div>
    </section>
  );
}
