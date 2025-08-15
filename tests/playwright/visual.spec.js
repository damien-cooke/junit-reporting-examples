import { test, expect } from '@playwright/test';

test.describe('Cross-Browser and Visual Testing', () => {
  
  test.describe('Cross-Browser Compatibility', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`should work correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        test.skip(currentBrowser !== browserName, `This test is for ${browserName} only`);
        
        await page.goto('/');
        
        // Test basic functionality
        await expect(page.locator('h1')).toContainText('JUnit Testing Examples Dashboard');
        
        // Test navigation
        await page.click('a[href="/calculator.html"]');
        await expect(page).toHaveURL(/.*calculator\.html/);
        
        // Test calculator functionality
        await page.click('[data-testid="number-5"]');
        await page.click('[data-testid="operator-add"]');
        await page.click('[data-testid="number-3"]');
        await page.click('[data-testid="equals"]');
        await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('8');
        
        // Screenshot for this browser
        await page.screenshot({ 
          path: `test-results/screenshots/cross-browser-${browserName}.png`,
          fullPage: true 
        });
      });
    });
  });

  test.describe('Visual Regression Testing', () => {
    test('should take consistent dashboard screenshots', async ({ page }) => {
      await page.goto('/');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('dashboard-baseline.png', {
        fullPage: true,
        threshold: 0.2
      });
    });

    test('should take consistent calculator screenshots', async ({ page }) => {
      await page.goto('/calculator.html');
      await page.waitForLoadState('networkidle');
      
      // Screenshot of initial state
      await expect(page).toHaveScreenshot('calculator-initial.png', {
        threshold: 0.2
      });
      
      // Perform calculation
      await page.click('[data-testid="number-1"]');
      await page.click('[data-testid="number-2"]');
      await page.click('[data-testid="number-3"]');
      
      // Screenshot with numbers
      await expect(page).toHaveScreenshot('calculator-with-numbers.png', {
        threshold: 0.2
      });
    });

    test('should take consistent user management screenshots', async ({ page }) => {
      await page.goto('/users.html');
      await page.waitForLoadState('networkidle');
      
      // Screenshot of initial state
      await expect(page).toHaveScreenshot('users-initial.png', {
        fullPage: true,
        threshold: 0.2
      });
      
      // Generate sample data
      await page.click('[data-testid="generate-sample-data"]');
      await page.waitForTimeout(1000);
      
      // Screenshot with data
      await expect(page).toHaveScreenshot('users-with-data.png', {
        fullPage: true,
        threshold: 0.2
      });
    });
  });

  test.describe('Responsive Design Testing', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      test(`should display correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Test dashboard
        await page.goto('/');
        await expect(page.locator('.navbar-brand')).toBeVisible();
        await page.screenshot({ 
          path: `test-results/screenshots/responsive-dashboard-${viewport.name}.png`,
          fullPage: true 
        });
        
        // Test calculator
        await page.goto('/calculator.html');
        await expect(page.locator('[data-testid="calculator-display"]')).toBeVisible();
        await page.screenshot({ 
          path: `test-results/screenshots/responsive-calculator-${viewport.name}.png`,
          fullPage: true 
        });
        
        // Test users
        await page.goto('/users.html');
        await expect(page.locator('[data-testid="add-user-btn"]')).toBeVisible();
        await page.screenshot({ 
          path: `test-results/screenshots/responsive-users-${viewport.name}.png`,
          fullPage: true 
        });
      });
    });
  });

  test.describe('Performance and Loading Tests', () => {
    test('should load pages within performance budgets', async ({ page }) => {
      const performanceData = [];
      
      // Test dashboard performance
      const dashboardStart = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const dashboardEnd = Date.now();
      performanceData.push({ page: 'dashboard', loadTime: dashboardEnd - dashboardStart });
      
      // Test calculator performance
      const calculatorStart = Date.now();
      await page.goto('/calculator.html');
      await page.waitForLoadState('networkidle');
      const calculatorEnd = Date.now();
      performanceData.push({ page: 'calculator', loadTime: calculatorEnd - calculatorStart });
      
      // Test users performance
      const usersStart = Date.now();
      await page.goto('/users.html');
      await page.waitForLoadState('networkidle');
      const usersEnd = Date.now();
      performanceData.push({ page: 'users', loadTime: usersEnd - usersStart });
      
      // Assert performance budgets (pages should load within 5 seconds)
      performanceData.forEach(data => {
        expect(data.loadTime).toBeLessThan(5000);
        console.log(`${data.page} loaded in ${data.loadTime}ms`);
      });
      
      // Screenshot showing performance results
      await page.screenshot({ 
        path: 'test-results/screenshots/performance-test-complete.png' 
      });
    });
  });

  test.describe('Accessibility Testing', () => {
    test('should have proper accessibility attributes', async ({ page }) => {
      await page.goto('/');
      
      // Check for proper heading hierarchy
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      // Check for proper navigation structure
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      for (let i = 0; i < imageCount; i++) {
        await expect(images.nth(i)).toHaveAttribute('alt');
      }
      
      // Check for proper form labels
      await page.goto('/users.html');
      await page.click('[data-testid="add-user-btn"]');
      
      const formInputs = page.locator('input[type="text"], input[type="email"], select');
      const inputCount = await formInputs.count();
      for (let i = 0; i < inputCount; i++) {
        const input = formInputs.nth(i);
        const inputId = await input.getAttribute('id');
        if (inputId) {
          const label = page.locator(`label[for="${inputId}"]`);
          await expect(label).toBeVisible();
        }
      }
      
      // Screenshot of accessibility-checked page
      await page.screenshot({ 
        path: 'test-results/screenshots/accessibility-test.png',
        fullPage: true 
      });
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/calculator.html');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Test keyboard input on calculator
      await page.keyboard.press('5');
      await page.keyboard.press('+');
      await page.keyboard.press('3');
      await page.keyboard.press('Enter');
      
      await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('8');
      
      // Screenshot of keyboard navigation
      await page.screenshot({ 
        path: 'test-results/screenshots/keyboard-navigation.png' 
      });
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle network failures gracefully', async ({ page }) => {
      // Test offline behavior
      await page.goto('/users.html');
      
      // Simulate network failure
      await page.context().setOffline(true);
      
      // Try to perform actions that would normally require network
      await page.click('[data-testid="add-user-btn"]');
      await page.fill('[data-testid="user-name"]', 'Offline Test User');
      await page.fill('[data-testid="user-email"]', 'offline@example.com');
      await page.selectOption('[data-testid="user-role"]', 'user');
      await page.selectOption('[data-testid="user-status"]', 'active');
      await page.click('[data-testid="save-user-btn"]');
      
      // Should still work in local mode
      await page.waitForSelector('#user-modal', { state: 'hidden' });
      
      // Screenshot of offline functionality
      await page.screenshot({ 
        path: 'test-results/screenshots/offline-behavior.png',
        fullPage: true 
      });
      
      // Restore network
      await page.context().setOffline(false);
    });

    test('should handle large datasets', async ({ page }) => {
      await page.goto('/data.html');
      
      // Create very large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => i + 1);
      await page.fill('[data-testid="data-input"]', largeDataset.join(', '));
      
      // Process large dataset
      await page.click('[data-testid="process-data"]');
      
      // Should handle it gracefully (within timeout)
      await page.waitForSelector('[data-testid="results-container"] .result-item', { 
        timeout: 30000 
      });
      
      // Screenshot of large dataset processing
      await page.screenshot({ 
        path: 'test-results/screenshots/large-dataset.png',
        fullPage: true 
      });
    });
  });

  test.describe('Complete User Journeys', () => {
    test('should complete full testing workflow with video recording', async ({ page }) => {
      // This test will create a comprehensive video recording of all features
      
      // 1. Start at dashboard
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/screenshots/journey-1-dashboard.png', fullPage: true });
      
      // 2. Test calculator functionality
      await page.click('a[href="/calculator.html"]');
      await page.waitForLoadState('networkidle');
      
      // Perform various calculations
      await page.click('[data-testid="number-1"]');
      await page.click('[data-testid="number-2"]');
      await page.click('[data-testid="operator-multiply"]');
      await page.click('[data-testid="number-3"]');
      await page.click('[data-testid="equals"]');
      await expect(page.locator('[data-testid="calculator-display"]')).toHaveText('36');
      
      await page.screenshot({ path: 'test-results/screenshots/journey-2-calculator.png' });
      
      // 3. Test user management
      await page.click('a[href="/users.html"]');
      await page.waitForLoadState('networkidle');
      
      // Generate sample data
      await page.click('[data-testid="generate-sample-data"]');
      await page.waitForTimeout(1000);
      
      // Add a new user
      await page.click('[data-testid="add-user-btn"]');
      await page.fill('[data-testid="user-name"]', 'Journey Test User');
      await page.fill('[data-testid="user-email"]', 'journey@example.com');
      await page.selectOption('[data-testid="user-role"]', 'admin');
      await page.selectOption('[data-testid="user-status"]', 'active');
      await page.click('[data-testid="save-user-btn"]');
      await page.waitForSelector('#user-modal', { state: 'hidden' });
      
      await page.screenshot({ path: 'test-results/screenshots/journey-3-users.png', fullPage: true });
      
      // 4. Test data processing
      await page.click('a[href="/data.html"]');
      await page.waitForLoadState('networkidle');
      
      // Load and process data
      await page.click('[data-testid="load-sample-2"]');
      await page.click('[data-testid="process-data"]');
      await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
      
      // Apply transformations
      await page.click('[data-testid="double-data"]');
      await page.fill('[data-testid="filter-value"]', '100');
      await page.click('[data-testid="filter-data"]');
      await page.click('[data-testid="process-data"]');
      await page.waitForSelector('[data-testid="results-container"] .result-item', { timeout: 10000 });
      
      await page.screenshot({ path: 'test-results/screenshots/journey-4-data.png', fullPage: true });
      
      // 5. Return to dashboard
      await page.click('a[href="/"]');
      await page.waitForLoadState('networkidle');
      
      // Final screenshot
      await page.screenshot({ path: 'test-results/screenshots/journey-5-complete.png', fullPage: true });
    });
  });
});
