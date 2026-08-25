/**
 * PageReader: the main-thread facade over the Pyodide page-reader Worker.
 *
 * N.59. Same seam shape as `ScoreReader` beside it, and for the same reasons:
 * the Worker, the postMessage protocol, the ready handshake, and the error
 * rebuild are hidden here, and a consumer holds a `PageReader`, calls
 * `read(pages, config)`, and awaits a recognized result or a typed error.
 *
 * LAZY, per Ruling E and the N.26 law it cites: the Worker is constructed on
 * the first real picture, never on module load, because Pyodide plus numpy,
 * opencv-python, and matplotlib is the heaviest warm-up in the app and a
 * `.musicxml` drop must not pay for it. `ScoreUploader` owns the lifecycle, the
 * way it already owns denigma's and webmscore's.
 *
 * NOT RESTARTED ON FAILURE, and that is the difference from `ScoreReader`. The
 * denigma artifact aborts unrecoverably on a bad score, so its facade swaps in
 * a fresh Worker. A Python exception leaves the interpreter intact, so a failed
 * read here costs nothing and the next read runs in the same warm Worker. If a
 * read ever does corrupt the interpreter, the symptom is a second failure, not
 * a silent wrong answer.
 */

import type {
	ClefKeyProbe,
	PageReadConfig,
	PageReaderError,
	PageReaderRequest,
	PageReaderResponse,
	RecognizedRead,
} from './page-reader.worker';

export type { ClefKeyProbe, PageReadConfig, PageReaderError, RecognizedRead };

/**
 * Whether the page reader has loaded successfully at least once this page
 * session. Module-level, so it survives facade teardown, matching
 * `WorkerScoreReader.hasLoadedBefore`: the first-load copy is shown once.
 */
let hasLoadedBefore = false;

const LOAD_FAILURE_MESSAGE = 'The page reader could not be loaded.';
const FAILURE_MESSAGE = 'The page reader could not read this picture.';

export interface PageReader {
	/**
	 * Read one or more page images, in order, ctx-chained so measure numbering
	 * is continuous across them. Rejects with a `PageReaderError`.
	 */
	read(pages: ArrayBuffer[], config: PageReadConfig): Promise<RecognizedRead>;
	/**
	 * N.97. What one page PRINTS for a clef and a key signature, so the intake
	 * prompt can ask the singer to confirm rather than to answer blind.
	 *
	 * RESOLVES WITH null RATHER THAN REJECTING when the page cannot be read. A
	 * probe that fails costs the prompt its pre-fill and nothing else, and the
	 * singer answers the way they always did.
	 */
	probe(page: ArrayBuffer): Promise<ClefKeyProbe | null>;
	dispose(): void;
}

type PendingRead = {
	resolve: (read: RecognizedRead) => void;
	reject: (error: PageReaderError) => void;
};

type PendingProbe = {
	resolve: (probe: ClefKeyProbe | null) => void;
};

export class WorkerPageReader implements PageReader {
	static get hasLoadedBefore(): boolean {
		return hasLoadedBefore;
	}

	/** Seconds the last successful warm-up took. Reported in the read report. */
	static loadSeconds: number | null = null;

	private worker: Worker | null = null;
	private ready: Promise<void> | null = null;
	private readyResolve: (() => void) | null = null;
	private readyReject: ((error: PageReaderError) => void) | null = null;
	private currentWorkerReady = false;
	private busy = false;
	private disposed = false;
	private nextId = 1;
	private readonly pending = new Map<number, PendingRead>();
	private readonly probing = new Map<number, PendingProbe>();

	constructor() {
		this.spawn();
	}

	async read(pages: ArrayBuffer[], config: PageReadConfig): Promise<RecognizedRead> {
		if (this.disposed) throw new Error('this PageReader has been disposed');
		if (this.busy) throw new Error('a read is already in progress');
		this.busy = true;
		try {
			if (!this.worker || !this.ready) this.spawn();
			const worker = this.worker!;
			await this.ready!;
			const id = this.nextId++;
			const request: PageReaderRequest = { type: 'read', id, pages, config };
			return await new Promise<RecognizedRead>((resolve, reject) => {
				this.pending.set(id, { resolve, reject });
				// The page buffers are transferred, so the caller must not hold
				// them afterwards. The uploader reads its bytes fresh each time.
				worker.postMessage(request, pages);
			});
		} finally {
			this.busy = false;
		}
	}

	async probe(page: ArrayBuffer): Promise<ClefKeyProbe | null> {
		if (this.disposed) return null;
		try {
			if (!this.worker || !this.ready) this.spawn();
			const worker = this.worker!;
			await this.ready!;
			const id = this.nextId++;
			const request: PageReaderRequest = { type: 'probe', id, page };
			return await new Promise<ClefKeyProbe | null>((resolve) => {
				this.probing.set(id, { resolve });
				// Transferred, like the read's pages: the caller reads its bytes
				// fresh and must not hold this buffer afterwards.
				worker.postMessage(request, [page]);
			});
		} catch {
			// A Worker that will not load is the READ's problem to report, and it
			// will report it a moment later with its own message. Here it is only
			// a prompt that asks instead of confirming.
			return null;
		}
	}

	dispose(): void {
		this.disposed = true;
		this.worker?.terminate();
		this.worker = null;
		this.ready = null;
		this.readyResolve = null;
		this.readyReject = null;
		// In-flight reads are abandoned WITHOUT settling, matching ScoreReader:
		// teardown mid-read is fire-and-forget and dispose is terminal.
		this.pending.clear();
		// A probe is settled with null instead, because its caller is waiting to
		// show a prompt and an unsettled promise there is a prompt that never
		// appears. Nothing depends on the value, so null is the honest answer.
		for (const entry of this.probing.values()) entry.resolve(null);
		this.probing.clear();
	}

	private spawn(): void {
		this.currentWorkerReady = false;
		this.worker = new Worker(new URL('./page-reader.worker.ts', import.meta.url), {
			type: 'module',
		});
		this.ready = new Promise<void>((resolve, reject) => {
			this.readyResolve = resolve;
			this.readyReject = reject;
		});
		this.worker.onmessage = (event: MessageEvent<PageReaderResponse>) =>
			this.handleMessage(event.data);
		this.worker.onerror = () => this.handleWorkerError();
	}

	private handleMessage(message: PageReaderResponse): void {
		switch (message.type) {
			case 'ready':
				this.currentWorkerReady = true;
				hasLoadedBefore = true;
				WorkerPageReader.loadSeconds = message.loadSeconds;
				this.readyResolve?.();
				return;
			case 'load-error':
				this.readyReject?.(message.error);
				return;
			case 'result': {
				const entry = this.pending.get(message.id);
				this.pending.delete(message.id);
				entry?.resolve(message.read);
				return;
			}
			case 'probe-result': {
				const entry = this.probing.get(message.id);
				this.probing.delete(message.id);
				entry?.resolve(message.probe);
				return;
			}
			case 'error': {
				const entry = this.pending.get(message.id);
				this.pending.delete(message.id);
				entry?.reject(message.error);
				return;
			}
		}
	}

	/** Backstop only: the Worker reports its own failures as typed messages. */
	private handleWorkerError(): void {
		if (!this.currentWorkerReady) {
			this.readyReject?.({ code: 'READER_LOAD_FAILED', message: LOAD_FAILURE_MESSAGE });
		}
		for (const entry of this.pending.values()) {
			entry.reject({ code: 'READ_FAILED', message: FAILURE_MESSAGE });
		}
		this.pending.clear();
		for (const entry of this.probing.values()) entry.resolve(null);
		this.probing.clear();
	}
}
