/**
 * @ilya/dictionary – Extraction Smoke Tests (Task 8)
 *
 * Verifies that the dictionary package extracts correctly from the prototype.
 * These are basic sanity checks, not the comprehensive test suite (that's Task 9).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  extractGloss,
  extractCleanGloss,
  isGrammatical,
  extractLemmaFromGloss,
  getLemmaGloss,
  truncateGloss,
  formatGlossForDisplay,
  setGlossDictionary,
  CURATED_GLOSSES,
  addStressMarkToCyrillic,
  addAcuteToSyllable,
} from '../src/index';

// ---------------------------------------------------------------------------
// extractGloss
// ---------------------------------------------------------------------------

describe('extractGloss', () => {
  it('returns empty string for null/undefined (English)', () => {
    expect(extractGloss(null, 'en')).toBe('');
    expect(extractGloss(undefined, 'en')).toBe('');
  });

  it('returns À VÉRIFIER for null/undefined (French)', () => {
    expect(extractGloss(null, 'fr')).toBe('À VÉRIFIER');
    expect(extractGloss(undefined, 'fr')).toBe('À VÉRIFIER');
  });

  it('returns string as-is for English', () => {
    expect(extractGloss('heart', 'en')).toBe('heart');
  });

  it('returns À VÉRIFIER for string-only gloss in French', () => {
    expect(extractGloss('heart', 'fr')).toBe('À VÉRIFIER');
  });

  it('resolves bilingual object to English', () => {
    expect(extractGloss({ en: 'heart', fr: 'cœur' }, 'en')).toBe('heart');
  });

  it('resolves bilingual object to French', () => {
    expect(extractGloss({ en: 'heart', fr: 'cœur' }, 'fr')).toBe('cœur');
  });

  it('falls back to À VÉRIFIER when fr is null', () => {
    expect(extractGloss({ en: 'heart', fr: null }, 'fr')).toBe('À VÉRIFIER');
  });

  it('defaults to English when no language specified', () => {
    expect(extractGloss({ en: 'heart', fr: 'cœur' })).toBe('heart');
  });
});

// ---------------------------------------------------------------------------
// extractCleanGloss
// ---------------------------------------------------------------------------

describe('extractCleanGloss', () => {
  it('takes first sense before semicolons', () => {
    expect(extractCleanGloss('heart; soul; core')).toBe('heart');
  });

  it('extracts from "translated as" pattern', () => {
    expect(extractCleanGloss("Usually translated as 'this'")).toBe('this');
  });

  it('strips verbose parenthetical explanations', () => {
    expect(
      extractCleanGloss('I (first-person singular subject pronoun)')
    ).toBe('I');
  });

  it('returns first sense when no pattern matches', () => {
    expect(extractCleanGloss('beautiful')).toBe('beautiful');
  });

  it('returns empty string for null/undefined', () => {
    expect(extractCleanGloss('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// isGrammatical
// ---------------------------------------------------------------------------

describe('isGrammatical', () => {
  it('detects inflection-of patterns', () => {
    expect(isGrammatical('inflection of ходить')).toBe(true);
  });

  it('detects case forms', () => {
    expect(isGrammatical('genitive singular of дом')).toBe(true);
    expect(isGrammatical('accusative plural of стол')).toBe(true);
  });

  it('detects alternative spelling', () => {
    expect(isGrammatical('alternative spelling of силок')).toBe(true);
  });

  it('detects participles and gerunds', () => {
    expect(isGrammatical('present participle of ходить')).toBe(true);
    expect(isGrammatical('gerund of бежать')).toBe(true);
    expect(isGrammatical('transgressive of лететь')).toBe(true);
  });

  it('rejects clean semantic glosses', () => {
    expect(isGrammatical('heart')).toBe(false);
    expect(isGrammatical('to walk')).toBe(false);
    expect(isGrammatical('beautiful')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// extractLemmaFromGloss
// ---------------------------------------------------------------------------

describe('extractLemmaFromGloss', () => {
  it('extracts Cyrillic lemma from grammatical gloss', () => {
    expect(
      extractLemmaFromGloss(
        'short feminine singular past indicative perfective of уга́снуть (ugásnutʹ)'
      )
    ).toBe('угаснуть');
  });

  it('strips combining accents from extracted lemma', () => {
    expect(extractLemmaFromGloss('inflection of хо́дить')).toBe('ходить');
  });

  it('returns null when no lemma found', () => {
    expect(extractLemmaFromGloss('beautiful')).toBeNull();
    expect(extractLemmaFromGloss(null as any)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getLemmaGloss
// ---------------------------------------------------------------------------

describe('getLemmaGloss', () => {
  const TEST_DICT = {
    ходить: { stress: 1, gloss: 'to walk', pos: 'verb', lemma: '' },
    стол: { stress: 0, gloss: 'table', pos: 'noun', lemma: '' },
    бежать: {
      stress: 1,
      gloss: 'inflection of лететь',
      pos: 'verb',
      lemma: 'лететь',
    },
  };

  beforeEach(() => setGlossDictionary(TEST_DICT));
  afterEach(() => setGlossDictionary({}));

  it('returns semantic gloss for a lemma', () => {
    expect(getLemmaGloss('ходить')).toBe('to walk');
  });

  it('returns null for unknown lemma', () => {
    expect(getLemmaGloss('неизвестный')).toBeNull();
  });

  it('returns null when lemma gloss is also grammatical', () => {
    expect(getLemmaGloss('бежать')).toBeNull();
  });

  it('returns null for null/empty input', () => {
    expect(getLemmaGloss('')).toBeNull();
    expect(getLemmaGloss(null as any)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// truncateGloss
// ---------------------------------------------------------------------------

describe('truncateGloss', () => {
  it('enforces 5-word limit', () => {
    expect(truncateGloss('one two three four five six seven', 5)).toBe(
      'one two three four'
    );
  });

  it('enforces 18-character limit', () => {
    expect(truncateGloss('a very long translation here', 5, 18)).toBe(
      'a very long'
    );
  });

  it('strips parenthetical content', () => {
    expect(truncateGloss('birch (tree or wood)', 5)).toBe('birch');
  });

  it('removes dangling particles', () => {
    expect(truncateGloss('to wander, to', 5, 50)).toBe('to wander');
  });

  it('returns empty string for null/undefined', () => {
    expect(truncateGloss('', 5)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// formatGlossForDisplay
// ---------------------------------------------------------------------------

describe('formatGlossForDisplay', () => {
  const TEST_DICT = {
    ходить: { stress: 1, gloss: 'to walk', pos: 'verb', lemma: '' },
  };

  beforeEach(() => setGlossDictionary(TEST_DICT));
  afterEach(() => setGlossDictionary({}));

  it('returns curated gloss for тебе (regression 1.7)', () => {
    expect(formatGlossForDisplay(null, null, null, 'тебе', 'en')).toBe('you');
  });

  it('returns curated gloss in French', () => {
    expect(formatGlossForDisplay(null, null, null, 'тебе', 'fr')).toBe(
      'à toi'
    );
  });

  it('returns curated gloss for сердце', () => {
    expect(formatGlossForDisplay(null, null, null, 'сердце', 'en')).toBe(
      'heart'
    );
  });

  it('cleans and truncates a semantic gloss', () => {
    expect(formatGlossForDisplay('beautiful', null, null, null, 'en')).toBe(
      'beautiful'
    );
  });

  it('handles bilingual objects through the cleaning pipeline (regression 1.4)', () => {
    const gloss = { en: 'heart; soul; core', fr: 'cœur; âme' };
    expect(formatGlossForDisplay(gloss, null, null, null, 'en')).toBe('heart');
  });

  it('performs lemma fallback for grammatical glosses', () => {
    const gloss = 'genitive singular of ходить';
    expect(formatGlossForDisplay(gloss, null, 'ходить', null, 'en')).toBe(
      'to walk'
    );
  });

  it('returns empty string for missing gloss', () => {
    expect(formatGlossForDisplay(null, null, null, null, 'en')).toBe('');
    expect(formatGlossForDisplay('', null, null, null, 'en')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// CURATED_GLOSSES
// ---------------------------------------------------------------------------

describe('CURATED_GLOSSES', () => {
  it('contains expected number of entries (>150)', () => {
    expect(CURATED_GLOSSES.size).toBeGreaterThan(150);
  });

  it('has bilingual entries for common words', () => {
    const entry = CURATED_GLOSSES.get('сердце');
    expect(entry).toEqual({ en: 'heart', fr: 'cœur' });
  });

  it('has тебе with correct gloss (not "I")', () => {
    const entry = CURATED_GLOSSES.get('тебе');
    expect(entry?.en).toBe('you');
  });
});

// ---------------------------------------------------------------------------
// Cyrillic display helpers
// ---------------------------------------------------------------------------

describe('addStressMarkToCyrillic', () => {
  it('adds acute to stressed vowel', () => {
    const syllables = [
      { isStressed: false },
      { isStressed: true },
      { isStressed: false },
    ];
    // молоко — stress on 2nd syllable (ло)
    const result = addStressMarkToCyrillic('молоко', syllables);
    expect(result).toBe('моло\u0301ко');
  });

  it('does not add acute to ё (already marked)', () => {
    const syllables = [{ isStressed: true }, { isStressed: false }];
    const result = addStressMarkToCyrillic('ёлка', syllables);
    expect(result).toBe('ёлка');
  });

  it('returns word unchanged when no stressed syllable', () => {
    const syllables = [{ isStressed: false }];
    expect(addStressMarkToCyrillic('дом', syllables)).toBe('дом');
  });
});

describe('addAcuteToSyllable', () => {
  it('adds acute to the first vowel', () => {
    expect(addAcuteToSyllable('ло')).toBe('ло\u0301');
  });

  it('does not add acute to ё', () => {
    expect(addAcuteToSyllable('ёл')).toBe('ёл');
  });
});
