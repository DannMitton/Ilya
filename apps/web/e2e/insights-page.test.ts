import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/*
 * THE INSIGHTS PAGE, REARRANGED (Dann's walk, 2026-10-09; `OPEN.md` "THE INSIGHTS
 * PAGE, REARRANGED"; QUEUE row 60). Opens the one tracked engraved fixture with
 * a stored voice that has typed range, tessitura, and passaggi (the figure draws
 * its band, its lines, and its shares only then), and checks the page as drawn:
 * the compass is a small stave in the header's top-right corner, in the same
 * place whatever the language or the clef; the sections run in the ruled order;
 * the closing verdict has its own heading; and no label of the histogram touches
 * another label, a bar, or a line. The label count measures the live render with
 * the layout's own box convention (ascent .74 and descent .25 of the size, from
 * the baseline), because a figure can pass its own test and still be wrong on
 * paper.
 */
test.use({ viewport: { width: 1440, height: 1300 } });

const FIXTURE = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml');
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const FORMANTS: Record<string, [number, number]> = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [320, 800] };

function storedVoice(voiceType: string) {
	const formants: Record<string, unknown> = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = new Date().toISOString();
	return {
		version: 2,
		activeId: 'v-test',
		voices: [
			{
				id: 'v-test',
				name: 'Dann',
				createdAt: now,
				updatedAt: now,
				calibratedAt: now,
				formants,
				voiceType,
				characteristics: { rangeLow: P('D', 2), rangeHigh: P('F', 4), tessituraLow: P('G', 2), tessituraHigh: P('D', 4), passaggioPrimary: P('A', 3), passaggioSecondary: P('E', 4, -1), source: 'manual' },
			},
		],
	};
}

async function openInsights(page: Page, language: 'en' | 'fr', voiceType = 'bass') {
	await page.addInitScript(
		([lang, store]) => {
			try {
				localStorage.setItem('ilya:language', lang);
				localStorage.setItem('shane.profiles.v2', store);
			} catch {
				/* a blocked store leaves the page to render without a voice */
			}
		},
		[language, JSON.stringify(storedVoice(voiceType))] as const,
	);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 45_000 });
	await page.locator('input[type="file"].hidden-input').setInputFiles(FIXTURE);
	await expect(page.locator('.receipt-score')).toBeVisible({ timeout: 20_000 });
	await page.locator('#tab-insights').click();
	await expect(page.locator('.insights-container .paper-page svg.tessituragram').first()).toBeVisible({ timeout: 20_000 });
	await page.waitForTimeout(1_500);
}

const pageBox = async (page: Page) => (await page.locator('.insights-container .paper-page').first().boundingBox())!;

test('the compass is a small stave in the top-right corner, in the same place in both languages and on both clefs', async ({ page, browser }) => {
	await openInsights(page, 'en');
	const p1 = await pageBox(page);
	const stave = page.locator('.insights-container .paper-page svg.compass-stave').first();
	await expect(stave).toBeVisible();
	const box = (await stave.boundingBox())!;
	// Right-aligned to the content edge (the page's 96 px margin), top at the header's top (48 px).
	expect(Math.abs(box.x + box.width - (p1.x + p1.width - 96))).toBeLessThanOrEqual(1);
	expect(Math.abs(box.y - (p1.y + 48))).toBeLessThanOrEqual(2);
	// Small: the old compass stave stood several times the size of the score's notation.
	expect(box.width).toBeLessThan(160);
	expect(box.height).toBeLessThan(110);
	await expect(stave).toContainText(/Compass .+ to .+/);

	// Same corner in French, and for a tenor (a treble clef would draw there).
	for (const [lang, type] of [['fr', 'bass'], ['en', 'tenor']] as const) {
		const ctx = await browser.newContext({ viewport: { width: 1440, height: 1300 } });
		const other = await ctx.newPage();
		await openInsights(other, lang, type);
		const q = await pageBox(other);
		const b = (await other.locator('.insights-container .paper-page svg.compass-stave').first().boundingBox())!;
		expect(Math.abs(b.x + b.width - (q.x + q.width - 96))).toBeLessThanOrEqual(1);
		expect(Math.abs(b.y - (q.y + 48))).toBeLessThanOrEqual(2);
		await ctx.close();
	}
});

test('page one runs phonation, compatibility, the closing verdict, then the findings, then the cycle dose, and fits above its foot', async ({ page }) => {
	await openInsights(page, 'en');
	const headings = await page.locator('.insights-container .paper-page').first().locator('.section-head, .section h2, .section .head').allTextContents();
	const text = (await page.locator('.insights-container .paper-page').first().innerText()).replace(/\s+/g, ' ');
	const order = ['Phonation time', 'compatibility from these three measurements', 'How this key sits for you'].map((w) => text.toLowerCase().indexOf(w.toLowerCase()));
	expect(order.every((i) => i >= 0), `the three headings are on page one: ${JSON.stringify(headings)}`).toBe(true);
	expect([...order].sort((a, b) => a - b)).toEqual(order);
	// The histogram sits between the phonation sentence and the compatibility table.
	const y = async (sel: string) => (await page.locator(`.insights-container .paper-page >> nth=0 >> ${sel}`).first().boundingBox())?.y ?? NaN;
	const figure = await y('svg.tessituragram');
	const table = await y('.fit-table');
	expect(figure).toBeLessThan(table);
	// The phonation sentence is no longer the page's first prose: the figure leads it.
	const phonation = (await page.locator('.insights-container .paper-page >> nth=0 >> text=/^Phonation time$/i').first().boundingBox())!.y;
	expect(figure).toBeLessThan(phonation);
	expect(phonation).toBeLessThan(table);
	const verdict = await y('.verdict');
	expect(table).toBeLessThan(verdict);
	// Where findings are listed their list follows the verdict; the cycle dose comes after them, last on the page's flow.
	const dose = page.locator('.insights-container .paper-page >> nth=0 >> .dose');
	if (await dose.count()) {
		expect(verdict).toBeLessThan((await dose.first().boundingBox())!.y);
		const flagged = page.locator('.insights-container .paper-page >> nth=0 >> text=/What is flagged/i');
		if (await flagged.count()) expect((await flagged.first().boundingBox())!.y).toBeLessThan((await dose.first().boundingBox())!.y);
	}
	// The squircle's bottom clears the foot.
	const over = await page.evaluate(() => {
		const p = document.querySelector('.insights-container .paper-page') as HTMLElement;
		const sq = p.querySelector('.squircle') as HTMLElement;
		const foot = p.querySelector('.insights-foot') as HTMLElement;
		return sq.offsetTop + sq.offsetHeight - foot.offsetTop;
	});
	expect(over).toBeLessThanOrEqual(0);
});

test('no label of the histogram touches another label, a bar, or a line, in either language', async ({ page }) => {
	for (const language of ['en', 'fr'] as const) {
		await openInsights(page, language);
		const counts = await page.evaluate(() => {
			const svg = document.querySelector('.insights-container .paper-page svg.tessituragram') as SVGSVGElement;
			type B = { x: number; y: number; width: number; height: number };
			const labels = [...svg.querySelectorAll('text')]
				.map((t) => {
					const bb = t.getBBox();
					const y = +t.getAttribute('y')!;
					const size = +(t.getAttribute('font-size') ?? 10);
					const glyph = /[-]/.test(t.textContent ?? '');
					return { t: (t.textContent ?? '').trim(), glyph, b: { x: bb.x, width: bb.width, y: y - 0.74 * size, height: 0.99 * size } as B };
				})
				.filter((l) => l.t && !l.glyph && l.b.y > 8);
			const bars = [...svg.querySelectorAll('rect')]
				.filter((r) => !r.getAttribute('opacity') || r.getAttribute('opacity') === '1')
				.map((r) => ({ x: +r.getAttribute('x')!, y: +r.getAttribute('y')!, width: +r.getAttribute('width')!, height: +r.getAttribute('height')! }))
				.filter((r) => r.width > 18);
			const lines = [...svg.querySelectorAll('line')].map((l) => {
				const x1 = +l.getAttribute('x1')!, x2 = +l.getAttribute('x2')!, y1 = +l.getAttribute('y1')!, y2 = +l.getAttribute('y2')!;
				return { x1, x2, y1, y2 };
			});
			const hit = (a: B, b: B) => a.x < b.x + b.width - 0.25 && b.x < a.x + a.width - 0.25 && a.y < b.y + b.height - 0.25 && b.y < a.y + a.height - 0.25;
			let textText = 0, textBar = 0, textLine = 0;
			labels.forEach((a, i) => {
				for (let j = i + 1; j < labels.length; j++) if (hit(a.b, labels[j].b)) textText++;
				for (const b of bars) if (hit(a.b, b)) textBar++;
				for (const l of lines) {
					// Horizontal and vertical rules only: a leader is a line a label's own run ends short of.
					if (Math.abs(l.y1 - l.y2) < 0.01) {
						if (hit(a.b, { x: Math.min(l.x1, l.x2) - 0.5, y: l.y1 - 0.5, width: Math.abs(l.x2 - l.x1) + 1, height: 1 })) textLine++;
					}
				}
			});
			return { labels: labels.length, textText, textBar, textLine };
		});
		expect(counts.labels, language).toBeGreaterThan(5);
		expect([counts.textText, counts.textBar, counts.textLine], `${language}: text-text, text-bar, text-line`).toEqual([0, 0, 0]);
	}
});
