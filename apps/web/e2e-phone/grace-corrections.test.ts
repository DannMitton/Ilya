/**
 * N.187 step 6 at 390 px: a tap on a grace note selects it, and a tap on its principal selects the principal
 * (`grace-notes.musicxml`, bar 7: a grace note between C5 and D5, mid-system (the first note of a system sits under the clef's own hit area)). The two never share a hit rectangle.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=phone grace-corrections
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = '../../packages/score-parser/src/fixtures/grace-notes.musicxml';

async function raise(page: Page) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
}

test('a tap on the grace note selects it; a tap on its principal selects the principal', async ({ page }) => {
	test.setTimeout(120_000);
	await raise(page);
	const tapAt = async (id: string) => {
		const box = await page.locator(`.score-page [data-hit="${id}"]`).first().boundingBox();
		await page.locator(`.score-page [data-hit="${id}"]`).first().scrollIntoViewIfNeeded();
		const b = (await page.locator(`.score-page [data-hit="${id}"]`).first().boundingBox())!;
		await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
		void box;
	};
	await tapAt('m6-1-4~g1');
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await expect(page.locator('.loupe [data-grace-cell]')).toHaveAttribute('data-grace-cell', 'grace');
	await page.locator('.loupe .loupe-header').getByRole('button', { name: /close|fermer/i }).first().click().catch(() => undefined);
	await page.keyboard.press('Escape');
	await tapAt('m6-1-4');
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await expect(page.locator('.loupe [data-grace-cell]')).toHaveAttribute('data-grace-cell', 'note');
});
