/**
 * clef-key-prompt.test.ts — N.97's pre-fill rule.
 *
 * The cases that matter are the ones where the prompt must NOT claim a reading:
 * a clef it cannot offer, a key signature that abstained, systems that
 * disagreed. Each of those falls back to the ask, word for word, which is the
 * behaviour this ship promised not to regress.
 */
import { describe, it, expect } from 'vitest';
import { prefillFrom } from './clef-key-prompt';
import type { ClefKeyProbe } from '../engine/page-reader';

const probe = (over: Partial<ClefKeyProbe>): ClefKeyProbe => ({
	glyph: 'gClef',
	sign: 'G',
	line: 2,
	ottavaGlyph: false,
	fifths: 0,
	systems: 3,
	agreeing: 3,
	...over
});

describe('N.97 the prompt pre-fills what the page printed', () => {
	it('pre-selects plain treble for a plain G clef', () => {
		expect(prefillFrom(probe({ glyph: 'gClef', fifths: 2 }))).toEqual({
			clefChoice: 0,
			fifths: 2
		});
	});

	it('pre-selects the octave-down treble only for the 8-bearing glyph', () => {
		expect(prefillFrom(probe({ glyph: 'gClef8vb', ottavaGlyph: true, fifths: 0 }))).toEqual({
			clefChoice: 1,
			fifths: 0
		});
	});

	it('pre-selects bass for an F clef', () => {
		expect(prefillFrom(probe({ glyph: 'fClef', sign: 'F', line: 4, fifths: 2 }))).toEqual({
			clefChoice: 2,
			fifths: 2
		});
	});

	it('carries a flat key signature through as a negative count', () => {
		expect(prefillFrom(probe({ fifths: -3 }))?.fifths).toBe(-3);
	});

	it('carries a seven-sharp signature, the widest this corpus prints', () => {
		expect(prefillFrom(probe({ fifths: 7 }))?.fifths).toBe(7);
	});
});

describe('N.97 the prompt asks rather than claiming a reading it has not got', () => {
	it('asks where there was no probe at all', () => {
		expect(prefillFrom(null)).toBeNull();
		expect(prefillFrom(undefined)).toBeNull();
	});

	it('asks where the clef abstained or the systems disagreed', () => {
		expect(prefillFrom(probe({ glyph: null }))).toBeNull();
	});

	it('asks for a C clef, which the three-way control cannot offer', () => {
		expect(prefillFrom(probe({ glyph: 'cClef', sign: 'C', line: 3, fifths: 0 }))).toBeNull();
	});

	it('asks where the key signature abstained, even with a clef in hand', () => {
		expect(prefillFrom(probe({ glyph: 'gClef', fifths: null }))).toBeNull();
	});

	it('asks for a fifths count outside the options the prompt lists', () => {
		expect(prefillFrom(probe({ fifths: 8 }))).toBeNull();
		expect(prefillFrom(probe({ fifths: -8 }))).toBeNull();
	});
});
