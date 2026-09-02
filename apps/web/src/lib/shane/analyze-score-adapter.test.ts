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
import { buildVoiceProfileSnapshot, completenessOf, composeBroadNote, isBroadAnalysis } from './analyze-score-adapter';
import type { CalibratedFormant, VoiceCharacteristics } from './engine/types';

// ── fixtures ────────────────────────────────────────────────────────
const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function formant(f1: number): CalibratedFormant {
	return { f1, confidence: 'high', reading: 'captured', source: 'measured-user' };
}

function formantF2(f1: number, f2: number, f2Quality: 'clear' | 'marginal' | 'absent'): CalibratedFormant {
	return { f1, f2, f2Quality, confidence: 'high', reading: 'captured', source: 'measured-user' };
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

	// §B.4 (Dann, 2026-07-15): plausibility excludes, confidence does not. The
	// two are orthogonal by ruling, and only plausibility says whether the
	// number can be the vowel.
	it('excludes a reading the plausibility guard judged implausible', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			{
				a: formant(800),
				// The motivating class: 1063 Hz extracted for a sung [i]. The guard
				// demotes an implausible capture to provisional AND records the verdict.
				i: {
					f1: 1063,
					confidence: 'high',
					reading: 'provisional',
					source: 'measured-user',
					plausibility: 'implausible',
				},
			} as Partial<Record<'a' | 'i', CalibratedFormant>>,
			undefined,
		);
		expect(snapshot.fR1).toEqual({ a: 800 });
	});

	it('keeps a provisional reading with no implausible verdict: a noisy room is not a bad vowel', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(
			{
				// Dann's real stored [i]: provisional purely from confidence: 'low'
				// (analyze.ts:34), and plausible on the guard's own window.
				i: { f1: 247.03, confidence: 'low', reading: 'provisional', source: 'measured-user' },
			} as Partial<Record<'i', CalibratedFormant>>,
			undefined,
		);
		expect(snapshot.fR1).toEqual({ i: 247.03 });
		expect(completeness.formants).toBe(true);
	});

	it('keeps readings the guard never judged: absent or unchecked is not a verdict', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			{
				a: formant(800), // no plausibility field: predates the guard
				o: { ...formant(500), plausibility: 'unchecked' }, // window unavailable
			} as Partial<Record<'a' | 'o', CalibratedFormant>>,
			undefined,
		);
		expect(snapshot.fR1).toEqual({ a: 800, o: 500 });
	});

	// fR2 wiring (§A.153): the second resonance is carried per vowel for the
	// higher-voice work, gated like fR1 plus the f2-specific quality.
	it('maps fR2 per vowel when quality is usable, and omits fR2 entirely when none is', () => {
		const withF2 = buildVoiceProfileSnapshot(
			{ i: formantF2(296, 1705, 'clear') } as Partial<Record<'i', CalibratedFormant>>,
			COMPLETE,
		).snapshot;
		expect(withF2.fR2).toEqual({ i: 1705 });

		const noF2 = buildVoiceProfileSnapshot(FORMANTS_A, COMPLETE).snapshot;
		expect(noF2.fR2).toBeUndefined();
	});

	it('keeps a marginal fR2, drops an absent one, and never guesses a missing f2', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			{
				i: formantF2(296, 1705, 'clear'),
				e: formantF2(381, 1532, 'marginal'),
				a: formantF2(800, 1200, 'absent'),
				o: formant(489), // no f2 at all
			} as Partial<Record<'i' | 'e' | 'a' | 'o', CalibratedFormant>>,
			COMPLETE,
		);
		// [a]'s absent f2 and [o]'s missing one contribute nothing, which is the
		// point of this test. [ɪ] is present because [e] and [i] are its anchors
		// and N.109 derives it here; it is a ruled derivation, not a guess at a
		// missing measurement, and its own tests are below.
		expect(snapshot.fR2).toEqual({ i: 1705, e: 1532, 'ɪ': 1599.5 });
		expect(snapshot.fR1).toEqual({ i: 296, e: 381, a: 800, o: 489, 'ɪ': 393 });
	});

	it('excludes an fR2 from a reading the plausibility guard judged implausible', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			{
				i: formantF2(296, 1705, 'clear'),
				a: {
					f1: 800,
					f2: 1200,
					f2Quality: 'clear',
					confidence: 'high',
					reading: 'captured',
					source: 'measured-user',
					plausibility: 'implausible',
				},
			} as Partial<Record<'i' | 'a', CalibratedFormant>>,
			COMPLETE,
		);
		expect(snapshot.fR2).toEqual({ i: 1705 });
	});

	it('reports every dimension broad when characteristics are absent', () => {
		const { completeness } = buildVoiceProfileSnapshot(FORMANTS_A, undefined);
		expect(completeness).toEqual({ formants: true, range: false, tessitura: false, passaggio: false });
		expect(isBroadAnalysis(completeness)).toBe(true);
	});

	// Option A (Dann, 2026-07-15): no sentinel band. A missing dimension is
	// omitted from the snapshot entirely, not filled with an inert placeholder.
	it('omits range, tessitura, and passaggio from the snapshot when characteristics are absent: no sentinel band', () => {
		const { snapshot } = buildVoiceProfileSnapshot(FORMANTS_A, undefined);
		expect(snapshot.range).toBeUndefined();
		expect(snapshot.tessitura).toBeUndefined();
		expect(snapshot.passaggio).toBeUndefined();
		expect('range' in snapshot).toBe(false);
		expect('tessitura' in snapshot).toBe(false);
		expect('passaggio' in snapshot).toBe(false);
	});

	it('completenessOf derives the same signal from the snapshot as buildVoiceProfileSnapshot reports: the two channels cannot disagree', () => {
		const complete = buildVoiceProfileSnapshot(FORMANTS_A, COMPLETE, 'Test voice');
		expect(completenessOf(complete.snapshot)).toEqual(complete.completeness);

		const broad = buildVoiceProfileSnapshot(FORMANTS_A, undefined);
		expect(completenessOf(broad.snapshot)).toEqual(broad.completeness);
	});

	it('a single declared passaggio yields no zona: one edge is a boundary, not a zone (§B.3)', () => {
		// Primo only: the zona needs both edges (Dann ruled 2026-07-16). No point
		// band, no inferred width; the analysis reads passaggio as not assessed.
		const primoOnly = buildVoiceProfileSnapshot(FORMANTS_A, {
			source: 'manual',
			passaggioPrimary: P('F', 4),
		});
		expect(primoOnly.snapshot.passaggio).toBeUndefined();
		expect('passaggio' in primoOnly.snapshot).toBe(false);
		expect(primoOnly.completeness.passaggio).toBe(false);

		// Secondo only: symmetric, also no zona.
		const secondoOnly = buildVoiceProfileSnapshot(FORMANTS_A, {
			source: 'manual',
			passaggioSecondary: P('F', 4),
		});
		expect(secondoOnly.snapshot.passaggio).toBeUndefined();
		expect(secondoOnly.completeness.passaggio).toBe(false);

		// Both edges: the zona is derived.
		const both = buildVoiceProfileSnapshot(FORMANTS_A, {
			source: 'manual',
			passaggioPrimary: P('F', 4),
			passaggioSecondary: P('A', 4),
		});
		expect(both.snapshot.passaggio).toEqual({ primo: P('F', 4), secondo: P('A', 4) });
		expect(both.completeness.passaggio).toBe(true);
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

	// Option A (Dann, 2026-07-15): absence is genuine, not a permissive
	// default. With no characteristics at all, nothing was assessed: every
	// note's rangeStatus and inPassaggio is `undefined`, never a settled
	// negative finding.
	it('all dimensions missing: rangeStatus and inPassaggio are undefined, not a settled negative finding', () => {
		const s = statusOf(undefined);
		for (const probe of [s.lo, s.mid, s.hi]) {
			expect(probe.range).toBeUndefined();
			expect(probe.pass).toBeUndefined();
		}
	});

	it('per-dimension independence: range alone still bites; tessitura falls back to in-range, passaggio stays undefined', () => {
		const s = statusOf({ source: 'manual', rangeLow: P('E', 3), rangeHigh: P('A', 4) });
		expect(s.lo.range).toBe('out-of-range');
		expect(s.hi.range).toBe('out-of-range');
		expect(s.mid.range).toBe('in-range');
		expect(s.mid.pass).toBeUndefined();
	});

	it('no fR1: every event is omitted (notation-only), regardless of characteristics', () => {
		const { snapshot } = buildVoiceProfileSnapshot({}, COMPLETE);
		const analyzed = analyzeScore(SCORE, snapshot, resolveA, { generatedAt: '2026-07-14T00:00:00Z' });
		expect(Object.keys(analyzed.events)).toHaveLength(0);
	});
});

describe('derived vowels reach the forecast (N.109)', () => {
	// An anchor needs both resonances to be usable, so these carry f2.
	function anchor(f1: number, f2: number, plausibility?: CalibratedFormant['plausibility']): CalibratedFormant {
		return {
			f1,
			f2,
			f2Quality: 'clear',
			confidence: 'high',
			reading: 'captured',
			source: 'measured-user',
			...(plausibility !== undefined ? { plausibility } : {}),
		};
	}

	const I = anchor(300, 2200);
	const U = anchor(350, 850);

	it('i and u with no sung ɨ: fR1.ɨ is the derived 1.365 × i.f1', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot({ i: I, u: U }, undefined);
		expect(snapshot.fR1['ɨ']).toBe(409.5); // 1.365 × 300
		// fR2 rides the same derivation: 2200 − 0.67 × (2200 − 850).
		expect(snapshot.fR2?.['ɨ']).toBe(1295.5);
		// The sung anchors are untouched, and the forecast now has formants.
		expect(snapshot.fR1.i).toBe(300);
		expect(snapshot.fR1.u).toBe(350);
		expect(completeness.formants).toBe(true);
	});

	it('i without u: ɨ is not derived, because an anchor is missing', () => {
		const { snapshot } = buildVoiceProfileSnapshot({ i: I }, undefined);
		expect(snapshot.fR1['ɨ']).toBeUndefined();
		expect(snapshot.fR2?.['ɨ']).toBeUndefined();
		expect(snapshot.fR1.i).toBe(300);
	});

	it('an implausible anchor derives nothing', () => {
		const bad = anchor(1063, 2200, 'implausible');
		const { snapshot } = buildVoiceProfileSnapshot({ i: bad, u: U }, undefined);
		expect(snapshot.fR1['ɨ']).toBeUndefined();
		expect(snapshot.fR2?.['ɨ']).toBeUndefined();
		// §B.4 already dropped the implausible reading itself.
		expect(snapshot.fR1.i).toBeUndefined();
	});

	it('a sung ɨ is kept: a measured reading always wins over a derived one', () => {
		const sung = anchor(430, 1400);
		const { snapshot } = buildVoiceProfileSnapshot({ i: I, u: U, 'ɨ': sung }, undefined);
		expect(snapshot.fR1['ɨ']).toBe(430);
		expect(snapshot.fR2?.['ɨ']).toBe(1400);
	});

	it('none of the anchors: the snapshot is unchanged', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(FORMANTS_A, COMPLETE, 'Test voice');
		expect(snapshot.fR1).toEqual({ a: 800 });
		expect(snapshot.fR2).toBeUndefined();
		expect(completeness.formants).toBe(true);
	});
});

describe('composeBroadNote (§B.5 print legend)', () => {
	const full = { formants: true, range: true, tessitura: true, passaggio: true };
	const EN_SUFFIX = ', because the matching voice characteristics were left blank. The forecast still reflects your measured resonances.';

	it('returns empty string when nothing is broad', () => {
		expect(composeBroadNote(full, 'en')).toBe('');
		expect(composeBroadNote(full, 'fr')).toBe('');
	});

	it('range guidance only: EN and FR', () => {
		const c = { formants: true, range: false, tessitura: true, passaggio: true };
		expect(composeBroadNote(c, 'en')).toBe('Broad analysis: this score is shown without range guidance' + EN_SUFFIX);
		expect(composeBroadNote(c, 'fr')).toBe('Analyse large : cette partition est présentée sans les repères d’ambitus, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision reflète tout de même vos résonances mesurées.');
	});

	it('tessitura blank alone also reads as range guidance', () => {
		const c = { formants: true, range: true, tessitura: false, passaggio: true };
		expect(composeBroadNote(c, 'en')).toContain('without range guidance,');
	});

	it('positional passaggio flags only: EN and FR', () => {
		const c = { formants: true, range: true, tessitura: true, passaggio: false };
		expect(composeBroadNote(c, 'en')).toBe('Broad analysis: this score is shown without positional passaggio flags' + EN_SUFFIX);
		expect(composeBroadNote(c, 'fr')).toBe('Analyse large : cette partition est présentée sans le signalement des notes de passaggio, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision reflète tout de même vos résonances mesurées.');
	});

	it('both dimensions blank: EN joins with and, FR joins with ni', () => {
		const c = { formants: true, range: false, tessitura: true, passaggio: false };
		expect(composeBroadNote(c, 'en')).toBe('Broad analysis: this score is shown without range guidance and positional passaggio flags' + EN_SUFFIX);
		expect(composeBroadNote(c, 'fr')).toBe('Analyse large : cette partition est présentée sans les repères d’ambitus ni le signalement des notes de passaggio, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision reflète tout de même vos résonances mesurées.');
	});
});
