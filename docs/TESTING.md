# Testing Documentation

## Overview

This project uses Playwright for automated testing against WordPress Playground.

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Start WordPress Playground

```bash
npm run test:server
```

This starts the server with your plugin mounted at the correct path.

### 3. Run Tests

```bash
npm test
```

## Available npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run test:server` | Start WordPress Playground server |
| `npm test` | Run Playwright tests |

## Manual Testing

After starting the server with `npm run test:server`:

1. Go to http://localhost:8889/wp-admin/
2. Login: `admin` / `password`
3. Go to Pages → Add New
4. Search for "Pixel Art" in block inserter
5. Add the block
6. Publish and view on frontend
7. Click pixels to test interactivity

## Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- tests/block.spec.js

# With UI (interactive)
npm test -- --ui

# Headed (see browser)
npm test -- --headed
```

## Test Coverage

Current tests verify:
- Plugin files are accessible (PHP, JSON, JS)
- WordPress page loads without errors

## Troubleshooting

### Server Won't Start

If port 8889 is already in use:

```bash
# Kill existing process
pkill -f "wp-playground"

# Try again
npm run test:server
```

### Plugin Not Found (404)

Make sure you're using the npm script:

```bash
npm run test:server
```

### Tests Timeout

Increase timeout in `playwright.config.js`.

### Login Issues

Default credentials: `admin` / `password`

## CI Integration

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install chromium

- name: Start Playground
  run: npm run test:server &
- name: Wait for server
  run: sleep 30
- name: Run tests
  run: npm test
```
