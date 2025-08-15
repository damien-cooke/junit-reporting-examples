import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const enableBranded = !!process.env.PLAYWRIGHT_BRANDED;

// Build reporters dynamically to optionally include Extent reporter
const reporters = [
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'test-results/playwright-results.xml' }],
  ['json', { outputFile: 'test-results/playwright-results.json' }],
  // Allure results for Playwright E2E tests
  ['allure-playwright', { outputFolder: 'allure-results' }],
];

if (process.env.PLAYWRIGHT_EXTENT === '1') {
  // Adds Extent HTML reporter (installed in CI without altering package-lock)
  reporters.push(['playwright-extent-reporter', { outputFolder: 'extent-report' }]);
}

export default defineConfig({
  testDir: './tests/playwright',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only (set to 0 for speed) */
  retries: process.env.CI ? 0 : 0,
  /* Use multiple workers on CI for parallelism */
  workers: process.env.CI ? '100%' : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

  /* Collect trace on failures so Allure includes it without requiring a retry */
  trace: 'retain-on-failure',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'retain-on-failure',

    /* Viewport size */
  viewport: { width: 1280, height: 720 },
  // Fail faster on missing elements/actions
  actionTimeout: 2 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'], deviceScaleFactor: 1 },
    },
    {
      name: 'Mobile Safari',
  use: { ...devices['iPhone 12'], deviceScaleFactor: 1 },
    },
    
    // Include branded browser channels only when explicitly enabled
    ...(
      enableBranded
        ? [
            { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
            { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
          ]
        : []
    ),
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global test timeout */
  timeout: 5 * 1000,

  /* Expect timeout */
  expect: {
    timeout: 5 * 1000,
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/playwright-artifacts',
});
