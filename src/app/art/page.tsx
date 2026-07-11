import type { Metadata } from "next";
import { getPaintings } from "@/lib/content";
import WorldShell from "@/components/WorldShell";
import WorldHero from "@/components/WorldHero";
import AtelierGallery from "@/components/AtelierGallery";

export const metadata: Metadata = {
  title: "Art",
  description: "Original paintings by Halil Bagosi — oil and acrylic works.",
};

export default function ArtPage() {
  const paintings = getPaintings();

  return (
    <WorldShell world="art">
      <div className="grain">
        <WorldHero
          numeral="I"
          title="The Atelier"
          subtitle="Painting"
          blurb="Oil and acrylic works — portraits and landscapes painted from life and memory. Each piece hangs here as it would on a gallery wall."
        />
        <AtelierGallery paintings={paintings} />
      </div>
    </WorldShell>
  );
}
