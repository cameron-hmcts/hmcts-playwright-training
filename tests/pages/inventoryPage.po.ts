import { expect, Page, Locator } from '@playwright/test';

export class InventoryPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly menuButton: Locator;
  private readonly inventoryItemDescriptions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Products');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.inventoryItemDescriptions = page.locator('.inventory_item_description');
  }

  async checksInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.menuButton).toBeVisible();
  }

  async selectProduct(productName: string): Promise<void> {
    await this.inventoryItemDescriptions.getByRole('link', { name: productName }).click();
  }
}
