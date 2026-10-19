#!/usr/bin/env node

/**
 * TinaCMS Content Snapshot
 *
 * Queries the local TinaCMS GraphQL server (started by `tinacms build --local -c ...`)
 * and writes each connection query's response to public/content/<query>.json.
 *
 * The static GitHub Pages build has no GraphQL server, so the Tina client
 * reads these snapshots instead (see src/lib/tina-client.ts).
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'tinacms/dist/client';
import { queries } from '../tina/__generated__/types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'content');

const QUERIES = ['paintingConnection', 'photographyConnection', 'videographyConnection', 'aboutConnection'];

const client = createClient({ url: 'http://localhost:4001/graphql', token: '', queries });

mkdirSync(OUT_DIR, { recursive: true });

for (const name of QUERIES) {
  const res = await client.queries[name]();
  if (res.errors?.length) {
    throw new Error(`[export-content] ${name} failed: ${JSON.stringify(res.errors)}`);
  }
  writeFileSync(join(OUT_DIR, `${name}.json`), JSON.stringify({ data: res.data }));
  console.log(`[export-content] Wrote public/content/${name}.json`);
}
