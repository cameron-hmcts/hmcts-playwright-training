import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly sortDropdown: Locator;
  private readonly inventoryItemDescriptions: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemDescriptions = page.locator('.inventory_item_description');
  }

  async checksInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.sortDropdown).toBeVisible();
    await this.navBar.checksNavBar();
    await this.footer.checksFooter();
  }

  async selectProduct(productName: string): Promise<void> {
    await this.inventoryItemDescriptions.getByRole('link', { name: productName }).click();
  }
}
