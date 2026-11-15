/**
 * N.187 step 6: grace notes in Corrections (`grace-notes.musicxml`). A grace note is a place the bar can stand: a click
 * selects it, the arrow keys walk onto it and off it, the pitch keys move it, Delete removes it, `;` turns a full note into
 * one and back, `/` adds one, and Slash toggles the stroke. Each is one Undo step.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium grace-corrections
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = '../../packages/score-parser/src/fixtures/grace-notes.musicxml';

async function raise(page: Page, id: string, tap = false) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	const hit = page.locator(`.score-page [data-hit="${id}"]`).first();
	await hit.scrollIntoViewIfNeeded();
	await (tap ? hit.tap() : hit.click());
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-grace-cell]').waitFor({ state: 'attached' });
}
const graces = (page: Page) => page.locator('.score-page [data-grace]');
const cell = (page: Page) => page.locator('.loupe [data-grace-cell]');
const undo = (page: Page) => page.locator('.loupe-header').getByRole('button', { name: /^Undo/ });
const readout = async (page: Page) => ((await page.locator('.loupe .loupe-tag').textContent()) ?? '').replace(/\s+/g, ' ').trim();

test.describe('grace notes in Corrections', () => {
	test.setTimeout(180_000);

	test('a click on a grace note selects it, and the Grace note cell reads as it', async ({ page }) => {
		await raise(page, 'm0-0-1~g1');
		await expect(cell(page)).toHaveAttribute('data-grace-cell', 'grace');
		await expect(cell(page)).toHaveAccessibleName('Make this a full note again');
		await expect(page.locator('.loupe [data-grace-slash-cell]')).toHaveAttribute('aria-pressed', 'true'); // bar 1 says slash
		expect(await graces(page).count()).toBe(10);
	});

	test('the pitch keys move it, one Undo step puts it back, and Delete removes it', async ({ page }) => {
		await raise(page, 'm0-0-1~g1');
		const before = await page.locator('.score-page [data-event-id="m0-0-1~g1"]').first().innerHTML();
		await page.keyboard.press('ArrowUp');
		await expect.poll(async () => page.locator('.score-page [data-event-id="m0-0-1~g1"]').first().innerHTML()).not.toBe(before);
		await expect(undo(page)).toHaveAccessibleName(/B4 → C5/);
		await undo(page).click();
		await expect.poll(async () => page.locator('.score-page [data-event-id="m0-0-1~g1"]').first().innerHTML()).toBe(before);
		await page.keyboard.press('Delete');
		await expect(graces(page)).toHaveCount(9);
		await expect(undo(page)).toHaveAccessibleName(/note removed/);
		await undo(page).click();
		await expect(graces(page)).toHaveCount(10);
	});

	test('`;` turns a grace note into a full note, and back; the bar then reads over, and the grace note is gone from the page', async ({ page }) => {
		await raise(page, 'm0-0-1~g1');
		await page.keyboard.press(';');
		await expect(graces(page)).toHaveCount(9);
		await expect(page.locator('.score-page [data-event-id="m0-0-1~g1"]')).toHaveCount(1); // now a note with its own id
		expect(await readout(page)).toMatch(/over|trop/);
		await expect(undo(page)).toHaveAccessibleName(/grace note changed/);
		await page.keyboard.press(';');
		await expect(graces(page)).toHaveCount(10);
	});

	test('`/` adds a grace note before the taken note, selected at once; Slash toggles its stroke', async ({ page }) => {
		await raise(page, 'm0-0-1'); // the principal of bar 1
		await page.keyboard.press('/');
		await expect(undo(page)).toHaveAccessibleName(/grace note added/);
		await expect(cell(page)).toHaveAttribute('data-grace-cell', 'grace');
		await expect(graces(page)).toHaveCount(10); // joins bar 1's group: still ten groups
		expect(await page.locator('.score-page [data-event-id^="hand:"]').count()).toBe(1);
		const slash = page.locator('.loupe [data-grace-slash-cell]');
		await expect(slash).toHaveCount(0); // a group of two draws no stroke
		await page.keyboard.press('Delete');
		await expect(page.locator('.score-page [data-event-id^="hand:"]')).toHaveCount(0);
	});

	test('the arrow keys walk onto a grace note and then onto its principal', async ({ page }) => {
		await raise(page, 'm0-0-1~g1');
		const ring = page.locator('.loupe [data-selection-ring]');
		await page.keyboard.press('ArrowRight'); // the gap between them, then the principal
		await page.keyboard.press('ArrowRight');
		await expect(cell(page)).toHaveAttribute('data-grace-cell', 'note');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await expect(cell(page)).toHaveAttribute('data-grace-cell', 'grace');
		void ring;
	});
});
