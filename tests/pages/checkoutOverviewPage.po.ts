import { expect, Page, Locator } from '@playwright/test';

export class CheckoutOverviewPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Checkout: Overview');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async checksCheckoutOverviewPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
