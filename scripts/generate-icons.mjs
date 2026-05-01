#!/usr/bin/env node
/* scripts/generate-icons.mjs
 *
 * Renders src/app/icon.svg to PNG variants for iOS home screen and PWA.
 * Run after editing icon.svg — outputs are committed alongside the SVG.
 *
 * Usage:
 *   node scripts/generate-icons.mjs
 *
 * Outputs:
 *   src/app/apple-icon.png    180x180  (iOS home screen, Next.js convention)
 *   public/icon-192.png       192x192  (PWA, manifest.json)
 *   public/icon-512.png       512x512  (PWA install splash, manifest.json)
 *
 * Requires: sharp (already a Next.js transitive dep, no install needed).
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SVG_SRC = path.join(ROOT, 'src', 'app', 'icon.svg');

const TARGETS = [
  { out: path.join(ROOT, 'src', 'app', 'apple-icon.png'), size: 180, bg: '#ffffff' },
  { out: path.join(ROOT, 'public', 'icon-192.png'), size: 192, bg: '#ffffff' },
  { out: path.join(ROOT, 'public', 'icon-512.png'), size: 512, bg: '#ffffff' },
];

const svg = await readFile(SVG_SRC);
console.log(`Source: ${SVG_SRC} (${svg.length} bytes)`);

for (const { out, size, bg } of TARGETS) {
  // Render at 2x density then resize to avoid antialiasing artifacts on
  // high-contrast vector edges. Flatten on the chosen background so iOS
  // (which forces a square non-transparent tile) doesn't blot the glyph.
  const buffer = await sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: bg })
    .flatten({ background: bg })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(out, buffer);
  console.log(`  → ${path.relative(ROOT, out)} (${size}x${size}, ${buffer.length} bytes)`);
}

console.log('\nDone. Next steps:');
console.log('  1. Verify PNGs visually look right.');
console.log('  2. Commit src/app/icon.svg + the generated PNGs together.');
console.log('  3. If the A glyph is off-center, adjust the viewBox in icon.svg and re-run.');
