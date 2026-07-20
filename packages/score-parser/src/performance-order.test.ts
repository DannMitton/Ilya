import { describe, it, expect } from 'vitest';
import { scoreInPerformanceOrder } from './performance-order';
import { analyzeScore, type VowelResolver } from './overlay-engine';
import type { VoiceProfileSnapshot } from './analysis-types';
import type { Measure, ParsedScore, VocalLineEvent } from './types';

// ── Fixture builders: one note per measure, id `n{index}` ─────────────────────

const TS = { beats: 4, beatType: 4 } as const;
const KS = { fifths: 0 } as const;
const WHOLE = { numerator: 1, denominator: 1 };

function measure(index: number, extra: Partial<Measure> = {}): Measure {
	return {
		index,
		number: String(index + 1),
		timeSignature: { ...TS },
		keySignature: { ...KS },
		expectedDuration: { ...WHOLE },
		...extra
	};
}

function note(id: string, measureIndex: number): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: { step: 'C', octave: 4, alter: 0 }
	};
}

/** A score with one note per measure (`n{index}`), unless `events` overrides. */
function scoreOf(measures: Measure[], events?: VocalLineEvent[]): ParsedScore {
	return {
		source: { format: 'musicxml', fidelity: 'native', origin: 'musicxml-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures,
		keySignatures: [{ measureIndex: 0, signature: { ...KS } }],
		timeSignatures: [{ measureIndex: 0, signature: { ...TS } }],
		tempoMarkings: [],
		vocalLine: events ?? measures.map((m) => note(`n${m.index}`, m.index))
	};
}

const ids = (s: ParsedScore): string => s.vocalLine.map((e) => e.id).join(' ');

// A resolver + profile that give every note an acoustic event, so `analyzeScore`
// keys the overlay purely by which events the sung sequence actually contains.
const allA: VowelResolver = () => 'a';
const profile: VoiceProfileSnapshot = { fR1: { a: 700 } };

describe('scoreInPerformanceOrder', () => {
	it('a score with no repeats or jumps is the input by reference (as-written)', () => {
		const s = scoreOf([measure(0), measure(1), measure(2)]);
		const r = scoreInPerformanceOrder(s);
		expect(r.score).toBe(s); // same reference: the render path reads exactly this
		expect(r.reordered).toBe(false);
		expect(r.flags).toEqual([]);
	});

	it('takes a simple repeat, in performance order, without touching the input', () => {
		const s = scoreOf([
			measure(0),
			measure(1, { repeatStart: true }),
			measure(2),
			measure(3, { repeatEnd: true }),
			measure(4)
		]);
		const r = scoreInPerformanceOrder(s);
		expect(r.reordered).toBe(true);
		expect(ids(r.score)).toBe('n0 n1 n2 n3 n1 n2 n3 n4');
		// The NOTATED input (what the renderer reads) is untouched.
		expect(ids(s)).toBe('n0 n1 n2 n3 n4');
		expect(r.score).not.toBe(s);
	});

	it('follows a D.C. al Fine: da-capo, then stops at Fine on the return', () => {
		const s = scoreOf([
			measure(0),
			measure(1, { jump: { fine: true } }),
			measure(2, { jump: { daCapo: true } })
		]);
		const r = scoreInPerformanceOrder(s);
		expect(r.reordered).toBe(true);
		expect(ids(r.score)).toBe('n0 n1 n2 n0 n1'); // m2 not re-sung after Fine
		expect(ids(s)).toBe('n0 n1 n2'); // notated order intact
	});

	it('drops material never reached: a D.S. al Fine tail contributes no analysis events', () => {
		// segno@0, Fine@2, D.S.@3, then m4 — a measure the jump never reaches.
		const s = scoreOf([
			measure(0, { jump: { segno: 'A' } }),
			measure(1),
			measure(2, { jump: { fine: true } }),
			measure(3, { jump: { dalSegno: 'A' } }),
			measure(4)
		]);
		const r = scoreInPerformanceOrder(s);
		expect(r.reordered).toBe(true);
		expect(ids(r.score)).toBe('n0 n1 n2 n3 n0 n1 n2'); // n4 is never sung
		expect(r.score.vocalLine.some((e) => e.id === 'n4')).toBe(false);
		expect(s.vocalLine.some((e) => e.id === 'n4')).toBe(true); // still notated

		// The analysis overlay, computed on the sung sequence, omits the never-sung
		// note; computed on the notated score, it would include it. This is the
		// wiring's point: analysis sees performance order.
		const sung = analyzeScore(r.score, profile, allA);
		const notated = analyzeScore(s, profile, allA);
		expect(sung.events['n4']).toBeUndefined();
		expect(notated.events['n4']).toBeDefined();
	});

	it('falls back to as-written and carries the flag when a structure cannot be unfolded', () => {
		const s = scoreOf([measure(0), measure(1, { jump: { markWithoutSound: true } })]);
		const r = scoreInPerformanceOrder(s);
		expect(r.score).toBe(s); // honest fallback: analyse as written
		expect(r.reordered).toBe(false);
		expect(r.flags).toHaveLength(1);
		expect(r.flags[0].code).toBe('jump-mark-without-sound');
		expect(r.flags[0].kind).toBe('ambiguous');
	});

	it('is non-destructive: the input vocal line is unchanged after projection', () => {
		const s = scoreOf([
			measure(0, { repeatStart: true }),
			measure(1, { repeatEnd: true, repeatTimes: 3 })
		]);
		const before = ids(s);
		scoreInPerformanceOrder(s);
		expect(ids(s)).toBe(before);
	});

	it('skips a measure that carries no vocal events (an interlude)', () => {
		// m1 has no note; the repeat still unfolds and the gap is simply absent.
		const events = [note('n0', 0), note('n2', 2)];
		const s = scoreOf(
			[measure(0, { repeatStart: true }), measure(1), measure(2, { repeatEnd: true })],
			events
		);
		const r = scoreInPerformanceOrder(s);
		expect(r.reordered).toBe(true);
		expect(ids(r.score)).toBe('n0 n2 n0 n2');
	});
});
