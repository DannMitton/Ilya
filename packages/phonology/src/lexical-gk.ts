/**
 * The letter ⟨г⟩ before ⟨к⟩ is read [x] in the roots мягк- and лёгк-/легк-.
 *
 * WHAT: in «мягкий», «мягко», «мягкость», «лёгкий», «легко», «лёгкость» (and their other forms), the ⟨г⟩ of ⟨гк⟩ is [x], not the
 * [k] that regressive devoicing gives it before the voiceless ⟨к⟩. Grayson (2012) p. 17 (PDF p. 33) prints «мягкий» as
 * /ˈmʲɑx-kʲij/; Dann ruled the letter name «мягкий знак» is [ˈmʲɑx kɨj ˈznɑk] (2026-11-09 15:42; the [kɨj] ending stays as the
 * engine has it). The rule is lexical, as `lexical-exception.ts` and `lexical-r.ts` are: it belongs to these two roots.
 *
 * RESTRICTED to the roots on purpose: it is NOT every ⟨гк⟩. A ⟨гк⟩ across a prefix boundary or in any other word keeps the ordinary
 * devoicing, [k]. It reads the letters of the word, so a derivative that keeps the root (нелегко, легковой) is covered, and
 * «смягчить» (мягч-, no ⟨гк⟩) is out of scope. The root is matched on the folded spelling, ⟨ё⟩ as ⟨е⟩.
 *
 * WHEN IT FAILS: a word with the root shows [k] where the ruled sound is [x] (the letter name «мягкий знак» reads [ˈmʲɑk kɨj …]),
 * or a word outside the roots shows [x]. It relates to `engine.ts` (`applyRegressiveVoicing`, which it follows) and to LEARN's
 * letter-name table, which `learn-letter-names.test.ts` pins to the engine.
 */
import type { TranscriptionLogEntry } from './engine';

/** The roots whose ⟨гк⟩ is [x]; ⟨ё⟩ is folded to ⟨е⟩ before the match. */
export const LEXICAL_GK_ROOTS: readonly string[] = ['мягк', 'легк'];

/** The index in the word of the ⟨г⟩ of a root's ⟨гк⟩, or -1 where the word has none of the roots. */
export function lexicalGkIndex(word: string): number {
  const w = word.toLowerCase().replace(/ё/g, 'е');
  for (const root of LEXICAL_GK_ROOTS) {
    const i = w.indexOf(root);
    if (i >= 0) return i + root.indexOf('г');
  }
  return -1;
}

/**
 * The word's IPA after regressive devoicing, with the root's [k] of ⟨г⟩ made [x]: the first [k], [kʲ], [ɡ] or [ɡʲ] that is followed (through an
 * optional stress mark) by a hard or soft [k]; the plain [x] is Grayson's (his «мягкий» is /ˈmʲɑx-kʲij/). The log's ⟨г⟩ entry follows, flagged `lexicalGk`.
 */
export function lexicalGk(word: string, ipa: string, log: TranscriptionLogEntry[]): string {
  const at = lexicalGkIndex(word);
  if (at < 0) return ipa;
  const out = ipa.replace(/[kɡ]ʲ?(?=ˈ?k)/, 'x'); // before a soft к (мягкие) the engine leaves the г voiced and palatalized, [ɡʲ], or devoiced, [kʲ]; Grayson's [x] is plain
  if (out === ipa) return ipa;
  const entry = log.find((e) => e.char === 'г');
  if (entry) {
    entry.ipa = 'x';
    entry.features.lexicalGk = true;
  }
  return out;
}
