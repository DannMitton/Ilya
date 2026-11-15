/**
 * Latin words on the Transcription page (brief `brief-code-latin-words-on-the-page`,
 * options 1 and 2, Dann 2026-09-26 and 2026-09-27).
 *
 * A word with a Latin letter and no Cyrillic one is Latin: in «Семинарист» the
 * seminarian recites it, printed in Latin letters. The engine has no rule for
 * it and writes no IPA, so the pipeline marks the word `latin` and the page
 * keeps it, in its place in the line, in italics, with no gloss and no stress
 * mark (`VerseLine.svelte`, `WordStack.svelte`).
 *
 * THE ONE EXCEPTION TO "IPA COMES ONLY FROM THE ENGINE" (CONTRACT §6): the
 * thirty Latin words of «Семинарист» show the IPA below, and no other Latin
 * word shows any. Source: Laurence R. Richter, *Mussorgsky's Complete Song
 * Texts* (Leyerle, 2002), pp. 43–49, no. 24 and no. 24a; full reference in
 * `NOTICES.md`. The pronunciation is Richter's, a Russian reading of Latin; the
 * rendering into Grayson's notation is the desk's
 * (`docs/sessions/table-seminarian-latin_r1_2026-09-27.md`), with the five hard
 * rows checked against the book by Dann 2026-09-27 00:57.
 *
 * [w] is outside Grayson's inventory and inside this table only, in four
 * words (sanguis, unguis, atque, caulis). Richter, p. xii: "[w] Just as in
 * English. This sound occurs only in the Latin words used in the text of the
 * song *The Seminarian*." `ARCHITECTURE.md` invariant 4 names the exception.
 *
 * Wherever a page shows one of these, its footer credits Richter
 * (`footer.richter`): Dann 2026-09-27 00:58, "I want
 * unassailable citation to preserve our claims of scholarly fair use."
 */

import type { LineData } from './types';

/** «Семинарист»'s Latin, Richter's pronunciation in Grayson's notation. */
export const SEMINARIAN_LATIN_IPA: Readonly<Record<string, string>> = {
	panis: 'ˈpɑ ɲis',
	piscis: 'ˈpʲisʲ kʲis',
	crinis: 'ˈkrʲi ɲis',
	finis: 'ˈfʲi ɲis',
	ignis: 'ˈiɡ ɲis',
	lapis: 'ˈɫɑ pʲis',
	pulvis: 'ˈpul vʲis',
	cinis: 'ˈkʲi ɲis',
	orbis: 'ˈor bʲis',
	amnis: 'ˈɑm ɲis',
	et: 'ɛt',
	canalis: 'kɑ ˈnɑ lʲis',
	annalis: 'ɑ ˈnɑ lʲis',
	sanguis: 'ˈsɑn ɡwis',
	unguis: 'ˈun ɡwis',
	fascis: 'ˈfɑsʲ kʲis',
	axis: 'ˈɑk sʲis',
	funis: 'ˈfu ɲis',
	ensis: 'ˈɛɲ sʲis',
	fustis: 'ˈfusʲ tʲis',
	vectis: 'ˈvɛk tʲis',
	vermis: 'ˈvɛr mʲis',
	mensis: 'ˈmɛɲ sʲis',
	postis: 'ˈposʲ tʲis',
	follis: 'ˈfo lʲis',
	cucumis: 'ku ku ˈmʲis',
	atque: 'ˈɑt kwɛ',
	pollis: 'ˈpo lʲis',
	sentis: 'ˈsɛɲ tʲis',
	caulis: 'ˈkɑw lʲis',
};

const ANY_LETTER = /\p{L}/u;
const LATIN_LETTERS = /\p{Script=Latin}/gu;

/**
 * A Latin word (Dann 2026-11-09 23:32, closing polish lane step 5): a word with at least one letter, every letter of which is Latin
 * script. «à» and «cœur» are Latin; «et» is; a Russian word with a Latin look-alike inside it (a garble) is not. It is applied to the
 * `cleanWord` as the pipeline made it, which is not split again. The poem library's builder holds the same test
 * (`scripts/build-poem-library.mjs`, `isLatinWord`); `latin.test.ts` runs one word list through both.
 */
export function isLatinWord(word: string): boolean {
	return ANY_LETTER.test(word) && !ANY_LETTER.test(word.replace(LATIN_LETTERS, ''));
}

/** Richter's IPA for a Latin word of «Семинарист», or null for any other word. */
export function seminarianIpa(word: string): string | null {
	const key = word.toLowerCase().replace(/[^a-z]/g, '');
	return Object.hasOwn(SEMINARIAN_LATIN_IPA, key) ? SEMINARIAN_LATIN_IPA[key] : null;
}

/** The two table words that are also ordinary Latin («et», «atque»): they do not say the text is «Семинарист». */
const COMMON_LATIN = new Set(['et', 'atque']);

/**
 * Whether the text is «Семинарист»'s: it holds at least two DIFFERENT nouns of the table (every key but `et` and `atque`). One «et»
 * in a French line is a French word and gets no IPA and no credit. "The text" is the lines of the one `processText` call, so a call
 * made on less than the song (a seam, a clitic match) does not see the song's other nouns (desk default, 2026-11-12).
 */
function isSeminarianText(lines: readonly LineData[]): boolean {
	const nouns = new Set<string>();
	for (const line of lines) {
		for (const word of line.words) {
			if (!isLatinWord(word.cleanWord)) continue;
			const key = word.cleanWord.toLowerCase().replace(/[^a-z]/g, '');
			if (Object.hasOwn(SEMINARIAN_LATIN_IPA, key) && !COMMON_LATIN.has(key)) nouns.add(key);
		}
	}
	return nouns.size >= 2;
}

/**
 * The pipeline's last pass (`processText`). Marks every Latin word and gives
 * it the table's IPA (only in a text that is «Семинарист»'s, `isSeminarianText`)
 * or none, and no gloss: the engine wrote neither, and no
 * other source may (CONTRACT §6). Russian words are not touched.
 */
export function markLatinWords(lines: LineData[]): LineData[] {
	const seminarian = isSeminarianText(lines);
	for (const line of lines) {
		for (const word of line.words) {
			if (!isLatinWord(word.cleanWord)) continue;
			const ipa = (seminarian ? seminarianIpa(word.cleanWord) : null) ?? '';
			word.latin = true;
			word.gloss = '';
			word.ipaDisplay = word.ipaContent = word.ipaReconstituted = word.ipaOwnReconstituted = ipa;
		}
	}
	return lines;
}

/** Whether any line carries a word whose IPA is Richter's, so its page credits him. */
export function showsRichterIpa(lines: readonly LineData[]): boolean {
	return lines.some((line) => line.words.some((word) => word.latin && word.ipaDisplay !== ''));
}
