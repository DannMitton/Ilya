/**
 * Row 48 (2026-10-15): the metre estimate at rung 4 of the tempo seam, the
 * singer's tempo riding on the score, and what each does to the readouts.
 *
 * The expected beats are written out by hand from the ruling: a walking pace of
 * 60 to 72 felt beats a minute, 3/8 in one (the eighth beside it), 6/4, 9/4 and
 * 12/4 in a dotted half, and `feltBeat` itself unchanged.
 */
import { describe, expect, it } from 'vitest';
import {
	dominantTimeSignature,
	ESTIMATE_BAND,
	estimateBeat,
	feltBeat,
	resolveTempo,
	tempoCaveats,
} from './tempo-seam';
import { aggregatePhonation, secondsFor, totalFoldCycles } from './phonation';
import type { Duration, Measure, ParsedScore, TimeSignature, VocalLineEvent } from './types';

const ts = (beats: number, beatType: number): TimeSignature => ({ beats, beatType });

function bars(signatures: Array<[number, number]>): Measure[] {
	return signatures.map(([beats, beatType], i) => ({
		index: i,
		number: String(i + 1),
		timeSignature: ts(beats, beatType),
		keySignature: { fifths: 0, mode: 'major' },
		expectedDuration: { numerator: beats, denominator: beatType },
	})) as Measure[];
}

function quarter(id: string): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } } as Duration,
		pitch: { step: 'C', octave: 4, alter: 0 },
	} as VocalLineEvent;
}

function scoreOf(over: Partial<ParsedScore> & { signatures?: Array<[number, number]> } = {}): ParsedScore {
	const { signatures, ...rest } = over;
	return {
		measures: signatures ? bars(signatures) : [],
		vocalLine: [quarter('a'), quarter('b')],
		tempoMarkings: [],
		tempoWords: [],
		timeSignatures: [],
		keySignatures: [],
		...rest,
	} as unknown as ParsedScore;
}

describe('the estimate: a labelled band of felt beats (rung 4)', () => {
	it('is a band of 60 to 72 beats a minute with its midpoint, exact, and says it is estimated', () => {
		const r = resolveTempo(scoreOf({ signatures: [[4, 4]] }))!;
		expect(ESTIMATE_BAND).toEqual([60, 72]);
		expect(r.provenance).toBe('estimated');
		expect(r.range).toEqual([60, 72]);
		expect(r.rangeExact).toEqual([{ numerator: 60, denominator: 1 }, { numerator: 72, denominator: 1 }]);
		expect(r.bpm).toBe(66);
		expect(r.bpmExact).toEqual({ numerator: 66, denominator: 1 });
	});

	it('carries the metre it read, and none where the score states none', () => {
		expect(resolveTempo(scoreOf({ signatures: [[3, 8]] }))!.estimateMetre).toEqual({ beats: 3, beatType: 8 });
		expect(resolveTempo(scoreOf())!.estimateMetre).toBeUndefined();
	});

	it.each([
		['3/8', [3, 8], 'quarter', 1, 'eighth', 0],
		['6/8', [6, 8], 'quarter', 1, 'eighth', 0],
		['9/8', [9, 8], 'quarter', 1, 'eighth', 0],
		['12/8', [12, 8], 'quarter', 1, 'eighth', 0],
		['2/2', [2, 2], 'half', 0, 'quarter', 0],
		['6/4', [6, 4], 'half', 1, 'quarter', 0],
		['9/4', [9, 4], 'half', 1, 'quarter', 0],
		['12/4', [12, 4], 'half', 1, 'quarter', 0],
		['4/4', [4, 4], 'quarter', 0, 'eighth', 0],
		['3/4', [3, 4], 'quarter', 0, 'eighth', 0],
		['5/8 (unlisted)', [5, 8], 'eighth', 0, '16th', 0],
	] as const)('%s counts the right beat, with the right second reading', (_name, [beats, beatType], unit, dots, altUnit, altDots) => {
		const b = estimateBeat(ts(beats, beatType));
		expect([b.unit, b.dots]).toEqual([unit, dots]);
		expect([b.alternative.unit, b.alternative.dots]).toEqual([altUnit, altDots]);
	});

	it('no metre at all counts the quarter, a walking pace', () => {
		const b = estimateBeat(undefined);
		expect([b.unit, b.dots, b.alternative.unit]).toEqual(['quarter', 0, 'eighth']);
	});

	it('wraps feltBeat and does not change it: 3/8 with no tier is still the eighth, 6/4 still the quarter', () => {
		expect(feltBeat(ts(3, 8)).unit).toBe('eighth');
		expect(feltBeat(ts(6, 4)).unit).toBe('quarter');
		expect(estimateBeat(ts(3, 8)).unit).toBe('quarter'); // the dotted quarter
	});

	it('reads the metre that holds the most bars', () => {
		const s = scoreOf({ signatures: [[3, 8], [6, 8], [6, 8], [6, 8], [3, 8]] });
		expect(dominantTimeSignature(s)).toEqual(ts(6, 8));
		expect(resolveTempo(s)!.beatUnit).toBe('quarter'); // dotted
		expect(resolveTempo(s)!.beatUnitDots).toBe(1);
	});

	it('a tie goes to the metre stated first', () => {
		expect(dominantTimeSignature(scoreOf({ signatures: [[3, 8], [4, 4]] }))).toEqual(ts(3, 8));
	});

	it('is priced as a range of seconds, exactly: a dotted quarter at 60 to 72 over four quarters', () => {
		// Two quarter notes = 2/4 of a whole; a dotted quarter is 3/8, so 2/4 / (3/8) = 4/3 beats.
		const s = scoreOf({ signatures: [[3, 8]] });
		const r = secondsFor({ numerator: 2, denominator: 1 }, s)!; // 2 quavers = a quarter
		expect(r.tempo.provenance).toBe('estimated');
		const beats = (1 / 4) / (3 / 8); // one quarter note in dotted-quarter beats
		expect(r.secondsRange![0]).toBeCloseTo((beats * 60) / 72, 9);
		expect(r.secondsRange![1]).toBeCloseTo((beats * 60) / 60, 9);
		expect(aggregatePhonation(s).total).toBeDefined();
		const cycles = totalFoldCycles(aggregatePhonation(s), s)!;
		expect(cycles.cyclesRange).toBeDefined(); // the contact count prints as a span (amendment 5)
		expect(cycles.cyclesRange![0]).toBeLessThan(cycles.cyclesRange![1]);
	});
});

describe('precedence with the estimate at rung 4', () => {
	const mark = (bpm: number) => [
		{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm, beatUnit: 'quarter' as const, beatUnitDots: 0 },
	];
	const word = (text: string) => [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, text }];

	it('a printed word beats the estimate, a printed mark beats a word, the singer beats all', () => {
		const base = { signatures: [[3, 8]] as Array<[number, number]> };
		expect(resolveTempo(scoreOf(base))!.provenance).toBe('estimated');
		expect(resolveTempo(scoreOf({ ...base, tempoWords: word('Moderato') } as never))!.provenance).toBe('inferred');
		expect(resolveTempo(scoreOf({ ...base, tempoWords: word('Moderato'), tempoMarkings: mark(80) } as never))!.provenance).toBe('encoded');
		const withSinger = scoreOf({
			...base,
			tempoWords: word('Moderato'),
			tempoMarkings: mark(80),
			singerTempo: { bpm: 100, beatUnit: 'eighth', beatUnitDots: 0 },
		} as never);
		const r = resolveTempo(withSinger)!;
		expect(r.provenance).toBe('user');
		expect([r.bpm, r.beatUnit, r.beatUnitDots]).toEqual([100, 'eighth', 0]);
	});

	it("the singer's tempo over an estimate has no band; reset (absent) returns the estimate", () => {
		const base = scoreOf({ signatures: [[3, 8]] });
		const yours = resolveTempo({ ...base, singerTempo: { bpm: 180, beatUnit: 'eighth', beatUnitDots: 0 } })!;
		expect(yours.provenance).toBe('user');
		expect(yours.range).toBeUndefined();
		expect(resolveTempo({ ...base, singerTempo: undefined })!.provenance).toBe('estimated');
	});

	it('an explicit option still wins over the score-carried tempo', () => {
		const s = { ...scoreOf({ signatures: [[4, 4]] }), singerTempo: { bpm: 50, beatUnit: 'quarter' as const, beatUnitDots: 0 } };
		expect(resolveTempo(s, { overrideBpm: 90 })!.bpm).toBe(90);
	});

	it("a derived copy carries the singer's tempo with it", () => {
		const s = { ...scoreOf({ signatures: [[4, 4]] }), singerTempo: { bpm: 50, beatUnit: 'quarter' as const, beatUnitDots: 0 } };
		const shifted = { ...s, vocalLine: [] };
		expect(resolveTempo(shifted)!.provenance).toBe('user');
	});

	it('the seconds follow the singer: 120 to the quarter halves a 60-to-the-quarter figure', () => {
		const slow = { ...scoreOf({ signatures: [[4, 4]] }), singerTempo: { bpm: 60, beatUnit: 'quarter' as const, beatUnitDots: 0 } };
		const fast = { ...slow, singerTempo: { bpm: 120, beatUnit: 'quarter' as const, beatUnitDots: 0 } };
		const q = { numerator: 2, denominator: 1 };
		expect(secondsFor(q, slow)!.seconds).toBeCloseTo(2 * secondsFor(q, fast)!.seconds, 9);
		expect(secondsFor(q, slow)!.secondsRange).toBeUndefined(); // the singer's tempo is a point
	});
});

describe('the caveats name the estimate', () => {
	it('say it was estimated, and that the singer can change it', () => {
		const out = tempoCaveats(resolveTempo(scoreOf({ signatures: [[6, 8]] }))!);
		expect(out.some((l) => /estimated by Ilya/.test(l) && /6\/8/.test(l))).toBe(true);
	});
});
