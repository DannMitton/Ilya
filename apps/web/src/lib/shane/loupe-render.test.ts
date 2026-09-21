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
import { renderLoupeSystem, systemMarkup } from './loupe-render';
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
