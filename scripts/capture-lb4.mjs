/**
 * Captures LB-4 UI artifacts: desktop sidebar expanded/collapsed PNGs
 * and a short WebM built from timed frames (requires dist/ from `npm run build`).
 */
import { spawn } from 'child_process';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_BASE = process.env.LB4_ARTIFACT_DIR || '/opt/cursor/artifacts/lb4';
const PREVIEW_PORT = 4174;
const VIEWPORT = { width: 1200, height: 800 };

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function startPreview() {
  const proc = spawn('npm', ['run', 'preview', '--', '--port', String(PREVIEW_PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });
  return proc;
}

async function waitForHttp(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await sleep(250);
  }
  throw new Error(`Server not up: ${url}`);
}

async function main() {
  await mkdir(OUT_BASE, { recursive: true });
  const framesDir = join(OUT_BASE, 'frames');
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const preview = startPreview();
  preview.stderr.on('data', (d) => process.stderr.write(d));

  try {
    await waitForHttp(`http://127.0.0.1:${PREVIEW_PORT}/`);

    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || '/usr/local/bin/google-chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,800'],
    });

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(`http://127.0.0.1:${PREVIEW_PORT}/`, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('.site-sidebar', { timeout: 15000 });

    let frame = 0;
    async function shot(label) {
      const n = String(frame++).padStart(4, '0');
      await page.screenshot({ path: join(framesDir, `f-${n}-${label}.png`), type: 'png' });
    }

    await shot('expanded');
    await page.screenshot({ path: join(OUT_BASE, 'sidebar-expanded.png'), type: 'png' });

    await page.click('.sidebar-collapse-toggle');
    await sleep(400);
    await shot('collapsed');
    await page.screenshot({ path: join(OUT_BASE, 'sidebar-collapsed.png'), type: 'png' });

    await page.click('.sidebar-collapse-toggle');
    await sleep(400);
    await shot('expanded-again');

    await browser.close();

    const { execFileSync } = await import('child_process');
    const webmOut = join(OUT_BASE, 'sidebar-toggle-demo.webm');
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-framerate',
        '2',
        '-pattern_type',
        'glob',
        '-i',
        join(framesDir, 'f-*.png'),
        '-c:v',
        'libvpx-vp9',
        '-pix_fmt',
        'yuva420p',
        '-b:v',
        '0',
        '-crf',
        '35',
        webmOut,
      ],
      { stdio: 'inherit' }
    );

    await rm(framesDir, { recursive: true, force: true });
    console.log('Wrote:', join(OUT_BASE, 'sidebar-expanded.png'));
    console.log('Wrote:', join(OUT_BASE, 'sidebar-collapsed.png'));
    console.log('Wrote:', webmOut);
  } finally {
    preview.kill('SIGTERM');
    await sleep(500);
    if (!preview.killed) preview.kill('SIGKILL');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
