# Pixel Art Block - Testing Specification

## Overview

Automated testing using Playwright to verify the Pixel Art Block works correctly in WordPress Playground.

## Testing Architecture

```
┌─────────────────────────────────────────────────┐
│  Playwright Test                                │
│  ┌───────────────────────────────────────────┐  │
│  │ 1. Start @wp-playground/cli server        │  │
│  │ 2. Wait for server ready                  │  │
│  │ 3. Navigate to localhost                  │  │
│  │ 4. Test editor + frontend                 │  │
│  │ 5. Stop server                           │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Requirements

### Dependencies

Add to `package.json`:

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

Install locally:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Files

### playwright.config.js

Location: `playwright.config.js`

```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8888',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx @wp-playground/cli server --auto-mount --port=8888',
    url: 'http://localhost:8888',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
```

### Test File: tests/block.spec.js

Location: `tests/block.spec.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Pixel Art Block', () => {
  
  test('block appears in editor and is selectable', async ({ page }) => {
    // Go to block editor
    await page.goto('http://localhost:8888/wp-admin/post-new.php');
    
    // Open block inserter
    await page.click('.block-editor-inserter__toggle');
    
    // Search for Pixel Art block
    await page.fill('input[type="search"]', 'Pixel Art');
    
    // Click to add the block
    await page.click('.block-editor-block-patterns-list button:first-child');
    
    // Verify block renders in editor
    await expect(page.locator('.wp-block-mfgmicha-pixel-art')).toBeVisible();
    
    // Click on the block to select it
    await page.click('.wp-block-mfgmicha-pixel-art');
    
    // Verify block is selected (sidebar should show block settings)
    await expect(page.locator('.editor-post-settings-sidebar')).toBeVisible();
  });

  test('frontend grid is interactive', async ({ page }) => {
    // Go to a page with the block (page_id=2 from blueprint)
    await page.goto('http://localhost:8888/?page_id=2');
    
    // Verify grid renders
    await expect(page.locator('.pixel-art-grid')).toBeVisible();
    
    // Get first pixel
    const firstPixel = page.locator('.pixel-art-pixel').first();
    
    // Click to toggle
    await firstPixel.click();
    
    // Verify class changed to is-painted
    await expect(firstPixel).toHaveClass(/is-painted/);
    
    // Click again to toggle off
    await firstPixel.click();
    
    // Verify class no longer has is-painted
    await expect(firstPixel).not.toHaveClass(/is-painted/);
  });
  
});
```

## Running Tests

### Install Dependencies
```bash
npm install
npx playwright install chromium
```

### Run Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/block.spec.js

# Run with UI
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

### Test Output
- HTML report: `playwright-report/index.html`
- Traces: `playwright-traces/`

## Test Coverage

| Feature | Test | Expected Result |
|---------|------|-----------------|
| Block appears in editor | `block appears in editor` | Block renders with class `.wp-block-mfgmicha-pixel-art` |
| Block is selectable | `block appears in editor` | Sidebar shows when block is clicked |
| Frontend grid renders | `frontend grid is interactive` | Grid with `.pixel-art-grid` is visible |
| Pixels are clickable | `frontend grid is interactive` | Clicking toggles `.is-painted` class |

## Notes

- Tests run against local WordPress Playground CLI server
- Server is automatically started/stopped by Playwright
- Uses `webServer` config to manage the server lifecycle
- Chromium browser is required for tests

## Troubleshooting

### Server doesn't start
```bash
# Check if port 8888 is available
lsof -i :8888

# Manually start server first
npx @wp-playground/cli server --auto-mount --port=8888
```

### Playwright browser issues
```bash
# Reinstall browsers
npx playwright install chromium

# Check installed browsers
npx playwright install --dry-run chromium
```
