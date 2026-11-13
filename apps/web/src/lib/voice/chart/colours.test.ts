import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { VOWELS } from '../engine/types';
import { zoneColour, zoneColourName } from './colours';

describe('the zone colours', () => {
	const css = readFileSync(join(__dirname, '../../../app.css'), 'utf8');
	it('every vowel names a custom property that app.css declares', () => {
		for (const v of VOWELS) {
			expect(zoneColour(v)).toBe(`var(${zoneColourName(v)})`);
			expect(css, v).toMatch(new RegExp(`${zoneColourName(v)}:\\s*[^;]+;`));
		}
	});
	it('gives the six Bozeman vowels six different colours and the four personal vowels one', () => {
		const six = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'] as const;
		expect(new Set(six.map(zoneColourName)).size).toBe(6);
		expect(new Set((['ɪ', 'ɨ', 'a', 'ʌ'] as const).map(zoneColourName)).size).toBe(1);
	});
	it('declares no outline: the tokens are fills only (a stroke named for a zone would break the "no outlines" ruling)', () => {
		expect(css).not.toMatch(/--zone-[a-z-]+-(stroke|outline|border)/);
	});
});
