/**
 * Row 164, step 3, at phone width: a tap on the Loupe's header flips the card
 * between the top and the bottom of the screen; at the bottom the panel rises
 * above the header and the music; a swipe that closes the Loupe, or a finger
 * that wanders, flips nothing.
 *
 *     pnpm --filter @ilya/web exec playwright test --project=phone loupe-header
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';

async function raise(page: Page) {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'MELODY' }).tap();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached' });
	await page.waitForTimeout(6_000);
	const asWritten = page.getByRole('button', { name: 'As written' });
	if (await asWritten.count()) await asWritten.first().tap();
	const hit = page.locator('.score-page [data-hit]').first();
	await hit.scrollIntoViewIfNeeded();
	await hit.tap();
	await page.locator('.loupe .loupe-header').waitFor();
	await page.waitForTimeout(500);
}

const box = async (page: Page, sel: string) => (await page.locator(sel).first().boundingBox())!;

test.describe('the Loupe header on a phone', () => {
	test.setTimeout(120_000);

	test('a tap flips the card between the bottom and the top, and the label says where it goes', async ({ page }) => {
		await raise(page);
		const move = page.locator('.loupe-header .loupe-move');
		await expect(move).toHaveAttribute('aria-label', 'Move the Loupe to the bottom');
		await expect(move).toHaveText('LOUPE');
		await move.tap();
		await expect(move).toHaveAttribute('aria-label', 'Move the Loupe to the top');
		const bottom = await box(page, '.loupe');
		expect(Math.round(bottom.y + bottom.height)).toBe(844 - 8);
		await move.tap();
		await expect(move).toHaveAttribute('aria-label', 'Move the Loupe to the bottom');
		expect(Math.round((await box(page, '.loupe')).y)).toBe(24);
	});

	test('at the bottom the panel rises above the header and the music, which stay put', async ({ page }) => {
		await raise(page);
		await page.locator('.loupe-header .loupe-move').tap();
		await page.waitForTimeout(400);
		const before = await box(page, '.loupe-header');
		await page.locator('.loupe-syl-toggle').tap();
		await page.waitForTimeout(600);
		const header = await box(page, '.loupe-header');
		const panel = await box(page, '.loupe-panel');
		const card = await box(page, '.loupe');
		expect(Math.abs(header.y - before.y), 'the header does not move').toBeLessThan(1);
		expect(panel.height, 'the panel opened').toBeGreaterThan(100);
		expect(panel.y + panel.height, 'the panel is above the header').toBeLessThanOrEqual(header.y + 1);
		expect(card.y, 'the card stays under the top gutter').toBeGreaterThanOrEqual(23);
		expect(card.y + card.height).toBeLessThanOrEqual(844 - 8 + 1);
	});

	test('a swipe down from the header closes the Loupe and flips nothing', async ({ page }) => {
		await raise(page);
		const h = await box(page, '.loupe-header .loupe-move');
		const x = h.x + 30, y = h.y + h.height / 2;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x, y + 90, { steps: 6 });
		await page.mouse.up();
		await expect(page.locator('.loupe')).toHaveCount(0);
	});

	test('a finger that wanders sideways flips nothing', async ({ page }) => {
		await raise(page);
		const move = page.locator('.loupe-header .loupe-move');
		const h = await box(page, '.loupe-header .loupe-move');
		const x = h.x + 30, y = h.y + h.height / 2;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x + 40, y + 2, { steps: 4 });
		await page.mouse.up();
		await expect(move).toHaveAttribute('aria-label', 'Move the Loupe to the bottom');
		expect(Math.round((await box(page, '.loupe')).y)).toBeLessThan(300);
	});

	test('every header button is at least 44 by 44, and the band is 44 tall', async ({ page }) => {
		await raise(page);
		expect(Math.round((await box(page, '.loupe-header')).height)).toBe(44);
		for (const b of await page.locator('.loupe-header button').all()) {
			const r = (await b.boundingBox())!;
			expect(r.width).toBeGreaterThanOrEqual(43.5);
			expect(r.height).toBeGreaterThanOrEqual(43.5);
		}
	});
});
