/**
 * QUEUE row 138, step T1, at phone width: the card is a sheet from the foot of the screen over the Loupe, and every target is at least
 * 44 by 44 CSS pixels (the `ClefControls` pattern; Dann 2026-10-20 03:15, "it must also work for mobile").
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=phone time-signature-card
 */
import { test, expect } from '@playwright/test';

const WRONG = 'src/lib/omr/fixtures/time-signature-wrong.musicxml';

test.describe('the time signature card on a phone', () => {
	test.setTimeout(120_000);

	test('a sheet from the foot over the Loupe, every target 44 px, and one tap on Apply changes the bars', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('input.hidden-input').setInputFiles(WRONG);
		await page.getByRole('tab', { name: 'MELODY' }).tap();
		await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
		await page.waitForTimeout(4_000);
		const hit = page.locator('.score-page [data-hit="m1-0-1"]').first();
		await hit.scrollIntoViewIfNeeded();
		await hit.tap();
		await page.locator('.loupe .loupe-body').waitFor();
		await page.locator('#loupe-mode-corrections').tap();
		const open = page.locator('.loupe [data-ts-open]');
		await open.waitFor({ state: 'attached' });
		await open.tap();

		const sheet = page.locator('[data-ts-card="sheet"]');
		await expect(sheet).toBeVisible();
		const box = (await sheet.boundingBox())!;
		expect(Math.round(box.x)).toBe(0);
		expect(Math.round(box.width)).toBe(390);
		expect(Math.round(box.y + box.height)).toBe(844);
		for (const sel of ['[data-ts-common="3/4"]', '[data-ts-apply]', '[data-ts-cancel]', '[data-ts-beats]', '[data-ts-beat-type]', 'label.radio']) {
			const b = (await page.locator(sel).first().boundingBox())!;
			expect(b.height, sel).toBeGreaterThanOrEqual(43.5);
			expect(b.width, sel).toBeGreaterThanOrEqual(43.5);
		}
		await page.locator('[data-ts-common="3/4"]').tap();
		await page.locator('[data-ts-apply]').tap();
		await expect(sheet).toHaveCount(0);
		await expect(page.locator('.score-page [data-meter="3/4"]').first()).toBeAttached();
	});
});
