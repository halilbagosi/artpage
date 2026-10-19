#!/usr/bin/env node

/**
 * Static build for GitHub Pages.
 *
 * The local dashboard (/admin and /api/admin/*) needs a running server and
 * returns 404 in production anyway, but `output: "export"` refuses to build
 * dynamic routes. Set those folders aside for the export, then put them back.
 */

import { existsSync, mkdirSync, renameSync, rmSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const STASH = join(ROOT, '.pages-build-stash');
const LOCAL_ONLY = ['src/app/admin', 'src/app/api'];

if (existsSync(STASH)) {
  throw new Error(`[build-pages] ${STASH} exists from an interrupted build — move its folders back into src/app first.`);
}

const moved = [];
try {
  for (const rel of LOCAL_ONLY) {
    const from = join(ROOT, rel);
    if (!existsSync(from)) continue;
    const to = join(STASH, rel);
    mkdirSync(join(to, '..'), { recursive: true });
    renameSync(from, to);
    moved.push([from, to]);
  }
  execSync('next build', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: '1' },
  });
} finally {
  for (const [from, to] of moved) renameSync(to, from);
  if (existsSync(STASH)) rmSync(STASH, { recursive: true });
}
