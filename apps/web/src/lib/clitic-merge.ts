/**
 * Clitic display merging, lifted out of `pipeline.ts` (row 139) so the file stays under its
 * ratchet. It imports nothing from the engine: `pipeline.ts` is the one file that does.
 *
 * Runs after cross-word assimilation and after each word's own IPA is built. A clitic's
 * display becomes an arrow and its IPA is merged into its host, so every word's `ipaDisplay`
 * and `ipaReconstituted` carry the fused string the page prints.
 */

import { applyReconstitution } from './reconstitution';
import { SYNTACTIC_BREAK } from './syntactic-break';

const CYRILLIC_VOWELS = new Set([
  'а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я',
  'А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я',
]);

export function hasVowel(word: string): boolean {
  return Array.from(word).some((char) => CYRILLIC_VOWELS.has(char));
}

/** What the merge reads and writes of `pipeline.ts`'s `TranscribedWord`. */
export interface CliticMergeWord {
  cleanWord: string;
  isProclitic: boolean;
  isEnclitic: boolean;
  isVowellessClitic?: boolean;
  syntacticBreak?: boolean;
  transcriptionLog: any[];
  ipaContent?: string;
  ipaDisplay?: string;
  ipaReconstituted?: string;
  ipaOwnReconstituted?: string;
}

export function mergeCliticDisplay(transcribedWords: CliticMergeWord[]): void {
  // Row 139: a typed # prints in the IPA alone, grafted after the word's last syllable, as an
  // enclitic is. It goes onto the word's own strings first, so the merge below carries it with an
  // enclitic into its host (`же#` reaches the host as `ʒɨ#`) and every re-merge reads it from there.
  // A # after a proclitic follows the proclitic's own IPA, wherever the merge tucks that into its host.
  for (const w of transcribedWords) {
    if (!w.syntacticBreak) continue;
    w.ipaContent = (w.ipaContent ?? '') + SYNTACTIC_BREAK;
    w.ipaDisplay = (w.ipaDisplay ?? '') + SYNTACTIC_BREAK;
    w.ipaReconstituted = (w.ipaReconstituted ?? '') + SYNTACTIC_BREAK;
    w.ipaOwnReconstituted = (w.ipaOwnReconstituted ?? '') + SYNTACTIC_BREAK;
  }

  // Second pass: merge clitic IPA into host words for display.
  // Both ipaDisplay and ipaReconstituted are merged in parallel
  // so the reconstituted string has the same clitic structure.
  //
  // Proclitic chains are processed as units: when consecutive proclitics
  // precede a host, ALL their IPA merges into the host in correct order
  // (closest to host first, then farther proclitics prepend).
  // Enclitic chains work symmetrically: consecutive enclitics after a host
  // all merge into the host in forward order (e.g., ли бы: host absorbs both).
  let idx = 0;
  while (idx < transcribedWords.length) {
    const tw = transcribedWords[idx];

    if (tw.isProclitic) {
      // Collect the full proclitic chain
      const chainStart = idx;
      while (idx < transcribedWords.length && transcribedWords[idx].isProclitic) {
        const p = transcribedWords[idx];
        p.ipaDisplay = '→';
        p.ipaReconstituted = '→';
        p.isVowellessClitic = !hasVowel(p.cleanWord);
        idx++;
      }
      // idx now points to the host (or end of array)
      const hostWord = idx < transcribedWords.length ? transcribedWords[idx] : null;

      if (hostWord) {
        // Merge proclitics in reverse order (closest to host first).
        // This ensures vowelless proclitics tuck into the stressed syllable
        // correctly, and vowel-bearing proclitics prepend in reading order.
        for (let ci = idx - 1; ci >= chainStart; ci--) {
          const proclitic = transcribedWords[ci];
          const isVowelless = !hasVowel(proclitic.cleanWord);

          if (isVowelless) {
            // Vowelless proclitic: tuck IPA into host's stressed syllable
            if (hostWord.ipaDisplay?.startsWith('ˈ')) {
              hostWord.ipaDisplay =
                'ˈ' + proclitic.ipaContent + hostWord.ipaDisplay!.slice(1);
            } else {
              hostWord.ipaDisplay = (proclitic.ipaContent ?? '') + (hostWord.ipaDisplay ?? '');
            }
            if (hostWord.ipaReconstituted?.startsWith('ˈ')) {
              hostWord.ipaReconstituted =
                'ˈ' + proclitic.ipaContent + hostWord.ipaReconstituted!.slice(1);
            } else {
              hostWord.ipaReconstituted = (proclitic.ipaContent ?? '') + (hostWord.ipaReconstituted ?? '');
            }
          } else {
            // Vowel-bearing proclitic: separate with space
            hostWord.ipaDisplay = proclitic.ipaContent + ' ' + hostWord.ipaDisplay;
            const cliticReconstituted = applyReconstitution(proclitic.ipaContent ?? '', proclitic.transcriptionLog);
            hostWord.ipaReconstituted = cliticReconstituted + ' ' + hostWord.ipaReconstituted;
          }
        }
      }
      // idx already points past the chain; continue to process host or next word
      idx++;
    } else if (tw.isEnclitic) {
      // Collect the full enclitic chain
      const chainStart = idx;
      while (idx < transcribedWords.length && transcribedWords[idx].isEnclitic) {
        const e = transcribedWords[idx];
        e.ipaDisplay = '←';
        e.ipaReconstituted = '←';
        e.isVowellessClitic = !hasVowel(e.cleanWord);
        idx++;
      }
      // Host is the word before the chain
      const hostWord = chainStart > 0 ? transcribedWords[chainStart - 1] : null;

      if (hostWord && !hostWord.isProclitic) {
        // Merge enclitics in forward order (closest to host first)
        for (let ci = chainStart; ci < idx; ci++) {
          const enclitic = transcribedWords[ci];
          const isVowelless = !hasVowel(enclitic.cleanWord);

          if (isVowelless) {
            hostWord.ipaDisplay = (hostWord.ipaDisplay ?? '') + enclitic.ipaContent;
            hostWord.ipaReconstituted = (hostWord.ipaReconstituted ?? '') + enclitic.ipaContent;
          } else {
            hostWord.ipaDisplay =
              (hostWord.ipaDisplay ?? '') + ' ' + enclitic.ipaContent;
            const encliticReconstituted = applyReconstitution(enclitic.ipaContent ?? '', enclitic.transcriptionLog);
            hostWord.ipaReconstituted =
              (hostWord.ipaReconstituted ?? '') + ' ' + encliticReconstituted;
          }
        }
      }
      // idx already points past the chain; no increment needed
    } else {
      idx++;
    }
  }
}
