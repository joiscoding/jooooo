import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = '/opt/cursor/artifacts/assets';

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/local/bin/google-chrome';

async function waitForServer(url, maxMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server not ready: ${url}`);
}

function runPreview() {
  return spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });
}

async function makeDemoVideo(framePaths) {
  const listPath = join(outDir, 'ffmpeg-concat.txt');
  const lines = framePaths
    .map((p) => `file '${p.replace(/'/g, "'\\''")}'\nduration 1.2`)
    .join('\n');
  await writeFile(listPath, `${lines}\nfile '${framePaths[framePaths.length - 1].replace(/'/g, "'\\''")}'\n`);

  const videoOut = join(outDir, 'copy-link-demo.mp4');
  const r = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      listPath,
      '-vf',
      'format=yuv420p',
      '-c:v',
      'libx264',
      '-movflags',
      '+faststart',
      videoOut,
    ],
    { stdio: 'inherit' }
  );
  if (r.status !== 0) {
    console.warn('ffmpeg exited non-zero; video may be missing');
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const preview = runPreview();

  try {
    await waitForServer('http://127.0.0.1:4173/');

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const base = 'http://127.0.0.1:4173';

    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.wall-card', { timeout: 15000 });
    const f1 = join(outDir, 'copy-link-gallery.png');
    await page.screenshot({ path: f1 });

    await page.click('button.header-menu-trigger');
    await page.waitForSelector('.header-menu-dropdown', { visible: true, timeout: 5000 });
    const f2 = join(outDir, 'copy-link-header-menu.png');
    await page.screenshot({ path: f2 });

    await page.click('button.header-menu-item');
    await page.waitForSelector('.global-toast', { visible: true, timeout: 5000 });
    const f3 = join(outDir, 'copy-link-toast.png');
    await page.screenshot({ path: f3 });

    await page.goto(`${base}/look/crosswalk-khaki`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForSelector('.look-detail-title', { timeout: 15000 });
    const f4 = join(outDir, 'copy-link-look-detail.png');
    await page.screenshot({ path: f4 });

    await browser.close();

    await makeDemoVideo([f1, f2, f3, f4]);
  } finally {
    preview.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 400));
    if (preview.exitCode === null) {
      preview.kill('SIGKILL');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
