import type { Metadata } from "next";
import { getFilms, getSite } from "@/lib/content";
import WorldShell from "@/components/WorldShell";
import ScreeningHero from "@/components/ScreeningHero";
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
        <ScreeningHero featured={films[0]} blurb={getSite().worlds.film.blurb} />
        <ScreeningRoom films={films} />
      </div>
    </WorldShell>
  );
}
