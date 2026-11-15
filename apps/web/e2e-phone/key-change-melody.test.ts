/**
 * N.192 step 3: a key that changes inside the song is drawn in MELODY as printed, at phone width, and the Loupe's head shows
 * the key in force in the bar held at 390 px (`key-changes.musicxml`: D major, F major from bar 5, D major from bar 9).
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=phone key-change-melody
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = '../../packages/score-parser/src/fixtures/key-changes.musicxml';

async function raise(page: Page) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
}
async function hold(page: Page, id: string) {
	const hit = page.locator(`.score-page [data-hit="${id}"]`).first();
	await hit.scrollIntoViewIfNeeded();
	await hit.tap();
	await page.locator('.loupe .loupe-body').waitFor();
}
const headKeys = (page: Page) => page.locator('.loupe [data-key-signature]').count();

test.describe('key changes in MELODY', () => {
	test.setTimeout(120_000);

	test('the page draws each change once, and the Loupe head shows the key in force in the held bar', async ({ page }) => {
		await raise(page);
		const changes = page.locator('.score-page [data-key-change]');
		expect(await changes.evaluateAll((els) => els.map((e) => e.getAttribute('data-key-change')))).toEqual(['2>-1', '-1>2', '2>3']);
		// no mid-system group is stamped as a head: the page has three heads (3 systems) of 2, 1 and 2 sharps or flats.
		expect(await page.locator('.score-page [data-key-signature]').count()).toBe(5);

		await hold(page, 'm1-0-1'); // bar 2, D major
		const two = await headKeys(page); // the head and the body's clip each carry the signature
		expect(two).toBeGreaterThan(0);
		const boundTwo = await page.locator('.loupe [data-clef]').first().evaluate((e) => (e as SVGGraphicsElement).getBBox().x);
		await page.keyboard.press('Escape');

		await hold(page, 'm5-0-1'); // bar 6, F major
		expect(await headKeys(page) * 2).toBe(two); // one flat against two sharps
		expect(await page.locator('.loupe [data-key-change]').count()).toBe(0);
		const boundSix = await page.locator('.loupe [data-clef]').first().evaluate((e) => (e as SVGGraphicsElement).getBBox().x);
		expect(boundSix).toBeCloseTo(boundTwo, 1);
	});
});
