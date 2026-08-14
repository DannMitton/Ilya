/**
 * Shift Lyrics tests (N.55b).
 *
 * Finale's three scopes as pure permutations of a PairingMap: shift to the
 * end of the lyric, shift to the next open note, and rotate within a
 * selection. See pairings.ts, section "Shift Lyrics", for the contract.
 *
 * Fixtures are hand-built, as pairings.test.ts does, because the rule under
 * test is the permutation, not the syllabifier.
 */

import { describe, expect, it } from 'vitest';
import {
	rotateSyllables,
	shiftToEndOfLyric,
	shiftToNextOpenNote,
} from './pairings';
import type { Pairing, PairingMap } from './pairings';

const syl = (cyrillic: string): Pairing => ({
	kind: 'syllable',
	cyrillic,
	ipa: cyrillic.toLowerCase(),
	vowel: undefined,
	origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: cyrillic },
});

describe('shiftToEndOfLyric', () => {
	const ids = ['e0', 'e1', 'e2', 'e3'];
	const map = (): PairingMap => ({
		e0: syl('A'),
		e1: syl('B'),
		e2: syl('C'),
		e3: syl('D'),
	});

	it('shifts forward: vacates fromIndex, displaces the last event', () => {
		const r = shiftToEndOfLyric(map(), ids, 1, 'forward');
		expect(r.map.e0).toEqual(syl('A'));
		expect(r.map.e1).toBeUndefined();
		expect(r.map.e2).toEqual(syl('B'));
		expect(r.map.e3).toEqual(syl('C'));
		expect(r.displaced).toEqual([syl('D')]);
	});

	it('shifts back: vacates the last event, displaces fromIndex', () => {
		const r = shiftToEndOfLyric(map(), ids, 1, 'back');
		expect(r.map.e0).toEqual(syl('A'));
		expect(r.map.e1).toEqual(syl('C'));
		expect(r.map.e2).toEqual(syl('D'));
		expect(r.map.e3).toBeUndefined();
		expect(r.displaced).toEqual([syl('B')]);
	});

	it('does not stop at an undecided gap partway through the range', () => {
		const withGap: PairingMap = { e0: syl('A'), e1: syl('B'), e2: syl('C'), e4: syl('E') };
		const gapIds = ['e0', 'e1', 'e2', 'e3', 'e4'];
		const r = shiftToEndOfLyric(withGap, gapIds, 0, 'forward');
		expect(r.map.e0).toBeUndefined();
		expect(r.map.e1).toEqual(syl('A'));
		expect(r.map.e2).toEqual(syl('B'));
		// e3 was undecided going in; the shift passes through it and fills it.
		expect(r.map.e3).toEqual(syl('C'));
		expect(r.map.e4).toBeUndefined();
		expect(r.displaced).toEqual([syl('E')]);
	});

	it('moves melisma and empty pairings exactly like a syllable', () => {
		const m: PairingMap = { e0: { kind: 'melisma' }, e1: { kind: 'empty' }, e2: syl('C') };
		const r = shiftToEndOfLyric(m, ['e0', 'e1', 'e2'], 0, 'forward');
		expect(r.map.e0).toBeUndefined();
		expect(r.map.e1).toEqual({ kind: 'melisma' });
		expect(r.map.e2).toEqual({ kind: 'empty' });
		expect(r.displaced).toEqual([syl('C')]);
	});

	it('does not mutate the map it was given', () => {
		const original = map();
		const snapshot = { ...original };
		shiftToEndOfLyric(original, ids, 1, 'forward');
		expect(original).toEqual(snapshot);
	});

	it('returns a fresh map object, not the one it was given', () => {
		const original = map();
		const r = shiftToEndOfLyric(original, ids, 1, 'forward');
		expect(r.map).not.toBe(original);
	});
});

describe('shiftToNextOpenNote', () => {
	// e3 is undecided. It is the point of this scope: it CATCHES the shift.
	const gapIds = ['e0', 'e1', 'e2', 'e3', 'e4'];
	const withGap = (): PairingMap => ({ e0: syl('A'), e1: syl('B'), e2: syl('C'), e4: syl('E') });

	it('forward: the open note absorbs the shift and nothing is displaced', () => {
		const r = shiftToNextOpenNote(withGap(), gapIds, 0, 'forward');
		expect(r.map.e0).toBeUndefined();
		expect(r.map.e1).toEqual(syl('A'));
		expect(r.map.e2).toEqual(syl('B'));
		// The gap is filled rather than stepped around, and C survives.
		expect(r.map.e3).toEqual(syl('C'));
		expect(r.map.e4).toEqual(syl('E'));
		expect(r.displaced).toEqual([]);
	});

	it('back: an open note BELOW fromIndex absorbs the shift', () => {
		const r = shiftToNextOpenNote(withGap(), gapIds, 4, 'back');
		expect(r.map.e0).toEqual(syl('A'));
		expect(r.map.e1).toEqual(syl('B'));
		expect(r.map.e2).toEqual(syl('C'));
		expect(r.map.e3).toEqual(syl('E'));
		expect(r.map.e4).toBeUndefined();
		expect(r.displaced).toEqual([]);
	});

	it('back: with no open note below, the pairing at index 0 falls off the front', () => {
		const m: PairingMap = { e0: syl('A'), e1: syl('B'), e2: syl('C') };
		const r = shiftToNextOpenNote(m, ['e0', 'e1', 'e2'], 2, 'back');
		expect(r.map.e0).toEqual(syl('B'));
		expect(r.map.e1).toEqual(syl('C'));
		expect(r.map.e2).toBeUndefined();
		expect(r.displaced).toEqual([syl('A')]);
	});

	it('forward: with nothing undecided it behaves exactly like shiftToEndOfLyric', () => {
		const m: PairingMap = { e0: syl('A'), e1: syl('B'), e2: syl('C') };
		const ids = ['e0', 'e1', 'e2'];
		expect(shiftToNextOpenNote(m, ids, 0, 'forward')).toEqual(
			shiftToEndOfLyric(m, ids, 0, 'forward'),
		);
	});

	it('a melisma is a decision and does not stop the shift', () => {
		const m: PairingMap = { e0: syl('A'), e1: { kind: 'melisma' }, e3: syl('D') };
		const r = shiftToNextOpenNote(m, ['e0', 'e1', 'e2', 'e3'], 0, 'forward');
		expect(r.map.e0).toBeUndefined();
		expect(r.map.e1).toEqual(syl('A'));
		expect(r.map.e2).toEqual({ kind: 'melisma' });
		expect(r.map.e3).toEqual(syl('D'));
		expect(r.displaced).toEqual([]);
	});

	it('does not mutate the map it was given', () => {
		const original = withGap();
		const snapshot = { ...original };
		shiftToNextOpenNote(original, gapIds, 0, 'forward');
		expect(original).toEqual(snapshot);
	});
});

describe('rotateSyllables', () => {
	const ids = ['e0', 'e1', 'e2'];
	const map = (): PairingMap => ({ e0: syl('A'), e1: syl('B'), e2: syl('C') });

	it('rotates forward: the last value wraps to the first index', () => {
		const r = rotateSyllables(map(), ids, 0, 2, 'forward');
		expect(r.map).toEqual({ e0: syl('C'), e1: syl('A'), e2: syl('B') });
		expect(r.displaced).toEqual([]);
	});

	it('rotates back: the first value wraps to the last index', () => {
		const r = rotateSyllables(map(), ids, 0, 2, 'back');
		expect(r.map).toEqual({ e0: syl('B'), e1: syl('C'), e2: syl('A') });
		expect(r.displaced).toEqual([]);
	});

	it('is lossless: the same set of pairings comes back, only permuted', () => {
		const before = map();
		const r = rotateSyllables(before, ids, 0, 2, 'forward');
		const beforeSet = ids.map((id) => JSON.stringify(before[id])).sort();
		const afterSet = ids.map((id) => JSON.stringify(r.map[id])).sort();
		expect(afterSet).toEqual(beforeSet);
		expect(r.displaced).toEqual([]);
	});

	it('a single-element range is its own rotation', () => {
		const r = rotateSyllables(map(), ids, 1, 1, 'forward');
		expect(r.map).toEqual(map());
		expect(r.displaced).toEqual([]);
	});

	it('does not mutate the map it was given', () => {
		const original = map();
		const snapshot = { ...original };
		rotateSyllables(original, ids, 0, 2, 'forward');
		expect(original).toEqual(snapshot);
	});
});

describe('degenerate inputs', () => {
	it('an empty eventIds array is a no-op that still returns a fresh map', () => {
		const original: PairingMap = { e0: syl('A') };
		const r = shiftToEndOfLyric(original, [], 0, 'forward');
		expect(r.map).toEqual(original);
		expect(r.map).not.toBe(original);
		expect(r.displaced).toEqual([]);
	});

	it('an out-of-range fromIndex clamps to the last valid index', () => {
		const original: PairingMap = { e0: syl('A'), e1: syl('B') };
		const r = shiftToEndOfLyric(original, ['e0', 'e1'], 99, 'forward');
		// Clamped to index 1 (e1): a single-element range vacates and displaces it.
		expect(r.map).toEqual({ e0: syl('A') });
		expect(r.displaced).toEqual([syl('B')]);
	});

	it('a negative fromIndex clamps to zero', () => {
		const original: PairingMap = { e0: syl('A'), e1: syl('B') };
		const r = shiftToEndOfLyric(original, ['e0', 'e1'], -5, 'forward');
		expect(r.map).toEqual({ e1: syl('A') });
		expect(r.displaced).toEqual([syl('B')]);
	});

	it('rotateSyllables with fromIndex > toIndex is a no-op that still returns a fresh map', () => {
		const original: PairingMap = { e0: syl('A'), e1: syl('B'), e2: syl('C') };
		const r = rotateSyllables(original, ['e0', 'e1', 'e2'], 2, 0, 'forward');
		expect(r.map).toEqual(original);
		expect(r.map).not.toBe(original);
		expect(r.displaced).toEqual([]);
	});

	it('a duplicate event id within the range resolves to the higher local index winning', () => {
		// ids[0] and ids[1] are both 'e0', so the map has one slot for both.
		const original: PairingMap = { e0: syl('A'), e1: syl('B') };
		const r = shiftToEndOfLyric(original, ['e0', 'e0', 'e1'], 0, 'forward');
		// vals read at both duplicate positions are 'A' (same key). The write at
		// local index 1 (the second 'e0') happens after the write at local index
		// 0, so it wins: e0 ends up holding what shifted into index 1, namely A.
		expect(r.map).toEqual({ e0: syl('A'), e1: syl('A') });
		expect(r.displaced).toEqual([syl('B')]);
	});
});
