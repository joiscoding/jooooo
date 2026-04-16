/**
 * Captures screenshots of ListEmptyState variants for PR / Slack artifacts.
 * Run with: node scripts/capture-empty-states.mjs
 * Requires: npm run preview (or dev) on 127.0.0.1:4173
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = process.env.ARTIFACTS_DIR || path.join(root, 'artifacts');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const chrome =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/local/bin/google-chrome';

const minimalLook = {
  id: 'demo-minimal-only',
  title: 'Demo Minimal',
  tag: 'minimal',
  season: 'Demo',
  occasion: 'Demo',
  keyItems: ['Item'],
  hero: '/looks/streetwear-urban-01-v2.jpg',
  gallery: [],
};

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

  async function seedStorage(fn, ...args) {
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(fn, ...args);
  }

  // 1) Albums list — no albums
  await seedStorage(() => {
    localStorage.removeItem('lookbook_albums_v1');
    sessionStorage.removeItem('lookbook_mcp_looks_v13');
  });
  await page.goto(`${base}/albums`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('.list-empty-state');
  await page.screenshot({ path: path.join(outDir, 'lb5-empty-albums.png') });

  // 2) Gallery — zero looks (edge session)
  await seedStorage(() => {
    sessionStorage.setItem('lookbook_mcp_looks_v13', '[]');
  });
  await page.goto(`${base}/`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('.list-empty-state');
  await page.screenshot({ path: path.join(outDir, 'lb5-empty-gallery.png') });

  // 3) Album detail — empty album
  await seedStorage(() => {
    localStorage.setItem(
      'lookbook_albums_v1',
      JSON.stringify([
        { id: 'album-empty-demo', name: 'Empty demo album', lookIds: [] },
      ]),
    );
    sessionStorage.removeItem('lookbook_mcp_looks_v13');
  });
  await page.goto(`${base}/albums/album-empty-demo`, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });
  await page.waitForSelector('.list-empty-state');
  await page.screenshot({ path: path.join(outDir, 'lb5-empty-album-detail.png') });

  // 4) Filter yields no results
  await seedStorage((look) => {
    localStorage.removeItem('lookbook_albums_v1');
    sessionStorage.setItem('lookbook_mcp_looks_v13', JSON.stringify([look]));
  }, minimalLook);
  await page.goto(`${base}/`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => {
    const pills = [...document.querySelectorAll('.filter-pill')];
    const street = pills.find((el) =>
      el.textContent?.includes('Streetwear'),
    );
    street?.click();
  });
  await page.waitForFunction(() => {
    const h = document.querySelector('.list-empty-state-title');
    return h?.textContent?.includes('No looks match');
  });
  await page.screenshot({ path: path.join(outDir, 'lb5-empty-filter.png') });

  await browser.close();
  console.log('Wrote screenshots to', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
