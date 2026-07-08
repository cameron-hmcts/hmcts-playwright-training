import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.po';
import { InventoryPage } from '../pages/inventoryPage.po';
import { InventoryItemPage } from '../pages/inventoryItemPage.po';
import { CartPage } from '../pages/cartPage.po';
import { CheckoutInfoPage } from '../pages/checkoutInfoPage.po';
import { CheckoutOverviewPage } from '../pages/checkoutOverviewPage.po';
import { CheckoutCompletePage } from '../pages/checkoutCompletePage.po';

export interface PageFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryItemPage: InventoryItemPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
}

export const pageFixtures = {
  loginPage: async ({ page }: { page: Page }, use: (r: LoginPage) => Promise<void>) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }: { page: Page }, use: (r: InventoryPage) => Promise<void>) => {
    await use(new InventoryPage(page));
  },
  inventoryItemPage: async ({ page }: { page: Page }, use: (r: InventoryItemPage) => Promise<void>) => {
    await use(new InventoryItemPage(page));
  },
  cartPage: async ({ page }: { page: Page }, use: (r: CartPage) => Promise<void>) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }: { page: Page }, use: (r: CheckoutInfoPage) => Promise<void>) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }: { page: Page }, use: (r: CheckoutOverviewPage) => Promise<void>) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }: { page: Page }, use: (r: CheckoutCompletePage) => Promise<void>) => {
    await use(new CheckoutCompletePage(page));
  },
};
