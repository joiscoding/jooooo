/**
 * Builds screenshots and a short screen recording of the app.
 * Prerequisites: `npm run build` then this script starts preview on 4173.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'capture-output');

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await wait(300);
  }
  throw new Error(`Server not reachable: ${url}`);
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const proc = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    {
      cwd: root,
      stdio: 'ignore',
      detached: false,
    }
  );

  const base = 'http://127.0.0.1:4173';

  try {
    await waitForServer(base);

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
    });
    const page = await context.newPage();

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(outDir, '01-home.png'), fullPage: true });
    await wait(400);

    await page.goto(`${base}/looks/look-01`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(outDir, '02-look-detail.png'), fullPage: true });
    await wait(400);

    await page.goto(`${base}/albums`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(outDir, '03-albums.png'), fullPage: true });

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.mouse.wheel(0, 400);
    await wait(600);
    await page.mouse.wheel(0, 300);
    await wait(500);

    await page.close();
    await context.close();
    await browser.close();
  } finally {
    proc.kill('SIGTERM');
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Screenshots and video in ${outDir}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
