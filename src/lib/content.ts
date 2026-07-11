import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

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
    // Strip surrounding quotes and stray characters like `']2025'`
    value = value.replace(/^['"]|['"]$/g, "").replace(/^\]/, "").trim();
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
}

export function getPaintings(): Painting[] {
  return (readCollection("paintings") as unknown as Painting[]).sort((a, b) => {
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
}

/** Photographs grouped by client, preserving alphabetical client order. */
export function getPhotographsByClient(): { client: string; photos: Photograph[] }[] {
  const photos = readCollection("photography") as unknown as Photograph[];
  const groups = new Map<string, Photograph[]>();
  for (const photo of photos) {
    const client = photo.client?.trim() || "Personal Work";
    if (!groups.has(client)) groups.set(client, []);
    groups.get(client)!.push(photo);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([client, items]) => ({ client, photos: items }));
}

export interface Film {
  slug: string;
  title: string;
  poster: string;
  year: string;
  role: string;
  runtime: string;
  video?: string;
  sample?: string;
}

export function getFilms(): Film[] {
  return (readCollection("videography") as unknown as Film[]).sort(
    (a, b) => Number(b.year || 0) - Number(a.year || 0)
  );
}
