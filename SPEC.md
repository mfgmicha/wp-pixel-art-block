# Pixel Art Block - Frontend React Conversion

## Overview

Convert the frontend interactivity from plain JavaScript to React for better maintainability and extensibility.

## Current State

### Files
- `src/edit.js` - Editor placeholder (working)
- `src/save.js` - Outputs interactive grid HTML (will change)
- `src/view.js` - Plain JS for frontend interactivity (will convert to React)
- `src/block.json` - Block configuration

### Current Functionality
- **Editor**: Simple placeholder "Pixel Art Block"
- **Frontend**: Interactive 16x16 grid, click to toggle pixels, color from data attribute

---

## Target State

### Architecture
- **Editor (save.js)**: Simple placeholder div for React to mount into
- **Frontend (view.js)**: React component for interactive grid

### MVP Functionality (Same as Current)
- 16x16 grid (configurable via block attributes later)
- Click pixel to toggle painted state
- Color from block attributes
- No persistence (lost on refresh)

### Future Possibilities
- Save grid size to block attributes
- Save pixel data to block markup
- Color picker
- Grid size controls

---

## Implementation Plan

### Step 1: Update save.js
Replace grid HTML output with simple placeholder div.

**File:** `src/save.js`
```js
import { createElement } from '@wordpress/element';

export default function Save() {
    return (
        <div className="wp-block-mfgmicha-pixel-art">
        </div>
    );
}
```

### Step 2: Update block.json
Ensure viewScript can load React dependencies.

**File:** `src/block.json`
- May need to add `wp-element` as dependency for viewScript

### Step 3: Convert view.js to React
Create React component for frontend.

**MVP approach using plain JS inside the event listener:**
```js
import { createElement } from '@wordpress/element';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.wp-block-mfgmicha-pixel-art');
    if (!container) return;
    
    // Get attributes from container data attributes
    const width = parseInt(container.dataset.width || '16', 10);
    const height = parseInt(container.dataset.height || '16', 10);
    const selectedColor = container.dataset.selectedColor || '#000000';
    const showGrid = container.dataset.showGrid !== 'false';
    
    // State for painted pixels
    let paintedPixels = new Set();
    
    // Render grid
    function render() {
        container.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = 'pixel-art-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        grid.style.gap = showGrid ? '1px' : '0';
        grid.style.width = '100%';
        grid.style.maxWidth = `${width * 44}px`;
        
        for (let i = 0; i < width * height; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel-art-pixel';
            pixel.style.width = '44px';
            pixel.style.height = '44px';
            pixel.style.cursor = 'pointer';
            
            if (paintedPixels.has(i)) {
                pixel.style.backgroundColor = selectedColor;
            } else {
                pixel.style.backgroundColor = '#ffffff';
            }
            
            if (showGrid) {
                pixel.style.border = '1px solid #e0e0e0';
            }
            
            pixel.addEventListener('click', () => {
                if (paintedPixels.has(i)) {
                    paintedPixels.delete(i);
                    pixel.style.backgroundColor = '#ffffff';
                } else {
                    paintedPixels.add(i);
                    pixel.style.backgroundColor = selectedColor;
                }
            });
            
            grid.appendChild(pixel);
        }
        
        container.appendChild(grid);
    }
    
    render();
});
```

**Note:** Using plain JS inside the event listener for initial MVP. Can fully convert to React later.

### Step 4: Rebuild
```bash
npm run build
```

### Step 5: Test
- Editor: Block should show placeholder, be clickable, show description in sidebar
- Frontend: Grid should render, pixels clickable and toggle color

---

## Notes

- WordPress automatically loads `wp-element` for viewScript when specified in block.json
- save.js returns HTML that view.js then hydrates/interacts with
- No persistence - pixel state is lost on page refresh

---

## Alternative: Full React Approach

If we want to use React fully for view.js (instead of plain JS wrapper):

```js
import { createElement, useState } from '@wordpress/element';

document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.wp-block-mfgmicha-pixel-art');
    
    blocks.forEach(block => {
        const width = parseInt(block.dataset.width || '16', 10);
        const height = parseInt(block.dataset.height || '16', 10);
        const selectedColor = block.dataset.selectedColor || '#000000';
        const showGrid = block.dataset.showGrid !== 'false';
        
        function PixelGrid() {
            const [painted, setPainted] = useState(new Set());
            
            function togglePixel(index) {
                const newSet = new Set(painted);
                if (newSet.has(index)) {
                    newSet.delete(index);
                } else {
                    newSet.add(index);
                }
                setPainted(newSet);
            }
            
            const pixels = [];
            for (let i = 0; i < width * height; i++) {
                const isPainted = painted.has(i);
                pixels.push(
                    createElement('div', {
                        key: i,
                        className: 'pixel-art-pixel',
                        style: {
                            width: '44px',
                            height: '44px',
                            backgroundColor: isPainted ? selectedColor : '#ffffff',
                            border: showGrid ? '1px solid #e0e0e0' : 'none',
                            cursor: 'pointer'
                        },
                        onClick: () => togglePixel(i)
                    })
                );
            }
            
            return createElement('div', {
                className: 'pixel-art-grid',
                style: {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${width}, 1fr)`,
                    gap: showGrid ? '1px' : '0',
                    width: '100%',
                    maxWidth: `${width * 44}px`
                }
            }, pixels);
        }
        
        // Render with React
        // Note: This requires React to be loaded separately
    });
});
```

This requires additional setup to load React on the frontend, which adds complexity. Recommended to start with the simpler plain JS approach.

---

## Todo List

- [ ] Update save.js to return placeholder div
- [ ] Update block.json if needed for viewScript dependencies
- [ ] Convert view.js to React (or plain JS approach)
- [ ] Rebuild plugin
- [ ] Test editor (placeholder, selectable, sidebar description)
- [ ] Test frontend (grid renders, pixels clickable)
