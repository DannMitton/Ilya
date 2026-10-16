/**
 * word-reset.test.ts: the pure half of per-word reset, lifted from
 * `+page.svelte`'s `handleReset` (N.135 stage 3's ceiling payment).
 */
import { describe, it, expect } from 'vitest';
import { resetWord } from './word-reset';

const empty = new Map<string, unknown>();

describe('resetWord', () => {
	it('returns null for every map the word is not in, and asks for no transcription', () => {
		const r = resetWord('0-1', {
			stress: new Map([['0-2', 'x']]),
			yo: new Map([['0-2-1', 'y']]),
			syllables: new Map([['0-2', 'z']]),
			spot: new Map([['0-2', true]]),
			glosses: new Map([['0-2', 'g']]),
			anchors: new Map([['0-2', 'a']]),
		});
		expect(r).toEqual({ stress: null, yo: null, syllables: null, spot: null, glosses: null, anchors: null, pipeline: false });
	});

	it('clears a stress override and asks for the transcription again', () => {
		const stress = new Map([['0-1', 's'], ['0-2', 't']]);
		const r = resetWord('0-1', { stress, yo: empty, syllables: empty, spot: empty, glosses: empty as Map<string, string>, anchors: empty as Map<string, string> });
		expect([...r.stress!.keys()]).toEqual(['0-2']);
		expect(stress.size).toBe(2);
		expect(r.pipeline).toBe(true);
	});

	it('clears the ё toggles of this word by prefix and not those of word 0-10', () => {
		const yo = new Map([['0-1-3', 'a'], ['0-1-5', 'b'], ['0-10-2', 'c'], ['1-1-3', 'd']]);
		const r = resetWord('0-1', { stress: empty, yo, syllables: empty, spot: empty, glosses: empty as Map<string, string>, anchors: empty as Map<string, string> });
		expect([...r.yo!.keys()]).toEqual(['0-10-2', '1-1-3']);
		expect(r.pipeline).toBe(true);
	});

	it('clears a syllable boundary and a spot reconstitution without asking for the transcription', () => {
		const r = resetWord('2-0', {
			stress: empty,
			yo: empty,
			syllables: new Map([['2-0', 'b']]),
			spot: new Map([['2-0', true]]),
			glosses: empty as Map<string, string>,
			anchors: empty as Map<string, string>,
		});
		expect(r.syllables!.size).toBe(0);
		expect(r.spot!.size).toBe(0);
		expect(r.pipeline).toBe(false);
	});

	it('clears a gloss and its anchor together', () => {
		const r = resetWord('0-0', {
			stress: empty,
			yo: empty,
			syllables: empty,
			spot: empty,
			glosses: new Map([['0-0', 'tea'], ['0-1', 'cup']]),
			anchors: new Map([['0-0', 'чай'], ['0-1', 'чашка']]),
		});
		expect([...r.glosses!]).toEqual([['0-1', 'cup']]);
		expect([...r.anchors!]).toEqual([['0-1', 'чашка']]);
	});

	it('clears the gloss even when its anchor row is missing', () => {
		const r = resetWord('0-0', { stress: empty, yo: empty, syllables: empty, spot: empty, glosses: new Map([['0-0', 'tea']]), anchors: new Map() });
		expect(r.glosses!.size).toBe(0);
		expect(r.anchors!.size).toBe(0);
	});
});
