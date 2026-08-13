import { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';
import { AuditOptions, AxeUtils } from '../../utils/axe.utils';

export type MakeAxeBuilder = (options?: AuditOptions) => AxeBuilder;

export type AuditA11yFn = (
  options?: AuditOptions & { attachmentName?: string; assertNoViolations?: boolean }
) => Promise<AxeResults>;

export interface AxeFixtures {
  makeAxeBuilder: MakeAxeBuilder;
  auditA11y: AuditA11yFn;
  axeUtils: AxeUtils;
}

export const axeFixtures = {
  makeAxeBuilder: async ({ page }: { page: Page }, use: (r: MakeAxeBuilder) => Promise<void>) => {
    const builderFactory = (options?: AuditOptions) => {
      const utils = new AxeUtils(page);
      return utils.createBuilder(options);
    };

    await use(builderFactory);
  },

  axeUtils: async ({ page }: { page: Page }, use: (r: AxeUtils) => Promise<void>) => {
    await use(new AxeUtils(page));
  },

  auditA11y: async (
    { axeUtils }: { axeUtils: AxeUtils },
    use: (r: AuditA11yFn) => Promise<void>,
    testInfo: TestInfo
  ) => {
    const auditFn: AuditA11yFn = async (options) => {
      return await axeUtils.audit(testInfo, options);
    };

    await use(auditFn);
  },
};
