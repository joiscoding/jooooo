/**
 * Captures theme toggle screenshots for LB-1 artifacts.
 * Run with: npm run preview (port 4173) && xvfb-run -a node scripts/capture-theme-artifacts.mjs
 */
import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = '/opt/cursor/artifacts/assets';

const CHROME =
  process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });

    await page.evaluate(() => {
      localStorage.setItem('lookbook-theme', 'light');
      location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    await page.screenshot({
      path: join(OUT_DIR, 'lb1-theme-light.png'),
      type: 'png',
    });

    await page.evaluate(() => {
      localStorage.setItem('lookbook-theme', 'dark');
      location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    await page.screenshot({
      path: join(OUT_DIR, 'lb1-theme-dark.png'),
      type: 'png',
    });

    const light = join(OUT_DIR, 'lb1-theme-light.png');
    const dark = join(OUT_DIR, 'lb1-theme-dark.png');
    const webm = join(OUT_DIR, 'lb1-theme-toggle-demo.webm');

    execFileSync('ffmpeg', [
      '-y',
      '-loop',
      '1',
      '-t',
      '2',
      '-i',
      light,
      '-loop',
      '1',
      '-t',
      '2',
      '-i',
      dark,
      '-filter_complex',
      '[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v0];[1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v1];[v0][v1]xfade=transition=fade:duration=0.6:offset=1.4[v]',
      '-map',
      '[v]',
      '-c:v',
      'libvpx-vp9',
      '-pix_fmt',
      'yuv420p',
      '-an',
      webm,
    ]);

    await writeFile(
      join(OUT_DIR, 'lb1-artifacts-readme.txt'),
      [
        'LB-1 theme toggle artifacts',
        '',
        '- lb1-theme-light.png — header with theme control (Light)',
        '- lb1-theme-dark.png — same view in Dark',
        '- lb1-theme-toggle-demo.webm — short crossfade between light and dark',
        '',
      ].join('\n'),
      'utf8'
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
