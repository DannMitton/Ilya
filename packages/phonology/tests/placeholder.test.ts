import { describe, it, expect } from 'vitest';
import { transcribeWord } from '../src/index.js';

describe('@ilya/phonology', () => {
  it('placeholder: package loads and exports transcribeWord', () => {
    expect(typeof transcribeWord).toBe('function');
  });
});
