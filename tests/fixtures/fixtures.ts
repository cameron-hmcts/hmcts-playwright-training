import { test as baseTest } from '@playwright/test';
import { pageFixtures, PageFixtures } from './page-fixtures';
import { axeFixtures, AxeFixtures } from './axe-fixture';

export const test = baseTest.extend<PageFixtures & AxeFixtures>({
  ...pageFixtures,
  ...axeFixtures,
});

export { expect } from '@playwright/test';
