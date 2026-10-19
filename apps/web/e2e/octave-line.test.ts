/**
 * QUEUE ROW 47, 2026-10-15: the voice line read an octave up or down for the
 * singer's range, said in one quiet line in Insights and in Markup.
 *
 * Upward: Sunless no. 1 (voice part Bass, F clef) with a seeded mezzo range.
 * Downward: Tchaikovsky op. 38 no. 3 (treble) with a seeded bass range. The
 * range is seeded into `shane.profiles.v2` as `docs/sessions/n174-c2/
 * voiced.test.ts` seeds its test voice: a desk-built voice, not a singer's.
 *
 * Set OCTAVE_SHOTS=1 to write the screenshots to docs/sessions/octave-shots/ (from the repository root).
 */
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { waitForDictionary } from './helpers';

const SHOTS = process.env.OCTAVE_SHOTS ? '../../docs/sessions/octave-shots' : null;
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const F1: Record<string, number> = { i: 280, e: 400, 'ɪ': 360, 'ɨ': 320, 'ɛ': 500, a: 700, 'ɑ': 680, 'ʌ': 560, o: 450, u: 300 };
const formants = Object.fromEntries(Object.entries(F1).map(([v, f1]) => [v, { f1, confidence: 'high', reading: 'captured', source: 'measured-user' }]));

function store(low: ReturnType<typeof P>, high: ReturnType<typeof P>) {
	return JSON.stringify({
		version: 2,
		activeId: 'row47-test-voice',
		voices: [{
			id: 'row47-test-voice', name: 'Test voice', createdAt: '2026-10-15T00:00:00.000Z', updatedAt: '2026-10-15T00:00:00.000Z',
			formants,
			characteristics: { source: 'manual', rangeLow: low, rangeHigh: high },
		}],
	});
}

const CASES = [
	{
		song: 'sunless-01',
		file: 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml',
		range: [P('A', 3), P('A', 5)] as const, // a mezzo
		shift: 'higher' as const,
	},
	{
		song: 'tchaikovsky-op38-3',
		file: 'src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml',
		range: [P('E', 2), P('E', 4)] as const, // a bass
		shift: 'lower' as const,
	},
];

const EN = {
	lower: 'Voice line read an octave lower, for your range',
	higher: 'Voice line read an octave higher, for your range',
	written: 'Voice line as written',
	toWritten: 'As written',
	toRange: 'Read for your range',
};
const FR = {
	lower: 'Ligne vocale lue une octave plus bas, pour votre ambitus',
	higher: 'Ligne vocale lue une octave plus haut, pour votre ambitus',
	written: 'Ligne vocale telle qu’écrite',
	toWritten: 'Telle qu’écrite',
	toRange: 'Lire pour votre ambitus',
};

async function load(page: Page, c: (typeof CASES)[number]) {
	await page.addInitScript((s) => {
		if (!sessionStorage.getItem('row47-seeded')) { localStorage.setItem('shane.profiles.v2', s); sessionStorage.setItem('row47-seeded', '1'); }
	}, store(c.range[0], c.range[1]));
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await waitForDictionary(page);
	await page.locator('input.hidden-input').setInputFiles(c.file);
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 30_000 });
}

/** The visible line: Insights draws every block twice (once to measure), so look at what the singer sees. */
const line = (page: Page) => page.locator('[data-octave-line]:visible').first();

async function openTab(page: Page, which: 'markup' | 'insights') {
	await page.locator('.desk-head').getByRole('tab').nth(which === 'markup' ? 1 : 2).click();
	await page.waitForTimeout(which === 'markup' ? 2500 : 3500);
}

async function shot(page: Page, c: (typeof CASES)[number], tab: string, lang: string, state: string) {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.addStyleTag({ content: '*::-webkit-scrollbar{display:none!important} *{scrollbar-width:none!important}' });
	await line(page).scrollIntoViewIfNeeded();
	await page.waitForTimeout(500);
	await page.screenshot({ path: `${SHOTS}/${c.song}-${tab}-${lang}-${state}.png`, animations: 'disabled', caret: 'hide' });
}

for (const c of CASES) {
	test.describe(`${c.song}: read ${c.shift} for the range`, () => {
		test.setTimeout(240_000);

		test('the line appears in both tabs, the tap flips it, and the other tab follows', async ({ page }) => {
			await load(page, c);
			const S = EN;
			const applied = c.shift === 'lower' ? S.lower : S.higher;

			await openTab(page, 'markup');
			await expect(line(page)).toContainText(applied);
			await expect(line(page)).toHaveAttribute('data-applied', 'true');
			await expect(line(page).getByRole('button')).toHaveText(S.toWritten);
			await shot(page, c, 'markup', 'en', 'for-range');

			await openTab(page, 'insights');
			await expect(line(page)).toContainText(applied);
			await expect(line(page).getByRole('button')).toHaveText(S.toWritten);
			await shot(page, c, 'insights', 'en', 'for-range');

			// One tap returns the song to as written, in the tab that was tapped.
			await line(page).getByRole('button').click();
			await expect(line(page)).toHaveAttribute('data-applied', 'false');
			await expect(line(page)).toContainText(S.written);
			await expect(line(page).getByRole('button')).toHaveText(S.toRange);
			await shot(page, c, 'insights', 'en', 'as-written');

			// The other tab follows, and still shows the line, since a shift WOULD apply.
			await openTab(page, 'markup');
			await expect(line(page)).toHaveAttribute('data-applied', 'false');
			await expect(line(page)).toContainText(S.written);
			await shot(page, c, 'markup', 'en', 'as-written');

			// A tap there returns it to "for your range".
			await line(page).getByRole('button').click();
			await expect(line(page)).toHaveAttribute('data-applied', 'true');
			await expect(line(page)).toContainText(applied);
		});

		test('the choice survives a reload in the same browser context', async ({ page }) => {
			await load(page, c);
			await openTab(page, 'markup');
			await line(page).getByRole('button').click();
			await expect(line(page)).toHaveAttribute('data-applied', 'false');
			// Let the debounced save run before leaving the page.
			await page.waitForTimeout(2500);
			await page.reload();
			await waitForDictionary(page);
			// The song comes back from the library; the page may reopen on the tab it left.
			await page.locator('.desk-head').getByRole('tab').nth(1).waitFor({ timeout: 30_000 });
			await openTab(page, 'markup');
			await expect(line(page)).toHaveAttribute('data-applied', 'false');
			await expect(line(page)).toContainText(EN.written);
		});

		test('French, both states', async ({ page }) => {
			await load(page, c);
			await page.locator('.lang-pill').click();
			await expect(page.locator('.lang-pill')).toHaveAttribute('lang', 'en');
			const applied = c.shift === 'lower' ? FR.lower : FR.higher;

			await openTab(page, 'markup');
			await expect(line(page)).toContainText(applied);
			await expect(line(page).getByRole('button')).toHaveText(FR.toWritten);
			await shot(page, c, 'markup', 'fr', 'for-range');
			await openTab(page, 'insights');
			await expect(line(page)).toContainText(applied);
			await shot(page, c, 'insights', 'fr', 'for-range');
			await line(page).getByRole('button').click();
			await expect(line(page)).toContainText(FR.written);
			await expect(line(page).getByRole('button')).toHaveText(FR.toRange);
			await shot(page, c, 'insights', 'fr', 'as-written');
			await openTab(page, 'markup');
			await expect(line(page)).toContainText(FR.written);
			await shot(page, c, 'markup', 'fr', 'as-written');
		});
	});
}

test('a song that fits as written shows no line at all', async ({ page }) => {
	test.setTimeout(240_000);
	// Sunless no. 1 against the n174 test voice's range (E3 to A4): see what the resolver says by looking.
	const c = { ...CASES[0], range: [P('E', 2), P('A', 5)] as const }; // a range wide enough to hold the line either way
	await load(page, c);
	await openTab(page, 'markup');
	await expect(page.locator('[data-octave-line]')).toHaveCount(0);
	await openTab(page, 'insights');
	await expect(page.locator('[data-octave-line]')).toHaveCount(0);
});
