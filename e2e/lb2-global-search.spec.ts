import { expect, test } from '@playwright/test';

test('LB-2: header search, shortcut hint, and gallery filtering', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const search = page.getByRole('searchbox', { name: 'Search looks' });
  await expect(search).toBeVisible();
  await expect(page.locator('#global-search-shortcut-hint')).toBeVisible();

  await search.fill('zzzznomatchzzzz');
  await expect(page.getByText('No looks match your search.')).toBeVisible();

  await search.fill('');
  await expect(page.locator('.gallery-wall .wall-card').first()).toBeVisible();

  await search.fill('minimal');
  const cards = page.locator('.gallery-wall .wall-card');
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});
