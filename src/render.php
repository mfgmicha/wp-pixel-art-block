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

// Default colors if theme has none
if ( empty( $colors ) ) {
	$colors = array(
		array( 'name' => 'Black', 'color' => '#000000', 'slug' => 'black' ),
		array( 'name' => 'White', 'color' => '#ffffff', 'slug' => 'white' ),
		array( 'name' => 'Red', 'color' => '#ff0000', 'slug' => 'red' ),
		array( 'name' => 'Blue', 'color' => '#0000ff', 'slug' => 'blue' ),
		array( 'name' => 'Green', 'color' => '#00ff00', 'slug' => 'green' ),
	);
}

$first_color = ! empty( $colors[0]['color'] ) ? $colors[0]['color'] : '#000000';

$total_cells = $columns * $rows;

// Adds the global state.
wp_interactivity_state(
	'mfgmicha/pixel-art-creator',
	array(
		'activeColor' => $first_color,
		'colors'      => $colors,
		'columns'     => $columns,
		'rows'        => $rows,
		'blockId'     => $block->client_id,
	)
);
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="mfgmicha/pixel-art-creator"
	<?php echo wp_interactivity_data_wp_context( array( 'activeColor' => $first_color ) ); ?>
>

	<!-- Palette swatches. -->
	<div class="pixel-art-creator-palette">
		<?php
		$output = '';
		foreach ( $colors as $index => $color_item ) {
			$is_active_class = ( 0 === $index ) ? ' is-active' : '';
			$label           = ! empty( $color_item['name'] ) ? $color_item['name'] : $color_item['color'];
			$swatch_ctx      = esc_attr( wp_json_encode( array( 'item' => $color_item ) ) );

			$output .= '<button type="button"'
				. ' class="pixel-art-creator-palette__swatch' . esc_attr( $is_active_class ) . '"'
				. ' style="background-color: ' . esc_attr( $color_item['color'] ) . '"'
				. ' aria-label="' . esc_attr( $label ) . '"'
				. ' title="' . esc_attr( $label ) . '"'
				. ' data-swatch-color="' . esc_attr( $color_item['color'] ) . '"'
				. ' data-wp-context="' . $swatch_ctx . '"'
				. ' data-wp-on--click="actions.selectColor"'
				. ' data-wp-class--is-active="state.isActiveSwatch"'
				. '></button>';
		}
		echo $output;
		?>
	</div>

	<!-- Grid. -->
	<?php
	$grid_style = 'grid-template-columns: repeat(' . $columns . ', 24px); grid-template-rows: repeat(' . $rows . ', 24px);';
	?>

	<div class="pixel-art-creator-grid-wrapper">
		<div class="pixel-art-creator-grid" style="<?php echo esc_attr( $grid_style ); ?>">
			<?php
			for ( $i = 0; $i < $total_cells; $i++ ) {
				echo '<div class="pixel-art-creator-grid__cell"'
					. ' role="button" tabindex="0"'
					. ' aria-label="' . esc_attr( 'Pixel ' . ( $i + 1 ) ) . '"'
					. ' data-cell-color=""'
					. ' data-wp-on--click="actions.paintCell"'
					. ' data-wp-on--keydown="actions.handleCellKeydown"'
					. '></div>';
			}
			?>
		</div>
	</div>

	<!-- Reset button. -->
	<button type="button" class="pixel-art-creator-reset" data-wp-on--click="actions.resetGrid">
		<?php esc_html_e( 'Reset', 'pixel-art-creator' ); ?>
	</button>

	<!-- Noscript fallback. -->
	<noscript><p><?php esc_html_e( 'Pixel Art Creator requires JavaScript to be enabled.', 'pixel-art-creator' ); ?></p></noscript>

</div>
