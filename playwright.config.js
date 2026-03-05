const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

// Determine test mode from environment
const testMode = process.env.TEST_MODE || 'local';
const isLocal = testMode === 'local';

// WordPress Playground blueprint URL for cloud mode
const blueprintUrl = process.env.PLAYWRIGHT_BLUEPRINT_URL ||
  'https://raw.githubusercontent.com/mfgmicha/wp-pixel-art-block/main/.wordpress/blueprint.json';

const projectRoot = path.resolve(__dirname);

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  retries: 2,
  reporter: 'list',
  use: {
    baseURL: isLocal
      ? 'http://127.0.0.1:8890'
      : `https://playground.wordpress.net/?blueprint-url=${blueprintUrl}`,
    trace: 'on-first-retry',
    headless: true,
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(isLocal ? { launchOptions: { args: ['--disable-proxy-bypass', '--disable-setuid-sandbox'] } } : {}),
      },
    },
  ],
  // Only use global setup/teardown for local mode
  ...(isLocal ? {
    globalSetup: require.resolve('./tests/global-setup.js'),
    globalTeardown: require.resolve('./tests/global-teardown.js'),
  } : {}),
});
