import { test } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test('visual user can log in and see the products page', async ({ loginPage, inventoryPage }) => {
  await loginPage.navigate();
  await loginPage.checksLoginPage();
  await loginPage.login(getRequiredEnv('TEST_USER_VISUAL'), getRequiredEnv('TEST_PASSWORD'));

  await inventoryPage.checksInventoryPage();
});
