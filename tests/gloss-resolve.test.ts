import { describe, it, expect } from 'vitest';
import { resolveFullGloss } from '../apps/web/src/lib/gloss-resolve';

describe('Full-gloss resolution — bilateral cross-language fallback (decision E)', () => {
	const both = { E: 'old; ancient', F: 'ancien; Vieux' };
	const eOnly = { E: 'to pass, to elapse' };
	const fOnly = { F: 'parapluie' };
	const neither = {};

	it('prefers the interface language when its gloss exists (no chip)', () => {
		expect(resolveFullGloss(both, 'fr')).toEqual({
			text: 'ancien; Vieux',
			source: 'fr',
			fallback: false
		});
		expect(resolveFullGloss(both, 'en')).toEqual({
			text: 'old; ancient',
			source: 'en',
			fallback: false
		});
	});

	it('French UI falls back to English, marked (минувших case)', () => {
		expect(resolveFullGloss(eOnly, 'fr')).toEqual({
			text: 'to pass, to elapse',
			source: 'en',
			fallback: true
		});
	});

	it('English UI falls back to French, marked (parity is bilateral)', () => {
		expect(resolveFullGloss(fOnly, 'en')).toEqual({
			text: 'parapluie',
			source: 'fr',
			fallback: true
		});
	});

	it('a language never falls back when its own gloss exists', () => {
		expect(resolveFullGloss(eOnly, 'en')!.fallback).toBe(false);
		expect(resolveFullGloss(fOnly, 'fr')!.fallback).toBe(false);
	});

	it('returns null when neither gloss exists (unavailable message)', () => {
		expect(resolveFullGloss(neither, 'fr')).toBeNull();
		expect(resolveFullGloss(neither, 'en')).toBeNull();
	});

	it('treats empty strings as absent', () => {
		expect(resolveFullGloss({ E: '', F: 'sommeil' }, 'en')).toEqual({
			text: 'sommeil',
			source: 'fr',
			fallback: true
		});
		expect(resolveFullGloss({ E: '', F: '' }, 'fr')).toBeNull();
	});
});
