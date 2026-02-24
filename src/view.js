import { store, getContext, getElement } from '@wordpress/interactivity';

console.log( 'pxl view loaded' );

const { state } = store( 'pixel-art', {
	state: {
		get activeColor() {
			console.log( state.colors );
			console.log( 'Color isPainting? ' + state.isPainting );
			return state.isPainting
				? state.colors[ 3 ].color
				: state.colors[ 2 ].color;
		},
		get buttonText() {
			console.log( state.colors );
			console.log( 'Text isPainting? ' + state.isPainting );
			return state.isPainting ? state.stopText : state.startText;
		},
	},
	actions: {
		togglePainting() {
			state.isPainting = ! state.isPainting;
		},
	},
} );

/*
store( 'telex/pixel-art', {
	state: {
		get isActiveSwatch() {
			const ctx = getContext();
			return ctx.swatchColor && ctx.activeColor &&
				ctx.swatchColor.toLowerCase() === ctx.activeColor.toLowerCase();
		},
	},
	actions: {
		selectColor() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			const color = ref.getAttribute( 'data-swatch-color' );
			if ( color ) {
				ctx.activeColor = color;
			}
		},
		paintCell() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			const current = ref.getAttribute( 'data-cell-color' ) || '';
			if ( current && current.toLowerCase() === ctx.activeColor.toLowerCase() ) {
				ref.style.backgroundColor = '#fff';
				ref.setAttribute( 'data-cell-color', '' );
			} else {
				ref.style.backgroundColor = ctx.activeColor;
				ref.setAttribute( 'data-cell-color', ctx.activeColor );
			}
		},
		handleCellKeydown( event ) {
			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				const ctx = getContext();
				const { ref } = getElement();
				if ( ! ref ) {
					return;
				}
				const current = ref.getAttribute( 'data-cell-color' ) || '';
				if ( current && current.toLowerCase() === ctx.activeColor.toLowerCase() ) {
					ref.style.backgroundColor = '#fff';
					ref.setAttribute( 'data-cell-color', '' );
				} else {
					ref.style.backgroundColor = ctx.activeColor;
					ref.setAttribute( 'data-cell-color', ctx.activeColor );
				}
			}
		},
		startPainting( event ) {
			event.preventDefault();
			const ctx = getContext();
			ctx.isPainting = true;
		},
		stopPainting() {
			const ctx = getContext();
			ctx.isPainting = false;
		},
		paintOnDrag( event ) {
			const ctx = getContext();
			if ( ! ctx.isPainting ) {
				return;
			}
			const target = event.target;
			if ( target && target.classList.contains( 'pixel-art-creator-grid__cell' ) ) {
				target.style.backgroundColor = ctx.activeColor;
				target.setAttribute( 'data-cell-color', ctx.activeColor );
			}
		},
		resetGrid() {
			console.log('pxl reset');
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
*/
