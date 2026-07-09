import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryItemPage extends BasePage {
  private readonly backToProductsButton: Locator;
  private readonly itemName: Locator;
  private readonly itemDesc: Locator;
  private readonly itemPrice: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDesc = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
  }

  async checksInventoryItemPage(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory-item.html/);
    await expect(this.backToProductsButton).toBeVisible();
    await expect(this.itemName).toHaveText(productName);
    await expect(this.itemDesc).toBeVisible();
    await expect(this.itemPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await this.navBar.checksNavBar();
    await this.footer.checksFooter();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async checksItemAddedToCart(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
  }

  async goToCart(): Promise<void> {
    await this.navBar.goToCart();
  }
}
