# Pixel Art Creator

An interactive pixel art creator block for WordPress. Visitors can paint pixel art directly on your site using a configurable grid and your theme's color palette.

- **Author:** Micha Krapp
- **Version:** 0.3.0
- **Requires at least:** WordPress 6.7
- **Requires PHP:** 8.2
- **Tested up to:** WordPress 6.8
- **License:** [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html)
- **Tags:** block, pixel-art, interactive, creative, grid

## Description

Pixel Art Creator brings creative fun to your WordPress site. Place the block on any page or post to give your visitors an interactive pixel art canvas.

**Features:**

* Configurable grid size — set columns and rows between 4 and 32 via the block sidebar
* Automatically uses your theme's color palette for a consistent look
* Click a color, then click grid cells to paint them
* Click a painted cell with the same color to erase it back to white
* One-click Reset button clears the entire canvas
* Fully responsive — the grid scrolls horizontally on small screens
* Pure client-side interaction — no data is saved or sent to a server

Perfect for creative portfolios, children's sites, art blogs, or any site that wants to add a playful interactive element.

## Installation

1. Upload the plugin files to the `/wp-content/plugins/pixel-art-creator` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Add the "Pixel Art Creator" block to any post or page via the block editor.

## Frequently Asked Questions

### Can I change the grid size?

Yes! Use the block sidebar (Inspector Controls) to set the number of columns and rows, each between 4 and 32.

### Where do the colors come from?

The block uses your active theme's color palette. If no theme palette is found, a set of sensible default colors is provided.

### Is the pixel art saved?

No. The pixel art is purely client-side and resets when the page is reloaded. This keeps things lightweight and fun.
