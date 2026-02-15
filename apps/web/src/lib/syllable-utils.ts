/**
 * Open syllabification utilities for Ilya.
 *
 * Pure functions for re-slicing syllable data (moving inter-vocalic
 * consonants rightward to maximize open syllables) and recomputing
 * IPA display strings. These are display-time transforms that do
 * not re-run the pipeline.
 *
 * Scholarly context: open syllabification for singing is a vocal
 * pedagogy convention (Vaccai, LaBouff, Grayson Appendices B-C),
 * not a phonological rule. No phonotactic validation is applied.
 */

import type { SyllableData } from '@ilya/phonology';
import type { LineData, WordStackData } from './types';

// ── Character classification ────────────────────────────────────

const CY_VOWELS = new Set(
	'аеёиоуыэюяАЕЁИОУЫЭЮЯ'.split('')
);

const IPA_VOWELS = new Set(
	'aɑɛeiɪoɔuʊɨʌə'.split('')
);

function lastVowelIndex(chars: string | undefined, isVowel: (ch: string) => boolean): number {
	if (!chars) return -1;
	for (let i = chars.length - 1; i >= 0; i--) {
		if (isVowel(chars[i])) return i;
	}
	return -1;
}

// ── Core re-slicing ─────────────────────────────────────────────

/**
 * Re-slice syllable data to maximize open syllables. All inter-vocalic
 * consonants migrate rightward to the following syllable's onset.
 *
 * Word-final consonants stay with their syllable (no rightward migration
 * at word end). Stress assignment is preserved: the same syllable ordinal
 * stays stressed.
 *
 * Returns a new array; does not mutate the original.
 */
export function openSyllabify(syllables: SyllableData[]): SyllableData[] {
	if (!syllables || syllables.length <= 1) return syllables;

	// Deep copy to avoid mutating engine data
	const result: SyllableData[] = syllables.map(s => ({ ...s }));

	for (let i = 0; i < result.length - 1; i++) {
		const left = result[i];
		const right = result[i + 1];

		if (!left || !right || !left.cyrillic || !right.cyrillic) continue;

		// Find the last Cyrillic vowel in the left syllable
		const cyVowelPos = lastVowelIndex(left.cyrillic, ch => CY_VOWELS.has(ch));
		if (cyVowelPos < 0) continue;              // No vowel (shouldn't happen)
		if (cyVowelPos === left.cyrillic.length - 1) continue; // Already ends with vowel

		// Cyrillic: move everything after the last vowel
		const cyTail = left.cyrillic.slice(cyVowelPos + 1);
		left.cyrillic = left.cyrillic.slice(0, cyVowelPos + 1);
		right.cyrillic = cyTail + right.cyrillic;

		// IPA: find the corresponding split point (after the last IPA vowel)
		if (left.ipa) {
			const ipaVowelPos = lastVowelIndex(left.ipa, ch => IPA_VOWELS.has(ch));
			if (ipaVowelPos >= 0) {
				const ipaTail = left.ipa.slice(ipaVowelPos + 1);
				left.ipa = left.ipa.slice(0, ipaVowelPos + 1);
				right.ipa = ipaTail + (right.ipa ?? '');
			}
		}
	}

	return result;
}

// ── IPA rebuilding ──────────────────────────────────────────────

/**
 * Rebuild an IPA display string from syllable data, with stress markers
 * and inter-syllabic spaces.
 */
export function rebuildIpaFromSyllables(syllables: SyllableData[]): string {
	if (!syllables || syllables.length === 0) return '';
	return syllables
		.map(s => (s.isStressed ? 'ˈ' + (s.ipa ?? '') : (s.ipa ?? '')))
		.join(' ');
}

// ── Syllable index remapping (for Ribbon re-grouping) ───────────

/**
 * Build a character-index to syllable-index map from syllable data.
 * Returns a Map where key = character index (0-based position in
 * the concatenated cyrillic fields, which matches cleanWord character indices),
 * value = syllable index in the provided syllables array.
 */
export function buildCharToSyllableMap(syllables: SyllableData[]): Map<number, number> {
	const map = new Map<number, number>();
	if (!syllables) return map;
	let charIdx = 0;
	for (let si = 0; si < syllables.length; si++) {
		const len = syllables[si]?.cyrillic?.length ?? 0;
		for (let ci = 0; ci < len; ci++) {
			map.set(charIdx, si);
			charIdx++;
		}
	}
	return map;
}

// ── Line-level IPA display transform ────────────────────────────

/**
 * Apply open syllabification to all lines, returning new LineData[]
 * with updated ipaDisplay on each non-clitic word. Clitic words keep
 * their directional arrows. Host words get clitic material re-merged
 * onto the re-sliced IPA.
 *
 * Does not mutate the input. Does not re-run the pipeline.
 */
export function applyOpenSyllabificationToLines(lines: LineData[]): LineData[] {
	if (!lines || lines.length === 0) return lines;
	return lines.map(line => {
		if (!line.words || line.words.length === 0) return line;
		return {
			...line,
			words: applyOpenSyllabificationToLineWords(line.words),
		};
	});
}

function applyOpenSyllabificationToLineWords(words: WordStackData[]): WordStackData[] {
	return words.map((word, idx) => {
		try {
			// Skip clitics (they show arrows, no syllable re-spacing needed)
			if (word.isProclitic || word.isEnclitic) return word;

			// Skip words with no syllable data or single syllable
			if (!word.syllables || word.syllables.length <= 1) return word;

			// Re-slice and rebuild own IPA
			const resliced = openSyllabify(word.syllables);
			let ipa = rebuildIpaFromSyllables(resliced);

			// Re-merge clitic material from adjacent words in the line.
			// Scan leftward for proclitics (closest to host first, then prepend outward).
			for (let j = idx - 1; j >= 0; j--) {
				const p = words[j];
				if (!p || !p.isProclitic) break;
				const cliticIpa = p.ipaContent ?? '';
				if (!cliticIpa) continue;
				if (p.isVowellessClitic) {
					// Vowelless proclitic: tuck into host's stressed syllable
					if (ipa.startsWith('ˈ')) {
						ipa = 'ˈ' + cliticIpa + ipa.slice(1);
					} else {
						ipa = cliticIpa + ipa;
					}
				} else {
					// Vowel-bearing proclitic: separate with space
					ipa = cliticIpa + ' ' + ipa;
				}
			}

			// Scan rightward for enclitics.
			for (let j = idx + 1; j < words.length; j++) {
				const e = words[j];
				if (!e || !e.isEnclitic) break;
				const cliticIpa = e.ipaContent ?? '';
				if (!cliticIpa) continue;
				if (e.isVowellessClitic) {
					ipa = ipa + cliticIpa;
				} else {
					ipa = ipa + ' ' + cliticIpa;
				}
			}

			return { ...word, ipaDisplay: ipa };
		} catch (err) {
			console.error('[Ilya] openSyllabify error on word:', word.cleanWord, err);
			return word;
		}
	});
}
