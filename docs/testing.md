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
- Mounts the plugin directory (auto-mounted)
- Runs the blueprint to create the Pixel Art page

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

### ES Module errors in browser console

The WordPress Playground CLI has a known limitation where ES modules may not be served with the correct MIME type. This causes errors like:

```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of ""
```

If you see these errors, the JavaScript interaction tests will fail. For full test coverage, use the hosted WordPress Playground instead:
https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/mfgmicha/wp-pixel-art-block/main/.wordpress/blueprint.json

## Configuration

### Playwright Config

The configuration is in `playwright.config.js`:

- Base URL: http://127.0.0.1:8889
- Test directory: ./tests
- Timeout: 90000ms (90 seconds)

### Blueprint

The `.wordpress/blueprint.json` file configures the WordPress Playground:
- Creates a "Pixel Art" page with the block
- Sets the landing page to /pixel-art/

The plugin is auto-mounted from the local directory.
