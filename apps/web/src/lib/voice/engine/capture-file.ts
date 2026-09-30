/**
 * The dev-only capture file (`docs/sessions/brief-code-i-extractor_r1_2026-09-30.md`, step 2;
 * `brief-n110-i-extractor-harness_r1_2026-09-02.md` §2.1 governs its terms).
 *
 * On the dev server, with `?harness=1` in the address, every calibration take downloads two
 * files to the browser's download folder:
 *   - `ilya-capture-<vowel>-<iso-timestamp>.wav`: 16-bit mono PCM at the engine's sample rate,
 *     holding exactly the buffer `runCapture()` received (the sweep, after `live.ts` trims
 *     TRIM_S from each end). The stretch the extractor saw is `guard.segmentS` in the sidecar,
 *     in seconds from the start of this file.
 *   - the same name with `.json`: the outcome, the guard's verdict, and the extractor's trace
 *     (the prior, the envelope peaks with their prominence, the closed-phase poles, the LPC
 *     answer, and what was chosen).
 *
 * Why both gates. `import.meta.env.DEV` is false in every production build, so the bundler drops
 * this path and the control does not exist in a normal build. The query flag keeps an ordinary
 * dev session from downloading anything. Nothing is stored in the app, and nothing is sent anywhere.
 */
import type { CaptureOutcome } from './analyze';
import type { ExtractTrace } from './extract';

export function captureFileEnabled(): boolean {
	if (!import.meta.env.DEV || typeof location === 'undefined') return false;
	return new URLSearchParams(location.search).get('harness') === '1';
}

/** 16-bit mono PCM WAV, samples clipped to [-1, 1]. */
export function wavBytes(y: ArrayLike<number>, sr: number): Uint8Array {
	const n = y.length, out = new Uint8Array(44 + 2 * n), v = new DataView(out.buffer);
	const tag = (o: number, s: string) => { for (let i = 0; i < 4; i++) out[o + i] = s.charCodeAt(i); };
	tag(0, 'RIFF'); v.setUint32(4, 36 + 2 * n, true); tag(8, 'WAVE');
	tag(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
	v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
	tag(36, 'data'); v.setUint32(40, 2 * n, true);
	for (let i = 0; i < n; i++) {
		const s = Math.max(-1, Math.min(1, y[i]));
		v.setInt16(44 + 2 * i, Math.round(s < 0 ? s * 0x8000 : s * 0x7fff), true);
	}
	return out;
}

function download(name: string, bytes: Uint8Array | string, type: string): void {
	const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type }));
	const a = document.createElement('a');
	a.href = url; a.download = name; a.style.display = 'none';
	document.body.appendChild(a); a.click(); a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export interface CaptureRecord {
	vowel: string;
	sampleRate: number;
	/** Seconds trimmed from each end of the sweep before this buffer. */
	trimS: number;
	outcome: CaptureOutcome | { outcome: 'threw'; message: string };
	trace: ExtractTrace | null;
}

/** Downloads the WAV and its sidecar. Never throws into the capture flow. */
export function saveCapture(y: Float64Array, rec: CaptureRecord): void {
	try {
		const stamp = new Date().toISOString().replace(/[:.]/g, '-');
		const base = `ilya-capture-${rec.vowel}-${stamp}`;
		download(`${base}.wav`, wavBytes(y, rec.sampleRate), 'audio/wav');
		download(`${base}.json`, JSON.stringify({ file: `${base}.wav`, samples: y.length, ...rec }, null, 1), 'application/json');
	} catch (e) {
		console.warn('[voice-live] capture file not saved:', e);
	}
}
