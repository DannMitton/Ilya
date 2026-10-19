/**
 * ROWS 109 AND 110 (N.186), DESK WIDTH: Text's word tools work on the witness
 * Text shows. A gloss set on a word of the Poem lands on the poem's word, not on
 * Lyrics' word at the same position, and survives a reload.
 */
import { test, expect } from '@playwright/test';
import { waitForDictionary, expandStation } from './helpers';

test('a gloss on a poem word stays on the poem and survives a reload', async ({ page }) => {
	test.setTimeout(120_000);
	await page.goto('/');
	await waitForDictionary(page);
	const ta = page.locator('textarea.text-input');
	await page.locator('#intake-tab-lyrics').click();
	await ta.fill('Тебя я увидел, тебя я увидел');
	await page.locator('#intake-tab-poem').click();
	await ta.fill('Тебя я увидел');
	await expect(page.locator('#text-tab-poem')).toBeVisible();
	await page.locator('#text-tab-poem').click();
	await page.waitForSelector('.paper-container [data-word-index="0-0"]');
	// Lyrics' typed text transcribes after its quiet pause and clears any selection (`resetTranscriptionView`); let it settle.
	await page.waitForTimeout(1500);
	await page.locator('.paper-container [data-word-index="0-0"]').click();
	await expandStation(page, 'Analysis');
	await page.locator('.dict-button').click();
	await page.getByLabel('Edit gloss').fill('MYPOEMGLOSS');
	await page.waitForTimeout(2500);
	await expect(page.locator('.paper-container [data-word-index="0-0"]')).toContainText('MYPOEMGLOSS');
	await page.locator('#text-tab-lyrics').click();
	await expect(page.locator('.paper-container [data-word-index="0-0"]')).not.toContainText('MYPOEMGLOSS');
	await page.reload();
	await waitForDictionary(page);
	await expect(page.locator('#text-tab-lyrics')).toHaveAttribute('aria-selected', 'true');
	await page.locator('#text-tab-poem').click();
	await expect(page.locator('.paper-container [data-word-index="0-0"]')).toContainText('MYPOEMGLOSS');
});
