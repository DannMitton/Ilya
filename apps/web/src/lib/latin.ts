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
	pulvis: 'ˈpulʲ vʲis',
	cinis: 'ˈkʲi ɲis',
	orbis: 'ˈor bʲis',
	amnis: 'ˈɑmʲ ɲis',
	et: 'ɛt',
	canalis: 'kɑ ˈnɑ lʲis',
	annalis: 'ɑ ˈnɑ lʲis',
	sanguis: 'ˈsɑn ɡwis',
	unguis: 'ˈun ɡwis',
	fascis: 'ˈfɑsʲ kʲis',
	axis: 'ˈɑkʲ sʲis',
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

const HAS_CYRILLIC = /[А-Яа-яЁё]/;
const HAS_LATIN = /[A-Za-z]/;

/** A word with a Latin letter and no Cyrillic letter. */
export function isLatinWord(word: string): boolean {
	return HAS_LATIN.test(word) && !HAS_CYRILLIC.test(word);
}

/** Richter's IPA for a Latin word of «Семинарист», or null for any other word. */
export function seminarianIpa(word: string): string | null {
	const key = word.toLowerCase().replace(/[^a-z]/g, '');
	return Object.hasOwn(SEMINARIAN_LATIN_IPA, key) ? SEMINARIAN_LATIN_IPA[key] : null;
}

/**
 * The pipeline's last pass (`processText`). Marks every Latin word and gives
 * it the table's IPA or none, and no gloss: the engine wrote neither, and no
 * other source may (CONTRACT §6). Russian words are not touched.
 */
export function markLatinWords(lines: LineData[]): LineData[] {
	for (const line of lines) {
		for (const word of line.words) {
			if (!isLatinWord(word.cleanWord)) continue;
			const ipa = seminarianIpa(word.cleanWord) ?? '';
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
