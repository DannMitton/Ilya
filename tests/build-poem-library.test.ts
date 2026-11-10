import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
	buildPoemFile,
	decodeOffsets,
	encodeOffsets,
	letterStream,
	OPERA_FIELDS,
	operaOf,
	shipEntry,
	textFault,
	workOfOpera,
	withPoemKeys,
} from '../scripts/build-poem-library.mjs';

const root = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf-8');
const library = JSON.parse(read('tools/poems/library.json'));

describe('poem library build: the letter fold (reference_sw_match.py)', () => {
	it('lowercases, folds й ё ѣ і ѳ ѵ, drops ъ, and keeps only а-я', () => {
		expect(letterStream('Дайте бокалы!').letters).toBe('даитебокалы');
		expect(letterStream('ЁЖ Ёлка, Й').letters).toBe('ежелкаи');
		expect(letterStream('Ѣсть, м\u0456ръ, ѳита, ѵижица').letters).toBe('есть' + 'мир' + 'фита' + 'иижица');
		expect(letterStream('объявление').letters).toBe('обявление');
		expect(letterStream('abc 123 — … «»').letters).toBe('');
	});

	it('records, for every letter, the offset of its character in the text', () => {
		const text = 'Дайте бокалы!\nДайте вина!';
		const { letters, offsets } = letterStream(text);
		expect(offsets).toHaveLength(letters.length);
		expect(offsets[0]).toBe(0);
		expect(text[offsets[offsets.length - 1]]).toBe('а');
		for (const o of offsets) expect(/[А-Яа-яЁё]/.test(text[o])).toBe(true);
		expect(offsets.every((o, i) => i === 0 || o > offsets[i - 1])).toBe(true);
	});

	it('delta coding round-trips', () => {
		const { offsets } = letterStream('Весёлый час.\nДайте вина!');
		expect(decodeOffsets(encodeOffsets(offsets))).toEqual(offsets);
		expect(encodeOffsets([5, 6, 8])).toEqual([5, 1, 2]);
		expect(decodeOffsets([])).toEqual([]);
	});
});

describe('poem library build: an entry and the file', () => {
	it('carries exactly the fields the app needs, and none of the rest', () => {
		const e = shipEntry(library.entries[0]);
		expect(Object.keys(e).sort()).toEqual(
			['at', 'author', 'id', 'incipit', 'letters', 'source', 'spelling', 'textModern', 'title', 'translator', 'verified', 'work'].sort(),
		);
		expect(Object.keys(e.source).sort()).toEqual(['site', 'url']);
		expect(e.title).toBe('Весёлый час');
		expect(e.incipit).toBe('Дайте бокалы!');
		expect(e.author).toBe('Алексей Васильевич Кольцов');
		expect(e.translator).toBeNull();
	});

	it('the decoded offsets of every shipped entry point at the letters it ships', () => {
		const file = JSON.parse(buildPoemFile(library).text);
		for (const e of file.entries) {
			const offsets = decodeOffsets(e.at);
			expect(offsets).toHaveLength(e.letters.length);
			const rebuilt = offsets.map((o: number) => letterStream(e.textModern[o]).letters).join('');
			expect(rebuilt).toBe(e.letters);
		}
	});

	it('ships verified: false and the source site for an unverified entry, and verified: true only for a verified one', () => {
		const good = library.entries[0];
		expect(good.verification).toEqual({ state: 'unverified', edition: null, witness: null });
		const shipped = shipEntry(good);
		expect(shipped.verified).toBe(false);
		expect(shipped.source.site).toBe('Russian Wikisource');
		expect(shipEntry({ ...good, verification: { state: 'verified', edition: 'x', witness: 'y' } }).verified).toBe(true);
		// every entry of the library is unverified today, and none is marked otherwise
		for (const e of library.entries) expect(e.verification.state).toBe('unverified');
		for (const e of JSON.parse(buildPoemFile(library).text).entries) expect(e.verified).toBe(false);
	});

	it('refuses a library that is wrong rather than ship it', () => {
		const good = library.entries[0];
		expect(() => shipEntry({ ...good, title: '' })).toThrow(/title/);
		expect(() => shipEntry({ ...good, spelling: 'old' })).toThrow(/spelling/);
		expect(() => shipEntry({ ...good, source: { site: 'x' } })).toThrow(/source/);
		expect(() => shipEntry({ ...good, source: { url: 'https://x' } })).toThrow(/site/);
		expect(() => shipEntry({ ...good, source: { site: '', url: 'https://x' } })).toThrow(/site/);
		expect(() => shipEntry({ ...good, verification: undefined })).toThrow(/verification/);
		expect(() => shipEntry({ ...good, verification: { state: 'checked' } })).toThrow(/verification/);
		expect(() => shipEntry({ ...good, translator: 7 })).toThrow(/translator/);
		expect(() => buildPoemFile({ entries: [] })).toThrow(/no entries/);
		expect(() => buildPoemFile({ entries: [good, good] })).toThrow(/twice/);
	});

	it('is deterministic, and the name is `dictionary.poems.<hash8>.json`', () => {
		const a = buildPoemFile(library);
		const b = buildPoemFile(JSON.parse(JSON.stringify(library)));
		expect(a).toEqual(b);
		expect(a.name).toMatch(/^dictionary\.poems\.[0-9a-f]{8}\.json$/);
		expect(a.name).toBe(`dictionary.poems.${a.hash}.json`);
	});

	it('ships 14 entries of 13 works (the brief says 12; the library holds 13 distinct `work` values)', () => {
		const file = JSON.parse(buildPoemFile(library).text);
		expect(file.entries).toHaveLength(14);
		expect(new Set(file.entries.map((e: { work: string }) => e.work)).size).toBe(13);
	});
});

describe('poem library build: the manifest', () => {
	it('adds poemFiles and poemHash and touches nothing else', () => {
		const before = { version: 'v', hash: 'abc12345', files: ['a', 'b'], glossFiles: ['g'] };
		const after = withPoemKeys(before, 'dictionary.poems.deadbeef.json', 'deadbeef');
		expect(after).toEqual({ ...before, poemFiles: ['dictionary.poems.deadbeef.json'], poemHash: 'deadbeef' });
		expect(after.hash).toBe('abc12345');
		expect(before).not.toHaveProperty('poemFiles');
	});
});

describe('poem library build: the committed data matches a fresh build', () => {
	const built = buildPoemFile(library);
	const manifest = JSON.parse(read('data/dictionary-manifest.json'));

	it('the manifest names the file the library builds', () => {
		expect(manifest.poemFiles).toEqual([built.name]);
		expect(manifest.poemHash).toBe(built.hash);
	});

	it('the file on disk is that build, byte for byte', () => {
		expect(read(`data/${built.name}`)).toBe(built.text);
	});

	it('data/ holds exactly one poem file, so no stale copy is served', () => {
		const files = fs.readdirSync(path.join(root, 'data')).filter((f) => f.startsWith('dictionary.poems.'));
		expect(files).toEqual([built.name]);
	});

	it('the poem file is not one of the dictionary shards, whose keys it would corrupt', () => {
		expect(manifest.files).not.toContain(built.name);
		expect(manifest.glossFiles).not.toContain(built.name);
	});

	it('the service worker leaves the file alone (sw.js:100)', () => {
		const sw = read('apps/web/static/sw.js');
		expect(sw).toContain("if (url.pathname.includes('dictionary.') && url.pathname.endsWith('.json')) return;");
		expect(built.name.includes('dictionary.') && built.name.endsWith('.json')).toBe(true);
	});
});

describe('poem library build: the text check (step 8, part 3)', () => {
	const good = library.entries[0];
	const faults: [string, string][] = [
		['a brace', 'Строка\n.x{margin:0}\nстрока'],
		['a MediaWiki class', 'Строка .mw-parser-output строка'],
		['U+200E', 'Строка\n‎строка'],
		['U+200F', 'Строка‏ строка'],
		['underscores', 'Строка\n\n________\nстрока'],
		['three line breaks', 'Строка\n\n\nстрока'],
		['a Latin letter', 'покаянiем строка'],
		['a digit glued to a letter', 'Строка 1840Москва'],
		['a line number', '5 Про юную пальму все снится ему'],
		['a line number with a plain space', '12 Про юную пальму'],
	];
	for (const [name, text] of faults) {
		it(`refuses ${name}`, () => {
			expect(textFault(text), name).not.toBeNull();
			expect(() => shipEntry({ ...good, textModern: text })).toThrow(/textModern/);
		});
	}

	it('lets a dating line through, one line or two, and the clean library', () => {
		expect(textFault('Строка\n\n8 декабря 1840')).toBeNull();
		expect(textFault('Строка\n\n8 декабря 1840\nМосква')).toBeNull();
		expect(textFault('Строка\n\nФевраль 1837')).toBeNull();
		expect(textFault('Строка\n\n1830')).toBeNull();
		for (const e of library.entries) expect(textFault(e.textModern), e.id).toBeNull();
		expect(() => buildPoemFile(library)).not.toThrow();
	});

	it('the data fixes of this step hold: no stylesheet, marks, heading, or underscores; the dating line has its break; the Latin i is a letter of the edition', () => {
		const by = (id: string) => library.entries.find((e: { id: string }) => e.id === id);
		const heine = by('419e40dd3c');
		expect(heine.textModern).toBe('На севере мрачном, на дикой скале,\nКедр одинокий под снегом белеет,\nИ сладко заснул он в инистой мгле\nИ сон его вьюга лелеет.\n\nПро юную пальму все снится ему,\nЧто̀ в дальних пределах Востока,\nПод пламенным небом, на знойном холму,\nСтоит и цветет одинока…');
		expect(heine.textEdition).not.toMatch(/[{}‎]|\.mw-/);
		expect(by('cb6998d772').textModern.startsWith('На севере дальнем')).toBe(true);
		expect(by('cb6998d772').textEdition.startsWith('На сѣверѣ дальнемъ')).toBe(true);
		expect(by('c1964bc3bd').textModern).not.toContain('________');
		expect(by('c1964bc3bd').textModern).not.toMatch(/\n{3,}/);
		expect(by('87376c1710').textModern.endsWith('8 декабря 1840\nМосква')).toBe(true);
		const hymn = by('298e556367');
		expect(hymn.textModern).toContain('покаянием');
		expect(hymn.textModern).not.toMatch(/[A-Za-z]/);
		expect(hymn.textEdition).toContain('покаянiіемъ'.replace('iі', 'і'));
		expect(hymn.textEdition).not.toMatch(/[A-Za-z]/);
		expect((hymn.textEdition.match(/і/g) ?? []).length).toBe(10);
	});
});

describe('poem library build: a libretto entry (row 182, step 1)', () => {
	const poem = library.entries[0];
	const libretto = {
		...poem,
		id: 'aaaaaaaaaa',
		work: crypto.createHash('md5').update('Пиковая дама'.normalize('NFC')).digest('hex').slice(0, 8),
		kind: 'libretto',
		author: 'Модест Ильич Чайковский',
		provenance: {
			composer: 'Tchaikovsky, Pyotr',
			opera_ru: 'Пиковая дама',
			opera_en: 'Pique Dame',
			character_ru: 'Елецкий',
			character_en: 'Yeletsky',
			role: "Yeletsky's aria",
			voice: 'baritone',
			literary_source: 'Pushkin, Пиковая дама',
			notes: 'x',
		},
	};

	it('ships kind and the opera object, mapped from the provenance, with the entry\'s author as the librettists', () => {
		const e = shipEntry(libretto);
		expect(e.kind).toBe('libretto');
		expect(e.opera).toEqual({
			composer: 'Tchaikovsky, Pyotr',
			operaRu: 'Пиковая дама',
			operaEn: 'Pique Dame',
			characterRu: 'Елецкий',
			characterEn: 'Yeletsky',
			number: "Yeletsky's aria",
			voice: 'baritone',
			literarySource: 'Pushkin, Пиковая дама',
			librettists: 'Модест Ильич Чайковский',
		});
		expect(e.title).toBe(libretto.title); // the literary source is recorded in opera, never stood in for the text
		expect(Object.keys(e)).not.toContain('provenance');
	});

	it('ships a poem exactly as before: no kind, no opera', () => {
		const e = shipEntry(poem);
		expect(e).not.toHaveProperty('kind');
		expect(e).not.toHaveProperty('opera');
		expect(shipEntry({ ...poem, kind: 'poem' })).not.toHaveProperty('kind');
	});

	it('refuses a libretto with no provenance or a missing opera field, and an unknown kind', () => {
		expect(() => shipEntry({ ...libretto, provenance: undefined })).toThrow(/provenance/);
		for (const [, from] of OPERA_FIELDS) {
			expect(() => shipEntry({ ...libretto, provenance: { ...libretto.provenance, [from]: '' } }), from).toThrow(new RegExp(from));
		}
		expect(() => operaOf({ ...libretto, provenance: { ...libretto.provenance, voice: undefined } })).toThrow(/voice/);
		expect(() => shipEntry({ ...poem, kind: 'aria' })).toThrow(/kind/);
	});

	it('row 182 step 2: the work is the opera\'s (first 8 hex of the MD5 of the NFC Russian title), and an id is ten hex digits', () => {
		expect(libretto.work).toBe(workOfOpera('Пиковая дама'));
		expect(workOfOpera('Пиковая дама')).toBe(workOfOpera('Пиковая дама'.normalize('NFD')));
		expect(() => shipEntry({ ...libretto, work: 'bbbbbbbb' })).toThrow(/work/);
		expect(() => shipEntry({ ...libretto, id: 'AAAAAAAAAA' })).toThrow(/id/);
		expect(() => shipEntry({ ...libretto, id: 'aaaaaaaaa' })).toThrow(/id/);
		// a poem's work is not an opera's: nothing checks it
		expect(() => shipEntry(poem)).not.toThrow();
	});
});
