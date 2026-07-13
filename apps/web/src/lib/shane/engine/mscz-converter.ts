/**
 * MsczConverter: the main-thread facade over webmscore's .mscz conversion.
 *
 * This is the .mscz analogue of ScoreReader (score-reader.ts): the seam the
 * ingest dispatch's `msczConvert` dependency plugs into (ingest.ts §B). It
 * keeps the WorkerScoreReader contract, lazy loading, warm-up, typed errors
 * in the shared vocabulary, component-owned dispose, but it deliberately does
 * NOT own a Worker of its own, where ScoreReader does. Two measured reasons
 * (audited in node_modules/webmscore@1.2.1, 2026-07-13):
 * - webmscore's browser build is already a facade over its own Blob-URL Web
 *   Worker; its main-thread class is thin RPC glue, and every heavy WASM step
 *   runs off the main thread.
 * - Its constructor reads document.baseURI while building that Blob, so it
 *   cannot run inside a Worker of ours without DOM shims plus nested-Worker
 *   support. Wrapping its Worker keeps the same seam shape with one less
 *   thread hop. (Dann ratified this deviation from handover v36 §E.2's
 *   literal wording, 2026-07-13.)
 *
 * Self-hosting (Dann's ruling, 2026-07-13): the module loaded here is a
 * vendored, patched copy of webmscore.cdn.mjs (./vendor/webmscore.js) whose
 * three runtime assets (~17.5 MB) resolve through Vite `?url` imports to our
 * own deploy instead of the jsdelivr CDN. Score bytes never leave the browser
 * on either path; the ruling is about where the library fetches itself from.
 *
 * Behaviour notes, grounded in the sandbox spike (2026-07-13):
 * - Each convert() runs in a fresh webmscore instance (each instance spawns
 *   its own Worker), destroyed hard (destroy(false)) when done. The Node
 *   build crashed with a WASM RuntimeError when a score was loaded after a
 *   destroy() in the same module context, so instances are never reused;
 *   per-conversion isolation also mirrors the denigma restart-on-abort
 *   philosophy. The per-conversion WASM cost is softened by the warm-up
 *   fetch below and the browser HTTP cache.
 * - load() must run with doLayout: true (the default). With doLayout: false,
 *   saveXml() succeeds but silently DROPS the notes and lyrics (verified
 *   empirically against the Node build; the "3x faster" flag is for
 *   metadata/MIDI-only reads).
 * - webmscore's load() transfers the byte buffer to its Worker, detaching
 *   the caller's view, so convert() hands it a copy.
 *
 * Error mapping (ingest.ts's contract for `msczConvert`):
 * - Bytes that are not a readable ZIP: the container pre-check throws
 *   ZipReadError, which the dispatch maps to CONTAINER_UNREADABLE
 *   { container: 'mscz' }.
 * - The module failing to load: WASM_LOAD_FAILED (shared with denigma, so
 *   the uploader reuses its copy).
 * - webmscore failing on the score: CONVERSION_FAILED. Like denigma's, the
 *   message is a short generic diagnostic; user-facing copy is keyed off the
 *   code alone.
 */

import { listZipEntries } from '../ingestion/zip-reader';
import type { DenigmaError, ResourceError } from './errors';

/** Diagnostic-only generic lines; user-facing copy is keyed off the codes. */
const LOAD_FAILURE_MESSAGE = 'The score converter could not be loaded.';
const FAILURE_MESSAGE = 'The score converter could not read this file.';

/**
 * The contract a consumer codes against, shaped to slot straight into
 * IngestDeps.msczConvert: `(bytes, fileName) => Promise<string>` plus the
 * component-owned dispose the uploader already applies to its ScoreReader.
 */
export interface MsczConverter {
	/**
	 * Convert whole-file .mscz bytes to MusicXML text. Resolves with the XML,
	 * or rejects with ZipReadError (unreadable container), WASM_LOAD_FAILED
	 * (module never loaded), or CONVERSION_FAILED (webmscore could not read
	 * the score).
	 */
	convert(bytes: Uint8Array, fileName: string): Promise<string>;
	/** Terminal teardown. The instance is spent after this. */
	dispose(): void;
}

/** The slice of webmscore's API this facade touches (structural, so tests
 *  can inject fakes the way ingest.test.ts injects fake parsers). */
export interface WebMscoreLike {
	load(
		format: 'mscz',
		data: Uint8Array,
		fonts?: Uint8Array[],
		doLayout?: boolean
	): Promise<WebMscoreScoreLike>;
}

export interface WebMscoreScoreLike {
	saveXml(): Promise<string>;
	/** soft: false destroys the whole webmscore Worker context. */
	destroy(soft?: boolean): void;
}

export interface WebMscoreModuleLike {
	default: WebMscoreLike;
	WEBMSCORE_ASSET_URLS: readonly string[];
}

/** The production loader: the vendored, self-hosted browser build. */
const loadVendoredWebmscore = (): Promise<WebMscoreModuleLike> => import('./vendor/webmscore');

export class WebmscoreMsczConverter implements MsczConverter {
	private module: Promise<WebMscoreModuleLike> | null = null;
	/** The synchronous overlap guard: at most one conversion in flight. */
	private busy = false;
	private disposed = false;

	constructor(private readonly loadModule: () => Promise<WebMscoreModuleLike> = loadVendoredWebmscore) {
		this.warm();
	}

	/**
	 * Warm-up, the analogue of ScoreReader's warm Worker: start the module
	 * import immediately, and once it lands, prefetch the three runtime
	 * assets so the first conversion's Worker reads them from the HTTP cache
	 * instead of paying ~17.5 MB at drop time. Failures here are swallowed;
	 * convert() surfaces them properly when it actually needs the module.
	 */
	private warm(): void {
		this.module = this.loadModule();
		this.module
			.then((m) => {
				for (const url of m.WEBMSCORE_ASSET_URLS) {
					void fetch(url).catch(() => {});
				}
			})
			.catch(() => {});
	}

	async convert(bytes: Uint8Array, fileName: string): Promise<string> {
		if (this.disposed) throw new Error('this MsczConverter has been disposed');
		if (this.busy) throw new Error('a conversion is already in progress');
		this.busy = true;
		try {
			// Container pre-check with our own ZIP reader: bytes that are not a
			// readable archive fail here as ZipReadError, which the dispatch
			// maps to CONTAINER_UNREADABLE { container: 'mscz' } (ingest.ts).
			listZipEntries(bytes);

			let mod: WebMscoreModuleLike;
			try {
				mod = await (this.module ?? (this.module = this.loadModule()));
			} catch (err) {
				console.error('[mscz-converter] webmscore failed to load:', err);
				throw { code: 'WASM_LOAD_FAILED', message: LOAD_FAILURE_MESSAGE } satisfies ResourceError;
			}

			let score: WebMscoreScoreLike | null = null;
			try {
				// A copy, not the caller's view: load() transfers the buffer to
				// webmscore's Worker, which would detach `bytes` under ingest.ts.
				score = await mod.default.load('mscz', bytes.slice());
				return await score.saveXml();
			} catch (err) {
				console.error('[mscz-converter] conversion failed for', fileName, err);
				throw { code: 'CONVERSION_FAILED', message: FAILURE_MESSAGE } satisfies DenigmaError;
			} finally {
				// Hard destroy: terminate this conversion's Worker context. Never
				// reuse an instance (see the header note on the reuse crash).
				score?.destroy(false);
			}
		} finally {
			this.busy = false;
		}
	}

	dispose(): void {
		this.disposed = true;
		this.module = null;
		// An in-flight conversion's webmscore instance destroys itself in
		// convert()'s finally, and nothing warm is held between conversions,
		// so there is no Worker of ours to terminate here. Like ScoreReader,
		// dispose mid-conversion is fire-and-forget: the in-flight promise is
		// discarded with the unmounting component.
	}
}
