/**
 * cutRows on synthetic bands: row 81's rule (R1) and the harness's split at
 * ink valleys (R2). A band is 2000 px wide with a staff space of 30 px, so a
 * text line needs ink on more than 40 px, a run under 12 px is dropped, lines
 * under 9 px apart merge, and a core over 48 px is looked at for a valley.
 */
import { describe, expect, it } from 'vitest';
import { cutRows, type GreyBandLike } from './underlay-rows';

const W = 2000;
const SPACE = 30;
const PAPER = 235;
const INK = 20;

function blank(height: number, paper = PAPER): GreyBandLike {
	return { width: W, height, data: new Uint8Array(W * height).fill(paper) };
}

/** Ink over columns [x0, x1) of lines [y0, y1]. */
function ink(band: GreyBandLike, x0: number, x1: number, y0: number, y1: number, value = INK): void {
	const data = band.data as Uint8Array;
	for (let y = y0; y <= y1; y++) for (let x = x0; x < x1; x++) data[y * band.width + x] = value;
}

describe('cutRows, row 81\'s rule', () => {
	it('finds one row, its core where the ink is and 0.3 staff space of padding either side', () => {
		const band = blank(200);
		ink(band, 100, 1900, 60, 89);
		expect(cutRows(band, SPACE)).toEqual([{ y0: 51, y1: 99, core: [60, 89] }]);
	});

	it('finds no row in an empty band', () => {
		expect(cutRows(blank(200), SPACE)).toEqual([]);
	});

	it('clips the padding at the edges of the band', () => {
		const band = blank(100);
		ink(band, 100, 1900, 3, 20);
		ink(band, 100, 1900, 80, 97);
		const rows = cutRows(band, SPACE);
		expect(rows).toEqual([
			{ y0: 0, y1: 30, core: [3, 20] },
			{ y0: 71, y1: 100, core: [80, 97] },
		]);
	});

	it('keeps two rows a staff space apart as two rows', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 69);
		ink(band, 100, 1900, 100, 129);
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[40, 69], [100, 129]]);
	});

	it('merges lines under 0.3 staff space apart, and not lines 0.3 apart', () => {
		const near = blank(200);
		ink(near, 100, 1900, 40, 55);
		ink(near, 100, 1900, 64, 79); // 8 px between: under 9
		expect(cutRows(near, SPACE).map((r) => r.core)).toEqual([[40, 79]]);

		const apart = blank(200);
		ink(apart, 100, 1900, 40, 55);
		ink(apart, 100, 1900, 65, 80); // 9 px between: not under 9
		expect(cutRows(apart, SPACE).map((r) => r.core)).toEqual([[40, 55], [65, 80]]);
	});

	it('needs ink on more than 2 percent of the band\'s width for a line to count', () => {
		const wide = blank(200);
		ink(wide, 0, 41, 60, 89); // 41 px of 2000: over 40
		expect(cutRows(wide, SPACE)).toHaveLength(1);

		const narrow = blank(200);
		ink(narrow, 0, 40, 60, 89); // 40 px: not over
		expect(cutRows(narrow, SPACE)).toEqual([]);
	});

	it('drops a run under 0.4 staff space, and keeps one of exactly 0.4', () => {
		const thin = blank(200);
		ink(thin, 100, 1900, 60, 70); // 11 px
		expect(cutRows(thin, SPACE)).toEqual([]);

		const enough = blank(200);
		ink(enough, 100, 1900, 60, 71); // 12 px
		expect(cutRows(enough, SPACE)).toHaveLength(1);
	});

	it('reads ink as darker than the paper tone less 60, on grey paper', () => {
		const photocopy = blank(200, 200);
		ink(photocopy, 100, 1900, 60, 89, 100); // 100 < 140
		expect(cutRows(photocopy, SPACE)).toHaveLength(1);

		const faint = blank(200, 200);
		ink(faint, 100, 1900, 60, 89, 150); // 150 is 50 below the paper: not ink
		expect(cutRows(faint, SPACE)).toEqual([]);
	});

	it('does not count a pixel exactly 60 below the paper as ink, and counts one at 61 below', () => {
		const at = blank(200, 200);
		ink(at, 100, 1900, 60, 89, 140);
		expect(cutRows(at, SPACE)).toEqual([]);

		const under = blank(200, 200);
		ink(under, 100, 1900, 60, 89, 139);
		expect(cutRows(under, SPACE)).toHaveLength(1);
	});

	it('takes the paper tone as the mean of the two middle samples where the samples are even in number', () => {
		// The grid is one staff space (30): the sampled lines are y 0, 30, 60 (200) and 90, 120, 150 (230), so the paper is 215 and ink is under 155.
		const band = blank(180, 230);
		ink(band, 0, W, 0, 74, 200);
		ink(band, 100, 1900, 124, 145, 150); // between the sampled lines 120 and 150
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[124, 145]]);
	});

	it('samples the paper on a grid one staff space apart: the same band reads differently at another space', () => {
		// Lines 30, 90, and 150 are dark. A grid of 30 meets them (paper 167.5, ink under 107.5); a grid of 60 does not (paper 235, ink under 175).
		const band = blank(180, 235);
		for (const y of [30, 90, 150]) ink(band, 0, W, y, y, 100);
		ink(band, 100, 1900, 40, 69, 140);
		expect(cutRows(band, 30)).toEqual([]);
		expect(cutRows(band, 60)).toHaveLength(1);
	});

	it('takes the paper tone the caller measured when one is given', () => {
		// Mostly ink: the band's own median reads dark, and nothing stands out of it.
		const band = blank(200, INK);
		ink(band, 0, W, 90, 109, 235);
		expect(cutRows(band, SPACE)).toEqual([]);
		expect(cutRows({ ...band, paper: 235 }, SPACE).length).toBeGreaterThan(0);
	});
});

describe('cutRows, the notes of the staff above and the line below', () => {
	it('drops a melisma extender alone: a line 2 px high is under 0.4 staff space', () => {
		const band = blank(200);
		ink(band, 300, 1500, 70, 71);
		expect(cutRows(band, SPACE)).toEqual([]);
	});

	it('takes an extender within 0.3 staff space of the syllables into their row', () => {
		const band = blank(200);
		ink(band, 100, 1900, 60, 89);
		ink(band, 300, 1500, 94, 95); // 4 px under the row
		expect(cutRows(band, SPACE)).toEqual([{ y0: 51, y1: 105, core: [60, 95] }]);
	});

	it('does not count a piano head that is narrower than 2 percent of the band', () => {
		const band = blank(200);
		ink(band, 100, 1900, 60, 89);
		ink(band, 900, 936, 130, 153); // a head 36 px wide, 40 px under the row
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[60, 89]]);
	});

	it('leaves a head glued under the row out of its core', () => {
		const band = blank(200);
		ink(band, 100, 1900, 60, 89);
		ink(band, 900, 936, 90, 113);
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[60, 89]]);
	});

	it('does make a row of a head wider than 2 percent: cutRows says where ink is, not what it is', () => {
		const narrowBand: GreyBandLike = { width: 1000, height: 200, data: new Uint8Array(1000 * 200).fill(PAPER) };
		ink(narrowBand, 100, 900, 60, 89);
		ink(narrowBand, 500, 536, 130, 153); // 36 px of 1000 is over 2 percent
		expect(cutRows(narrowBand, SPACE).map((r) => r.core)).toEqual([[60, 89], [130, 153]]);
	});
});

describe('cutRows, the split at valleys (R2)', () => {
	it('splits two rows a hyphen\'s height apart, which row 81\'s rule merges', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 69);
		ink(band, 100, 1900, 74, 103); // 4 px between: under 0.3 space, so one run of 64 px
		const rows = cutRows(band, SPACE);
		expect(rows.map((r) => r.core)).toEqual([[40, 69], [74, 103]]);
		expect(rows[0].y1).toBeLessThanOrEqual(rows[1].y1);
	});

	it('does not split a run of 1.6 staff spaces or less, however it is shaped', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 63);
		ink(band, 100, 1900, 68, 87); // 48 px in all
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[40, 87]]);
	});

	it('looks for no valley within 0.7 staff space of either end of the core: a sliver of ink above the row stays in it', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 43); // a sliver 4 px high
		ink(band, 100, 1900, 48, 90); // the row, 4 px under it: one run of 51 px
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[40, 90]]);
	});

	it('does not split a tall run that has no valley', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 110); // 71 px of solid ink
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[40, 110]]);
	});

	it('does not split where the dip is shallow: a valley must hold under 0.45 of the smaller peak', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 69); // 1800 px
		ink(band, 100, 1900, 74, 103);
		ink(band, 100, 1100, 70, 73); // a dip filled to 1000 of 1800
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[40, 103]]);
	});

	it('splits at a valley beside a lighter row: the Russian row over a German one', () => {
		const band = blank(260);
		ink(band, 100, 1900, 40, 69);
		ink(band, 100, 900, 76, 103); // a lighter row under, after a gap of 6 px
		expect(cutRows(band, SPACE).map((r) => r.core)).toEqual([[40, 69], [76, 103]]);
	});

	it('splits a core into at most four pieces', () => {
		const band = blank(420);
		for (let i = 0; i < 6; i++) ink(band, 100, 1900, 20 + i * 36, 45 + i * 36); // six rows 26 px high, 10 px apart
		// Row 81's rule merges nothing here (10 px is not under 9), so this is six runs.
		expect(cutRows(band, SPACE)).toHaveLength(6);

		const tight = blank(420);
		for (let i = 0; i < 6; i++) ink(tight, 100, 1900, 20 + i * 32, 45 + i * 32); // 5 px apart: one run of 197 px
		const rows = cutRows(tight, SPACE);
		expect(rows.length).toBeGreaterThan(1);
		expect(rows.length).toBeLessThanOrEqual(4);
	});
});
