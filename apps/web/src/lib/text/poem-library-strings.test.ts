/**
 * The poem library's strings (poem library, build 1, step 5), as the brief gives them.
 *
 * THESE ARE DESK DRAFTS Dann has not ratified. The expected values below are copied from the brief's "Strings" table
 * (`docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`), not read back out of `i18n.ts`, so this test fails if
 * the table drifts from the brief. When Dann rules, the table and this test change together (`CONTRACT.md` 11a).
 * The French spacing is the OQLF's: a no-break space before a colon, and inside guillemets.
 */
import { describe, expect, it } from 'vitest';
import { hasString, stringKeys, t } from '$lib/i18n';

const NB = ' ';
const DRAFTS: Record<string, [string, string]> = {
	'intake.poemLibrary.cardHeading': ['Ilya found this poem for your song:', `Ilya a trouvé ce poème pour votre chant${NB}:`],
	'intake.poemLibrary.by': ['{author}, translated by {translator}', '{author}, traduit par {translator}'],
	'intake.poemLibrary.passage': ['a passage beginning «{line}»', `un passage commençant par «${NB}{line}${NB}»`],
	'intake.poemLibrary.cardSource': ['From {site}.', 'Tiré de {site}.'],
	'intake.poemLibrary.cardSourceModernized': ['From {site}, in modern spelling.', 'Tiré de {site}, en orthographe moderne.'],
	'intake.poemLibrary.cardColours': ['Coloured words in LYRICS show where the song departs from the poem.', 'Les mots en couleur du champ PAROLES montrent où la mise en musique s’écarte du poème.'],
	'intake.poemLibrary.notThis': ['Not this poem', 'Pas ce poème'],
	'intake.poemLibrary.keep': ['Keep this poem', 'Conserver ce poème'],
	'intake.view.libraryPoem': ['{author}, «{title}», from {site}.', `{author}, «${NB}{title}${NB}», tiré de {site}.`],
	'intake.view.libraryPoemEdited': ['Based on {author}, «{title}», from {site}.', `D’après {author}, «${NB}{title}${NB}», tiré de {site}.`],
	'intake.poemLibrary.removed': ['Poem removed.', 'Poème retiré.'],
	'intake.poemLibrary.undo': ['Undo', 'Annuler'],
};

describe('the poem library strings', () => {
	it('holds the twelve keys of the brief, in both languages, exactly as drafted', () => {
		expect(Object.keys(DRAFTS)).toHaveLength(12);
		for (const [key, [en, fr]] of Object.entries(DRAFTS)) {
			expect(t(key, 'en'), key).toBe(en);
			expect(t(key, 'fr'), key).toBe(fr);
			expect(hasString(key, 'en') && hasString(key, 'fr'), key).toBe(true);
		}
	});

	it('holds no others under the two prefixes: nothing was added that the brief did not give', () => {
		const ours = stringKeys().filter((k) => k.startsWith('intake.poemLibrary.') || k.startsWith('intake.view.libraryPoem'));
		expect(ours.sort()).toEqual(Object.keys(DRAFTS).sort());
	});

	it('uses no em dash in either language (house style)', () => {
		for (const key of Object.keys(DRAFTS)) for (const lang of ['en', 'fr'] as const) expect(t(key, lang), `${key} ${lang}`).not.toContain('—');
	});

	it('names the same placeholders in both languages', () => {
		const names = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
		for (const [key, [en, fr]] of Object.entries(DRAFTS)) expect(names(fr), key).toEqual(names(en));
	});
});
