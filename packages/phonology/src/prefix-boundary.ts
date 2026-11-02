/**
 * The prefix boundary of regressive palatalization (Grayson 2012, p. 249).
 *
 * Grayson p. 249: palatalization crosses neither the word boundary nor the
 * prefix/suffix boundary, with two exceptions: (i) the same consonant stands
 * on both sides, and the second is palatalized; (ii) a prefix ending in в, с,
 * or з before a palatalizing root. His p. 250 prints обвить /ɑb ˈvʲitʲ/ and
 * отчёт /ɑt ˈtʃʲot/ hard for that reason, and оттенок /ɑtʲ ˈtʲɛ nʌk/ soft.
 * Derwing and Priestly (1980), p. 76, restriction 1, states the stop case.
 *
 * The engine has no morphology, so the boundary is a list checked at the word
 * start (Dann, 2026-11-02 00:50: keep the list as measured in row 175 step 0,
 * plus a list of look-alike roots checked first). Both lists live here, with
 * their known limits:
 *
 * - The stop prefixes block a dental, labial, or other consonant at the end
 *   of the prefix from softening before a DIFFERENT consonant. Only the
 *   consonant-final ones (от, под, над, пред, об) can act; the vowel-final
 *   variants are listed because the brief names them.
 * - The в/с/з family (в, с, из, раз, без, воз, вз, низ, роз, чрез, через) is
 *   Grayson's exception (ii): it never blocks. Because с and в stand on the
 *   list as one-letter prefixes, they match every word that begins with them;
 *   the family has no effect on any output, by construction.
 * - The look-alike roots are words that begin with a stop prefix's letters but
 *   do not have the prefix: по-двиг-, по-движ-, по-двин-, по-двиз- (the д is
 *   the root's own, as in неподвижный, D&P 1980, p. 80), and four отч- stems.
 *   They are checked before the stop prefixes. The morphology is the desk's
 *   reading of Russian (двигать, отец); no source in this repository states
 *   it.
 *
 * KNOWN LIMITS. The list sees the word start only, so a word with two
 * boundaries (не-под-…) or a boundary inside the word is not seen, and the
 * suffix boundary of p. 249 is not built (Dann, row 175). A word that begins
 * with a prefix's letters but is not prefixed is wrong unless it is on the
 * look-alike list. Row 175 step 1's report counts the forms the list returns
 * to soft and the forms it catches that are not of the named families.
 */

/** Stop prefixes: longest first, so that предо wins over пред and подо over под. */
export const STOP_PREFIXES: readonly string[] = [
  'предо', 'подо', 'надо', 'пред', 'под', 'над', 'обо', 'ото', 'от', 'об',
];

/** Prefixes ending in в, с, or з: Grayson's exception (ii), p. 249. Longest first. */
export const VZS_PREFIXES: readonly string[] = [
  'через', 'чрез', 'без', 'воз', 'низ', 'роз', 'раз', 'из', 'вз', 'в', 'с',
];

/** A root that a stop prefix's letters seem to begin, and does not. */
export interface LookAlikeRoot {
  /** The prefix the word seems to begin with. */
  readonly look: string;
  /** The root the consonant belongs to, as printed in the comment. */
  readonly root: string;
  /** Word-start stems that identify the root's family. */
  readonly stems: readonly string[];
}

/**
 * Look-alike roots (Dann, 2026-11-02 00:50). The отч- stems are narrower than
 * the ruling's "отч-": отчёт is Grayson's own printed example of a prefixed
 * word (p. 250 /ɑt ˈtʃʲot/), and отчитать, отчислить, отчаяние, отчалить, and
 * the rest are prefix + root, so a bare отч- would return them to soft. The
 * four stems below are the отч- words of the dictionary whose root is the
 * root of отец: отчий, отчим, отчизна, отчество. NOT ESTABLISHED: whether Dann
 * meant exactly these; the row 175 step 1 report lists what each stem matches.
 */
export const LOOK_ALIKE_ROOTS: readonly LookAlikeRoot[] = [
  { look: 'под', root: 'двиг', stems: ['подвиг'] },
  { look: 'под', root: 'движ', stems: ['подвиж'] },
  { look: 'под', root: 'двин', stems: ['подвин'] },
  { look: 'под', root: 'двиз', stems: ['подвиз'] },
  { look: 'от', root: 'отч', stems: ['отчий', 'отчим', 'отчизн', 'отчеств'] },
];

export type PrefixBoundary =
  | { kind: 'stop'; prefix: string; end: number }
  | { kind: 'vzs'; prefix: string; end: number }
  | { kind: 'look-alike'; prefix: string; look: string; root: string; end: number };

/**
 * The prefix boundary a word starts with, or null. `end` is the index of the
 * prefix's last letter: the consonant that the boundary protects.
 */
export function prefixBoundary(word: string): PrefixBoundary | null {
  const w = word.toLowerCase();
  for (const la of LOOK_ALIKE_ROOTS) {
    if (la.stems.some((s) => w.startsWith(s))) {
      return { kind: 'look-alike', prefix: la.look, look: la.look, root: la.root, end: la.look.length - 1 };
    }
  }
  const stop = STOP_PREFIXES.find((p) => w.startsWith(p));
  const vzs = VZS_PREFIXES.find((p) => w.startsWith(p));
  if (stop && (!vzs || stop.length >= vzs.length)) return { kind: 'stop', prefix: stop, end: stop.length - 1 };
  if (vzs) return { kind: 'vzs', prefix: vzs, end: vzs.length - 1 };
  return null;
}
