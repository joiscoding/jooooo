import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

const ART =
  process.env.CURSOR_ARTIFACTS_DIR ??
  join(process.cwd(), 'artifacts', 'lb4-capture');

test.beforeAll(() => {
  if (!existsSync(ART)) {
    mkdirSync(ART, { recursive: true });
  }
});

test('desktop sidebar expand/collapse and persistence (LB-4)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(
    page.getByRole('navigation', { name: 'Primary' }).first()
  ).toBeVisible();

  await page.screenshot({
    path: join(ART, 'lb4-sidebar-expanded.png'),
    fullPage: false,
  });

  await page.getByRole('button', { name: 'Collapse navigation' }).click();
  await expect(page.locator('.site-sidebar--collapsed')).toBeVisible();
  await page.screenshot({
    path: join(ART, 'lb4-sidebar-collapsed.png'),
    fullPage: false,
  });

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('.site-sidebar--collapsed')).toBeVisible();
  await page.screenshot({
    path: join(ART, 'lb4-sidebar-collapsed-after-reload.png'),
    fullPage: false,
  });

  await page.getByRole('button', { name: 'Expand navigation' }).click();
  await expect(page.locator('.site-sidebar--collapsed')).toHaveCount(0);
});

test('mobile uses top header only (no sidebar rail)', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('.site-header--mobile')).toBeVisible();
  await expect(page.locator('.site-sidebar')).toBeHidden();

  await page.screenshot({
    path: join(ART, 'lb4-mobile-header.png'),
    fullPage: false,
  });
});
