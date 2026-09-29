import { describe, expect, it } from 'vitest';
import { listSep, provisionalPartsFor, statusLineFor } from './profile-status';

// Pins the words moved out of `MarkupPane.svelte` (N.94 slice 1 addendum): the
// same strings the pane drew before the move.
describe('the Markup profile status lines', () => {
	it('names the measured count in words, lowercased, in both languages', () => {
		expect(statusLineFor(0, 'en')).toBe('Your profile is now set.');
		expect(statusLineFor(1, 'en')).toBe('Your profile is now set with one vowel measured.');
		expect(statusLineFor(7, 'en')).toBe('Your profile is now set with seven vowels measured.');
		expect(statusLineFor(7, 'fr')).toBe('Votre profil est maintenant établi, avec sept voyelles mesurées.');
	});

	it('past ten, the count is a numeral', () => {
		expect(statusLineFor(11, 'en')).toBe('Your profile is now set with 11 vowels measured.');
	});

	it('splits the provisional sentence around the vowels', () => {
		expect(provisionalPartsFor(1, 'en')).toEqual(['Your ', ' is provisional, and you can update this value anytime through the drawer on the left.']);
		expect(provisionalPartsFor(2, 'fr')[0]).toBe('Vos voyelles ');
	});

	it('joins with the Oxford comma in English and without it in French', () => {
		expect([0, 1, 2].map((i) => listSep(i, 3, 'en'))).toEqual(['', ', ', ', and ']);
		expect([0, 1, 2].map((i) => listSep(i, 3, 'fr'))).toEqual(['', ', ', ' et ']);
		expect(listSep(1, 2, 'en')).toBe(' and ');
	});
});
