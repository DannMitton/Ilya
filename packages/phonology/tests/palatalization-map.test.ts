/**
 * The palatalization map and its reasons (row 175 step 1; Grayson 2012, pp. 193, 206-211, 249-250;
 * D&P 1980, pp. 76-87). One row per reason id the map can give.
 */
import { describe, expect, it } from 'vitest';
import { SOFT_REASONS, HARD_REASONS, computePalatalization, softnessOfReason, transcribeWord } from '../src/index';
import type { PalReason } from '../src/index';

/** reason of the consonant at `index`, for a word with the given syllables and stressed syllable. */
function pal(word: string, index: number, syllables?: string[], stress = -1, extra: Record<string, ReadonlySet<number>> = {}) {
  return computePalatalization({ word, syllables, stressIndex: stress, ...extra }).get(index)!;
}

describe('reasons', () => {
  const rows: Array<[PalReason, string, number, string[]?, number?]> = [
    ['agent-vowel', 'мять', 0],
    ['agent-soft-sign', 'столь', 3],
    ['regressive-dental', 'сестрёнка', 2, ['се', 'стрён', 'ка'], 1],
    ['regressive-dental-dp-differs', 'три', 0],
    ['regressive-homorganic', 'симметрический', 2, ['си', 'мет', 'ри', 'че', 'ский'], 2],
    ['regressive-n', 'пенсия', 2],
    ['geminate', 'эллин', 1],
    ['r-front-stressed', 'терпеть', 2, ['тер', 'петь'], 1],
    ['hard-sign-vzs', 'съесть', 0],
    ['blocked-class', 'книга', 0],
    ['blocked-n', 'анви', 1],
    ['blocked-r', 'парви', 2],
    ['blocked-l', 'алви', 1],
    ['boundary-hard-sign', 'подъём', 2],
    ['boundary-prefix', 'обвить', 1],
    ['no-soft-follower', 'мать', 0],
    ['always-soft', 'час', 0],
    ['always-hard', 'жил', 0],
  ];
  for (const [reason, word, index, syl, stress] of rows) {
    it(`${reason}: ${word}[${index}]`, () => {
      expect(pal(word, index, syl, stress ?? -1).reason).toBe(reason);
    });
  }
  it('look-alike-root: подвиг д, with the prefix it seems to begin with and the root', () => {
    expect(pal('подвиг', 2)).toEqual({ soft: true, reason: 'look-alike-root', look: 'под', root: 'двиг' });
  });
  it('lexical-soft, reflexive-hard, adjectival-stage-hard come from the sets the engine passes', () => {
    expect(pal('цвет', 0, undefined, -1, { lexicalSoft: new Set([0]) }).reason).toBe('lexical-soft');
    expect(pal('учился', 4, undefined, -1, { lexicalHard: new Set([4]) }).reason).toBe('reflexive-hard');
    expect(pal('узкий', 2, undefined, -1, { velarAdjectivalHard: new Set([2]) }).reason).toBe('adjectival-stage-hard');
  });
  it('every reason implies a softness, except cluster', () => {
    for (const r of SOFT_REASONS) expect(softnessOfReason(r)).toBe(true);
    for (const r of HARD_REASONS) expect(softnessOfReason(r)).toBe(false);
    expect(softnessOfReason('cluster')).toBeNull();
    expect([...SOFT_REASONS].filter((r) => HARD_REASONS.has(r))).toEqual([]);
  });
});

describe('the rules, one word each', () => {
  it('Soft р and л do not stop the chain: doubled л and р are soft (D&P p. 80)', () => {
    expect(transcribeWord('эллин').ipa).toContain('lʲlʲ');
    expect(transcribeWord('иррегулярно').ipa).toContain('rʲrʲ');
  });
  it('⟨р⟩ before a soft consonant: only doubled, or after и е э with the stress on that vowel or the next', () => {
    expect(pal('персик', 2, ['пер', 'сик'], 0).soft).toBe(true); // стресс on е
    expect(pal('мерси', 2, ['мер', 'си'], 1).soft).toBe(true); // stress on the next vowel
    expect(pal('партия', 2, ['пар', 'ти', 'я'], 0).soft).toBe(false); // а, not и е э
    expect(pal('первый', 2, ['пер', 'вый'], 0).soft).toBe(false); // the follower в is hard
    expect(pal('терпеть', 2, ['тер', 'петь'], -1).soft).toBe(false); // no stress known
  });
  it('в, с, з before ъ soften; other consonants stop at ъ', () => {
    expect(transcribeWord('съесть').ipa).toContain('sʲ');
    expect(transcribeWord('въезд').ipa).toContain('vʲ');
    expect(transcribeWord('подъём').ipa).toContain('d');
    expect(transcribeWord('подъём').ipa).not.toContain('dʲ');
  });
  it('a к, г, х that the stage profile keeps hard in -кий does not soften the consonant before it (Grayson p. 211)', () => {
    const log = transcribeWord('симметрический').transcriptionLog;
    const s = log.filter((e) => e.char === 'с').at(-1)!;
    expect(s.ipa).toBe('s');
    expect(s.features.palReason).toBe('no-soft-follower');
    expect(log.filter((e) => e.char === 'к').at(-1)!.features.palReason).toBe('adjectival-stage-hard');
  });
  it('the log carries the trigger and the base sound that the comments name', () => {
    const d = transcribeWord('дверь').transcriptionLog.find((e) => e.char === 'д')!;
    expect(d.features).toMatchObject({ palReason: 'regressive-dental', trigger: 'vʲ', baseIpa: 'd' });
    const m = transcribeWord('мять').transcriptionLog.find((e) => e.char === 'м')!;
    expect(m.features).toMatchObject({ palReason: 'agent-vowel', trigger: 'я' });
  });
  it('борщ, скорбь, церковь keep soft р in every case form (D&P p. 87, 3R(c); desk default)', () => {
    for (const w of ['борщ', 'скорбь', 'церковь']) {
      const r = transcribeWord(w).transcriptionLog.find((e) => e.char === 'р')!;
      expect(r.ipa).toBe('rʲ');
      expect(r.features.palReason).toBe('lexical-soft');
    }
  });
});

describe('exception words: the stem счаст- (Grayson 2012, p. 287)', () => {
  const vowel = (w: string) => transcribeWord(w).transcriptionLog.find((e) => e.char === 'а')!;
  it('every derivative keeps dark [ɑ] with reason lexical-exception and the word', () => {
    for (const w of ['счастье', 'счастья', 'счастлив', 'счастливый', 'счастливая', 'несчастный', 'злосчастный', 'посчастливиться', 'осчастливить']) {
      const v = vowel(w);
      expect(v.ipa, w).toBe('ɑ');
      expect(v.features, w).toMatchObject({ exception: 'lexical-exception', word: w });
    }
  });
  it('a word without the stem is untouched', () => {
    expect(vowel('частный').features.exception).toBeNull();
  });
});
