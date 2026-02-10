/**
 * Task 7c — Notation and Edge Case Tests
 *
 * Tests applyNotationPreferences display transforms (all five toggles),
 * j-glide handling, velar adjectival config, -ая suffix, cross-word
 * assimilation, and documented edge cases from regression-cases.md.
 *
 * Sources:
 *   - regression-cases.md (Sections 1.6, 1.10, 4.1, 4.7, 4.8, 4.9)
 *   - golden-master.json (categories: jGlideInitial, jGlideAfterVowel,
 *     jGlideAfterHardSign, jGlideAfterSoftSign, suffixVelarAdj, suffixAya)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  GraysonEngine,
  transcribeWord,
  applyNotationPreferences,
  setStressDictionary,
  setSingerSupplement,
  DEFAULT_ENGINE_CONFIG,
} from '../src/index';
import type { NotationPreferences, EngineConfig } from '../src/index';

// ─────────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────────

const TEST_DICTIONARY: Record<string, any> = {
  // J-glide: word-initial
  'яблоко': { stress: 0, gloss: { en: 'apple' }, pos: 'noun', lemma: 'яблоко' },
  'юг': { stress: 0, gloss: { en: 'south' }, pos: 'noun', lemma: 'юг' },
  'ель': { stress: 0, gloss: { en: 'fir tree' }, pos: 'noun', lemma: 'ель' },
  'явь': { stress: 0, gloss: { en: 'reality' }, pos: 'noun', lemma: 'явь' },
  // J-glide: after vowel
  'своя': { stress: 1, gloss: { en: 'own (f)' }, pos: 'pron', lemma: 'свой' },
  'поёт': { stress: 1, gloss: { en: 'sings' }, pos: 'verb', lemma: 'петь' },
  'стоят': { stress: 1, gloss: { en: 'stand' }, pos: 'verb', lemma: 'стоять' },
  // J-glide: after ъ (hard sign)
  'объявить': { stress: 2, gloss: { en: 'to announce' }, pos: 'verb', lemma: 'объявить' },
  'объём': { stress: 1, gloss: { en: 'volume' }, pos: 'noun', lemma: 'объём' },
  // J-glide: after ь (soft sign)
  'вьюга': { stress: 0, gloss: { en: 'blizzard' }, pos: 'noun', lemma: 'вьюга' },
  'семья': { stress: 1, gloss: { en: 'family' }, pos: 'noun', lemma: 'семья' },
  'ночью': { stress: 0, gloss: { en: 'at night' }, pos: 'noun', lemma: 'ночь' },
  'платье': { stress: 0, gloss: { en: 'dress' }, pos: 'noun', lemma: 'платье' },
  // Velar adjectival suffix
  'великий': { stress: 1, gloss: { en: 'great' }, pos: 'adj', lemma: 'великий' },
  'долгий': { stress: 0, gloss: { en: 'long' }, pos: 'adj', lemma: 'долгий' },
  'тихий': { stress: 0, gloss: { en: 'quiet' }, pos: 'adj', lemma: 'тихий' },
  'глубокий': { stress: 1, gloss: { en: 'deep' }, pos: 'adj', lemma: 'глубокий' },
  // русский exception: uses modern -кий (skipVelarAdjectival)
  'русский': { stress: 0, gloss: { en: 'Russian' }, pos: 'adj', lemma: 'русский' },
  // -ая/-яя suffix
  'красивая': { stress: 2, gloss: { en: 'beautiful (f)' }, pos: 'adj', lemma: 'красивый' },
  'добрая': { stress: 0, gloss: { en: 'kind (f)' }, pos: 'adj', lemma: 'добрый' },
  'синяя': { stress: 0, gloss: { en: 'blue (f)' }, pos: 'adj', lemma: 'синий' },
  // Interpalatal edge cases (regression 4.7, 4.8)
  'день': { stress: 0, gloss: { en: 'day' }, pos: 'noun', lemma: 'день' },
  'сеть': { stress: 0, gloss: { en: 'net' }, pos: 'noun', lemma: 'сеть' },
  'это': { stress: 0, gloss: { en: 'this' }, pos: 'pron', lemma: 'это' },
  'тебе': { stress: 1, gloss: { en: 'you (dat)' }, pos: 'pron', lemma: 'ты' },
  'мяч': { stress: 0, gloss: { en: 'ball' }, pos: 'noun', lemma: 'мяч' },
  'пять': { stress: 0, gloss: { en: 'five' }, pos: 'noun', lemma: 'пять' },
  'мать': { stress: 0, gloss: { en: 'mother' }, pos: 'noun', lemma: 'мать' },
  // счастье (regression 4.1)
  'счастье': { stress: 0, gloss: { en: 'happiness' }, pos: 'noun', lemma: 'счастье' },
};

const TEST_SUPPLEMENT: Record<string, any> = {};

describe('Task 7c: Notation and Edge Cases', () => {

  beforeEach(() => {
    setStressDictionary(TEST_DICTIONARY);
    setSingerSupplement(TEST_SUPPLEMENT);
  });

  afterEach(() => {
    setStressDictionary({});
    setSingerSupplement({});
  });

  // ─────────────────────────────────────────────────────────────────
  // NOTATION PREFERENCES
  // ─────────────────────────────────────────────────────────────────

  describe('applyNotationPreferences: display transforms', () => {

    const defaultPrefs: NotationPreferences = {
      reducedVowel: false,
      geminate: false,
      shcha: false,
      palatalNasal: false,
      reconstitution: false,
    };

    it('returns empty string for empty input', () => {
      expect(applyNotationPreferences('', defaultPrefs)).toBe('');
    });

    it('returns unchanged IPA when all prefs are false', () => {
      expect(applyNotationPreferences('mʌɫɑˈko', defaultPrefs)).toBe('mʌɫɑˈko');
    });

    // reducedVowel: ʌ → ə
    it('replaces all ʌ with ə when reducedVowel is true', () => {
      const prefs = { ...defaultPrefs, reducedVowel: true };
      expect(applyNotationPreferences('mʌɫɑˈko', prefs)).toBe('məɫɑˈko');
    });

    it('replaces multiple ʌ occurrences', () => {
      const prefs = { ...defaultPrefs, reducedVowel: true };
      expect(applyNotationPreferences('ʌbʌ', prefs)).toBe('əbə');
    });

    // shcha: ʃʲʃʲ → ʃʲː
    it('replaces ʃʲʃʲ with ʃʲː when shcha is true', () => {
      const prefs = { ...defaultPrefs, shcha: true };
      expect(applyNotationPreferences('ʃʲʃʲ', prefs)).toBe('ʃʲː');
    });

    it('does not affect plain ʃʃ (non-palatalized) when shcha is true', () => {
      const prefs = { ...defaultPrefs, shcha: true };
      expect(applyNotationPreferences('ʃʃ', prefs)).toBe('ʃʃ');
    });

    // palatalNasal: ɲ → nʲ
    it('replaces ɲ with nʲ when palatalNasal is true', () => {
      const prefs = { ...defaultPrefs, palatalNasal: true };
      expect(applyNotationPreferences('ɲɪt', prefs)).toBe('nʲɪt');
    });

    it('replaces multiple ɲ occurrences', () => {
      const prefs = { ...defaultPrefs, palatalNasal: true };
      expect(applyNotationPreferences('ɲɑɲ', prefs)).toBe('nʲɑnʲ');
    });

    // geminate: identical consonants across syllable boundary → length mark
    it('simplifies plain geminate n n to nː when geminate is true and includeGeminates is true', () => {
      const prefs = { ...defaultPrefs, geminate: true };
      expect(applyNotationPreferences('n n', prefs, true)).toBe('nː');
    });

    it('simplifies palatalized geminate nʲ nʲ to nʲː', () => {
      const prefs = { ...defaultPrefs, geminate: true };
      expect(applyNotationPreferences('nʲ nʲ', prefs, true)).toBe('nʲː');
    });

    it('does NOT simplify geminates when includeGeminates is false (ribbon context)', () => {
      const prefs = { ...defaultPrefs, geminate: true };
      // Default: includeGeminates = false
      expect(applyNotationPreferences('n n', prefs)).toBe('n n');
    });

    it('does NOT simplify geminates when geminate pref is false', () => {
      expect(applyNotationPreferences('n n', defaultPrefs, true)).toBe('n n');
    });

    // reconstitution: not wired yet (Phase 3)
    it('does nothing when reconstitution is true (not wired)', () => {
      const prefs = { ...defaultPrefs, reconstitution: true };
      expect(applyNotationPreferences('mʌɫɑˈko', prefs)).toBe('mʌɫɑˈko');
    });

    // Combined preferences
    it('applies reducedVowel and palatalNasal together', () => {
      const prefs = { ...defaultPrefs, reducedVowel: true, palatalNasal: true };
      // ɲʌ → nʲə
      expect(applyNotationPreferences('ɲʌ', prefs)).toBe('nʲə');
    });

    it('applies shcha and reducedVowel together', () => {
      const prefs = { ...defaultPrefs, shcha: true, reducedVowel: true };
      // ʃʲʃʲʌ → ʃʲːə
      expect(applyNotationPreferences('ʃʲʃʲʌ', prefs)).toBe('ʃʲːə');
    });

    it('applies all five toggles simultaneously', () => {
      const prefs: NotationPreferences = {
        reducedVowel: true,
        geminate: true,
        shcha: true,
        palatalNasal: true,
        reconstitution: true,
      };
      // ɲʌʃʲʃʲ → nʲəʃʲː
      expect(applyNotationPreferences('ɲʌʃʲʃʲ', prefs)).toBe('nʲəʃʲː');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // J-GLIDE HANDLING
  // ─────────────────────────────────────────────────────────────────

  describe('j-glide: word-initial iotated vowels', () => {

    it('adds j-glide to word-initial я in яблоко', () => {
      const result = transcribeWord('яблоко');
      expect(result.ipa).toBe('ˈjɑbɫʌkʌ');
    });

    it('adds j-glide to word-initial ю in юг', () => {
      const result = transcribeWord('юг');
      expect(result.ipa).toBe('ˈjuk');
    });

    it('adds j-glide to word-initial е in ель', () => {
      const result = transcribeWord('ель');
      expect(result.ipa).toBe('ˈjelʲ');
    });

    it('adds j-glide to word-initial я in явь', () => {
      const result = transcribeWord('явь');
      expect(result.ipa).toBe('ˈjafʲ');
    });

  });

  describe('j-glide: after vowel (hiatus)', () => {

    it('adds j-glide in своя (vowel + я)', () => {
      const result = transcribeWord('своя');
      expect(result.ipa).toBe('svɑˈjɑ');
    });

    it('adds j-glide in поёт (о + ё)', () => {
      const result = transcribeWord('поёт');
      expect(result.ipa).toBe('pɑˈjot');
    });

    it('adds j-glide in стоят (о + я)', () => {
      const result = transcribeWord('стоят');
      expect(result.ipa).toBe('stɑˈjɑt');
    });

  });

  describe('j-glide: after ъ (hard sign)', () => {

    it('adds j-glide after ъ in объявить', () => {
      // объявить (stress=2): ʌbjiˈvʲitʲ
      // Note: pretonic я after j-glide (from ъ) and before soft в:
      // transcribeVowel sees isPrecededByPal=true, isFollowedByPal=true
      // → interpalatal internally → pretonic я → i
      // But the LOG feature flags interpalatal=false (ъ blocks the feature flag)
      const result = transcribeWord('объявить');
      expect(result.ipa).toBe('ʌbjiˈvʲitʲ');
    });

    it('adds j-glide after ъ in объём', () => {
      const result = transcribeWord('объём');
      expect(result.ipa).toBe('ɑˈbjom');
    });

  });

  describe('j-glide: after ь (soft sign)', () => {

    it('adds j-glide after ь in вьюга', () => {
      // вьюга (stress=0): ˈvʲjuɡɑ
      const result = transcribeWord('вьюга');
      expect(result.ipa).toBe('ˈvʲjuɡɑ');
    });

    it('adds j-glide after ь in семья', () => {
      // семья (stress=1, on мья): sʲiˈmʲjɑ
      // Stress mark appears at the start of the stressed syllable
      const result = transcribeWord('семья');
      expect(result.ipa).toBe('sʲiˈmʲjɑ');
    });

    it('adds j-glide after ь in ночью', () => {
      const result = transcribeWord('ночью');
      expect(result.ipa).toBe('ˈnotʃʲju');
    });

    it('adds j-glide after ь in платье', () => {
      const result = transcribeWord('платье');
      expect(result.ipa).toBe('ˈpɫɑtʲjɪ');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // VELAR ADJECTIVAL SUFFIX (-кий/-гий/-хий)
  // ─────────────────────────────────────────────────────────────────

  describe('velar adjectival: stage (Old Muscovite) config', () => {

    it('keeps velar hard and и becomes ɨ in великий', () => {
      // великий (stress=1): vʲiˈlʲikɨj (stage: к hard, и → ɨ)
      const result = transcribeWord('великий');
      expect(result.ipa).toBe('vʲiˈlʲikɨj');
    });

    it('keeps velar hard in долгий', () => {
      // долгий (stress=0): ˈdoɫɡɨj (stage: г hard, и → ɨ)
      const result = transcribeWord('долгий');
      expect(result.ipa).toBe('ˈdoɫɡɨj');
    });

    it('keeps velar hard in тихий', () => {
      // тихий (stress=0): ˈtʲixɨj (stage: х hard, и → ɨ)
      const result = transcribeWord('тихий');
      expect(result.ipa).toBe('ˈtʲixɨj');
    });

    it('keeps velar hard in глубокий', () => {
      // глубокий (stress=1): ɡɫuˈbokɨj (stage: к hard, и → ɨ)
      const result = transcribeWord('глубокий');
      expect(result.ipa).toBe('ɡɫuˈbokɨj');
    });

  });

  describe('velar adjectival: modern config', () => {

    it('palatalizes velar in великий with modern config', () => {
      // великий (stress=1, modern): vʲiˈlʲikʲij
      const result = GraysonEngine.transcribe('великий', 1, false, null, { adjectival: 'modern' });
      expect(result.ipa).toContain('kʲij');
    });

  });

  describe('velar adjectival: русский exception', () => {

    it('uses modern (soft) -кий for русский despite stage config', () => {
      // русский (stress=0): ˈruskʲij (exception: skipVelarAdjectival)
      const result = transcribeWord('русский');
      expect(result.ipa).toBe('ˈruskʲij');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // -АЯ/-ЯЯ SUFFIX
  // ─────────────────────────────────────────────────────────────────

  describe('-ая/-яя suffix: always /ɑjɑ/ (Grayson p. 124)', () => {

    it('keeps -ая unreduced in красивая', () => {
      // красивая (stress=2, on -ва-): krʌsʲiˈvɑjɑ
      // кра is remote (а → ʌ), suffix -ая stays /ɑjɑ/
      const result = transcribeWord('красивая');
      expect(result.ipa).toBe('krʌsʲiˈvɑjɑ');
    });

    it('keeps -ая unreduced in добрая', () => {
      const result = transcribeWord('добрая');
      expect(result.ipa).toBe('ˈdobrɑjɑ');
    });

    it('keeps -яя unreduced in синяя', () => {
      // синяя (stress=0): ˈsʲiɲɑjɑ (яя suffix: both vowels unreduced)
      const result = transcribeWord('синяя');
      expect(result.ipa).toBe('ˈsʲiɲɑjɑ');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // INTERPALATAL EDGE CASES (regression 4.7, 4.8)
  // ─────────────────────────────────────────────────────────────────

  describe('stressed [e] allophone (regression 4.7)', () => {

    it('produces [e] when interpalatal in день', () => {
      // день: ˈdʲeɲ (soft д + е + soft н = interpalatal)
      const result = transcribeWord('день');
      expect(result.ipa).toBe('ˈdʲeɲ');
    });

    it('produces [e] when interpalatal in сеть', () => {
      // сеть: ˈsʲetʲ (soft с + е + soft т = interpalatal)
      const result = transcribeWord('сеть');
      expect(result.ipa).toBe('ˈsʲetʲ');
    });

    it('produces [ɛ] when NOT interpalatal in тебе', () => {
      // тебе (stress=1): tʲiˈbʲɛ (word-final е: no following soft consonant)
      const result = transcribeWord('тебе');
      expect(result.ipa).toBe('tʲiˈbʲɛ');
    });

    it('produces [ɛ] when NOT interpalatal in это', () => {
      // это: ˈɛtʌ (followed by hard т)
      const result = transcribeWord('это');
      expect(result.ipa).toBe('ˈɛtʌ');
    });

  });

  describe('bright [a] allophone (regression 4.8)', () => {

    it('produces [a] when interpalatal in мяч', () => {
      // мяч: ˈmʲatʃʲ (soft м + я + always-soft ч = interpalatal)
      const result = transcribeWord('мяч');
      expect(result.ipa).toBe('ˈmʲatʃʲ');
    });

    it('produces [a] when interpalatal in пять', () => {
      // пять: ˈpʲatʲ (soft п + я + soft т = interpalatal)
      const result = transcribeWord('пять');
      expect(result.ipa).toBe('ˈpʲatʲ');
    });

    it('produces [ɑ] when NOT interpalatal in мать', () => {
      // мать: ˈmɑtʲ (м is HARD: no preceding soft consonant for а)
      const result = transcribeWord('мать');
      expect(result.ipa).toBe('ˈmɑtʲ');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // CROSS-WORD ASSIMILATION
  // ─────────────────────────────────────────────────────────────────

  describe('cross-word assimilation (regression 1.10)', () => {

    it('applies final devoicing at hard boundary', () => {
      // друг | там → druk | tɑm (hard boundary: final г devoices)
      const words = [
        {
          cyrillic: 'друг', ipaSurface: '', ipaUnderlying: 'ˈdruɡ',
          rightBoundary: 'hard' as const, boundarySource: 'auto' as const, skipFinalDevoicing: false,
        },
        {
          cyrillic: 'там', ipaSurface: '', ipaUnderlying: 'ˈtɑm',
          rightBoundary: 'hard' as const, boundarySource: 'auto' as const, skipFinalDevoicing: false,
        },
      ];
      GraysonEngine.applyCrossWordAssimilation(words);
      expect(words[0].ipaSurface).toBe('ˈdruk'); // г devoiced to k
      expect(words[1].ipaSurface).toBe('ˈtɑm');
    });

    it('suppresses final devoicing at clitic boundary', () => {
      // Clitic boundary: final voiced consonant stays voiced
      const words = [
        {
          cyrillic: 'об', ipaSurface: '', ipaUnderlying: 'ɑb',
          rightBoundary: 'clitic' as const, boundarySource: 'auto' as const, skipFinalDevoicing: false,
        },
        {
          cyrillic: 'этом', ipaSurface: '', ipaUnderlying: 'ˈɛtʌm',
          rightBoundary: 'hard' as const, boundarySource: 'auto' as const, skipFinalDevoicing: false,
        },
      ];
      GraysonEngine.applyCrossWordAssimilation(words);
      // Clitic boundary: no devoicing of final б
      expect(words[0].ipaSurface).toBe('ɑb');
    });

    it('devoices voiced obstruent before voiceless at soft boundary', () => {
      // друг | там with soft boundary → druk | tɑm
      // (cross-word devoicing: ɡ before t → devoiced to k, skipFinalDevoicing set)
      const words = [
        {
          cyrillic: 'друг', ipaSurface: '', ipaUnderlying: 'ˈdruɡ',
          rightBoundary: 'soft' as const, boundarySource: 'auto' as const, skipFinalDevoicing: false,
        },
        {
          cyrillic: 'там', ipaSurface: '', ipaUnderlying: 'ˈtɑm',
          rightBoundary: 'hard' as const, boundarySource: 'auto' as const, skipFinalDevoicing: false,
        },
      ];
      GraysonEngine.applyCrossWordAssimilation(words);
      expect(words[0].ipaSurface).toBe('ˈdruk');
      expect(words[0].skipFinalDevoicing).toBe(true);
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // DOCUMENTED EDGE CASES
  // ─────────────────────────────────────────────────────────────────

  describe('edge case: счастье dark-a exception (regression 4.1)', () => {

    it('uses dark [ɑ] (not bright [a]) in счастье despite interpalatal context', () => {
      // счастье: ˈʃʲʃʲɑsʲtʲjɪ
      // The а after щ (always-soft) is overridden to ɑ by exceptionWords
      const result = transcribeWord('счастье');
      const aEntry = result.transcriptionLog.find(e => e.char === 'а');
      expect(aEntry?.ipa).toBe('ɑ');
      expect(aEntry?.features.exception).toBe('word-override');
    });

  });

  describe('edge case: false interpalatal after ъ (regression 1.6)', () => {

    it('does not flag interpalatal after hard sign in объявить', () => {
      // объявить: ъ blocks interpalatal feature detection in the log
      const result = transcribeWord('объявить');
      const yaEntry = result.transcriptionLog.find(e => e.char === 'я');
      expect(yaEntry?.features.interpalatal).toBe(false);
    });

  });

  describe('edge case: empty and edge inputs', () => {

    it('handles empty string gracefully', () => {
      // stressIndex=-1: no stress (realistic for empty input)
      const result = GraysonEngine.transcribe('', -1);
      expect(result.ipa).toBe('');
    });

    it('syllabifies single-vowel word', () => {
      const syllables = GraysonEngine.syllabify('а');
      expect(syllables).toEqual(['а']);
    });

    it('handles word with only consonants (vowelless clitic)', () => {
      const result = GraysonEngine.transcribe('в', -1, true, null);
      expect(result.ipa).toBe('v');
      expect(result.source).toBe('isolated-clitic');
    });

  });

  describe('edge case: EngineConfig defaults', () => {

    it('DEFAULT_ENGINE_CONFIG uses stage adjectival', () => {
      expect(DEFAULT_ENGINE_CONFIG.adjectival).toBe('stage');
    });

    it('transcribeWord uses stage config by default', () => {
      // долгий: stage → hard г, и → ɨ
      const result = transcribeWord('долгий');
      expect(result.ipa).toContain('ɨj'); // ɨj not ij
    });

  });

});
