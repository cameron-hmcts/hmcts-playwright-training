import { expect, Page, Locator } from '@playwright/test';
import { NavBarComponent } from '../components/navBar.component';

export class CheckoutOverviewPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly finishButton: Locator;
  readonly navBar: NavBarComponent;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Checkout: Overview');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.navBar = new NavBarComponent(page);
  }

  async checksCheckoutOverviewPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.finishButton).toBeVisible();
    await this.navBar.checksNavBar();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
