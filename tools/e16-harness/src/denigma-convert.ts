/**
 * denigma-convert: headless .musx -> MNX JSON conversion for the E.16 harness.
 *
 * This re-uses the SAME denigma WASM artifact the product ships
 * (`apps/web/static/denigma_wasm_mnx.js` / `.wasm`), loaded read-only from its
 * existing location. It does not modify or duplicate those files.
 *
 * Why this file exists rather than importing `ScoreReader` /
 * `score-reader.worker.ts` directly: those are written against the DOM
 * Worker API (`self`, `postMessage`, a Vite-only dynamic-import specifier
 * for the glue) and are the main-thread/Worker seam for the browser, not a
 * Node-callable function. The malloc / set / call / read / free sequence
 * below is the SAME sequence `score-reader.worker.ts` uses (Patterson's
 * denigma-examples `web/main.js`), just invoked directly in Node instead of
 * inside a Worker.
 *
 * SOURCED (this session, 2026-07-22): the denigma glue is a standard
 * Emscripten build with `ENVIRONMENT_IS_NODE` handling already compiled in
 * (verified by reading the glue's own environment-detection code), so it
 * runs correctly under plain Node with no browser shim, no jsdom, and no
 * Worker polyfill. This was NOT assumed; it was run end-to-end against a
 * real corpus piece before this file was written.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** The minimal denigma WASM surface this module uses (matches score-reader.worker.ts). */
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

const POINTER_SIZE = 4;
const SIZE_T = 'i32';

/** Path to the product's own denigma glue, read-only. Not duplicated here. */
const GLUE_PATH = path.resolve(__dirname, '../../../apps/web/static/denigma_wasm_mnx.js');

let modulePromise: Promise<DenigmaModule> | null = null;

async function loadModule(): Promise<DenigmaModule> {
	if (!modulePromise) {
		modulePromise = (async () => {
			const gluePath = 'file://' + GLUE_PATH;
			const { default: createModule } = (await import(/* @vite-ignore */ gluePath)) as {
				default: DenigmaModuleFactory;
			};
			return createModule({
				print: () => {},
				printErr: (text: string) => console.error('[denigma]', text)
			});
		})();
	}
	return modulePromise;
}

export class DenigmaConversionError extends Error {
	musxPath: string;

	constructor(message: string, musxPath: string) {
		super(message);
		this.name = 'DenigmaConversionError';
		this.musxPath = musxPath;
	}
}

/**
 * Convert a `.musx` file's bytes to MNX JSON text, headless, in Node.
 * Throws `DenigmaConversionError` on a non-zero return code or a WASM abort
 * (the shipped artifact has C++ exception catching disabled, so a malformed
 * score aborts rather than returning a code; this module cannot tell the two
 * apart and does not pretend to, matching the product's own Worker).
 */
export async function musxToMnxJson(musxPath: string): Promise<string> {
	const denigma = await loadModule();
	const bytes = new Uint8Array(readFileSync(musxPath));

	const inputPtr = denigma._denigma_malloc(bytes.byteLength);
	denigma.HEAPU8.set(bytes, inputPtr);

	const outputPtrPtr = denigma._denigma_malloc(POINTER_SIZE);
	const outputSizePtr = denigma._denigma_malloc(POINTER_SIZE);
	const errorPtrPtr = denigma._denigma_malloc(POINTER_SIZE);
	denigma.setValue(outputPtrPtr, 0, '*');
	denigma.setValue(outputSizePtr, 0, SIZE_T);
	denigma.setValue(errorPtrPtr, 0, '*');

	let rc: number;
	try {
		rc = denigma._denigma_musx_to_mnx_json(
			inputPtr,
			bytes.byteLength,
			outputPtrPtr,
			outputSizePtr,
			errorPtrPtr
		);
	} catch (err) {
		throw new DenigmaConversionError(
			`denigma WASM aborted converting ${musxPath}: ${(err as Error).message ?? err}`,
			musxPath
		);
	}

	if (rc !== 0) {
		throw new DenigmaConversionError(`denigma returned non-zero rc=${rc} for ${musxPath}`, musxPath);
	}

	const outPtr = denigma.getValue(outputPtrPtr, '*');
	const outSize = denigma.getValue(outputSizePtr, SIZE_T);
	return Buffer.from(denigma.HEAPU8.slice(outPtr, outPtr + outSize)).toString('utf8');
}
