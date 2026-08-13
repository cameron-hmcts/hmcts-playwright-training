import { AxeBuilder } from '@axe-core/playwright';
import { Page, TestInfo, expect } from '@playwright/test';
import type { AxeResults, Result } from 'axe-core';

export interface AuditOptions {
  exclude?: string | string[];
  include?: string | string[];
  disableRules?: string | string[];
  tags?: string[];
}

export interface AxeAuditResult {
  url: string;
  results: AxeResults;
}

const normaliseArray = <T>(value?: T | T[]): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export class AxeUtils {
  public static readonly DEFAULT_TAGS = [
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ];

  private resultsList: AxeAuditResult[] = [];

  constructor(protected readonly page: Page) {}

  private applySelectors(
    builder: AxeBuilder,
    method: 'exclude' | 'include',
    selectors?: string | string[]
  ): void {
    for (const selector of normaliseArray(selectors)) {
      builder[method](selector);
    }
  }

  /**
   * Builds an AxeBuilder instance pre-configured with default tags and options
   */
  public createBuilder(options?: AuditOptions): AxeBuilder {
    const builder = new AxeBuilder({
      page: this.page as unknown as import('playwright-core').Page,
    }).withTags(options?.tags ?? AxeUtils.DEFAULT_TAGS);

    // Exclude default noise if any
    this.applySelectors(builder, 'exclude', '#known-third-party-widget');

    this.applySelectors(builder, 'exclude', options?.exclude);
    this.applySelectors(builder, 'include', options?.include);

    const disableRules = normaliseArray(options?.disableRules);
    if (disableRules.length > 0) {
      builder.disableRules(disableRules);
    }

    return builder;
  }

  /**
   * Run the AxeBuilder checks using the pre-determined tags and attach results to testInfo
   */
  public async audit(
    testInfo?: TestInfo,
    options?: AuditOptions & { attachmentName?: string; assertNoViolations?: boolean }
  ): Promise<AxeResults> {
    const builder = this.createBuilder(options);
    const results = await builder.analyze();
    this.resultsList.push({ url: this.page.url(), results });

    if (testInfo) {
      await this.attachResults(testInfo, results.violations, options?.attachmentName);
    }

    if (options?.assertNoViolations) {
      expect(results.violations, `Accessibility violations found on ${this.page.url()}`).toEqual([]);
    }

    return results;
  }

  /**
   * Attach Axe JSON violations directly to Playwright's testInfo object.
   * This bridges Playwright worker process and main reporting process.
   */
  public async attachResults(
    testInfo: TestInfo,
    violations: Result[],
    attachmentName: string = 'a11y-results'
  ): Promise<void> {
    await testInfo.attach(attachmentName, {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
  }

  public getResultsList(): AxeAuditResult[] {
    return this.resultsList;
  }
}
