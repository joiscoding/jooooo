import { expect, test } from '@playwright/test';

const shot = (name: string) => `/opt/cursor/artifacts/${name}`;

test.describe('LB-2 global search', () => {
  test('header search, filtering, and Ctrl/Cmd+K focus', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#global-search')).toBeVisible();
    await page.screenshot({ path: shot('lb2-home-search.png'), fullPage: false });

    await page.locator('#global-search').fill('streetwear');
    await page.screenshot({
      path: shot('lb2-gallery-filtered.png'),
      fullPage: true,
    });

    await page.locator('#global-search').blur();
    await page.keyboard.press('Control+K');
    await expect(page.locator('#global-search')).toBeFocused();

    await page.locator('#global-search').blur();
    await page.keyboard.press('Meta+K');
    await expect(page.locator('#global-search')).toBeFocused();
  });
});
