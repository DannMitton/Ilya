/**
 * The recorder (`docs/sessions/brief-code-i-extractor_r1_2026-09-30.md`, step 2;
 * `brief-n110-i-extractor-harness_r1_2026-09-02.md` §2.1 governs its terms; N.200 Step 1,
 * `brief-code-n200-voice-as-it-is_r3_2026-11-14.md`, changes how it is enabled and saved).
 *
 * With `?harness=1` in the address, every calibration take is held in memory: the WAV and a JSON sidecar.
 *   - `ilya-capture-asked-<vowel>-sung-<vowel>-<iso-timestamp>.wav`: 16-bit mono PCM at the engine's sample
 *     rate, holding exactly the buffer `runCapture()` received (the sweep, after `live.ts` trims TRIM_S from
 *     each end). The stretch the extractor saw is `guard.segmentS` in the sidecar, in seconds from the start
 *     of this file.
 *   - the same name with `.json`: the outcome, the guard's verdict, and the extractor's trace (the prior,
 *     the envelope peaks with their prominence, the closed-phase poles, the LPC answer, and what was chosen),
 *     with the asked vowel (`vowel`), the sung vowel (`sung`), the build (`build`), and the picker (`picker`).
 * One tap on the panel's Save button downloads every held take as one ZIP, so the browser sees one
 * download from one gesture, not two files per take fired seconds after the last tap.
 *
 * The sung vowel comes from `&sung=<vowel>` in the address, and the panel's field changes it without a
 * reload (a reload would lose the takes held in memory; the address is kept in step with the field).
 *
 * Two gates. `__ILYA_RECORDER__` (`vite.config.ts`) is true on the development server, and in a build only
 * when `PUBLIC_RECORDER=1` was set for that build, which `vercel.json` does for one branch's deployment. In
 * every other build it is the literal `false`, so the bundler drops this path, and the control does not exist
 * in the singers' bundle. The query flag keeps an ordinary session on the recorder's deployment from holding
 * anything. Nothing is stored in the app, and nothing is sent anywhere: this file holds no network call, and
 * `capture-file.test.ts` checks that.
 */
import type { CaptureOutcome, Picker } from './analyze';
import type { ExtractTrace } from './extract';

export function captureFileEnabled(): boolean {
	if (!__ILYA_RECORDER__ || typeof location === 'undefined') return false;
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

// --- one ZIP, store method (no compression), so nothing is needed from outside ---

const CRC_TABLE = (() => {
	const t = new Uint32Array(256);
	for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
	return t;
})();

export function crc32(b: Uint8Array): number {
	let c = 0xffffffff;
	for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

export interface ZipEntry { name: string; bytes: Uint8Array }

/** A ZIP with each entry stored as is. Names are UTF-8 (general purpose bit 11), so [ɑ] and [ɨ] survive. */
export function zipBytes(entries: readonly ZipEntry[], when: Date = new Date()): Uint8Array {
	const enc = new TextEncoder();
	const time = (when.getHours() << 11) | (when.getMinutes() << 5) | (when.getSeconds() >> 1);
	const date = (((when.getFullYear() - 1980) & 0x7f) << 9) | ((when.getMonth() + 1) << 5) | when.getDate();
	const names = entries.map((e) => enc.encode(e.name));
	let size = 22;
	entries.forEach((e, i) => { size += 30 + names[i].length + e.bytes.length + 46 + names[i].length; });
	const out = new Uint8Array(size), v = new DataView(out.buffer);
	let o = 0;
	const offsets: number[] = [];
	entries.forEach((e, i) => {
		offsets.push(o);
		v.setUint32(o, 0x04034b50, true); v.setUint16(o + 4, 20, true); v.setUint16(o + 6, 0x0800, true);
		v.setUint16(o + 8, 0, true); v.setUint16(o + 10, time, true); v.setUint16(o + 12, date, true);
		v.setUint32(o + 14, crc32(e.bytes), true); v.setUint32(o + 18, e.bytes.length, true); v.setUint32(o + 22, e.bytes.length, true);
		v.setUint16(o + 26, names[i].length, true); v.setUint16(o + 28, 0, true);
		o += 30; out.set(names[i], o); o += names[i].length; out.set(e.bytes, o); o += e.bytes.length;
	});
	const cdStart = o;
	entries.forEach((e, i) => {
		v.setUint32(o, 0x02014b50, true); v.setUint16(o + 4, 20, true); v.setUint16(o + 6, 20, true); v.setUint16(o + 8, 0x0800, true);
		v.setUint16(o + 10, 0, true); v.setUint16(o + 12, time, true); v.setUint16(o + 14, date, true);
		v.setUint32(o + 16, crc32(e.bytes), true); v.setUint32(o + 20, e.bytes.length, true); v.setUint32(o + 24, e.bytes.length, true);
		v.setUint16(o + 28, names[i].length, true); v.setUint32(o + 42, offsets[i], true);
		o += 46; out.set(names[i], o); o += names[i].length;
	});
	v.setUint32(o, 0x06054b50, true); v.setUint16(o + 8, entries.length, true); v.setUint16(o + 10, entries.length, true);
	v.setUint32(o + 12, o - cdStart, true); v.setUint32(o + 16, cdStart, true);
	return out;
}

export interface CaptureRecord {
	/** The vowel the wizard ASKED for. */
	vowel: string;
	sampleRate: number;
	/** Seconds trimmed from each end of the sweep before this buffer. */
	trimS: number;
	/** Which picker made the reading (`?measure=open` selects `open`, `?measure=path` selects `path`), from N.200 Step 3. */
	picker?: Picker;
	/** Milliseconds `runCapture` took on this take, whole, for every picker (N.200 path picker, Step 4). Set by `live.ts`; absent from a record made elsewhere. */
	analysisMs?: number;
	outcome: CaptureOutcome | { outcome: 'threw'; message: string };
	trace: ExtractTrace | null;
}

/** What the panel holds for one take: the two files. */
export interface HeldTake { base: string; wav: Uint8Array; json: string }

const held: HeldTake[] = [];
let savedCount = 0;
let sung: string | null = null;
let sungRead = false;

/** The sung vowel: `&sung=<vowel>` in the address until the panel's field changes it. Null when never stated. */
export function sungVowel(): string | null {
	if (!sungRead) {
		sungRead = true;
		if (typeof location !== 'undefined') sung = new URLSearchParams(location.search).get('sung') || null;
	}
	return sung;
}

export function setSungVowel(v: string | null): void {
	sungRead = true;
	sung = v && v.trim() ? v.trim() : null;
	if (typeof location !== 'undefined' && typeof history !== 'undefined') {
		const u = new URL(location.href);
		if (sung) u.searchParams.set('sung', sung); else u.searchParams.delete('sung');
		history.replaceState(history.state, '', u);
	}
}

/** The file stem for a take: asked and sung, so a pairing is readable in a folder listing. */
export function takeBase(asked: string, sungV: string | null, stamp: string): string {
	return `ilya-capture-asked-${asked}-sung-${sungV ?? 'unstated'}-${stamp}`;
}

/** Holds the take in memory, with its sidecar. Never throws into the capture flow. */
export function holdCapture(y: Float64Array, rec: CaptureRecord): void {
	try {
		const stamp = new Date().toISOString().replace(/[:.]/g, '-');
		const s = sungVowel();
		const base = takeBase(rec.vowel, s, stamp);
		const json = JSON.stringify({ file: `${base}.wav`, samples: y.length, asked: rec.vowel, sung: s, build: __ILYA_BUILD__, picker: rec.picker ?? 'shipped', ...rec }, null, 1);
		held.push({ base, wav: wavBytes(y, rec.sampleRate), json });
		refreshPanel();
	} catch (e) {
		console.warn('[voice-live] capture not held:', e);
	}
}

export function heldCount(): number { return held.length; }

/** Every held take as one ZIP, for one download. */
export function heldZip(): Uint8Array {
	const enc = new TextEncoder();
	return zipBytes(held.flatMap((t) => [{ name: `${t.base}.wav`, bytes: t.wav }, { name: `${t.base}.json`, bytes: enc.encode(t.json) }]));
}

/** One download, called from the Save button's tap. Returns how many takes it holds. */
export function saveAllCaptures(): number {
	if (!held.length) return 0;
	const stamp = new Date().toISOString().replace(/[:.]/g, '-');
	const url = URL.createObjectURL(new Blob([heldZip() as BlobPart], { type: 'application/zip' }));
	const a = document.createElement('a');
	a.href = url; a.download = `ilya-captures-${__ILYA_BUILD__}-${stamp}.zip`; a.style.display = 'none';
	document.body.appendChild(a); a.click(); a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 10000);
	savedCount = held.length;
	refreshPanel();
	return held.length;
}

export function clearHeld(): void { held.length = 0; savedCount = 0; refreshPanel(); }

// --- the panel: a folded tab by default; unfolded, one field for the sung vowel, one Save button, and the picker in use ---
//
// LANE 65, STEP 3 (`docs/sessions/brief-code-lane65-walk-fixes_r2_2026-11-17.md`). The panel used to stand open at the bottom right and, on an
// iPhone at 390 by 844, covered the welcome sheet's Begin, the Home Screen card's button, and the DRAWER bar (Dann's screenshots, 2026-11-17 14:52
// to 14:55). It now rests folded as a vertical tab in the page's right-hand gutter: 14 px wide at the edge of the screen. On the six screens of the
// take path (the welcome sheet, the Home Screen card, the page with the Drawer down, the Drawer up with VOICE open, the wizard's first screen, the
// take screen) no control reaches into that gutter (the widest ends 16 px short of the edge), so the folded tab covers none. The singer unfolds it on
// purpose, and it then covers what it covers until folded again. It folds on every load.
// The face names the picker in use: on 2026-11-17 five takes sung at `?measure=shipped` were read by the path picker, and nobody could see why.

const PANEL_ID = 'ilya-recorder-panel';
/** The folded tab's width, in px: the page's right-hand gutter on a 390 px phone is 16 px at its narrowest. */
export const PANEL_TAB_WIDTH_PX = 14;
/** How far the tab stands above the bottom of the screen, in px: clear of the DRAWER bar (44 px) on a phone. */
export const PANEL_TAB_BOTTOM_PX = 140;

let panelPicker: Picker = 'shipped';

/** The folded tab's words. English only: the panel is a test instrument. */
export function panelFace(picker: Picker, takes: number, unsaved: number): string {
	return `rec \u00b7 ${picker} \u00b7 ${takes}${unsaved > 0 ? '*' : ''}`;
}

function refreshPanel(): void {
	if (typeof document === 'undefined') return;
	const p = document.getElementById(PANEL_ID);
	if (!p) return;
	const save = p.querySelector<HTMLButtonElement>('[data-recorder="save"]');
	const count = p.querySelector<HTMLElement>('[data-recorder="count"]');
	const tab = p.querySelector<HTMLButtonElement>('[data-recorder="tab"]');
	const unsaved = Math.max(0, held.length - savedCount);
	if (save) { save.disabled = held.length === 0; save.style.opacity = held.length === 0 ? '0.5' : '1'; save.textContent = `Save ${held.length} take${held.length === 1 ? '' : 's'}`; }
	if (count) count.textContent = savedCount === held.length && held.length > 0 ? 'all saved' : held.length > savedCount ? `${held.length - savedCount} not saved` : '';
	if (tab) {
		tab.textContent = panelFace(panelPicker, held.length, unsaved);
		tab.style.background = unsaved > 0 ? '#8a5a00' : '#1b1b1b';
		tab.setAttribute('aria-label', `Recorder. Picker ${panelPicker}. ${held.length} take${held.length === 1 ? '' : 's'} held${unsaved > 0 ? `, ${unsaved} not saved` : ''}.`);
	}
}

/** Mounts the recorder's panel once, folded. Only called when `captureFileEnabled()` is true. */
export function mountRecorderPanel(picker: Picker = 'shipped'): void {
	if (typeof document === 'undefined' || document.getElementById(PANEL_ID)) return;
	panelPicker = picker;
	const p = document.createElement('div');
	p.id = PANEL_ID;
	p.setAttribute('role', 'region');
	p.setAttribute('aria-label', 'Recorder');
	// The wrapper takes no touches of its own: only the tab and, when unfolded, the card do.
	p.style.cssText = `position:fixed;right:0;bottom:${PANEL_TAB_BOTTOM_PX}px;z-index:2147483000;display:flex;align-items:flex-end;pointer-events:none;max-width:100vw;font:14px/1.3 system-ui,sans-serif`;
	const card = document.createElement('div');
	card.setAttribute('data-recorder', 'card');
	card.style.cssText = 'display:none;gap:8px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 40px);margin-right:6px;padding:8px 10px;background:#1b1b1b;color:#f2f2f2;border:1px solid #555;border-radius:8px;pointer-events:auto';
	const which = document.createElement('div');
	which.setAttribute('data-recorder', 'picker'); which.textContent = `Picker in use: ${picker}`;
	which.style.cssText = 'flex-basis:100%;font-weight:600';
	const label = document.createElement('label');
	label.textContent = 'Recorder. Sung vowel ';
	const input = document.createElement('input');
	input.type = 'text'; input.maxLength = 2; input.value = sungVowel() ?? ''; input.setAttribute('data-recorder', 'sung');
	input.setAttribute('aria-label', 'Sung vowel');
	input.style.cssText = 'width:3em;font:inherit;text-align:center;padding:4px;border-radius:4px;border:1px solid #777;background:#fff;color:#111';
	input.addEventListener('input', () => setSungVowel(input.value));
	label.appendChild(input);
	const save = document.createElement('button');
	save.type = 'button'; save.setAttribute('data-recorder', 'save');
	save.style.cssText = 'font:inherit;padding:6px 12px;min-height:44px;border-radius:6px;border:1px solid #888;background:#f2f2f2;color:#111;cursor:pointer';
	save.addEventListener('click', () => { saveAllCaptures(); });
	const count = document.createElement('span');
	count.setAttribute('data-recorder', 'count'); count.setAttribute('aria-live', 'polite');
	const fold = document.createElement('button');
	fold.type = 'button'; fold.setAttribute('data-recorder', 'fold'); fold.textContent = 'Fold';
	fold.style.cssText = 'font:inherit;padding:6px 12px;min-height:44px;border-radius:6px;border:1px solid #888;background:transparent;color:#f2f2f2;cursor:pointer';
	card.append(which, label, save, count, fold);
	const tab = document.createElement('button');
	tab.type = 'button'; tab.setAttribute('data-recorder', 'tab'); tab.setAttribute('aria-expanded', 'false');
	tab.style.cssText = `width:${PANEL_TAB_WIDTH_PX}px;height:130px;padding:0;writing-mode:vertical-rl;font:600 10px/${PANEL_TAB_WIDTH_PX}px system-ui,sans-serif;white-space:nowrap;background:#1b1b1b;color:#f2f2f2;border:1px solid #555;border-right:none;border-radius:6px 0 0 6px;pointer-events:auto;cursor:pointer`;
	// `display` is set inline, not through the `hidden` attribute, which an inline `display` would override.
	const setFolded = (folded: boolean) => { card.style.display = folded ? 'none' : 'flex'; tab.setAttribute('aria-expanded', String(!folded)); };
	tab.addEventListener('click', () => setFolded(card.style.display !== 'none'));
	fold.addEventListener('click', () => setFolded(true));
	p.append(card, tab);
	document.body.appendChild(p);
	window.addEventListener('beforeunload', (e) => { if (held.length > savedCount) { e.preventDefault(); e.returnValue = ''; } });
	refreshPanel();
}
