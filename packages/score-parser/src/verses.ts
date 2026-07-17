import type { ParsedScore } from './types';

/**
 * The verse numbers that actually sing in this score, ascending.
 *
 * A verse "sings" on a note when that note carries a syllable for it: either
 * an entry in the authoritative per-verse record `syllable.versesInfo`
 * (§A.98), or, on a single-verse note where `versesInfo` is absent, the
 * primary `syllable.verseNumber`. This mirrors the resolver's own selection
 * rule (`verseSyllableOf`): `versesInfo` is authoritative when present, and
 * includes the primary verse's own entry, so it is not re-added separately.
 *
 * Rests, note-less events, and lyric-less notes contribute nothing, so a
 * score with no lyrics returns []. Derived from the populated events, never
 * assumed: a single-verse score returns [1] only because its notes carry
 * verse 1, not by default (§A.56).
 *
 * This is the enumerator a per-verse consumer walks to build one overlay per
 * verse. Each verse sings the same notes with different text, so the overlays
 * differ only by the resolved vowel (§A.73, independent passes).
 */
export function sungVerseNumbers(parsed: ParsedScore): number[] {
	const seen = new Set<number>();
	for (const ev of parsed.vocalLine) {
		const syl = ev.syllable;
		if (!syl) continue;
		if (syl.versesInfo && syl.versesInfo.length > 0) {
			for (const v of syl.versesInfo) seen.add(v.verseNumber);
		} else {
			seen.add(syl.verseNumber);
		}
	}
	return [...seen].sort((a, b) => a - b);
}
