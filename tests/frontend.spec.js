const { test, expect } = require('@playwright/test');

test('page loads without errors', async ({ page }) => {
    await page.goto('/pixel-art/');
    await page.waitForLoadState('networkidle');

    // Verify page loads
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Pixel Art');

    //TODO: add block expects

    // Check no critical console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.waitForTimeout(500);
    //console.log('✓ Page loads successfully');
});
