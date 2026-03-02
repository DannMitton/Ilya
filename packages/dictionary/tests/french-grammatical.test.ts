/**
 * Tests for expanded French isGrammatical patterns.
 *
 * Validates detection of French grammatical descriptions from
 * kaikki.org French Wiktionary that were leaking as glosses
 * (March 2, 2026 discovery session).
 */

import { describe, it, expect } from 'vitest';
import { isGrammatical } from '../src/gloss';

describe('isGrammatical — expanded French patterns', () => {
  // ── Verb tense and mood patterns ──────────────────────────────

  it('detects "Passé masculin singulier de..."', () => {
    expect(isGrammatical('Passé masculin singulier de бежать')).toBe(true);
  });

  it('detects "Présent de..."', () => {
    expect(isGrammatical('Présent de идти')).toBe(true);
  });

  it('detects "Futur simple de..."', () => {
    expect(isGrammatical('Futur simple de говорить')).toBe(true);
  });

  it('detects "Imparfait de..."', () => {
    expect(isGrammatical('Imparfait de быть')).toBe(true);
  });

  it('detects "Conditionnel de..."', () => {
    expect(isGrammatical('Conditionnel de мочь')).toBe(true);
  });

  it('detects "Impératif de..."', () => {
    expect(isGrammatical('Impératif de сказать')).toBe(true);
  });

  it('detects "Subjonctif de..."', () => {
    expect(isGrammatical('Subjonctif de хотеть')).toBe(true);
  });

  // ── Aspect patterns ───────────────────────────────────────────

  it('detects "Perfectif de делать"', () => {
    expect(isGrammatical('Perfectif de делать')).toBe(true);
  });

  it('detects "Imperfectif de..."', () => {
    expect(isGrammatical('Imperfectif de сделать')).toBe(true);
  });

  it('detects "Infinitif de..."', () => {
    expect(isGrammatical('Infinitif de быть')).toBe(true);
  });

  // ── Person patterns ───────────────────────────────────────────

  it('detects "Première personne du singulier du présent de..."', () => {
    expect(isGrammatical('Première personne du singulier du présent de знать')).toBe(true);
  });

  it('detects "Troisième personne du pluriel de..."', () => {
    expect(isGrammatical('Troisième personne du pluriel de видеть')).toBe(true);
  });

  it('detects "Deuxième personne du singulier de..."', () => {
    expect(isGrammatical('Deuxième personne du singulier de мочь')).toBe(true);
  });

  // ── Gender-form descriptions ──────────────────────────────────

  it('detects "Masculin singulier de..."', () => {
    expect(isGrammatical('Masculin singulier de большой')).toBe(true);
  });

  it('detects "Féminin pluriel de..."', () => {
    expect(isGrammatical('Féminin pluriel de новый')).toBe(true);
  });

  // ── Guard: real semantic glosses still pass through ────────────

  it('rejects "Révolte" (semantic)', () => {
    expect(isGrammatical('Révolte')).toBe(false);
  });

  it('rejects "Vengeance" (semantic)', () => {
    expect(isGrammatical('Vengeance')).toBe(false);
  });

  it('rejects "Fraternité" (semantic)', () => {
    expect(isGrammatical('Fraternité')).toBe(false);
  });

  it('rejects "Propriété, domaine" (semantic)', () => {
    expect(isGrammatical('Propriété, domaine')).toBe(false);
  });

  it('rejects "Famille, ensemble" (semantic)', () => {
    expect(isGrammatical('Famille, ensemble')).toBe(false);
  });
});
