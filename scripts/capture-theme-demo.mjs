import { chromium } from 'playwright';
import { mkdir, readdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';
const outDir = process.env.ARTIFACT_DIR ?? '/opt/cursor/artifacts';

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();
await page.goto(baseUrl, { waitUntil: 'networkidle' });

await page.getByRole('radiogroup', { name: 'Color theme' }).waitFor();

await page.screenshot({
  path: path.join(outDir, 'lookbook-theme-system.png'),
  fullPage: false,
});

await page.getByRole('radio', { name: 'Light' }).click();
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, 'lookbook-theme-light.png'),
  fullPage: false,
});

await page.getByRole('radio', { name: 'Dark' }).click();
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(outDir, 'lookbook-theme-dark.png'),
  fullPage: false,
});

await page.getByRole('radio', { name: 'System' }).click();
await page.waitForTimeout(300);
await page.getByRole('radio', { name: 'Dark' }).click();
await page.waitForTimeout(400);
await page.getByRole('radio', { name: 'Light' }).click();
await page.waitForTimeout(400);

await context.close();
await browser.close();

const files = await readdir(outDir);
const webms = files.filter((f) => f.endsWith('.webm'));
if (webms.length > 0) {
  let best = null;
  for (const name of webms) {
    const s = await stat(path.join(outDir, name));
    if (!best || s.mtimeMs > best.m) best = { name, m: s.mtimeMs };
  }
  if (best) {
    await rename(
      path.join(outDir, best.name),
      path.join(outDir, 'lookbook-theme-toggle-demo.webm')
    );
  }
}
