/**
 * The tuplet row, moved out of `+page.svelte` by the audit's phase 4, slice 4
 * (2026-10-15). These pin the behaviour the page had at `14e2ff8`: the row
 * opens and closes with a fresh base, a definition applies live, and however
 * many nudges follow the stack is pushed ONCE (`+page.svelte:1134-1138`).
 *
 * Expected values are written out by hand from the four-entry line below.
 */
import { describe, expect, it } from 'vitest';
import type { VocalLineEvent } from '@ilya/score-parser';
import type { CorrectionMap } from './correction';
import { DEFAULT_TUPLET } from './entry';
import { TupletRow } from './tuplet-row.svelte';
import type { UndoNote } from './undo-history.svelte';

/* `tupletRun` reads only `id` and `measureIndex`. Measure 0 holds a, b, c;
   measure 1 holds d. */
const ev = (id: string, measureIndex: number) => ({ id, measureIndex }) as VocalLineEvent;
const LINE = [ev('a', 0), ev('b', 0), ev('c', 0), ev('d', 1)];

function harness(opts: { selected?: string | null; inGap?: boolean } = {}) {
	let corrections: CorrectionMap = {};
	let selected: string | null = opts.selected === undefined ? 'a' : opts.selected;
	let inGap = opts.inGap ?? false;
	const pushed: UndoNote[] = [];
	let writes = 0;
	const row = new TupletRow({
		corrections: () => corrections,
		setCorrections: (next) => {
			writes += 1;
			corrections = next;
		},
		line: () => LINE,
		selectedEventId: () => selected,
		inGap: () => inGap,
		pushUndo: (n) => pushed.push(n),
	});
	return {
		row,
		pushed,
		get corrections() {
			return corrections;
		},
		get writes() {
			return writes;
		},
		select(id: string | null) {
			selected = id;
		},
		gap(v: boolean) {
			inGap = v;
		},
	};
}

describe('TupletRow', () => {
	it('starts closed, on the session default', () => {
		const { row } = harness();
		expect(row.open).toBe(false);
		expect(row.def).toEqual(DEFAULT_TUPLET);
	});

	it('openRow opens and close closes', () => {
		const { row } = harness();
		row.openRow();
		expect(row.open).toBe(true);
		row.close();
		expect(row.open).toBe(false);
	});

	it('fits only on a taken entry whose run the count fits inside one measure', () => {
		const h = harness({ selected: 'a' });
		expect(h.row.fits).toBe(true); // default 3: a, b, c, all measure 0
		h.select('b');
		expect(h.row.fits).toBe(false); // b, c, d crosses the barline
		h.select('d');
		expect(h.row.fits).toBe(false); // runs off the line
		h.select(null);
		expect(h.row.fits).toBe(false);
		h.select('a');
		h.gap(true);
		expect(h.row.fits).toBe(false); // a gap has no entry to start from
	});

	it('apply keeps the definition even where it does not fit, and writes nothing', () => {
		const h = harness({ selected: 'd' });
		const next = { ...DEFAULT_TUPLET, actualNotes: 5 };
		h.row.apply(next);
		expect(h.row.def).toEqual(next);
		expect(h.writes).toBe(0);
		expect(h.pushed).toEqual([]);
	});

	it('apply with nothing taken keeps the definition and writes nothing', () => {
		const h = harness({ selected: null });
		h.row.apply({ ...DEFAULT_TUPLET, actualNotes: 2 });
		expect(h.row.def.actualNotes).toBe(2);
		expect(h.writes).toBe(0);
		expect(h.pushed).toEqual([]);
	});

	it('the first apply pushes ONE undo and defines the tuplet over the run', () => {
		const h = harness();
		h.row.apply(DEFAULT_TUPLET);
		expect(h.pushed).toEqual([{ kind: 'text', key: 'loupe.undo.tuplet' }]);
		expect(Object.keys(h.corrections)).toEqual(['a', 'b', 'c']);
		expect(h.corrections.a).toMatchObject({
			base: 'eighth',
			dots: 0,
			tuplet: { actualNotes: 3, normalNotes: 2, normalType: 'eighth' },
		});
	});

	it('however many nudges follow, the stack is pushed once and each re-applies from the first base', () => {
		const h = harness();
		h.row.apply(DEFAULT_TUPLET);
		h.row.apply({ ...DEFAULT_TUPLET, actualType: 'quarter' });
		h.row.apply({ ...DEFAULT_TUPLET, actualType: 'half' });
		expect(h.pushed).toHaveLength(1);
		expect(h.writes).toBe(3);
		expect(h.corrections.c).toMatchObject({ base: 'half' });
		// A 2-note nudge: the base was the empty map, so c carries no trace of
		// the 3-note run it was part of a moment ago.
		h.row.apply({ ...DEFAULT_TUPLET, actualNotes: 2 });
		expect(h.pushed).toHaveLength(1);
		expect(Object.keys(h.corrections)).toEqual(['a', 'b']);
	});

	it('a nudge that does not fit leaves the earlier result and the single undo', () => {
		const h = harness();
		h.row.apply(DEFAULT_TUPLET);
		h.row.apply({ ...DEFAULT_TUPLET, actualNotes: 9 });
		expect(h.pushed).toHaveLength(1);
		expect(h.writes).toBe(1);
		expect(Object.keys(h.corrections)).toEqual(['a', 'b', 'c']);
	});

	it('closing and opening again captures a fresh base and pushes a second undo', () => {
		const h = harness();
		h.row.apply(DEFAULT_TUPLET);
		h.row.close();
		h.row.apply({ ...DEFAULT_TUPLET, actualType: 'quarter' });
		expect(h.pushed).toHaveLength(2);
		h.row.openRow();
		h.row.apply({ ...DEFAULT_TUPLET, actualType: 'half' });
		expect(h.pushed).toHaveLength(3);
	});

	it('the base is the map as it stood at the first apply, not at the last', () => {
		const h = harness();
		h.row.apply(DEFAULT_TUPLET);
		const afterFirst = h.corrections;
		h.row.apply({ ...DEFAULT_TUPLET, actualNotes: 2 });
		// Re-applied from the empty base, so 'c' is gone rather than kept from
		// the first apply.
		expect(afterFirst).toHaveProperty('c');
		expect(h.corrections).not.toHaveProperty('c');
	});
});
