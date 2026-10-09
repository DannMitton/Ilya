import { describe, it, expect } from 'vitest';
import type { Pitch } from '@ilya/score-parser';
import {
	clefFor,
	clefForVoiceType,
	staffOffset,
	ledgerOffsets,
	pitchLabel,
	spokenPitchLabel
} from './note-picker';

const p = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

describe('clefFor', () => {
	it('chooses treble from middle C up', () => {
		expect(clefFor(p('C', 4))).toBe('treble');
		expect(clefFor(p('A', 4))).toBe('treble');
		expect(clefFor(p('C', 6))).toBe('treble');
	});

	it('chooses bass below middle C', () => {
		expect(clefFor(p('B', 3))).toBe('bass');
		expect(clefFor(p('D', 2))).toBe('bass');
	});

	it('decides by sounding pitch on enharmonic spellings', () => {
		// B♯3 sounds middle C: treble despite the octave-3 spelling.
		expect(clefFor(p('B', 3, 1))).toBe('treble');
		// C♭4 sounds B3: bass despite the octave-4 spelling.
		expect(clefFor(p('C', 4, -1))).toBe('bass');
	});
});

describe('the clef follows the singer\u2019s voice type (Dann, 2026-10-09)', () => {
	// D\u266f4 is the pitch the walk caught: a bass's secondary passaggio drew on a treble clef.
	const D_SHARP_4 = p('D', 4, 1);

	it('gives a bass the bass clef at his passaggio, where the pitch rule alone gave treble', () => {
		expect(clefFor(D_SHARP_4)).toBe('treble');
		expect(clefFor(D_SHARP_4, 'bass')).toBe('bass');
	});

	it('bass, bass-baritone, and baritone take the bass clef', () => {
		for (const t of ['bass', 'bass-baritone', 'baritone']) expect(clefFor(D_SHARP_4, t)).toBe('bass');
	});

	it('tenor and the treble voices take the treble clef, even on a note the pitch rule would put in bass', () => {
		const A3 = p('A', 3);
		expect(clefFor(A3)).toBe('bass');
		for (const t of ['tenor', 'soprano', 'mezzo-soprano', 'contralto', 'countertenor']) {
			expect(clefFor(A3, t), t).toBe('treble');
		}
	});

	it('no type, "Not sure", or a type the build does not know keeps the pitch rule', () => {
		for (const t of [undefined, '', 'not-sure', 'something-else']) {
			expect(clefFor(D_SHARP_4, t), String(t)).toBe('treble');
			expect(clefFor(p('A', 3), t), String(t)).toBe('bass');
			expect(clefForVoiceType(t), String(t)).toBeNull();
		}
	});

	it('a bass\u2019s F\u266f4 sits on two ledger lines', () => {
		const f = p('F', 4, 1);
		expect(clefFor(f, 'bass')).toBe('bass');
		expect(ledgerOffsets(staffOffset(f, 'bass'))).toEqual([6, 8]);
	});

	it('a note the drawing could not show falls back to the pitch rule\u2019s clef', () => {
		// A tenor\u2019s C2 would sit 20 steps below the middle of a treble clef, off the picker\u2019s box.
		expect(staffOffset(p('C', 2), 'treble')).toBe(-20);
		expect(clefFor(p('C', 2), 'tenor')).toBe('bass');
		// Within the box the type\u2019s clef stands.
		expect(clefFor(p('C', 3), 'tenor')).toBe('treble');
	});
});

describe('staffOffset', () => {
	it('puts the middle line at zero', () => {
		expect(staffOffset(p('B', 4), 'treble')).toBe(0);
		expect(staffOffset(p('D', 3), 'bass')).toBe(0);
	});

	it('positions by SPELLED step, not sounding pitch', () => {
		// C♭4 occupies the C4 position (one ledger below treble).
		expect(staffOffset(p('C', 4, -1), 'treble')).toBe(-6);
		expect(staffOffset(p('C', 4), 'treble')).toBe(-6);
	});

	it('spans the staff lines at ±4', () => {
		expect(staffOffset(p('F', 5), 'treble')).toBe(4); // top line
		expect(staffOffset(p('E', 4), 'treble')).toBe(-4); // bottom line
		expect(staffOffset(p('A', 3), 'bass')).toBe(4);
		expect(staffOffset(p('G', 2), 'bass')).toBe(-4);
	});
});

describe('ledgerOffsets', () => {
	it('needs none within the staff or in the first gap beyond', () => {
		expect(ledgerOffsets(0)).toEqual([]);
		expect(ledgerOffsets(4)).toEqual([]);
		expect(ledgerOffsets(5)).toEqual([]); // space just above the top line
		expect(ledgerOffsets(-5)).toEqual([]);
	});

	it('adds the first ledger line at ±6', () => {
		expect(ledgerOffsets(6)).toEqual([6]); // note ON the ledger line
		expect(ledgerOffsets(-6)).toEqual([-6]); // middle C below treble
	});

	it('carries a note in the space beyond a ledger on that ledger', () => {
		expect(ledgerOffsets(7)).toEqual([6]);
		expect(ledgerOffsets(-7)).toEqual([-6]);
	});

	it('stacks ledgers out to a far note', () => {
		expect(ledgerOffsets(10)).toEqual([6, 8, 10]);
		expect(ledgerOffsets(-9)).toEqual([-6, -8]);
	});
});

describe('pitchLabel and spokenPitchLabel', () => {
	it('renders naturals without an accidental mark', () => {
		expect(pitchLabel(p('C', 4))).toBe('C4');
		expect(spokenPitchLabel(p('C', 4))).toBe('C 4');
	});

	it('renders single accidentals', () => {
		expect(pitchLabel(p('F', 4, 1))).toBe('F♯4');
		expect(spokenPitchLabel(p('F', 4, 1))).toBe('F sharp 4');
		expect(pitchLabel(p('B', 3, -1))).toBe('B♭3');
		expect(spokenPitchLabel(p('B', 3, -1))).toBe('B flat 3');
	});

	it('renders double accidentals', () => {
		expect(pitchLabel(p('G', 5, 2))).toBe('Gx5');
		expect(spokenPitchLabel(p('G', 5, 2))).toBe('G double sharp 5');
		expect(pitchLabel(p('E', 2, -2))).toBe('E♭♭2');
		expect(spokenPitchLabel(p('E', 2, -2))).toBe('E double flat 2');
	});
});
