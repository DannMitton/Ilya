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
