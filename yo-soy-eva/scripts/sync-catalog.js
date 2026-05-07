#!/usr/bin/env node
/**
 * sync-catalog.js
 *
 * Scans the ./catalog/ folder and updates data/products.json.
 * - New images → new product entry (name from filename, price empty)
 * - Existing entries → never overwritten (safe to re-run)
 * - Removed images → entry kept but flagged "stock: 0" (unless --clean flag)
 *
 * Usage:
 *   node scripts/sync-catalog.js           # sync new images
 *   node scripts/sync-catalog.js --clean   # also remove entries with no image
 *   node scripts/sync-catalog.js --dry-run # preview changes, no write
 *
 * Image naming convention (all optional):
 *   product-name.jpg                  → name: "Product Name"
 *   product-name_29999.jpg            → name: "Product Name", price: 29999
 *   product-name_29999_Category.jpg   → + category: "Category"
 */

const fs   = require('fs');
const path = require('path');

const CATALOG_DIR   = path.join(__dirname, '..', 'catalog');
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');
const IMAGE_EXTS    = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const isClean       = process.argv.includes('--clean');
const isDryRun      = process.argv.includes('--dry-run');

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function toTitle(str) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
}

function parseFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  const parts = base.split('_');
  const name     = toTitle(parts[0]);
  const price    = parts[1] ? parseFloat(parts[1]) || null : null;
  const category = parts[2] ? toTitle(parts[2]) : null;
  return { name, price, category };
}

function slugId(filename) {
  return path.basename(filename, path.extname(filename))
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ── Load existing products ───────────────────────────────────────────────── */
let existing = [];
if (fs.existsSync(PRODUCTS_FILE)) {
  existing = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
}
const existingById  = new Map(existing.map(p => [p.id, p]));
const existingByImg = new Map(existing.map(p => [(p.images?.[0] || ''), p]));

/* ── Scan catalog/ ────────────────────────────────────────────────────────── */
const imageFiles = fs.existsSync(CATALOG_DIR)
  ? fs.readdirSync(CATALOG_DIR).filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
  : [];

const imagePaths = new Set(imageFiles.map(f => `catalog/${f}`));

let added   = 0;
let updated = 0;
let removed = 0;

/* ── Build updated product list ───────────────────────────────────────────── */
const result = [];

// Keep existing entries, flag missing images
for (const p of existing) {
  const img = p.images?.[0] || '';
  if (img && !imagePaths.has(img)) {
    if (isClean) {
      removed++;
      continue; // drop entry
    } else {
      // Flag as out of stock but keep
      result.push({ ...p, stock: 0 });
    }
  } else {
    result.push(p);
  }
}

// Add new images not yet in products.json
for (const f of imageFiles) {
  const imgPath = `catalog/${f}`;
  if (existingByImg.has(imgPath)) continue; // already tracked

  const { name, price, category } = parseFilename(f);
  let id = slugId(f);
  // Ensure unique id
  while (existingById.has(id) || result.some(p => p.id === id)) id += '-1';

  const entry = {
    id,
    name,
    price:       price ?? null,
    category:    category ?? "General",
    description: "",
    images:      [imgPath],
    stock:       null,   // null = unlimited
    featured:    false,
  };
  result.push(entry);
  added++;
}

/* ── Report ───────────────────────────────────────────────────────────────── */
console.log('\n📦 sync-catalog');
console.log(`  Images found : ${imageFiles.length}`);
console.log(`  Added        : ${added}`);
if (removed)  console.log(`  Removed      : ${removed}`);
if (isDryRun) {
  console.log('\n  [dry-run] No changes written.\n');
  console.log(JSON.stringify(result, null, 2));
} else {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(result, null, 2));
  console.log(`  ✓ data/products.json updated (${result.length} products)\n`);
  if (added) {
    console.log('  Fill in prices and descriptions in data/products.json\n');
  }
}
