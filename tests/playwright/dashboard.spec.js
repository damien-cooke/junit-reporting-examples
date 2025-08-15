import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard title and navigation', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('JUnit Testing Examples Dashboard');
    await expect(page.locator('.navbar-brand')).toContainText('JUnit Testing Examples');
    
    // Take screenshot of dashboard
    await page.screenshot({ path: 'test-results/screenshots/dashboard-home.png', fullPage: true });
  });

  test('should have working navigation links', async ({ page }) => {
    // Test Calculator link
    await page.click('a[href="/calculator.html"]');
    await expect(page).toHaveURL(/.*calculator\.html/);
    await page.goBack();

    // Test Users link
    await page.click('a[href="/users.html"]');
    await expect(page).toHaveURL(/.*users\.html/);
    await page.goBack();

    // Test Data Processing link
    await page.click('a[href="/data.html"]');
    await expect(page).toHaveURL(/.*data\.html/);
    
    // Screenshot of navigation flow
    await page.screenshot({ path: 'test-results/screenshots/navigation-test.png' });
  });

  test('should display feature cards', async ({ page }) => {
    await expect(page.locator('[data-testid="calculator-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="users-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="data-card"]')).toBeVisible();
    
    // Screenshot of feature cards
    await page.screenshot({ path: 'test-results/screenshots/feature-cards.png' });
  });

  test('should navigate to calculator from feature card', async ({ page }) => {
    await page.click('[data-testid="calculator-card"] .btn');
    await expect(page).toHaveURL(/.*calculator\.html/);
    await expect(page.locator('h1')).toContainText('Calculator');
  });

  test('should navigate to users from feature card', async ({ page }) => {
    await page.click('[data-testid="users-card"] .btn');
    await expect(page).toHaveURL(/.*users\.html/);
    await expect(page.locator('h1')).toContainText('User Management');
  });

  test('should navigate to data processing from feature card', async ({ page }) => {
    await page.click('[data-testid="data-card"] .btn');
    await expect(page).toHaveURL(/.*data\.html/);
    await expect(page.locator('h1')).toContainText('Data Processing');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.navbar-brand')).toBeVisible();
    await expect(page.locator('[data-testid="calculator-card"]')).toBeVisible();
    
    // Screenshot of mobile view
    await page.screenshot({ path: 'test-results/screenshots/dashboard-mobile.png', fullPage: true });
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for alt text on any images (if present)
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt');
    }
  });
});
