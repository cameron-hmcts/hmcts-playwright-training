import { expect, Page, Locator } from '@playwright/test';

export class CheckoutInfoPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Checkout: Your Information');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async checksCheckoutInfoPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    await expect(this.pageTitle).toBeVisible();
  }

  async fillDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}
