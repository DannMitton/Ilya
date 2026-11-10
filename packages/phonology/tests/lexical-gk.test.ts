/**
 * The letter ⟨г⟩ before ⟨к⟩ is [x] before a hard [k] and [xʲ] before a soft [kʲ] in the roots мягк- and лёгк-/легк- (`src/lexical-gk.ts`;
 * Grayson 2012 p. 240, PDF p. 256; Dann 2026-11-09 15:42 for the letter name). Each listed form is checked, and so are the cases the rule
 * must not reach. If a hard-к form shows [k] or [xʲ], or a soft-к form shows plain [x] or [k], the rule stopped following the к; if a word
 * outside the roots shows [x], it widened to every ⟨гк⟩. The stress entries are a fixture (the real dictionary's values for these
 * words); the endings are the engine's, whose stage profile keeps the к of -кий hard («мягкий» is [xk], not Grayson's [xʲkʲ]).
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
  it.each(['мягкий', 'мягкая', 'мягко', 'мягкость', 'лёгкий', 'лёгкая', 'легко', 'лёгкость', 'нелегко'])('%s: [x] before the engine\'s hard к, no [ɡ], [k] or [xʲ]', (w) => {
    const s = ipa(w);
    expect(s, w).toMatch(/xk/);
    expect(s, w).not.toMatch(/kk|xʲ|ɡ/);
  });
  it.each(['мягкие', 'мягким', 'мягки', 'лёгкие', 'лёгких', 'легки'])('%s: [xʲ] before a soft [kʲ], Grayson\'s /xʲkʲ/', (w) => {
    const s = ipa(w);
    expect(s, w).toMatch(/xʲkʲ/);
    expect(s, w).not.toMatch(/kʲkʲ|ɡ/);
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
    expect(ipa('смягчить')).not.toMatch(/x[ʲ]?k/);
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
