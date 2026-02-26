import { store, getContext, getElement } from '@wordpress/interactivity';

console.log( 'pxl view loaded' );

const { state } = store( 'mfgmicha/pixel-art-creator', {
	state: {
		get activeColor() {
			// Return the selected color from state, or default to first color
			console.log( 'activeColor getter:', state.selectedColor, state.colors?.[ 0 ]?.color );
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
			console.log( 'selectColor:', color );
			if ( color ) {
				state.selectedColor = color;
			}
		},
		paintCell() {
			console.log( 'paintCell called' );
			const { ref } = getElement();
			if ( ! ref ) {
				console.log( 'paintCell: no ref' );
				return;
			}
			const current = ref.getAttribute( 'data-cell-color' ) || '';
			console.log( 'paintCell: current=', current, 'activeColor=', state.activeColor );
			if ( current && current.toLowerCase() === state.activeColor.toLowerCase() ) {
				ref.style.backgroundColor = '#fff';
				ref.setAttribute( 'data-cell-color', '' );
			} else {
				ref.style.backgroundColor = state.activeColor;
				ref.setAttribute( 'data-cell-color', state.activeColor );
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
			}
		},
		resetGrid() {
			console.log( 'pxl reset' );
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
		},
	},
} );
