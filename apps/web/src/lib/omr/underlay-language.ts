/**
 * The language of a text row, with no poem to compare it to (N.135, stage 2a).
 *
 * Decision 1 of the stage 1 harness (4.3): "Dictionary witness". A row is
 * Russian where at least half of its sewn words of two or more letters are
 * entries of the dictionary. The singer gives no poem (Dann 2026-10-01 23:06),
 * so the row is judged by its own words.
 *
 * The dictionary is passed in as a function, on the pattern of
 * `unknownWordShare(text, isKnownWord)` in `score/ingestion/ocr-guard.ts`:
 * `pipeline.ts` names itself the only importer of `@ilya/dictionary`, and the
 * ratchets breach a relative import into `packages/`. The caller hands in
 * `isKnownWord` from `pipeline.ts`.
 *
 * Modernizing is the caller's too. The harness modernized each word with
 * `modernisePreReform` before the lookup, so a pre-reform «міръ» counted as
 * «мир». Here that belongs in `isWord`, where the dictionary is: try the word as
 * read, then its modern form.
 */

/** The row is in Russian, or in something else (another language, a tempo mark, a piano head). */
export type RowLanguage = 'russian' | 'other';

/** A word counts toward the decision with this many letters or more. */
export const MIN_LETTERS = 2;
/** A row is Russian where this share of its counted words, or more, are entries. */
export const RUSSIAN_SHARE = 0.5;

/** Letters only, lower-cased: «Ты,» is «ты». */
function lettersOf(word: string): string {
	return word.replace(/[^\p{L}]/gu, '').toLowerCase();
}

/**
 * `words` are the row's sewn words, as read (`sewWords`, joined). `isWord`
 * is asked about each word of two or more letters, as its letters in lower
 * case, and, where the word holds a ё, again with it written е. A row with no
 * word of two or more letters is `other`: there is nothing to witness.
 */
export function rowLanguage(words: string[], isWord: (word: string) => boolean): RowLanguage {
	let counted = 0;
	let known = 0;
	for (const word of words) {
		const letters = lettersOf(word);
		if ([...letters].length < MIN_LETTERS) continue;
		counted++;
		if (isWord(letters) || (letters.includes('ё') && isWord(letters.replace(/ё/g, 'е')))) known++;
	}
	return counted > 0 && known >= RUSSIAN_SHARE * counted ? 'russian' : 'other';
}
