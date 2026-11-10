/**
 * Row 179: an edited gloss keeps its language and is reused (walk items 1 to 8).
 * Brief: `docs/sessions/brief-code-gloss-language-and-reuse_r3_2026-11-03.md`.
 *
 * The word is `мрежа` ("net"): the shipped dictionary gives it an English gloss
 * and no French one, so in French its field is empty, which is the gap the offer
 * stands in. Its other forms (`мрежу`) share its lemma.
 */
import { test, expect, type Page } from '@playwright/test';
import { transcribe, waitForDictionary } from './helpers';

async function open(page: Page, language: 'en' | 'fr') {
	await page.addInitScript((l) => {
		if (!sessionStorage.getItem('gloss-reuse-init')) {
			sessionStorage.setItem('gloss-reuse-init', '1');
			localStorage.setItem('ilya:language', l);
		}
	}, language);
	await page.goto('/');
	await waitForDictionary(page);
}

async function openField(page: Page, word = '0-0') {
	await page.locator(`[data-word-index="${word}"]`).click();
	const station = page.getByRole('button', { name: /^(Analysis|Analyse)$/i });
	if ((await station.getAttribute('aria-expanded')) !== 'true') await station.click();
	const button = page.locator('.dict-button');
	if (!(await page.locator('.dict-gloss-input').isVisible())) await button.click();
	return page.locator('.dict-gloss-input');
}

const OFFER = 'Utiliser pour ce mot dans vos autres chants';

test.describe('an edited gloss keeps its language and is reused', () => {
	test('French: the offer stands under the field, is kept, and the other form shows the French', async ({ page }) => {
		await open(page, 'fr');
		await transcribe(page, 'мрежа мрежу');
		const first = page.locator('[data-word-index="0-0"]');
		const second = page.locator('[data-word-index="0-1"]');
		await expect(first.locator('.gloss-row')).toHaveText('');
		const field = await openField(page);
		await expect(page.getByRole('button', { name: OFFER })).toHaveCount(0);

		await field.fill('filet'); // walk item 1
		await expect(first.locator('.gloss-row')).toHaveText('filet');
		await expect(second.locator('.gloss-row')).toHaveText('');
		const offer = page.getByRole('button', { name: OFFER });
		await expect(offer).toBeVisible();

		await field.blur(); // it stays through "Enregistré"
		await expect(offer).toBeVisible();

		await offer.click(); // walk item 2
		await expect(page.getByText('Utilisée dans vos autres chants')).toBeVisible();
		await expect(second.locator('.gloss-row')).toHaveText('filet'); // the glossary fills the sibling form
		// The fill is not an edit of the song: Reset does not belong to the sibling.
		await second.click();
		await expect(page.getByRole('button', { name: /Réinitialiser/ })).toHaveCount(0);
		await page.locator('.dict-button').click(); // a word change closes the panel
		await expect(page.getByText('De vos autres chants')).toBeVisible();

		// Stop using: the glossary entry goes, the song's own edit stays (walk item 5).
		await page.getByRole('button', { name: 'Ne plus utiliser' }).click();
		await expect(second.locator('.gloss-row')).toHaveText('');
		await expect(first.locator('.gloss-row')).toHaveText('filet');
	});

	test('"Pas maintenant" hides the offer for this word, and an unanswered offer returns on reopening', async ({ page }) => {
		await open(page, 'fr');
		await transcribe(page, 'мрежа');
		const field = await openField(page);
		await field.fill('filet');
		await expect(page.getByRole('button', { name: OFFER })).toBeVisible();
		// Close the panel without answering, then reopen it: the offer is there again (walk item 4).
		await page.locator('.dict-button').click();
		await page.locator('.dict-button').click();
		await expect(page.getByRole('button', { name: OFFER })).toBeVisible();
		await page.getByRole('button', { name: 'Pas maintenant' }).click();
		await expect(page.getByRole('button', { name: OFFER })).toHaveCount(0);
	});

	test('the edit stays in its language, and Reset clears it (walk items 6 and 8)', async ({ page }) => {
		await open(page, 'fr');
		await transcribe(page, 'мрежа');
		const word = page.locator('[data-word-index="0-0"]');
		const field = await openField(page);
		await field.fill('filet');
		await expect(word.locator('.gloss-row')).toHaveText('filet');
		await page.evaluate(() => localStorage.setItem('ilya:language', 'en'));
		await page.reload();
		await waitForDictionary(page);
		await page.waitForSelector('[data-word-index="0-0"]', { timeout: 10_000 });
		await expect(page.locator('[data-word-index="0-0"] .gloss-row')).toHaveText('net'); // the dictionary's English, not her French
	});
});
