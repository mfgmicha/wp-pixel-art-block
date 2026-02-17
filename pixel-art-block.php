<?php
/**
 * Plugin Name: Pixel Art Block
 * Description: Create pixel art drawings with a customizable grid
 * Version: 1.0.0
 * Author: MFGMicha
 * License: GPL v2 or later
 * Text Domain: pixel-art-block
 *
 * @package PixelArtBlock
 */

// Prevent direct access to the file.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register and enqueue block assets for both editor and frontend.
 *
 * @since 1.0.0
 */
function mfgmicha_pixel_art_block_register_assets() {
	// Register block editor script.
	wp_register_script(
		'mfgmicha-pixel-art-block-editor',
		plugins_url( 'build/index.js', __FILE__ ),
		array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-i18n' ),
		'1.0.0',
		true
	);

	// Register block editor styles.
	wp_register_style(
		'mfgmicha-pixel-art-block-editor-style',
		plugins_url( 'build/index.css', __FILE__ ),
		array(),
		'1.0.0'
	);

	// Register block frontend styles.
	wp_register_style(
		'mfgmicha-pixel-art-block-style',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		'1.0.0'
	);
}
add_action( 'init', 'mfgmicha_pixel_art_block_register_assets' );

/**
 * Register the Pixel Art block.
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @since 1.0.0
 */
function mfgmicha_pixel_art_block_register_block() {
	// Register the block with WordPress block API v2.
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', 'mfgmicha_pixel_art_block_register_block' );

/**
 * Add custom category for Pixel Art block.
 *
 * @param array  $categories Existing block categories.
 * @param object $post       The post object.
 * @return array Modified categories array.
 *
 * @since 1.0.0
 */
function mfgmicha_pixel_art_block_add_category( $categories, $post ) {
	// Check if our custom category already exists.
	$category_slugs = wp_list_pluck( $categories, 'slug' );

	if ( ! in_array( 'mfgmicha-blocks', $category_slugs, true ) ) {
		$categories[] = array(
			'slug'  => 'mfgmicha-blocks',
			'title' => __( 'MFGMicha Blocks', 'pixel-art-block' ),
			'icon'  => 'dashicons-art',
		);
	}

	return $categories;
}
add_filter( 'block_categories_all', 'mfgmicha_pixel_art_block_add_category', 10, 2 );
