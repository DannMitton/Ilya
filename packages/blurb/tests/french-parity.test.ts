/**
 * Bilingual parity for the word explanations. Every template in
 * data/blurb-composer.json carries French, with the same placeholders and the
 * same citation as its English. Before 2026-09-26, 209 of 210 carried
 * `"fr": null` and the composer fell back to English without failing anything;
 * this test makes a missing French a failure instead.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { composeBlurb, setBlurbData } from '../src/index';

const DATA = fileURLToPath(new URL('../../../data/blurb-composer.json', import.meta.url));
const data = JSON.parse(readFileSync(DATA, 'utf8'));

type Pair = { en: { template: string; citation?: string }; fr: { template: string; citation?: string } | null };

function pairs(o: unknown, path = ''): [string, Pair][] {
	if (!o || typeof o !== 'object') return [];
	const rec = o as Record<string, unknown>;
	if ('en' in rec && 'fr' in rec) return [[path, rec as unknown as Pair]];
	return Object.entries(rec).flatMap(([k, v]) => pairs(v, `${path}/${k}`));
}

const PLACEHOLDER = /\{\w+\}/g;
const all = pairs(data).filter(([path]) => path !== '/citation_style');

describe('the word explanations in French', () => {
	it('reads all 209 templates', () => {
		expect(all.length).toBe(209);
	});

	it('gives every template a French version', () => {
		expect(all.filter(([, p]) => !p.fr?.template).map(([path]) => path)).toEqual([]);
	});

	it('keeps the English placeholders and citation in the French', () => {
		const wrong = all.filter(([, p]) => {
			const en = new Set(p.en.template.match(PLACEHOLDER) ?? []);
			const fr = new Set(p.fr?.template.match(PLACEHOLDER) ?? []);
			return en.size !== fr.size || [...en].some((x) => !fr.has(x)) || p.fr?.citation !== p.en.citation;
		});
		expect(wrong.map(([path]) => path)).toEqual([]);
	});

	it('uses no em dash, per the house style', () => {
		expect(all.filter(([, p]) => p.fr?.template.includes('—')).map(([path]) => path)).toEqual([]);
	});

	it('composes a French explanation that differs from the English', () => {
		setBlurbData(data);
		const out = composeBlurb({ char: 'д', ipa: 'd', features: { type: 'consonant' } } as never);
		expect(out?.blurb.fr).toContain('la lettre ⟨д⟩');
		expect(out?.blurb.fr).not.toEqual(out?.blurb.en);
	});
});
