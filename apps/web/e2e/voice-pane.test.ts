/**
 * N.203 lane 60 (Steps 1 to 3): the VOICE pane at rest, its seam to the wizard, and its doors, in a browser (no unit test mounts the wizard,
 * and the tree has no DOM test environment). Desk layout, the stub session (`?capture=stub`, development server only), no microphone.
 */
import { test, expect, type Page } from '@playwright/test';
import { expandStation } from './helpers';

test.use({ viewport: { width: 1440, height: 900 } });

const STORE_KEY = 'shane.profiles.v2';
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const NINE = { i: R(296, 1705), e: R(381, 1532), 'ɪ': R(393, 1600), 'ɨ': R(404, 1100), 'ɛ': R(577, 1311), a: R(711, 1113), 'ɑ': R(617, 1013), 'ʌ': R(616, 1167), o: R(489, 826) };

type Voice = { id: string; name: string; formants?: Record<string, unknown>; voiceType?: string };
async function open(page: Page, voices: Voice[] | null) {
	const now = '2026-11-01T10:00:00.000Z';
	const store = voices && { version: 2, activeId: voices[0].id, voices: voices.map((v) => ({ createdAt: now, updatedAt: now, calibratedAt: now, formants: {}, ...v })) };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); if (s) localStorage.setItem('shane.profiles.v2', s); }, [store ? JSON.stringify(store) : null] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await expandStation(page, 'Voice');
}
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), STORE_KEY);
const sentence = (page: Page) => page.locator('.vp-sentence');
const door = (page: Page, name: RegExp) => page.getByRole('button', { name });

test.describe('the VOICE pane at rest', () => {
	test('with no voice saved it is the first-launch form, and Start names the voice and shows the pane', async ({ page }) => {
		await open(page, null);
		await expect(page.locator('.vp-door')).toHaveCount(0);
		const field = page.locator('#ps-first-name');
		await field.fill('Dann');
		await page.getByRole('button', { name: 'Start', exact: true }).click();
		await expect(sentence(page)).toHaveText(/^Record your ten vowels/);
		expect((await stored(page)).voices[0].name).toBe('Dann');
		await expect(door(page, /^record your vowels$/i)).toBeVisible();
		await expect(door(page, /^your vowel space$/i)).toHaveCount(0);
	});

	test('the type control in the pane writes the stored voice type, and the sentence and the doors follow', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann' }]);
		await page.getByRole('button', { name: /^choose a voice type$/i }).click();
		await page.getByRole('radio', { name: 'Bass', exact: true }).check();
		expect((await stored(page)).voices[0].voiceType).toBe('bass');
		await expect(sentence(page)).toHaveText('Ilya is using generic values for a bass voice until you record your own.');
		await expect(door(page, /^your vowel space$/i)).toBeVisible();
		await page.getByRole('radio', { name: 'Contralto', exact: true }).check();
		await expect(sentence(page)).toHaveText(/^Ilya has no generic values for a contralto voice yet/);
		await expect(door(page, /^your vowel space$/i)).toHaveCount(0);
	});

	test('the switcher in the pane changes the page’s voice, and the closed band follows', async ({ page }) => {
		await open(page, [{ id: 'a', name: 'Dann' }, { id: 'b', name: 'Studio' }]);
		await page.getByRole('button', { name: 'Dann, options' }).click();
		await page.locator('.ps-voice', { hasText: 'Studio' }).click();
		expect((await stored(page)).activeId).toBe('b');
		await page.getByRole('button', { name: /^voice$/i }).click(); // close the band: its line names the active voice
		await expect(page.getByText('Voice: Studio')).toBeVisible();
	});

	test('the door to recording is named for the state, and opens Welcome for a voice with nothing recorded', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass' }]);
		await door(page, /^record your vowels$/i).click();
		await expect(page.getByRole('button', { name: /^begin$/i })).toBeVisible();
		await page.locator('.takeover-back').click();
		await expect(sentence(page)).toBeVisible();
	});

	test('with nine recorded the pane says so and offers to carry on, and the door opens the capture screen', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: NINE }]);
		await expect(sentence(page)).toHaveText('You have recorded 9 of the 10 vowels. Ilya fills the last one from what you have recorded so far.');
		await door(page, /^carry on recording$/i).click();
		await expect(page.locator('.capture')).toBeVisible();
	});

	test('a request from rest lands on the asked screen even though the wizard was left stowed on the capture screen; Finish returns to the pane and writes nothing', async ({ page }) => {
		await open(page, [{ id: 'v', name: 'Dann', voiceType: 'bass', formants: NINE }]);
		await door(page, /^carry on recording$/i).click();
		await expect(page.locator('.capture')).toBeVisible();
		await page.locator('.takeover-back').click();
		await expect(sentence(page)).toBeVisible();
		await door(page, /^your vowel space$/i).click();
		await expect(page.locator('.vowel-sheet')).toBeVisible();
		await expect(page.locator('.capture')).toHaveCount(0);
		const before = (await stored(page)).voices[0];
		await page.getByRole('button', { name: /^finish$/i }).click();
		await expect(sentence(page)).toBeVisible();
		const after = (await stored(page)).voices[0];
		expect(after.calibratedAt).toBe(before.calibratedAt);
		expect(after.updatedAt).toBe(before.updatedAt);
	});
});
