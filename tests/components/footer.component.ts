import { expect, Page, Locator } from '@playwright/test';

export class FooterComponent {
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedInLink: Locator;
  readonly footerCopy: Locator;

  constructor(page: Page) {
    this.twitterLink = page.locator('.social_twitter a');
    this.facebookLink = page.locator('.social_facebook a');
    this.linkedInLink = page.locator('.social_linkedin a');
    this.footerCopy = page.locator('.footer_copy');
  }

  /** Assert the footer is fully rendered with all social links and copyright text. */
  async checksFooter(): Promise<void> {
    await expect(this.twitterLink).toBeVisible();
    await expect(this.facebookLink).toBeVisible();
    await expect(this.linkedInLink).toBeVisible();
    await expect(this.footerCopy).toBeVisible();
  }
}
