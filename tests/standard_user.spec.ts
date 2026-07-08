import { test } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test('standard user can buy a backpack and complete checkout', async ({ loginPage, inventoryPage, inventoryItemPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
  await loginPage.navigate();
  await loginPage.checksLoginPage();
  await loginPage.login(getRequiredEnv('TEST_USER_STANDARD'), getRequiredEnv('TEST_PASSWORD'));

  await inventoryPage.checksInventoryPage();
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
