import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutOverviewPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly qtyLabel: Locator;
  private readonly descriptionLabel: Locator;
  private readonly paymentInfoLabel: Locator;
  private readonly shippingInfoLabel: Locator;
  private readonly priceTotalLabel: Locator;
  private readonly cancelButton: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.qtyLabel = page.locator('[data-test="cart-quantity-label"]');
    this.descriptionLabel = page.locator('[data-test="cart-desc-label"]');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
    this.priceTotalLabel = page.locator('[data-test="total-info-label"]');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async checksCheckoutOverviewPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.qtyLabel).toHaveText('QTY');
    await expect(this.descriptionLabel).toHaveText('Description');
    await expect(this.paymentInfoLabel).toHaveText('Payment Information:');
    await expect(this.shippingInfoLabel).toHaveText('Shipping Information:');
    await expect(this.priceTotalLabel).toHaveText('Price Total');
    await expect(this.cancelButton).toBeVisible();
    await expect(this.finishButton).toBeVisible();
    await this.navBar.checksNavBar();
    await this.footer.checksFooter();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
