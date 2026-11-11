/**
 * The poem library's strings (poem library, build 1, step 5; step 7, part 4), as Dann ratified them.
 *
 * RATIFIED by Dann 2026-11-03 20:21 (every poem-card, gloss-offer, and TEXT header string), with his rulings D1 to D3 of 20:01:
 * D1, a Russian title or line is quoted in the sentence's own language (English “…”, French « … »); D2, `cardColours`; D3, the site's
 * name per language. The expected values are copied from the brief's table (`brief-code-poem-library-build1_r3_` for the first
 * twelve, `..-step7_r4_` for D1 to D3), not read back out of `i18n.ts`, so this test fails if the table drifts from what he approved.
 * Ratification is approval at that moment (`CONTRACT.md` 11a): when he rules again, the table and this test change together.
 * The French spacing is the OQLF's: a no-break space before a colon, and inside guillemets.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hasString, stringKeys, t } from '$lib/i18n';

const NB = ' ';
const RATIFIED_TABLE: Record<string, [string, string]> = {
	'intake.poemLibrary.cardHeading': ['Ilya found this poem for your song:', `Ilya a trouvé ce poème pour votre chant${NB}:`],
	'intake.poemLibrary.by': ['{author}, translated by {translator}', '{author}, traduit par {translator}'],
	'intake.poemLibrary.passage': ['a passage beginning “{line}”', `un passage commençant par «${NB}{line}${NB}»`],
	'intake.poemLibrary.cardSource': ['From {site}.', 'Tiré de {site}.'],
	'intake.poemLibrary.cardSourceModernized': ['From {site}, in modern spelling.', 'Tiré de {site}, en orthographe moderne.'],
	'intake.poemLibrary.cardColours': ['Coloured words in LYRICS now show where your song departs from this poem.', 'Les mots en couleur du champ PAROLES montrent maintenant où la mise en musique s’écarte de ce poème.'],
	'intake.poemLibrary.notThis': ['Not this poem', 'Pas ce poème'],
	'intake.poemLibrary.keep': ['Keep this poem', 'Conserver ce poème'],
	'intake.view.libraryPoem': ['{author}, “{title}”, from {site}.', `{author}, «${NB}{title}${NB}», tiré de {site}.`],
	'intake.view.libraryPoemEdited': ['Based on {author}, “{title}”, from {site}.', `D’après {author}, «${NB}{title}${NB}», tiré de {site}.`],
	'intake.poemLibrary.removed': ['Poem removed.', 'Poème retiré.'],
	'intake.poemLibrary.undo': ['Undo', 'Annuler'],
	// D3: the site's name per language, looked up by the data's own string (`text/poem-site.ts`)
	'intake.poemLibrary.site.russianWikisource': ['Russian Wikisource', 'Wikisource en russe'],
	// Row 182, ratified by Dann 2026-11-09 22:14: the two other sites the aria texts come from (the French name of the second is coined)
	'intake.poemLibrary.site.operalib': ['operalib.eu', 'operalib.eu'],
	'intake.poemLibrary.site.feb': ['the Fundamental Electronic Library (feb-web.ru)', 'la Bibliothèque électronique fondamentale (feb-web.ru)'],
	// Lane 45 (row 183), ratified by Dann: rvb.ru 2026-11-10 22:40, az.lib.ru 2026-11-10 22:41, ilibrary.ru 2026-11-11
	'intake.poemLibrary.site.rvb': ['the Russian Virtual Library (rvb.ru)', 'la Bibliothèque virtuelle russe (rvb.ru)'],
	'intake.poemLibrary.site.azLib': ['Maxim Moshkov’s Library (az.lib.ru)', 'la Bibliothèque de Maxime Mochkov (az.lib.ru)'],
	'intake.poemLibrary.site.ilibrary': ['ilibrary.ru', 'ilibrary.ru'],
};

describe('the poem library strings', () => {
	it('holds the twelve keys of the brief, the site names of D3 and of row 182, in both languages, exactly as ratified', () => {
		expect(Object.keys(RATIFIED_TABLE)).toHaveLength(18);
		for (const [key, [en, fr]] of Object.entries(RATIFIED_TABLE)) {
			expect(t(key, 'en'), key).toBe(en);
			expect(t(key, 'fr'), key).toBe(fr);
			expect(hasString(key, 'en') && hasString(key, 'fr'), key).toBe(true);
		}
	});

	it('holds no others under the two prefixes: nothing was added that was not ratified', () => {
		const ours = stringKeys().filter((k) => k.startsWith('intake.poemLibrary.') || k.startsWith('intake.view.libraryPoem'));
		expect(ours.sort()).toEqual(Object.keys(RATIFIED_TABLE).sort());
	});

	it('uses no em dash in either language (house style)', () => {
		for (const key of Object.keys(RATIFIED_TABLE)) for (const lang of ['en', 'fr'] as const) expect(t(key, lang), `${key} ${lang}`).not.toContain('—');
	});

	it('names the same placeholders in both languages', () => {
		const names = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
		for (const [key, [en, fr]] of Object.entries(RATIFIED_TABLE)) expect(names(fr), key).toEqual(names(en));
	});
});

import { siteName } from './poem-site';

describe('D3: the site is named in the interface language, by the data’s own string', () => {
	it('prints "Russian Wikisource" in English and « Wikisource en russe » in French', () => {
		expect(siteName('Russian Wikisource', 'en')).toBe('Russian Wikisource');
		expect(siteName('Russian Wikisource', 'fr')).toBe('Wikisource en russe');
	});
	it('prints a site the table does not list as the data has it, in either language', () => {
		expect(siteName('Gutenberg Russian', 'en')).toBe('Gutenberg Russian');
		expect(siteName('Gutenberg Russian', 'fr')).toBe('Gutenberg Russian');
	});
	it('prints the two sites of the arias in both languages, each by its own ratified line (row 182)', () => {
		expect(siteName('operalib.eu', 'en')).toBe('operalib.eu');
		expect(siteName('operalib.eu', 'fr')).toBe('operalib.eu');
		expect(siteName('FEB', 'en')).toBe('the Fundamental Electronic Library (feb-web.ru)');
		expect(siteName('FEB', 'fr')).toBe('la Bibliothèque électronique fondamentale (feb-web.ru)');
		// the sentence around it: "From {site}." and « Tiré de {site}. », with no elision
		expect(t('intake.poemLibrary.cardSource', 'fr').replace('{site}', siteName('FEB', 'fr'))).toBe('Tiré de la Bibliothèque électronique fondamentale (feb-web.ru).');
	});

	it('prints the three sites of the harvested poems, each by its own ratified line, and the card sentence takes no elision (lane 45)', () => {
		expect(siteName('RVB', 'en')).toBe('the Russian Virtual Library (rvb.ru)');
		expect(siteName('RVB', 'fr')).toBe('la Bibliothèque virtuelle russe (rvb.ru)');
		expect(siteName('az.lib.ru', 'en')).toBe('Maxim Moshkov\u2019s Library (az.lib.ru)');
		expect(siteName('az.lib.ru', 'fr')).toBe('la Bibliothèque de Maxime Mochkov (az.lib.ru)');
		expect(siteName('ilibrary.ru', 'en')).toBe('ilibrary.ru');
		expect(siteName('ilibrary.ru', 'fr')).toBe('ilibrary.ru');
		expect(t('intake.poemLibrary.cardSource', 'fr').replace('{site}', siteName('az.lib.ru', 'fr'))).toBe('Tiré de la Bibliothèque de Maxime Mochkov (az.lib.ru).');
		expect(t('intake.poemLibrary.cardSource', 'fr').replace('{site}', siteName('ilibrary.ru', 'fr'))).toBe('Tiré de ilibrary.ru.');
	});

	it('every site the library holds is listed in the table (so no entry prints a data key as its name where a name is ratified)', () => {
		const sites = new Set<string>();
		const lib = JSON.parse(readFileSync(join(__dirname, '../../../../../tools/poems/library.json'), 'utf8'));
		for (const e of lib.entries) sites.add(e.source.site);
		for (const s of sites) {
			for (const lang of ['en', 'fr'] as const) expect(hasString(`intake.poemLibrary.site.${{ 'Russian Wikisource': 'russianWikisource', 'operalib.eu': 'operalib', FEB: 'feb', RVB: 'rvb', 'az.lib.ru': 'azLib', 'ilibrary.ru': 'ilibrary' }[s as string]}`, lang), `${s} ${lang}`).toBe(true);
		}
		expect(siteName('Russian Wikisource', 'fr')).not.toBe('Russian Wikisource');
		expect(siteName('FEB', 'fr')).not.toBe('FEB');
	});
});

describe('the French card quotes with OQLF spaces (step 8, part 4)', () => {
	it('the card component puts a no-break space inside each French guillemet, and none in English', () => {
		const src = readFileSync(join(__dirname, '../components/Drawer/PoemLibraryCard.svelte'), 'utf8');
		expect(src).toContain("language === 'en' ? ['“', '”'] : ['«\\u00a0', '\\u00a0»']");
	});
});
