import { test, expect } from '@playwright/test';

test.describe('Data Processing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data.html');
  });

  test('should display data processing interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Data Processing');
    await expect(page.locator('[data-testid="data-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="process-data"]')).toBeVisible();
    
    // Screenshot of data processing interface
    await page.screenshot({ path: 'test-results/screenshots/data-interface.png', fullPage: true });
  });

  test('should load sample data sets', async ({ page }) => {
    // Test sample 1 (1-10)
    await page.click('[data-testid="load-sample-1"]');
    await expect(page.locator('[data-testid="data-input"]')).toHaveValue('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
    
    // Screenshot with sample data 1
    await page.screenshot({ path: 'test-results/screenshots/data-sample-1.png' });
    
    // Test sample 2 (random)
    await page.click('[data-testid="load-sample-2"]');
    const sample2Value = await page.locator('[data-testid="data-input"]').inputValue();
    expect(sample2Value.split(',').length).toBe(20);
    
    // Test sample 3 (large dataset)
    await page.click('[data-testid="load-sample-3"]');
    const sample3Value = await page.locator('[data-testid="data-input"]').inputValue();
    expect(sample3Value.split(',').length).toBe(100);
    
    // Screenshot with large dataset
    await page.screenshot({ path: 'test-results/screenshots/data-sample-3.png' });
  });

  test('should clear data', async ({ page }) => {
    // Load some data first
    await page.click('[data-testid="load-sample-1"]');
    
    // Clear data
    await page.click('[data-testid="clear-data"]');
    
    await expect(page.locator('[data-testid="data-input"]')).toHaveValue('');
    
    // Screenshot after clearing
    await page.screenshot({ path: 'test-results/screenshots/data-cleared.png' });
  });

  test('should process data and show statistics', async ({ page }) => {
    // Load sample data
    await page.click('[data-testid="load-sample-1"]');
    
    // Process data
    await page.click('[data-testid="process-data"]');
    
    // Wait for processing to complete
    await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
    
    // Verify statistics are displayed
    await expect(page.locator('[data-testid="result-count"]')).toContainText('10');
    await expect(page.locator('[data-testid="result-sum"]')).toContainText('55');
    await expect(page.locator('[data-testid="result-mean"]')).toContainText('5.5');
    await expect(page.locator('[data-testid="result-median"]')).toContainText('5.5');
    await expect(page.locator('[data-testid="result-min"]')).toContainText('1');
    await expect(page.locator('[data-testid="result-max"]')).toContainText('10');
    
    // Screenshot of processed results
    await page.screenshot({ path: 'test-results/screenshots/data-processed.png', fullPage: true });
  });

  test('should validate data', async ({ page }) => {
    // Load sample data
    await page.click('[data-testid="load-sample-1"]');
    
    // Validate data
    await page.click('[data-testid="validate-data"]');
    
    // Wait for validation results
    await page.waitForSelector('[data-testid="validation-negatives"]', { timeout: 10000 });
    
    // Verify validation results
    await expect(page.locator('[data-testid="validation-negatives"]')).toContainText('No');
    await expect(page.locator('[data-testid="validation-decimals"]')).toContainText('No');
    await expect(page.locator('[data-testid="validation-outliers"]')).toContainText('No');
    await expect(page.locator('[data-testid="validation-duplicates"]')).toContainText('No');
    
    // Screenshot of validation results
    await page.screenshot({ path: 'test-results/screenshots/data-validation.png', fullPage: true });
  });

  test('should sort data', async ({ page }) => {
    // Enter unsorted data
    await page.fill('[data-testid="data-input"]', '5, 2, 8, 1, 9, 3');
    
    // Sort data
    await page.click('[data-testid="sort-data"]');
    
    // Verify data is sorted
    await expect(page.locator('[data-testid="data-input"]')).toHaveValue('1, 2, 3, 5, 8, 9');
    
    // Screenshot of sorted data
    await page.screenshot({ path: 'test-results/screenshots/data-sorted.png' });
  });

  test('should double data values', async ({ page }) => {
    // Load sample data
    await page.click('[data-testid="load-sample-1"]');
    
    // Double the values
    await page.click('[data-testid="double-data"]');
    
    // Verify values are doubled
    await expect(page.locator('[data-testid="data-input"]')).toHaveValue('2, 4, 6, 8, 10, 12, 14, 16, 18, 20');
    
    // Screenshot of doubled data
    await page.screenshot({ path: 'test-results/screenshots/data-doubled.png' });
  });

  test('should square data values', async ({ page }) => {
    // Enter simple data
    await page.fill('[data-testid="data-input"]', '1, 2, 3, 4, 5');
    
    // Square the values
    await page.click('[data-testid="square-data"]');
    
    // Verify values are squared
    await expect(page.locator('[data-testid="data-input"]')).toHaveValue('1, 4, 9, 16, 25');
    
    // Screenshot of squared data
    await page.screenshot({ path: 'test-results/screenshots/data-squared.png' });
  });

  test('should filter data by threshold', async ({ page }) => {
    // Load sample data
    await page.click('[data-testid="load-sample-1"]');
    
    // Set filter threshold
    await page.fill('[data-testid="filter-value"]', '5');
    
    // Apply filter
    await page.click('[data-testid="filter-data"]');
    
    // Verify only values > 5 remain
    await expect(page.locator('[data-testid="data-input"]')).toHaveValue('6, 7, 8, 9, 10');
    
    // Screenshot of filtered data
    await page.screenshot({ path: 'test-results/screenshots/data-filtered.png' });
  });

  test('should handle empty data input', async ({ page }) => {
    // Try to process empty data
    await page.click('[data-testid="process-data"]');
    
    // Should show warning message
    await expect(page.locator('.alert-warning')).toBeVisible();
    await expect(page.locator('.alert-warning')).toContainText('Please enter some data first');
    
    // Screenshot of empty data warning
    await page.screenshot({ path: 'test-results/screenshots/data-empty-warning.png' });
  });

  test('should handle invalid data input', async ({ page }) => {
    // Enter invalid data
    await page.fill('[data-testid="data-input"]', 'abc, def, ghi');
    
    // Try to process
    await page.click('[data-testid="process-data"]');
    
    // Should show error message
    await expect(page.locator('.alert-danger')).toBeVisible();
    
    // Screenshot of invalid data error
    await page.screenshot({ path: 'test-results/screenshots/data-invalid-error.png' });
  });

  test('should display chart after processing', async ({ page }) => {
    // Load sample data
    await page.click('[data-testid="load-sample-1"]');
    
    // Process data
    await page.click('[data-testid="process-data"]');
    
    // Wait for chart to load
    await page.waitForSelector('[data-testid="chart-container"] canvas', { timeout: 10000 });
    
    // Verify chart is displayed
    await expect(page.locator('[data-testid="chart-container"] canvas')).toBeVisible();
    
    // Screenshot with chart
    await page.screenshot({ path: 'test-results/screenshots/data-with-chart.png', fullPage: true });
  });

  test('should handle complex data processing workflow', async ({ page }) => {
    // Start with random sample data
    await page.click('[data-testid="load-sample-2"]');
    
    // Screenshot of initial data
    await page.screenshot({ path: 'test-results/screenshots/data-workflow-1-initial.png' });
    
    // Process the data
    await page.click('[data-testid="process-data"]');
    await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
    
    // Screenshot of processed results
    await page.screenshot({ path: 'test-results/screenshots/data-workflow-2-processed.png', fullPage: true });
    
    // Validate the data
    await page.click('[data-testid="validate-data"]');
    await page.waitForSelector('[data-testid="validation-negatives"]', { timeout: 10000 });
    
    // Screenshot of validation
    await page.screenshot({ path: 'test-results/screenshots/data-workflow-3-validated.png', fullPage: true });
    
    // Sort the data
    await page.click('[data-testid="sort-data"]');
    
    // Screenshot of sorted data
    await page.screenshot({ path: 'test-results/screenshots/data-workflow-4-sorted.png' });
    
    // Filter data (keep values > 50)
    await page.fill('[data-testid="filter-value"]', '50');
    await page.click('[data-testid="filter-data"]');
    
    // Process filtered data
    await page.click('[data-testid="process-data"]');
    await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/screenshots/data-workflow-5-final.png', fullPage: true });
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Load sample data
    await page.tap('[data-testid="load-sample-1"]');
    
    // Process data on mobile
    await page.tap('[data-testid="process-data"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
    
    // Screenshot of mobile interface
    await page.screenshot({ path: 'test-results/screenshots/data-mobile.png', fullPage: true });
  });

  test('should handle data transformations with error cases', async ({ page }) => {
    // Test square root of negative number
    await page.fill('[data-testid="data-input"]', '-4, 9, 16');
    await page.click('[data-testid="process-data"]');
    await page.waitForTimeout(2000);
    
    // Screenshot with mixed positive/negative data
    await page.screenshot({ path: 'test-results/screenshots/data-mixed-numbers.png', fullPage: true });
    
    // Test division by zero scenario (if applicable)
    await page.fill('[data-testid="data-input"]', '0, 1, 2, 3');
    await page.click('[data-testid="process-data"]');
    await page.waitForTimeout(2000);
    
    // Screenshot with zero included
    await page.screenshot({ path: 'test-results/screenshots/data-with-zero.png', fullPage: true });
  });

  test('should record complete data analysis session', async ({ page }) => {
    // Complete data analysis workflow with video recording
    
    // 1. Load large dataset
    await page.click('[data-testid="load-sample-3"]');
    await page.waitForTimeout(1000);
    
    // 2. Process initial data
    await page.click('[data-testid="process-data"]');
    await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
    
    // 3. Validate data quality
    await page.click('[data-testid="validate-data"]');
    await page.waitForSelector('[data-testid="validation-negatives"]', { timeout: 10000 });
    
    // 4. Apply transformations
    await page.click('[data-testid="double-data"]');
    await page.waitForTimeout(500);
    
    // 5. Filter high values
    await page.fill('[data-testid="filter-value"]', '1000');
    await page.click('[data-testid="filter-data"]');
    
    // 6. Final analysis
    await page.click('[data-testid="process-data"]');
    await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/screenshots/data-analysis-complete.png', fullPage: true });
  });
});
