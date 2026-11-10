/**
 * ROW 184 (WORD MARKS) (RULED BY DANN 2026-11-09 20:44), DESK WIDTH: the Inspector's word marks are saved with the song. A stress and a
 * spot reconstitution set on song 1 are still there after a reload, on Lyrics and on Poem.
 */
import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary, expandStation } from './helpers';

/**
 * THE STRESS IS READ OFF THE IPA ROW, NOT THE WHOLE STACK. After a reload the first transcription runs before the lazy homograph
 * tier of the dictionary lands (`loader.ts`, `scheduleHomographTier`), so the printed GLOSS of a homograph such as «замок» is its
 * first entry's until the text is transcribed again, while the stress the singer chose is applied at once. That ordering is the
 * loader's and is not this feature's (see the step 4 report); the saved mark is what this test asserts.
 *
 * «замок» is two words in the dictionary (за́мок, замо́к), so the Inspector offers the other stress. «молоко» has reduced
 * vowels, so its box offers a spot reconstitution («замок» does not: its pretonic «а» reads the same either way).
 */
async function markTwoWords(page: Page, tab: 'lyrics' | 'poem') {
	await page.goto('/');
	await waitForDictionary(page);
	await page.locator(`#intake-tab-${tab}`).click();
	await page.locator('textarea.text-input').fill('замок молоко');
	await page.waitForSelector('.paper-container [data-word-index="0-1"]');
	await page.waitForTimeout(1500); // Lyrics' typed text transcribes after its quiet pause, which clears any selection
	const first = page.locator('.paper-container [data-word-index="0-0"]');
	const second = page.locator('.paper-container [data-word-index="0-1"]');
	const ipa = (word: typeof first) => word.locator('.ipa-row').textContent();
	const before = await ipa(first);

	await first.click();
	await expandStation(page, 'Analysis');
	await page.locator('.dict-button').click();
	await page.locator('.dict-entry-option:not(.stress-matched)').first().click();
	await expect(first.locator('.ipa-row')).not.toHaveText(before ?? '');
	const withStress = await ipa(first);

	await second.click();
	await page.locator('.spot-checkbox').check();
	await expect(second.locator('.recon-sigla')).toBeVisible();
	return { first, second, before, withStress };
}

async function expectBothShown(page: Page, tab: 'lyrics' | 'poem', withStress: string | null) {
	await page.waitForSelector('.paper-container [data-word-index="0-1"]');
	await page.waitForTimeout(1500);
	await page.locator(`#intake-tab-${tab}`).click();
	const first = page.locator('.paper-container [data-word-index="0-0"]');
	const second = page.locator('.paper-container [data-word-index="0-1"]');
	await expect(first.locator('.ipa-row')).toHaveText(withStress ?? '');
	await expect(second.locator('.recon-sigla')).toBeVisible();
	await second.click();
	await expandStation(page, 'Analysis');
	await expect(page.locator('.spot-checkbox')).toBeChecked();
}

for (const tab of ['lyrics', 'poem'] as const) {
	test(`a stress and a spot reconstitution set on song 1 are shown after a reload (${tab})`, async ({ page }) => {
		test.setTimeout(120_000);
		const { before, withStress } = await markTwoWords(page, tab);
		expect(withStress).not.toBe(before);
		// The save is debounced; give it its pause, then reload.
		await page.waitForTimeout(3000);
		await page.reload();
		await waitForDictionary(page);
		await expectBothShown(page, tab, withStress);
	});
}
