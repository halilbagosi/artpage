import type { Metadata } from "next";
import { getPhotographsByClient, getSite, photographyYears } from "@/lib/content";
import WorldShell from "@/components/WorldShell";
import DarkroomHero from "@/components/DarkroomHero";
import DarkroomGallery from "@/components/DarkroomGallery";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Commercial and editorial photography by Halil Bagosi — interiors, product, and campaign work.",
};

export default function PhotographyPage() {
  const groups = getPhotographsByClient();
  const total = groups.reduce((n, g) => n + g.photos.length, 0);
  const site = getSite();

  return (
    <WorldShell world="photography">
      <div className="safelight">
        <DarkroomHero
          shoots={groups.map((g) => g.client)}
          pictures={total}
          years={photographyYears(site)}
          blurb={site.worlds.photography.blurb}
        />
        <DarkroomGallery shoots={groups} />
      </div>
    </WorldShell>
  );
}
