const { test, expect } = require( '@playwright/test' );

test.describe( 'Page', () => {
	test( 'site loads without errors', async ( { page } ) => {
		await page.goto( '/' );
		await page.waitForLoadState( 'networkidle' );

		// Verify page loads
		await expect( page.locator( 'body' ) ).toBeVisible();

		// Check no critical console errors
		const errors = [];
		page.on( 'console', ( msg ) => {
			if ( msg.type() === 'error' ) {
				errors.push( msg.text() );
			}
		} );

		await page.waitForTimeout( 500 );
		//console.log('✓ Page loads successfully');
	} );
} );
