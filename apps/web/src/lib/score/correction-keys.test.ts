/**
 * The keyboard, moved out of `+page.svelte` by the audit's phase 4, slice 6
 * (2026-10-15). These pin the behaviour the page had at `14e2ff8`: the field
 * guard comes first (`:1198`), Undo and Redo run with no cursor and leave an
 * empty stack alone (`:1219-1233`), the music keys stand down when
 * `LoupePanel.musicKeys` is false (`:1238`), and a key the surface does not
 * claim is not prevented (`:1278`).
 *
 * Every dependency is a spy, so each test names exactly which one was called.
 */
import { describe, expect, it } from 'vitest';
import { createCorrectionKeys, type CorrectionKeysDeps } from './correction-keys';
import type { Cursor } from './entry';

type Opts = Partial<{ cursor: Cursor | null; musicKeys: boolean; canUndo: boolean; canRedo: boolean }>;

function harness(opts: Opts = {}) {
	const calls: string[] = [];
	const state = {
		cursor: opts.cursor === undefined ? ({ kind: 'entry', id: 'a' } as Cursor) : opts.cursor,
		musicKeys: opts.musicKeys ?? true,
		canUndo: opts.canUndo ?? false,
		canRedo: opts.canRedo ?? false,
	};
	const deps: CorrectionKeysDeps = {
		cursor: () => state.cursor,
		inGap: () => state.cursor?.kind === 'gap',
		musicKeys: () => state.musicKeys,
		canUndo: () => state.canUndo,
		canRedo: () => state.canRedo,
		undo: () => calls.push('undo'),
		redo: () => calls.push('redo'),
		step: (d) => calls.push(`step${d}`),
		octave: (d) => calls.push(`octave${d}`),
		semitone: (d) => calls.push(`semitone${d}`),
		move: (d) => calls.push(`move${d}`),
		dotCell: () => calls.push('dot'),
		deleteNote: () => calls.push('delete'),
		durationCell: (b) => calls.push(`dur:${b}`),
		dismiss: () => calls.push('dismiss'),
	};
	const handler = createCorrectionKeys(deps);
	/** Fires one key; returns whether the handler prevented it. */
	function press(key: string, init: Partial<KeyboardEvent> = {}, target: unknown = null): boolean {
		let prevented = false;
		const e = {
			key,
			metaKey: false,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			target,
			preventDefault: () => {
				prevented = true;
			},
			...init,
		} as unknown as KeyboardEvent;
		handler(e);
		return prevented;
	}
	return { calls, state, press };
}

const field = { closest: () => ({}) };

describe('createCorrectionKeys, the guards', () => {
	it('stands down inside a field or a tablist, ahead of every other branch, Undo included', () => {
		const h = harness({ canUndo: true });
		expect(h.press('z', { ctrlKey: true }, field)).toBe(false);
		expect(h.press('ArrowRight', {}, field)).toBe(false);
		expect(h.press('5', {}, field)).toBe(false);
		expect(h.calls).toEqual([]);
	});

	it('acts when the target is not a field', () => {
		const h = harness();
		expect(h.press('ArrowRight', {}, { closest: () => null })).toBe(true);
		expect(h.calls).toEqual(['move1']);
	});

	it('does nothing with no cursor, and does not claim the key', () => {
		const h = harness({ cursor: null });
		expect(h.press('ArrowRight')).toBe(false);
		expect(h.press('5')).toBe(false);
		expect(h.calls).toEqual([]);
	});

	it('does not claim a key held with a modifier (other than the undo and redo pairs)', () => {
		const h = harness();
		expect(h.press('ArrowRight', { metaKey: true })).toBe(false);
		expect(h.press('5', { ctrlKey: true })).toBe(false);
		expect(h.press('5', { altKey: true })).toBe(false);
		expect(h.calls).toEqual([]);
	});

	it('does not prevent a key it does not claim', () => {
		const h = harness();
		expect(h.press('q')).toBe(false);
		expect(h.press('0')).toBe(false);
		expect(h.calls).toEqual([]);
	});

	it('music keys stand down when musicKeys is false; the moves and Escape still act', () => {
		const h = harness({ musicKeys: false });
		expect(h.press('ArrowUp')).toBe(false);
		expect(h.press('5')).toBe(false);
		expect(h.press('.')).toBe(false);
		expect(h.press('Delete')).toBe(false);
		expect(h.calls).toEqual([]);
		expect(h.press('ArrowLeft')).toBe(true);
		expect(h.press('ArrowRight')).toBe(true);
		expect(h.press('Escape')).toBe(true);
		expect(h.calls).toEqual(['move-1', 'move1', 'dismiss']);
	});
});

describe('createCorrectionKeys, Undo and Redo', () => {
	it('Ctrl-Z and Cmd-Z undo with no cursor, and prevent', () => {
		const h = harness({ cursor: null, canUndo: true });
		expect(h.press('z', { ctrlKey: true })).toBe(true);
		expect(h.press('Z', { metaKey: true })).toBe(true);
		expect(h.calls).toEqual(['undo', 'undo']);
	});

	it('Shift-Cmd-Z and Ctrl-Y redo', () => {
		const h = harness({ cursor: null, canRedo: true });
		expect(h.press('z', { metaKey: true, shiftKey: true })).toBe(true);
		expect(h.press('y', { ctrlKey: true })).toBe(true);
		expect(h.calls).toEqual(['redo', 'redo']);
	});

	it('an empty stack is not claimed, so another handler still gets the key', () => {
		const h = harness({ cursor: null });
		expect(h.press('z', { ctrlKey: true })).toBe(false);
		expect(h.press('y', { ctrlKey: true })).toBe(false);
		expect(h.press('z', { ctrlKey: true, shiftKey: true })).toBe(false);
		expect(h.calls).toEqual([]);
	});

	it('Ctrl-Shift-Y is neither undo nor redo, and Alt cancels the pair', () => {
		const h = harness({ cursor: null, canUndo: true, canRedo: true });
		expect(h.press('y', { ctrlKey: true, shiftKey: true })).toBe(false);
		expect(h.press('z', { ctrlKey: true, altKey: true })).toBe(false);
		expect(h.calls).toEqual([]);
	});
});

describe('createCorrectionKeys, the keys', () => {
	it('arrows step and Shift-arrows move an octave', () => {
		const h = harness();
		h.press('ArrowUp');
		h.press('ArrowDown');
		h.press('ArrowUp', { shiftKey: true });
		h.press('ArrowDown', { shiftKey: true });
		expect(h.calls).toEqual(['step1', 'step-1', 'octave1', 'octave-1']);
	});

	it('plus, equals, minus, and underscore move a semitone', () => {
		const h = harness();
		['+', '=', '-', '_'].forEach((k) => h.press(k));
		expect(h.calls).toEqual(['semitone1', 'semitone1', 'semitone-1', 'semitone-1']);
	});

	it('the verbs that need a note stand down in a gap, and leave the key unclaimed', () => {
		const h = harness({ cursor: { kind: 'gap', after: 'a' } });
		for (const k of ['ArrowUp', 'ArrowDown', '+', '-', 'Delete', 'Backspace']) {
			expect(h.press(k)).toBe(false);
		}
		expect(h.calls).toEqual([]);
	});

	it('the dot, the digits, Delete, Backspace, and Escape reach their handlers', () => {
		const h = harness();
		expect(h.press('.')).toBe(true);
		expect(h.press('5')).toBe(true);
		expect(h.press('Delete')).toBe(true);
		expect(h.press('Backspace')).toBe(true);
		expect(h.press('Escape')).toBe(true);
		expect(h.calls).toEqual(['dot', 'dur:quarter', 'delete', 'delete', 'dismiss']);
	});

	it('the dot and a digit work in a gap, where they enter', () => {
		const h = harness({ cursor: { kind: 'gap', after: null } });
		expect(h.press('.')).toBe(true);
		expect(h.press('6')).toBe(true);
		expect(h.calls).toEqual(['dot', 'dur:half']);
	});
});
