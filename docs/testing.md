# Testing

This document describes how to run tests for the Pixel Art Creator block.

## Prerequisites

- Node.js
- npm
- WordPress Playground (automatically handled via @wp-playground/cli)

## Running Tests

### Start the WordPress Playground Server

Before running tests, start the WordPress Playground server:

```bash
npm run env:start
```

This command:
- Starts a local WordPress server on port 8889
- Mounts the plugin directory
- Runs the blueprint to create the Pixel Art page
- Enables auto-login

### Run All Tests

```bash
npm run test:playwright
```

### Run Specific Test Files

```bash
# Frontend tests
npm run test:playwright -- tests/frontend.spec.js

# Admin tests
npm run test:playwright -- tests/admin.spec.js

# Site tests
npm run test:playwright -- tests/site.spec.js
```

### Stop the Server

Press `Ctrl+C` in the terminal running the server, or:

```bash
npm run env:stop
```

## Test Files

- `tests/frontend.spec.js` - Tests the frontend pixel-art page
- `tests/admin.spec.js` - Tests the WordPress admin and block editor
- `tests/site.spec.js` - Tests the main site page

## Troubleshooting

### Tests fail with connection errors

Make sure the WordPress Playground server is running:

```bash
npm run env:start
```

### Tests timeout

Increase the timeout in `playwright.config.js`:

```javascript
timeout: 120000, // 2 minutes
```

### Login errors in admin tests

The admin tests try to auto-login using the `--login` flag. If login fails, the tests will still run but may skip certain checks.

## Configuration

### Playwright Config

The configuration is in `playwright.config.js`:

- Base URL: http://localhost:8889
- Test directory: ./tests
- Timeout: 90000ms (90 seconds)

### Blueprint

The `blueprint.json` file configures the WordPress Playground:
- Installs and activates the plugin
- Creates a "Pixel Art" page with the block
- Sets the landing page to /pixel-art/
