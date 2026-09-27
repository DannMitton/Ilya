/**
 * Score-reader Worker: denigma .musx to MNX conversion, off the main thread.
 *
 * The denigma WebAssembly module is instantiated ONCE when this Worker starts
 * and kept warm for the Worker's lifetime, so the startup cost is paid once
 * rather than per conversion. The glue is loaded at runtime from the served
 * root (it is NOT bundled by Vite), and it resolves its own `.wasm` beside
 * itself, so `denigma_wasm_mnx.js` and `denigma_wasm_mnx.wasm` must both sit in
 * the static root. The glue keys its environment off `WorkerGlobalScope`, so it
 * loads correctly inside this module Worker. The malloc / set / call / read /
 * free sequence is Patterson's own, taken from his denigma-examples web/main.js
 * and proven by the MNX-versus-CLI diff.
 *
 * Failure reality (verified against the prebuilt artifact, 2026-06-17): the
 * shipped build has C++ exception catching disabled, so a malformed score does
 * not return a code and message. The C++ throw routes to `abort()`, which
 * surfaces here as a thrown `WebAssembly.RuntimeError`, and the aborted instance
 * is unrecoverable. This Worker therefore reports CONVERSION_FAILED and does no
 * further work; the facade terminates it and spawns a fresh one. Frees run only
 * on paths where the module is still alive (success, or a clean non-zero
 * return); on an abort the call throws before any free, and the Worker is
 * discarded, so nothing leaks that outlives the Worker.
 */

import type { DenigmaError, ResourceError } from './errors';

/** main thread to Worker. */
export type ScoreReaderRequest = {
	type: 'convert';
	id: number;
	buffer: ArrayBuffer;
	filename: string;
};

/** Worker to main thread. */
export type ScoreReaderResponse =
	| { type: 'ready' }
	| { type: 'load-error'; error: Extract<ResourceError, { code: 'WASM_LOAD_FAILED' }> }
	| { type: 'result'; id: number; mnx: string }
	| { type: 'error'; id: number; error: DenigmaError };

/** The minimal denigma WASM surface this Worker uses (Patterson's C ABI + glue). */
interface DenigmaModule {
	_denigma_malloc(size: number): number;
	_denigma_free(ptr: number): void;
	_denigma_musx_to_mnx_json(
		inputPtr: number,
		inputSize: number,
		outputPtrPtr: number,
		outputSizePtr: number,
		errorPtrPtr: number
	): number;
	HEAPU8: Uint8Array;
	getValue(ptr: number, type: string): number;
	setValue(ptr: number, value: number, type: string): void;
}

type DenigmaModuleFactory = (options?: {
	print?: (text: string) => void;
	printErr?: (text: string) => void;
}) => Promise<DenigmaModule>;

/**
 * The Worker global. Cast rather than referencing the webworker lib, which
 * conflicts with the DOM lib that the rest of the app's tsconfig pulls in.
 */
interface WorkerScope {
	postMessage(message: ScoreReaderResponse): void;
	onmessage: ((event: MessageEvent<ScoreReaderRequest>) => void) | null;
}
const ctx = self as unknown as WorkerScope;

const POINTER_SIZE = 4;
const SIZE_T = 'i32';

/**
 * Diagnostic-only, and deliberately generic. The user never reads this: a failed
 * conversion resolves to the calibration reset sigla on the main thread. The
 * abort carries no denigma text, so we invent none.
 */
const FAILURE_MESSAGE = 'The score reader could not read this file.';

let denigma: DenigmaModule | null = null;

/** Instantiate the warm module once on startup, then announce readiness. */
void (async () => {
	try {
		// The specifier lives in a variable so Vite's import-analysis treats
		// this as a fully dynamic import and leaves it alone. As a literal,
		// Vite 6 refuses it outright ("Cannot import non-asset file ... inside
		// /public"), @vite-ignore notwithstanding — first surfaced by the
		// first-ever dev-server file drop, 2026-07-13. The glue is served
		// as-is from the static root at runtime, exactly as before; this also
		// removes the §C.4 tsc paths-neutralizer need, since tsc no longer
		// sees a literal specifier to resolve.
		const gluePath = '/denigma_wasm_mnx.js';
		const { default: createModule } = (await import(
			/* @vite-ignore */ gluePath
		)) as { default: DenigmaModuleFactory };
		denigma = await createModule({
			print: () => {},
			printErr: (text) => console.error('[denigma]', text)
		});
		ctx.postMessage({ type: 'ready' });
	} catch (err) {
		ctx.postMessage({
			type: 'load-error',
			error: { code: 'WASM_LOAD_FAILED', message: messageOf(err) }
		});
	}
})();

ctx.onmessage = (event: MessageEvent<ScoreReaderRequest>) => {
	const message = event.data;
	// Ignore anything that is not a conversion request (forward-compatible).
	if (!message || message.type !== 'convert') return;

	const { id, buffer, filename } = message;
	try {
		if (!denigma) throw new Error('module not ready');
		const mnx = convert(denigma, new Uint8Array(buffer));
		ctx.postMessage({ type: 'result', id, mnx });
	} catch (err) {
		// Either a clean non-zero return or, far more often with this artifact, an
		// abort. We cannot tell them apart and do not try; both report the same
		// way, and the facade restarts this Worker on either.
		console.error('[score-reader] conversion failed for', filename, err);
		ctx.postMessage({ type: 'error', id, error: { code: 'CONVERSION_FAILED', message: FAILURE_MESSAGE } });
	}
};

/**
 * Patterson's malloc / set / call / read / free sequence. Throws on failure. On
 * the throwing path where the module is still alive (a clean non-zero return)
 * the allocations are freed first; on an abort the call itself throws before any
 * free, and the Worker is discarded, so nothing leaks that outlives the Worker.
 */
function convert(M: DenigmaModule, bytes: Uint8Array): string {
	const inputPtr = M._denigma_malloc(bytes.byteLength);
	M.HEAPU8.set(bytes, inputPtr);

	const outputPtrPtr = M._denigma_malloc(POINTER_SIZE);
	const outputSizePtr = M._denigma_malloc(POINTER_SIZE);
	const errorPtrPtr = M._denigma_malloc(POINTER_SIZE);
	M.setValue(outputPtrPtr, 0, '*');
	M.setValue(outputSizePtr, 0, SIZE_T);
	M.setValue(errorPtrPtr, 0, '*');

	// May THROW (the artifact aborts on malformed input).
	const rc = M._denigma_musx_to_mnx_json(
		inputPtr,
		bytes.byteLength,
		outputPtrPtr,
		outputSizePtr,
		errorPtrPtr
	);

	if (rc !== 0) {
		const errorPtr = M.getValue(errorPtrPtr, '*');
		if (errorPtr) M._denigma_free(errorPtr);
		M._denigma_free(inputPtr);
		M._denigma_free(outputPtrPtr);
		M._denigma_free(outputSizePtr);
		M._denigma_free(errorPtrPtr);
		throw new Error('denigma returned a non-zero status');
	}

	const outputPtr = M.getValue(outputPtrPtr, '*');
	const outputSize = M.getValue(outputSizePtr, SIZE_T);
	// decode copies the bytes into a JS string, so freeing outputPtr after is safe.
	const mnx = new TextDecoder().decode(M.HEAPU8.subarray(outputPtr, outputPtr + outputSize));

	M._denigma_free(outputPtr);
	M._denigma_free(inputPtr);
	M._denigma_free(outputPtrPtr);
	M._denigma_free(outputSizePtr);
	M._denigma_free(errorPtrPtr);
	return mnx;
}

function messageOf(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}
