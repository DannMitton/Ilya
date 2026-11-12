/**
 * THE ROBERGE GUARD (closing polish lane, step 8; ruled by Dann 2026-11-09 23:27). No French interface string, no French GUIDE, and no
 * French LEARN names a pitch in solfège with an octave number («do3», «ré4», «la 3»): a pitch is named in Ilya's own way, never as
 * a solfège syllable and a number. Code comments are exempt, as this reads the strings a singer reads.
 *
 * THE PATTERN IS NOT LOOSE (Amendment 14). A syllable (do, re or ré or rè, mi, fa, sol, la, si or ti; any case; accents as the
 * language allows) is matched as a WHOLE WORD, then one optional space, then an octave digit 0 to 8, and the digit must not be followed
 * by a letter, a digit, or an ordinal mark (e, er, ᵉ, º, °): «la 2e» is an ordinal and does not match. A real sentence that still
 * matches is a finding, listed in the report by file and line; ratified text is not reworded to pass.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { stringKeys, t } from './i18n';
import GuideContent from './components/Reading/GuideContent.svelte';
import LearnContent from './components/Reading/LearnContent.svelte';

const SYLLABLE = '(?:do|r[eéè]|mi|fa|sol|la|si|ti)';
export const SOLFEGE_WITH_OCTAVE = new RegExp(`(?<![\\p{L}\\p{N}])${SYLLABLE}[\\u00a0 ]?[0-8](?![\\p{L}\\p{N}\\u00ba\\u00b0\\u1d49])`, 'giu');

const plain = (html: string) => html.replace(/<!--.*?-->/gs, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, '’');
const hits = (s: string) => [...s.matchAll(SOLFEGE_WITH_OCTAVE)].map((m) => m[0]);

describe('the pattern', () => {
	it.each(['do3', 'ré4', 're4', 'Ré 4', 'la3', 'la 3', 'sol 2', 'si3', 'ti 5', 'Fa4', 'mi 6', 'DO 4'])('names a solfège pitch: %s', (s) => {
		expect(hits(`Chantez le ${s} avec soin.`)).toHaveLength(1);
	});
	it.each(['la 2e fois', 'la 2e', 'le 1er', 'la 3º', 'le mi bémol', 'la mesure 12', 'si 33 fois', 'dans la 1ère mesure', 'à la page 4b', 'Sol3x', 'domaine 4', 'mille'])('does not name one: %s', (s) => {
		expect(hits(s)).toEqual([]);
	});
});

describe('the Roberge guard: no solfège with an octave number in French text a singer reads', () => {
	it('French interface strings', () => {
		expect(stringKeys().length).toBeGreaterThan(1000);
		const found = stringKeys().flatMap((k) => hits(t(k, 'fr')).map((h) => `${k}: «${h}»`));
		expect(found).toEqual([]);
	});
	it('the French GUIDE', () => {
		const text = plain(render(GuideContent, { props: { language: 'fr' } }).body);
		expect(text.length, 'the French GUIDE rendered').toBeGreaterThan(5000);
		expect(hits(text)).toEqual([]);
	});
	it('the French LEARN', () => {
		const text = plain(render(LearnContent, { props: { language: 'fr' } }).body);
		expect(text.length, 'the French LEARN rendered').toBeGreaterThan(5000);
		expect(hits(text)).toEqual([]);
	});
});
