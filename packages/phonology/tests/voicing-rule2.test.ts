/**
 * N.198 — Grayson (2012) p. 251, rule 2, and the p. 252 examples.
 *
 * Rule 2: "Sonorants and vowels do not influence voicing assimilation across
 * any boundary, but do allow final voiced consonants of prepositions,
 * particle contractions, prefixes and word roots (boundary #4) to retain
 * voicing." An ordinary word is boundary #3 and devoices.
 *
 * These are engine-level tests on hand-built words. The `rightBoundary` of
 * each word is the one `apps/web/src/lib/boundaries.ts` gives it (clitic for
 * a proclitic, soft for «сад», «глаз», «друг», «бог», and every word of the
 * preposition set); `apps/web/src/lib/voicing-rule2.pipeline.test.ts` pins
 * those boundaries and every example again through `processText` with the
 * real dictionary, so a wrong boundary here cannot hide.
 *
 * Pins marked REGRESSION GUARD pass on the code before N.198 as well.
 * Grayson prints [mʲeʐ nas] and [bʲez ˈanɪ]; Ilya's proclitic reduces the
 * vowel, so the pins assert the final consonant and not the whole word.
 */
import { describe, it, expect } from 'vitest';
import { GraysonEngine } from '../src/index';
import { VOICING_PREPOSITIONS, lettersOf } from '../src/voicing-rule2';

type Boundary = 'hard' | 'soft' | 'clitic';

function word(cyrillic: string, ipa: string, rightBoundary: Boundary, extra: Record<string, unknown> = {}) {
  return {
    cyrillic, ipaSurface: '', ipaUnderlying: ipa,
    rightBoundary, boundarySource: 'auto' as const, skipFinalDevoicing: false, ...extra,
  };
}

function run(...words: ReturnType<typeof word>[]) {
  GraysonEngine.applyCrossWordAssimilation(words);
  return words.map((w) => w.ipaSurface);
}

describe('N.198: an ordinary word devoices before a vowel or sonorant (p. 252)', () => {
  it('сад наш → [sat naʃ]', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('наш', 'ˈnɑʃ', 'hard'))[0]).toBe('ˈsɑt');
  });

  it('сад Анны → [sat ˈanɪ]', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('Анны', 'ˈɑnnɨ', 'hard'))[0]).toBe('ˈsɑt');
  });

  it('сад ваш → [sat vaʃ]: в follows the rules of a sonorant before a vowel', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('ваш', 'ˈvɑʃ', 'hard'))[0]).toBe('ˈsɑt');
  });
});

describe('N.198: a preposition keeps its voicing (REGRESSION GUARD, passes before and after)', () => {
  it('меж нас keeps [ʒ] (once меж is a proclitic, clitic boundary)', () => {
    expect(run(word('меж', 'mʲɪʒ', 'clitic'), word('нас', 'ˈnɑs', 'hard'))[0]).toBe('mʲɪʒ');
  });

  it('без Анны keeps [z]', () => {
    expect(run(word('без', 'bʲɪz', 'clitic'), word('Анны', 'ˈɑnnɨ', 'hard'))[0]).toBe('bʲɪz');
  });

  it('если б мог: the particle contraction б stays [b] at a soft boundary', () => {
    expect(run(word('б', 'b', 'soft'), word('мог', 'ˈmok', 'hard'))[0]).toBe('b');
  });

  it('ж, the other vowelless contraction, stays [ʒ] before a vowel', () => {
    expect(run(word('ж', 'ʒ', 'soft'), word('он', 'ˈon', 'hard'))[0]).toBe('ʒ');
  });
});

describe('N.198: the eight-word preposition set keeps its voicing at a soft boundary (Dann, 2026-10-26 17:26)', () => {
  it('сквозь нас keeps [zʲ]', () => {
    expect(run(word('сквозь', 'ˈskvozʲ', 'soft'), word('нас', 'ˈnɑs', 'hard'))[0]).toBe('ˈskvozʲ');
  });

  it('вокруг нас keeps [ɡ]', () => {
    expect(run(word('вокруг', 'vɑˈkruɡ', 'soft'), word('нас', 'ˈnɑs', 'hard'))[0]).toBe('vɑˈkruɡ');
  });

  it('близ Анны keeps [z]', () => {
    expect(run(word('близ', 'ˈblʲiz', 'soft'), word('Анны', 'ˈɑnnɨ', 'hard'))[0]).toBe('ˈblʲiz');
  });

  it('the set is exactly the eight ruled words, keyed on what cleanWord holds (no hyphen)', () => {
    expect([...VOICING_PREPOSITIONS].sort()).toEqual(
      ['близ', 'вглубь', 'вокруг', 'вслед', 'изпод', 'промеж', 'сквозь', 'средь'].sort(),
    );
  });

  it('«из-под» typed with its hyphen resolves to the same key', () => {
    expect(lettersOf('из-под')).toBe('изпод');
    expect(run(word('из-под', 'izˈpɑd', 'soft'), word('Анны', 'ˈɑnnɨ', 'hard'))[0]).toBe('izˈpɑd');
  });

  it('a word outside the set does not borrow the exemption: сад keeps no voicing even next to a set word', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('вокруг', 'vɑˈkruɡ', 'hard'))[0]).toBe('ˈsɑt');
  });

  it('the pipeline flag wins over the set: a word the pipeline says is not a proclitic (isProclitic false) and not in the set devoices', () => {
    expect(run(word('под', 'pɑd', 'soft', { isProclitic: false }), word('Анны', 'ˈɑnnɨ', 'hard'))[0]).toBe('pɑt');
    expect(run(word('под', 'pɑd', 'soft'), word('Анны', 'ˈɑnnɨ', 'hard'))[0]).toBe('pɑd');
  });
});

describe('N.198: в is ignored where it would influence (p. 251, "look to the next letter in line")', () => {
  it('сад вдали keeps [d]: д reaches back through в', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('вдали', 'vdɑˈlʲi', 'hard'))[0]).toBe('ˈsɑd');
  });

  it('глаз вдруг keeps [z]', () => {
    expect(run(word('глаз', 'ˈɡɫɑz', 'soft'), word('вдруг', 'ˈvdruk', 'hard'))[0]).toBe('ˈɡɫɑz');
  });

  it('сад в доме keeps [d]: the bare proclitic в, then д', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('в', 'v', 'clitic'), word('доме', 'ˈdomʲɪ', 'hard'))[0]).toBe('ˈsɑd');
  });

  it('сад в траве devoices: the bare proclitic в, then т', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('в', 'v', 'clitic'), word('траве', 'trɑˈvʲɛ', 'hard'))[0]).toBe('ˈsɑt');
  });

  it('сад в мае devoices: the bare proclitic в, then a sonorant, and an ordinary word does not keep voicing', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('в', 'v', 'clitic'), word('мае', 'ˈmɑjɪ', 'hard'))[0]).toBe('ˈsɑt');
  });

  it('a hard boundary after the bare в stops the look-through: сад в. доме devoices', () => {
    expect(run(word('сад', 'ˈsɑd', 'soft'), word('в', 'v', 'hard'), word('доме', 'ˈdomʲɪ', 'hard'))[0]).toBe('ˈsɑt');
  });

  it('a voiceless final before в + voiced obstruent is unchanged (decided in N.198: not extended)', () => {
    expect(run(word('лес', 'ˈlʲɛs', 'soft'), word('вдали', 'vdɑˈlʲi', 'hard'))[0]).toBe('ˈlʲɛs');
  });
});

describe('N.198: the «бог» exception survives the cross-word pass (Grayson p. 144, [box])', () => {
  it('Бог мой keeps [x]: the surface is rebuilt from ipaUnderlying, so the pass restores it', () => {
    expect(run(word('Бог', 'ˈboɡ', 'soft'), word('мой', 'ˈmoj', 'hard'))[0]).toBe('ˈbox');
  });

  it('Бог один keeps [x]', () => {
    expect(run(word('Бог', 'ˈboɡ', 'soft'), word('один', 'ɑˈdʲin', 'hard'))[0]).toBe('ˈbox');
  });

  it('a word that only ends in бог is not «бог»: небог devoices to [k]', () => {
    expect(run(word('небог', 'ɲɪˈboɡ', 'soft'), word('мой', 'ˈmoj', 'hard'))[0]).toBe('ɲɪˈbok');
  });
});
