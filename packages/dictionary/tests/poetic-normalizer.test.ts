/**
 * Tests for poetic form normalisation.
 *
 * Validates soft-sign contraction rules against real examples
 * from Russian vocal literature (March 1, 2026 OCR test session).
 */

import { describe, it, expect } from 'vitest';
import { normalizePoetic, restoreCasing } from '../src/poetic-normalizer';

describe('normalizePoetic', () => {
  // ── Positive cases from OCR test (March 1, 2026) ──────────────

  it('normalises -ью → -ию (страданью → страданию)', () => {
    const candidates = normalizePoetic('страданью');
    expect(candidates).toContain('страданию');
  });

  it('normalises -ью → -ию (мщенью → мщению)', () => {
    const candidates = normalizePoetic('мщенью');
    expect(candidates).toContain('мщению');
  });

  it('normalises -ье → -ие (восстанье → восстание)', () => {
    const candidates = normalizePoetic('восстанье');
    expect(candidates).toContain('восстание');
  });

  it('normalises -ья → -ия (именья → имения)', () => {
    const candidates = normalizePoetic('именья');
    expect(candidates).toContain('имения');
  });

  it('normalises -ьем → -ием (нетерпеньем → нетерпением)', () => {
    const candidates = normalizePoetic('нетерпеньем');
    expect(candidates).toContain('нетерпением');
  });

  it('normalises -ью → -ию (истязанью → истязанию)', () => {
    const candidates = normalizePoetic('истязанью');
    expect(candidates).toContain('истязанию');
  });

  // ── Guard: legitimate -ье/-ья words produce candidates but ────
  // ── the caller's dictionary check prevents false normalisation ──

  it('produces candidates for платье (caller rejects: платье hits directly)', () => {
    const candidates = normalizePoetic('платье');
    // normalizePoetic is a pure suffix rule; it WILL produce "платие".
    // The guard is in the caller: direct lookup hits first, so
    // normalizePoetic never fires. This test documents the design.
    expect(candidates).toContain('платие');
  });

  it('produces candidates for семья (caller rejects: семья hits directly)', () => {
    const candidates = normalizePoetic('семья');
    expect(candidates).toContain('семия');
  });

  // ── Edge cases ────────────────────────────────────────────────

  it('returns empty array for words without soft-sign contraction patterns', () => {
    expect(normalizePoetic('народ')).toEqual([]);
    expect(normalizePoetic('свобода')).toEqual([]);
    expect(normalizePoetic('братство')).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(normalizePoetic('')).toEqual([]);
  });

  it('does not produce candidates with empty stems', () => {
    // "ье" alone should not produce "ие" (stem would be empty)
    expect(normalizePoetic('ье')).toEqual([]);
    expect(normalizePoetic('ью')).toEqual([]);
  });

  it('handles -ьём variant', () => {
    const candidates = normalizePoetic('терпеньём');
    expect(candidates).toContain('терпениём');
  });

  it('handles -ьи plural', () => {
    const candidates = normalizePoetic('ущельи');
    expect(candidates).toContain('ущелии');
  });
});

describe('restoreCasing', () => {
  it('preserves lowercase', () => {
    expect(restoreCasing('восстанье', 'восстание')).toBe('восстание');
  });

  it('restores initial capital', () => {
    expect(restoreCasing('Восстанье', 'восстание')).toBe('Восстание');
  });

  it('handles empty strings', () => {
    expect(restoreCasing('', 'восстание')).toBe('восстание');
    expect(restoreCasing('Восстанье', '')).toBe('');
  });

  it('preserves casing for мщенью → мщению', () => {
    expect(restoreCasing('Мщенью', 'мщению')).toBe('Мщению');
  });
});
