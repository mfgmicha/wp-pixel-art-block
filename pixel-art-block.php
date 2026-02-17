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
 * Register the Pixel Art block.
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @since 1.0.0
 */
function mfgmicha_pixel_art_block_register_block() {
	register_block_type( __DIR__ . '/build' );

	//var_dump(WP_Block_Type_Registry::is_registered('mfgmicha/pixel-art'));

}
add_action( 'init', 'mfgmicha_pixel_art_block_register_block' );
