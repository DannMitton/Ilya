import { describe, it, expect } from 'vitest';
import { lookupStress } from '@ilya/dictionary';

describe('cross-package imports', () => {
  it('phonology can import from dictionary', () => {
    expect(typeof lookupStress).toBe('function');
  });
});
