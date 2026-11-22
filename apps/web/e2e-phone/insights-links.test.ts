/**
 * N.203 lane 61, Step 3 (phone, 390 by 844): L1, "What INSIGHTS shares, and how", lands on its station with the Drawer lowered and with it open.
 *
 *     PW_CHROMIUM_PATH=... pnpm --filter @ilya/web exec playwright test --project=phone insights-links
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'path';

const NOW = '2026-11-01T10:00:00.000Z';
const R = (f1: number, f2: number) => ({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible' });
const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
async function open(page: Page) {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants: { i: R(296, 1705), e: R(381, 1532), u: R(346, 804), a: R(600, 1250) }, voiceType: 'bass' }] };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store)] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeAttached({ timeout: 30_000 });
	await page.locator('#tab-insights').click();
}
/* The pane draws every block twice, once off screen to measure it (`SingerBlock.svelte`); the link is the copy that is on screen. */
const links = (page: Page) => page.locator('button.offer-link', { hasText: 'What INSIGHTS shares, and how' });
async function shown(page: Page) {
	await expect(links(page).first()).toBeAttached({ timeout: 20_000 });
	const all = await links(page).all();
	for (const l of all) { const b = await l.boundingBox(); if (b && b.x >= 0 && b.x < 390) return l; }
	throw new Error('no copy of the link is on screen');
}
const band = (page: Page, name: RegExp) => page.getByRole('button', { name });

for (const drawerOpen of [false, true]) {
	test(`L1 with the Drawer ${drawerOpen ? 'open on VOICE' : 'lowered'} lands on its station, in view`, async ({ page }) => {
		test.setTimeout(90_000);
		await open(page);
		if (drawerOpen) {
			await page.locator('.drawer-pull').click();
			await band(page, /^voice$/i).click();
			await page.locator('.drawer-pull').click();
		}
		const link = await shown(page);
		await link.scrollIntoViewIfNeeded();
		await link.click();
		await expect(band(page, /^what insights shares, and how$/i).first()).toHaveAttribute('aria-expanded', 'true');
		// The Drawer rises while it is measured, so read the box once it has settled.
		await expect.poll(async () => (await page.locator('[data-station="insightsShares"]').boundingBox())?.y ?? 9999, { timeout: 5000 }).toBeLessThan(800);
		expect((await page.locator('[data-station="insightsShares"]').boundingBox())!.y).toBeGreaterThanOrEqual(0);
	});
}

/* Step 4 (phone): L4 and L6 land with the Drawer lowered and with it open. */
async function openNoScore(page: Page, formants: Record<string, unknown>) {
	const store = { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants, voiceType: 'bass' }] };
	await page.addInitScript(([s]) => { localStorage.setItem('ilya:language', 'en'); localStorage.setItem('shane.profiles.v2', s); }, [JSON.stringify(store)] as const);
	await page.goto('/?capture=stub');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('#tab-insights').click();
}
/** The copy of a control on screen (the pane draws each block twice, once off screen). */
async function onScreen(page: Page, name: string) {
	const all = await page.locator('button.offer-link', { hasText: name }).all();
	for (const l of all) { const b = await l.boundingBox(); if (b && b.x >= 0 && b.x < 390) return l; }
	throw new Error(`no copy of "${name}" is on screen`);
}

for (const drawerOpen of [false, true]) {
	test(`L6 (INPUT) with the Drawer ${drawerOpen ? 'open on VOICE' : 'lowered'} opens the INPUT pane, its head in view`, async ({ page }) => {
		test.setTimeout(90_000);
		await openNoScore(page, {});
		if (drawerOpen) {
			await page.locator('.drawer-pull').click();
			await band(page, /^voice$/i).click();
			await page.locator('.drawer-pull').click();
		}
		const link = page.locator('[data-blank-state] [data-link="input"]'); // lane 78: BlankState draws it once, not twice
		await expect(link).toBeVisible({ timeout: 20_000 });
		await link.scrollIntoViewIfNeeded();
		await link.click();
		await expect(page.locator('aside.drawer').getByRole('button', { name: /^input$/i })).toHaveAttribute('aria-expanded', 'true');
		await expect.poll(async () => (await page.locator('[data-band-head="input"]').boundingBox())?.y ?? 9999, { timeout: 5000 }).toBeLessThan(800);
		expect((await page.locator('[data-band-head="input"]').boundingBox())!.y).toBeGreaterThanOrEqual(0);
	});
}

test('L4 (Record your vowels) with the Drawer lowered opens Welcome on a phone', async ({ page }) => {
	test.setTimeout(90_000);
	await openNoScore(page, {});
	await expect(page.locator('button.offer-link', { hasText: 'Record your vowels' }).first()).toBeAttached({ timeout: 20_000 });
	const link = await onScreen(page, 'Record your vowels');
	await link.scrollIntoViewIfNeeded();
	await link.click();
	await expect(page.locator('.takeover-back')).toBeVisible();
	await expect(page.getByRole('button', { name: /^begin$/i })).toBeVisible();
});
