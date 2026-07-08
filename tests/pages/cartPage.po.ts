import { expect, Page, Locator } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Your Cart');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checksCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
