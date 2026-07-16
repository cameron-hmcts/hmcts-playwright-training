import { test } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test.describe('performance glitch user inventory', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.checksLoginPage();
    await loginPage.login(getRequiredEnv('TEST_USER_PERFORMANCE_GLITCH'), getRequiredEnv('TEST_PASSWORD'));
  });

  test('can log in and see the products page', async ({ inventoryPage }) => {
    await inventoryPage.checksInventoryPage();
  });
});
