/**
 * ScoreReader: the main-thread facade over the warm score-reader Worker.
 *
 * This is the seam between Shane and the denigma WASM conversion. Everything
 * below the seam, the Worker, the postMessage protocol, the transferable buffer,
 * and the error rebuild, is hidden here, exactly as StubCaptureSession hides the
 * capture machinery behind CaptureSession. A consumer holds a ScoreReader, calls
 * convert(file), and awaits MNX text or a typed ShaneEngineError.
 *
 * Provenance:
 * - Facade-owns-Worker (Decision 1, Option A) and component-owned lifecycle
 *   (Decision 2): the Shane root component constructs one ScoreReader on mount
 *   and calls dispose() on unmount. The Worker is warm: it is spawned in the
 *   constructor so the module is loading before the first file is dropped.
 * - Protocol (Decision 3): replies are correlated by a monotonic id through a
 *   Map; a ready handshake gates the first conversion; MNX returns as copied
 *   text, since strings are not transferable; teardown mid-conversion is
 *   fire-and-forget and leaves the in-flight promise unsettled.
 * - Abort recovery (artifact audit, 2026-06-17, and Kimi's review): a malformed
 *   score aborts the WASM instance unrecoverably, surfacing as a CONVERSION_FAILED
 *   message from the Worker. On that message the facade rejects the conversion and
 *   swaps in a fresh warm Worker. SCORE_TOO_LARGE_FOR_DEVICE is dormant in v1:
 *   a too-large score aborts identically and is reported as CONVERSION_FAILED.
 * - Overlap is gated at the UI and, as a backstop, by a plain synchronous guard
 *   here: a second convert() while one is in flight throws.
 */

import type { DenigmaError, ResourceError } from './errors';
import type { ScoreReaderRequest, ScoreReaderResponse } from './score-reader.worker';

/**
 * Whether the score reader has loaded successfully at least once this page
 * session. Module-level, so it survives facade teardown: when the user leaves
 * the Shane tab and returns, a new facade and Worker are created, but the
 * first-load copy ("Preparing the score reader. This will only happen once.")
 * is suppressed, because it did already happen once.
 */
let hasLoadedBefore = false;

/** Diagnostic-only generic lines used by the onerror backstop below. */
const FAILURE_MESSAGE = 'The score reader could not read this file.';
const LOAD_FAILURE_MESSAGE = 'The score reader could not be loaded.';

/**
 * The contract a consumer codes against. A stub implementation can land later
 * behind this same interface, the way StubCaptureSession sits behind
 * CaptureSession, to drive the file-drop UI without a real Worker.
 */
export interface ScoreReader {
	/**
	 * Convert a Finale .musx File to MNX JSON text. Resolves with the text, or
	 * rejects with a ShaneEngineError: WASM_LOAD_FAILED if the module never
	 * loaded, CONVERSION_FAILED if the score could not be read.
	 */
	convert(file: File): Promise<string>;
	/** Terminal teardown. Terminates the Worker; the instance is spent after this. */
	dispose(): void;
}

type PendingConversion = {
	resolve: (mnx: string) => void;
	reject: (error: DenigmaError) => void;
};

export class WorkerScoreReader implements ScoreReader {
	/** True once the reader has loaded successfully at least once this session. */
	static get hasLoadedBefore(): boolean {
		return hasLoadedBefore;
	}

	private worker: Worker | null = null;
	private ready: Promise<void> | null = null;
	private readyResolve: (() => void) | null = null;
	private readyReject: ((error: ResourceError) => void) | null = null;
	/** Has the CURRENT Worker posted ready yet (distinct from the session flag). */
	private currentWorkerReady = false;
	/** The synchronous overlap guard: at most one conversion in flight. */
	private busy = false;
	private disposed = false;
	private nextId = 1;
	private readonly pending = new Map<number, PendingConversion>();

	constructor() {
		this.spawn();
	}

	async convert(file: File): Promise<string> {
		if (this.disposed) throw new Error('this ScoreReader has been disposed');
		if (this.busy) throw new Error('a conversion is already in progress');
		this.busy = true;
		try {
			if (!this.worker || !this.ready) this.spawn();
			const worker = this.worker!;
			const ready = this.ready!;
			await ready; // rejects with WASM_LOAD_FAILED if the module never loaded
			const buffer = await file.arrayBuffer(); // transferable; detaches on post
			const id = this.nextId++;
			const request: ScoreReaderRequest = { type: 'convert', id, buffer, filename: file.name };
			return await new Promise<string>((resolve, reject) => {
				this.pending.set(id, { resolve, reject });
				worker.postMessage(request, [buffer]);
			});
		} finally {
			this.busy = false;
		}
	}

	dispose(): void {
		this.disposed = true;
		this.worker?.terminate();
		this.worker = null;
		this.ready = null;
		this.readyResolve = null;
		this.readyReject = null;
		// In-flight conversions are abandoned WITHOUT settling: teardown
		// mid-conversion is fire-and-forget and dispose is terminal (Kimi's
		// review). The unmounting component drops its reference, so the unsettled
		// promise is discarded with it.
		this.pending.clear();
	}

	/** Create a fresh Worker and a fresh ready handshake. Does not tear down any existing one. */
	private spawn(): void {
		this.currentWorkerReady = false;
		this.worker = new Worker(new URL('./score-reader.worker.ts', import.meta.url), {
			type: 'module'
		});
		this.ready = new Promise<void>((resolve, reject) => {
			this.readyResolve = resolve;
			this.readyReject = reject;
		});
		this.worker.onmessage = (event: MessageEvent<ScoreReaderResponse>) =>
			this.handleMessage(event.data);
		this.worker.onerror = () => this.handleWorkerError();
	}

	/** Terminate the current Worker and spawn a fresh warm one. No-op once disposed. */
	private restart(): void {
		if (this.disposed) return;
		this.worker?.terminate();
		this.spawn();
	}

	private handleMessage(message: ScoreReaderResponse): void {
		switch (message.type) {
			case 'ready':
				this.currentWorkerReady = true;
				hasLoadedBefore = true;
				this.readyResolve?.();
				return;
			case 'load-error':
				this.readyReject?.(message.error);
				return;
			case 'result': {
				const entry = this.pending.get(message.id);
				this.pending.delete(message.id);
				entry?.resolve(message.mnx);
				return;
			}
			case 'error': {
				const entry = this.pending.get(message.id);
				this.pending.delete(message.id);
				entry?.reject(message.error);
				// The aborted instance is unrecoverable, so swap in a fresh warm
				// Worker before the next conversion. hasLoadedBefore is already
				// true, so the UI suppresses the first-load copy and the respawn
				// is invisible.
				this.restart();
				return;
			}
			// No default action: unknown messages are ignored, forward-compatibly.
		}
	}

	/**
	 * Backstop only. The Worker turns load and conversion failures into load-error
	 * and error messages itself, so this fires only on an unexpected Worker crash.
	 * Reject whatever is outstanding with the matching tier, then restart.
	 */
	private handleWorkerError(): void {
		if (!this.currentWorkerReady) {
			this.readyReject?.({ code: 'WASM_LOAD_FAILED', message: LOAD_FAILURE_MESSAGE });
		}
		for (const entry of this.pending.values()) {
			entry.reject({ code: 'CONVERSION_FAILED', message: FAILURE_MESSAGE });
		}
		this.pending.clear();
		this.restart();
	}
}
