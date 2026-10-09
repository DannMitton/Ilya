/**
 * A WORD PRINTED APART FROM ITS «не». Walk finding 2026-10-09, ruled by Dann
 * (N.181): «не проглядная» drew «про» as [pro], unreduced, because the
 * dictionary holds «непроглядная» and not «проглядная», so the apart word had
 * unknown stress and unknown stress keeps every vowel cardinal
 * (`packages/phonology/src/engine.ts:1148`). Where a word right after «не» is
 * NOT found on its own, it is looked up joined to «не», and the joined entry's
 * stress is read back onto the apart word: the joined word has one more
 * syllable at the front, so the stressed syllable's index is one less.
 *
 * THE PRINTED SPELLING STAYS. Only the stress (and its source) is carried; the
 * word's text, gloss, and lemma are the page's own. Where the word IS found on
 * its own, it stands as printed (the desk's condition), so «не ловко» keeps
 * the entry «ловко» has. A joined entry that puts the stress on «не» itself
 * (index 0) says nothing about the apart word, and changes nothing.
 *
 * Runs after the singer's overrides, so it never undoes one. The dictionary is
 * reached through `lookup`, because `pipeline.ts` is the one file in the app
 * that imports the engine.
 */

/** What this reads and writes of a pipeline word. */
export interface NeJoinWord {
	cleanWord: string;
	stress: number;
	stressSource: string;
	originalStress: number;
	originalStressSource: string;
}

export type StressLookup = (word: string) => { stress?: number | null; source?: string } | null;

/**
 * Applies the rule to one line, in place. It runs after the singer's own ё
 * toggles and stress overrides (step 1.5 of `processText`), and only touches a
 * word still at unknown stress from the dictionary, so it cannot undo a
 * singer's mark.
 */
export function joinAfterNe(line: NeJoinWord[], lookup: StressLookup): void {
	line.forEach((word, i) => {
		const prev = line[i - 1];
		if (!prev || prev.cleanWord.toLowerCase() !== 'не') return;
		if (word.stress !== -2 || word.stressSource !== 'inferred') return;
		if (lookup(word.cleanWord) !== null) return;
		const joined = lookup('не' + word.cleanWord);
		if (!joined || joined.stress == null || joined.stress < 1) return;
		word.stress = joined.stress - 1;
		word.stressSource = joined.source === 'supplement' ? 'supplement' : 'dictionary';
		word.originalStress = word.stress;
		word.originalStressSource = word.stressSource;
	});
}
