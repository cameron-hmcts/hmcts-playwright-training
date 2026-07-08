import { test } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test('performance glitch user can log in and see the products page', async ({ loginPage, inventoryPage }) => {
  await loginPage.navigate();
  await loginPage.checksLoginPage();
  await loginPage.login(getRequiredEnv('TEST_USER_PERFORMANCE_GLITCH'), getRequiredEnv('TEST_PASSWORD'));

  await inventoryPage.checksInventoryPage();
});
