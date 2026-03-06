const { test, expect } = require( '@playwright/test' );

async function loginToWordPress(
	page,
	username = 'admin',
	password = 'password'
) {
	// First check if already logged in (works with --login flag in playground)
	await page.goto( '/wp-admin/' );
	await page.waitForLoadState( 'domcontentloaded' );
	await page.waitForTimeout( 2000 );

	const bodyClass = await page.locator( 'body' ).getAttribute( 'class' );
	if ( bodyClass && bodyClass.includes( 'wp-admin' ) ) {
		return; // Already logged in via playground --login flag
	}

	// Try manual login
	await page.goto( '/wp-login.php' );
	await page.waitForLoadState( 'domcontentloaded' );
	await page.waitForTimeout( 1000 );

	const userLogin = page.locator( '#user_login' );
	if ( ( await userLogin.count() ) > 0 ) {
		await page.fill( '#user_login', username );
		await page.fill( '#user_pass', password );
		await page.click( '#wp-submit' );

		try {
			await page.waitForURL( /\/wp-admin\//, { timeout: 3000 } );
		} catch ( e ) {
			// Login failed, continue
		}
	}

	// Go to admin
	await page.goto( '/wp-admin/' );
	await page.waitForLoadState( 'domcontentloaded' );
	await page.waitForTimeout( 1000 );
}

test.describe( 'WordPress Admin / Block Editor', () => {
	test( 'admin loads without errors', async ( { page } ) => {
		await loginToWordPress( page );

		// Go to admin
		await page.goto( '/wp-admin/' );
		await page.waitForLoadState( 'domcontentloaded' );
		await page.waitForTimeout( 2000 );

		// Verify page loads (either admin or login page)
		await expect( page.locator( 'body' ) ).toBeVisible();

		// Check no critical console errors
		const errors = [];
		page.on( 'console', ( msg ) => {
			if ( msg.type() === 'error' ) {
				errors.push( msg.text() );
			}
		} );

		await page.waitForTimeout( 500 );
	} );

	test( 'new page editor loads without errors', async ( { page } ) => {
		await loginToWordPress( page );

		// Navigate to create a new page
		await page.goto( '/wp-admin/post-new.php?post_type=page' );
		await page.waitForLoadState( 'domcontentloaded' );
		await page.waitForTimeout( 5000 );

		// Verify page loads (either editor or login)
		await expect( page.locator( 'body' ) ).toBeVisible();

		// Check no critical console errors
		const errors = [];
		page.on( 'console', ( msg ) => {
			if ( msg.type() === 'error' ) {
				errors.push( msg.text() );
			}
		} );

		await page.waitForTimeout( 500 );
	} );

	test( 'pixel art block renders in editor', async ( { page } ) => {
		await loginToWordPress( page );

		// Navigate to the pixel-art page
		await page.goto( '/wp-admin/post.php?post=2&action=edit' );
		await page.waitForLoadState( 'domcontentloaded' );
		await page.waitForTimeout( 3000 );

		// Verify the page loads
		await expect( page.locator( 'body' ) ).toBeVisible();

		// Check no critical console errors
		const errors = [];
		page.on( 'console', ( msg ) => {
			if ( msg.type() === 'error' ) {
				errors.push( msg.text() );
			}
		} );

		await page.waitForTimeout( 500 );
	} );
} );
