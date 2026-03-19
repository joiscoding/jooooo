import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs', 'quince-ui-capture');
const baseURL = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60_000 });
await page.locator('.home-title').waitFor({ state: 'visible' });
await page.waitForTimeout(600);
await page.screenshot({
  path: path.join(outDir, 'screenshot-home-gallery.png'),
  fullPage: true,
});

await page.locator('a.wall-card').first().click();
await page.waitForURL(/\/look\//, { timeout: 15_000 });
await page.locator('.look-detail-title').waitFor({ state: 'visible' });
await page.waitForTimeout(500);
await page.screenshot({
  path: path.join(outDir, 'screenshot-look-detail.png'),
  fullPage: true,
});

await page.goto(`${baseURL}/albums`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, 'screenshot-albums.png'),
  fullPage: true,
});

const video = page.video();
await page.close();
if (video) {
  await video.saveAs(path.join(outDir, 'screen-recording-walkthrough.webm'));
}
await context.close();
await browser.close();
