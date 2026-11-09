import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
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
 */
const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
const SHOTS = process.env.N182_SHOTS ? path.resolve(process.cwd(), process.env.N182_SHOTS) : null;
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

/** The page's own root: the letter pages on the desk, the one column on a phone. */
const rootOf = (width: 'desktop' | 'phone') => (width === 'phone' ? '.insights-flow' : '.insights-container');

async function openInsights(page: Page, voice: string, width: 'desktop' | 'phone') {
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
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
	await page.locator('#tab-insights').click();
	await expect(page.locator(`${rootOf(width)} .block-conclusion`).first()).toBeVisible({ timeout: 20_000 });
	await page.waitForTimeout(1_500);
}

async function shoot(page: Page, name: string, width: 'desktop' | 'phone') {
	if (!SHOTS) return;
	mkdirSync(SHOTS, { recursive: true });
	await page.locator(width === 'phone' ? '.insights-flow .block-conclusion' : '.insights-container .paper-page').first().screenshot({ path: path.join(SHOTS, `${name}-${width}.png`) });
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

test.describe('from a key line to the analysis in that key (desktop)', () => {
	test.use({ viewport: { width: 1440, height: 1300 } });
	test.setTimeout(120_000);

	test('"Try this key" opens the ruler on MELODY; "Use this key" puts INSIGHTS in that key; cancelling leaves it as it was', async ({ page }) => {
		await openInsights(page, 'BASS_B2', 'desktop');
		const before = await page.locator('.insights-container .paper-page').first().innerText();
		// Step 1 and 2: the chip. Step 3: MELODY comes forward with the ruler open.
		await page.locator('.insights-container .block-conclusion .try-key').first().click();
		const use = page.getByRole('button', { name: 'Use this key' });
		await expect(use).toBeVisible({ timeout: 15_000 });
		// Cancel: leaving MELODY closes the ruler, and INSIGHTS is as it was.
		await page.locator('#tab-insights').click();
		await expect(page.locator('.insights-container .block-conclusion').first()).toBeVisible();
		expect(await page.locator('.insights-container .paper-page').first().innerText()).toBe(before);
		// Step 4: use the key. Step 5: back on INSIGHTS, the page reads the song in it.
		await page.locator('.insights-container .block-conclusion .try-key').first().click();
		await expect(use).toBeVisible({ timeout: 15_000 });
		await use.click();
		await page.locator('#tab-insights').click();
		await expect(page.locator('.insights-container .block-conclusion').first()).toBeVisible();
		await page.waitForTimeout(1_500);
		const after = await page.locator('.insights-container .paper-page').first().innerText();
		expect(after).not.toBe(before);
	});
});
