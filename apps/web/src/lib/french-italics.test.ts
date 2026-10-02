/**
 * Italian musical terms are italic in the French (QUEUE row 15). Dann,
 * 2026-10-01 02:58 (`docs/memory/PRODUCT.md`, "ITALICS ON FOREIGN WORDS IN THE
 * FRENCH"): "I agree with Roberge on Italian musical terms, and otherwise we
 * defer to OQLF." Roberge's GDRM: « On compose en italique les indications de
 * tempo, de dynamique et d'expression », and the terms its list of Italian
 * terms names. So *passaggio*, *zona di passaggio*, *legato*, *crescendo*,
 * *decrescendo*, *piano*, *forte*, and *primo* and *secondo* as the
 * passaggi's names, take italics.
 *
 * NOT IN THIS RULE, and left roman: *tempo* and *coda*, which the GDRM lists
 * and Usito carries as French headwords (the two authorities differ, so the
 * desk brings the case to Dann, per the ruling's third bullet); words in
 * French form (tessiture, mélisme, colorature, friture); and the voice names
 * soprano and mezzo-soprano.
 *
 * The terms below come from the ruling, not from the strings under test.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { stringKeys, t } from './i18n';
import { italicRuns, withoutItalics } from './italics';

const TERMS = /passagg(?:io|i)\b|\bzona\b|\bprimo\b|\bsecondo\b|\blegato\b|\bcrescendo\b|\bdecrescendo\b|\bdiminuendo\b|\bpiano\b|\bforte\b/i;

/** What is left of a French value once its italic runs, its placeholders, and its markup are removed. */
const roman = (s: string) =>
	s
		.replace(/\*[^*]+\*/g, ' ')
		.replace(/<em>.*?<\/em>/gs, ' ')
		.replace(/\{[^}]*\}/g, ' ')
		.replace(/<[^>]*>/g, ' ');

describe('italicRuns', () => {
	it('sets *…* in italics and leaves the rest as text', () => {
		expect(italicRuns('votre *passaggio* secondaire')).toEqual([
			{ text: 'votre ' },
			{ text: 'passaggio', title: true },
			{ text: ' secondaire' },
		]);
		expect(italicRuns('aucun terme')).toEqual([{ text: 'aucun terme' }]);
		expect(withoutItalics('*Primo* {primo}, *secondo* {secondo}')).toBe('Primo {primo}, secondo {secondo}');
	});
});

describe('the French in i18n.ts', () => {
	const keys = stringKeys();

	it('sets every Italian musical term in italics', () => {
		const roman_ = keys.filter((k) => TERMS.test(roman(t(k, 'fr')))).map((k) => `${k}: ${t(k, 'fr')}`);
		expect(roman_).toEqual([]);
	});

	it('is not vacuous: the terms are there, set in italics', () => {
		const italic = keys.filter((k) => {
			const fr = t(k, 'fr');
			return /\*[^*]+\*|<em>/.test(fr) && TERMS.test(fr);
		});
		expect(italic.length).toBeGreaterThanOrEqual(24);
	});

	it('italicises the named strings, and leaves the English alone', () => {
		const named: Record<string, string> = {
			'calib.characteristics.passaggioHeading': '*Passaggio*',
			'calib.characteristics.passaggioPrimaryLabel': '*Passaggio* primaire',
			'insights.figure.secondo': '*secondo*',
			'comment.working.where.secondoAt': 'sur votre *secondo passaggio*',
			'comment.working.try.decrescendo.action': 'aborder la note avec un léger *decrescendo*',
			'voiceIntake.topic.passaggi': 'La traversée des <em>passaggi</em>',
		};
		for (const [k, fr] of Object.entries(named)) expect(t(k, 'fr')).toBe(fr);
		// The English is not in scope: none of the terms is set in italics there.
		for (const k of keys) expect(t(k, 'en')).not.toMatch(/\*[^*]*(passagg|\bzona\b|\bprimo\b|\bsecondo\b|legato|crescendo)[^*]*\*|<em>(passagg|legato)/i);
	});

	it('leaves no asterisk unpaired, so none can print', () => {
		for (const k of keys) expect([...t(k, 'fr')].filter((c) => c === '*').length % 2, k).toBe(0);
	});

	it('asks « Qu’est-ce que la friture vocale? », and has no « fry » in its French', () => {
		expect(t('calib.welcome.fryQuestion', 'fr')).toBe('Qu’est-ce que la friture vocale?');
		const fry = keys.filter((k) => /\bfry\b/i.test(t(k, 'fr')));
		expect(fry).toEqual([]);
	});
});

describe('the French of the Guide and Learn', () => {
	/** The French branch: from the first `{#if language === 'fr'}` to the `{:else}` after it. */
	const french = (file: string) => {
		const s = readFileSync(new URL(`./components/Reading/${file}`, import.meta.url), 'utf8');
		const a = s.indexOf("{#if language === 'fr'}");
		const b = s.indexOf('{:else}', a);
		expect(a).toBeGreaterThan(-1);
		expect(b).toBeGreaterThan(a);
		return s.slice(a, b);
	};

	it.each(['GuideContent.svelte', 'LearnContent.svelte'])('%s sets every Italian musical term in italics', (file) => {
		const bad = roman(french(file))
			.split('\n')
			.map((line, i) => ({ line, i }))
			.filter(({ line }) => TERMS.test(line))
			.map(({ line, i }) => `${i + 1}: ${line.trim().slice(0, 100)}`);
		expect(bad).toEqual([]);
	});

	it('is not vacuous: the Guide sets passaggio in italics', () => {
		expect(french('GuideContent.svelte')).toContain('<em>passaggio</em>');
		expect(french('LearnContent.svelte')).toContain('<em>legato</em>');
	});
});
