import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly qtyLabel: Locator;
  private readonly descriptionLabel: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.qtyLabel = page.locator('[data-test="cart-quantity-label"]');
    this.descriptionLabel = page.locator('[data-test="cart-desc-label"]');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checksCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toHaveText('Your Cart');
    await expect(this.qtyLabel).toHaveText('QTY');
    await expect(this.descriptionLabel).toHaveText('Description');
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
    await this.navBar.checksNavBar();
    await this.footer.checksFooter();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
