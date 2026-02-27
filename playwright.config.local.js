const { defineConfig, devices } = require('@playwright/test');

// Local CLI config - uses wp-playground-cli on port 8890
// Run with: npm run test:local
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
    baseURL: 'http://127.0.0.1:8890',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-proxy-bypass', '--disable-setuid-sandbox'],
        },
      },
    },
  ],
});
