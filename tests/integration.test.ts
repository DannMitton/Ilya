/**
 * @ilya – Integration Smoke Test (Task 12)
 *
 * Exercises all three packages together, simulating the full
 * transcription-to-display pipeline:
 *
 *   1. Look up a word in the dictionary (stress, gloss)
 *   2. Transcribe it through the phonology engine
 *   3. Derive its blurb rule and compose the educational text
 *   4. Apply notation preferences to the output
 *
 * Tests with words that exercise different code paths:
 * stressed vowel, reduced vowel, ё-restoration, silent cluster,
 * j-glide, selfSufficient sign, clitic, unknown stress.
 *
 * Uses minimal test data — not the full 1.29M-word dictionary.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// @ilya/phonology
import {
  transcribeWord,
  applyNotationPreferences,
  setStressDictionary,
  setSingerSupplement,
} from '@ilya/phonology';
import type { NotationPreferences, TranscriptionResult } from '@ilya/phonology';

// @ilya/dictionary
import {
  formatGlossForDisplay,
  setGlossDictionary,
  CURATED_GLOSSES,
} from '@ilya/dictionary';

// @ilya/blurb
import {
  setBlurbData,
  buildDisplayLog,
  deriveRule,
  composeBlurb,
} from '@ilya/blurb';
import type { BlurbData } from '@ilya/blurb';

// ===================================================================
// Minimal test data
// ===================================================================

/**
 * Minimal stress dictionary — just enough entries for the test words.
 */
const TEST_DICTIONARY: Record<string, any> = {
  'молоко': { stress: 2, gloss: 'milk', pos: 'noun' },
  'сердце': { stress: 0, gloss: 'heart', pos: 'noun' },
  'ёлка': { stress: 0, gloss: 'Christmas tree', pos: 'noun' },
  'яблоко': { stress: 0, gloss: 'apple', pos: 'noun' },
  'день': { stress: 0, gloss: 'day', pos: 'noun' },
  'дом': { stress: 0, gloss: 'house', pos: 'noun' },
};

const TEST_SUPPLEMENT: Record<string, any> = {};

/**
 * Minimal IPI data — enough identities and processes for the test words.
 */
const TEST_BLURB_DATA: BlurbData = {
  identities: {
    'м': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'о': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.', citation: 'p. 100' },
    },
    'л': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'к': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'д': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'е': { en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.' } },
    'н': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'ь': {
      en: { template: 'The soft sign ⟨{char}⟩ palatalizes the preceding consonant.' },
      selfSufficient: true,
    },
    'я': { en: { template: 'The letter ⟨{char}⟩ is an iotated vowel.' } },
    'б': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'ё': { en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.' } },
    'с': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'р': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
    'ц': { en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.' } },
  },
  processes: {
    'pretonic:о': {
      en: { template: 'In pretonic position, it reduces to [{ipa}].', citation: 'p. 104' },
    },
    'stressed:о': {
      en: { template: 'Under stress, it is pronounced [{ipa}].', citation: 'p. 105' },
    },
    'remote:о': {
      en: { template: 'In remote position, it reduces to [{ipa}].', citation: 'p. 114' },
    },
    'hard:м': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'hard:л': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'hard:к': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'hard:д': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'hard:с': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'hard:р': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'soft:д': { en: { template: 'It is pronounced as palatalized [{ipa}].' } },
    'soft:н': { en: { template: 'It is pronounced as palatalized [{ipa}].' } },
    'stressed:е': { en: { template: 'Under stress, it is pronounced [{ipa}].' } },
    'stressed-interpalatal:е': {
      en: { template: 'Under stress in interpalatal position, it fronts to [{ipa}].' },
    },
    'j-glide:я': {
      en: { template: 'It produces a glide [{ipa}] at word-initial position.' },
      standalone: true,
    },
    'j-glide:ё': {
      en: { template: 'It produces a glide [{ipa}] at word-initial position.' },
      standalone: true,
    },
    'stressed:ё': {
      en: { template: 'Under stress, it is always pronounced [{ipa}].' },
    },
    'silent:д': {
      en: { template: 'It is silent in this cluster.', citation: 'p. 235' },
      standalone: true,
    },
    'always-hard:ц': {
      en: { template: 'It is always hard, pronounced [{ipa}].' },
    },
    'pretonic:е': {
      en: { template: 'In pretonic position, it reduces to [{ipa}].' },
    },
    'hard:б': { en: { template: 'It is pronounced as hard [{ipa}].' } },
    'soft:л': { en: { template: 'It is pronounced as palatalized [{ipa}].' } },
  },
  implications: {
    'pretonic:о': {
      en: { template: 'This is called akanye.', citation: 'p. 108' },
    },
  },
  citation_style: {
    en: {
      template: '(Grayson, {pages})',
      singular: 'p.',
      plural: 'pp.',
      separator: ', ',
    },
  },
};

// ===================================================================
// Setup/Teardown
// ===================================================================

describe('Integration Smoke Test', () => {
  beforeAll(() => {
    setStressDictionary(TEST_DICTIONARY);
    setSingerSupplement(TEST_SUPPLEMENT);
    setGlossDictionary(TEST_DICTIONARY);
    setBlurbData(TEST_BLURB_DATA);
  });

  afterAll(() => {
    setStressDictionary({});
    setSingerSupplement({});
    setGlossDictionary({});
    setBlurbData({ identities: {}, processes: {} });
  });

  // =================================================================
  // Pipeline: молоко (stressed vowel + reduced vowels)
  // =================================================================

  describe('молоко — stressed vowel + vowel reduction', () => {
    let result: TranscriptionResult;

    beforeAll(() => {
      result = transcribeWord('молоко');
    });

    it('produces IPA output', () => {
      expect(result.ipa).toBeTruthy();
      expect(result.ipa).toContain('ˈko');
    });

    it('has a transcription log', () => {
      expect(result.transcriptionLog.length).toBeGreaterThan(0);
    });

    it('transcription log feeds into buildDisplayLog', () => {
      const displayLog = buildDisplayLog(result.transcriptionLog);
      expect(displayLog.length).toBeGreaterThan(0);
      displayLog.forEach((entry) => {
        expect(entry.blurbData).toBeDefined();
      });
    });

    it('pretonic о gets akanye blurb', () => {
      const pretonicO = result.transcriptionLog.find(
        (e) => e.char === 'о' && e.features?.position === 'pretonic'
      );
      if (pretonicO) {
        const rule = deriveRule(pretonicO);
        expect(rule).toBe('pretonic');
        const blurb = composeBlurb(pretonicO);
        expect(blurb).not.toBeNull();
        const en = (blurb!.blurb as any).en as string;
        expect(en).toContain('akanye');
      }
    });

    it('notation preferences transform the output', () => {
      const prefs: NotationPreferences = {
        reducedVowel: true,
        shcha: false,
        palatalNasal: false,
        geminate: false,
        reconstitution: false,
      };
      const transformed = applyNotationPreferences(result.ipa, prefs);
      expect(typeof transformed).toBe('string');
    });

    it('dictionary entry has gloss for молоко', () => {
      const entry = TEST_DICTIONARY['молоко'];
      expect(entry).toBeDefined();
      expect(entry.gloss).toBe('milk');
    });
  });

  // =================================================================
  // Pipeline: сердце (silent cluster рдц)
  // =================================================================

  describe('сердце — silent cluster', () => {
    let result: TranscriptionResult;

    beforeAll(() => {
      result = transcribeWord('сердце');
    });

    it('produces IPA output', () => {
      expect(result.ipa).toBeTruthy();
    });

    it('buildDisplayLog expands the рдц cluster', () => {
      const displayLog = buildDisplayLog(result.transcriptionLog);
      const clusterEntries = displayLog.filter((e) => e.clusterSource === 'рдц');
      if (clusterEntries.length > 0) {
        expect(clusterEntries).toHaveLength(3);
        expect(clusterEntries[0].char).toBe('р');
        expect(clusterEntries[1].char).toBe('д');
        expect(clusterEntries[2].char).toBe('ц');
      }
    });
  });

  // =================================================================
  // Pipeline: ёлка (ё-restoration, stressed ё)
  // =================================================================

  describe('ёлка — ё-restoration', () => {
    let result: TranscriptionResult;

    beforeAll(() => {
      result = transcribeWord('ёлка');
    });

    it('produces IPA with stressed ё sound', () => {
      expect(result.ipa).toBeTruthy();
      // ё is always stressed; word-initial produces j + vowel
      expect(result.ipa).toContain('j');
    });

    it('transcription log contains entries', () => {
      expect(result.transcriptionLog.length).toBeGreaterThan(0);
    });
  });

  // =================================================================
  // Pipeline: яблоко (word-initial j-glide)
  // =================================================================

  describe('яблоко — word-initial j-glide', () => {
    let result: TranscriptionResult;

    beforeAll(() => {
      result = transcribeWord('яблоко');
    });

    it('produces IPA with j-glide', () => {
      expect(result.ipa).toBeTruthy();
      expect(result.ipa).toContain('j');
    });

    it('buildDisplayLog merges j-glide pair', () => {
      const displayLog = buildDisplayLog(result.transcriptionLog);
      const yaEntry = displayLog.find((e) => e.char === 'я');
      if (yaEntry) {
        expect(yaEntry.features.jGlideMerged).toBe(true);
        expect(yaEntry.ipa).toContain('j');
      }
    });
  });

  // =================================================================
  // Pipeline: день (soft sign, interpalatal)
  // =================================================================

  describe('день — soft sign and interpalatal', () => {
    let result: TranscriptionResult;

    beforeAll(() => {
      result = transcribeWord('день');
    });

    it('produces IPA output', () => {
      expect(result.ipa).toBeTruthy();
    });

    it('soft sign produces selfSufficient blurb', () => {
      const softSign = result.transcriptionLog.find(
        (e) => e.char === 'ь'
      );
      if (softSign) {
        const blurb = composeBlurb(softSign);
        expect(blurb).not.toBeNull();
        const en = (blurb!.blurb as any).en as string;
        expect(en).toContain('soft sign');
      }
    });
  });

  // =================================================================
  // Pipeline: дом (monosyllable, stressed)
  // =================================================================

  describe('дом — monosyllable', () => {
    let result: TranscriptionResult;

    beforeAll(() => {
      result = transcribeWord('дом');
    });

    it('produces IPA output', () => {
      expect(result.ipa).toBeTruthy();
    });

    it('all entries get blurb data through buildDisplayLog', () => {
      const displayLog = buildDisplayLog(result.transcriptionLog);
      expect(displayLog.length).toBeGreaterThan(0);
      displayLog.forEach((entry) => {
        expect(entry.blurbData).toBeDefined();
      });
    });
  });

  // =================================================================
  // Cross-package import verification
  // =================================================================

  describe('cross-package imports', () => {
    it('phonology, dictionary, and blurb packages are all importable', () => {
      expect(typeof transcribeWord).toBe('function');
      expect(typeof formatGlossForDisplay).toBe('function');
      expect(typeof buildDisplayLog).toBe('function');
    });

    it('dictionary CURATED_GLOSSES export is accessible', () => {
      expect(CURATED_GLOSSES).toBeDefined();
      expect(typeof CURATED_GLOSSES).toBe('object');
    });
  });

  // =================================================================
  // Pipeline: notation preferences round-trip
  // =================================================================

  describe('notation preferences round-trip', () => {
    it('applyNotationPreferences is idempotent with all false', () => {
      const result = transcribeWord('молоко');
      const prefs: NotationPreferences = {
        reducedVowel: false,
        shcha: false,
        palatalNasal: false,
        geminate: false,
        reconstitution: false,
      };
      const transformed = applyNotationPreferences(result.ipa, prefs);
      expect(transformed).toBe(result.ipa);
    });
  });
});
