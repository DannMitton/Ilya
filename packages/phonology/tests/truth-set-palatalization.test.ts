/**
 * The truth set for regressive palatalization (row 175 step 2; brief r2, 2026-11-02, and its addendum).
 *
 * Each row pins the softness of consonants for one word, with its source page in a comment. The sources, in
 * order of authority for each row:
 *
 *   G   Grayson 2012, as printed (pages named per row), read from rendered images by the desk
 *       (docs/sessions/truth-set-palatalization_r1_2026-11-01.md).
 *   R   Ruled by Dann (OPEN.md, 2026-11-01 23:27 to 2026-11-02 00:50), where Grayson's pages disagree with
 *       themselves or with D&P.
 *   DP  Derwing and Priestly 1980, where it agrees with the ruling.
 *
 * Stress is given by an apostrophe after the stressed vowel, because these tests run without a dictionary.
 * Consonant expectations are [letter, nth occurrence of that letter, soft, reason].
 *
 * The gate at the end: for every consonant of every row, the softness in the IPA agrees with the softness the
 * entry's reason implies. The glide ⟨й⟩ is exempt: it is always soft (reason always-soft), and its IPA [j]
 * has no ʲ in Grayson's inventory.
 */
import { describe, expect, it } from 'vitest';
import { GraysonEngine, softnessOfReason } from '../src/index';
import type { PalReason } from '../src/index';

type Exp = [letter: string, nth: number, soft: boolean, reason?: PalReason];
/** A merged cluster (Grayson p. 236): one cluster entry carries the sound, and the absorbed letters have no consonant entry. */
interface ClusterExp { cluster: string; ipa: string }
interface Row {
  /** The word; an apostrophe follows the stressed vowel. */
  w: string;
  /** Source and page, for the reader of a failure. */
  src: string;
  /** Grayson's printed IPA, compared by consonant skeleton (vowels, stress, spacing, length stripped). */
  g?: string;
  c?: Array<Exp | ClusterExp>;
}

const GROUPS: Array<{ title: string; rows: Row[] }> = [
  {
    title: 'Grayson, as printed',
    rows: [
      // p. 194: the prefix-hard-sign table. (The same page prints съесть, въезд, разъярять with hard в, с, з;
      // that is ruled over below, by Grayson p. 193 prose, p. 206 rule 2, and p. 250.)
      { w: 'объеда\'ть', src: 'G p. 194', g: 'ɑb jɪ ˈdɑtʲ', c: [['б', 1, false, 'boundary-hard-sign']] },
      { w: 'обе\'дать', src: 'G p. 194', g: 'ɑ ˈbʲɛ dɑtʲ', c: [['б', 1, true, 'agent-vowel']] },
      { w: 'се\'сть', src: 'G p. 194', g: 'sʲesʲtʲ', c: [['с', 2, true, 'regressive-dental']] },
      { w: 'ве\'ст', src: 'G p. 194', g: 'vʲɛst', c: [['в', 1, true, 'agent-vowel'], ['с', 1, false, 'no-soft-follower']] },
      { w: 'подъё\'м', src: 'G p. 194', g: 'pɑd ˈjom', c: [['д', 1, false, 'boundary-hard-sign']] },
      { w: 'объя\'ть', src: 'G p. 194', g: 'ɑb ˈjatʲ', c: [['б', 1, false, 'boundary-hard-sign']] },
      // p. 209 n. 277: ⟨р⟩ before a soft consonant.
      { w: 'смерть', src: 'G p. 209 n. 277', g: 'sʲmʲerʲtʲ', c: [['с', 1, true, 'regressive-dental'], ['р', 1, true, 'r-front-stressed']] },
      { w: 'терпе\'ть', src: 'G p. 209 n. 277 (ratified ⟨р⟩ rule, OPEN.md 2026-11-01 23:53; D&P p. 86 3R(b))', g: 'tʲirʲ ˈpʲetʲ', c: [['р', 1, true, 'r-front-stressed']] },
      { w: 'кирпи\'ч', src: 'G p. 209 n. 277 (ratified ⟨р⟩ rule, OPEN.md 2026-11-01 23:53; D&P p. 86 3R(b))', g: 'kʲirʲ ˈpʲitʃʲ', c: [['р', 1, true, 'r-front-stressed']] },
      // p. 210: the limits.
      { w: 'сто\'л', src: 'G p. 210', g: 'stoɫ', c: [['л', 1, false, 'no-soft-follower']] },
      { w: 'сто\'ль', src: 'G p. 210', g: 'stolʲ', c: [['л', 1, true, 'agent-soft-sign']] },
      { w: 'ма\'ть', src: 'G p. 210', g: 'mɑtʲ', c: [['м', 1, false, 'no-soft-follower']] },
      { w: 'мя\'ть', src: 'G p. 210', g: 'mʲatʲ', c: [['м', 1, true, 'agent-vowel']] },
      { w: 'большо\'й', src: 'G p. 210', g: 'bɑlʲ ˈʃoj', c: [['л', 1, true, 'agent-soft-sign']] },
      { w: 'сестрё\'нка', src: 'G p. 210; Grayson, personal communication, February 2026', g: 'sʲi ˈsʲtʲrʲon kɑ', c: [['с', 2, true, 'regressive-dental'], ['т', 1, true, 'regressive-dental-dp-differs'], ['р', 1, true, 'agent-vowel']] },
      // p. 211: the m before a soft m, and the dental before a soft р.
      { w: 'симметри\'ческий', src: 'G p. 211', g: 'sʲi mʲmʲi ˈtʲrʲi tʃʲɪ skɨj', c: [['м', 1, true, 'regressive-homorganic'], ['т', 1, true, 'regressive-dental-dp-differs'], ['с', 2, false, 'no-soft-follower'], ['к', 1, false, 'adjectival-stage-hard']] },
      // p. 250: the prefix boundary (p. 249).
      { w: 'обви\'ть', src: 'G p. 250 (boundary p. 249)', g: 'ɑb ˈvʲitʲ', c: [['б', 1, false, 'boundary-prefix']] },
      { w: 'отчё\'т', src: 'G p. 250 (boundary p. 249)', g: 'ɑt ˈtʃʲot', c: [['т', 1, false, 'boundary-prefix']] },
      { w: 'отте\'нок', src: 'G p. 250 (same consonant, p. 249 exception i)', g: 'ɑtʲ ˈtʲɛ nʌk', c: [['т', 1, true, 'regressive-dental']] },
      { w: 'изменя\'ть', src: 'G p. 250 (prefix in з, p. 249 exception ii)', g: 'izʲ mʲi ˈɲatʲ', c: [['з', 1, true, 'regressive-dental']] },
      // p. 236: СЧ, ЗЧ, ЖЧ, СТЧ, ЗДЧ, ССЧ are all read as /ʃʲʃʲ/, "as if spelled with щ", with no dental sound before it.
      // (row 175 step 4). The cluster entry carries the sound; the absorbed letters have no consonant entry.
      { w: 'рассчи\'тывать', src: 'G p. 236 (ССЧ)', g: 'ra ˈʃʲʃʲi tɨ vatʲ', c: [{ cluster: 'ссч', ipa: 'ʃʲʃʲ' }] },
      { w: 'му\'жчина', src: 'G p. 236 (ЖЧ)', g: 'ˈmu ʃʲʃʲi na', c: [{ cluster: 'жч', ipa: 'ʃʲʃʲ' }] },
      { w: 'жё\'стче', src: 'G p. 236 (СТЧ)', g: 'ˈʒo ʃʲʃʲɪ', c: [{ cluster: 'стч', ipa: 'ʃʲʃʲ' }] },
      { w: 'громо\'здче', src: 'G p. 236 (ЗДЧ)', g: 'ɡra ˈmo ʃʲʃʲɪ', c: [{ cluster: 'здч', ipa: 'ʃʲʃʲ' }] },
      // резче: p. 236, as the desk quotes it, prints /ˈre ʃʲʃʲɪ/ with the р unmarked; Ilya's р is [rʲ] before е, by
      // Grayson's own p. 206 rule (and his p. 209 n. 277 prints sʲmʲerʲtʲ with the marks). The page was not read
      // from here, so whether the print omits the ʲ is NOT ESTABLISHED, and the row pins the cluster and the р
      // by letter and does not compare the skeleton.
      { w: 'ре\'зче', src: 'G p. 236 (ЗЧ); the р unmarked in the quoted print, NOT ESTABLISHED', c: [{ cluster: 'зч', ipa: 'ʃʲʃʲ' }, ['р', 1, true, 'agent-vowel']] },
      { w: 'сча\'стье', src: 'G p. 236 (СЧ); p. 287 for the ⟨а⟩', g: 'ˈʃʲʃʲa sʲtʲjɪ', c: [{ cluster: 'сч', ipa: 'ʃʲʃʲ' }, ['с', 1, true, 'regressive-dental'], ['т', 1, true, 'agent-soft-sign']] },
    ],
  },
  {
    title: 'The hard sign: в, с, з soften before ъ (ruled 2026-11-01 23:58, over Grayson p. 194 table)',
    rows: [
      { w: 'съе\'сть', src: 'R; Grayson p. 193 prose, p. 206 rule 2, p. 250 /sʲ ˈjesʲtʲ/ (p. 194 prints sjesʲtʲ)', c: [['с', 1, true, 'hard-sign-vzs']] },
      { w: 'въе\'зд', src: 'R; Grayson p. 193; D&P p. 81 (p. 194 prints vjɛst)', c: [['в', 1, true, 'hard-sign-vzs']] },
      { w: 'разъяря\'ть', src: 'R; Grayson p. 193 (p. 194 prints rʌz ji ˈrʲatʲ)', c: [['з', 1, true, 'hard-sign-vzs']] },
      { w: 'съё\'мный', src: 'R (p. 194 prints sjom nɨj hard; ruled soft)', c: [['с', 1, true, 'hard-sign-vzs']] },
      { w: 'безъязы\'чный', src: 'D&P p. 83 (бьезь/йазычный)', c: [['з', 1, true, 'hard-sign-vzs']] },
    ],
  },
  {
    title: 'D&P, agreeing with the ruling',
    rows: [
      // ⟨р⟩ before a hard consonant stays hard (D&P p. 87).
      { w: 'пе\'рвый', src: 'DP p. 87', c: [['р', 1, false, 'no-soft-follower']] },
      { w: 'четве\'рг', src: 'DP p. 87', c: [['р', 1, false, 'no-soft-follower']] },
      { w: 'ве\'рх', src: 'DP p. 87', c: [['р', 1, false, 'no-soft-follower']] },
      { w: 'зе\'ркало', src: 'DP p. 87 (second ⟨р⟩ before a hard velar; review amendment 2)', c: [['р', 1, false, 'no-soft-follower']] },
      // ⟨р⟩ before a soft consonant, after и е э (D&P p. 86 3R(b); ratified reformulation, OPEN.md 2026-11-01 23:53).
      { w: 'пе\'рсик', src: 'DP p. 86 (ratified reformulation, OPEN.md 2026-11-01 23:53)', c: [['р', 1, true, 'r-front-stressed']] },
      { w: 'ве\'рсия', src: 'DP p. 86 (ratified reformulation, OPEN.md 2026-11-01 23:53)', c: [['р', 1, true, 'r-front-stressed']] },
      { w: 'пе\'рвенец', src: 'DP p. 86 (ratified reformulation, OPEN.md 2026-11-01 23:53)', c: [['р', 1, true, 'r-front-stressed']] },
      { w: 'мерси\'', src: 'DP p. 86 (ratified reformulation, OPEN.md 2026-11-01 23:53)', c: [['р', 1, true, 'r-front-stressed']] },
      // ⟨р⟩ after а or after a vowel that is not и е э: hard before a soft consonant.
      { w: 'па\'ртия', src: 'DP p. 86', c: [['р', 1, false, 'blocked-r']] },
      { w: 'а\'рмия', src: 'DP p. 86', c: [['р', 1, false, 'blocked-r']] },
      // The dental before a soft consonant (D&P p. 80).
      { w: 'неподви\'жный', src: 'DP p. 80 (the д is root-initial: по-движный; не- is not a listed prefix)', c: [['д', 1, true, 'regressive-dental']] },
      { w: 'дверь', src: 'DP p. 80', c: [['д', 1, true, 'regressive-dental'], ['р', 1, true, 'agent-soft-sign']] },
      { w: 'че\'тверть', src: 'DP p. 80', c: [['т', 1, true, 'regressive-dental']] },
      { w: 'зверь', src: 'DP p. 80', c: [['з', 1, true, 'regressive-dental']] },
      // Doubled л and р (D&P p. 80; Grayson p. 209 rules 1 and 2).
      { w: 'гулли\'вая', src: 'DP p. 80 (geminate)', c: [['л', 1, true, 'geminate'], ['л', 2, true, 'agent-vowel']] },
      { w: 'э\'ллин', src: 'DP p. 80 (geminate)', c: [['л', 1, true, 'geminate']] },
      { w: 'иррегуля\'рно', src: 'DP p. 80 (geminate)', c: [['р', 1, true, 'geminate']] },
      // ч as a trigger (D&P p. 81; Grayson is silent on these pages: NOT ESTABLISHED for him).
      { w: 'лётчик', src: 'DP p. 81 (Grayson pp. 193-211 are silent on ч as a trigger)', c: [['т', 1, true, 'regressive-dental']] },
      { w: 'ме\'длить', src: 'DP p. 81', c: [['д', 1, true, 'regressive-dental']] },
      // н before ч, щ (row 175 step 4, desk default): D&P p. 81 кончать → коньчать; Grayson p. 209 is silent.
      { w: 'конча\'ть', src: 'DP p. 81 (кончать; Grayson p. 209 silent; ч, щ are н triggers by desk default)', c: [['н', 1, true, 'regressive-n']] },
    ],
  },
  {
    title: 'Grayson over D&P (D&P p. 79/80 print n/c, dental hard)',
    rows: [
      { w: 'ве\'тки', src: 'Grayson p. 209/210 over D&P p. 79/80 n/c', c: [['т', 1, true, 'regressive-dental-dp-differs']] },
      { w: 'три', src: 'Grayson p. 209/210 over D&P p. 79/80 n/c', c: [['т', 1, true, 'regressive-dental-dp-differs']] },
    ],
  },
  {
    title: 'D&P 3R(c), p. 87: lexical ⟨р⟩ (desk default; Panov: церковь alone is still sung with рь)',
    rows: [
      { w: 'бо\'рщ', src: 'DP p. 87 3R(c)', c: [['р', 1, true, 'lexical-soft']] },
      { w: 'ско\'рбь', src: 'DP p. 87 3R(c)', c: [['р', 1, true, 'lexical-soft']] },
      { w: 'це\'рковь', src: 'DP p. 87 3R(c)', c: [['р', 1, true, 'lexical-soft']] },
    ],
  },
  {
    title: 'Look-alike roots and prefixed words (ruled by Dann 2026-11-02 00:50)',
    rows: [
      { w: 'по\'двиг', src: 'R (по-двиг-, as неподвижный; Grayson p. 249: the д is not prefix-final)', c: [['д', 1, true, 'look-alike-root']] },
      { w: 'подви\'жный', src: 'R (по-движ-)', c: [['д', 1, true, 'look-alike-root']] },
      { w: 'о\'тчий', src: 'R (отч-)', c: [['т', 1, true, 'look-alike-root']] },
      { w: 'о\'тчим', src: 'R (отч-)', c: [['т', 1, true, 'look-alike-root']] },
      { w: 'о\'тчизна', src: 'R (отч-)', c: [['т', 1, true, 'look-alike-root']] },
      // A prefixed word with a p. 236 cluster after the boundary: the д stays hard (p. 249), the сч is /ʃʲʃʲ/ (row 175 step 4).
      { w: 'подсчита\'ть', src: 'G p. 249 (prefix под-) and p. 236 (СЧ)', c: [['д', 1, false, 'boundary-prefix'], { cluster: 'сч', ipa: 'ʃʲʃʲ' }] },
      // The other end of the list: отч- words that are prefixed stay hard, as Grayson prints отчёт (p. 250).
      { w: 'отчита\'ть', src: 'G p. 249 (prefix от-; отчёт p. 250 is the printed twin)', c: [['т', 1, false, 'boundary-prefix']] },
      { w: 'отвести\'', src: 'G p. 249 (prefix от-; D&P p. 79 от/лично n/c)', c: [['т', 1, false, 'boundary-prefix']] },
      { w: 'подвести\'', src: 'G p. 249 (prefix под-; D&P p. 79 под/бил n/c)', c: [['д', 1, false, 'boundary-prefix']] },
      { w: 'отли\'чно', src: 'G p. 249 (prefix от-; D&P p. 79 от/лично n/c)', c: [['т', 1, false, 'boundary-prefix']] },
    ],
  },
];

function transcribe(spec: string) {
  const i = spec.indexOf("'");
  const word = spec.replace("'", '');
  let stress = -1;
  if (i >= 0) {
    let start = 0;
    const syllables = GraysonEngine.syllabify(word);
    for (let s = 0; s < syllables.length; s++) {
      if (i - 1 >= start && i - 1 < start + syllables[s].length) stress = s;
      start += syllables[s].length;
    }
  }
  return GraysonEngine.transcribe(word, stress);
}

const skeleton = (ipa: string) => ipa.replace(/[ˈˌː\s]/g, '').replace(/[aɑeɛiɪɨoʌuəɐ]/g, '');

const allRows = GROUPS.flatMap((g) => g.rows);

for (const group of GROUPS) {
  describe(group.title, () => {
    for (const row of group.rows) {
      const word = row.w.replace("'", '');
      it(`${word}: ${row.src}`, () => {
        const result = transcribe(row.w);
        if (row.g) expect(skeleton(result.ipa), `${result.ipa} against Grayson ${row.g}`).toBe(skeleton(row.g));
        for (const exp of row.c ?? []) {
          if (!Array.isArray(exp)) {
            const cl = result.transcriptionLog.find((e) => e.features?.type === 'cluster' && e.char === exp.cluster);
            expect(cl, `cluster ${exp.cluster} in ${word}`).toBeDefined();
            expect(cl!.ipa).toBe(exp.ipa);
            const start = cl!.position as number;
            const absorbed = result.transcriptionLog.filter(
              (e) => e.features?.type === 'consonant' && (e.position as number) >= start && (e.position as number) < start + exp.cluster.length,
            );
            expect(absorbed.map((e) => e.char), `the letters of ${exp.cluster} have no consonant entry of their own`).toEqual([]);
            continue;
          }
          const [letter, nth, soft, reason] = exp;
          const entries = result.transcriptionLog.filter((e) => e.features?.type === 'consonant' && e.char === letter);
          const e = entries[nth - 1];
          expect(e, `${letter} #${nth} in ${word}`).toBeDefined();
          expect(/ʲ|ɲ/.test(e.ipa), `${letter} #${nth} of ${word} is ${e.ipa}`).toBe(soft);
          if (reason) expect(e.features.palReason, `${letter} #${nth} of ${word}`).toBe(reason);
        }
      });
    }
  });
}

describe('lexical exception: «счастье» and its derivatives (Grayson 2012, p. 287, ch. 6 section 5)', () => {
  for (const spec of ['сча\'стье', 'счастли\'вая']) {
    it(`${spec.replace("'", '')}: ⟨а⟩ is the dark [ɑ], reason lexical-exception`, () => {
      const a = transcribe(spec).transcriptionLog.find((e) => e.char === 'а' && e.features.type === 'vowel')!;
      expect(a.ipa).toBe('ɑ');
      expect(a.features.exception).toBe('lexical-exception');
    });
  }
});

describe('the agreement gate', () => {
  it('for every consonant of every row, the softness in the IPA agrees with the softness its reason implies', () => {
    const bad: string[] = [];
    let n = 0;
    for (const row of allRows) {
      for (const e of transcribe(row.w).transcriptionLog) {
        if (e.features?.type !== 'consonant' || e.char === 'й') continue;
        n++;
        const implied = softnessOfReason(e.features.palReason);
        const actual = /ʲ|ɲ/.test(e.ipa) || e.ipa === 'tʃʲ';
        if (implied !== null && implied !== actual) bad.push(`${row.w}: ${e.char} ${e.ipa} ${e.features.palReason}`);
      }
    }
    expect(bad).toEqual([]);
    expect(n).toBeGreaterThan(150);
  });
});
