import { expect, Page, Locator } from '@playwright/test';
import { NavBarComponent } from '../components/navBar.component';

export class CartPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly checkoutButton: Locator;
  readonly navBar: NavBarComponent;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Your Cart');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.navBar = new NavBarComponent(page);
  }

  async checksCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
    await this.navBar.checksNavBar();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
