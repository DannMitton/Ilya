import { test, expect } from '@playwright/test';
import { expandStation, transcribe, waitForDictionary } from './helpers';

/**
 * Row 106, the Inspector's two `openSyllabify` call sites (the header IPA and the
 * Ribbon), which no unit test reaches. With the open-syllables switch on (its
 * default in the brief; measured here, it starts OFF and the test turns it on), a hyphen the singer typed stays a syllable break and an untyped word
 * opens as before.
 */
test.describe('row 106: a typed hyphen under the open-syllables switch, in the Inspector', () => {
	async function inspect(page: import('@playwright/test').Page, text: string) {
		await page.goto('/');
		await waitForDictionary(page);
		await transcribe(page, text);
		await expandStation(page, 'Notation');
		const open = page.locator('button[role="switch"]').last();
		if ((await open.getAttribute('aria-checked')) !== 'true') await open.click();
		await expect(open).toHaveAttribute('aria-checked', 'true');
		await page.locator('[data-word-index="0-0"]').click();
		await expandStation(page, 'Analysis');
		const ipa = (await page.locator('.word-ipa').first().innerText()).trim();
		const groups = await page.locator('.ribbon-body [role="group"][aria-label^="Syllable"]').count();
		return { ipa, groups };
	}

	test('«прог-ляд-на-я» keeps its typed break; «проглядная» opens', async ({ page }) => {
		const typed = await inspect(page, 'прог-ляд-на-я');
		expect(typed.ipa).toBe('proɡ lʲɑd nɑ jɑ');
		expect(typed.groups).toBe(4);
		const untyped = await inspect(page, 'проглядная');
		expect(untyped.ipa).toBe('pro ɡlʲɑ dnɑ jɑ');
		expect(untyped.groups).toBe(4);
	});
});
