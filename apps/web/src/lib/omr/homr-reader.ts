/**
 * The score reader for a scan: homr, run in the browser by homr-web.
 *
 * homr-web (https://github.com/jymen/homr-web, AGPL-3.0) is a dependency of
 * this app in a changed copy, 0.2.0-ilya.2, installed from the packed file
 * `third_party/homr-web/homr-web-0.2.0-ilya.2.tgz`. The copy's source is in
 * `third_party/homr-web/`, because the licence asks that a changed copy carry
 * its source; `CHANGES-ilya.md` there lists every change. The reader asks it
 * for homr's model 465 (`model: '465'`), which reads with that model and with
 * the code of homr's main branch at commit 560ca5c. This module is the only
 * place that imports it, and it imports it with a dynamic `import()`, so the
 * library, OpenCV, and onnxruntime are fetched only after a singer drops a
 * scan.
 *
 * One recognizer is made the first time it is needed and kept for the rest of
 * the session, because making it starts a Worker and loads OpenCV, and the
 * models it downloads on the first page are cached by the browser.
 *
 * THE FAST PATH ONLY WHERE IT WORKS. The recognizer is made with
 * `prefer: 'webgpu'` only where the browser grants a WebGPU adapter that has
 * `shader-f16` (`path-choice.ts`); everywhere else it is made for WebAssembly.
 * A read that ran on WebGPU and found no music on any page (every page
 * `not_music`, or an engine error) is made once more on WebAssembly before
 * the singer is answered, and the recognizer kept for the session is then the
 * WebAssembly one. A read that ran on WebAssembly is never made twice.
 *
 * WHERE THE FILES COME FROM. The models are served by this app under
 * `OMR_MODELS_BASE`, in homr-web's layout `<sha256>/<file name>`;
 * `scripts/fetch-omr-models.mjs` puts them there at `dev` and `build`.
 * onnxruntime's `.wasm` and `.mjs` files are served under `ORT_WASM_BASE`;
 * `scripts/copy-ort-wasm.mjs` copies them from the installed onnxruntime-web.
 */
import type { Progress, Recognizer } from 'homr-web';
import { joinPages } from './join-pages';
import { OMR_MODEL } from './stamp';
import { choosePathFor, type GpuLike, type PathChoice, type PreferredBackend } from './path-choice';

/**
 * Where the models are served. Same origin by default. A deployment that
 * serves them elsewhere sets `PUBLIC_OMR_MODELS_BASE`; that host must answer
 * with CORS headers, because homr's own GitHub release does not.
 */
export const OMR_MODELS_BASE: string =
	(import.meta.env.PUBLIC_OMR_MODELS_BASE as string | undefined) || '/omr/models/';

/** Where onnxruntime-web's `.wasm` and `.mjs` files are served. */
export const ORT_WASM_BASE = '/omr/ort/';

/** Progress of a read of several pages: which page, and homr-web's own stage. */
export interface OmrProgress {
	/** 1-based. */
	page: number;
	pages: number;
	stage: Progress['stage'];
	done: number;
	total: number;
}

export type OmrReadResult =
	| {
			ok: true;
			/** One MusicXML string: the voice part of every page that held music, joined. */
			musicXml: string;
			/** Pages homr read as music, of `pages`. */
			pagesRead: number;
			pages: number;
			backend: string;
			durationMs: number;
			/** Why the read was not on WebGPU (no adapter, no `shader-f16`, or a retry). Absent when it was. For the console only. */
			pathNote?: string;
	  }
	| {
			ok: false;
			/** homr-web's error code (`not_music`, `engine_missing`, ...), or `start_failed`. */
			error: string;
			log: string;
	  };

/** What the reader needs from the outside. Real in the app; fakes in `homr-reader.test.ts`. */
export interface ReaderDeps {
	/** The feature test: which path to ask for, and why it is not WebGPU when it is not. */
	choose(): Promise<PathChoice>;
	/** Makes a recognizer that prefers `prefer`. */
	create(prefer: PreferredBackend): Promise<Recognizer>;
}

/** A recognizer, with why it is not on WebGPU if it was not asked to be. */
interface Held {
	recognizer: Promise<Recognizer>;
	/** What was asked for. */
	prefer: PreferredBackend;
	reason: string | null;
}

/** What one pass over the pages found. */
interface Pass {
	xmls: string[];
	/** The error that stopped the pass, if one did. `not_music` never stops it. */
	failure: { error: string; log: string } | null;
}

export interface Reader {
	read(images: readonly Blob[], onProgress?: (p: OmrProgress) => void): Promise<OmrReadResult>;
	/** True once a recognizer has been made in this session. */
	started(): boolean;
}

const WASM: PreferredBackend = 'wasm-threads';

/** Makes the reader. One per app; tests make their own with fakes. */
export function makeReader(deps: ReaderDeps): Reader {
	let held: Held | null = null;

	function acquire(prefer: PreferredBackend, reason: string | null): Held {
		const recognizer = deps.create(prefer);
		const mine: Held = { recognizer, prefer, reason };
		held = mine;
		// A recognizer that failed to start is not kept, so the next scan tries again.
		recognizer.catch(() => {
			if (held === mine) held = null;
		});
		return mine;
	}

	async function acquireFirst(): Promise<Held> {
		if (held) return held;
		const choice = await deps.choose();
		// Another read may have made one while the browser was being asked.
		return held ?? acquire(choice.prefer, choice.reason);
	}

	async function dispose(mine: Held, rec: Recognizer): Promise<void> {
		if (held === mine) held = null;
		try {
			await rec.dispose();
		} catch {
			// A recognizer that will not dispose is already unusable; the next one is made fresh.
		}
	}

	/**
	 * Reads the pages in order, one at a time (homr-web reads one page at a
	 * time per recognizer). A page homr finds no music on (`not_music`) is
	 * left out. Any other failure stops the pass.
	 */
	async function pass(
		mine: Held,
		rec: Recognizer,
		images: readonly Blob[],
		onProgress?: (p: OmrProgress) => void,
	): Promise<Pass> {
		const xmls: string[] = [];
		for (let i = 0; i < images.length; i++) {
			const result = await rec.recognizePage(images[i], {
				ocr: false,
				onProgress: (p) => onProgress?.({ page: i + 1, pages: images.length, stage: p.stage, done: p.done, total: p.total }),
			});
			if (result.ok) {
				xmls.push(result.musicXml);
				continue;
			}
			if (result.error === 'not_music') continue;
			if (result.error === 'worker_lost') {
				// homr-web's README: a recognizer whose Worker crashed answers only
				// `worker_lost` from then on, so it is disposed and the next scan makes another.
				void dispose(mine, rec);
			}
			return { xmls, failure: { error: result.error, log: result.log } };
		}
		return { xmls, failure: null };
	}

	async function read(images: readonly Blob[], onProgress?: (p: OmrProgress) => void): Promise<OmrReadResult> {
		const t0 = performance.now();
		const message = (err: unknown) => String((err as Error)?.message ?? err);
		let mine = await acquireFirst();
		let note: string | undefined = mine.reason ?? undefined;
		let rec: Recognizer | null = null;
		let startError: unknown = null;
		try {
			rec = await mine.recognizer;
		} catch (err) {
			startError = err;
		}
		// A recognizer that asked for WebGPU and did not start is made again on WebAssembly.
		if (!rec && mine.prefer === 'webgpu') {
			note = `the WebGPU recognizer did not start (${message(startError)}), so WebAssembly was asked for`;
			mine = acquire(WASM, note);
			try {
				rec = await mine.recognizer;
			} catch (err) {
				startError = err;
			}
		}
		if (!rec) {
			return { ok: false, error: 'start_failed', log: `${note ? `${note}; ` : ''}${message(startError)}` };
		}
		let found = await pass(mine, rec, images, onProgress);
		// One retry: a read that ran on WebGPU and found no music on any page is read again on WebAssembly.
		if (found.xmls.length === 0 && rec.backend === 'webgpu') {
			const ended = found.failure ? `error ${found.failure.error}` : 'every page answered not_music';
			note = `the WebGPU read ended with ${ended}, so the pages were read again on WebAssembly`;
			await dispose(mine, rec);
			mine = acquire(WASM, note);
			try {
				rec = await mine.recognizer;
			} catch (err) {
				return { ok: false, error: 'start_failed', log: `${note}; the WebAssembly recognizer did not start: ${message(err)}` };
			}
			found = await pass(mine, rec, images, onProgress);
		}
		if (found.failure) {
			return { ok: false, error: found.failure.error, log: note ? `${found.failure.log} (${note})` : found.failure.log };
		}
		if (found.xmls.length === 0) {
			return { ok: false, error: 'not_music', log: `homr found no music on any page${note ? ` (${note})` : ''}` };
		}
		let musicXml: string;
		try {
			musicXml = joinPages(found.xmls);
		} catch (err) {
			return { ok: false, error: 'join_failed', log: message(err) };
		}
		// Where the path is not WebGPU and no reason of ours says why, homr-web's own reason does.
		if (!note && rec.backend !== 'webgpu') note = rec.backendReason;
		return {
			ok: true,
			musicXml,
			pagesRead: found.xmls.length,
			pages: images.length,
			backend: rec.backend,
			durationMs: Math.round(performance.now() - t0),
			...(note ? { pathNote: note } : {}),
		};
	}

	return { read, started: () => held !== null };
}

const reader = makeReader({
	choose: () => choosePathFor(typeof navigator === 'undefined' ? undefined : (navigator as { gpu?: GpuLike }).gpu),
	create: (prefer) =>
		import('homr-web').then(({ createRecognizer }) =>
			createRecognizer({ baseUrl: OMR_MODELS_BASE, model: OMR_MODEL, prefer, wasmPaths: ORT_WASM_BASE }),
		),
});

/** True once a recognizer has been made in this session. */
export function omrStarted(): boolean {
	return reader.started();
}

/**
 * Reads the pages in order, one at a time, with OCR off, because the notes
 * need none. A page homr finds no music on (`not_music`) is left out, so a
 * title page or a page of text inside a song's PDF does not stop the read.
 * Any other failure stops it, except that a read that ran on WebGPU and
 * found no music on any page is made once more on WebAssembly first. Never
 * rejects.
 */
export function readScanPages(
	images: readonly Blob[],
	onProgress?: (p: OmrProgress) => void,
): Promise<OmrReadResult> {
	return reader.read(images, onProgress);
}
