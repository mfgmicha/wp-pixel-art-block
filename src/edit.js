/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Pixel Art Block Edit Component
 *
 * Simple placeholder - the interactive block is on the frontend.
 */
export default function PixelArtEdit() {
	return (
		<p { ...useBlockProps() }>Pixel Art Block</p>
	);
}
