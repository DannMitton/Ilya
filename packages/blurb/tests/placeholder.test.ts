import { describe, it, expect } from 'vitest';
import { composeBlurb, deriveRule } from '../src/index.js';

describe('@ilya/blurb', () => {
  it('placeholder: package loads and exports composeBlurb', () => {
    expect(typeof composeBlurb).toBe('function');
  });

  it('placeholder: package loads and exports deriveRule', () => {
    expect(typeof deriveRule).toBe('function');
  });
});
