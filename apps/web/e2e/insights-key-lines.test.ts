import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/*
 * N.182 (row 71): THE KEY LINES ON THE REAL INSIGHTS PAGE, with five named fixture voices, each with a typed range,
 * typed passaggi, and a declared type, on the one tracked engraved fixture (Sunless no. 1, C#3 to D4).
 *
 *   TENOR_T   tenor, C3 to F#4, primo E-flat 4, secondo G4: the key suits
 *   BASS_B1   bass, C2 to F#3, primo C3, secondo E3: no better key (a key that only swaps one challenge for another is never offered, Dann 2026-11-05 11:49)
 *   BASS_B2   bass, D2 to C4, primo E3, secondo G#3: two groups (three before the ruling above)
 *   SOPRANO_S soprano, C4 to C6: the key suits, and her line names the secondo only (no primo axis)
 *   NOVICE_N  baritone, A2 to F3 (eight semitones): no workable key
 *   BARITONE  baritone, G#2 to B-flat 3, primo B-flat 3, secondo D4: more groups than the cap, so the cap binds
 *
 * Set N182_SHOTS=<folder> to save the pictures; the default run only asserts the words.
 *   N182_SHOTS=../../docs/sessions/n182-shots-r2 PW_CHROMIUM_PATH=... pnpm exec playwright test --project=chromium insights-key-lines
 *
 * THE TRANSPOSITION RULER'S BROWSER TESTS ARE HERE TOO (N.94, the semitone slider, `brief-code-n94-ribbon-slider_r3_2026-11-26.md`), the one
 * e2e file that lane could touch. Set N94_SHOTS=<folder> to save its two pictures.
 */
const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
const SHOTS = process.env.N182_SHOTS ? path.resolve(process.cwd(), process.env.N182_SHOTS) : null;
const N94_SHOTS = process.env.N94_SHOTS ? path.resolve(process.cwd(), process.env.N94_SHOTS) : null;
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const FORMANTS: Record<string, [number, number]> = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [320, 800] };

type Chars = { rangeLow: unknown; rangeHigh: unknown; tessituraLow: unknown; tessituraHigh: unknown; passaggioPrimary: unknown; passaggioSecondary: unknown };
const VOICES: Record<string, { type: string; chars: Chars }> = {
	TENOR_T: { type: 'tenor', chars: { rangeLow: P('C', 3), rangeHigh: P('F', 4, 1), tessituraLow: P('E', 3), tessituraHigh: P('C', 4), passaggioPrimary: P('E', 4, -1), passaggioSecondary: P('G', 4) } },
	BASS_B1: { type: 'bass', chars: { rangeLow: P('C', 2), rangeHigh: P('F', 3, 1), tessituraLow: P('E', 2), tessituraHigh: P('C', 3), passaggioPrimary: P('C', 3), passaggioSecondary: P('E', 3) } },
	BASS_B2: { type: 'bass', chars: { rangeLow: P('D', 2), rangeHigh: P('C', 4), tessituraLow: P('F', 2), tessituraHigh: P('D', 3), passaggioPrimary: P('E', 3), passaggioSecondary: P('G', 3, 1) } },
	NOVICE_N: { type: 'baritone', chars: { rangeLow: P('A', 2), rangeHigh: P('F', 3), tessituraLow: P('B', 2), tessituraHigh: P('D', 3), passaggioPrimary: P('D', 3), passaggioSecondary: P('F', 3) } },
	SOPRANO_S: { type: 'soprano', chars: { rangeLow: P('C', 4), rangeHigh: P('C', 6), tessituraLow: P('E', 4), tessituraHigh: P('G', 5), passaggioPrimary: P('E', 4), passaggioSecondary: P('F', 5) } },
	BARITONE: { type: 'baritone', chars: { rangeLow: P('G', 2, 1), rangeHigh: P('B', 3, -1), tessituraLow: P('B', 2), tessituraHigh: P('F', 3), passaggioPrimary: P('B', 3, -1), passaggioSecondary: P('D', 4) } },
};

function storedVoice(name: string) {
	const { type, chars } = VOICES[name];
	const formants: Record<string, unknown> = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = new Date().toISOString();
	return { version: 2, activeId: 'v-test', voices: [{ id: 'v-test', name, createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: type, characteristics: { ...chars, source: 'manual' } }] };
}

/** The page's own root: the letter pages, for both viewports. A phone sees the same pages scaled by `PageFit`, so the root no longer depends on the width. */
const rootOf = (_width: 'desktop' | 'phone') => '.insights-container';

async function openInsights(page: Page, voice: string, width: 'desktop' | 'phone', fifths = 2) {
	await page.addInitScript(
		([lang, store]) => {
			try {
				localStorage.setItem('ilya:language', lang);
				localStorage.setItem('shane.profiles.v2', store);
			} catch {
				/* a blocked store leaves the page to render without a voice */
			}
		},
		['en', JSON.stringify(storedVoice(voice))] as const,
	);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	const xml = readFileSync(FIXTURE, 'utf8').replace('<fifths>2</fifths>', `<fifths>${fifths}</fifths>`);
	await page.locator('input[type="file"].hidden-input').setInputFiles(fifths === 2 ? FIXTURE : { name: 'sunless.musicxml', mimeType: 'application/xml', buffer: Buffer.from(xml) });
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
	await page.locator('#tab-insights').click();
	await expect(page.locator(`${rootOf(width)} .block-conclusion`).first()).toBeVisible({ timeout: 20_000 });
	await page.waitForTimeout(1_500);
}

async function shoot(page: Page, name: string, width: 'desktop' | 'phone') {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.locator('.insights-container .paper-page').first().screenshot({ path: path.join(SHOTS, `${name}-${width}.png`) });
}

/** The conclusion and the opened reveal in one picture: the reveal is its own block, directly after the conclusion. */
async function shootWithReveal(page: Page, name: string, width: 'desktop' | 'phone') {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	const top = (await page.locator(`${rootOf(width)} .block-conclusion`).first().boundingBox())!;
	const end = (await page.locator(`${rootOf(width)} .reveal`).first().boundingBox())!;
	await page.screenshot({ path: path.join(SHOTS, `${name}-${width}.png`), fullPage: true, clip: { x: Math.min(top.x, end.x), y: top.y, width: Math.max(top.width, end.width), height: end.y + end.height - top.y } });
}

const lines = (page: Page, width: 'desktop' | 'phone') => page.locator(`${rootOf(width)} .block-conclusion .forward`).allInnerTexts();
const KEY_LINE = /^(Down|Up) [a-z ]+ · .+: .+\.\s*(Try this key)?$/;

for (const [width, viewport] of [['desktop', { width: 1440, height: 1300 }], ['phone', { width: 390, height: 844 }]] as const) {
	test.describe(`the key lines, ${width}`, () => {
		test.use({ viewport });
		test.setTimeout(120_000);

		test('a key that suits: one line, no key offered under it', async ({ page }) => {
			await openInsights(page, 'TENOR_T', width);
			await expect(page.locator(rootOf(width)).getByText('No alternate key suggested: as it stands, the song stays inside your range and below your primo.')).toBeVisible();
			expect(await lines(page, width)).toEqual([]);
			await shoot(page, 'suits-tenor', width);
		});

		/* Integration step 5 (row 71), Dann 2026-11-05 11:49: a key is offered only when it has fewer challenges. BASS_B1's one key under
		   the looser rule traded a small primo share for a range challenge below, so it is no longer offered, and the page says so. The
		   states with exactly one group, and with the cap binding (the BARITONE voice shows three, the cap, with the reveal below),
		   were measured by hand on this fixture; I found no voice here that gives exactly one line. */
		test('no better key: the one-line answer, no key, and the keys under the reveal', async ({ page }) => {
			await openInsights(page, 'BASS_B1', width);
			expect(await lines(page, width)).toEqual([]);
			await expect(page.locator(rootOf(width)).getByText('No better key: no other key within a tritone eases these challenges.')).toBeVisible();
			await expect(page.locator(`${rootOf(width)} .reveal summary`).first()).toBeVisible();
			await shoot(page, 'no-better-bass', width);
		});

		test('two groups: two lines, each a different move, each with its "Try this key"', async ({ page }) => {
			await openInsights(page, 'BASS_B2', width);
			const found = await lines(page, width);
			expect(found).toHaveLength(2);
			for (const l of found) expect(l).toMatch(KEY_LINE);
			expect(new Set(found.map((l) => l.split(':')[0])).size).toBe(2);
			await expect(page.locator(`${rootOf(width)} .block-conclusion .try-key`)).toHaveCount(2);
			await shoot(page, 'two-groups-bass', width);
		});

		test('a key that suits a voice with no primo axis names her secondo, not a primo', async ({ page }) => {
			await openInsights(page, 'SOPRANO_S', width);
			await expect(page.locator(rootOf(width)).getByText('No alternate key suggested: as it stands, the song stays inside your range and below your secondo.')).toBeVisible();
			expect(await lines(page, width)).toEqual([]);
			await shoot(page, 'suits-soprano', width);
		});

		test('no workable key: the one-line answer and the teacher line, no key', async ({ page }) => {
			await openInsights(page, 'NOVICE_N', width);
			await expect(page.locator(rootOf(width)).getByText('No key within a tritone brings this song inside your range.')).toBeVisible();
			expect(await lines(page, width)).toEqual([]);
			await expect(page.locator(rootOf(width)).getByText('Discuss this approach with your voice teacher.').first()).toBeVisible();
			await shoot(page, 'no-workable-novice', width);
		});

		test('the reveal: "Show keys that reach higher" opens on its own, and says where and how far', async ({ page }) => {
			await openInsights(page, 'BASS_B1', width);
			const summary = page.locator(`${rootOf(width)} .reveal summary`).first();
			await expect(summary).toHaveText(/^Show keys that reach (higher|lower|higher or lower)$/);
			await summary.click();
			const open = await page.locator(`${rootOf(width)} .reveal`).first().locator('.forward').allInnerTexts();
			expect(open.length).toBeGreaterThan(0);
			expect(open.some((l) => /reaches (above|below) your range in bars? .+, by /.test(l))).toBe(true);
			await expect(page.locator(`${rootOf(width)} details.more[open]`)).toHaveCount(0);
			await shootWithReveal(page, 'reveal-bass', width);
		});

		test('more groups than the cap: three are shown and the rest wait under the reveal', async ({ page }) => {
			await openInsights(page, 'BARITONE', width);
			expect(await lines(page, width)).toHaveLength(3);
			await expect(page.locator(`${rootOf(width)} .reveal summary`).first()).toBeVisible();
			await shoot(page, 'cap-binds-baritone', width);
		});
	});
}

// ── N.94: the Transposition ruler, a detented slider of semitones ──

const ruler = (page: Page) => page.locator('[data-transposition-ribbon]');
const node = (page: Page, semitones: number) => ruler(page).locator(`.node-hit[data-semitones="${semitones}"]`);
const readoutOf = (page: Page) => ruler(page).locator('.readout');
const spellings = (page: Page) => ruler(page).locator('.spell span');
const faded = (page: Page) => ruler(page).locator('.spell:not(.live)');
const undo = (page: Page) => ruler(page).locator('.undo');
/** The Piece band's key line; it is in the page whether or not the drawer shows it. */
const band = (page: Page) => page.locator('.piece-key span').first();
/** What the MELODY paper shows, without the ruler that floats over it. */
const paper = (page: Page) => page.locator('.markup-paper-container .score-page').evaluateAll((pages) => pages.map((p) => p.innerHTML).join(''));
/** The autosave is debounced; a reload before it lands would read the song before the tap. */
const SAVED = 2_000;

/** MELODY with the fixture on it, printed in `fifths` sharps (negative for flats), and the Piece band open. */
async function openMelody(page: Page, { fifths = 2, lang = 'en' }: { fifths?: number; lang?: 'en' | 'fr' } = {}) {
	await page.addInitScript((l) => {
		// Once only, so a reload keeps the language and the song.
		if (!localStorage.getItem('ilya:language')) localStorage.setItem('ilya:language', l);
	}, lang);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	const xml = readFileSync(FIXTURE, 'utf8').replace('<fifths>2</fifths>', `<fifths>${fifths}</fifths>`);
	await page.locator('input[type="file"].hidden-input').setInputFiles({ name: 'sunless.musicxml', mimeType: 'application/xml', buffer: Buffer.from(xml) });
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
	await page.locator('#tab-markup').click();
	await expect(page.locator('.markup-paper-container .score-page').first()).toBeVisible({ timeout: 20_000 });
	// The clef question floats over the top of the page, where the ruler opens; answer it first.
	const clef = page.getByRole('button', { name: lang === 'fr' ? 'Telle qu’écrite' : 'As written', exact: true });
	await clef.last().click({ timeout: 4_000 }).catch(() => {});
	await page.waitForTimeout(500);
	await openPiece(page, lang);
}
async function openPiece(page: Page, lang: 'en' | 'fr' = 'en') {
	const line = page.locator('.piece-key');
	if (!(await line.isVisible())) await page.getByRole('button', { name: lang === 'fr' ? /^pièce/i : /^piece/i }).first().click();
	await expect(line).toBeVisible();
}
async function openRuler(page: Page) {
	await page.locator('.piece-key-pill').click();
	await expect(ruler(page)).toBeVisible({ timeout: 15_000 });
	await expect(node(page, 0)).toBeVisible();
}
async function reloaded(page: Page, lang: 'en' | 'fr' = 'en') {
	await page.waitForTimeout(SAVED);
	await page.reload();
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('#tab-markup').click();
	await expect(page.locator('.markup-paper-container .score-page').first()).toBeVisible({ timeout: 20_000 });
	await openPiece(page, lang);
}
async function centreOf(page: Page, semitones: number) {
	const box = (await node(page, semitones).boundingBox())!;
	// The detent row, under the integer.
	return { x: box.x + box.width / 2, y: box.y + 33 };
}
/** A tap on the paper well below the ruler. */
async function tapPaper(page: Page) {
	const box = (await ruler(page).boundingBox())!;
	await page.mouse.click(box.x + 20, box.y + box.height + 250);
}

test.describe('the Transposition ruler (desktop)', () => {
	test.use({ viewport: { width: 1440, height: 900 } });
	test.setTimeout(120_000);

	test('thirteen nodes from -6 to +6, three of them pairs, flats first; no Cancel and no Use this key', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		const radios = ruler(page).getByRole('radio');
		await expect(radios).toHaveCount(13);
		expect(await ruler(page).locator('.num').allInnerTexts()).toEqual(['−6', '−5', '−4', '−3', '−2', '−1', '0', '+1', '+2', '+3', '+4', '+5', '+6']);
		expect(await ruler(page).locator('.interval').allInnerTexts()).toEqual(['TT', 'P4', 'M3', 'm3', 'M2', 'm2', 'ORIG.', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT']);
		const xs = await radios.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().x));
		expect(xs).toEqual([...xs].sort((a, b) => a - b));
		await expect(node(page, 0)).toBeChecked();
		await expect(spellings(page)).toHaveCount(0);
		await expect(undo(page)).toHaveCount(0);
		const pairs: [number, string[]][] = [];
		for (let n = -6; n <= 6; n++) {
			await node(page, n).click();
			await expect(node(page, n)).toBeChecked();
			const shown = await spellings(page).allInnerTexts();
			if (shown.length) pairs.push([n, shown]);
		}
		expect(pairs).toEqual([[-3, ['C♭', 'B']], [-1, ['D♭', 'C♯']], [4, ['G♭', 'F♯']]]);
		await expect(page.getByRole('button', { name: 'Cancel' })).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Use this key' })).toHaveCount(0);
		for (const name of await radios.evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''))) {
			expect(name).not.toMatch(/\b(m2|M2|m3|M3|P4|TT)\b|ORIG/);
		}
		await expect(node(page, 0)).toHaveAttribute('aria-label', 'D major. As printed');
	});

	test('a spelling half is 96 by 46 px, below the interval labels; elsewhere in that band the node above is selected', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		await node(page, -1).click();
		const labels = (await ruler(page).locator('.interval').first().boundingBox())!;
		for (const half of await ruler(page).locator('.spell').all()) {
			const box = (await half.boundingBox())!;
			expect([Math.round(box.width), Math.round(box.height)]).toEqual([96, 46]);
			expect(box.y).toBeGreaterThanOrEqual(labels.y + labels.height - 0.5);
		}
		// In the band, past the halves: the node above.
		const far = (await node(page, 3).boundingBox())!;
		await page.mouse.click(far.x + far.width / 2, far.y + far.height - 10);
		await expect(node(page, 3)).toBeChecked();
	});

	test('tap -2, tap the paper: the ruler closes and C major stays, after a reload too, and INSIGHTS reads it', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		await node(page, -2).click();
		await expect(readoutOf(page)).toContainText('Down a whole tone · C major');
		await expect(ruler(page)).toBeVisible();
		await tapPaper(page);
		await expect(ruler(page)).toHaveCount(0);
		await expect(band(page)).toHaveText('Key: C major, transposed');
		await reloaded(page);
		await expect(band(page)).toHaveText('Key: C major, transposed');
		await page.locator('#tab-insights').click();
		await expect(page.locator('.insights-container').getByText('Transposed down a whole tone from D major', { exact: false }).first()).toBeVisible({ timeout: 20_000 });
	});

	test('Undo puts back the paper, the band, and the stored choice, and goes with the ruler', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		const before = await paper(page);
		await node(page, -2).click();
		await expect(band(page)).toHaveText('Key: C major, transposed');
		expect(await paper(page)).not.toBe(before);
		await undo(page).click();
		await expect(band(page)).toHaveText('Key: D major, as printed');
		await expect(node(page, 0)).toBeChecked();
		await expect(undo(page)).toHaveCount(0);
		expect(await paper(page)).toBe(before);
		// One level: the second commit's Undo returns to the first.
		await node(page, -2).click();
		await node(page, 2).click();
		await undo(page).click();
		await expect(band(page)).toHaveText('Key: C major, transposed');
		await expect(node(page, -2)).toBeChecked();
		await node(page, 2).click();
		await undo(page).click();
		await page.keyboard.press('Escape');
		await expect(ruler(page)).toHaveCount(0);
		await reloaded(page);
		await expect(band(page)).toHaveText('Key: C major, transposed');
		await openPieceAsPrintedThenTry(page);
		await expect(undo(page)).toHaveCount(0);
	});

	test('node zero restores the print; leaving MELODY closes the ruler and keeps the key', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		await node(page, -5).click();
		await node(page, 0).click();
		await expect(band(page)).toHaveText('Key: D major, as printed');
		await node(page, -5).click();
		await page.keyboard.press('Escape');
		await page.locator('#tab-insights').click();
		await page.locator('#tab-markup').click();
		await expect(ruler(page)).toHaveCount(0);
		await openPiece(page);
		await expect(band(page)).toHaveText('Key: A major, transposed');
	});

	test('the faded spelling swaps the paper, the readout, and the band, and back; the choice survives a reload', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		await node(page, -1).click();
		const first = (await band(page).innerText()).trim();
		const firstPaper = await paper(page);
		const other = await faded(page).innerText();
		await expect(faded(page)).toHaveAttribute('aria-label', `Spell it ${other} instead`);
		await faded(page).click();
		await expect(band(page)).not.toHaveText(first);
		const second = (await band(page).innerText()).trim();
		expect([first, second].sort()).toEqual(['Key: C sharp major, transposed', 'Key: D flat major, transposed']);
		await expect(readoutOf(page)).toContainText(second.replace('Key: ', '').replace(', transposed', ''));
		expect(await paper(page)).not.toBe(firstPaper);
		await faded(page).click();
		await expect(band(page)).toHaveText(first);
		await faded(page).click();
		await reloaded(page);
		await expect(band(page)).toHaveText(second);
	});

	test('five sharps: node zero carries both spellings, swaps both ways, and the twin survives a reload', async ({ page }) => {
		await openMelody(page, { fifths: 5 });
		await expect(band(page)).toHaveText('Key: B major, as printed');
		await openRuler(page);
		await expect(node(page, 0)).toBeChecked();
		expect(await spellings(page).allInnerTexts()).toEqual(['C♭', 'B']);
		await faded(page).click();
		await expect(band(page)).toHaveText('Key: C flat major, transposed');
		await page.keyboard.press('Escape');
		await reloaded(page);
		await expect(band(page)).toHaveText('Key: C flat major, transposed');
		// Transposed, the band offers only "As printed"; the ruler on a stored key is the INSIGHTS test below.
		await page.locator('.piece-key-pill').click();
		await expect(band(page)).toHaveText('Key: B major, as printed');
		await openRuler(page);
		await faded(page).click();
		await expect(band(page)).toHaveText('Key: C flat major, transposed');
		await faded(page).click();
		await expect(band(page)).toHaveText('Key: B major, as printed');
		// From elsewhere, node zero is the print.
		await node(page, -2).click();
		await node(page, 0).click();
		await expect(band(page)).toHaveText('Key: B major, as printed');
	});

	test('French: the pair prints in words and sits inside the card at -1 and at both ends', async ({ page }) => {
		await openMelody(page, { fifths: 0, lang: 'fr' });
		await openRuler(page);
		for (const [n, words] of [[-1, ['do bémol', 'si']], [-6, ['sol bémol', 'fa dièse']], [6, ['sol bémol', 'fa dièse']]] as const) {
			await node(page, n).click();
			expect(await spellings(page).allInnerTexts()).toEqual([...words]);
			const card = (await ruler(page).boundingBox())!;
			const [flat, sharp] = await Promise.all((await spellings(page).all()).map(async (e) => (await e.boundingBox())!));
			expect(flat.x).toBeGreaterThanOrEqual(card.x);
			expect(sharp.x + sharp.width).toBeLessThanOrEqual(card.x + card.width);
			// Centred: the two words meet under the node.
			const mid = await centreOf(page, n);
			expect(flat.x + flat.width).toBeLessThan(mid.x);
			expect(sharp.x).toBeGreaterThan(mid.x);
		}
	});

	test('drag from 0 to -2: the readout follows, and the paper redraws once, on release', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		/* A redraw here is a new engraving: the music inside the score's SVG changes. The pane then refits that SVG's window under the
		   key's header line (its viewBox only), after a tap as after a drag, which is not counted. */
		await page.evaluate(() => {
			const w = window as unknown as { __redraws: number };
			const read = () => [...document.querySelectorAll('.markup-paper-container .score-window svg')].map((p) => p.innerHTML).join('');
			let last = read();
			w.__redraws = 0;
			new MutationObserver(() => {
				const next = read();
				if (next !== last) w.__redraws++;
				last = next;
			}).observe(document.querySelector('.markup-paper-container')!, { subtree: true, childList: true, attributes: true, characterData: true });
		});
		const redraws = () => page.evaluate(() => (window as unknown as { __redraws: number }).__redraws);
		const from = await centreOf(page, 0);
		const to = await centreOf(page, -2);
		await page.mouse.move(from.x, from.y);
		await page.mouse.down();
		await page.mouse.move((await centreOf(page, -1)).x, from.y, { steps: 5 });
		await expect(readoutOf(page)).toContainText('Down a semitone');
		await page.mouse.move(to.x, to.y, { steps: 5 });
		await expect(readoutOf(page)).toContainText('Down a whole tone · C major');
		await page.waitForTimeout(500);
		expect(await redraws()).toBe(0);
		await expect(band(page)).toHaveText('Key: D major, as printed');
		await page.mouse.up();
		await expect(band(page)).toHaveText('Key: C major, transposed');
		await page.waitForTimeout(1_500);
		expect(await redraws()).toBe(1);
		await expect(ruler(page)).toBeVisible();
		await expect(node(page, -2)).toBeChecked();
	});

	test('a drag past either end clamps; a release off the strip keeps the last node; a release outside the ruler does not close it', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		const zero = await centreOf(page, 0);
		const card = (await ruler(page).boundingBox())!;
		await page.mouse.move(zero.x, zero.y);
		await page.mouse.down();
		await page.mouse.move(card.x - 120, zero.y, { steps: 8 });
		await page.mouse.up();
		await expect(node(page, -6)).toBeChecked();
		await expect(ruler(page)).toBeVisible();
		const end = await centreOf(page, -6);
		await page.mouse.move(end.x, end.y);
		await page.mouse.down();
		await page.mouse.move(card.x + card.width + 120, zero.y, { steps: 8 });
		await page.mouse.up();
		await expect(node(page, 6)).toBeChecked();
		const three = await centreOf(page, 3);
		const six = await centreOf(page, 6);
		await page.mouse.move(six.x, six.y);
		await page.mouse.down();
		await page.mouse.move(three.x, three.y, { steps: 6 });
		await page.mouse.move(zero.x, card.y + card.height + 200, { steps: 1 });
		await page.mouse.up();
		await expect(node(page, 3)).toBeChecked();
		await expect(ruler(page)).toBeVisible();
		// The next real tap outside still closes it.
		await tapPaper(page);
		await expect(ruler(page)).toHaveCount(0);
		await expect(band(page)).toHaveText('Key: F major, transposed');
	});

	test('keyboard only: arrows walk thirteen nodes and commit, Tab reaches the faded spelling, Escape closes', async ({ page }) => {
		await openMelody(page);
		await page.locator('.piece-key-pill').focus();
		await page.keyboard.press('Enter');
		await expect(node(page, 0)).toBeFocused({ timeout: 15_000 });
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await expect(node(page, -2)).toBeFocused();
		await expect(band(page)).toHaveText('Key: C major, transposed');
		const walked: number[] = [];
		for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
		await expect(node(page, -6)).toBeFocused();
		for (let i = 0; i < 13; i++) {
			walked.push(Number(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.semitones)));
			await page.keyboard.press('ArrowRight');
		}
		expect(walked).toEqual([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
		for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowLeft');
		await expect(node(page, -1)).toBeFocused();
		// The node keeps a visible focus ring, and it ends above the spelling words, whether an outline or an ::after draws it.
		const ringEnds = await node(page, -1).evaluate((e) => {
			const box = e.getBoundingClientRect();
			if (getComputedStyle(e).outlineStyle !== 'none') return box.bottom;
			const drawn = getComputedStyle(e, '::after');
			return drawn.borderBottomStyle === 'solid' ? box.bottom - parseFloat(drawn.bottom) : null;
		});
		expect(ringEnds).not.toBeNull();
		expect(ringEnds!).toBeLessThanOrEqual((await spellings(page).first().boundingBox())!.y);
		const first = (await band(page).innerText()).trim();
		await page.keyboard.press('Tab');
		await expect(faded(page)).toBeFocused();
		await expect(faded(page)).toHaveAttribute('aria-label', /^Spell it .+ instead$/);
		// Its ring is visible too, and runs through neither the slash nor either word.
		const crossed = await faded(page).evaluate((e) => {
			const word = e.querySelector('span')!;
			const on = [e, word].find((el) => getComputedStyle(el).outlineStyle !== 'none');
			if (!on) return ['no ring'];
			const style = getComputedStyle(on);
			const out = parseFloat(style.outlineOffset) + parseFloat(style.outlineWidth);
			const box = on.getBoundingClientRect();
			const outer = { l: box.left - out, r: box.right + out, t: box.top - out, b: box.bottom + out };
			const band = parseFloat(style.outlineWidth);
			const ring = e.closest('.pair')!;
			return [...ring.querySelectorAll('.slash, .spell span')]
				.filter((el) => {
					const q = el.getBoundingClientRect();
					const touches = q.right > outer.l && q.left < outer.r && q.bottom > outer.t && q.top < outer.b;
					const within = q.left >= outer.l + band && q.right <= outer.r - band && q.top >= outer.t + band && q.bottom <= outer.b - band;
					return touches && !within;
				})
				.map((el) => el.textContent);
		});
		expect(crossed).toEqual([]);
		await page.keyboard.press('Enter');
		await expect(band(page)).not.toHaveText(first);
		await expect(node(page, -1)).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(ruler(page)).toHaveCount(0);
		await expect(band(page)).toContainText('transposed');
	});

	test('print shows no ruler, and the picture at -1', async ({ page }) => {
		await openMelody(page);
		await openRuler(page);
		await node(page, -1).click();
		await page.waitForTimeout(800);
		if (N94_SHOTS) {
			mkdirSync(N94_SHOTS, { recursive: true });
			await page.screenshot({ path: path.join(N94_SHOTS, 'ruler-1440-sunless-01-at-minus-1.png') });
		}
		await page.emulateMedia({ media: 'print' });
		await expect(page.locator('.transposition-ruler')).toBeHidden();
	});
});

/** From a transposed band: "As printed", then "Try another key". */
async function openPieceAsPrintedThenTry(page: Page) {
	await page.locator('.piece-key-pill').click();
	await expect(band(page)).toHaveText('Key: D major, as printed');
	await openRuler(page);
}

test.describe('from a key line to the analysis in that key (desktop)', () => {
	test.use({ viewport: { width: 1440, height: 1300 } });
	test.setTimeout(120_000);

	/* The only route that opens the ruler on a song already transposed: the Piece band offers "As printed" alone then. The ruler
	   opens on the stored key before it commits the asked one, so Undo shows the opening: the stored twin, live. */
	test('the ruler opens on a stored twin with that spelling live', async ({ page }) => {
		await openInsights(page, 'BASS_B2', 'desktop', 5);
		await page.locator('#tab-markup').click();
		await page.getByRole('button', { name: 'As written', exact: true }).last().click({ timeout: 4_000 }).catch(() => {});
		await openPiece(page);
		await openRuler(page);
		await faded(page).click();
		await expect(band(page)).toHaveText('Key: C flat major, transposed');
		await page.keyboard.press('Escape');
		await page.locator('#tab-insights').click();
		await page.locator('.insights-container .block-conclusion .try-key').first().click();
		await expect(undo(page)).toBeVisible({ timeout: 15_000 });
		await undo(page).click();
		await expect(node(page, 0)).toBeChecked();
		await expect(ruler(page).locator('.spell.live')).toHaveText('C♭');
		await expect(band(page)).toHaveText('Key: C flat major, transposed');
	});

	test('"Try this key" commits it with Undo showing; Undo leaves INSIGHTS as it was, and leaving MELODY keeps the key', async ({ page }) => {
		await openInsights(page, 'BASS_B2', 'desktop');
		const sheet = page.locator('.insights-container .paper-page').first();
		const chip = page.locator('.insights-container .block-conclusion .try-key').first();
		const before = await sheet.innerText();
		await openPiece(page);
		// The chip: MELODY comes forward with the ruler open, the key already the song's.
		await chip.click();
		await expect(undo(page)).toBeVisible({ timeout: 15_000 });
		await expect(page.locator('.piece-key span').first()).toContainText('transposed');
		await expect(ruler(page).getByRole('radio', { checked: true })).not.toHaveAttribute('data-semitones', '0');
		await undo(page).click();
		await expect(page.locator('.piece-key span').first()).toContainText('as printed');
		await page.locator('#tab-insights').click();
		await expect(page.locator('.insights-container .block-conclusion').first()).toBeVisible();
		await page.waitForTimeout(1_500);
		expect(await sheet.innerText()).toBe(before);
		// Again, and leave without undoing: INSIGHTS reads the song in it.
		await chip.click();
		await expect(undo(page)).toBeVisible({ timeout: 15_000 });
		await page.locator('#tab-insights').click();
		await expect(page.locator('.insights-container .block-conclusion').first()).toBeVisible();
		await page.waitForTimeout(1_500);
		expect(await sheet.innerText()).not.toBe(before);
		await expect(ruler(page)).toHaveCount(0);
	});
});

test.describe('the Transposition ruler, docked (390 px, touch)', () => {
	test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 });
	test.setTimeout(120_000);

	/** "Try this key" brings MELODY forward with the dock open over the page; the print chip then puts the thumb on node zero. */
	async function openDock(page: Page) {
		await openInsights(page, 'BASS_B2', 'phone');
		await page.locator('.insights-container .block-conclusion .try-key').first().tap();
		await expect(undo(page)).toBeVisible({ timeout: 15_000 });
		// The clef question floats over the page here too; answering it is a tap outside, so answer, then ask again.
		const clef = page.getByRole('button', { name: 'As written', exact: true }).last();
		if (await clef.isVisible()) {
			await clef.tap();
			await expect(ruler(page)).toHaveCount(0);
			await page.locator('#tab-insights').tap();
			await page.locator('.insights-container .block-conclusion .try-key').first().tap();
			await expect(undo(page)).toBeVisible({ timeout: 15_000 });
		}
		await ruler(page).locator('.chip').first().tap();
		await expect(node(page, 0)).toBeChecked();
		await page.waitForTimeout(800);
	}
	/** The nodes whose centres are in the window, after the slide has finished. */
	async function window7(page: Page) {
		await page.waitForTimeout(450);
		return page.evaluate(() => {
			const w = document.querySelector('[data-transposition-ribbon] .ribbon')!.getBoundingClientRect();
			return [...document.querySelectorAll<HTMLElement>('[data-transposition-ribbon] .node-hit')]
				.filter((e) => {
					const r = e.getBoundingClientRect();
					return r.x + r.width / 2 > w.x && r.x + r.width / 2 < w.right;
				})
				.map((e) => Number(e.dataset.semitones));
		});
	}
	const span = (from: number, nodes = 7) => Array.from({ length: nodes }, (_, i) => from + i);
	/** At an end the window has travelled one slot past it: six nodes and a blank. */
	const AT_MINUS_6 = span(-6, 6);
	const AT_PLUS_6 = span(1, 6);

	test('seven nodes, six and a blank at an end; the ribbon slides only past slots two to six; every route commits', async ({ page }) => {
		await openDock(page);
		await ruler(page).locator('.chip').first().tap();
		expect(await window7(page)).toEqual(span(-3));
		if (N94_SHOTS) {
			mkdirSync(N94_SHOTS, { recursive: true });
			await page.screenshot({ path: path.join(N94_SHOTS, 'dock-390-sunless-01-as-printed.png') });
		}
		for (const [tap, from] of [[-2, -3], [2, -3], [-3, -4], [-4, -5], [-2, -5], [-5, -6]] as const) {
			await node(page, tap).tap();
			await expect(node(page, tap)).toBeChecked();
			expect(await window7(page)).toEqual(span(from));
		}
		await node(page, -6).tap();
		await expect(node(page, -6)).toBeChecked();
		expect(await window7(page)).toEqual(AT_MINUS_6);
		// The far end of slots two to six holds still too.
		await node(page, -5).tap();
		await node(page, -1).tap();
		expect(await window7(page)).toEqual(span(-6));
		if (N94_SHOTS) await page.screenshot({ path: path.join(N94_SHOTS, 'dock-390-sunless-01-at-minus-1.png') });
		const header = page.locator('.markup-paper-container');
		await expect(header).toContainText('Transposed down a semitone from D major');
		// The chip commits, and the ribbon comes to it.
		await ruler(page).locator('.chip').first().tap();
		await expect(node(page, 0)).toBeChecked();
		await expect(header).not.toContainText('Transposed down');
		// The arrows commit, and walk past the window's edge.
		await node(page, 0).focus();
		for (let i = 1; i <= 6; i++) {
			await page.keyboard.press('ArrowRight');
			await expect(node(page, i)).toBeChecked();
			expect(await window7(page)).toContain(i);
		}
		expect(await window7(page)).toEqual(AT_PLUS_6);
		// One step off the end, and the blank has gone.
		await page.keyboard.press('ArrowLeft');
		expect(await window7(page)).toEqual(span(0));
		await page.keyboard.press('ArrowRight');
		await expect(header).toContainText('Transposed up a tritone from D major');
		await expect(page.getByRole('button', { name: 'Cancel' })).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Use this key' })).toHaveCount(0);
	});

	test('a touch drag commits on lift and stays among the seven nodes on screen', async ({ page }) => {
		await openDock(page);
		await ruler(page).locator('.chip').first().tap();
		await window7(page);
		const touch = await page.context().newCDPSession(page);
		const drag = async (from: { x: number; y: number }, toX: number) => {
			await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
			for (let i = 1; i <= 8; i++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + ((toX - from.x) * i) / 8, y: from.y }] });
		};
		const lift = () => touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		const header = page.locator('.markup-paper-container');
		await drag(await centreOf(page, 0), (await centreOf(page, -2)).x);
		await expect(readoutOf(page)).toContainText('Down a whole tone');
		await expect(header).not.toContainText('Transposed down');
		await lift();
		await expect(header).toContainText('Transposed down a whole tone from D major');
		await expect(node(page, -2)).toBeChecked();
		// To the screen's edge: the last node on screen, and only then does the ribbon slide.
		await drag(await centreOf(page, -2), 1);
		expect(await window7(page)).toEqual(span(-3));
		await lift();
		await expect(node(page, -3)).toBeChecked();
		expect(await window7(page)).toEqual(span(-4));
	});

	/* THE FRENCH DOCK ON A PRINT WITH NO SHARPS OR FLATS, where both ends are pairs. The route is the Piece band in the drawer:
	   drawer pull, PIÈCE, "Essayer une autre tonalité". (`openDock` goes through INSIGHTS, in English.) */
	async function openFrenchDock(page: Page) {
		await page.addInitScript(() => localStorage.setItem('ilya:language', 'fr'));
		await page.goto('/');
		await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
		const xml = readFileSync(FIXTURE, 'utf8').replace('<fifths>2</fifths>', '<fifths>0</fifths>');
		await page.locator('input[type="file"].hidden-input').setInputFiles({ name: 'sunless.musicxml', mimeType: 'application/xml', buffer: Buffer.from(xml) });
		await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
		await page.waitForTimeout(1_000);
		await page.locator('.drawer-pull').tap();
		await page.waitForTimeout(700);
		await openPiece(page, 'fr');
		await page.locator('.piece-key-pill').tap();
		await expect(node(page, 0)).toBeChecked({ timeout: 15_000 });
	}
	/** Arrows from the selected node to `end`, then the slide's 0.2 s, which the spelling pair does not wait for. */
	async function walkTo(page: Page, end: -6 | 6) {
		const checked = ruler(page).getByRole('radio', { checked: true });
		await checked.focus();
		for (let i = 0; i < 12 && (await checked.getAttribute('data-semitones')) !== String(end); i++) await page.keyboard.press(end < 0 ? 'ArrowLeft' : 'ArrowRight');
		await expect(node(page, end)).toBeChecked();
		await page.waitForTimeout(450);
	}

	for (const width of [390, 320]) {
		test.describe(`French, ${width} px`, () => {
			test.use({ viewport: { width, height: 844 } });

			test('at -6 and +6 the pair prints whole inside the window, centred on its node, in slot two or six', async ({ page }) => {
				await openFrenchDock(page);
				for (const [end, slot] of [[-6, 2], [6, 6]] as const) {
					await walkTo(page, end);
					for (const turn of ['as arrived', 'swapped']) {
						expect(await spellings(page).allInnerTexts()).toEqual(['sol bémol', 'fa dièse']);
						const win = (await ruler(page).locator('.ribbon').boundingBox())!;
						// A rect ignores the window's clip, so a word cut by it measures past the edge.
						const [flat, sharp] = await Promise.all((await spellings(page).all()).map(async (e) => (await e.boundingBox())!));
						const left = +(flat.x - win.x).toFixed(2);
						const right = +(win.x + win.width - (sharp.x + sharp.width)).toFixed(2);
						expect.soft(left, `${end}, ${turn}: clearance left of the flat word`).toBeGreaterThanOrEqual(5);
						expect.soft(right, `${end}, ${turn}: clearance right of the sharp word`).toBeGreaterThanOrEqual(5);
						const mid = await centreOf(page, end);
						expect(flat.x + flat.width).toBeLessThan(mid.x);
						expect(sharp.x).toBeGreaterThan(mid.x);
						expect.soft(Math.floor((mid.x - win.x) / (win.width / 7)) + 1, `${end}: the slot the node rests in`).toBe(slot);
						await faded(page).evaluate((e: HTMLElement) => e.click());
						await page.waitForTimeout(450);
					}
				}
			});
		});
	}

	test('a drag across the blank slot lands on the end node', async ({ page }) => {
		await openDock(page);
		await window7(page);
		await node(page, 0).focus();
		const touch = await page.context().newCDPSession(page);
		const drag = async (fromNode: number, toX: number) => {
			const from = await centreOf(page, fromNode);
			await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
			for (let i = 1; i <= 8; i++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + ((toX - from.x) * i) / 8, y: from.y }] });
			await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		};
		// From inside the window, over the blank, to the screen's edge: first the left end, then the right.
		for (const [end, step, key, inward, edge, view] of [[-6, 6, 'ArrowLeft', -4, 1, AT_MINUS_6], [6, 12, 'ArrowRight', 4, 389, AT_PLUS_6]] as const) {
			for (let i = 0; i < step; i++) await page.keyboard.press(key);
			await expect(node(page, end)).toBeChecked();
			expect(await window7(page)).toEqual(view);
			await drag(inward, edge);
			await expect(node(page, end)).toBeChecked();
			await expect(readoutOf(page)).toContainText('tritone');
			expect(await window7(page)).toEqual(view);
			await node(page, end).focus();
		}
	});

	test('a page scroll leaves the dock open; a tap outside closes it and the key stands; print hides it', async ({ page }) => {
		await openDock(page);
		await node(page, -2).tap();
		await page.waitForTimeout(800);
		const scrolled = () => page.evaluate(() => [...document.querySelectorAll('*')].reduce((sum, e) => sum + e.scrollTop, 0));
		const was = await scrolled();
		const cdp = await page.context().newCDPSession(page);
		await cdp.send('Input.synthesizeScrollGesture', { x: 195, y: 420, yDistance: -260, gestureSourceType: 'touch', speed: 800 });
		await page.waitForTimeout(600);
		expect(await scrolled()).toBeGreaterThan(was);
		await expect(ruler(page)).toBeVisible();
		await page.emulateMedia({ media: 'print' });
		await expect(page.locator('.dock')).toBeHidden();
		await page.emulateMedia({ media: 'screen' });
		await page.touchscreen.tap(195, 300);
		await expect(ruler(page)).toHaveCount(0);
		await expect(page.locator('.markup-paper-container')).toContainText('Transposed down a whole tone from D major');
	});
});
