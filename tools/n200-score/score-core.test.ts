/**
 * The scoring tool on synthetic fry with known resonances (`apps/web/src/lib/voice/engine/fry-synth.ts`). Every expected value is an
 * argument of the generator, never a value a picker reported. Run: see `vitest.config.ts`.
 */
import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { synthFry, SYNTH_SR, type FryCase } from '$lib/voice/engine/fry-synth';
import { wavBytes } from '$lib/voice/engine/capture-file';
import { VARIANT_KEYS, WEIGHT_KEY, DEFAULT_KEY, type VarCell } from './variants';
import { judge, choice, weightTable, defaultCheck } from './variant-core';
import { divergenceTable, plausibilityTable, iuAbsentTable } from './step5-core';
import { TYPES } from './fidelity-set';
import type { MRow } from './measure-core';
import { decodeWav, scoreTake, scoreFolder, tableCsv, summaryText, kindOf, PICKERS, BURG_PY } from './score-core';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const BW = [60, 90, 120, 180, 250];
const CASES = {
	i: [290, 2150, 2750, 3300, 3900],
	u: [270, 700, 2300, 3000, 3700],
	ɑ: [650, 1050, 2500, 3300, 3900],
	o: [480, 830, 2500, 3200, 3800],
} as const;
const fry = (v: keyof typeof CASES, extra: Partial<FryCase> = {}) => synthFry({ formants: [...CASES[v]], bandwidths: BW, rate: 50, jitter: 0.03, seed: 11, ...extra });
const near = (list: number[], target: number, tol: number) => list.some((f) => Math.abs(f - target) / target <= tol);

describe('decodeWav', () => {
	it('inverts the recorder`s wavBytes to within one quantisation step', () => {
		const y = fry('ɑ', { durationS: 1 });
		const d = decodeWav(wavBytes(y, SYNTH_SR));
		expect(d.sr).toBe(SYNTH_SR);
		expect(d.y.length).toBe(y.length);
		let worst = 0;
		for (let i = 0; i < y.length; i++) worst = Math.max(worst, Math.abs(d.y[i] - y[i]));
		expect(worst).toBeLessThan(1 / 0x7fff);
	});
});

describe('scoreTake dumps every candidate', () => {
	for (const v of ['i', 'u', 'ɑ'] as const) {
		it(`[${v}] right vowel asked: the known fR1 and fR2 are among the envelope peaks or closed-phase poles`, () => {
			const row = scoreTake(fry(v), SYNTH_SR, v, { file: 'x.wav' });
			const c = row.candidates!;
			expect(c).toBeTruthy();
			const all = [...c.envelopePeaks.map((p) => p.f), ...(c.poles ?? []).map((p) => p.f)];
			expect(near(all, CASES[v][0], 0.10), `fR1 ${CASES[v][0]} among ${all.join(' ')}`).toBe(true);
			expect(near(all, CASES[v][1], 0.12), `fR2 ${CASES[v][1]} among ${all.join(' ')}`).toBe(true);
			expect(c.envelopePeaks.every((p) => typeof p.levelDb === 'number' && p.promDb >= 0.5)).toBe(true);
			expect(c.strongestDb).not.toBeNull();
			if (c.poles) expect(c.poles.every((p) => p.bw > 0)).toBe(true);
		});
	}
	it('has one entry per picker, carrying status and evidence marks', () => {
		const row = scoreTake(fry('i'), SYNTH_SR, 'i', { file: 'x.wav', sung: 'i' });
		expect(Object.keys(row.pickers)).toEqual(Object.keys(PICKERS));
		const p = row.pickers.shipped;
		expect(row.pickers.open.evidence).toMatch(/^f1:/);
		expect(p.evidence).toBeNull();
		expect(p.outcome).toBe('reading');
		expect(['captured', 'provisional']).toContain(p.reading);
		expect(p.method).not.toBeNull();
		expect(p.f1).toBeGreaterThan(150);
	});
});

describe('the path picker in the scoring tool', () => {
	it('is a picker beside shipped and open, with its evidence marks, and path9 (L9, no status) beside it', () => {
		const row = scoreTake(fry('i'), SYNTH_SR, 'i', { file: 'x.wav', sung: 'i' });
		expect(Object.keys(PICKERS)).toEqual(['shipped', 'open', 'path']);
		expect(row.pickers.path.outcome).toBe('reading');
		expect(row.pickers.path.method).toBe('path');
		expect(row.pickers.path.evidence).toMatch(/^case:[abcd]/);
		expect(row.path9).not.toBeNull();
		expect(row.path9!.f1).toBeGreaterThan(150);
		const csv = tableCsv([row]).split('\n');
		expect(csv[0]).toContain('path_fR1,path_fR2,path_status');
		expect(csv[0]).toContain('path9_fR1,path9_fR2,path9_fR1_ok,path9_fR2_ok');
		expect(summaryText([row])).toContain('Picker path9');
	}, 60_000);
});

describe('lane 64: the path variants in the scoring tool', () => {
	it('every ladder and combination is a column, the default variant (L15, R125+DP+P3) equals the default path run, L15 with every option off differs from the engine defaults only where an option acts, and the evidence string names fR1, fR3, and both ceilings', () => {
		const row = scoreTake(fry('i'), SYNTH_SR, 'i', { file: 'x.wav', sung: 'i' });
		expect(Object.keys(row.variants!)).toEqual(VARIANT_KEYS);
		expect(VARIANT_KEYS).toHaveLength(15);
		const dflt = row.variants![DEFAULT_KEY], path = row.pickers.path;
		expect(dflt.f1).toBe(path.f1);
		expect(dflt.f2).toBe(path.f2);
		expect(row.variants!['L15|off'].f1).toBe(path.f1);
		expect(row.variants!['L3188|off'].ceiling).toBeGreaterThanOrEqual(3188);
		expect(row.variants!['L3387|off'].ceiling).toBeGreaterThanOrEqual(3387);
		const head = tableCsv([row]).split('\n')[0];
		for (const c of ['p_L15_off_fR1', 'p_L3188_R125+DP_fR2', 'p_L3387_R125+DP+P3_fR2_ok']) expect(head).toContain(c);
		expect(path.evidence).toMatch(/runnerUp:(\d+|-);.*pathF1:\d+;pathF2:(\d+|-);pathF3:(\d+|-)$/);
		expect(summaryText([row])).toContain('L3387_R125+DP+P3');
	}, 60_000);
});

describe('lane 64: the bars of section 3A, on constructed rows', () => {
	const cell = (o: Partial<VarCell> = {}): VarCell => ({ f1: 500, f2: 1500, p2: 1500, p3: 2500, case: 'a', track: 2, ceiling: 5000, runnerUp: 5200, ...o });
	/** A take whose truth is fR1 500, fR2 1500; every variant reads `base` unless `over` says otherwise. */
	const take = (type: MRow['type'], base: VarCell, over: Record<string, Partial<VarCell>> = {}, extra: Partial<MRow> = {}): MRow => {
		const v: Record<string, VarCell> = {};
		for (const k of [...VARIANT_KEYS, WEIGHT_KEY]) v[k] = { ...base, ...(over[k] ?? {}) };
		const pc = { outcome: 'reading', f1: 500, f2: 1500, reading: 'captured', confidence: 'high' } as MRow['path'];
		return { idx: 0, k: 0, type, vowel: 'i', pair: false, truth: [500, 1500, 2500, 3300, 3900], shipped: pc, path: pc, variants: {}, v, ...extra } as MRow;
	};
	// Enough good takes of every type that bar 5 holds, so the other bars decide.
	const good = () => TYPES.flatMap((t) => Array.from({ length: 20 }, () => take(t, cell())));
	it('with nothing to fix every variant passes, and L15 off is the reference for bar 2', () => {
		const rows = good();
		const j = judge(rows, 'L15|off');
		expect(j).toMatchObject({ both: 100, pass: true });
		expect(j.b2.reference).toBe(true);
		expect(judge(rows, 'R125+DP+P3').b3).toMatchObject({ promoted: 0, pass: false });
	});
	it('bar 1: a variant that changes fR2 on more than 1 percent of in-bar takes fails', () => {
		const rows = good();
		rows[0] = take('bass', cell(), { 'L15|R125': { f2: null } });
		const j = judge(rows, 'L15|R125');
		expect(j.b1).toMatchObject({ n: 100, differ: 1, pass: true });
		rows[1] = take('bass', cell(), { 'L15|R125': { f2: null } });
		expect(judge(rows, 'L15|R125').b1).toMatchObject({ differ: 2, pass: false });
	});
	it('bar 2: the duplicate fault (track 2 at 647, kept) ends absent under R125, which is more than off, and at least half', () => {
		const rows = [...good(), take('bass', cell({ p2: 647, f2: 647 }), { 'L15|R125': { f2: null } }), take('bass', cell({ p2: 647, f2: 647 }), { 'L15|R125': { f2: null } })];
		const j = judge(rows, 'L15|R125');
		expect(j.b2).toMatchObject({ n: 2, okV: 2, okBase: 0, pass: true });
		const none = [...good(), take('bass', cell({ p2: 647, f2: 647 })), take('bass', cell({ p2: 647, f2: 647 }))];
		expect(judge(none, 'L15|R125').b2).toMatchObject({ okV: 0, pass: false });
		const half = [...good(), take('bass', cell({ p2: 647, f2: 647 }), { 'L15|R125': { f2: null } }), take('bass', cell({ p2: 647, f2: 647 }))];
		expect(judge(half, 'L15|R125').b2).toMatchObject({ okV: 1, n: 2, pass: true });
	});
	it('bar 2: a take with no track-2 value is in neither set, and is counted only in the with-nulls figure', () => {
		const rows = [...good(), take('bass', cell({ p2: null, f2: null }))];
		const j = judge(rows, 'L15|R125');
		expect(j.b1.n).toBe(100);
		expect(j.b2).toMatchObject({ n: 0, nNull: 1, okVWithNull: 1 });
	});
	it('bar 3: P3 must promote something, and 90 percent of what it promotes must be within 12 percent', () => {
		const prom = (f2: number) => take('bass', cell({ p2: 647, f2: 647 }), { 'L15|R125+DP+P3': { f2, track: 3 } });
		const rows = [...good(), ...Array.from({ length: 9 }, () => prom(1500)), prom(900)];
		expect(judge(rows, 'L15|R125+DP+P3').b3).toMatchObject({ promoted: 10, within: 9, pass: true });
		expect(judge([...rows, prom(900)], 'L15|R125+DP+P3').b3).toMatchObject({ promoted: 11, within: 9, pass: false });
		expect(judge(rows, 'L15|R125').b3.applies).toBe(false);
	});
	it('bar 4: a raised floor that takes one in-both take out of both bars on L15 fails', () => {
		const rows = good();
		rows[0] = take('bass', cell(), { 'L3188|off': { f1: 300 } });
		expect(judge(rows, 'L3188|off').b4).toMatchObject({ lost: 1, pass: false });
		expect(judge(rows, 'L3387|off').b4).toMatchObject({ lost: 0, pass: true });
		expect(judge(rows, 'L15|off').b4.applies).toBe(false);
	});
	it('bar 5: a voice type under 80 percent fails the variant, and a re-prompt is a miss', () => {
		const rows = good();
		for (let i = 0; i < 5; i++) rows[i] = take('bass', cell(), {}, { path: { outcome: 'reprompt', f1: null, f2: null, reading: null, confidence: null } as MRow['path'] });
		const j = judge(rows, 'L15|off');
		expect(j.b5.pass).toBe(false);
		expect(j.b5.worst).toContain('bass fR1 75.0%');
	});
	it('bar 5: more than 10 percent of in-both takes in case (b) or (d) fails it', () => {
		const rows = good();
		for (let i = 0; i < 11; i++) rows[i] = take('bass', cell({ case: 'b' }));
		expect(judge(rows, 'L15|off').b5.pass).toBe(false);
	});
	it('the choice: most takes in both bars, then fewest options, then L15', () => {
		const rows = good();
		const c = choice(rows);
		expect(c.ranked[0].key).toBe('L15|off');
		expect(c.ranked.map((j) => j.key)).not.toContain('L15|R125+DP+P3');
	});
	it('the weighting table counts takes that change ceiling', () => {
		const rows = good();
		rows[0] = take('bass', cell(), { [WEIGHT_KEY]: { ceiling: 6000 } });
		expect(weightTable(rows)).toMatch(/\| all \| 100 \| 1\/100/);
	});
	it('the default check flags a voice type under 80 percent with every option off', () => {
		expect(defaultCheck(good()).anyMiss).toBe(false);
		const rows = good(); for (let i = 0; i < 5; i++) rows[i] = take('bass', cell({ f2: 900 }));
		expect(defaultCheck(rows).anyMiss).toBe(true);
	});
});

describe('lane 64 Step 5: the counts', () => {
	const row = (vowel: string, f1: number, f2: number | null, over: { kase?: string; reading?: string; type?: MRow['type']; k?: number } = {}): MRow => {
		const cell: VarCell = { f1, f2, p2: f2, p3: null, case: over.kase ?? 'a', track: f2 === null ? null : 2, ceiling: 5000, runnerUp: 5200 };
		const pc = { outcome: 'reading', f1, f2, reading: over.reading ?? 'captured', confidence: 'high' } as MRow['path'];
		return { idx: 0, k: over.k ?? 0, type: over.type ?? 'bass', vowel, pair: false, truth: [f1, f2 ?? 0, 0, 0, 0], shipped: pc, path: pc, variants: {}, v: { [DEFAULT_KEY]: cell } } as MRow;
	};
	// [i] 300 / 2200 and [u] 350 / 800 expect [ɨ] near 409.5 / 1262.
	it('counts the [ɨ] readings the divergence pass used to demote: a missing [u], and a divergent [ɨ]; an [ɨ] near the expectation is not counted', () => {
		const missing = [row('i', 300, 2200), row('ɨ', 410, 1262)];
		expect(divergenceTable(missing).total).toMatchObject({ igh: 1, own: 1, missing: 1, divergent: 0, changed: 1 });
		const divergent = [row('i', 300, 2200), row('u', 350, 800), row('ɨ', 350, 1262)];
		expect(divergenceTable(divergent).total).toMatchObject({ own: 1, missing: 0, divergent: 1, changed: 1 });
		const fine = [row('i', 300, 2200), row('u', 350, 800), row('ɨ', 410, 1262)];
		expect(divergenceTable(fine).total).toMatchObject({ own: 1, missing: 0, divergent: 0, changed: 0 });
	});
	it('an [ɨ] that was Provisional on its own evidence is not counted, and an [i] without an fR2 counts as missing', () => {
		const own = [row('i', 300, 2200), row('u', 350, 800), row('ɨ', 350, 1262, { reading: 'provisional' })];
		expect(divergenceTable(own).total).toMatchObject({ igh: 1, own: 0, changed: 0 });
		const noF2 = [row('i', 300, null), row('u', 350, 800), row('ɨ', 410, 1262)];
		expect(divergenceTable(noF2).total).toMatchObject({ missing: 1, changed: 1 });
	});
	it('counts the Captured readings the plausibility band used to demote, and [i] and [u] with fR1 standing and fR2 absent', () => {
		const rows = [row('i', 90, 2200), row('i', 296, 1705), row('u', 346, null), row('u', 346, null, { kase: 'b' }), row('u', 346, 804)];
		const p = plausibilityTable(rows);
		expect(p).toMatchObject({ total: 1, of: 5 });
		expect(iuAbsentTable(rows)).toMatch(/\| bass \| 0\/2 \(0\.0%\) \| 1\/3 \(33\.3%\) \|/);
	});
});

describe('scoreFolder, on files in the recorder`s own format', () => {
	const dir = mkdtempSync(path.join(os.tmpdir(), 'n200-score-'));
	const put = (stem: string, v: keyof typeof CASES, asked: string, sung: string | null) => {
		const y = fry(v, { durationS: 3 });
		writeFileSync(path.join(dir, `${stem}.wav`), wavBytes(y, SYNTH_SR));
		writeFileSync(path.join(dir, `${stem}.json`), JSON.stringify({ file: `${stem}.wav`, samples: y.length, asked, vowel: asked, sung, build: 'abc12345', sampleRate: SYNTH_SR, outcome: { outcome: 'reading', formant: { f1: 123, f2: 456 }, guard: { segmentS: [0, 3] } } }));
	};
	put('ilya-capture-asked-i-sung-i-T1', 'i', 'i', 'i');
	put('ilya-capture-asked-i-sung-u-T2', 'u', 'i', 'u');
	put('ilya-capture-asked-ɑ-sung-unstated-T3', 'ɑ', 'ɑ', null);
	writeFileSync(path.join(dir, 'reference.csv'), 'file,fR1,fR2\nilya-capture-asked-i-sung-u-T2.wav,270,700\n');

	it('reads the asked and sung vowels, the build, and the recorded reading', () => {
		const rows = scoreFolder(dir, { burg: false });
		expect(rows.map((r) => [r.asked, r.sung, kindOf(r)])).toEqual([['i', 'i', 'right'], ['i', 'u', 'wrong'], ['ɑ', null, 'unstated']]);
		expect(rows.every((r) => r.build === 'abc12345')).toBe(true);
		expect(rows[0].recorded).toEqual({ f1: 123, f2: 456 });
	});

	it('takes a manual reference over Burg, and writes a table and a summary', () => {
		const rows = scoreFolder(dir, { burg: false });
		const wrong = rows.find((r) => kindOf(r) === 'wrong')!;
		expect(wrong.reference).toEqual({ f1: 270, f2: 700, source: 'manual' });
		const csv = tableCsv(rows).split('\n');
		expect(csv[0]).toMatch(/^file,asked,sung,kind,build,recorded_fR1,recorded_fR2,shipped_fR1,shipped_fR2,shipped_status/);
		expect(csv[0]).toContain('open_fR1,open_fR2,open_status');
		expect(csv.filter(Boolean)).toHaveLength(4);
		const s = summaryText(rows);
		expect(s).toContain('Picker shipped');
		expect(s).toContain('wrong (1 takes)');
	});

	const haveBurg = existsSync(BURG_PY) && spawnSync('python3', ['-c', 'import numpy, scipy'], { encoding: 'utf8' }).status === 0;
	it.skipIf(!haveBurg)('reads an independent Burg reference near the generator`s own resonances', () => {
		const rows = scoreFolder(dir);
		const right = rows.find((r) => kindOf(r) === 'right')!;
		expect(right.reference.source).toBe('burg');
		expect(right.reference.f1).not.toBeNull();
		// Burg reads every frame, open phase included: a second opinion, so the bar here is wide (25%) and from the generator's argument.
		expect(Math.abs(right.reference.f1! - CASES.i[0]) / CASES.i[0]).toBeLessThan(0.25);
	});

	it('reads the reference file named by the ref option, a name in the folder', () => {
		writeFileSync(path.join(dir, 'other.csv'), 'file,fR1,fR2\nilya-capture-asked-i-sung-i-T1.wav,111,222\n');
		const rows = scoreFolder(dir, { burg: false, ref: 'other.csv' });
		expect(rows.find((r) => r.file === 'ilya-capture-asked-i-sung-i-T1.wav')!.reference).toEqual({ f1: 111, f2: 222, source: 'manual' });
		expect(rows.find((r) => kindOf(r) === 'wrong')!.reference.source).toBeNull();
	}, 60_000);

	it('cleans up', () => { rmSync(dir, { recursive: true, force: true }); });
});
