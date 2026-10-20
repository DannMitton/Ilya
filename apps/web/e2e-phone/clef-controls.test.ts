/**
 * ROW 144, at phone width: the chip, then the clef button, and the choices as a sheet from the
 * foot of the screen. The hit area stays at least 44 by 44 CSS px after the page's scale (the
 * 816 px page draws at about 0.48 here).
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome pnpm --filter @ilya/web exec playwright test --project=phone clef-controls
 *
 * Set CLEF_SHOTS=1 to write the pictures to docs/sessions/batch-a-shots/ (from the repository root).
 */
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const SHOTS = process.env.CLEF_SHOTS ? '../../docs/sessions/batch-a-shots' : null;
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const F1: Record<string, number> = { i: 280, e: 400, 'ɪ': 360, 'ɨ': 320, 'ɛ': 500, a: 700, 'ɑ': 680, 'ʌ': 560, o: 450, u: 300 };
const formants = Object.fromEntries(Object.entries(F1).map(([v, f1]) => [v, { f1, confidence: 'high', reading: 'captured', source: 'measured-user' }]));
const STORE = JSON.stringify({
	version: 2,
	activeId: 'row144-test-voice',
	voices: [{
		id: 'row144-test-voice', name: 'Test voice', createdAt: '2026-10-20T00:00:00.000Z', updatedAt: '2026-10-20T00:00:00.000Z',
		formants,
		characteristics: { source: 'manual', rangeLow: P('E', 2), rangeHigh: P('E', 4) },
	}],
});
const FILE = 'src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml';

async function load(page: Page, lang: 'en' | 'fr' = 'en') {
	await page.addInitScript((s) => {
		if (!sessionStorage.getItem('row144-seeded')) { localStorage.setItem('shane.profiles.v2', s); sessionStorage.setItem('row144-seeded', '1'); }
	}, STORE);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await page.waitForFunction(() => {
		const t = document.querySelector<HTMLTextAreaElement>('textarea.text-input');
		return t && !t.disabled;
	}, undefined, { timeout: 60_000 });
	if (lang === 'fr') await page.locator('.lang-pill').tap();
	await page.locator('input.hidden-input').setInputFiles(FILE);
	await page.getByRole('tab', { name: lang === 'fr' ? 'Annotation' : 'Markup' }).tap();
	await page.locator('.score-page [data-clef]').first().waitFor({ state: 'attached', timeout: 30_000 });
	await page.waitForTimeout(1000);
}

async function shot(page: Page, name: string) {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.waitForTimeout(400);
	await page.screenshot({ path: `${SHOTS}/${name}.png`, animations: 'disabled', caret: 'hide' });
}

test.describe('the clef choice on a phone (row 144)', () => {
	test.setTimeout(240_000);

	for (const lang of ['en', 'fr'] as const) {
		test(`chip, then a 44 px clef button, then a sheet from the foot (${lang})`, async ({ page }) => {
			await load(page, lang);
			const chip = page.locator('[data-clef-chip]');
			await expect(chip).toBeVisible();
			await shot(page, `row144-chip-${lang}-390`);
			const first = (await chip.locator('[data-clef-choice]').first().boundingBox())!;
			expect(first.height).toBeGreaterThanOrEqual(44);
			await chip.locator('[data-clef-choice="bass"]').tap();
			await expect(chip).toHaveCount(0);

			// The hit area is at least 44 by 44 CSS px after the page's scale.
			const hit = page.locator('[data-clef-hit]').first();
			const box = (await hit.boundingBox())!;
			expect(box.width).toBeGreaterThanOrEqual(44);
			expect(box.height).toBeGreaterThanOrEqual(44);
			const scale = await page.evaluate(() => {
				const page1 = document.querySelector('.markup-paper-container .score-page')!.getBoundingClientRect();
				return page1.width / 816;
			});
			expect(scale).toBeLessThan(0.7);

			await hit.tap();
			const sheet = page.locator('[data-clef-menu="sheet"]');
			await expect(sheet).toBeVisible();
			const s = (await sheet.boundingBox())!;
			const vp = page.viewportSize()!;
			expect(Math.abs(s.y + s.height - vp.height)).toBeLessThan(2);
			for (const b of await sheet.locator('[data-clef-choice]').all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
			await shot(page, `row144-sheet-${lang}-390`);
			await page.keyboard.press('Escape');
			await expect(sheet).toHaveCount(0);
		});
	}
});
