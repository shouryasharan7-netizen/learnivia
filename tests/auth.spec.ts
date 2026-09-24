import { test, expect } from '@playwright/test';

test('homepage loads and shows sign in link', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Learnivia/);
  
  const signInLink = page.getByRole('link', { name: 'Sign in' });
  await expect(signInLink).toBeVisible();
});

test('navigation to tutor discovery works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Find a Tutor' }).first().click();
  
  await expect(page).toHaveURL(/.*\/find/);
  await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible();
});
