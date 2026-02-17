/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Pixel Art Block Save Component
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Rendered block
 */
export default function PixelArtSave( { attributes } ) {
	const { width, height, pixels, selectedColor, showGrid } = attributes;

	/**
	 * Generate grid style
	 */
	const gridStyle = useMemo(
		() => ( {
			display: 'grid',
			gridTemplateColumns: `repeat(${ width }, 1fr)`,
			gap: showGrid ? '1px' : '0',
			width: '100%',
			maxWidth: `${ width * 44 }px`,
		} ),
		[ width, showGrid ]
	);

	/**
	 * Generate pixel elements
	 */
	const pixelElements = useMemo( () => {
		const elements = [];
		for ( let i = 0; i < width * height; i++ ) {
			const isPainted = pixels.includes( i );
			elements.push(
				<div
					key={ i }
					className={ `pixel-art-pixel ${
						isPainted ? 'is-painted' : ''
					}` }
					style={ {
						width: '44px',
						height: '44px',
						backgroundColor: isPainted ? selectedColor : '#ffffff',
						border: showGrid ? '1px solid #e0e0e0' : 'none',
					} }
				/>
			);
		}
		return elements;
	}, [ width, height, pixels, selectedColor, showGrid ] );

	return (
		<div
			className="wp-block-mfgmicha-pixel-art"
			data-width={ width }
			data-height={ height }
			data-pixels={ JSON.stringify( pixels ) }
		>
			<div className="pixel-art-grid" style={ gridStyle }>
				{ pixelElements }
			</div>
		</div>
	);
}
