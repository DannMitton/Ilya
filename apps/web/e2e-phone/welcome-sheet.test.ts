import { expect, test, type Page } from '@playwright/test';

/**
 * THE WELCOME SHEET AT 390 x 844 (lane `cloud-lane-57`, brief r2 item 7): the prototype's narrow layout, with Begin full width in the fixed footer and
 * never scrolled away. A first visit, so the shared returning-browser state is cleared.
 */
test.use({ storageState: { cookies: [], origins: [] } });

/** The first load on a cold dev server compiles the page and can take longer than an assertion's default 5 s; wait for the sheet itself, generously. */
async function visit(page: Page) {
	await page.goto('/');
	await page.locator('.sheet[role="dialog"]').waitFor({ state: 'visible', timeout: 45_000 });
}

test('phone: the sheet fits the screen, with a small plate, and Begin is full width in a footer that does not scroll', async ({ page }) => {
	await visit(page);
	const sheet = page.locator('.sheet[role="dialog"]');
	await expect(sheet).toBeVisible();
	const vp = page.viewportSize()!;
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

	const plate = (await page.locator('.plate').boundingBox())!;
	expect(Math.round(plate.width)).toBe(76);
	await expect(page.locator('.stations')).toBeHidden();

	const begin = page.getByRole('button', { name: 'Begin' });
	const foot = (await page.locator('.foot').boundingBox())!;
	const b0 = (await begin.boundingBox())!;
	expect(b0.y + b0.height).toBeLessThanOrEqual(vp.height);
	// Full width: the footer's 20 px padding either side.
	expect(Math.round(b0.width)).toBe(Math.round(foot.width - 40));

	// Scroll the body to the bottom: Begin has not moved.
	await page.locator('.sheet .body').evaluate((el) => (el.scrollTop = el.scrollHeight));
	const b1 = (await begin.boundingBox())!;
	expect(Math.round(b1.y)).toBe(Math.round(b0.y));
});

test('phone: the made-in line and the licence line show once, inside the body', async ({ page }) => {
	await visit(page);
	await expect(page.locator('.sheet .fines.m')).toBeVisible();
	await expect(page.locator('.foot .fines')).toBeHidden();
	await expect(page.locator('.sheet .fines.m')).toContainText('Free and open source under the GNU Affero General Public License');
});

test('phone: Begin closes the sheet and writes the flag; the pill switches to French', async ({ page }) => {
	await visit(page);
	await page.locator('.sheet .pill').click();
	await expect(page.getByRole('button', { name: 'Commencer' })).toBeVisible();
	await page.getByRole('button', { name: 'Commencer' }).click();
	await expect(page.locator('.sheet[role="dialog"]')).toHaveCount(0);
	expect(await page.evaluate(() => localStorage.getItem('ilya:welcomeSeen'))).toBe('1');
});
