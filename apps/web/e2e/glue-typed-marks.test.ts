import { test, expect } from '@playwright/test';
import { waitForDictionary } from './helpers';

/*
 * N.135 stage 2b r5, step 9 (Dann 2026-10-29 01:48): leaving the Lyrics field glues a `#` typed after a word
 * with an ordinary space («я #» to «я #»). The field's own `onblur` (IntakeViews.svelte) does it and
 * sends the text up as a whole arrival. Nothing changes while typing.
 */
test.use({ viewport: { width: 1440, height: 900 } });

const NB = ' ';

test.describe('a typed # takes the no-break form when the singer leaves Lyrics', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await waitForDictionary(page);
		await page.locator('#intake-tab-lyrics').click();
	});

	test('leaving the field glues it, and typing does not', async ({ page }) => {
		const field = page.locator('textarea.text-input');
		await field.click();
		await page.keyboard.type('я иду домой #');
		await expect(field).toHaveValue('я иду домой #');
		await field.blur();
		await expect(field).toHaveValue(`я иду домой${NB}#`);
	});

	test('leaves «я #на» as typed, so two words are not fused', async ({ page }) => {
		const field = page.locator('textarea.text-input');
		await field.click();
		await page.keyboard.type('я #на дом');
		await field.blur();
		await expect(field).toHaveValue('я #на дом');
	});

	// Seen in Chromium 153 (headless, Linux), 2026-10-29: Control+Z after the blur puts the field back to «я иду домой #» with the
	// ordinary space. Not seen in Firefox or Safari, nor with Cmd-Z on a Mac. Pinned as seen, for Chromium only.
	test('Control+Z after the blur returns the field to the ordinary space (Chromium, as seen)', async ({ page }) => {
		const field = page.locator('textarea.text-input');
		await field.click();
		await page.keyboard.type('я иду домой #');
		await field.blur();
		await expect(field).toHaveValue(`я иду домой${NB}#`);
		await field.focus();
		await page.keyboard.press('Control+z');
		const after = await field.inputValue();
		expect(after).toBe('я иду домой #');
	});
});
