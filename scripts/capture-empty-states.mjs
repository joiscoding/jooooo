/**
 * Captures screenshots and a short screen recording of LB-5 empty states.
 * Requires: `npm run build && npm run preview -- --host 127.0.0.1 --port 4173`
 * Run: `node scripts/capture-empty-states.mjs`
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const baseURL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';
const outDir = process.env.ARTIFACTS_DIR ?? '/opt/cursor/artifacts';

const looks = JSON.parse(
  readFileSync(join(root, 'src/data/looks.json'), 'utf8'),
);
const streetwearOnly = looks.filter((l) => l.tag === 'streetwear');

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttp(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await delay(250);
  }
  throw new Error(`Server not reachable: ${url}`);
}

async function main() {
  await waitForHttp(baseURL);

  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: outDir,
      size: { width: 1280, height: 800 },
    },
  });

  await context.addInitScript((payload) => {
    sessionStorage.setItem('lookbook_mcp_looks_v13', JSON.stringify(payload));
  }, streetwearOnly);

  const page = await context.newPage();

  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /minimal/i }).click();
  await delay(500);
  await page.screenshot({
    path: join(outDir, 'lb5-gallery-filter-empty.png'),
    fullPage: true,
  });
  await delay(600);

  await page.evaluate(() => {
    sessionStorage.removeItem('lookbook_mcp_looks_v13');
    localStorage.removeItem('lookbook_albums_v1');
  });
  await page.goto(`${baseURL}/albums`, { waitUntil: 'networkidle' });
  await delay(400);
  await page.screenshot({
    path: join(outDir, 'lb5-albums-empty.png'),
    fullPage: true,
  });
  await delay(600);

  await page.evaluate(() => {
    localStorage.setItem(
      'lookbook_albums_v1',
      JSON.stringify([
        {
          id: 'album-empty-demo',
          name: 'Spring picks',
          lookIds: [],
        },
      ]),
    );
  });
  await page.goto(`${baseURL}/albums/album-empty-demo`, {
    waitUntil: 'networkidle',
  });
  await delay(400);
  await page.screenshot({
    path: join(outDir, 'lb5-album-detail-empty.png'),
    fullPage: true,
  });
  await delay(800);

  await context.close();
  await browser.close();

  console.log('Wrote PNGs and WebM video to', outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
