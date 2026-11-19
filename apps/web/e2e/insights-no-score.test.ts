import { test, expect, type Page } from '@playwright/test';

/*
 * N.203 lane 59 Step 8 (slice 5): INSIGHTS with no score. The ratified sentence (sheet line 27), and a true method line for each of the three voices the page can
 * meet: one that rests on the singer's own samples (line 28), one that rests on a voice type's generic values (line 29), and one with nothing usable and no generic
 * values (the new line, ratified by Dann 2026-11-16 01:28). No score is loaded, so the pane has no model; the method line reads what the voice rests on.
 */
test.use({ viewport: { width: 1440, height: 1000 } });

const READING = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });

async function openInsightsWithNoScore(page: Page, opts: { language: 'en' | 'fr'; voiceType?: string; formants?: Record<string, unknown> }) {
	const now = new Date().toISOString();
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants: opts.formants ?? {}, ...(opts.voiceType ? { voiceType: opts.voiceType } : {}) }] };
	await page.addInitScript(([lang, s]) => {
		localStorage.setItem('ilya:language', lang);
		localStorage.setItem('shane.profiles.v2', s);
	}, [opts.language, JSON.stringify(store)] as const);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('#tab-insights').click();
	await expect(page.locator('.insights-container')).toBeVisible({ timeout: 20_000 });
}
const text = async (page: Page) => (await page.locator('.insights-container').innerText()).replace(/\s+/g, ' ').replace(/ /g, ' ');

const SAMPLES = { i: READING(300, 2200), e: READING(450, 2000), u: READING(350, 800) };

test.describe('INSIGHTS with no score', () => {
	for (const language of ['en', 'fr'] as const) {
		const sentence = language === 'en'
			? 'INSIGHTS measures a piece from its score, and connects it to your voice. Add a score in the INPUT pane to begin.'
			: 'Les APERÇUS mesurent une pièce à partir de sa partition, et la relient à votre voix. Ajoutez une partition dans le volet ENTRÉE pour commencer.';
		const methods = language === 'en'
			? ['Method: from your resonance profile, measured in VOICE.', 'Method: from placeholder values, until you record your own vowels.', 'Method: record your vowels in VOICE, and this page computes from your voice.']
			: ['Méthode : à partir de votre profil de résonances, mesuré dans VOIX.', 'Méthode : à partir de valeurs par défaut, jusqu’à ce que vous captiez vos propres voyelles.', 'Méthode : captez vos voyelles dans VOIX, et cette page calcule à partir de votre voix.'];

		test(`${language}: a voice that rests on the singer's own samples`, async ({ page }) => {
			await openInsightsWithNoScore(page, { language, voiceType: 'bass', formants: SAMPLES });
			const t = await text(page);
			expect(t).toContain(sentence);
			expect(t).toContain(methods[0]);
			expect(t).not.toContain(methods[1]);
			expect(t).not.toContain(methods[2]);
		});

		test(`${language}: a voice type with generic values and nothing recorded`, async ({ page }) => {
			await openInsightsWithNoScore(page, { language, voiceType: 'baritone' });
			const t = await text(page);
			expect(t).toContain(sentence);
			expect(t).toContain(methods[1]);
			expect(t).not.toContain(methods[0]);
			expect(t).not.toContain(methods[2]);
		});

		test(`${language}: a voice with nothing usable and no generic values ("Not sure")`, async ({ page }) => {
			await openInsightsWithNoScore(page, { language, voiceType: 'not-sure' });
			const t = await text(page);
			expect(t).toContain(sentence);
			expect(t).toContain(methods[2]);
			expect(t).not.toContain(methods[0]);
			expect(t).not.toContain(methods[1]);
		});

		// QUEUE row 167 (ruling of 2026-11-19): a contralto has generic values, borrowed from the mezzo-soprano staff, and the page says so with no score loaded.
		test(`${language}: a contralto with nothing recorded reads the generic method line and the borrowing line`, async ({ page }) => {
			await openInsightsWithNoScore(page, { language, voiceType: 'contralto' });
			const t = await text(page);
			expect(t).toContain(sentence);
			expect(t).toContain(methods[1]);
			expect(t).toContain(language === 'en'
				? 'The field has not yet published resonance values for a contralto, so Ilya is using its mezzo-soprano values until you sample your own vowels in VOICE.'
				: 'La recherche n’a pas encore publié de valeurs de résonance pour un contralto. Ilya utilise donc ses valeurs de mezzo-soprano jusqu’à ce que vous échantillonniez vos propres voyelles dans VOIX.');
			expect(t).not.toContain(methods[2]);
		});
	}
});
