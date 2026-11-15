/**
 * THE DEVELOPMENT STUB (N.199 Step 6). With `?capture=stub` in the address on a development server (`import.meta.env.DEV`), the
 * wizard's capture session is `StubCaptureSession` instead of the microphone, so a browser test can run a full tour with no
 * microphone. A production build replaces `import.meta.env.DEV` with false and drops this, as `engine/capture-file.ts` does for its
 * own switch. A test scripts a take through `window.__ilyaStubNext`, an array of outcomes taken one per take.
 */
import { StubCaptureSession, type StubOutcome, type StubReadinessOutcome } from '../engine/stub';
import { LiveCaptureSession } from '../engine/live';
import type { CaptureSession } from '../engine/session';
import { captureFileEnabled, mountRecorderPanel } from '../engine/capture-file';
import { measurePicker } from './measure-switch';

const here = (): string => (typeof location === 'undefined' ? '' : location.search);

export function captureStubOn(search: string = here()): boolean {
	return !!import.meta.env.DEV && new URLSearchParams(search).get('capture') === 'stub';
}

declare global {
	interface Window {
		__ilyaStubNext?: StubOutcome[];
		/** The room the stub's readiness reports (default `clear`); `marginal-snr` raises the room notice (N.199 Step 8, B2). */
		__ilyaStubReadiness?: StubReadinessOutcome;
	}
}

export function captureSessionFor(search: string = here()): CaptureSession {
	// The recorder's panel (`engine/capture-file.ts`): present only where `__ILYA_RECORDER__` is true and `?harness=1` is in the address.
	if (__ILYA_RECORDER__ && captureFileEnabled()) mountRecorderPanel();
	if (!captureStubOn(search)) return new LiveCaptureSession(measurePicker(search));
	return new StubCaptureSession(undefined, (typeof window === 'undefined' ? undefined : window.__ilyaStubReadiness) ?? 'clear', () => (typeof window === 'undefined' ? undefined : window.__ilyaStubNext?.shift()));
}
