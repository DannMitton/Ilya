/**
 * N.194 step 1: the two doors into `unitEnd` (`syntactic-break-unit.ts`), one for each place that asks
 * where a unit ends. They share the unit logic and differ only in where the clitic flags come from.
 *
 * - `unitWordsFromPre` is for the pipeline's boundary pass. That pass runs at `processText` step 2,
 *   BEFORE the clitic flags of step 3 exist (`pipeline.ts`, `isProclitic` and `isEnclitic` are set when the
 *   output words are built), so it asks the clitic sets the way `boundaries.ts` does, from `cleanWord` and
 *   `promotedFromClitic`. It adds the two guards the pipeline's own flags carry and `boundaries.ts` lacks: a
 *   word after punctuation is not an enclitic, and «о» as an interjection is not a proclitic.
 * - `unitWordsFromStacks` is for the Loupe's button, which reads the finished words and so reads the
 *   flags the pipeline already set.
 *
 * `hyphenToNext` is the same in both: the word's trailing mark is ONE joining hyphen (`-`, U+2010,
 * U+2011), the hyphen `expandHyphenatedParticles` leaves on a host it split from a particle («велит-» of
 * «велит-ли», `typed-hyphens.ts`). An en dash, an em dash, or a hyphen with other marks is not a joiner.
 * A spaced dash («слово – слово») is a token with no letters, dropped before any word is built, so no
 * word carries it and neither door ever sees it (Dann 2026-10-25 23:53: it stays a non-boundary).
 */
import type { CliticSets } from '../boundaries';
import type { UnitWord } from './syntactic-break-unit';

const JOINING_HYPHEN = /^[-‐‑]$/;

/** What the pre-flag door reads from a word: the shape `PreTranscribeWord` and `WordStackData` share. */
export interface PreUnitWord {
	cyrillic: string;
	cleanWord: string;
	punctuation: string;
	promotedFromClitic?: boolean;
}

/** What the finished-word door reads from a word. */
export interface StackUnitWord {
	isProclitic: boolean;
	isEnclitic: boolean;
	punctuation: string;
}

/** One line of words before the clitic flags exist, as the boundary pass sees it. */
export function unitWordsFromPre(words: readonly PreUnitWord[], sets: CliticSets): UnitWord[] {
	const lineEndsWithQuestion = /\?$/.test(words[words.length - 1]?.cyrillic.trim() ?? '');
	const clitic = (set: { has(word: string): boolean }, w: PreUnitWord) => set.has(w.cleanWord.toLowerCase()) && !w.promotedFromClitic;
	return words.map((word, i) => {
		const isOInterjection = word.cleanWord.toLowerCase() === 'о' && (/[,!]/.test(word.punctuation) || (i === 0 && !lineEndsWithQuestion));
		return {
			isProclitic: !isOInterjection && clitic(sets.proclitics, word),
			isEnclitic: i > 0 && words[i - 1].punctuation.length === 0 && clitic(sets.enclitics, word),
			hyphenToNext: JOINING_HYPHEN.test(word.punctuation),
		};
	});
}

/** One line of finished words, reading the flags the pipeline set. */
export function unitWordsFromStacks(words: readonly StackUnitWord[]): UnitWord[] {
	return words.map((word) => ({
		isProclitic: word.isProclitic,
		isEnclitic: word.isEnclitic,
		hyphenToNext: JOINING_HYPHEN.test(word.punctuation),
	}));
}
