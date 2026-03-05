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
├── playwright.config.js
└── plugin.php             # WordPress plugin entry
```

## Commands

### Development

```bash
npm run start      # Dev server with hot reload (experimental modules)
npm run build      # Production build
npm run playground # Start local WordPress Playground
```

### Testing

```bash
npm test           # Local programmatic WordPress Playground (default)
npm run test:cloud # Hosted WordPress Playground
npm run test:ci    # Build + cloud tests (used in CI)
```

#### Running a Single Test

Use Playwright's `--grep` flag to run specific tests:

```bash
# Run tests matching a pattern
npx playwright test --grep "pixel art"

# Run a specific test file
npx playwright test tests/frontend.spec.js

# Run a specific test by title
npx playwright test --grep "should paint a cell"
```

For cloud mode with single test:
```bash
TEST_MODE=cloud npx playwright test --grep "test name"
```

### Linting & Formatting

```bash
npm run format      # Format code (Prettier)
npm run lint:css    # Lint CSS
npm run lint:js     # Lint JavaScript
```

### Other

```bash
npm run plugin-zip # Create plugin zip
npm run makepot    # Generate translation template
```

## Testing Notes

- ES modules have known limitations with local WordPress Playground - use `test:cloud` for full interactivity testing
- Cloud tests use the hosted WordPress Playground which supports ES modules
- Tests run against a live WordPress instance via Playwright

## Interactivity API

The block uses WordPress Interactivity API for frontend interactions. Key files:
- `src/view.js` - Store setup with state and actions
- `src/render.php` - Directives like `data-wp-on--click`, `data-wp-on--mousedown`, `data-wp-on--mouseenter`

## Code Style Guidelines

### General Principles

- Follow WordPress JavaScript coding standards (used by @wordpress/scripts)
- Use ES6+ features (const/let, arrow functions, template literals)
- Keep functions small and focused
- Use meaningful variable and function names

### Formatting

- **Indentation**: Tabs (WordPress default)
- **Line length**: Soft limit at 80 characters
- **Trailing commas**: Required in multiline arrays/objects
- **Quotes**: Single quotes for strings, double for JSX attributes
- Use Prettier for automatic formatting (`npm run format`)

### Imports

```javascript
// WordPress packages
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { store, getContext, getElement } from '@wordpress/interactivity';

// Local imports
import './style.scss';
import Edit from './edit';
import metadata from './block.json';
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Edit`, `PixelArtGrid`)
- **Functions/variables**: camelCase (e.g., `saveToStorage`, `blockProps`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants
- **Block names**: kebab-case with vendor prefix (e.g., `mfgmicha/pixel-art-creator`)
- **CSS classes**: BEM-style with block prefix (e.g., `pixel-art-creator-editor__preview`)

### React/JSX

- Use functional components with arrow functions or function declarations
- Destructure props for clarity
- Use ternary operators for conditional rendering, not && for numbers
- Always provide keys when rendering lists

```javascript
// Good
export default function Edit( { attributes, setAttributes } ) {
    const { columns, rows } = attributes;

    return (
        <div { ...blockProps }>
            { items.map( ( item ) => (
                <span key={ item.id } className="item">{ item.name }</span>
            ) ) }
        </div>
    );
}
```

### Error Handling

- Use try/catch for localStorage and other browser APIs that may fail
- Provide fallback values where appropriate
- Use console.warn for non-critical errors, console.error for critical ones
- Handle missing DOM elements gracefully

```javascript
// Good pattern
try {
    localStorage.setItem( key, value );
} catch ( e ) {
    console.warn( 'Could not save to localStorage:', e );
}

// Good pattern for DOM
const wrapper = document.querySelector( '.selector' );
if ( ! wrapper ) {
    return;
}
```

### WordPress Interactivity API

The block uses WordPress Interactivity API for frontend interactions:

- Use `store()` to define state and actions
- Use `getContext()` to access directive context
- Use `getElement()` to access DOM refs in actions
- Prefix state getters to avoid conflicts

```javascript
const { state } = store( 'vendor/block-name', {
    state: {
        get activeColor() {
            return state.selectedColor || '#000000';
        },
    },
    actions: {
        paintCell() {
            const { ref } = getElement();
            const ctx = getContext();
            // ...
        },
    },
} );
```

### CSS/SCSS

- Use SCSS for variables and nesting
- Follow BEM naming convention
- Prefix with block name to avoid collisions
- Use CSS custom properties for theming where appropriate

```scss
.pixel-art-creator-editor {
    &__info { /* ... */ }
    &__preview { /* ... */ }
    &__cell { /* ... */ }
}
```

### Attributes (block.json)

- Define all editable attributes in block.json
- Use appropriate types: number, string, boolean, object
- Provide sensible defaults

## Block Features

- Configurable grid size (4-32 columns/rows via sidebar)
- Uses theme's color palette (falls back to default colors)
- Click to paint cells
- Click painted cell with same color to erase
- Drag to paint multiple cells
- Reset button to clear canvas
- Fully responsive (horizontal scroll on small screens)
- Pure client-side (no server storage)
- Persistence via localStorage

## Key Files to Modify

- `src/index.js` - Block registration and configuration
- `src/edit.js` - Block editor UI
- `src/view.js` - Frontend interactive canvas
- `src/block.json` - Block metadata and attributes
