/**
 * Tests for vowel reconstitution (Grayson Ch. 3, §8, pp. 128–129).
 *
 * WHY THESE EXIST. `applyReconstitution` had no unit test. The gap they were
 * written for: an unstressed я between two soft consonants stayed [i] with
 * reconstitution on, while every other reduced я reconstituted. Dann ruled on
 * 2026-09-26 that it becomes [a], by analogy with Grayson's е row on p. 128
 * and the interpalatal allophone of /a/ on p. 125.
 *
 * FIXTURE PROVENANCE. Every transcription log here is the engine's own, not a
 * hand-built one, so the interpalatal flag is the engine's (CONTRACT §6: do
 * not hand-roll a phonological predicate). The stress dictionary is local to
 * this file and names the stressed vowel by index, as the engine reads it.
 * `core` builds the per-word IPA exactly as `pipeline.ts` does before it
 * calls `applyReconstitution`.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, transcribeWord } from '@ilya/phonology';
import { applyReconstitution } from './reconstitution';

const STRESS: Record<string, { stress: number }> = {
  рябина: { stress: 1 },
  пятилетка: { stress: 2 },
  явить: { stress: 1 },
  семьянин: { stress: 2 },
  пятно: { stress: 1 },
  пять: { stress: 0 },
  мясо: { stress: 0 },
};

beforeAll(() => setStressDictionary(STRESS));
afterAll(() => setStressDictionary({}));

/** The engine's reduced IPA and the reconstituted IPA for one word. */
function both(word: string): { reduced: string; reconstituted: string; log: any[] } {
  const result: any = transcribeWord(word);
  const reduced = result.syllables
    .map((s: any) => (s.isStressed ? 'ˈ' + s.ipa : s.ipa))
    .join(' ');
  return {
    reduced,
    reconstituted: applyReconstitution(reduced, result.transcriptionLog),
    log: result.transcriptionLog,
  };
}

/** The log entry for the nth vowel letter `char` in the word. */
function vowel(log: any[], char: string, nth = 0): any {
  return log.filter((e) => e.features?.type === 'vowel' && e.char === char)[nth];
}

describe('interpalatal я reconstitutes to [a]', () => {
  it('pretonic: рябина', () => {
    const { reduced, reconstituted, log } = both('рябина');
    expect(vowel(log, 'я').features).toMatchObject({ position: 'pretonic', interpalatal: true });
    expect(reduced).toBe('rʲi ˈbʲi nɑ');
    expect(reconstituted).toBe('rʲa ˈbʲi nɑ');
  });

  it('remote: пятилетка', () => {
    const { reduced, reconstituted, log } = both('пятилетка');
    expect(vowel(log, 'я').features).toMatchObject({ position: 'remote', interpalatal: true });
    expect(reduced).toBe('pʲi tʲi ˈlʲɛt kɑ');
    expect(reconstituted).toBe('pʲa tʲi ˈlʲɛt kɑ');
  });

  it('word-initial, after the /j/ glide: явить', () => {
    const { reduced, reconstituted, log } = both('явить');
    expect(vowel(log, 'я').features).toMatchObject({ position: 'pretonic', interpalatal: true });
    expect(reduced).toBe('ji ˈvʲitʲ');
    expect(reconstituted).toBe('ja ˈvʲitʲ');
  });
});

describe('existing rules hold', () => {
  it('interpalatal [i] from е reconstitutes to [e], and я after ьj to [a]: семьянин', () => {
    const { reduced, reconstituted, log } = both('семьянин');
    expect(vowel(log, 'е').features).toMatchObject({ position: 'remote', interpalatal: true });
    expect(reduced).toBe('sʲi mʲji ˈɲin');
    expect(reconstituted).toBe('sʲe mʲja ˈɲin');
  });

  it('[ɪ] from я reconstitutes to [ɑ]: пятно', () => {
    const { reduced, reconstituted, log } = both('пятно');
    expect(vowel(log, 'я').features).toMatchObject({ position: 'pretonic', interpalatal: false });
    expect(reduced).toBe('pʲɪt ˈno');
    expect(reconstituted).toBe('pʲɑt ˈno');
  });

  it('a stressed interpalatal я is left alone: пять', () => {
    const { reduced, reconstituted, log } = both('пять');
    expect(vowel(log, 'я').features.position).toBe('stressed');
    expect(reconstituted).toBe(reduced);
  });

  it('a stressed я is left alone while the reduced о beside it reconstitutes: мясо', () => {
    const { reduced, reconstituted, log } = both('мясо');
    expect(vowel(log, 'я').features.position).toBe('stressed');
    expect(reduced).toBe('ˈmʲɑ sʌ');
    expect(reconstituted).toBe('ˈmʲɑ sɑ');
  });
});
