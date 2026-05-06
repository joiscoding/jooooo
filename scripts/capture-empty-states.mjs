import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { mkdir, rm, cp } from 'node:fs/promises';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'artifacts', 'lb5');
const publishDir = '/opt/cursor/artifacts/empty-states-lb5';

function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address();
      if (addr && typeof addr === 'object') {
        const p = addr.port;
        s.close(() => resolve(p));
      } else {
        s.close();
        reject(new Error('no port'));
      }
    });
    s.on('error', reject);
  });
}

const minimalLook = {
  id: 'capture-minimal-only',
  title: 'Capture Minimal',
  tag: 'minimal',
  season: 'Demo',
  occasion: 'Demo',
  keyItems: ['Item'],
  hero: '/looks/minimal-quiet-01-v2.jpg',
  gallery: [],
};

function waitForPort(baseUrl, ms = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      fetch(baseUrl)
        .then((r) => {
          if (r.ok || r.status === 404) resolve();
          else if (Date.now() - start > ms) reject(new Error('preview timeout'));
          else setTimeout(tick, 200);
        })
        .catch(() => {
          if (Date.now() - start > ms) reject(new Error('preview timeout'));
          else setTimeout(tick, 200);
        });
    };
    tick();
  });
}

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: true,
  });
}

async function main() {
  const PORT = await getFreePort();
  const base = `http://127.0.0.1:${PORT}`;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const build = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: false });
  if (build.status !== 0) {
    throw new Error('build failed');
  }

  const preview = spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    {
      cwd: root,
      stdio: 'inherit',
      shell: false,
    },
  );

  try {
    await waitForPort(base);

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome-stable',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Gallery: filtered empty (one minimal look; filter to Streetwear)
    await page.evaluateOnNewDocument((json) => {
      sessionStorage.setItem('lookbook_mcp_looks_v13', json);
    }, JSON.stringify([minimalLook]));
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.filter-pill', { timeout: 20000 });
    await page.evaluate(() => {
      const pills = [...document.querySelectorAll('button.filter-pill')];
      const street = pills.find((b) => b.textContent?.includes('Streetwear'));
      street?.click();
    });
    await page.waitForSelector('.list-empty-state', { timeout: 20000 });
    await screenshot(page, 'gallery-filtered-empty');

    // Gallery: zero looks (empty override)
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 1280, height: 900 });
    await page2.evaluateOnNewDocument(() => {
      sessionStorage.setItem('lookbook_mcp_looks_v13', '[]');
    });
    await page2.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page2.waitForSelector('.list-empty-state', { timeout: 20000 });
    await screenshot(page2, 'gallery-no-data');

    // Albums list empty
    const page3 = await browser.newPage();
    await page3.setViewport({ width: 1280, height: 900 });
    await page3.evaluateOnNewDocument(() => {
      localStorage.removeItem('lookbook_albums_v1');
    });
    await page3.goto(`${base}/albums`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page3.waitForSelector('.list-empty-state', { timeout: 20000 });
    await screenshot(page3, 'albums-list-empty');

    // Album detail empty
    const page4 = await browser.newPage();
    await page4.setViewport({ width: 1280, height: 900 });
    const albumPayload = JSON.stringify([
      {
        id: 'album-empty-demo',
        name: 'Empty capsule',
        lookIds: [],
      },
    ]);
    await page4.evaluateOnNewDocument((data) => {
      localStorage.setItem('lookbook_albums_v1', data);
    }, albumPayload);
    await page4.goto(`${base}/albums/album-empty-demo`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page4.waitForSelector('.list-empty-state', { timeout: 20000 });
    await screenshot(page4, 'album-detail-empty');

    await browser.close();

    const ffmpeg = '/usr/bin/ffmpeg';
    const names = [
      'gallery-filtered-empty',
      'gallery-no-data',
      'albums-list-empty',
      'album-detail-empty',
    ];
    const args = ['-y'];
    for (const n of names) {
      args.push('-loop', '1', '-t', '2.5', '-i', path.join(outDir, `${n}.png`));
    }
    const filter = names.map((_, i) => `[${i}:v]`).join('') + `concat=n=${names.length}:v=1:a=0[outv]`;
    args.push('-filter_complex', filter, '-map', '[outv]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', path.join(outDir, 'empty-states-tour.mp4'));
    execFileSync(ffmpeg, args);

    await rm(publishDir, { recursive: true, force: true });
    await mkdir(publishDir, { recursive: true });
    for (const n of names) {
      await cp(path.join(outDir, `${n}.png`), path.join(publishDir, `${n}.png`));
    }
    await cp(path.join(outDir, 'empty-states-tour.mp4'), path.join(publishDir, 'empty-states-tour.mp4'));
  } finally {
    preview.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
    try {
      preview.kill('SIGKILL');
    } catch {
      /* ignore */
    }
    spawnSync('sh', ['-c', `command -v fuser >/dev/null && fuser -k ${PORT}/tcp 2>/dev/null || true`], {
      stdio: 'ignore',
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
