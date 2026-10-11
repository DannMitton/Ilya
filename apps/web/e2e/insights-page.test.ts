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
	await expect(page.locator('.insights-container .paper-page .pitch-seconds svg').first()).toBeVisible({ timeout: 20_000 });
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

test('the page runs the frame, the conclusion, then the moments, the totals, and the sources, and nothing reaches a footer', async ({ page }) => {
	await openInsights(page, 'en');
	// Round 2's order (QUEUE row 66; `PRODUCT.md`, "How an Insights page is organized").
	const text = (await page.locator('.insights-container').innerText()).replace(/\s+/g, ' ');
	const order = ['Ilya does not invent advice', 'How this key sits for you', 'The measures behind these reasons'].map((w) => text.indexOf(w));
	expect(order.every((i) => i >= 0), JSON.stringify(order)).toBe(true);
	expect([...order].sort((a, b) => a - b)).toEqual(order);
	const moments = text.indexOf('Where this piece meets your voice');
	if (moments >= 0) {
		expect(moments).toBeGreaterThan(order[1]);
		expect(moments).toBeLessThan(order[2]);
	}
	// "Collisions and overlaps are forbidden" (Dann, 2026-10-11 03:42): on every page, the last block ends above the footer's top.
	const over = await page.evaluate(() =>
		[...document.querySelectorAll('.insights-container .paper-page')].map((p) => {
			const page = p.getBoundingClientRect();
			const foot = (p.querySelector('.page-footer') as HTMLElement).getBoundingClientRect();
			const blocks = [...p.querySelectorAll('.column .block, .column .squircle')].map((b) => b.getBoundingClientRect().bottom);
			return { gap: foot.top - Math.max(...blocks), inside: Math.max(...blocks) <= page.bottom };
		}),
	);
	expect(over.length).toBeGreaterThan(0);
	for (const [n, o] of over.entries()) {
		expect(o.gap, `page ${n + 1}: room between the last block and the footer`).toBeGreaterThan(0);
		expect(o.inside).toBe(true);
	}
});

test('no label of the pitch chart touches another label, a bar, or a line, in either language', async ({ page }) => {
	for (const language of ['en', 'fr'] as const) {
		await openInsights(page, language);
		const counts = await page.evaluate(() => {
			const svg = document.querySelector('.insights-container .pitch-seconds svg') as SVGSVGElement;
			type B = { x: number; y: number; width: number; height: number };
			// The glyphs' box, as the old figure's test measured it: ascent .74 and descent .25 of the size, from the baseline.
			const labels = [...svg.querySelectorAll('text')].map((t) => {
				const bb = t.getBBox();
				const y = +t.getAttribute('y')!;
				const size = parseFloat(getComputedStyle(t).fontSize);
				return { t: (t.textContent ?? '').trim(), b: { x: bb.x, y: y - 0.74 * size, width: bb.width, height: 0.99 * size } as B };
			});
			const bars = [...svg.querySelectorAll('rect.bar')].map((r) => (r as SVGGraphicsElement).getBBox() as B);
			const lines = [...svg.querySelectorAll('line, path')].map((l) => (l as SVGGraphicsElement).getBBox() as B);
			const hit = (a: B, b: B) => a.x < b.x + b.width - 0.25 && b.x < a.x + a.width - 0.25 && a.y < b.y + b.height - 0.25 && b.y < a.y + a.height - 0.25;
			let textText = 0, textBar = 0, textLine = 0, lineBar = 0;
			labels.forEach((a, i) => {
				for (let j = i + 1; j < labels.length; j++) if (hit(a.b, labels[j].b)) textText++;
				for (const b of bars) if (hit(a.b, b)) textBar++;
				for (const l of lines) if (hit(a.b, { ...l, height: Math.max(l.height, 1) })) textLine++;
			});
			// A passaggio's dashed line runs between two rows, never through a bar.
			for (const l of [...svg.querySelectorAll('line.passaggio')].map((x) => (x as SVGGraphicsElement).getBBox() as B))
				for (const b of bars) if (hit({ ...l, height: Math.max(l.height, 1) }, b)) lineBar++;
			return { labels: labels.length, textText, textBar, textLine, lineBar };
		});
		expect(counts.labels, language).toBeGreaterThan(5);
		expect([counts.textText, counts.textBar, counts.textLine, counts.lineBar], `${language}: text-text, text-bar, text-line, line-bar`).toEqual([0, 0, 0, 0]);
	}
});
