import { describe, it, expect } from 'vitest';
import { setGlossDictionary, lookupFullEntry } from '../packages/dictionary/src/gloss';

/**
 * Regression: сновидений panel quirk (UX pass, 2026-06-12).
 * The ellipsis character (U+2026) and parentheses survived the lookup
 * cleaners, so poetry tokens like "сновидений…" missed the dictionary and
 * the Inspector rendered the empty-lookup path despite the entry existing.
 */
describe('Dictionary lookup — punctuation resilience', () => {
	const entry = {
		s: 2,
		e: 'dream, vision',
		f: 'rêve, vision',
		p: 'noun',
		l: 'сновидение',
		g: { en: 'dream, vision', fr: 'rêve, vision' }
	};
	setGlossDictionary({ сновидений: entry } as any);

	const cases: Array<[string, string]> = [
		['plain', 'сновидений'],
		['capitalized', 'Сновидений'],
		['ellipsis character (U+2026)', 'сновидений…'],
		['three ASCII dots', 'сновидений...'],
		['parentheses', '(сновидений)'],
		['guillemets', '«сновидений»'],
		['comma', 'сновидений,'],
		['combining acute', 'сновиде\u0301ний'],
		['NFD-decomposed й', 'сновидений'.normalize('NFD')]
	];

	for (const [name, input] of cases) {
		it(`finds the entry through ${name}`, () => {
			const hit = lookupFullEntry(input);
			expect(hit).not.toBeNull();
			expect((hit as any).l).toBe('сновидение');
		});
	}

	it('still returns null for a word truly absent', () => {
		expect(lookupFullEntry('абракадабра…')).toBeNull();
	});
});
