import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Vowel } from '$lib/voice/engine/types';
import { listSep, provisionalPartsFor, statusLineFor } from './profile-status';

// Pins the words moved out of `MarkupPane.svelte` (N.94 slice 1 addendum): the
// same strings the pane drew before the move.
const FIVE: Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o'];
const set = (sampledCount: number) => ({ sampledCount, personal: true, core: FIVE });
const below = (sampledCount: number, core: Vowel[]) => ({ sampledCount, personal: false, core });

describe('the Markup profile status lines', () => {
	it('names the measured count in words, lowercased, in both languages', () => {
		expect(statusLineFor(set(0), 'en')).toBe('Your profile is now set.');
		expect(statusLineFor(set(1), 'en')).toBe('Your profile is now set with one vowel measured.');
		expect(statusLineFor(set(5), 'en')).toBe('Your profile is now set with five vowels measured.');
		expect(statusLineFor(set(7), 'en')).toBe('Your profile is now set with seven vowels measured.');
		expect(statusLineFor(set(7), 'fr')).toBe('Votre profil est maintenant établi, avec sept voyelles mesurées.');
	});

	it('past ten, the count is a numeral', () => {
		expect(statusLineFor(set(11), 'en')).toBe('Your profile is now set with 11 vowels measured.');
	});

	it('below five stable core vowels, says where the voice stands, in the sentence the VOICE pane prints', () => {
		expect(statusLineFor(below(1, ['i']), 'en')).toBe(
			'You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values.'
		);
		expect(statusLineFor(below(1, ['i']), 'fr')).toBe(
			'Vous avez échantillonné 1 des 6 voyelles de base jusqu’ici ([i]). Pour compléter votre espace vocalique personnel, Ilya a besoin d’au moins 5 échantillons stables en friture vocale. D’ici à ce que vous en fournissiez 4 de plus, les voyelles non échantillonnées reçoivent des valeurs par défaut.'
		);
	});

	it('a high sampled count does not silence the below-five sentence, and one short reads "1 more"', () => {
		expect(statusLineFor(below(7, ['i', 'e', 'ɛ', 'ɑ']), 'en')).toBe(
			'You have sampled 4 of the 6 core vowels so far ([i], [e], [ɛ], and [ɑ]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 1 more, unsampled vowels are assigned placeholder values.'
		);
	});

	it('with no stable core vowel, leaves the list and its parentheses out', () => {
		expect(statusLineFor(below(1, []), 'en')).toBe(
			'You have sampled 0 of the 6 core vowels so far. To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 5 more, unsampled vowels are assigned placeholder values.'
		);
	});

	it('pins the singular form of the set sentence, which the pane cannot reach (isPersonal needs five stable core vowels)', () => {
		expect(statusLineFor(set(1), 'en')).toBe('Your profile is now set with one vowel measured.');
	});

	it('counts the vowels the singer sampled, never the values the forecast holds', () => {
		const pane = readFileSync('src/lib/melody/MarkupPane.svelte', 'utf8');
		expect(pane).toMatch(/const sampledVowels = \$derived\(ROSTER_ORDER\.filter\(\(g\) => isSung\(formants\[g\]\)\)\);/);
		// Lane 78: the pane hands the count to `melodyNotes`, which calls `statusLineFor` (`melody/blank-notes.ts`).
		expect(pane).toMatch(/melodyNotes\(\{ generic: adapted\.generic, sampledCount: sampledVowels\.length, personal: isPersonal\(formants\), core: stableCore\(formants\)/);
		expect(readFileSync('src/lib/melody/blank-notes.ts', 'utf8')).toMatch(/statusLineFor\(\{ sampledCount: o\.sampledCount, personal: o\.personal, core: o\.core \}, o\.language\)/);
		expect(pane).not.toMatch(/snapshot\.fR1\[/);
	});

	it('splits the provisional sentence around the vowels', () => {
		expect(provisionalPartsFor(1, 'en')).toEqual(['Your ', ' is provisional; set it in VOICE.']);
		expect(provisionalPartsFor(2, 'fr')[0]).toBe('Vos voyelles ');
	});

	it('joins with the Oxford comma in English and without it in French', () => {
		expect([0, 1, 2].map((i) => listSep(i, 3, 'en'))).toEqual(['', ', ', ', and ']);
		expect([0, 1, 2].map((i) => listSep(i, 3, 'fr'))).toEqual(['', ', ', ' et ']);
		expect(listSep(1, 2, 'en')).toBe(' and ');
	});
});
