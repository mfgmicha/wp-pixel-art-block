# Testing

This document describes how to run tests for the Pixel Art Creator block.

## Prerequisites

- Node.js
- npm
- WordPress Playground (automatically handled via @wp-playground/cli)

## Running Tests

Three test options are available:

### Option 1: Cloud Tests (recommended)

Uses the hosted WordPress Playground - supports ES modules for full interactivity testing.

```bash
npm run test:cloud
```

### Option 2: CI Tests (build + cloud)

Builds the plugin and runs cloud tests in one command.

```bash
npm run test:ci
```

### Option 3: Local Tests

Uses wp-playground-cli running locally on port 8890.

```bash
# Start the local server (in one terminal)
npm run env:start

# Run tests (in another terminal)
npm run test:local
```

### Run Specific Test Files

```bash
# Frontend tests
npm run test:local -- tests/frontend.spec.js

# Admin tests
npm run test:local -- tests/admin.spec.js
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

Make sure the WordPress Playground server is running (for local tests):

```bash
npm run env:start
```

### Tests timeout

Increase the timeout in the config file, or use cloud tests:

```bash
npm run test:cloud
```

### ES Module errors in local tests

The WordPress Playground CLI has a known limitation where ES modules may not be served with the correct MIME type. This causes errors like:

```
Failed to load module script: Expected a JavaScript-or-Wash module script but the server responded with a MIME type of ""
```

If you see these errors, the JavaScript interaction tests will fail. Use cloud tests instead for full coverage:

```bash
npm run test:cloud
```

## Configuration

### Playwright Configs

Two configuration files are available:

- `playwright.config.js` - Default (local CLI on port 8890)
- `playwright.config.cloud.js` - Hosted WordPress Playground
- `playwright.config.local.js` - Explicit local config

### Blueprint

The `.wordpress/blueprint.json` file configures the WordPress Playground:
- Creates a "Pixel Art" page with the block
- Sets the landing page to /pixel-art/

The plugin is auto-mounted from the local directory.

## Automated PR Previews

The repository includes a GitHub Action (`.github/workflows/pr-preview.yml`) that automatically creates a WordPress Playground preview for every PR:

1. **On PR open/update**: The workflow builds the plugin, creates a ZIP, and exposes it via a public URL
2. **Preview button**: A "Preview" button is added to the PR description that launches the Playground with the plugin installed
3. **Full test environment**: The Playground includes WordPress with the plugin activated and a "Pixel Art" page with the block

The PR author and reviewers can click the preview button to test the changes in a real WordPress environment before merging.
