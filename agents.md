# Project Documentation for Agents

## Overview

WordPress Gutenberg block plugin that provides an interactive pixel art canvas. Visitors can paint pixel art using the theme's color palette on a configurable grid.

## Tech Stack

- **WordPress**: 6.7+ (tested up to 6.8)
- **PHP**: 8.2+
- **Build**: @wordpress/scripts with ES modules support
- **Testing**: Playwright with WordPress Playground
- **Package Manager**: npm

## Project Structure

```
wp-pixel-art-block/
├── src/                    # Source code
│   ├── index.js           # Block registration
│   ├── edit.js            # Editor component (block edit mode)
│   ├── view.js            # Frontend/interactive component
│   ├── render.php         # PHP render callback
│   ├── block.json         # Block metadata
│   ├── style.scss         # Frontend styles
│   └── editor.scss        # Editor styles
├── build/                  # Built output (generated)
├── tests/                  # Playwright tests
│   ├── frontend.spec.js   # Frontend interaction tests
│   ├── admin.spec.js      # Admin tests
│   ├── site.spec.js       # Site tests
│   ├── playground-setup.js
│   ├── global-setup.js
│   └── global-teardown.js
├── .wordpress/            # WordPress Playground blueprint
├── playwright.config.local.js
├── playwright.config.cloud.js
└── plugin.php             # WordPress plugin entry
```

## Commands

### Development
```bash
npm run start      # Dev server with hot reload (experimental modules)
npm run build      # Production build
```

### Testing
```bash
npm run test:local   # Local programmatic WordPress Playground
npm run test:cloud   # Hosted WordPress Playground (recommended for full ESM support)
npm run test:ci      # Build + cloud tests (used in CI)
```

### Other
```bash
npm run format           # Format code
npm run lint:css         # Lint CSS
npm run lint:js          # Lint JavaScript
npm run plugin-zip      # Create plugin zip
```

## Testing Notes

- ES modules have known limitations with local WordPress Playground - use `test:cloud` for full interactivity testing
- Cloud tests use the hosted WordPress Playground which supports ES modules
- Tests run against a live WordPress instance via Playwright

## Block Features

- Configurable grid size (4-32 columns/rows via sidebar)
- Uses theme's color palette (falls back to default colors)
- Click to paint cells
- Click painted cell with same color to erase
- Reset button to clear canvas
- Fully responsive (horizontal scroll on small screens)
- Pure client-side (no server storage)

## Key Files to Modify

- `src/index.js` - Block registration and configuration
- `src/edit.js` - Block editor UI
- `src/view.js` - Frontend interactive canvas
- `src/block.json` - Block metadata and attributes
