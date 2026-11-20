import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/*
 * LANE 75, ITEM 4 (QUEUE row 167; brief r2 section 5): A CONTRALTO WITH A SCORE, ON MELODY AND ON INSIGHTS. The borrowing line is the one place a singer who calls herself a
 * contralto is told why the values are a neighbour's, now that the VOICE pane no longer says it (lane 75, item 1). `insights-no-score.test.ts` pins it on INSIGHTS with no
 * score and `voice-pane.test.ts` pins the pane; no other kept test rendered either page WITH a score for a borrowing type (`stand-in-borrowing.test.ts` reads the two
 * panes' source text instead). This opens the one tracked engraved fixture for a contralto with nothing recorded, in both languages, and reads the live page.
 *
 * The line is the ratified `placeholder.borrowing`, written out here so the pin does not share code with the function it pins.
 */
test.use({ viewport: { width: 1440, height: 1300 } });

const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
const LINE = {
	en: 'The field has not yet published resonance values for a contralto, so Ilya is using its mezzo-soprano values until you sample your own vowels in VOICE.',
	fr: 'La recherche n’a pas encore publié de valeurs de résonance pour un contralto. Ilya utilise donc ses valeurs de mezzo-soprano jusqu’à ce que vous échantillonniez vos propres voyelles dans VOIX.'
} as const;

async function openWithScore(page: Page, language: 'en' | 'fr') {
	const now = new Date().toISOString();
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants: {}, voiceType: 'contralto' }] };
	await page.addInitScript(([lang, s]) => {
		localStorage.setItem('ilya:language', lang);
		localStorage.setItem('shane.profiles.v2', s);
	}, [language, JSON.stringify(store)] as const);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
}
/** The visible text of a page's container, every run of white space (a non-breaking space among them) read as one space. */
const flat = async (page: Page, selector: string) => (await page.locator(selector).innerText()).replace(/\s+/g, ' ');

for (const language of ['en', 'fr'] as const) {
	test(`${language}: a contralto with a score reads the borrowing line on MELODY and on INSIGHTS`, async ({ page }) => {
		await openWithScore(page, language);

		await page.locator('#tab-markup').click();
		await expect(page.locator('.markup-paper-container .score-window').first()).toBeVisible({ timeout: 20_000 });
		expect(await flat(page, '.markup-paper-container'), 'MELODY').toContain(LINE[language]);

		await page.locator('#tab-insights').click();
		await expect(page.locator('.insights-container .paper-page').first()).toBeVisible({ timeout: 20_000 });
		expect(await flat(page, '.insights-container'), 'INSIGHTS').toContain(LINE[language]);
	});
}
