/**
 * Tests for the slice-4 analysis adapter.
 *
 * TREE-READY placement copy: identical logic to the sandbox-verified
 * sandbox copy (then `shane-sandbox/`) of this test, with the imports rewritten to
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
import type { CalibratedFormant, VoiceCharacteristics } from '$lib/voice/engine/types';

// ── fixtures ────────────────────────────────────────────────────────
const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

/**
 * QUEUE row 17: every gap now takes a stand-in, flagged 'surrogate'. These tests are
 * about what the singer sang and what derives from it, so they read those values
 * alone; the stand-ins have their own tests (`stand-ins.test.ts`).
 */
const own = (s: { fR1: Record<string, number>; fR1Source?: Record<string, string> }) =>
	Object.fromEntries(Object.entries(s.fR1).filter(([v]) => s.fR1Source?.[v] !== 'surrogate'));
const own2 = (s: { fR2?: Record<string, number>; fR2Source?: Record<string, string> }) => {
	const out = Object.fromEntries(Object.entries(s.fR2 ?? {}).filter(([v]) => s.fR2Source?.[v] !== 'surrogate'));
	return Object.keys(out).length ? out : undefined;
};

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
/**
 * LANE 67: a voice is personal from five of the six core vowels (`voice/engine/sung.ts`, `isPersonal`); below that the values are those of a voice with
 * nothing recorded. These tests are about how a reading maps to a number, so each starts from a full set of the six core vowels (a bass's, Mitton 2020
 * Table 5.3) and changes what it is about. `personal(over)` is that set with `over` laid on it.
 */
const CORE6 = {
	i: formantF2(296, 1705, 'clear'), e: formantF2(381, 1532, 'clear'), ɛ: formantF2(577, 1311, 'clear'),
	ɑ: formantF2(617, 1013, 'clear'), o: formantF2(489, 826, 'clear'), u: formantF2(346, 804, 'clear'),
} as const;
const personal = (over: Partial<Record<string, CalibratedFormant>> = {}): Partial<Record<'a' | 'e' | 'i' | 'o' | 'u' | 'ɑ' | 'ɛ' | 'ɨ' | 'ɪ' | 'ʌ', CalibratedFormant>> => ({ ...CORE6, ...over });
const FORMANTS_A = personal({ a: formant(800) });

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
		expect(own(snapshot).a).toBe(800);
		expect(snapshot.range).toEqual({ lowest: P('E', 3), highest: P('A', 4) });
		expect(snapshot.tessitura).toEqual({ low: P('G', 3), high: P('D', 4) });
		expect(snapshot.passaggio).toEqual({ primo: P('G', 3), secondo: P('B', 3) });
		expect(snapshot.label).toBe('Test voice');
		expect(completeness).toEqual({ formants: true, range: true, tessitura: true, passaggio: true });
		expect(isBroadAnalysis(completeness)).toBe(false);
	});

	it('skips formant readings with no usable f1', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(personal({ a: formant(800), 'ɨ': formant(0), 'ɪ': formant(-1) }), undefined);
		expect(own(snapshot).a).toBe(800);
		// A reading with no usable f1 is not sung: the value is worked out from [i] and [u] (or [i] and [e]), not taken from the reading.
		expect(snapshot.fR1Source?.['ɨ']).toBe('derived');
		expect(snapshot.fR1Source?.['ɪ']).toBe('derived');
		expect(completeness.formants).toBe(true);
	});

	// Lane 66, Step 5 (Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1273`): the verdict describes a reading and never
	// excludes it. It replaces §B.4 (2026-07-15), which excluded the number the guard judged implausible: every sung
	// reading counts as a kept one does.
	it('uses a reading the plausibility guard judged implausible, as it uses a kept one', () => {
		const bad = personal({
			a: formant(800),
			// The motivating class: 1063 Hz extracted for a sung [i]. The guard records the verdict beside the reading.
			i: {
				f1: 1063,
				confidence: 'high',
				reading: 'provisional',
				source: 'measured-user',
				plausibility: 'implausible',
			},
		});
		const { snapshot } = buildVoiceProfileSnapshot(bad, undefined);
		expect(own(snapshot).a).toBe(800);
		expect(own(snapshot).i).toBe(1063);
		const kept = { ...bad, i: { ...bad.i, plausibilityOverride: true as const } } as typeof bad;
		expect(buildVoiceProfileSnapshot(bad, undefined)).toEqual(buildVoiceProfileSnapshot(kept, undefined));
	});

	it('keeps a provisional reading with no implausible verdict: a noisy room is not a bad vowel', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(
			personal({
				// Dann's real stored [i]: provisional purely from confidence: 'low'
				// (analyze.ts:34), and plausible on the guard's own window.
				i: { f1: 247.03, confidence: 'low', reading: 'provisional', source: 'measured-user' },
			}),
			undefined,
		);
		expect(own(snapshot).i).toBe(247.03);
		expect(completeness.formants).toBe(true);
	});

	// A reading the guard never judged (no `plausibility` field) counts like any other, inside the union window and outside it (lane 66, Step 5; lane 67 removed the judging).
	it('uses a reading the guard never judged inside the union window and outside it', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			personal({
				u: formantF2(320, 800, 'clear'), // no plausibility field, inside the union [u] window
				i: formantF2(1063, 2250, 'clear'), // no plausibility field: Dann's stored [i] of INBOX "I.N.110 candidate"
				o: { ...formant(500), plausibility: 'unchecked' }, // a verdict already, kept as before
			}),
			undefined,
		);
		expect(own(snapshot).u).toBe(320);
		expect(own(snapshot).o).toBe(500);
		expect(own(snapshot).i).toBe(1063);
		expect(own2(snapshot)?.i).toBe(2250);
	});

	it('derives [ɨ] and [ɪ] from an unjudged [i] the union window fails, as it does from one that passes (lane 66, Step 5)', () => {
		const anchors = { u: formantF2(320, 800, 'clear'), e: formantF2(450, 1900, 'clear') };
		const judged = buildVoiceProfileSnapshot(personal({ ...anchors, i: formantF2(1063, 2250, 'clear') }), undefined).snapshot;
		expect(own(judged)['ɨ']).toBeCloseTo(1.365 * 1063, 0);
		expect(own(judged)['ɪ']).toBeGreaterThan(0);
		// An honest 300 Hz anchors both too: the verdict gates nothing, and the number follows the reading.
		const honest = buildVoiceProfileSnapshot(personal({ ...anchors, i: formantF2(300, 2250, 'clear') }), undefined).snapshot;
		expect(own(honest)['ɨ']).toBeGreaterThan(0);
		expect(own(honest)['ɪ']).toBeGreaterThan(0);
	});

	it('keeps an unjudged reading the singer kept, unchanged, and never mutates the formants handed in', () => {
		const formants = personal({
			i: { ...formantF2(1063, 2250, 'clear'), plausibilityOverride: true as const },
			u: formantF2(320, 800, 'clear'),
		});
		const before = JSON.stringify(formants);
		const { snapshot } = buildVoiceProfileSnapshot(formants, undefined);
		expect(own(snapshot).i).toBe(1063);
		expect(JSON.stringify(formants)).toBe(before);
	});

	// QUEUE row 12: the snapshot says where each vowel's number came from (Dann, 2026-09-16).
	describe('fR1Source and fR2Source', () => {
		const anchors = { i: formantF2(300, 2250, 'clear'), u: formantF2(320, 800, 'clear'), e: formantF2(450, 1900, 'clear') };

		it('has a source for every fR1 and fR2 key, and no source without a number', () => {
			const { snapshot } = buildVoiceProfileSnapshot(personal(anchors), undefined);
			expect(Object.keys(snapshot.fR1Source ?? {}).sort()).toEqual(Object.keys(snapshot.fR1).sort());
			expect(Object.keys(snapshot.fR2Source ?? {}).sort()).toEqual(Object.keys(snapshot.fR2 ?? {}).sort());
		});

		it('reads a derived [ɨ] as derived, and the sung anchors as sung', () => {
			const { snapshot } = buildVoiceProfileSnapshot(personal(anchors), undefined);
			expect(snapshot.fR1Source?.['ɨ']).toBe('derived');
			expect(snapshot.fR2Source?.['ɨ']).toBe('derived');
			expect(snapshot.fR1Source?.i).toBe('sung');
		});

		it('reads a sung [ɨ] as sung, and no derived value displaces it', () => {
			const sungIgh = formantF2(360, 1500, 'clear');
			const { snapshot } = buildVoiceProfileSnapshot(personal({ ...anchors, 'ɨ': sungIgh }), undefined);
			expect(snapshot.fR1['ɨ']).toBe(360);
			expect(snapshot.fR1Source?.['ɨ']).toBe('sung');
			expect(snapshot.fR2Source?.['ɨ']).toBe('sung');
		});

		it('writes a surrogate only where nothing was sung or derived (QUEUE row 17)', () => {
			const { snapshot } = buildVoiceProfileSnapshot(personal(anchors), undefined);
			const surrogate = Object.entries(snapshot.fR1Source ?? {}).filter(([, src]) => src === 'surrogate').map(([v]) => v).sort();
			// Sung: the six core vowels; derived from them: [ɨ], [ɪ], [a], [ʌ]. Nothing is a stand-in.
			expect(surrogate).toEqual([]);
		});
	});

	// fR2 wiring (§A.153): the second resonance is carried per vowel for the
	// higher-voice work, gated like fR1 plus the f2-specific quality.
	it('maps fR2 per vowel when quality is usable, and omits fR2 entirely when none is', () => {
		const withF2 = buildVoiceProfileSnapshot(personal({ i: formantF2(296, 1705, 'clear') }), COMPLETE).snapshot;
		expect(own2(withF2)?.i).toBe(1705);

		const noF2 = buildVoiceProfileSnapshot(Object.fromEntries(Object.entries(CORE6).map(([v, x]) => [v, formant(x.f1)])), COMPLETE).snapshot;
		expect(own2(noF2)).toBeUndefined();
	});

	it('keeps a marginal fR2, drops an absent one, and never guesses a missing f2', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			personal({
				i: formantF2(296, 1705, 'clear'),
				e: formantF2(381, 1532, 'marginal'),
				a: formantF2(800, 1200, 'absent'),
				o: formant(489), // no f2 at all
			}),
			COMPLETE,
		);
		// [a]'s absent f2 and [o]'s missing one contribute nothing, which is the
		// point of this test. [ɪ] is present because [e] and [i] are its anchors
		// and N.109 derives it here; it is a ruled derivation, not a guess at a
		// missing measurement, and its own tests are below.
		expect(own2(snapshot)?.i).toBe(1705);
		expect(own2(snapshot)?.e).toBe(1532);
		expect(own2(snapshot)?.['ɪ']).toBe(1599.5);
		// An absent or missing fR2 is never taken as sung: [a] and [o] have no sung second resonance, so any value is worked out, not read.
		expect(snapshot.fR2Source?.a).not.toBe('sung');
		expect(snapshot.fR2Source?.o).not.toBe('sung');
		expect(own(snapshot)).toMatchObject({ i: 296, e: 381, a: 800, o: 489, 'ɪ': 393 });
	});

	it('uses the fR2 of a reading the plausibility guard judged implausible (lane 66, Step 5)', () => {
		const { snapshot } = buildVoiceProfileSnapshot(
			personal({
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
			}),
			COMPLETE,
		);
		expect(own2(snapshot)?.i).toBe(1705);
		expect(own2(snapshot)?.a).toBe(1200);
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
		const { snapshot, completeness } = buildVoiceProfileSnapshot(personal({ i: I, u: U }), undefined);
		expect(own(snapshot)['ɨ']).toBe(409.5); // 1.365 × 300
		// fR2 rides the same derivation: 2200 − 0.67 × (2200 − 850).
		expect(own2(snapshot)?.['ɨ']).toBe(1295.5);
		// The sung anchors are untouched, and the forecast now has formants.
		expect(own(snapshot).i).toBe(300);
		expect(own(snapshot).u).toBe(350);
		expect(completeness.formants).toBe(true);
	});

	it('i without u: ɨ is not derived, because an anchor is missing', () => {
		const { u: _u, ...withoutU } = CORE6;
		const { snapshot } = buildVoiceProfileSnapshot({ ...withoutU, i: I }, undefined); // five core vowels: personal, and [u] is a stand-in, not an anchor
		expect(own(snapshot)['ɨ']).toBeUndefined();
		expect(own2(snapshot)?.['ɨ']).toBeUndefined();
		expect(own(snapshot).i).toBe(300);
	});

	it('an implausible anchor derives as a kept one does (lane 66, Step 5): the verdict gates nothing', () => {
		const bad = anchor(1063, 2200, 'implausible');
		const { snapshot } = buildVoiceProfileSnapshot(personal({ i: bad, u: U }), undefined);
		expect(own(snapshot)['ɨ']).toBeCloseTo(1.365 * 1063, 0);
		expect(own2(snapshot)?.['ɨ']).toBeGreaterThan(0);
		expect(own(snapshot).i).toBe(1063);
		const kept = { ...bad, plausibilityOverride: true as const };
		expect(buildVoiceProfileSnapshot(personal({ i: bad, u: U }), undefined)).toEqual(buildVoiceProfileSnapshot(personal({ i: kept, u: U }), undefined));
	});

	it('a sung ɨ is kept: a measured reading always wins over a derived one', () => {
		const sung = anchor(430, 1400);
		const { snapshot } = buildVoiceProfileSnapshot(personal({ i: I, u: U, 'ɨ': sung }), undefined);
		expect(own(snapshot)['ɨ']).toBe(430);
		expect(own2(snapshot)?.['ɨ']).toBe(1400);
	});

	it('none of the anchors: the snapshot is unchanged', () => {
		const { snapshot, completeness } = buildVoiceProfileSnapshot(FORMANTS_A, COMPLETE, 'Test voice');
		expect(own(snapshot).a).toBe(800);
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

	it('row 166: a placeholder voice gets the note without the sentence about measured resonances', () => {
		const c = { formants: true, range: false, tessitura: true, passaggio: false };
		expect(composeBroadNote(c, 'en', true)).toBe('Broad analysis: this score is shown without range guidance and positional passaggio flags, because the matching voice characteristics were left blank. The forecast uses placeholder values for your voice type.');
		expect(composeBroadNote(c, 'fr', true)).toBe('Analyse large\u00a0: cette partition est présentée sans les repères d’ambitus ni le signalement des notes de *passaggio*, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision repose sur des valeurs par défaut pour votre type de voix.');
		for (const lang of ['en', 'fr'] as const) expect(composeBroadNote(c, lang, true)).not.toMatch(/measured|mesur/);
		expect(composeBroadNote(full, 'en', true)).toBe('');
	});

	it('tessitura blank alone also reads as range guidance', () => {
		const c = { formants: true, range: true, tessitura: false, passaggio: true };
		expect(composeBroadNote(c, 'en')).toContain('without range guidance,');
	});

	it('positional passaggio flags only: EN and FR', () => {
		const c = { formants: true, range: true, tessitura: true, passaggio: false };
		expect(composeBroadNote(c, 'en')).toBe('Broad analysis: this score is shown without positional passaggio flags' + EN_SUFFIX);
		expect(composeBroadNote(c, 'fr')).toBe('Analyse large : cette partition est présentée sans le signalement des notes de *passaggio*, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision reflète tout de même vos résonances mesurées.');
	});

	it('both dimensions blank: EN joins with and, FR joins with ni', () => {
		const c = { formants: true, range: false, tessitura: true, passaggio: false };
		expect(composeBroadNote(c, 'en')).toBe('Broad analysis: this score is shown without range guidance and positional passaggio flags' + EN_SUFFIX);
		expect(composeBroadNote(c, 'fr')).toBe('Analyse large : cette partition est présentée sans les repères d’ambitus ni le signalement des notes de *passaggio*, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision reflète tout de même vos résonances mesurées.');
	});
});
