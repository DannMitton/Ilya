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
import type { LineData, WordStackData, SyllableOverride } from './types';
import { applyReconstitution } from './reconstitution';

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

// ── Boundary extraction and override application ────────────────

/**
 * Extract syllable boundary indices from syllable data.
 *
 * Returns an array where boundaries[i] = the 0-based character index
 * of the last character in syllable i. For K syllables, the array
 * has K-1 entries.
 *
 * Example: [{cyrillic:"мос"}, {cyrillic:"ква"}] → [2]
 *   (characters 0-2 in syllable 0, characters 3-5 in syllable 1)
 *
 * Example: [{cyrillic:"мо"}, {cyrillic:"ск"}, {cyrillic:"ва"}] → [1, 3]
 */
export function computeBoundaries(syllables: SyllableData[]): number[] {
	if (!syllables || syllables.length <= 1) return [];
	const boundaries: number[] = [];
	let charIdx = -1;
	for (let i = 0; i < syllables.length - 1; i++) {
		charIdx += syllables[i]?.cyrillic?.length ?? 0;
		boundaries.push(charIdx);
	}
	return boundaries;
}

/**
 * Re-slice syllable data according to custom boundary positions.
 *
 * boundaries[i] = the 0-based character index of the last character
 * in syllable i. charIpas[j] = the IPA string produced by character j
 * (extracted from displayLog entries).
 *
 * Stress is preserved: the new syllable containing the originally
 * stressed vowel receives isStressed = true.
 *
 * Returns a new array; does not mutate the original.
 */
export function applySyllableOverride(
	syllables: SyllableData[],
	charIpas: string[],
	override: SyllableOverride
): SyllableData[] {
	if (!syllables || syllables.length === 0) return syllables;
	const { boundaries } = override;
	if (!boundaries || boundaries.length === 0) return syllables;

	// Concatenate all Cyrillic
	const allCy = syllables.map(s => s.cyrillic ?? '').join('');
	const totalChars = allCy.length;

	if (totalChars === 0) return syllables;

	// Find the absolute character index of the stressed vowel
	let stressedCharIdx = -1;
	let charOffset = 0;
	for (const syl of syllables) {
		if (syl.isStressed && syl.cyrillic) {
			for (let ci = 0; ci < syl.cyrillic.length; ci++) {
				if (CY_VOWELS.has(syl.cyrillic[ci])) {
					stressedCharIdx = charOffset + ci;
					break;
				}
			}
			if (stressedCharIdx >= 0) break;
		}
		charOffset += syl.cyrillic?.length ?? 0;
	}

	// Build new syllables from boundaries
	const numSyllables = boundaries.length + 1;
	const result: SyllableData[] = [];
	let startIdx = 0;

	for (let si = 0; si < numSyllables; si++) {
		const endIdx = si < boundaries.length ? boundaries[si] + 1 : totalChars;

		const cy = allCy.slice(startIdx, endIdx);
		const ipa = charIpas.slice(startIdx, endIdx).join('');
		const isStressed = stressedCharIdx >= 0
			&& stressedCharIdx >= startIdx
			&& stressedCharIdx < endIdx;

		result.push({ cyrillic: cy, ipa, isStressed });
		startIdx = endIdx;
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
 * Apply syllable transforms to all lines, returning new LineData[]
 * with updated ipaDisplay on each non-clitic word. Clitic words keep
 * their directional arrows. Host words get clitic material re-merged
 * onto the re-sliced IPA.
 *
 * When globalOpenSyllabification is true (default), all non-overridden
 * words receive global open syllabification. When false, only words
 * with per-word overrides are transformed.
 *
 * When syllableOverrides is provided, per-word overrides take precedence
 * over the global open syllabification for the affected words.
 *
 * Does not mutate the input. Does not re-run the pipeline.
 */
export function applyOpenSyllabificationToLines(
	lines: LineData[],
	syllableOverrides?: Map<string, SyllableOverride>,
	globalOpenSyllabification: boolean = true
): LineData[] {
	if (!lines || lines.length === 0) return lines;
	return lines.map(line => {
		if (!line.words || line.words.length === 0) return line;
		return {
			...line,
			words: applyOpenSyllabificationToLineWords(line.words, syllableOverrides, globalOpenSyllabification),
		};
	});
}

function applyOpenSyllabificationToLineWords(
	words: WordStackData[],
	syllableOverrides?: Map<string, SyllableOverride>,
	globalOpenSyllabification: boolean = true
): WordStackData[] {
	return words.map((word, idx) => {
		try {
			// Skip clitics (they show arrows, no syllable re-spacing needed)
			if (word.isProclitic || word.isEnclitic) return word;

			// Skip words with no syllable data or single syllable
			if (!word.syllables || word.syllables.length <= 1) return word;

			// Check for per-word override
			const overrideKey = `${word.lineIndex}-${word.wordIndex}`;
			const override = syllableOverrides?.get(overrideKey);

			let resliced: SyllableData[];
			if (override) {
				// Per-word override: use custom boundaries with displayLog IPA
				const charIpas = word.displayLog.map(e => e.ipa ?? '');
				resliced = applySyllableOverride(word.syllables, charIpas, override);
			} else if (globalOpenSyllabification) {
				// Global open syllabification for non-overridden words
				resliced = openSyllabify(word.syllables);
			} else {
				// No transform: keep engine defaults
				return word;
			}

			let ipa = rebuildIpaFromSyllables(resliced);

			// Rebuild reconstituted IPA from re-sliced syllables.
			// Reconstitution changes vowel values; open syllabification moves
			// consonant boundaries. These transforms are independent, so we
			// apply reconstitution to the re-sliced IPA string. The vowel
			// sequence is unchanged by re-slicing, so positional matching
			// against the transcription log remains correct.
			let ipaRecon = ipa;
			try {
				if (word.result?.transcriptionLog) {
					ipaRecon = applyReconstitution(ipa, word.result.transcriptionLog);
				}
			} catch {
				// Fallback: use the un-reconstituted re-sliced IPA
				ipaRecon = ipa;
			}
			const ipaOwnRecon = ipaRecon;

			// Re-merge clitic material from adjacent words in the line.
			// Both ipaDisplay and ipaReconstituted are merged in parallel
			// so reconstitution composes correctly with open syllabification.
			//
			// Scan leftward for proclitics (closest to host first, then prepend outward).
			for (let j = idx - 1; j >= 0; j--) {
				const p = words[j];
				if (!p || !p.isProclitic) break;
				const cliticIpa = p.ipaContent ?? '';
				const cliticRecon = p.ipaOwnReconstituted ?? cliticIpa;
				if (!cliticIpa) continue;
				if (p.isVowellessClitic) {
					// Vowelless proclitic: tuck into host's stressed syllable
					if (ipa.startsWith('ˈ')) {
						ipa = 'ˈ' + cliticIpa + ipa.slice(1);
					} else {
						ipa = cliticIpa + ipa;
					}
					if (ipaRecon.startsWith('ˈ')) {
						ipaRecon = 'ˈ' + cliticRecon + ipaRecon.slice(1);
					} else {
						ipaRecon = cliticRecon + ipaRecon;
					}
				} else {
					// Vowel-bearing proclitic: separate with space
					ipa = cliticIpa + ' ' + ipa;
					ipaRecon = cliticRecon + ' ' + ipaRecon;
				}
			}

			// Scan rightward for enclitics.
			for (let j = idx + 1; j < words.length; j++) {
				const e = words[j];
				if (!e || !e.isEnclitic) break;
				const cliticIpa = e.ipaContent ?? '';
				const cliticRecon = e.ipaOwnReconstituted ?? cliticIpa;
				if (!cliticIpa) continue;
				if (e.isVowellessClitic) {
					ipa = ipa + cliticIpa;
					ipaRecon = ipaRecon + cliticRecon;
				} else {
					ipa = ipa + ' ' + cliticIpa;
					ipaRecon = ipaRecon + ' ' + cliticRecon;
				}
			}

			return {
				...word,
				ipaDisplay: ipa,
				ipaReconstituted: ipaRecon,
				ipaOwnReconstituted: ipaOwnRecon,
			};
		} catch (err) {
			console.error('[Ilya] openSyllabify error on word:', word.cleanWord, err);
			return word;
		}
	});
}
