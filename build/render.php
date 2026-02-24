<?php
/**
 * Render callback for the Pixel Art Creator block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$columns = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 16;
$rows    = isset( $attributes['rows'] ) ? absint( $attributes['rows'] ) : 16;

$columns = max( 4, min( 32, $columns ) );
$rows    = max( 4, min( 32, $rows ) );

// Build the palette from the theme.
$palette = array();

// Method 1: wp_get_global_settings with nested structure.
if ( function_exists( 'wp_get_global_settings' ) ) {
	$color_palette = wp_get_global_settings( array( 'color', 'palette' ) );
	
	//error_log( print_r($color_palette, true));

	if ( is_array( $color_palette ) && ! empty( $color_palette ) ) {
		// Could be nested by origin: { default: [...], theme: [...], custom: [...] }.
		foreach ( array( 'theme', 'custom', 'default' ) as $origin ) {
			if ( ! empty( $color_palette[ $origin ] ) && is_array( $color_palette[ $origin ] ) ) {
				$palette = $color_palette[ $origin ];
				break;
			}
		}
		// Could be a flat indexed array.
		if ( empty( $palette ) && isset( $color_palette[0] ) && isset( $color_palette[0]['color'] ) ) {
			$palette = $color_palette;
		}
	}
}

// Hardcoded fallback.
/*
if ( empty( $palette ) ) {
	$palette = array(
		array( 'name' => 'Black', 'slug' => 'black', 'color' => '#000000' ),
		array( 'name' => 'White', 'slug' => 'white', 'color' => '#ffffff' ),
		array( 'name' => 'Red', 'slug' => 'red', 'color' => '#cf2e2e' ),
		array( 'name' => 'Orange', 'slug' => 'orange', 'color' => '#ff6900' ),
		array( 'name' => 'Yellow', 'slug' => 'yellow', 'color' => '#fcb900' ),
		array( 'name' => 'Green', 'slug' => 'green', 'color' => '#00d084' ),
		array( 'name' => 'Blue', 'slug' => 'blue', 'color' => '#0693e3' ),
		array( 'name' => 'Purple', 'slug' => 'purple', 'color' => '#9b51e0' ),
	);
}
*/

$colors = array();
foreach ( $palette as $item ) {
	if ( ! empty( $item['color'] ) ) {
		$colors[] = array(
			'name'  => isset( $item['name'] ) ? $item['name'] : '',
			'color' => $item['color'],
			'slug'  => $item['slug'],
		);
	}
}

$first_color = ! empty( $colors[0]['color'] ) ? $colors[0]['color'] : '#000000';

$total_cells = $columns * $rows;

//error_log( print_r($colors, true) );

// Adds the global state.
wp_interactivity_state(
	'pixel-art',
	array(
		'isPainting'    => false,
		'activeColor' => $colors[2]['color'],

		'buttonText' => esc_html__( 'Start Painting', 'pixel-art' ),
		'startText' => esc_html__( 'Start Painting', 'pixel-art' ),
		'stopText' => esc_html__( 'Stop Painting', 'pixel-art' ),

		'colors'	  => $colors,
		'columns'     => $columns,
		'rows'        => $rows,
	)
);
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="pixel-art"
	<?php // echo wp_interactivity_data_wp_context( array( 'activeColor' => 'white' ) ); ?>
>

	<!-- Palette swatches. -->
	<div class="telex-pixel-art-palette">
		<button
			data-wp-on--click="actions.togglePainting"
			data-wp-text="state.buttonText"
			data-wp-style--background="state.activeColor"
		></button>
		
			<template 
				data-wp-each="state.colors"
				data-wp-each-key="context.item.slug"
			>
				<button type="button" class="telex-pixel-art-palette__swatch"
					data-wp-style--background="context.item.color"
				>
				</button>
				<!--
				<li 
					data-wp-text="context.item.name"
					data-wp-style--background="context.item.color"
				></li>
				-->
			</template>
		
		<?php
		/*
		$output = '';
		foreach ( $colors as $index => $color_item ) {
			$is_active_class = ( 0 === $index ) ? ' is-active' : '';
			$light_style     = telex_pixel_art_is_light_color( $color_item['color'] )
				? 'box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);'
				: '';
			$swatch_ctx = esc_attr( wp_json_encode( array( 'swatchColor' => $color_item['color'] ) ) );
			$label      = ! empty( $color_item['name'] ) ? $color_item['name'] : $color_item['color'];

			$output .= '<button type="button"'
				. ' class="telex-pixel-art-palette__swatch' . esc_attr( $is_active_class ) . '"'
				. ' style="background-color: ' . esc_attr( $color_item['color'] ) . ';' . $light_style . '"'
				. ' aria-label="' . esc_attr( $label ) . '"'
				. ' title="' . esc_attr( $label ) . '"'
				. ' data-swatch-color="' . esc_attr( $color_item['color'] ) . '"'
				. ' data-wp-context="' . $swatch_ctx . '"'
				. ' data-wp-on--click="actions.selectColor"'
				. ' data-wp-class--is-active="state.isActiveSwatch"'
				. '></button>';
		}
		echo $output;
		*/
		?>
	</div>


	<?php
	/*
	// Grid.
	$grid_style = 'grid-template-columns: repeat(' . $columns . ', 24px); grid-template-rows: repeat(' . $rows . ', 24px);';

	$output .= '<div class="telex-pixel-art-grid-wrapper">';
	$output .= '<div class="telex-pixel-art-grid" style="' . esc_attr( $grid_style ) . '"'
		. ' data-wp-on--mousedown="actions.startPainting"'
		. ' data-wp-on--mousemove="actions.paintOnDrag"'
		. ' data-wp-on--mouseup="actions.stopPainting"'
		. ' data-wp-on--mouseleave="actions.stopPainting"'
		. '>';

	for ( $i = 0; $i < $total_cells; $i++ ) {
		$output .= '<div class="telex-pixel-art-grid__cell"'
			. ' role="button" tabindex="0"'
			. ' aria-label="' . esc_attr( 'Pixel ' . ( $i + 1 ) ) . '"'
			. ' data-cell-color=""'
			. ' data-wp-on--click="actions.paintCell"'
			. ' data-wp-on--keydown="actions.handleCellKeydown"'
			. '></div>';
	}

	$output .= '</div></div>';

	// Reset button.
	$output .= '<button type="button" class="telex-pixel-art-reset" data-wp-on--click="actions.resetGrid">'
		. esc_html__( 'Reset', 'telex-pixel-art' )
		. '</button>';

	// Noscript fallback.
	$output .= '<noscript><p>' . esc_html__( 'Pixel Art Creator requires JavaScript to be enabled.', 'telex-pixel-art' ) . '</p></noscript>';
	 */
	?>

</div>
