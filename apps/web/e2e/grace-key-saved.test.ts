/**
 * N.187 and N.192: a grace-note correction and a key-change correction survive a save and a reload. `key-changes.musicxml` carries bars with a key
 * change; the grace corrections are made on `grace-notes.musicxml` in the same way (separate songs, each saved with its own corrections).
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium grace-key-saved
 */
import { test, expect, type Page } from '@playwright/test';

const DIR = '../../packages/score-parser/src/fixtures/';

async function raise(page: Page, file: string, id: string) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(DIR + file);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	const hit = page.locator(`.score-page [data-hit="${id}"]`).first();
	await hit.scrollIntoViewIfNeeded();
	await hit.click();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
}
async function reload(page: Page) {
	await page.waitForTimeout(4_000); // the save is debounced
	await page.reload();
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
}
const changes = (page: Page) => page.locator('.score-page [data-key-change]').evaluateAll((els) => els.map((e) => e.getAttribute('data-key-change')));

test.describe('saved and reloaded', () => {
	test.setTimeout(180_000);

	test('a key change corrected from bar 5 is still corrected after a reload', async ({ page }) => {
		await raise(page, 'key-changes.musicxml', 'm4-0-1');
		await page.locator('.loupe [data-ks-open]').click();
		await page.locator('[data-ks-remove]').click();
		await expect.poll(() => changes(page)).toEqual(['2>3']);
		await reload(page);
		await expect.poll(() => changes(page)).toEqual(['2>3']);
	});

	test('a grace note made a full note, and one added by hand, are still so after a reload', async ({ page }) => {
		await raise(page, 'grace-notes.musicxml', 'm0-0-1~g1');
		await page.keyboard.press(';'); // bar 1's grace note becomes a full note
		await page.keyboard.press('Escape');
		const hit = page.locator('.score-page [data-hit="m6-1-4"]').first();
		await hit.scrollIntoViewIfNeeded();
		await hit.click();
		await page.locator('#loupe-mode-corrections').click();
		await page.keyboard.press('/'); // a grace note added before bar 7's second note
		await expect(page.locator('.score-page [data-event-id^="hand:"]')).toHaveCount(1);
		const groups = await page.locator('.score-page [data-grace]').count();
		await reload(page);
		await expect(page.locator('.score-page [data-grace]')).toHaveCount(groups);
		await expect(page.locator('.score-page [data-event-id^="hand:"]')).toHaveCount(1);
		await expect(page.locator('.score-page [data-event-id="m0-0-1~g1"]')).toHaveCount(1); // now a full note with its own id
	});
});
