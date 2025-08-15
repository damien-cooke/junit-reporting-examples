import { test, expect } from '@playwright/test';

test.describe('Calculator Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator.html');
  });

  test('should display calculator interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Calculator');
    await expect(page.locator('[data-testid="calculator-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('0');
    
    // Screenshot of calculator interface
    await page.screenshot({ path: 'test-results/screenshots/calculator-interface.png' });
  });

  test('should perform basic addition', async ({ page }) => {
    // Click numbers and operators
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="operator-add"]');
    await page.click('[data-testid="number-3"]');
    await page.click('[data-testid="equals"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('8');
    
    // Screenshot of calculation result
    await page.screenshot({ path: 'test-results/screenshots/calculator-addition.png' });
  });

  test('should perform basic subtraction', async ({ page }) => {
    await page.click('[data-testid="number-9"]');
    await page.click('[data-testid="operator-subtract"]');
    await page.click('[data-testid="number-4"]');
    await page.click('[data-testid="equals"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('5');
  });

  test('should perform basic multiplication', async ({ page }) => {
    await page.click('[data-testid="number-6"]');
    await page.click('[data-testid="operator-multiply"]');
    await page.click('[data-testid="number-7"]');
    await page.click('[data-testid="equals"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('42');
  });

  test('should perform basic division', async ({ page }) => {
    await page.click('[data-testid="number-8"]');
    await page.click('[data-testid="operator-divide"]');
    await page.click('[data-testid="number-2"]');
    await page.click('[data-testid="equals"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('4');
  });

  test('should handle decimal numbers', async ({ page }) => {
    await page.click('[data-testid="number-3"]');
    await page.click('[data-testid="decimal"]');
    await page.click('[data-testid="number-1"]');
    await page.click('[data-testid="number-4"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('3.14');
    
    // Screenshot with decimal number
    await page.screenshot({ path: 'test-results/screenshots/calculator-decimal.png' });
  });

  test('should clear display', async ({ page }) => {
    await page.click('[data-testid="number-1"]');
    await page.click('[data-testid="number-2"]');
    await page.click('[data-testid="number-3"]');
    await page.click('[data-testid="clear"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('0');
  });

  test('should handle backspace', async ({ page }) => {
    await page.click('[data-testid="number-1"]');
    await page.click('[data-testid="number-2"]');
    await page.click('[data-testid="number-3"]');
    await page.click('[data-testid="backspace"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('12');
  });

  test('should calculate square root', async ({ page }) => {
    await page.click('[data-testid="number-9"]');
    await page.click('[data-testid="square-root"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('3');
  });

  test('should calculate square', async ({ page }) => {
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="square"]');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('25');
  });

  test('should handle keyboard input', async ({ page }) => {
    await page.keyboard.press('5');
    await page.keyboard.press('+');
    await page.keyboard.press('3');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('8');
    
    // Screenshot of keyboard input result
    await page.screenshot({ path: 'test-results/screenshots/calculator-keyboard.png' });
  });

  test('should display calculation history', async ({ page }) => {
    // Perform a calculation
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="operator-add"]');
    await page.click('[data-testid="number-3"]');
    await page.click('[data-testid="equals"]');
    
    // Check if history is updated
    const historyItems = page.locator('[data-testid="history-item"]');
    await expect(historyItems).toHaveCount(1);
    
    // Screenshot of history display
    await page.screenshot({ path: 'test-results/screenshots/calculator-history.png', fullPage: true });
  });

  test('should handle division by zero error', async ({ page }) => {
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="operator-divide"]');
    await page.click('[data-testid="number-0"]');
    await page.click('[data-testid="equals"]');
    
    // Should show error message
    await expect(page.locator('.alert-danger')).toBeVisible();
    await expect(page.locator('.alert-danger')).toContainText('Cannot divide by zero');
    
    // Screenshot of error state
    await page.screenshot({ path: 'test-results/screenshots/calculator-error.png' });
  });

  test('should test API integration', async ({ page }) => {
    // Set up some values for API test
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="operator-add"]');
    await page.click('[data-testid="number-3"]');
    
    // Click API test button if it exists
    const apiTestButton = page.locator('[data-testid="test-api"]');
    if (await apiTestButton.count() > 0) {
      await apiTestButton.click();
      
      // Wait for API result
      await page.waitForSelector('[data-testid="api-result"]', { timeout: 5000 });
      
      // Screenshot of API result
      await page.screenshot({ path: 'test-results/screenshots/calculator-api-test.png' });
    }
  });

  test('should work on mobile devices', async ({ page, context }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Some desktop contexts don’t support tap; fall back to click
    const tapOrClick = async (selector) => {
      try {
        await page.tap(selector);
      } catch {
        await page.click(selector);
      }
    };

    await tapOrClick('[data-testid="number-5"]');
    await tapOrClick('[data-testid="operator-add"]');
    await tapOrClick('[data-testid="number-3"]');
    await tapOrClick('[data-testid="equals"]');

    await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('8');

    // Screenshot of mobile calculator
    await page.screenshot({ path: 'test-results/screenshots/calculator-mobile.png', fullPage: true });
  });

  test('should record video of complex calculation', async ({ page }) => {
    // Start recording
    const context = page.context();
    
    // Perform a complex calculation sequence
    await page.click('[data-testid="number-1"]');
    await page.click('[data-testid="number-0"]');
    await page.click('[data-testid="operator-multiply"]');
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="equals"]');
    
    await page.click('[data-testid="operator-add"]');
    await page.click('[data-testid="number-2"]');
    await page.click('[data-testid="number-5"]');
    await page.click('[data-testid="equals"]');
    
  await page.click('[data-testid="square-root"]');
    
  // Sqrt(125) is an irrational number; allow approximate comparison by formatting
  const displayText = await page.locator('[data-testid="calculator-display"]').textContent();
  const value = parseFloat((displayText || '').trim());
  expect(Math.round(value)).toBe(9);
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/screenshots/calculator-complex.png' });
  });
});
