/**
 * QUEUE row 138 (Dann 2026-11-09 21:17, 21:35, 21:44), step B3: the Barline verb in the Loupe's CORRECTIONS pane, beside Rest and Tie.
 *
 * "Add a barline after this note" where the next note is in the same bar, "Remove the barline after this note" where one follows;
 * every fix shows at once, is undoable, and is redone by Redo. Two synthetic readings (`src/lib/omr/fixtures/`): a bar of eight
 * quarters that holds two bars' music (the barline between them is missing), and eight clean bars.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium barline-verb
 */
import { test, expect, type Page } from '@playwright/test';

const FUSED = 'src/lib/omr/fixtures/barline-fused.musicxml';
const CLEAN = 'src/lib/omr/fixtures/barline-clean-4-4.musicxml';

async function raise(page: Page, file: string, id: string) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(file);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	const hit = page.locator(`.score-page [data-hit="${id}"]`).first();
	await hit.scrollIntoViewIfNeeded();
	await hit.click();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-barline]').waitFor({ state: 'attached' });
}

const cell = (page: Page) => page.locator('.loupe [data-barline]');
const tag = async (page: Page) => ((await page.locator('.loupe .loupe-tag').textContent()) ?? '').replace(/\s+/g, ' ').trim();
const undo = (page: Page) => page.locator('.loupe-header').getByRole('button', { name: /^Undo/ });
const redo = (page: Page) => page.locator('.loupe-header').getByRole('button', { name: /^Redo/ });

test.describe('the Barline verb', () => {
	test.setTimeout(180_000);

	test('Add divides the fused bar at once, Undo takes it back, Redo puts it back', async ({ page }) => {
		await raise(page, FUSED, 'm3-3-4');
		await expect(cell(page)).toHaveAttribute('data-barline', 'add');
		await expect(cell(page)).toHaveAccessibleName('Add a barline after this note');
		await expect(cell(page)).toHaveText('Barline');
		expect(await tag(page)).toMatch(/8 of 4/);

		await cell(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		await expect(cell(page)).toHaveAccessibleName('Remove the barline after this note');
		expect(await tag(page)).not.toMatch(/8 of 4/);
		await expect(undo(page)).toHaveAccessibleName(/barline added/);

		await undo(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'add');
		expect(await tag(page)).toMatch(/8 of 4/);

		await redo(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		expect(await tag(page)).not.toMatch(/8 of 4/);
	});

	test('Remove joins two clean bars (the merged bar reads over), Undo restores, and a second press adds the barline back', async ({ page }) => {
		await raise(page, CLEAN, 'm3-3-4');
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		expect(await tag(page)).not.toMatch(/8 of 4/);

		await cell(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'add');
		expect(await tag(page)).toMatch(/8 of 4/);
		await expect(undo(page)).toHaveAccessibleName(/barline removed/);

		await undo(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		expect(await tag(page)).not.toMatch(/8 of 4/);

		// both orders: remove, then add the same barline back by hand
		await cell(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'add');
		await cell(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		expect(await tag(page)).not.toMatch(/8 of 4/);
	});

	test('the next note is in the next bar after Add, and the tag counts it', async ({ page }) => {
		await raise(page, FUSED, 'm3-3-4');
		const before = await tag(page);
		await cell(page).click();
		// the first press lands on the gap after the note (still bar 4), the second on the next note, which is now bar 5
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(500);
		expect(await tag(page)).toMatch(/m\.\s?4\b/);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(500);
		const after = await tag(page);
		expect(after).not.toBe(before);
		expect(after).toMatch(/m\.\s?5\b/);
	});

	test('a barline she added is saved with the song: after a reload the reading is read again and the barline is still there', async ({ page }) => {
		await raise(page, FUSED, 'm3-3-4');
		await cell(page).click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		// the autosave, so the reload reads IndexedDB and not a value that never left the tab
		await page.waitForTimeout(3_000);
		await page.reload();
		await page.getByRole('tab', { name: 'MELODY' }).click();
		await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
		await page.waitForTimeout(3_000);
		const hit = page.locator('.score-page [data-hit="m3-3-4"]').first();
		await hit.scrollIntoViewIfNeeded();
		await hit.click();
		await page.locator('.loupe .loupe-body').waitFor();
		await page.locator('#loupe-mode-corrections').click();
		await expect(cell(page)).toHaveAttribute('data-barline', 'remove');
		expect(await tag(page)).not.toMatch(/8 of 4/);
	});
});
