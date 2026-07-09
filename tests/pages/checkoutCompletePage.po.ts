import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutCompletePage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly confirmationHeading: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async checksCheckoutCompletePage(options?: { timeout?: number }): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/, options);
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.confirmationHeading).toHaveText('Thank you for your order!');
    await expect(this.completeText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    await expect(this.backHomeButton).toBeVisible();
    await this.navBar.checksNavBar();
    await this.footer.checksFooter();
  }
}
