import { expect, Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly confirmationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Checkout: Complete!');
    this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
  }

  async checksCheckoutCompletePage(options?: { timeout?: number }): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/, options);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.confirmationHeading).toBeVisible();
  }
}
