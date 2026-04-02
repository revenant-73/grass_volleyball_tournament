import { test, expect } from '@playwright/test';

test('can navigate to registration and fill out form', async ({ page }) => {
  // Go to the event page
  await page.goto('/events/seaside-open-2026');
  
  // Click register button (assuming there's one)
  const registerButton = page.getByRole('link', { name: /Register/i }).first();
  await expect(registerButton).toBeVisible();
  await registerButton.click();

  // Should be on registration page
  await expect(page).toHaveURL(/\/events\/seaside-open-2026\/register/);
  await expect(page.getByText(/Register for Seaside Grass Doubles Open/i)).toBeVisible();

  // Select a division (Mens Open)
  const mensOpenButton = page.getByRole('button', { name: 'Mens Open', exact: false }).first();
  await mensOpenButton.click();

  // Fill out team info
  await page.fill('input[name="team_name"]', 'Test Team');
  await page.fill('input[name="captain_name"]', 'Test Captain');
  await page.fill('input[name="captain_email"]', 'test@example.com');
  await page.fill('input[name="partner_name"]', 'Test Partner');
  
  // Accept waiver
  await page.check('input[name="waiver_accepted"]');

  // Submit button should be enabled
  const submitButton = page.getByRole('button', { name: /Continue to Payment/i });
  await expect(submitButton).toBeEnabled();

  // We won't actually submit to Stripe in this test to avoid external dependencies,
  // but we've verified the form works up to that point.
});
