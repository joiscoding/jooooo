import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = process.env.ARTIFACTS_DIR || join(root, 'artifacts', 'lb4');
function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, '127.0.0.1', () => {
      const a = s.address();
      s.close(() => {
        if (a && typeof a === 'object') resolve(a.port);
        else reject(new Error('Could not get free port'));
      });
    });
    s.on('error', reject);
  });
}

function waitForHttp(url, { timeout = 25000 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() - start > timeout) {
            reject(new Error('Preview server did not start in time'));
          } else {
            setTimeout(tick, 200);
          }
        });
    };
    tick();
  });
}

async function main() {
  const PORT = process.env.PREVIEW_PORT
    ? parseInt(process.env.PREVIEW_PORT, 10)
    : await getFreePort();
  const base = `http://127.0.0.1:${PORT}`;

  await mkdir(outDir, { recursive: true });

  const beforeVideos = new Set();
  try {
    const vids = await readdir(outDir);
    for (const f of vids) {
      if (f.endsWith('.webm')) beforeVideos.add(f);
    }
  } catch {
    /* empty */
  }

  const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(
    process.execPath,
    [
      viteBin,
      'preview',
      '--port',
      String(PORT),
      '--strictPort',
      '--host',
      '127.0.0.1',
    ],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  let out = '';
  const onData = (buf) => {
    out += buf.toString();
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);

  let killed = false;
  const stop = () => {
    if (!killed) {
      killed = true;
      child.kill('SIGTERM');
    }
  };

  const failIfProcessDies = new Promise((_, reject) => {
    child.once('error', (err) => reject(err));
    child.once('close', (code) => {
      if (code !== 0 && code != null) {
        reject(
          new Error(
            `vite preview exited with ${code} before ready:\n${out.slice(0, 2000)}`
          )
        );
      }
    });
  });

  try {
    await Promise.race([waitForHttp(base), failIfProcessDies]);
  } catch (e) {
    stop();
    throw e;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    recordVideo: { dir: outDir, size: { width: 1200, height: 800 } },
  });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('aside.app-sidebar').waitFor({ state: 'visible', timeout: 15000 });
  await page
    .locator('button.nav-collapse-toggle')
    .first()
    .waitFor({ state: 'visible' });
  await page.screenshot({ path: join(outDir, 'lb4-sidebar-expanded.png') });

  const toggle = page.locator('button.nav-collapse-toggle').first();
  if ((await toggle.count()) === 0) {
    await browser.close();
    stop();
    throw new Error('nav-collapse-toggle button not found');
  }
  await toggle.click({ force: true });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: join(outDir, 'lb4-sidebar-collapsed.png') });
  await toggle.click({ force: true });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: join(outDir, 'lb4-sidebar-expanded-again.png') });

  await context.close();
  await browser.close();
  stop();

  await new Promise((r) => {
    if (child.exitCode !== null) {
      r();
    } else {
      child.on('close', r);
    }
  });

  let newVideo = null;
  const after = await readdir(outDir);
  for (const f of after) {
    if (f.endsWith('.webm') && !beforeVideos.has(f)) {
      newVideo = f;
    }
  }

  const note = [
    'LB-4: Persist sidebar / nav collapsed state (Studio Lookbook demo)',
    '',
    `Viewports: 1200×800. API: localStorage key lookbook_nav_collapsed_v1.`,
    newVideo
      ? `Screen recording: ${newVideo} (in this folder).`
      : 'No new WebM was detected; check the folder for *.webm from Playwright.',
  ].join('\n');

  await writeFile(join(outDir, 'lb4-artifacts.txt'), note, 'utf-8');
  const portalDest = join('/opt/cursor/artifacts', 'lb4');
  try {
    await mkdir(portalDest, { recursive: true });
    const { copyFile } = await import('node:fs/promises');
    for (const f of [
      'lb4-sidebar-expanded.png',
      'lb4-sidebar-collapsed.png',
      'lb4-sidebar-expanded-again.png',
    ]) {
      try {
        await copyFile(join(outDir, f), join(portalDest, f));
      } catch {
        /* optional */
      }
    }
    if (newVideo) {
      try {
        await copyFile(join(outDir, newVideo), join(portalDest, newVideo));
      } catch {
        /* optional */
      }
    }
    await writeFile(join(portalDest, 'lb4-artifacts.txt'), note, 'utf-8');
  } catch {
    /* not in CI with portal path */
  }

  console.log('Artifacts in', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
