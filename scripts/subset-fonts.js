#!/usr/bin/env node
/**
 * Automatically subset Noto Serif TC to only characters used in the project.
 *
 * Prerequisites: pip install fonttools brotli
 * Usage: node scripts/subset-fonts.js
 *
 * This script:
 * 1. Scans all .tsx/.ts files in src/ for CJK characters
 * 2. Runs pyftsubset on the full Noto Serif TC TTFs
 * 3. Outputs subsetted woff2 files to src/fonts/
 *
 * Place full TTF files at:
 *   src/fonts/full/NotoSerifTC-Light.ttf
 *   src/fonts/full/NotoSerifTC-Regular.ttf
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.resolve(__dirname, '../src');
const FONTS_DIR = path.resolve(SRC_DIR, 'fonts');
const FULL_DIR = path.resolve(FONTS_DIR, 'full');

const WEIGHTS = [
  { name: 'Light', file: 'NotoSerifTC-Light.ttf', output: 'NotoSerifTC-Light-subset.woff2' },
  { name: 'Regular', file: 'NotoSerifTC-Regular.ttf', output: 'NotoSerifTC-Regular-subset.woff2' },
];

// Recursively find all .tsx/.ts files
function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'fonts') {
      files = files.concat(walk(full));
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// Extract unique CJK characters
function extractCJK(text) {
  const chars = new Set();
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if ((code >= 0x4E00 && code <= 0x9FFF) ||  // CJK Unified Ideographs
        (code >= 0x3400 && code <= 0x4DBF) ||  // CJK Extension A
        (code >= 0xF900 && code <= 0xFAFF) ||  // CJK Compatibility
        (code >= 0x3000 && code <= 0x303F) ||  // CJK Punctuation
        (code >= 0xFF00 && code <= 0xFFEF)) {  // Fullwidth Forms
      chars.add(ch);
    }
  }
  return chars;
}

// Main
const allFiles = walk(SRC_DIR);
let allText = '';
allFiles.forEach(f => { allText += fs.readFileSync(f, 'utf8'); });

const cjkChars = extractCJK(allText);
const sorted = [...cjkChars].sort();
const unicodes = sorted.map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(',');

console.log(`Found ${sorted.length} unique CJK characters`);
console.log(`Characters: ${sorted.join('')}`);

// Check full fonts exist — skip subsetting if missing (CI/Vercel uses pre-committed woff2)
let hasFull = true;
for (const w of WEIGHTS) {
  const fullPath = path.join(FULL_DIR, w.file);
  if (!fs.existsSync(fullPath)) {
    hasFull = false;
    break;
  }
}

if (!hasFull) {
  // Verify subset woff2 files already exist
  const missing = WEIGHTS.filter(w => !fs.existsSync(path.join(FONTS_DIR, w.output)));
  if (missing.length > 0) {
    console.error('\nFull TTF files not found and subset woff2 missing!');
    console.error('Download Noto Serif TC from Google Fonts and place TTF files in src/fonts/full/');
    process.exit(1);
  }
  console.log('\nFull TTF files not found — using existing subset woff2 (OK for CI/Vercel).');
  process.exit(0);
}

// Run pyftsubset for each weight
for (const w of WEIGHTS) {
  const input = path.join(FULL_DIR, w.file);
  const output = path.join(FONTS_DIR, w.output);
  console.log(`\nSubsetting ${w.name}...`);
  execSync(`pyftsubset "${input}" --unicodes="${unicodes}" --flavor=woff2 --output-file="${output}"`, { stdio: 'inherit' });
  const size = fs.statSync(output).size;
  console.log(`  -> ${output} (${(size / 1024).toFixed(1)} KB)`);
}

console.log('\nDone! Font subsets updated.');
