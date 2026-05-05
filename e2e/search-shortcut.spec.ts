import { expect, test } from '@playwright/test';

test.describe('global search shortcut', () => {
  test('Ctrl+K focuses search; query filters gallery', async ({ page }) => {
    await page.goto('/');

    const search = page.getByPlaceholder('Search looks…');
    await expect(search).toBeVisible();

    await search.fill('zznonexistentzz');
    await expect(page.getByText('No looks match your search.')).toBeVisible();

    await search.clear();
    await page.keyboard.press('Control+k');
    await expect(search).toBeFocused();

    await search.fill('minimal');
    const cards = page.locator('.gallery-wall .wall-card');
    await expect(cards).not.toHaveCount(0);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    await search.fill('');
    const allCards = await page.locator('.gallery-wall .wall-card').count();
    expect(allCards).toBeGreaterThanOrEqual(count);
  });
});
