import { store, getContext, getElement } from '@wordpress/interactivity';

// Helper to get block ID from the wrapper element.
// Falls back to generating a random ID if Interactivity API state isn't available.
const getBlockId = ( wrapper ) => {
	// First try to get from data attribute (set by Interactivity API)
	const dataId = wrapper.getAttribute( 'data-wp-context' );
	if ( dataId ) {
		try {
			const ctx = JSON.parse( dataId );
			if ( ctx && ctx.clientId ) {
				return ctx.clientId;
			}
		} catch ( e ) {
			// Ignore parse errors
		}
	}
	// Try to get from data-block-id attribute (set below)
	const blockIdAttr = wrapper.getAttribute( 'data-block-id' );
	if ( blockIdAttr ) {
		return blockIdAttr;
	}
	// Fallback: generate a unique ID based on wrapper position
	return 'block-' + Array.from( document.querySelectorAll( '.wp-block-mfgmicha-pixel-art-creator' ) ).indexOf( wrapper );
};

// Helper to get localStorage key for this block.
const getStorageKey = ( blockId ) => {
	const siteId = window.location.pathname.replace( /\//g, '-' ) || 'root';
	return `pixel-art-${ siteId }-${ blockId }`;
};

// Helper to save grid to localStorage.
const saveToStorage = ( blockId ) => {
	const wrapper = document.querySelector( `.wp-block-mfgmicha-pixel-art-creator[data-block-id="${ blockId }"]` );
	if ( ! wrapper ) {
		return;
	}
	const cells = wrapper.querySelectorAll( '.pixel-art-creator-grid__cell' );
	const gridData = {};
	cells.forEach( ( cell, index ) => {
		const color = cell.getAttribute( 'data-cell-color' );
		if ( color ) {
			gridData[ index ] = color;
		}
	} );
	try {
		localStorage.setItem( getStorageKey( blockId ), JSON.stringify( gridData ) );
	} catch ( e ) {
		console.warn( 'Could not save to localStorage:', e );
	}
};

// Helper to load grid from localStorage.
const loadFromStorage = ( blockId ) => {
	try {
		const saved = localStorage.getItem( getStorageKey( blockId ) );
		if ( ! saved ) {
			return;
		}
		const gridData = JSON.parse( saved );
		const wrapper = document.querySelector( `.wp-block-mfgmicha-pixel-art-creator[data-block-id="${ blockId }"]` );
		if ( ! wrapper ) {
			return;
		}
		const cells = wrapper.querySelectorAll( '.pixel-art-creator-grid__cell' );
		cells.forEach( ( cell, index ) => {
			if ( gridData[ index ] ) {
				cell.style.backgroundColor = gridData[ index ];
				cell.setAttribute( 'data-cell-color', gridData[ index ] );
			}
		} );
	} catch ( e ) {
		console.warn( 'Could not load from localStorage:', e );
	}
};

const { state } = store( 'mfgmicha/pixel-art-creator', {
	state: {
		get activeColor() {
			// Return the selected color from state, or default to first color
			return state.selectedColor || state.colors?.[ 0 ]?.color || '#000000';
		},
		get isActiveSwatch() {
			const ctx = getContext();
			const swatchColor = ctx.item?.color;
			return swatchColor && state.activeColor &&
				swatchColor.toLowerCase() === state.activeColor.toLowerCase();
		},
		// Drag state
		isDragging: false,
		justPainted: false,
	},
	actions: {
		selectColor() {
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			const color = ref.getAttribute( 'data-swatch-color' );
			if ( color ) {
				state.selectedColor = color;
			}
		},
		// Start drag: paints cell and sets drag state
		startDragging() {
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			// Paint the cell (or repaint if already painted with different color)
			ref.style.backgroundColor = state.activeColor;
			ref.setAttribute( 'data-cell-color', state.activeColor );
			// Save to localStorage
			const wrapper = ref.closest( '.wp-block-mfgmicha-pixel-art-creator' );
			const blockId = wrapper ? getBlockId( wrapper ) : null;
			if ( blockId ) {
				saveToStorage( blockId );
			}
			// Set drag state
			state.isDragging = true;
			// Set justPainted if this was an empty cell
			const currentColor = ref.getAttribute( 'data-cell-color' ) || '';
			state.justPainted = ( currentColor === state.activeColor );
		},
		// Continue drag: paints cell if dragging
		dragPaint() {
			if ( ! state.isDragging ) {
				return;
			}
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			// Paint the cell
			ref.style.backgroundColor = state.activeColor;
			ref.setAttribute( 'data-cell-color', state.activeColor );
			state.justPainted = false; // Clear the flag since we're now dragging
			// Save to localStorage
			const wrapper = ref.closest( '.wp-block-mfgmicha-pixel-art-creator' );
			const blockId = wrapper ? getBlockId( wrapper ) : null;
			if ( blockId ) {
				saveToStorage( blockId );
			}
		},
		// Stop drag: resets drag state
		stopDragging() {
			state.isDragging = false;
			// Don't clear justPainted here - let paintCell handle it
		},
		paintCell() {
			// If justPainted is true, it was painted by mousedown - clear flag but don't toggle
			if ( state.justPainted ) {
				state.justPainted = false;
				return;
			}
			// If isDragging is true, we're in a drag operation - don't toggle
			if ( state.isDragging ) {
				return;
			}
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			const current = ref.getAttribute( 'data-cell-color' ) || '';
			if ( current && current.toLowerCase() === state.activeColor.toLowerCase() ) {
				ref.style.backgroundColor = '#fff';
				ref.setAttribute( 'data-cell-color', '' );
			} else {
				ref.style.backgroundColor = state.activeColor;
				ref.setAttribute( 'data-cell-color', state.activeColor );
			}
			// Save to localStorage after painting.
			const wrapper = ref.closest( '.wp-block-mfgmicha-pixel-art-creator' );
			const blockId = wrapper ? getBlockId( wrapper ) : null;
			if ( blockId ) {
				saveToStorage( blockId );
			}
		},
		handleCellKeydown( event ) {
			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				const { ref } = getElement();
				if ( ! ref ) {
					return;
				}
				const current = ref.getAttribute( 'data-cell-color' ) || '';
				if ( current && current.toLowerCase() === state.activeColor.toLowerCase() ) {
					ref.style.backgroundColor = '#fff';
					ref.setAttribute( 'data-cell-color', '' );
				} else {
					ref.style.backgroundColor = state.activeColor;
					ref.setAttribute( 'data-cell-color', state.activeColor );
				}
				// Save to localStorage after painting.
				const wrapper = ref.closest( '.wp-block-mfgmicha-pixel-art-creator' );
				const blockId = wrapper ? getBlockId( wrapper ) : null;
				if ( blockId ) {
					saveToStorage( blockId );
				}
			}
		},
		resetGrid() {
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			const wrapper = ref.closest( '.wp-block-mfgmicha-pixel-art-creator' );
			if ( ! wrapper ) {
				return;
			}
			const blockId = getBlockId( wrapper );
			const cells = wrapper.querySelectorAll( '.pixel-art-creator-grid__cell' );
			for ( let i = 0; i < cells.length; i++ ) {
				cells[ i ].style.backgroundColor = '#fff';
				cells[ i ].setAttribute( 'data-cell-color', '' );
			}
			// Clear localStorage on reset.
			try {
				localStorage.removeItem( getStorageKey( blockId ) );
			} catch ( e ) {
				console.warn( 'Could not clear localStorage:', e );
			}
		},
	},
} );

// Initialize: Add block ID to wrapper and load saved data.
// Drag-to-paint is now handled by Interactivity API directives.
document.addEventListener( 'DOMContentLoaded', () => {
	const wrapper = document.querySelector( '.wp-block-mfgmicha-pixel-art-creator' );
	if ( ! wrapper ) {
		return;
	}

	// Get block ID from the wrapper using our helper
	const blockId = getBlockId( wrapper );
	wrapper.setAttribute( 'data-block-id', blockId );

	// Load saved grid from localStorage
	loadFromStorage( blockId );
} );
