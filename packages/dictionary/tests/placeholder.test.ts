import { describe, it, expect } from 'vitest';
import { lookupStress, formatGloss } from '../src/index.js';

describe('@ilya/dictionary', () => {
  it('placeholder: package loads and exports lookupStress', () => {
    expect(typeof lookupStress).toBe('function');
  });

  it('placeholder: package loads and exports formatGloss', () => {
    expect(typeof formatGloss).toBe('function');
  });
});
