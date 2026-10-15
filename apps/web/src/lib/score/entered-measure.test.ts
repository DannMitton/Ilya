/**
 * Cause 1c, 2026-10-15: an entered note that knows its measure
 * (`docs/sessions/report-code-calm-loupe_r1_2026-09-28.md` §4 item 1).
 *
 * The head gap of measure k and the tail gap of k − 1 are one place, so a
 * note entered at k's head caret is anchored to the last entry of k − 1 and
 * used to be seated at the end of k − 1. `entered.measureIndex` says which
 * measure the singer entered it in. A record without it reads as it always
 * did, which the first test of each group pins.
 *
 * Two measures of 2/4, two quarters each: a, b | c, d. Every expected
 * measure and onset is written out by hand from that.
 */
import { describe, expect, it } from 'vitest';
import type { Pitch, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, durationFraction, type CorrectionMap } from './correction';
import { CorrectionCursor } from './correction-cursor.svelte';
import { enterEntry, sameCursor, type Cursor } from './entry';

const P: Pitch = { step: 'C', alter: 0, octave: 4 };

function quarter(id: string, measureIndex: number, onsetQuarters: number): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: onsetQuarters, denominator: 4 } },
		duration: { base: 'quarter', dots: 0, fraction: durationFraction('quarter', 0) },
		pitch: P,
	};
}

const LINE = [quarter('a', 0, 0), quarter('b', 0, 1), quarter('c', 1, 0), quarter('d', 1, 1)];
const entered = (after: string | null, measureIndex?: number) => ({
	base: 'quarter' as const,
	dots: 0,
	type: 'note' as const,
	pitch: P,
	entered: { after, ...(measureIndex !== undefined ? { measureIndex } : {}) },
});

describe('enterEntry, the gap carries its measure', () => {
	it('copies the gap measureIndex into the record', () => {
		const { map, id } = enterEntry({}, { kind: 'gap', after: 'b', measureIndex: 1 }, { base: 'quarter', dots: 0, pitch: P });
		expect(map[id].entered).toEqual({ after: 'b', measureIndex: 1 });
	});

	it('a gap without one writes the record it always wrote', () => {
		const { map, id } = enterEntry({}, { kind: 'gap', after: 'b' }, { base: 'quarter', dots: 0, pitch: P });
		expect(map[id].entered).toEqual({ after: 'b' });
		expect(Object.keys(map[id].entered!)).toEqual(['after']);
	});

	it('an entry cursor writes no measure', () => {
		const { map, id } = enterEntry({}, { kind: 'entry', id: 'b' }, { base: 'quarter', dots: 0, pitch: P });
		expect(map[id].entered).toEqual({ after: 'b' });
	});

	it('sameCursor ignores the measure', () => {
		expect(sameCursor({ kind: 'gap', after: 'b', measureIndex: 1 }, { kind: 'gap', after: 'b' })).toBe(true);
		expect(sameCursor({ kind: 'gap', after: 'b', measureIndex: 1 }, { kind: 'gap', after: 'a' })).toBe(false);
	});
});

describe('applyCorrections, the note lands in the measure it names', () => {
	it('without measureIndex it is seated in the anchor measure, as before', () => {
		const out = applyCorrections(LINE, { 'hand:1': entered('b') } as CorrectionMap);
		const note = out.find((e) => e.id === 'hand:1')!;
		expect(note.measureIndex).toBe(0);
		expect(out.map((e) => e.id)).toEqual(['a', 'b', 'hand:1', 'c', 'd']);
		expect(note.rhythmicPosition.fraction).toEqual({ numerator: 1, denominator: 2 });
	});

	it("at k's head caret it is seated at the start of k, and k − 1 is untouched", () => {
		const out = applyCorrections(LINE, { 'hand:1': entered('b', 1) } as CorrectionMap);
		const byId = Object.fromEntries(out.map((e) => [e.id, e]));
		expect(out.map((e) => e.id)).toEqual(['a', 'b', 'hand:1', 'c', 'd']);
		expect(byId['hand:1'].measureIndex).toBe(1);
		expect(byId['hand:1'].rhythmicPosition.fraction).toEqual({ numerator: 0, denominator: 1 });
		// Measure k − 1 is exactly as it was read.
		expect(byId.a).toBe(LINE[0]);
		expect(byId.b).toBe(LINE[1]);
		// Measure k's own notes move along by the new note's length.
		expect(byId.c.rhythmicPosition.fraction).toEqual({ numerator: 1, denominator: 4 });
		expect(byId.d.rhythmicPosition.fraction).toEqual({ numerator: 1, denominator: 2 });
	});

	it("at k − 1's tail caret (the same anchor, k − 1 named) it stays at the end of k − 1", () => {
		const out = applyCorrections(LINE, { 'hand:1': entered('b', 0) } as CorrectionMap);
		const note = out.find((e) => e.id === 'hand:1')!;
		expect(note.measureIndex).toBe(0);
		expect(note.rhythmicPosition.fraction).toEqual({ numerator: 1, denominator: 2 });
		// c is in the next measure, whose own notes the entry did not touch.
		expect(out.find((e) => e.id === 'c')).toBe(LINE[2]);
	});

	it('both gaps used: the one that stays in k − 1 comes first, whichever was entered first', () => {
		const head = applyCorrections(LINE, {
			'hand:1': entered('b', 1),
			'hand:2': entered('b', 0),
		} as CorrectionMap);
		expect(head.map((e) => [e.id, e.measureIndex])).toEqual([
			['a', 0],
			['b', 0],
			['hand:2', 0],
			['hand:1', 1],
			['c', 1],
			['d', 1],
		]);
	});

	it('records without the field keep the order they were entered in', () => {
		const out = applyCorrections(LINE, {
			'hand:2': entered('b'),
			'hand:1': entered('b'),
		} as CorrectionMap);
		expect(out.map((e) => e.id)).toEqual(['a', 'b', 'hand:2', 'hand:1', 'c', 'd']);
	});

	it('a second entry chained off the first stays in the first one measure', () => {
		const out = applyCorrections(LINE, {
			'hand:1': entered('b', 1),
			'hand:2': entered('hand:1'),
		} as CorrectionMap);
		const byId = Object.fromEntries(out.map((e) => [e.id, e]));
		expect(byId['hand:2'].measureIndex).toBe(1);
		expect(byId['hand:2'].rhythmicPosition.fraction).toEqual({ numerator: 1, denominator: 4 });
		expect(byId.c.rhythmicPosition.fraction).toEqual({ numerator: 1, denominator: 2 });
	});

	it('at the head of the part, naming the first measure changes nothing', () => {
		const a = applyCorrections(LINE, { 'hand:1': entered(null) } as CorrectionMap);
		const b = applyCorrections(LINE, { 'hand:1': entered(null, 0) } as CorrectionMap);
		expect(b).toEqual(a);
	});

	it('a record read by an older build (the field dropped) seats the note in the anchor measure', () => {
		const stored = JSON.parse(JSON.stringify({ 'hand:1': entered('b', 1) }));
		delete stored['hand:1'].entered.measureIndex;
		const note = applyCorrections(LINE, stored).find((e) => e.id === 'hand:1')!;
		expect(note.measureIndex).toBe(0);
	});
});

describe('CorrectionCursor, the gap keeps its measure', () => {
	function cursorOn(line: VocalLineEvent[] = LINE) {
		return new CorrectionCursor(() => line);
	}

	it('set stores the measure of a gap and clears it on an entry', () => {
		const c = cursorOn();
		c.set({ kind: 'gap', after: 'b', measureIndex: 1 });
		expect(c.cursor).toEqual({ kind: 'gap', after: 'b', measureIndex: 1 });
		c.set({ kind: 'entry', id: 'c' });
		expect(c.cursor).toEqual({ kind: 'entry', id: 'c' });
		expect(c.gapMeasure).toBeUndefined();
	});

	it('a gap set without a measure reads exactly as it did', () => {
		const c = cursorOn();
		c.set({ kind: 'gap', after: 'b' });
		expect(c.cursor).toEqual({ kind: 'gap', after: 'b' });
		expect(Object.keys(c.cursor!)).toEqual(['kind', 'after']);
	});

	it("Left from k's first entry lands on k's head caret, and the cursor says k", () => {
		const c = cursorOn();
		c.set({ kind: 'entry', id: 'c' });
		c.move(-1);
		expect(c.cursor).toEqual({ kind: 'gap', after: 'b', measureIndex: 1 });
	});

	it("Right from k − 1's last entry lands on its tail caret, and the cursor says k − 1", () => {
		const c = cursorOn();
		c.set({ kind: 'entry', id: 'b' });
		c.move(1);
		expect(c.cursor).toEqual({ kind: 'gap', after: 'b', measureIndex: 0 });
	});

	it('the same place, two measures: the cursors are the same place but name different measures', () => {
		const head = cursorOn();
		head.set({ kind: 'entry', id: 'c' });
		head.move(-1);
		const tail = cursorOn();
		tail.set({ kind: 'entry', id: 'b' });
		tail.move(1);
		expect(sameCursor(head.cursor as Cursor, tail.cursor as Cursor)).toBe(true);
		expect(head.gapMeasure).not.toBe(tail.gapMeasure);
	});

	it('a walk from a gap into an entry carries no measure', () => {
		const c = cursorOn();
		c.set({ kind: 'gap', after: 'b', measureIndex: 1 });
		c.move(1);
		expect(c.cursor).toEqual({ kind: 'entry', id: 'c' });
	});

	it('entering at the stepped-to head caret seats the note in k', () => {
		const c = cursorOn();
		c.set({ kind: 'entry', id: 'c' });
		c.move(-1);
		const { map } = enterEntry({}, c.cursor!, { base: 'quarter', dots: 0, pitch: P });
		const out = applyCorrections(LINE, map);
		expect(out.find((e) => e.id === 'hand:1')!.measureIndex).toBe(1);
	});
});
