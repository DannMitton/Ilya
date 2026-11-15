/**
 * N.202 (D1): one home for the version. The version is a year and a letter; the build is read safely where the
 * build-time constant is not defined; the year is the version's first four characters.
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { ILYA_VERSION, ILYA_BUILD, ILYA_VERSION_YEAR } from './version';

describe('lib/version.ts', () => {
	it('is the release of 2026-11-20, 2026b, a year and a lowercase letter', () => {
		expect(ILYA_VERSION).toBe('2026b');
		expect(ILYA_VERSION).toMatch(/^20\d\d[a-z]$/);
	});
	it('holds the year as a number, read from the version', () => {
		expect(ILYA_VERSION_YEAR).toBe(2026);
	});
	it('holds a build that is a non-empty string', () => {
		expect(typeof ILYA_BUILD).toBe('string');
		expect(ILYA_BUILD.length).toBeGreaterThan(0);
	});
	it('reads the build through typeof, because a bare read throws where the constant is not defined', () => {
		const src = readFileSync(new URL('./version.ts', import.meta.url), 'utf8');
		expect(src).toContain("typeof __ILYA_BUILD__ === 'string'");
	});
});
