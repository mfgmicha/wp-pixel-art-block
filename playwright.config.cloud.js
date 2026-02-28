const { defineConfig, devices } = require('@playwright/test');

// Hosted WordPress Playground config
// Run with: npx playwright test --config=playwright.config.cloud.js
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/mfgmicha/wp-pixel-art-block/main/.wordpress/blueprint.json',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
