/**
 * Starts preview, captures sidebar expanded/collapsed screenshots and a short video.
 * Run: node scripts/capture-nav-artifacts.mjs
 */
import http from 'node:http';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARTIFACTS = process.env.LB_ARTIFACTS_DIR || '/opt/cursor/artifacts';
const PORT = 4199;
const BASE = `http://127.0.0.1:${PORT}`;

function waitForServer(maxMs = 45000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const ping = () => {
      const req = http.get(BASE, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > maxMs) {
          reject(new Error(`Server did not start within ${maxMs}ms`));
        } else {
          setTimeout(ping, 250);
        }
      });
    };
    ping();
  });
}

async function main() {
  await mkdir(ARTIFACTS, { recursive: true });

  const preview = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)],
    {
      cwd: ROOT,
      stdio: 'ignore',
    }
  );

  try {
    await waitForServer();

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: ARTIFACTS },
    });
    const page = await context.newPage();

    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.nav-collapse-toggle', {
      state: 'visible',
      timeout: 20000,
    });
    await page.screenshot({
      path: join(ARTIFACTS, 'lb4-sidebar-expanded.png'),
      fullPage: true,
    });

    await page.locator('.nav-collapse-toggle').click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(ARTIFACTS, 'lb4-sidebar-collapsed.png'),
      fullPage: true,
    });

    await page.locator('.nav-collapse-toggle').click();
    await page.waitForTimeout(600);

    const video = page.video();
    await context.close();
    await browser.close();

    if (video) {
      const src = await video.path();
      const { rename } = await import('node:fs/promises');
      await rename(src, join(ARTIFACTS, 'lb4-nav-toggle.webm'));
    }
  } finally {
    preview.kill('SIGTERM');
  }

  console.log('Wrote screenshots and video under', ARTIFACTS);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
