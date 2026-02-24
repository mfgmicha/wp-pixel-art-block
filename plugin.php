<?php
/**
 * Plugin Name:       Pixel Art Creator
 * Description:       An interactive pixel art grid block. Visitors paint with your theme's color palette on a configurable grid.
 * Version:           0.3.0
 * Requires at least: 6.7
 * Requires PHP:      8.2
 * Author:            Micha Krapp
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pixel-art-creator
 *
 * @package PixelArtCreator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
if ( ! function_exists( 'pixel_art_creator_block_init' ) ) {
	function pixel_art_creator_block_init() {
		register_block_type( __DIR__ . '/build/' );
	}
}
add_action( 'init', 'pixel_art_creator_block_init' );
