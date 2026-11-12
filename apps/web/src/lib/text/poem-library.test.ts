/**
 * The poem library as the app brings it in (poem library, build 1, step 2): its
 * shape check and `loadPoemLibrary`, driven with the three I/O functions it is
 * given. The real committed file is read from `static/data` and must pass.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { decodeOffsets, isPoemLibrary, loadPoemLibrary, poemStoreKey, type PoemEntry, type PoemIO, type PoemLibrary } from './poem-library';

const DATA = join(__dirname, '../../../static/data');

/** letters and delta-coded offsets for a text, by a small independent fold (not the build's code). */
function stream(text: string): { letters: string; at: number[] } {
	let letters = '';
	const at: number[] = [];
	let last = 0;
	for (let i = 0; i < text.length; i += 1) {
		const c = text[i].toLowerCase().replace('й', 'и').replace('ё', 'е');
		if (!/^[а-я]$/.test(c)) continue;
		letters += c;
		at.push(i - last);
		last = i;
	}
	return { letters, at };
}

function entry(over: Partial<PoemEntry> = {}): PoemEntry {
	const textModern = 'Дайте бокалы!\nДайте вина!';
	return {
		id: 'e1',
		work: 'w1',
		title: 'Весёлый час',
		incipit: 'Дайте бокалы!',
		author: 'Алексей Васильевич Кольцов',
		translator: null,
		source: { site: 'Russian Wikisource', url: 'https://ru.wikisource.org/w/index.php?oldid=1' },
		spelling: 'modern',
		verified: false,
		textModern,
		...stream(textModern),
		...over,
	};
}
const library = (...entries: PoemEntry[]): PoemLibrary => ({ version: 1, entries: entries.length ? entries : [entry()] });

const manifest = { poemFiles: ['dictionary.poems.deadbeef.json'], poemHash: 'deadbeef' };

function io(over: Partial<PoemIO> = {}): PoemIO & { fetchFile: ReturnType<typeof vi.fn>; getStored: ReturnType<typeof vi.fn>; setStored: ReturnType<typeof vi.fn> } {
	return {
		fetchFile: vi.fn(async () => new Response(JSON.stringify(library()), { status: 200 })),
		getStored: vi.fn(async () => null),
		setStored: vi.fn(async () => true),
		...over,
	} as never;
}

describe('isPoemLibrary: the check a file passes before the app trusts it', () => {
	it('accepts a well-formed library, a translator, and a pre-reform entry', () => {
		expect(isPoemLibrary(library())).toBe(true);
		expect(isPoemLibrary(library(entry({ translator: 'Фёдор Иванович Тютчев', spelling: 'pre-reform' })))).toBe(true);
	});

	it('refuses anything else', () => {
		expect(isPoemLibrary(null)).toBe(false);
		expect(isPoemLibrary('x')).toBe(false);
		expect(isPoemLibrary({ version: 2, entries: [entry()] })).toBe(false);
		expect(isPoemLibrary({ version: 1, entries: [] })).toBe(false);
		expect(isPoemLibrary({ version: 1 })).toBe(false);
		expect(isPoemLibrary(library(entry({ title: '' })))).toBe(false);
		expect(isPoemLibrary(library(entry({ spelling: 'old' as never })))).toBe(false);
		expect(isPoemLibrary(library(entry({ verified: undefined as never })))).toBe(false);
		expect(isPoemLibrary(library(entry({ verified: 'yes' as never })))).toBe(false);
		expect(isPoemLibrary(library(entry({ translator: 3 as never })))).toBe(false);
		expect(isPoemLibrary(library(entry({ source: { site: 'x' } as never })))).toBe(false);
	});

	it('refuses a map that does not fit its text', () => {
		const good = entry();
		expect(isPoemLibrary(library({ ...good, at: good.at.slice(1) }))).toBe(false); // one offset short
		expect(isPoemLibrary(library({ ...good, at: good.at.map((d, i) => (i === 3 ? d + 500 : d)) }))).toBe(false); // points outside the text
		expect(isPoemLibrary(library({ ...good, at: good.at.map((d, i) => (i === 3 ? -1 : d)) }))).toBe(false);
		expect(isPoemLibrary(library({ ...good, at: good.at.map((d, i) => (i === 3 ? 1.5 : d)) }))).toBe(false);
	});

	it('decodeOffsets restores the offsets the delta-coded map holds', () => {
		const e = entry();
		const offsets = decodeOffsets(e.at);
		expect(offsets).toHaveLength(e.letters.length);
		expect(offsets.map((o) => e.textModern[o].toLowerCase().replace('й', 'и')).join('')).toBe(e.letters);
		expect(decodeOffsets([])).toEqual([]);
	});

	it('the committed file passes the check, and every map in it fits', () => {
		const m = JSON.parse(readFileSync(join(DATA, 'dictionary-manifest.json'), 'utf8'));
		expect(m.poemFiles).toHaveLength(1);
		const file = JSON.parse(readFileSync(join(DATA, m.poemFiles[0]), 'utf8'));
		expect(isPoemLibrary(file)).toBe(true);
		expect(file.entries).toHaveLength(327); // 238 poems (14, then the 224 harvested, lane 45) and 89 arias (row 182)
		for (const e of file.entries as PoemEntry[]) {
			const offsets = decodeOffsets(e.at);
			expect(offsets.every((o) => /[А-Яа-яЁёЙйѢѣІіѲѳѴѵ]/.test(e.textModern[o]))).toBe(true);
		}
	});
});

describe('loadPoemLibrary', () => {
	it('fetches the named file, answers it, and keeps it under poems-<hash>', async () => {
		const deps = io();
		const got = await loadPoemLibrary(manifest, deps);
		expect(got).toEqual({ ...library(), hash: 'deadbeef' }); // the library, and the hash that names it
		expect(deps.fetchFile).toHaveBeenCalledWith('/data/dictionary.poems.deadbeef.json');
		expect(deps.setStored).toHaveBeenCalledWith(poemStoreKey('deadbeef'), library());
		expect(poemStoreKey('deadbeef')).toBe('poems-deadbeef');
	});

	it('reads the copy this device kept before it asks the network (offline start)', async () => {
		const deps = io({ getStored: vi.fn(async () => library()) as never, fetchFile: vi.fn(async () => { throw new TypeError('Failed to fetch'); }) });
		expect(await loadPoemLibrary(manifest, deps)).toEqual({ ...library(), hash: 'deadbeef' });
		expect(deps.getStored).toHaveBeenCalledWith('poems-deadbeef');
		expect(deps.fetchFile).not.toHaveBeenCalled();
	});

	it('does not trust a kept copy that fails the check: it fetches instead', async () => {
		const deps = io({ getStored: vi.fn(async () => ({ version: 1, entries: [{ id: 'x' }] })) as never });
		expect(await loadPoemLibrary(manifest, deps)).toEqual({ ...library(), hash: 'deadbeef' });
		expect(deps.fetchFile).toHaveBeenCalledTimes(1);
	});

	it('answers null, and keeps nothing, when the manifest names no library', async () => {
		for (const m of [{}, { poemFiles: [] }, { poemFiles: ['a.json'] }, { poemHash: 'a' }, { poemFiles: [''], poemHash: 'a' }]) {
			const deps = io();
			expect(await loadPoemLibrary(m, deps)).toBeNull();
			expect(deps.fetchFile).not.toHaveBeenCalled();
		}
	});

	it('answers null on a missing file, a refused one, a malformed one, and a file that fails the check', async () => {
		const bad = async (r: () => Response | Promise<Response>) => {
			const deps = io({ fetchFile: vi.fn(async () => r()) });
			expect(await loadPoemLibrary(manifest, deps)).toBeNull();
			expect(deps.setStored).not.toHaveBeenCalled();
		};
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		await bad(() => new Response('', { status: 404 }));
		await bad(() => new Response('', { status: 500 }));
		await bad(() => new Response('not json', { status: 200 }));
		await bad(() => new Response(JSON.stringify({ version: 1, entries: [{ id: 'x' }] }), { status: 200 }));
		await bad(() => { throw new TypeError('Failed to fetch'); });
		vi.restoreAllMocks();
	});

	it('answers null when IndexedDB throws, rather than throwing', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const deps = io({ getStored: vi.fn(async () => { throw new Error('no idb'); }) as never });
		expect(await loadPoemLibrary(manifest, deps)).toBeNull();
		vi.restoreAllMocks();
	});

	it('does not wait for the write that keeps the file', async () => {
		let release!: () => void;
		const deps = io({ setStored: vi.fn(() => new Promise<boolean>((r) => (release = () => r(true)))) });
		expect(await loadPoemLibrary(manifest, deps)).toEqual({ ...library(), hash: 'deadbeef' });
		release();
	});
});

describe('isPoemLibrary: a libretto entry (row 182, step 1)', () => {
	const opera = {
		composer: 'Tchaikovsky, Pyotr',
		operaRu: 'Пиковая дама',
		operaEn: 'Pique Dame',
		operaFr: 'La Dame de pique',
		characterRu: 'Елецкий',
		characterEn: 'Yeletsky',
		characterFr: 'Yeletski',
		number: "Yeletsky's aria",
		voice: 'baritone',
		librettists: 'Модест Ильич Чайковский',
		literarySource: 'Pushkin, Пиковая дама',
	};

	it('accepts a libretto that carries every opera field, and an entry with no kind', () => {
		expect(isPoemLibrary(library(entry({ kind: 'libretto', opera })))).toBe(true);
		expect(isPoemLibrary(library(entry({ kind: 'poem' })))).toBe(true);
		expect(isPoemLibrary(library(entry()))).toBe(true);
	});

	it('refuses a libretto with no opera, or an opera field missing or empty', () => {
		expect(isPoemLibrary(library(entry({ kind: 'libretto' })))).toBe(false);
		for (const k of Object.keys(opera)) {
			expect(isPoemLibrary(library(entry({ kind: 'libretto', opera: { ...opera, [k]: '' } }))), k).toBe(false);
			const { [k as keyof typeof opera]: _gone, ...rest } = opera;
			expect(isPoemLibrary(library(entry({ kind: 'libretto', opera: rest as never }))), k).toBe(false);
		}
	});

	it('refuses an opera on a poem, and a kind that is neither', () => {
		expect(isPoemLibrary(library(entry({ opera })))).toBe(false);
		expect(isPoemLibrary(library(entry({ kind: 'poem', opera })))).toBe(false);
		expect(isPoemLibrary(library(entry({ kind: 'aria' as never, opera })))).toBe(false);
	});
});
