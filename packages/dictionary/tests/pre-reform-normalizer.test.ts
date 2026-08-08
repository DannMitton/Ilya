/**
 * Tests for pre-1918 orthography normalisation (item N.12).
 *
 * Every positive case below is drawn from the reform's own documented
 * examples (https://en.wikipedia.org/wiki/Reforms_of_Russian_orthography),
 * with one exception that is labelled where it appears. The compound-word cases
 * are the Slavic Cataloging Manual's worked examples, corroborated against the
 * decree's own wording, both read in E.32.
 *
 * The abstention cases are as load-bearing as the positive ones. Dann's
 * ruling of 2026-07-16 is that this normaliser NEVER touches the soft sign ь
 * and never touches a medial hard sign, so those two guards are pinned here
 * and must fail loudly if anyone loosens the rule.
 */

import { describe, it, expect } from 'vitest';
import { modernisePreReform, normalizePreReform } from '../src/pre-reform-normalizer';

describe('normalizePreReform: the abolished letters', () => {
	it('maps ѣ (yat) → е (дѣти → дети)', () => {
		expect(normalizePreReform('дѣти')).toEqual(['дети']);
	});

	it('maps ѳ (fita) → ф and drops the terminal ъ (мараѳонъ → марафон)', () => {
		expect(normalizePreReform('мараѳонъ')).toEqual(['марафон']);
	});

	it('maps і (decimal i) → и and drops the terminal ъ (Іисусъ → Иисус)', () => {
		expect(normalizePreReform('Іисусъ')).toEqual(['Иисус']);
	});

	it('maps ѵ (izhitsa) → и', () => {
		// мѵро is the stock izhitsa example. It is NOT verified against a source
		// this session, so this case pins the CHARACTER MAPPING and does not
		// vouch for the word itself.
		expect(normalizePreReform('мѵро')).toEqual(['миро']);
	});

	it('preserves the case of a line-initial capital (Дѣти → Дети)', () => {
		expect(normalizePreReform('Дѣти')).toEqual(['Дети']);
	});
});

describe('normalizePreReform: the terminal hard sign', () => {
	it('drops a word-final ъ (Рыбинскъ → Рыбинск)', () => {
		expect(normalizePreReform('Рыбинскъ')).toEqual(['Рыбинск']);
	});

	it('NEVER drops a medial ъ: объять is modern and must be left entirely alone', () => {
		// A medial hard sign is a live separator in modern Russian and carries
		// meaning. Grayson: ignore ъ word-finally, "but recognize that it
		// usually has some significance when used internally."
		expect(normalizePreReform('объять')).toEqual([]);
	});

	it('drops only the terminal ъ when a word carries both (объятъ → объят)', () => {
		expect(normalizePreReform('объятъ')).toEqual(['объят']);
	});

	it('never reduces a bare ъ to the empty string', () => {
		expect(normalizePreReform('ъ')).toEqual([]);
	});

	it('drops a part-final ъ in a compound (контръ-адмиралъ → контр-адмирал)', () => {
		// The decree reads "на конце слов и частей сложных слов": the end of words
		// AND of the parts of compound words. This worked example is the Slavic
		// Cataloging Manual's. The first version of this module failed it.
		expect(normalizePreReform('контръ-адмиралъ')).toEqual(['контр-адмирал']);
	});

	it('drops a part-final ъ in both parts of a compound (изъ-подъ → из-под)', () => {
		expect(normalizePreReform('изъ-подъ')).toEqual(['из-под']);
	});

	it('leaves a hyphenated MODERN compound entirely alone (сине-зелёный)', () => {
		// A control that can fail. If the compound rule ever fires on a hyphen by
		// itself, rather than on a hard sign before one, this goes first.
		expect(normalizePreReform('сине-зелёный')).toEqual([]);
	});
});

describe('normalizePreReform: the soft sign is untouchable', () => {
	it('leaves a final ь alone (мать stays мать)', () => {
		// Dann, 2026-07-16: "never touch the soft sign ь (the letter dropped is
		// the terminal hard sign ъ)". мать and мат are a minimal pair, so
		// dropping ь here would silently change the word.
		expect(normalizePreReform('мать')).toEqual([]);
	});

	it('leaves a medial ь alone', () => {
		expect(normalizePreReform('пьеса')).toEqual([]);
	});
});

describe('normalizePreReform: abstention is the common case', () => {
	it('returns [] for an ordinary modern word, so a modern text pays nothing', () => {
		expect(normalizePreReform('окно')).toEqual([]);
	});

	it('returns [] for the empty string', () => {
		expect(normalizePreReform('')).toEqual([]);
	});

	it('returns at most one candidate, because every rule here is deterministic', () => {
		const out = normalizePreReform('Іисусъ');
		expect(out).toHaveLength(1);
	});
});

describe('normalizePreReform: the guard that must be able to fail', () => {
	it('does not treat ё or й as pre-reform letters', () => {
		// A control with teeth: if anyone widens the map to "unusual-looking
		// Cyrillic", these two go first, and ё is load-bearing for stress
		// throughout Ilya.
		expect(normalizePreReform('ёлка')).toEqual([]);
		expect(normalizePreReform('май')).toEqual([]);
	});

	it('changes nothing about a word it does not recognise as pre-reform', () => {
		const modern = ['слово', 'песня', 'ночь', 'сердце', 'любовь'];
		for (const w of modern) {
			expect(normalizePreReform(w)).toEqual([]);
		}
	});
});

describe('modernisePreReform: the intake entry point', () => {
	it('returns null when nothing is pre-reform, so a modern text pays nothing', () => {
		expect(modernisePreReform('окно')).toBeNull();
	});

	it('returns one string rather than a list (дѣти → дети)', () => {
		expect(modernisePreReform('дѣти')).toBe('дети');
	});

	it('drops a hard sign before trailing punctuation, which intake sees and lookup never did', () => {
		// The earlier lookahead tested only for end-of-string or a hyphen, so a word
		// carrying a comma kept its hard sign and missed the dictionary. At intake the
		// punctuation has not been stripped yet, so this case is now the common one.
		expect(modernisePreReform('мараѳонъ,')).toBe('марафон,');
	});

	it('drops a hard sign before a closing guillemet', () => {
		expect(modernisePreReform('«Рыбинскъ»')).toBe('«Рыбинск»');
	});

	it('KEEPS a medial hard sign that a pre-reform letter follows (объѣхать → объехать)', () => {
		// The control for rule ORDER, and it can fail. The lookahead asks for a modern
		// Cyrillic letter, and ѣ is not one, so running the hard-sign rule before the
		// character map would delete this separator. Mapping first makes it объехать,
		// where the е protects the ъ.
		expect(modernisePreReform('объѣхать')).toBe('объехать');
	});

	it('leaves a wholly modern word with a medial hard sign alone', () => {
		expect(modernisePreReform('съесть')).toBeNull();
	});

	it('agrees with normalizePreReform, which delegates to it', () => {
		for (const w of ['дѣти', 'окно', 'контръ-адмиралъ', 'ъ', 'объять', 'мараѳонъ,']) {
			const one = modernisePreReform(w);
			expect(normalizePreReform(w)).toEqual(one === null ? [] : [one]);
		}
	});
});
