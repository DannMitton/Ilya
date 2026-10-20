/**
 * Row 141: a tacet run is packed whole, and a system is measured as it is drawn.
 *
 * Dann 2026-10-20 03:01, on song 2: bar 28 truncated at the end of its system,
 * and a multimeasure rest followed by one more bar of rest. The score below is
 * the desk's reproduction: 109 bars of 3/4 in A major, treble clef, empty in
 * bars 1 to 6, 23 to 29, 66 to 68, and 104 to 109.
 */
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { paginateScore, renderSystemSlice, sliceWidth } from './page-layout';
import { layoutColumns, tacetRuns } from './staff-renderer';
import { chooseClef } from './clef-select';

const EMPTY = new Set<number>([
	...[1, 2, 3, 4, 5, 6],
	...[23, 24, 25, 26, 27, 28, 29],
	...[66, 67, 68],
	...[104, 105, 106, 107, 108, 109],
]);
const q = (step: string) => `<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>24</duration><type>quarter</type></note>`;
const h = (step: string) => `<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>48</duration><type>half</type></note>`;
const rest = '';

function xml(): string {
	const bars: string[] = [];
	for (let n = 1; n <= 109; n++) {
		const attrs = n === 1 ? '<attributes><divisions>24</divisions><key><fifths>3</fifths></key><time><beats>3</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>' : '';
		const body = EMPTY.has(n) ? rest : n % 2 ? q('A') + q('B') + q('C') : h('E') + q('F');
		bars.push(`<measure number="${n}">${attrs}${body}</measure>`);
	}
	return `<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1">${bars.join('')}</part></score-partwise>`;
}

async function build() {
	const res = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml()) as unknown as Document } as never);
	const analyzed = analyzeScore(res.score, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
	return { parsed: res.score, analyzed };
}

describe('row 141: no system ends inside a tacet run, and none is wider than its line', () => {
	for (const pageWidth of [640, 700, 760, 816]) {
		it(`page width ${pageWidth}`, async () => {
			const { parsed, analyzed } = await build();
			const runs = tacetRuns(parsed);
			expect(runs.map((r) => [r.fromMeasure + 1, r.toMeasure + 1])).toEqual([[1, 6], [23, 29], [66, 68], [104, 109]]);
			const out = paginateScore(parsed, analyzed, { pageWidth, marginLeft: 0, marginRight: 0 });
			for (const r of runs) {
				const holding = out.systems.filter((s) => s.fromMeasure <= r.toMeasure && s.toMeasure >= r.fromMeasure);
				expect(holding, `run ${r.fromMeasure + 1} to ${r.toMeasure + 1} in one system`).toHaveLength(1);
				expect(holding[0].fromMeasure <= r.fromMeasure && holding[0].toMeasure >= r.toMeasure).toBe(true);
			}
			for (const s of out.systems) {
				expect(s.width, `system ${s.fromMeasure + 1} to ${s.toMeasure + 1}`).toBeLessThanOrEqual(pageWidth + 0.5);
			}
		});
	}
});

describe('row 141: the packer’s width of a range is the render’s', () => {
	it('a range that ends inside a tacet run is measured with the run it would draw', async () => {
		const { parsed, analyzed } = await build();
		const clef = chooseClef(parsed);
		const opts = { clef };
		// Indices 18 to 27 end inside the run of indices 22 to 28: the desk's measured case.
		const whole = sliceWidth(parsed, 18, 27, opts, analyzed);
		const noRun = sliceWidth(parsed, 18, 21, opts, analyzed);
		expect(whole).toBeGreaterThan(noRun);
		const { columns } = layoutColumns(parsed, opts, 18, 27, analyzed);
		const tacet = columns.filter((c) => c.tacet);
		expect(tacet).toHaveLength(1);
		expect(tacet[0].tacet).toMatchObject({ fromMeasure: 22, toMeasure: 27, count: 6 });
	});

	it.each([[18, 27], [18, 25], [24, 30], [62, 66], [62, 67], [100, 106]])('the natural render of indices %i to %i is as wide as sliceWidth says', async (a, b) => {
		const { parsed, analyzed } = await build();
		const opts = { clef: chooseClef(parsed) };
		const svg = renderSystemSlice(parsed, analyzed, opts, a, b, {});
		const width = Number(svg.match(/viewBox="0 [\d.-]+ ([\d.]+) [\d.]+"/)![1]);
		expect(width).toBeCloseTo(sliceWidth(parsed, a, b, opts, analyzed), 1);
	});
});
