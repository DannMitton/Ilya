import { test, expect, type Page } from '@playwright/test';

/*
 * Lane 69 Step 3: MELODY with no score attached. Its page draws a squircle, and under it NOTES, whose first line says where the voice stands. Below five stable core vowels it is the
 * sentence the VOICE pane prints, counted from what the singer sampled. At five it is "Your profile is now set with five vowels measured."
 * No test before this one read the sentence, and the wiring guard in `markup/profile-status.test.ts` cannot see the page.
 *
 * Every seeded reading carries `confidence: 'high'`: a reading with `confidence: 'low'` is not stable (`voice/engine/sung.ts:29`), and the first case would print 0 of 6.
 */
test.use({ viewport: { width: 1440, height: 1000 } });

const READING = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });

async function openMelodyWithNoScore(page: Page, formants: Record<string, unknown>) {
	const now = new Date().toISOString();
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'soprano' }] };
	await page.addInitScript(([lang, s]) => {
		localStorage.setItem('ilya:language', lang);
		localStorage.setItem('shane.profiles.v2', s);
	}, ['en', JSON.stringify(store)] as const);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('#tab-markup').click();
	await expect(page.locator('[data-blank-notes] .notes-line').first()).toBeVisible({ timeout: 20_000 });
}
// NOTES under the blank state's squircle (`components/Paper/BlankState.svelte`) holds the status line, then the provisional sentence if any, so the first is the status line.
const statusLine = async (page: Page) => (await page.locator('[data-blank-notes] .notes-line').first().innerText()).replace(/\s+/g, ' ').trim();

test.describe('MELODY with no score: the line that says where the voice stands', () => {
	test('one core vowel sampled: how many of the six, and how many more Ilya needs', async ({ page }) => {
		await openMelodyWithNoScore(page, { i: READING(300, 2200) });
		expect(await statusLine(page)).toBe(
			'You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values.'
		);
	});

	test('five stable core vowels sampled: the profile is set, with five vowels measured', async ({ page }) => {
		await openMelodyWithNoScore(page, { i: READING(300, 2200), e: READING(450, 2000), 'ɛ': READING(600, 1800), 'ɑ': READING(800, 1200), o: READING(500, 900) });
		expect(await statusLine(page)).toBe('Your profile is now set with five vowels measured.');
	});
});
