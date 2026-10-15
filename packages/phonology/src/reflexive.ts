/**
 * The reflexive particle -ся: which words carry it, so the engine reads its с
 * hard and its я as [ʌ] (QUEUE row 91).
 *
 * Grayson (2012), as the desk read the pages (OWED.md, 2026-10-12):
 *   p. 282: "when singing Russian, the ending -ся is read as /sʌ/, based upon
 *            Old Muscovite tradition".
 *   p. 284: "whenever the combination -ся is specifically a reflexive particle,
 *            it is read as /sɑ/ or /sʌ/, in Russian lyric diction (from the
 *            Old Muscovite tradition)".
 * Dann ruled "I defer to Grayson" on 2026-10-12 20:33.
 *
 * Grayson's rule is morphological ("specifically a reflexive particle") and
 * the engine has no morphology. This predicate stands in for it, and every
 * clause below was counted against the 77,034 single-word -ся keys of the
 * dictionary on 2026-10-15 (Fable review of the row 91 brief, amendment 1).
 * In order:
 *
 * 1. A word ending in -ться, -тся, or -чься is reflexive. -ться and -тся:
 *    9,196 dictionary words, all reflexive (the other 15 are multi-word
 *    proverbs). -чься: 56 words; 24 carry the bare -чь verb as lemma
 *    (беречься, увлечься), so the lemma cannot decide them.
 * 2. A word the dictionary knows, with a lemma: reflexive when any entry that
 *    is not a name has a lemma that, lowercased, ends in -ся, or ends in -сь
 *    with part of speech `verb`. This keeps учился (учиться), смеялся,
 *    улыбнулся, бойся, мойся, нёсся (нестись), and the participial adjectives.
 *    It leaves soft the nouns гуся, лося, карася, вся (lemma весь), the
 *    gerunds неся, нося, тряся, вися, пася, крася, глася, гася (the -я is the
 *    gerund ending and the с is the stem), six slang gerunds of -сить verbs
 *    (ляпся, ворся, парся, рамся, флекся, форся), and the names Вася, Люся,
 *    Маруся, Ася, Зося, Стася, Нинся, Роисся, whose capitalized lemma ends
 *    in -ся.
 * 3. A word the dictionary does not know: reflexive when it ends in a
 *    consonant + ся or ь + ся (past -лся, -кся, -бся; 1st plural -мся;
 *    participle -хся; imperative -йся; 2nd singular -шься), except вся.
 * 4. A word the dictionary does not know and that ends in -юся is reflexive
 *    (DESK INFERENCE, Fable review amendment 2b): 8,623 of the 8,624 -юся
 *    words in the dictionary are, the one exception is the name Люся, and
 *    clause 2 already keeps it soft. This is the archaic first person
 *    (моюся, боюся, молюся, томлюся). It applies p. 284 to a shape the
 *    dictionary does not list; it is not Grayson's own sentence.
 * 5. Any other unknown word ending in vowel + ся (Дуся, Маруся, клянуся) is
 *    NOT reflexive. Nothing in the word tells it from a diminutive name, so
 *    it stays soft. A supplement entry is the road for a word this leaves
 *    wrong.
 *
 * A known word with no lemma at all (a bare supplement entry) falls to
 * clauses 3 to 5, because the dictionary then says nothing about it.
 *
 * Joining Grayson p. 109 ("it is perfectly acceptable for the singer to
 * modify the vowel back toward /ɑ/") with p. 128, Section 8 ("[ʌ] reverts to
 * /ɑ/") so that the reflexive [ʌ] reconstitutes to [ɑ] is the desk's reading,
 * not one sentence of Grayson's.
 */

/** The shape of `GraysonEngine.lookupStress()`'s result that this module reads. */
export interface ReflexiveLookup {
  lemma?: string;
  pos?: string;
  isHomograph?: boolean;
  allEntries?: Array<{ lemma?: string; l?: string; pos?: string; p?: string }>;
}

const VOWELS = 'аеёиоуыэюя';

/** Each entry's lemma and part of speech: every entry for a homograph, one otherwise. */
function entriesOf(lookup: ReflexiveLookup): Array<{ lemma: string; pos: string }> {
  const raw = lookup.isHomograph && Array.isArray(lookup.allEntries)
    ? lookup.allEntries.map((e) => ({ lemma: e.lemma ?? e.l ?? '', pos: e.pos ?? e.p ?? '' }))
    : [{ lemma: lookup.lemma ?? '', pos: lookup.pos ?? '' }];
  return raw.filter((e) => e.lemma);
}

/**
 * Index of the reflexive particle's с in `word`, which is always
 * `word.length - 2`, or -1 when the word does not end in a reflexive -ся.
 * `lookup` is the word's dictionary lookup, or null when it is unknown.
 */
export function reflexiveParticleAt(word: string, lookup: ReflexiveLookup | null): number {
  const w = word.toLowerCase();
  if (!w.endsWith('ся')) return -1;
  const at = w.length - 2;
  if (w.endsWith('ться') || w.endsWith('тся') || w.endsWith('чься')) return at;

  const entries = lookup ? entriesOf(lookup) : [];
  if (entries.length > 0) {
    const reflexive = entries.some((e) => {
      if (e.pos === 'name') return false;
      const lemma = e.lemma.toLowerCase();
      return lemma.endsWith('ся') || (lemma.endsWith('сь') && e.pos === 'verb');
    });
    return reflexive ? at : -1;
  }

  if (w === 'вся') return -1;
  if (w.endsWith('юся')) return at;
  const before = w[at - 1];
  return before !== undefined && !VOWELS.includes(before) ? at : -1;
}
