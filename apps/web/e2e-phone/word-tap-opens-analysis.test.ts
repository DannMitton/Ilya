/**
 * N.201 step 2 (phone, 390 by 844): a word tap raises the Drawer, opens ANALYSIS
 * under the one-band rule so INPUT folds to its state line, scrolls the Drawer to
 * its top, and a second tap leaves ANALYSIS open.
 *
 *     PW_CHROMIUM_PATH=... pnpm --filter @ilya/web exec playwright test --project=phone word-tap
 */
import { test, expect } from '@playwright/test';

const POEM = 'Средь шумного бала\nслучайно блорфа тайна';

test('a word tap opens ANALYSIS in view and folds INPUT on a phone', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.drawer-pull')).toBeVisible({ timeout: 45_000 });
	await page.locator('.drawer-pull').click();
	const ta = page.locator('textarea.text-input');
	await expect(ta).toBeEnabled({ timeout: 45_000 });
	await ta.fill(POEM);
	await page.locator('.paper-container [data-word-index="1-1"]').waitFor({ state: 'attached' });
	await page.locator('.drawer-pull').click();
	const band = (name: string) => page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') });
	await page.locator('.paper-container [data-word-index="0-1"]').click();
	await expect(band('Analysis')).toHaveAttribute('aria-expanded', 'true');
	await expect(band('Input')).toHaveAttribute('aria-expanded', 'false');
	expect(await page.locator('.drawer-content').evaluate((el) => el.scrollTop)).toBe(0);
	// The head of ANALYSIS is inside the window the singer sees.
	const box = await page.locator('[data-band-head="analysis"]').boundingBox();
	expect(box!.y).toBeGreaterThanOrEqual(0);
	expect(box!.y + box!.height).toBeLessThanOrEqual(844);
	await page.locator('.drawer-pull').click();
	await page.locator('.paper-container [data-word-index="1-1"]').click();
	await expect(band('Analysis')).toHaveAttribute('aria-expanded', 'true');
});
