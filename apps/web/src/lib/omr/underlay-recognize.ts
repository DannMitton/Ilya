/**
 * The reader of the framed rows: tesseract.js with the fine-tuned float model
 * (N.135 stage 2b).
 *
 * The model is `rus_prereform_r2_29000`, in its float form
 * (`rus_prereform_r2_29000.traineddata`, 7,827,478 bytes), read at page
 * segmentation mode 7 (one line). Every path names Ilya's own origin: the
 * defaults of `createWorker` are a CDN, and this stage adds no CDN fetch. The
 * core is named as the file itself, `tesseract-core-simd-lstm.wasm.js`, because
 * the relaxed-SIMD core that tesseract.js picks from a directory aborts on
 * every float model (`docs/memory/ENVIRONMENT.md`, "A FLOAT MODEL LOADS WHEN
 * corePath NAMES THE SIMD CORE FILE"). The call follows the desk's harness
 * (`measure-row82-retrain_2026-10-15/harness/chrome-load-d.mjs`): `gzip: false`
 * (the model is not gzipped), `cacheMethod: 'none'` (the browser's HTTP cache
 * keeps it; `/omr/` is not the service worker's), `workerBlobURL: false`.
 *
 * `createWorker` runs in THE PAGE'S THREAD, and makes its own Worker. It is not
 * nested inside `underlay.worker.ts`: the brief asks that it not be unless
 * the nested form has been measured to load in headless Chromium, and it has
 * not been.
 *
 * Where the files are not served (they are not, until Dann has said yes to the
 * bytes), `createWorker` rejects, the page answers null, and the song is joined
 * as it was. One reader is kept for the session and made again after a failure.
 */
import type { WordBox } from './underlay-page';

/** Where the model and the core are served: under `/omr/`, which the service worker does not touch. */
export const UNDERLAY_BASE = '/omr/models/underlay';
export const UNDERLAY_LANG = 'rus_prereform_r2_29000';
export const UNDERLAY_CORE = 'tesseract-core-simd-lstm.wasm.js';
export const UNDERLAY_WORKER = 'worker.min.js';

/** The paths `createWorker` is given, from an origin. */
export function recognizerPaths(origin: string): { workerPath: string; corePath: string; langPath: string } {
	return {
		workerPath: `${origin}${UNDERLAY_BASE}/${UNDERLAY_WORKER}`,
		corePath: `${origin}${UNDERLAY_BASE}/${UNDERLAY_CORE}`,
		langPath: `${origin}${UNDERLAY_BASE}`,
	};
}

/** The one part of a tesseract.js worker this module uses. */
export interface TesseractLike {
	setParameters(params: Record<string, string>): Promise<unknown>;
	recognize(image: Blob, options: object, output: { blocks: boolean }): Promise<{ data: { blocks: TesseractBlock[] | null } }>;
	terminate(): Promise<unknown>;
}
interface TesseractBlock {
	paragraphs?: { lines?: { words?: { text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }[] }[] }[];
}

/** The words of a recognition's blocks, in the order tesseract gave them. */
export function wordsOf(blocks: TesseractBlock[] | null | undefined): WordBox[] {
	return (blocks ?? []).flatMap((b) => (b.paragraphs ?? []).flatMap((p) => (p.lines ?? []).flatMap((l) => (l.words ?? []).map((w) => ({ text: w.text, x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 })))));
}

/** One reader for the session, made on the first row and made again after a failure. */
export function makeRecognizer(create: () => Promise<TesseractLike>): (row: Blob) => Promise<WordBox[]> {
	let held: Promise<TesseractLike> | null = null;
	return async (row) => {
		if (!held) {
			const mine = create().then(async (w) => {
				await w.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' });
				return w;
			});
			held = mine;
			mine.catch(() => {
				if (held === mine) held = null;
			});
		}
		const worker = await held;
		return wordsOf((await worker.recognize(row, {}, { blocks: true })).data.blocks);
	};
}

/** The reader in the browser: tesseract.js, fetched only when the first row is read. */
export const recognizeRow = makeRecognizer(async () => {
	const { createWorker } = await import('tesseract.js');
	return (await createWorker(UNDERLAY_LANG, 1, {
		...recognizerPaths(location.origin),
		gzip: false,
		cacheMethod: 'none',
		workerBlobURL: false,
	})) as unknown as TesseractLike;
});
