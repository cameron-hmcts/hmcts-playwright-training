import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export interface AxeNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

export interface AxeViolationItem {
  id: string;
  impact?: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  tags?: string[];
  description: string;
  help?: string;
  helpUrl?: string;
  nodes?: AxeNode[];
}

export interface TestA11yResult {
  testTitle: string;
  fileLocation: string;
  totalViolations: number;
  violations: AxeViolationItem[];
}

export interface RuleSummary {
  id: string;
  impact: string;
  description: string;
  helpUrl: string;
  occurrences: number;
  affectedTestsCount: number;
}

export default class A11yReporter implements Reporter {
  private totalAudits = 0;
  private totalViolations = 0;
  private testResults: TestA11yResult[] = [];
  private ruleSummaries: Map<string, RuleSummary> = new Map();
  private impactCounts = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    unknown: 0,
  };

  onBegin() {
    this.totalAudits = 0;
    this.totalViolations = 0;
    this.testResults = [];
    this.ruleSummaries.clear();
    this.impactCounts = { critical: 0, serious: 0, moderate: 0, minor: 0, unknown: 0 };
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const a11yAttachments = result.attachments.filter(
      (a) => a.name === 'a11y-results' || a.name.startsWith('a11y-results')
    );

    if (a11yAttachments.length === 0) {
      return;
    }

    this.totalAudits += a11yAttachments.length;
    const testTitle = test.titlePath().filter(Boolean).join(' > ');
    const relativeFilePath = test.location?.file
      ? path.relative(process.cwd(), test.location.file)
      : 'unknown test file';
    const fileLocation = test.location ? `${relativeFilePath}:${test.location.line}` : relativeFilePath;

    const testViolations: AxeViolationItem[] = [];

    for (const attachment of a11yAttachments) {
      let rawJson: string | null = null;

      if (attachment.body) {
        rawJson = attachment.body.toString('utf-8');
      } else if (attachment.path && fs.existsSync(attachment.path)) {
        rawJson = fs.readFileSync(attachment.path, 'utf-8');
      }

      if (!rawJson) continue;

      try {
        const parsed = JSON.parse(rawJson);
        let violationsList: AxeViolationItem[] = [];

        if (Array.isArray(parsed)) {
          violationsList = parsed;
        } else if (parsed && Array.isArray(parsed.violations)) {
          violationsList = parsed.violations;
        }

        for (const v of violationsList) {
          testViolations.push(v);
          const nodeCount = v.nodes && v.nodes.length > 0 ? v.nodes.length : 1;
          this.totalViolations += nodeCount;

          const impactKey = (v.impact || 'unknown').toLowerCase();
          if (impactKey in this.impactCounts) {
            this.impactCounts[impactKey as keyof typeof this.impactCounts] += nodeCount;
          } else {
            this.impactCounts.unknown += nodeCount;
          }

          const existingRule = this.ruleSummaries.get(v.id);
          if (existingRule) {
            existingRule.occurrences += nodeCount;
            existingRule.affectedTestsCount += 1;
          } else {
            this.ruleSummaries.set(v.id, {
              id: v.id,
              impact: v.impact || 'unknown',
              description: v.description || v.help || '',
              helpUrl: v.helpUrl || '',
              occurrences: nodeCount,
              affectedTestsCount: 1,
            });
          }
        }
      } catch (err) {
        console.error(`[A11yReporter] Failed to parse accessibility JSON attachment for "${testTitle}":`, err);
      }
    }

    if (testViolations.length > 0) {
      const nodeSum = testViolations.reduce((sum, v) => sum + (v.nodes?.length || 1), 0);
      this.testResults.push({
        testTitle,
        fileLocation,
        totalViolations: nodeSum,
        violations: testViolations,
      });
    }
  }

  onEnd(_result: FullResult) {
    this.printConsoleSummary();
    this.writeReportArtifact();
  }

  private printConsoleSummary() {
    const divider = '='.repeat(78);
    const subDivider = '-'.repeat(78);

    console.log(`\n${divider}`);
    console.log(`                     ACCESSIBILITY AUDIT SUMMARY                        `);
    console.log(`${divider}`);
    console.log(`Audited Tests/Pages : ${this.totalAudits}`);
    console.log(`Total Violations    : ${this.totalViolations}`);
    console.log(`Tests with Issues   : ${this.testResults.length}`);
    console.log(`Impact Breakdown    : 🔴 Critical: ${this.impactCounts.critical} | 🟠 Serious: ${this.impactCounts.serious} | 🟡 Moderate: ${this.impactCounts.moderate} | 🔵 Minor: ${this.impactCounts.minor}`);
    console.log(`${divider}`);

    if (this.totalViolations === 0) {
      console.log(`\n✅  NO ACCESSIBILITY VIOLATIONS FOUND ACROSS ALL AUDITED TESTS!\n`);
      return;
    }

    console.log(`\n--- VIOLATIONS BREAKDOWN BY RULE ---`);
    console.log(
      `${'Rule ID'.padEnd(25)} | ${'Impact'.padEnd(10)} | ${'Occurrences'.padEnd(12)} | ${'Description'}`
    );
    console.log(subDivider);

    for (const rule of this.ruleSummaries.values()) {
      const impactSymbol =
        rule.impact === 'critical'
          ? 'CRITICAL'
          : rule.impact === 'serious'
          ? 'SERIOUS'
          : rule.impact === 'moderate'
          ? 'MODERATE'
          : rule.impact === 'minor'
          ? 'MINOR'
          : rule.impact.toUpperCase();

      const shortDesc =
        rule.description.length > 35 ? rule.description.substring(0, 32) + '...' : rule.description;

      console.log(
        `${rule.id.padEnd(25)} | ${impactSymbol.padEnd(10)} | ${String(rule.occurrences).padEnd(12)} | ${shortDesc}`
      );
    }

    console.log(`\n--- DETAILED PAGES / TESTS WITH ACCESSIBILITY ISSUES ---`);

    for (const testRes of this.testResults) {
      console.log(`\n📍 ${testRes.testTitle}`);
      console.log(`   File: ${testRes.fileLocation}`);
      console.log(`   Failures Found: ${testRes.totalViolations}`);

      for (const violation of testRes.violations) {
        console.log(`   └─ [${(violation.impact || 'unknown').toUpperCase()}] ${violation.id}: ${violation.description}`);
        if (violation.helpUrl) {
          console.log(`      Docs: ${violation.helpUrl}`);
        }

        if (violation.nodes && violation.nodes.length > 0) {
          console.log(`      Affected Elements (${violation.nodes.length}):`);
          const maxNodesToShow = 3;
          violation.nodes.slice(0, maxNodesToShow).forEach((node, idx) => {
            const targetSel = node.target ? node.target.join(' > ') : 'N/A';
            const snippet = node.html ? node.html.replace(/\s+/g, ' ').trim() : '';
            const truncatedSnippet = snippet.length > 70 ? snippet.substring(0, 67) + '...' : snippet;
            console.log(`        ${idx + 1}. Selector: "${targetSel}"`);
            if (truncatedSnippet) {
              console.log(`           HTML: ${truncatedSnippet}`);
            }
          });
          if (violation.nodes.length > maxNodesToShow) {
            console.log(`        ... and ${violation.nodes.length - maxNodesToShow} more element(s)`);
          }
        }
      }
    }

    console.log(`\n${divider}\n`);
  }

  private writeReportArtifact() {
    try {
      const outputDir = path.join(process.cwd(), 'test-results');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const reportData = {
        generatedAt: new Date().toISOString(),
        totalAudits: this.totalAudits,
        totalViolations: this.totalViolations,
        testsWithIssuesCount: this.testResults.length,
        impactCounts: this.impactCounts,
        ruleSummaries: Array.from(this.ruleSummaries.values()),
        testResults: this.testResults,
      };

      const filePath = path.join(outputDir, 'accessibility-report.json');
      fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2), 'utf-8');
    } catch (err) {
      console.error('[A11yReporter] Failed to write accessibility report JSON file:', err);
    }
  }
}
