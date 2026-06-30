import { test, expect } from '@playwright/test';

test('standard user can buy a backpack and complete checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

  await page.getByPlaceholder('Username').fill(process.env.TEST_USER_STANDARD!);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();

  await page.locator('.inventory_item_description').getByRole('link', { name: 'Sauce Labs Backpack' }).click();
  // Q1 
  // await page.getByRole('link', { name: 'Sauce Labs Backpack' }).first().click();
  await expect(page).toHaveURL(/.*inventory-item.html/);
  await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

  await page.locator('a[data-test="shopping-cart-link"]').click();
  // Q1
  // await page.getByText('1').click();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.getByText('Your Cart')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.getByText('Checkout: Your Information')).toBeVisible();

  await page.getByPlaceholder('First Name').fill('Tess');
  await page.getByPlaceholder('Last Name').fill('Ter');
  await page.getByPlaceholder('Zip/Postal Code').fill('SW1A1AA');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  await expect(page.getByText('Checkout: Overview')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();

  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.getByText('Checkout: Complete!')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
});
