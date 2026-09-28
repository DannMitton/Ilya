/**
 * Tests for the advice resolver (framework §4; §A.158/§A.161/§A.169).
 *
 * Fixtures are built the way `watchlist.test.ts` builds them: a real
 * `analyzeScore` pass over a tiny score, so the `crossing`/`vowel` the resolver
 * reads are the engine's own, not hand-forged. A4 = 440 Hz, so fR1 = 440 for a
 * vowel puts the fundamental on the first resonance (a crossing).
 */

import { describe, expect, it } from 'vitest';
import {
	analyzeScore,
	type Pitch,
	type ParsedScore,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
	type VowelResolver,
	type AnalyzedScore
} from '@ilya/score-parser';
import { resolveAdvice } from './advice-resolver';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function note(id: string, pitch: Pitch): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch
	};
}

function scoreOf(events: VocalLineEvent[]): ParsedScore {
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: [],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events
	};
}

const resolverOf =
	(vowels: Record<string, string>): VowelResolver =>
	(ev) =>
		vowels[ev.id];

const WIDE_RANGE = { lowest: P('C', 2), highest: P('C', 7) };
const WIDE_TESS = { low: P('C', 3), high: P('C', 6) };

function analyze(
	events: VocalLineEvent[],
	fR1: Record<string, number>,
	vowels: Record<string, string>
): AnalyzedScore {
	const snap: VoiceProfileSnapshot = { fR1, range: WIDE_RANGE, tessitura: WIDE_TESS };
	return analyzeScore(scoreOf(events), snap, resolverOf(vowels), {
		generatedAt: '2020-01-01T00:00:00.000Z'
	});
}

describe('resolveAdvice — the [i]→[ɪ] crossing (v1, §A.161)', () => {
	it('populates the approved advice on an [i] crossing, tagged hazard', () => {
		const out = resolveAdvice(analyze([note('n1', P('A', 4))], { i: 440 }, { n1: 'i' }));
		const mod = out.events.n1.vowelModification;
		expect(mod).toBeDefined();
		expect(mod?.register).toBe('hazard');
		expect(mod?.action).toBe('iCrossing');
		expect(mod?.target).toBe('ɪ');
		expect(mod?.citation).toContain('Mitton 2020');
		expect(mod?.citation).toContain('§6.1.5');
	});

	it('says nothing on a crossing whose vowel has no v1 advice (non-regressive dial, ruling B)', () => {
		// [e] on its own first resonance: a real crossing, but no v1 advice.
		const out = resolveAdvice(analyze([note('n1', P('A', 4))], { e: 440 }, { n1: 'e' }));
		expect(out.events.n1.crossing).toBe(true); // the engine still marks it
		expect(out.events.n1.vowelModification).toBeUndefined(); // the resolver stays silent
	});

	it('says nothing on an [i] that does not cross', () => {
		// [i] two octaves below its first resonance: no crossing.
		const out = resolveAdvice(analyze([note('n1', P('A', 2))], { i: 440 }, { n1: 'i' }));
		expect(out.events.n1.crossing).toBe(false);
		expect(out.events.n1.vowelModification).toBeUndefined();
	});
});

describe('resolveAdvice — the [o]→[ɑ] cover (§A.185)', () => {
	it('populates the cover advice on a sustained close [o] at the ceiling, tagged hazard', () => {
		// [o] fR1 489 → turning ≈ B3, so E4 reads close; E4 is the ceiling; the
		// fermata makes it a long sustain. All three exposure gates hold (§A.183).
		const events: VocalLineEvent[] = [{ ...note('n1', P('E', 4)), fermata: {} }];
		const snap: VoiceProfileSnapshot = {
			fR1: { o: 489 },
			range: { lowest: P('C', 2), highest: P('E', 4) },
			tessitura: { low: P('C', 3), high: P('C', 4) }
		};
		const analyzed = analyzeScore(scoreOf(events), snap, resolverOf({ n1: 'o' }), {
			generatedAt: '2020-01-01T00:00:00.000Z'
		});
		expect(analyzed.events.n1.sustainedCeilingExposure).toBe(true);
		expect(analyzed.events.n1.crossing).toBe(false); // a cover, not a crossing
		const mod = resolveAdvice(analyzed).events.n1.vowelModification;
		expect(mod?.register).toBe('hazard');
		expect(mod?.action).toBe('oCover');
		expect(mod?.target).toBe('ɑ');
		expect(mod?.citation).toContain('Mitton 2020');
		expect(mod?.citation).toContain('§6.2.5');
	});

	it('stays silent on a close [o] that is not exposed (mid-range)', () => {
		const out = resolveAdvice(analyze([note('n1', P('A', 4))], { o: 489 }, { n1: 'o' }));
		expect(out.events.n1.sustainedCeilingExposure).toBe(false); // A4 well below the C7 ceiling
		expect(out.events.n1.vowelModification).toBeUndefined();
	});
});

describe('resolveAdvice: the exposed close-vowel active-open (tracking) case, whoop side (H2, guarded §A.190)', () => {
	// A soprano-realistic exposed close vowel carried well ABOVE its own fR1, so
	// fo is above fR1 (the whoop side the source describes: "well above their
	// first formant location"). fR1 440 → turning 220 ≈ A3, so A5 reads close;
	// A5 is the ceiling; the fermata sustains; A5 (880 Hz) is an octave above fR1
	// 440, so aboveFirstResonance holds and it is not a crossing (§A.183/§A.190).
	function exposedWhoop(vowel: string): AnalyzedScore {
		const events: VocalLineEvent[] = [{ ...note('n1', P('A', 5)), fermata: {} }];
		const snap: VoiceProfileSnapshot = {
			fR1: { [vowel]: 440 },
			range: { lowest: P('C', 3), highest: P('A', 5) },
			tessitura: { low: P('C', 4), high: P('C', 5) }
		};
		return analyzeScore(scoreOf(events), snap, resolverOf({ n1: vowel }), {
			generatedAt: '2020-01-01T00:00:00.000Z'
		});
	}

	it('populates the tracking advice on an exposed close vowel above its fR1, hazard-tagged, no target', () => {
		const analyzed = exposedWhoop('e');
		expect(analyzed.events.n1.sustainedCeilingExposure).toBe(true);
		expect(analyzed.events.n1.crossing).toBe(false);
		expect(analyzed.events.n1.aboveFirstResonance).toBe(true);
		const mod = resolveAdvice(analyzed).events.n1.vowelModification;
		expect(mod?.register).toBe('hazard');
		expect(mod?.action).toBe('openTracking');
		expect(mod?.target).toBeUndefined(); // articulatory: no target substitution
		expect(mod?.citation).toContain('Godin & Howell 2015');
		expect(mod?.citation).toContain('track H1');
	});

	it('fires on whichever close vowel triggered it (vowel-agnostic)', () => {
		const mod = resolveAdvice(exposedWhoop('u')).events.n1.vowelModification;
		expect(mod?.action).toBe('openTracking');
	});

	it('stays silent on a close vowel that is not exposed (mid-range)', () => {
		const out = resolveAdvice(analyze([note('n1', P('A', 4))], { e: 489 }, { n1: 'e' }));
		expect(out.events.n1.sustainedCeilingExposure).toBe(false);
		expect(out.events.n1.vowelModification).toBeUndefined();
	});
});

describe('resolveAdvice: the male turnover case, turned side (§A.190)', () => {
	// An exposed close vowel carried past its turn but with fo still BELOW fR1
	// (the turned side). fR1 489 → turning ≈ B3, so E4 reads close; E4 is the
	// ceiling; the fermata sustains; E4 (330 Hz) is below fR1 489, so it is not
	// a crossing and aboveFirstResonance is false. This is the very fixture the
	// tracking case used to fire on before the §A.190 guard: a low male voice's
	// exposed close vowel at the top, indistinguishable from the old H2 fixture.
	function exposedTurned(vowel: string): AnalyzedScore {
		const events: VocalLineEvent[] = [{ ...note('n1', P('E', 4)), fermata: {} }];
		const snap: VoiceProfileSnapshot = {
			fR1: { [vowel]: 489 },
			range: { lowest: P('C', 2), highest: P('E', 4) },
			tessitura: { low: P('C', 3), high: P('C', 4) }
		};
		return analyzeScore(scoreOf(events), snap, resolverOf({ n1: vowel }), {
			generatedAt: '2020-01-01T00:00:00.000Z'
		});
	}

	it('populates the male turnover advice on an exposed close vowel below its fR1, hazard-tagged, no target', () => {
		const analyzed = exposedTurned('e');
		expect(analyzed.events.n1.sustainedCeilingExposure).toBe(true);
		expect(analyzed.events.n1.crossing).toBe(false);
		expect(analyzed.events.n1.aboveFirstResonance).toBe(false);
		const mod = resolveAdvice(analyzed).events.n1.vowelModification;
		expect(mod?.register).toBe('hazard');
		expect(mod?.action).toBe('maleTurnover');
		expect(mod?.target).toBeUndefined(); // articulatory: no target substitution
		expect(mod?.citation).toContain('Bozeman 2008');
		expect(mod?.citation).toContain('Bozeman 2010');
	});

	it('fires on whichever close vowel triggered it (vowel-agnostic)', () => {
		const mod = resolveAdvice(exposedTurned('u')).events.n1.vowelModification;
		expect(mod?.action).toBe('maleTurnover');
	});

	it('does not fire the whoop tracking case on the turned side (the §A.190 guard)', () => {
		const mod = resolveAdvice(exposedTurned('e')).events.n1.vowelModification;
		expect(mod?.action).not.toBe('openTracking'); // tracking is guarded off here
	});

	it('leaves an exposed [o] to the cover, not the turnover case (match order)', () => {
		const mod = resolveAdvice(exposedTurned('o')).events.n1.vowelModification;
		expect(mod?.action).toBe('oCover'); // the Russian cover wins, not the turnover case
		expect(mod?.target).toBe('ɑ');
	});
});

describe('resolveAdvice: the [ɔ] crossing (H1, soprano whoop-coupling)', () => {
	it('populates the articulatory advice on an [ɔ] crossing, hazard-tagged, no target', () => {
		const out = resolveAdvice(analyze([note('n1', P('A', 4))], { 'ɔ': 440 }, { n1: 'ɔ' }));
		expect(out.events.n1.crossing).toBe(true);
		const mod = out.events.n1.vowelModification;
		expect(mod?.register).toBe('hazard');
		expect(mod?.action).toBe('openOCrossing');
		expect(mod?.target).toBeUndefined(); // articulatory: no target substitution
		expect(mod?.citation).toContain('Godin & Howell 2015');
	});

	it('stays silent on an [ɔ] that does not cross', () => {
		const out = resolveAdvice(analyze([note('n1', P('A', 2))], { 'ɔ': 440 }, { n1: 'ɔ' }));
		expect(out.events.n1.crossing).toBe(false);
		expect(out.events.n1.vowelModification).toBeUndefined();
	});

	it('leaves the [i] crossing to Mitton, not the [ɔ] case (match order)', () => {
		const out = resolveAdvice(analyze([note('n1', P('A', 4))], { i: 440 }, { n1: 'i' }));
		expect(out.events.n1.vowelModification?.action).toBe('iCrossing');
	});
});

describe('resolveAdvice — purity and idempotence', () => {
	it('does not mutate the input analysis', () => {
		const analyzed = analyze([note('n1', P('A', 4))], { i: 440 }, { n1: 'i' });
		const out = resolveAdvice(analyzed);
		expect(analyzed.events.n1.vowelModification).toBeUndefined(); // input untouched
		expect(out).not.toBe(analyzed); // a new score
		expect(out.events).not.toBe(analyzed.events); // a new events map
	});

	it('never clobbers advice already present on an event', () => {
		const analyzed = analyze([note('n1', P('A', 4))], { i: 440 }, { n1: 'i' });
		const prior = { action: 'kept', citation: 'kept', register: 'opportunity' as const };
		const withPrior: AnalyzedScore = {
			...analyzed,
			events: { ...analyzed.events, n1: { ...analyzed.events.n1, vowelModification: prior } }
		};
		const out = resolveAdvice(withPrior);
		expect(out.events.n1.vowelModification).toEqual(prior);
	});
});
