import type { Metadata } from "next";
import { getFilms } from "@/lib/content";
import WorldShell from "@/components/WorldShell";
import WorldHero from "@/components/WorldHero";
import ScreeningRoom from "@/components/ScreeningRoom";

export const metadata: Metadata = {
  title: "Film",
  description:
    "Cinematic direction and videography by Halil Bagosi — short films and commissioned work.",
};

export default function FilmPage() {
  const films = getFilms();

  return (
    <WorldShell world="film">
      <div className="grain">
        <WorldHero
          numeral="III"
          title="The Screening Room"
          subtitle="Film"
          blurb="Directed and photographed motion work, presented letterboxed the way it should be seen — lights down, sound up."
        />
        <ScreeningRoom films={films} />
      </div>
    </WorldShell>
  );
}
