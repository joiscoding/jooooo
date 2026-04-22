import { spawn } from 'node:child_process';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = process.env.ARTIFACT_DIR ?? '/opt/cursor/artifacts/lookbook-lb-5';
const port = 5179;
const base = `http://127.0.0.1:${port}`;

function startDevServer() {
  return spawn('npm', ['run', 'dev', '--', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'pipe',
    env: { ...process.env, BROWSER: 'none' },
  });
}

function waitForLine(proc, re) {
  return new Promise((resolve, reject) => {
    const onData = (chunk) => {
      if (re.test(String(chunk))) {
        proc.stdout?.off('data', onData);
        resolve();
      }
    };
    proc.stdout?.on('data', onData);
    proc.stderr?.on('data', onData);
    proc.on('error', reject);
  });
}

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const dev = startDevServer();
  await waitForLine(dev, /Local:\s+http:\/\//);

  const browser = await chromium.launch();

  const shotPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const shots = [
    { file: 'gallery-empty-looks.png', path: `/?emptyLooks=1` },
    { file: 'gallery-filter-empty.png', path: `/?filterNoMatch=1` },
    { file: 'albums-list-empty.png', path: `/albums?emptyAlbums=1` },
  ];
  for (const s of shots) {
    await shotPage.goto(base + s.path, { waitUntil: 'networkidle' });
    await shotPage.screenshot({ path: join(outDir, s.file), fullPage: true });
  }
  await shotPage.close();

  // Real empty album (localStorage) for album detail
  const albumPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await albumPage.goto(base + '/');
  await albumPage.evaluate(() => {
    localStorage.setItem(
      'lookbook_albums_v1',
      JSON.stringify([
        { id: 'album-capture-1', name: 'LB-5 capture', lookIds: [] },
      ])
    );
  });
  await albumPage.goto(`${base}/albums/album-capture-1`, { waitUntil: 'networkidle' });
  await albumPage.screenshot({ path: join(outDir, 'album-detail-empty.png'), fullPage: true });
  await albumPage.close();

  // One continuous screen recording (navigate in a single page)
  const videoCtx = await browser.newContext({
    recordVideo: {
      dir: outDir,
      size: { width: 1200, height: 800 },
    },
  });
  const vPage = await videoCtx.newPage();
  const tour = [
    { path: `/?emptyLooks=1`, waitMs: 2000 },
    { path: `/?filterNoMatch=1`, waitMs: 2000 },
    { path: `/albums?emptyAlbums=1`, waitMs: 2000 },
  ];
  for (const step of tour) {
    await vPage.goto(base + step.path, { waitUntil: 'networkidle' });
    await new Promise((r) => setTimeout(r, step.waitMs));
  }
  await vPage.goto(base + '/');
  await vPage.evaluate(() => {
    localStorage.setItem(
      'lookbook_albums_v1',
      JSON.stringify([{ id: 'album-capture-1', name: 'LB-5 capture', lookIds: [] }])
    );
  });
  await vPage.goto(`${base}/albums/album-capture-1`, { waitUntil: 'networkidle' });
  await new Promise((r) => setTimeout(r, 2500));
  await vPage.close();
  await videoCtx.close();

  const files = await readdir(outDir);
  const webm = files.find((f) => f.endsWith('.webm'));
  if (webm) {
    await rename(join(outDir, webm), join(outDir, 'empty-states-tour.webm'));
  }

  await browser.close();
  dev.kill('SIGTERM');

  console.log(`Wrote screenshots and video under ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
