import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = process.env.ARTIFACTS_DIR || join(root, 'artifacts');

await mkdir(outDir, { recursive: true });

const port = 4173;
const base = `http://127.0.0.1:${port}`;

const preview = spawn(
  'npm',
  ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

function waitForHttp(url, ms = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      fetch(url)
        .then((r) => {
          if (r.ok) resolve();
          else if (Date.now() - start > ms) reject(new Error('timeout'));
          else setTimeout(tick, 200);
        })
        .catch(() => {
          if (Date.now() - start > ms) reject(new Error('timeout'));
          else setTimeout(tick, 200);
        });
    };
    tick();
  });
}

try {
  await waitForHttp(base);
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
  });
  const page = await ctx.newPage();

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(outDir, 'gallery-copy-buttons.png'), fullPage: false });

  const firstCard = page.locator('.wall-card').first();
  await firstCard.locator('.wall-card-copy').click();
  await page.waitForSelector('.global-toast', { state: 'visible', timeout: 5000 });
  await page.screenshot({ path: join(outDir, 'toast-after-copy.png') });

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.locator('summary.header-overflow-trigger').click();
  await page.screenshot({ path: join(outDir, 'header-overflow-menu.png') });

  await ctx.close();
  await browser.close();
} finally {
  preview.kill('SIGTERM');
  await new Promise((r) => setTimeout(r, 500));
  try {
    preview.kill('SIGKILL');
  } catch {
    /* ignore */
  }
}

await writeFile(
  join(outDir, 'README.txt'),
  'Artifacts: gallery-copy-buttons.png, toast-after-copy.png, header-overflow-menu.png, and a WebM screen recording from Playwright.\n',
);
