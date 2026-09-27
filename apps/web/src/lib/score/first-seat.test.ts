import { describe, expect, it } from 'vitest';
import { shouldFoldOnArrival, shouldSeatFirstTranscription } from './first-seat';
import type { PairingMap } from './pairings';

describe('N.145 shouldSeatFirstTranscription', () => {
	it('seats a poem transcribed for the first time over a wordless score', () => {
		expect(shouldSeatFirstTranscription({}, true)).toBe(true);
	});

	it('seats a poem transcribed for the first time over a score that carries its own words, the same way, because this rule only asks whether a syllable is already placed', () => {
		// The wordless/worded distinction decides WHICH seat the caller runs
		// (mergeOnUpload's firstPass, or N.144's seatFilledPoem), not WHETHER
		// to run one; both start from the same empty map.
		expect(shouldSeatFirstTranscription({}, true)).toBe(true);
	});

	it('does nothing without a score attached', () => {
		expect(shouldSeatFirstTranscription({}, false)).toBe(false);
	});

	it('does not re-seat once a syllable is already placed, whether the poem was edited or a placement made by hand', () => {
		const pairings: PairingMap = {
			'm1-0-0': {
				kind: 'syllable',
				cyrillic: 'тес',
				ipa: 'tʲes',
				vowel: 'e',
				origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'тесная' },
			},
		};
		expect(shouldSeatFirstTranscription(pairings, true)).toBe(false);
	});

	it('still seats when the only decisions present are melisma or empty marks, because neither is a syllable this rule could destroy', () => {
		// A singer may mark a melisma by hand before ever typing a poem
		// (`toggleMelisma`'s own guard does not require a queue). This rule
		// only refuses to touch a SYLLABLE; both downstream seats
		// (`mergeOnUpload`'s `firstPass`, and N.144's `seatFilledPoem`) skip
		// any note that already carries a decision of its own, so the
		// melisma mark itself is never at risk from the seat this predicate
		// allows.
		const pairings: PairingMap = { 'm1-0-0': { kind: 'melisma' }, 'm1-1-0': { kind: 'empty' } };
		expect(shouldSeatFirstTranscription(pairings, true)).toBe(true);
	});
});

describe('N.161 shouldFoldOnArrival', () => {
	const placed: PairingMap = {
		'm1-0-0': {
			kind: 'syllable',
			cyrillic: 'тес',
			ipa: 'tʲes',
			vowel: 'e',
			origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'тесная' },
		},
	};

	it('refuses a map that already holds a placement, so a restore or a re-upload never folds', () => {
		expect(shouldFoldOnArrival(placed)).toBe(false);
	});

	it('accepts an empty map, so a first ingest and a whole-song replace still seat the clitic', () => {
		expect(shouldFoldOnArrival({})).toBe(true);
	});

	it('control: the same melisma and empty marks accept alone and refuse once one syllable joins them', () => {
		const marks: PairingMap = { 'm1-1-0': { kind: 'melisma' }, 'm1-2-0': { kind: 'empty' } };
		expect(shouldFoldOnArrival(marks)).toBe(true);
		expect(shouldFoldOnArrival({ ...marks, ...placed })).toBe(false);
	});
});
