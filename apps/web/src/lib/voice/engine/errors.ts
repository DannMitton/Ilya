/**
 * Capture's error tier, split out of `shane/engine/errors.ts` by N.174 D.2.4.
 *
 * The capture layer raises failures the reader's vocabulary cannot name (a
 * microphone permission denial, say), so capture carries its own typed union,
 * discriminated by `code`. Its codes stay globally distinct from the reader's
 * two tiers (`DenigmaError` and `ResourceError`, still in
 * `shane/engine/errors.ts`), so a plain `code` check still tells them apart.
 *
 * Provenance: the two-tier origin (DenigmaError | CaptureError) is Kimi's
 * Phase 3a review §2.4 (2026-06-09), which amended engine spec v1 §9 and §12.
 */

/** Capture-layer errors, raised by a CaptureSession. Unchanged. */
export type CaptureError =
	| { code: 'MIC_PERMISSION_DENIED'; message: string }
	| { code: 'MIC_NOT_FOUND'; message: string }
	| { code: 'NO_AUDIO_INPUT'; message: string }
	| { code: 'SAMPLE_TOO_SHORT'; message: string; actualMs: number; minimumMs: number }
	| { code: 'EXTRACTION_FAILED'; message: string; cause?: unknown }
	| { code: 'CANCELLED'; message: string };

export type CaptureErrorCode = CaptureError['code'];
