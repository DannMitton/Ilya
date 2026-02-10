/**
 * @ilya/dictionary – Cyrillic Display Helpers
 *
 * Functions for adding combining acute accent (U+0301) to Cyrillic text
 * to indicate stress position. Used by the word stack display.
 *
 * Exception: ё/Ё already indicates stress via dieresis, so no acute is added.
 */

/** The set of Russian vowels (lowercase and uppercase) */
const VOWELS = new Set([
  'а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я',
  'А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я',
]);

/**
 * Syllable data needed for stress mark placement.
 * Matches the SyllableData interface from @ilya/phonology.
 */
export interface SyllableInfo {
  isStressed: boolean;
  [key: string]: any;
}

/**
 * Add combining acute accent (U+0301) to the stressed vowel in Cyrillic text.
 * Exception: ё/Ё already indicates stress via dieresis, so no acute added.
 *
 * @param word - The Cyrillic word
 * @param syllables - Array of syllable objects with isStressed property
 * @returns Word with acute on stressed vowel (or unchanged if ё is stressed)
 */
export function addStressMarkToCyrillic(
  word: string,
  syllables: SyllableInfo[]
): string {
  if (!syllables || syllables.length === 0) return word;

  // Find the stressed syllable index
  let stressedSylIndex = -1;
  for (let i = 0; i < syllables.length; i++) {
    if (syllables[i].isStressed) {
      stressedSylIndex = i;
      break;
    }
  }
  if (stressedSylIndex === -1) return word;

  // Now find the (stressedSylIndex + 1)th vowel in the word
  let currentVowelNum = 0;
  const chars = Array.from(word);
  let result = '';

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    result += char;

    if (VOWELS.has(char)) {
      if (currentVowelNum === stressedSylIndex) {
        // This is the stressed vowel — add acute unless it's ё/Ё
        if (char !== 'ё' && char !== 'Ё') {
          result += '\u0301'; // Combining acute accent
        }
      }
      currentVowelNum++;
    }
  }

  return result;
}

/**
 * Add combining acute accent to the vowel in a syllable string
 * (for syllable button display).
 * Exception: ё/Ё already indicates stress via dieresis, so no acute added.
 *
 * @param syllable - A single Cyrillic syllable
 * @returns Syllable with acute on its vowel (or unchanged if ё)
 */
export function addAcuteToSyllable(syllable: string): string {
  const chars = Array.from(syllable);
  let result = '';
  let acuteAdded = false;

  for (const char of chars) {
    result += char;
    if (!acuteAdded && VOWELS.has(char) && char !== 'ё' && char !== 'Ё') {
      result += '\u0301'; // Combining acute accent
      acuteAdded = true;
    }
  }

  return result;
}
