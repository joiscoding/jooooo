import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:5173';
const outDir = process.env.OUT_DIR ?? '/opt/cursor/artifacts';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: 'light',
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();

await page.goto(base, { waitUntil: 'networkidle' });

await page.getByRole('button', { name: 'Light', exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/playwright-theme-light.png` });

await page.getByRole('button', { name: 'Dark', exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/playwright-theme-dark.png` });

await page.getByRole('button', { name: 'System', exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/playwright-theme-system.png` });

await page.close();
await context.close();
await browser.close();
