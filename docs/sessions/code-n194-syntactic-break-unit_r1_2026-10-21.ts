/**
 * N.194. Where a syntactic break (#) may sit.
 *
 * Dann, 2026-10-21 01:3x: a break happens only at the end of a complete unit
 * and before the adjacent unit begins. A tap on any syllable of a unit
 * resolves to the unit's last word, so the break lands there. A unit is a
 * word with everything that leans on it:
 *   - a proclitic leans forward onto the word after it (не в силах),
 *   - an enclitic leans back onto the word before it (сказал бы),
 *   - a hyphen the poem wrote between two words joins them (велит-ли).
 * A polysyllabic word is one word, so a tap on its first syllable resolves
 * to the word's own last syllable.
 *
 * Pure: no store, no DOM, no engine. Indices are word indices within ONE line.
 * A break never reaches across a line (a clitic never does either,
 * `pairings.ts` buildSlotQueue).
 */

export interface UnitWord {
	/** Leans on the word after it. The pipeline's `isProclitic`. */
	isProclitic: boolean;
	/** Leans on the word before it. The pipeline's `isEnclitic`; already false after punctuation, and for a clitic the singer promoted to a word. */
	isEnclitic: boolean;
	/** The poem wrote a hyphen between this word and the next, as in «велит-ли». */
	hyphenToNext: boolean;
}

const validIndex = (n: number, i: number): boolean => Number.isInteger(i) && i >= 0 && i < n;

/**
 * The index of the last word of the unit that holds word `at`, or null when
 * `at` is not a word of the line. Idempotent, never less than `at`, and the
 * same for every word of one unit.
 */
export function unitEnd(words: readonly UnitWord[], at: number): number | null {
	const n = words.length;
	if (!validIndex(n, at)) return null;
	let i = at;
	for (;;) {
		if (i >= n - 1) return i;
		const here = words[i];
		const next = words[i + 1];
		if (here.isProclitic || here.hyphenToNext || next.isEnclitic) i++;
		else return i;
	}
}

/**
 * What the singer's "Insert break here" does: the break goes on the unit's
 * last word. Where that word already carries one, the same control reads
 * "Remove break" and takes it off. `breaks` holds word indices of this line.
 * Returns a new sorted list, the word the break sits on, and what happened;
 * null when `at` is not a word of the line.
 */
export function toggleBreak(
	breaks: readonly number[],
	words: readonly UnitWord[],
	at: number,
): { breaks: number[]; end: number; action: 'insert' | 'remove' } | null {
	const end = unitEnd(words, at);
	if (end === null) return null;
	const kept = normalizeBreaks(breaks, words);
	const has = kept.includes(end);
	const next = has ? kept.filter((b) => b !== end) : [...kept, end].sort((a, b) => a - b);
	return { breaks: next, end, action: has ? 'remove' : 'insert' };
}

/**
 * A stored break that no longer sits on a unit's last word (the text was
 * edited, a clitic was promoted to a word, a hyphen was typed) moves to the
 * end of the unit it now falls in. Out-of-range entries are dropped, and two
 * that land on one word become one.
 */
export function normalizeBreaks(breaks: readonly number[], words: readonly UnitWord[]): number[] {
	const out = new Set<number>();
	for (const b of breaks) {
		const end = unitEnd(words, b);
		if (end !== null) out.add(end);
	}
	return [...out].sort((a, b) => a - b);
}

export interface SlotAt {
	origin: { lineIndex: number; wordIndex: number };
}

/**
 * The slot the tap jumps to: the last syllable, in this line, of the words
 * from the tapped word to the unit's end. A vowelless clitic owns no slot (it
 * is fused into its host's, `buildSlotQueue`), so the search takes the last
 * slot whose word falls in that range. Null when the range holds none.
 */
export function terminalSlotIndex(
	slots: readonly SlotAt[],
	lineIndex: number,
	fromWord: number,
	endWord: number,
): number | null {
	let found: number | null = null;
	for (let k = 0; k < slots.length; k++) {
		const o = slots[k].origin;
		if (o.lineIndex === lineIndex && o.wordIndex >= fromWord && o.wordIndex <= endWord) found = k;
	}
	return found;
}

/**
 * The one call the Loupe's button makes. The unit is the word (with what
 * leans on it); the answer is a SYLLABLE: the last one of that unit, where the
 * # grafts after the syllable's IPA like an enclitic (Dann 2026-10-21).
 * `lines[l]` holds the unit flags of line l's words, aligned to
 * `origin.wordIndex`; `slots` is the song's flat slot queue; `tapped` is the
 * index in `slots` of the syllable the singer's note carries.
 * `wordIndex` is where the break is stored; `slotIndex` is where the squircle
 * jumps. Null when `tapped` is not a slot, or its line or word is unknown.
 */
export function breakTarget(
	lines: readonly (readonly UnitWord[])[],
	slots: readonly SlotAt[],
	tapped: number,
): { lineIndex: number; wordIndex: number; slotIndex: number } | null {
	if (!Number.isInteger(tapped) || tapped < 0 || tapped >= slots.length) return null;
	const { lineIndex, wordIndex } = slots[tapped].origin;
	const words = lines[lineIndex];
	if (!words) return null;
	const end = unitEnd(words, wordIndex);
	if (end === null) return null;
	const slotIndex = terminalSlotIndex(slots, lineIndex, wordIndex, end);
	return slotIndex === null ? null : { lineIndex, wordIndex: end, slotIndex };
}
