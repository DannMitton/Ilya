/**
 * The letter ⟨г⟩ before ⟨к⟩ is [x] before a hard [k] and [xʲ] before a soft [kʲ], within a word, in the roots мягк- and лёгк-/легк-.
 *
 * THE RULE (Grayson 2012, p. 240, PDF p. 256): "The letter -г- is read as /x/ or /xʲ/, when followed by /k/ or /kʲ/, respectively,
 * within a word." He prints /ˈmʲɑx kʌ/ for мягко and /lʲɪx ˈko/ for легко (hard к: /xk/), and /ˈmʲɑxʲ kʲij/ for мягкий and
 * /ˈlʲoxʲ kʲij/ for лёгкий (soft к: /xʲkʲ/); he calls it the мягко/мягкий rule. Dann ruled the letter name «мягкий знак»
 * [ˈmʲɑx kɨj ˈznɑk] (2026-11-09 15:42), which is the first case: the engine's stage profile keeps the к of -кий hard, so its г is
 * plain [x]; the forms whose к the engine softens (мягкие, лёгкие) take [xʲ]. (Page 17 is a correction of another author, not this
 * rule: an earlier version of this comment cited it.) It holds only WITHIN a word: a ⟨г⟩ at the end of one word before a к that
 * begins the next is not touched, because this reads one word's IPA.
 *
 * RESTRICTED to the two roots on purpose: it is NOT every ⟨гк⟩. A ⟨гк⟩ across a prefix boundary or in any other word keeps the
 * ordinary devoicing, [k]. It reads the letters of the word, so a derivative that keeps the root (нелегко, слегка, легковой) is
 * covered, and «смягчить» (мягч-, no ⟨гк⟩) is out of scope. The root is matched on the folded spelling, ⟨ё⟩ as ⟨е⟩.
 *
 * WHEN IT FAILS: a word with the root shows [k] where the rule gives [x], a soft к is preceded by [x] where Grayson gives [xʲ], or a
 * word outside the roots shows [x]. It relates to `engine.ts` (`applyRegressiveVoicing`, which it follows) and to LEARN's
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
 * optional stress mark) by [k] (made [x]) or [kʲ] (made [xʲ]). The log's ⟨г⟩ entry follows, flagged `lexicalGk`.
 */
export function lexicalGk(word: string, ipa: string, log: TranscriptionLogEntry[]): string {
  const at = lexicalGkIndex(word);
  if (at < 0) return ipa;
  // The г is [kʲ] or [ɡʲ] before a soft к (мягкие) and [k] or [ɡ] before a hard one: Grayson's /xʲ/ and /x/ (p. 240), by the к that follows.
  const out = ipa.replace(/[kɡ]ʲ?(?=ˈ?k(ʲ?))/, (_m, soft: string) => (soft ? 'xʲ' : 'x'));
  if (out === ipa) return ipa;
  const entry = log.find((e) => e.char === 'г');
  if (entry) {
    entry.ipa = 'x';
    entry.features.lexicalGk = true;
  }
  return out;
}
