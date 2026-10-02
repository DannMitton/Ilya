/**
 * N.179: clear placements by scope, and place from here. Every expectation is
 * counted by eye from the notes below, never read off `placement-scope.ts`.
 *
 * Eight notes in three bars: bar 0 holds n0 n1 n2; bar 1 holds n3 n4 (n4 is a
 * tie's continuation, so it may take no syllable) n5; bar 2 holds n6 n7.
 */
import { describe, it, expect } from 'vitest';
import { CLEAR_SCOPES, clearPlacements, noteIdsInScope, placeFromHere, unplacedSlots, type PlacementNote } from './placement-scope';
import type { PairingMap, Slot } from './pairings';

const notes: PlacementNote[] = [
	{ id: 'n0', measureIndex: 0, target: true },
	{ id: 'n1', measureIndex: 0, target: true },
	{ id: 'n2', measureIndex: 0, target: true },
	{ id: 'n3', measureIndex: 1, target: true },
	{ id: 'n4', measureIndex: 1, target: false },
	{ id: 'n5', measureIndex: 1, target: true },
	{ id: 'n6', measureIndex: 2, target: true },
	{ id: 'n7', measureIndex: 2, target: true },
];

const slot = (i: number): Slot => ({ cyrillic: `s${i}`, ipa: `ipa${i}`, vowel: 'a', origin: { lineIndex: 0, wordIndex: i, slotIndex: 0, word: `w${i}` } });
const slots = [0, 1, 2, 3, 4, 5, 6, 7].map(slot);
const seat = (i: number) => ({ kind: 'syllable' as const, cyrillic: `s${i}`, ipa: `ipa${i}`, vowel: 'a', origin: slot(i).origin });
/** Notes n0 to n3 and n5 to n7 carry syllables s0 to s6; n4 carries none. */
const full: PairingMap = { n0: seat(0), n1: seat(1), n2: seat(2), n3: seat(3), n5: seat(4), n6: seat(5), n7: seat(6) };

describe('which notes a scope covers', () => {
	it('this measure is the selected note’s bar, the whole of it', () => {
		expect(noteIdsInScope(notes, 'n4', 'measure')).toEqual(['n3', 'n4', 'n5']);
	});
	it('to the end runs from the selected note, itself included', () => {
		expect(noteIdsInScope(notes, 'n5', 'toEnd')).toEqual(['n5', 'n6', 'n7']);
	});
	it('the whole piece is every note, with or without a selection', () => {
		expect(noteIdsInScope(notes, null, 'all')).toHaveLength(8);
	});
	it('the two narrow scopes need a selection, and name nothing without one', () => {
		expect(noteIdsInScope(notes, null, 'measure')).toEqual([]);
		expect(noteIdsInScope(notes, 'gone', 'toEnd')).toEqual([]);
	});
	it('offers three scopes, in the order the pill opens them', () => {
		expect(CLEAR_SCOPES).toEqual(['measure', 'toEnd', 'all']);
	});
});

describe('clearPlacements', () => {
	it('clears exactly the selected measure’s notes and nothing else', () => {
		const next = clearPlacements(full, notes, 'n3', 'measure')!;
		expect(Object.keys(next).sort()).toEqual(['n0', 'n1', 'n2', 'n6', 'n7']);
	});
	it('clears from the selected note to the end and keeps what came before', () => {
		const next = clearPlacements(full, notes, 'n3', 'toEnd')!;
		expect(Object.keys(next).sort()).toEqual(['n0', 'n1', 'n2']);
	});
	it('clears the whole piece, orphaned entries too', () => {
		const withOrphan: PairingMap = { ...full, gone: seat(7) };
		expect(clearPlacements(withOrphan, notes, null, 'all')).toEqual({});
	});
	it('removes a melisma mark and an empty mark as well as a syllable', () => {
		const marks: PairingMap = { n3: { kind: 'melisma' }, n4: { kind: 'empty' }, n5: seat(0), n0: seat(1) };
		expect(Object.keys(clearPlacements(marks, notes, 'n3', 'measure')!)).toEqual(['n0']);
	});
	it('does not change the map it was given', () => {
		const before = JSON.stringify(full);
		clearPlacements(full, notes, 'n0', 'toEnd');
		expect(JSON.stringify(full)).toBe(before);
	});
	it('is null where nothing was there to clear, so no undo entry is made for it', () => {
		expect(clearPlacements({}, notes, 'n0', 'all')).toBeNull();
		expect(clearPlacements({ n0: seat(0) }, notes, 'n6', 'measure')).toBeNull();
		expect(clearPlacements(full, notes, null, 'toEnd')).toBeNull();
	});
	it('returns the cleared syllables to the tray', () => {
		const next = clearPlacements(full, notes, 'n3', 'toEnd')!;
		// s3 to s6 were placed on n3 to n7 and are the four now unplaced, with s7 which never was.
		expect(unplacedSlots(slots, next).map((s) => s.cyrillic)).toEqual(['s3', 's4', 's5', 's6', 's7']);
	});
});

describe('placeFromHere', () => {
	it('seats the tray’s remaining syllables one per note in order from the selected note', () => {
		const start: PairingMap = { n0: seat(0), n1: seat(1) };
		const next = placeFromHere(start, notes, 'n2', slots)!;
		// Tray: s2 to s7. Open targets from n2: n2, n3, n5, n6, n7 (n4 is a tie's continuation).
		expect(['n2', 'n3', 'n5', 'n6', 'n7'].map((id) => (next[id] as { cyrillic: string }).cyrillic)).toEqual(['s2', 's3', 's4', 's5', 's6']);
		expect(next.n4).toBeUndefined();
	});
	it('skips a note that already holds a syllable, and takes the next open one', () => {
		const start: PairingMap = { n2: seat(5) };
		const next = placeFromHere(start, notes, 'n2', slots)!;
		expect((next.n2 as { cyrillic: string }).cyrillic).toBe('s5');
		// Tray: s0 to s4, s6, s7. From n2, the open targets are n3, n5, n6, n7.
		expect(['n3', 'n5', 'n6', 'n7'].map((id) => (next[id] as { cyrillic: string }).cyrillic)).toEqual(['s0', 's1', 's2', 's3']);
	});
	it('leaves a melisma mark and an empty mark to the singer', () => {
		const start: PairingMap = { n3: { kind: 'melisma' }, n5: { kind: 'empty' } };
		const next = placeFromHere(start, notes, 'n3', slots)!;
		expect(next.n3).toEqual({ kind: 'melisma' });
		expect(next.n5).toEqual({ kind: 'empty' });
		expect((next.n6 as { cyrillic: string }).cyrillic).toBe('s0');
	});
	it('does not touch the notes before the selected one', () => {
		const next = placeFromHere({}, notes, 'n6', slots)!;
		expect(Object.keys(next).sort()).toEqual(['n6', 'n7']);
	});
	it('stops at the end of the piece rather than wrapping', () => {
		const next = placeFromHere({}, notes, 'n7', slots)!;
		expect(Object.keys(next)).toEqual(['n7']);
	});
	it('does nothing, and says so, with an empty tray, no selection, or no open note', () => {
		expect(placeFromHere(full, notes, 'n0', slots.slice(0, 7))).toBeNull();
		expect(placeFromHere({}, notes, null, slots)).toBeNull();
		expect(placeFromHere(full, notes, 'n7', slots)).toBeNull();
	});
	it('clearing the whole piece then placing from the first note seats the poem again', () => {
		const cleared = clearPlacements(full, notes, null, 'all')!;
		const next = placeFromHere(cleared, notes, 'n0', slots)!;
		expect(Object.keys(next).sort()).toEqual(['n0', 'n1', 'n2', 'n3', 'n5', 'n6', 'n7']);
		expect((next.n0 as { cyrillic: string }).cyrillic).toBe('s0');
		expect((next.n7 as { cyrillic: string }).cyrillic).toBe('s6');
	});
});
