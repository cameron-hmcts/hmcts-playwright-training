import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  private readonly logoText: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly acceptedUsernamesLabel: Locator;
  private readonly passwordLabel: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.logoText = page.locator('.login_logo');
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.acceptedUsernamesLabel = page.locator('[data-test="login-credentials"]');
    this.passwordLabel = page.locator('[data-test="login-password"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(user: string, pass: string): Promise<void> {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async checksLoginPage(): Promise<void> {
    await expect(this.logoText).toHaveText('Swag Labs');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.acceptedUsernamesLabel).toBeVisible();
    await expect(this.passwordLabel).toBeVisible();
  }

  async checksErrorMessage(expectedUsername: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.usernameInput).toHaveValue(expectedUsername);
  }
}
