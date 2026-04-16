/**
 * Builds preview, captures LB-4 nav screenshots + short MP4 (frame sequence during toggle).
 * Requires: dist/ (run `npm run build` first), google-chrome, ffmpeg.
 */
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import puppeteer from 'puppeteer-core';

const ROOT = join(import.meta.dirname, '..');
const ARTIFACTS = join(ROOT, 'artifacts');
const VITE_CLI = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');

async function pickFreePort() {
  return await new Promise((resolve, reject) => {
    const s = createServer();
    s.unref();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      s.close(() => resolve(port));
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttpOk(url, { timeoutMs = 20000, intervalMs = 150 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await sleep(intervalMs);
  }
  throw new Error(`Server did not respond OK at ${url} within ${timeoutMs}ms`);
}

async function stopPreview(child) {
  const pid = child.pid;
  if (!pid) return;
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      child.kill('SIGTERM');
    } catch {
      /* noop */
    }
  }
  await sleep(400);
  try {
    process.kill(-pid, 0);
  } catch {
    return;
  }
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    try {
      child.kill('SIGKILL');
    } catch {
      /* noop */
    }
  }
  await sleep(100);
}

async function main() {
  await mkdir(ARTIFACTS, { recursive: true });
  const port = await pickFreePort();
  const url = `http://127.0.0.1:${port}/`;

  const chromePath =
    process.env.CHROME_PATH ||
    execFileSync('which', ['google-chrome'], { encoding: 'utf8' }).trim();

  const preview = spawn(
    process.execPath,
    [VITE_CLI, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      detached: true,
    },
  );

  preview.stderr?.on('data', (d) => process.stderr.write(d));
  preview.stdout?.on('data', (d) => process.stderr.write(d));

  const previewExit = new Promise((resolve, reject) => {
    preview.once('error', reject);
    preview.once('exit', (code, signal) => {
      if (code === 0 || signal === 'SIGTERM' || signal === 'SIGKILL') {
        resolve({ code, signal });
      } else {
        reject(new Error(`preview exited early with code ${code}`));
      }
    });
  });

  try {
    await Promise.race([
      waitForHttpOk(url),
      previewExit.then(() => {
        throw new Error('preview server exited before becoming ready');
      }),
    ]);

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: 'new',
      args: ['--window-size=1280,800', '--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      const expandedPath = join(ARTIFACTS, 'lb4-nav-expanded.png');
      await page.screenshot({ path: expandedPath, fullPage: false });

      const framesDir = await mkdtemp(join(tmpdir(), 'lb4-frames-'));
      let frame = 0;
      const grabFrame = async () => {
        const p = join(framesDir, `f-${String(frame++).padStart(4, '0')}.png`);
        await page.screenshot({ path: p });
      };

      await grabFrame();
      await page.click('button.sidebar-toggle');
      for (let i = 0; i < 18; i += 1) {
        await sleep(45);
        await grabFrame();
      }

      const collapsedPath = join(ARTIFACTS, 'lb4-nav-collapsed.png');
      await page.screenshot({ path: collapsedPath, fullPage: false });

      await page.reload({ waitUntil: 'networkidle0' });
      await sleep(300);
      const afterReloadPath = join(ARTIFACTS, 'lb4-nav-collapsed-after-reload.png');
      await page.screenshot({ path: afterReloadPath, fullPage: false });

      const videoOut = join(ARTIFACTS, 'lb4-nav-toggle-recording.mp4');
      execFileSync(
        'ffmpeg',
        [
          '-y',
          '-framerate',
          '20',
          '-i',
          join(framesDir, 'f-%04d.png'),
          '-c:v',
          'libx264',
          '-pix_fmt',
          'yuv420p',
          '-movflags',
          '+faststart',
          videoOut,
        ],
        { stdio: 'inherit' },
      );

      await rm(framesDir, { recursive: true, force: true });

      const readme = join(ARTIFACTS, 'LB4_CAPTURES.md');
      await writeFile(
        readme,
        [
          '# LB-4 navigation capture artifacts',
          '',
          'Generated by `npm run capture:nav` (after `npm run build`).',
          '',
          '- `lb4-nav-expanded.png` — desktop sidebar expanded',
          '- `lb4-nav-collapsed.png` — after toggling collapse',
          '- `lb4-nav-collapsed-after-reload.png` — collapsed state persists across reload',
          '- `lb4-nav-toggle-recording.mp4` — short frame capture during toggle',
          '',
        ].join('\n'),
        'utf8',
      );
    } finally {
      await browser.close();
    }
  } finally {
    await stopPreview(preview);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
