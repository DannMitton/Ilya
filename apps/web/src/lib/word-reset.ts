/**
 * word-reset.ts: PER-WORD RESET, the pure half. Lifted out of `+page.svelte`'s
 * `handleReset` on the pattern row 5 used (`report-code-row5_r1_2026-10-15.md`),
 * to pay for the lines N.135 stage 3 added there: `+page.svelte` is held to
 * its ceiling in `scripts/ratchets.json`, and a function that only builds new
 * maps from old ones needs no page to be tested.
 *
 * Clears every override the singer has put on ONE word: a stress mark, the
 * ё toggles (keyed `line-word-char`, so by prefix), a syllable boundary, a spot
 * reconstitution, and a gloss with its anchor. A map the word was not in comes
 * back `null`, so the page assigns only what changed, as it did when this was
 * inline. `pipeline` says whether the transcription must run again: a stress
 * mark or a ё toggle changes the sounds, and the others do not.
 */

/** The five maps keyed by `"lineIndex-wordIndex"` (the ё toggles by `"…-charIndex"` after it). */
export interface WordMaps<S, Y, B, P> {
	stress: ReadonlyMap<string, S>;
	yo: ReadonlyMap<string, Y>;
	syllables: ReadonlyMap<string, B>;
	spot: ReadonlyMap<string, P>;
	glosses: ReadonlyMap<string, string>;
	anchors: ReadonlyMap<string, string>;
}

export interface WordReset<S, Y, B, P> {
	stress: Map<string, S> | null;
	yo: Map<string, Y> | null;
	syllables: Map<string, B> | null;
	spot: Map<string, P> | null;
	glosses: Map<string, string> | null;
	anchors: Map<string, string> | null;
	pipeline: boolean;
}

function without<V>(map: ReadonlyMap<string, V>, key: string): Map<string, V> | null {
	if (!map.has(key)) return null;
	const next = new Map(map);
	next.delete(key);
	return next;
}

export function resetWord<S, Y, B, P>(wordKey: string, maps: WordMaps<S, Y, B, P>): WordReset<S, Y, B, P> {
	const yoPrefix = `${wordKey}-`;
	let yo: Map<string, Y> | null = null;
	if ([...maps.yo.keys()].some((k) => k.startsWith(yoPrefix))) {
		yo = new Map(maps.yo);
		for (const k of [...yo.keys()]) if (k.startsWith(yoPrefix)) yo.delete(k);
	}
	const stress = without(maps.stress, wordKey);
	const hasGloss = maps.glosses.has(wordKey);
	return {
		stress,
		yo,
		syllables: without(maps.syllables, wordKey),
		spot: without(maps.spot, wordKey),
		glosses: hasGloss ? without(maps.glosses, wordKey) : null,
		anchors: hasGloss ? without(maps.anchors, wordKey) ?? new Map(maps.anchors) : null,
		pipeline: stress !== null || yo !== null,
	};
}
