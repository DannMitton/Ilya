/**
 * Row 164: the Loupe's lavender header. LOUPE flush left; Undo, Redo, and
 * Close flush right; the bottom bar keeps the pill, the zoom, and the chevron.
 *
 * Without Sun, song 1, raised on its first entry.
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';

async function raise(page: Page) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'Markup' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached' });
	await page.waitForTimeout(6_000);
	const asWritten = page.getByRole('button', { name: 'As written' });
	if (await asWritten.count()) await asWritten.first().click();
	const hit = page.locator('.score-page [data-hit]').first();
	await hit.scrollIntoViewIfNeeded();
	await hit.click();
	await page.locator('.loupe .loupe-header').waitFor();
}

test.describe('the Loupe header', () => {
	test.setTimeout(120_000);

	test('names the Loupe in capitals, and Close is the page’s one way out', async ({ page }) => {
		await raise(page);
		await expect(page.locator('.loupe-title')).toHaveText('LOUPE');
		await page.getByRole('button', { name: 'Close', exact: true }).click();
		await expect(page.locator('.loupe')).toHaveCount(0);
	});

	test('Undo and Redo live in the header, not in the bottom bar', async ({ page }) => {
		await raise(page);
		await page.locator('#loupe-mode-corrections').click();
		await page.locator('.score-page').first().evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
		await page.keyboard.press('.');
		const undo = page.locator('.loupe-header').getByRole('button', { name: /^Undo/ });
		await expect(undo).toBeVisible();
		await expect(page.locator('.loupe-bar').getByRole('button', { name: /^Undo/ })).toHaveCount(0);
		await undo.click();
		await expect(page.locator('.loupe-header').getByRole('button', { name: /^Redo/ })).toBeVisible();
	});

	test('a drag on the desk moves the card, holds while open, and resets on close', async ({ page }) => {
		await raise(page);
		await page.waitForTimeout(500); // the 180 ms rise has ended
		const card = page.locator('.loupe');
		const before = (await card.boundingBox())!;
		const header = (await page.locator('.loupe-header').boundingBox())!;
		const grab = { x: header.x + 40, y: header.y + header.height / 2 };
		await page.mouse.move(grab.x, grab.y);
		await page.mouse.down();
		await page.mouse.move(grab.x - 40, grab.y - 60, { steps: 6 });
		await page.mouse.up();
		const moved = (await card.boundingBox())!;
		expect(Math.round(moved.x - before.x)).toBe(-40);
		expect(Math.round(moved.y - before.y)).toBe(-60);
		// It holds when the singer steps to the next note
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(600);
		const stepped = (await card.boundingBox())!;
		expect(Math.abs(stepped.y - moved.y)).toBeLessThan(2);
		// Close, raise again: back at the seat
		await page.getByRole('button', { name: 'Close', exact: true }).click();
		await expect(card).toHaveCount(0);
		await page.locator('.score-page [data-hit]').first().click();
		await page.locator('.loupe .loupe-header').waitFor();
		await page.waitForTimeout(500);
		const again = (await card.boundingBox())!;
		expect(Math.round(again.x)).toBe(Math.round(before.x));
		expect(Math.round(again.y)).toBe(Math.round(before.y));
	});

	test('a drag cannot take the header off the screen', async ({ page }) => {
		await raise(page);
		const header = (await page.locator('.loupe-header').boundingBox())!;
		const grab = { x: header.x + 40, y: header.y + header.height / 2 };
		for (const [dx, dy] of [[-3000, -3000], [3000, 3000]]) {
			await page.mouse.move(grab.x, grab.y);
			await page.mouse.down();
			await page.mouse.move(grab.x + dx, grab.y + dy, { steps: 4 });
			await page.mouse.up();
			const h = (await page.locator('.loupe-header').boundingBox())!;
			const vp = page.viewportSize()!;
			expect(h.x).toBeGreaterThanOrEqual(24 - 1);
			expect(h.y).toBeGreaterThanOrEqual(24 - 1);
			expect(h.x + h.width).toBeLessThanOrEqual(vp.width - 24 + 1);
			expect(h.y + h.height).toBeLessThanOrEqual(vp.height - 24 + 1);
			grab.x = h.x + 40;
			grab.y = h.y + h.height / 2;
		}
	});

	test('pressing a header button starts no drag', async ({ page }) => {
		await raise(page);
		await page.locator('#loupe-mode-corrections').click();
		await page.waitForTimeout(800); // the card re-frames for the carets
		const before = (await page.locator('.loupe').boundingBox())!;
		const close = (await page.getByRole('button', { name: 'Close', exact: true }).boundingBox())!;
		await page.mouse.move(close.x + 10, close.y + 10);
		await page.mouse.down();
		await page.mouse.move(close.x - 200, close.y + 100, { steps: 4 });
		await page.mouse.up();
		const after = (await page.locator('.loupe').boundingBox())!;
		expect(Math.round(after.x)).toBe(Math.round(before.x));
	});
});
