/**
 * The score reader's guard: which path the recognizer is made for, and the
 * one retry on WebAssembly. homr-web is not run here; `makeReader` takes a
 * fake `choose` (the feature test's answer) and a fake `create` (the
 * recognizer), so every branch is a unit test with no browser.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Recognizer } from 'homr-web';
import { makeReader, withoutCovers, type ReaderDeps } from './homr-reader';
import type { PathChoice, PreferredBackend } from './path-choice';

const PAGE_XML = readFileSync(new URL('./fixtures/tch-1.musicxml', import.meta.url), 'utf8');
const pages = (n: number) => Array.from({ length: n }, () => new Blob(['png'], { type: 'image/png' }));

type Answer = { ok: true; musicXml: string } | { ok: false; error: string; log: string };
const MUSIC: Answer = { ok: true, musicXml: PAGE_XML };
const NOT_MUSIC: Answer = { ok: false, error: 'not_music', log: 'no staves' };
const ENGINE: Answer = { ok: false, error: 'engine_missing', log: 'shader did not compile' };

/** A recognizer that answers each page from `answers` in turn (the last answer repeats). */
function fake(backend: string, answers: Answer[], backendReason = `${backend}: stand-in`) {
	const calls = { pages: 0, disposed: 0 };
	const rec = {
		backend,
		backendReason,
		recognizePage: async () => {
			const a = answers[Math.min(calls.pages, answers.length - 1)];
			calls.pages++;
			return a;
		},
		dispose: async () => void calls.disposed++,
	} as unknown as Recognizer;
	return { rec, calls };
}

/** Deps whose recognizers are made by `make`, which is told which path was asked for. */
function deps(choice: PathChoice, make: (prefer: PreferredBackend) => Promise<Recognizer>) {
	const created: PreferredBackend[] = [];
	let chosen = 0;
	const d: ReaderDeps = {
		choose: async () => (chosen++, choice),
		create: (prefer) => (created.push(prefer), make(prefer)),
	};
	return { d, created, chosenCount: () => chosen };
}

const WEBGPU: PathChoice = { prefer: 'webgpu', reason: null };
const NO_F16: PathChoice = { prefer: 'wasm-threads', reason: 'the WebGPU adapter lacks shader-f16, which the fp16 models need' };

describe('the path the recognizer is made for', () => {
	it('asks for WebGPU where the feature test says so, and reads once', async () => {
		const g = fake('webgpu', [MUSIC]);
		const { d, created } = deps(WEBGPU, async () => g.rec);
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['webgpu']);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.backend).toBe('webgpu');
			expect(result.pathNote).toBeUndefined();
		}
		expect(g.calls.pages).toBe(1);
		expect(g.calls.disposed).toBe(0);
	});

	it('asks for WebAssembly where the adapter lacks shader-f16, and carries the reason', async () => {
		const w = fake('wasm', [MUSIC]);
		const { d, created } = deps(NO_F16, async () => w.rec);
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['wasm-threads']);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.backend).toBe('wasm');
			expect(result.pathNote).toBe(NO_F16.reason);
		}
	});

	it('keeps one recognizer for the session and asks the browser once', async () => {
		const w = fake('wasm', [MUSIC]);
		const { d, created, chosenCount } = deps(NO_F16, async () => w.rec);
		const reader = makeReader(d);
		expect(reader.started()).toBe(false);
		await reader.read(pages(1));
		await reader.read(pages(1));
		expect(created).toHaveLength(1);
		expect(chosenCount()).toBe(1);
		expect(reader.started()).toBe(true);
	});

	it('gives homr-web\'s own reason where it is not on WebGPU and no reason of ours says why', async () => {
		const w = fake('wasm-threads', [MUSIC], 'wasm-threads: navigator.gpu granted no adapter');
		const { d } = deps(WEBGPU, async () => w.rec);
		const result = await makeReader(d).read(pages(1));
		expect(result.ok && result.pathNote).toBe('wasm-threads: navigator.gpu granted no adapter');
	});
});

describe('the one retry on WebAssembly', () => {
	it('reads again on WebAssembly where every page of a WebGPU read is not_music', async () => {
		const g = fake('webgpu', [NOT_MUSIC]);
		const w = fake('wasm', [MUSIC]);
		const { d, created } = deps(WEBGPU, async (prefer) => (prefer === 'webgpu' ? g.rec : w.rec));
		const result = await makeReader(d).read(pages(2));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(g.calls.pages).toBe(2);
		expect(g.calls.disposed).toBe(1);
		expect(w.calls.pages).toBe(2);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.backend).toBe('wasm');
			expect(result.pagesRead).toBe(2);
			expect(result.pathNote).toContain('every page answered not_music');
		}
	});

	it('reads again on WebAssembly where a WebGPU read ends in an engine error', async () => {
		const g = fake('webgpu', [ENGINE]);
		const w = fake('wasm', [MUSIC]);
		const { d, created } = deps(WEBGPU, async (prefer) => (prefer === 'webgpu' ? g.rec : w.rec));
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(g.calls.disposed).toBe(1);
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.pathNote).toContain('error engine_missing');
	});

	it('reads again where the first page is a title page and the second is an engine error (no page read as music)', async () => {
		const g = fake('webgpu', [NOT_MUSIC, ENGINE]);
		const w = fake('wasm', [MUSIC]);
		const { d, created } = deps(WEBGPU, async (prefer) => (prefer === 'webgpu' ? g.rec : w.rec));
		const result = await makeReader(d).read(pages(2));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(result.ok).toBe(true);
	});

	it('does not retry where a WebGPU read found music on some page, even if a later page failed', async () => {
		const g = fake('webgpu', [MUSIC, ENGINE]);
		const { d, created } = deps(WEBGPU, async () => g.rec);
		const result = await makeReader(d).read(pages(2));
		expect(created).toEqual(['webgpu']);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toBe('engine_missing');
	});

	it('answers not_music, with the retry in the log, where WebAssembly also finds no music', async () => {
		const g = fake('webgpu', [NOT_MUSIC]);
		const w = fake('wasm', [NOT_MUSIC]);
		const { d, created } = deps(WEBGPU, async (prefer) => (prefer === 'webgpu' ? g.rec : w.rec));
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe('not_music');
			expect(result.log).toContain('read again on WebAssembly');
		}
	});

	it('never retries a read that ran on WebAssembly, for not_music or for an error', async () => {
		for (const answer of [NOT_MUSIC, ENGINE]) {
			const w = fake('wasm', [answer]);
			const { d, created } = deps(NO_F16, async () => w.rec);
			const result = await makeReader(d).read(pages(2));
			expect(created).toEqual(['wasm-threads']);
			expect(result.ok).toBe(false);
			expect(w.calls.disposed).toBe(0);
		}
	});

	it('never retries a read that asked for WebGPU but ran on WebAssembly (homr-web stepped down itself)', async () => {
		const w = fake('wasm-threads', [NOT_MUSIC]);
		const { d, created } = deps(WEBGPU, async () => w.rec);
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['webgpu']);
		expect(result.ok).toBe(false);
	});

	it('keeps the WebAssembly recognizer for the next scan, and does not ask for WebGPU again', async () => {
		const g = fake('webgpu', [NOT_MUSIC]);
		const w = fake('wasm', [MUSIC]);
		const { d, created, chosenCount } = deps(WEBGPU, async (prefer) => (prefer === 'webgpu' ? g.rec : w.rec));
		const reader = makeReader(d);
		await reader.read(pages(1));
		const again = await reader.read(pages(1));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(chosenCount()).toBe(1);
		expect(g.calls.pages).toBe(1);
		expect(again.ok).toBe(true);
	});

	it('retries only once: a WebAssembly read that fails is not read a third time', async () => {
		const g = fake('webgpu', [ENGINE]);
		const w = fake('wasm', [ENGINE]);
		const { d, created } = deps(WEBGPU, async (prefer) => (prefer === 'webgpu' ? g.rec : w.rec));
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toBe('engine_missing');
	});
});

describe('where a recognizer does not start', () => {
	it('asks for WebAssembly where the WebGPU recognizer did not start', async () => {
		const w = fake('wasm', [MUSIC]);
		const { d, created } = deps(WEBGPU, async (prefer) => {
			if (prefer === 'webgpu') throw new Error('device lost');
			return w.rec;
		});
		const result = await makeReader(d).read(pages(1));
		expect(created).toEqual(['webgpu', 'wasm-threads']);
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.pathNote).toContain('device lost');
	});

	it('answers start_failed where a WebAssembly recognizer does not start, with no second try', async () => {
		const { d, created } = deps(NO_F16, async () => {
			throw new Error('no worker');
		});
		const reader = makeReader(d);
		const result = await reader.read(pages(1));
		expect(created).toEqual(['wasm-threads']);
		expect(result).toMatchObject({ ok: false, error: 'start_failed' });
		expect(reader.started()).toBe(false);
	});
});

describe('a cover in front of the song', () => {
	it('leaves out a page with one staff before the first page with two or more, and keeps every other page', () => {
		// Gurilyov, «Раскаяние»: a title page whose border homr reads as one staff, then two pages of systems.
		expect(withoutCovers(['cover', 'p2', 'p3'], [1, 8, 8])).toEqual(['p2', 'p3']);
		// A single staff after the music has begun is kept.
		expect(withoutCovers(['p1', 'p2', 'end'], [8, 8, 1])).toEqual(['p1', 'p2', 'end']);
		// A song printed on single staves throughout is kept whole.
		expect(withoutCovers(['p1', 'p2'], [1, 1])).toEqual(['p1', 'p2']);
		// A page whose answer does not say is kept.
		expect(withoutCovers(['p1', 'p2'], [null, 8])).toEqual(['p1', 'p2']);
	});

	it('joins the song without the cover and counts the pages read without it', async () => {
		const staves = (n: number) => Array.from({ length: n }, (_, index) => ({ cx: 0.5, cy: 0.1 * (index + 1), h: 0.05, index, w: 0.9 }));
		const COVER = { ok: true, musicXml: PAGE_XML.replace(/<measure /, '<measure data-cover="yes" '), staves: staves(1) } as unknown as Answer;
		const SONG = { ok: true, musicXml: PAGE_XML, staves: staves(6) } as unknown as Answer;
		const g = fake('webgpu', [COVER, SONG]);
		const { d } = deps(WEBGPU, async () => g.rec);
		const result = await makeReader(d).read(pages(2));
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.pagesRead).toBe(1);
			expect(result.pages).toBe(2);
			expect(result.musicXml).not.toContain('data-cover');
		}
	});
});
