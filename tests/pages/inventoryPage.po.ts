import { expect, Page, Locator } from '@playwright/test';
import { NavBarComponent } from '../components/navBar.component';

export class InventoryPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly inventoryItemDescriptions: Locator;
  readonly navBar: NavBarComponent;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Products');
    this.inventoryItemDescriptions = page.locator('.inventory_item_description');
    this.navBar = new NavBarComponent(page);
  }

  async checksInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toBeVisible();
    await this.navBar.checksNavBar();
  }

  async selectProduct(productName: string): Promise<void> {
    await this.inventoryItemDescriptions.getByRole('link', { name: productName }).click();
  }
}
