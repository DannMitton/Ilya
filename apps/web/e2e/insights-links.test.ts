/**
 * N.203 lane 61, Steps 3 and 4 (desk, 1440 by 900): the links on the INSIGHTS page. L1, "What INSIGHTS shares, and how", opens that station
 * and brings it into view; nothing of it prints. The phone's cases are in `e2e-phone/insights-links.test.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { expandStation } from './helpers';

test.use({ viewport: { width: 1440, height: 900 } });

const NOW = '2026-11-01T10:00:00.000Z';
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const FOUR = { i: R(296, 1705), e: R(381, 1532), u: R(346, 804), a: R(600, 1250) };
const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');

async function open(page: Page, voice: Record<string, unknown> | null = {}, language = 'en') {
	const store = voice && { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: FOUR, voiceType: 'bass', ...voice }] };
	await page.addInitScript(([s, l]) => { localStorage.setItem('ilya:language', l); if (s) localStorage.setItem('shane.profiles.v2', s); }, [store ? JSON.stringify(store) : null, language] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
}
async function toInsights(page: Page) {
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
	await page.locator('#tab-insights').click();
	await expect(page.locator('.insights-container')).toBeVisible({ timeout: 20_000 });
}
const shares = (page: Page, language = 'en') => page.locator('.insights-container').getByRole('button', { name: language === 'fr' ? 'Ce que partagent les APERÇUS, et comment' : 'What INSIGHTS shares, and how' });
const station = (page: Page, name: RegExp) => page.getByRole('button', { name });
const SHARES = /^what insights shares, and how$/i;

test.describe('L1: What INSIGHTS shares, and how', () => {
	test('is drawn after the Method line; with the VOICE band closed it opens the band and the station and brings the station into view', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page);
		await toInsights(page);
		await expect(shares(page)).toBeVisible({ timeout: 20_000 });
		await shares(page).click();
		await expect(station(page, SHARES).first()).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('[data-station="insightsShares"]')).toBeInViewport();
		await expect(page.locator('.takeover-back')).toBeHidden();
	});

	test('with INPUT and VOICE already open the Drawer scrolls to the station', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page);
		await expandStation(page, 'Input');
		await expandStation(page, 'Voice');
		await toInsights(page);
		await shares(page).click();
		await expect(page.locator('[data-station="insightsShares"]')).toBeInViewport();
		expect(await page.locator('.drawer-content').evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
	});

	test('is not drawn with no voice saved', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, null);
		await toInsights(page);
		await expect(page.locator('.insights-container')).toContainText('Nothing is claimed about your voice', { timeout: 20_000 });
		await expect(shares(page)).toHaveCount(0);
	});

	test('prints nothing of it: the link is display none in print, and the notes keep their Method line', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page);
		await toInsights(page);
		await expect(shares(page)).toBeVisible({ timeout: 20_000 });
		await page.emulateMedia({ media: 'print' });
		await expect(page.locator('.insights-container .notes-links')).toHaveCount(1);
		expect(await page.locator('.insights-container .notes-links').first().evaluate((el) => getComputedStyle(el).display)).toBe('none');
		await expect(page.locator('.insights-container')).toContainText('Method:');
	});

	test('in French the link is « Ce que partagent les APERÇUS, et comment »', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, {}, 'fr');
		await toInsights(page);
		await expect(shares(page, 'fr')).toBeVisible({ timeout: 20_000 });
	});
});

/* ── Step 4: L4 and L6 ─────────────────────────────────────────────────────────────────────────────────────────────── */
const noScore = async (page: Page) => {
	await page.locator('#tab-insights').click();
	await expect(page.locator('.insights-container')).toBeVisible({ timeout: 20_000 });
};
const inputLink = (page: Page, language = 'en') => page.locator('.insights-container').getByRole('button', { name: language === 'fr' ? 'ENTRÉE' : 'INPUT', exact: true });

test.describe('L4: a link to record vowels, beside L1, where the findings rest on placeholder values', () => {
	/* `adapted.generic` is `!anySung && hasPlaceholderProfile(voiceType)` (`resolve-values.ts:210`): a placeholder Method line means nothing usable is
	   recorded, so in practice the door's words are "Record your vowels". With any vowel recorded the Method line rests on the samples and no link is drawn. */
	test('with nothing recorded and a voice type it says "Record your vowels" beside L1, and opens Welcome, also when pressed again', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, { formants: {} });
		await toInsights(page);
		const link = page.locator('.insights-container').getByRole('button', { name: 'Record your vowels' });
		await expect(link).toBeVisible({ timeout: 20_000 });
		await expect(shares(page)).toBeVisible();
		await link.click();
		await expect(page.locator('.takeover-back')).toBeVisible();
		await expect(page.getByRole('button', { name: /^begin$/i })).toBeVisible();
		await link.click();
		await expect(page.getByRole('button', { name: /^begin$/i })).toBeVisible();
	});
	test('in French the link is the pane’s door: « Capter vos voyelles »', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, { formants: {} }, 'fr');
		await toInsights(page);
		await expect(page.locator('.insights-container').getByRole('button', { name: 'Capter vos voyelles' })).toBeVisible({ timeout: 20_000 });
	});
	test('is not drawn when the singer\'s own profile stands, five of the six core vowels (the Method line then rests on the singer’s samples; lane 67)', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, { formants: { ...FOUR, 'ɛ': R(577, 1311), 'ɑ': R(617, 1013) } });
		await toInsights(page);
		await expect(shares(page)).toBeVisible({ timeout: 20_000 });
		await expect(page.locator('.insights-container').getByRole('button', { name: /^(Record your vowels|Carry on recording|Record a vowel again)$/ })).toHaveCount(0);
	});
});

test.describe('L6: INPUT, in the sentence for a piece with no score', () => {
	const SENTENCE = 'INSIGHTS measures a piece from its score, and connects it to your voice. Add a score in the INPUT pane to begin.';
	const drawer = (page: Page) => page.locator('aside.drawer');
	const inputBand = (page: Page, name = /^input$/i) => drawer(page).getByRole('button', { name });
	/** INPUT is open on a first run; the link's job is to open it, so shut it first. */
	const shutInput = async (page: Page, name = /^input$/i) => { if ((await inputBand(page, name).getAttribute('aria-expanded')) === 'true') await inputBand(page, name).click(); await expect(inputBand(page, name)).toHaveAttribute('aria-expanded', 'false'); };
	test('the sentence reads as it always did, and INPUT opens the INPUT pane and brings its head into view', async ({ page }) => {
		await open(page);
		await expandStation(page, 'Voice');
		await shutInput(page);
		await noScore(page);
		expect((await page.locator('.insights-container p.prose').first().innerText()).replace(/\s+/g, ' ')).toContain(SENTENCE);
		await inputLink(page).click();
		await expect(inputBand(page)).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('[data-band-head="input"]')).toBeInViewport();
	});
	test('in French the word is ENTRÉE', async ({ page }) => {
		await open(page, {}, 'fr');
		await shutInput(page, /^entrée$/i);
		await noScore(page);
		await inputLink(page, 'fr').click();
		await expect(inputBand(page, /^entrée$/i)).toHaveAttribute('aria-expanded', 'true');
	});
	test('with the takeover up on the summary it leaves the takeover and opens INPUT', async ({ page }) => {
		await open(page);
		await shutInput(page);
		await expandStation(page, 'Voice');
		await noScore(page);
		await page.getByRole('button', { name: /^your vowel space$/i }).click();
		await expect(page.locator('.takeover-back')).toBeVisible();
		await inputLink(page).click();
		await expect(page.locator('.takeover-back')).toBeHidden();
		await expect(inputBand(page)).toHaveAttribute('aria-expanded', 'true');
		await page.waitForTimeout(800);
		await expect(page.locator('[data-band-head="input"]')).toBeInViewport();
	});
	test('over the capture screen it is dropped, and never answered later', async ({ page }) => {
		await open(page);
		await shutInput(page);
		await expandStation(page, 'Voice');
		await noScore(page);
		await page.getByRole('button', { name: /^carry on recording$/i }).first().click();
		await expect(page.locator('.capture')).toBeVisible();
		await inputLink(page).click();
		await page.waitForTimeout(1200);
		await expect(page.locator('.capture')).toBeVisible();
		await page.locator('.takeover-back').click();
		await page.waitForTimeout(1200);
		await expect(inputBand(page)).toHaveAttribute('aria-expanded', 'false');
	});
	test('prints as the same sentence, with no link styling', async ({ page }) => {
		await open(page);
		await noScore(page);
		await page.emulateMedia({ media: 'print' });
		const css = await inputLink(page).evaluate((el) => { const s = getComputedStyle(el); return { deco: s.textDecorationLine, color: s.color, parent: getComputedStyle(el.parentElement!).color }; });
		expect(css.deco).toBe('none');
		expect(css.color).toBe(css.parent);
	});
});
