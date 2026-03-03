/**
 * Vowel Reconstitution for Russian Lyric Diction
 *
 * Implements Grayson Ch. 3, §8 (pp. 128–129): when music is slow and
 * sustained, normally reduced vowels reconstitute to their unreduced form.
 * Conceptually: move backwards along the chain of reduction as the notes
 * lengthen. Rounding is never restored (ʌ → ɑ, never → o).
 *
 * This function requires the transcription log because the same IPA symbol
 * (e.g. ɪ) reconstitutes differently depending on its source character:
 *   ɪ from я → ɑ
 *   ɪ from е → ɛ
 *
 * A pure string replacement cannot distinguish these cases.
 *
 * Called in pipeline.ts on ipaContent (per-word IPA before clitic merging)
 * so that clitic-merged strings are never positionally walked.
 */

const IPA_VOWELS = new Set([
  'ɑ', 'a', 'o', 'ɛ', 'e', 'ɪ', 'i', 'ɨ', 'u', 'ʌ', 'ə',
]);

interface LogEntry {
  char: string;
  ipa: string;
  features: {
    type: string;
    position?: string;
    interpalatal?: boolean;
    [key: string]: any;
  };
}

/**
 * Apply vowel reconstitution to a per-word IPA string using the
 * transcription log for source-character disambiguation.
 *
 * @param ipaContent - The word's own IPA (before clitic merging)
 * @param transcriptionLog - The engine's per-character transcription log
 * @returns Reconstituted IPA string
 */
export function applyReconstitution(
  ipaContent: string,
  transcriptionLog: LogEntry[],
): string {
  // Extract vowel entries in source order
  const vowelEntries = transcriptionLog.filter(
    (e) => e.features?.type === 'vowel',
  );
  if (vowelEntries.length === 0) return ipaContent;

  // Pre-compute reconstituted IPA for each vowel
  const reconstituted = vowelEntries.map((entry) => {
    const isStressed = entry.features?.position === 'stressed';
    if (isStressed) return entry.ipa; // Stressed vowels do not reconstitute

    const char = entry.char.toLowerCase();
    const ipa = entry.ipa;

    // Grayson Ch. 3, §8:

    // ʌ → ɑ (remote unstressed о or а; rounding never restored)
    if (ipa === 'ʌ') return 'ɑ';

    // ɪ from я → ɑ (Grayson: "reverts to /ɑ/ or /jɑ/")
    if (ipa === 'ɪ' && char === 'я') return 'ɑ';

    // ɪ from а (after ч/щ reduction) → ɑ (Grayson: "reverts to /ɑ/")
    if (ipa === 'ɪ' && char === 'а') return 'ɑ';

    // ɪ from е or э → ɛ (Grayson: "reverts to /ɛ/ or /jɛ/")
    if (ipa === 'ɪ' && (char === 'е' || char === 'э')) return 'ɛ';

    // i from а (Чайковский rule) → ɪ (partial; Grayson: "may become /tʃʲɪ/,
    // but not /tʃʲaj/")
    if (ipa === 'i' && char === 'а') return 'ɪ';

    // i from е (interpalatal) → e (Grayson: "reverts to [e] or [je]")
    if (ipa === 'i' && char === 'е' && entry.features?.interpalatal) return 'e';

    // ɨ from е after always-hard consonant (ж/ш/ц) → ɛ
    // Dann's departure from Grayson p. 129. Grayson says [ɨ] after hard
    // consonants does not reconstitute. Dann argues the underlying vowel
    // is /ɛ/ and reconstitution should apply. Kochetov concurs.
    // See LEARN Section 4 callout box.
    if (ipa === 'ɨ' && char === 'е') return 'ɛ';

    // ɨ from и stays ɨ (Grayson: "-и- read as [ɨ] ... remain sung as [ɨ]")
    // u, ɑ (pretonic), i (non-interpalatal): already unreduced, no change
    return ipa;
  });

  // Walk the IPA string, replacing vowels positionally.
  // This is safe because ipaContent is strictly per-word (no clitic mixing).
  const ipaChars = [...ipaContent];
  let vowelIdx = 0;
  const result: string[] = [];

  for (const ch of ipaChars) {
    if (IPA_VOWELS.has(ch) && vowelIdx < reconstituted.length) {
      result.push(reconstituted[vowelIdx]);
      vowelIdx++;
    } else {
      result.push(ch);
    }
  }

  return result.join('');
}
