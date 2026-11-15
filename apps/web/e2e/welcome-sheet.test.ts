import { expect, test, type Page } from '@playwright/test';

/**
 * THE WELCOME SHEET, in a browser (lane `cloud-lane-57`, brief r2). These are the only tests that start as a FIRST visit: every other test starts as a
 * returning browser through the config's shared `storageState` (`playwright.config.ts`).
 */
test.use({ storageState: { cookies: [], origins: [] } });

/** The first load on a cold dev server compiles the page and can take longer than an assertion's default 5 s; wait for the sheet itself, generously. */
async function visit(page: Page) {
	await page.goto('/');
	await page.locator('.sheet[role="dialog"]').waitFor({ state: 'visible', timeout: 45_000 });
}

const TITLE_EN = 'Sung Russian made easier.';
const TITLE_FR = 'Le russe chanté, simplifié.';
const dialog = (page: Page) => page.getByRole('dialog', { name: /Sung Russian made easier|Le russe chanté, simplifié/ });
const flag = (page: Page) => page.evaluate(() => localStorage.getItem('ilya:welcomeSeen'));
const sheetBox = (page: Page) => page.locator('.sheet[role="dialog"]');

test.describe('a first visit', () => {
	test('shows the sheet over the app, labelled by its title, with focus inside it', async ({ page }) => {
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		await expect(page.getByRole('heading', { level: 1, name: TITLE_EN })).toBeVisible();
		await expect(sheetBox(page)).toHaveAttribute('aria-modal', 'true');
		await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('.sheet[role="dialog"]'))).toBe(true);
		// The app behind it takes nothing: inert, and the sheet is the topmost thing at the middle of the screen.
		await expect(page.locator('.app-shell')).toHaveAttribute('inert', '');
		const topIsSheet = await page.evaluate(() => !!document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('.sheet[role="dialog"]'));
		expect(topIsSheet).toBe(true);
	});

	test('has Begin on screen from the first frame, and the licence line and the made-in line beside it', async ({ page }) => {
		await visit(page);
		const begin = page.getByRole('button', { name: 'Begin' });
		await expect(begin).toBeVisible();
		const box = (await begin.boundingBox())!;
		const vp = page.viewportSize()!;
		expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
		await expect(sheetBox(page)).toContainText('Made with love in Canada, in English and French');
		await expect(sheetBox(page)).toContainText('Free and open source under the GNU Affero General Public License, version 3.');
	});

	test('Escape does nothing, and Tab never leaves the sheet', async ({ page }) => {
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(dialog(page)).toBeVisible();
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press('Tab');
			expect(await page.evaluate(() => !!document.activeElement?.closest('.sheet[role="dialog"]'))).toBe(true);
		}
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press('Shift+Tab');
			expect(await page.evaluate(() => !!document.activeElement?.closest('.sheet[role="dialog"]'))).toBe(true);
		}
	});

	test('Begin writes the flag and closes the sheet, and the app is usable again', async ({ page }) => {
		await visit(page);
		await page.getByRole('button', { name: 'Begin' }).click();
		await expect(dialog(page)).toHaveCount(0);
		expect(await flag(page)).toBe('1');
		await expect(page.locator('.app-shell')).not.toHaveAttribute('inert', /.*/);
		await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	});

	test('a returning browser never sees it', async ({ page }) => {
		await visit(page);
		await page.getByRole('button', { name: 'Begin' }).click();
		await expect(dialog(page)).toHaveCount(0);
		await page.reload();
		await expect(page.locator('.app-shell')).toBeVisible();
		await expect(dialog(page)).toHaveCount(0);
	});

	test('does not hold the dictionary back: the field enables while the sheet is up', async ({ page }) => {
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
		await expect(dialog(page)).toBeVisible();
	});

	test('never prints', async ({ page }) => {
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		await page.emulateMedia({ media: 'print' });
		await expect(page.locator('.overlay')).toBeHidden();
	});
});

test.describe('language', () => {
	test('the head-band pill is the app\'s own: it switches the app, the sheet follows, and the choice is stored as the app\'s own', async ({ page }) => {
		await visit(page);
		const pill = page.locator('.sheet .pill');
		await expect(pill).toHaveText('Français');
		await expect(pill).toHaveAttribute('lang', 'fr');
		await pill.click();
		await expect(page.getByRole('heading', { level: 1, name: TITLE_FR })).toBeVisible();
		await expect(pill).toHaveText('English');
		await expect(page.getByRole('button', { name: 'Commencer' })).toBeVisible();
		expect(await page.evaluate(() => localStorage.getItem('ilya:language'))).toBe('fr');
		await pill.click();
		await expect(page.getByRole('heading', { level: 1, name: TITLE_EN })).toBeVisible();
		expect(await page.evaluate(() => localStorage.getItem('ilya:language'))).toBe('en');
	});

	test('a French app opens a French sheet', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('ilya:language', 'fr'));
		await visit(page);
		await expect(page.getByRole('heading', { level: 1, name: TITLE_FR })).toBeVisible();
		await expect(sheetBox(page)).toContainText('BIENVENUE');
		await expect(sheetBox(page)).toContainText('Fait avec cœur au Canada, en anglais et en français');
		await expect(page.locator('.stations li')).toHaveText(['TEXTE', 'CHANT', 'APERÇUS']);
	});
});

test.describe('when storage throws', () => {
	test('the sheet shows, Begin still closes it, and nothing crashes', async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (e) => errors.push(e.message));
		await page.addInitScript(() => {
			const get = Storage.prototype.getItem;
			const set = Storage.prototype.setItem;
			Storage.prototype.getItem = function (k: string) {
				if (k === 'ilya:welcomeSeen') throw new DOMException('denied', 'SecurityError');
				return get.call(this, k);
			};
			Storage.prototype.setItem = function (k: string, v: string) {
				if (k === 'ilya:welcomeSeen') throw new DOMException('full', 'QuotaExceededError');
				return set.call(this, k, v);
			};
		});
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		await page.getByRole('button', { name: 'Begin' }).click();
		await expect(dialog(page)).toHaveCount(0);
		expect(errors).toEqual([]);
	});
});

test.describe('motion', () => {
	test('the plate turns five times, once, and every text is readable from the first frame', async ({ page }) => {
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		// The first frame: the title, the whole fallibility paragraph, and Begin are all visible and unmasked.
		await expect(page.locator('.care')).toBeVisible();
		await expect(page.locator('.care')).toContainText('confirm anything Ilya tells you with your teacher or coach before you rely on it.');
		await expect(page.getByRole('button', { name: 'Begin' })).toBeEnabled();
		const shown = () => page.locator('.plate .layer.shown').count();
		expect(await shown()).toBeLessThan(5);
		await expect.poll(shown, { timeout: 9_000, intervals: [250] }).toBe(5);
		await expect(page.locator('.stations')).toHaveClass(/done/);
		// Once: it does not start again.
		await page.waitForTimeout(1_500);
		expect(await shown()).toBe(5);
	});

	test('the station labels light in turn: TEXT, MELODY, INSIGHTS', async ({ page }) => {
		await visit(page);
		const seen = new Set<string>();
		await expect
			.poll(
				async () => {
					const on = await page.locator('.stations li.on').allTextContents();
					for (const t of on) seen.add(t);
					return ['TEXT', 'MELODY', 'INSIGHTS'].every((l) => seen.has(l));
				},
				{ timeout: 9_000, intervals: [100] }
			)
			.toBe(true);
	});

	test('prefers-reduced-motion shows the final state at once, with no motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await visit(page);
		await expect(dialog(page)).toBeVisible();
		expect(await page.locator('.plate .layer.shown').count()).toBe(5);
		await expect(page.locator('.stations')).toHaveClass(/done/);
		const transitions = await page.locator('.plate .layer.shown').first().evaluate((el) => getComputedStyle(el).transitionDuration);
		expect(transitions).toBe('0s');
	});

	test('the plate is an image named Илья, and the pictures are hidden from a screen reader', async ({ page }) => {
		await visit(page);
		await expect(page.getByRole('img', { name: 'Илья' })).toBeVisible();
		await expect(page.locator('.plate .layer[aria-hidden="true"]')).toHaveCount(6);
		await expect(page.locator('.stations')).toHaveAttribute('aria-hidden', 'true');
	});
});
