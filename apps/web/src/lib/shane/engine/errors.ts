/**
 * Shane engine error model (three tiers).
 *
 * ShaneEngineError = DenigmaError | CaptureError | ResourceError. Each tier owns
 * a real, documented, testable vocabulary; none of these codes is invented to
 * paper over an unknown. The union is discriminated by `code`, and every code is
 * globally distinct, so a plain `code` check is enough to rebuild the typed error
 * after it crosses a Worker postMessage boundary.
 *
 * Provenance:
 * - Two-tier origin (DenigmaError | CaptureError): Kimi's Phase 3a review §2.4
 *   (2026-06-09), which amended engine spec v1 §9 and §12. The live capture layer
 *   raises failures denigma's vocabulary cannot name (a microphone permission
 *   denial, say), so capture carries its own typed union and denigma's stays on
 *   the ingestion path.
 * - Third tier (ResourceError) and the DenigmaError shape below: the WASM
 *   migration (2026-06-14) and the artifact audit (2026-06-17). See the
 *   DenigmaError note for what the prebuilt converter actually emits.
 */

/**
 * Ingestion-side error: `.musx` to MNX conversion on the denigma WASM path.
 *
 * Grounded in the prebuilt artifact, not in an assumed enum. denigma's WASM C ABI
 * returns 0 for success or non-zero for failure plus a message string, but the
 * shipped build has C++ exception catching disabled, so a real conversion failure
 * aborts the module (surfacing as a thrown error) rather than returning that code
 * and message; the aborted instance is unrecoverable and the facade restarts the
 * Worker. There is therefore a single conversion-failure code. The message is a
 * short generic line of our own, since the abort exposes no denigma text, and it
 * is diagnostic-only: user-facing failure is the calibration reset sigla.
 */
export type DenigmaError = { code: 'CONVERSION_FAILED'; message: string };

export type DenigmaErrorCode = DenigmaError['code'];

/** Capture-layer errors, raised by a CaptureSession. Unchanged. */
export type CaptureError =
	| { code: 'MIC_PERMISSION_DENIED'; message: string }
	| { code: 'MIC_NOT_FOUND'; message: string }
	| { code: 'NO_AUDIO_INPUT'; message: string }
	| { code: 'SAMPLE_TOO_SHORT'; message: string; actualMs: number; minimumMs: number }
	| { code: 'EXTRACTION_FAILED'; message: string; cause?: unknown }
	| { code: 'CANCELLED'; message: string };

export type CaptureErrorCode = CaptureError['code'];

/**
 * Environment-limit errors, raised on the conversion path by the ScoreReader
 * facade and its Worker.
 *
 * - WASM_LOAD_FAILED: the denigma WASM module factory rejected on first load
 *   (fetch or instantiate). Drives the "didn't finish loading" first-load copy.
 * - SCORE_TOO_LARGE_FOR_DEVICE: defined but DORMANT in v1. It carries a
 *   suggestedAction for when it can be raised. With the v1 artifact a too-large
 *   score aborts identically to a malformed one (see DenigmaError), so the two
 *   cannot be told apart at the boundary, and an oversized score is reported as
 *   CONVERSION_FAILED. A real trigger needs either a proactive size pre-check or
 *   an exception-enabled WASM rebuild, both deferred to v1.x.
 */
export type ResourceError =
	| { code: 'SCORE_TOO_LARGE_FOR_DEVICE'; message: string; suggestedAction: string }
	| { code: 'WASM_LOAD_FAILED'; message: string };

export type ResourceErrorCode = ResourceError['code'];

/** The full Shane engine error union, discriminated by `code`. */
export type ShaneEngineError = DenigmaError | CaptureError | ResourceError;

export type ShaneEngineErrorCode = ShaneEngineError['code'];
