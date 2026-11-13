import { describe, expect, it } from 'vitest';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { VOWELS } from '../engine/types';
import { DRAWINGS, creditLine } from './drawings';

const STATIC = join(__dirname, '../../../../static');

describe('the ten interim drawings', () => {
	it('has one for every vowel, each a real PNG in static/sagittal, none shared', () => {
		const seen = new Set<string>();
		for (const v of VOWELS) {
			const path = join(STATIC, DRAWINGS[v].src);
			expect(existsSync(path), v).toBe(true);
			expect(readFileSync(path).subarray(1, 4).toString(), v).toBe('PNG');
			seen.add(DRAWINGS[v].src);
		}
		expect(seen.size).toBe(10);
	});
	it('totals the bytes the report names', () => {
		const total = VOWELS.reduce((n, v) => n + statSync(join(STATIC, DRAWINGS[v].src)).size, 0);
		expect(total).toBe(555071);
	});
	it('credits Mitton and Bolla, and says so where Bolla has no plate', () => {
		expect(creditLine('i')).toBe('Interim drawing: Mitton (2020), Fig. 4.3, after Bolla (1981), plate 17.');
		expect(creditLine('ɪ')).toBe('Interim drawing: Mitton (2020), Fig. 4.3. Bolla has no plate for this vowel.');
	});
});
