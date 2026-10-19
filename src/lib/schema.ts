/**
 * Field definitions for every editable collection. Shared by the dashboard
 * (to render forms) and the admin API (to decide which keys get written).
 * No Node imports here — this module is bundled for the client too.
 */

export type FieldType = "text" | "textarea" | "select" | "boolean" | "media" | "url";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  /** For media fields: which kind of file can be picked */
  accept?: MediaKind;
  hint?: string;
}

export type MediaKind = "image" | "video";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const COLLECTIONS = {
  paintings: {
    label: "Paintings",
    singular: "painting",
    room: "The Atelier",
    href: "/art",
    mediaKey: "image",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "image", label: "Image", type: "media", accept: "image", required: true },
      { key: "month", label: "Month", type: "select", options: MONTHS },
      { key: "year", label: "Year", type: "text", hint: "e.g. 2026" },
      { key: "medium", label: "Medium", type: "text", hint: "e.g. Oil Paint" },
      { key: "category", label: "Category", type: "text", hint: "e.g. portraits" },
      { key: "palette", label: "Palette", type: "text" },
      { key: "style", label: "Style", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  photography: {
    label: "Photography",
    singular: "picture",
    room: "The Darkroom",
    href: "/photography",
    mediaKey: "image",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "image", label: "Image", type: "media", accept: "image", required: true },
      {
        key: "client",
        label: "Shoot / client",
        type: "text",
        hint: "Pictures with the same client are grouped into one shoot",
      },
      { key: "category", label: "Caption", type: "text", hint: "e.g. Room 1" },
    ],
  },
  videography: {
    label: "Films",
    singular: "film",
    room: "The Screening Room",
    href: "/film",
    mediaKey: "poster",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "poster", label: "Poster still", type: "media", accept: "image", required: true },
      {
        key: "video",
        label: "Video",
        type: "media",
        accept: "video",
        hint: "Optional short clip — loops muted in the frame on hover",
      },
      {
        key: "link",
        label: "Full film link",
        type: "url",
        hint: "Vimeo or YouTube link — clicking the frame opens it full screen with sound",
      },
      { key: "year", label: "Year", type: "text" },
      { key: "role", label: "Role", type: "text", hint: "e.g. Director / Editor" },
      { key: "runtime", label: "Runtime", type: "text", hint: "e.g. 02:40" },
      { key: "sample", label: "Mark as sample entry", type: "boolean" },
    ],
  },
} as const satisfies Record<
  string,
  {
    label: string;
    singular: string;
    room: string;
    href: string;
    mediaKey: string;
    fields: readonly FieldDef[];
  }
>;

export type CollectionKey = keyof typeof COLLECTIONS;

export function isCollection(value: string): value is CollectionKey {
  return Object.prototype.hasOwnProperty.call(COLLECTIONS, value);
}

export function fieldsOf(collection: CollectionKey): readonly FieldDef[] {
  return COLLECTIONS[collection].fields;
}

/** Dashboard sections, in sidebar order. */
export const ADMIN_SECTIONS = ["site", "paintings", "photography", "videography", "media"] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export const WORLD_KEYS = ["art", "photography", "film"] as const;
export type WorldKey = (typeof WORLD_KEYS)[number];

export interface SiteSettings {
  email: string;
  photographySince: number;
  portrait: string;
  /** Paragraphs separated by a blank line */
  bio: string;
  worlds: Record<WorldKey, { cover: string; blurb: string }>;
}

export interface Entry {
  slug: string;
  [key: string]: string;
}

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  kind: MediaKind;
}

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
const VIDEO_EXT = ["mp4", "webm", "mov", "m4v"];

export function mediaKind(name: string): MediaKind | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXT.includes(ext)) return "image";
  if (VIDEO_EXT.includes(ext)) return "video";
  return null;
}
