import type { Metadata } from "next";
import { getPaintings, getSite } from "@/lib/content";
import WorldShell from "@/components/WorldShell";
import WorldHero from "@/components/WorldHero";
import AtelierGallery from "@/components/AtelierGallery";

export const metadata: Metadata = {
  title: "Art",
  description: "Original paintings by Halil Bagosi — oil and acrylic works.",
};

export default function ArtPage() {
  const paintings = getPaintings();
  const site = getSite();

  return (
    <WorldShell world="art">
      <div className="grain">
        <WorldHero
          numeral="I"
          title="The Atelier"
          subtitle="Painting"
          blurb={site.worlds.art.blurb}
        />
        <AtelierGallery paintings={paintings} />
      </div>
    </WorldShell>
  );
}
