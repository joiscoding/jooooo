import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactsDir = path.join(__dirname, '..', 'artifacts', 'lb4');

fs.mkdirSync(artifactsDir, { recursive: true });

test.describe('LB-4 desktop sidebar', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('collapsed state persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('lookbook_nav_collapsed_v1'));
    await page.reload();
    await expect(
      page.getByRole('complementary', { name: 'Site navigation' })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(artifactsDir, 'sidebar-expanded.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: /collapse navigation/i }).click();
    await expect(page.locator('.layout-nav-collapsed')).toBeVisible();

    await page.screenshot({
      path: path.join(artifactsDir, 'sidebar-collapsed.png'),
      fullPage: true,
    });

    await page.reload();
    await expect(page.locator('.layout-nav-collapsed')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('lookbook_nav_collapsed_v1'))).toBe(
      '1'
    );

    await page.screenshot({
      path: path.join(artifactsDir, 'sidebar-collapsed-after-reload.png'),
      fullPage: true,
    });
  });

  test('records expand/collapse interaction', async ({ browser }) => {
    const recordingsDir = path.join(artifactsDir, 'recordings');
    fs.mkdirSync(recordingsDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: recordingsDir },
    });
    const page = await context.newPage();
    await page.goto('/');
    await page.getByRole('button', { name: /collapse navigation/i }).click();
    await expect(page.locator('.layout-nav-collapsed')).toBeVisible();
    await page.getByRole('button', { name: /expand navigation/i }).click();
    await expect(page.locator('.layout-nav-collapsed')).toBeHidden();
    await page.close();
    await context.close();
  });
});
