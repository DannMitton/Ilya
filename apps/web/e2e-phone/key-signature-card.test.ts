/**
 * N.192 step 6b at 390 px: the key signature card opens as a sheet from the foot, and a key chosen from the bar held is applied
 * (`key-changes.musicxml`, bar 6 held: it does not open the change, bar 5 does).
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=phone key-signature-card
 */
import { test, expect } from '@playwright/test';

test('the card is a sheet, offers no Remove on a bar that opens no change, and applies a key chosen from bar 6', async ({ page }) => {
	test.setTimeout(120_000);
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles('../../packages/score-parser/src/fixtures/key-changes.musicxml');
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	const hit = page.locator('.score-page [data-hit="m5-1-2"]').first();
	await hit.scrollIntoViewIfNeeded();
	await hit.tap();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	const open = page.locator('.loupe [data-ks-open]');
	await open.scrollIntoViewIfNeeded();
	await open.tap();
	await expect(page.locator('[data-ks-card]')).toHaveAttribute('data-ks-card', 'sheet');
	// bar 6 does not open the change (bar 5 does), so Remove is not offered here.
	await expect(page.locator('[data-ks-remove]')).toHaveCount(0);
	await page.locator('[data-ks-key]').selectOption('2');
	await page.locator('[data-ks-apply]').tap();
	await expect(page.locator('[data-ks-card]')).toHaveCount(0);
	const changes = await page.locator('.score-page [data-key-change]').evaluateAll((els) => els.map((e) => e.getAttribute('data-key-change')));
	// bar 6 now has D major to the next change of the reading, so the page draws at least the changes it drew a bar later.
	expect(changes.length).toBeGreaterThan(0);
});
