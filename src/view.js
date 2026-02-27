import { store, getContext, getElement } from '@wordpress/interactivity';

// Helper to get localStorage key for this block.
const getStorageKey = () => {
	return `pixel-art-${ state.blockId }`;
};

// Helper to save grid to localStorage.
const saveToStorage = () => {
	const wrapper = document.querySelector( `.wp-block-mfgmicha-pixel-art-creator[data-block-id="${ state.blockId }"]` );
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
		localStorage.setItem( getStorageKey(), JSON.stringify( gridData ) );
	} catch ( e ) {
		console.warn( 'Could not save to localStorage:', e );
	}
};

// Helper to load grid from localStorage.
const loadFromStorage = () => {
	try {
		const saved = localStorage.getItem( getStorageKey() );
		if ( ! saved ) {
			return;
		}
		const gridData = JSON.parse( saved );
		const wrapper = document.querySelector( `.wp-block-mfgmicha-pixel-art-creator[data-block-id="${ state.blockId }"]` );
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
		paintCell() {
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
			saveToStorage();
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
				saveToStorage();
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
			const cells = wrapper.querySelectorAll( '.pixel-art-creator-grid__cell' );
			for ( let i = 0; i < cells.length; i++ ) {
				cells[ i ].style.backgroundColor = '#fff';
				cells[ i ].setAttribute( 'data-cell-color', '' );
			}
			// Clear localStorage on reset.
			try {
				localStorage.removeItem( getStorageKey() );
			} catch ( e ) {
				console.warn( 'Could not clear localStorage:', e );
			}
		},
	},
} );

// Wait for the Interactivity API state to be available.
const waitForState = () => {
	return new Promise( ( resolve, reject ) => {
		const maxAttempts = 100; // Max 1 second (100 * 10ms)
		let attempts = 0;
		const check = () => {
			attempts++;
			// Check if state.blockId is available
			if ( state.blockId ) {
				resolve( state.blockId );
			} else if ( attempts >= maxAttempts ) {
				// Timeout after 1 second - Interactivity API may not be available
				console.warn( 'Pixel Art: Interactivity state not available' );
				reject( new Error( 'State timeout' ) );
			} else {
				// Retry after a short delay
				setTimeout( check, 10 );
			}
		};
		check();
	} );
};

// Initialize: Add block ID to wrapper, load saved data, and set up drag-to-paint.
document.addEventListener( 'DOMContentLoaded', async () => {
	const wrapper = document.querySelector( '.wp-block-mfgmicha-pixel-art-creator' );
	if ( ! wrapper ) {
		return;
	}

	// Wait for state.blockId to be available (Interactivity API loads asynchronously)
	let blockId;
	try {
		blockId = await waitForState();
		wrapper.setAttribute( 'data-block-id', blockId );
		// Load saved grid from localStorage.
		loadFromStorage();
	} catch ( e ) {
		// Interactivity API not available, skip localStorage and drag-to-paint
		return;
	}

	// Set up drag-to-paint
	let isMouseDown = false;

	wrapper.addEventListener( 'mousedown', ( e ) => {
		// Only track if clicking on a cell or within the grid
		if ( e.target.classList.contains( 'pixel-art-creator-grid__cell' ) ||
			 e.target.closest( '.pixel-art-creator-grid' ) ) {
			isMouseDown = true;
		}
	} );

	wrapper.addEventListener( 'mouseup', () => {
		isMouseDown = false;
	} );

	// Handle mouse leaving the wrapper
	wrapper.addEventListener( 'mouseleave', () => {
		isMouseDown = false;
	} );

	// Add mouseenter handler to cells for drag painting
	const cells = wrapper.querySelectorAll( '.pixel-art-creator-grid__cell' );
	cells.forEach( ( cell ) => {
		cell.addEventListener( 'mouseenter', () => {
			if ( isMouseDown ) {
				// Paint the cell while dragging
				cell.style.backgroundColor = state.activeColor;
				cell.setAttribute( 'data-cell-color', state.activeColor );
				saveToStorage();
			}
		} );
	} );
} );
