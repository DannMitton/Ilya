/**
 * The prefix boundary and the look-alike roots (Grayson 2012, p. 249; Dann, 2026-11-02 00:50).
 * Row 175 step 1.
 */
import { describe, expect, it } from 'vitest';
import { LOOK_ALIKE_ROOTS, STOP_PREFIXES, VZS_PREFIXES, prefixBoundary, transcribeWord } from '../src/index';

describe('the lists', () => {
  it('stop prefixes are the ten the brief names', () => {
    expect([...STOP_PREFIXES].sort()).toEqual(['над', 'надо', 'об', 'обо', 'от', 'ото', 'под', 'подо', 'пред', 'предо'].sort());
  });
  it('the в/с/з family is the eleven the brief names (Grayson p. 249, exception ii)', () => {
    expect([...VZS_PREFIXES].sort()).toEqual(['без', 'в', 'воз', 'вз', 'из', 'низ', 'раз', 'роз', 'с', 'чрез', 'через'].sort());
  });
  it('the look-alike roots are по-двиг-, по-движ-, по-двин-, по-двиз-, and отч-', () => {
    expect(LOOK_ALIKE_ROOTS.map((r) => r.root)).toEqual(['двиг', 'движ', 'двин', 'двиз', 'отч']);
  });
});

describe('prefixBoundary', () => {
  it('a stop prefix: обвить, отчёт, оттенок, подвести, отлично', () => {
    expect(prefixBoundary('обвить')).toMatchObject({ kind: 'stop', prefix: 'об', end: 1 });
    expect(prefixBoundary('отчёт')).toMatchObject({ kind: 'stop', prefix: 'от', end: 1 });
    expect(prefixBoundary('оттенок')).toMatchObject({ kind: 'stop', prefix: 'от', end: 1 });
    expect(prefixBoundary('подвести')).toMatchObject({ kind: 'stop', prefix: 'под', end: 2 });
    expect(prefixBoundary('отлично')).toMatchObject({ kind: 'stop', prefix: 'от', end: 1 });
  });
  it('the longest prefix wins: предмет is пред, not под or от', () => {
    expect(prefixBoundary('предмет')).toMatchObject({ kind: 'stop', prefix: 'пред', end: 3 });
    expect(prefixBoundary('подобрать')).toMatchObject({ kind: 'stop', prefix: 'подо' });
  });
  it('the в/с/з family: изменять, безъязычный, смерть', () => {
    expect(prefixBoundary('изменять')).toMatchObject({ kind: 'vzs', prefix: 'из' });
    expect(prefixBoundary('безъязычный')).toMatchObject({ kind: 'vzs', prefix: 'без' });
    expect(prefixBoundary('смерть')).toMatchObject({ kind: 'vzs', prefix: 'с' });
  });
  it('look-alike roots are checked before the stop prefixes', () => {
    expect(prefixBoundary('подвиг')).toMatchObject({ kind: 'look-alike', look: 'под', root: 'двиг', end: 2 });
    expect(prefixBoundary('подвижный')).toMatchObject({ kind: 'look-alike', look: 'под', root: 'движ' });
    expect(prefixBoundary('подвинуть')).toMatchObject({ kind: 'look-alike', look: 'под', root: 'двин' });
    expect(prefixBoundary('подвизаться')).toMatchObject({ kind: 'look-alike', look: 'под', root: 'двиз' });
    expect(prefixBoundary('отчий')).toMatchObject({ kind: 'look-alike', look: 'от', root: 'отч', end: 1 });
    expect(prefixBoundary('отчим')).toMatchObject({ kind: 'look-alike', look: 'от', root: 'отч' });
  });
  it('отчёт is prefixed (Grayson p. 250), not a look-alike: the ruling\'s отч- is narrowed to four stems', () => {
    expect(prefixBoundary('отчёт')!.kind).toBe('stop');
    expect(prefixBoundary('отчитать')!.kind).toBe('stop');
    expect(prefixBoundary('отчаяние')!.kind).toBe('stop');
  });
  it('a word with no listed prefix has none: неподвижный (не- is not on the list)', () => {
    expect(prefixBoundary('неподвижный')).toBeNull();
    expect(prefixBoundary('дверь')).toBeNull();
  });
});

describe('the boundary in the engine (reason boundary-prefix, look-alike-root)', () => {
  const reason = (word: string, ch: string) =>
    transcribeWord(word).transcriptionLog.find((e) => e.char === ch)!.features.palReason;
  const ipa = (word: string) => transcribeWord(word).ipa;
  it('stops: обвить б hard, отчёт т hard, подвести д hard', () => {
    expect(ipa('обвить')).not.toContain('bʲ');
    expect(reason('обвить', 'б')).toBe('boundary-prefix');
    expect(reason('отчёт', 'т')).toBe('boundary-prefix');
    expect(reason('подвести', 'д')).toBe('boundary-prefix');
  });
  it('the same consonant on both sides is allowed: оттенок т soft', () => {
    expect(ipa('оттенок')).toContain('tʲ');
    expect(reason('оттенок', 'т')).toBe('regressive-dental');
  });
  it('look-alike roots soften as неподвижный does, with reason look-alike-root and the root and prefix', () => {
    const d = transcribeWord('подвиг').transcriptionLog.find((e) => e.char === 'д')!;
    expect(d.ipa).toBe('dʲ');
    expect(d.features).toMatchObject({ palReason: 'look-alike-root', look: 'под', root: 'двиг', word: 'подвиг' });
    expect(transcribeWord('неподвижный').transcriptionLog.find((e) => e.char === 'д')!.ipa).toBe('dʲ');
    expect(transcribeWord('подвижный').transcriptionLog.find((e) => e.char === 'д')!.ipa).toBe('dʲ');
    expect(transcribeWord('отчий').transcriptionLog.find((e) => e.char === 'т')!.ipa).toBe('tʲ');
  });
});
