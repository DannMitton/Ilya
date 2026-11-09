/**
 * N.182 (row 71): the search for a key, and the fractions its lines are said in.
 *
 * Every expectation is read off the test's own input, as `singer-page.test.ts`
 * does: the shares are counted from the listed notes. The three FIXTURE VOICES
 * the brief asks for are named here, each with a typed range and typed
 * passaggi: the tenor `TENOR`, the soprano `SOPRANO`, the bass `BASS`.
 */
import { describe, expect, it } from 'vitest';
import type { IntakeAnswers, Measure, ParsedScore, Pitch, VocalLineEvent, VoiceProfileSnapshot } from '@ilya/score-parser';
import { FRACTION_BANDS, FRACTION_FLOOR, fractionOf } from './key-fractions';
import {
	MAX_KEY_GROUPS,
	MAX_NAMED_PASSAGES,
	RANGE_CHALLENGE_MARGIN,
	challengeCount,
	challengeWeight,
	improves,
	matters,
	measureKey,
	primoApplies,
	stakesOf,
	suggestKeys,
	suits,
	type KeyOption,
	type KeySearchInput,
} from './key-suggest';
import type { NoteFacts } from './comments';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const QUARTER = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };

function note(id: string, measureIndex: number, pos: number, pitch: Pitch): VocalLineEvent {
	return { id, type: 'note', measureIndex, rhythmicPosition: { fraction: { numerator: pos, denominator: 4 } }, duration: QUARTER, pitch };
}
function score(events: VocalLineEvent[]): ParsedScore {
	const bars = Math.max(...events.map((e) => e.measureIndex)) + 1;
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: Array.from({ length: bars }, (_, i) => ({ index: i, number: String(i + 1), timeSignature: { beats: 4, beatType: 4 }, expectedDuration: { numerator: 1, denominator: 1 } })) as Measure[],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events,
	} as unknown as ParsedScore;
}
/** Quarters, four to a bar, in the order given. */
const quarters = (pitches: Pitch[]) => pitches.map((p, i) => note(`n${i}`, Math.floor(i / 4), i % 4, p));
const repeat = (p: Pitch, n: number) => Array.from({ length: n }, () => p);

/** FIXTURE VOICES, each with a typed range and typed passaggi. */
const TENOR: VoiceProfileSnapshot = { fR1: { a: 650 }, range: { lowest: P('C', 3), highest: P('A', 4) }, passaggio: { primo: P('D', 4), secondo: P('G', 4) } };
const SOPRANO: VoiceProfileSnapshot = { fR1: { a: 650 }, range: { lowest: P('C', 4), highest: P('C', 6) }, passaggio: { primo: P('E', 4), secondo: P('F', 5) } };
const BASS: VoiceProfileSnapshot = { fR1: { a: 650 }, range: { lowest: P('E', 2), highest: P('E', 4) }, passaggio: { primo: P('B', 2), secondo: P('E', 3) } };

const input = (sc: ParsedScore, profile: VoiceProfileSnapshot, voiceType?: string, more: Partial<KeySearchInput> = {}): KeySearchInput => ({ score: sc, profile, voiceType, facts: null, ...more });

describe('a share said as a fraction', () => {
	it('says the bands the table lists, from the floor up, and nothing under the floor', () => {
		expect(fractionOf(0.19)).toBeNull();
		expect(fractionOf(FRACTION_FLOOR)).toBe('quarter');
		expect(fractionOf(0.25)).toBe('quarter');
		expect(fractionOf(0.33)).toBe('third');
		expect(fractionOf(0.44)).toBe('nearHalf');
		expect(fractionOf(0.5)).toBe('half');
		expect(fractionOf(0.7)).toBe('most');
		expect(fractionOf(1)).toBe('most');
	});
	it('keeps its table ascending and its first band at the floor', () => {
		expect(FRACTION_BANDS[0].from).toBe(FRACTION_FLOOR);
		for (let i = 1; i < FRACTION_BANDS.length; i++) expect(FRACTION_BANDS[i].from).toBeGreaterThan(FRACTION_BANDS[i - 1].from);
	});
	it('says nothing for a share that is not a number', () => {
		expect(fractionOf(Number.NaN)).toBeNull();
	});
});

describe('the primo belongs to tenor, baritone, bass-baritone, and bass (Dann 2026-10-11 23:20, review A2)', () => {
	it('is measured for those four and for no other type', () => {
		for (const v of ['tenor', 'baritone', 'bass-baritone', 'bass']) expect(primoApplies(v), v).toBe(true);
		for (const v of ['soprano', 'mezzo-soprano', 'contralto', 'countertenor', 'not-sure', undefined, '']) expect(primoApplies(v), String(v)).toBe(false);
	});
	it('gives a soprano a set with no primo axis, and a tenor one with it, on the same notes', () => {
		const sc = score(quarters(repeat(P('E', 5), 8)));
		const wide: VoiceProfileSnapshot = { ...SOPRANO, range: { lowest: P('C', 4), highest: P('C', 6) } };
		const s = measureKey(input(sc, wide, 'soprano'), 0)!;
		expect(s.set.primo).toBeUndefined();
		expect(s.primoShare).toBeNull();
		const t = measureKey(input(sc, { ...TENOR, range: { lowest: P('C', 3), highest: P('C', 6) } }, 'tenor'), 0)!;
		expect(t.set.primo).toBe(true);
		expect(t.primoShare).toBe(1);
	});
	it('has no primo axis with no declared type, or "not sure"', () => {
		const sc = score(quarters(repeat(P('A', 4), 8)));
		expect(measureKey(input(sc, TENOR, undefined), 0)!.set.primo).toBeUndefined();
		expect(measureKey(input(sc, TENOR, 'not-sure'), 0)!.set.primo).toBeUndefined();
	});
});

describe('the weights of the stakes (rule 5)', () => {
	it('weighs points 1 to 2 as 1, point 3 as 0.75, points 4 to 5 as 0.5, and no answer or "not sure" as 1', () => {
		expect([1, 2, 3, 4, 5].map((p) => challengeWeight(p as 1))).toEqual([1, 1, 0.75, 0.5, 0.5]);
		expect(challengeWeight(undefined)).toBe(1);
		expect(challengeWeight('not-sure')).toBe(1);
	});
	it('sums each challenge by the answer to its own question', () => {
		const intake = { top: 5, bottom: 1, passaggi: 3, sustained: 4 } as IntakeAnswers;
		expect(stakesOf({ range: 'above' }, intake)).toBe(0.5);
		expect(stakesOf({ range: 'both' }, intake)).toBe(1.5);
		expect(stakesOf({ range: 'inside', primo: true, secondo: true, sustained: true }, intake)).toBe(0.75 + 0.75 + 0.5);
		expect(stakesOf({ range: 'inside' }, intake)).toBe(0);
	});
});

describe('one key, measured', () => {
	it('names the passages out of range by bar, the one with the most sung time first, never by note or pitch', () => {
		// Typed tenor top A4. Bars 1: A4 inside. Bar 2: B4 once. Bars 5 and 6: B4 twice then C5 twice (two bars, one run).
		const sc = score([
			...[P('A', 4), P('A', 4), P('A', 4), P('A', 4)].map((p, i) => note(`a${i}`, 0, i, p)),
			note('b0', 1, 0, P('B', 4)),
			...[P('G', 4), P('G', 4), P('G', 4)].map((p, i) => note(`b${i + 1}`, 1, i + 1, p)),
			...[P('B', 4), P('B', 4), P('C', 5), P('C', 5)].map((p, i) => note(`c${i}`, 4, i, p)),
			...[P('C', 5), P('C', 5), P('B', 4), P('B', 4)].map((p, i) => note(`d${i}`, 5, i, p)),
		]);
		const k = measureKey(input(sc, TENOR, 'tenor'), 0)!;
		expect(k.set.range).toBe('above');
		expect(k.above!.semitones).toBe(3); // C5 (72) over A4 (69)
		expect(k.workable).toBe(false);
		expect(k.above!.passages).toEqual([
			{ from: '5', to: '6', time: 8 * 0.25 },
			{ from: '2', to: '2', time: 0.25 },
		]);
		expect(JSON.stringify(k)).not.toMatch(/"pitch"|"step"|"octave"|count/);
	});
	it('counts a key two semitones past the range as workable and three as not (RANGE_CHALLENGE_MARGIN)', () => {
		expect(RANGE_CHALLENGE_MARGIN).toBe(2);
		const sc = score(quarters(repeat(P('A', 4), 4)));
		expect(measureKey(input(sc, TENOR, 'tenor'), 2)!.workable).toBe(true);
		expect(measureKey(input(sc, TENOR, 'tenor'), 3)!.workable).toBe(false);
	});
	it('reads a note below the range as a range challenge below', () => {
		const sc = score(quarters([...repeat(P('D', 3), 4), ...repeat(P('A', 3), 4)]));
		const k = measureKey(input(sc, TENOR, 'tenor'), -3)!; // D3 -> B2 (47), one under C3 (48)
		expect(k.set.range).toBe('below');
		expect(k.below!.semitones).toBe(1);
		expect(k.workable).toBe(true);
	});
	it('leaves a missing typed range without a key, and a missing passaggio with the range axis only', () => {
		const sc = score(quarters(repeat(P('A', 3), 4)));
		expect(measureKey(input(sc, { fR1: { a: 650 } }, 'tenor'), 0)).toBeNull();
		const noPass = measureKey(input(sc, { fR1: { a: 650 }, range: TENOR.range }, 'tenor'), 0)!;
		expect(noPass.set).toEqual({ range: 'inside' });
		expect(noPass.primoShare).toBeNull();
		expect(noPass.secondoShare).toBeNull();
	});
	it('names a sustained note above the secondo by its bar, moved by the key', () => {
		const sc = score(quarters(repeat(P('A', 3), 8)));
		const fact = { note: { eventId: 'n5', measureIndex: 1, held: true }, chainHead: true, toSecondo: 1, chainSeconds: 4 } as unknown as NoteFacts;
		const here = measureKey(input(sc, TENOR, 'tenor', { facts: [fact] }), 0)!;
		expect(here.sustained).toEqual({ bar: '2' });
		expect(here.set.sustained).toBe(true);
		const lower = measureKey(input(sc, TENOR, 'tenor', { facts: [fact] }), -1)!; // toSecondo 1 - 1 = 0: at the secondo, not above
		expect(lower.sustained).toBeNull();
		const passing = { ...fact, note: { ...fact.note, held: false } } as unknown as NoteFacts;
		expect(measureKey(input(sc, TENOR, 'tenor', { facts: [passing] }), 0)!.sustained).toBeNull();
	});
	it('leaves a placeholder (surrogate) vowel out of the share past the turn, and returns null when none is left', () => {
		const sc = score(quarters(repeat(P('A', 4), 8)));
		const sung: VoiceProfileSnapshot = { ...TENOR, fR1: { a: 650 }, fR1Source: { a: 'sung' } };
		const surrogate: VoiceProfileSnapshot = { ...TENOR, fR1: { a: 650 }, fR1Source: { a: 'surrogate' } };
		const vowelForEvent = () => 'a';
		expect(measureKey(input(sc, sung, 'tenor', { vowelForEvent }), 0)!.pastTurn).toBe(1);
		expect(measureKey(input(sc, surrogate, 'tenor', { vowelForEvent }), 0)!.pastTurn).toBeNull();
		const derived: VoiceProfileSnapshot = { ...TENOR, fR1: { a: 650 }, fR1Source: { a: 'derived' } };
		expect(measureKey(input(sc, derived, 'tenor', { vowelForEvent }), 0)!.pastTurn).toBe(1);
	});
});

describe('the keys to show (rules 1 to 9)', () => {
	// TENOR: range C3 to A4, primo D4, secondo G4. A4 eight times, E4 four, C4 four.
	const tenorHigh = score(quarters([...repeat(P('A', 4), 8), ...repeat(P('E', 4), 4), ...repeat(P('C', 4), 4)]));

	it('searches whether or not the key read is in range, and measures every move from the score given (A1)', () => {
		const s = suggestKeys(input(tenorHigh, TENOR, 'tenor'))!;
		expect(s.written.semitones).toBe(0);
		expect(s.written.set.range).toBe('inside');
		expect(s.kind).toBe('keys');
		// The same notes already drawn a tone lower give the mirror: the search starts from the score it is handed.
		const lowered = score(quarters([...repeat(P('G', 4), 8), ...repeat(P('D', 4), 4), ...repeat(P('B', 3, -1), 4)]));
		expect(suggestKeys(input(lowered, TENOR, 'tenor'))!.written.set).not.toEqual(s.written.set);
	});

	it('shows one key per challenge set, its smallest move that improves something, never more than three', () => {
		const s = suggestKeys(input(tenorHigh, TENOR, 'tenor'))!;
		expect(s.shown.length).toBeGreaterThan(0);
		expect(s.shown.length).toBeLessThanOrEqual(MAX_KEY_GROUPS);
		const sets = s.shown.map((k) => JSON.stringify(k.set));
		expect(new Set(sets).size).toBe(sets.length);
		for (const k of s.shown) {
			expect(k.workable).toBe(true);
			expect(improves(k, s.written)).toBe(true);
		}
	});

	it('never shows a key that only adds challenges to a key that has some', () => {
		const s = suggestKeys(input(tenorHigh, TENOR, 'tenor'))!;
		for (const k of [...s.shown, ...s.reveal.filter((r) => r.workable)]) expect(k.semitones).toBeLessThan(0);
	});

	it('orders by stakes for this singer, then the smaller share at or above the primo, then the smaller move, then the lower key', () => {
		const s = suggestKeys(input(tenorHigh, TENOR, 'tenor'))!;
		const key = (k: KeyOption) => [k.stakes, k.primoShare ?? 0, Math.abs(k.semitones), k.semitones];
		for (let i = 1; i < s.shown.length; i++) {
			const [a, b] = [key(s.shown[i - 1]), key(s.shown[i])];
			const firstDifference = a.findIndex((x, n) => x !== b[n]);
			expect(firstDifference === -1 || a[firstDifference] < b[firstDifference]).toBe(true);
		}
	});

	it('answers "suits" for a key whose challenge set is empty, and shows no key under the lines', () => {
		const easy = score(quarters(repeat(P('A', 3), 8)));
		const s = suggestKeys(input(easy, TENOR, 'tenor'))!;
		expect(suits(s.written)).toBe(true);
		expect(s.kind).toBe('suits');
		expect(s.shown).toEqual([]);
	});

	it('for a voice without a primo axis, "suits" means inside the range, nothing above the secondo, and no sustained note above it', () => {
		const low = score(quarters(repeat(P('G', 4), 8))); // soprano: above the primo but not above her secondo F5
		expect(suggestKeys(input(low, SOPRANO, 'soprano'))!.kind).toBe('suits');
		const high = score(quarters(repeat(P('A', 5), 8))); // above the secondo F5
		expect(suggestKeys(input(high, SOPRANO, 'soprano'))!.kind).not.toBe('suits');
	});

	it('answers "noneBetter" when the key read has a challenge and no key improves on it', () => {
		// A tenor's whole piece on one pitch above the secondo, range the whole of C3 to C6 so range is never the challenge:
		// every key within six semitones down still sits at or above the primo and above the secondo until it falls below G4.
		const wide: VoiceProfileSnapshot = { ...TENOR, range: { lowest: P('C', 2), highest: P('C', 6) }, passaggio: { primo: P('D', 3), secondo: P('G', 3) } };
		const sc = score(quarters(repeat(P('C', 5), 8)));
		const s = suggestKeys(input(sc, wide, 'tenor'))!;
		expect(s.written.set.secondo).toBe(true);
		expect(s.kind).toBe('noneBetter');
		expect(s.shown).toEqual([]);
	});

	it('answers "noWorkable" when the key read is beyond the margin and no key within reach is workable', () => {
		// Thirty-six semitones of piece cannot fit the range of a tenor in a window of six either way.
		const sc = score(quarters([...repeat(P('C', 2), 4), ...repeat(P('C', 6), 4)]));
		const s = suggestKeys(input(sc, TENOR, 'tenor'))!;
		expect(s.written.workable).toBe(false);
		expect(s.kind).toBe('noWorkable');
		expect(s.shown).toEqual([]);
		expect(s.reveal.length).toBe(12);
	});

	it('puts the keys beyond the margin under the reveal, nearest first', () => {
		const s = suggestKeys(input(tenorHigh, TENOR, 'tenor'))!;
		const beyond = s.reveal.filter((k) => !k.workable);
		expect(beyond.length).toBeGreaterThan(0);
		const dist = beyond.map((k) => Math.abs(k.semitones));
		expect(dist).toEqual([...dist].sort((a, b) => a - b));
	});

	it('returns nothing without a typed range', () => {
		expect(suggestKeys(input(tenorHigh, { fR1: { a: 650 } }, 'tenor'))).toBeNull();
	});

	it('searches the range alone without typed passaggi', () => {
		const high = score(quarters(repeat(P('C', 5), 4)));
		const s = suggestKeys(input(high, { fR1: { a: 650 }, range: TENOR.range }, 'tenor'))!;
		for (const k of [s.written, ...s.shown, ...s.reveal]) {
			expect(k.set.primo).toBeUndefined();
			expect(k.set.secondo).toBeUndefined();
			expect(k.primoShare).toBeNull();
		}
	});

	/* ROW 71, 2026-11-05 11:49: a key is offered only when it has FEWER challenges, so four qualifying groups on one real
	   piece no longer turn up (the seeded search that found the earlier piece found none in 240 s on the new rule). The cap
	   is therefore checked with `maxGroups`, a test-only argument, on the same piece: with a cap of two, the third group
	   goes under the reveal and `capBound` says so. If the cap stops cutting, a singer is shown more keys than the design allows. */
	it('caps the groups shown, reports that the cap bound, and keeps the others under the reveal', () => {
		// Found by a seeded search over 16-note pieces for the tenor (MIDI numbers, quarters); three groups qualify on the new rule.
		const midi = [60, 56, 52, 67, 58, 61, 57, 68, 71, 59, 58, 65, 68, 61, 54, 56];
		const names: Array<[Pitch['step'], number]> = [['C', 0], ['C', 1], ['D', 0], ['E', -1], ['E', 0], ['F', 0], ['F', 1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0]];
		const sc = score(quarters(midi.map((m) => P(names[m % 12][0], Math.floor(m / 12) - 1, names[m % 12][1]))));
		const s = suggestKeys(input(sc, TENOR, 'tenor'))!;
		expect(s.kind).toBe('keys');
		expect(s.shown.map((k) => k.semitones)).toEqual([-4, -5, -2]);
		expect(s.shown.length).toBeLessThanOrEqual(MAX_KEY_GROUPS);
		expect(s.capBound).toBe(false);
		const capped = suggestKeys(input(sc, TENOR, 'tenor', { maxGroups: 2 }))!;
		expect(capped.shown.map((k) => k.semitones)).toEqual([-4, -5]);
		expect(capped.capBound).toBe(true);
		expect(capped.reveal.filter((k) => k.workable).map((k) => k.semitones)).toEqual([-2]);
	});

	it('leaves the answers out of which keys are shown, and uses them only for the order', () => {
		const a = suggestKeys(input(tenorHigh, TENOR, 'tenor', { intake: { top: 1, bottom: 1, passaggi: 1, sustained: 1 } as IntakeAnswers }))!;
		const b = suggestKeys(input(tenorHigh, TENOR, 'tenor', { intake: { top: 5, bottom: 5, passaggi: 5, sustained: 5 } as IntakeAnswers }))!;
		const names = (s: typeof a) => s.shown.map((k) => k.semitones).sort((x, y) => x - y);
		expect(names(a)).toEqual(names(b));
	});

	it('names at most two passages in a line (the constant the words read)', () => {
		expect(MAX_NAMED_PASSAGES).toBe(2);
	});
});

describe('what matters, as the brief words it', () => {
	const k = (set: KeyOption['set'], primoShare: number | null = null): KeyOption =>
		({ semitones: -1, workable: true, set, above: null, below: null, primoShare, secondoShare: null, sustained: null, pastTurn: null, stakes: 0 });
	it('notices a challenge gained or lost, or a share moved by ten points', () => {
		expect(matters(k({ range: 'inside', secondo: false }), k({ range: 'inside', secondo: true }))).toBe(true);
		expect(matters(k({ range: 'inside', primo: true }, 0.5), k({ range: 'inside', primo: true }, 0.65))).toBe(true);
		expect(matters(k({ range: 'inside', primo: true }, 0.5), k({ range: 'inside', primo: true }, 0.55))).toBe(false);
	});
	/* ROW 71, RULED BY DANN 2026-11-05 11:49: "Recommend keys that reduce the challenges." The test counts the challenges in
	   the set and nothing else. It pins that a swap of one challenge for another, a share that only falls, and a key that only
	   adds challenges are never offered; if it offered a swap, a singer would be shown a key that trades one hurdle for another. */
	it('offers a key only when it has fewer challenges', () => {
		expect(improves(k({ range: 'inside', secondo: false }), k({ range: 'inside', secondo: true }))).toBe(true);
		expect(improves(k({ range: 'inside' }), k({ range: 'above' }))).toBe(true);
		expect(improves(k({ range: 'inside', primo: true }), k({ range: 'both', primo: true }))).toBe(true);
	});
	it('never offers a swap, a share that only falls, or a key that only adds', () => {
		expect(improves(k({ range: 'below' }), k({ range: 'above' }))).toBe(false); // one for one
		expect(improves(k({ range: 'inside', primo: true }), k({ range: 'above' }))).toBe(false); // the range goes, the primo comes
		expect(improves(k({ range: 'inside', primo: true }, 0.4), k({ range: 'inside', primo: true }, 0.55))).toBe(false); // a share down ten points, same set
		expect(improves(k({ range: 'inside', secondo: true }), k({ range: 'inside', secondo: false }))).toBe(false); // only adds
		expect(improves(k({ range: 'inside' }), k({ range: 'inside' }))).toBe(false);
	});
	it('counts each named axis once: both sides of the range are two challenges', () => {
		expect(challengeCount({ range: 'inside' })).toBe(0);
		expect(challengeCount({ range: 'above' })).toBe(1);
		expect(challengeCount({ range: 'both' })).toBe(2);
		expect(challengeCount({ range: 'above', primo: true, secondo: true, sustained: true })).toBe(4);
	});
});
