# Pixel Art Block

A WordPress block plugin that allows users to create pixel art drawings with a customizable grid.

## Description

Pixel Art Block provides a intuitive interface for creating pixel art directly in the WordPress block editor. Users can:

- Create custom-sized pixel art grids (2x2 to 64x64 pixels)
- Click or drag to paint individual pixels
- Clear the canvas to start fresh
- Export pixel data as JSON for backup or reuse

### Features

- **Customizable Grid**: Set width and height from 2 to 64 pixels
- **Drag-to-Paint**: Hold and drag to paint multiple pixels continuously
- **Touch Friendly**: Optimized for mobile devices with 44x44px touch targets
- **Export Functionality**: Save your pixel art as JSON data
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Accessibility**: WCAG compliant touch targets and ARIA labels
- **No Dependencies**: Self-contained plugin with no external requirements

## Installation

### Quick Install (Recommended)

1. Download the latest release zip file from the releases page
2. Go to WordPress Admin > Plugins > Add New > Upload Plugin
3. Upload the zip file and activate

### Development Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile the block assets
4. Zip the entire plugin folder
5. Go to WordPress Admin > Plugins > Add New > Upload Plugin
6. Upload the zip file and activate

## Test on WordPress Playground

Try the Pixel Art Block instantly in your browser without installing WordPress locally:

**[Open in WordPress Playground](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/mfgmicha/wp-pixel-art-block/main/blueprint.json)**

This will:
- Install the Pixel Art Block plugin
- Create a page with the Pixel Art block
- Show the block on the frontend

## Usage

1. In the WordPress block editor, search for "Pixel Art" in the block inserter
2. Select the Pixel Art block to add it to your post or page
3. Use the sidebar controls to set your desired grid dimensions
4. Click or drag on pixels to create your design
5. Use "Clear Canvas" to reset the grid
6. Use "Export JSON" to save your pixel data

## Development

### Available Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start development server with hot reloading
npm run start

# Lint JavaScript files
npm run lint:js

# Lint CSS files
npm run lint:css

# Format code
npm run format

# Create a zip for distribution
npm run plugin-zip
```

### File Structure

```
pixel-art-block/
├── build/              # Compiled assets (created by npm run build)
│   ├── index.js       # Compiled block JavaScript
│   ├── index.css     # Compiled editor styles
│   └── style-index.css # Compiled frontend styles
├── src/               # Source files
│   ├── index.js      # Block registration entry point
│   ├── index.css     # Editor styles
│   ├── style-index.css # Frontend styles
│   ├── style-index.js # Frontend styles entry
│   ├── edit.js       # Block editor component
│   └── save.js       # Block save component
├── block.json        # Block manifest
├── pixel-art-block.php # Main plugin file
├── package.json      # NPM configuration
├── webpack.config.js # Webpack configuration
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 20.0 or higher
- npm 10.0 or higher

## Changelog

### 1.0.0
- Initial release
- Customizable grid dimensions
- Click and drag-to-paint functionality
- Export to JSON
- Responsive design
- Accessibility compliant

## License

This plugin is licensed under the GPL v2 or later.

## Support

For support, please open an issue on the GitHub repository.

## Credits

Created by MFGMicha
