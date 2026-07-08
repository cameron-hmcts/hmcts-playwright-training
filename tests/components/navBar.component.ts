import { expect, Page, Locator } from '@playwright/test';

/**
 * NavBarComponent encapsulates all interactions with the top navigation bar
 * and the slide-out burger menu present on every authenticated page.
 */
export class NavBarComponent {
  private readonly page: Page;

  // Top bar
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;

  // Burger-menu items (visible once menu is open)
  private readonly allItemsLink: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppStateLink: Locator;
  private readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink = page.locator('a[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });

    this.allItemsLink = page.getByRole('link', { name: 'All Items' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.resetAppStateLink = page.getByRole('link', { name: 'Reset App State' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
  }

  /** Assert the nav bar is fully rendered. */
  async checksNavBar(): Promise<void> {
    await expect(this.menuButton).toBeVisible();
    await expect(this.cartLink).toBeVisible();
  }

  /** Assert the cart badge shows the expected item count. */
  async checksCartCount(expectedCount: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }

  /** Navigate to the cart. */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Open the burger menu. */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await expect(this.closeMenuButton).toBeVisible();
  }

  /** Close the burger menu. */
  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
    await expect(this.menuButton).toBeVisible();
  }

  /** Navigate to the inventory list via the burger menu. */
  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  /** Log out via the burger menu. */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /** Reset app state via the burger menu. */
  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateLink.click();
  }
}
