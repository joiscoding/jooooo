/**
 * Captures screenshots of list empty states for LB-5 (requires `npm run build` first).
 * Writes PNGs and a short MP4 under /opt/cursor/artifacts/ for Slack / PR attachments.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const outDir = '/opt/cursor/artifacts';
const port = 4177;

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ?? '/usr/bin/google-chrome-stable';

const seedLooks = JSON.parse(
  await readFile(path.join(root, 'src/data/looks.json'), 'utf8'),
);

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function serveSpaFromDist() {
  return createServer(async (req, res) => {
    try {
      const raw = req.url?.split('?')[0] ?? '/';
      const decoded = decodeURIComponent(raw);
      let rel = decoded === '/' ? 'index.html' : decoded.replace(/^\//, '');
      let filePath = path.join(dist, rel);
      if (!filePath.startsWith(dist)) {
        res.writeHead(403);
        res.end();
        return;
      }
      let data;
      let servedPath = filePath;
      try {
        data = await readFile(filePath);
      } catch {
        servedPath = path.join(dist, 'index.html');
        data = await readFile(servedPath);
      }
      const ext = path.extname(servedPath);
      res.writeHead(200, { 'Content-Type': mime[ext] ?? 'application/octet-stream' });
      res.end(data);
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const server = serveSpaFromDist();
  await new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', resolve);
    server.on('error', reject);
  });
  const base = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const shots = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    await page.evaluate((looks) => {
      sessionStorage.setItem(
        'lookbook_mcp_looks_v13',
        JSON.stringify(looks.filter((l) => l.tag === 'streetwear')),
      );
    }, seedLooks);
    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    const pills = await page.$$('button.filter-pill');
    for (const btn of pills) {
      const text = await btn.evaluate((el) => el.textContent?.trim() ?? '');
      if (text.includes('Minimal')) {
        await btn.click();
        break;
      }
    }
    await page.waitForSelector('.list-empty-state');
    const p1 = path.join(outDir, 'lb5-gallery-filter-empty.png');
    await page.screenshot({ path: p1, type: 'png' });
    shots.push(p1);

    await page.evaluate(() => {
      localStorage.removeItem('lookbook_albums_v1');
    });
    await page.goto(`${base}/albums`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.list-empty-state');
    const p2 = path.join(outDir, 'lb5-albums-empty.png');
    await page.screenshot({ path: p2, type: 'png' });
    shots.push(p2);

    await page.evaluate(() => {
      localStorage.setItem(
        'lookbook_albums_v1',
        JSON.stringify([
          { id: 'demo-empty-album', name: 'Spring picks', lookIds: [] },
        ]),
      );
    });
    await page.goto(`${base}/albums/demo-empty-album`, {
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector('.list-empty-state');
    const p3 = path.join(outDir, 'lb5-album-detail-empty.png');
    await page.screenshot({ path: p3, type: 'png' });
    shots.push(p3);

    const listPath = path.join(outDir, 'lb5-empty-states-list.txt');
    const concat =
      shots.map((f) => `file '${f}'\nduration 2.5\n`).join('') +
      `file '${shots[shots.length - 1]}'\n`;
    await writeFile(listPath, concat, 'utf8');
    const videoOut = path.join(outDir, 'lb5-empty-states-demo.mp4');
    await new Promise((resolve, reject) => {
      const ff = spawn(
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
          'fps=12,format=yuv420p',
          '-c:v',
          'libx264',
          videoOut,
        ],
        { stdio: 'inherit' },
      );
      ff.on('close', (code) =>
        code === 0 ? resolve(undefined) : reject(new Error(`ffmpeg ${code}`)),
      );
    });
    await rm(listPath, { force: true });
  } finally {
    await browser.close();
    server.close();
  }

  console.log(
    'Wrote:',
    [...shots, path.join(outDir, 'lb5-empty-states-demo.mp4')].join(', '),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
