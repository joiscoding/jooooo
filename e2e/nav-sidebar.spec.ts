import { test, expect } from '@playwright/test';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const artifactsDir = path.join(process.cwd(), 'artifacts');

function ensureArtifacts() {
  mkdirSync(artifactsDir, { recursive: true });
}

test.describe('LB-4 navigation persistence', () => {
  test('desktop sidebar: expanded, collapsed, reload keeps state', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-desktop',
      'desktop layout only',
    );
    ensureArtifacts();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.app-sidebar')).toBeVisible();
    await expect(page.locator('.site-header.site-header--mobile')).toBeHidden();

    await page.screenshot({
      path: path.join(artifactsDir, 'lb4-sidebar-expanded.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: /collapse navigation/i }).click();
    await expect(page.locator('.app-sidebar.collapsed')).toBeVisible();

    await page.screenshot({
      path: path.join(artifactsDir, 'lb4-sidebar-collapsed.png'),
      fullPage: true,
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.app-sidebar.collapsed')).toBeVisible();

    const stored = await page.evaluate(() =>
      localStorage.getItem('lookbook_nav_collapsed_v1'),
    );
    expect(stored).toBe('true');
  });

  test('mobile: top header only, no sidebar', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-mobile',
      'mobile viewport only',
    );
    ensureArtifacts();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.app-sidebar')).toBeHidden();
    await expect(page.locator('.site-header--mobile')).toBeVisible();

    await page.screenshot({
      path: path.join(artifactsDir, 'lb4-mobile-header.png'),
      fullPage: true,
    });
  });

  test('desktop: screen recording of toggle', async ({ browser }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-desktop',
      'desktop layout only',
    );
    ensureArtifacts();

    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
      recordVideo: {
        dir: artifactsDir,
        size: { width: 1200, height: 800 },
      },
    });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:4173/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /collapse navigation/i }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /expand navigation/i }).click();
    await page.waitForTimeout(300);

    await context.close();
  });
});
