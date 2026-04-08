import { expect, test } from '@playwright/test';

test.describe('theme toggle', () => {
  test('header shows theme control and light mode', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('lookbook-theme', 'light'));
    await page.reload();
    await expect(page.locator('[aria-label="Color theme"]')).toBeVisible();
    await expect(page.locator('.theme-toggle-btn.active')).toHaveText('Light');
    await page.screenshot({ path: 'test-results/theme-light.png', fullPage: true });
  });

  test('dark mode applies stored preference', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('lookbook-theme', 'dark'));
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.theme-toggle-btn.active')).toHaveText('Dark');
    await page.screenshot({ path: 'test-results/theme-dark.png', fullPage: true });
  });
});
