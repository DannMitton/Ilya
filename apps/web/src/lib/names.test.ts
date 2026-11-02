/**
 * The names record is well-formed (consistency batch 1, step 2). It asserts
 * the record's own shape; no guard reads `CONCEPTS` yet (row 171 will).
 */
import { describe, expect, it } from 'vitest';
import { hasString } from './i18n';
import { CONCEPTS } from './names';

describe('the names record', () => {
	it('names an i18n key that exists in English and in French for every concept', () => {
		const missing = CONCEPTS.filter((c) => !hasString(c.nameKey, 'en') || !hasString(c.nameKey, 'fr')).map((c) => `${c.id}: ${c.nameKey}`);
		expect(missing).toEqual([]);
	});

	it('gives no two concepts the same id', () => {
		const ids = CONCEPTS.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('compiles every retired pattern with the u flag', () => {
		for (const c of CONCEPTS) for (const r of c.retired) expect(() => new RegExp(r.pattern, 'u'), `${c.id}: ${r.pattern}`).not.toThrow();
	});

	it('begins and ends every bare pattern with a word boundary', () => {
		const bad = CONCEPTS.flatMap((c) => c.retired.filter((r) => r.kind === 'bare' && !/^\\b.*\\b$/.test(r.pattern)).map((r) => `${c.id}: ${r.pattern}`));
		expect(bad).toEqual([]);
	});

	it('gives every retired pattern a reason', () => {
		for (const c of CONCEPTS) for (const r of c.retired) expect(r.why.length, `${c.id}: ${r.pattern}`).toBeGreaterThan(20);
	});
});
