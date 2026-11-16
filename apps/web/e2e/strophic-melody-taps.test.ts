/**
 * Strophic lane A follow-up, fix 4: a second ending (printed only as a later pass) has live handles, and a tap on a later-pass copy picks
 * its source bar.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium strophic-melody-taps
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const VOLTA = path.resolve(process.cwd(), '../../packages/score-parser/src/fixtures/strophic-volta.musicxml');

async function raise(page: Page, file: string) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(file);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
}

test.describe('taps in a strophic song', () => {
	test.setTimeout(180_000);
	test('fix 4: the second ending has live handles, and a tap on a later-pass copy picks its source bar', async ({ page }) => {
		await raise(page, VOLTA);
		// source bar index 4 (printed 5) is the second ending: printed only in pass 2, so it must be live
		expect(await page.locator('.score-page [data-hit="m4-0-1"]').count(), 'the second ending has a live copy').toBe(1);
		await page.locator('.score-page [data-hit="m4-0-1"]').first().scrollIntoViewIfNeeded();
		await page.locator('.score-page [data-hit="m4-0-1"]').first().click();
		await page.locator('.loupe .loupe-body').waitFor();
		expect(await page.locator('.loupe').innerText()).toMatch(/m\.\s*5\b/);
		await page.keyboard.press('Escape');
		await expect(page.locator('.loupe .loupe-body')).toBeHidden();
		// a later-pass copy of a bar that also has a live copy: its tap picks the source bar (printed 1), not nothing
		const later = page.locator('.score-page [data-verse-hit="m0-0-1~v2"]').first();
		await later.scrollIntoViewIfNeeded();
		await later.click();
		await page.locator('.loupe .loupe-body').waitFor();
		expect(await page.locator('.loupe').innerText()).toMatch(/m\.\s*1\b/);
	});

	test('a tap on a later-pass grace note names its source grace note', async ({ page }) => {
		await raise(page, path.resolve(process.cwd(), '../../packages/score-parser/src/fixtures/strophic-repeat-grace.musicxml'));
		// the grace note of source bar 4's first note: id m4-0-1~g1 on pass 1, m4-0-1~v2~g1 on pass 2
		const later = page.locator('.score-page [data-verse-hit="m4-0-1~v2~g1"]').first();
		expect(await later.count(), 'the later pass carries a grace note').toBe(1);
		await later.scrollIntoViewIfNeeded();
		await later.click();
		await page.locator('.loupe .loupe-body').waitFor({ timeout: 10_000 });
		expect(await page.locator('.loupe').innerText()).toMatch(/m\.\s*5\b/);
	});
});
