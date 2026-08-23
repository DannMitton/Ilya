/**
 * N.78: the French display form of composers and poets.
 *
 * Ruled by Dann 2026-08-21: display only. A song stores the English form
 * forever; the French spelling is drawn at the moment of reading and is
 * never written. These tests exist to keep that true.
 *
 * `vitest` never compiles a `.svelte` file, so the storage invariant in
 * `SearchableSelect.svelte` cannot be pinned by mounting the component.
 * The last test reads the component's source and pins the line instead.
 * That is a weaker instrument than a mounted click, and it is the only one
 * this project's test lane has.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
	COMPOSERS,
	POETS,
	formatForPaper,
	formatEntryForDisplay,
	formatNameForPaper,
	formatPersonDisplay,
	personNameForDisplay,
	type PersonEntry,
} from './composers-poets';

const ALL: PersonEntry[] = [...COMPOSERS, ...POETS];

const byLatin = (latin: string): PersonEntry => {
	const entry = ALL.find((e) => e.latin === latin);
	if (!entry) throw new Error(`no entry named ${latin}`);
	return entry;
};

describe('the French column', () => {
	it('carries a French form on 49 of the 62 entries', () => {
		expect(ALL).toHaveLength(62);
		expect(ALL.filter((e) => e.french !== undefined)).toHaveLength(49);
	});

	it('spells every French form as "Surname, Given", like the English', () => {
		for (const e of ALL) {
			if (e.french === undefined) continue;
			expect(e.french, e.latin).toContain(', ');
			expect(e.french.trim(), e.latin).toBe(e.french);
		}
	});

	it('leaves no French form identical to its English form', () => {
		for (const e of ALL) {
			if (e.french === undefined) continue;
			expect(e.french, e.latin).not.toBe(e.latin);
		}
	});

	it('omits the field on the thirteen entries that have no French form', () => {
		const without = ALL.filter((e) => e.french === undefined).map((e) => e.latin);
		expect(without.sort()).toEqual([
			'Akhmatova, Anna',
			'Bulakhov, Pyotr',
			'Cui, César',
			'Galina, Glafira',
			'Goethe, Johann Wolfgang',
			'Golenishchev-Kutuzov, Arseny',
			'Heine, Heinrich',
			'Pasternak, Boris',
			'Rathaus, Daniil',
			'Rubinstein, Anton',
			'Shakespeare, William',
			'Stravinsky, Igor',
			'Titov, Nikolai',
		]);
	});
});

describe('formatEntryForDisplay', () => {
	const mussorgsky = byLatin('Mussorgsky, Modest');

	it('draws the French form in French', () => {
		expect(formatEntryForDisplay(mussorgsky, 'fr')).toBe('Modeste Moussorgski (1839–1881)');
	});

	it('draws the English form in English', () => {
		expect(formatEntryForDisplay(mussorgsky, 'en')).toBe('Modest Mussorgsky (1839–1881)');
	});

	it('falls back to English for an entry with no French form', () => {
		const stravinsky = byLatin('Stravinsky, Igor');
		expect(formatEntryForDisplay(stravinsky, 'fr')).toBe('Igor Stravinsky (1882–1971)');
	});

	it('matches formatForPaper exactly when given no language', () => {
		for (const e of ALL) {
			expect(formatEntryForDisplay(e), e.latin).toBe(formatForPaper(e));
			expect(formatEntryForDisplay(e, 'en'), e.latin).toBe(formatForPaper(e));
		}
	});

	it('keeps a compound given name whole', () => {
		expect(formatEntryForDisplay(byLatin('Tolstoy, Alexei K.'), 'fr'))
			.toBe('Alexis K. Tolstoï (1817–1875)');
	});
});

describe('formatNameForPaper with a language', () => {
	it('draws a stored English name in French on the paper', () => {
		expect(formatNameForPaper('Modest Mussorgsky (1839–1881)', COMPOSERS, 'fr'))
			.toBe('Modeste Moussorgski (1839–1881)');
	});

	it('redraws the same stored name in English with no write between', () => {
		const stored = 'Modest Mussorgsky (1839–1881)';
		expect(formatNameForPaper(stored, COMPOSERS, 'fr')).toBe('Modeste Moussorgski (1839–1881)');
		expect(formatNameForPaper(stored, COMPOSERS, 'en')).toBe(stored);
		expect(stored).toBe('Modest Mussorgsky (1839–1881)');
	});

	it('matches a name stored before this build, in "Surname, Given"', () => {
		expect(formatNameForPaper('Pushkin, Alexander', POETS, 'fr'))
			.toBe('Alexandre Pouchkine (1799–1837)');
	});

	it('matches a name stored in prose order without dates', () => {
		expect(formatNameForPaper('Alexander Pushkin', POETS, 'fr'))
			.toBe('Alexandre Pouchkine (1799–1837)');
	});

	it('draws a custom entry unchanged in both languages', () => {
		const custom = 'Someone Not In The List';
		expect(formatNameForPaper(custom, POETS, 'fr')).toBe(custom);
		expect(formatNameForPaper(custom, POETS, 'en')).toBe(custom);
	});

	it('does not match a French spelling that arrives as a stored value', () => {
		// Storage is English by ruling. A French string in a stored field is a
		// custom entry, and is drawn as typed rather than canonicalized.
		expect(formatNameForPaper('Pouchkine, Alexandre', POETS, 'fr'))
			.toBe('Pouchkine, Alexandre');
	});

	it('returns byte-for-byte what it always did when given no language', () => {
		for (const list of [COMPOSERS, POETS]) {
			for (const e of list) {
				const paper = formatForPaper(e);
				expect(formatNameForPaper(e.latin, list), e.latin).toBe(paper);
				expect(formatNameForPaper(paper, list), e.latin).toBe(paper);
			}
		}
		expect(formatNameForPaper('', COMPOSERS)).toBe('');
		expect(formatNameForPaper('  Anon  ', POETS)).toBe('Anon');
	});
});

describe('personNameForDisplay and formatPersonDisplay', () => {
	it('give the dropdown row and trigger the French spelling in French', () => {
		const pushkin = byLatin('Pushkin, Alexander');
		expect(personNameForDisplay(pushkin, 'fr')).toBe('Pouchkine, Alexandre');
		expect(formatPersonDisplay(pushkin, 'fr')).toBe('Pouchkine, Alexandre (1799–1837)');
	});

	it('are unchanged with no language', () => {
		for (const e of ALL) {
			expect(personNameForDisplay(e), e.latin).toBe(e.latin);
			expect(formatPersonDisplay(e), e.latin).toBe(`${e.latin} (${e.dates})`);
		}
	});
});

describe('the French poet search finds a poet by the French spelling', () => {
	// The predicate SearchableSelect's `filtered` applies, restated here
	// because the component cannot be mounted under vitest.
	const matches = (e: PersonEntry, q: string) =>
		e.latin.toLowerCase().includes(q.toLowerCase()) ||
		e.cyrillic.toLowerCase().includes(q.toLowerCase()) ||
		(e.french?.toLowerCase().includes(q.toLowerCase()) ?? false);

	it('finds Pushkin from "Pouchkine"', () => {
		const hits = POETS.filter((e) => matches(e, 'Pouchkine'));
		expect(hits.map((e) => e.latin)).toEqual(['Pushkin, Alexander']);
	});

	it('still finds Pushkin from "Pushkin" and from the Cyrillic', () => {
		expect(POETS.filter((e) => matches(e, 'Pushkin')).map((e) => e.latin))
			.toEqual(['Pushkin, Alexander']);
		expect(POETS.filter((e) => matches(e, 'Пушкин')).map((e) => e.latin))
			.toEqual(['Pushkin, Alexander']);
	});
});

describe('selecting from the dropdown writes English, whatever the language', () => {
	const source = readFileSync(
		fileURLToPath(new URL('./components/Drawer/SearchableSelect.svelte', import.meta.url)),
		'utf8',
	);

	it('pins selectEntry to formatForPaper, which takes no language', () => {
		expect(source).toContain('onchange(formatForPaper(entry), entry);');
		const body = source.slice(
			source.indexOf('function selectEntry(entry: PersonEntry) {'),
			source.indexOf('function selectCustom()'),
		);
		expect(body).not.toContain('language');
		expect(body).not.toContain('formatEntryForDisplay');
		expect(body).not.toContain('personNameForDisplay');
	});

	it('stores the English form for every entry that has a French one', () => {
		// What `selectEntry` hands to `onchange` is `formatForPaper(entry)`.
		// It carries no language, so one string is written in either, and it
		// is never the string French draws.
		for (const e of ALL) {
			if (e.french === undefined) continue;
			const written = formatForPaper(e);
			expect(written, e.latin).toBe(formatEntryForDisplay(e, 'en'));
			expect(written, e.latin).not.toBe(formatEntryForDisplay(e, 'fr'));
		}
	});

	it('writes the English form for Mussorgsky while French is on screen', () => {
		const mussorgsky = byLatin('Mussorgsky, Modest');
		const written: string[] = [];
		const onchange = (value: string) => { written.push(value); };
		// The component's line, verbatim, with the language pill on French.
		onchange(formatForPaper(mussorgsky));
		expect(formatEntryForDisplay(mussorgsky, 'fr')).toBe('Modeste Moussorgski (1839–1881)');
		expect(written).toEqual(['Modest Mussorgsky (1839–1881)']);
	});
});
