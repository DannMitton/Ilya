/**
 * QUEUE row 138, step B5 (Fable's finding 11): a note entered at the head caret of a bar the singer made lands in THAT bar.
 *
 * On the fused reading she adds a barline, steps to the first note of the new bar, back onto its head caret, and enters a quarter. Before
 * this step the note was anchored to the bar before the barline and seated in it, while the Loupe showed the next.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium barline-head-caret
 */
import { test, expect, type Page } from '@playwright/test';

const FUSED = 'src/lib/omr/fixtures/barline-fused.musicxml';
const tag = async (page: Page) => ((await page.locator('.loupe .loupe-tag').textContent()) ?? '').replace(/\s+/g, ' ').trim().split(' · ')[0];
const readout = async (page: Page) => ((await page.locator('.readout').first().textContent()) ?? '').replace(/\s+/g, ' ').trim();

test('a note entered at the head caret of a hand-made bar is the first of that bar, and the bar before is untouched', async ({ page }) => {
	test.setTimeout(180_000);
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FUSED);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	await page.locator('.score-page [data-hit="m3-3-4"]').first().click();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-barline="add"]').click();
	// to the first note of bar 5, then back onto its head caret
	for (let i = 0; i < 6 && !/m\.\s?5\b/.test(await tag(page)); i++) {
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(300);
	}
	expect(await tag(page)).toMatch(/m\.\s?5\b/);
	await page.keyboard.press('ArrowLeft');
	await page.waitForTimeout(500);
	expect(await readout(page)).toMatch(/^after /);
	expect(await tag(page)).toMatch(/m\.\s?5\b/);
	await page.keyboard.press('5'); // a quarter
	await page.waitForTimeout(800);
	expect(await tag(page), 'the loupe stays on the bar it entered into').toMatch(/m\.\s?5\b/);
	expect(await readout(page)).toMatch(/Quarter/);
	// the bar before the barline did not gain a note: step back onto its last entry and read its fill
	await page.keyboard.press('ArrowLeft');
	await page.waitForTimeout(400);
	await page.keyboard.press('ArrowLeft');
	await page.waitForTimeout(400);
	expect(await tag(page)).toMatch(/m\.\s?4\b/);
	expect(await tag(page)).not.toMatch(/of 4/);
});
