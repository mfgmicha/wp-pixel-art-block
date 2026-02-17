/**
 * Pixel Art Block Save Component
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Rendered block
 */
export default function PixelArtSave( { attributes } ) {
	const {
		width = 16,
		height = 16,
		pixels = [],
		selectedColor = '#000000',
		showGrid = true,
	} = attributes;

	const gridStyle = {
		display: 'grid',
		gridTemplateColumns: `repeat(${ width }, 1fr)`,
		gap: showGrid ? '1px' : '0',
		width: '100%',
		maxWidth: `${ width * 44 }px`,
	};

	const pixelElements = [];
	for ( let i = 0; i < width * height; i++ ) {
		const isPainted = pixels.includes( i );
		pixelElements.push(
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

	return (
		<div
			className="wp-block-mfgmicha-pixel-art"
			data-width={ width }
			data-height={ height }
			data-pixels={ JSON.stringify( pixels ) }
			data-selected-color={ selectedColor }
		>
			<div className="pixel-art-grid" style={ gridStyle }>
				{ pixelElements }
			</div>
		</div>
	);
}
