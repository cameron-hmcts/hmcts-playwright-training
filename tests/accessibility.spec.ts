import { test, expect } from './fixtures/fixtures';
import { getRequiredEnv } from './helpers/env';

test.describe('SauceDemo Accessibility Audits', () => {
  test('Login Page Accessibility Audit using makeAxeBuilder fixture', async ({ loginPage, makeAxeBuilder }, testInfo) => {
    await loginPage.navigate();
    await loginPage.checksLoginPage();

    // Use centralized makeAxeBuilder fixture configured with WCAG A/AA
    const axeResults = await makeAxeBuilder().analyze();

    // Attach results to testInfo
    await testInfo.attach('a11y-results', {
      body: JSON.stringify(axeResults.violations, null, 2),
      contentType: 'application/json',
    });

    console.log(`[A11y Check] Login Page Violations: ${axeResults.violations.length}`);
  });

  test('Inventory Page Accessibility Audit using auditA11y helper fixture', async ({ loginPage, inventoryPage, auditA11y }) => {
    await loginPage.navigate();
    await loginPage.login(getRequiredEnv('TEST_USER_STANDARD'), getRequiredEnv('TEST_PASSWORD'));
    await inventoryPage.checksInventoryPage();

    // fixture that analyzes page and automatically attaches 'a11y-results' to testInfo
    const results = await auditA11y();
    console.log(`[A11y Check] Inventory Page Violations: ${results.violations.length}`);
  });

  test('Cart Page Accessibility Audit', async ({ loginPage, inventoryPage, cartPage, makeAxeBuilder }, testInfo) => {
    await loginPage.navigate();
    await loginPage.login(getRequiredEnv('TEST_USER_STANDARD'), getRequiredEnv('TEST_PASSWORD'));
    await inventoryPage.checksInventoryPage();
    await inventoryPage.navBar.goToCart();
    await cartPage.checksCartPage();

    const axeResults = await makeAxeBuilder().analyze();
    await testInfo.attach('a11y-results', {
      body: JSON.stringify(axeResults.violations, null, 2),
      contentType: 'application/json',
    });

    console.log(`[A11y Check] Cart Page Violations: ${axeResults.violations.length}`);
  });
});
