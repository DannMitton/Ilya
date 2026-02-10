/**
 * Cross-package import verification (Task 5b)
 * Confirms that @ilya/phonology can import from @ilya/dictionary
 * via pnpm workspace protocol.
 */
import { describe, it, expect } from 'vitest';
import { extractGloss, formatGlossForDisplay } from '@ilya/dictionary';

describe('cross-package imports', () => {
  it('phonology can import from dictionary', () => {
    expect(typeof extractGloss).toBe('function');
    expect(typeof formatGlossForDisplay).toBe('function');
  });
});
