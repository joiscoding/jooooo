/**
 * Starts preview, opens Chrome via Puppeteer, captures screenshots for empty states,
 * and stitches a short screen recording with ffmpeg.
 * Run: npm run build && npm run capture:artifacts
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = process.env.CURSOR_ARTIFACTS_DIR || '/opt/cursor/artifacts';
/** Must match `STORAGE_MCP_KEY` in src/data/fetchLooks.ts */
const MCP_LOOKS_KEY = 'lookbook_mcp_looks_v13';

function freePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, () => {
      const addr = s.address();
      const p = typeof addr === 'object' && addr ? addr.port : 0;
      s.close(() => resolve(p));
    });
    s.on('error', reject);
  });
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: root,
      ...opts,
    });
    p.on('error', reject);
    p.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const port = await freePort();
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    {
      cwd: root,
      stdio: 'pipe',
      detached: false,
    },
  );

  await new Promise((resolve, reject) => {
    const onData = (b) => {
      const s = String(b);
      if (s.includes('Local:') || s.includes('http://')) resolve();
    };
    preview.stdout?.on('data', onData);
    preview.stderr?.on('data', onData);
    preview.on('error', reject);
    preview.on('close', (c) => {
      if (c !== 0 && c !== null) reject(new Error(`preview exited ${c}`));
    });
    setTimeout(() => reject(new Error('preview start timeout')), 20000);
  });

  const base = `http://127.0.0.1:${port}`;
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/local/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const shots = [];

    // Albums empty
    await page.goto(`${base}/albums`, { waitUntil: 'load' });
    await page.evaluate(() => localStorage.removeItem('lookbook_albums_v1'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('.list-empty-state');
    const albumsPath = path.join(outDir, 'empty-albums-list.png');
    await page.screenshot({ path: albumsPath, type: 'png' });
    shots.push(albumsPath);

    // Gallery filtered empty: one minimal look in session → Workwear filter shows no matches
    const seedLooks = JSON.parse(
      fs.readFileSync(path.join(root, 'src/data/looks.json'), 'utf8'),
    );
    const oneClassic = seedLooks.find((l) => l.tag === 'classic');
    if (!oneClassic) throw new Error('Seed data needs at least one classic look');
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await page.evaluate(
      (key, looks) => sessionStorage.setItem(key, JSON.stringify(looks)),
      MCP_LOOKS_KEY,
      [oneClassic],
    );
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(
      () => document.querySelectorAll('button.filter-pill').length >= 2,
      { timeout: 15000 },
    );
    const clicked = await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('button.filter-pill'));
      const workwear = pills.find((b) =>
        (b.textContent || '').includes('Workwear'),
      );
      if (workwear) {
        workwear.click();
        return true;
      }
      return false;
    });
    if (!clicked) {
      const labels = await page.evaluate(() =>
        Array.from(document.querySelectorAll('button.filter-pill')).map((b) =>
          b.textContent?.trim(),
        ),
      );
      throw new Error(
        `Could not find Workwear filter pill. Pills: ${JSON.stringify(labels)}`,
      );
    }
    await page.waitForSelector('.list-empty-state');
    const filterPath = path.join(outDir, 'empty-gallery-filter.png');
    await page.screenshot({ path: filterPath, type: 'png' });
    shots.push(filterPath);

    // Album detail empty: create temp album via context - use evaluate to dispatch storage
    await page.goto(`${base}/albums`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const raw = localStorage.getItem('lookbook_albums_v1');
      const albums = raw ? JSON.parse(raw) : [];
      albums.push({
        id: 'artifact-empty-album',
        name: 'Empty demo album',
        lookIds: [],
      });
      localStorage.setItem('lookbook_albums_v1', JSON.stringify(albums));
    });
    await page.goto(`${base}/albums/artifact-empty-album`, {
      waitUntil: 'load',
    });
    await page.waitForSelector('.list-empty-state');
    const albumDetailPath = path.join(outDir, 'empty-album-detail.png');
    await page.screenshot({ path: albumDetailPath, type: 'png' });
    shots.push(albumDetailPath);

    const concatList = path.join(outDir, 'concat-list.txt');
    const lines = shots.flatMap((p) => [`file '${p}'`, 'duration 2']);
    lines.push(`file '${shots[shots.length - 1]}'`);
    fs.writeFileSync(concatList, `${lines.join('\n')}\n`);
    const videoOut = path.join(outDir, 'empty-states-demo.mp4');
    await run('ffmpeg', [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      concatList,
      '-vf',
      'fps=1/2,format=yuv420p',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      videoOut,
    ]);
    fs.unlinkSync(concatList);

    // Clean up demo album
    await page.goto(`${base}/albums`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const raw = localStorage.getItem('lookbook_albums_v1');
      if (!raw) return;
      const albums = JSON.parse(raw).filter((a) => a.id !== 'artifact-empty-album');
      localStorage.setItem('lookbook_albums_v1', JSON.stringify(albums));
    });

    console.log('Wrote:', shots.join(', '), videoOut);
  } finally {
    await browser.close();
    preview.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
