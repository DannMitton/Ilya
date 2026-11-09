/**
 * The letter ⟨г⟩ before ⟨к⟩ is [x] in the roots мягк- and лёгк-/легк- (`src/lexical-gk.ts`; Grayson 2012 p. 17, PDF p. 33, prints
 * «мягкий» as /ˈmʲɑx-kʲij/; Dann 2026-11-09 15:42). Each listed form is checked, and so are the cases the rule must not reach.
 * If a listed form shows [k], the roots stopped being matched; if a word outside them shows [x], the rule widened to every ⟨гк⟩.
 * The stress entries are a fixture (the real dictionary's values for these words); the [kɨj] and [kʲ] endings are the engine's.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, transcribeWord } from '../src/index';
import { lexicalGkIndex } from '../src/lexical-gk';

beforeAll(() => {
  setStressDictionary({
    'мягкий': { s: 0, l: 'мягкий' },
    'мягкая': { s: 0, l: 'мягкий' },
    'мягко': { s: 0, l: 'мягко' },
    'мягкость': { s: 0, l: 'мягкость' },
    'лёгкий': { s: 0, l: 'лёгкий' },
    'лёгкая': { s: 0, l: 'лёгкий' },
    'легко': { s: 1, l: 'легко' },
    'лёгкость': { s: 0, l: 'лёгкость' },
    'нелегко': { s: 2, l: 'нелегко' },
    'мягкие': { s: 0, l: 'мягкий' },
    'мягким': { s: 0, l: 'мягкий' },
    'мягки': { s: 1, l: 'мягкий' },
    'лёгкие': { s: 0, l: 'лёгкий' },
    'лёгких': { s: 0, l: 'лёгкий' },
    'легки': { s: 1, l: 'лёгкий' },
    'смягчить': { s: 3, l: 'смягчить' },
    'дагка': { s: 0, l: 'дагка' },
    'подгонка': { s: 0, l: 'подгонка' },
  });
});

const ipa = (w: string) => transcribeWord(w).ipa.replace(/ˈ/g, '');

describe('г before к is [x] in мягк- and лёгк-/легк-', () => {
  it.each(['мягкий', 'мягкая', 'мягко', 'мягкость', 'мягкие', 'мягким', 'мягки', 'лёгкий', 'лёгкая', 'лёгкие', 'лёгких', 'легки', 'легко', 'лёгкость', 'нелегко'])('%s has [x] for the г and no [ɡ] or [kk]', (w) => {
    const s = ipa(w);
    expect(s, w).toMatch(/xk/);
    expect(s, w).not.toMatch(/kk/);
    expect(s, w).not.toContain('ɡ');
  });
  it('gives «мягкий» as Grayson prints it, with the engine’s own ending', () => {
    expect(ipa('мягкий')).toBe('mʲɑxkɨj');
  });
  it('flags the г in the transcription log, so the Inspector can say why', () => {
    const e = transcribeWord('мягкий').transcriptionLog.find((x) => x.char === 'г');
    expect(e?.ipa).toBe('x');
    expect(e?.features.lexicalGk).toBe(true);
  });
  it('keeps the syllables in step with the word', () => {
    expect(transcribeWord('мягкий').syllables.map((s) => s.ipa).join('')).toBe(ipa('мягкий'));
  });
});

describe('it does not reach other words', () => {
  it('leaves «смягчить» (мягч-, out of scope) alone', () => {
    expect(lexicalGkIndex('смягчить')).toBe(-1);
    expect(ipa('смягчить')).not.toMatch(/xk/);
  });
  it('leaves a ⟨гк⟩ outside the roots with the ordinary devoicing, [k]', () => {
    expect(lexicalGkIndex('дагка')).toBe(-1);
    expect(ipa('дагка')).toContain('kk');
    expect(ipa('подгонка')).not.toContain('x');
  });
  it('finds the г of each root', () => {
    expect(lexicalGkIndex('мягкий')).toBe(2);
    expect(lexicalGkIndex('лёгкий')).toBe(2);
    expect(lexicalGkIndex('нелегко')).toBe(4);
  });
});
