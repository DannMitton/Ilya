import { describe, expect, it } from 'vitest';
import { packNotes, type NotesMeasure } from './notes-pages';

/** A band at `top`: a 40 px head, lines of 20 px with 3 px gaps, a 12 px foot. */
function band(top: number, count: number): NonNullable<NotesMeasure['band']> {
	const lines = Array.from({ length: count }, (_, i) => ({ top: top + 40 + i * 23, bottom: top + 40 + i * 23 + 20 }));
	return { top, bottom: lines[lines.length - 1].bottom + 12, lines };
}

describe('packNotes (the notes never cut, 2026-09-28)', () => {
	it('keeps a column that fits on one sheet', () => {
		expect(packNotes({ octave: { top: 0, bottom: 30 }, band: band(46, 5) }, 800)).toEqual([
			{ withheld: false, octave: true, lines: [0, 5] }
		]);
	});

	it('runs a long band on to a further sheet, splitting between lines', () => {
		const m: NotesMeasure = { octave: { top: 0, bottom: 30 }, band: band(46, 30) };
		const sheets = packNotes(m, 400);
		expect(sheets.length).toBeGreaterThan(1);
		// Every line printed exactly once, in order.
		const printed = sheets.flatMap((s) => (s.lines ? Array.from({ length: s.lines[1] - s.lines[0] }, (_, k) => s.lines![0] + k) : []));
		expect(printed).toEqual(Array.from({ length: 30 }, (_, i) => i));
		// No sheet runs past its window: the box's head, its lines, and its foot.
		for (const s of sheets) {
			const first = m.band!.lines[s.lines![0]];
			const last = m.band!.lines[s.lines![1] - 1];
			const startsAt = s.octave ? 0 : first.top - 40;
			expect(last.bottom + 12 - startsAt).toBeLessThanOrEqual(400);
		}
	});

	it('moves a whole box to the next sheet when not even its first line fits', () => {
		const m: NotesMeasure = { withheld: { top: 0, bottom: 360 }, band: band(376, 2) };
		expect(packNotes(m, 400)).toEqual([
			{ withheld: true, octave: false, lines: null },
			{ withheld: false, octave: false, lines: [0, 2] }
		]);
	});

	it('returns one sheet for a column with nothing measured', () => {
		expect(packNotes({}, 400)).toEqual([{ withheld: false, octave: false, lines: null }]);
	});
});
