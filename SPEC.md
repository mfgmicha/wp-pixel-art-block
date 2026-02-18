# Pixel Art Block - Technical Specification

> WordPress Gutenberg block for creating pixel art with TDD and Interactivity API

---

## 1. Overview

**Goal**: Interactive 16x16 pixel art grid in Gutenberg editor and frontend.

### Requirements

| Feature | Description |
|---------|-------------|
| Grid | 16x16 (configurable), paint/erase toggle |
| Colors | Default #000000, user-selectable |
| Output | Block attributes for persistence |

### Block Attributes

| Attribute | Type | Default |
|-----------|------|---------|
| `width` | number | 16 |
| `height` | number | 16 |
| `pixels` | array | [] |
| `selectedColor` | string | '#000000' |
| `showGrid` | boolean | true |

---

## 2. Architecture

### Data Flow

```
User Action → Editor (React) → setAttributes() → Save (HTML data-attrs) → Frontend (Interactivity API)
```

### Technology

- **Editor**: React via @wordpress/scripts
- **Frontend**: WordPress Interactivity API
- **Styling**: CSS custom properties with fallbacks
- **Testing**: Playwright (E2E)

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
  "supports": {
    "html": false,
    "align": ["wide", "full"]
  },
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
    const newPixels = [...pixels];
    const idx = newPixels.indexOf(index);
    tool === 'paint' 
      ? idx === -1 && newPixels.push(index)
      : idx !== -1 && newPixels.splice(idx, 1);
    setAttributes({ pixels: newPixels });
  };

  return (
    <div {...useBlockProps()}>
      <div className="pixel-art-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gap: showGrid ? '1px' : '0',
      }}>
        {Array.from({ length: width * height }, (_, i) => (
          <div
            key={i}
            onClick={() => togglePixel(i)}
            style={{
              width: '32px', height: '32px',
              backgroundColor: pixels.includes(i) ? selectedColor : '#fff',
              border: showGrid ? '1px solid #e0e0e0' : 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      <div className="controls">
        <input type="color" value={selectedColor}
          onChange={e => setAttributes({ selectedColor: e.target.value })} />
        <button onClick={() => setTool('paint')}>Paint</button>
        <button onClick={() => setTool('erase')}>Erase</button        <button onClick={() => setAttributes({ pixels: [] })}>Clear</button>
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
    <div
      className="wp-block-mfgmicha-pixel-art"
      data-width={width}
      data-height={height}
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
          <div
            key={i}
            data-index={i}
            data-wp-on--click="actions.togglePixel"
            style={{
              width: '32px', height: '32px',
              backgroundColor: pixels.includes(i) ? selectedColor : '#fff',
              border: showGrid ? '1px solid #e0e0e0' : 'none',
            }}
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
    togglePixel: (ctx, e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const arr = ctx.state.paintedPixels;
      ctx.state.paintedPixels = arr.includes(idx)
        ? arr.filter(i => i !== idx)
        : [...arr, idx];
    },
  },
});
```

---

## 4. TDD Workflow

### Test-First Steps

1. Write failing Playwright test
2. Run test → verify failure
3. Implement minimum code
4. Run test → verify pass
5. Refactor

### Example Test (tests/block.spec.js)

```javascript
import { test, expect } from '@playwright/test';

test('block renders in editor', async ({ page }) => {
  await page.goto('/wp-admin/post-new.php');
  await page.click('button[aria-label="Add block"]');
  await page.fill('input[placeholder="Search"]', 'Pixel Art');
  await page.click('button:has-text("Pixel Art")');
  await expect(page.locator('.pixel-art-grid')).toBeVisible();
});

test('pixel toggles on click', async ({ page }) => {
  // Setup: insert block
  const pixel = page.locator('.pixel-art-pixel').first();
  await expect(pixel).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await pixel.click();
  await expect(pixel).toHaveCSS('background-color', 'rgb(0, 0, 0)');
});
```

---

## 5. Implementation Tasks

| Step | Task | Test |
|------|------|------|
| 1 | Update block.json | Verify block registers |
| 2 | Implement edit.js | Grid renders, clicks work |
| 3 | Implement save.js | Data attrs present |
| 4 | Implement view.js | Frontend toggle works |
| 5 | Add styles | Visual consistency |
| 6 | Run full tests | All pass |

---

## 6. Styling

Use WordPress CSS variables with fallbacks:

```css
.pixel-art-pixel {
  background-color: var(--wp--preset--color--white, #fff);
  border-color: var(--wp--preset--color--cyan, #c8d7e2);
}
```

---

## 7. Storage Architectures

### Requirement

Editor configures block → Visitors draw on frontend → Multiple drawings per post from different users.

### Option A: Post Meta + User Hash (Recommended)

Store all drawings in single post meta as JSON:

```json
{
  "user_hash_1": { "pixels": [0,5,10], "color": "#ff0000", "timestamp": 1234567890 },
  "user_hash_2": { "pixels": [1,2,3], "color": "#00ff00", "timestamp": 1234567891 }
}
```

- **User ID**: Cookie-generated hash (e.g., `pixel_user_abc123`)
- **Storage**: Existing `wp_postmeta` table
- **Pros**: No new tables, WordPress handles it
- **Cons**: Meta can grow (mitigate: per-user limits)

### Option B: Custom Table

```sql
CREATE TABLE wp_pixel_art_drawings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_hash VARCHAR(32) NOT NULL,
  pixels JSON NOT NULL,
  color VARCHAR(7) DEFAULT '#000000',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_post (post_id),
  INDEX idx_user (post_id, user_hash)
);
```

- **Pros**: Scalable, proper schema
- **Cons**: Requires plugin activation hooks, more complex

### Option C: localStorage + URL Share

- Drawings in browser localStorage
- Share via URL: `?d=base64pixels`
- **Pros**: Zero server changes
- **Cons**: No collaborative drawing

### Option D: Hybrid

- Default: localStorage for personal drawing
- "Save" button sends to server
- Admin sees submissions in editor
- **Pros**: Simple, opt-in persistence

---

## 8. Known Issues

- `@wordpress/element` does NOT export `useState` - use Interactivity API instead
- `viewScript` does not auto-load dependencies - Interactivity API needs none
- JSON.parse can fail - always wrap in try/catch
