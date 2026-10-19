/**
 * N.57's survival guard, lifted out of `+page.svelte` (row 108 B) to make room
 * on a page at its ceiling. Behaviour unchanged.
 *
 * The comparison is lowercased and yo-folded, because the dictionary is keyed
 * by lowercase word form (`curated-glosses.ts`) and a yo toggle re-spells a
 * word without making it a different word.
 */
import type { LineData } from '$lib/types';

export function glossAnchorForm(word: string): string {
	return word.toLowerCase().replace(/\u0451/g, '\u0435');
}

/**
 * The glosses whose anchor still matches the word now standing at their key,
 * or null when none was dropped (the caller then assigns nothing: a new Map is
 * a change to the autosave effect, so assigning always saved every song on open).
 */
export function survivingGlosses(
	glosses: ReadonlyMap<string, string>,
	anchors: ReadonlyMap<string, string>,
	lines: readonly LineData[],
): [Map<string, string>, Map<string, string>] | null {
	const nextGloss = new Map<string, string>(), nextAnchor = new Map<string, string>();
	for (const [key, gloss] of glosses) {
		const anchor = anchors.get(key);
		if (!anchor) continue;
		const [lineIdx, wordIdx] = key.split('-').map(Number);
		const word = lines[lineIdx]?.words?.[wordIdx];
		if (word && glossAnchorForm(word.cleanWord) === glossAnchorForm(anchor)) {
			nextGloss.set(key, gloss);
			nextAnchor.set(key, anchor);
		}
	}
	return nextGloss.size !== glosses.size || nextAnchor.size !== anchors.size ? [nextGloss, nextAnchor] : null;
}
