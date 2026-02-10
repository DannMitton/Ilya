/**
 * Task 7b — Consonant and Cluster Tests
 *
 * Tests palatalization (direct, regressive, always-hard), devoicing (final,
 * internal voicing assimilation), cluster resolution (silent, sibilant,
 * reflexive, geminates), genitive ending, and clitic handling.
 *
 * Sources:
 *   - golden-master.json (categories: palatalDirect, palatalRegressive,
 *     palatalAlwaysHard, consonantDevoicing, consonantVoicingInternal,
 *     consonantGenitive, consonantBog, clusterSilent, clusterSibilant,
 *     clusterReflexive, cliticsIsolated)
 *   - regression-cases.md (Sections 1.6, 1.9, 1.10, 3.1, 3.2, 4.2, 4.4, 4.6)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  GraysonEngine,
  transcribeWord,
  setStressDictionary,
  setSingerSupplement,
} from '../src/index';

// ─────────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────────

const TEST_DICTIONARY: Record<string, any> = {
  // Palatalization
  '\u043B\u044E\u0431\u043E\u0432\u044C': { stress: 1, gloss: { en: 'love' }, pos: 'noun', lemma: '\u043B\u044E\u0431\u043E\u0432\u044C' },     // любовь
  '\u043C\u0430\u0442\u044C': { stress: 0, gloss: { en: 'mother' }, pos: 'noun', lemma: '\u043C\u0430\u0442\u044C' },             // мать
  '\u0436\u0438\u0437\u043D\u044C': { stress: 0, gloss: { en: 'life' }, pos: 'noun', lemma: '\u0436\u0438\u0437\u043D\u044C' },           // жизнь
  '\u043F\u0435\u0441\u043D\u044C': { stress: 0, gloss: { en: 'song' }, pos: 'noun', lemma: '\u043F\u0435\u0441\u043D\u044C' },           // песнь
  '\u0442\u0435\u043D\u044C': { stress: 0, gloss: { en: 'shadow' }, pos: 'noun', lemma: '\u0442\u0435\u043D\u044C' },             // тень
  '\u043F\u0438\u0442\u044C': { stress: 0, gloss: { en: 'to drink' }, pos: 'verb', lemma: '\u043F\u0438\u0442\u044C' },           // пить
  '\u043D\u0438\u0442\u044C': { stress: 0, gloss: { en: 'thread' }, pos: 'noun', lemma: '\u043D\u0438\u0442\u044C' },             // нить
  '\u0442\u0438\u0445\u0438\u0439': { stress: 0, gloss: { en: 'quiet' }, pos: 'adj', lemma: '\u0442\u0438\u0445\u0438\u0439' },           // тихий
  '\u043F\u0435\u0441\u043D\u0438': { stress: 0, gloss: { en: 'songs' }, pos: 'noun', lemma: '\u043F\u0435\u0441\u043D\u044F' },           // песни
  '\u0433\u043E\u0441\u0442\u0438': { stress: 0, gloss: { en: 'guests' }, pos: 'noun', lemma: '\u0433\u043E\u0441\u0442\u044C' },          // гости
  '\u0448\u0443\u043C': { stress: 0, gloss: { en: 'noise' }, pos: 'noun', lemma: '\u0448\u0443\u043C' },               // шум
  '\u0446\u0432\u0435\u0442': { stress: 0, gloss: { en: 'colour' }, pos: 'noun', lemma: '\u0446\u0432\u0435\u0442' },             // цвет
  '\u0448\u0438\u0440\u043E\u043A\u0438\u0439': { stress: 1, gloss: { en: 'wide' }, pos: 'adj', lemma: '\u0448\u0438\u0440\u043E\u043A\u0438\u0439' },       // широкий
  // Devoicing
  '\u0434\u0440\u0443\u0433': { stress: 0, gloss: { en: 'friend' }, pos: 'noun', lemma: '\u0434\u0440\u0443\u0433' },             // друг
  '\u043A\u0440\u043E\u0432\u044C': { stress: 0, gloss: { en: 'blood' }, pos: 'noun', lemma: '\u043A\u0440\u043E\u0432\u044C' },           // кровь
  '\u0433\u043E\u0440\u043E\u0434': { stress: 0, gloss: { en: 'city' }, pos: 'noun', lemma: '\u0433\u043E\u0440\u043E\u0434' },           // город
  '\u043D\u043E\u0436': { stress: 0, gloss: { en: 'knife' }, pos: 'noun', lemma: '\u043D\u043E\u0436' },               // нож
  '\u043C\u043E\u0440\u043E\u0437': { stress: 1, gloss: { en: 'frost' }, pos: 'noun', lemma: '\u043C\u043E\u0440\u043E\u0437' },           // мороз
  '\u0445\u043B\u0435\u0431': { stress: 0, gloss: { en: 'bread' }, pos: 'noun', lemma: '\u0445\u043B\u0435\u0431' },             // хлеб
  '\u0437\u0443\u0431': { stress: 0, gloss: { en: 'tooth' }, pos: 'noun', lemma: '\u0437\u0443\u0431' },               // зуб
  // Voicing assimilation
  '\u0432\u043E\u043A\u0437\u0430\u043B': { stress: 1, gloss: { en: 'station' }, pos: 'noun', lemma: '\u0432\u043E\u043A\u0437\u0430\u043B' },         // вокзал
  '\u043B\u043E\u0436\u043A\u0430': { stress: 1, gloss: { en: 'spoon' }, pos: 'noun', lemma: '\u043B\u043E\u0436\u043A\u0430' },           // ложка
  // Genitive
  '\u0435\u0433\u043E': { stress: 1, gloss: { en: 'his' }, pos: 'pron', lemma: '\u043E\u043D' },               // его
  '\u043C\u043E\u0435\u0433\u043E': { stress: 2, gloss: { en: 'my (gen)' }, pos: 'pron', lemma: '\u043C\u043E\u0439' },           // моего
  '\u043D\u043E\u0432\u043E\u0433\u043E': { stress: 0, gloss: { en: 'new (gen)' }, pos: 'adj', lemma: '\u043D\u043E\u0432\u044B\u0439' },       // нового
  '\u0434\u0440\u0443\u0433\u043E\u0433\u043E': { stress: 1, gloss: { en: 'other (gen)' }, pos: 'pron', lemma: '\u0434\u0440\u0443\u0433\u043E\u0439' },   // другого
  '\u0441\u0430\u043C\u043E\u0433\u043E': { stress: 2, gloss: { en: 'self (gen)' }, pos: 'pron', lemma: '\u0441\u0430\u043C' },         // самого
  '\u043C\u043D\u043E\u0433\u043E': { stress: 0, gloss: { en: 'much' }, pos: 'adv', lemma: '\u043C\u043D\u043E\u0433\u043E' },           // много
  '\u0441\u0442\u0440\u043E\u0433\u043E': { stress: 0, gloss: { en: 'strictly' }, pos: 'adv', lemma: '\u0441\u0442\u0440\u043E\u0433\u043E' },       // строго
  // Silent clusters
  '\u0441\u0435\u0440\u0434\u0446\u0435': { stress: 0, gloss: { en: 'heart' }, pos: 'noun', lemma: '\u0441\u0435\u0440\u0434\u0446\u0435' },         // сердце
  '\u0441\u043E\u043B\u043D\u0446\u0435': { stress: 0, gloss: { en: 'sun' }, pos: 'noun', lemma: '\u0441\u043E\u043B\u043D\u0446\u0435' },         // солнце
  '\u0447\u0435\u0441\u0442\u043D\u044B\u0439': { stress: 0, gloss: { en: 'honest' }, pos: 'adj', lemma: '\u0447\u0435\u0441\u0442\u043D\u044B\u0439' },     // честный
  '\u0433\u0440\u0443\u0441\u0442\u043D\u044B\u0439': { stress: 0, gloss: { en: 'sad' }, pos: 'adj', lemma: '\u0433\u0440\u0443\u0441\u0442\u043D\u044B\u0439' },   // грустный
  '\u043F\u043E\u0437\u0434\u043D\u043E': { stress: 0, gloss: { en: 'late' }, pos: 'adv', lemma: '\u043F\u043E\u0437\u0434\u043D\u043E' },         // поздно
  '\u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A': { stress: 0, gloss: { en: 'holiday' }, pos: 'noun', lemma: '\u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A' }, // праздник
  '\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439': { stress: 1, gloss: { en: 'famous' }, pos: 'adj', lemma: '\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439' }, // известный
  '\u0447\u0430\u0441\u0442\u043D\u044B\u0439': { stress: 0, gloss: { en: 'private' }, pos: 'adj', lemma: '\u0447\u0430\u0441\u0442\u043D\u044B\u0439' },     // частный
  // Sibilant clusters
  '\u0441\u0447\u0430\u0441\u0442\u044C\u0435': { stress: 0, gloss: { en: 'happiness' }, pos: 'noun', lemma: '\u0441\u0447\u0430\u0441\u0442\u044C\u0435' },   // счастье
  '\u0441\u0447\u0438\u0442\u0430\u0442\u044C': { stress: 1, gloss: { en: 'to count' }, pos: 'verb', lemma: '\u0441\u0447\u0438\u0442\u0430\u0442\u044C' },   // считать
  '\u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C': { stress: 2, gloss: { en: 'to calculate' }, pos: 'verb', lemma: '\u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C' }, // рассчитать
  '\u043A\u043E\u043D\u0435\u0447\u043D\u043E': { stress: 1, gloss: { en: 'of course' }, pos: 'adv', lemma: '\u043A\u043E\u043D\u0435\u0447\u043D\u043E' },   // конечно
  '\u0441\u043A\u0443\u0447\u043D\u043E': { stress: 0, gloss: { en: 'boring' }, pos: 'adv', lemma: '\u0441\u043A\u0443\u0447\u043D\u043E' },         // скучно
  '\u043D\u0438\u0447\u0442\u043E': { stress: 1, gloss: { en: 'nothing' }, pos: 'pron', lemma: '\u043D\u0438\u0447\u0442\u043E' },           // ничто
  // Reflexive suffixes
  '\u043A\u0443\u043F\u0430\u0442\u044C\u0441\u044F': { stress: 1, gloss: { en: 'to bathe' }, pos: 'verb', lemma: '\u043A\u0443\u043F\u0430\u0442\u044C\u0441\u044F' }, // купаться
  '\u0441\u043C\u0435\u044F\u0442\u044C\u0441\u044F': { stress: 1, gloss: { en: 'to laugh' }, pos: 'verb', lemma: '\u0441\u043C\u0435\u044F\u0442\u044C\u0441\u044F' }, // смеяться
  '\u0431\u043E\u0438\u0442\u0441\u044F': { stress: 1, gloss: { en: 'fears' }, pos: 'verb', lemma: '\u0431\u043E\u044F\u0442\u044C\u0441\u044F' },       // боится
  '\u043A\u0430\u0436\u0435\u0442\u0441\u044F': { stress: 0, gloss: { en: 'seems' }, pos: 'verb', lemma: '\u043A\u0430\u0437\u0430\u0442\u044C\u0441\u044F' },   // кажется
  '\u0443\u043B\u044B\u0431\u043D\u0443\u0442\u044C\u0441\u044F': { stress: 2, gloss: { en: 'to smile' }, pos: 'verb', lemma: '\u0443\u043B\u044B\u0431\u043D\u0443\u0442\u044C\u0441\u044F' }, // улыбнуться
  // Geminate
  '\u0440\u0443\u0441\u0441\u043A\u0438\u0439': { stress: 0, gloss: { en: 'Russian' }, pos: 'adj', lemma: '\u0440\u0443\u0441\u0441\u043A\u0438\u0439' },     // русский
};

const TEST_SUPPLEMENT: Record<string, any> = {
  '\u0441\u043C\u0435\u0440\u0442\u044C': { stress: 0, gloss: { en: 'death' }, pos: 'noun', lemma: '\u0441\u043C\u0435\u0440\u0442\u044C' },         // смерть
  '\u0434\u0432\u0435\u0440\u044C': { stress: 0, gloss: { en: 'door' }, pos: 'noun', lemma: '\u0434\u0432\u0435\u0440\u044C' },           // дверь
  '\u0431\u043E\u0433': { stress: 0, gloss: { en: 'God' }, pos: 'noun', lemma: '\u0431\u043E\u0433' },               // бог
  '\u0433\u043B\u0430\u0437': { stress: 0, gloss: { en: 'eye' }, pos: 'noun', lemma: '\u0433\u043B\u0430\u0437' },             // глаз
  '\u0447\u0442\u043E': { stress: 0, gloss: { en: 'what' }, pos: 'pron', lemma: '\u0447\u0442\u043E' },               // что
  // Clitics
  '\u0432': { stress: 0, gloss: { en: 'in' }, pos: 'prep', lemma: '\u0432' },                   // в
  '\u0441': { stress: 0, gloss: { en: 'with' }, pos: 'prep', lemma: '\u0441' },                   // с
  '\u043A': { stress: 0, gloss: { en: 'to' }, pos: 'prep', lemma: '\u043A' },                   // к
  '\u043D\u0430': { stress: 0, gloss: { en: 'on' }, pos: 'prep', lemma: '\u043D\u0430' },                // на
  '\u0437\u0430': { stress: 0, gloss: { en: 'behind' }, pos: 'prep', lemma: '\u0437\u0430' },              // за
  '\u043D\u0435': { stress: 0, gloss: { en: 'not' }, pos: 'part', lemma: '\u043D\u0435' },              // не
  '\u043F\u043E': { stress: 0, gloss: { en: 'along' }, pos: 'prep', lemma: '\u043F\u043E' },              // по
  '\u043E\u0431': { stress: 0, gloss: { en: 'about' }, pos: 'prep', lemma: '\u043E\u0431' },              // об
  '\u043B\u0438': { stress: 0, gloss: { en: 'whether' }, pos: 'part', lemma: '\u043B\u0438' },          // ли
  '\u0436\u0435': { stress: 0, gloss: { en: 'indeed' }, pos: 'part', lemma: '\u0436\u0435' },            // же
  '\u0431\u044B': { stress: 0, gloss: { en: 'would' }, pos: 'part', lemma: '\u0431\u044B' },            // бы
};

describe('Task 7b: Consonants and Clusters', () => {

  beforeEach(() => {
    setStressDictionary(TEST_DICTIONARY);
    setSingerSupplement(TEST_SUPPLEMENT);
  });

  afterEach(() => {
    setStressDictionary({});
    setSingerSupplement({});
  });

  // ─────────────────────────────────────────────────────────────────
  // PALATALIZATION
  // ─────────────────────────────────────────────────────────────────

  describe('palatalization: direct (before front vowel or soft sign)', () => {

    it('palatalizes \u043B before \u044E in lyubov', () => {
      // любовь -> lʲuˈbofʲ: л soft before ю, в soft before ь
      const result = transcribeWord('\u043B\u044E\u0431\u043E\u0432\u044C');
      expect(result.ipa).toBe('l\u02B2u\u02C8bof\u02B2');
    });

    it('palatalizes \u0442 before \u044C in mat', () => {
      // мать -> ˈmɑtʲ: т soft before ь
      const result = transcribeWord('\u043C\u0430\u0442\u044C');
      expect(result.ipa).toBe('\u02C8m\u0251t\u02B2');
    });

    it('palatalizes \u043F and \u0442 before \u0438 in pit', () => {
      // пить -> ˈpʲitʲ: п soft before и, т soft before ь
      const result = transcribeWord('\u043F\u0438\u0442\u044C');
      expect(result.ipa).toBe('\u02C8p\u02B2it\u02B2');
    });

    it('palatalizes \u043D before \u0438 in nit', () => {
      // нить -> ˈɲitʲ: н -> ɲ before и, т soft before ь
      const result = transcribeWord('\u043D\u0438\u0442\u044C');
      expect(result.ipa).toBe('\u02C8\u0272it\u02B2');
    });

  });

  describe('palatalization: regressive (regression 4.6, smert chain)', () => {

    it('applies correct palatalization chain in smert', () => {
      // смерть -> ˈsmʲerʲtʲ
      // с = hard (м cannot regressively palatalize it)
      // м = soft (before front vowel е)
      // р = soft (progressive palatalization in stressed syllable)
      // т = soft (before ь)
      const result = transcribeWord('\u0441\u043C\u0435\u0440\u0442\u044C');
      expect(result.ipa).toBe('\u02C8sm\u02B2er\u02B2t\u02B2');
    });

    it('applies regressive palatalization in dver', () => {
      // дверь -> ˈdvʲerʲ (v soft before e, r soft before ь)
      const result = transcribeWord('\u0434\u0432\u0435\u0440\u044C');
      expect(result.ipa).toBe('\u02C8dv\u02B2er\u02B2');
    });

    it('applies regressive palatalization in pesni', () => {
      // песни -> ˈpʲesʲɲi: с soft before soft н, н -> ɲ before и
      const result = transcribeWord('\u043F\u0435\u0441\u043D\u0438');
      expect(result.ipa).toBe('\u02C8p\u02B2es\u02B2\u0272i');
    });

    it('applies regressive palatalization in gosti', () => {
      // гости -> ˈɡosʲtʲi: с soft before soft т, т soft before и
      const result = transcribeWord('\u0433\u043E\u0441\u0442\u0438');
      expect(result.ipa).toBe('\u02C8\u0261os\u02B2t\u02B2i');
    });

  });

  describe('palatalization: always-hard consonants (\u0436, \u0448, \u0446)', () => {

    it('keeps \u0436 hard before \u0438 in zhizn', () => {
      // жизнь -> ˈʒɨzʲɲ: ж stays hard, и after ж is ɨ
      const result = transcribeWord('\u0436\u0438\u0437\u043D\u044C');
      expect(result.ipa).toBe('\u02C8\u0292\u0268z\u02B2\u0272');
    });

    it('keeps \u0448 hard before \u0443 in shum', () => {
      // шум -> ˈʃum
      const result = transcribeWord('\u0448\u0443\u043C');
      expect(result.ipa).toBe('\u02C8\u0283um');
    });

    it('keeps \u0448 hard and \u0438 becomes \u0268 in shirokij', () => {
      // широкий -> ʃɨˈrokɨj: ш stays hard, и after ш is ɨ
      const result = transcribeWord('\u0448\u0438\u0440\u043E\u043A\u0438\u0439');
      expect(result.ipa).toBe('\u0283\u0268\u02C8rok\u0268j');
    });

    it('keeps \u0446 hard in tsvet', () => {
      // цвет -> ˈtsvʲɛt: ц stays hard, в soft before е
      const result = transcribeWord('\u0446\u0432\u0435\u0442');
      expect(result.ipa).toBe('\u02C8tsv\u02B2\u025Bt');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // DEVOICING
  // ─────────────────────────────────────────────────────────────────

  describe('final devoicing (regression 1.9)', () => {

    it('devoices final \u0433 to k in drug', () => {
      const result = transcribeWord('\u0434\u0440\u0443\u0433');
      expect(result.ipa).toBe('\u02C8druk');
    });

    it('devoices final \u0432 to f\u02B2 in krov', () => {
      const result = transcribeWord('\u043A\u0440\u043E\u0432\u044C');
      expect(result.ipa).toBe('\u02C8krof\u02B2');
    });

    it('devoices final \u0434 to t in gorod', () => {
      const result = transcribeWord('\u0433\u043E\u0440\u043E\u0434');
      expect(result.ipa).toBe('\u02C8\u0261or\u028Ct');
    });

    it('devoices final \u0436 to \u0283 in nozh', () => {
      const result = transcribeWord('\u043D\u043E\u0436');
      expect(result.ipa).toBe('\u02C8no\u0283');
    });

    it('devoices final \u0437 to s in moroz', () => {
      const result = transcribeWord('\u043C\u043E\u0440\u043E\u0437');
      expect(result.ipa).toBe('m\u0251\u02C8ros');
    });

    it('devoices final \u0431 to p in khleb', () => {
      const result = transcribeWord('\u0445\u043B\u0435\u0431');
      expect(result.ipa).toBe('\u02C8xl\u02B2\u025Bp');
    });

    it('devoices final \u0437 to s in glaz', () => {
      const result = transcribeWord('\u0433\u043B\u0430\u0437');
      expect(result.ipa).toBe('\u02C8\u0261\u026B\u0251s');
    });

    it('devoices final \u0431 to p in zub', () => {
      const result = transcribeWord('\u0437\u0443\u0431');
      expect(result.ipa).toBe('\u02C8zup');
    });

  });

  describe('final devoicing: bog Church Slavonic exception (regression 4.2)', () => {

    it('devoices final \u0433 to x (not k) in bog', () => {
      // бог -> ˈbox: Church Slavonic exception, г devoices to x not k
      const result = transcribeWord('\u0431\u043E\u0433');
      expect(result.ipa).toBe('\u02C8box');
    });

  });

  describe('voicing assimilation within words', () => {

    it('voices \u043A to \u0261 before voiced \u0437 in vokzal', () => {
      // вокзал -> vɑɡˈzɑɫ: к voices to ɡ before з
      const result = transcribeWord('\u0432\u043E\u043A\u0437\u0430\u043B');
      expect(result.ipa).toBe('v\u0251\u0261\u02C8z\u0251\u026B');
    });

    it('devoices \u0436 to \u0283 before voiceless \u043A in lozhka', () => {
      // ложка -> ɫɑʃˈkɑ: ж devoices to ʃ before к
      const result = transcribeWord('\u043B\u043E\u0436\u043A\u0430');
      expect(result.ipa).toBe('\u026B\u0251\u0283\u02C8k\u0251');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // SILENT CLUSTERS
  // ─────────────────────────────────────────────────────────────────

  describe('cluster resolution: silent consonants', () => {

    it('drops \u0434 in serdce (\u0440\u0434\u0446 -> rts)', () => {
      // сердце -> ˈsʲɛrtsɨ
      const result = transcribeWord('\u0441\u0435\u0440\u0434\u0446\u0435');
      expect(result.ipa).toBe('\u02C8s\u02B2\u025Brts\u0268');
    });

    it('drops \u043B in solntse (\u043B\u043D\u0446 -> nts)', () => {
      // солнце -> ˈsontsɨ
      const result = transcribeWord('\u0441\u043E\u043B\u043D\u0446\u0435');
      expect(result.ipa).toBe('\u02C8sonts\u0268');
    });

    it('drops \u0442 in chestnyj (\u0441\u0442\u043D -> sn)', () => {
      // честный -> ˈtʃʲɛsnɨj
      const result = transcribeWord('\u0447\u0435\u0441\u0442\u043D\u044B\u0439');
      expect(result.ipa).toBe('\u02C8t\u0283\u02B2\u025Bsn\u0268j');
    });

    it('drops \u0442 in grustnyj (\u0441\u0442\u043D -> sn)', () => {
      // грустный -> ˈɡrusnɨj
      const result = transcribeWord('\u0433\u0440\u0443\u0441\u0442\u043D\u044B\u0439');
      expect(result.ipa).toBe('\u02C8\u0261rusn\u0268j');
    });

    it('drops \u0434 in pozdno (\u0437\u0434\u043D -> zn)', () => {
      // поздно -> ˈpoznʌ
      const result = transcribeWord('\u043F\u043E\u0437\u0434\u043D\u043E');
      expect(result.ipa).toBe('\u02C8pozn\u028C');
    });

    it('drops \u0434 in prazdnik (\u0437\u0434\u043D -> zn)', () => {
      // праздник -> ˈprɑznik
      const result = transcribeWord('\u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A');
      expect(result.ipa).toBe('\u02C8pr\u0251znik');
    });

    it('drops \u0442 in izvestnyj (\u0441\u0442\u043D -> sn)', () => {
      // известный -> izˈvʲɛsnɨj
      const result = transcribeWord('\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439');
      expect(result.ipa).toBe('iz\u02C8v\u02B2\u025Bsn\u0268j');
    });

    it('drops \u0442 in chastnyj (\u0441\u0442\u043D -> sn)', () => {
      // частный -> ˈtʃʲɑsnɨj
      const result = transcribeWord('\u0447\u0430\u0441\u0442\u043D\u044B\u0439');
      expect(result.ipa).toBe('\u02C8t\u0283\u02B2\u0251sn\u0268j');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // SIBILANT CLUSTERS
  // ─────────────────────────────────────────────────────────────────

  describe('cluster resolution: sibilant merges', () => {

    it('merges \u0441\u0447 to \u0283\u02B2\u0283\u02B2 in schitat', () => {
      // считать -> ʃʲʃʲiˈtɑtʲ
      const result = transcribeWord('\u0441\u0447\u0438\u0442\u0430\u0442\u044C');
      expect(result.ipa).toBe('\u0283\u02B2\u0283\u02B2i\u02C8t\u0251t\u02B2');
    });

    it('merges \u0441\u0441\u0447 to \u0441\u0283\u02B2\u0283\u02B2 in rasschitat', () => {
      // рассчитать -> rʌsʃʲʃʲiˈtɑtʲ
      const result = transcribeWord('\u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C');
      expect(result.ipa).toBe('r\u028Cs\u0283\u02B2\u0283\u02B2i\u02C8t\u0251t\u02B2');
    });

    it('merges \u0447\u043D to \u0283n in konechno', () => {
      // конечно -> kɑˈɲɛʃnʌ
      const result = transcribeWord('\u043A\u043E\u043D\u0435\u0447\u043D\u043E');
      expect(result.ipa).toBe('k\u0251\u02C8\u0272\u025B\u0283n\u028C');
    });

    it('merges \u0447\u043D to \u0283n in skuchno', () => {
      // скучно -> ˈskuʃnʌ
      const result = transcribeWord('\u0441\u043A\u0443\u0447\u043D\u043E');
      expect(result.ipa).toBe('\u02C8sku\u0283n\u028C');
    });

    it('merges \u0447\u0442 to \u0283t in chto', () => {
      // что -> ˈʃto
      const result = transcribeWord('\u0447\u0442\u043E');
      expect(result.ipa).toBe('\u02C8\u0283to');
    });

    it('merges \u043D\u0438\u0447\u0442 in nichto', () => {
      // ничто -> ɲiʃtˈo
      const result = transcribeWord('\u043D\u0438\u0447\u0442\u043E');
      expect(result.ipa).toBe('\u0272i\u0283t\u02C8o');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // REFLEXIVE SUFFIXES
  // ─────────────────────────────────────────────────────────────────

  describe('cluster resolution: reflexive suffix -\u0442\u044C\u0441\u044F/-\u0442\u0441\u044F', () => {

    it('reduces -\u0442\u044C\u0441\u044F to t\u02D0s in kupatsya', () => {
      // купаться -> kuˈpɑtːsʌ
      const result = transcribeWord('\u043A\u0443\u043F\u0430\u0442\u044C\u0441\u044F');
      expect(result.ipa).toBe('ku\u02C8p\u0251t\u02D0s\u028C');
    });

    it('reduces -\u0442\u044C\u0441\u044F to t\u02D0s in smeyatsya', () => {
      // смеяться -> smʲiˈjɑtːsʌ
      const result = transcribeWord('\u0441\u043C\u0435\u044F\u0442\u044C\u0441\u044F');
      expect(result.ipa).toBe('sm\u02B2i\u02C8j\u0251t\u02D0s\u028C');
    });

    it('reduces -\u0442\u0441\u044F to t\u02D0s in boitsya', () => {
      // боится -> bɑˈitːsʌ
      const result = transcribeWord('\u0431\u043E\u0438\u0442\u0441\u044F');
      expect(result.ipa).toBe('b\u0251\u02C8it\u02D0s\u028C');
    });

    it('reduces -\u0442\u0441\u044F to t\u02D0s in kazhetsya', () => {
      // кажется -> ˈkɑʒɨtːsʌ
      const result = transcribeWord('\u043A\u0430\u0436\u0435\u0442\u0441\u044F');
      expect(result.ipa).toBe('\u02C8k\u0251\u0292\u0268t\u02D0s\u028C');
    });

    it('reduces -\u0442\u044C\u0441\u044F to t\u02D0s in ulybnutsya', () => {
      // улыбнуться -> uɫɨbˈnutːsʌ
      const result = transcribeWord('\u0443\u043B\u044B\u0431\u043D\u0443\u0442\u044C\u0441\u044F');
      expect(result.ipa).toBe('u\u026B\u0268b\u02C8nut\u02D0s\u028C');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // GEMINATE SIMPLIFICATION
  // ─────────────────────────────────────────────────────────────────

  describe('cluster resolution: geminate simplification', () => {

    it('simplifies \u0441\u0441 to s in russkij', () => {
      // русский -> ˈruskʲij
      const result = transcribeWord('\u0440\u0443\u0441\u0441\u043A\u0438\u0439');
      expect(result.ipa).toBe('\u02C8rusk\u02B2ij');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // GENITIVE ENDING
  // ─────────────────────────────────────────────────────────────────

  describe('genitive ending: \u0433 -> v', () => {

    it('converts \u0433 to v in yevo', () => {
      // его -> jɪˈvo
      const result = transcribeWord('\u0435\u0433\u043E');
      expect(result.ipa).toBe('j\u026A\u02C8vo');
    });

    it('converts \u0433 to v in moyevo', () => {
      // моего -> mʌjɪˈvo
      const result = transcribeWord('\u043C\u043E\u0435\u0433\u043E');
      expect(result.ipa).toBe('m\u028Cj\u026A\u02C8vo');
    });

    it('converts \u0433 to v in novovo', () => {
      // нового -> ˈnovʌvʌ
      const result = transcribeWord('\u043D\u043E\u0432\u043E\u0433\u043E');
      expect(result.ipa).toBe('\u02C8nov\u028Cv\u028C');
    });

    it('converts \u0433 to v in samovo', () => {
      // самого -> sʌmɑˈvo
      const result = transcribeWord('\u0441\u0430\u043C\u043E\u0433\u043E');
      expect(result.ipa).toBe('s\u028Cm\u0251\u02C8vo');
    });

  });

  describe('genitive ending: exceptions (regression 4.4)', () => {

    it('keeps \u0433 as \u0261 in mnogo (adverb, not genitive)', () => {
      // много -> ˈmnoɡʌ: -го is adverbial, not genitive
      const result = transcribeWord('\u043C\u043D\u043E\u0433\u043E');
      expect(result.ipa).toBe('\u02C8mno\u0261\u028C');
    });

    it('keeps \u0433 as \u0261 in strogo (adverb, not genitive)', () => {
      // строго -> ˈstroɡʌ
      const result = transcribeWord('\u0441\u0442\u0440\u043E\u0433\u043E');
      expect(result.ipa).toBe('\u02C8stro\u0261\u028C');
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // CLITICS
  // ─────────────────────────────────────────────────────────────────

  describe('clitics: isolated transcription (regression 3.2)', () => {

    it('transcribes vowelless proclitic \u0432', () => {
      const result = transcribeWord('\u0432');
      expect(result.ipa).toBe('v');
    });

    it('transcribes vowelless proclitic \u0441', () => {
      const result = transcribeWord('\u0441');
      expect(result.ipa).toBe('s');
    });

    it('transcribes vowelless proclitic \u043A', () => {
      const result = transcribeWord('\u043A');
      expect(result.ipa).toBe('k');
    });

    it('transcribes vowel-bearing proclitic \u043D\u0430 with reduction', () => {
      // на -> nʌ (unstressed а reduces to ʌ)
      // Uses GraysonEngine.transcribe directly with isClitic=true;
      // transcribeWord() lacks clitic context and would stress the monosyllable
      const result = GraysonEngine.transcribe('\u043D\u0430', -1, true, null);
      expect(result.ipa).toBe('n\u028C');
    });

    it('transcribes vowel-bearing proclitic \u043D\u0435 with reduction', () => {
      // не -> ɲɪ (unstressed е after soft н reduces to ɪ)
      const result = GraysonEngine.transcribe('\u043D\u0435', -1, true, null);
      expect(result.ipa).toBe('\u0272\u026A');
    });

    it('transcribes vowel-bearing proclitic \u043E\u0431 with reduction', () => {
      // об -> ʌb (unstressed о reduces to ʌ)
      const result = GraysonEngine.transcribe('\u043E\u0431', -1, true, null);
      expect(result.ipa).toBe('\u028Cb');
    });

    it('transcribes enclitic \u043B\u0438', () => {
      // ли -> lʲi
      const result = GraysonEngine.transcribe('\u043B\u0438', -1, true, null);
      expect(result.ipa).toBe('l\u02B2i');
    });

    it('transcribes enclitic \u0436\u0435 with always-hard \u0436', () => {
      // же -> ʒɨ (ж always hard, unstressed е after hard consonant = ɨ)
      const result = GraysonEngine.transcribe('\u0436\u0435', -1, true, null);
      expect(result.ipa).toBe('\u0292\u0268');
    });

    it('transcribes enclitic \u0431\u044B', () => {
      // бы -> bɨ
      const result = GraysonEngine.transcribe('\u0431\u044B', -1, true, null);
      expect(result.ipa).toBe('b\u0268');
    });

  });

});
