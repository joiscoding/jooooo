/**
 * Captures screenshots of list empty states for LB-5 / release notes.
 * Usage: npm run capture:empty-states
 * (builds, previews on 4173, captures PNGs + a short MP4 under artifacts/)
 */
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const artifacts = join(root, 'artifacts');
const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';

const chromePaths = [
  process.env.CHROME_PATH,
  '/usr/local/bin/google-chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

function findChrome() {
  const p = chromePaths[0];
  if (!p) throw new Error('Set CHROME_PATH to a Chrome/Chromium binary.');
  return p;
}

async function waitForServer(url, attempts = 120) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok || res.status === 404) return;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`Server not reachable: ${url}`);
}

function startPreview() {
  return spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    },
  );
}

async function main() {
  let previewProc = null;
  const ownPreview = process.env.PREVIEW_URL === undefined;
  if (ownPreview) {
    try {
      execFileSync('fuser', ['-k', '4173/tcp'], { stdio: 'ignore' });
    } catch {
      /* port free or fuser unavailable */
    }
    previewProc = startPreview();
    previewProc.stderr?.on('data', (d) => process.stderr.write(d));
    previewProc.stdout?.on('data', (d) => process.stdout.write(d));
    await waitForServer(baseUrl);
  } else {
    await waitForServer(baseUrl);
  }

  await mkdir(artifacts, { recursive: true });

  const executablePath = findChrome();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(`${baseUrl}/albums`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.removeItem('lookbook_albums_v1');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.screenshot({ path: join(artifacts, 'empty-albums-list.png'), type: 'png' });

    const emptyAlbum = [
      {
        id: 'empty-demo-album',
        name: 'Weekend picks',
        lookIds: [],
      },
    ];
    await page.evaluate((json) => {
      localStorage.setItem('lookbook_albums_v1', json);
    }, JSON.stringify(emptyAlbum));
    await page.goto(`${baseUrl}/albums/empty-demo-album`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: join(artifacts, 'empty-album-detail.png'), type: 'png' });

    const oneStreetwear = [
      {
        id: 'solo-street',
        title: 'Solo Street',
        tag: 'streetwear',
        season: 'All season',
        occasion: 'City',
        keyItems: ['Jacket'],
        hero: '/looks/streetwear-urban-01-v2.jpg',
        gallery: [],
      },
    ];
    await page.evaluate((json) => {
      sessionStorage.setItem('lookbook_mcp_looks_v13', json);
    }, JSON.stringify(oneStreetwear));
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });
    const minimalClicked = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button.filter-pill')];
      const btn = buttons.find((b) => b.textContent?.includes('Minimal'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (!minimalClicked) throw new Error('Minimal filter button not found');
    await page.waitForSelector('.list-empty-state', { timeout: 10000 });
    await page.screenshot({ path: join(artifacts, 'empty-gallery-filter.png'), type: 'png' });

    const p1 = join(artifacts, 'empty-albums-list.png');
    const p2 = join(artifacts, 'empty-album-detail.png');
    const p3 = join(artifacts, 'empty-gallery-filter.png');
    const outMp4 = join(artifacts, 'empty-states-tour.mp4');
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-loop',
        '1',
        '-t',
        '2',
        '-i',
        p1,
        '-loop',
        '1',
        '-t',
        '2',
        '-i',
        p2,
        '-loop',
        '1',
        '-t',
        '2',
        '-i',
        p3,
        '-filter_complex',
        '[0:v][1:v][2:v]concat=n=3:v=1:a=0[out]',
        '-map',
        '[out]',
        '-pix_fmt',
        'yuv420p',
        outMp4,
      ],
      { stdio: 'inherit' },
    );
  } finally {
    await browser.close();
    if (previewProc && !previewProc.killed) {
      try {
        previewProc.kill('SIGTERM');
      } catch {
        /* ignore */
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log('Wrote artifacts to', artifacts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
