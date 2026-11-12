/**
 * THE -КИЙ RHYME READING AND ITS SET-ASIDE, DESK WIDTH (rhyme lane 49, step 5). Typed on two lines, «глубокой / высокий» reads
 * [kʌj] at the line end; tapping the ⟨и⟩ explains why, naming the partner; the Inspector draws the Stage reading box, and ticking
 * it reads the stage [kɨj] with the box still drawn and ticked; unticking brings [kʌj] back. Two boxes (spot first) are the usual
 * case for such a word, since a matched word reads [ʌ] and Reconstitution turns it to [ɑ].
 *
 * Set RHYME_CAPTURE_DIR to write the Inspector captures the desk asked for (390 px and desktop width, English and French).
 */
import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary, expandStation } from './helpers';

const capture = process.env.RHYME_CAPTURE_DIR;

async function typePair(page: Page) {
	await page.goto('/');
	await waitForDictionary(page);
	await page.locator('#intake-tab-lyrics').click();
	await page.locator('textarea.text-input').fill('глубокой\nвысокий');
	await page.waitForSelector('.paper-container [data-word-index="1-0"]');
	await page.waitForTimeout(1500);
}

test('a rhymed -кий reads [kʌj], explains itself, and its Stage reading box sets the rhyme aside and back', async ({ page }) => {
	test.setTimeout(120_000);
	await typePair(page);
	const word = page.locator('.paper-container [data-word-index="1-0"]');
	await expect(word.locator('.ipa-row')).toContainText('kʌj');
	await word.click();
	await expandStation(page, 'Analysis');

	const stage = page.locator('.rhyme-checkbox');
	await expect(stage).toBeVisible();
	await expect(stage).not.toBeChecked();
	await expect(page.locator('.reading-box-text', { hasText: 'Stage reading' })).toBeVisible();
	// Spot first, then Stage reading: a matched word reads [ʌ], which Reconstitution turns to [ɑ]
	await expect(page.locator('.reading-box-label').nth(0).locator('.spot-checkbox')).toBeVisible();
	await expect(page.locator('.reading-box-label').nth(1).locator('.rhyme-checkbox')).toBeVisible();

	// The ⟨и⟩ of the ending explains the reading and names the partner
	await page.locator('.ribbon-body .atom', { has: page.locator('.atom-char', { hasText: /^и$/ }) }).last().click();
	await expect(page.locator('.blurb-text')).toContainText('rhymes with «глубокой»');
	await expect(page.locator('.blurb-citation')).toContainText('Grayson, p. 302');

	if (capture) await page.screenshot({ path: `${capture}/inspector-desktop-en.png`, fullPage: false });

	await stage.check();
	await expect(word.locator('.ipa-row')).toContainText('kɨj');
	await expect(word.locator('.ipa-row')).not.toContainText('kʌj');
	await expect(stage).toBeVisible();
	await expect(stage).toBeChecked();

	await stage.uncheck();
	await expect(word.locator('.ipa-row')).toContainText('kʌj');
	await expect(stage).not.toBeChecked();
});

test('the set-aside is saved with the song and is shown after a reload', async ({ page }) => {
	test.setTimeout(120_000);
	await typePair(page);
	const word = page.locator('.paper-container [data-word-index="1-0"]');
	await word.click();
	await expandStation(page, 'Analysis');
	await page.locator('.rhyme-checkbox').check();
	await expect(word.locator('.ipa-row')).toContainText('kɨj');
	await page.waitForTimeout(3000); // the save is debounced
	await page.reload();
	await waitForDictionary(page);
	await page.waitForSelector('.paper-container [data-word-index="1-0"]');
	await page.waitForTimeout(1500);
	await expect(page.locator('.paper-container [data-word-index="1-0"] .ipa-row')).toContainText('kɨj');
	await page.locator('.paper-container [data-word-index="1-0"]').click();
	await expandStation(page, 'Analysis');
	await expect(page.locator('.rhyme-checkbox')).toBeChecked();
});
