/**
 * Captures screenshots and a short screen recording of list empty states (LB-5).
 * Run after build: `npm run build && node scripts/capture-empty-states.mjs`
 */
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distIndex = join(root, 'dist', 'index.html');
if (!existsSync(distIndex)) {
  console.error('Run `npm run build` first so dist/ exists.');
  process.exit(1);
}

const outDir = join(root, 'artifacts', 'empty-states');
mkdirSync(outDir, { recursive: true });

const seedLooks = JSON.parse(
  readFileSync(join(root, 'src/data/looks.json'), 'utf8'),
);

const looksNoWorkwear = seedLooks.map((l) => ({ ...l, tag: 'minimal' }));

function waitForOk(url, attempts = 80) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tick = async () => {
      n += 1;
      try {
        const r = await fetch(url);
        if (r.ok) return resolve(undefined);
      } catch {
        /* retry */
      }
      if (n >= attempts) return reject(new Error(`Server not ready: ${url}`));
      setTimeout(tick, 200);
    };
    tick();
  });
}

const preview = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});

await waitForOk('http://127.0.0.1:4173/');

const browser = await chromium.launch();
const videoDir = join(outDir, 'video-temp');
mkdirSync(videoDir, { recursive: true });

const context = await browser.newContext({
  viewport: { width: 1200, height: 800 },
  recordVideo: { dir: videoDir, size: { width: 1200, height: 800 } },
});
const page = await context.newPage();

async function shot(name) {
  await page.screenshot({ path: join(outDir, name), fullPage: true });
}

const base = 'http://127.0.0.1:4173';

// 1) Albums empty
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  localStorage.removeItem('lookbook_albums_v1');
  sessionStorage.removeItem('lookbook_mcp_looks_v13');
});
await page.goto(`${base}/albums`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'No albums yet' }).waitFor({ state: 'visible' });
await shot('albums-empty.png');

// 2) Gallery — no catalog data
await page.evaluate(() => {
  sessionStorage.setItem('lookbook_mcp_looks_v13', '[]');
});
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'No looks to show yet' }).waitFor({ state: 'visible' });
await shot('gallery-no-data.png');

// 3) Gallery — filter empty
await page.evaluate((looks) => {
  sessionStorage.setItem('lookbook_mcp_looks_v13', JSON.stringify(looks));
}, looksNoWorkwear);
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Workwear / heritage' }).click();
await page.getByRole('heading', { name: 'No looks match this filter' }).waitFor({
  state: 'visible',
});
await shot('gallery-filter-empty.png');

// 4) Album detail — empty album
await page.evaluate(() => {
  localStorage.setItem(
    'lookbook_albums_v1',
    JSON.stringify([
      { id: 'album-empty-demo', name: 'Demo empty album', lookIds: [] },
    ]),
  );
  sessionStorage.removeItem('lookbook_mcp_looks_v13');
});
await page.goto(`${base}/albums/album-empty-demo`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'This album is empty' }).waitFor({
  state: 'visible',
});
await shot('album-detail-empty.png');

await context.close();
await browser.close();

preview.kill('SIGTERM');
await new Promise((r) => {
  preview.on('close', r);
  setTimeout(r, 2000);
});

console.log('Screenshots:', outDir);
console.log('Screen recording (webm) may be in:', videoDir);
