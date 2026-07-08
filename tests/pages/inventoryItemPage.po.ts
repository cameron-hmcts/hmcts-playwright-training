import { expect, Page, Locator } from '@playwright/test';

export class InventoryItemPage {
  private readonly page: Page;
  private readonly backToProductsButton: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.cartLink = page.locator('a[data-test="shopping-cart-link"]');
  }

  async checksInventoryItemPage(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory-item.html/);
    await expect(this.backToProductsButton).toBeVisible();
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async checksItemAddedToCart(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
