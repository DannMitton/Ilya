import { describe, expect, it } from 'vitest';
import { systemIndexOf } from './loupe';
import { pageSystemRanges } from './page-systems';

describe('pageSystemRanges', () => {
	it('counts a system of later-pass bars only, so the ending of a six-system page is system 6 of 6', () => {
		// the strophic repeat fixture: two plain systems, a mixed one, two later-pass-only ones, the ending's
		const ranges = pageSystemRanges(['0-3', '4-7', '8-8', null, null, '9-10']);
		expect(ranges).toHaveLength(6);
		expect(systemIndexOf(ranges, 9) + 1).toBe(6);
		expect(systemIndexOf(ranges, 8) + 1).toBe(3);
	});
	it('gives a page with no later-pass system the numbers it always had', () => {
		const ranges = pageSystemRanges(['0-3', '4-7', '8-10']);
		expect(ranges).toHaveLength(3);
		expect(systemIndexOf(ranges, 5) + 1).toBe(2);
	});
	it('still drops a data-system value that does not parse', () => {
		expect(pageSystemRanges(['0-3', 'x', '4-7'])).toHaveLength(2);
	});
	it('no measure belongs to a later-pass-only system', () => {
		expect(systemIndexOf(pageSystemRanges([null]), 0)).toBe(-1);
	});
});
