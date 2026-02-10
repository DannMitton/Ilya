/**
 * GraysonEngine extraction tests — Task 6
 *
 * Verifies that the extracted engine produces identical output to the prototype.
 * These are smoke tests for the extraction; comprehensive testing is Tasks 7a–7c.
 */
import { describe, it, expect } from 'vitest';
import {
  GraysonEngine,
  transcribeWord,
  applyNotationPreferences,
  setStressDictionary,
  setSingerSupplement,
  DEFAULT_ENGINE_CONFIG,
} from '../src/index';
import type {
  NotationPreferences,
  TranscriptionResult,
  EngineConfig,
} from '../src/index';

describe('GraysonEngine extraction', () => {

  describe('transcribe() with known stress', () => {

    it('transcribes молоко with stress on final syllable', () => {
      // молоко: stress index 2 (мо-ло-ко)
      // мо (remote) → mʌ, ло (pretonic) → ɫɑ, ко (stressed) → ˈko
      const result = GraysonEngine.transcribe('молоко', 2);
      expect(result.ipa).toBe('mʌɫɑˈko');
    });

    it('transcribes сердце with silent cluster', () => {
      // сердце: stress index 0 (серд-це → сер-це with silent д)
      // рдц → rts (silent д), stressed syllable
      const result = GraysonEngine.transcribe('сердце', 0);
      expect(result.ipa).toContain('rts');
    });

    it('transcribes ёлка with ё-locked stress', () => {
      // ёлка: ё always carries stress, regardless of stressIndex passed
      const result = GraysonEngine.transcribe('ёлка', -1);
      // ё is in syllable 0, so stress should be there
      expect(result.syllables[0].isStressed).toBe(true);
      // ё → jo (word-initial iotated + stressed ё → o)
      expect(result.ipa).toContain('jo');
    });

    it('transcribes monosyllable да with stress on only syllable', () => {
      const result = GraysonEngine.transcribe('да', -1);
      // Monosyllable: stress on syllable 0
      expect(result.ipa).toBe('ˈdɑ');
    });

    it('transcribes бог with Church Slavonic exception', () => {
      // бог → /box/ not /bok/ (Grayson p. 242)
      const result = GraysonEngine.transcribe('бог', 0);
      expect(result.ipa).toBe('ˈbox');
    });

  });

  describe('syllabification', () => {

    it('syllabifies молоко as мо-ло-ко', () => {
      const syllables = GraysonEngine.syllabify('молоко');
      expect(syllables).toEqual(['мо', 'ло', 'ко']);
    });

    it('syllabifies сердце correctly', () => {
      const syllables = GraysonEngine.syllabify('сердце');
      expect(syllables.length).toBe(2);
    });

    it('handles protected suffix -ться', () => {
      const syllables = GraysonEngine.syllabify('купаться');
      // The -ться should stay together in the final syllable
      const lastSyl = syllables[syllables.length - 1];
      expect(lastSyl).toContain('ться');
    });

  });

  describe('stress lookup', () => {

    it('returns null when no dictionary is loaded', () => {
      const result = GraysonEngine.lookupStress('молоко');
      expect(result).toBeNull();
    });

    it('finds word in dictionary when loaded', () => {
      // Inject a minimal test dictionary
      setStressDictionary({
        'молоко': { stress: 2, gloss: { en: 'milk', fr: 'lait' }, pos: 'noun', lemma: 'молоко' }
      });

      const result = GraysonEngine.lookupStress('молоко');
      expect(result).not.toBeNull();
      expect(result!.stress).toBe(2);
      expect(result!.source).toBe('dictionary');

      // Clean up
      setStressDictionary({});
    });

    it('finds word in singer supplement with priority over dictionary', () => {
      setStressDictionary({
        'и': { stress: 0, gloss: 'the tenth letter', pos: 'noun', lemma: 'и' }
      });
      setSingerSupplement({
        'и': { stress: 0, gloss: { en: 'and', fr: 'et' }, pos: 'conj', lemma: 'и' }
      });

      const result = GraysonEngine.lookupStress('и');
      expect(result).not.toBeNull();
      expect(result!.source).toBe('supplement');

      // Clean up
      setStressDictionary({});
      setSingerSupplement({});
    });

    it('performs ё-restoration when е-form not found', () => {
      setStressDictionary({
        'ёлка': { stress: 0, gloss: { en: 'fir tree', fr: 'sapin' }, pos: 'noun', lemma: 'ёлка' }
      });

      // Search for елка (without ё) — should find ёлка
      const result = GraysonEngine.lookupStress('елка');
      expect(result).not.toBeNull();
      expect(result!.source).toBe('yo-restored');
      expect(result!.canonicalForm).toBe('ёлка');

      // Clean up
      setStressDictionary({});
    });

  });

  describe('transcribeWord() convenience function', () => {

    it('transcribes with dictionary stress when available', () => {
      setStressDictionary({
        'молоко': { stress: 2, gloss: { en: 'milk', fr: 'lait' }, pos: 'noun', lemma: 'молоко' }
      });

      const result = transcribeWord('молоко');
      expect(result.ipa).toBe('mʌɫɑˈko');

      // Clean up
      setStressDictionary({});
    });

    it('uses unknown-stress cascade when word not in dictionary', () => {
      // No dictionary loaded → stress = -2 → all vowels get cardinal treatment
      setStressDictionary({});
      const result = transcribeWord('молоко');
      // With unknown stress (-2), getSyllablePosition returns 'stressed' for all
      // So all vowels are cardinal (stressed) values
      expect(result.ipa).toContain('o'); // All о should be cardinal [o]
    });

  });

  describe('clitic handling', () => {

    it('identifies proclitics correctly', () => {
      expect(GraysonEngine.proclitics.has('в')).toBe(true);
      expect(GraysonEngine.proclitics.has('на')).toBe(true);
      expect(GraysonEngine.proclitics.has('без')).toBe(true);
    });

    it('identifies enclitics correctly', () => {
      expect(GraysonEngine.enclitics.has('ли')).toBe(true);
      expect(GraysonEngine.enclitics.has('же')).toBe(true);
      expect(GraysonEngine.enclitics.has('бы')).toBe(true);
    });

    it('returns canonical form for isolated vowelless clitic', () => {
      const result = GraysonEngine.transcribe('в', -1, true, null);
      expect(result.ipa).toBe('v');
      expect(result.source).toBe('isolated-clitic');
    });

  });

  describe('palatalization', () => {

    it('palatalizes consonant before front vowel', () => {
      // нет: н before е → ɲ (palatalized н)
      const result = GraysonEngine.transcribe('нет', 0);
      expect(result.ipa).toContain('ɲ');
    });

    it('does not palatalize always-hard consonants', () => {
      // жить: ж is always hard, even before и
      const result = GraysonEngine.transcribe('жить', 0);
      // ж should produce ʒ without ʲ
      const zhEntry = result.transcriptionLog.find(e => e.char === 'ж');
      expect(zhEntry?.ipa).toBe('ʒ');
    });

  });

  describe('notation preferences', () => {

    const defaultPrefs: NotationPreferences = {
      reducedVowel: false,
      geminate: false,
      shcha: false,
      palatalNasal: false,
      reconstitution: false,
    };

    it('returns unchanged IPA with default preferences', () => {
      expect(applyNotationPreferences('mʌɫɑˈko', defaultPrefs)).toBe('mʌɫɑˈko');
    });

    it('replaces ʌ with ə when reducedVowel is true', () => {
      const prefs = { ...defaultPrefs, reducedVowel: true };
      expect(applyNotationPreferences('mʌɫɑˈko', prefs)).toBe('məɫɑˈko');
    });

    it('replaces ʃʲʃʲ with ʃʲː when shcha is true', () => {
      const prefs = { ...defaultPrefs, shcha: true };
      expect(applyNotationPreferences('ʃʲʃʲ', prefs)).toBe('ʃʲː');
    });

    it('replaces ɲ with nʲ when palatalNasal is true', () => {
      const prefs = { ...defaultPrefs, palatalNasal: true };
      expect(applyNotationPreferences('ɲɪt', prefs)).toBe('nʲɪt');
    });

    it('handles geminate notation when enabled and includeGeminates is true', () => {
      const prefs = { ...defaultPrefs, geminate: true };
      // Two identical consonants separated by space (syllable boundary)
      expect(applyNotationPreferences('n n', prefs, true)).toBe('nː');
    });

  });

  describe('voicing and devoicing', () => {

    it('applies final devoicing to standalone word', () => {
      // друг → /druk/ (final г devoices to к)
      const result = GraysonEngine.transcribe('друг', 0);
      expect(result.ipa).toMatch(/k$/);
    });

    it('applies regressive voicing within word', () => {
      // вокзал → voicing of к before з
      const result = GraysonEngine.transcribe('вокзал', 1);
      // к before з should voice to ɡ
      expect(result.ipa).toContain('ɡ');
    });

  });

  describe('special clusters', () => {

    it('finds word-specific cluster in сердце', () => {
      const clusters = GraysonEngine.findSpecialClusters('сердце');
      expect(clusters.length).toBeGreaterThan(0);
      const rdts = clusters.find(c => c.cluster === 'рдц');
      expect(rdts).toBeDefined();
      expect(rdts!.ipa).toBe('rts');
    });

    it('finds reflexive suffix -ться', () => {
      const clusters = GraysonEngine.findSpecialClusters('купаться');
      const refl = clusters.find(c => c.cluster === 'ться');
      expect(refl).toBeDefined();
      expect(refl!.ipa).toBe('tːsʌ');
    });

    it('finds чн → ʃn in конечно', () => {
      const clusters = GraysonEngine.findSpecialClusters('конечно');
      const chn = clusters.find(c => c.cluster === 'чн');
      expect(chn).toBeDefined();
      expect(chn!.ipa).toBe('ʃn');
    });

  });

  describe('genitive ending', () => {

    it('converts г to v in -ого ending', () => {
      // моего: genitive ending -его → г is /v/
      const result = GraysonEngine.transcribe('моего', 2);
      const gEntry = result.transcriptionLog.find(e => e.char === 'г');
      expect(gEntry?.ipa).toBe('v');
    });

    it('does not convert г in много (not genitive)', () => {
      const result = GraysonEngine.transcribe('много', 0);
      // г in много is NOT genitive — should stay as regular consonant
      const gEntry = result.transcriptionLog.find(e => e.char === 'г');
      expect(gEntry?.ipa).not.toBe('v');
    });

  });

  describe('engine config', () => {

    it('defaults to Old Muscovite (stage adjectival)', () => {
      expect(DEFAULT_ENGINE_CONFIG.adjectival).toBe('stage');
    });

    it('treats velar adjectival as hard with stage config', () => {
      // великий: -кий with stage → к stays hard
      const result = GraysonEngine.transcribe('великий', 1, false, null, { adjectival: 'stage' });
      // In Old Muscovite, the к in -кий is hard and и → ɨ
      const kEntry = result.transcriptionLog.find(e => e.char === 'к');
      expect(kEntry?.ipa).toBe('k'); // Hard, not kʲ
    });

  });

});
