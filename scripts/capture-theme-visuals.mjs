/**
 * Captures theme screenshots for LB-1 demos.
 * Requires preview server: `npm run preview -- --host 127.0.0.1 --port 4173`
 */
import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import puppeteer from 'puppeteer-core';

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';
const outDir = process.env.ARTIFACTS_DIR ?? path.join(process.cwd(), 'artifacts');

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ??
  '/usr/local/bin/google-chrome';

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60_000 });
    await page.waitForSelector('.theme-toggle', { timeout: 10_000 });

    await page.screenshot({
      path: path.join(outDir, 'lookbook-theme-system.png'),
    });

    await page.evaluate(() => localStorage.setItem('lookbook-theme', 'light'));
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('.theme-toggle .theme-toggle-btn.active');
    await page.screenshot({
      path: path.join(outDir, 'lookbook-theme-light.png'),
    });

    await page.evaluate(() => localStorage.setItem('lookbook-theme', 'dark'));
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('.theme-toggle .theme-toggle-btn.active');
    await page.screenshot({
      path: path.join(outDir, 'lookbook-theme-dark.png'),
    });

    await page.evaluate(() => localStorage.removeItem('lookbook-theme'));
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('.theme-toggle');
    await page.click('.theme-toggle button:nth-of-type(2)');
    await delay(300);
    await page.click('.theme-toggle button:nth-of-type(3)');
    await delay(300);
    await page.screenshot({
      path: path.join(outDir, 'lookbook-theme-toggle-sequence.png'),
    });

    const concatPath = path.join(outDir, 'theme-demo.ffconcat');
    const concatBody = `ffconcat version 1.0
file lookbook-theme-light.png
duration 2.5
file lookbook-theme-dark.png
duration 2.5
file lookbook-theme-dark.png
`;

    await import('node:fs/promises').then((fs) =>
      fs.writeFile(concatPath, concatBody, 'utf8')
    );

    try {
      execFileSync(
        'ffmpeg',
        [
          '-y',
          '-f',
          'concat',
          '-safe',
          '0',
          '-i',
          'theme-demo.ffconcat',
          '-vf',
          'format=yuv420p',
          '-c:v',
          'libvpx-vp9',
          '-an',
          'lookbook-theme-overview.webm',
        ],
        { stdio: 'inherit', cwd: outDir }
      );
    } catch {
      /* optional: ffmpeg missing or codec issue */
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
