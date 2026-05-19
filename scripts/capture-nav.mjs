import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const port = 4174;
const baseUrl = `http://127.0.0.1:${port}/`;

async function waitForHttp(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'manual' });
      if (res.status < 500) return;
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

const preview = spawn(
  'npm',
  ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: repoRoot, stdio: 'inherit', shell: false },
);

preview.on('exit', (code, signal) => {
  console.error(`preview exited code=${code} signal=${signal}`);
});

try {
  await waitForHttp(baseUrl);
  const outDir = join(repoRoot, 'artifacts');
  await mkdir(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/local/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });

  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.screenshot({ path: join(outDir, 'lb4-desktop-expanded.png') });

  await page.click('.sidebar-toggle');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: join(outDir, 'lb4-desktop-collapsed.png') });

  const collapsed = await page.evaluate(() =>
    window.localStorage.getItem('lookbook_nav_collapsed_v1'),
  );
  if (collapsed !== 'true') {
    throw new Error(`Expected localStorage true after toggle, got ${collapsed}`);
  }

  await page.reload({ waitUntil: 'networkidle0' });
  const afterReload = await page.evaluate(() =>
    window.localStorage.getItem('lookbook_nav_collapsed_v1'),
  );
  if (afterReload !== 'true') {
    throw new Error(`Expected persistence after reload, got ${afterReload}`);
  }
  await page.screenshot({ path: join(outDir, 'lb4-desktop-collapsed-after-reload.png') });

  await browser.close();
  console.log(`Wrote ${outDir}/lb4-desktop-*.png`);
} finally {
  preview.kill('SIGTERM');
}
