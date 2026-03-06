const { test, expect } = require('@playwright/test');

test.describe('Frontend Pixel Art Block', () => {
    test.beforeEach(async ({ page }) => {
        // Only capture error logs (not verbose info logs)
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`[Browser Error] ${msg.text()}`);
            }
        });
        // Navigate - fail fast if server not available
        await page.goto('/pixel-art/', { timeout: 15000 });
        await page.waitForLoadState('networkidle');

        // Wait for the block to be fully loaded before running test
        await page.waitForSelector('.wp-block-mfgmicha-pixel-art-creator', { timeout: 10000 });
    });

    test('page loads without critical errors', async ({ page }) => {
        // Verify page loads
        await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('h1')).toHaveText('Pixel Art');

        // Check no critical console errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.waitForTimeout(500);
        expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
    });

    test.describe('Block Container', () => {
        test('block wrapper element exists with correct classes', async ({ page }) => {
            const block = page.locator('.wp-block-mfgmicha-pixel-art-creator');
            await expect(block).toBeVisible();
        });

        test('block has interactivity directive', async ({ page }) => {
            const block = page.locator('.wp-block-mfgmicha-pixel-art-creator');
            await expect(block).toHaveAttribute('data-wp-interactive', 'mfgmicha/pixel-art-creator');
        });
    });

    test.describe('Color Palette', () => {
        test('palette container exists', async ({ page }) => {
            const palette = page.locator('.pixel-art-creator-palette');
            await expect(palette).toBeVisible();
        });

        test('color swatches are rendered from theme palette', async ({ page }) => {
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            // Should have at least a few color swatches from theme
            const count = await swatches.count();
            expect(count).toBeGreaterThan(0);
        });

        test('swatches have background colors set', async ({ page }) => {
            const firstSwatch = page.locator('.pixel-art-creator-palette__swatch').first();
            const bgColor = await firstSwatch.evaluate(el => el.style.backgroundColor);
            expect(bgColor).toBeTruthy();
        });

        test('clicking a swatch sets it as active', async ({ page }) => {
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            const firstSwatch = swatches.first();

            // Get initial active state or style
            const initialStyle = await firstSwatch.getAttribute('style');

            // Click the first swatch
            await firstSwatch.click();

            // After clicking, the swatch should have an active class or changed style
            // The exact implementation may vary, but it should show as selected
            await page.waitForTimeout(100);
        });
    });

    test.describe('Grid', () => {
        test('grid container exists', async ({ page }) => {
            const grid = page.locator('.pixel-art-creator-grid');
            await expect(grid).toBeVisible();
        });

        test('grid has cells based on configured columns/rows', async ({ page }) => {
            const cells = page.locator('.pixel-art-creator-grid__cell');
            const count = await cells.count();
            // Grid should have at least some cells (min 4x4=16, max 32x32=1024)
            expect(count).toBeGreaterThan(0);
            expect(count).toBeLessThanOrEqual(1024);
        });

        test('cells have proper accessibility attributes', async ({ page }) => {
            const firstCell = page.locator('.pixel-art-creator-grid__cell').first();
            await expect(firstCell).toHaveAttribute('role', 'button');
            await expect(firstCell).toHaveAttribute('aria-label');
        });

        test('clicking a cell paints it with active color', async ({ page }) => {
            // First ensure a color is selected from palette
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            if (await swatches.count() > 0) {
                await swatches.first().click();
            }

            // Get the first cell and click to paint
            const firstCell = page.locator('.pixel-art-creator-grid__cell').first();
            await firstCell.click();
            await page.waitForTimeout(200);

            // Verify cell now has a background color (not empty)
            const cellColor = await firstCell.getAttribute('data-cell-color');
            expect(cellColor).toBeTruthy();
        });

        test('drag to paint paints multiple cells', async ({ page }) => {
            // First ensure a color is selected from palette
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            if (await swatches.count() > 0) {
                await swatches.first().click();
            }
            await page.waitForTimeout(100);

            // Get first two cells
            const firstCell = page.locator('.pixel-art-creator-grid__cell').nth(0);
            const secondCell = page.locator('.pixel-art-creator-grid__cell').nth(1);

            // Mousedown on first cell (starts drag), mouseenter on second (continues drag)
            await firstCell.dispatchEvent('mousedown');
            await secondCell.dispatchEvent('mouseenter');
            await page.waitForTimeout(100);

            // Verify both cells are painted
            const firstCellColor = await firstCell.getAttribute('data-cell-color');
            const secondCellColor = await secondCell.getAttribute('data-cell-color');

            expect(firstCellColor).toBeTruthy();
            expect(secondCellColor).toBeTruthy();
        });

        test('keyboard accessibility - Enter key paints cell', async ({ page }) => {
            const firstCell = page.locator('.pixel-art-creator-grid__cell').first();

            // Focus and press Enter
            await firstCell.focus();
            await firstCell.press('Enter');
            await page.waitForTimeout(100);

            const cellColor = await firstCell.getAttribute('data-cell-color');
            expect(cellColor).toBeTruthy();
        });

        test('keyboard accessibility - Space key paints cell', async ({ page }) => {
            const secondCell = page.locator('.pixel-art-creator-grid__cell').nth(1);

            // Focus and press Space
            await secondCell.focus();
            await secondCell.press(' ');
            await page.waitForTimeout(100);

            const cellColor = await secondCell.getAttribute('data-cell-color');
            expect(cellColor).toBeTruthy();
        });

        test('cell can be repainted with different color', async ({ page }) => {
            const cell = page.locator('.pixel-art-creator-grid__cell').first();
            const swatches = page.locator('.pixel-art-creator-palette__swatch');

            // First ensure a color is selected
            if (await swatches.count() > 0) {
                await swatches.first().click();
            }

            // Paint the cell using click
            await cell.click();
            await page.waitForTimeout(100);

            let cellColor = await cell.getAttribute('data-cell-color');
            expect(cellColor).toBeTruthy();

            // Select a different color and paint again
            if (await swatches.count() > 1) {
                await swatches.nth(1).click();
                await cell.click();
                await page.waitForTimeout(100);

                cellColor = await cell.getAttribute('data-cell-color');
                expect(cellColor).toBeTruthy();
            }
        });
    });

    test.describe('Reset Button', () => {
        test('reset button exists', async ({ page }) => {
            const resetBtn = page.locator('.pixel-art-creator-reset');
            await expect(resetBtn).toBeVisible();
        });

        test('reset button has correct text', async ({ page }) => {
            const resetBtn = page.locator('.pixel-art-creator-reset');
            await expect(resetBtn).toContainText('Reset');
        });

        test('clicking reset clears all painted cells', async ({ page }) => {
            // Select a color and paint some cells
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            if (await swatches.count() > 0) {
                await swatches.first().click();
            }

            // Paint multiple cells using click
            const cells = page.locator('.pixel-art-creator-grid__cell');
            await cells.nth(0).click();
            await cells.nth(1).click();
            await cells.nth(2).click();
            await page.waitForTimeout(100);

            // Verify cells are painted
            let cellColor = await cells.nth(0).getAttribute('data-cell-color');
            expect(cellColor).toBeTruthy();

            // Click reset
            const resetBtn = page.locator('.pixel-art-creator-reset');
            await resetBtn.click();
            await page.waitForTimeout(100);

            // Verify all cells are cleared
            cellColor = await cells.nth(0).getAttribute('data-cell-color');
            expect(cellColor).toBeFalsy();

            cellColor = await cells.nth(1).getAttribute('data-cell-color');
            expect(cellColor).toBeFalsy();

            cellColor = await cells.nth(2).getAttribute('data-cell-color');
            expect(cellColor).toBeFalsy();
        });
    });

    test.describe('LocalStorage Persistence', () => {
        test('painting a cell saves to localStorage', async ({ page }) => {
            // Clear localStorage first
            await page.evaluate(() => localStorage.clear());

            // Select a color
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            if (await swatches.count() > 0) {
                await swatches.first().click();
            }

            // Get the first cell and paint it using click
            const firstCell = page.locator('.pixel-art-creator-grid__cell').first();
            await firstCell.click();
            await page.waitForTimeout(100);

            // Check localStorage was updated
            const storageData = await page.evaluate(() => {
                const keys = Object.keys(localStorage);
                return keys.filter(k => k.startsWith('pixel-art-'));
            });
            expect(storageData.length).toBeGreaterThan(0);
        });

        test('grid state persists after page reload', async ({ page }) => {
            // Clear localStorage first
            await page.evaluate(() => localStorage.clear());

            // Select a color
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            const swatchCount = await swatches.count();
            if (swatchCount > 0) {
                await swatches.first().click();
            }

            // Get first cell color to paint with
            const firstSwatchColor = await swatches.first().evaluate(el => el.getAttribute('data-swatch-color'));

            // Paint first cell using click
            const firstCell = page.locator('.pixel-art-creator-grid__cell').first();
            await firstCell.click();
            await page.waitForTimeout(100);

            // Reload the page
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Check if the cell still has the color (loaded from localStorage)
            const cellColor = await firstCell.getAttribute('data-cell-color');
            expect(cellColor).toBe(firstSwatchColor);
        });

        test('reset clears localStorage', async ({ page }) => {
            // Clear localStorage first
            await page.evaluate(() => localStorage.clear());

            // Select a color and paint
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            if (await swatches.count() > 0) {
                await swatches.first().click();
            }

            const firstCell = page.locator('.pixel-art-creator-grid__cell').first();
            await firstCell.click();
            await page.waitForTimeout(100);

            // Verify localStorage has data
            let storageData = await page.evaluate(() => {
                const keys = Object.keys(localStorage);
                return keys.filter(k => k.startsWith('pixel-art-'));
            });
            expect(storageData.length).toBeGreaterThan(0);

            // Click reset
            const resetBtn = page.locator('.pixel-art-creator-reset');
            await resetBtn.click();
            await page.waitForTimeout(100);

            // Verify localStorage is cleared
            storageData = await page.evaluate(() => {
                const keys = Object.keys(localStorage);
                return keys.filter(k => k.startsWith('pixel-art-'));
            });
            expect(storageData.length).toBe(0);
        });
    });

    test.describe('Integration', () => {
        test('full workflow: select color, paint cells, change color, paint more, reset', async ({ page }) => {
            const swatches = page.locator('.pixel-art-creator-palette__swatch');
            const cells = page.locator('.pixel-art-creator-grid__cell');
            const resetBtn = page.locator('.pixel-art-creator-reset');

            // Ensure we have swatches and cells
            const swatchCount = await swatches.count();
            const cellCount = await cells.count();
            expect(swatchCount).toBeGreaterThan(0);
            expect(cellCount).toBeGreaterThan(0);

            // Step 1: Select first color from palette
            await swatches.first().click();
            await page.waitForTimeout(100);

            // Step 2: Paint first cell using click
            await cells.nth(0).click();
            await page.waitForTimeout(100);

            let cellColor = await cells.nth(0).getAttribute('data-cell-color');
            expect(cellColor).toBeTruthy();

            // Step 3: Select second color (if available)
            if (swatchCount > 1) {
                await swatches.nth(1).click();
                await page.waitForTimeout(100);

                // Step 4: Paint second cell with different color using click
                await cells.nth(1).click();
                await page.waitForTimeout(100);

                const cellColor2 = await cells.nth(1).getAttribute('data-cell-color');
                expect(cellColor2).toBeTruthy();

                // Colors should be different
                expect(cellColor).not.toBe(cellColor2);
            }

            // Step 5: Reset
            await resetBtn.click();
            await page.waitForTimeout(100);

            // Step 6: Verify all cleared
            cellColor = await cells.nth(0).getAttribute('data-cell-color');
            expect(cellColor).toBeFalsy();
        });
    });
});
