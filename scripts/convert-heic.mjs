#!/usr/bin/env node

/**
 * HEIC → JPEG Auto-Converter
 * 
 * Scans public/media for .heic/.HEIC files, converts them to .jpg using
 * the macOS `sips` command, updates all markdown content references,
 * and removes the originals.
 * 
 * Runs automatically before `npm run dev` and `npm run build`.
 */

import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const MEDIA_DIR = join(PROJECT_ROOT, 'public', 'media');
const CONTENT_DIR = join(PROJECT_ROOT, 'content');

function findMarkdownFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function run() {
  if (!existsSync(MEDIA_DIR)) {
    console.log('[heic-convert] No media directory found, skipping.');
    return;
  }

  const mediaFiles = readdirSync(MEDIA_DIR);
  const heicFiles = mediaFiles.filter(f => /\.heic$/i.test(f));

  if (heicFiles.length === 0) {
    console.log('[heic-convert] No HEIC files found, nothing to convert.');
    return;
  }

  console.log(`[heic-convert] Found ${heicFiles.length} HEIC file(s) to convert...`);

  const markdownFiles = findMarkdownFiles(CONTENT_DIR);

  for (const heicFile of heicFiles) {
    const nameWithoutExt = basename(heicFile, extname(heicFile));
    const jpgFilename = `${nameWithoutExt}.jpg`;
    const heicPath = join(MEDIA_DIR, heicFile);
    const jpgPath = join(MEDIA_DIR, jpgFilename);

    try {
      // Convert using macOS sips (built-in, no external deps needed)
      console.log(`[heic-convert]   ${heicFile} → ${jpgFilename}`);
      execSync(`sips -s format jpeg "${heicPath}" --out "${jpgPath}"`, {
        stdio: 'pipe',
      });

      // Update all markdown files that reference this HEIC file
      for (const mdFile of markdownFiles) {
        let content = readFileSync(mdFile, 'utf-8');
        if (content.includes(heicFile)) {
          content = content.replaceAll(heicFile, jpgFilename);
          writeFileSync(mdFile, content, 'utf-8');
          console.log(`[heic-convert]   Updated reference in ${basename(mdFile)}`);
        }
      }

      // Remove original HEIC file
      unlinkSync(heicPath);
      console.log(`[heic-convert]   Removed original ${heicFile}`);
    } catch (err) {
      console.error(`[heic-convert]   Failed to convert ${heicFile}:`, err.message);
    }
  }

  console.log('[heic-convert] Done!');
}

run();
