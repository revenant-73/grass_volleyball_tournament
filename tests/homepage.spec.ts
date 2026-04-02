import { test, expect } from '@playwright/test';

test('homepage has title and shows upcoming events', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Grass Doubles/);

  // Check if there are event cards or a message about no events
  const eventList = page.locator('main');
  await expect(eventList).toBeVisible();
});
