/**
 * N.153 stage 3a's proof: the loupe's render of a system is the page's own
 * drawing of it, byte for byte, on the engraved Sunless no. 1 (18 measures),
 * at several page widths, including the last system that is left short.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, analyzeScore, chooseClef, paginateScore, type ParsedScore } from '@ilya/score-parser';
import { demoProfileUnmeasured } from '../../../../../packages/score-parser/src/demo-fixture';
import { parseXml } from './ingestion/mini-dom';
import { ENGRAVING_DEFAULTS as E } from './engraving';
import {
	MAX_SPACING_RENDERS,
	deriveMinGap,
	renderLoupeMeasure,
	renderLoupeSystem,
	systemMarkup,
} from './loupe-render';
import type { LoupeRenderBundle } from './loupe-render-bundle';

const xml = readFileSync(
	fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
	'utf8',
);

async function bundle(): Promise<LoupeRenderBundle> {
	const { score } = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	const readingScore: ParsedScore = score;
	return {
		readingScore,
		analyzed: analyzeScore(readingScore, demoProfileUnmeasured, () => undefined, { generatedAt: 'x' }),
		clef: chooseClef(readingScore),
		spacing: { lineGap: E.lineGap, pxPerWhole: E.pxPerWhole, minGap: E.minGap, leftMargin: E.leftMargin },
		font: undefined,
		fontFamily: undefined,
		ipaPreview: undefined,
		withheldIpa: undefined,
		cyrPreview: undefined,
		sylTypePreview: undefined,
		melismaPreview: undefined,
	};
}

describe('N.153 stage 3a: the loupe renders the page\'s system', () => {
	for (const pageWidth of [380, 540, 700, 816, ...Array.from({ length: 60 }, (_, i) => 520 + i * 9)]) {
		it(`matches every system the page drew at ${pageWidth} px`, async () => {
			const b = await bundle();
			const pg = paginateScore(b.readingScore, b.analyzed, {
				pageWidth,
				pageHeight: 3000,
				marginTop: 0,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				...b.spacing,
				systemGap: E.systemGap,
			});
			expect(pg.systems.length).toBeGreaterThan(1);
			for (const s of pg.systems) {
				const r = renderLoupeSystem(b, { fromMeasure: s.fromMeasure, toMeasure: s.toMeasure }, s.width);
				expect(r, `${s.fromMeasure}-${s.toMeasure}`).not.toBeNull();
				expect(r!.svg).toBe(s.svg);
				expect([r!.minY, r!.width, r!.height]).toEqual([s.minY, s.width, s.height]);
			}
			// The wrapper is the page's own nested `<svg>`, less the `x` and `y`
			// that place it on a sheet.
			const onPages = pg.pages.join('\n');
			for (const s of pg.systems) {
				const range = { fromMeasure: s.fromMeasure, toMeasure: s.toMeasure };
				const markup = systemMarkup(renderLoupeSystem(b, range, s.width)!, range);
				const open = markup.slice(0, markup.indexOf('>') + 1);
				const pageOpen = onPages
					.match(new RegExp(`<svg x="[^"]*" y="[^"]*"( width="[^"]*" height="[^"]*" viewBox="[^"]*" data-system="${range.fromMeasure}-${range.toMeasure}">)`))![1];
				expect(open).toBe(`<svg${pageOpen}`);
				expect(onPages).toContain(markup.slice(markup.indexOf('>') + 1, -'</svg>'.length));
			}
		});
	}

	it('renders nothing for a range past the score', async () => {
		const b = await bundle();
		expect(renderLoupeSystem(b, { fromMeasure: 17, toMeasure: 18 }, 500)).toBeNull();
	});
});

describe('N.153 stage 3b: one measure, at natural width', () => {
	it('renders every measure alone, and carries no mark of another', async () => {
		const b = await bundle();
		const n = b.readingScore.measures.length;
		expect(n).toBe(18);
		for (let m = 0; m < n; m++) {
			const r = renderLoupeMeasure(b, m, E.minGap);
			expect(r, `m.${m}`).not.toBeNull();
			const ids = [...r!.svg.matchAll(/data-event-id="([^"]+)"/g)].map((x) => x[1]);
			for (const id of ids) expect(id.startsWith(`m${m}-`), `${id} in the render of m.${m}`).toBe(true);
			expect(systemMarkup(r!, { fromMeasure: m, toMeasure: m })).toContain(`data-system="${m}-${m}"`);
		}
	});

	it('is wider, never narrower, as minGap rises: the premise the search stands on', async () => {
		const b = await bundle();
		for (let m = 0; m < b.readingScore.measures.length; m++) {
			let last = 0;
			for (const g of [E.minGap, E.minGap * 1.5, E.minGap * 2.5, E.minGap * 4, E.minGap * 8]) {
				const w = renderLoupeMeasure(b, m, g)!.width;
				expect(w, `m.${m} at minGap ${g}`).toBeGreaterThanOrEqual(last);
				last = w;
			}
		}
	});

	it('is the same drawing whatever the page laid the measure out at, since it takes no target', async () => {
		const b = await bundle();
		const a = renderLoupeMeasure(b, 4, E.minGap)!;
		const c = renderLoupeMeasure({ ...b, spacing: { ...b.spacing } }, 4, E.minGap)!;
		expect(c.svg).toBe(a.svg);
	});

	it('renders nothing for a measure past the score', async () => {
		const b = await bundle();
		expect(renderLoupeMeasure(b, 18, E.minGap)).toBeNull();
		expect(renderLoupeMeasure(b, -1, E.minGap)).toBeNull();
	});
});

describe('N.153 stage 3b: the search for the smallest spacing that clears the floor', () => {
	// A worst separation that rises with minGap, as advances do at natural width.
	const line = (base: number, slope: number) => (g: number) => ({ worst: base + slope * g, scale: 1.5 });

	it('stops at the page\'s spacing when it already clears the floor, in one render', () => {
		const r = deriveMinGap(20, line(50, 0), 44);
		expect(r).toMatchObject({ minGap: 20, iterations: 1, converged: true });
	});

	it('finds the smallest spacing that clears the floor, within its resolution', () => {
		const r = deriveMinGap(20, line(2, 1.1), 44); // needs g >= 38.18
		expect(r.converged).toBe(true);
		expect(r.worst).toBeGreaterThanOrEqual(44);
		expect(r.minGap).toBeGreaterThanOrEqual(38.18);
		expect(r.minGap - 38.18).toBeLessThanOrEqual(0.5 + 1e-9);
		expect(r.iterations).toBeLessThanOrEqual(MAX_SPACING_RENDERS);
	});

	it('keeps the widest spacing it reached, unconverged, where the floor is out of reach', () => {
		const r = deriveMinGap(20, line(2, 0.01), 44);
		expect(r.converged).toBe(false);
		expect(r.worst).toBeLessThan(44);
		expect(r.iterations).toBe(2);
	});

	it('never exceeds its render budget', () => {
		// A gap that clears only just under the ceiling, and a step that never resolves.
		const r = deriveMinGap(20, (g) => ({ worst: g >= 119.999 ? 44 : 0, scale: 1.5 }), 44);
		expect(r.iterations).toBeLessThanOrEqual(MAX_SPACING_RENDERS);
	});

	it('treats a render it cannot measure as clear, so a measure with no pair is left alone', () => {
		expect(deriveMinGap(20, () => null, 44)).toMatchObject({ minGap: 20, iterations: 1, converged: true });
	});
});
