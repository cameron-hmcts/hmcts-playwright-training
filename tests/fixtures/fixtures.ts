import { test as baseTest } from '@playwright/test';
import { pageFixtures, PageFixtures } from './page-fixtures';

export const test = baseTest.extend<PageFixtures>({
  ...pageFixtures,
});

export { expect } from '@playwright/test';
