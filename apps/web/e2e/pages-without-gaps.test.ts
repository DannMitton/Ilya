import { test, expect, type Page } from '@playwright/test';
import path from 'path';

/*
 * ILYA CHECKS ITSELF (QUEUE row 79; Dann 2026-10-11 21:50, `PRODUCT.md` "No
 * empty space mid-document", rule 6): on the tracked fixtures, every page but
 * the last of Text, Markup, and Insights, in English and French, is at most 15
 * percent empty above its footer (DESK DEFAULT). The page is measured as drawn,
 * since a page can pass its arithmetic and still be wrong on paper.
 *
 * A PAGE THE RULES COULD NOT FILL IS NOT A FAILURE, AND IT IS NAMED. Where the
 * next page's first item (a system, a row, or a block that may not break, or
 * one that breaking would leave with fewer than two lines) needs more than the
 * page's room, the page is reported as FULL with the numbers, not failed. On
 * Markup that room counts the slack its gaps already took above the floor, so a
 * page whose gaps stand at the maximum (rule 4) reads CAPPED.
 */
test.use({ viewport: { width: 1440, height: 1300 } });

const FIX = path.resolve(process.cwd(), 'src/lib/score/ingestion/fixtures');
const SONGS = { 'Without Sun, no. 1': `${FIX}/sunless-01-engraved.musicxml`, 'Tchaikovsky Op. 38 no. 3': `${FIX}/tchaikovsky-op38-3-voice.musicxml` };
const LIMIT = 0.15;
const P = (step: string, octave: number, alter = 0) => ({ step, octave, alter });
const FORMANTS: Record<string, [number, number]> = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [240, 800] };
function storedVoice() {
	const formants: Record<string, unknown> = {};
	for (const [v, [f1, f2]] of Object.entries(FORMANTS)) formants[v] = { f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', plausibility: 'plausible' };
	const now = '2026-09-27T12:00:00.000Z';
	return { version: 2, activeId: 'v', voices: [{ id: 'v', name: 'Dann', createdAt: now, updatedAt: now, calibratedAt: now, formants, voiceType: 'bass', characteristics: { rangeLow: P('B', 1, -1), rangeHigh: P('F', 4, 1), tessituraLow: P('B', 2), tessituraHigh: P('B', 3, -1), passaggioPrimary: P('A', 3), passaggioSecondary: P('D', 4, 1), source: 'manual' } }] };
}

interface Measured {
	content: number;
	empty: number;
	/** Room the page could still give: its empty space, plus its system gaps above the floor (Markup). */
	room: number;
	/** What the page's first item needs, with its gap. */
	first: number;
}

async function measure(page: Page): Promise<Measured[]> {
	return page.locator('.paper-page:visible').evaluateAll((pages) =>
		pages.map((pg) => {
			const pr = pg.getBoundingClientRect();
			const rel = (r: DOMRect) => ({ t: r.top - pr.top, b: r.bottom - pr.top });
			const skip = (e: Element) => e.closest('.page-footer, .running-header, .tab-mark') || (e.closest('details:not([open])') && !e.closest('summary'));
			let top = Infinity;
			let bottom = -Infinity;
			for (const e of pg.querySelectorAll('*')) {
				if (skip(e) || (e.children.length > 0 && !(e instanceof SVGElement)) || (e instanceof SVGElement && e.tagName !== 'svg')) continue;
				const cs = getComputedStyle(e);
				if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
				const r = e.getBoundingClientRect();
				if (r.width < 1 || r.height < 1 || r.height > pr.height * 0.95) continue;
				const q = rel(r);
				const clip = e.closest('.part');
				if (clip) {
					const c = rel(clip.getBoundingClientRect());
					q.t = Math.max(q.t, c.t);
					q.b = Math.min(q.b, c.b);
					if (q.b <= q.t) continue;
				}
				top = Math.min(top, q.t);
				bottom = Math.max(bottom, q.b);
			}
			const head = pg.querySelector('.running-header');
			const contentTop = head ? rel(head.getBoundingClientRect()).b : top;
			let footer = pr.height;
			for (const c of pg.querySelectorAll('.page-footer .apparatus > *, .page-footer .provenance-legend, .page-footer .broad-legend, .page-footer .footer-hairline')) {
				const r = c.getBoundingClientRect();
				if (r.height > 0) footer = Math.min(footer, r.top - pr.top);
			}
			const systems = [...pg.querySelectorAll('svg[data-system]')].map((s) => rel(s.getBoundingClientRect()));
			const gaps = systems.slice(1).map((s, k) => s.t - systems[k].b);
			// Insights: the first BLOCK, not its whole squircle; a squircle adds its border and padding (17 px each edge).
			const firstEl = pg.querySelector('.column > :first-child');
			const block = firstEl?.classList.contains('squircle') ? firstEl.firstElementChild : firstEl;
			const items = systems.length ? systems : block ? [rel(block.getBoundingClientRect())] : [...pg.querySelectorAll('.verse-line')].map((e) => rel(e.getBoundingClientRect()));
			const first = items.length ? items[0].b - items[0].t + (block && block !== firstEl ? 34 : 0) : 0;
			const floor = gaps.length ? Math.min(...gaps) : 0;
			// Insights keeps 40 px clear above its footer (`CLEAR`, row 66's standard) and 16 px between segments: not room.
			const reserved = pg.classList.contains('insights-page') ? 40 + 16 : 0;
			return { content: footer - contentTop, empty: footer - bottom, room: footer - bottom - reserved + gaps.reduce((t, g) => t + (g - floor), 0), first: first + floor };
		}),
	);
}

for (const [song, file] of Object.entries(SONGS)) {
	for (const doc of ['text', 'markup', 'insights'] as const) {
		for (const language of ['en', 'fr'] as const) {
			test(`${song}, ${doc}, ${language}: no page but the last is more than 15 percent empty`, async ({ page }) => {
				test.setTimeout(180_000);
				await page.addInitScript(([l, s]) => {
					localStorage.setItem('ilya:language', l);
					localStorage.setItem('shane.profiles.v2', s);
				}, [language, JSON.stringify(storedVoice())]);
				await page.goto('/');
				await page.locator('input[type="file"].hidden-input').setInputFiles(file);
				await page.waitForTimeout(8000);
				await page.evaluate((d) => (document.querySelector(`#tab-${d}`) as HTMLElement | null)?.click(), doc);
				await page.waitForTimeout(doc === 'markup' ? 10_000 : 7000);
				const pages = await measure(page);
				expect(pages.length).toBeGreaterThan(0);
				const failures: string[] = [];
				pages.slice(0, -1).forEach((p, n) => {
					const share = p.empty / p.content;
					if (share <= LIMIT) return;
					const next = pages[n + 1];
					const label = `${song}, ${doc}, ${language}, page ${n + 1}: ${Math.round(share * 1000) / 10} percent empty (${Math.round(p.empty)} px)`;
					if (next.first > p.room) {
						console.log(`${doc === 'markup' && p.room > p.empty ? 'CAPPED' : 'FULL'}: ${label}; page ${n + 2}'s first item needs ${Math.round(next.first)} px, the page has ${Math.round(p.room)}`);
					} else failures.push(label);
				});
				expect(failures, failures.join('\n')).toEqual([]);
			});
		}
	}
}
