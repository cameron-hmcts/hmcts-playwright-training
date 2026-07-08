import { test } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test('locked out user sees an error and cannot log in', async ({ loginPage }) => {
  await loginPage.navigate();
  await loginPage.checksLoginPage();
  await loginPage.login(getRequiredEnv('TEST_USER_LOCKED_OUT'), getRequiredEnv('TEST_PASSWORD'));
  await loginPage.checksErrorMessage(getRequiredEnv('TEST_USER_LOCKED_OUT'));
});