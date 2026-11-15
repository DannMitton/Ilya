/**
 * L17 (closing polish lane): INSIGHTS' pitch figure prints the label of the singer's comfortable working zone whole, on a phone, in both languages.
 * `insights.r2.yourTessitura` is SVG text (`insights/PitchSeconds.svelte`), which does not wrap, so the figure cuts it into `<tspan>` lines at word
 * spaces from widths measured in the page's real font. At 390 x 844 this asserts, for English and French and for a typed zone of five and of two
 * semitones (the tallest stack beside the shortest bracket): the right edge of every line is at or left of the figure's right edge, no line is
 * above or below the figure, and the lines' words, joined, are the ratified string.
 */
import { test, expect, type Page } from '@playwright/test';
import { waitForDictionary } from '../e2e/helpers';

const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const F1: Record<string, number> = { i: 280, e: 400, 'ɪ': 360, 'ɨ': 320, 'ɛ': 500, a: 700, 'ɑ': 680, 'ʌ': 560, o: 450, u: 300 };
const formants = Object.fromEntries(Object.entries(F1).map(([v, f1]) => [v, { f1, confidence: 'high', reading: 'captured', source: 'measured-user' }]));
const store = (high: ReturnType<typeof P>) => JSON.stringify({
	version: 2, activeId: 'v',
	voices: [{ id: 'v', name: 'Test voice', createdAt: '2026-09-27T00:00:00.000Z', updatedAt: '2026-09-27T00:00:00.000Z', formants,
		characteristics: { source: 'manual', rangeLow: P('E', 3), rangeHigh: P('A', 4), tessituraLow: P('G', 3), tessituraHigh: high, passaggioPrimary: P('G', 3), passaggioSecondary: P('B', 3) } }],
});
const LABEL = { en: 'your comfortable working zone, typed', fr: 'votre zone de travail confortable, telle que vous l’avez indiquée' } as const;
const FIXTURE = 'src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml';

async function open(page: Page, lang: 'en' | 'fr', high: ReturnType<typeof P>) {
	await page.addInitScript((s) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('shane.profiles.v2', s); sessionStorage.setItem('seeded', '1'); } }, store(high));
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await waitForDictionary(page);
	if (lang === 'fr') await page.locator('.lang-pill').click();
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.waitForSelector('[data-word-index="0-0"]', { timeout: 20_000 });
	await page.locator('#tab-insights').click();
	await page.waitForSelector('.bracket-label tspan', { state: 'attached', timeout: 20_000 });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(1500);
}

for (const lang of ['en', 'fr'] as const) {
	for (const [name, high] of [['five semitones, G3 to D4', P('D', 4)], ['two semitones, G3 to A3', P('A', 3)]] as const) {
		test(`the comfortable-zone label stays inside the figure at 390 px, ${lang}, ${name}`, async ({ page }) => {
			await open(page, lang, high);
			const m = await page.evaluate(() => {
				const svg = [...document.querySelectorAll('.pitch-seconds svg')].find((e) => e.getBoundingClientRect().left > -1000)!;
				const s = svg.getBoundingClientRect();
				const lines = [...svg.querySelectorAll('.bracket-label tspan')].map((t) => { const r = t.getBoundingClientRect(); return { text: t.textContent ?? '', right: r.right, top: r.top, bottom: r.bottom }; });
				return { svgRight: s.right, svgTop: s.top, svgBottom: s.bottom, lines };
			});
			if (process.env.L17_SHOTS) { await page.evaluate(() => [...document.querySelectorAll('.pitch-seconds')].find((e) => e.getBoundingClientRect().left > -1000)!.scrollIntoView({ block: 'center' })); await page.waitForTimeout(500); await page.screenshot({ path: `${process.env.L17_SHOTS}/after-${lang}-${name.split(',')[0].replace(/ /g, '-')}.png` }); }
			const clash = await page.evaluate(() => { const svg = [...document.querySelectorAll('.pitch-seconds svg')].find((e) => e.getBoundingClientRect().left > -1000)!; const L = [...svg.querySelectorAll('.bracket-label tspan')].map((t) => t.getBoundingClientRect()); const O = [...svg.querySelectorAll('text.line-name, text.name')].map((t) => t.getBoundingClientRect()); return L.flatMap((a) => O.filter((b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top).map((b) => Math.round(b.left))).length; });
			expect(clash, 'the label lines overlap no other text in the figure').toBe(0);
			expect(m.lines.length).toBeGreaterThan(0);
			for (const l of m.lines) {
				expect(l.right, `"${l.text}" ends at or left of the figure's right edge`).toBeLessThanOrEqual(m.svgRight + 0.5);
				expect(l.top, `"${l.text}" is not above the figure`).toBeGreaterThanOrEqual(m.svgTop - 0.5);
				expect(l.bottom, `"${l.text}" is not below the figure`).toBeLessThanOrEqual(m.svgBottom + 0.5);
			}
			expect(m.lines.map((l) => l.text).join(' ')).toBe(LABEL[lang]);
			console.log(`label ${lang} (${name}): ${m.lines.length} line(s), widest right edge ${Math.max(...m.lines.map((l) => l.right)).toFixed(1)} against figure right ${m.svgRight.toFixed(1)}: ${JSON.stringify(m.lines.map((l) => l.text))}`);
		});
	}
}
