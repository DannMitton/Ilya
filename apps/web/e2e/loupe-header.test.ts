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
});
