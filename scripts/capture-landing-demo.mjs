import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir =
  process.env.DEMO_OUT_DIR ?? '/opt/cursor/artifacts/assets/fasco-landing-demo';

const baseURL = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:5173';

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  await page.goto(`${baseURL}/`, { waitUntil: 'load', timeout: 60_000 });
  await page.locator('.fasco-hero').waitFor({ state: 'visible', timeout: 30_000 });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: join(outDir, '01-landing-hero.png'),
    fullPage: false,
  });

  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight * 0.45, behavior: 'instant' }),
  );
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(outDir, '02-landing-mid.png'),
    fullPage: false,
  });

  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(outDir, '03-landing-footer.png'),
    fullPage: false,
  });

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.click('a[href="/lookbook"]');
  await page.waitForURL('**/lookbook**', { timeout: 30_000 });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: join(outDir, '04-lookbook.png'),
    fullPage: false,
  });

  await context.close();
  await browser.close();

  const files = await readdir(outDir);
  const webm = files.find((f) => f.endsWith('.webm'));
  if (webm && webm !== 'landing-demo.webm') {
    await rename(join(outDir, webm), join(outDir, 'landing-demo.webm'));
  }

  console.log(`Demo assets written to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
