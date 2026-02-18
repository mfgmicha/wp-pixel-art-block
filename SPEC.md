# Pixel Art Block - Technical Specification

> WordPress Gutenberg block with WordPress Interactivity API and TDD

---

## 1. Overview

Interactive 16x16 pixel art grid where editors configure in Gutenberg, visitors draw on frontend.

### Block Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | number | 16 | Grid columns |
| `height` | number | 16 | Grid rows |
| `pixels` | array | [] | Painted pixel indices |
| `selectedColor` | string | '#000000' | Paint color |
| `showGrid` | boolean | true | Show grid lines |

---

## 2. Architecture

```
Editor (React) → setAttributes() → Save (HTML data-*) → Frontend (Interactivity API)
```

**Tech Stack**: React (@wordpress/scripts), WordPress Interactivity API, Playwright

---

## 3. Implementation

### 3.1 block.json

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "mfgmicha/pixel-art",
  "version": "2.0.0",
  "title": "Pixel Art",
  "category": "widgets",
  "icon": "dashicons-art",
  "description": "Create pixel art drawings",
  "supports": { "html": false, "align": ["wide", "full"] },
  "attributes": {
    "width": { "type": "number", "default": 16 },
    "height": { "type": "number", "default": 16 },
    "pixels": { "type": "array", "default": [] },
    "selectedColor": { "type": "string", "default": "#000000" },
    "showGrid": { "type": "boolean", "default": true }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js"
}
```

### 3.2 Editor (edit.js)

```javascript
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

export default function PixelArtEdit({ attributes, setAttributes }) {
  const { width, height, pixels, selectedColor, showGrid } = attributes;
  const [tool, setTool] = useState('paint'); // 'paint' | 'erase'

  const togglePixel = (index) => {
    const arr = [...pixels];
    const i = arr.indexOf(index);
    tool === 'paint' ? (i === -1 && arr.push(index)) : (i !== -1 && arr.splice(i, 1));
    setAttributes({ pixels: arr });
  };

  return (
    <div {...useBlockProps()}>
      <div className="pixel-art-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gap: showGrid ? '1px' : '0',
      }}>
        {Array.from({ length: width * height }, (_, i) => (
          <div key={i} onClick={() => togglePixel(i)}
            className={`pixel-art-pixel ${pixels.includes(i) ? 'is-painted' : ''}`}
            style={{
              width: '44px', height: '44px',
              backgroundColor: pixels.includes(i) ? selectedColor : 'var(--wp--preset--color--white, #fff)',
              border: showGrid ? '1px solid var(--wp--preset--color--cyan, #c8d7e2)' : 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      <div className="controls">
        <input type="color" value={selectedColor}
          onChange={e => setAttributes({ selectedColor: e.target.value })} />
        <button onClick={() => setTool('paint')}>Paint</button>
        <button onClick={() => setTool('erase')}>Erase</button>
        <button onClick={() => setAttributes({ pixels: [] })}>Clear</button>
      </div>
    </div>
  );
}
```

### 3.3 Save (save.js)

```javascript
export default function PixelArtSave({ attributes }) {
  const { width, height, pixels, selectedColor, showGrid } = attributes;

  return (
    <div className="wp-block-mfgmicha-pixel-art"
      data-width={width} data-height={height}
      data-pixels={JSON.stringify(pixels)}
      data-selected-color={selectedColor}
      data-show-grid={showGrid}
      data-wp-interactive="pixel-art"
    >
      <div className="pixel-art-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gap: showGrid ? '1px' : '0',
      }}>
        {Array.from({ length: width * height }, (_, i) => (
          <div key={i} data-index={i}
            className={`pixel-art-pixel ${pixels.includes(i) ? 'is-painted' : ''}`}
            data-wp-on--click="actions.togglePixel"
            data-wp-class--is-painted="state.paintedPixels.includes(parseInt(dataset.index))"
          />
        ))}
      </div>
    </div>
  );
}
```

### 3.4 Frontend (view.js)

```javascript
import { registerBlock } from '@wordpress/interactivity';

registerBlock('mfgmicha/pixel-art', {
  state: { paintedPixels: [] },
  actions: {
    init: (ctx) => {
      const el = ctx.element;
      try {
        ctx.state.paintedPixels = JSON.parse(el.dataset.pixels || '[]');
      } catch (e) { ctx.state.paintedPixels = []; }
    },
    togglePixel: (ctx, e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const arr = ctx.state.paintedPixels;
      ctx.state.paintedPixels = arr.includes(idx)
        ? arr.filter(i => i !== idx)
        : [...arr, idx];
    },
  },
  callbacks: {
    initOnLoad: (_, ctx) => ctx.actions.init(ctx),
  },
});
```

---

## 4. Styling (style-index.css)

```css
.pixel-art-grid {
  display: grid;
  gap: 1px;
  background: var(--wp--preset--color--cyan, #c8d7e2);
}
.pixel-art-pixel {
  width: 44px; height: 44px;
  background: var(--wp--preset--color--white, #fff);
  cursor: pointer;
}
.pixel-art-pixel.is-painted {
  background: var(--selected-color, #000);
}
```

---

## 5. TDD Workflow

1. Write failing Playwright test
2. Run → verify failure
3. Implement minimum code
4. Run → verify pass
5. Refactor

### Test Example

```javascript
test('pixel toggles on click', async ({ page }) => {
  const pixel = page.locator('.pixel-art-pixel').first();
  await expect(pixel).not.toHaveClass(/is-painted/);
  await pixel.click();
  await expect(pixel).toHaveClass(/is-painted/);
});
```

---

## 6. Implementation Tasks

| Step | Task |
|------|------|
| 1 | Update block.json |
| 2 | Implement edit.js |
| 3 | Implement save.js |
| 4 | Implement view.js |
| 5 | Add CSS |
| 6 | Run tests |

---

## 7. Known Issues

- `JSON.parse` can fail - always wrap in try/catch
- Interactivity API state requires `data-wp-class--*` directive for CSS class toggling
