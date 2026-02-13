/**
 * Clitic chain resolution tests.
 *
 * Verifies that resolveCliticChain correctly identifies host words
 * by scanning past intervening proclitics, and assigns the right
 * ProcliticPosition for vowel reduction.
 *
 * @module @ilya/phonology
 */

import { describe, it, expect } from 'vitest';
import { resolveCliticChain } from '../src/clitics';
import type { ChainWord } from '../src/clitics';

// ── Helper ──────────────────────────────────────────────────────

/** Build a minimal ChainWord array from a shorthand notation. */
function line(...words: Array<{ w: string; s: number }>): ChainWord[] {
  return words.map(({ w, s }) => ({ cleanWord: w, stress: s }));
}

// ── Tests ───────────────────────────────────────────────────────

describe('resolveCliticChain', () => {
  describe('single proclitic', () => {
    it('finds the immediate next word as host', () => {
      // "в силах" — host is силах (stress on syllable 0)
      const words = line({ w: 'в', s: -1 }, { w: 'силах', s: 0 });
      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBe(1);
      expect(result.position).toEqual({ type: 'pretonic' });
    });

    it('assigns remote position when host stress is not on syllable 0', () => {
      // "на молоко" — host stress on syllable 2
      const words = line({ w: 'на', s: -1 }, { w: 'молоко', s: 2 });
      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBe(1);
      expect(result.position).toEqual({ type: 'remote' });
    });
  });

  describe('two-proclitic chain', () => {
    it('scans past intervening proclitic to find host', () => {
      // "не в силах" — both не and в should resolve to силах
      const words = line(
        { w: 'не', s: -1 },
        { w: 'в', s: -1 },
        { w: 'силах', s: 0 },
      );

      const result0 = resolveCliticChain(words, 0);
      expect(result0.hostIndex).toBe(2);
      expect(result0.position).toEqual({ type: 'pretonic' });

      const result1 = resolveCliticChain(words, 1);
      expect(result1.hostIndex).toBe(2);
      expect(result1.position).toEqual({ type: 'pretonic' });
    });

    it('assigns remote for chain before distant-stress host', () => {
      // "не на молоко" — host stress on syllable 2
      const words = line(
        { w: 'не', s: -1 },
        { w: 'на', s: -1 },
        { w: 'молоко', s: 2 },
      );

      const result0 = resolveCliticChain(words, 0);
      expect(result0.hostIndex).toBe(2);
      expect(result0.position).toEqual({ type: 'remote' });
    });
  });

  describe('three-proclitic chain', () => {
    it('scans through three consecutive proclitics', () => {
      // Rare but valid: "и не в доме" (и as conjunction, not always clitic,
      // but if classified as proclitic this tests the chain)
      const words = line(
        { w: 'не', s: -1 },
        { w: 'по', s: -1 },
        { w: 'на', s: -1 },
        { w: 'доме', s: 0 },
      );

      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBe(3);
      expect(result.position).toEqual({ type: 'pretonic' });
    });
  });

  describe('edge cases', () => {
    it('returns null host when proclitic is at end of line', () => {
      const words = line({ w: 'в', s: -1 });
      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBeNull();
      expect(result.position).toBeNull();
    });

    it('returns null host when line is all proclitics', () => {
      const words = line(
        { w: 'не', s: -1 },
        { w: 'в', s: -1 },
      );
      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBeNull();
      expect(result.position).toBeNull();
    });

    it('stops at non-proclitic host even with unknown stress', () => {
      // Host has stress -2 (VERIFY word) — still treated as host
      const words = line(
        { w: 'на', s: -1 },
        { w: 'странноеслово', s: -2 },
      );
      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBe(1);
      expect(result.hostStress).toBe(-2);
      expect(result.position).toEqual({ type: 'remote' });
    });

    it('treats next word as host when safety bound is reached', () => {
      // Pathological: 6 proclitics before a host. Scan traverses 5 intervening
      // proclitics (в through от), then exits. hostIdx lands on дом.
      const words = line(
        { w: 'не', s: -1 },
        { w: 'в', s: -1 },
        { w: 'на', s: -1 },
        { w: 'по', s: -1 },
        { w: 'за', s: -1 },
        { w: 'от', s: -1 },
        { w: 'дом', s: 0 },
      );
      const result = resolveCliticChain(words, 0);
      expect(result.hostIndex).toBe(6);
      expect(result.position).toEqual({ type: 'pretonic' });
    });
  });
});
