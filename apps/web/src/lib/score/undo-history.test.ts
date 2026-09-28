/**
 * The named Undo and Redo, moved out of `+page.svelte` by the audit's
 * phase 4, slice 1 (2026-09-27). These pin the behaviour the page had at
 * `f5d0dd4`: a snapshot stack, one redo stack, a push that drops the future,
 * and the whole cursor restored with the maps.
 */
import { describe, expect, it } from 'vitest';
import { stackLabel, UndoHistory, type UndoState } from './undo-history.svelte';
import type { CorrectionMap } from './correction';
import type { PairingMap } from './pairings';

/** A stand-in for the page: one mutable state that `read` and `write` share. */
function harness(initial: UndoState) {
	let state: UndoState = { ...initial };
	let writes = 0;
	const history = new UndoHistory(
		() => ({ ...state }),
		(next) => {
			writes += 1;
			state = {
				corrections: next.corrections,
				pairings: next.pairings,
				selected: next.selected,
				gapAfter: next.gapAfter,
				seatedText: next.seatedText,
			};
		},
	);
	return {
		history,
		get state() {
			return state;
		},
		set(patch: Partial<UndoState>) {
			state = { ...state, ...patch };
		},
		get writes() {
			return writes;
		},
	};
}

const empty: UndoState = {
	corrections: {},
	pairings: {},
	selected: null,
	gapAfter: undefined,
	seatedText: '',
};

const deleted = (id: string): CorrectionMap => ({ [id]: { deleted: true } }) as CorrectionMap;
const seated = (id: string): PairingMap => ({ [id]: { kind: 'melisma' } }) as PairingMap;

describe('UndoHistory', () => {
	it('starts with both stacks empty, and undo and redo on them do nothing', () => {
		const h = harness(empty);
		h.history.undo();
		h.history.redo();
		expect(h.history.undoStack).toEqual([]);
		expect(h.history.redoStack).toEqual([]);
		expect(h.writes).toBe(0);
	});

	it('push saves the state before the verb, under its note', () => {
		const h = harness({ ...empty, selected: 'e1' });
		h.history.push({ kind: 'text', key: 'loupe.undo.deleted' });
		expect(h.history.undoStack).toEqual([
			{ note: { kind: 'text', key: 'loupe.undo.deleted' }, ...empty, selected: 'e1' },
		]);
		expect(h.writes).toBe(0);
	});

	it('undo puts the saved state back and offers the replaced state to redo', () => {
		const h = harness({ ...empty, selected: 'e1' });
		h.history.push({ kind: 'text', key: 'loupe.undo.deleted' });
		h.set({ corrections: deleted('e1'), selected: 'e2' });

		h.history.undo();

		expect(h.state).toEqual({ ...empty, selected: 'e1' });
		expect(h.history.undoStack).toEqual([]);
		expect(h.history.redoStack).toEqual([
			{
				note: { kind: 'text', key: 'loupe.undo.deleted' },
				...empty,
				corrections: deleted('e1'),
				selected: 'e2',
			},
		]);
	});

	it('redo is the mirror of undo', () => {
		const h = harness(empty);
		h.history.push({ kind: 'change', from: 'C4', to: 'D4' });
		h.set({ corrections: deleted('e1') });
		h.history.undo();

		h.history.redo();

		expect(h.state.corrections).toEqual(deleted('e1'));
		expect(h.history.redoStack).toEqual([]);
		expect(h.history.undoStack).toHaveLength(1);
		expect(h.history.undoStack[0].note).toEqual({ kind: 'change', from: 'C4', to: 'D4' });
		expect(h.history.undoStack[0].corrections).toEqual({});
	});

	it('undo, redo, undo returns to the first state every time', () => {
		const h = harness(empty);
		h.history.push({ kind: 'text', key: 'loupe.undo.tie' });
		h.set({ corrections: deleted('e1'), pairings: seated('e1'), seatedText: 'poem' });
		const after = h.state;

		h.history.undo();
		expect(h.state).toEqual(empty);
		h.history.redo();
		expect(h.state).toEqual(after);
		h.history.undo();
		expect(h.state).toEqual(empty);
	});

	it('a new push drops the future', () => {
		const h = harness(empty);
		h.history.push({ kind: 'text', key: 'loupe.undo.rest' });
		h.set({ corrections: deleted('e1') });
		h.history.undo();
		expect(h.history.redoStack).toHaveLength(1);

		h.history.push({ kind: 'text', key: 'loupe.undo.tie' });

		expect(h.history.redoStack).toEqual([]);
	});

	it('undoes in last-in, first-out order', () => {
		const h = harness(empty);
		h.history.push({ kind: 'text', key: 'first' });
		h.set({ selected: 'a' });
		h.history.push({ kind: 'text', key: 'second' });
		h.set({ selected: 'b' });

		h.history.undo();
		expect(h.state.selected).toBe('a');
		h.history.undo();
		expect(h.state.selected).toBe(null);
	});

	it('restores the whole cursor, a gap included', () => {
		/* The N.92 slice 3 case: an entry made in a gap pushes a null
		   selection and a gap, and undo has to bring back both. */
		const h = harness({ ...empty, selected: null, gapAfter: null });
		h.history.push({ kind: 'text', key: 'loupe.undo.entered' });
		h.set({ selected: 'n1', gapAfter: undefined });

		h.history.undo();

		expect(h.state.selected).toBe(null);
		expect(h.state.gapAfter).toBe(null);
	});

	it('holds references, not copies: a snapshot is the map the verb replaced', () => {
		const before = deleted('e9');
		const h = harness({ ...empty, corrections: before });
		h.history.push({ kind: 'text', key: 'loupe.undo.restored' });
		expect(h.history.undoStack[0].corrections).toBe(before);
	});

	it('clear empties both stacks and writes nothing back', () => {
		const h = harness(empty);
		h.history.push({ kind: 'text', key: 'first' });
		h.set({ corrections: deleted('e1') });
		h.history.push({ kind: 'text', key: 'second' });
		h.set({ corrections: deleted('e2') });
		h.history.undo();
		expect(h.history.undoStack).toHaveLength(1);
		expect(h.history.redoStack).toHaveLength(1);
		const writes = h.writes;
		const state = h.state;

		h.history.clear();

		expect(h.history.undoStack).toEqual([]);
		expect(h.history.redoStack).toEqual([]);
		expect(h.writes).toBe(writes);
		expect(h.state).toBe(state);
	});

	it('after clear, undo and redo leave a different song untouched', () => {
		/* The song-switch case: song A's entry must not reach song B. */
		const h = harness({ ...empty, corrections: deleted('a1'), pairings: seated('a1') });
		h.history.push({ kind: 'change', from: 'B♭3', to: 'C♭4' });
		h.history.clear();
		h.set({ ...empty });
		const songB = h.state;

		h.history.undo();
		h.history.redo();

		expect(h.state).toBe(songB);
		expect(h.state.corrections).toEqual({});
		expect(h.state.pairings).toEqual({});
	});

	it('its verbs work detached from the instance, as the page passes them', () => {
		const h = harness(empty);
		const { push, undo, redo } = h.history;
		push({ kind: 'text', key: 'loupe.undo.placed' });
		h.set({ selected: 'x' });
		undo();
		expect(h.state.selected).toBe(null);
		redo();
		expect(h.state.selected).toBe('x');
	});
});

describe('stackLabel', () => {
	const translate = (key: string) => `[${key}]`;

	it('is null for an empty stack', () => {
		expect(stackLabel([], translate)).toBe(null);
	});

	it('translates a text note at render', () => {
		const h = harness(empty);
		h.history.push({ kind: 'text', key: 'loupe.undo.tie' });
		expect(stackLabel(h.history.undoStack, translate)).toBe('[loupe.undo.tie]');
	});

	it('writes a change note as from, arrow, to, untranslated', () => {
		const h = harness(empty);
		h.history.push({ kind: 'change', from: 'C4', to: 'C♯4' });
		expect(stackLabel(h.history.undoStack, translate)).toBe('C4 → C♯4');
	});

	it('reads the top of the stack', () => {
		const h = harness(empty);
		h.history.push({ kind: 'text', key: 'first' });
		h.history.push({ kind: 'text', key: 'second' });
		expect(stackLabel(h.history.undoStack, translate)).toBe('[second]');
	});
});
