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

  it('a voiceless final before в + voiced obstruent takes the voicing through the в (p. 251, row 157): лес вдали → [lʲɛz vdɑˈlʲi]', () => {
    expect(run(word('лес', 'ˈlʲɛs', 'soft'), word('вдали', 'vdɑˈlʲi', 'hard'))[0]).toBe('ˈlʲɛz');
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

describe('row 157: «бог» as Dann ruled it, 2026-10-26 21:35: [box] alone, at a hard boundary, and before a vowel, a sonorant, or a voiceless consonant; [boɣ] before a voiced obstruent; never [bok] or [bog]', () => {
  const bog = (boundary: Boundary, ...after: ReturnType<typeof word>[]) => run(word('Бог', 'ˈboɡ', boundary), ...after)[0];

  it('«Бог» alone ends in [x]: a hard boundary and nothing after it', () => {
    expect(run(word('Бог', 'ˈboɡ', 'hard'))[0]).toBe('ˈbox');
  });
  it('Бог, мой: a hard boundary (punctuation) is [x]', () => {
    expect(bog('hard', word('мой', 'ˈmoj', 'hard'))).toBe('ˈbox');
  });
  it('Бог там: a voiceless consonant is [x]', () => {
    expect(bog('soft', word('там', 'ˈtɑm', 'hard'))).toBe('ˈbox');
  });
  it('Бог мой and Бог один: a sonorant and a vowel are [x] (REGRESSION GUARD)', () => {
    expect(bog('soft', word('мой', 'ˈmoj', 'hard'))).toBe('ˈbox');
    expect(bog('soft', word('один', 'ɑˈdʲin', 'hard'))).toBe('ˈbox');
  });
  it('Бог даст and Бог был: a voiced obstruent is [ɣ], never [ɡ]', () => {
    expect(bog('soft', word('даст', 'ˈdɑst', 'hard'))).toBe('ˈboɣ');
    expect(bog('soft', word('был', 'ˈbɨɫ', 'hard'))).toBe('ˈboɣ');
  });
  it('Бог ли: a clitic boundary before a sonorant is [x] (REGRESSION GUARD)', () => {
    expect(bog('clitic', word('ли', 'lʲi', 'hard'))).toBe('ˈbox');
  });
  it('Бог же and Бог бы: a clitic boundary before a voiced obstruent is [ɣ]', () => {
    expect(bog('clitic', word('же', 'ʒɨ', 'hard'))).toBe('ˈboɣ');
    expect(bog('clitic', word('бы', 'bɨ', 'hard'))).toBe('ˈboɣ');
  });
  it('Бог в доме: [ɣ], the в is looked through to the д', () => {
    expect(bog('soft', word('в', 'v', 'clitic'), word('доме', 'ˈdomʲɪ', 'hard'))).toBe('ˈboɣ');
  });
  it('Бог в траве: [x], the в is looked through to a voiceless т; the bare в itself reads [f]', () => {
    const out = run(word('Бог', 'ˈboɡ', 'soft'), word('в', 'v', 'clitic'), word('траве', 'trɑˈvʲɛ', 'hard'));
    expect(out[0]).toBe('ˈbox');
    expect(out[1]).toBe('f');
  });
  it('Бог в мае: [x], a sonorant past the в', () => {
    expect(bog('soft', word('в', 'v', 'clitic'), word('мае', 'ˈmɑjɪ', 'hard'))).toBe('ˈbox');
  });
  it('a word that only ends in бог is not «бог»: небог devoices to [k] before a voiced obstruent too', () => {
    expect(run(word('небог', 'ɲɪˈboɡ', 'soft'), word('даст', 'ˈdɑst', 'hard'))[0]).toBe('ɲɪˈboɡ');
    expect(run(word('небог', 'ɲɪˈboɡ', 'hard'))[0]).toBe('ɲɪˈbok');
  });
  it('reads cleanWord when the pipeline gives one: «Бог,» with its comma is still «бог»', () => {
    expect(run(word('Бог,', 'ˈboɡ', 'hard', { cleanWord: 'Бог' }))[0]).toBe('ˈbox');
  });
});

describe('row 157: the в look-through for a voiceless final (Grayson p. 251: "ignore /u/ (-d-) when it is in a position of regressive influence and ... look to the next letter in line")', () => {
  const left = (cyrillic: string, ipa: string, ...after: ReturnType<typeof word>[]) => run(word(cyrillic, ipa, 'soft'), ...after)[0];
  const bareV = () => word('в', 'v', 'clitic');

  it('лес в доме: the bare proclitic в is looked through to the д, so the с voices', () => {
    expect(left('лес', 'ˈlʲɛs', bareV(), word('доме', 'ˈdomʲɪ', 'hard'))).toBe('ˈlʲɛz');
  });
  it('кот вдруг → [kod vdruk]', () => {
    expect(left('кот', 'ˈkot', word('вдруг', 'ˈvdruɡ', 'hard'))).toBe('ˈkod');
  });
  it('a voiceless effective initial changes nothing: лес в траве, and a voiceless letter after the в of the word itself', () => {
    expect(left('лес', 'ˈlʲɛs', bareV(), word('траве', 'trɑˈvʲɛ', 'hard'))).toBe('ˈlʲɛs');
    expect(left('лес', 'ˈlʲɛs', word('втоптал', 'vtɐpˈtɑɫ', 'hard'))).toBe('ˈlʲɛs');
  });
  it('a vowel or a sonorant past the в leaves a voiceless final alone: лес вот, лес в лесу, лес в мае', () => {
    expect(left('лес', 'ˈlʲɛs', word('вот', 'ˈvot', 'hard'))).toBe('ˈlʲɛs');
    expect(left('лес', 'ˈlʲɛs', bareV(), word('лесу', 'ˈlʲɛsu', 'hard'))).toBe('ˈlʲɛs');
    expect(left('лес', 'ˈlʲɛs', bareV(), word('мае', 'ˈmɑjɪ', 'hard'))).toBe('ˈlʲɛs');
  });
  it('a hard boundary after the bare в stops the look-through: лес в. доме', () => {
    expect(run(word('лес', 'ˈlʲɛs', 'soft'), word('в', 'v', 'hard'), word('доме', 'ˈdomʲɪ', 'hard'))[0]).toBe('ˈlʲɛs');
  });
  it('сад вдали keeps [d] (N.198\'s guard: a voiced final before в + voiced obstruent keeps its voicing)', () => {
    expect(left('сад', 'ˈsɑd', word('вдали', 'vdɑˈlʲi', 'hard'))).toBe('ˈsɑd');
  });
  it('what the branch reaches through в is what it reaches without it: х → ɣ, ц → dz, ч → dʒʲ; щ stays', () => {
    expect(left('дух', 'ˈdux', word('вдали', 'vdɑˈlʲi', 'hard'))).toBe('ˈduɣ');
    expect(left('отец', 'ɑˈtʲɛts', word('вдали', 'vdɑˈlʲi', 'hard'))).toBe('ɑˈtʲɛdz');
    expect(left('врач', 'ˈvrɑtʃʲ', word('вдали', 'vdɑˈlʲi', 'hard'))).toBe('ˈvrɑdʒʲ');
    expect(left('плащ', 'ˈplɑʃʲʃʲ', word('вдали', 'vdɑˈlʲi', 'hard'))).toBe('ˈplɑʃʲʃʲ');
  });
  it('the same allophones without a в: слух был → [sɫuɣ bɨɫ] (the comment at the voicing branch)', () => {
    expect(left('слух', 'ˈsɫux', word('был', 'ˈbɨɫ', 'hard'))).toBe('ˈsɫuɣ');
  });
  it('a left final в is unchanged: кров вдали → [krof] (v is in neither consonant set)', () => {
    expect(left('кров', 'ˈkrov', word('вдали', 'vdɑˈlʲi', 'hard'))).toBe('ˈkrof');
  });
});
