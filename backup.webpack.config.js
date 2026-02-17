const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

/**
 * Custom webpack configuration for Pixel Art Block.
 *
 * Extends the default @wordpress/scripts webpack config to handle
 * custom entry points and output structure.
 *
 * @type {import('webpack').Configuration}
 */
const config = {
	...defaultConfig,
	entry: {
		index: path.resolve( __dirname, 'src', 'index.js' ),
		'style-index': path.resolve( __dirname, 'src', 'style-index.js' ),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, 'build' ),
	},
};

module.exports = config;
