/**
 * Capture UI screenshots for LB-3 (requires `vite preview` on BASE_URL).
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = `${__dirname}/..`;
const base = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = process.env.ARTIFACT_DIR ?? `${root}/artifacts/lb3-copy-link`;

const chrome =
  process.env.CHROME_PATH ?? '/usr/local/bin/google-chrome';

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(base, { waitUntil: 'networkidle0', timeout: 60_000 });
    await page.screenshot({
      path: `${outDir}/lb3-gallery-copy-buttons.png`,
      type: 'png',
    });

    await page.click('summary.header-menu-trigger');
    await page.waitForSelector('.header-menu-panel', { visible: true });
    await page.screenshot({
      path: `${outDir}/lb3-header-menu-open.png`,
      type: 'png',
    });

    const client = await page.createCDPSession();
    await client.send('Browser.grantPermissions', {
      origin: new URL(base).origin,
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    });

    await page.click('button.card-copy-btn');
    await page.waitForSelector('.site-toast', { visible: true, timeout: 5000 });
    await page.screenshot({
      path: `${outDir}/lb3-toast-after-copy.png`,
      type: 'png',
    });
  } finally {
    await browser.close();
  }

  console.log(`Screenshots written to ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
