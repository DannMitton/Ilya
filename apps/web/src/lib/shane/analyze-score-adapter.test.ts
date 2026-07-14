/**
 * Tests for the slice-4 analysis adapter.
 *
 * TREE-READY placement copy: identical logic to the sandbox-verified
 * shane-sandbox/analyze-score-adapter.test.ts, with the imports rewritten to
 * the repo-relative form (the sandbox copy used absolute paths so it could
 * run without the repo's macOS-built node_modules). Runs under apps/web's
 * vitest the way the note-picker and vowel-resolver tests do.
 *
 * Two layers:
 *   1. Unit: buildVoiceProfileSnapshot maps formants and characteristics and
 *      reports completeness, per dimension and independently.
 *   2. Integration: the built snapshot fed through the real analyzeScore
 *      proves the sentinels are inert (a missing dimension never fires a
 *      warning) while real characteristics still drive the marks.
 */
import { describe, expect, it } from 'vitest';
import { analyzeScore } from '@ilya/score-parser';
import type { ParsedScore, Pitch, VocalLineEvent, VowelResolver } from '@ilya/score-parser';
import { buildVoiceProfileSnapshot, isBroadAnalysis } from './analyze-score-adapter';
import type { CalibratedFormant, VoiceCharacteristics } from './engine/types';

// ── fixtures ────────────────────────────────────────────────────────
const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function formant(f1: number): CalibratedFormant {
	return { f1, confidence: 'high', reading: 'captured', source: 'measured-user' };
}

function note(id: string, pitch: Pitch): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch,
	};
}

function scoreOf(...events: VocalLineEvent[]): ParsedScore {
	return {
		source: { format: 'musicxml', fidelity: 'native', origin: 'musicxml-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: [],
		keySignatures: [{ measureIndex: 0, signature: { fifths: 0 } }],
		timeSignatures: [{ measureIndex: 0, signature: { beats: 4, beatType: 4 } }],
		tempoMarkings: [],
		vocalLine: events,
	};
}

const resolveA: VowelResolver = () => 'a';
const FORMANTS_A: Partial<Record<'a', CalibratedFormant>> = { a: formant(800) };

const COMPLETE: VoiceCharacteristics = {
	source: 'manual',
	rangeLow: P('E', 3),
	rangeHigh: P('A', 4),
	tessituraLow: P('G', 3),
	tessituraHigh: P('D', 4),
	passaggioPrimary: P('G', 3),
	passaggioSecondary: P('B', 3),
};

const LOW = note('lo', P('C', 3)); // MIDI 48
const MID = note('mid', P('A', 3)); // MIDI 57
const HIGH = note('hi', P('C', 5)); // MIDI 72
const SCORE = scoreOf(LOW, MID, HIGH);

describe('buildVoiceProfileSnapshot mapping', () => {
	it('maps formants to fR1 and copies characteristics verbatim when complete', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(FORMANTS_A, COMPLETE, 'Test voice');
		expect(snapshot.fR1).toEqual({ a: 800 });
		expect(snapshot.range).toEqual({ lowest: P('E', 3), highest: P('A', 4) });
		expect(snapshot.tessitura).toEqual({ low: P('G', 3), high: P('D', 4) });
		expect(snapshot.passaggio).toEqual({ primo: P('G', 3), secondo: P('B', 3) });
		expect(snapshot.label).toBe('Test voice');
		expect(completeness).toEqual({ formants: true, range: true, tessitura: true, passaggio: true });
		expect(isBroadAnalysis(completeness)).toBe(false);
	});

	it('skips formant readings with no usable f1', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(
			{ a: formant(800), e: formant(0), i: formant(-1) } as Partial<Record<'a' | 'e' | 'i', CalibratedFormant>>,
			undefined,
		);
		expect(snapshot.fR1).toEqual({ a: 800 });
		expect(completeness.formants).toBe(true);
	});

	it('reports every dimension broad when characteristics are absent', () => {
		const { completeness } = buildVoiceProfileSnapshot(FORMANTS_A, undefined);
		expect(completeness).toEqual({ formants: true, range: false, tessitura: false, passaggio: false });
		expect(isBroadAnalysis(completeness)).toBe(true);
	});

	it('treats a single declared passaggio as complete (point band)', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(FORMANTS_A, {
			source: 'manual',
			passaggioPrimary: P('F', 4),
		});
		expect(completeness.passaggio).toBe(true);
		expect(snapshot.passaggio).toEqual({ primo: P('F', 4), secondo: P('F', 4) });
	});

	it('marks a half-filled dimension incomplete (range needs both edges)', () => {
		const { completeness } = buildVoiceProfileSnapshot(FORMANTS_A, {
			source: 'manual',
			rangeLow: P('C', 3),
		});
		expect(completeness.range).toBe(false);
	});
});

function statusOf(chars: VoiceCharacteristics | undefined) {
	const { snapshot } = buildVoiceProfileSnapshot(FORMANTS_A, chars);
	const analyzed = analyzeScore(SCORE, snapshot, resolveA, { generatedAt: '2026-07-14T00:00:00Z' });
	const by = (id: string) => analyzed.events[id];
	return {
		lo: { range: by('lo').rangeStatus, pass: by('lo').inPassaggio },
		mid: { range: by('mid').rangeStatus, pass: by('mid').inPassaggio },
		hi: { range: by('hi').rangeStatus, pass: by('hi').inPassaggio },
	};
}

describe('analyzeScore through the adapter', () => {
	it('real characteristics drive out-of-range, in-tessitura, and passaggio', () => {
		const s = statusOf(COMPLETE);
		expect(s.lo.range).toBe('out-of-range');
		expect(s.hi.range).toBe('out-of-range');
		expect(s.mid.range).toBe('in-tessitura');
		expect(s.mid.pass).toBe(true);
		expect(s.lo.pass).toBe(false);
		expect(s.hi.pass).toBe(false);
	});

	it('all dimensions missing: no note is ever out-of-range, in-tessitura, or in passaggio', () => {
		const s = statusOf(undefined);
		for (const probe of [s.lo, s.mid, s.hi]) {
			expect(probe.range).toBe('in-range');
			expect(probe.pass).toBe(false);
		}
	});

	it('per-dimension independence: range alone still bites; tessitura and passaggio stay silent', () => {
		const s = statusOf({ source: 'manual', rangeLow: P('E', 3), rangeHigh: P('A', 4) });
		expect(s.lo.range).toBe('out-of-range');
		expect(s.hi.range).toBe('out-of-range');
		expect(s.mid.range).toBe('in-range');
		expect(s.mid.pass).toBe(false);
	});

	it('no fR1: every event is omitted (notation-only), regardless of characteristics', () => {
		const { snapshot } = buildVoiceProfileSnapshot({}, COMPLETE);
		const analyzed = analyzeScore(SCORE, snapshot, resolveA, { generatedAt: '2026-07-14T00:00:00Z' });
		expect(Object.keys(analyzed.events)).toHaveLength(0);
	});
});
