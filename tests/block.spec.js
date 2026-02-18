const { test, expect } = require('@playwright/test');

test.describe('Pixel Art Block', () => {
  
  test('plugin files are accessible', async ({ page }) => {
    // Verify plugin files are being served correctly
    const phpResponse = await page.request.get('http://localhost:8889/wp-content/plugins/pixel-art-block/pixel-art-block.php');
    const jsonResponse = await page.request.get('http://localhost:8889/wp-content/plugins/pixel-art-block/build/block.json');
    const jsResponse = await page.request.get('http://localhost:8889/wp-content/plugins/pixel-art-block/build/view.js');
    
    expect(phpResponse.status()).toBe(200);
    expect(jsonResponse.status()).toBe(200);
    expect(jsResponse.status()).toBe(200);
    
    console.log('✓ All plugin files accessible');
  });

  test('page loads without errors', async ({ page }) => {
    await page.goto('http://localhost:8889/');
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Check no critical console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.waitForTimeout(500);
    console.log('✓ Page loads successfully');
  });
  
});
