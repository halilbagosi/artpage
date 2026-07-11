import type { Metadata } from "next";
import Image from "next/image";
import WorldShell from "@/components/WorldShell";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "About Halil Bagosi — painter, photographer, and filmmaker.",
};

export default function AboutPage() {
  return (
    <WorldShell world="about">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-10 md:pt-44">
        <Reveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-world-accent">
            The person behind the worlds
          </div>
          <h1 className="mt-4 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Halil Bagosi
          </h1>
        </Reveal>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:gap-16">
          <Reveal className="md:w-2/5">
            <div className="border border-world-hairline bg-world-surface p-3">
              <div className="relative aspect-4/5">
                <Image
                  src="/media/DSCF2672.JPG"
                  alt="Halil Bagosi"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-[30%_center]"
                />
              </div>
            </div>
          </Reveal>

          <Reveal className="md:w-3/5">
            <div className="space-y-5 text-base leading-relaxed text-world-ink/90">
              <p>
                I work across three disciplines that feed one another: painting
                teaches me patience and color, photography teaches me light and
                timing, and film ties them together with rhythm.
              </p>
              <p>
                On the canvas I paint portraits and landscapes in oil and
                acrylic. Behind the camera I shoot interiors, product, and
                campaign work for clients. Behind the lens in motion, I direct
                and edit short-form films.
              </p>
              <p>
                If you would like to commission a painting, book a shoot, or
                talk about a film project — write to me.
              </p>
            </div>

            <div className="mt-10 border-t border-world-hairline pt-6">
              <a
                href="mailto:halilbagosi24@icloud.com"
                className="group inline-flex items-baseline gap-3"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-world-muted">
                  Email
                </span>
                <span className="font-serif text-2xl text-world-ink underline decoration-world-accent decoration-1 underline-offset-4 transition-opacity group-hover:opacity-70">
                  halilbagosi24@icloud.com
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </WorldShell>
  );
}
