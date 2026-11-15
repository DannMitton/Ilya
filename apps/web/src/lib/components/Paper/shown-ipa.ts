/**
 * shown-ipa.ts: WHAT THE WORD STACK SHOWS AS A WORD'S IPA, in plain TypeScript.
 *
 * N.201 step 4. The closed ANALYSIS band names the chosen word and its IPA "as
 * the word stack shows them" (brief r2, Step 4.1). Two components computed
 * that string inline: `WordStack.svelte` (`displayIpa`) and `VerseLine.svelte`
 * (`adjacentCliticReconFlags`, which tells a host word that a neighbouring
 * clitic is reconstituted). The closed line is a third reader of the same
 * string, so the two computations moved here, unchanged line for line, and
 * all three call them. CONTRACT section 4: one definition, so the line and
 * the stack cannot disagree.
 *
 * IPA comes verbatim from the engine: `applyNotationPreferences` only applies
 * the singer's notation toggles to what the engine returned.
 */
import { applyNotationPreferences } from '@ilya/phonology';
import type { NotationPreferences } from '@ilya/phonology';
import type { WordStackData } from '$lib/types';

/**
 * Bidirectional XOR: a spot toggle always inverts the global setting for its
 * word. Global off with spot on reads reconstituted; global on with spot on
 * reads reduced.
 */
export function reconActiveFor(
	spot: boolean,
	notationPrefs: Pick<NotationPreferences, 'reconstitution'>,
): boolean {
	return spot ? !notationPrefs.reconstitution : notationPrefs.reconstitution;
}

/**
 * The IPA string a word stack draws.
 *
 * 1. Clitic, reconstitution off: the pipeline's `ipaDisplay` (an arrow).
 * 2. Clitic, reconstitution on: its own reconstituted IPA.
 * 3. A host whose adjacent clitic is reconstituted: the demerged IPA.
 * 4. Any other word: the reconstituted or the plain IPA.
 */
export function shownIpa(
	word: WordStackData,
	notationPrefs: NotationPreferences,
	spotReconstituted: boolean,
	adjacentCliticReconstituted: boolean,
): string {
	const reconActive = reconActiveFor(spotReconstituted, notationPrefs);
	if (word.isProclitic || word.isEnclitic) {
		if (reconActive && word.ipaOwnReconstituted) {
			return applyNotationPreferences(word.ipaOwnReconstituted, notationPrefs, true);
		}
		return word.ipaDisplay || '';
	}
	if (adjacentCliticReconstituted) {
		const base = reconActive
			? word.ipaOwnReconstituted || word.ipaContent || word.ipaDisplay
			: word.ipaContent || word.ipaDisplay;
		return base ? applyNotationPreferences(base, notationPrefs, true) : '';
	}
	const useReconstituted = reconActive && word.ipaReconstituted;
	const base = useReconstituted ? word.ipaReconstituted : word.ipaDisplay;
	return base ? applyNotationPreferences(base, notationPrefs, true) : '';
}

/**
 * The words a line draws: Cyrillic words and Latin words, in order. A
 * punctuation-only token never becomes a word. `VerseLine.svelte` drew this
 * list and the closed line needs the same one to find a word's neighbours.
 */
export function displayedWords(words: readonly WordStackData[]): WordStackData[] {
	return words.filter((w) => w.latin || /[А-Яа-яЁё]/.test(w.cyrillic || ''));
}

/**
 * For each host word, whether an adjacent clitic has reconstitution active:
 * the preceding proclitics, then the following enclitics. A clitic itself
 * answers false.
 */
export function adjacentCliticReconFlags(
	displayWords: readonly WordStackData[],
	notationPrefs: Pick<NotationPreferences, 'reconstitution'>,
	spotReconstitution: ReadonlyMap<string, boolean> | undefined,
): boolean[] {
	const active = (w: WordStackData): boolean =>
		reconActiveFor(spotReconstitution?.has(`${w.lineIndex}-${w.wordIndex}`) ?? false, notationPrefs);
	return displayWords.map((word, i) => {
		if (word.isProclitic || word.isEnclitic) return false;
		for (let j = i - 1; j >= 0 && displayWords[j].isProclitic; j--) {
			if (active(displayWords[j])) return true;
		}
		for (let j = i + 1; j < displayWords.length && displayWords[j].isEnclitic; j++) {
			if (active(displayWords[j])) return true;
		}
		return false;
	});
}

/**
 * The IPA the stack shows for the word at `lineIndex`, `wordIndex`: what the
 * closed ANALYSIS line draws. Null when the line has no such word.
 */
export function shownIpaAt(
	lines: readonly { words: WordStackData[] }[],
	lineIndex: number,
	wordIndex: number,
	notationPrefs: NotationPreferences,
	spotReconstitution: ReadonlyMap<string, boolean> | undefined,
): string | null {
	const line = lines[lineIndex];
	if (!line) return null;
	const words = displayedWords(line.words);
	const at = words.findIndex((w) => w.lineIndex === lineIndex && w.wordIndex === wordIndex);
	if (at < 0) return null;
	const flags = adjacentCliticReconFlags(words, notationPrefs, spotReconstitution);
	const word = words[at];
	return shownIpa(
		word,
		notationPrefs,
		spotReconstitution?.has(`${word.lineIndex}-${word.wordIndex}`) ?? false,
		flags[at] ?? false,
	);
}
