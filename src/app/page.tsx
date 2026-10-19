import Gateway from "@/components/Gateway";
import { getSiteForDisplay } from "@/lib/content";

export default function Home() {
  const { worlds } = getSiteForDisplay();
  return (
    <Gateway
      covers={{
        art: worlds.art.cover,
        photography: worlds.photography.cover,
        film: worlds.film.cover,
      }}
    />
  );
}
