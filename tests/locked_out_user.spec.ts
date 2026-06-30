import { test, expect } from '@playwright/test';

test('locked out user sees an error and cannot log in', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

  await page.getByPlaceholder('Username').fill(process.env.TEST_USER_LOCKED_OUT!);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Epic sadface: Sorry, this user has been locked out.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue(process.env.TEST_USER_LOCKED_OUT!);
});