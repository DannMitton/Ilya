/**
 * spot-choice.test.ts: row 184 (word marks), Dann 2026-11-09 22:20 option 2. A saved spot mark is the singer's choice for the word, so
 * it survives a change of the device-wide Reconstitution setting; surfaces read only the words whose choice differs from it.
 */
import { describe, expect, it } from 'vitest';
import { spotInversions } from './spot-choice';
import { WordMarks } from './word-marks.svelte';

describe('spotInversions', () => {
	it('lists the words whose choice differs from the setting', () => {
		const spot = new Map([['0-0', true], ['0-1', false]]);
		expect([...spotInversions(spot, false).keys()]).toEqual(['0-0']);
		expect([...spotInversions(spot, true).keys()]).toEqual(['0-1']);
	});

	it('a word the singer reconstituted stays reconstituted when the setting is turned on', () => {
		const marks = new WordMarks();
		marks.toggleSpot('0-0', false); // setting off: she reconstitutes this word
		expect(spotInversions(marks.spot, false).has('0-0')).toBe(true);
		// The setting is turned on: her word is now the same as the setting, so nothing inverts, and it still reads reconstituted.
		expect(spotInversions(marks.spot, true).has('0-0')).toBe(false);
		expect(marks.spot.get('0-0')).toBe(true);
	});

	it('a word she reduced stays reduced when the setting is turned on, and is not inverted by it', () => {
		const marks = new WordMarks();
		marks.toggleSpot('0-0', true); // setting on: she reduces this word
		expect(marks.spot.get('0-0')).toBe(false);
		expect(spotInversions(marks.spot, true).has('0-0')).toBe(true);
		expect(spotInversions(marks.spot, false).has('0-0')).toBe(false);
	});

	it('toggling a choice that now equals the setting sets the opposite, and toggling again removes it', () => {
		const marks = new WordMarks();
		marks.toggleSpot('0-0', false);
		// The setting is turned on; her saved choice (reconstituted) equals it. The box offers "reduce".
		marks.toggleSpot('0-0', true);
		expect(marks.spot.get('0-0')).toBe(false);
		marks.toggleSpot('0-0', true);
		expect(marks.spot.size).toBe(0);
	});

	it('load and maps are each other\'s inverse', () => {
		const a = new WordMarks();
		a.assignStress('0-1', {}, 1, 'user-override');
		a.toggleYo('0-1-2', 'user-override');
		a.setSyllable('0-2', { boundaries: [1] });
		a.toggleSpot('1-0', false);
		const b = new WordMarks();
		b.load(a.maps());
		expect(b.maps()).toEqual(a.maps());
		b.clear();
		expect(a.stress.size).toBe(1);
	});
});
