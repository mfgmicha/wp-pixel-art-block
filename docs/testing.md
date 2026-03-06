# Testing

This document describes how to run tests for the Pixel Art Creator block.

## Prerequisites

- Node.js
- npm

## Running Tests

### Option 1: Cloud Tests (recommended)

Uses the hosted WordPress Playground - supports full interactivity testing.

```bash
npm run test:cloud
```

### Option 2: CI Tests (build + cloud)

Builds the plugin and runs cloud tests in one command.

```bash
npm run test:ci
```

### Option 3: Local Tests

Uses the programmatic WordPress Playground API - server starts/stops automatically.

```bash
npm test
```

**Note:** Local tests may have issues with Interactivity API (see Troubleshooting below).

### Run Specific Test Files

```bash
# Frontend tests
npm test -- tests/frontend.spec.js

# Admin tests
npm test -- tests/admin.spec.js
```

## Test Files

- `tests/frontend.spec.js` - Tests the frontend pixel-art page
- `tests/admin.spec.js` - Tests the WordPress admin and block editor
- `tests/site.spec.js` - Tests the main site page

## Troubleshooting

### Interactivity API in local tests

Local WordPress Playground may have issues loading the Interactivity API due to module loading. If JavaScript interaction tests fail, use cloud tests for full coverage:

```bash
npm run test:cloud
```

## Configuration

### Playwright Config

A single unified configuration is used: `playwright.config.js`

It uses the `TEST_MODE` environment variable to switch between modes:
- Not set (default) - Local programmatic WordPress Playground
- `TEST_MODE=cloud` - Hosted WordPress Playground

### Blueprint

The `.wordpress/blueprint.json` file configures the WordPress Playground:
- Installs the plugin from GitHub
- Activates the plugin
- Creates a "Pixel Art" page with the block
- Sets the landing page to /pixel-art/

## Automated PR Previews

The repository includes GitHub Actions that automatically create WordPress Playground previews for every PR:

1. **Build workflow** (`.github/workflows/pr-playground-preview-build.yml`): Builds the plugin and creates a ZIP
2. **Publish workflow** (`.github/workflows/pr-playground-preview-publish.yml`): Exposes the ZIP and adds a preview button to the PR

On PR open/update:
1. The build workflow runs and uploads the plugin ZIP as an artifact
2. The publish workflow runs after build completes
3. A "Preview" button appears in the PR description that launches the Playground with the plugin installed

The PR author and reviewers can click the preview button to test the changes in a real WordPress environment before merging.
