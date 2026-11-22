import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/*
 * LANE 80 (QUEUE row 202): ONE FRAME FOR THE CONTENT OF TEXT, MELODY, AND INSIGHTS. Not a test file itself (no `.test.ts`); `e2e/one-frame.test.ts` runs it in the
 * chromium project at 1024 and `e2e-phone/one-frame.test.ts` at 390.
 *
 * Opens a real score (Tchaikovsky op. 38 no. 3: three pages of TEXT, three of MELODY, six of INSIGHTS) and a typed text carrying a Latin word (the Richter credit)
 * in both languages, and reads every page of the three documents in SHEET px (a client box divided by the sheet's scale, since `PageFit` transforms the sheet under
 * 1400 px). It asserts the window ELEMENT's box (`.page-content`, `.score-window`, `.column`), never first ink; first ink is reported by `measure.mjs`.
 *
 * Voice: a bass called "Voice 1". No fixture here names or describes a person.
 */
const FIX = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures');
export const TCHAIKOVSKY = `${FIX}/tchaikovsky-op38-3-voice.musicxml`;
export const LATIN_TEXT = 'sanguis atque caulis\nелка зеленый ежик\nмама мыла раму';
export const LONG_TEXT = Array.from({ length: 70 }, (_, i) => (i === 0 ? 'sanguis atque caulis' : 'елка зеленый ежик мама мыла раму')).join('\n');
const NOW = '2026-11-21T10:00:00.000Z';
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const F: Record<string, [number, number]> = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
function voice() {
	const formants: Record<string, unknown> = {};
	for (const [v, [f1, f2]] of Object.entries(F)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	return JSON.stringify({ version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Voice 1', createdAt: NOW, updatedAt: NOW, calibratedAt: NOW, formants, voiceType: 'bass', characteristics: { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' } }] });
}

export type Doc = 'text' | 'markup' | 'insights';
export interface PageRead {
	sheetW: number;
	sheetH: number;
	winL: number;
	winR: number;
	winT: number;
	winB: number;
	ruleB: number;
	hairFromBottom: number;
	footL: number;
	footR: number;
	footTop: number;
	summariesB: number[];
	lines: number[];
	rowsBelowWindow: number;
}

export async function open(page: Page, language: 'en' | 'fr', source: { file: string } | { text: string }) {
	await page.addInitScript(([l, s]) => { localStorage.setItem('ilya:language', l); localStorage.setItem('shane.profiles.v2', s); }, [language, voice()] as const);
	await page.goto('/');
	await expect(page.locator('textarea.text-input')).toBeEnabled({ timeout: 60_000 });
	if ('file' in source) {
		await page.locator('input[type="file"].hidden-input').setInputFiles(source.file);
		await page.waitForTimeout(8000);
	} else {
		// Set the field and tell the page, rather than type: below 1400 px the field is off screen, where a real focus and keystrokes do not reach it.
		await page.evaluate((text) => {
			(document.querySelector('#intake-tab-lyrics') as HTMLElement | null)?.click();
			const ta = document.querySelector('textarea.text-input') as HTMLTextAreaElement;
			ta.value = text;
			ta.dispatchEvent(new Event('input', { bubbles: true }));
		}, source.text);
		await page.waitForTimeout(3000);
	}
}

/** Every visible page of one document, in sheet px, once the layout has stopped moving. */
export async function readDoc(page: Page, doc: Doc): Promise<PageRead[]> {
	await page.evaluate((d) => (document.querySelector(`#tab-${d}`) as HTMLElement | null)?.click(), doc);
	await page.waitForTimeout(doc === 'markup' ? 12_000 : 8000);
	const read = () =>
		page.evaluate((d) => {
			const windowSel = d === 'text' ? '.page-content' : d === 'markup' ? '.score-window' : '.column';
			const out: unknown[] = [];
			for (const pg of document.querySelectorAll<HTMLElement>('.paper-page')) {
				if (pg.getClientRects().length === 0) continue;
				const win = pg.querySelector<HTMLElement>(windowSel);
				if (!win) continue;
				const pr = pg.getBoundingClientRect();
				const k = pr.width / pg.offsetWidth;
				const y = (v: number) => (v - pr.top) / k;
				const x = (v: number) => (v - pr.left) / k;
				const w = win.getBoundingClientRect();
				const rule = pg.querySelector('.header-rule, .header-underline')!.getBoundingClientRect();
				const foot = pg.querySelector('.page-footer')!.getBoundingClientRect();
				const hair = pg.querySelector('.footer-hairline')!.getBoundingClientRect();
				const words = [...pg.querySelectorAll('[data-word-index]')].map((e) => Number(e.getAttribute('data-word-index')!.split('-')[0]));
				out.push({
					sheetW: pg.offsetWidth, sheetH: pg.offsetHeight,
					winL: x(w.left), winR: x(w.right), winT: y(w.top), winB: y(w.bottom),
					ruleB: y(rule.bottom), hairFromBottom: pg.offsetHeight - y(hair.top),
					footL: x(foot.left), footR: x(foot.right), footTop: y(foot.top),
					summariesB: [...pg.querySelectorAll('summary')].filter((s) => s.getClientRects().length > 0).map((s) => y(s.getBoundingClientRect().bottom)),
					lines: [...new Set(words)],
					rowsBelowWindow: [...pg.querySelectorAll('.verse-row')].filter((r) => y(r.getBoundingClientRect().bottom) > y(w.bottom) + 0.5).length,
				});
			}
			return out;
		}, doc) as Promise<PageRead[]>;
	let last = '';
	let got: PageRead[] = [];
	for (let i = 0; i < 30; i++) {
		got = await read();
		const sig = JSON.stringify(got);
		if (sig === last) break;
		last = sig;
		await page.waitForTimeout(1200);
	}
	expect(got.length, `${doc}: pages drawn`).toBeGreaterThan(0);
	return got;
}

const near = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

/** What one frame means, asserted on every page of one document. */
export function assertFrame(label: string, doc: Doc, pages: PageRead[]) {
	pages.forEach((p, n) => {
		const at = `${label} ${doc} page ${n + 1}`;
		expect(p.sheetW, `${at} sheet width`).toBe(816);
		expect(p.sheetH, `${at} sheet height`).toBe(1056);
		// One right edge (720) on all three, and one left edge: the frame's 96, where TEXT's window box sits 8 left of it (88) by the word stack's own 4 and its own padLeft 4.
		expect(near(p.winR, 720, 0.05), `${at} window right edge ${p.winR}`).toBe(true);
		expect(near(p.winL, doc === 'text' ? 88 : 96, 0.05), `${at} window left edge ${p.winL}`).toBe(true);
		// One gap under the rule.
		expect(near(p.winT - p.ruleB, 16, 0.5), `${at} gap under the rule ${p.winT - p.ruleB}`).toBe(true);
		// The footer's own box is the margins'.
		expect(near(p.footL, 96, 0.05) && near(p.footR, 720, 0.05), `${at} footer box ${p.footL}, ${p.footR}`).toBe(true);
		// TEXT and MELODY: the window ends 16 above the footer it reserved, or higher (TEXT reserves the whole document's footer, which a page's own cannot exceed).
		if (doc !== 'insights') expect(p.footTop - p.winB, `${at} gap above the footer`).toBeGreaterThanOrEqual(16 - 0.5);
		// INSIGHTS: nothing, a closed summary included, ends below the window's bottom: 16 above the footer.
		if (doc === 'insights') for (const b of p.summariesB) expect(b, `${at} a summary ends ${b}, the window ends ${p.footTop - 16}`).toBeLessThanOrEqual(p.footTop - 16 + 0.5);
	});
}

/** The divider: the same distance from the sheet's bottom edge on every page of every document. */
export function assertDivider(label: string, byDoc: Record<string, PageRead[]>, expected?: number) {
	const all = Object.entries(byDoc).flatMap(([doc, ps]) => ps.map((p, n) => ({ at: `${label} ${doc} page ${n + 1}`, d: p.hairFromBottom })));
	const first = expected ?? all[0].d;
	for (const { at, d } of all) expect(near(d, first, 0.05), `${at} divider ${d} from the bottom, expected ${first}`).toBe(true);
	return first;
}

/** TEXT loses nothing: every line number once, in order, and no row ends below its window. */
export function assertNoContentLost(label: string, pages: PageRead[], total: number) {
	const seen = pages.flatMap((p) => p.lines);
	expect(seen, `${label} every line number exactly once, in order`).toEqual(Array.from({ length: total }, (_, i) => i));
	pages.forEach((p, n) => expect(p.rowsBelowWindow, `${label} page ${n + 1} rows ending below the window`).toBe(0));
}

for (const language of ['en', 'fr'] as const) {
	test(`a real score, ${language}: TEXT, MELODY, and INSIGHTS share one frame on every page, and TEXT loses no line`, async ({ page }) => {
		test.setTimeout(240_000);
		await open(page, language, { file: TCHAIKOVSKY });
		const byDoc: Record<string, PageRead[]> = {};
		for (const doc of ['text', 'markup', 'insights'] as const) {
			byDoc[doc] = await readDoc(page, doc);
			expect(byDoc[doc].length, `${doc}: a later page to measure`).toBeGreaterThan(1);
			assertFrame(language, doc, byDoc[doc]);
		}
		assertNoContentLost(`${language} text`, byDoc.text, 20);
		assertDivider(language, byDoc);
	});

	test(`a text with a Latin word, ${language}: the Richter credit sits above the divider and the divider does not move`, async ({ page }) => {
		test.setTimeout(240_000);
		await open(page, language, { text: LONG_TEXT });
		const pages = await readDoc(page, 'text');
		expect(pages.length, 'more than one page').toBeGreaterThan(1);
		assertFrame(language, 'text', pages);
		assertNoContentLost(`${language} text`, pages, 70);
		// Measured 2026-11-21 (`measure.mjs`, step 0): 114 on every page in both languages, and 133 on a page carrying the credit before this lane.
		assertDivider(language, { text: pages }, 114);
		const credit = await page.evaluate(() => {
			const pg = document.querySelector('.paper-page')!;
			const c = pg.querySelector('.richter-credit');
			const hair = pg.querySelector('.footer-hairline')!.getBoundingClientRect();
			return { present: !!c, above: !!c && c.getBoundingClientRect().bottom <= hair.top + 0.5, inRow: /Richter/.test(pg.querySelector('.footer-content')!.textContent ?? '') };
		});
		expect(credit, 'the credit is the band\u2019s last line, not in the row under the divider').toEqual({ present: true, above: true, inRow: false });
	});
}
