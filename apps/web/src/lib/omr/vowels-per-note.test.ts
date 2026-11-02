/**
 * vowelsPerNote (brief r5 step 6): one vowel per note, no more and no less.
 */
import { describe, expect, it } from 'vitest';
import { isCyrillicVerse, vowelsPerNote, type NoteText } from './vowels-per-note';

const NBSP = ' ';
const of = (...texts: (string | null)[]): NoteText[] => texts.map((text, id) => ({ id, text }));
const kinds = (notes: NoteText[]) => vowelsPerNote(notes).map((b) => [b.id, b.kind]);

describe('vowelsPerNote', () => {
	it('is silent on «в бью»: one vowel, the clitic joined to its host by U+00A0', () => {
		expect(kinds(of(`в${NBSP}бью`))).toEqual([]);
	});
	it('reports «в» alone: no vowel', () => {
		expect(kinds(of('в'))).toEqual([[0, 'no-vowel']]);
	});
	it('is silent on «бью ж»: one vowel, the enclitic joined to its host', () => {
		expect(kinds(of(`бью${NBSP}ж`))).toEqual([]);
	});
	it('counts «й» a consonant: «мой» is one vowel', () => {
		expect(kinds(of('мой', 'й'))).toEqual([[1, 'no-vowel']]);
	});
	it('reports «мгновенья» on one note: three vowels (the brief says four; о, е, я are three)', () => {
		expect(vowelsPerNote(of('мгновенья'))).toEqual([{ id: 0, text: 'мгновенья', kind: 'many-vowels', vowels: 3 }]);
	});
	it('counts ѣ, і, and ѵ as vowels, the set VOWEL has', () => {
		expect(kinds(of('дѣ', 'ѵ', 'бѣлѣ'))).toEqual([[2, 'many-vowels']]);
	});
	// Was: a note with no text was not reported. Now (N.135 step 5): reported `no-syllable` unless it is a continuation.
	it('does not report a joint, and reports a note with no text as no-syllable', () => {
		expect(kinds(of('-', '_'))).toEqual([]);
		expect(kinds(of(null, '', ' '))).toEqual([[0, 'no-syllable'], [1, 'no-syllable'], [2, 'no-syllable']]);
		expect(kinds(of(null, 'мир'))).toEqual([[0, 'no-syllable']]);
	});
	it('takes continuation as an input: a continuation with no text is not a no-syllable breach, and the option turns the kind off', () => {
		const notes = [{ id: 0, text: 'мир' }, { id: 1, text: null, continuation: true }, { id: 2, text: '' }];
		expect(vowelsPerNote(notes).map((b) => [b.id, b.kind])).toEqual([[2, 'no-syllable']]);
		expect(vowelsPerNote(notes, { noSyllable: false })).toEqual([]);
	});
	// Was (before N.135 step 4): a continuation holding letters and no vowel was not reported, and `[]` was expected for «в».
	// Now: a continuation is tested like any note (CONTRACT §0.1, no exceptions). A continuation with no text is still not tested.
	it('reports a continuation (tied into, under an extender, a melisma\'s later note) with letters and no vowel, and two vowels on one', () => {
		expect(vowelsPerNote([{ id: 0, text: 'в', continuation: true }]).map((b) => b.kind)).toEqual(['no-vowel']);
		expect(vowelsPerNote([{ id: 0, text: 'ая', continuation: true }]).map((b) => b.kind)).toEqual(['many-vowels']);
		expect(vowelsPerNote([{ id: 0, text: '', continuation: true }, { id: 1, text: null, continuation: true }])).toEqual([]);
	});
	it('reports a mark alone, a lone «#» above all, and no allow-list permits it', () => {
		expect(kinds(of('#', '.', '#'))).toEqual([[0, 'mark-alone'], [1, 'mark-alone'], [2, 'mark-alone']]);
	});
	it('does not report «я#» fused to its syllable with a no-break space', () => {
		expect(kinds(of(`я${NBSP}#`))).toEqual([]);
	});
	it('applies the vowel count to a Cyrillic verse only; the mark check applies to every verse', () => {
		const ipa = of('ˈko', 'mnɑ', '#');
		expect(isCyrillicVerse(ipa.map((n) => n.text))).toBe(false);
		expect(vowelsPerNote(ipa, { vowelCount: false }).map((b) => [b.id, b.kind])).toEqual([[2, 'mark-alone']]);
		expect(isCyrillicVerse(['Ком', null])).toBe(true);
	});
});
