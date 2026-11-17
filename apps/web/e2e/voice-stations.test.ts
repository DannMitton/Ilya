/**
 * N.203 lane 61, Step 1 (desk, 1440 by 900): the VOICE pane's two stations, "Describe your voice" and "What INSIGHTS shares, and how".
 * Each answer and each note written from a station reaches the stored voice; `calibratedAt` does not move; the stations are closed after a
 * reload; the intro counts five. The stub session (`?capture=stub`), no microphone. The phone's one-at-a-time rule is in `e2e-phone/`.
 */
import { test, expect, type Page } from '@playwright/test';
import { expandStation } from './helpers';

test.use({ viewport: { width: 1440, height: 900 } });

const NOW = '2026-11-01T10:00:00.000Z';
async function open(page: Page, voice: Record<string, unknown> = {}, language = 'en') {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: {}, ...voice }] };
	await page.addInitScript(([s, l]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store), language] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await expandStation(page, language === 'fr' ? 'Voix' : 'Voice');
}
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('shane.profiles.v2')!).voices[0]);
const header = (page: Page, name: RegExp) => page.getByRole('button', { name });
const DESCRIBE = /^describe your voice$/i;
const SHARES = /^what insights shares, and how$/i;

test.describe('the two VOICE stations', () => {
	test('both are closed on arrival, with no state line', async ({ page }) => {
		await open(page);
		for (const [name, words] of [[DESCRIBE, 'Describe your voice'], [SHARES, 'What INSIGHTS shares, and how']] as const) {
			await expect(header(page, name)).toHaveAttribute('aria-expanded', 'false');
			expect((await header(page, name).textContent())!.trim()).toBe(words);
		}
		await expect(page.locator('#describe-voice-body, #insights-shares-body')).toHaveCount(0);
	});

	test('a note written from "Describe your voice" reaches the stored voice, and the voice’s date does not move', async ({ page }) => {
		await open(page);
		await header(page, DESCRIBE).click();
		const high = page.getByRole('group', { name: 'Highest comfortable note' });
		await high.getByLabel('Note letter').selectOption('G');
		await high.getByLabel('Octave').selectOption('4');
		await expect.poll(async () => (await stored(page)).characteristics?.rangeHigh).toEqual({ step: 'G', alter: 0, octave: 4 });
		const v = await stored(page);
		expect(v.characteristics.source).toBe('manual');
		expect(v.calibratedAt).toBe(NOW);
		await high.getByRole('button', { name: 'Clear' }).click();
		await expect.poll(async () => (await stored(page)).characteristics).toBeUndefined();
	});

	test('a voice that was never dated keeps the date it had: calibratedAt becomes the previous updatedAt and stays', async ({ page }) => {
		await open(page, { calibratedAt: undefined });
		await header(page, DESCRIBE).click();
		const low = page.getByRole('group', { name: 'Lowest comfortable note' });
		await low.getByLabel('Note letter').selectOption('C');
		await expect.poll(async () => (await stored(page)).characteristics?.rangeLow?.step).toBe('C');
		const first = await stored(page);
		expect(first.calibratedAt).toBe(NOW);
		await low.getByLabel('Note letter').selectOption('D');
		await expect.poll(async () => (await stored(page)).characteristics?.rangeLow?.step).toBe('D');
		expect((await stored(page)).calibratedAt).toBe(NOW);
	});

	test('an inverted pair draws its amber note; the note goes when the pair is right again', async ({ page }) => {
		await open(page);
		await header(page, DESCRIBE).click();
		const high = page.getByRole('group', { name: 'Highest comfortable note' });
		const low = page.getByRole('group', { name: 'Lowest comfortable note' });
		await high.getByLabel('Note letter').selectOption('C');
		await high.getByLabel('Octave').selectOption('3');
		await low.getByLabel('Note letter').selectOption('A');
		await low.getByLabel('Octave').selectOption('4');
		await expect(page.getByRole('status').filter({ hasText: /./ })).toHaveCount(1);
		await low.getByLabel('Octave').selectOption('2');
		await expect(page.getByRole('status').filter({ hasText: /./ })).toHaveCount(0);
	});

	test('the five questions: the intro counts five, an answer is stored, Clear answer removes it', async ({ page }) => {
		await open(page);
		await header(page, DESCRIBE).click();
		await expect(page.locator('#describe-voice-body')).toContainText('Five quick questions so INSIGHTS understands your voice.');
		await expect(page.locator('#describe-voice-body fieldset.intake-question')).toHaveCount(5);
		const top = page.getByRole('group', { name: /How is the top of your voice/ });
		await top.getByLabel('It works in practice when I prepare it.').check();
		await expect.poll(async () => (await stored(page)).intake).toEqual({ top: 3 });
		await top.getByRole('button', { name: 'Clear answer' }).click();
		await expect.poll(async () => (await stored(page)).intake).toBeUndefined();
		expect((await stored(page)).calibratedAt).toBe(NOW);
	});

	test('"What INSIGHTS shares, and how": the topics, the acoustics question, and how comments appear are stored, and no intro is drawn', async ({ page }) => {
		await open(page);
		await header(page, SHARES).click();
		const body = page.locator('#insights-shares-body');
		await expect(body).not.toContainText('quick questions');
		await expect(body.locator('fieldset.intake-question')).toHaveCount(3);
		await body.getByRole('checkbox').first().uncheck();
		await expect.poll(async () => (await stored(page)).intake).toEqual({ topics: { high: false } });
		await body.getByRole('radio', { name: 'All of them' }).check();
		await expect.poll(async () => (await stored(page)).intake).toEqual({ topics: { high: false }, suggestions: 'all' });
		await body.getByRole('checkbox', { name: /imagery/i }).uncheck();
		await expect.poll(async () => (await stored(page)).intake?.imagery).toBe(false);
		const ac = body.locator('fieldset.intake-question').nth(1);
		await ac.getByRole('radio').nth(2).check();
		await expect.poll(async () => (await stored(page)).intake?.acoustics).toBe(3);
		expect((await stored(page)).calibratedAt).toBe(NOW);
	});

	test('both stay open together on a desk, and are closed again after a reload', async ({ page }) => {
		await open(page);
		await header(page, DESCRIBE).click();
		await header(page, SHARES).click();
		await expect(header(page, DESCRIBE)).toHaveAttribute('aria-expanded', 'true');
		await expect(header(page, SHARES)).toHaveAttribute('aria-expanded', 'true');
		await page.reload();
		await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
		await expandStation(page, 'Voice');
		await expect(header(page, DESCRIBE)).toHaveAttribute('aria-expanded', 'false');
		await expect(header(page, SHARES)).toHaveAttribute('aria-expanded', 'false');
	});

	test('the French names: « Décrire votre voix » and « Ce que partagent les APERÇUS, et comment »', async ({ page }) => {
		await open(page, {}, 'fr');
		await expect(page.getByRole('button', { name: 'Décrire votre voix' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Ce que partagent les APERÇUS, et comment' })).toBeVisible();
	});
});
