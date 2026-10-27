/**
 * WHERE A WORD'S PHRASE ENDS (moved out of `pipeline.ts` for QUEUE row 108, Part C).
 *
 * `hard` stops cross-word assimilation and lets final devoicing apply; `soft`
 * and `clitic` are crossed. The rules, in the order a word is tested:
 *
 * 1. A `'user'` boundary wins. A word that already carries one is left alone, and a typed # sets one (rule 4).
 * 2. A word the music places (`score`, a key in `phraseEnds`): `hard` where the
 *    music ends a phrase after it, else the boundary it would take inside a
 *    line, INCLUDING at a line end (`score/phrase-ends.ts`). A word ending in
 *    punctuation is still `hard`, first.
 * 3. The last word of a line is `hard`.
 * 4. A typed # (`syntacticBreak`, row 139) makes the LAST WORD OF ITS UNIT `hard` with source `'user'`: the
 *    mark is moved there first (`moveBreaksToUnitEnds`), because a break happens only at the end of a complete
 *    unit (N.194 step 2, Dann 2026-10-21 02:18). Only a placed # is `'user'`; a word ending in punctuation is
 *    `hard` with source `'punctuation'`, and the Loupe's break button reads the difference (step 4).
 * 5. A word ending in punctuation is `hard`.
 * 6. A proclitic, or a word before an enclitic, is `clitic`.
 * 7. Otherwise `soft`.
 *
 * With no `phraseEnds` this is the rule set the pipeline always had, so a line
 * end is a phrase end wherever no score places the word.
 *
 * The clitic sets are the engine's, passed in by `pipeline.ts`, which is the
 * one file that imports the engine (the `typed-hyphens.ts` pattern).
 */

import { unitEnd } from './text/syntactic-break-unit';
import { unitWordsFromPre } from './text/syntactic-break-adapters';

export interface BoundaryWordIn {
	cyrillic: string;
	cleanWord: string;
	punctuation: string;
	promotedFromClitic?: boolean;
	syntacticBreak?: boolean;
	rightBoundary: 'hard' | 'soft' | 'clitic';
	boundarySource: 'user' | 'auto' | 'punctuation' | 'score';
}

export interface CliticSets {
	proclitics: { has(word: string): boolean };
	enclitics: { has(word: string): boolean };
}

const PUNCTUATION_AT_END = /[.,!?;:"""''–—«»]$/;

/**
 * A typed # takes effect at the end of the unit that holds the word it belongs to (N.194 step 2, Dann
 * 2026-10-21 02:18). The peel (`syntactic-break.ts`) put `syntacticBreak` on a word by position; this moves
 * it to that word's unit end, in place. It runs before the clitic flags exist (`processText` step 3), so the
 * unit is read from the clitic sets (`text/syntactic-break-adapters.ts`). The typed text is not touched.
 */
export function moveBreaksToUnitEnds(words: BoundaryWordIn[], sets: CliticSets): void {
	const unit = unitWordsFromPre(words, sets);
	const ends = words.flatMap((w, i) => (w.syntacticBreak ? [unitEnd(unit, i)!] : []));
	words.forEach((w) => delete w.syntacticBreak);
	ends.forEach((end) => (words[end].syntacticBreak = true));
}

/** Sets `rightBoundary` and `boundarySource` on every word of one line, in place. */
export function autoDetectBoundaries(
	words: BoundaryWordIn[],
	sets: CliticSets,
	phraseEnds?: ReadonlyMap<string, boolean>,
	lineIdx = 0,
): void {
	moveBreaksToUnitEnds(words, sets);
	words.forEach((word, i) => {
		if (word.boundarySource === 'user') return;
		if (word.syntacticBreak) {
			word.rightBoundary = 'hard';
			word.boundarySource = 'user';
			return;
		}

		const isLastWord = i === words.length - 1;
		const hasPunctuation = PUNCTUATION_AT_END.test(word.cyrillic);
		const isProclitic = sets.proclitics.has(word.cleanWord.toLowerCase()) && !word.promotedFromClitic;
		const nextWord = words[i + 1];
		const nextIsEnclitic =
			nextWord !== undefined && sets.enclitics.has(nextWord.cleanWord.toLowerCase()) && !nextWord.promotedFromClitic;
		const music = phraseEnds?.get(`${lineIdx}-${i}`);

		// A line end has no next word on its line, so the enclitic test cannot fire there.
		const insideLine = (): 'hard' | 'soft' | 'clitic' => (isProclitic || nextIsEnclitic ? 'clitic' : 'soft');
		if (music !== undefined && !hasPunctuation) {
			word.rightBoundary = music ? 'hard' : insideLine();
			word.boundarySource = 'score';
		} else if (isLastWord) {
			word.rightBoundary = 'hard';
			word.boundarySource = 'auto';
		} else if (hasPunctuation) {
			word.rightBoundary = 'hard';
			word.boundarySource = 'punctuation';
		} else {
			word.rightBoundary = insideLine();
			word.boundarySource = 'auto';
		}
	});
}
