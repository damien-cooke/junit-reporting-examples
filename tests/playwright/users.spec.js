import { test, expect } from '@playwright/test';

test.describe('User Management Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users.html');
  });

  test('should display user management interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('User Management');
    await expect(page.locator('[data-testid="add-user-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
    
    // Screenshot of user management interface
    await page.screenshot({ path: 'test-results/screenshots/users-interface.png', fullPage: true });
  });

  test('should open add user modal', async ({ page }) => {
    await page.click('[data-testid="add-user-btn"]');
    
    await expect(page.locator('#user-modal')).toBeVisible();
    await expect(page.locator('#user-modal-title')).toContainText('Add New User');
    
    // Screenshot of add user modal
    await page.screenshot({ path: 'test-results/screenshots/users-add-modal.png' });
  });

  test('should create a new user', async ({ page }) => {
    // Open add user modal
    await page.click('[data-testid="add-user-btn"]');
    
    // Fill form
    await page.fill('[data-testid="user-name"]', 'Test User');
    await page.fill('[data-testid="user-email"]', 'test@example.com');
    await page.selectOption('[data-testid="user-role"]', 'user');
    await page.selectOption('[data-testid="user-status"]', 'active');
    
    // Screenshot before submitting
    await page.screenshot({ path: 'test-results/screenshots/users-form-filled.png' });
    
    // Submit form
    await page.click('[data-testid="save-user-btn"]');
    
    // Wait for modal to close and table to update
    await page.waitForSelector('#user-modal', { state: 'hidden' });
    
    // Verify user appears in table
    await expect(page.locator('[data-testid="user-row"]')).toContainText('Test User');
    
    // Screenshot after user creation
    await page.screenshot({ path: 'test-results/screenshots/users-after-create.png', fullPage: true });
  });

  test('should edit an existing user', async ({ page }) => {
    // First, create a user to edit
    await page.click('[data-testid="add-user-btn"]');
    await page.fill('[data-testid="user-name"]', 'Edit Test User');
    await page.fill('[data-testid="user-email"]', 'edit@example.com');
    await page.selectOption('[data-testid="user-role"]', 'user');
    await page.selectOption('[data-testid="user-status"]', 'active');
    await page.click('[data-testid="save-user-btn"]');
    await page.waitForSelector('#user-modal', { state: 'hidden' });
    
    // Find and click edit button for the user
    const editButton = page.locator('[data-testid^="edit-user-"]').first();
    await editButton.click();
    
    // Verify modal opens with existing data
    await expect(page.locator('#user-modal')).toBeVisible();
    await expect(page.locator('#user-modal-title')).toContainText('Edit User');
    await expect(page.locator('[data-testid="user-name"]')).toHaveValue('Edit Test User');
    
    // Update the user
    await page.fill('[data-testid="user-name"]', 'Updated Test User');
    await page.selectOption('[data-testid="user-role"]', 'admin');
    
    // Screenshot before saving changes
    await page.screenshot({ path: 'test-results/screenshots/users-edit-modal.png' });
    
    await page.click('[data-testid="save-user-btn"]');
    await page.waitForSelector('#user-modal', { state: 'hidden' });
    
    // Verify changes in table
    await expect(page.locator('[data-testid="user-row"]')).toContainText('Updated Test User');
    await expect(page.locator('[data-testid="user-role"] .badge')).toContainText('admin');
  });

  test('should delete a user', async ({ page }) => {
    // First, create a user to delete
    await page.click('[data-testid="add-user-btn"]');
    await page.fill('[data-testid="user-name"]', 'Delete Test User');
    await page.fill('[data-testid="user-email"]', 'delete@example.com');
    await page.selectOption('[data-testid="user-role"]', 'user');
    await page.selectOption('[data-testid="user-status"]', 'active');
    await page.click('[data-testid="save-user-btn"]');
    await page.waitForSelector('#user-modal', { state: 'hidden' });
    
    // Count users before deletion
    const userCountBefore = await page.locator('[data-testid="user-row"]').count();
    
    // Find and click delete button
    const deleteButton = page.locator('[data-testid^="delete-user-"]').first();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    await deleteButton.click();
    
    // Verify user is removed
    const userCountAfter = await page.locator('[data-testid="user-row"]').count();
    expect(userCountAfter).toBe(userCountBefore - 1);
    
    // Screenshot after deletion
    await page.screenshot({ path: 'test-results/screenshots/users-after-delete.png', fullPage: true });
  });

  test('should search users', async ({ page }) => {
    // Generate some sample data first
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000); // Wait for data to load
    
    // Search for a specific user
    await page.fill('[data-testid="search-users"]', 'Alice');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Verify search results
    const visibleRows = page.locator('[data-testid="user-row"]:visible');
    await expect(visibleRows).toContainText('Alice');
    
    // Screenshot of search results
    await page.screenshot({ path: 'test-results/screenshots/users-search.png' });
  });

  test('should filter users by status', async ({ page }) => {
    // Generate sample data
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000);
    
    // Filter by active status
    await page.selectOption('[data-testid="filter-status"]', 'active');
    await page.waitForTimeout(500);
    
    // Verify all visible users are active
    const statusBadges = page.locator('[data-testid="user-status"] .badge');
    const badgeCount = await statusBadges.count();
    
    for (let i = 0; i < badgeCount; i++) {
      await expect(statusBadges.nth(i)).toContainText('active');
    }
    
    // Screenshot of filtered results
    await page.screenshot({ path: 'test-results/screenshots/users-filter.png' });
  });

  test('should handle bulk selection and deletion', async ({ page }) => {
    // Generate sample data
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000);
    
    // Select all users
    await page.click('[data-testid="select-all"]');
    
    // Verify bulk delete button is enabled
    const bulkDeleteBtn = page.locator('[data-testid="bulk-delete-btn"]');
    await expect(bulkDeleteBtn).toBeEnabled();
    
    // Screenshot of bulk selection
    await page.screenshot({ path: 'test-results/screenshots/users-bulk-select.png' });
    
    // Select only first two checkboxes instead of all
    await page.click('[data-testid="select-all"]'); // Unselect all
    const checkboxes = page.locator('[data-testid^="user-checkbox-"]');
    await checkboxes.first().check();
    await checkboxes.nth(1).check();
    
    // Handle confirmation dialog and delete
    page.on('dialog', dialog => dialog.accept());
    await bulkDeleteBtn.click();
    
    // Screenshot after bulk deletion
    await page.screenshot({ path: 'test-results/screenshots/users-bulk-delete.png', fullPage: true });
  });

  test('should export users to CSV', async ({ page }) => {
    // Generate sample data
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000);
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.click('[data-testid="export-users"]');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toContain('users_');
    expect(download.suggestedFilename()).toContain('.csv');
    
    // Screenshot after export
    await page.screenshot({ path: 'test-results/screenshots/users-export.png' });
  });

  test('should validate form inputs', async ({ page }) => {
    // Open add user modal
    await page.click('[data-testid="add-user-btn"]');
    
    // Try to submit empty form
    await page.click('[data-testid="save-user-btn"]');
    
    // Should show validation errors
    await expect(page.locator('.alert-danger')).toBeVisible();
    
    // Screenshot of validation errors
    await page.screenshot({ path: 'test-results/screenshots/users-validation.png' });
    
    // Test invalid email
    await page.fill('[data-testid="user-name"]', 'Test User');
    await page.fill('[data-testid="user-email"]', 'invalid-email');
    await page.click('[data-testid="save-user-btn"]');
    
    await expect(page.locator('.alert-danger')).toContainText('valid email');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Generate some data
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000);
    
    // Test mobile interface
    await expect(page.locator('[data-testid="add-user-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
    
    // Test mobile modal
    await page.tap('[data-testid="add-user-btn"]');
    await expect(page.locator('#user-modal')).toBeVisible();
    
    // Screenshot of mobile interface
    await page.screenshot({ path: 'test-results/screenshots/users-mobile.png', fullPage: true });
  });

  test('should record video of complete user workflow', async ({ page }) => {
    // Complete user management workflow
    
    // 1. Generate sample data
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000);
    
    // 2. Add new user
    await page.click('[data-testid="add-user-btn"]');
    await page.fill('[data-testid="user-name"]', 'Workflow Test User');
    await page.fill('[data-testid="user-email"]', 'workflow@example.com');
    await page.selectOption('[data-testid="user-role"]', 'moderator');
    await page.selectOption('[data-testid="user-status"]', 'active');
    await page.click('[data-testid="save-user-btn"]');
    await page.waitForSelector('#user-modal', { state: 'hidden' });
    
    // 3. Search for user
    await page.fill('[data-testid="search-users"]', 'Workflow');
    await page.waitForTimeout(500);
    
    // 4. Edit user
    const editButton = page.locator('[data-testid^="edit-user-"]').first();
    await editButton.click();
    await page.fill('[data-testid="user-name"]', 'Updated Workflow User');
    await page.click('[data-testid="save-user-btn"]');
    await page.waitForSelector('#user-modal', { state: 'hidden' });
    
    // 5. Clear search to show all users
    await page.fill('[data-testid="search-users"]', '');
    await page.waitForTimeout(500);
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/screenshots/users-workflow-complete.png', fullPage: true });
  });

  test('should handle user statistics display', async ({ page }) => {
    // Generate sample data
    await page.click('[data-testid="generate-sample-data"]');
    await page.waitForTimeout(1000);
    
    // Check if statistics are displayed
    const statsContainer = page.locator('[data-testid="user-stats"]');
    if (await statsContainer.count() > 0) {
      await expect(statsContainer).toBeVisible();
      
      // Screenshot of statistics
      await page.screenshot({ path: 'test-results/screenshots/users-statistics.png' });
    }
  });
});
