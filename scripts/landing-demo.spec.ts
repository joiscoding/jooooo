import { test, expect } from '@playwright/test';
import { mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'demo-output');

test('capture landing + lookbook screenshots and scroll video', async ({
  page,
  browser,
}) => {
  mkdirSync(outDir, { recursive: true });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(
    page.getByRole('heading', { name: /discover the new you/i }),
  ).toBeVisible();

  await page.screenshot({
    path: join(outDir, 'landing-hero.png'),
    fullPage: false,
  });

  await page.screenshot({
    path: join(outDir, 'landing-full.png'),
    fullPage: true,
  });

  const ctx = await browser.newContext({
    recordVideo: {
      dir: outDir,
      size: { width: 1280, height: 720 },
    },
  });
  const vpage = await ctx.newPage();
  await vpage.goto('/');
  await vpage.waitForLoadState('networkidle');
  await vpage.evaluate(() => window.scrollTo(0, 0));
  await vpage.waitForTimeout(400);

  const steps = 24;
  const delay = 180;
  for (let i = 0; i <= steps; i++) {
    await vpage.evaluate((y) => window.scrollTo(0, y), (i / steps) * 2200);
    await vpage.waitForTimeout(delay);
  }

  await vpage.goto('/lookbook');
  await vpage.waitForLoadState('networkidle');
  await vpage.waitForTimeout(600);
  for (let i = 0; i <= 12; i++) {
    await vpage.evaluate((y) => window.scrollTo(0, y), (i / 12) * 800);
    await vpage.waitForTimeout(delay);
  }

  const recording = vpage.video();
  await ctx.close();
  if (recording) {
    await recording.saveAs(join(outDir, 'landing-demo-scroll.webm'));
    for (const name of readdirSync(outDir)) {
      if (name.endsWith('.webm') && name !== 'landing-demo-scroll.webm') {
        unlinkSync(join(outDir, name));
      }
    }
  }

  await page.goto('/lookbook');
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: join(outDir, 'lookbook.png'),
    fullPage: false,
  });
});
