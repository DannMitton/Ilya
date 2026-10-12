/**
 * QUEUE row 66, Insights for the singer: the gates the page's words rest on.
 *
 * Every expectation is read off the test's own input: shares are counted from
 * the listed notes, turns from the listed fR1 values. The scores are built the
 * way `insights.test.ts` builds them.
 */
import { describe, expect, it } from 'vitest';
import { pitchToMidi, type Measure, type ParsedScore, type Pitch, type VocalLineEvent, type VoiceProfileSnapshot } from '@ilya/score-parser';
import { buildInsights, type InsightsModel } from './insights';
import { cycleDose, cycleDoseSplit } from './singing-measures';
import {
	articleFor,
	countWord,
	isUnlikely,
	longestAboveSecondo,
	shareAtOrAbovePrimo,
	suggestsApproach,
	vowelTurns,
} from './singer-page';
import type { NoteFacts } from './comments';
import { VOWELS } from '$lib/voice/engine/types';
import { pitchName } from '$lib/voice/note-picker';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const QUARTER = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };
const HALF = { base: 'half' as const, dots: 0, fraction: { numerator: 1, denominator: 2 } };

function note(id: string, measureIndex: number, pos: number, pitch: Pitch, duration: VocalLineEvent['duration'] = QUARTER): VocalLineEvent {
	return { id, type: 'note', measureIndex, rhythmicPosition: { fraction: { numerator: pos, denominator: 4 } }, duration, pitch };
}

function score(events: VocalLineEvent[]): ParsedScore {
	const bars = Math.max(...events.map((e) => e.measureIndex)) + 1;
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: Array.from({ length: bars }, (_, i) => ({
			index: i,
			number: String(i + 1),
			timeSignature: { beats: 4, beatType: 4 },
			expectedDuration: { numerator: 1, denominator: 1 },
		})) as Measure[],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events,
	} as unknown as ParsedScore;
}

/** Quarters, four to a bar, in the order given. */
function quarters(pitches: Pitch[]): VocalLineEvent[] {
	return pitches.map((p, i) => note(`n${i}`, Math.floor(i / 4), i % 4, p));
}

const repeat = (p: Pitch, n: number) => Array.from({ length: n }, () => p);

describe('"unlikely": when Ilya says it', () => {
	const span = (lo: Pitch, hi: Pitch) => ({ low: lo, high: hi });
	const tess = (measured: { low: Pitch; high: Pitch }, reference: { low: Pitch; high: Pitch }) =>
		({ measured: { ...measured, basis: 'pacheco', marginal: false }, withheldFor: null, reference, flag: 'above' }) as unknown as InsightsModel['tessitura'];
	const typed = span(P('D', 3), P('B', 3, -1)); // 50 to 58

	it('says it when a note is outside the typed range', () => {
		expect(isUnlikely({ verdict: 'outside-range', tessitura: tess(typed, typed) })).toBe(true);
	});

	it('says it when the tessitura passes the typed one by more than a whole tone', () => {
		// The band's top, C♯4 (61), is 3 semitones over B♭3 (58).
		expect(isUnlikely({ verdict: 'outside-tessitura', tessitura: tess(span(P('E', 3), P('C', 4, 1)), typed) })).toBe(true);
		// The band's floor, B2 (47), is 3 under D3 (50).
		expect(isUnlikely({ verdict: 'outside-tessitura', tessitura: tess(span(P('B', 2), P('A', 3)), typed) })).toBe(true);
	});

	it('keeps today’s line when the tessitura passes by a whole tone or less', () => {
		// C4 (60) is 2 over B♭3: a whole tone, not more.
		expect(isUnlikely({ verdict: 'outside-tessitura', tessitura: tess(span(P('E', 3), P('C', 4)), typed) })).toBe(false);
		// B3 (59) is 1 over.
		expect(isUnlikely({ verdict: 'outside-tessitura', tessitura: tess(span(P('E', 3), P('B', 3)), typed) })).toBe(false);
	});

	it('never says it of a key that fits', () => {
		expect(isUnlikely({ verdict: 'fit', tessitura: tess(typed, typed) })).toBe(false);
	});
});

describe('the longest note held above the secondo', () => {
	const sc = score(quarters([P('E', 4), P('C', 4), P('F', 4), P('F', 4)]));
	const fact = (i: number, toSecondo: number, chainSeconds: number, chainHead = true, held = true) =>
		({ note: { eventId: `n${i}`, measureIndex: 0, vowel: 'i', held }, toSecondo, chainSeconds, chainHead }) as unknown as NoteFacts;

	it('names the longest hold above the secondo, with its bar and seconds', () => {
		const facts = [fact(0, 1, 4), fact(1, -3, 9), fact(2, 2, 2.5), fact(3, 2, 2.5, false)];
		// n1 is held longest but sits under the secondo; n0's 4 s beats n2's 2.5 s.
		expect(longestAboveSecondo(facts, sc)).toEqual({ eventId: 'n0', measure: '1', pitch: P('E', 4), vowel: 'i', seconds: 4 });
	});

	it('names nothing when nothing is held above it, a passing note included', () => {
		expect(longestAboveSecondo([fact(1, -3, 9)], sc)).toBeNull();
		expect(longestAboveSecondo([fact(0, 1, 6, true, false)], sc)).toBeNull();
		expect(longestAboveSecondo(null, sc)).toBeNull();
	});
});

describe('the cycle dose, split by the typed tessitura', () => {
	const row = (midi: number, quavers: number) => ({ midi, spellings: [], quavers, tags: [] });
	const price = (q: number) => ({ kind: 'point' as const, seconds: q * 0.25 });
	const rows = [row(48, 8), row(50, 8), row(55, 8), row(60, 8), row(62, 8)];

	it('puts each pitch under, within, or above, the edges within, and the three sum to the whole', () => {
		const split = cycleDoseSplit(rows, price, { low: 50, high: 60 })!;
		expect(split.under).toEqual(cycleDose([row(48, 8)], price));
		expect(split.within).toEqual(cycleDose([row(50, 8), row(55, 8), row(60, 8)], price));
		expect(split.above).toEqual(cycleDose([row(62, 8)], price));
		const whole = cycleDose(rows, price)!;
		const sum = [split.under, split.within, split.above].reduce((a, d) => a + (d.kind === 'point' ? d.cycles : 0), 0);
		expect(whole.kind === 'point' && Math.abs(whole.cycles - sum) < 1e-6).toBe(true);
	});

	it('prints zero for an empty part, and nothing without a tempo or a typed tessitura', () => {
		expect(cycleDoseSplit([row(55, 8)], price, { low: 50, high: 60 })!.under).toEqual({ kind: 'point', cycles: 0 });
		expect(cycleDoseSplit(rows, null, { low: 50, high: 60 })).toBeNull();
		expect(cycleDoseSplit(rows, price, null)).toBeNull();
	});
});

describe('time per vowel against where it turns', () => {
	/* Bar 1: A2 A2 D3 D3. Bar 2: D3 D3 F3 F3. Bar 3: E♭4 (half) D3 (half). */
	const line = [
		note('a', 0, 0, P('A', 2)),
		note('b', 0, 1, P('A', 2)),
		note('c', 0, 2, P('D', 3)),
		note('d', 0, 3, P('D', 3)),
		note('e', 1, 0, P('D', 3)),
		note('f', 1, 1, P('D', 3)),
		note('g', 1, 2, P('F', 3)),
		note('h', 1, 3, P('F', 3)),
		note('i', 2, 0, P('E', 4, -1), HALF),
		note('j', 2, 2, P('D', 3), HALF),
	];
	const vowelOf: Record<string, string> = { a: 'a', b: 'a', c: 'i', d: 'i', e: 'i', f: 'i', g: 'u', h: 'u', i: 'u', j: 'i' };
	// Turns: [a] 650/2 = 325 Hz; [i] 300/2 = 150 Hz; [u] 350/2 = 175 Hz.
	const profile: VoiceProfileSnapshot = { fR1: { a: 650, i: 300, u: 350 } };
	const turns = vowelTurns(score(line), profile, (ev) => vowelOf[ev.id])!;

	it('lists the vowels in the order of Mitton (2020) Figure 4.2, every one of them', () => {
		expect(turns.rows.map((r) => r.vowel)).toEqual([...VOWELS]);
		expect(turns.rows.find((r) => r.vowel === 'o')!.sung).toBe(false);
	});

	it('counts a note past its vowel’s turn only at or above fR1 ÷ 2', () => {
		// [u]: F3 (174.6 Hz) is just under 175 Hz; E♭4 (311 Hz) is past. 4 of 24 quavers.
		const u = turns.rows.find((r) => r.vowel === 'u')!;
		expect(u.pastShare).toBe(4 / 24);
		expect(u.share).toBe(8 / 24);
		expect(pitchToMidi(u.turn!)).toBe(53); // 175 Hz, nearest F3
		// [i]: D3 (146.8 Hz) is under 150 Hz, never past. [a]: A2 (110 Hz) is under 325 Hz.
		expect(turns.rows.find((r) => r.vowel === 'i')!.pastShare).toBe(0);
		expect(turns.pastShare).toBe(4 / 24);
	});

	it('draws a vowel with no fR1 without a turn', () => {
		const t2 = vowelTurns(score(line), { fR1: { a: 650, i: 300 } }, (ev) => vowelOf[ev.id])!;
		expect(t2.rows.find((r) => r.vowel === 'u')!.turn).toBeNull();
		expect(t2.rows.find((r) => r.vowel === 'u')!.pastShare).toBe(0);
	});
});

describe('teacher line A', () => {
	it('sits on a comment that suggests an approach, and on no comment that only describes', () => {
		expect(suggestsApproach({ visible: [{ id: 'x' }] })).toBe(true);
		expect(suggestsApproach({ visible: [] })).toBe(false);
	});
});

describe('words the sentences need', () => {
	it('spells counts up to twenty, French in the feminine for « mesure »', () => {
		expect(countWord(11, 'en')).toBe('eleven');
		expect(countWord(11, 'fr')).toBe('onze');
		expect(countWord(1, 'fr')).toBe('une');
		expect(countWord(21, 'en')).toBe('21');
	});

	it('takes "an" before A, E, and F', () => {
		expect(articleFor(P('E', 4))).toBe('an');
		expect(articleFor(P('D', 4))).toBe('a');
	});

	it('names a pitch as English does in both languages: letter, accidental, American index (QUEUE row 68)', () => {
		for (const language of ['en', 'fr'] as const) {
			expect(pitchName(P('A', 4), language)).toBe('A4'); // 440 Hz
			expect(pitchName(P('C', 4), language)).toBe('C4'); // middle C
			expect(pitchName(P('D', 4, 1), language)).toBe('D♯4');
			expect(pitchName(P('E', 3, -1), language)).toBe('E♭3');
		}
		// No solfège and no French index survive in the French path.
		expect(pitchName(P('A', 4), 'fr')).not.toMatch(/la|3/);
	});
});
