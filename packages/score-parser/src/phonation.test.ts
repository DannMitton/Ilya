/**
 * Phonation-aggregation tests.
 *
 * Every expected value here comes from music theory or from a published
 * source, never from the module under test (Standing Rule V1). A dotted
 * quarter is three eighths because that is what a dot means, not because
 * `soundingFromNotation` says so.
 *
 * Each behavioural claim is paired with a NEGATIVE CONTROL: the check is
 * shown failing on known-bad input before its pass is believed (V2-A).
 */

import { describe, expect, it } from 'vitest';
import {
	aggregatePhonation,
	fractionToNumber,
	midiOf,
	nominalOscillations,
	secondsFor,
	soundingFromFraction,
	soundingFromNotation,
} from './phonation';
import type { Duration, Measure, ParsedScore, VocalLineEvent } from './types';

// ── minimal synthetic score ─────────────────────────────────────────

function dur(base: Duration['base'], dots = 0, tuplet?: Duration['tuplet'], fractionOverride?: Duration['fraction']): Duration {
	const sizes: Record<string, [number, number]> = {
		whole: [1, 1], half: [1, 2], quarter: [1, 4], eighth: [1, 8], '16th': [1, 16],
	};
	const [n, d] = sizes[base];
	let num = n;
	let den = d;
	for (let i = 0; i < dots; i++) {
		num = num * 2 + 1;
		den = den * 2;
	}
	return {
		base,
		dots,
		...(tuplet ? { tuplet } : {}),
		fraction: fractionOverride ?? { numerator: num, denominator: den },
	};
}

let seq = 0;
function note(measureIndex: number, step: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G', octave: number, duration: Duration): VocalLineEvent {
	return {
		id: `n${seq++}`,
		type: 'note',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration,
		pitch: { step, octave, alter: 0 },
	} as VocalLineEvent;
}

function rest(measureIndex: number, duration: Duration): VocalLineEvent {
	return {
		id: `r${seq++}`,
		type: 'rest',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration,
	} as VocalLineEvent;
}

function measure(index: number, beats: number, beatType: number, isPickup = false): Measure {
	return {
		index,
		number: String(index + 1),
		timeSignature: { beats, beatType },
		keySignature: { fifths: 0, mode: 'major' },
		expectedDuration: { numerator: beats, denominator: beatType },
		...(isPickup ? { isPickup: true } : {}),
	} as Measure;
}

function scoreOf(measures: Measure[], vocalLine: VocalLineEvent[], tempoMarkings: ParsedScore['tempoMarkings'] = []): ParsedScore {
	return { measures, vocalLine, tempoMarkings } as ParsedScore;
}

// ── sounding length ─────────────────────────────────────────────────

describe('soundingFromNotation: values from music theory, not from the module', () => {
	it('reads plain and dotted values', () => {
		expect(soundingFromNotation(dur('quarter'))).toEqual({ numerator: 1, denominator: 4 });
		// A dot adds half again: a dotted quarter is three eighths.
		expect(soundingFromNotation(dur('quarter', 1))).toEqual({ numerator: 3, denominator: 8 });
		// Two dots add half and a quarter again: seven sixteenths.
		expect(soundingFromNotation(dur('quarter', 2))).toEqual({ numerator: 7, denominator: 16 });
	});

	it('applies the tuplet ratio in the direction the ratio names', () => {
		// Three eighths in the time of two: each sounds two thirds of an eighth.
		expect(soundingFromNotation(dur('eighth', 0, { actualNotes: 3, normalNotes: 2, normalType: 'eighth' }))).toEqual({
			numerator: 1,
			denominator: 12,
		});
		// A duplet, two in the time of three: each sounds half again as long.
		expect(soundingFromNotation(dur('quarter', 0, { actualNotes: 2, normalNotes: 3, normalType: 'quarter' }))).toEqual({
			numerator: 3,
			denominator: 8,
		});
	});

	it('NEGATIVE CONTROL: refuses input it cannot read rather than returning a number', () => {
		expect(() => soundingFromNotation({ base: 'sesquialtera', dots: 0, fraction: { numerator: 1, denominator: 4 } } as unknown as Duration)).toThrow(
			/Unknown note base/,
		);
		expect(() => soundingFromNotation(dur('quarter', 0, { actualNotes: 0, normalNotes: 2, normalType: 'quarter' }))).toThrow(
			/Unusable tuplet/,
		);
		expect(() => soundingFromFraction({ base: 'quarter', dots: 0 } as unknown as Duration)).toThrow(/unusable/);
	});
});

// ── the metre as arbitrator ─────────────────────────────────────────

describe('the bar line arbitrates between the two readings', () => {
	it('reports `agreed` where the readings agree, and sums once', () => {
		const s = scoreOf([measure(0, 4, 4)], [note(0, 'C', 4, dur('half')), note(0, 'D', 4, dur('half'))]);
		const t = aggregatePhonation(s);
		expect(t.trust.bars.map((b) => b.verdict)).toEqual(['agreed']);
		expect(t.trust.untrustedBars).toBe(0);
		// Two half notes are eight quavers.
		expect(fractionToNumber(t.total)).toBe(8);
	});

	it('picks the notation reading when `fraction` overstates a tuplet and the metre says so', () => {
		// The musx2mxl defect in miniature: a 3:2 half written with an
		// unadjusted <duration>. Three of them fill a 3/2 bar; read from
		// `fraction` they would fill 3/2 x 3/2 and the bar would not close.
		const tuplet = { actualNotes: 3, normalNotes: 2, normalType: 'half' as const };
		const bad = { numerator: 1, denominator: 2 }; // the unadjusted half
		const s = scoreOf(
			[measure(0, 2, 2)],
			[
				note(0, 'C', 4, dur('half', 0, tuplet, bad)),
				note(0, 'D', 4, dur('half', 0, tuplet, bad)),
				note(0, 'E', 4, dur('half', 0, tuplet, bad)),
			],
		);
		const t = aggregatePhonation(s);
		expect(t.trust.bars[0].verdict).toBe('metre-chose-notation');
		expect(t.trust.arbitratedBars).toBe(1);
		// A 2/2 bar is one whole note: eight quavers, not the twelve `fraction` claims.
		expect(fractionToNumber(t.total)).toBe(8);
		expect(fractionToNumber(t.trust.bars[0].fractionSum)).toBe(1.5);
	});

	it('picks the `fraction` reading when IT is the one that closes the bar', () => {
		// The mirror case, so the arbitration is shown to run both ways rather
		// than being a dressed-up preference for one reading.
		const s = scoreOf(
			[measure(0, 4, 4)],
			[note(0, 'C', 4, { base: 'half', dots: 0, fraction: { numerator: 1, denominator: 1 } } as Duration)],
		);
		const t = aggregatePhonation(s);
		expect(t.trust.bars[0].verdict).toBe('metre-chose-fraction');
		expect(fractionToNumber(t.total)).toBe(8);
	});

	it('NEGATIVE CONTROL: marks a bar UNTRUSTED when neither reading closes, and never hides its quavers', () => {
		// A 4/4 bar holding five quarters under one reading and six under the
		// other. Nothing may vouch for this bar.
		const s = scoreOf(
			[measure(0, 4, 4)],
			[
				note(0, 'C', 4, { base: 'half', dots: 0, fraction: { numerator: 3, denominator: 4 } } as Duration),
				note(0, 'D', 4, dur('half')),
				note(0, 'E', 4, dur('quarter')),
			],
		);
		const t = aggregatePhonation(s);
		expect(t.trust.bars[0].verdict).toBe('untrusted');
		expect(t.trust.untrustedBars).toBe(1);
		expect(t.trust.untrustedMeasureIndices).toEqual([0]);
		// The bar's time is included in the total AND named, never dropped:
		// a silent exclusion would be a second unvouched claim.
		expect(fractionToNumber(t.trust.untrustedQuavers)).toBe(fractionToNumber(t.total));
		expect(fractionToNumber(t.total)).toBeGreaterThan(0);
	});

	it('does not fail a pickup bar against a metre it is not meant to fill', () => {
		const s = scoreOf(
			[measure(0, 4, 4, true), measure(1, 4, 4)],
			[
				note(0, 'C', 4, { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 8 } } as Duration),
				note(1, 'D', 4, dur('whole')),
			],
		);
		const t = aggregatePhonation(s);
		expect(t.trust.bars.find((b) => b.measureIndex === 0)?.verdict).toBe('pickup-not-arbitrable');
		expect(t.trust.untrustedBars).toBe(0);
	});
});

// ── what is aggregated, and what is left out ────────────────────────

describe('the totals themselves', () => {
	it('excludes rests, which is what makes it phonation time', () => {
		const s = scoreOf([measure(0, 4, 4)], [note(0, 'C', 4, dur('half')), rest(0, dur('half'))]);
		const t = aggregatePhonation(s);
		expect(fractionToNumber(t.total)).toBe(4);
		expect(t.coverage.rests).toBe(1);
		expect(t.coverage.pitchedNotes).toBe(1);
	});

	it('collapses enharmonics onto one pitch key, since a singer sings one note', () => {
		const aSharp: VocalLineEvent = { ...note(0, 'A', 3, dur('quarter')), pitch: { step: 'A', octave: 3, alter: 1 } } as VocalLineEvent;
		const bFlat: VocalLineEvent = { ...note(0, 'B', 3, dur('quarter')), pitch: { step: 'B', octave: 3, alter: -1 } } as VocalLineEvent;
		const s = scoreOf([measure(0, 2, 4)], [aSharp, bFlat]);
		const t = aggregatePhonation(s);
		expect([...t.byPitch.keys()]).toEqual([58]); // A#3 and Bb3 are both MIDI 58
		expect(fractionToNumber(t.byPitch.get(58)!)).toBe(4);
	});

	it('leaves the vowel totals ABSENT, not empty, when no resolver was supplied', () => {
		const t = aggregatePhonation(scoreOf([measure(0, 4, 4)], [note(0, 'C', 4, dur('whole'))]));
		// Absent means no vowel was ever asked for. Empty would claim it was
		// asked and none found, which is a different and false statement.
		expect(t.byVowel).toBeUndefined();
		expect(t.byPitchByVowel).toBeUndefined();
		expect(t.coverage.notesWithVowel).toBeUndefined();
	});

	it('counts a resolver abstention as an abstention rather than as a vowel', () => {
		const s = scoreOf([measure(0, 4, 4)], [note(0, 'C', 4, dur('half')), note(0, 'D', 4, dur('half'))]);
		let n = 0;
		const t = aggregatePhonation(s, { vowelForEvent: () => (n++ === 0 ? 'a' : undefined) });
		expect(t.coverage.notesWithVowel).toBe(1);
		expect(t.coverage.notesWithoutVowel).toBe(1);
		expect([...t.byVowel!.keys()]).toEqual(['a']);
		// The abstained note still counts as sung time on its pitch: the vowel
		// is unknown, the phonation is not.
		expect(fractionToNumber(t.total)).toBe(8);
		expect(fractionToNumber(t.byVowel!.get('a')!)).toBe(4);
	});

	it('cross-tabulates pitch against vowel and agrees with both margins', () => {
		const s = scoreOf(
			[measure(0, 4, 4)],
			[note(0, 'C', 4, dur('quarter')), note(0, 'C', 4, dur('quarter')), note(0, 'D', 4, dur('half'))],
		);
		const vowels = ['a', 'i', 'a'];
		let k = 0;
		const t = aggregatePhonation(s, { vowelForEvent: () => vowels[k++] });
		const c4 = t.byPitchByVowel!.get(midiOf({ step: 'C', octave: 4, alter: 0 }))!;
		expect(fractionToNumber(c4.get('a')!)).toBe(2);
		expect(fractionToNumber(c4.get('i')!)).toBe(2);
		// The cross-tabulation's margins must equal the one-dimensional totals.
		let sum = 0;
		for (const inner of t.byPitchByVowel!.values()) for (const v of inner.values()) sum += fractionToNumber(v);
		expect(sum).toBe(fractionToNumber(t.total));
	});

	it('refuses a malformed score rather than returning a zero total', () => {
		expect(() => aggregatePhonation({ vocalLine: [], measures: undefined } as unknown as ParsedScore)).toThrow(/ParsedScore/);
	});
});

// ── seconds, and the abstention ─────────────────────────────────────

describe('quavers to seconds', () => {
	const oneWhole = { numerator: 8, denominator: 1 }; // eight quavers

	it('abstains when the score states no tempo', () => {
		const s = scoreOf([measure(0, 4, 4)], [note(0, 'C', 4, dur('whole'))], []);
		expect(secondsFor(oneWhole, s)).toBeUndefined();
		expect(nominalOscillations(69, oneWhole, s)).toBeUndefined();
	});

	it('converts at a stated quarter-note tempo', () => {
		// Quarter = 60: a whole note is four beats, so four seconds.
		const s = scoreOf(
			[measure(0, 4, 4)],
			[note(0, 'C', 4, dur('whole'))],
			[{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter', beatUnitDots: 0 }],
		);
		expect(secondsFor(oneWhole, s)!.seconds).toBeCloseTo(4, 10);
	});

	it('honours dots on the beat unit, which compound metre states', () => {
		// Dotted quarter = 60: a whole note is 8/3 of that beat, so 2.667 seconds.
		const s = scoreOf(
			[measure(0, 6, 8)],
			[note(0, 'C', 4, dur('whole'))],
			[{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter', beatUnitDots: 1 }],
		);
		expect(secondsFor(oneWhole, s)!.seconds).toBeCloseTo(8 / 3, 10);
	});

	it('NEGATIVE CONTROL: a dotted beat unit must NOT give the undotted answer', () => {
		const marking = (dots: number) => [
			{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter' as const, beatUnitDots: dots },
		];
		const plain = secondsFor(oneWhole, scoreOf([measure(0, 4, 4)], [], marking(0)))!.seconds;
		const dotted = secondsFor(oneWhole, scoreOf([measure(0, 6, 8)], [], marking(1)))!.seconds;
		expect(dotted).not.toBeCloseTo(plain, 6);
		expect(plain / dotted).toBeCloseTo(1.5, 10);
	});

	it('counts oscillations against an independently known frequency', () => {
		// A4 is 440 Hz by definition of the standard, not by this module's say-so.
		// One whole note at quarter = 60 is four seconds, so 1760 cycles.
		const s = scoreOf(
			[measure(0, 4, 4)],
			[note(0, 'A', 4, dur('whole'))],
			[{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter', beatUnitDots: 0 }],
		);
		expect(nominalOscillations(69, oneWhole, s)!).toBeCloseTo(1760, 6);
	});
});
