/**
 * Latin words on the Transcription page (`latin.ts`; brief
 * `brief-code-latin-words-on-the-page`, options 1 and 2).
 *
 * The thirty expectations below are copied from the desk's table,
 * `docs/sessions/table-seminarian-latin_r1_2026-09-27.md`, not read back out of
 * `latin.ts`, so this test fails if the shipped table drifts from the one Dann
 * checked against Richter (2002, pp. 43–49).
 */
import { describe, expect, it } from 'vitest';
import { processText } from './pipeline';
import { isLatinWord, seminarianIpa, showsRichterIpa } from './latin';

const TABLE: [string, string][] = [
	['panis', 'ˈpɑ ɲis'],
	['piscis', 'ˈpʲisʲ kʲis'],
	['crinis', 'ˈkrʲi ɲis'],
	['finis', 'ˈfʲi ɲis'],
	['ignis', 'ˈiɡ ɲis'],
	['lapis', 'ˈɫɑ pʲis'],
	['pulvis', 'ˈpul vʲis'],
	['cinis', 'ˈkʲi ɲis'],
	['orbis', 'ˈor bʲis'],
	['amnis', 'ˈɑm ɲis'],
	['et', 'ɛt'],
	['canalis', 'kɑ ˈnɑ lʲis'],
	['annalis', 'ɑ ˈnɑ lʲis'],
	['sanguis', 'ˈsɑn ɡwis'],
	['unguis', 'ˈun ɡwis'],
	['fascis', 'ˈfɑsʲ kʲis'],
	['axis', 'ˈɑk sʲis'],
	['funis', 'ˈfu ɲis'],
	['ensis', 'ˈɛɲ sʲis'],
	['fustis', 'ˈfusʲ tʲis'],
	['vectis', 'ˈvɛk tʲis'],
	['vermis', 'ˈvɛr mʲis'],
	['mensis', 'ˈmɛɲ sʲis'],
	['postis', 'ˈposʲ tʲis'],
	['follis', 'ˈfo lʲis'],
	['cucumis', 'ku ku ˈmʲis'],
	['atque', 'ˈɑt kwɛ'],
	['pollis', 'ˈpo lʲis'],
	['sentis', 'ˈsɛɲ tʲis'],
	['caulis', 'ˈkɑw lʲis'],
];

describe('a Latin word keeps its place on the page', () => {
	const lines = processText('Семинарист учит: Panis, piscis — crinis, gaudeamus.\n…\nОн устал.');
	const words = lines[0].words;

	it('reaches the page in the order the poem gives, marked Latin', () => {
		expect(words.map((w) => w.cleanWord)).toEqual(['Семинарист', 'учит', 'Panis', 'piscis', 'crinis', 'gaudeamus']);
		expect(words.map((w) => w.latin === true)).toEqual([false, false, true, true, true, true]);
	});

	it('carries no gloss, and no IPA unless the table has the word', () => {
		const latin = words.filter((w) => w.latin);
		expect(latin.map((w) => w.gloss)).toEqual(['', '', '', '']);
		expect(latin.map((w) => w.ipaDisplay)).toEqual(['ˈpɑ ɲis', 'ˈpʲisʲ kʲis', 'ˈkrʲi ɲis', '']);
		expect(latin.map((w) => w.stressedCyrillic)).toEqual(['Panis', 'piscis', 'crinis', 'gaudeamus']);
	});

	it('leaves a punctuation-only token off the page', () => {
		expect(words.some((w) => w.cleanWord === '')).toBe(false);
		expect(lines.map((l) => l.words.map((w) => w.cleanWord))).toEqual([
			['Семинарист', 'учит', 'Panis', 'piscis', 'crinis', 'gaudeamus'],
			['Он', 'устал'],
		]);
	});

	it('leaves a Russian word untouched', () => {
		expect(words[0].latin).toBeUndefined();
		expect(words[0].ipaDisplay).toBe(processText('Семинарист')[0].words[0].ipaDisplay);
	});

	it('credits Richter on a page that shows his IPA, and only then', () => {
		expect(showsRichterIpa(lines)).toBe(true);
		expect(showsRichterIpa(processText('gaudeamus igitur'))).toBe(false);
		expect(showsRichterIpa(processText('Он устал.'))).toBe(false);
	});
});

describe('isLatinWord', () => {
	it('is a word with a letter, every letter of it Latin (closing polish lane, step 5)', () => {
		expect(isLatinWord('panis,')).toBe(true);
		expect(isLatinWord('à')).toBe(true);
		expect(isLatinWord('cœur')).toBe(true);
		expect(isLatinWord('сын')).toBe(false);
		expect(isLatinWord('—')).toBe(false);
		expect(isLatinWord('сынa')).toBe(false);
		expect(isLatinWord('мeня')).toBe(false); // a Latin e inside a Russian word is garble, not Latin text
	});

	it('marks «à» and «cœur» Latin on the page, and keeps them in the line, with no IPA', () => {
		const words = processText('Он сказал: à ce soir, mon cœur.')[0].words;
		expect(words.filter((w) => w.latin).map((w) => w.cleanWord)).toEqual(['à', 'ce', 'soir', 'mon', 'cœur']);
		expect(words.filter((w) => w.latin).map((w) => w.ipaDisplay)).toEqual(['', '', '', '', '']);
	});
});

describe('Richter\u2019s IPA applies only to «Семинарист»\u2019s text (step 5, item 4)', () => {
	it('«et» alone in a French line gets no IPA and no Richter credit', () => {
		const lines = processText('Le vin et le pain');
		expect(lines[0].words.find((w) => w.cleanWord === 'et')!.ipaDisplay).toBe('');
		expect(showsRichterIpa(lines)).toBe(false);
		expect(showsRichterIpa(processText('panis et vinum'))).toBe(false); // one noun of the table is not enough
		expect(showsRichterIpa(processText('panis panis et'))).toBe(false); // the same noun twice is one noun
	});
	it('two different nouns of the table make the text «Семинарист»\u2019s, and «et» then keeps its row', () => {
		const lines = processText('Panis et piscis');
		expect(lines[0].words.map((w) => w.ipaDisplay)).toEqual(['ˈpɑ ɲis', 'ɛt', 'ˈpʲisʲ kʲis']);
		expect(showsRichterIpa(lines)).toBe(true);
	});
	it('«et» and «atque» do not count as nouns', () => {
		expect(showsRichterIpa(processText('et atque panis'))).toBe(false);
	});
});

describe('the Seminarian’s thirty Latin words, Richter in Grayson’s notation', () => {
	it('has exactly the table’s thirty words', () => {
		expect(TABLE).toHaveLength(30);
	});
	for (const [word, ipa] of TABLE) {
		it(word, () => {
			expect(seminarianIpa(word)).toBe(ipa);
			// in the song's text, which holds many nouns of the table: every row stays
			expect(processText(`panis finis ${word}`)[0].words[2].ipaDisplay).toBe(ipa);
		});
	}
});
