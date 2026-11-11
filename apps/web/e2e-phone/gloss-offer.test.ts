/**
 * Row 179, the phone-width run: do the gloss field and the offer under it stay in
 * view with the keyboard up? Run: `pnpm --filter @ilya/web exec playwright test --project=phone gloss-offer`.
 *
 * NOT A REAL KEYBOARD. Playwright has none, so the keyboard is emulated by
 * shrinking the viewport's height to what a phone leaves above one (about 40 %
 * of 844 px stays visible in portrait on iOS and Android). The report says so.
 */
import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page) {
	await page.addInitScript(() => localStorage.setItem('ilya:language', 'fr'));
	await page.goto('/');
	await page.waitForFunction(() => {
		const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
		return t && !t.disabled;
	}, undefined, { timeout: 60_000 });
}

test('the field and the offer stay in view with the keyboard up', async ({ page }) => {
	await ready(page);
	await page.getByRole('button', { name: /tiroir|drawer/i }).first().tap();
	await page.locator('textarea.text-input').fill('мрежа');
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 15_000 });
	await page.locator('.drawer-pull').tap(); // lower the drawer; a word tap raises it again
	await page.locator('.paper-container [data-word-index="0-0"]').first().tap();
	const station = page.getByRole('button', { name: /^(Analysis|Analyse)$/i });
	if ((await station.getAttribute('aria-expanded')) !== 'true') await station.tap();
	await page.locator('.dict-button').tap();
	const field = page.locator('.dict-gloss-input');
	await field.tap();
	await page.setViewportSize({ width: 390, height: 420 }); // the keyboard takes the rest
	await field.fill('filet');
	const offer = page.getByRole('button', { name: 'Utiliser pour ce mot dans vos autres chants' });
	await expect(offer).toBeVisible();
	await offer.scrollIntoViewIfNeeded();
	const view = page.viewportSize()!;
	const fb = (await field.boundingBox())!;
	const ob = (await offer.boundingBox())!;
	const dismiss = (await page.getByRole('button', { name: 'Pas maintenant' }).boundingBox())!;
	console.log(JSON.stringify({ view, field: fb, offer: ob, dismiss }));
	expect(fb.y).toBeGreaterThanOrEqual(0);
	expect(ob.y + ob.height).toBeLessThanOrEqual(view.height);
	expect(ob.x + ob.width).toBeLessThanOrEqual(view.width);
	await offer.tap();
	await expect(page.getByText('Utilisée dans vos autres chants')).toBeVisible();
});
