import { test } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test.describe('standard user checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.checksLoginPage();
    await loginPage.login(getRequiredEnv('TEST_USER_STANDARD'), getRequiredEnv('TEST_PASSWORD'));
    await inventoryPage.checksInventoryPage();
  });

  test('can buy a backpack and complete checkout', async ({ inventoryPage, inventoryItemPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await inventoryPage.selectProduct('Sauce Labs Backpack');

    await inventoryItemPage.checksInventoryItemPage('Sauce Labs Backpack');
    await inventoryItemPage.addToCart();
    await inventoryItemPage.checksItemAddedToCart();
    await inventoryItemPage.goToCart();

    await cartPage.checksCartPage();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.checksCheckoutInfoPage();
    await checkoutInfoPage.fillDetails('Tess', 'Ter', 'SW1A1AA');

    await checkoutOverviewPage.checksCheckoutOverviewPage();
    await checkoutOverviewPage.finish();

    await checkoutCompletePage.checksCheckoutCompletePage();
  });

  test('can remove a backpack from cart before checkout', async ({ inventoryPage, inventoryItemPage, cartPage }) => {
    await inventoryPage.selectProduct('Sauce Labs Backpack');

    await inventoryItemPage.checksInventoryItemPage('Sauce Labs Backpack');
    await inventoryItemPage.addToCart();
    await inventoryItemPage.checksItemAddedToCart();
    await inventoryItemPage.removeFromCart();
    await inventoryItemPage.checksItemRemovedFromCart();
    await inventoryItemPage.navBar.checksCartIsEmpty();

    await inventoryItemPage.goToCart();
    await cartPage.checksCartPage();
    await cartPage.navBar.checksCartIsEmpty();
  });
});
