/**
 * Clef selection tests (v37 §A.17): source clef when present, else the
 * tessitura heuristic. See clef-select.ts for the Gould rule 76 basis.
 */

import { describe, expect, it } from 'vitest';
import { chooseClef, clefFromSource } from './clef-select';
import type { Clef, ParsedScore, Pitch, VocalLineEvent } from './types';

function note(id: string, step: Pitch['step'], octave: number, measureIndex = 0): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: { step, octave, alter: 0 },
	};
}

function score(vocalLine: VocalLineEvent[], clefs?: Array<{ measureIndex: number; clef: Clef }>): ParsedScore {
	return {
		source: { format: 'musicxml', fidelity: 'native', origin: 'musicxml-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: [],
		keySignatures: [],
		...(clefs ? { clefs } : {}),
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine,
	};
}

describe('clefFromSource', () => {
	it('maps G to treble, F to bass, and octave-displaced G to treble-8vb', () => {
		expect(clefFromSource({ sign: 'G', line: 2 })).toBe('treble');
		expect(clefFromSource({ sign: 'F', line: 4 })).toBe('bass');
		expect(clefFromSource({ sign: 'G', line: 2, octaveChange: -1 })).toBe('treble-8vb');
	});

	it('returns null for a C clef (not drawn; Gould rule 76)', () => {
		expect(clefFromSource({ sign: 'C', line: 3 })).toBeNull();
	});
});

describe('chooseClef', () => {
	it('prefers the source clef over the tessitura', () => {
		// A low line that the heuristic would set in bass, but the source says treble.
		const s = score([note('a', 'C', 3), note('b', 'D', 3), note('c', 'E', 3)], [
			{ measureIndex: 0, clef: { sign: 'G', line: 2 } },
		]);
		expect(chooseClef(s)).toBe('treble');
	});

	it('falls back to the heuristic for a source C clef', () => {
		const s = score([note('a', 'C', 3), note('b', 'D', 3), note('c', 'E', 3)], [
			{ measureIndex: 0, clef: { sign: 'C', line: 3 } },
		]);
		expect(chooseClef(s)).toBe('bass');
	});

	it('chooses treble for a soprano-tessitura line with no source clef', () => {
		expect(chooseClef(score([note('a', 'G', 4), note('b', 'A', 4), note('c', 'F', 5)]))).toBe('treble');
	});

	it('chooses bass for a low-male-tessitura line with no source clef', () => {
		expect(chooseClef(score([note('a', 'E', 2), note('b', 'B', 2), note('c', 'D', 3)]))).toBe('bass');
	});

	it('rests and unpitched events do not sway the median', () => {
		const rest: VocalLineEvent = {
			id: 'r',
			type: 'rest',
			measureIndex: 0,
			rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
			duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		};
		expect(chooseClef(score([rest, note('a', 'C', 5), rest, note('b', 'E', 5)]))).toBe('treble');
	});

	it('defaults an empty vocal line to treble', () => {
		expect(chooseClef(score([]))).toBe('treble');
	});
});
