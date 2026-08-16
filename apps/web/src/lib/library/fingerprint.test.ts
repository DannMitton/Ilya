/**
 * fingerprint.test.ts — N.67 step 2.
 *
 * The fingerprint has to pass the design's own three tests (§2.4): a re-export
 * of the same music matches, genuinely changed music does not, and a rest is
 * part of the music rather than a gap in it.
 */
import { describe, it, expect } from 'vitest';
import { canonicalVocalLine, fingerprintVocalLine, hashBytes } from './fingerprint';
import type { VocalLineEvent } from '@ilya/score-parser';

function note(id: string, step: string, octave: number, base = 'quarter'): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { numerator: 0, denominator: 1 },
		duration: { base, dots: 0 },
		pitch: { step, octave, alter: 0 },
	} as unknown as VocalLineEvent;
}

function rest(id: string, base = 'half'): VocalLineEvent {
	return {
		id,
		type: 'rest',
		measureIndex: 0,
		rhythmicPosition: { numerator: 0, denominator: 1 },
		duration: { base, dots: 0 },
	} as unknown as VocalLineEvent;
}

// The STATE.md fixture, read out of that file rather than re-derived: five
// pitched notes and one half rest. It is NOT six notes.
const control = [
	note('m1-0-1', 'C', 4),
	note('m1-1-4', 'D', 4),
	note('m1-2-4', 'E', 4),
	note('m1-3-4', 'F', 4),
	note('m2-0-1', 'G', 4, 'half'),
	rest('m2-1-2'),
];

describe('the canonical vocal line', () => {
	it('carries every event, rests included', () => {
		const lines = canonicalVocalLine(control).split('\n');

		expect(lines).toHaveLength(6);
		expect(lines[5]).toBe('m2-1-2|rest|half.0');
	});

	it('names a pitch by step, alteration, and octave', () => {
		expect(canonicalVocalLine([note('m1-0-1', 'C', 4)])).toBe('m1-0-1|C04|quarter.0');
	});
});

describe('the fingerprint', () => {
	it('is stable across two runs over the same music', async () => {
		expect(await fingerprintVocalLine(control)).toBe(await fingerprintVocalLine(control));
	});

	it('matches a re-export whose bytes differ but whose music does not', async () => {
		// The parsers construct ids positionally and deterministically, so the
		// same music through a different export produces the same sequence.
		const reExported = control.map((e) => ({ ...e }) as VocalLineEvent);

		expect(await fingerprintVocalLine(reExported)).toBe(await fingerprintVocalLine(control));
	});

	it('stops matching when one note changes', async () => {
		const corrected = [...control];
		corrected[3] = note('m1-3-4', 'G', 4);

		expect(await fingerprintVocalLine(corrected)).not.toBe(await fingerprintVocalLine(control));
	});

	it('stops matching when a rest is removed', async () => {
		expect(await fingerprintVocalLine(control.slice(0, 5))).not.toBe(await fingerprintVocalLine(control));
	});

	it('is a 64-character hex digest', async () => {
		expect(await fingerprintVocalLine(control)).toMatch(/^[0-9a-f]{64}$/);
	});
});

describe('the content hash', () => {
	it('names the bytes, and differs when a single byte does', async () => {
		const a = new TextEncoder().encode('<score/>');
		const b = new TextEncoder().encode('<score />');

		expect(await hashBytes(a)).toBe(await hashBytes(a));
		expect(await hashBytes(a)).not.toBe(await hashBytes(b));
	});
});
