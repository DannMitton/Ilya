/**
 * The per-verse acoustic overlay consumer (§A.73, §A.98; Option 1, Dann
 * 2026-07-17).
 *
 * `analyzePerVerse(parsed, profile)` returns one `AnalyzedScore` per sung
 * verse, keyed by verse number, ascending. Each verse sings the same notes
 * with different text, so this runs the unchanged, verse-agnostic
 * `analyzeScore` once per verse, each time with that verse's resolver
 * (`buildVowelResolver(parsed, verse)`). The verses come from
 * `sungVerseNumbers`, so the map is empty when the score has no lyrics.
 *
 * Two honest properties of the result:
 *   - The melody-derived `global` and the content-hash `sourceScoreId` are
 *     IDENTICAL across every verse: the notes do not change from verse to
 *     verse, only the vowels do. A consumer caching overlays must therefore
 *     key by verse number, not by `sourceScoreId`, or the verses collide.
 *   - A verse whose text resolves no vowels (a non-Russian line, or an
 *     unresolvable one) still gets an entry: a notation-only overlay with no
 *     acoustic events, exactly as the single-verse path already behaves
 *     (§A.35).
 *
 * This is the engine-side consumer only. Rendering these per-verse overlays
 * is the reprint-per-verse engraving work, parked on Kimi's rulings (§A.107);
 * nothing here draws anything.
 */

import { analyzeScore, sungVerseNumbers } from '@ilya/score-parser';
import type {
	AnalyzeOptions,
	AnalyzedScore,
	ParsedScore,
	VoiceProfileSnapshot
} from '@ilya/score-parser';
import { buildVowelResolver } from './vowel-resolver';

export function analyzePerVerse(
	parsed: ParsedScore,
	profile: VoiceProfileSnapshot,
	options?: AnalyzeOptions
): Map<number, AnalyzedScore> {
	const overlays = new Map<number, AnalyzedScore>();
	for (const verse of sungVerseNumbers(parsed)) {
		const resolver = buildVowelResolver(parsed, verse);
		overlays.set(verse, analyzeScore(parsed, profile, resolver, options));
	}
	return overlays;
}
