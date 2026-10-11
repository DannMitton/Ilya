/**
 * markup-pages.test.ts: Markup's pages lose no bars (QUEUE row 72).
 *
 * THE FAULT WAS IN THE STYLESHEET, NOT THE PAGINATION. `paginateScore` placed
 * every system inside its page; the rule `.score-window :global(svg)` then
 * matched each NESTED system `<svg>` too, and its `height: auto` outranked the
 * system's `height` attribute, so each system grew to the page's height and
 * centred its staff in it. On the Tchaikovsky song page 1 drew three systems
 * after a tall empty band and lost bars 26 to 41 below the footer.
 *
 * So two checks: the stylesheet sizes the page's own `<svg>` only (this fails
 * on the old rule), and the pagination over every score in the tree puts every
 * bar on exactly one page, each system inside its page. The browser check on
 * the live page is `e2e/markup-pages-lose-no-bars.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeScore, MusicXmlScoreParser, paginateScore, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ENGRAVING_DEFAULTS } from '$lib/score/engraving';

const PANE = fileURLToPath(new URL('./MarkupPane.svelte', import.meta.url));
const ROOT = fileURLToPath(new URL('../../../../../', import.meta.url));

describe('the stylesheet sizes the page, never a system inside it', () => {
	const style = readFileSync(PANE, 'utf8').split('<style>')[1] ?? '';
	const rules = [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim(), body: m[2] }));

	it('finds the score window’s svg rule', () => {
		expect(rules.some((r) => r.selector.includes('.score-window') && /svg/.test(r.selector))).toBe(true);
	});

	it('every rule that sizes an svg in the score window reaches the page’s svg alone (a child selector)', () => {
		for (const r of rules.filter((x) => x.selector.includes('.score-window') && /svg/.test(x.selector) && /\b(width|height)\s*:/.test(x.body))) {
			for (const sel of r.selector.split(',')) {
				if (!sel.includes('.score-window')) continue;
				expect(sel.replace(/\s+/g, ' ').trim(), 'a descendant selector would size the nested systems too').toMatch(/\.score-window\s*>\s*:global\(svg\)$/);
			}
		}
	});
});

/** Every tracked `.musicxml` under the repository, outside dependencies. */
function scores(dir: string, out: string[] = []): string[] {
	for (const name of readdirSync(dir)) {
		if (name === 'node_modules' || name.startsWith('.')) continue;
		const p = join(dir, name);
		if (statSync(p).isDirectory()) scores(p, out);
		else if (name.endsWith('.musicxml')) out.push(p);
	}
	return out;
}

async function parse(path: string): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(readFileSync(path, 'utf8')) as unknown as Document } as never);
	return res.score;
}

// Markup's own geometry: the content column, a page 1 window of a typical
// height, no inner margins (MarkupPane.svelte, `paginateScore`'s call).
const GEOMETRY = { pageWidth: 624, pageHeight: 727, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, ...ENGRAVING_DEFAULTS };

describe('every bar on exactly one page, every system inside its page', () => {
	const files = scores(join(ROOT, 'apps')).concat(scores(join(ROOT, 'docs')), scores(join(ROOT, 'tools')));

	it('finds the tree’s scores', () => {
		expect(files.length).toBeGreaterThan(50);
	});

	it.each(files.map((f) => [relative(ROOT, f), f]))('%s', async (_name, file) => {
		const parsed = await parse(file);
		const analyzed = analyzeScore(parsed, { fR1: {} }, () => undefined, { generatedAt: '2026-10-11T00:00:00.000Z' });
		const { pages } = paginateScore(parsed, analyzed, GEOMETRY);
		const seen: number[] = [];
		for (const page of pages) {
			for (const m of page.matchAll(/<svg x="[^"]*" y="([^"]*)" width="[^"]*" height="([^"]*)" viewBox="[^"]*" data-system="(\d+)-(\d+)">/g)) {
				const [y, h, a, b] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
				for (let i = a; i <= b; i++) seen.push(i);
				// A system taller than a whole page cannot fit anywhere; every other one fits its page.
				if (h <= GEOMETRY.pageHeight) expect(y + h, `bars ${a + 1}-${b + 1} end inside the page`).toBeLessThanOrEqual(GEOMETRY.pageHeight + 0.5);
			}
		}
		expect(seen).toEqual(parsed.measures.map((_, i) => i));
	}, 60_000);
});
