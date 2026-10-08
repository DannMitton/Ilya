/**
 * readScanAsScore: where a scan goes after homr has read it, or failed to.
 * homr itself is not run here (it needs a browser, a Worker, and 213 MB of
 * models); `read` stands in for it.
 */
import { describe, expect, it, vi } from 'vitest';
import { readScanAsScore, useIlyaReader, type ScanHooks } from './scan';
import type { OmrReadResult } from './homr-reader';

function hooks() {
	const calls: string[] = [];
	const ingested: File[] = [];
	const h: ScanHooks = {
		busy: (key) => void calls.push(`busy ${key}`),
		ingest: async (f) => {
			calls.push('ingest');
			ingested.push(f);
		},
		poem: async () => void calls.push('poem'),
		fail: () => void calls.push('fail'),
	};
	return { h, calls, ingested };
}

const scan = new File([new Uint8Array([1, 2, 3])], 'tchaikovsky-op38-3.pdf', { type: 'application/pdf' });
const quiet = () => vi.spyOn(console, 'error').mockImplementation(() => {});

describe('readScanAsScore', () => {
	it('ingests the joined MusicXML as a .musicxml file named after the scan', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const { h, calls, ingested } = hooks();
		const read = async (_f: File, _k: 'image' | 'pdf', onProgress?: (p: never) => void): Promise<OmrReadResult> => {
			onProgress?.({ page: 1, pages: 1, stage: 'models', done: 0, total: 9 } as never);
			onProgress?.({ page: 1, pages: 1, stage: 'segment', done: 0, total: 4 } as never);
			onProgress?.({ page: 1, pages: 1, stage: 'staff', done: 1, total: 4 } as never);
			return { ok: true, musicXml: '<score-partwise/>', pagesRead: 3, pages: 3, backend: 'webgpu', durationMs: 1 };
		};
		await readScanAsScore(scan, 'pdf', h, read);
		expect(calls).toEqual(['busy upload.status.preparingReader', 'busy upload.status.readingPage', 'ingest']);
		expect(ingested[0].name).toBe('tchaikovsky-op38-3.musicxml');
		expect(await ingested[0].text()).toBe('<score-partwise/>');
	});

	it('names the path in the console line, with the reason where it is not WebGPU', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		info.mockClear();
		const { h } = hooks();
		const read = async (): Promise<OmrReadResult> => ({
			ok: true,
			musicXml: '<score-partwise/>',
			pagesRead: 1,
			pages: 1,
			backend: 'wasm',
			durationMs: 7,
			pathNote: 'the WebGPU adapter lacks shader-f16, which the fp16 models need',
		});
		await readScanAsScore(scan, 'pdf', h, read);
		expect(info).toHaveBeenCalledWith(
			'[omr] homr read 1 of 1 pages of tchaikovsky-op38-3.pdf in 7 ms on wasm (the WebGPU adapter lacks shader-f16, which the fp16 models need)',
		);
	});

	it('prints no reason in the console line where the read ran on WebGPU', async () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		info.mockClear();
		const { h } = hooks();
		const read = async (): Promise<OmrReadResult> => ({
			ok: true,
			musicXml: '<score-partwise/>',
			pagesRead: 1,
			pages: 1,
			backend: 'webgpu',
			durationMs: 7,
		});
		await readScanAsScore(scan, 'pdf', h, read);
		expect(info).toHaveBeenCalledWith('[omr] homr read 1 of 1 pages of tchaikovsky-op38-3.pdf in 7 ms on webgpu');
	});

	it('tries the poem route where homr finds no music', async () => {
		quiet();
		const { h, calls } = hooks();
		await readScanAsScore(scan, 'pdf', h, async () => ({ ok: false, error: 'not_music', log: '' }));
		expect(calls).toEqual(['busy upload.status.preparingReader', 'poem']);
	});

	it('shows the failure for any other error, and never the poem route', async () => {
		quiet();
		const { h, calls } = hooks();
		await readScanAsScore(scan, 'image', h, async () => ({ ok: false, error: 'engine_missing', log: '' }));
		expect(calls).toEqual(['busy upload.status.preparingReader', 'fail']);
	});
});

describe('the wait drawn on the Paper', () => {
	const recorder = () => {
		const log: string[] = [];
		return {
			log,
			wait: {
				begin: () => log.push('begin'),
				progress: (p: { page: number }) => log.push(`progress ${p.page}`),
				complete: () => log.push('complete'),
				cancel: () => log.push('cancel'),
			},
		};
	};

	it('begins, follows the progress, and completes before the ingest', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const { h } = hooks();
		const { log, wait } = recorder();
		const read = async (_f: File, _k: 'image' | 'pdf', onProgress?: (p: never) => void): Promise<OmrReadResult> => {
			onProgress?.({ page: 1, pages: 2, stage: 'staff', done: 1, total: 4 } as never);
			return { ok: true, musicXml: '<score-partwise/>', pagesRead: 2, pages: 2, backend: 'wasm', durationMs: 1 };
		};
		await readScanAsScore(scan, 'pdf', h, read, wait);
		expect(log).toEqual(['begin', 'progress 1', 'complete']);
	});

	it('is gone at once on the poem route and on a failure', async () => {
		quiet();
		for (const error of ['not_music', 'engine_missing']) {
			const { h } = hooks();
			const { log, wait } = recorder();
			await readScanAsScore(scan, 'pdf', h, async () => ({ ok: false, error, log: '' }) as OmrReadResult, wait);
			expect(log).toEqual(['begin', 'cancel']);
		}
	});
});

describe('useIlyaReader', () => {
	it('is true only for ?reader=ilya', () => {
		expect(useIlyaReader('?reader=ilya')).toBe(true);
		expect(useIlyaReader('?reader=homr')).toBe(false);
		expect(useIlyaReader('')).toBe(false);
	});
});
