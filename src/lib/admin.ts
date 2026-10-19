import fs from "fs";
import path from "path";
import {
  COLLECTIONS,
  WORLD_KEYS,
  fieldsOf,
  mediaKind,
  type CollectionKey,
  type Entry,
  type MediaFile,
  type SiteSettings,
} from "./schema";
import { imageSize } from "image-size";
import { getSite } from "./content";

/**
 * Disk access for the local dashboard. Everything here writes into content/
 * and public/media, so it only runs under `npm run admin` (development +
 * ENABLE_ADMIN=1, bound to 127.0.0.1) — never in a production build.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const MEDIA_DIR = path.join(process.cwd(), "public", "media");

const COLLECTION_DIRS: Record<CollectionKey, string> = {
  paintings: "paintings",
  photography: "photography",
  videography: "videography",
};

export function adminEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" && process.env.ENABLE_ADMIN === "1"
  );
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Rejects the request unless the dashboard is enabled and it came from this
 * machine's own dashboard page: the Host must be loopback (blocks DNS
 * rebinding) and any Origin must match it (blocks cross-site form posts).
 */
export function guard(request: Request): Response | null {
  if (!adminEnabled()) return new Response("Not found", { status: 404 });
  const host = request.headers.get("host") ?? "";
  const hostname = host.replace(/:\d+$/, "");
  if (!LOCAL_HOSTS.has(hostname)) {
    return new Response("Forbidden", { status: 403 });
  }
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== host) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}

export class AdminError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof AdminError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: "Something went wrong" }, { status: 500 });
}

// ——— Frontmatter ———

const SLUG_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function assertSlug(slug: string) {
  if (!SLUG_RE.test(slug)) throw new AdminError("Invalid entry id");
}

function readRaw(file: string) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return {
    lines: match ? match[1].split(/\r?\n/) : [],
    body: match ? raw.slice(match[0].length) : raw,
  };
}

/** Same rules as the site's parser in content.ts. */
function parseLines(lines: string[]): Record<string, string> {
  const data: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (/^'.*'$/.test(value)) value = value.slice(1, -1).replace(/''/g, "'");
    else if (/^".*"$/.test(value)) value = value.slice(1, -1).replace(/\\"/g, '"');
    else value = value.replace(/^['"]|['"]$/g, "");
    value = value.replace(/^\]/, "").trim();
    if (key) data[key] = value;
  }
  return data;
}

/** Single-quoted YAML scalar on one line. */
function quote(value: string) {
  return `'${value.replace(/\s*\r?\n\s*/g, " ").replace(/'/g, "''")}'`;
}

function serialize(data: Record<string, string>, body: string) {
  const lines = Object.entries(data).map(([k, v]) => `${k}: ${quote(v)}`);
  return `---\n${lines.join("\n")}\n---\n${body}`;
}

// ——— Collections ———

function collectionDir(collection: CollectionKey) {
  return path.join(CONTENT_DIR, COLLECTION_DIRS[collection]);
}

export function readEntries(collection: CollectionKey): Entry[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({
      ...parseLines(readRaw(path.join(dir, f)).lines),
      slug: f.replace(/\.md$/, ""),
    }));
}

/** Keep only schema fields, normalised to strings; enforce required ones. */
function cleanFields(collection: CollectionKey, input: Record<string, unknown>) {
  const out: Record<string, string> = {};
  for (const field of fieldsOf(collection)) {
    const raw = input[field.key];
    let value =
      field.type === "boolean"
        ? raw === true || raw === "true"
          ? "true"
          : "false"
        : typeof raw === "string"
          ? raw.trim()
          : "";
    if (field.type === "media" && value && !value.startsWith("/media/")) {
      throw new AdminError(`${field.label} must be a file from the media library`);
    }
    if (field.type === "select" && value && !field.options?.includes(value)) {
      value = "";
    }
    if (field.required && !value) {
      throw new AdminError(`${field.label} is required`);
    }
    out[field.key] = value;
  }
  return out;
}

function slugify(title: string) {
  return (
    title
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "untitled"
  );
}

export function createEntry(collection: CollectionKey, input: Record<string, unknown>) {
  const fields = cleanFields(collection, input);
  const dir = collectionDir(collection);
  fs.mkdirSync(dir, { recursive: true });
  const base = slugify(fields.title);
  let slug = base;
  for (let n = 2; fs.existsSync(path.join(dir, `${slug}.md`)); n++) {
    slug = `${base}-${n}`;
  }
  fs.writeFileSync(path.join(dir, `${slug}.md`), serialize(fields, ""));
  return slug;
}

export function updateEntry(
  collection: CollectionKey,
  slug: string,
  input: Record<string, unknown>
) {
  assertSlug(slug);
  const file = path.join(collectionDir(collection), `${slug}.md`);
  if (!fs.existsSync(file)) throw new AdminError("Entry not found", 404);
  const { lines, body } = readRaw(file);
  // Unknown keys already in the file are kept; schema fields are replaced
  const merged = { ...parseLines(lines), ...cleanFields(collection, input) };
  fs.writeFileSync(file, serialize(merged, body));
}

export function deleteEntry(collection: CollectionKey, slug: string) {
  assertSlug(slug);
  const file = path.join(collectionDir(collection), `${slug}.md`);
  if (!fs.existsSync(file)) throw new AdminError("Entry not found", 404);
  fs.unlinkSync(file);
}

// ——— Site settings ———

export function saveSite(input: Partial<SiteSettings>) {
  const current = getSite();
  const media = (value: unknown, fallback: string) => {
    if (typeof value !== "string") return fallback;
    if (value && !value.startsWith("/media/")) {
      throw new AdminError("Images must come from the media library");
    }
    return value;
  };
  const text = (value: unknown, fallback: string) =>
    typeof value === "string" ? value.trim() : fallback;

  const since = Number(input.photographySince ?? current.photographySince);
  if (!Number.isInteger(since) || since < 1900 || since > new Date().getFullYear()) {
    throw new AdminError("Photographing since must be a year");
  }

  const next: SiteSettings = {
    email: text(input.email, current.email),
    photographySince: since,
    portrait: media(input.portrait, current.portrait),
    bio: text(input.bio, current.bio),
    worlds: { ...current.worlds },
  };
  for (const key of WORLD_KEYS) {
    const world = input.worlds?.[key];
    next.worlds[key] = {
      cover: media(world?.cover, current.worlds[key].cover),
      blurb: text(world?.blurb, current.worlds[key].blurb),
    };
  }
  writeSite(next);
  return next;
}

function writeSite(site: SiteSettings) {
  fs.writeFileSync(
    path.join(CONTENT_DIR, "site.json"),
    JSON.stringify(site, null, 2) + "\n"
  );
}

// ——— Media ———

export function listMedia(): MediaFile[] {
  if (!fs.existsSync(MEDIA_DIR)) return [];
  const files = fs.readdirSync(MEDIA_DIR).flatMap((name) => {
    const kind = mediaKind(name);
    if (!kind || name.startsWith(".")) return [];
    const stat = fs.statSync(path.join(MEDIA_DIR, name));
    return [{ file: { name, url: `/media/${name}`, size: stat.size, kind }, mtime: stat.mtimeMs }];
  });
  // Newest uploads first
  return files.sort((a, b) => b.mtime - a.mtime).map(({ file }) => file);
}

function safeMediaName(original: string) {
  const ext = path.extname(original).toLowerCase();
  const stem = path
    .basename(original, path.extname(original))
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "upload";
  let name = `${stem}${ext}`;
  for (let n = 2; fs.existsSync(path.join(MEDIA_DIR, name)); n++) {
    name = `${stem}-${n}${ext}`;
  }
  return name;
}

export async function saveUpload(file: File): Promise<MediaFile> {
  const kind = mediaKind(file.name);
  if (!kind) {
    throw new AdminError(
      "Unsupported file type — use JPG, PNG, WebP, GIF, AVIF, MP4, WebM or MOV"
    );
  }
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  const name = safeMediaName(file.name);
  fs.writeFileSync(path.join(MEDIA_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { name, url: `/media/${name}`, size: file.size, kind };
}

/** Every place a media URL is referenced, as human-readable labels. */
export function mediaUsage(): Record<string, string[]> {
  const usage: Record<string, string[]> = {};
  const add = (url: string, label: string) => {
    if (url) (usage[url] ??= []).push(label);
  };
  const site = getSite();
  add(site.portrait, "About portrait");
  for (const key of WORLD_KEYS) add(site.worlds[key].cover, `Homepage cover (${key})`);
  for (const key of Object.keys(COLLECTIONS) as CollectionKey[]) {
    for (const entry of readEntries(key)) {
      for (const field of fieldsOf(key)) {
        if (field.type === "media") add(entry[field.key], entry.title || entry.slug);
      }
    }
  }
  return usage;
}

function assertMediaName(name: string) {
  if (name !== path.basename(name) || name.startsWith(".") || !mediaKind(name)) {
    throw new AdminError("Invalid file name");
  }
  if (!fs.existsSync(path.join(MEDIA_DIR, name))) {
    throw new AdminError("File not found", 404);
  }
}

/**
 * A fresh name for an edited version of a file: IMG.jpg → IMG-v2.jpg →
 * IMG-v3.jpg. Edits always get a new URL so neither the browser nor the image
 * optimiser can serve the old pixels from cache.
 */
function versionedName(name: string, ext = path.extname(name).toLowerCase()) {
  const base = path.basename(name, path.extname(name));
  const current = base.match(/-v(\d+)$/);
  const stem = base.replace(/-v\d+$/, "");
  // Always count upwards from the current version, whatever the extension
  let n = current ? Number(current[1]) + 1 : 2;
  while (fs.existsSync(path.join(MEDIA_DIR, `${stem}-v${n}${ext}`))) n++;
  return `${stem}-v${n}${ext}`;
}

/** Point every reference to one media URL at another ("" clears it). */
function replaceReferences(from: string, to: string) {
  for (const key of Object.keys(COLLECTIONS) as CollectionKey[]) {
    const dir = collectionDir(key);
    if (!fs.existsSync(dir)) continue;
    const mediaKeys = fieldsOf(key)
      .filter((f) => f.type === "media")
      .map((f) => f.key);
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const file = path.join(dir, f);
      const { lines, body } = readRaw(file);
      const data = parseLines(lines);
      let changed = false;
      for (const k of mediaKeys) {
        if (data[k] === from) {
          data[k] = to;
          changed = true;
        }
      }
      if (changed) fs.writeFileSync(file, serialize(data, body));
    }
  }

  const site = getSite();
  let changed = false;
  if (site.portrait === from) {
    site.portrait = to;
    changed = true;
  }
  for (const key of WORLD_KEYS) {
    if (site.worlds[key].cover === from) {
      site.worlds[key].cover = to;
      changed = true;
    }
  }
  if (changed) writeSite(site);
}

function fileInfo(name: string): MediaFile {
  const stat = fs.statSync(path.join(MEDIA_DIR, name));
  return { name, url: `/media/${name}`, size: stat.size, kind: mediaKind(name)! };
}

/** Pixel dimensions of an image (null for video or unreadable files). */
export function mediaDimensions(name: string) {
  assertMediaName(name);
  if (mediaKind(name) !== "image") return null;
  try {
    const { width, height } = imageSize(fs.readFileSync(path.join(MEDIA_DIR, name)));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

export function renameMedia(name: string, newStem: string): MediaFile {
  assertMediaName(name);
  const ext = path.extname(name).toLowerCase();
  const stem = newStem
    .trim()
    .replace(/\.[A-Za-z0-9]+$/, "")
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (!stem) throw new AdminError("Enter a file name");
  const next = `${stem}${ext}`;
  if (next === name) return fileInfo(name);
  if (fs.existsSync(path.join(MEDIA_DIR, next))) {
    throw new AdminError(`${next} already exists`, 409);
  }
  fs.renameSync(path.join(MEDIA_DIR, name), path.join(MEDIA_DIR, next));
  replaceReferences(`/media/${name}`, `/media/${next}`);
  return fileInfo(next);
}

/** Swap in a newly uploaded file everywhere the old one was used. */
export async function replaceMedia(name: string, file: File): Promise<MediaFile> {
  assertMediaName(name);
  const kind = mediaKind(file.name);
  if (kind !== mediaKind(name)) {
    throw new AdminError(
      `Replace ${mediaKind(name) === "image" ? "an image with another image" : "a video with another video"}`
    );
  }
  const next = versionedName(name, path.extname(file.name).toLowerCase());
  fs.writeFileSync(path.join(MEDIA_DIR, next), Buffer.from(await file.arrayBuffer()));
  replaceReferences(`/media/${name}`, `/media/${next}`);
  fs.unlinkSync(path.join(MEDIA_DIR, name));
  return fileInfo(next);
}

/** Rotate an image by a quarter turn, keeping its format. */
export async function rotateMedia(name: string, degrees: number): Promise<MediaFile> {
  assertMediaName(name);
  if (mediaKind(name) !== "image") throw new AdminError("Only images can be rotated");
  if (degrees !== 90 && degrees !== -90) throw new AdminError("Rotate by 90° steps");
  const ext = path.extname(name).toLowerCase();
  if (ext === ".gif") throw new AdminError("GIFs can't be rotated here");

  const { default: sharp } = await import("sharp");
  // Bake in any camera EXIF orientation first, then apply the turn
  let image = sharp(path.join(MEDIA_DIR, name)).autoOrient().rotate(degrees);
  if (ext === ".jpg" || ext === ".jpeg") image = image.jpeg({ quality: 92, mozjpeg: true });
  else if (ext === ".webp") image = image.webp({ quality: 92 });
  else if (ext === ".avif") image = image.avif({ quality: 70 });

  const next = versionedName(name);
  await image.toFile(path.join(MEDIA_DIR, next));
  replaceReferences(`/media/${name}`, `/media/${next}`);
  fs.unlinkSync(path.join(MEDIA_DIR, name));
  return fileInfo(next);
}

/**
 * Delete a file. If something still uses it, `force` is required: those
 * references are cleared, and entries left without their image are hidden on
 * the site until a new one is chosen.
 */
export function deleteMedia(name: string, force = false) {
  assertMediaName(name);
  const url = `/media/${name}`;
  const usedBy = mediaUsage()[url];
  if (usedBy?.length && !force) {
    throw new AdminError(`Still used by: ${usedBy.join(", ")}`, 409);
  }
  if (usedBy?.length) replaceReferences(url, "");
  fs.unlinkSync(path.join(MEDIA_DIR, name));
}

// ——— Everything the dashboard shows ———

export function readAll() {
  return {
    site: getSite(),
    entries: {
      paintings: readEntries("paintings"),
      photography: readEntries("photography"),
      videography: readEntries("videography"),
    },
    media: listMedia(),
    usage: mediaUsage(),
  };
}

export type DashboardData = ReturnType<typeof readAll>;
