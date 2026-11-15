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

	// QUEUE row 163 step 3 (Dann 2026-10-30 14:27): leaving the field tidies every typed `#` to «<unit> #» at the end of its unit, so «я #на» becomes
	// «я #» with a no-break space, and the next word follows after an ordinary space. (This pinned «я #на» left as typed, the rule of 2026-10-29,
	// until the 2026-10-30 ruling widened it.)
	test('tidies «я #на дом» to «я #» (no-break space) and the next word on leaving the field', async ({ page }) => {
		const field = page.locator('textarea.text-input');
		await field.click();
		await page.keyboard.type('я #на дом');
		await field.blur();
		await expect(field).toHaveValue(`я${NB}# на дом`);
	});

	// The tidy goes up as a whole arrival (`oninput(tidy, 'paste')`, `IntakeViews.svelte`'s `onBlur`), a value set from code, which is not in the
	// textarea's own undo history (its comment says so). So the undo key does not restore the plain space: the tidy value stays. (This pinned
	// the opposite, "as seen" in Chromium 153 on 2026-10-29, before row 163 step 3 changed how the value is set.)
	test('the tidy value stays after the blur, and the undo key does not restore the plain space', async ({ page }) => {
		const field = page.locator('textarea.text-input');
		await field.click();
		await page.keyboard.type('я иду домой #');
		await field.blur();
		await expect(field).toHaveValue(`я иду домой${NB}#`);
		await field.focus();
		await page.keyboard.press('ControlOrMeta+z');
		const after = await field.inputValue();
		expect(after).toBe(`я иду домой${NB}#`);
	});
});
