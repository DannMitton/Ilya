/**
 * The N.200 scoring tool's core (`docs/sessions/brief-code-n200-voice-as-it-is_r3_2026-11-14.md`, Step 2). Pure code, no app change.
 *
 * It reads the recorder's files (`engine/capture-file.ts`: a WAV and its JSON sidecar per take) and, for each take:
 *   1. runs the buffer through `runCapture` (`engine/analyze.ts`), because the guard's stretch and the detector decide what the
 *      extractor sees and the status the reading gets;
 *   2. dumps every candidate the picker could choose from: envelope peaks with prominence and level, closed-phase poles with
 *      bandwidth, so picking rules can be compared offline without new recordings;
 *   3. reads fR1 and fR2 again with an independent method (Burg LPC, `tools/i-extractor-check/burg.py`, which shares no code with the
 *      app), or takes Dann's own reading from `reference.csv` in the folder, because the stored readings come from the picker under
 *      suspicion;
 *   4. writes one table: file, asked, sung, each picker's fR1 and fR2, status, the evidence marks, and the reference.
 *
 * There are two pickers, `shipped` (the prior-led picker the app has used) and `open` (N.200 Step 3).
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCapture, type CaptureOutcome } from '$lib/voice/engine/analyze';
import { ltasEnvExport, type ExtractTrace } from '$lib/voice/engine/extract';
import { findPeaks } from '$lib/voice/engine/dsp';
import type { Vowel } from '$lib/voice/engine/types';
import type { ClosedPhaseResult } from '$lib/voice/engine/closed-phase';

const here = path.dirname(fileURLToPath(import.meta.url));
export const BURG_PY = path.resolve(here, '../i-extractor-check/burg.py');

/** The pass bars of Step 4: per resonance, against the independent reference. */
export const BAR_F1 = 0.10, BAR_F2 = 0.12;

// --- WAV ---

/** 16-bit mono PCM, the recorder's format (`wavBytes`). Samples are scaled as `wavBytes` wrote them. */
export function decodeWav(b: Uint8Array): { sr: number; y: Float64Array } {
	const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
	const tag = (o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
	if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') throw new Error('not a WAV');
	let o = 12, sr = 0, bits = 0, ch = 0;
	while (o + 8 <= b.length) {
		const id = tag(o), size = v.getUint32(o + 4, true);
		if (id === 'fmt ') { ch = v.getUint16(o + 10, true); sr = v.getUint32(o + 12, true); bits = v.getUint16(o + 22, true); }
		if (id === 'data') {
			if (bits !== 16 || ch !== 1) throw new Error(`expected 16-bit mono, got ${bits}-bit, ${ch} channels`);
			const n = Math.min(size, b.length - o - 8) >> 1, y = new Float64Array(n);
			for (let i = 0; i < n; i++) { const s = v.getInt16(o + 8 + 2 * i, true); y[i] = s < 0 ? s / 0x8000 : s / 0x7fff; }
			return { sr, y };
		}
		o += 8 + size + (size & 1);
	}
	throw new Error('no data chunk');
}

// --- candidates ---

export interface EnvPeak { f: number; promDb: number; levelDb: number }
export interface Pole { f: number; bw: number }
export interface Candidates {
	/** Envelope peaks from 150 to 3500 Hz with prominence of at least 0.5 dB (finer than any picker's floor). */
	envelopePeaks: EnvPeak[];
	/** Every pole of the closed-phase fit, with bandwidth; null when the closed phase abstained. */
	poles: Pole[] | null;
	segments: number | null;
	/** The level of the strongest envelope peak in 150 to 3000 Hz. */
	strongestDb: number | null;
	/** Envelope peaks of 3 dB prominence under 3500 Hz: many means the envelope shows the source, not the tract. */
	comb: number;
}

export function candidatesFor(yw: Float64Array, sr: number, cp: ClosedPhaseResult | null): Candidates {
	const { env, freqs } = ltasEnvExport(yw, sr);
	const all = findPeaks(env, 0.5).filter((p) => freqs[p.idx] >= 150 && freqs[p.idx] <= 3500);
	const envelopePeaks = all.map((p) => ({ f: round(freqs[p.idx], 1), promDb: round(p.prom, 2), levelDb: round(env[p.idx], 2) }));
	const inBand = envelopePeaks.filter((p) => p.f <= 3000);
	return {
		envelopePeaks,
		poles: cp ? cp.resonances.map((r) => ({ f: round(r.f, 1), bw: round(r.bw, 1) })) : null,
		segments: cp ? cp.segments : null,
		strongestDb: inBand.length ? Math.max(...inBand.map((p) => p.levelDb)) : null,
		comb: envelopePeaks.filter((p) => p.promDb >= 3).length,
	};
}

// --- pickers ---

export interface PickerReading {
	outcome: 'reading' | 'reprompt' | 'error';
	f1: number | null;
	f2: number | null;
	confidence: string | null;
	reading: string | null;
	f2Quality: string | null;
	method: string | null;
	steadySpread: number | null;
	setAside: boolean | null;
	/** The open picker's evidence marks, as one string: estimators for fR1 and fR2, comb count, runner-up, R3 and whether it is resolved. */
	evidence: string | null;
	note: string | null;
}

type PickerFn = (y: Float64Array, sr: number, asked: Vowel, trace: Partial<ExtractTrace>) => CaptureOutcome;
/** `shipped` is the prior-led picker the app has used; `open` is the agnostic picker (`?measure=open`, N.200 Step 3). */
export const PICKERS: Record<string, PickerFn> = {
	shipped: (y, sr, asked, trace) => runCapture(y, sr, asked, undefined, trace),
	open: (y, sr, asked, trace) => runCapture(y, sr, asked, undefined, trace, 'open'),
};

function evidenceOf(trace: Partial<ExtractTrace>): string | null {
	const e = trace.chosen?.evidence;
	if (!e) return null;
	return `f1:${e.fR1 ?? '-'};f2:${e.fR2 ?? '-'};comb:${e.comb};rival:${e.runnerUp ? 1 : 0};r3:${e.r3 ? `${Math.round(e.r3.f)}${e.r3.resolved ? 'r' : 'm'}` : '-'};cpAbstained:${e.closedPhaseAbstained ? 1 : 0}`;
}

function readingOf(o: CaptureOutcome, trace: Partial<ExtractTrace>): PickerReading {
	if (o.outcome === 'reading') {
		return {
			outcome: 'reading', f1: round(o.formant.f1, 1), f2: o.formant.f2 === undefined ? null : round(o.formant.f2, 1),
			confidence: o.formant.confidence, reading: o.formant.reading, f2Quality: o.formant.f2Quality ?? null,
			method: trace.chosen?.method ?? null, steadySpread: o.steadiness.spread, setAside: trace.closedPhaseSetAside ?? null, evidence: evidenceOf(trace), note: null,
		};
	}
	const note = o.outcome === 'error' ? o.error.code : `not-fry: ${o.failed.join(',')}`;
	return { outcome: o.outcome, f1: null, f2: null, confidence: null, reading: null, f2Quality: null, method: null, steadySpread: null, setAside: null, evidence: null, note };
}

// --- reference ---

export interface Reference { f1: number | null; f2: number | null; source: 'burg' | 'manual' | null; f1Quartiles?: (number | null)[]; f2Quartiles?: (number | null)[] }

export function burgReference(wavPath: string): Reference {
	if (!existsSync(BURG_PY)) return { f1: null, f2: null, source: null };
	const r = spawnSync('python3', [BURG_PY, wavPath, '--json'], { cwd: path.dirname(BURG_PY), encoding: 'utf8' });
	if (r.status !== 0) return { f1: null, f2: null, source: null };
	try {
		const j = JSON.parse(r.stdout) as { f1: (number | null)[]; f2: (number | null)[] };
		return { f1: j.f1[1] === null ? null : round(j.f1[1]!, 1), f2: j.f2[1] === null ? null : round(j.f2[1]!, 1), source: 'burg', f1Quartiles: j.f1, f2Quartiles: j.f2 };
	} catch { return { f1: null, f2: null, source: null }; }
}

/** `reference.csv` in the folder: `file,fR1,fR2`, Dann's own reading of the spectrum, which takes the place of Burg's. */
export function manualReferences(dir: string): Map<string, Reference> {
	const out = new Map<string, Reference>();
	const p = path.join(dir, 'reference.csv');
	if (!existsSync(p)) return out;
	for (const line of readFileSync(p, 'utf8').split(/\r?\n/).slice(1)) {
		const [file, a, b] = line.split(',').map((s) => s.trim());
		if (!file) continue;
		out.set(file, { f1: a ? Number(a) : null, f2: b ? Number(b) : null, source: 'manual' });
	}
	return out;
}

// --- rows ---

export interface Row {
	file: string;
	asked: string;
	sung: string | null;
	build: string | null;
	/** The reading as the recorder stored it, from the build that took the take. */
	recorded: { f1: number | null; f2: number | null } | null;
	pickers: Record<string, PickerReading>;
	reference: Reference;
	candidates: Candidates | null;
}

export interface Sidecar { file?: string; asked?: string; vowel?: string; sung?: string | null; build?: string; outcome?: { outcome?: string; formant?: { f1?: number; f2?: number }; guard?: { segmentS?: [number, number] | null } } }

/** Scores one take: the buffer the recorder held, as `runCapture` saw it. `reference` is filled by the caller. */
export function scoreTake(y: Float64Array, sr: number, asked: Vowel, meta: { file: string; sung?: string | null; build?: string | null; recorded?: Row['recorded'] }): Row {
	const pickers: Record<string, PickerReading> = {};
	let candidates: Candidates | null = null;
	for (const [name, pick] of Object.entries(PICKERS)) {
		const trace: Partial<ExtractTrace> = {};
		const o = pick(y, sr, asked, trace);
		pickers[name] = readingOf(o, trace);
		if (!candidates && o.outcome !== 'error') {
			const seg = o.guard?.segmentS;
			const yw = seg ? y.subarray(Math.round(seg[0] * sr), Math.round(seg[1] * sr)) : y;
			candidates = candidatesFor(yw, sr, trace.closedPhase ?? null);
		}
	}
	return { file: meta.file, asked, sung: meta.sung ?? null, build: meta.build ?? null, recorded: meta.recorded ?? null, pickers, reference: { f1: null, f2: null, source: null }, candidates };
}

export interface ScoreOptions { burg?: boolean }

/** Every `.wav` with its `.json` under `dir` (one level, or the recorder's ZIP unpacked into a folder). */
export function scoreFolder(dir: string, opts: ScoreOptions = {}): Row[] {
	const manual = manualReferences(dir);
	const rows: Row[] = [];
	for (const name of readdirSync(dir).filter((n) => n.endsWith('.wav')).sort()) {
		const wavPath = path.join(dir, name), jsonPath = wavPath.replace(/\.wav$/, '.json');
		const side: Sidecar = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, 'utf8')) : {};
		const asked = (side.asked ?? side.vowel ?? name.match(/asked-(.+?)-sung-/)?.[1] ?? name.match(/^ilya-capture-(.+?)-\d{4}-/)?.[1]) as Vowel | undefined;
		if (!asked) throw new Error(`${name}: no asked vowel in the JSON or the name`);
		const { sr, y } = decodeWav(new Uint8Array(readFileSync(wavPath)));
		const sung = side.sung ?? name.match(/-sung-(.+?)-\d{4}-/)?.[1]?.replace(/^unstated$/, '') ?? null;
		const f = side.outcome?.formant;
		const row = scoreTake(y, sr, asked, { file: name, sung: sung || null, build: side.build ?? null, recorded: f ? { f1: f.f1 ?? null, f2: f.f2 ?? null } : null });
		row.reference = manual.get(name) ?? (opts.burg === false ? row.reference : burgReference(wavPath));
		rows.push(row);
	}
	return rows;
}

// --- the table ---

const within = (v: number | null, ref: number | null, bar: number) => (v === null || ref === null ? null : Math.abs(v - ref) / ref <= bar);
export type Kind = 'right' | 'wrong' | 'unstated';
export const kindOf = (r: Row): Kind => (r.sung === null ? 'unstated' : r.sung === r.asked ? 'right' : 'wrong');

export function tableCsv(rows: Row[]): string {
	const names = Object.keys(PICKERS);
	const head = ['file', 'asked', 'sung', 'kind', 'build', 'recorded_fR1', 'recorded_fR2', ...names.flatMap((n) => [`${n}_fR1`, `${n}_fR2`, `${n}_status`, `${n}_f2Quality`, `${n}_confidence`, `${n}_method`, `${n}_steadySpread`, `${n}_setAside`, `${n}_evidence`, `${n}_note`, `${n}_fR1_ok`, `${n}_fR2_ok`]), 'comb', 'ref_source', 'ref_fR1', 'ref_fR2'];
	const q = (s: unknown) => { const t = s === null || s === undefined ? '' : String(s); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
	const lines = [head.join(',')];
	for (const r of rows) {
		const cells: unknown[] = [r.file, r.asked, r.sung, kindOf(r), r.build, r.recorded?.f1, r.recorded?.f2];
		for (const n of names) {
			const p = r.pickers[n];
			cells.push(p.f1, p.f2, p.reading, p.f2Quality, p.confidence, p.method, p.steadySpread, p.setAside, p.evidence, p.note, within(p.f1, r.reference.f1, BAR_F1), within(p.f2, r.reference.f2, BAR_F2));
		}
		cells.push(r.candidates?.comb, r.reference.source, r.reference.f1, r.reference.f2);
		lines.push(cells.map(q).join(','));
	}
	return lines.join('\n') + '\n';
}

/** Pass rates per picker and per kind of take, against the reference, with the bars of Step 4. */
export function summaryText(rows: Row[]): string {
	const out: string[] = [`Bars: fR1 within ${BAR_F1 * 100}%, fR2 within ${BAR_F2 * 100}% of the independent reference. ${rows.length} takes.`];
	for (const n of Object.keys(PICKERS)) {
		out.push(`\nPicker ${n}`);
		for (const k of ['right', 'wrong', 'unstated'] as Kind[]) {
			const g = rows.filter((r) => kindOf(r) === k);
			if (!g.length) continue;
			const rate = (sel: (r: Row) => boolean | null) => { const m = g.map(sel).filter((x): x is boolean => x !== null); return `${m.filter(Boolean).length} of ${m.length}`; };
			out.push(`  ${k} (${g.length} takes): fR1 ${rate((r) => within(r.pickers[n].f1, r.reference.f1, BAR_F1))}, fR2 ${rate((r) => within(r.pickers[n].f2, r.reference.f2, BAR_F2))}; captured ${g.filter((r) => r.pickers[n].reading === 'captured').length}, provisional ${g.filter((r) => r.pickers[n].reading === 'provisional').length}, no reading ${g.filter((r) => r.pickers[n].outcome !== 'reading').length}`);
		}
	}
	out.push('\nA take with no reference value is left out of that rate. A reference from Burg reads every frame, open phase and all; it is a second opinion, not the truth.');
	return out.join('\n') + '\n';
}

export const isDir = (p: string) => existsSync(p) && statSync(p).isDirectory();
function round(v: number, d: number): number { const k = 10 ** d; return Math.round(v * k) / k; }
