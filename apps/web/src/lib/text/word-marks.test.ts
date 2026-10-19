/**
 * word-marks.test.ts: one witness's marks, moved from `+page.svelte`'s handlers
 * with their bodies unchanged (rows 109 and 110). Two instances never share a key.
 */
import { describe, it, expect } from 'vitest';
import { WordMarks } from './word-marks.svelte';
import { diffWordGrid } from '$lib/text-diff';

describe('WordMarks', () => {
	it('assigns, promotes a clitic, and reverts a stress mark', () => {
		const m = new WordMarks();
		m.assignStress('0-1', { isProclitic: true }, 1, 'user');
		expect(m.stress.get('0-1')).toEqual({ stressIndex: 1, stressSource: 'user', promotedFromClitic: true });
		m.assignStress('0-1', {}, 0, 'user');
		expect(m.stress.get('0-1')?.promotedFromClitic).toBe(true);
		m.revertStress('0-1');
		expect(m.stress.size).toBe(0);
	});

	it('toggles ё, spot, and a syllable boundary', () => {
		const m = new WordMarks();
		m.toggleYo('0-0-2', 'user');
		expect(m.yo.has('0-0-2')).toBe(true);
		m.toggleYo('0-0-2', null);
		expect(m.yo.size).toBe(0);
		m.toggleSpot('1-1');
		expect(m.spot.has('1-1')).toBe(true);
		m.toggleSpot('1-1');
		expect(m.spot.size).toBe(0);
		m.setSyllable('0-0', { boundaries: [1] } as never);
		expect(m.syllables.size).toBe(1);
		m.setSyllable('0-0', null);
		expect(m.syllables.size).toBe(0);
	});

	it('keeps two witnesses\' marks apart', () => {
		const lyrics = new WordMarks();
		const poem = new WordMarks();
		poem.assignStress('0-0', {}, 1, 'user');
		expect(lyrics.stress.size).toBe(0);
	});

	it('carries every map across a diff, the ё toggles by word', () => {
		const m = new WordMarks();
		m.assignStress('0-1', {}, 0, 'user');
		m.toggleYo('0-1-3', 'user');
		m.toggleSpot('0-1');
		m.carry(diffWordGrid([['а', 'б']], [['в'], ['а', 'б']]));
		expect([...m.stress.keys()]).toEqual(['1-1']);
		expect([...m.yo.keys()]).toEqual(['1-1-3']);
		expect([...m.spot.keys()]).toEqual(['1-1']);
		m.clear();
		expect(m.stress.size + m.yo.size + m.spot.size).toBe(0);
	});
});
