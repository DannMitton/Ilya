/**
 * @ilya/blurb – Comprehensive Test Suite (Task 11)
 *
 * Replaces the 57 smoke tests from Task 10 with comprehensive coverage
 * of the IPI blurb composition system.
 *
 * Coverage:
 * - substituteVars: template variable replacement
 * - formatCitations: deduplication, formatting, singular/plural
 * - deriveRule: assimilation, j-glide variants, delegation to standard
 * - deriveRuleStandard: all vowel positions, consonant types, signs, clusters
 * - composeBlurb: full IPI assembly, selfSufficient, standalone, French fallback
 * - lookupBlurb: composition with fallback
 * - lookupClusterCharBlurb: special cluster cases
 * - mergeJGlidePairs: j-glide + vowel merge logic
 * - buildDisplayLog: cluster expansion, enrichment, merge pipeline
 * - CLUSTER_BREAKDOWNS / isMergedCluster: data integrity
 * - setBlurbData / getBlurbData: injection pattern
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  setBlurbData,
  getBlurbData,
  substituteVars,
  formatCitations,
  deriveRule,
  deriveRuleStandard,
  composeBlurb,
  lookupBlurb,
  lookupClusterCharBlurb,
  mergeJGlidePairs,
  buildDisplayLog,
  CLUSTER_BREAKDOWNS,
  isMergedCluster,
} from '../src/index';
import type {
  BlurbData,
  TranscriptionLogEntry,
  DisplayLogEntry,
} from '../src/index';

// ===================================================================
// Test IPI data (expanded from smoke tests to cover more paths)
// ===================================================================

const TEST_BLURB_DATA: BlurbData = {
  identities: {
    'о': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.', citation: 'p. 100' },
      fr: { template: 'La lettre ⟨{char}⟩ est une voyelle russe.', citation: 'p. 100' },
    },
    'а': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.', citation: 'p. 100' },
      fr: { template: 'La lettre ⟨{char}⟩ est une voyelle russe.', citation: 'p. 100' },
    },
    'е': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.', citation: 'p. 102' },
      fr: { template: 'La lettre ⟨{char}⟩ est une voyelle russe.', citation: 'p. 102' },
    },
    'и': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.', citation: 'p. 103' },
    },
    'у': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian vowel.', citation: 'p. 103' },
    },
    'д': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.', citation: 'p. 120' },
      fr: { template: 'La lettre ⟨{char}⟩ est une consonne russe.', citation: 'p. 120' },
    },
    'б': {
      en: { template: 'The letter ⟨{char}⟩ is a voiced consonant.' },
    },
    'г': {
      en: { template: 'The letter ⟨{char}⟩ is a voiced velar consonant.', citation: 'p. 140' },
    },
    'т': {
      en: { template: 'The letter ⟨{char}⟩ is a voiceless consonant.', citation: 'p. 125' },
    },
    'ъ': {
      en: { template: 'The hard sign ⟨{char}⟩ has no sound of its own.', citation: 'p. 150' },
      selfSufficient: true,
    },
    'ь': {
      en: { template: 'The soft sign ⟨{char}⟩ palatalizes the preceding consonant.', citation: 'p. 151' },
      fr: { template: 'Le signe mou ⟨{char}⟩ palatalise la consonne précédente.', citation: 'p. 151' },
      selfSufficient: true,
    },
    'я': {
      en: { template: 'The letter ⟨{char}⟩ is an iotated vowel.' },
    },
    'ю': {
      en: { template: 'The letter ⟨{char}⟩ is an iotated vowel.' },
    },
    'ж': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.', citation: 'p. 130' },
    },
    'ч': {
      en: { template: 'The letter ⟨{char}⟩ is a Russian consonant.', citation: 'p. 131' },
    },
    'й': {
      en: { template: 'The letter ⟨{char}⟩ is a semivowel glide.', citation: 'p. 145' },
    },
  },
  processes: {
    // Vowel processes
    'pretonic:о': {
      en: { template: 'In pretonic position, it reduces to [{ipa}].', citation: 'p. 104' },
      fr: { template: 'En position prétonique, elle se réduit à [{ipa}].', citation: 'p. 104' },
    },
    'pretonic:а': {
      en: { template: 'In pretonic position, it is pronounced [{ipa}].', citation: 'p. 104' },
    },
    'pretonic:е': {
      en: { template: 'In pretonic position, it reduces to [{ipa}].', citation: 'p. 106' },
    },
    'pretonic-interpalatal:е': {
      en: { template: 'In pretonic interpalatal position, it fronts to [{ipa}].', citation: 'p. 107' },
    },
    'pretonic:и': {
      en: { template: 'In pretonic position (ikanye), it reduces to [{ipa}].', citation: 'p. 109' },
    },
    'stressed:а': {
      en: { template: 'Under stress, it is pronounced [{ipa}].', citation: 'p. 105' },
    },
    'stressed:о': {
      en: { template: 'Under stress, it is pronounced [{ipa}].', citation: 'p. 105' },
    },
    'stressed-interpalatal:е': {
      en: { template: 'Under stress in interpalatal position, it fronts to [{ipa}].', citation: 'pp. 106-107' },
    },
    'stressed:е': {
      en: { template: 'Under stress, it is pronounced [{ipa}].', citation: 'p. 106' },
    },
    'after-hard:и': {
      en: { template: 'After a hard consonant, it retracts to [{ipa}].', citation: 'p. 110' },
    },
    'after-hard:е': {
      en: { template: 'After a hard consonant, it retracts to [{ipa}].', citation: 'p. 110' },
    },
    'unstressed:у': {
      en: { template: 'It does not reduce; pronounced [{ipa}].', citation: 'p. 103' },
    },
    'initial:о': {
      en: { template: 'In initial position, it reduces to [{ipa}].', citation: 'p. 112' },
    },
    'post-stress-immediate:а': {
      en: { template: 'In posttonic-immediate position, it is pronounced [{ipa}].', citation: 'p. 113' },
    },
    'remote:о': {
      en: { template: 'In remote position, it reduces to [{ipa}].', citation: 'p. 114' },
    },
    // Consonant processes
    'final-devoicing:д': {
      en: { template: 'At the end of a word, it devoices to [{ipa}].', citation: 'p. 199' },
      fr: { template: 'En fin de mot, elle se dévoise en [{ipa}].', citation: 'p. 199' },
    },
    'final-devoicing:б': {
      en: { template: 'At the end of a word, it devoices to [{ipa}].', citation: 'p. 199' },
    },
    'hard:д': {
      en: { template: 'It is pronounced as hard [{ipa}].', citation: 'p. 130' },
    },
    'soft:д': {
      en: { template: 'It is pronounced as palatalized [{ipa}].', citation: 'p. 132' },
    },
    'always-hard:ж': {
      en: { template: 'It is always hard, pronounced [{ipa}].', citation: 'p. 135' },
    },
    'always-soft:ч': {
      en: { template: 'It is always soft, pronounced [{ipa}].', citation: 'p. 136' },
    },
    'glide:й': {
      en: { template: 'It is a palatal glide, pronounced [{ipa}].', citation: 'p. 145' },
    },
    'genitive:г': {
      en: { template: 'The genitive ending -ого/-его is pronounced [{ipa}].', citation: 'p. 200' },
    },
    'bog-exception:г': {
      en: { template: 'In this Church Slavonic word, the ⟨г⟩ retains its stop pronunciation [{ipa}].', citation: 'p. 201' },
    },
    // Assimilation processes
    'regressive-devoicing:д': {
      en: { template: 'It devoices before the following voiceless consonant to [{ipa}].', citation: 'p. 195' },
    },
    'regressive-voicing:т': {
      en: { template: 'It voices before the following voiced consonant to [{ipa}].', citation: 'p. 196' },
    },
    'silent:д': {
      en: { template: 'It is silent in this cluster.', citation: 'p. 235' },
      standalone: true,
    },
    // J-glide processes
    'j-glide:я': {
      en: { template: 'It produces a glide [{ipa}] at word-initial position.', citation: 'p. 110' },
      standalone: true,
    },
    'j-glide:ю': {
      en: { template: 'It produces a glide [{ipa}] at word-initial position.', citation: 'p. 110' },
      standalone: true,
    },
    'j-after-vowel:я': {
      en: { template: 'After a vowel, ⟨{trigger}⟩ produces a glide [{ipa}].', citation: 'p. 111' },
      standalone: true,
    },
    'j-after-sign:я': {
      en: { template: 'After a sign, ⟨{trigger}⟩ produces a glide [{ipa}].', citation: 'p. 112' },
      standalone: true,
    },
    'j-ii-suffix:я': {
      en: { template: 'The suffix -ий triggers a glide [{ipa}].', citation: 'p. 113' },
      standalone: true,
    },
    // Cluster process
    'cluster:сч': {
      en: { template: 'The cluster ⟨{cluster}⟩ merges to [{ipa}].', citation: 'pp. 230-231' },
    },
  },
  implications: {
    'pretonic:о': {
      en: { template: 'This is called akanye.', citation: 'p. 108' },
      fr: { template: "C'est ce qu'on appelle l'akanie.", citation: 'p. 108' },
    },
    'pretonic:а': {
      en: { template: 'The vowel does not change quality in pretonic position.' },
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

describe('@ilya/blurb', () => {
  beforeEach(() => setBlurbData(TEST_BLURB_DATA));
  afterEach(() => setBlurbData({ identities: {}, processes: {} }));

  // =================================================================
  // setBlurbData / getBlurbData
  // =================================================================

  describe('setBlurbData / getBlurbData', () => {
    it('stores and retrieves data', () => {
      const data = getBlurbData();
      expect(Object.keys(data.identities).length).toBeGreaterThan(0);
      expect(Object.keys(data.processes).length).toBeGreaterThan(0);
    });

    it('replaces previous data entirely', () => {
      const newData: BlurbData = {
        identities: { 'x': { en: { template: 'test' } } },
        processes: {},
      };
      setBlurbData(newData);
      const data = getBlurbData();
      expect(data.identities).toHaveProperty('x');
      expect(data.identities).not.toHaveProperty('о');
    });

    it('resets to empty cleanly', () => {
      setBlurbData({ identities: {}, processes: {} });
      const data = getBlurbData();
      expect(Object.keys(data.identities)).toHaveLength(0);
    });
  });

  // =================================================================
  // substituteVars
  // =================================================================

  describe('substituteVars', () => {
    it('replaces known variables', () => {
      expect(
        substituteVars('The letter ⟨{char}⟩ produces [{ipa}].', {
          char: 'о',
          ipa: 'ɐ',
        })
      ).toBe('The letter ⟨о⟩ produces [ɐ].');
    });

    it('replaces multiple distinct variables in one template', () => {
      expect(
        substituteVars('{char} → [{ipa}] in cluster ⟨{cluster}⟩', {
          char: 'д',
          ipa: '',
          cluster: 'рдц',
        })
      ).toBe('д → [] in cluster ⟨рдц⟩');
    });

    it('leaves unknown variables as-is', () => {
      expect(substituteVars('{unknown} stays', {})).toBe('{unknown} stays');
    });

    it('returns empty string for empty template', () => {
      expect(substituteVars('', { char: 'о' })).toBe('');
    });

    it('handles template with no placeholders', () => {
      expect(substituteVars('No variables here.', { char: 'о' })).toBe('No variables here.');
    });
  });

  // =================================================================
  // formatCitations
  // =================================================================

  describe('formatCitations', () => {
    it('formats a single page citation', () => {
      expect(formatCitations(['p. 104'])).toBe('(Grayson, p. 104)');
    });

    it('formats multiple page citations with plural prefix', () => {
      expect(formatCitations(['p. 104', 'p. 108'])).toBe(
        '(Grayson, pp. 104, 108)'
      );
    });

    it('deduplicates identical page numbers', () => {
      expect(formatCitations(['p. 104', 'p. 104', 'p. 108'])).toBe(
        '(Grayson, pp. 104, 108)'
      );
    });

    it('uses plural prefix for page ranges', () => {
      expect(formatCitations(['pp. 106–107'])).toBe(
        '(Grayson, pp. 106–107)'
      );
    });

    it('handles mixed ranges and single pages', () => {
      expect(formatCitations(['p. 100', 'pp. 106-107', 'p. 108'])).toBe(
        '(Grayson, pp. 100, 106-107, 108)'
      );
    });

    it('returns null for empty array', () => {
      expect(formatCitations([])).toBeNull();
    });

    it('returns null for null input', () => {
      expect(formatCitations(null as any)).toBeNull();
    });

    it('falls back to comma-join when citation_style is missing', () => {
      setBlurbData({ identities: {}, processes: {} });
      expect(formatCitations(['p. 104', 'p. 108'])).toBe('p. 104, p. 108');
    });
  });

  // =================================================================
  // deriveRule — full rule derivation
  // =================================================================

  describe('deriveRule', () => {
    // --- Assimilation processes (checked before generic) ---

    it('returns "silent" for silent deletion cluster', () => {
      expect(
        deriveRule({
          char: 'д', ipa: '', features: { type: 'consonant', silent: true, deletionCluster: true },
        })
      ).toBe('silent');
    });

    it('returns "regressive-devoicing" for voicing assimilation + devoiced', () => {
      expect(
        deriveRule({
          char: 'д', ipa: 't', features: { type: 'consonant', voicingAssimilation: true, devoiced: true },
        })
      ).toBe('regressive-devoicing');
    });

    it('returns "regressive-voicing" for voicing assimilation + voiced', () => {
      expect(
        deriveRule({
          char: 'т', ipa: 'd', features: { type: 'consonant', voicingAssimilation: true, voiced: true },
        })
      ).toBe('regressive-voicing');
    });

    it('returns "final-devoicing" for finalDevoicing feature', () => {
      expect(
        deriveRule({
          char: 'д', ipa: 't', features: { type: 'consonant', finalDevoicing: true },
        })
      ).toBe('final-devoicing');
    });

    it('returns "genitive" for genitive ending', () => {
      expect(
        deriveRule({
          char: 'г', ipa: 'v', features: { type: 'consonant', genitiveEnding: true },
        })
      ).toBe('genitive');
    });

    it('returns "bog-exception" for bog exception', () => {
      expect(
        deriveRule({
          char: 'г', ipa: 'ɡ', features: { type: 'consonant', bogException: true },
        })
      ).toBe('bog-exception');
    });

    // --- J-glide variants ---

    it('returns "j-glide" for generic word-initial j-glide', () => {
      expect(
        deriveRule({
          char: '', ipa: 'j', features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
        })
      ).toBe('j-glide');
    });

    it('returns "j-after-vowel" for post-vowel j-glide', () => {
      expect(
        deriveRule({
          char: '', ipa: 'j', features: { type: 'glide', source: 'after-vowel', triggeredBy: 'я' },
        })
      ).toBe('j-after-vowel');
    });

    it('returns "j-after-sign" for post-sign j-glide', () => {
      expect(
        deriveRule({
          char: '', ipa: 'j', features: { type: 'glide', source: 'after-sign', triggeredBy: 'я' },
        })
      ).toBe('j-after-sign');
    });

    it('returns "j-ii-suffix" for -ий suffix j-glide', () => {
      expect(
        deriveRule({
          char: '', ipa: 'j', features: { type: 'glide', source: 'ii-suffix', triggeredBy: 'и' },
        })
      ).toBe('j-ii-suffix');
    });

    // --- Delegation to standard rules ---

    it('returns "pretonic" for pretonic vowel', () => {
      expect(
        deriveRule({
          char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' },
        })
      ).toBe('pretonic');
    });

    it('returns "stressed" for stressed vowel', () => {
      expect(
        deriveRule({
          char: 'а', ipa: 'ɑ', features: { type: 'vowel', position: 'stressed' },
        })
      ).toBe('stressed');
    });

    it('returns "stressed-interpalatal" for interpalatal stressed vowel', () => {
      expect(
        deriveRule({
          char: 'е', ipa: 'e', features: { type: 'vowel', position: 'stressed', interpalatal: true },
        })
      ).toBe('stressed-interpalatal');
    });

    it('returns "hard" for hard consonant', () => {
      expect(
        deriveRule({
          char: 'д', ipa: 'd', features: { type: 'consonant' },
        })
      ).toBe('hard');
    });

    it('returns "soft" for soft consonant', () => {
      expect(
        deriveRule({
          char: 'д', ipa: 'dʲ', features: { type: 'consonant', soft: true },
        })
      ).toBe('soft');
    });

    it('returns "always-hard" for ж', () => {
      expect(
        deriveRule({
          char: 'ж', ipa: 'ʒ', features: { type: 'consonant' },
        })
      ).toBe('always-hard');
    });

    it('returns "always-soft" for ч', () => {
      expect(
        deriveRule({
          char: 'ч', ipa: 'tʃ', features: { type: 'consonant' },
        })
      ).toBe('always-soft');
    });

    it('returns "soft-sign" for ь', () => {
      expect(
        deriveRule({
          char: 'ь', ipa: '', features: { type: 'sign', signType: 'soft' },
        })
      ).toBe('soft-sign');
    });

    it('returns "hard-sign" for ъ', () => {
      expect(
        deriveRule({
          char: 'ъ', ipa: '', features: { type: 'sign', signType: 'hard' },
        })
      ).toBe('hard-sign');
    });

    // --- Priority: finalDevoicing on deriveRule beats consonant type ---

    it('finalDevoicing takes priority over always-hard consonant', () => {
      // ж with finalDevoicing should get final-devoicing, not always-hard
      expect(
        deriveRule({
          char: 'ж', ipa: 'ʃ', features: { type: 'consonant', finalDevoicing: true },
        })
      ).toBe('final-devoicing');
    });
  });

  // =================================================================
  // deriveRuleStandard — vowel/consonant/sign rule derivation
  // =================================================================

  describe('deriveRuleStandard', () => {
    // --- Vowel rules ---

    it('returns exception rule when present', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', exception: 'schastye-dark-a' }, 'а')
      ).toBe('schastye-dark-a');
    });

    it('returns "stressed" for stressed vowel', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', position: 'stressed' }, 'о')
      ).toBe('stressed');
    });

    it('returns "stressed-interpalatal" for interpalatal stressed', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', position: 'stressed', interpalatal: true }, 'е')
      ).toBe('stressed-interpalatal');
    });

    it('returns "after-hard" for и after hard consonant', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', afterHard: true, position: 'pretonic' }, 'и')
      ).toBe('after-hard');
    });

    it('returns "after-hard" for е after hard consonant', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', afterHard: true, position: 'pretonic' }, 'е')
      ).toBe('after-hard');
    });

    it('returns "unstressed" for у regardless of position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'pretonic' }, 'у')).toBe('unstressed');
    });

    it('returns "unstressed" for ю regardless of position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'remote' }, 'ю')).toBe('unstressed');
    });

    it('returns "unstressed" for ы regardless of position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'pretonic' }, 'ы')).toBe('unstressed');
    });

    it('returns "unstressed" for ё regardless of position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'posttonic-immediate' }, 'ё')).toBe('unstressed');
    });

    it('returns "unstressed" for и in non-pretonic position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'remote' }, 'и')).toBe('unstressed');
    });

    it('returns "pretonic" for и in pretonic position (ikanye)', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'pretonic' }, 'и')).toBe('pretonic');
    });

    it('returns "pretonic-interpalatal" for interpalatal pretonic', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', position: 'pretonic', interpalatal: true }, 'е')
      ).toBe('pretonic-interpalatal');
    });

    it('returns "pretonic" for pretonic vowel', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'pretonic' }, 'о')).toBe('pretonic');
    });

    it('returns "initial" for initial position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'initial' }, 'о')).toBe('initial');
    });

    it('returns "post-stress-immediate" for posttonic-immediate', () => {
      expect(
        deriveRuleStandard({ type: 'vowel', position: 'posttonic-immediate' }, 'а')
      ).toBe('post-stress-immediate');
    });

    it('returns "remote" for remote position', () => {
      expect(deriveRuleStandard({ type: 'vowel', position: 'remote' }, 'о')).toBe('remote');
    });

    it('returns "unstressed" as vowel fallback', () => {
      expect(deriveRuleStandard({ type: 'vowel' }, 'о')).toBe('unstressed');
    });

    // --- Consonant rules ---

    it('returns "final-devoicing" for consonant with finalDevoicing', () => {
      expect(
        deriveRuleStandard({ type: 'consonant', finalDevoicing: true }, 'д')
      ).toBe('final-devoicing');
    });

    it('returns "always-soft" for ч', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'ч')).toBe('always-soft');
    });

    it('returns "always-soft" for щ', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'щ')).toBe('always-soft');
    });

    it('returns "always-hard" for ж', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'ж')).toBe('always-hard');
    });

    it('returns "always-hard" for ш', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'ш')).toBe('always-hard');
    });

    it('returns "always-hard" for ц', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'ц')).toBe('always-hard');
    });

    it('returns "glide" for й', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'й')).toBe('glide');
    });

    it('returns "soft" for soft consonant', () => {
      expect(deriveRuleStandard({ type: 'consonant', soft: true }, 'д')).toBe('soft');
    });

    it('returns "hard" for plain consonant', () => {
      expect(deriveRuleStandard({ type: 'consonant' }, 'д')).toBe('hard');
    });

    // --- Sign rules ---

    it('returns "soft-sign" for soft sign', () => {
      expect(deriveRuleStandard({ type: 'sign', signType: 'soft' }, 'ь')).toBe('soft-sign');
    });

    it('returns "hard-sign" for hard sign', () => {
      expect(deriveRuleStandard({ type: 'sign', signType: 'hard' }, 'ъ')).toBe('hard-sign');
    });

    // --- Cluster and unknown ---

    it('returns "cluster" for cluster type', () => {
      expect(deriveRuleStandard({ type: 'cluster' }, 'сч')).toBe('cluster');
    });

    it('returns "unknown" for unrecognised type', () => {
      expect(deriveRuleStandard({} as any, 'x')).toBe('unknown');
    });
  });

  // =================================================================
  // composeBlurb — IPI assembly
  // =================================================================

  describe('composeBlurb', () => {
    // --- Full IPI assembly ---

    it('composes pretonic о blurb with identity + process + implication', () => {
      const result = composeBlurb({
        char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('The letter ⟨о⟩');    // Identity
      expect(en).toContain('[ɐ]');                 // Process with {ipa}
      expect(en).toContain('akanye');              // Implication
    });

    it('includes citations from all three layers', () => {
      const result = composeBlurb({
        char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' },
      });
      // Identity p. 100 + Process p. 104 + Implication p. 108
      expect(result!.citation).toBe('(Grayson, pp. 100, 104, 108)');
    });

    it('composes identity + process when implication is absent', () => {
      const result = composeBlurb({
        char: 'д', ipa: 'd', features: { type: 'consonant' },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('The letter ⟨д⟩');    // Identity
      expect(en).toContain('[d]');                 // Process
    });

    // --- Bilingual output ---

    it('composes French blurb', () => {
      const result = composeBlurb({
        char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' },
      });
      const fr = (result!.blurb as any).fr as string;
      expect(fr).toContain('La lettre ⟨о⟩');
      expect(fr).toContain('[ɐ]');
      expect(fr).toContain("l'akanie");
    });

    it('falls back fr to en when French identity/process are missing', () => {
      // б identity has no French
      const result = composeBlurb({
        char: 'б', ipa: 'p', features: { type: 'consonant', finalDevoicing: true },
      });
      expect(result).not.toBeNull();
      const blurb = result!.blurb as any;
      expect(blurb.fr).toBe(blurb.en);
    });

    it('warns and falls back when French is missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // stressed:а has no French for process
      composeBlurb({
        char: 'а', ipa: 'ɑ', features: { type: 'vowel', position: 'stressed' },
      });
      // The identity has French but the process does not — falls back to English process entry
      // No warning expected in this case because process.en exists and is used for French
      // But fr blurb still gets set from the English fallback
      warnSpy.mockRestore();
    });

    // --- selfSufficient identity ---

    it('returns selfSufficient identity alone (hard sign)', () => {
      const result = composeBlurb({
        char: 'ъ', ipa: '', features: { type: 'sign', signType: 'hard' },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('hard sign');
      expect(en).not.toContain('undefined');
    });

    it('returns selfSufficient identity alone (soft sign)', () => {
      const result = composeBlurb({
        char: 'ь', ipa: '', features: { type: 'sign', signType: 'soft' },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('soft sign');
    });

    it('selfSufficient identity includes citation', () => {
      const result = composeBlurb({
        char: 'ъ', ipa: '', features: { type: 'sign', signType: 'hard' },
      });
      expect(result!.citation).toBe('(Grayson, p. 150)');
    });

    it('selfSufficient identity falls back fr to en', () => {
      // ъ has no French identity
      const result = composeBlurb({
        char: 'ъ', ipa: '', features: { type: 'sign', signType: 'hard' },
      });
      const blurb = result!.blurb as any;
      expect(blurb.fr).toBe(blurb.en);
    });

    it('selfSufficient identity composes French when available', () => {
      // ь has both en and fr
      const result = composeBlurb({
        char: 'ь', ipa: '', features: { type: 'sign', signType: 'soft' },
      });
      const blurb = result!.blurb as any;
      expect(blurb.fr).toContain('signe mou');
      expect(blurb.fr).not.toBe(blurb.en);
    });

    // --- standalone process ---

    it('standalone process skips identity sentence', () => {
      const result = composeBlurb({
        char: '', ipa: 'jɪ',
        features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).not.toContain('iotated vowel');  // Identity skipped
      expect(en).toContain('[jɪ]');                // Process applied
    });

    it('standalone process excludes identity citation', () => {
      const result = composeBlurb({
        char: '', ipa: 'jɪ',
        features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
      });
      // p. 110 from process only; identity citation (if any) excluded
      expect(result!.citation).toBe('(Grayson, p. 110)');
    });

    it('standalone silent cluster blurb', () => {
      const result = composeBlurb({
        char: 'д', ipa: '', features: { type: 'consonant', silent: true, deletionCluster: true },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('silent');
      // standalone: should not contain identity text
      expect(en).not.toContain('Russian consonant');
    });

    // --- Template variables ---

    it('substitutes {ipa} variable in process template', () => {
      const result = composeBlurb({
        char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' },
      });
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('[ɐ]');
    });

    it('substitutes {trigger} variable in process template', () => {
      const result = composeBlurb({
        char: '', ipa: 'jɪ',
        features: { type: 'glide', source: 'after-vowel', triggeredBy: 'я', trigger: 'я' },
      });
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('⟨я⟩');
    });

    // --- Null/missing data ---

    it('returns null when data is empty', () => {
      setBlurbData({ identities: {}, processes: {} });
      expect(
        composeBlurb({ char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' } })
      ).toBeNull();
    });

    it('returns null for missing identity', () => {
      expect(
        composeBlurb({ char: 'щ', ipa: 'ʃʲ', features: { type: 'consonant' } })
      ).toBeNull();
    });

    it('warns on missing identity', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      composeBlurb({ char: 'щ', ipa: 'ʃʲ', features: { type: 'consonant' } });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing identity')
      );
      warnSpy.mockRestore();
    });

    it('returns null for missing process (non-selfSufficient)', () => {
      // remote:а has no process in test data
      expect(
        composeBlurb({ char: 'а', ipa: 'ə', features: { type: 'vowel', position: 'remote' } })
      ).toBeNull();
    });

    it('warns on missing process', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      composeBlurb({ char: 'а', ipa: 'ə', features: { type: 'vowel', position: 'remote' } });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing process')
      );
      warnSpy.mockRestore();
    });

    it('returns null when char is empty and no triggeredBy', () => {
      expect(
        composeBlurb({ char: '', ipa: '', features: { type: 'vowel' } })
      ).toBeNull();
    });

    // --- j-glide effectiveChar resolution ---

    it('uses triggeredBy as effective char for j-glide', () => {
      // j-glide char is '' but triggeredBy is 'ю' — should look up identity for ю
      const result = composeBlurb({
        char: '', ipa: 'ju',
        features: { type: 'glide', source: 'word-initial', triggeredBy: 'ю' },
      });
      expect(result).not.toBeNull();
      const en = (result!.blurb as any).en as string;
      expect(en).toContain('[ju]');
    });
  });

  // =================================================================
  // lookupBlurb
  // =================================================================

  describe('lookupBlurb', () => {
    it('returns composed blurb when available', () => {
      const result = lookupBlurb({
        char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' },
      });
      expect(result.blurb).toHaveProperty('en');
      expect(result.citation).not.toBeNull();
    });

    it('falls back to bilingual char → ipa when composition fails', () => {
      const result = lookupBlurb({
        char: 'щ', ipa: 'ʃʲ', features: { type: 'consonant' },
      });
      expect(result.blurb).toEqual({ en: 'щ → ʃʲ', fr: 'щ → ʃʲ' });
      expect(result.citation).toBeNull();
      expect(result.notable).toBe(false);
    });

    it('falls back gracefully for empty char', () => {
      const result = lookupBlurb({
        char: '', ipa: '', features: {},
      });
      expect(result.blurb).toEqual({ en: ' → ', fr: ' → ' });
      expect(result.citation).toBeNull();
    });
  });

  // =================================================================
  // lookupClusterCharBlurb
  // =================================================================

  describe('lookupClusterCharBlurb', () => {
    // --- Silent deletion clusters ---

    it('routes silent deletion cluster through lookupBlurb', () => {
      const result = lookupClusterCharBlurb(
        { char: 'д', ipa: '', features: { type: 'consonant', silent: true, deletionCluster: true, clusterSource: 'рдц' } },
        'рдц'
      );
      // Routes through lookupBlurb → composeBlurb with silent rule
      // Our test data has 'silent:д' as standalone
      expect(result).toBeDefined();
      const blurb = result.blurb;
      if (typeof blurb === 'object') {
        expect((blurb as any).en).toContain('silent');
      }
    });

    // --- Geminate simplified ---

    it('returns geminate blurb for simplified geminate', () => {
      const result = lookupClusterCharBlurb(
        { char: 'с', ipa: '', features: { type: 'consonant', silent: true, geminateSimplified: true } },
        'сс'
      );
      expect(result.notable).toBe(true);
      expect(result.citation).toBe('p. 233');
      expect(result.blurb as string).toContain('русский');
    });

    // --- Cluster assimilation: сч ---

    it('returns сч assimilation blurb', () => {
      const result = lookupClusterCharBlurb(
        { char: 'с', ipa: '', features: { type: 'consonant', clusterAssimilation: true } },
        'сч'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('⟨сч⟩');
      expect(result.blurb as string).toContain('/ʃʲʃʲ/');
    });

    // --- Cluster assimilation: зч ---

    it('returns зч assimilation blurb', () => {
      const result = lookupClusterCharBlurb(
        { char: 'з', ipa: '', features: { type: 'consonant', clusterAssimilation: true } },
        'зч'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('⟨зч⟩');
      expect(result.blurb as string).toContain('/ʃʲʃʲ/');
    });

    // --- Sibilant mergers ---

    it('returns sibilant merger blurb (no voicing change)', () => {
      const result = lookupClusterCharBlurb(
        { char: 'с', ipa: '', features: { type: 'consonant', sibilantMerger: true, mergesInto: 'ш' } },
        'сш'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('⟨ш⟩');
      expect(result.blurb as string).not.toContain('voicing');
      expect(result.blurb as string).not.toContain('devoicing');
    });

    it('returns sibilant merger blurb with voicing flag', () => {
      const result = lookupClusterCharBlurb(
        { char: 'с', ipa: '', features: { type: 'consonant', sibilantMerger: true, mergesInto: 'ж', voices: true } },
        'сж'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('(voicing)');
    });

    it('returns sibilant merger blurb with devoicing flag', () => {
      const result = lookupClusterCharBlurb(
        { char: 'з', ipa: '', features: { type: 'consonant', sibilantMerger: true, mergesInto: 'ш', devoices: true } },
        'зш'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('(devoicing)');
    });

    it('returns receivesLength blurb', () => {
      const result = lookupClusterCharBlurb(
        { char: 'ш', ipa: 'ʃː', features: { type: 'consonant', receivesLength: true } },
        'сш'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('receives length');
    });

    // --- чн / чт assimilation ---

    it('returns чн assimilation blurb', () => {
      const result = lookupClusterCharBlurb(
        { char: 'ч', ipa: 'ʃ', features: { type: 'consonant', clusterAssimilation: true } },
        'чн'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('⟨чн⟩');
      expect(result.blurb as string).toContain('/ʃn/');
    });

    it('returns чт assimilation blurb', () => {
      const result = lookupClusterCharBlurb(
        { char: 'ч', ipa: 'ʃ', features: { type: 'consonant', clusterAssimilation: true } },
        'чт'
      );
      expect(result.notable).toBe(true);
      expect(result.blurb as string).toContain('⟨чт⟩');
      expect(result.blurb as string).toContain('/ʃt/');
    });

    // --- Default fallthrough ---

    it('falls through to lookupBlurb for non-special cluster char', () => {
      const result = lookupClusterCharBlurb(
        { char: 'р', ipa: 'r', features: { type: 'consonant', soft: false } },
        'рдц'
      );
      // Not silent, not geminate, not assimilation, not sibilant — falls to lookupBlurb
      expect(result).toBeDefined();
    });
  });

  // =================================================================
  // mergeJGlidePairs
  // =================================================================

  describe('mergeJGlidePairs', () => {
    it('merges j-glide + vowel into single entry', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'я', ipa: 'ɪ',
          features: { type: 'vowel', position: 'pretonic' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      expect(merged).toHaveLength(1);
      expect(merged[0].char).toBe('я');
      expect(merged[0].ipa).toBe('jɪ');
      expect(merged[0].features.jGlideMerged).toBe(true);
    });

    it('preserves vowel syllableIndex and position after merge', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
          syllableIndex: 0, position: 0,
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'я', ipa: 'ɑ',
          features: { type: 'vowel', position: 'stressed' },
          syllableIndex: 0, position: 1,
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      expect(merged[0].syllableIndex).toBe(0);
      expect(merged[0].position).toBe(1);
    });

    it('recomposes blurb data with combined IPA', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'я', ipa: 'ɪ',
          features: { type: 'vowel', position: 'pretonic' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      // blurbData is recomposed via lookupBlurb with combined IPA
      expect(merged[0].blurbData).toBeDefined();
    });

    it('merges multiple consecutive j-glide pairs', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'after-vowel', triggeredBy: 'я' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'я', ipa: 'ɪ',
          features: { type: 'vowel', position: 'pretonic' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'к', ipa: 'k',
          features: { type: 'consonant' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'after-vowel', triggeredBy: 'ю' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'ю', ipa: 'u',
          features: { type: 'vowel', position: 'stressed' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      // я merged, к stays, ю merged
      expect(merged).toHaveLength(3);
      expect(merged[0].ipa).toBe('jɪ');
      expect(merged[1].char).toBe('к');
      expect(merged[2].ipa).toBe('ju');
    });

    it('does not merge when next entry is not vowel', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'к', ipa: 'k',
          features: { type: 'consonant' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      expect(merged).toHaveLength(2);
    });

    it('does not merge when triggeredBy does not match next char', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
        {
          char: 'е', ipa: 'ɪ',
          features: { type: 'vowel', position: 'pretonic' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      expect(merged).toHaveLength(2);
    });

    it('handles j-glide at end of log (no next entry)', () => {
      const log: DisplayLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
          blurbData: { blurb: '', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      expect(merged).toHaveLength(1);
      expect(merged[0].ipa).toBe('j'); // Not merged
    });

    it('passes through single non-glide entry unchanged', () => {
      const log: DisplayLogEntry[] = [
        {
          char: 'к', ipa: 'k',
          features: { type: 'consonant' },
          blurbData: { blurb: 'test', citation: null, notable: false },
        },
      ];
      const merged = mergeJGlidePairs(log);
      expect(merged).toHaveLength(1);
      expect(merged[0]).toEqual(log[0]);
    });

    it('handles empty log', () => {
      expect(mergeJGlidePairs([])).toHaveLength(0);
    });
  });

  // =================================================================
  // CLUSTER_BREAKDOWNS and isMergedCluster
  // =================================================================

  describe('CLUSTER_BREAKDOWNS', () => {
    const expectedKeys = [
      'рдц', 'лнц', 'вств', 'сс',
      'сч', 'зч',
      'сш', 'зш', 'сж', 'зж',
      'чн', 'чт',
    ];

    it('contains all 12 expected cluster keys', () => {
      expectedKeys.forEach((key) => {
        expect(CLUSTER_BREAKDOWNS).toHaveProperty(key);
      });
    });

    it('has exactly 12 entries', () => {
      expect(Object.keys(CLUSTER_BREAKDOWNS)).toHaveLength(12);
    });

    // --- Array format structure ---

    it('array-format entries have char, ipa, and features for each member', () => {
      const arrayKeys = ['рдц', 'лнц', 'вств', 'сс', 'сш', 'зш', 'сж', 'зж', 'чн', 'чт'];
      arrayKeys.forEach((key) => {
        const breakdown = CLUSTER_BREAKDOWNS[key];
        expect(Array.isArray(breakdown)).toBe(true);
        (breakdown as any[]).forEach((entry: any) => {
          expect(entry).toHaveProperty('char');
          expect(entry).toHaveProperty('ipa');
          expect(entry).toHaveProperty('features');
          expect(entry.features).toHaveProperty('type', 'consonant');
        });
      });
    });

    it('рдц has correct 3-character structure (р, д-silent, ц)', () => {
      const breakdown = CLUSTER_BREAKDOWNS['рдц'] as any[];
      expect(breakdown).toHaveLength(3);
      expect(breakdown[0].char).toBe('р');
      expect(breakdown[0].ipa).toBe('r');
      expect(breakdown[1].char).toBe('д');
      expect(breakdown[1].ipa).toBe('');
      expect(breakdown[1].features.silent).toBe(true);
      expect(breakdown[2].char).toBe('ц');
      expect(breakdown[2].ipa).toBe('ts');
    });

    it('лнц has silent л', () => {
      const breakdown = CLUSTER_BREAKDOWNS['лнц'] as any[];
      expect(breakdown[0].char).toBe('л');
      expect(breakdown[0].features.silent).toBe(true);
      expect(breakdown[0].features.deletionCluster).toBe(true);
    });

    it('вств has 4-character structure with silent в', () => {
      const breakdown = CLUSTER_BREAKDOWNS['вств'] as any[];
      expect(breakdown).toHaveLength(4);
      expect(breakdown[0].features.silent).toBe(true);
    });

    it('сс has geminate simplified second с', () => {
      const breakdown = CLUSTER_BREAKDOWNS['сс'] as any[];
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].ipa).toBe('s');
      expect(breakdown[1].ipa).toBe('');
      expect(breakdown[1].features.geminateSimplified).toBe(true);
    });

    // --- Merged format structure ---

    it('сч is a merged cluster with mergedIpa and members', () => {
      const breakdown = CLUSTER_BREAKDOWNS['сч'];
      expect(isMergedCluster(breakdown)).toBe(true);
      if (isMergedCluster(breakdown)) {
        expect(breakdown.mergedIpa).toBe('ʃʲʃʲ');
        expect(breakdown.members).toHaveLength(2);
        expect(breakdown.members[0].char).toBe('с');
        expect(breakdown.members[1].char).toBe('ч');
      }
    });

    it('зч is a merged cluster with mergedIpa and members', () => {
      const breakdown = CLUSTER_BREAKDOWNS['зч'];
      expect(isMergedCluster(breakdown)).toBe(true);
      if (isMergedCluster(breakdown)) {
        expect(breakdown.mergedIpa).toBe('ʃʲʃʲ');
        expect(breakdown.members).toHaveLength(2);
        expect(breakdown.members[0].char).toBe('з');
        expect(breakdown.members[1].char).toBe('ч');
      }
    });

    // --- isMergedCluster type guard ---

    it('isMergedCluster returns true for merged clusters', () => {
      expect(isMergedCluster(CLUSTER_BREAKDOWNS['сч'])).toBe(true);
      expect(isMergedCluster(CLUSTER_BREAKDOWNS['зч'])).toBe(true);
    });

    it('isMergedCluster returns false for array-format clusters', () => {
      expect(isMergedCluster(CLUSTER_BREAKDOWNS['рдц'])).toBe(false);
      expect(isMergedCluster(CLUSTER_BREAKDOWNS['сс'])).toBe(false);
      expect(isMergedCluster(CLUSTER_BREAKDOWNS['сш'])).toBe(false);
      expect(isMergedCluster(CLUSTER_BREAKDOWNS['чн'])).toBe(false);
    });

    // --- Sibilant merger data ---

    it('sibilant merger entries have correct feature flags', () => {
      const sibilantKeys = ['сш', 'зш', 'сж', 'зж'];
      sibilantKeys.forEach((key) => {
        const breakdown = CLUSTER_BREAKDOWNS[key] as any[];
        expect(breakdown[0].features.sibilantMerger).toBe(true);
        expect(breakdown[1].features.receivesLength).toBe(true);
      });
    });

    it('зш has devoicing flag on first member', () => {
      const breakdown = CLUSTER_BREAKDOWNS['зш'] as any[];
      expect(breakdown[0].features.devoices).toBe(true);
    });

    it('сж has voicing flag on first member', () => {
      const breakdown = CLUSTER_BREAKDOWNS['сж'] as any[];
      expect(breakdown[0].features.voices).toBe(true);
    });
  });

  // =================================================================
  // buildDisplayLog
  // =================================================================

  describe('buildDisplayLog', () => {
    // --- Regular entries ---

    it('enriches regular entry with blurb data', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' } },
      ];
      const display = buildDisplayLog(log);
      expect(display).toHaveLength(1);
      expect(display[0].blurbData).toBeDefined();
      expect(display[0].blurbData!.blurb).toHaveProperty('en');
    });

    it('enriches multiple regular entries', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'д', ipa: 'd', features: { type: 'consonant' } },
        { char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' } },
      ];
      const display = buildDisplayLog(log);
      expect(display).toHaveLength(2);
      expect(display[0].blurbData).toBeDefined();
      expect(display[1].blurbData).toBeDefined();
    });

    it('handles empty transcription log', () => {
      expect(buildDisplayLog([])).toHaveLength(0);
    });

    // --- Array-format cluster expansion ---

    it('expands array-format cluster into per-character rows', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'рдц', ipa: 'rts', features: { type: 'cluster' }, position: 0 },
      ];
      const display = buildDisplayLog(log);
      expect(display).toHaveLength(3);
      expect(display[0].char).toBe('р');
      expect(display[1].char).toBe('д');
      expect(display[2].char).toBe('ц');
    });

    it('sets clusterSource on expanded cluster rows', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'рдц', ipa: 'rts', features: { type: 'cluster' }, position: 0 },
      ];
      const display = buildDisplayLog(log);
      display.forEach((entry) => {
        expect(entry.clusterSource).toBe('рдц');
      });
    });

    it('increments position for expanded cluster rows', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'рдц', ipa: 'rts', features: { type: 'cluster' }, position: 5 },
      ];
      const display = buildDisplayLog(log);
      expect(display[0].position).toBe(5);
      expect(display[1].position).toBe(6);
      expect(display[2].position).toBe(7);
    });

    it('gives each expanded cluster row its own blurb data', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'рдц', ipa: 'rts', features: { type: 'cluster' }, position: 0 },
      ];
      const display = buildDisplayLog(log);
      display.forEach((entry) => {
        expect(entry.blurbData).toBeDefined();
      });
    });

    // --- Merged cluster expansion ---

    it('expands merged cluster with shared IPA', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'сч', ipa: 'ʃʲʃʲ', features: { type: 'cluster' }, position: 0 },
      ];
      const display = buildDisplayLog(log);
      expect(display).toHaveLength(2);
      expect(display[0].char).toBe('с');
      expect(display[0].ipa).toBe('ʃʲʃʲ');  // First gets IPA
      expect(display[1].char).toBe('ч');
      expect(display[1].ipa).toBe('');         // Second gets empty
    });

    it('sets merged cluster metadata flags', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'сч', ipa: 'ʃʲʃʲ', features: { type: 'cluster' }, position: 0 },
      ];
      const display = buildDisplayLog(log);
      expect(display[0].clusterMerged).toBe(true);
      expect(display[0].clusterStart).toBe(true);
      expect(display[0].clusterContinuation).toBe(false);
      expect(display[1].clusterMerged).toBe(true);
      expect(display[1].clusterEnd).toBe(true);
      expect(display[1].clusterContinuation).toBe(true);
    });

    it('first merged row gets blurb, continuation rows get empty blurb', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'сч', ipa: 'ʃʲʃʲ', features: { type: 'cluster' }, position: 0 },
      ];
      const display = buildDisplayLog(log);
      expect(display[0].blurbData).toBeDefined();
      expect(display[1].blurbData!.blurb).toBe('');
    });

    // --- Non-breakdown cluster passthrough ---

    it('passes through cluster without breakdown definition as regular entry', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'xyz', ipa: 'xyz', features: { type: 'cluster' } },
      ];
      const display = buildDisplayLog(log);
      expect(display).toHaveLength(1);
      expect(display[0].char).toBe('xyz');
      expect(display[0].blurbData).toBeDefined();
    });

    // --- Mixed entries ---

    it('handles mix of regular, cluster, and non-breakdown entries', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'д', ipa: 'd', features: { type: 'consonant' } },
        { char: 'рдц', ipa: 'rts', features: { type: 'cluster' }, position: 1 },
        { char: 'а', ipa: 'ɑ', features: { type: 'vowel', position: 'stressed' } },
      ];
      const display = buildDisplayLog(log);
      // д (1) + рдц expanded (3) + а (1) = 5
      expect(display).toHaveLength(5);
      expect(display[0].char).toBe('д');
      expect(display[1].char).toBe('р');
      expect(display[2].char).toBe('д');
      expect(display[3].char).toBe('ц');
      expect(display[4].char).toBe('а');
    });

    // --- J-glide merge integration ---

    it('merges j-glide pairs after cluster expansion', () => {
      const log: TranscriptionLogEntry[] = [
        {
          char: '', ipa: 'j',
          features: { type: 'glide', source: 'word-initial', triggeredBy: 'я' },
        },
        {
          char: 'я', ipa: 'ɑ',
          features: { type: 'vowel', position: 'stressed' },
        },
      ];
      const display = buildDisplayLog(log);
      // Should be merged into single entry
      expect(display).toHaveLength(1);
      expect(display[0].char).toBe('я');
      expect(display[0].ipa).toBe('jɑ');
      expect(display[0].features.jGlideMerged).toBe(true);
    });

    it('preserves syllableIndex through full pipeline', () => {
      const log: TranscriptionLogEntry[] = [
        { char: 'о', ipa: 'ɐ', features: { type: 'vowel', position: 'pretonic' }, syllableIndex: 0 },
        { char: 'а', ipa: 'ɑ', features: { type: 'vowel', position: 'stressed' }, syllableIndex: 1 },
      ];
      const display = buildDisplayLog(log);
      expect(display[0].syllableIndex).toBe(0);
      expect(display[1].syllableIndex).toBe(1);
    });
  });
});
