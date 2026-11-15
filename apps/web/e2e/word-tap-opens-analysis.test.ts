/**
 * N.201 step 2 (desktop, 1440 px): a word tap opens ANALYSIS, shuts nothing, and
 * marks the word on the page, on screen only.
 *
 * The expectations are the brief's (`brief-code-n201-drawer-order_r2`, steps
 * 2.2 to 2.4 and amendments A8, A11), not read back out of the code.
 */
import { test, expect } from '@playwright/test';
import { waitForDictionary } from './helpers';

const POEM = 'Средь шумного бала\nслучайно блорфа тайна';
const word = (page: import('@playwright/test').Page, at: string) => page.locator(`.paper-container [data-word-index="${at}"]`);
const band = (page: import('@playwright/test').Page, name: string) => page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') });

test.describe('a word tap, desktop', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
		await page.locator('textarea.text-input').fill(POEM);
		await word(page, '1-1').waitFor();
	});

	test('opens ANALYSIS, leaves INPUT open, and leaves ANALYSIS open on a second tap', async ({ page }) => {
		await expect(band(page, 'Analysis')).toHaveAttribute('aria-expanded', 'false');
		await word(page, '0-1').click();
		await expect(band(page, 'Analysis')).toHaveAttribute('aria-expanded', 'true');
		await expect(band(page, 'Input')).toHaveAttribute('aria-expanded', 'true');
		await word(page, '1-1').click();
		await expect(band(page, 'Analysis')).toHaveAttribute('aria-expanded', 'true');
	});

	test('marks the tapped word alone, and the mark does not print', async ({ page }) => {
		await expect(page.locator('.paper-container .word-stack.selected')).toHaveCount(0);
		await word(page, '0-1').click();
		await expect(page.locator('.paper-container .word-stack.selected')).toHaveCount(1);
		await expect(word(page, '0-1')).toHaveClass(/selected/);
		await page.mouse.move(2, 2);
		const screen = await word(page, '0-1').evaluate((el) => getComputedStyle(el).outlineStyle);
		expect(screen).toBe('solid');
		await page.emulateMedia({ media: 'print' });
		const printed = await word(page, '0-1').evaluate((el) => getComputedStyle(el).outlineStyle);
		expect(printed).toBe('none');
		await page.emulateMedia({ media: 'screen' });
	});

	test('keeps the dashed VERIFY box beside the mark', async ({ page }) => {
		await word(page, '1-1').click();
		await expect(word(page, '1-1')).toHaveClass(/is-inferred/);
		await expect(word(page, '1-1')).toHaveClass(/selected/);
		const before = await word(page, '1-1').evaluate((el) => getComputedStyle(el, '::before').display);
		expect(before).toBe('block');
	});
});
