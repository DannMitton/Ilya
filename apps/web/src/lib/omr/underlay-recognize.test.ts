/**
 * The reader of the framed rows: its word boxes, its paths (all of Ilya's own
 * origin), and its one worker per session, made again after a failure. The
 * tesseract.js worker is a fake; the real one is the desk's measure.
 */
import { describe, expect, it } from 'vitest';
import { makeRecognizer, recognizerPaths, startTesseract, wordsOf, UNDERLAY_BASE, UNDERLAY_CORE, UNDERLAY_LANG, type TesseractLike } from './underlay-recognize';

const block = (...texts: string[]) => ({ paragraphs: [{ lines: [{ words: texts.map((text, i) => ({ text, bbox: { x0: i * 10, y0: 1, x1: i * 10 + 8, y1: 9 } })) }] }] });

describe('wordsOf', () => {
	it('flattens blocks, paragraphs, and lines into word boxes in the order given', () => {
		expect(wordsOf([block('а', 'б'), block('в')])).toEqual([
			{ text: 'а', x0: 0, y0: 1, x1: 8, y1: 9 },
			{ text: 'б', x0: 10, y0: 1, x1: 18, y1: 9 },
			{ text: 'в', x0: 0, y0: 1, x1: 8, y1: 9 },
		]);
	});

	it('gives no words for no blocks', () => {
		expect(wordsOf(null)).toEqual([]);
		expect(wordsOf(undefined)).toEqual([]);
		expect(wordsOf([{}])).toEqual([]);
		expect(wordsOf([{ paragraphs: [{}] }])).toEqual([]);
	});
});

describe('recognizerPaths', () => {
	it('names the worker, the core file itself, and the model\'s folder, all on the page\'s own origin', () => {
		const paths = recognizerPaths('https://ilya.example');
		expect(paths).toEqual({
			workerPath: 'https://ilya.example/omr/models/underlay/worker.min.js',
			corePath: 'https://ilya.example/omr/models/underlay/tesseract-core-simd-lstm.wasm.js',
			langPath: 'https://ilya.example/omr/models/underlay',
		});
		expect(Object.values(paths).join(' ')).not.toMatch(/jsdelivr|unpkg|cdn/);
		expect(UNDERLAY_BASE.startsWith('/omr/')).toBe(true);
	});

	it('names the SIMD core file, not a directory, because the relaxed-SIMD core aborts on a float model', () => {
		expect(UNDERLAY_CORE).toBe('tesseract-core-simd-lstm.wasm.js');
		expect(recognizerPaths('').corePath.endsWith('js')).toBe(true);
		expect(UNDERLAY_LANG).toBe('rus_prereform_r2_29000');
	});
});

describe('makeRecognizer', () => {
	function fake() {
		const calls = { created: 0, set: [] as Record<string, string>[], recognized: 0, outputs: [] as object[] };
		const worker: TesseractLike = {
			setParameters: async (p) => void calls.set.push(p),
			recognize: async (_img, _opt, output) => (calls.recognized++, calls.outputs.push(output), { data: { blocks: [block('мир')] } }),
			terminate: async () => {},
		};
		return { calls, create: async () => (calls.created++, worker) };
	}
	const row = new Blob(['png']);

	it('makes one worker for many rows, sets one line at a time, and asks for the word boxes', async () => {
		const f = fake();
		const read = makeRecognizer(f.create);
		await read(row);
		const words = await read(row);
		expect(f.calls.created).toBe(1);
		expect(f.calls.set).toEqual([{ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' }]);
		expect(f.calls.outputs).toEqual([{ blocks: true }, { blocks: true }]);
		expect(words).toEqual([{ text: 'мир', x0: 0, y0: 1, x1: 8, y1: 9 }]);
	});

	it('is made again after a failure to make it, the next time a row is read', async () => {
		let tries = 0;
		const f = fake();
		const read = makeRecognizer(async () => {
			if (++tries === 1) throw new Error('Failed to fetch the model');
			return f.create();
		});
		await expect(read(row)).rejects.toThrow('Failed to fetch the model');
		await Promise.resolve();
		expect(await read(row)).toHaveLength(1);
		expect(tries).toBe(2);
	});

	it('is made again where setting the line fails', async () => {
		let tries = 0;
		const read = makeRecognizer(async () => {
			tries++;
			return { setParameters: async () => { throw new Error('bad'); }, recognize: async () => ({ data: { blocks: null } }), terminate: async () => {} };
		});
		await expect(read(row)).rejects.toThrow('bad');
		await Promise.resolve();
		await expect(read(row)).rejects.toThrow('bad');
		expect(tries).toBe(2);
	});
});

describe('startTesseract', () => {
	const worker = { setParameters: async () => {}, recognize: async () => ({ data: { blocks: null } }), terminate: async () => {} };

	it('starts tesseract.js on the model, the SIMD core file, and the worker of this origin, with the float model\'s options', async () => {
		let seen: unknown[] = [];
		const made = await startTesseract(async (...args) => (seen = args, worker), 'https://ilya.example');
		expect(made).toBe(worker);
		expect(seen).toEqual([
			'rus_prereform_r2_29000',
			1,
			{
				workerPath: 'https://ilya.example/omr/models/underlay/worker.min.js',
				corePath: 'https://ilya.example/omr/models/underlay/tesseract-core-simd-lstm.wasm.js',
				langPath: 'https://ilya.example/omr/models/underlay',
				gzip: false,
				cacheMethod: 'none',
				workerBlobURL: false,
			},
		]);
	});

	it('says where it was looking where tesseract.js rejects with nothing, as it does for a file that is not served', async () => {
		await expect(startTesseract(async () => Promise.reject(undefined), 'https://ilya.example')).rejects.toThrow(
			'tesseract.js did not start from /omr/models/underlay (no reason was given); are worker.min.js, tesseract-core-simd-lstm.wasm.js, and rus_prereform_r2_29000.traineddata served there?',
		);
	});

	it('keeps the reason where tesseract.js gives one', async () => {
		await expect(startTesseract(async () => Promise.reject('Network error while fetching the model'), '')).rejects.toThrow('(Network error while fetching the model)');
	});
});
