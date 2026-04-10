/**
 * Captures screenshots of list empty states for LB-5 (requires `npm run build` first).
 * Run: node scripts/capture-empty-states.mjs
 */
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const LOOKS_STORAGE_KEY = 'lookbook_mcp_looks_v13';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = process.env.CAPTURE_OUT || '/opt/cursor/artifacts/lb5-empty-states';
const chromePath =
  process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const port = 4173;
const base = `http://127.0.0.1:${port}`;

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(base);
      if (r.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Preview server did not respond at ${base}`);
}

function looksWithoutTag(tag) {
  const raw = readFileSync(
    path.join(root, 'src', 'data', 'looks.json'),
    'utf8'
  );
  const all = JSON.parse(raw);
  return all.filter((l) => l.tag !== tag);
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const viteBin = path.join(root, 'node_modules', '.bin', 'vite');
  const preview = spawn(
    viteBin,
    ['preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    }
  );
  preview.stderr?.on('data', (d) => process.stderr.write(d));
  preview.stdout?.on('data', (d) => process.stdout.write(d));

  try {
    await waitForServer();

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1280,900',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const noMinimal = looksWithoutTag('minimal');
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(
      (key, json) => sessionStorage.setItem(key, json),
      LOOKS_STORAGE_KEY,
      JSON.stringify(noMinimal)
    );
    await page.goto(`${base}/`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => {
      const pills = [...document.querySelectorAll('button.filter-pill')];
      const b = pills.find((p) =>
        (p.textContent ?? '').includes('Minimal')
      );
      b?.click();
    });
    await page.waitForSelector('.list-empty-state', { timeout: 10000 });
    await page.screenshot({
      path: path.join(outDir, 'gallery-filtered-empty.png'),
      type: 'png',
    });

    await page.goto(`${base}/albums`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('lookbook_albums_v1', '[]');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('.list-empty-state', { timeout: 10000 });
    await page.screenshot({
      path: path.join(outDir, 'albums-list-empty.png'),
      type: 'png',
    });

    await page.evaluate(() => {
      localStorage.setItem(
        'lookbook_albums_v1',
        JSON.stringify([
          { id: 'demo-empty-album', name: 'Spring picks', lookIds: [] },
        ])
      );
    });
    await page.goto(`${base}/albums/demo-empty-album`, {
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector('.list-empty-state', { timeout: 10000 });
    await page.screenshot({
      path: path.join(outDir, 'album-detail-empty.png'),
      type: 'png',
    });

    await browser.close();
    console.log('Wrote screenshots to', outDir);
  } finally {
    preview.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
