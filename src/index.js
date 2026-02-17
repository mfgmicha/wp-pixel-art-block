/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import './index.css';

/**
 * Register the Pixel Art block.
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
 * @see https://developer.wordpress.org/block-editor/getting-started/create-block/
 *
 * @since 1.0.0
 */
registerBlockType( 'mfgmicha/pixel-art', {
	edit: Edit,
	save: Save,
} );
