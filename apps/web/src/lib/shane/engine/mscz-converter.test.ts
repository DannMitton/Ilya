/**
 * WebmscoreMsczConverter facade tests (handover v36 §E.6).
 *
 * The webmscore module arrives through the injected loader, the same seam
 * style as ingest.test.ts's fake parsers, so no module mocking is needed and
 * the real vendored build (Workers, WASM, DOM) never loads in this
 * environment. What is under test is the facade's contract: the container
 * pre-check, the error mapping into the shared vocabulary, the copy-not-
 * transfer handoff, hard per-conversion destroy, the overlap guard, and the
 * warm-up prefetch.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	WebmscoreMsczConverter,
	type WebMscoreModuleLike,
	type WebMscoreScoreLike,
} from './mscz-converter';
import { ZipReadError } from '../ingestion/zip-reader';
import { buildZip, utf8 } from '../ingestion/zip-fixture';

/** A minimal, genuinely readable ZIP so the container pre-check passes. */
const validContainer = (): Promise<Uint8Array> =>
	buildZip([{ name: 'score.mscx', data: utf8('<museScore/>') }]);

interface FakeOptions {
	xml?: string;
	loadError?: Error;
	saveXmlError?: Error;
	/** Resolve manually, for in-flight tests. */
	holdLoad?: boolean;
	assetUrls?: readonly string[];
}

function makeFake(options: FakeOptions = {}) {
	const destroy = vi.fn<(soft?: boolean) => void>();
	let releaseLoad: (() => void) | null = null;
	const load = vi.fn(
		async (
			_format: 'mscz',
			_data: Uint8Array,
			_fonts?: Uint8Array[],
			_doLayout?: boolean
		): Promise<WebMscoreScoreLike> => {
			if (options.holdLoad) {
				await new Promise<void>((resolve) => {
					releaseLoad = resolve;
				});
			}
			if (options.loadError) throw options.loadError;
			return {
				saveXml: async () => {
					if (options.saveXmlError) throw options.saveXmlError;
					return options.xml ?? '<score-partwise/>';
				},
				destroy,
			};
		}
	);
	const module: WebMscoreModuleLike = {
		default: { load },
		WEBMSCORE_ASSET_URLS: options.assetUrls ?? [],
	};
	return {
		module,
		load,
		destroy,
		loader: vi.fn(async () => module),
		release: () => releaseLoad?.(),
	};
}

const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('WebmscoreMsczConverter', () => {
	it('converts a readable container to MusicXML text', async () => {
		const fake = makeFake({ xml: '<score-partwise version="3.1"/>' });
		const converter = new WebmscoreMsczConverter(fake.loader);
		const xml = await converter.convert(await validContainer(), 'aria.mscz');
		expect(xml).toBe('<score-partwise version="3.1"/>');
		expect(fake.load).toHaveBeenCalledTimes(1);
	});

	it('hands webmscore a copy of the bytes, never the caller view (load() transfers its buffer)', async () => {
		const fake = makeFake();
		const converter = new WebmscoreMsczConverter(fake.loader);
		const bytes = await validContainer();
		await converter.convert(bytes, 'aria.mscz');
		const received = fake.load.mock.calls[0][1];
		expect(received).not.toBe(bytes);
		expect(received.buffer).not.toBe(bytes.buffer);
		expect(Array.from(received)).toEqual(Array.from(bytes));
	});

	it('never passes doLayout: false (it silently drops notes and lyrics from saveXml)', async () => {
		const fake = makeFake();
		const converter = new WebmscoreMsczConverter(fake.loader);
		await converter.convert(await validContainer(), 'aria.mscz');
		expect(fake.load.mock.calls[0][3]).not.toBe(false);
	});

	it('hard-destroys the per-conversion instance on success (destroy(false))', async () => {
		const fake = makeFake();
		const converter = new WebmscoreMsczConverter(fake.loader);
		await converter.convert(await validContainer(), 'aria.mscz');
		expect(fake.destroy).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('rejects unreadable bytes with ZipReadError before webmscore is asked anything', async () => {
		const fake = makeFake();
		const converter = new WebmscoreMsczConverter(fake.loader);
		await expect(converter.convert(utf8('not a zip at all'), 'broken.mscz')).rejects.toBeInstanceOf(
			ZipReadError
		);
		expect(fake.load).not.toHaveBeenCalled();
	});

	it('maps a module that never loads to WASM_LOAD_FAILED', async () => {
		const loader = vi.fn(async (): Promise<WebMscoreModuleLike> => {
			throw new Error('network down');
		});
		const converter = new WebmscoreMsczConverter(loader);
		await expect(converter.convert(await validContainer(), 'aria.mscz')).rejects.toMatchObject({
			code: 'WASM_LOAD_FAILED',
		});
	});

	it('maps a webmscore load failure to CONVERSION_FAILED', async () => {
		const fake = makeFake({ loadError: new Error('corrupt score') });
		const converter = new WebmscoreMsczConverter(fake.loader);
		await expect(converter.convert(await validContainer(), 'aria.mscz')).rejects.toMatchObject({
			code: 'CONVERSION_FAILED',
		});
	});

	it('maps a saveXml failure to CONVERSION_FAILED and still hard-destroys the instance', async () => {
		const fake = makeFake({ saveXmlError: new Error('export failed') });
		const converter = new WebmscoreMsczConverter(fake.loader);
		await expect(converter.convert(await validContainer(), 'aria.mscz')).rejects.toMatchObject({
			code: 'CONVERSION_FAILED',
		});
		expect(fake.destroy).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('guards overlap: a second convert() while one is in flight throws synchronously', async () => {
		const fake = makeFake({ holdLoad: true });
		const converter = new WebmscoreMsczConverter(fake.loader);
		const bytes = await validContainer();
		const first = converter.convert(bytes, 'one.mscz');
		await flushMicrotasks(); // let the first conversion reach the held load
		await expect(converter.convert(bytes, 'two.mscz')).rejects.toThrow(
			'a conversion is already in progress'
		);
		fake.release();
		await expect(first).resolves.toBe('<score-partwise/>');
	});

	it('is terminal after dispose()', async () => {
		const fake = makeFake();
		const converter = new WebmscoreMsczConverter(fake.loader);
		converter.dispose();
		await expect(converter.convert(await validContainer(), 'aria.mscz')).rejects.toThrow(
			'disposed'
		);
	});

	it('warms on construction: imports the module and prefetches the runtime assets', async () => {
		const fetchStub = vi.fn(async (_url: string) => new Response(''));
		vi.stubGlobal('fetch', fetchStub);
		const fake = makeFake({ assetUrls: ['/assets/a.wasm', '/assets/b.data', '/assets/c.wasm'] });
		const converter = new WebmscoreMsczConverter(fake.loader);
		await flushMicrotasks();
		expect(fake.loader).toHaveBeenCalledTimes(1);
		expect(fetchStub.mock.calls.map((c) => c[0])).toEqual([
			'/assets/a.wasm',
			'/assets/b.data',
			'/assets/c.wasm',
		]);
		converter.dispose();
	});

	it('swallows warm-up failures; convert() surfaces them as typed errors instead', async () => {
		const loader = vi.fn(async (): Promise<WebMscoreModuleLike> => {
			throw new Error('offline');
		});
		// Construction must not throw or leave an unhandled rejection behind.
		const converter = new WebmscoreMsczConverter(loader);
		await flushMicrotasks();
		await expect(converter.convert(await validContainer(), 'aria.mscz')).rejects.toMatchObject({
			code: 'WASM_LOAD_FAILED',
		});
	});
});
