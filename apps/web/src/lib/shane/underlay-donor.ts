/**
 * N.10: which Transcribe word, if any, is the donor for a score word.
 *
 * Fit and Transcribe share the pipeline completely and share no state
 * (E.31 §1.2). This module supplies the missing half: given the score's
 * reconstructed word sequence and the singer's transcribed word sequence,
 * it says which pairs are the same word, so Fit's underlay can be built
 * from the singer's own corrected transcription rather than from a second,
 * override-free run of the same engine.
 *
 * THE RULE, and it is deliberately one sentence: a longest common
 * subsequence over the two sequences of cleaned Cyrillic forms.
 *
 * Why a subsequence and not a lookup. E.31 §1.5 rejected keying the
 * singer's overrides by spelling, because that "over-applies to repeated
 * words and homographs, and Russian stress minimal pairs are exactly the
 * words a singer overrides." A spelling-keyed map throws position away; an
 * LCS keeps it, so a word appearing twice in the score pairs with the same
 * word's second occurrence in the poem, never with its first. That is the
 * whole reason this is an alignment and not a dictionary.
 *
 * WHAT THIS IS NOT. It is not the alignment engine. That one detects,
 * classifies, and reports divergence between the two witnesses, and it
 * waits on the research pass (`reconciliation/types.ts:12-14`). This module
 * emits no Divergence, no DisparityClass, and no count; a word that fails
 * to pair is simply not paired, and Fit's own transcription of it stands.
 * Nothing here is an agreement check, per Dann's instruction of 8 August.
 *
 * It is also not a stress oracle. Every IPA character still comes from
 * GraysonEngine through `processText`; this decides only WHICH of two engine
 * runs a word's transcription is read from.
 */

import type { LineData, WordStackData } from '$lib/types';

/**
 * The transcribed words in reading order, flattened across lines.
 *
 * Reading order is the only order the alignment can use: the singer's line
 * breaks are their own, and the score's word sequence is one continuous
 * vocal line with no lines in it at all.
 */
export function flattenTranscribedWords(lines: readonly LineData[]): WordStackData[] {
	const out: WordStackData[] = [];
	for (const line of lines) {
		for (const word of line.words) out.push(word);
	}
	return out;
}

/**
 * The DP table's size ceiling. Beyond it every score word abstains, which
 * degrades to exactly today's behaviour (Fit transcribes the score itself)
 * rather than to a wrong page. At the ceiling the two sequences are already
 * around a thousand words each, which is a text no song carries.
 */
export const MAX_ALIGNMENT_CELLS = 1_000_000;

/**
 * For each score word, the index of its donor in `donor`, or null.
 *
 * Both arrays hold CLEANED forms (see `cleanForAlignment` in
 * `vowel-resolver.ts`): lowercased, letters and combining marks only. An
 * empty string never pairs, so a punctuation-only token cannot silently
 * match another one.
 */
export function matchDonors(
	score: readonly string[],
	donor: readonly string[],
	maxCells: number = MAX_ALIGNMENT_CELLS,
): Array<number | null> {
	const n = score.length;
	const m = donor.length;
	const out: Array<number | null> = new Array(n).fill(null);
	if (n === 0 || m === 0) return out;
	if ((n + 1) * (m + 1) > maxCells) return out;

	// dp[i][j] = LCS length of score[i..] against donor[j..], flattened
	// row-major with a sentinel row and column of zeroes.
	const w = m + 1;
	const dp = new Int32Array((n + 1) * w);
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			dp[i * w + j] =
				score[i] !== '' && score[i] === donor[j]
					? dp[(i + 1) * w + (j + 1)] + 1
					: Math.max(dp[(i + 1) * w + j], dp[i * w + (j + 1)]);
		}
	}

	// Walk the table forward, taking every matched pair on the path.
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (score[i] !== '' && score[i] === donor[j]) {
			out[i] = j;
			i++;
			j++;
		} else if (dp[(i + 1) * w + j] >= dp[i * w + (j + 1)]) {
			i++;
		} else {
			j++;
		}
	}
	return out;
}
