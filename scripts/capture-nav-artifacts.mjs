import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = process.env.ARTIFACTS_DIR || path.join(root, 'artifacts', 'lb4-nav');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    recordVideo: { dir: outDir },
  });
  const page = await context.newPage();

  await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.app-sidebar', { timeout: 15000 });

  await page.screenshot({ path: path.join(outDir, 'desktop-nav-expanded.png') });

  await page.locator('.sidebar-collapse-btn').click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, 'desktop-nav-collapsed.png') });

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.app-sidebar.is-collapsed', { timeout: 15000 });
  await page.screenshot({
    path: path.join(outDir, 'desktop-nav-collapsed-after-reload.png'),
  });

  await context.close();
  await browser.close();

  console.log('Artifacts written to', outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
