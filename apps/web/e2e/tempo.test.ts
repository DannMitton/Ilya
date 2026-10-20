/**
 * QUEUE ROW 48, 2026-10-15: every song gets a tempo, estimated when none is
 * printed, and the singer can change it.
 *
 * The song: Tchaikovsky op. 38 no. 3 (3/8, 99 measures, no `<words>` and no
 * `<per-minute>`). It is the case a scan produces, since homr's MusicXML
 * carries no tempo, so no reader run is needed. Sunless no. 1 prints
 * *Andante tranquillo* and must keep its own sentence.
 *
 * The voice is a desk-built test voice seeded into `shane.profiles.v2`, as
 * `docs/sessions/n174-c2/voiced.test.ts` seeds its own. Set TEMPO_SHOTS=1 to
 * write the screenshots to docs/sessions/tempo-shots/ (from the repository root).
 */
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { waitForDictionary } from './helpers';

const SHOTS = process.env.TEMPO_SHOTS ? '../../docs/sessions/tempo-shots' : null;
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const F1: Record<string, number> = { i: 280, e: 400, 'ɪ': 360, 'ɨ': 320, 'ɛ': 500, a: 700, 'ɑ': 680, 'ʌ': 560, o: 450, u: 300 };
const formants = Object.fromEntries(Object.entries(F1).map(([v, f1]) => [v, { f1, confidence: 'high', reading: 'captured', source: 'measured-user' }]));
const STORE = JSON.stringify({
	version: 2,
	activeId: 'row48-test-voice',
	voices: [{
		id: 'row48-test-voice', name: 'Test voice', createdAt: '2026-10-15T00:00:00.000Z', updatedAt: '2026-10-15T00:00:00.000Z',
		formants,
		characteristics: { source: 'manual', rangeLow: P('E', 2), rangeHigh: P('E', 5), tessituraLow: P('G', 2), tessituraHigh: P('D', 4), passaggioPrimary: P('G', 3), passaggioSecondary: P('B', 3) },
	}],
});

const TCHAIKOVSKY = 'src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml';
const SUNLESS = 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml';

async function load(page: Page, file: string, lang: 'en' | 'fr' = 'en') {
	await page.addInitScript((s) => {
		if (!sessionStorage.getItem('row48-seeded')) { localStorage.setItem('shane.profiles.v2', s); sessionStorage.setItem('row48-seeded', '1'); }
	}, STORE);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await waitForDictionary(page);
	if (lang === 'fr') {
		await page.locator('.lang-pill').click();
		await expect(page.locator('.lang-pill')).toHaveAttribute('lang', 'en');
	}
	await page.locator('input.hidden-input').setInputFiles(file);
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 30_000 });
}

async function insights(page: Page) {
	await page.locator('.desk-head').getByRole('tab').nth(2).click();
	await page.waitForTimeout(3500);
}

/** The visible phonation sentence: Insights draws every block twice (once to measure). */
const sentence = (page: Page) => page.locator('p.prose:visible', { has: page.locator('.tempo-link') }).first();

/** The visible contact-count sentence (the cycles block), the measuring copy aside. */
const cycles = (page: Page) => page.locator('p:visible', { hasText: 'Your vocal folds contact about' }).first();

async function shot(page: Page, name: string) {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.addStyleTag({ content: '*::-webkit-scrollbar{display:none!important} *{scrollbar-width:none!important}' });
	await page.waitForTimeout(400);
	await page.screenshot({ path: `${SHOTS}/${name}.png`, animations: 'disabled', caret: 'hide' });
}

test.describe('Tchaikovsky op. 38 no. 3, no printed tempo', () => {
	test.setTimeout(240_000);

	test('the estimate, the receipt, the control, the singer\'s tempo, and the way back', async ({ page }) => {
		await load(page, TCHAIKOVSKY);
		const receipt = page.locator('.receipt-tempo');
		await expect(receipt).toBeVisible();
		await expect(receipt).toContainText('TEMPO');
		await expect(receipt).toContainText('60–72');
		await expect(receipt).toContainText('estimated');
		await expect(receipt.locator('[data-sigil="estimated"]')).toHaveText('≈');
		await expect(receipt.locator('[data-sigil="estimated"]')).toHaveAttribute('title', 'tempo estimated by Ilya');
		await shot(page, 'tchaikovsky-text-en-desk-estimated-receipt');

		await insights(page);
		const s = sentence(page);
		await expect(s).toContainText("Ilya estimates");
		await expect(s).toContainText('= 60 to 72 from this score\'s 3/8 metre, so you phonate for about');
		await expect(s).not.toContainText('states no tempo');
		await expect(s.locator('.mus').first()).toBeVisible();
		await expect(s.locator('.tempo-link')).toHaveText('Change the tempo');
		// The contact count is shown as a span while the tempo is an estimate.
		await expect(cycles(page)).toHaveText(/Your vocal folds contact about [\d,\u00a0]+ to [\d,\u00a0]+ times/);
		await shot(page, 'tchaikovsky-insights-en-desk-estimated');

		// Open the control: two chips, the dotted quarter marked.
		await s.locator('.tempo-link').click();
		const control = page.locator('[data-tempo-control]');
		await expect(control).toBeVisible();
		await expect(control).toContainText('Your tempo. Every figure follows.');
		const chips = control.locator('.chip');
		await expect(chips).toHaveCount(2);
		await expect(chips.nth(0)).toHaveAttribute('aria-pressed', 'true');
		await expect(chips.nth(0)).toHaveAttribute('aria-label', 'Dotted quarter');
		await expect(chips.nth(1)).toHaveAttribute('aria-label', 'Eighth');
		await expect(control.getByRole('button', { name: "Use Ilya's estimate" })).toHaveCount(0);
		await shot(page, 'tchaikovsky-insights-en-desk-control-open');

		// One tap on the eighth keeps the speed: 66 dotted quarters a minute is 198 eighths.
		await chips.nth(1).click();
		await expect(chips.nth(1)).toHaveAttribute('aria-pressed', 'true');
		await expect(control.locator('.bpm')).toHaveValue('198');
		await expect(receipt).toContainText('your tempo');
		await expect(receipt.locator('[data-sigil="torso"]')).toBeVisible();
		// Back to the dotted quarter: the number keeps the speed again.
		await chips.nth(0).click();
		await expect(control.locator('.bpm')).toHaveValue('66');

		// Type a tempo; every figure follows.
		const bpm = control.locator('.bpm');
		await bpm.fill('60');
		await bpm.press('Enter');
		await expect(s).toContainText(', your tempo.');
		await expect(s).not.toContainText('Ilya estimates');
		await expect(receipt).toContainText('60');
		await expect(receipt).toContainText('your tempo');
		await expect(cycles(page)).toHaveText(/Your vocal folds contact about [\d,\u00a0]+ times/); // a point now, no span
		await shot(page, 'tchaikovsky-insights-en-desk-yours');

		// The steppers move it by one.
		await control.getByRole('button', { name: '+' }).click();
		await expect(bpm).toHaveValue('61');
		await control.getByRole('button', { name: '−' }).click();
		await expect(bpm).toHaveValue('60');

		// Use Ilya's estimate: back to the band.
		await control.getByRole('button', { name: "Use Ilya's estimate" }).click();
		await expect(s).toContainText('Ilya estimates');
		await expect(receipt).toContainText('estimated');
		await expect(receipt).toContainText('60–72');
		await page.keyboard.press('Escape');
		await expect(control).toHaveCount(0);
	});

	test('the receipt opens the control too, the choice survives a reload, and Escape closes', async ({ page }) => {
		await load(page, TCHAIKOVSKY);
		const receipt = page.locator('.receipt-tempo');
		await receipt.getByRole('button', { name: 'Change the tempo' }).click();
		const control = page.locator('[data-tempo-control]');
		await expect(control).toBeVisible();
		await control.locator('.bpm').fill('54');
		await control.locator('.bpm').press('Enter');
		await expect(receipt).toContainText('your tempo');
		await page.keyboard.press('Escape');
		await expect(control).toHaveCount(0);
		await page.waitForTimeout(2500); // the library saves on a short debounce
		await page.reload();
		await waitForDictionary(page);
		await expect(page.locator('.receipt-tempo')).toContainText('your tempo', { timeout: 30_000 });
		await expect(page.locator('.receipt-tempo')).toContainText('54');
	});

	test('French: the ratified sentences, the receipt, and the control', async ({ page }) => {
		await load(page, TCHAIKOVSKY, 'fr');
		const receipt = page.locator('.receipt-tempo');
		await expect(receipt).toContainText('estimé');
		await expect(receipt.getByRole('button', { name: 'Modifier le tempo' })).toBeVisible();
		await insights(page);
		const s = sentence(page);
		await expect(s).toContainText('Ilya estime le tempo à');
		await expect(s).toContainText('d’après la mesure à 3/8 de cette partition; votre phonation occupe donc environ');
		await shot(page, 'tchaikovsky-insights-fr-desk-estimated');
		await s.locator('.tempo-link').click();
		const control = page.locator('[data-tempo-control]');
		await expect(control).toContainText('Votre tempo. Tous les résultats en tiennent compte.');
		await control.locator('.bpm').fill('60');
		await control.locator('.bpm').press('Enter');
		await expect(s).toContainText(', votre tempo.');
		await expect(receipt).toContainText('votre tempo');
		await shot(page, 'tchaikovsky-insights-fr-desk-yours');
		await control.getByRole('button', { name: 'Utiliser l’estimation d’Ilya' }).click();
		await expect(receipt).toContainText('estimé');
	});

	test('on a phone the control spans the bottom and the sentence still reads', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await load(page, TCHAIKOVSKY);
		await insights(page);
		const s = sentence(page);
		await expect(s).toContainText('Ilya estimates');
		await shot(page, 'tchaikovsky-insights-en-phone-estimated');
		await s.locator('.tempo-link').click();
		const control = page.locator('[data-tempo-control]');
		await expect(control).toBeVisible();
		const box = await control.boundingBox();
		expect(box!.x).toBeGreaterThanOrEqual(0);
		expect(box!.x + box!.width).toBeLessThanOrEqual(390);
		await shot(page, 'tchaikovsky-insights-en-phone-control-open');
	});
});

test('a song with a printed tempo word keeps its own sentence, and its receipt says printed', async ({ page }) => {
	test.setTimeout(240_000);
	await load(page, SUNLESS);
	const receipt = page.locator('.receipt-tempo');
	await expect(receipt).toContainText('printed');
	await expect(receipt.locator('[data-sigil]')).toHaveCount(0);
	await insights(page);
	await expect(page.locator('p.prose:visible', { has: page.locator('.tempo-link') }).first()).toContainText('Your phonation takes about');
	await expect(page.getByText(/Ilya estimates/)).toHaveCount(0);
	await shot(page, 'sunless-insights-en-desk-printed');
});
