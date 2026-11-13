import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { t } from '$lib/i18n';
import { stemParts } from './intake-symbols';
import InsightsIntake from './InsightsIntake.svelte';

const STEM = 'voiceIntake.acoustics.stem';
const plain = (h: string) => h.replace(/<[^>]*>/g, '');

describe('the acoustics stem split into text and symbols', () => {
	it('finds fo, nfo, fR1, and F1 in parentheses, in both languages, and nothing else', () => {
		for (const lang of ['en', 'fr'] as const) {
			const symbols = stemParts(t(STEM, lang)).flatMap((p) => (p.kind === 'symbol' ? [p.symbol] : []));
			expect(symbols, lang).toEqual(['fo', 'nfo', 'fR1', 'F1']);
		}
	});
	it('changes no word: the parts put back together are the stem, character for character', () => {
		for (const lang of ['en', 'fr'] as const) {
			const text = t(STEM, lang);
			const back = stemParts(text).map((p) => (p.kind === 'html' ? p.text : p.symbol)).join('');
			expect(back, lang).toBe(text);
		}
	});
	it('does not touch a word that merely contains fo or F1, nor a symbol outside parentheses', () => {
		expect(stemParts('information about fo and F1')).toEqual([{ kind: 'html', text: 'information about fo and F1' }]);
		expect(stemParts('a (fo) b').map((p) => p.kind)).toEqual(['html', 'html', 'symbol', 'html', 'html']);
	});
});

describe('the intake question, drawn', () => {
	/** The markup with Svelte's hydration comments and scoped classes taken out. */
	const clean = (h: string) => h.replace(/<!--.*?-->/gs, '').replace(/ class="[^"]*"/g, '');
	const html = (language: 'en' | 'fr') => clean(render(InsightsIntake, { props: { value: undefined, language, onchange: () => {} } as never }).body);
	const legends = (h: string) => [...h.matchAll(/<legend>(.*?)<\/legend>/gs)].map((m) => m[1]);
	const acoustics = (h: string, language: 'en' | 'fr') => legends(h).find((l) => plain(l).replace(/\s+/g, ' ') === t(STEM, language).replace(/\s+/g, ' '))!;

	it('sets each symbol as an italic letter with an upright subscript', () => {
		for (const lang of ['en', 'fr'] as const) {
			const l = html(lang);
			for (const m of ['<span><i>f</i><sub>o</sub></span>', '<span>n<i>f</i><sub>o</sub></span>', '<span><i>f</i><sub>R1</sub></span>', '<span><i>F</i><sub>1</sub></span>']) expect(l, `${lang} ${m}`).toContain(m);
		}
	});
	it('reads, with the markup taken away, as the string it always was, in both languages', () => {
		for (const lang of ['en', 'fr'] as const) expect(acoustics(html(lang), lang), lang).toBeDefined();
	});
	it('leaves the other questions’ stems as they were, their <em> still markup', () => {
		const fr = html('fr');
		expect(fr).toContain('<em>passaggi</em>');
		expect(fr).toContain('<em>piano</em>');
	});
});
