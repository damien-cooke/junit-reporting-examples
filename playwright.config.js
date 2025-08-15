import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const enableBranded = !!process.env.PLAYWRIGHT_BRANDED;

export default defineConfig({
  testDir: './tests/playwright',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/playwright-results.xml' }],
  ['json', { outputFile: 'test-results/playwright-results.json' }],
  // Allure results for Playwright E2E tests
  ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
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
