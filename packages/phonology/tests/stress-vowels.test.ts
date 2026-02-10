/**
 * Task 7a — Core Engine Tests: Stress and Vowels
 *
 * Tests stress assignment (dictionary, supplement, yo-rule, unknown cascade),
 * vowel reduction (pretonic, posttonic, remote), and interpalatal detection.
 *
 * Sources:
 *   - golden-master.json (196 fixture entries, categories: stressDictionary,
 *     stressMonosyllable, stressYoRule, reductionPretonic, reductionRemote,
 *     reductionPosttonic, interpalatal)
 *   - regression-cases.md (Sections 1.1, 1.8, 2.1, 2.3, 4.1, 4.3, 4.5, 4.7, 4.8)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  GraysonEngine,
  transcribeWord,
  setStressDictionary,
  setSingerSupplement,
} from '../src/index';

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

/** Minimal dictionary entries for controlled stress testing */
const TEST_DICTIONARY: Record<string, any> = {
  '\u043C\u043E\u043B\u043E\u043A\u043E': { stress: 2, gloss: { en: 'milk', fr: 'lait' }, pos: 'noun', lemma: '\u043C\u043E\u043B\u043E\u043A\u043E' },
  '\u0434\u043E\u0440\u043E\u0433\u0430': { stress: 2, gloss: { en: 'dear', fr: 'chere' }, pos: 'adj', lemma: '\u0434\u043E\u0440\u043E\u0433\u043E\u0439' },
  '\u043A\u0440\u0430\u0441\u043E\u0442\u0430': { stress: 2, gloss: { en: 'beauty', fr: 'beaute' }, pos: 'noun', lemma: '\u043A\u0440\u0430\u0441\u043E\u0442\u0430' },
  '\u0442\u0438\u0448\u0438\u043D\u0430': { stress: 2, gloss: { en: 'silence', fr: 'silence' }, pos: 'noun', lemma: '\u0442\u0438\u0448\u0438\u043D\u0430' },
  '\u0447\u0435\u043B\u043E\u0432\u0435\u043A': { stress: 2, gloss: { en: 'person', fr: 'personne' }, pos: 'noun', lemma: '\u0447\u0435\u043B\u043E\u0432\u0435\u043A' },
  '\u043C\u043E\u0441\u043A\u0432\u0430': { stress: 1, gloss: { en: 'Moscow', fr: 'Moscou' }, pos: 'noun', lemma: '\u043C\u043E\u0441\u043A\u0432\u0430' },
  '\u043A\u0430\u043A\u043E\u0439': { stress: 1, gloss: { en: 'what/which', fr: 'quel' }, pos: 'pron', lemma: '\u043A\u0430\u043A\u043E\u0439' },
  '\u0434\u0430\u0432\u043D\u043E': { stress: 1, gloss: { en: 'long ago', fr: 'depuis longtemps' }, pos: 'adv', lemma: '\u0434\u0430\u0432\u043D\u043E' },
  '\u043E\u043A\u043D\u043E': { stress: 1, gloss: { en: 'window', fr: 'fenetre' }, pos: 'noun', lemma: '\u043E\u043A\u043D\u043E' },
  '\u0432\u0435\u0441\u043D\u0430': { stress: 1, gloss: { en: 'spring', fr: 'printemps' }, pos: 'noun', lemma: '\u0432\u0435\u0441\u043D\u0430' },
  '\u0442\u0435\u0431\u044F': { stress: 1, gloss: { en: 'you (acc)', fr: 'te/toi' }, pos: 'pron', lemma: '\u0442\u044B' },
  '\u0446\u0432\u0435\u0442\u043E\u043A': { stress: 1, gloss: { en: 'flower', fr: 'fleur' }, pos: 'noun', lemma: '\u0446\u0432\u0435\u0442\u043E\u043A' },
  '\u0431\u0430\u0440\u0430\u0431\u0430\u043D': { stress: 2, gloss: { en: 'drum', fr: 'tambour' }, pos: 'noun', lemma: '\u0431\u0430\u0440\u0430\u0431\u0430\u043D' },
  '\u0437\u043E\u043B\u043E\u0442\u043E': { stress: 0, gloss: { en: 'gold', fr: 'or' }, pos: 'noun', lemma: '\u0437\u043E\u043B\u043E\u0442\u043E' },
  '\u0445\u043E\u0440\u043E\u0448\u043E': { stress: 2, gloss: { en: 'well/good', fr: 'bien' }, pos: 'adv', lemma: '\u0445\u043E\u0440\u043E\u0448\u043E' },
  '\u0433\u043E\u0440\u043E\u0434\u0430': { stress: 0, gloss: { en: 'cities', fr: 'villes' }, pos: 'noun', lemma: '\u0433\u043E\u0440\u043E\u0434' },
  '\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C': { stress: 2, gloss: { en: 'to speak', fr: 'parler' }, pos: 'verb', lemma: '\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C' },
  '\u043C\u043E\u043B\u043E\u0434\u043E\u0439': { stress: 2, gloss: { en: 'young', fr: 'jeune' }, pos: 'adj', lemma: '\u043C\u043E\u043B\u043E\u0434\u043E\u0439' },
  '\u0431\u043B\u044E\u0434\u0430': { stress: 0, gloss: { en: 'dishes', fr: 'plats' }, pos: 'noun', lemma: '\u0431\u043B\u044E\u0434\u043E' },
  '\u0431\u043B\u044E\u0434\u043E': { stress: 0, gloss: { en: 'dish', fr: 'plat' }, pos: 'noun', lemma: '\u0431\u043B\u044E\u0434\u043E' },
  '\u0443\u0442\u0440\u043E': { stress: 0, gloss: { en: 'morning', fr: 'matin' }, pos: 'noun', lemma: '\u0443\u0442\u0440\u043E' },
  '\u043C\u0430\u0441\u043B\u043E': { stress: 0, gloss: { en: 'oil/butter', fr: 'huile/beurre' }, pos: 'noun', lemma: '\u043C\u0430\u0441\u043B\u043E' },
  '\u0434\u0435\u043B\u043E': { stress: 0, gloss: { en: 'matter', fr: 'affaire' }, pos: 'noun', lemma: '\u0434\u0435\u043B\u043E' },
  '\u0441\u0435\u0440\u0434\u0446\u0430': { stress: 0, gloss: { en: 'hearts', fr: 'coeurs' }, pos: 'noun', lemma: '\u0441\u0435\u0440\u0434\u0446\u0435' },
  '\u0441\u043B\u0430\u0432\u0430': { stress: 0, gloss: { en: 'glory', fr: 'gloire' }, pos: 'noun', lemma: '\u0441\u043B\u0430\u0432\u0430' },
  '\u043C\u044F\u0447': { stress: 0, gloss: { en: 'ball', fr: 'ballon' }, pos: 'noun', lemma: '\u043C\u044F\u0447' },
  '\u043F\u044F\u0442\u044C': { stress: 0, gloss: { en: 'five', fr: 'cinq' }, pos: 'num', lemma: '\u043F\u044F\u0442\u044C' },
  '\u0442\u0435\u0431\u0435': { stress: 1, gloss: { en: 'you (dat)', fr: 'te/toi' }, pos: 'pron', lemma: '\u0442\u044B' },
  '\u043B\u0435\u0447\u044C': { stress: 0, gloss: { en: 'to lie down', fr: 'se coucher' }, pos: 'verb', lemma: '\u043B\u0435\u0447\u044C' },
  '\u0441\u0435\u0442\u044C': { stress: 0, gloss: { en: 'net', fr: 'filet' }, pos: 'noun', lemma: '\u0441\u0435\u0442\u044C' },
  '\u043F\u0435\u0447\u044C': { stress: 0, gloss: { en: 'stove', fr: 'poele' }, pos: 'noun', lemma: '\u043F\u0435\u0447\u044C' },
  '\u043D\u0435\u0431\u0435': { stress: 0, gloss: { en: 'sky (prep)', fr: 'ciel' }, pos: 'noun', lemma: '\u043D\u0435\u0431\u043E' },
  '\u0432\u0441\u0435\u0439': { stress: 0, gloss: { en: 'all (fem gen)', fr: 'toute' }, pos: 'pron', lemma: '\u0432\u0435\u0441\u044C' },
  '\u0441\u0432\u0435\u0447\u0438': { stress: 1, gloss: { en: 'candles', fr: 'bougies' }, pos: 'noun', lemma: '\u0441\u0432\u0435\u0447\u0430' },
  '\u0447\u0430\u0441': { stress: 0, gloss: { en: 'hour', fr: 'heure' }, pos: 'noun', lemma: '\u0447\u0430\u0441' },
  '\u0441\u0447\u0430\u0441\u0442\u044C\u0435': { stress: 0, gloss: { en: 'happiness', fr: 'bonheur' }, pos: 'noun', lemma: '\u0441\u0447\u0430\u0441\u0442\u044C\u0435' },
  '\u0451\u043B\u043A\u0430': { stress: 0, gloss: { en: 'fir tree', fr: 'sapin' }, pos: 'noun', lemma: '\u0451\u043B\u043A\u0430' },
};

const TEST_SUPPLEMENT: Record<string, any> = {
  '\u043B\u044E\u0431\u043E\u0432\u044C': { stress: 1, gloss: { en: 'love', fr: 'amour' }, pos: 'noun', lemma: '\u043B\u044E\u0431\u043E\u0432\u044C' },
  '\u0434\u043E\u043C': { stress: 0, gloss: { en: 'house', fr: 'maison' }, pos: 'noun', lemma: '\u0434\u043E\u043C' },
  '\u043C\u0438\u0440': { stress: 0, gloss: { en: 'world/peace', fr: 'monde/paix' }, pos: 'noun', lemma: '\u043C\u0438\u0440' },
  '\u0441\u0432\u0435\u0442': { stress: 0, gloss: { en: 'light', fr: 'lumiere' }, pos: 'noun', lemma: '\u0441\u0432\u0435\u0442' },
  '\u043D\u043E\u0447\u044C': { stress: 0, gloss: { en: 'night', fr: 'nuit' }, pos: 'noun', lemma: '\u043D\u043E\u0447\u044C' },
  '\u0434\u0435\u043D\u044C': { stress: 0, gloss: { en: 'day', fr: 'jour' }, pos: 'noun', lemma: '\u0434\u0435\u043D\u044C' },
  '\u0441\u043E\u043D': { stress: 0, gloss: { en: 'dream', fr: 'reve' }, pos: 'noun', lemma: '\u0441\u043E\u043D' },
  '\u043F\u0443\u0442\u044C': { stress: 0, gloss: { en: 'path', fr: 'chemin' }, pos: 'noun', lemma: '\u043F\u0443\u0442\u044C' },
  '\u0434\u0443\u0445': { stress: 0, gloss: { en: 'spirit', fr: 'esprit' }, pos: 'noun', lemma: '\u0434\u0443\u0445' },
  '\u0440\u0430\u0439': { stress: 0, gloss: { en: 'paradise', fr: 'paradis' }, pos: 'noun', lemma: '\u0440\u0430\u0439' },
  '\u0440\u0435\u0447\u044C': { stress: 0, gloss: { en: 'speech', fr: 'discours' }, pos: 'noun', lemma: '\u0440\u0435\u0447\u044C' },
  '\u0434\u0430\u043B\u0435\u043A\u043E': { stress: 2, gloss: { en: 'far', fr: 'loin' }, pos: 'adv', lemma: '\u0434\u0430\u043B\u0435\u043A\u043E' },
  '\u0445\u043E\u043B\u043E\u0434\u043D\u043E': { stress: 0, gloss: { en: 'cold', fr: 'froid' }, pos: 'adv', lemma: '\u0445\u043E\u043B\u043E\u0434\u043D\u043E' },
  '\u0432\u043E\u0434\u0430': { stress: 0, gloss: { en: 'water', fr: 'eau' }, pos: 'noun', lemma: '\u0432\u043E\u0434\u0430' },
  '\u0437\u0435\u043C\u043B\u044F': { stress: 0, gloss: { en: 'earth', fr: 'terre' }, pos: 'noun', lemma: '\u0437\u0435\u043C\u043B\u044F' },
  '\u043E\u0433\u043E\u043D\u044C': { stress: 0, gloss: { en: 'fire', fr: 'feu' }, pos: 'noun', lemma: '\u043E\u0433\u043E\u043D\u044C' },
};

describe('Task 7a: Stress and Vowels', () => {

  beforeEach(() => {
    setStressDictionary(TEST_DICTIONARY);
    setSingerSupplement(TEST_SUPPLEMENT);
  });

  afterEach(() => {
    setStressDictionary({});
    setSingerSupplement({});
  });

  // ─────────────────────────────────────────────────────────────────
  // STRESS ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────

  describe('stress assignment: dictionary lookup', () => {

    it('assigns dictionary stress to moloko (index 2)', () => {
      const result = transcribeWord('\u043C\u043E\u043B\u043E\u043A\u043E');
      expect(result.ipa).toBe('m\u028C\u026B\u0251\u02C8ko');
    });

    it('assigns dictionary stress to krasota (index 2)', () => {
      const result = transcribeWord('\u043A\u0440\u0430\u0441\u043E\u0442\u0430');
      expect(result.ipa).toBe('kr\u028Cs\u0251\u02C8t\u0251');
    });

    it('assigns dictionary stress to chelovek (index 2)', () => {
      const result = transcribeWord('\u0447\u0435\u043B\u043E\u0432\u0435\u043A');
      expect(result.ipa).toBe('t\u0283\u02B2\u026A\u026B\u0251\u02C8v\u02B2\u025Bk');
    });

  });

  describe('stress assignment: supplement priority', () => {

    it('uses supplement stress for lyubov over dictionary', () => {
      const result = transcribeWord('\u043B\u044E\u0431\u043E\u0432\u044C');
      expect(result.ipa).toBe('l\u02B2u\u02C8bof\u02B2');
    });

  });

  describe('stress assignment: monosyllables', () => {

    it('stresses monosyllable dom on only syllable', () => {
      const result = transcribeWord('\u0434\u043E\u043C');
      expect(result.ipa).toBe('\u02C8dom');
    });

    it('stresses monosyllable den with interpalatal [e]', () => {
      const result = transcribeWord('\u0434\u0435\u043D\u044C');
      expect(result.ipa).toBe('\u02C8d\u02B2e\u0272');
    });

    it('stresses monosyllable chas correctly', () => {
      const result = transcribeWord('\u0447\u0430\u0441');
      expect(result.ipa).toBe('\u02C8t\u0283\u02B2\u0251s');
    });

  });

  describe('stress assignment: yo-rule', () => {

    it('locks stress to yo syllable in yolka', () => {
      const result = transcribeWord('\u0451\u043B\u043A\u0430');
      expect(result.ipa).toBe('\u02C8jo\u026Bk\u0251');
      expect(result.syllables[0].isStressed).toBe(true);
    });

    it('locks stress to yo syllable in zelyonij (index 1)', () => {
      const result = transcribeWord('\u0437\u0435\u043B\u0451\u043D\u044B\u0439');
      expect(result.ipa).toBe('z\u02B2i\u02C8l\u02B2on\u0268j');
    });

    it('locks stress to yo syllable in yeshchyo (index 1)', () => {
      const result = transcribeWord('\u0435\u0449\u0451');
      expect(result.ipa).toBe('ji\u02C8\u0283\u02B2\u0283\u02B2o');
    });

    it('yo overrides any explicit stressIndex passed to transcribe()', () => {
      const result = GraysonEngine.transcribe('\u0451\u043B\u043A\u0430', 1);
      expect(result.syllables[0].isStressed).toBe(true);
      expect(result.ipa).toBe('\u02C8jo\u026Bk\u0251');
    });

  });

  describe('stress assignment: yo-restoration (regression 1.1)', () => {

    it('restores yo when ye-form is searched but yo-form exists in dictionary', () => {
      const result = GraysonEngine.lookupStress('\u0435\u043B\u043A\u0430');
      expect(result).not.toBeNull();
      expect(result!.source).toBe('yo-restored');
      expect(result!.canonicalForm).toBe('\u0451\u043B\u043A\u0430');
    });

    it('transcribes yo-restored word correctly', () => {
      const withYo = transcribeWord('\u0451\u043B\u043A\u0430');
      expect(withYo.ipa).toBe('\u02C8jo\u026Bk\u0251');
    });

  });

  describe('stress assignment: unknown cascade (regression 1.8)', () => {

    it('uses cardinal vowels when word is not in dictionary', () => {
      setStressDictionary({});
      setSingerSupplement({});
      const result = transcribeWord('\u043C\u0443\u0437\u044B\u043A\u0430');
      expect(result.ipa).not.toContain('\u02C8');
      expect(result.ipa).toContain('u');
      expect(result.ipa).toContain('\u0268');
      expect(result.ipa).toContain('\u0251');
    });

    it('uses cardinal vowels for missing-stress words from regression 2.3', () => {
      setStressDictionary({});
      setSingerSupplement({});
      const result = transcribeWord('\u043F\u0440\u0438\u0440\u043E\u0434\u0430');
      expect(result.ipa).not.toContain('\u02C8');
      expect(result.ipa).not.toContain('\u028C');
      expect(result.ipa).toContain('\u0251');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // VOWEL REDUCTION
  // ─────────────────────────────────────────────────────────────────

  describe('vowel reduction: pretonic position', () => {

    it('reduces pretonic o to open-a in moskva', () => {
      const result = transcribeWord('\u043C\u043E\u0441\u043A\u0432\u0430');
      expect(result.ipa).toBe('m\u0251sk\u02C8v\u0251');
    });

    it('reduces pretonic a to open-a in kakoj', () => {
      const result = transcribeWord('\u043A\u0430\u043A\u043E\u0439');
      expect(result.ipa).toBe('k\u0251\u02C8koj');
    });

    it('reduces pretonic o to open-a in okno', () => {
      const result = transcribeWord('\u043E\u043A\u043D\u043E');
      expect(result.ipa).toBe('\u0251k\u02C8no');
    });

    it('reduces pretonic ye to short-i in vesna', () => {
      const result = transcribeWord('\u0432\u0435\u0441\u043D\u0430');
      expect(result.ipa).toBe('v\u02B2\u026As\u02C8n\u0251');
    });

    it('reduces pretonic ye to i when interpalatal in tebya', () => {
      const result = transcribeWord('\u0442\u0435\u0431\u044F');
      expect(result.ipa).toBe('t\u02B2i\u02C8b\u02B2\u0251');
    });

  });

  describe('vowel reduction: remote positions', () => {

    it('reduces remote o to wedge in baraban', () => {
      const result = transcribeWord('\u0431\u0430\u0440\u0430\u0431\u0430\u043D');
      expect(result.ipa).toBe('b\u028Cr\u0251\u02C8b\u0251n');
    });

    it('reduces posttonic o to wedge in zoloto', () => {
      const result = transcribeWord('\u0437\u043E\u043B\u043E\u0442\u043E');
      expect(result.ipa).toBe('\u02C8zo\u026B\u028Ct\u028C');
    });

    it('reduces remote o to wedge in khorosho', () => {
      const result = transcribeWord('\u0445\u043E\u0440\u043E\u0448\u043E');
      expect(result.ipa).toBe('x\u028Cr\u0251\u02C8\u0283o');
    });

    it('reduces remote a and pretonic ye in daleko', () => {
      const result = transcribeWord('\u0434\u0430\u043B\u0435\u043A\u043E');
      expect(result.ipa).toBe('d\u028Cl\u02B2\u026A\u02C8ko');
    });

  });

  describe('vowel reduction: posttonic-immediate (regression 4.5)', () => {

    it('keeps posttonic a as open-a in blyuda (feminine ending)', () => {
      const result = transcribeWord('\u0431\u043B\u044E\u0434\u0430');
      expect(result.ipa).toBe('\u02C8bl\u02B2ud\u0251');
    });

    it('reduces posttonic o to wedge in blyudo (neuter ending)', () => {
      const result = transcribeWord('\u0431\u043B\u044E\u0434\u043E');
      expect(result.ipa).toBe('\u02C8bl\u02B2ud\u028C');
    });

    it('reduces posttonic o to wedge in utro', () => {
      const result = transcribeWord('\u0443\u0442\u0440\u043E');
      expect(result.ipa).toBe('\u02C8utr\u028C');
    });

    it('reduces posttonic o to wedge in maslo', () => {
      const result = transcribeWord('\u043C\u0430\u0441\u043B\u043E');
      expect(result.ipa).toBe('\u02C8m\u0251s\u026B\u028C');
    });

    it('keeps posttonic a as open-a in slava', () => {
      const result = transcribeWord('\u0441\u043B\u0430\u0432\u0430');
      expect(result.ipa).toBe('\u02C8s\u026B\u0251v\u0251');
    });

    it('keeps posttonic a as open-a in serdtsa', () => {
      const result = transcribeWord('\u0441\u0435\u0440\u0434\u0446\u0430');
      expect(result.ipa).toBe('\u02C8s\u02B2\u025Brts\u0251');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // INTERPALATAL DETECTION
  // ─────────────────────────────────────────────────────────────────

  describe('interpalatal: stressed ya to bright [a]', () => {

    it('fronts stressed ya to [a] in myach (soft m + ya + soft ch)', () => {
      const result = transcribeWord('\u043C\u044F\u0447');
      expect(result.ipa).toBe('\u02C8m\u02B2at\u0283\u02B2');
    });

    it('fronts stressed ya to [a] in pyat (soft p + ya + soft t)', () => {
      const result = transcribeWord('\u043F\u044F\u0442\u044C');
      expect(result.ipa).toBe('\u02C8p\u02B2at\u02B2');
    });

  });

  describe('interpalatal: stressed ye to [e]', () => {

    it('fronts stressed ye to [e] in lech (soft l + ye + soft ch)', () => {
      const result = transcribeWord('\u043B\u0435\u0447\u044C');
      expect(result.ipa).toBe('\u02C8l\u02B2et\u0283\u02B2');
    });

    it('fronts stressed ye to [e] in set (soft s + ye + soft t)', () => {
      const result = transcribeWord('\u0441\u0435\u0442\u044C');
      expect(result.ipa).toBe('\u02C8s\u02B2et\u02B2');
    });

    it('fronts stressed ye to [e] in pech (soft p + ye + soft ch)', () => {
      const result = transcribeWord('\u043F\u0435\u0447\u044C');
      expect(result.ipa).toBe('\u02C8p\u02B2et\u0283\u02B2');
    });

    it('fronts stressed ye to [e] in nebe (soft n + ye + soft b)', () => {
      const result = transcribeWord('\u043D\u0435\u0431\u0435');
      expect(result.ipa).toBe('\u02C8\u0272eb\u02B2\u026A');
    });

  });

  describe('interpalatal: NOT interpalatal', () => {

    it('keeps stressed ye as open-e in tebe (word-final, no following soft C)', () => {
      const result = transcribeWord('\u0442\u0435\u0431\u0435');
      expect(result.ipa).toBe('t\u02B2i\u02C8b\u02B2\u025B');
    });

  });

  describe('interpalatal: unstressed fronting', () => {

    it('fronts pretonic ye to [i] in svechi (interpalatal pretonic)', () => {
      const result = transcribeWord('\u0441\u0432\u0435\u0447\u0438');
      expect(result.ipa).toBe('sv\u02B2i\u02C8t\u0283\u02B2i');
    });

    it('fronts pretonic ye to [i] in yeshchyo via j-glide interpalatal', () => {
      const result = transcribeWord('\u0435\u0449\u0451');
      const eVowel = result.transcriptionLog.find(
        e => e.char === '\u0435' && e.features.type === 'vowel'
      );
      expect(eVowel?.ipa).toBe('i');
      expect(eVowel?.features.interpalatal).toBe(true);
    });

  });

  describe('interpalatal: schastye exception (regression 4.1)', () => {

    it('keeps dark [open-a] in schastye despite interpalatal position', () => {
      const result = transcribeWord('\u0441\u0447\u0430\u0441\u0442\u044C\u0435');
      expect(result.ipa).toBe('\u02C8\u0283\u02B2\u0283\u02B2\u0251s\u02B2t\u02B2j\u026A');
      const aVowel = result.transcriptionLog.find(
        e => e.char === '\u0430' && e.features.type === 'vowel'
      );
      expect(aVowel?.ipa).toBe('\u0251');
      expect(aVowel?.features.exception).toBe('word-override');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // SUPPLEMENT STRESS ERRORS (regression 2.1)
  // Known incorrect data. Tests document current (wrong) output.
  // These tests will be updated when supplement data is corrected.
  // ─────────────────────────────────────────────────────────────────

  describe('supplement stress errors (regression 2.1, known incorrect)', () => {

    it('voda currently has wrong stress=0 (should be 1)', () => {
      const result = transcribeWord('\u0432\u043E\u0434\u0430');
      expect(result.ipa).toBe('\u02C8vod\u0251');
    });

    it('zemlya currently has wrong stress=0 (should be 1)', () => {
      const result = transcribeWord('\u0437\u0435\u043C\u043B\u044F');
      expect(result.ipa).toBe('\u02C8z\u02B2\u025Bml\u02B2\u0251');
    });

    it('ogon currently has wrong stress=0 (should be 1)', () => {
      const result = transcribeWord('\u043E\u0433\u043E\u043D\u044C');
      expect(result.ipa).toBe('\u02C8o\u0261\u028C\u0272');
    });

  });

});
