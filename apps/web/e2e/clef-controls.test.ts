/**
 * ROW 144 (Dann 2026-10-20 03:15): the clef choice speaks once on the Paper, then lives
 * in the clef. The chip on page 1 the first time a song is drawn, the clef button
 * afterwards, the menu beside the clef, and nothing of it in print.
 *
 * Tchaikovsky op. 38 no. 3 (printed treble) with a seeded bass range reads an octave lower.
 *
 *     PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome pnpm --filter @ilya/web exec playwright test --project=chromium clef-controls
 *
 * Set CLEF_SHOTS=1 to write the pictures to docs/sessions/batch-a-shots/ (from the repository root).
 */
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { waitForDictionary } from './helpers';

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

const SENTENCE = { en: 'Voice line read an octave lower, for your range', fr: 'Ligne vocale lue une octave plus bas, pour votre ambitus' };
const AS_WRITTEN = { en: 'As written', fr: 'Telle qu’écrite' };

async function load(page: Page, lang: 'en' | 'fr' = 'en') {
	await page.addInitScript((s) => {
		if (!sessionStorage.getItem('row144-seeded')) { localStorage.setItem('shane.profiles.v2', s); sessionStorage.setItem('row144-seeded', '1'); }
	}, STORE);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await waitForDictionary(page);
	if (lang === 'fr') {
		await page.locator('.lang-pill').click();
		await expect(page.locator('.lang-pill')).toHaveAttribute('lang', 'en');
	}
	await page.locator('input.hidden-input').setInputFiles(FILE);
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 30_000 });
	await page.getByRole('tab', { name: lang === 'fr' ? 'Annotation' : 'Markup' }).click();
	await page.locator('.score-page [data-clef]').first().waitFor({ state: 'attached', timeout: 30_000 });
}

async function shot(page: Page, name: string) {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.addStyleTag({ content: '*::-webkit-scrollbar{display:none!important} *{scrollbar-width:none!important}' });
	await page.waitForTimeout(400);
	await page.screenshot({ path: `${SHOTS}/${name}.png`, animations: 'disabled', caret: 'hide' });
}

test.describe('the clef choice on the Paper (row 144)', () => {
	test.setTimeout(240_000);

	test('the chip speaks once, the clef button brings the choices back, Escape closes, and nothing prints', async ({ page }) => {
		await load(page);
		const chip = page.locator('[data-clef-chip]');
		await expect(chip).toBeVisible();
		await expect(chip).toContainText(SENTENCE.en);
		await shot(page, 'row144-chip-en-1440');
		// The reading is treble with an 8 below, which is the choice in force.
		await expect(page.locator('.score-page [data-clef]').first()).toHaveAttribute('data-clef', 'treble-8vb');
		await expect(chip.locator('[data-clef-choice="ottava"]')).toHaveAttribute('aria-pressed', 'true');

		// Choosing recedes it, and the clef changes.
		await chip.locator('[data-clef-choice="bass"]').click();
		await expect(chip).toHaveCount(0);
		await expect(page.locator('.score-page [data-clef]').first()).toHaveAttribute('data-clef', 'bass');

		// It does not return: another tab and back is the same song, shown once.
		await page.getByRole('tab', { name: 'Insights' }).click();
		await page.getByRole('tab', { name: 'Markup' }).click();
		await page.locator('.score-page [data-clef]').first().waitFor({ state: 'attached' });
		await page.waitForTimeout(800);
		await expect(chip).toHaveCount(0);

		// The clef is a button with a name from "Clef" and the choice; it opens a menu beside the clef.
		const hit = page.locator('[data-clef-hit]').first();
		await expect(hit).toHaveAttribute('aria-label', 'Clef: Bass');
		await hit.click();
		const menu = page.locator('[data-clef-menu="menu"]');
		await expect(menu).toBeVisible();
		await shot(page, 'row144-menu-en-1440');
		await expect(menu.locator('[data-clef-choice]')).toHaveText(['Read for your range', 'Treble, sounding an octave lower', 'Bass', 'As written']);
		await page.keyboard.press('Escape');
		await expect(menu).toHaveCount(0);

		// Arrows move through the choices, Enter picks one.
		await hit.focus();
		await page.keyboard.press('Enter');
		await expect(menu).toBeVisible();
		// The menu opens on the choice in force (Bass); one arrow down is "As written".
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await expect(menu).toHaveCount(0);
		await expect(page.locator('.score-page [data-clef]').first()).toHaveAttribute('data-clef', 'treble');

		// Nothing of the overlay is on the printed page.
		await page.emulateMedia({ media: 'print' });
		await expect(page.locator('[data-clef-overlay]')).toBeHidden();
	});

	test('the Input band row, the chip and the menu are one choice (French strings)', async ({ page }) => {
		await load(page, 'fr');
		const chip = page.locator('[data-clef-chip]');
		await expect(chip).toContainText(SENTENCE.fr);
		await shot(page, 'row144-chip-fr-1440');
		await chip.locator('[data-clef-choice="as-written"]').click();
		await expect(chip).toHaveCount(0);
		await expect(page.locator('.score-page [data-clef]').first()).toHaveAttribute('data-clef', 'treble');
		await page.locator('[data-clef-hit]').first().click();
		await expect(page.locator('[data-clef-menu="menu"] [data-clef-choice="as-written"]')).toHaveText(AS_WRITTEN.fr);
		await shot(page, 'row144-menu-fr-1440');
	});
});
