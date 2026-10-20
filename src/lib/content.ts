import fs from "fs";
import path from "path";
import { imageSize } from "image-size";
import type { SiteSettings } from "./schema";
import { videoEmbed } from "./video";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Aspect ratio (width / height) of an image under public/, or null if unreadable. */
function imageAspect(publicPath: string): number | null {
  try {
    const { width, height } = imageSize(
      fs.readFileSync(path.join(PUBLIC_DIR, publicPath))
    );
    return width && height ? width / height : null;
  } catch {
    return null;
  }
}

/** True when a /media/… path points at a file that exists under public/. */
function mediaExists(publicPath: string | undefined): publicPath is string {
  return (
    !!publicPath &&
    publicPath.startsWith("/media/") &&
    fs.existsSync(path.join(PUBLIC_DIR, publicPath))
  );
}

/** Minimal frontmatter parser — the collections only use flat `key: value` pairs. */
function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Unquote YAML-style scalars ('' escapes a single quote inside '…')
    if (/^'.*'$/.test(value)) value = value.slice(1, -1).replace(/''/g, "'");
    else if (/^".*"$/.test(value)) value = value.slice(1, -1).replace(/\\"/g, '"');
    else value = value.replace(/^['"]|['"]$/g, "");
    // Stray characters left by an old CMS, like `']2025'`
    value = value.replace(/^\]/, "").trim();
    if (key) data[key] = value;
  }
  return data;
}

function readCollection(name: string): Record<string, string>[] {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const data = parseFrontmatter(raw);
      data.slug = f.replace(/\.md$/, "");
      return data;
    });
}

const SITE_DEFAULTS: SiteSettings = {
  email: "",
  photographySince: new Date().getFullYear(),
  portrait: "",
  bio: "",
  worlds: {
    art: { cover: "", blurb: "" },
    photography: { cover: "", blurb: "" },
    film: { cover: "", blurb: "" },
  },
};

/** Site-wide copy and settings from content/site.json (edited via /admin). */
export function getSite(): SiteSettings {
  let data: Partial<SiteSettings> = {};
  try {
    data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "site.json"), "utf8"));
  } catch {
    // Missing or malformed: fall back to defaults
  }
  return {
    ...SITE_DEFAULTS,
    ...data,
    worlds: {
      art: { ...SITE_DEFAULTS.worlds.art, ...data.worlds?.art },
      photography: { ...SITE_DEFAULTS.worlds.photography, ...data.worlds?.photography },
      film: { ...SITE_DEFAULTS.worlds.film, ...data.worlds?.film },
    },
  };
}

/** Site settings with any image that no longer exists blanked out, for rendering. */
export function getSiteForDisplay(): SiteSettings {
  const site = getSite();
  const keep = (url: string) => (mediaExists(url) ? url : "");
  return {
    ...site,
    portrait: keep(site.portrait),
    worlds: {
      art: { ...site.worlds.art, cover: keep(site.worlds.art.cover) },
      photography: { ...site.worlds.photography, cover: keep(site.worlds.photography.cover) },
      film: { ...site.worlds.film, cover: keep(site.worlds.film.cover) },
    },
  };
}

/** Whole years since photography work began. */
export function photographyYears(site: SiteSettings = getSite()): number {
  return Math.max(0, new Date().getFullYear() - Number(site.photographySince || 0));
}

const MONTH_ORDER = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

export interface Painting {
  slug: string;
  title: string;
  image: string;
  month: string;
  year: string;
  medium: string;
  category: string;
  palette: string;
  style: string;
  description: string;
  /** width / height of the artwork image; frames render at this ratio */
  aspect: number;
}

export function getPaintings(): Painting[] {
  return (readCollection("paintings") as unknown as Painting[])
    // An entry whose image was removed stays in content/ but isn't shown
    .filter((p) => mediaExists(p.image))
    .map((p) => ({ ...p, aspect: imageAspect(p.image) ?? 4 / 5 }))
    .sort((a, b) => {
    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    if (yearDiff !== 0) return yearDiff;
    return (
      MONTH_ORDER.indexOf((b.month || "").toLowerCase()) -
      MONTH_ORDER.indexOf((a.month || "").toLowerCase())
    );
  });
}

export interface Photograph {
  slug: string;
  title: string;
  image: string;
  client: string;
  category: string;
  /** "Client", "Business" or "" (uncategorised) */
  shootType: string;
  /** width / height of the photograph; contact-sheet frames render at this ratio */
  aspect: number;
}

export interface Shoot {
  client: string;
  /** The type most of the shoot's pictures carry ("" when none do) */
  type: string;
  photos: Photograph[];
}

/** Photographs grouped by client, preserving alphabetical client order. */
export function getPhotographsByClient(): Shoot[] {
  const photos = (readCollection("photography") as unknown as Photograph[])
    .filter((p) => mediaExists(p.image))
    .map((p) => ({ ...p, aspect: imageAspect(p.image) ?? 3 / 2 }));
  const groups = new Map<string, Photograph[]>();
  for (const photo of photos) {
    const client = photo.client?.trim() || "Personal Work";
    if (!groups.has(client)) groups.set(client, []);
    groups.get(client)!.push(photo);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([client, items]) => ({ client, type: majorityType(items), photos: items }));
}

function majorityType(photos: Photograph[]) {
  const counts = new Map<string, number>();
  for (const { shootType } of photos) {
    if (shootType) counts.set(shootType, (counts.get(shootType) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

export interface Film {
  slug: string;
  title: string;
  poster: string;
  year: string;
  role: string;
  runtime: string;
  /** Short local clip that loops muted in the frame */
  video?: string;
  /** Vimeo or YouTube link to the full film, opened full screen on click */
  link?: string;
  sample?: string;
}

export function getFilms(): Film[] {
  return (readCollection("videography") as unknown as Film[])
    .filter((f) => mediaExists(f.poster))
    .map((f) => ({
      ...f,
      video: mediaExists(f.video) ? f.video : undefined,
      link: videoEmbed(f.link) ? f.link : undefined,
    }))
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
}
