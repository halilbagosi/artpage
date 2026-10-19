/**
 * Full-film links. A film's `link` is a Vimeo or YouTube URL; the site turns
 * it into an embed that opens full screen with sound and controls.
 * No Node imports here — this module is bundled for the client too.
 */

export type VideoProvider = "vimeo" | "youtube";

export interface VideoEmbed {
  provider: VideoProvider;
  /** Player URL for an <iframe>, set to start playing once opened */
  src: string;
}

function parseUrl(raw: string): URL | null {
  try {
    return new URL(raw.trim());
  } catch {
    return null;
  }
}

function vimeoEmbed(url: URL): VideoEmbed | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  // vimeo.com/123, vimeo.com/123/abcdef (unlisted), vimeo.com/channels/x/123,
  // player.vimeo.com/video/123?h=abcdef
  const parts = url.pathname.split("/").filter(Boolean);
  const idIndex = parts.findIndex((p) => /^\d+$/.test(p));
  if (idIndex === -1) return null;
  const id = parts[idIndex];
  const hash = url.searchParams.get("h") ?? parts[idIndex + 1];
  const params = new URLSearchParams({
    autoplay: "1",
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });
  if (hash && /^[a-f0-9]+$/i.test(hash)) params.set("h", hash);
  return { provider: "vimeo", src: `https://player.vimeo.com/video/${id}?${params}` };
}

function youtubeEmbed(url: URL): VideoEmbed | null {
  const host = url.hostname.replace(/^(www|m)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [kind, value] = url.pathname.split("/").filter(Boolean);
    id = kind === "watch" ? url.searchParams.get("v") : ["embed", "shorts", "live"].includes(kind) ? value : null;
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return null;
  const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
  const start = url.searchParams.get("t") ?? url.searchParams.get("start");
  if (start && /^\d+s?$/.test(start)) params.set("start", start.replace("s", ""));
  return { provider: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}?${params}` };
}

/** Embed for a Vimeo or YouTube link, or null if it isn't one. */
export function videoEmbed(link: string | undefined): VideoEmbed | null {
  if (!link) return null;
  const url = parseUrl(link);
  if (!url || !/^https?:$/.test(url.protocol)) return null;
  return vimeoEmbed(url) ?? youtubeEmbed(url);
}
