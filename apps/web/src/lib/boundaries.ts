/**
 * WHERE A WORD'S PHRASE ENDS (moved out of `pipeline.ts` for QUEUE row 108, Part C).
 *
 * `hard` stops cross-word assimilation and lets final devoicing apply; `soft`
 * and `clitic` are crossed. The rules, in the order a word is tested:
 *
 * 1. A `'user'` boundary wins (nothing sets one today).
 * 2. A word the music places (`score`, a key in `phraseEnds`): `hard` where the
 *    music ends a phrase after it, else the boundary it would take inside a
 *    line, INCLUDING at a line end (`score/phrase-ends.ts`). A word ending in
 *    punctuation is still `hard`, first.
 * 3. The last word of a line is `hard`.
 * 4. A word ending in punctuation, or in a typed # (`syntacticBreak`, row 139), is `hard`.
 * 5. A proclitic, or a word before an enclitic, is `clitic`.
 * 6. Otherwise `soft`.
 *
 * With no `phraseEnds` this is the rule set the pipeline always had, so a line
 * end is a phrase end wherever no score places the word.
 *
 * The clitic sets are the engine's, passed in by `pipeline.ts`, which is the
 * one file that imports the engine (the `typed-hyphens.ts` pattern).
 */

export interface BoundaryWordIn {
	cyrillic: string;
	cleanWord: string;
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

/** Sets `rightBoundary` and `boundarySource` on every word of one line, in place. */
export function autoDetectBoundaries(
	words: BoundaryWordIn[],
	sets: CliticSets,
	phraseEnds?: ReadonlyMap<string, boolean>,
	lineIdx = 0,
): void {
	words.forEach((word, i) => {
		if (word.boundarySource === 'user') return;

		const isLastWord = i === words.length - 1;
		const hasPunctuation = PUNCTUATION_AT_END.test(word.cyrillic) || word.syntacticBreak === true;
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
