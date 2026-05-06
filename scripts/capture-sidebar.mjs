/**
 * Captures desktop sidebar screenshots + short video for LB-4.
 * Run: npm run preview -- --port 4173 &  then  node scripts/capture-sidebar.mjs
 */
import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../artifacts/lookbook-sidebar');
const baseURL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();

await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);

await page.screenshot({
  path: join(outDir, 'sidebar-expanded.png'),
  fullPage: false,
});

const collapse = page.getByRole('button', { name: 'Collapse navigation' });
await collapse.click();
await page.waitForTimeout(400);
await page.screenshot({
  path: join(outDir, 'sidebar-collapsed.png'),
  fullPage: false,
});

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({
  path: join(outDir, 'sidebar-collapsed-after-reload.png'),
  fullPage: false,
});

await context.close();
await browser.close();

console.log('Wrote screenshots and video to', outDir);
