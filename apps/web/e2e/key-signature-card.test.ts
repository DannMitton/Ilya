/**
 * N.192 step 6b: the key signature card in the Loupe's CORRECTIONS pane (`key-changes.musicxml`: D major, F major from bar 5, D major from bar 9, A major
 * from bar 11). A key change can be corrected from any bar, to the next change or the end, with the notes following or keeping their pitches, and removed.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm --filter @ilya/web exec playwright test --project=chromium key-signature-card
 */
import { test, expect, type Page } from '@playwright/test';

const FIXTURE = '../../packages/score-parser/src/fixtures/key-changes.musicxml';

async function raise(page: Page, id: string) {
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'MELODY' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(3_000);
	const hit = page.locator(`.score-page [data-hit="${id}"]`).first();
	await hit.scrollIntoViewIfNeeded();
	await hit.click();
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-ks-open]').waitFor({ state: 'attached' });
}
const changes = (page: Page) => page.locator('.score-page [data-key-change]').evaluateAll((els) => els.map((e) => e.getAttribute('data-key-change')));
const undo = (page: Page) => page.locator('.loupe-header').getByRole('button', { name: /^Undo/ });

test.describe('the key signature card', () => {
	test.setTimeout(180_000);

	test('opens from bar 5, lists the fifteen signatures, and offers Remove on a bar that opens a change', async ({ page }) => {
		await raise(page, 'm4-0-1');
		const open = page.locator('.loupe [data-ks-open]');
		await expect(open).toHaveText('Key signature');
		await expect(open).toHaveAccessibleName('Change the key from this bar');
		await open.click();
		const card = page.locator('[data-ks-card]');
		await expect(card).toBeVisible();
		await expect(card.locator('select[data-ks-key] option')).toHaveCount(15);
		await expect(page.locator('[data-ks-key]')).toHaveValue('-1');
		await expect(page.locator('[data-ks-through="next"]')).toBeChecked();
		await expect(page.locator('[data-ks-follow]')).toBeChecked();
		await expect(page.locator('[data-ks-remove]')).toBeVisible();
		await page.locator('[data-ks-cancel]').click();
		await expect(card).toHaveCount(0);
		expect(await changes(page)).toEqual(['2>-1', '-1>2', '2>3']);
	});

	test('Remove this key change: bars 5 to 8 take the key before, the notes follow, one Undo step puts it all back', async ({ page }) => {
		await raise(page, 'm4-0-1');
		await page.locator('.loupe [data-ks-open]').click();
		await page.locator('[data-ks-remove]').click();
		await expect(page.locator('[data-ks-card]')).toHaveCount(0);
		await expect.poll(() => changes(page)).toEqual(['2>3']);
		await expect(undo(page)).toHaveAccessibleName(/key change removed/);
		await undo(page).click();
		await expect.poll(() => changes(page)).toEqual(['2>-1', '-1>2', '2>3']);
	});

	test('a key chosen to the end of the song, keeping the pitches, is one Undo step', async ({ page }) => {
		await raise(page, 'm4-0-1');
		await page.locator('.loupe [data-ks-open]').click();
		await page.locator('[data-ks-key]').selectOption('0');
		await page.locator('[data-ks-through="end"]').check();
		await page.locator('[data-ks-follow]').uncheck();
		await page.locator('[data-ks-apply]').click();
		await expect.poll(() => changes(page)).toEqual(['2>0']);
		await expect(undo(page)).toHaveAccessibleName(/key changed/);
		await undo(page).click();
		await expect.poll(() => changes(page)).toEqual(['2>-1', '-1>2', '2>3']);
	});

	test('Escape closes the card and changes nothing', async ({ page }) => {
		await raise(page, 'm4-0-1');
		await page.locator('.loupe [data-ks-open]').click();
		await page.keyboard.press('Escape');
		await expect(page.locator('[data-ks-card]')).toHaveCount(0);
		expect(await changes(page)).toEqual(['2>-1', '-1>2', '2>3']);
	});
});
