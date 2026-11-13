import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { VOWELS } from './engine/types';
import { t } from '$lib/i18n';
import { spoken, spokenName } from './vowel-names';
import FrSym from './FrSym.svelte';

describe('vowel-names (moved from Pacifier.svelte)', () => {
	it('spokenName reads vowel.name.<glyph> in both languages, for all ten, with no [MISSING]', () => {
		for (const lang of ['en', 'fr'] as const) {
			for (const g of VOWELS) {
				expect(spokenName(g, lang)).toBe(t(`vowel.name.${g}`, lang));
				expect(spokenName(g, lang)).not.toContain('MISSING');
			}
		}
	});
	it('spoken puts the name into vowel.spoken', () => {
		for (const lang of ['en', 'fr'] as const) {
			for (const g of VOWELS) expect(spoken(g, lang)).toBe(t('vowel.spoken', lang).replace('{name}', spokenName(g, lang)));
		}
		expect(spoken('i', 'en')).toContain(spokenName('i', 'en'));
	});
});

describe('FrSym (lifted from the wizard’s snippet, same markup)', () => {
	const body = (n: 1 | 2) => render(FrSym, { props: { n } }).body.replace(/\s+/g, ' ').replace(/ class="[^"]*"/g, '');
	it('is an italic f over an upright subscript, labelled for a screen reader', () => {
		expect(body(1)).toContain('aria-label="f R 1"');
		expect(body(1)).toContain('<em aria-hidden="true">f</em>');
		expect(body(1)).toContain('<sub aria-hidden="true">R1</sub>');
		expect(body(2)).toContain('aria-label="f R 2"');
		expect(body(2)).toContain('<sub aria-hidden="true">R2</sub>');
	});
});
