/**
 * The verbs, moved out of `+page.svelte` by the audit's phase 4, slice 5
 * (2026-10-15). These pin the behaviour the page had at `14e2ff8`, driven
 * through the class with a fake `doc`: the pitch bounds, the capped
 * accidental, a duration cell in a gap and on an entry, the rest both ways,
 * and the four conditions of the per-note restore (`+page.svelte:1007-1012`).
 *
 * Expected values are written out by hand from the three-note line below.
 */
import { describe, expect, it } from 'vitest';
import type { NoteBase, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { currentDuration, currentPitch, durationFraction, type CorrectionMap } from './correction';
import { CorrectionVerbs } from './correction-verbs.svelte';
import type { Cursor } from './entry';
import type { UndoNote } from './undo-history.svelte';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function note(id: string, pitch: Pitch, base: NoteBase = 'quarter'): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base, dots: 0, fraction: durationFraction(base, 0) },
		pitch,
	};
}

/** A stand-in for the page: a doc, a cursor, and an undo log the class writes through. */
function harness(opts: { line?: VocalLineEvent[]; cursor?: Cursor | null; corrections?: CorrectionMap } = {}) {
	const line = opts.line ?? [note('a', P('C', 4)), note('b', P('E', 4)), note('c', P('E', 4))];
	let corrections: CorrectionMap = opts.corrections ?? {};
	let cursor: Cursor | null = opts.cursor === undefined ? { kind: 'entry', id: 'a' } : opts.cursor;
	const pushed: UndoNote[] = [];
	const verbs = new CorrectionVerbs({
		corrections: () => corrections,
		setCorrections: (next) => (corrections = next),
		line: () => line,
		readLine: () => line,
		cursor: () => cursor,
		inGap: () => cursor?.kind === 'gap',
		selectedEventId: () => (cursor?.kind === 'entry' ? cursor.id : null),
		setCursor: (next) => (cursor = next),
		selectEntry: (id) => (cursor = id ? { kind: 'entry', id } : null),
		keyOf: () => undefined,
		clef: () => ({ sign: 'G' }),
		label: (p) => `${p.step}${p.alter > 0 ? '#' : p.alter < 0 ? 'b' : ''}${p.octave}`,
		word: (key) => key,
		pushUndo: (n) => pushed.push(n),
	});
	return {
		verbs,
		pushed,
		line,
		get corrections() {
			return corrections;
		},
		get cursor() {
			return cursor;
		},
		moveTo(c: Cursor | null) {
			cursor = c;
		},
	};
}

describe('CorrectionVerbs, pitch', () => {
	it('handleStep moves the notehead one step and pushes a named change', () => {
		const h = harness();
		h.verbs.handleStep(1);
		expect(h.corrections.a?.pitch).toEqual(P('D', 4));
		expect(h.pushed).toEqual([{ kind: 'change', from: 'C4', to: 'D4' }]);
	});

	it('handleStep stands at the ceiling: a step to C♯7 does nothing and pushes nothing', () => {
		const h = harness({ line: [note('a', P('B', 6, 1))], corrections: {} });
		h.verbs.handleStep(1); // B♯6 is MIDI 96, a step up lands on C7+: B#6 -> C#7 (97)
		expect(h.corrections).toEqual({});
		expect(h.pushed).toEqual([]);
	});

	it('handleStep stands at the floor: a step below C1 does nothing and pushes nothing', () => {
		const h = harness({ line: [note('a', P('C', 1))] });
		h.verbs.handleStep(-1); // B0 is MIDI 23, below the floor of 24
		expect(h.corrections).toEqual({});
		expect(h.pushed).toEqual([]);
	});

	it('handleStep inside the bounds at C1 going up, and C7 going down, still acts', () => {
		const lo = harness({ line: [note('a', P('C', 1))] });
		lo.verbs.handleStep(1);
		expect(lo.corrections.a?.pitch).toEqual(P('D', 1));
		const hi = harness({ line: [note('a', P('C', 7))] });
		hi.verbs.handleStep(-1);
		expect(hi.corrections.a?.pitch).toEqual(P('B', 6));
	});

	it('handleStep with nothing taken does nothing', () => {
		const h = harness({ cursor: null });
		h.verbs.handleStep(1);
		expect(h.corrections).toEqual({});
		expect(h.pushed).toEqual([]);
	});

	it('handleOctave moves an octave and keeps the spelling', () => {
		const h = harness();
		h.verbs.handleOctave(1);
		expect(h.corrections.a?.pitch).toEqual(P('C', 5));
		expect(h.pushed).toEqual([{ kind: 'change', from: 'C4', to: 'C5' }]);
	});

	it('handleAccidental is cumulative to a double, and a capped click records nothing', () => {
		const h = harness();
		h.verbs.handleAccidental('sharp');
		h.verbs.handleAccidental('sharp');
		expect(h.corrections.a?.pitch).toEqual(P('C', 4, 2));
		expect(h.pushed).toHaveLength(2);
		const before = h.corrections;
		h.verbs.handleAccidental('sharp'); // capped: same pitch
		expect(h.corrections).toBe(before);
		expect(h.pushed).toHaveLength(2);
	});

	it('handleSemitone spells by the policy and pushes a named change', () => {
		const h = harness();
		h.verbs.handleSemitone(1);
		const p = currentPitch(h.line[0], h.corrections);
		expect(p).toBeDefined();
		expect(h.pushed).toHaveLength(1);
		expect(h.pushed[0]).toMatchObject({ kind: 'change', from: 'C4' });
	});
});

describe('CorrectionVerbs, duration and entry', () => {
	it('a duration cell on an entry re-times it and names the change', () => {
		const h = harness();
		h.verbs.handleDurationCell('half');
		expect(h.verbs.armedBase).toBe('half');
		expect(h.corrections.a?.base).toBe('half');
		expect(h.pushed).toEqual([{ kind: 'change', from: 'correct.lenQuarter', to: 'correct.lenHalf' }]);
	});

	it('a duration cell on an entry already at that value pushes nothing', () => {
		const h = harness();
		h.verbs.handleDurationCell('quarter');
		expect(h.pushed).toEqual([]);
	});

	it('a duration cell in a gap enters a note at the arrival pitch and takes the new entry', () => {
		const h = harness({ cursor: { kind: 'gap', after: 'a' } });
		expect(h.verbs.arrival).toEqual(P('C', 4)); // the entry before the bar
		h.verbs.handleDurationCell('eighth');
		expect(h.pushed).toEqual([{ kind: 'text', key: 'loupe.undo.entered' }]);
		expect(h.cursor).toEqual({ kind: 'entry', id: 'hand:1' });
		expect(h.corrections['hand:1']).toMatchObject({
			entered: { after: 'a' },
			base: 'eighth',
			dots: 0,
			type: 'note',
			pitch: P('C', 4),
		});
	});

	it('a gap before the first entry arrives on the middle line of the clef', () => {
		const h = harness({ cursor: { kind: 'gap', after: null } });
		expect(h.verbs.arrival).toEqual(P('B', 4));
		expect(h.verbs.gapAnchor).toBeNull();
	});

	it('the dot cell arms in a gap, cycling none, dot, double, and does not push', () => {
		const h = harness({ cursor: { kind: 'gap', after: 'a' } });
		h.verbs.handleDotCell();
		h.verbs.handleDotCell();
		expect(h.verbs.armedDots).toBe(2);
		h.verbs.handleDotCell();
		expect(h.verbs.armedDots).toBe(0);
		expect(h.pushed).toEqual([]);
	});

	it('the dot cell on an entry cycles its own dots and names each step', () => {
		const h = harness();
		h.verbs.handleDotCell();
		expect(h.pushed.at(-1)).toEqual({ kind: 'text', key: 'loupe.undo.dotOn' });
		h.verbs.handleDotCell();
		expect(h.pushed.at(-1)).toEqual({ kind: 'text', key: 'loupe.undo.dotDouble' });
		h.verbs.handleDotCell();
		expect(h.pushed.at(-1)).toEqual({ kind: 'text', key: 'loupe.undo.dotOff' });
		expect(currentDuration(h.line[0], h.corrections).dots).toBe(0);
	});

	it('Rest in a gap enters a rest of the armed duration', () => {
		const h = harness({ cursor: { kind: 'gap', after: 'b' } });
		h.verbs.handleRest();
		expect(h.pushed).toEqual([{ kind: 'text', key: 'loupe.undo.rest' }]);
		expect(h.corrections['hand:1']).toMatchObject({ entered: { after: 'b' }, base: 'quarter', type: 'rest' });
		expect(h.cursor).toEqual({ kind: 'entry', id: 'hand:1' });
	});

	it('Rest on a note converts it, and on a rest converts it back to its own pitch', () => {
		const h = harness();
		h.verbs.handleRest();
		expect(h.corrections.a?.type).toBe('rest');
		expect(h.verbs.selectedIsRest).toBe(true);
		h.verbs.handleRest();
		expect(h.verbs.selectedIsRest).toBe(false);
		expect(h.pushed).toHaveLength(2);
	});

	it('Rest with no cursor does nothing', () => {
		const h = harness({ cursor: null });
		h.verbs.handleRest();
		expect(h.pushed).toEqual([]);
		expect(h.corrections).toEqual({});
	});

	it('Tie is offered between equal pitches only, and toggles', () => {
		const h = harness({ cursor: { kind: 'entry', id: 'a' } });
		expect(h.verbs.tieAvailable).toBe(false); // C4 then E4
		h.verbs.handleTie();
		expect(h.pushed).toEqual([]);
		h.moveTo({ kind: 'entry', id: 'b' });
		expect(h.verbs.tieAvailable).toBe(true); // E4 then E4
		h.verbs.handleTie();
		expect(h.verbs.selectedTied).toBe(true);
		expect(h.pushed).toEqual([{ kind: 'text', key: 'loupe.undo.tie' }]);
		h.verbs.handleTie();
		expect(h.verbs.selectedTied).toBe(false);
	});
});

describe('CorrectionVerbs, delete and restore', () => {
	it('Delete removes the note and moves the selection forward, else back', () => {
		const h = harness({ cursor: { kind: 'entry', id: 'b' } });
		h.verbs.handleDeleteNote();
		expect(h.corrections.b?.deleted).toBe(true);
		expect(h.cursor).toEqual({ kind: 'entry', id: 'c' });
		expect(h.pushed).toEqual([{ kind: 'text', key: 'loupe.undo.deleted' }]);
		const last = harness({ cursor: { kind: 'entry', id: 'c' } });
		last.verbs.handleDeleteNote();
		expect(last.cursor).toEqual({ kind: 'entry', id: 'b' });
	});

	it('restoreAvailable needs all four: not in a gap, a selection, a correction, and a read entry', () => {
		const withCorr: CorrectionMap = { a: { pitch: P('D', 4) } } as CorrectionMap;
		expect(harness({ corrections: withCorr }).verbs.restoreAvailable).toBe(true);
		// in a gap
		expect(harness({ corrections: withCorr, cursor: { kind: 'gap', after: 'a' } }).verbs.restoreAvailable).toBe(false);
		// nothing selected
		expect(harness({ corrections: withCorr, cursor: null }).verbs.restoreAvailable).toBe(false);
		// a selection with no correction
		expect(harness({ cursor: { kind: 'entry', id: 'b' } }).verbs.restoreAvailable).toBe(false);
		// a hand-entered entry: its record IS the entry
		const entered = harness({
			line: [note('a', P('C', 4)), note('hand:1', P('C', 4))],
			corrections: { 'hand:1': { entered: { after: 'a' }, base: 'quarter', dots: 0, type: 'note' } } as CorrectionMap,
			cursor: { kind: 'entry', id: 'hand:1' },
		});
		expect(entered.verbs.restoreAvailable).toBe(false);
	});

	it('handleRestoreNote clears every correction on the note and names it; unavailable does nothing', () => {
		const h = harness({ corrections: { a: { pitch: P('D', 4), base: 'half' } } as CorrectionMap });
		h.verbs.handleRestoreNote();
		expect(h.corrections).toEqual({});
		expect(h.pushed).toEqual([{ kind: 'text', key: 'loupe.undo.restored' }]);
		const none = harness();
		none.verbs.handleRestoreNote();
		expect(none.pushed).toEqual([]);
	});
});

describe('CorrectionVerbs, readings', () => {
	it('reads label, base, dots, and dotted off the taken entry, correction included', () => {
		const h = harness({ corrections: { a: { pitch: P('D', 4), base: 'half', dots: 1 } } as CorrectionMap });
		expect(h.verbs.selectedLabel).toBe('D4');
		expect(h.verbs.selectedBase).toBe('half');
		expect(h.verbs.selectedDots).toBe(1);
		expect(h.verbs.selectedDotted).toBe(true);
	});

	it('reads nothing off an empty cursor', () => {
		const h = harness({ cursor: null });
		expect(h.verbs.selectedEvent).toBeUndefined();
		expect(h.verbs.selectedLabel).toBeNull();
		expect(h.verbs.selectedBase).toBeNull();
		expect(h.verbs.selectedDots).toBe(0);
		expect(h.verbs.selectedDotted).toBe(false);
		expect(h.verbs.selectedIsRest).toBe(false);
		expect(h.verbs.selectedTied).toBe(false);
	});

	it('durationWord names a base from the table and falls back to the base itself', () => {
		const h = harness();
		expect(h.verbs.durationWord('eighth')).toBe('correct.len8th');
		expect(h.verbs.durationWord('breve' as NoteBase)).toBe('breve');
	});
});
