/**
 * After `vite build`, run `npm run capture:ui` to start preview
 * and save theme toggle screenshots to CAPTURE_DIR.
 */
import { spawn, execFile } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { get } from 'node:http';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import process from 'node:process';
import { promisify } from 'node:util';
import puppeteer from 'puppeteer-core';

const execFileAsync = promisify(execFile);

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const CAPTURE_DIR = process.env.CAPTURE_DIR || '/opt/cursor/artifacts';

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  process.env.GOOGLE_CHROME ||
  process.env.CHROME_PATH ||
  '/usr/local/bin/google-chrome';

function waitForUp(targetUrl, attempts = 50) {
  return (async function again(i) {
    if (i >= attempts) throw new Error(`Server not up: ${targetUrl}`);
    const ok = await new Promise((resolve) => {
      get(targetUrl, (res) => {
        res.resume();
        resolve((res.statusCode ?? 0) < 500);
      }).on('error', () => resolve(false));
    });
    if (ok) return;
    await delay(200);
    return again(i + 1);
  })(0);
}

async function main() {
  await access(join(root, 'dist', 'index.html'));
  const prev = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'ignore',
  });

  const stop = () => {
    if (prev.pid && !prev.killed) {
      try {
        process.kill(-prev.pid, 'SIGTERM');
      } catch {
        prev.kill('SIGTERM');
      }
    }
  };
  process.on('exit', stop);

  try {
    const base = 'http://127.0.0.1:4173';
    await waitForUp(base);

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
    });
    const page = await browser.newPage();
    await page.goto(base, { waitUntil: 'networkidle0' });

    await mkdir(CAPTURE_DIR, { recursive: true });
    const shot = (name) => page.screenshot({ path: join(CAPTURE_DIR, name) });

    await page.evaluate(() => {
      try {
        localStorage.removeItem('lookbook-theme');
      } catch {
        /* */
      }
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await shot('lookbook-theme-initial.png');

    await page.click('input[name^="lookbook-theme-pref-"][value="light"]');
    await delay(200);
    await shot('lookbook-theme-light.png');

    await page.click('input[name^="lookbook-theme-pref-"][value="dark"]');
    await delay(200);
    await shot('lookbook-theme-dark.png');

    await browser.close();

    const lightPng = join(CAPTURE_DIR, 'lookbook-theme-light.png');
    const webm = join(CAPTURE_DIR, 'lookbook-theme-toggle.webm');
    try {
      await execFileAsync('ffmpeg', [
        '-y',
        '-loop',
        '1',
        '-i',
        lightPng,
        '-t',
        '2',
        '-c:v',
        'libvpx-vp9',
        '-pix_fmt',
        'yuv420p',
        webm,
      ]);
    } catch {
      await writeFile(
        join(CAPTURE_DIR, 'lookbook-capture-readme.txt'),
        'ffmpeg was not available or failed; theme screenshots (PNG) are the primary visual artifacts.\n',
        'utf8',
      );
    }

    console.log(`Artifacts: ${resolve(CAPTURE_DIR)}`);
  } finally {
    stop();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
