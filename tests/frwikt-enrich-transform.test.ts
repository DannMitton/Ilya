import { describe, it, expect } from 'vitest';
import { mergeCandidate } from '../scripts/frwikt-enrich-transform.mjs';

describe('FR enrichment transform — candidate merge rule', () => {
  it('adds F beside an existing E, preserving E and key order', () => {
    const { gloss, action } = mergeCandidate({ E: 'umbrella' }, 'parapluie');
    expect(action).toBe('added-to-existing');
    expect(gloss).toEqual({ E: 'umbrella', F: 'parapluie' });
    expect(Object.keys(gloss)).toEqual(['E', 'F']);
  });

  it('creates a gloss entry when the form had none', () => {
    const { gloss, action } = mergeCandidate(null, 'parapluie');
    expect(action).toBe('created');
    expect(gloss).toEqual({ F: 'parapluie' });
  });

  it('never overwrites an existing F (policy 6, gap-filling only)', () => {
    const existing = { E: 'old', F: 'ancien; Vieux' };
    const { gloss, action } = mergeCandidate(existing, 'nouveau');
    expect(action).toBe('skipped-has-F');
    expect(gloss).toBe(existing);
    expect(gloss.F).toBe('ancien; Vieux');
  });

  it('never overwrites an F-only entry either', () => {
    const existing = { F: 'sommeil; Rêve' };
    const { action } = mergeCandidate(existing, 'autre');
    expect(action).toBe('skipped-has-F');
    expect(existing.F).toBe('sommeil; Rêve');
  });

  it('does not mutate the existing object when adding F', () => {
    const existing = { E: 'umbrella' };
    mergeCandidate(existing, 'parapluie');
    expect(existing).toEqual({ E: 'umbrella' });
  });

  it('merges the candidate gloss verbatim (policies 1-5 applied upstream)', () => {
    const multiSense = 'parapluie; Ombrelle';
    const { gloss } = mergeCandidate(null, multiSense);
    expect(gloss.F).toBe(multiSense);
  });
});
