import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
	buildPoemFile,
	decodeOffsets,
	encodeOffsets,
	letterStream,
	shipEntry,
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
			['at', 'author', 'id', 'incipit', 'letters', 'source', 'spelling', 'textModern', 'title', 'translator', 'work'].sort(),
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

	it('refuses a library that is wrong rather than ship it', () => {
		const good = library.entries[0];
		expect(() => shipEntry({ ...good, title: '' })).toThrow(/title/);
		expect(() => shipEntry({ ...good, spelling: 'old' })).toThrow(/spelling/);
		expect(() => shipEntry({ ...good, source: { site: 'x' } })).toThrow(/source/);
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
