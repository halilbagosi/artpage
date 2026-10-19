import { createClient } from "tinacms/dist/client";
import { queries } from "../../tina/__generated__/types.js";

/**
 * A smart TinaCMS client that automatically uses a proxy when the site
 * is accessed from a device other than localhost (e.g. a phone on the LAN).
 *
 * - On localhost: connects directly to TinaCMS at localhost:4001
 * - On any other host: routes through /api/tina-graphql proxy
 * - Static export (GitHub Pages): reads JSON snapshots from /content/
 *   written at build time by scripts/export-content.mjs
 */
function getClientUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: always use localhost directly
    return 'http://localhost:4001/graphql';
  }

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4001/graphql';
  }

  // On a LAN device, proxy through the Next.js server
  return `${window.location.origin}/api/tina-graphql`;
}

const staticClient = {
  apiUrl: '',
  async request({ query }: { query: string }) {
    const name = query.match(/query\s+(\w+)/)?.[1];
    const res = await fetch(`/content/${name}.json`);
    if (!res.ok) throw new Error(`Missing content snapshot for ${name}`);
    return res.json();
  },
};

export const tinaClient =
  process.env.NEXT_PUBLIC_STATIC_CONTENT === '1'
    ? { queries: queries(staticClient as unknown as Parameters<typeof queries>[0]) }
    : createClient({
        url: getClientUrl(),
        token: '',
        queries,
      });

export default tinaClient;
