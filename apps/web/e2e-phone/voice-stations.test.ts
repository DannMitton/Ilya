/**
 * N.203 lane 61, Step 1 (phone, 390 by 844): on a phone the VOICE pane's stations are one at a time across the whole station tier, so opening
 * one shuts the other and shuts NOTATION. The ruled behaviour (brief r3, Step 1).
 *
 *     PW_CHROMIUM_PATH=... pnpm --filter @ilya/web exec playwright test --project=phone voice-stations
 */
import { test, expect, type Page } from '@playwright/test';

const NOW = '2026-11-01T10:00:00.000Z';
async function open(page: Page) {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: {} }] };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store)] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('.drawer-pull')).toBeVisible({ timeout: 45_000 });
	await page.locator('.drawer-pull').click();
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.getByRole('button', { name: /^voice$/i }).click();
}
const band = (page: Page, name: RegExp) => page.getByRole('button', { name });

test('opening one VOICE station shuts the other, and shuts NOTATION', async ({ page }) => {
	await open(page);
	// NOTATION first: open ANALYSIS (which shuts the VOICE band), then NOTATION, then back to VOICE.
	await band(page, /^analysis$/i).click();
	await band(page, /^notation$/i).click();
	await expect(band(page, /^notation$/i)).toHaveAttribute('aria-expanded', 'true');
	await band(page, /^voice$/i).click();
	const describe = band(page, /^describe your voice$/i);
	const shares = band(page, /^what insights shares, and how$/i);
	await describe.click();
	await expect(describe).toHaveAttribute('aria-expanded', 'true');
	await shares.scrollIntoViewIfNeeded();
	await shares.click();
	await expect(shares).toHaveAttribute('aria-expanded', 'true');
	await expect(describe).toHaveAttribute('aria-expanded', 'false');
	await describe.click();
	await expect(describe).toHaveAttribute('aria-expanded', 'true');
	await expect(shares).toHaveAttribute('aria-expanded', 'false');
	// Opening a VOICE station shut NOTATION: back in ANALYSIS it is closed.
	await band(page, /^analysis$/i).click();
	await expect(band(page, /^notation$/i)).toHaveAttribute('aria-expanded', 'false');
});

/* N.203 lane 61, Step 2: "Add your range" on a phone lands on the Range pickers with the Drawer lowered and with it raised. */
import path from 'path';
const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });

async function openWithScore(page: Page, formants: Record<string, unknown> = { i: R(296, 1705), e: R(381, 1532), u: R(346, 804), a: R(600, 1250) }) {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants, voiceType: 'bass' }] };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store)] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('.drawer-pull')).toBeVisible({ timeout: 45_000 });
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeAttached({ timeout: 30_000 });
	await page.locator('#tab-insights').click();
}
const offer = (page: Page) => page.getByRole('button', { name: 'Add your range' });

for (const raised of [false, true]) {
	test(`"Add your range" with the Drawer ${raised ? 'raised' : 'lowered'} lands on the Range pickers, in view`, async ({ page }) => {
		test.setTimeout(90_000);
		await openWithScore(page);
		if (raised) {
			// The Drawer was open on the VOICE pane before the singer went back to the page.
			await page.locator('.drawer-pull').click();
			await band(page, /^voice$/i).click();
			await page.locator('.drawer-pull').click();
		}
		await expect(offer(page)).toBeVisible({ timeout: 20_000 });
		await offer(page).click();
		const describe = band(page, /^describe your voice$/i);
		await expect(describe).toHaveAttribute('aria-expanded', 'true');
		const box = await page.locator('[data-describe="range"]').boundingBox();
		expect(box!.y, 'the Range pickers are inside the window').toBeGreaterThanOrEqual(0);
		expect(box!.y).toBeLessThan(844);
	});
}

test('"Add your range" with the takeover up on Welcome leaves the takeover and lands on a phone', async ({ page }) => {
	test.setTimeout(90_000);
	await openWithScore(page, {});
	await page.locator('.drawer-pull').click();
	await band(page, /^voice$/i).click();
	await page.locator('aside.drawer').getByRole('button', { name: /^record your vowels$/i }).click();
	await expect(page.locator('.takeover-back')).toBeVisible();
	await page.locator('.drawer-pull').click(); // lowered over the takeover: INSIGHTS is the page
	await expect(offer(page)).toBeVisible({ timeout: 20_000 });
	await offer(page).click();
	await expect(band(page, /^describe your voice$/i)).toHaveAttribute('aria-expanded', 'true');
	await expect(page.locator('.takeover-back')).toBeHidden();
	await page.waitForTimeout(800);
	const box = await page.locator('[data-describe="range"]').boundingBox();
	expect(box!.y).toBeGreaterThanOrEqual(0);
	expect(box!.y).toBeLessThan(800);
});
