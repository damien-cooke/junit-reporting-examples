// Optional Allure metadata wiring for Playwright tests.
// Import in tests when needed: import { test } from '@playwright/test';
// Example: test.info().annotations.push({ type: 'feature', description: 'Users' })
import { test as base } from '@playwright/test';

export const test = base.extend({
  // You can add per-test hooks to attach logs or environment; left minimal intentionally.
});

export const expect = test.expect;
