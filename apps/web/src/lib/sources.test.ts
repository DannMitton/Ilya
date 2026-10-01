/**
 * The one registry of works (`sources.ts`; brief
 * `docs/sessions/brief-code-guide-sources_r1_2026-09-27.md` §7): every work the
 * app cites by author and year is either registered or named on `OWED`, and a
 * new citation fails here until it is one or the other.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import { OWED, SOURCE_GROUPS, WORKS, fullReference, worksIn } from './sources';
import { ROWS } from './insights/comment-sources';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

/** Where the app prints citations in its own prose. Insights cites through `ROWS`, which can only name a registered work. */
const CITING = [
	'./components/Reading/LearnContent.svelte',
	'./components/Reading/GuideContent.svelte',
	'./i18n.ts',
	'../../../../data/blurb-composer.json'
];

/**
 * Capitalized words the scan meets before a year that are not authors, each
 * with what it is. A new entry here must be as plain as these.
 */
const NOT_AUTHORS: Record<string, string> = {
	Avant: 'French « Avant 1918 », « Avant 1989 »',
	Before: '"Before 1989", the Kiel Convention',
	Kiel: 'the Kiel Convention of the IPA, 1989: an event',
	Finale: 'the Finale software, 2014',
	June: 'a date',
	University: 'a thesis imprint: "University of Washington, 2012"',
	Université: 'a thesis imprint: « Université de Toronto, 2020 »',
	Rachmaninov: 'French for Challis’s Rachmaninoff volume (1989), owed as "Challis 1989"',
	Mitton: 'only as "Mitton 2020", or "arr. Dann Mitton (2017)", the Russian Alphabet Song, which is music, not a work cited'
};

/** "Surname (1983)", "Surname 1980, 8", "Surname, *Title* (Imprint, 2012)", "Surname and Other (1980". */
const CITE =
	/\b([A-Z][a-zà-žA-Z-]+)(?:’s|'s|\\u2019s)?(?:\s+(?:and|et)\s+[A-Z][a-z]+)?(?:,|\s)\s*\(?(?:<em>[^<]{0,80}<\/em>\s*)?\(?(?:[A-Za-z .,]{0,40},\s*)?(1[89]\d\d|20[0-2]\d)\b/g;

function citedPairs(): Set<string> {
	const out = new Set<string>();
	for (const f of CITING) {
		const text = read(f)
			.replace(/<!--[\s\S]*?-->/g, '')
			.replace(/^\s*\/\/.*$/gm, '');
		for (const m of text.matchAll(CITE)) out.add(`${m[1]} ${m[2]}`);
	}
	return out;
}

const registered = new Set(Object.values(WORKS).map((w) => `${w.author.split(' ')[0]} ${w.year}`));

describe('the registry of works', () => {
	it('knows every work the app cites by author and year, or names it as owed', () => {
		const pairs = citedPairs();
		expect(pairs.size).toBeGreaterThan(10); // the scan found the citations it exists for
		const unknown = [...pairs].filter((p) => {
			const [who, year] = p.split(' ');
			if (registered.has(p) || OWED[p]) return false;
			if (who === 'Mitton') return year !== '2020' && year !== '2017';
			return !NOT_AUTHORS[who];
		});
		expect(unknown).toEqual([]);
	});

	it('finds the citations it is meant to find', () => {
		const pairs = citedPairs();
		for (const p of ['Grayson 2012', 'Mitton 2020', 'Richter 2002', 'Montgomery 2021', 'Challis 2006', 'Lindblom 1983'])
			expect(pairs).toContain(p);
	});

	it('owes nothing it already holds', () => {
		for (const p of Object.keys(OWED)) expect(registered.has(p)).toBe(false);
	});

	it('cites only registered works from Insights', () => {
		for (const row of Object.values(ROWS)) expect(WORKS[row.work]).toBeDefined();
	});

	it('puts every work in exactly one of the three groups', () => {
		const listed = SOURCE_GROUPS.flatMap((g) => worksIn(g));
		expect(listed.sort()).toEqual(Object.keys(WORKS).sort());
		for (const g of SOURCE_GROUPS) {
			expect(worksIn(g).length).toBeGreaterThan(0);
			for (const lang of ['en', 'fr'] as const) expect(t(`guide.sources.group.${g}`, lang)).not.toMatch(/MISSING/);
		}
	});
});

describe('a full reference', () => {
	const text = (key: string) => fullReference(key).map((r) => r.text).join('');

	it('prints a thesis with its degree and university', () => {
		expect(text('grayson2012')).toBe(
			'Grayson, Craig M. Russian Lyric Diction: A Practical Guide with Introduction and Annotations and a Bibliography with Annotations on Selected Sources. D.M.A., University of Washington, 2012.'
		);
		expect(text('mitton2020')).toMatch(/D\.M\.A\., University of Toronto, 2020\. https:\/\/hdl\.handle\.net\/1807\/100864\.$/);
	});

	it('prints an article with its title in quotation marks and its journal in italics', () => {
		const runs = fullReference('pacheco2013');
		expect(runs.map((r) => r.text).join('')).toBe(
			'Pacheco, Alberto José Vieira. “Angelica Catalani’s Voice According to a Method of Statistical Analysis.” Journal of Singing 69, no. 5 (2013).'
		);
		expect(runs.find((r) => r.title)?.text).toBe('Journal of Singing');
	});

	it('prints a book as Insights always has', () => {
		expect(text('richter2002')).toBe('Richter, Laurence R. Mussorgsky’s Complete Song Texts. Geneseo, NY: Leyerle Publications, 2002. ISBN 1-878617-31-1.');
		expect(text('reid1975')).toBe('Reid, Cornelius L. Voice: Psyche and Soma. New York: Joseph Patelson Music House, 1975, third printing 1999. ISBN 0-915282-00-3.');
	});
});

/**
 * In French, the OQLF's notice (brief `brief-code-french-references-oqlf_r1_2026-09-30.md`;
 * models read from vitrinelinguistique.oqlf.gouv.qc.ca/23252). The expected
 * values are written from those models, not read back from `fullReference`:
 * surname in capitals, a comma after the title, then edition, place,
 * publisher, and date separated by commas; a thesis as « Thèse (degree) »; an
 * article's title in guillemets and « vol. N, no N ». Titles, names, and
 * publishers stay as published.
 */
describe('a full reference in French', () => {
	const fr = (key: string) => fullReference(key, 'fr').map((r) => r.text).join('');

	it('prints a book as an OQLF notice: a comma between place and publisher', () => {
		expect(fr('reid1975')).toBe('REID, Cornelius L. Voice: Psyche and Soma, New York, Joseph Patelson Music House, 1975, 3e tirage, 1999. ISBN 0-915282-00-3.');
		expect(fr('howell2025')).toBe('HOWELL, Ian. Hearing Singing, Lanham (MD), Rowman & Littlefield, 2025.');
		expect(fr('bozeman2025')).toBe('BOZEMAN, Kenneth. Practical Vocal Acoustics, 2e éd., 2025.');
		expect(fr('mckinney1994')).toBe('McKINNEY, James C. The Diagnosis and Correction of Vocal Faults, Waveland, 1994, réédition, 2005.');
	});

	it('prints a thesis with « Thèse » and its degree', () => {
		expect(fr('grayson2012')).toBe(
			'GRAYSON, Craig M. Russian Lyric Diction: A Practical Guide with Introduction and Annotations and a Bibliography with Annotations on Selected Sources, Thèse (D.M.A.), University of Washington, 2012.'
		);
	});

	it('prints an article with its title in guillemets and its volume and number', () => {
		const runs = fullReference('pacheco2013', 'fr');
		expect(runs.map((r) => r.text).join('')).toBe(
			'PACHECO, Alberto José Vieira. «\u00a0Angelica Catalani’s Voice According to a Method of Statistical Analysis\u00a0», Journal of Singing, vol. 69, no 5, 2013.'
		);
		expect(runs.find((r) => r.title)?.text).toBe('Journal of Singing');
		expect(fr('yanushevskaya2015')).toBe('YANUSHEVSKAYA, Irena, et Daniel BUNČIĆ. «\u00a0Russian\u00a0», Journal of the International Phonetic Association, vol. 45, no 2, 2015.');
	});

	it('keeps every title and publisher as the English prints it, and no colon before a publisher', () => {
		for (const [key, w] of Object.entries(WORKS)) {
			const text = fr(key);
			expect(text, key).toContain(w.fullTitle);
			if (w.publisher) expect(text, key).toContain(w.publisher);
			if (w.publisher) expect(text, key).not.toContain(`: ${w.publisher}`);
		}
	});
});
