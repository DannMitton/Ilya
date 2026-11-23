import { describe, expect, it } from 'vitest';
import { packNotes, planNotes, type NotesMeasure, type NotesSheet } from './notes-pages';

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

describe('row 142: the notes start below the last system when they fit', () => {
	const m: NotesMeasure = { octave: { top: 0, bottom: 30 }, band: band(46, 5) }; // octave 30 px, band 46 to 213
	const own: NotesSheet = { withheld: true, octave: true, lines: null };

	it('room for nothing: the first sheet is empty and the notes open their own sheet, as before', () => {
		expect(packNotes(m, 800, 10)).toEqual([
			{ withheld: false, octave: false, lines: null },
			{ withheld: false, octave: true, lines: [0, 5] },
		]);
		expect(planNotes(m, 800, 10, own)).toEqual({ onLast: null, sheets: [{ withheld: false, octave: true, lines: [0, 5] }] });
	});

	it('room for the octave notice alone: it stays on the last page and the band runs to a sheet of its own', () => {
		const plan = planNotes(m, 800, 40, own);
		expect(plan.onLast).toEqual({ withheld: false, octave: true, lines: null });
		expect(plan.sheets).toEqual([{ withheld: false, octave: false, lines: [0, 5] }]);
	});

	it('room for everything: it all goes on the last page and no notes sheet remains', () => {
		const plan = planNotes(m, 800, 400, own);
		expect(plan.onLast).toEqual({ withheld: false, octave: true, lines: [0, 5] });
		expect(plan.sheets).toEqual([]);
	});

	it('the page count: one fewer where the notes move up, the same where they do not', () => {
		const sheetsFor = (room: number | null) => {
			const p = planNotes(m, 800, room, own);
			return p.sheets.length;
		};
		expect(sheetsFor(null)).toBe(1); // room unknown: one notes sheet, as today
		expect(sheetsFor(10)).toBe(1); // first piece does not fit: its own sheet
		expect(sheetsFor(40)).toBe(1); // the band still needs one
		expect(sheetsFor(400)).toBe(0); // everything fits: the page count drops by one
	});

	it('before the column is measured the notes are one provisional sheet', () => {
		expect(planNotes(null, 800, 400, own)).toEqual({ onLast: null, sheets: [own] });
	});

	it('a band that starts on the last page and runs on keeps every line once', () => {
		const long: NotesMeasure = { octave: { top: 0, bottom: 30 }, band: band(46, 30) };
		const plan = planNotes(long, 400, 200, own);
		const all = [plan.onLast, ...plan.sheets].filter((x): x is NotesSheet => !!x);
		const printed = all.flatMap((s) => (s.lines ? Array.from({ length: s.lines[1] - s.lines[0] }, (_, k) => s.lines![0] + k) : []));
		expect(printed).toEqual(Array.from({ length: 30 }, (_, i) => i));
		expect(plan.onLast!.octave).toBe(true);
	});
});
