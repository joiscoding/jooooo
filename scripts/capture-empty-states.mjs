/**
 * Builds the app, serves dist briefly, and captures PNGs of list empty states.
 * Usage: npm run capture:empty-states
 */
import { spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const localArtifacts = path.join(root, 'artifacts');
const cursorArtifacts =
  process.env.CURSOR_ARTIFACTS_DIR || '/opt/cursor/artifacts/assets';

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      ...opts,
    });
    p.on('error', reject);
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

async function waitForPreview(url, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Preview not reachable: ${url}`);
}

mkdirSync(localArtifacts, { recursive: true });
if (existsSync(cursorArtifacts)) {
  mkdirSync(cursorArtifacts, { recursive: true });
}

const looksPath = path.join(root, 'src/data/looks.json');
const looks = JSON.parse(readFileSync(looksPath, 'utf8'));
const onlyStreetwear = looks.filter((l) => l.tag === 'streetwear');

await run('npm', ['run', 'build']);

const preview = spawn(
  'npm',
  ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'],
  {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  },
);

const base = 'http://127.0.0.1:4173';

try {
  await waitForPreview(`${base}/`);

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860 });

  async function shot(name) {
    const dest = path.join(localArtifacts, name);
    await page.screenshot({ path: dest, type: 'png' });
    if (existsSync(cursorArtifacts)) {
      copyFileSync(dest, path.join(cursorArtifacts, name));
    }
    return dest;
  }

  await page.goto(`${base}/albums`, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => localStorage.removeItem('lookbook_albums_v1'));
  await page.reload({ waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 300));
  await shot('lb5-empty-albums.png');

  await page.evaluate((payload) => {
    localStorage.setItem('lookbook_albums_v1', payload);
  }, JSON.stringify([{ id: 'lb-demo-empty', name: 'Weekend edit', lookIds: [] }]));
  await page.goto(`${base}/albums/lb-demo-empty`, {
    waitUntil: 'load',
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 300));
  await shot('lb5-empty-album-detail.png');

  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate((payload) => {
    sessionStorage.setItem('lookbook_mcp_looks_v13', payload);
  }, JSON.stringify(onlyStreetwear));
  await page.reload({ waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('.filters-bar');
  await page.click('button.filter-pill:nth-of-type(4)');
  await page.waitForSelector('.list-empty-state', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 300));
  await shot('lb5-empty-gallery-filter.png');

  await page.evaluate((payload) => {
    sessionStorage.setItem('lookbook_mcp_looks_v13', payload);
  }, JSON.stringify([]));
  await page.reload({ waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('.list-empty-state', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 300));
  await shot('lb5-empty-catalog-edge.png');

  await browser.close();
} finally {
  try {
    preview.kill('SIGTERM');
  } catch {
    /* ignore */
  }
  await new Promise((r) => setTimeout(r, 800));
}

const { execFileSync } = await import('node:child_process');
const slideshow = path.join(localArtifacts, 'lb5-empty-states-tour.mp4');
try {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loop',
      '1',
      '-t',
      '3',
      '-i',
      path.join(localArtifacts, 'lb5-empty-albums.png'),
      '-loop',
      '1',
      '-t',
      '3',
      '-i',
      path.join(localArtifacts, 'lb5-empty-album-detail.png'),
      '-loop',
      '1',
      '-t',
      '3',
      '-i',
      path.join(localArtifacts, 'lb5-empty-gallery-filter.png'),
      '-loop',
      '1',
      '-t',
      '3',
      '-i',
      path.join(localArtifacts, 'lb5-empty-catalog-edge.png'),
      '-filter_complex',
      '[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0,format=yuv420p[v]',
      '-map',
      '[v]',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      slideshow,
    ],
    { stdio: 'inherit' },
  );
  if (existsSync(cursorArtifacts)) {
    copyFileSync(
      slideshow,
      path.join(cursorArtifacts, 'lb5-empty-states-tour.mp4'),
    );
  }
} catch (e) {
  console.warn('ffmpeg slideshow skipped:', e);
}

console.log('Wrote screenshots to', localArtifacts);
