import type { Metadata } from "next";
import { getPhotographsByClient } from "@/lib/content";
import WorldShell from "@/components/WorldShell";
import WorldHero from "@/components/WorldHero";
import DarkroomGallery from "@/components/DarkroomGallery";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Commercial and editorial photography by Halil Bagosi — interiors, product, and campaign work.",
};

export default function PhotographyPage() {
  const groups = getPhotographsByClient();
  const total = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <WorldShell world="photography">
      <WorldHero
        numeral="II"
        title="The Darkroom"
        subtitle={`Photography — ${total} frames`}
        blurb="Commercial and editorial frames, printed dark and viewed like a contact sheet. Hover a frame to read its stamp; click to enlarge."
      />
      <DarkroomGallery groups={groups} />
    </WorldShell>
  );
}
