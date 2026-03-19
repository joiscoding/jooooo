/**
 * Demo walkthrough screen recording + static screenshots (separate pass).
 * Run: npm run build && npm run capture
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'capture-output');

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function slowScroll(page, totalDelta, steps = 12) {
  const per = Math.ceil(totalDelta / steps);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, per);
    await wait(280);
  }
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

async function takeScreenshotsOnly(base) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(outDir, '01-home.png'), fullPage: true });
  await page.goto(`${base}/looks/look-03`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(outDir, '02-look-detail.png'), fullPage: true });
  await page.goto(`${base}/albums`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(outDir, '03-albums.png'), fullPage: true });
  await browser.close();
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

    const browser = await chromium.launch({
      slowMo: 45,
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
    });
    const page = await context.newPage();

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await wait(2200);

    await slowScroll(page, 700);
    await wait(1800);
    await slowScroll(page, 900);
    await wait(2000);

    await page.getByRole('button', { name: 'Classic / tailored' }).click();
    await wait(2500);
    await slowScroll(page, 500);
    await wait(1500);

    await page.locator('a[href^="/looks/"]').first().click();
    await page.waitForURL(/\/looks\//);
    await wait(2200);
    await slowScroll(page, 650);
    await wait(2000);

    await page.getByPlaceholder('e.g. Winter edits').fill('Demo walkthrough');
    await wait(600);
    await page.getByRole('button', { name: 'Create & add' }).click();
    await page.waitForURL(/\/albums\/.+/);
    await wait(2800);

    await page.getByPlaceholder('Label').fill('Style reference (COS men)');
    await wait(400);
    await page.locator('input[type="url"]').fill('https://www.cos.com/en-us/men');
    await wait(500);
    await page.getByRole('button', { name: 'Add link' }).click();
    await wait(2500);
    await slowScroll(page, 400);
    await wait(1500);

    await page.getByRole('link', { name: 'Albums' }).click();
    await page.waitForURL(/\/albums$/);
    await wait(2200);
    await slowScroll(page, 200);
    await wait(1500);

    await page.getByRole('link', { name: 'Demo walkthrough' }).first().click();
    await wait(2800);
    await slowScroll(page, 500);
    await wait(2000);

    await page.getByRole('link', { name: 'Atelier' }).click();
    await wait(2000);
    await page.getByRole('button', { name: 'All' }).click();
    await wait(2000);
    await slowScroll(page, 600);
    await wait(2800);

    const recording = page.video();
    await page.close();
    if (recording) {
      await recording.saveAs(join(outDir, 'demo-walkthrough.webm'));
      await copyFile(
        join(outDir, 'demo-walkthrough.webm'),
        join(outDir, 'preview.webm')
      );
    }
    await context.close();
    await browser.close();

    await takeScreenshotsOnly(base);
  } finally {
    proc.kill('SIGTERM');
  }

  console.log(`Demo recording: ${outDir}/demo-walkthrough.webm (copy: preview.webm)`);
  console.log(`Screenshots: ${outDir}/01-home.png, 02-look-detail.png, 03-albums.png`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
