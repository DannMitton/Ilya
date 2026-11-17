/**
 * The path picker (`path-extract.ts`), N.200 plan step P2. What is pinned: the ladder, the cross-check's every fR1 case and fR2 outcome on
 * constructed inputs, that no table of anyone's values and no prior reaches the choice, that the reading does not depend on the vowel asked,
 * and the route's status and evidence. Expected values come from generator arguments or from the brief's rules, never from the picker's output.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { synthFry, SYNTH_SR } from './fry-synth';
import { runCapture } from './analyze';
import { measurePicker } from '../chart/measure-switch';
import { readingTake } from '../takes';
import { crossCheck, extractPath, ladder, L15, L9, scoreCeilings, PATH_DEFAULTS, type CeilingTracks } from './path-extract';
import type { ExtractTrace } from './extract';
import type { Vowel } from './types';

const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const SLOW_CASE_MS = 60_000;
const BW = [60, 90, 120, 180, 250];
const pole = (f: number, bw = 100) => ({ f, bw });
const peak = (f: number, prom = 5) => ({ f, prom });

describe('the ladder', () => {
	it('L15 is Weenink 2023\'s formula at middle 4583, step 0.0605: 15 ceilings, 3000 to 7000 Hz', () => {
		expect(L15).toHaveLength(15);
		expect(Math.abs(L15[0] - 3000)).toBeLessThan(2);
		expect(Math.abs(L15[14] - 7000)).toBeLessThan(2);
		expect(L15[7]).toBeCloseTo(4583, 9);
	});
	it('L9 is the 2023 defaults: nine ceilings, 4503 to 6718 Hz', () => {
		expect(L9).toHaveLength(9);
		expect(Math.round(L9[0])).toBe(4503);
		expect(Math.round(L9[8])).toBe(6718);
		expect(ladder(100, 0.1, 1).map((v) => Math.round(v * 1000) / 1000)).toEqual([90.484, 100, 110.517]);
	});
});

describe('the cross-check: every fR1 case', () => {
	it('(a) the closed phase reads and a qualifying pole lies within 30 percent of fR1: stands', () => {
		const x = crossCheck(500, 1500, [pole(430), pole(1900)], [peak(1500)]);
		expect(x.case).toBe('a');
		expect(x.reason).toBeUndefined();
	});
	it('(b) the closed phase reads and no pole lies within 30 percent: unsteady', () => {
		expect(crossCheck(500, 1500, [pole(900)], [peak(500), peak(1500)]).case).toBe('b');
	});
	it('(c) the closed phase abstains and an envelope peak lies within 30 percent of fR1: stands, one estimator', () => {
		expect(crossCheck(500, 1500, null, [peak(560), peak(1500)]).case).toBe('c');
		expect(crossCheck(500, 1500, [], [peak(560), peak(1500)]).case).toBe('c');
	});
	it('(d, no-peak) the closed phase abstains and no envelope peak lies within 30 percent: unsteady', () => {
		const x = crossCheck(500, 1500, null, [peak(900), peak(1500)]);
		expect(x).toMatchObject({ case: 'd', reason: 'no-peak' });
	});
	it('(d, out-of-range) fR1 outside 150 to 1200 Hz is returned and is unsteady, whatever the estimators say', () => {
		expect(crossCheck(1300, 2000, [pole(1300)], [peak(1300)])).toMatchObject({ case: 'd', reason: 'out-of-range' });
		expect(crossCheck(120, 2000, [pole(120)], [peak(120)])).toMatchObject({ case: 'd', reason: 'out-of-range' });
	});
	it('(d, no-fr1) a path with no fR1 is decided first, and holds no fR2', () => {
		expect(crossCheck(null, 1500, [pole(500)], [peak(500), peak(1500)])).toEqual({ case: 'd', reason: 'no-fr1', fR2Kept: false, f2Prom: 0 });
	});
	it('a pole outside the qualifying set is not offered to the check (the caller filters 150 to 1200 Hz and the bandwidth limits)', () => {
		// The set `pathFromTracks` hands over is already filtered; an empty set is an abstention.
		expect(crossCheck(500, 1500, [], [peak(520)]).case).toBe('c');
	});
});

describe('the cross-check: every fR2 outcome', () => {
	it('an envelope peak within 30 percent of the path\'s fR2 keeps it, and the case is as fR1 left it', () => {
		const x = crossCheck(500, 1500, [pole(500)], [peak(1400, 4.5)]);
		expect(x).toMatchObject({ case: 'a', fR2Kept: true, f2Prom: 4.5 });
	});
	it('no such peak: fR2 is absent, and fR1 is not touched', () => {
		const x = crossCheck(500, 1500, [pole(500)], [peak(500)]);
		expect(x).toMatchObject({ case: 'a', fR2Kept: false });
	});
	it('the path has no fR2: absent', () => {
		expect(crossCheck(500, null, [pole(500)], [peak(500), peak(1500)]).fR2Kept).toBe(false);
	});
	it('the check runs whether fR1 stands or not (case b, out-of-range)', () => {
		expect(crossCheck(500, 1500, [pole(900)], [peak(1500)])).toMatchObject({ case: 'b', fR2Kept: true });
		expect(crossCheck(1300, 2000, [pole(1300)], [peak(2000)])).toMatchObject({ case: 'd', reason: 'out-of-range', fR2Kept: true });
	});
	it('in case (c) fR2 must be a different peak from fR1\'s', () => {
		// One peak at 560 serves fR1 (within 30 percent of 500); fR2 at 600 would match only that same peak.
		expect(crossCheck(500, 600, null, [peak(560)])).toMatchObject({ case: 'c', fR2Kept: false });
		expect(crossCheck(500, 600, null, [peak(560), peak(640)])).toMatchObject({ case: 'c', fR2Kept: true });
	});
	it('f2Check off: fR2 is kept whenever the path has one', () => {
		expect(crossCheck(500, 1500, [pole(500)], [peak(500)], false).fR2Kept).toBe(true);
		expect(crossCheck(500, null, [pole(500)], [peak(500)], false).fR2Kept).toBe(false);
	});
	it('every tolerance is relative to the path\'s value', () => {
		expect(crossCheck(1000, 2000, null, [peak(1300), peak(2600)]).fR2Kept).toBe(true); // 30.0 percent of 2000 is 600
		expect(crossCheck(1000, 2000, null, [peak(1300), peak(2601)]).fR2Kept).toBe(false);
	});
});

describe('lane 64: the fR2 options (R125, DP, P3), each off by default', () => {
	const closed = [pole(640)];
	it('fR1 640, fR2 647, case (a), one envelope peak at 647: kept with every option off (the fault), not kept under R125, not kept under DP', () => {
		const off = crossCheck(640, 647, closed, [peak(647)]);
		expect(off).toMatchObject({ case: 'a', fR2Kept: true });
		expect(crossCheck(640, 647, closed, [peak(647)], true, { r125: true })).toMatchObject({ case: 'a', fR2Kept: false });
		expect(crossCheck(640, 647, closed, [peak(647)], true, { dp: true })).toMatchObject({ case: 'a', fR2Kept: false });
		expect(crossCheck(640, 647, closed, [peak(647)], true, { r125: true, dp: true })).toMatchObject({ fR2Kept: false });
	});
	it('R125: a gap of exactly 125 Hz is kept, 124 Hz is not (RESOLUTION_HZ is 1000 / 8)', () => {
		expect(crossCheck(640, 765, closed, [peak(765)], true, { r125: true })).toMatchObject({ fR2Kept: true });
		expect(crossCheck(640, 764, closed, [peak(764)], true, { r125: true })).toMatchObject({ fR2Kept: false });
	});
	it('DP: fR1\'s peak is excluded as fR2\'s peak in every case, but a second peak near fR2 still keeps it', () => {
		expect(crossCheck(640, 647, closed, [peak(647), peak(700)], true, { dp: true })).toMatchObject({ fR2Kept: true });
		expect(crossCheck(640, 647, [pole(2000)], [peak(647)], true, { dp: true })).toMatchObject({ case: 'b', fR2Kept: false });
		expect(crossCheck(640, 647, null, [peak(647)], true, { dp: true })).toMatchObject({ case: 'c', fR2Kept: false });
		expect(crossCheck(1300, 1310, [pole(1300)], [peak(1310)], true, { dp: true })).toMatchObject({ case: 'd', reason: 'out-of-range', fR2Kept: false });
	});
	it('options act inside the fR2 check: with f2Check off they change nothing', () => {
		expect(crossCheck(640, 647, closed, [peak(647)], false, { r125: true, dp: true, p3: true, pathF3: 1500 })).toMatchObject({ fR2Kept: true });
	});
	it('with every option off the result is the same object shape as before: no track, no f2', () => {
		expect(crossCheck(640, 1500, closed, [peak(1500)])).toEqual({ case: 'a', fR2Kept: true, f2Prom: 5 });
	});
	it('P3 promotes a track-3 value that passes the same tests', () => {
		const x = crossCheck(640, 647, closed, [peak(647), peak(1500, 7)], true, { r125: true, p3: true, pathF3: 1500 });
		expect(x).toMatchObject({ fR2Kept: true, track: 3, f2: 1500, f2Prom: 7 });
		const y = crossCheck(640, 647, closed, [peak(647), peak(1500)], true, { dp: true, p3: true, pathF3: 1500 });
		expect(y).toMatchObject({ fR2Kept: true, track: 3, f2: 1500 });
	});
	it('P3 refuses a track-3 value that does not pass: too close to fR1, no peak under it, or the fR1 peak again', () => {
		expect(crossCheck(640, 647, closed, [peak(647), peak(700)], true, { r125: true, p3: true, pathF3: 700 })).toMatchObject({ fR2Kept: false });
		expect(crossCheck(640, 647, closed, [peak(647)], true, { r125: true, p3: true, pathF3: 1500 })).toMatchObject({ fR2Kept: false });
		expect(crossCheck(640, 647, closed, [peak(647)], true, { dp: true, p3: true, pathF3: 650 })).toMatchObject({ fR2Kept: false });
		expect(crossCheck(640, 647, closed, [peak(647), peak(1500)], true, { r125: true, p3: true, pathF3: null })).toMatchObject({ fR2Kept: false });
	});
	it('P3 acts only when track 2 fails R125 or DP: alone it never fires, and a track 2 with no peak under it is not offered a second chance', () => {
		expect(crossCheck(640, 647, closed, [peak(647), peak(1500)], true, { p3: true, pathF3: 1500 })).toMatchObject({ fR2Kept: true, f2Prom: 5 });
		expect(crossCheck(640, 647, closed, [peak(647), peak(1500)], true, { p3: true, pathF3: 1500 })).not.toHaveProperty('track');
		expect(crossCheck(640, 2000, closed, [peak(640), peak(3400)], true, { r125: true, p3: true, pathF3: 3400 })).toMatchObject({ fR2Kept: false });
	});
});

describe('lane 64 Step 4: the chosen defaults (L15, R125 + DP + P3 on, weighting off)', () => {
	it('PATH_DEFAULTS is the desk\'s choice of section 3A', () => {
		expect(PATH_DEFAULTS).toEqual({ r125: true, dp: true, p3: true, sqrtWeight: false });
	});
	it('a call with no options runs with the defaults, and an option passed as false turns it off', () => {
		const y = synthFry({ formants: [640, 1500, 2500, 3300, 3900], bandwidths: BW, rate: 50, jitter: 0.03, seed: 21 });
		const dflt = extractPath(y, SYNTH_SR);
		const explicit = extractPath(y, SYNTH_SR, { r125: true, dp: true, p3: true, sqrtWeight: false });
		expect(dflt.f1).toBe(explicit.f1);
		expect(dflt.f2).toBe(explicit.f2);
		expect(dflt.path!.fR2Track).toBe(explicit.path!.fR2Track);
		const off = extractPath(y, SYNTH_SR, { r125: false, dp: false, p3: false });
		expect(off.f1).toBe(dflt.f1);
		expect(off.path!.pathF1).toBe(dflt.path!.pathF1);
	}, 60_000);
});

describe('lane 64: the weighting option', () => {
	const mk = (b0: number, b1: number): CeilingTracks => {
		const n = 100, tr = (f: number, b: number, j: number) => Array.from({ length: n }, (_, i) => ({ t: i * 0.00625, f: f + j * Math.sin(i * 1.7), b: i % 2 ? b : b * 0.4 }));
		return { ceiling: 5000, frames: n, t0: 0, t1: (n - 1) * 0.00625, tracks: [tr(500, b0, 12), tr(1500, b1, 12), tr(2500, b1, 12)] };
	};
	it('sqrtWeight false is the default exactly; true changes W', () => {
		const c = mk(60, 200);
		expect(scoreCeilings([c], { sqrtWeight: false })).toEqual(scoreCeilings([c]));
		expect(scoreCeilings([c], { sqrtWeight: true })[0]).not.toBe(scoreCeilings([c])[0]);
	});
});

describe('scoring the ceilings', () => {
	const track = (f: number, n: number, jitter: number, b = 80) => Array.from({ length: n }, (_, i) => ({ t: i * 0.00625, f: f + jitter * Math.sin(i * 1.7), b }));
	const ceil = (ceiling: number, jitter: number, n = 100): CeilingTracks => ({ ceiling, frames: n, t0: 0, t1: (n - 1) * 0.00625, tracks: [track(500, n, jitter), track(1500, n, jitter), track(2500, n, jitter)] });
	it('the steadier path has the lower W', () => {
		const w = scoreCeilings([ceil(4000, 40), ceil(5000, 2), ceil(6000, 25)]);
		expect(w[1]).toBeLessThan(w[0] as number);
		expect(w[1]).toBeLessThan(w[2] as number);
	});
	it('a ceiling is set aside when a track is present in under half the frames', () => {
		const c = ceil(5000, 2);
		c.tracks[2] = c.tracks[2].slice(0, 40);
		expect(scoreCeilings([c])).toEqual([null]);
	});
	it('t is the exponent on the variance term: a larger t punishes the same tracks more', () => {
		const c = ceil(5000, 10);
		const a = scoreCeilings([c], { t: 1 })[0] as number, b = scoreCeilings([c], { t: 1.5 })[0] as number;
		expect(a).not.toBe(b);
	});
});

describe('the path picker is agnostic', () => {
	it('its source holds no per-vowel table, no vowel parameter, no voice type, no prior, and no MITTON', () => {
		const code = strip(readFileSync(join(__dirname, 'path-extract.ts'), 'utf8'));
		expect(code).not.toMatch(/MITTON/);
		expect(code).not.toMatch(/\bvowel\b/i);
		expect(code).not.toMatch(/voiceType|VoiceType/);
		expect(code).not.toMatch(/\bprior\b/i);
		expect(code).not.toMatch(/[iɪeɛaɑʌouɨ]'\s*[:\]]/);
		expect(code).not.toMatch(/\.\.\/(plausibility|stand-ins|voiceTypes)|\.\/(plausibility|stand-ins|voiceTypes)/);
	});
	it('never calls closedPhaseF1, which picks by a prior', () => {
		const code = strip(readFileSync(join(__dirname, 'path-extract.ts'), 'utf8'));
		expect(code).not.toMatch(/closedPhaseF1/);
		expect(code).toMatch(/closedPhaseResonances/);
	});
	it('gives the same reading whichever vowel is asked', () => {
		const y = synthFry({ formants: [270, 700, 2300, 3000, 3700], bandwidths: BW, rate: 50, jitter: 0.03, seed: 5 });
		const asked: Vowel[] = ['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u'];
		const outs = asked.map((v) => JSON.stringify(runCapture(y, SYNTH_SR, v, undefined, undefined, 'path')));
		expect(new Set(outs).size).toBe(1);
		expect(outs[0]).toContain('"picker":"path"');
	}, SLOW_CASE_MS);
});

describe('the measure switch', () => {
	it('?measure=path selects the path picker, for the exact value only', () => {
		expect(measurePicker('?measure=path')).toBe('path');
		expect(measurePicker('?a=1&measure=path')).toBe('path');
		expect(measurePicker('?measure=PATH')).toBe('shipped');
		expect(measurePicker('?measure=paths')).toBe('shipped');
		expect(measurePicker('?measure=open')).toBe('open');
		expect(measurePicker('')).toBe('shipped');
	});
});

describe('the route', () => {
	it('a clean take is read from the take alone; the reading carries picker: path, its evidence rides on the trace, and the take record keeps the picker', () => {
		const y = synthFry({ formants: [270, 700, 2300, 3000, 3700], bandwidths: BW, rate: 50, jitter: 0.03, seed: 5 });
		const trace: Partial<ExtractTrace> = {};
		const o = runCapture(y, SYNTH_SR, 'i', undefined, trace, 'path');
		expect(o.outcome).toBe('reading');
		if (o.outcome !== 'reading') return;
		expect(o.formant.picker).toBe('path');
		expect(Math.abs(o.formant.f1 - 270) / 270).toBeLessThan(0.1);
		const ev = trace.chosen?.path;
		expect(ev).toBeDefined();
		expect(trace.chosen?.method).toBe('path');
		expect(trace.chosen?.evidence).toBeUndefined();
		expect(ev!.ceilings).toHaveLength(15);
		expect(ev!.w).toHaveLength(15);
		expect(trace.envelopePeaks?.length).toBeGreaterThan(0);
		expect(trace.closedPhase).toBeDefined();
		expect(readingTake({ vowel: 'i', visible: 'zone', now: new Date('2026-11-17T00:00:00Z') }, o.formant).raw?.picker).toBe('path');
	}, SLOW_CASE_MS);

	it('an unsteady case (b or d) makes the reading Provisional, and a kept fR2 is the path\'s own value', () => {
		const y = synthFry({ formants: [270, 700, 2300, 3000, 3700], bandwidths: BW, rate: 50, jitter: 0.03, seed: 5 });
		const trace: Partial<ExtractTrace> = {};
		const o = runCapture(y, SYNTH_SR, 'i', undefined, trace, 'path');
		if (o.outcome !== 'reading') throw new Error('no reading');
		const ev = trace.chosen!.path!;
		const unsteady = ev.case === 'b' || ev.case === 'd';
		expect(o.formant.reading === 'provisional' || !unsteady).toBe(true);
		if (ev.fR2Kept) expect(o.formant.f2).toBe(ev.pathF2);
		else expect(o.formant.f2).toBeUndefined();
		expect(o.formant.f2Quality === 'absent').toBe(o.formant.f2 === undefined);
	}, SLOW_CASE_MS);

	it('the shipped and open pickers are not changed by the new route', () => {
		const y = synthFry({ formants: [650, 1050, 2500, 3300, 3900], bandwidths: BW, rate: 50, jitter: 0.03, seed: 9 });
		const shipped = runCapture(y, SYNTH_SR, 'ɑ');
		if (shipped.outcome !== 'reading') throw new Error('no reading');
		expect(shipped.formant.picker).toBeUndefined();
	}, SLOW_CASE_MS);
});
