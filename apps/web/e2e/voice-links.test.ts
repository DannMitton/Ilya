/**
 * N.203 lane 61, Step 2 (desk, 1440 by 900): INSIGHTS' "Add your range" opens "Describe your voice" at the Range, in place, and brings it into
 * view (Dann 2026-11-16 20:13). With the takeover up on Welcome, the summary, or the test fry, the press leaves the takeover and lands; the
 * Drawer's restore of the stowed scroll does not undo it. The refusal over the capture screen is in `voice-pane.test.ts`.
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { expandStation } from './helpers';

test.use({ viewport: { width: 1440, height: 900 } });

const NOW = '2026-11-01T10:00:00.000Z';
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const FOUR = { i: R(296, 1705), e: R(381, 1532), u: R(346, 804), a: R(600, 1250) };
const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');

async function open(page: Page, voice: Record<string, unknown> = {}) {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: FOUR, voiceType: 'bass', ...voice }] };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store)] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
}
async function toInsights(page: Page) {
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
	await page.locator('#tab-insights').click();
	await expect(offer(page)).toBeVisible({ timeout: 20_000 });
}
const offer = (page: Page) => page.getByRole('button', { name: 'Add your range' });
const describe = (page: Page) => page.getByRole('button', { name: /^describe your voice$/i });
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('shane.profiles.v2')!).voices[0]);
const landed = async (page: Page) => {
	await expect(describe(page)).toHaveAttribute('aria-expanded', 'true');
	await expect(page.locator('[data-describe="range"]')).toBeInViewport();
	await expect(page.locator('.takeover-back')).toBeHidden();
};

test.describe('"Add your range" lands on the Range pickers', () => {
	test('with the VOICE band closed: the band opens, the station opens, the Range is in view', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page);
		await toInsights(page);
		await expect(page.getByRole('button', { name: /^voice$/i })).toHaveAttribute('aria-expanded', 'false');
		await offer(page).click();
		await landed(page);
	});

	test('with the VOICE band open and INPUT open above it (the station starts below the fold): the Drawer scrolls to bring the Range into view', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page);
		await expandStation(page, 'Input');
		await expandStation(page, 'Voice');
		await toInsights(page);
		await offer(page).click();
		await landed(page);
		expect(await page.locator('.drawer-content').evaluate((el) => el.scrollTop), 'the Drawer moved to the Range').toBeGreaterThan(0);
		expect((await stored(page)).calibratedAt).toBe(NOW);
	});

	test('with an inverted pair stored the station shows its amber note (INSIGHTS offers the link only to a voice with no range, so here the station opens from its header)', async ({ page }) => {
		const p = (step: string, octave: number) => ({ step, alter: 0, octave });
		await open(page, { characteristics: { source: 'manual', rangeLow: p('A', 4), rangeHigh: p('C', 3) } });
		await expandStation(page, 'Voice');
		await describe(page).click();
		await expect(page.getByRole('status').filter({ hasText: /./ })).toHaveCount(1);
	});

	for (const where of ['Welcome', 'the summary'] as const) {
		test(`with the takeover up on ${where}: the press leaves the takeover and lands, and the restore does not undo it`, async ({ page }) => {
			test.setTimeout(90_000);
			await open(page, where === 'Welcome' ? { formants: {} } : {});
			await expandStation(page, 'Input');
			await expandStation(page, 'Voice');
			await toInsights(page);
			// The Drawer is at the top when the takeover is entered, so the stow keeps 0, and the Range sits below the fold: a restore would undo the link.
			await page.locator('.drawer-content').evaluate((el) => { el.scrollTop = 0; });
			await page.getByRole('button', { name: where === 'Welcome' ? /^record your vowels$/i : /^your vowel space$/i }).evaluate((b: HTMLElement) => b.click());
			await expect(page.locator('.takeover-back')).toBeVisible();
			await offer(page).click();
			await landed(page);
			await page.waitForTimeout(800); // the restore's animation frame has run
			await landed(page);
		});
	}

	test('from the test fry: the press leaves the takeover, lands, and releases the microphone', async ({ page }) => {
		test.setTimeout(90_000);
		await open(page, { formants: {} });
		await toInsights(page);
		const visitOpen = () => page.evaluate(() => (window as unknown as { __ilyaStubSession: { visitOpen: boolean } }).__ilyaStubSession.visitOpen);
		await expandStation(page, 'Voice');
		await page.getByRole('button', { name: /^record your vowels$/i }).click();
		await page.getByRole('button', { name: /^begin$/i }).click();
		await page.getByRole('button', { name: /^start$/i }).click();
		await expect.poll(visitOpen).toBe(true);
		await offer(page).click();
		await landed(page);
		await expect.poll(visitOpen).toBe(false);
	});
});
