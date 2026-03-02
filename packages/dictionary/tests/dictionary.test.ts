/**
 * @ilya/dictionary – Comprehensive Gloss Pipeline Test Suite (Task 9)
 *
 * Pins the accumulated corrections from v6.0.106–111 and covers
 * all known edge cases in the gloss formatting pipeline.
 *
 * Regression cases covered:
 *   1.2  isGrammatical regex catches inflection forms
 *   1.3  Semicolon splitting takes first sense only
 *   1.4  Bilingual {en, fr} objects route through cleaning pipeline
 *   1.7  formatGlossForDisplay returns correct curated gloss for тебе
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

// ===================================================================
// Test dictionary for lemma fallback tests
// ===================================================================

const TEST_DICTIONARY = {
  // Semantic lemmas
  ходить: { stress: 1, gloss: 'to walk', pos: 'verb', lemma: '' },
  стол: { stress: 0, gloss: 'table', pos: 'noun', lemma: '' },
  дом: { stress: 0, gloss: 'house, building, dwelling place', pos: 'noun', lemma: '' },
  петь: { stress: 0, gloss: 'to sing', pos: 'verb', lemma: '' },
  силок: { stress: 1, gloss: 'snare, trap', pos: 'noun', lemma: '' },
  // Grammatical lemma (should NOT be returned by getLemmaGloss)
  бежать: { stress: 1, gloss: 'inflection of лететь', pos: 'verb', lemma: 'лететь' },
  // Homograph (array entry)
  замок: [
    { stress: 0, gloss: 'castle', pos: 'noun', lemma: '' },
    { stress: 1, gloss: 'lock', pos: 'noun', lemma: '' },
  ],
  // Short-key format (compressed dictionary)
  река: { s: 1, g: 'river', p: 'noun', l: '' },
  // Bilingual lemma gloss
  любить: { stress: 1, gloss: { en: 'to love', fr: 'aimer' }, pos: 'verb', lemma: '' },
  // Bilingual grammatical gloss (should NOT be returned)
  спеть: { stress: 0, gloss: { en: 'inflection of петь', fr: 'inflexion de петь' }, pos: 'verb', lemma: 'петь' },
};

// ===================================================================
// extractGloss — Bilingual resolution
// ===================================================================

describe('extractGloss', () => {
  describe('null and undefined handling', () => {
    it('returns empty string for null in English', () => {
      expect(extractGloss(null, 'en')).toBe('');
    });

    it('returns empty string for undefined in English', () => {
      expect(extractGloss(undefined, 'en')).toBe('');
    });

    it('returns empty string for null in French', () => {
      expect(extractGloss(null, 'fr')).toBe('');
    });

    it('returns empty string for undefined in French', () => {
      expect(extractGloss(undefined, 'fr')).toBe('');
    });
  });

  describe('string format (legacy English-only)', () => {
    it('returns string as-is for English', () => {
      expect(extractGloss('heart', 'en')).toBe('heart');
    });

    it('returns empty string for string in French (no French data)', () => {
      expect(extractGloss('heart', 'fr')).toBe('');
    });

    it('handles empty string', () => {
      expect(extractGloss('', 'en')).toBe('');
    });
  });

  describe('bilingual {en, fr} objects', () => {
    it('resolves to English', () => {
      expect(extractGloss({ en: 'heart', fr: 'cœur' }, 'en')).toBe('heart');
    });

    it('resolves to French', () => {
      expect(extractGloss({ en: 'heart', fr: 'cœur' }, 'fr')).toBe('cœur');
    });

    it('falls back to fr when en is empty (English mode)', () => {
      expect(extractGloss({ en: '', fr: 'cœur' }, 'en')).toBe('cœur');
    });

    it('returns empty string when fr is null (French mode)', () => {
      expect(extractGloss({ en: 'heart', fr: null }, 'fr')).toBe('');
    });

    it('returns empty string when fr is empty string (French mode)', () => {
      expect(extractGloss({ en: 'heart', fr: '' }, 'fr')).toBe('');
    });

    it('does not crash when fr is null (English mode)', () => {
      expect(extractGloss({ en: 'heart', fr: null }, 'en')).toBe('heart');
    });
  });

  describe('default language parameter', () => {
    it('defaults to English when no language specified', () => {
      expect(extractGloss({ en: 'heart', fr: 'cœur' })).toBe('heart');
    });

    it('defaults to English for string input', () => {
      expect(extractGloss('heart')).toBe('heart');
    });
  });
});

// ===================================================================
// extractCleanGloss — Cleaning pipeline
// ===================================================================

describe('extractCleanGloss', () => {
  describe('semicolon splitting (regression 1.3)', () => {
    it('takes first sense from multi-sense entry', () => {
      expect(extractCleanGloss('heart; soul; core')).toBe('heart');
    });

    it('trims whitespace around first sense', () => {
      expect(extractCleanGloss(' heart ; soul ')).toBe('heart');
    });

    it('handles single-sense entry (no semicolons)', () => {
      expect(extractCleanGloss('beautiful')).toBe('beautiful');
    });
  });

  describe('"translated as" pattern', () => {
    it('extracts from single-quoted "translated as"', () => {
      expect(extractCleanGloss("Usually translated as 'this'")).toBe('this');
    });

    it('extracts from double-quoted "translated as"', () => {
      expect(extractCleanGloss('Often translated as "that"')).toBe('that');
    });

    it('extracts from unquoted "translated as"', () => {
      expect(extractCleanGloss('translated as hello')).toBe('hello');
    });

    it('is case-insensitive', () => {
      expect(extractCleanGloss("Translated As 'this'")).toBe('this');
    });
  });

  describe('diminutive/augmentative pattern', () => {
    it('extracts meaning after colon in "diminutive of X: Y"', () => {
      expect(extractCleanGloss('diminutive of дом: small house')).toBe('small house');
    });

    it('extracts from "augmentative of X: Y"', () => {
      expect(extractCleanGloss('augmentative of рука: big hand')).toBe('big hand');
    });

    it('extracts from "endearing form of X: Y"', () => {
      expect(extractCleanGloss('endearing form of мама: mommy')).toBe('mommy');
    });
  });

  describe('verbose parenthetical stripping', () => {
    it('strips grammatical parenthetical from simple gloss', () => {
      expect(extractCleanGloss('I (first-person singular subject pronoun)')).toBe('I');
    });

    it('strips "a/the" parenthetical', () => {
      expect(extractCleanGloss('house (a building for living)')).toBe('house');
    });

    it('keeps useful clarifications (no grammatical trigger)', () => {
      // "birch (tree or wood)" should NOT match the stripping pattern
      expect(extractCleanGloss('birch (tree or wood)')).toBe('birch (tree or wood)');
    });

    it('strips masculine/feminine parenthetical', () => {
      expect(extractCleanGloss('friend (masculine singular)')).toBe('friend');
    });
  });

  describe('linguistic jargon + parens extraction', () => {
    it('extracts from "proximal demonstrative (this)"', () => {
      expect(extractCleanGloss('proximal demonstrative (this)')).toBe('this');
    });

    it('extracts from "distal demonstrative (that)"', () => {
      expect(extractCleanGloss('distal demonstrative (that)')).toBe('that');
    });

    it('does not extract if parens contain digits', () => {
      expect(extractCleanGloss('mostly used (3 times)')).toBe('mostly used (3 times)');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(extractCleanGloss('')).toBe('');
    });

    it('returns first sense when no pattern matches', () => {
      expect(extractCleanGloss('beautiful, lovely')).toBe('beautiful, lovely');
    });

    it('applies semicolon split before pattern matching', () => {
      // First sense has a "translated as" pattern
      expect(extractCleanGloss("translated as 'hello'; greeting")).toBe('hello');
    });
  });
});

// ===================================================================
// isGrammatical — Grammatical description detection (regression 1.2)
// ===================================================================

describe('isGrammatical', () => {
  describe('case form patterns', () => {
    it('detects nominative', () => {
      expect(isGrammatical('nominative singular of дом')).toBe(true);
    });

    it('detects genitive', () => {
      expect(isGrammatical('genitive plural of стол')).toBe(true);
    });

    it('detects dative', () => {
      expect(isGrammatical('dative singular of рука')).toBe(true);
    });

    it('detects accusative', () => {
      expect(isGrammatical('accusative plural of книга')).toBe(true);
    });

    it('detects instrumental', () => {
      expect(isGrammatical('instrumental singular of нож')).toBe(true);
    });

    it('detects prepositional', () => {
      expect(isGrammatical('prepositional singular of город')).toBe(true);
    });
  });

  describe('verb form patterns', () => {
    it('detects "short" forms', () => {
      expect(isGrammatical('short feminine singular past indicative perfective of угаснуть')).toBe(true);
    });

    it('detects "inflection of"', () => {
      expect(isGrammatical('inflection of ходить')).toBe(true);
    });

    it('detects "singular past" pattern', () => {
      expect(isGrammatical('third-person singular past of бежать')).toBe(true);
    });

    it('detects "plural present" pattern', () => {
      expect(isGrammatical('first-person plural present of петь')).toBe(true);
    });

    it('detects participle', () => {
      expect(isGrammatical('present active participle of ходить')).toBe(true);
      expect(isGrammatical('past passive participle of написать')).toBe(true);
    });

    it('detects gerund', () => {
      expect(isGrammatical('gerund of бежать')).toBe(true);
    });

    it('detects transgressive', () => {
      expect(isGrammatical('transgressive of лететь')).toBe(true);
    });
  });

  describe('other grammatical patterns', () => {
    it('detects comparative', () => {
      expect(isGrammatical('comparative of большой')).toBe(true);
    });

    it('detects superlative', () => {
      expect(isGrammatical('superlative of красивый')).toBe(true);
    });

    it('detects "alternative spelling of"', () => {
      expect(isGrammatical('alternative spelling of силок')).toBe(true);
    });

    it('detects "alternative form of"', () => {
      expect(isGrammatical('alternative form of ещё')).toBe(true);
    });
  });

  describe('rejection of clean semantic glosses', () => {
    it('rejects simple words', () => {
      expect(isGrammatical('heart')).toBe(false);
      expect(isGrammatical('to walk')).toBe(false);
      expect(isGrammatical('beautiful')).toBe(false);
    });

    it('rejects multi-word translations', () => {
      expect(isGrammatical('to see off')).toBe(false);
      expect(isGrammatical('for the sake of')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isGrammatical('')).toBe(false);
    });
  });
});

// ===================================================================
// extractLemmaFromGloss — Cyrillic lemma extraction
// ===================================================================

describe('extractLemmaFromGloss', () => {
  it('extracts lemma with transliteration in parens', () => {
    expect(
      extractLemmaFromGloss('short feminine singular past indicative perfective of уга́снуть (ugásnutʹ)')
    ).toBe('угаснуть');
  });

  it('extracts lemma without transliteration', () => {
    expect(extractLemmaFromGloss('inflection of ходить')).toBe('ходить');
  });

  it('extracts lemma followed by comma', () => {
    expect(extractLemmaFromGloss('genitive singular of дом, house')).toBe('дом');
  });

  it('strips combining acute from extracted lemma', () => {
    expect(extractLemmaFromGloss('inflection of хо\u0301дить')).toBe('ходить');
  });

  it('lowercases the extracted lemma', () => {
    expect(extractLemmaFromGloss('inflection of Ходить')).toBe('ходить');
  });

  it('handles ё in lemma', () => {
    expect(extractLemmaFromGloss('inflection of ёлка')).toBe('ёлка');
  });

  it('returns null for non-matching input', () => {
    expect(extractLemmaFromGloss('beautiful')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(extractLemmaFromGloss(null as any)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractLemmaFromGloss('')).toBeNull();
  });
});

// ===================================================================
// getLemmaGloss — Dictionary lemma lookup
// ===================================================================

describe('getLemmaGloss', () => {
  beforeEach(() => setGlossDictionary(TEST_DICTIONARY));
  afterEach(() => setGlossDictionary({}));

  it('returns semantic gloss for known lemma', () => {
    expect(getLemmaGloss('ходить')).toBe('to walk');
  });

  it('returns semantic gloss for another lemma', () => {
    expect(getLemmaGloss('стол')).toBe('table');
  });

  it('returns first entry gloss for homograph (array)', () => {
    expect(getLemmaGloss('замок')).toBe('castle');
  });

  it('reads short-key format (g instead of gloss)', () => {
    expect(getLemmaGloss('река')).toBe('river');
  });

  it('returns bilingual object for bilingual lemma', () => {
    expect(getLemmaGloss('любить')).toEqual({ en: 'to love', fr: 'aimer' });
  });

  it('returns null when lemma gloss is also grammatical', () => {
    expect(getLemmaGloss('бежать')).toBeNull();
  });

  it('returns null when bilingual lemma gloss is grammatical', () => {
    expect(getLemmaGloss('спеть')).toBeNull();
  });

  it('returns null for unknown lemma', () => {
    expect(getLemmaGloss('неизвестный')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getLemmaGloss('')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(getLemmaGloss(null as any)).toBeNull();
  });
});

// ===================================================================
// truncateGloss — Word and character limits
// ===================================================================

describe('truncateGloss', () => {
  describe('word limit', () => {
    it('enforces 5-word default limit', () => {
      expect(truncateGloss('one two three four five six seven')).toBe(
        'one two three four'
      );
    });

    it('passes through gloss under word limit', () => {
      expect(truncateGloss('one two three', 5)).toBe('one two three');
    });

    it('enforces custom word limit', () => {
      expect(truncateGloss('one two three four five', 3, 100)).toBe('one two three');
    });
  });

  describe('character limit', () => {
    it('enforces 18-character default limit at word boundary', () => {
      expect(truncateGloss('a very long translation here', 5, 18)).toBe('a very long');
    });

    it('passes through gloss under character limit', () => {
      expect(truncateGloss('short', 5, 18)).toBe('short');
    });

    it('falls back to slice when first word exceeds maxChars', () => {
      expect(truncateGloss('superlongwordthatis22chars', 5, 18)).toBe('superlongwordthati');
    });
  });

  describe('parenthetical stripping', () => {
    it('removes closed parentheticals', () => {
      expect(truncateGloss('birch (tree or wood)', 5)).toBe('birch');
    });

    it('removes multiple parentheticals', () => {
      expect(truncateGloss('word (note 1) here (note 2)', 5, 50)).toBe('word here');
    });

    it('removes unclosed parentheticals', () => {
      expect(truncateGloss('birch (tree or', 5)).toBe('birch');
    });
  });

  describe('dangling particle removal (v5.11.19)', () => {
    it('removes dangling "to" after comma', () => {
      expect(truncateGloss('to wander, to', 5, 50)).toBe('to wander');
    });

    it('removes dangling "a" after comma', () => {
      expect(truncateGloss('house, a', 5, 50)).toBe('house');
    });

    it('removes dangling "the" after semicolon', () => {
      expect(truncateGloss('building; the', 5, 50)).toBe('building');
    });

    it('removes dangling "of" after comma', () => {
      expect(truncateGloss('sake, of', 5, 50)).toBe('sake');
    });

    it('removes dangling "and" after comma', () => {
      expect(truncateGloss('bread, and', 5, 50)).toBe('bread');
    });

    it('does not remove non-dangling particles', () => {
      expect(truncateGloss('path of life', 5, 50)).toBe('path of life');
    });
  });

  describe('trailing punctuation removal', () => {
    it('removes trailing comma', () => {
      expect(truncateGloss('hello,', 5, 50)).toBe('hello');
    });

    it('removes trailing semicolon', () => {
      expect(truncateGloss('hello;', 5, 50)).toBe('hello');
    });

    it('removes trailing colon', () => {
      expect(truncateGloss('hello:', 5, 50)).toBe('hello');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(truncateGloss('', 5)).toBe('');
    });

    it('returns empty string for null-ish input', () => {
      expect(truncateGloss(null as any, 5)).toBe('');
    });

    it('handles single word within limits', () => {
      expect(truncateGloss('heart', 5)).toBe('heart');
    });

    it('handles exactly 5 words', () => {
      expect(truncateGloss('one two three four five', 5, 50)).toBe('one two three four five');
    });
  });
});

// ===================================================================
// formatGlossForDisplay — Full pipeline orchestration
// ===================================================================

describe('formatGlossForDisplay', () => {
  beforeEach(() => setGlossDictionary(TEST_DICTIONARY));
  afterEach(() => setGlossDictionary({}));

  // -----------------------------------------------------------------
  // Curated gloss priority
  // -----------------------------------------------------------------

  describe('curated gloss priority', () => {
    it('returns curated gloss for тебе in English (regression 1.7)', () => {
      expect(formatGlossForDisplay(null, null, null, 'тебе', 'en')).toBe('you');
    });

    it('returns curated gloss for тебе in French (regression 1.7)', () => {
      expect(formatGlossForDisplay(null, null, null, 'тебе', 'fr')).toBe('à toi');
    });

    it('returns curated gloss for сердце', () => {
      expect(formatGlossForDisplay(null, null, null, 'сердце', 'en')).toBe('heart');
    });

    it('returns curated gloss for душа ("soul", not "shower") (regression 2.2)', () => {
      expect(formatGlossForDisplay(null, null, null, 'душа', 'en')).toBe('soul');
    });

    it('curated gloss overrides dictionary gloss', () => {
      // даже if a dictionary gloss is provided, curated takes priority
      expect(
        formatGlossForDisplay('some dictionary gloss', 'noun', null, 'сердце', 'en')
      ).toBe('heart');
    });

    it('looks up by lemma when word form not curated', () => {
      // "душой" is not in CURATED_GLOSSES, but lemma "душа" is
      expect(formatGlossForDisplay(null, null, 'душа', 'душой', 'en')).toBe('soul');
    });

    it('is case-insensitive on word lookup', () => {
      expect(formatGlossForDisplay(null, null, null, 'Тебе', 'en')).toBe('you');
    });

    it('is case-insensitive on lemma lookup', () => {
      expect(formatGlossForDisplay(null, null, 'Душа', 'душой', 'en')).toBe('soul');
    });
  });

  // -----------------------------------------------------------------
  // Bilingual object routing (regression 1.4)
  // -----------------------------------------------------------------

  describe('bilingual object routing (regression 1.4)', () => {
    it('resolves bilingual object and applies cleaning', () => {
      const gloss = { en: 'heart; soul; core', fr: 'cœur; âme' };
      expect(formatGlossForDisplay(gloss, null, null, null, 'en')).toBe('heart');
    });

    it('resolves French from bilingual object', () => {
      const gloss = { en: 'heart; soul', fr: 'cœur; âme' };
      expect(formatGlossForDisplay(gloss, null, null, null, 'fr')).toBe('cœur');
    });

    it('applies truncation after bilingual resolution', () => {
      const gloss = { en: 'a very long verbose English translation that exceeds limits', fr: 'long' };
      const result = formatGlossForDisplay(gloss, null, null, null, 'en');
      expect(result.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it('bilingual grammatical gloss triggers lemma fallback', () => {
      const gloss = { en: 'genitive singular of стол', fr: 'génitif singulier de стол' };
      expect(formatGlossForDisplay(gloss, null, 'стол', null, 'en')).toBe('table');
    });
  });

  // -----------------------------------------------------------------
  // Grammatical detection and lemma fallback
  // -----------------------------------------------------------------

  describe('grammatical detection and lemma fallback', () => {
    it('falls back to lemma semantic gloss via lemma parameter', () => {
      expect(
        formatGlossForDisplay('genitive singular of ходить', null, 'ходить', null, 'en')
      ).toBe('to walk');
    });

    it('extracts lemma from gloss text when lemma parameter is absent', () => {
      expect(
        formatGlossForDisplay('genitive singular of ходить', null, null, null, 'en')
      ).toBe('to walk');
    });

    it('returns empty when lemma fallback finds no semantic gloss', () => {
      // бежать's gloss is itself grammatical — no semantic gloss available
      expect(
        formatGlossForDisplay('inflection of бежать', null, 'бежать', null, 'en')
      ).toBe('');
    });

    it('returns empty when no lemma can be found or extracted', () => {
      expect(
        formatGlossForDisplay('short form of something', null, null, null, 'en')
      ).toBe('');
    });

    it('cleans and truncates the lemma fallback gloss', () => {
      // дом's gloss is "house, building, dwelling place" — should truncate
      expect(
        formatGlossForDisplay('genitive singular of дом', null, 'дом', null, 'en')
      ).toBe('house, building');
    });

    it('performs lemma fallback for "alternative spelling of" (regression 1.2)', () => {
      expect(
        formatGlossForDisplay('alternative spelling of силок', null, 'силок', null, 'en')
      ).toBe('snare, trap');
    });

    it('lemma fallback resolves bilingual lemma gloss to correct language', () => {
      expect(
        formatGlossForDisplay('inflection of любить', null, 'любить', null, 'fr')
      ).toBe('aimer');
    });
  });

  // -----------------------------------------------------------------
  // Clean semantic glosses
  // -----------------------------------------------------------------

  describe('clean semantic glosses', () => {
    it('passes through simple gloss', () => {
      expect(formatGlossForDisplay('beautiful', null, null, null, 'en')).toBe('beautiful');
    });

    it('applies semicolon splitting (regression 1.3)', () => {
      expect(formatGlossForDisplay('heart; soul; core', null, null, null, 'en')).toBe('heart');
    });

    it('truncates long glosses to word/char limits', () => {
      expect(
        formatGlossForDisplay('a very long verbose English translation', null, null, null, 'en')
      ).toBe('a very long verbose');
    });

    it('strips parenthetical content before display', () => {
      expect(
        formatGlossForDisplay('birch (tree or wood)', null, null, null, 'en')
      ).toBe('birch');
    });
  });

  // -----------------------------------------------------------------
  // Missing and empty glosses
  // -----------------------------------------------------------------

  describe('missing and empty glosses', () => {
    it('returns empty for null gloss', () => {
      expect(formatGlossForDisplay(null, null, null, null, 'en')).toBe('');
    });

    it('returns empty for undefined gloss', () => {
      expect(formatGlossForDisplay(undefined, null, null, null, 'en')).toBe('');
    });

    it('returns empty for empty string gloss', () => {
      expect(formatGlossForDisplay('', null, null, null, 'en')).toBe('');
    });

    it('returns empty for bilingual object with empty en (English mode)', () => {
      expect(
        formatGlossForDisplay({ en: '', fr: '' }, null, null, null, 'en')
      ).toBe('');
    });
  });

  // -----------------------------------------------------------------
  // Default language
  // -----------------------------------------------------------------

  describe('default language parameter', () => {
    it('defaults to English', () => {
      expect(formatGlossForDisplay('heart', null, null, null)).toBe('heart');
    });

    it('curated glosses default to English', () => {
      expect(formatGlossForDisplay(null, null, null, 'сердце')).toBe('heart');
    });
  });
});

// ===================================================================
// CURATED_GLOSSES — Data integrity
// ===================================================================

describe('CURATED_GLOSSES', () => {
  it('contains at least 150 entries', () => {
    expect(CURATED_GLOSSES.size).toBeGreaterThanOrEqual(150);
  });

  it('all entries have en field', () => {
    for (const [word, gloss] of CURATED_GLOSSES) {
      expect(gloss.en, `${word} missing en field`).toBeTruthy();
    }
  });

  it('all entries have fr field', () => {
    for (const [word, gloss] of CURATED_GLOSSES) {
      expect(gloss.fr, `${word} missing fr field`).toBeTruthy();
    }
  });

  it('all keys are lowercase', () => {
    for (const [word] of CURATED_GLOSSES) {
      expect(word, `"${word}" is not lowercase`).toBe(word.toLowerCase());
    }
  });

  describe('specific entries (spot checks)', () => {
    it('я = I / je', () => {
      expect(CURATED_GLOSSES.get('я')).toEqual({ en: 'I', fr: 'je' });
    });

    it('тебе = you / à toi (regression 1.7)', () => {
      expect(CURATED_GLOSSES.get('тебе')).toEqual({ en: 'you', fr: 'à toi' });
    });

    it('душа = soul / âme (regression 2.2 — not "shower")', () => {
      expect(CURATED_GLOSSES.get('душа')).toEqual({ en: 'soul', fr: 'âme' });
    });

    it('сердце = heart / cœur', () => {
      expect(CURATED_GLOSSES.get('сердце')).toEqual({ en: 'heart', fr: 'cœur' });
    });

    it('солнце = sun / soleil', () => {
      expect(CURATED_GLOSSES.get('солнце')).toEqual({ en: 'sun', fr: 'soleil' });
    });

    it('любовь = love / amour', () => {
      expect(CURATED_GLOSSES.get('любовь')).toEqual({ en: 'love', fr: 'amour' });
    });

    it('нет = no/there is no', () => {
      const entry = CURATED_GLOSSES.get('нет');
      expect(entry?.en).toBe('no/there is no');
    });
  });
});

// ===================================================================
// addStressMarkToCyrillic — Stress mark display
// ===================================================================

describe('addStressMarkToCyrillic', () => {
  it('adds acute to second syllable (молоко, stress on ло)', () => {
    const syllables = [
      { isStressed: false },
      { isStressed: true },
      { isStressed: false },
    ];
    expect(addStressMarkToCyrillic('молоко', syllables)).toBe('моло\u0301ко');
  });

  it('adds acute to first syllable (дом)', () => {
    const syllables = [{ isStressed: true }];
    expect(addStressMarkToCyrillic('дом', syllables)).toBe('до\u0301м');
  });

  it('adds acute to third syllable (красота)', () => {
    const syllables = [
      { isStressed: false },
      { isStressed: false },
      { isStressed: true },
    ];
    expect(addStressMarkToCyrillic('красота', syllables)).toBe('красота\u0301');
  });

  it('does not add acute to ё (already marked)', () => {
    const syllables = [{ isStressed: true }, { isStressed: false }];
    expect(addStressMarkToCyrillic('ёлка', syllables)).toBe('ёлка');
  });

  it('does not add acute to Ё (uppercase)', () => {
    const syllables = [{ isStressed: true }, { isStressed: false }];
    expect(addStressMarkToCyrillic('Ёлка', syllables)).toBe('Ёлка');
  });

  it('returns word unchanged when no stressed syllable', () => {
    const syllables = [{ isStressed: false }, { isStressed: false }];
    expect(addStressMarkToCyrillic('слово', syllables)).toBe('слово');
  });

  it('returns word unchanged for empty syllable array', () => {
    expect(addStressMarkToCyrillic('дом', [])).toBe('дом');
  });

  it('returns word unchanged for null syllables', () => {
    expect(addStressMarkToCyrillic('дом', null as any)).toBe('дом');
  });

  it('handles word with ё in non-stressed position', () => {
    // ёж stressed on ё, but second word: берёза stressed on second syllable
    const syllables = [
      { isStressed: false },
      { isStressed: true },
      { isStressed: false },
    ];
    // берёза — ё is the stressed vowel (syllable 2), ё skips acute
    expect(addStressMarkToCyrillic('берёза', syllables)).toBe('берёза');
  });
});

// ===================================================================
// addAcuteToSyllable — Single syllable stress marking
// ===================================================================

describe('addAcuteToSyllable', () => {
  it('adds acute to the first vowel in a syllable', () => {
    expect(addAcuteToSyllable('ло')).toBe('ло\u0301');
  });

  it('adds acute to vowel in consonant cluster', () => {
    expect(addAcuteToSyllable('кра')).toBe('кра\u0301');
  });

  it('adds acute to single vowel', () => {
    expect(addAcuteToSyllable('о')).toBe('о\u0301');
  });

  it('does not add acute to ё', () => {
    expect(addAcuteToSyllable('ёл')).toBe('ёл');
  });

  it('does not add acute to Ё', () => {
    expect(addAcuteToSyllable('Ёл')).toBe('Ёл');
  });

  it('handles consonant-only input (no vowel)', () => {
    expect(addAcuteToSyllable('ст')).toBe('ст');
  });

  it('handles empty string', () => {
    expect(addAcuteToSyllable('')).toBe('');
  });
});
