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
 * @since 1.0.0
 */
function mfgmicha_pixel_art_block_register_block() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'mfgmicha_pixel_art_block_register_block' );
