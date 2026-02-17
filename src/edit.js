/**
 * WordPress dependencies
 */
/* eslint-disable no-alert, no-undef */
import { __ } from '@wordpress/i18n';
import {
	useState,
	useCallback,
	useEffect,
	useRef,
	useMemo,
} from '@wordpress/elements';
import {
	PanelBody,
	RangeControl,
	Button,
	Notice,
	InspectorControls,
	ColorPicker,
} from '@wordpress/components';

/**
 * Pixel Art Block Edit Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 */
export default function PixelArtEdit( { attributes, setAttributes } ) {
	const { width, height, pixels, selectedColor, showGrid } = attributes;

	// State for tracking drawing
	const [ isDrawing, setIsDrawing ] = useState( false );
	const [ drawnPixels, setDrawnPixels ] = useState( new Set() );
	const [ copied, setCopied ] = useState( false );
	const [ copyError, setCopyError ] = useState( false );

	// Memoize pixels as Set for O(1) lookups
	const pixelsSet = useMemo( () => new Set( pixels ), [ pixels ] );

	// Ref for the grid container
	const gridRef = useRef( null );

	/**
	 * Check if a pixel is painted
	 */
	const isPixelPainted = useCallback(
		( index ) => {
			return pixelsSet.has( index );
		},
		[ pixelsSet ]
	);

	/**
	 * Toggle a single pixel
	 */
	const togglePixel = useCallback(
		( index ) => {
			setIsDrawing( true );
			const newPixels = pixels.includes( index )
				? pixels.filter( ( i ) => i !== index )
				: [ ...pixels, index ];
			setAttributes( { pixels: newPixels } );
		},
		[ pixels, setAttributes ]
	);

	/**
	 * Paint a pixel (only add, don't remove during drag)
	 */
	const paintPixel = useCallback(
		( index ) => {
			if ( ! pixelsSet.has( index ) ) {
				const newPixels = [ ...pixels, index ];
				setAttributes( { pixels: newPixels } );
			}
		},
		[ pixelsSet, pixels, setAttributes ]
	);

	/**
	 * Erase a pixel during drag
	 */
	const erasePixel = useCallback(
		( index ) => {
			if ( pixelsSet.has( index ) ) {
				const newPixels = pixels.filter( ( i ) => i !== index );
				setAttributes( { pixels: newPixels } );
			}
		},
		[ pixelsSet, pixels, setAttributes ]
	);

	/**
	 * Handle mouse down on a pixel
	 */
	const handlePixelMouseDown = useCallback(
		( index, event ) => {
			event.preventDefault();
			setIsDrawing( true );
			setDrawnPixels( new Set( [ index ] ) );

			// Toggle on initial click
			if ( event.shiftKey ) {
				// Shift+click erases
				erasePixel( index );
			} else {
				// Normal click toggles
				togglePixel( index );
			}
		},
		[ togglePixel, erasePixel ]
	);

	/**
	 * Handle mouse enter on a pixel (for drag painting)
	 */
	const handlePixelMouseEnter = useCallback(
		( index ) => {
			if ( isDrawing && ! drawnPixels.has( index ) ) {
				setDrawnPixels( ( prev ) => new Set( [ ...prev, index ] ) );
				paintPixel( index );
			}
		},
		[ isDrawing, drawnPixels, paintPixel ]
	);

	/**
	 * Handle global mouse up to stop drawing
	 */
	useEffect( () => {
		const handleMouseUp = () => {
			setIsDrawing( false );
			setDrawnPixels( new Set() );
		};

		document.addEventListener( 'mouseup', handleMouseUp );
		return () => document.removeEventListener( 'mouseup', handleMouseUp );
	}, [] );

	/**
	 * Handle touch start on a pixel
	 */
	const handlePixelTouchStart = useCallback(
		( index, event ) => {
			event.preventDefault();
			setIsDrawing( true );
			setDrawnPixels( new Set( [ index ] ) );
			togglePixel( index );
		},
		[ togglePixel ]
	);

	/**
	 * Handle touch move on the grid
	 */
	const handleTouchMove = useCallback(
		( event ) => {
			if ( ! isDrawing || ! gridRef.current ) {
				return;
			}

			const touch = event.touches[ 0 ];
			const element = document.elementFromPoint(
				touch.clientX,
				touch.clientY
			);

			if (
				element &&
				element.dataset &&
				element.dataset.pixelIndex !== undefined
			) {
				const index = parseInt( element.dataset.pixelIndex, 10 );
				if ( ! drawnPixels.has( index ) ) {
					setDrawnPixels( ( prev ) => new Set( [ ...prev, index ] ) );
					paintPixel( index );
				}
			}
		},
		[ isDrawing, drawnPixels, paintPixel ]
	);

	/**
	 * Handle touch end to stop drawing
	 */
	const handleTouchEnd = useCallback( () => {
		setIsDrawing( false );
		setDrawnPixels( new Set() );
	}, [] );

	/**
	 * Handle width change
	 */
	const handleWidthChange = useCallback(
		( newWidth ) => {
			const parsedWidth = parseInt( newWidth, 10 ) || 2;
			const clampedWidth = Math.max( 2, Math.min( 64, parsedWidth ) );
			setAttributes( { width: clampedWidth } );
		},
		[ setAttributes ]
	);

	/**
	 * Handle height change
	 */
	const handleHeightChange = useCallback(
		( newHeight ) => {
			const parsedHeight = parseInt( newHeight, 10 ) || 2;
			const clampedHeight = Math.max( 2, Math.min( 64, parsedHeight ) );
			setAttributes( { height: clampedHeight } );
		},
		[ setAttributes ]
	);

	/**
	 * Clear the canvas
	 */
	const handleClearCanvas = useCallback( () => {
		if (
			confirm(
				__(
					'Are you sure you want to clear the canvas?',
					'pixel-art-block'
				)
			)
		) {
			setAttributes( { pixels: [] } );
		}
	}, [ setAttributes ] );

	/**
	 * Export pixels as JSON to clipboard
	 */
	const handleExport = useCallback( () => {
		const jsonString = JSON.stringify( pixels );
		navigator.clipboard
			.writeText( jsonString )
			.then( () => {
				setCopyError( false );
				setCopied( true );
				setTimeout( () => setCopied( false ), 3000 );
			} )
			.catch( () => {
				setCopyError( true );
				setTimeout( () => setCopyError( false ), 3000 );
			} );
	}, [ pixels ] );

	/**
	 * Generate grid style
	 */
	const gridStyle = {
		display: 'grid',
		gridTemplateColumns: `repeat(${ width }, 1fr)`,
		gap: showGrid ? '1px' : '0',
		width: '100%',
		maxWidth: `${ width * 44 }px`,
	};

	/**
	 * Render a single pixel cell
	 */
	const renderPixel = useCallback(
		( index ) => {
			const isPainted = isPixelPainted( index );
			const isHovered = drawnPixels.has( index ) && ! isPainted;
			const pixelColor = isPainted ? selectedColor : 'white';

			return (
				<div
					key={ index }
					data-pixel-index={ index }
					className={ `pixel-art-pixel ${
						isPainted ? 'is-painted' : ''
					} ${ isHovered ? 'is-hovered' : '' }` }
					onMouseDown={ ( event ) =>
						handlePixelMouseDown( index, event )
					}
					onMouseEnter={ () => handlePixelMouseEnter( index ) }
					onTouchStart={ ( event ) =>
						handlePixelTouchStart( index, event )
					}
					role="button"
					tabIndex={ 0 }
					aria-label={ 'Pixel ' + ( index + 1 ) + ', ' + pixelColor }
					style={ {
						width: '44px',
						height: '44px',
						backgroundColor: isPainted ? selectedColor : '#ffffff',
						border: showGrid ? '1px solid #e0e0e0' : 'none',
						cursor: 'pointer',
						transition: 'background-color 0.15s ease',
					} }
				/>
			);
		},
		[
			isPixelPainted,
			drawnPixels,
			selectedColor,
			showGrid,
			handlePixelMouseDown,
			handlePixelMouseEnter,
			handlePixelTouchStart,
		]
	);

	/**
	 * Generate pixel elements
	 */
	const pixelElements = useMemo( () => {
		const elements = [];
		for ( let i = 0; i < width * height; i++ ) {
			elements.push( renderPixel( i ) );
		}
		return elements;
	}, [ width, height, renderPixel ] );

	return (
		<div className="wp-block-mfgmicha-pixel-art">
			<div
				ref={ gridRef }
				className="pixel-art-grid"
				style={ gridStyle }
				onTouchMove={ handleTouchMove }
				onTouchEnd={ handleTouchEnd }
			>
				{ pixelElements }
			</div>

			<InspectorControls>
				<PanelBody
					title={ __( 'Pixel Art Settings', 'pixel-art-block' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Width', 'pixel-art-block' ) }
						value={ width }
						onChange={ handleWidthChange }
						min={ 2 }
						max={ 64 }
						step={ 1 }
					/>

					<RangeControl
						label={ __( 'Height', 'pixel-art-block' ) }
						value={ height }
						onChange={ handleHeightChange }
						min={ 2 }
						max={ 64 }
						step={ 1 }
					/>

					<ColorPicker
						label={ __( 'Color', 'pixel-art-block' ) }
						color={ selectedColor }
						onChange={ ( color ) =>
							setAttributes( { selectedColor: color } )
						}
					/>

					<div className="pixel-art-controls">
						<Button
							isSecondary
							isDestructive
							onClick={ handleClearCanvas }
							className="pixel-art-clear-button"
						>
							{ __( 'Clear Canvas', 'pixel-art-block' ) }
						</Button>

						<Button
							isPrimary
							onClick={ handleExport }
							className="pixel-art-export-button"
						>
							{ __( 'Export JSON', 'pixel-art-block' ) }
						</Button>
					</div>

					{ copied && (
						<Notice
							status="success"
							isDismissible={ false }
							className="pixel-art-notice"
						>
							{ __(
								'Pixel data copied to clipboard!',
								'pixel-art-block'
							) }
						</Notice>
					) }

					{ copyError && (
						<Notice
							status="error"
							isDismissible={ false }
							className="pixel-art-notice"
						>
							{ __(
								'Failed to copy to clipboard. Please try again.',
								'pixel-art-block'
							) }
						</Notice>
					) }
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
