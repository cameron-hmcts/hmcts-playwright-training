import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutInfoPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly cancelButton: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async checksCheckoutInfoPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await this.navBar.checksNavBar();
    await this.footer.checksFooter();
  }

  async fillDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}
