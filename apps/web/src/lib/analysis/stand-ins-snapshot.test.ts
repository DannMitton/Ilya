/**
 * QUEUE row 17, at the snapshot: what the stand-ins do with a reading off the
 * shape, and with a voice that has sung nothing. Kept in analysis/ because the
 * module map lets voice/ import nothing from here.
 */
import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { MITTON_FR2, template } from '$lib/voice/engine/stand-ins';
import { buildVoiceProfileSnapshot } from './analyze-score-adapter';

describe('a sung value off the shape', () => {
	const f = (f1: number, f2: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
		({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;

	it('excludes and reports a 1063 Hz [i], which the guard fails, and fills [i] with a stand-in', () => {
		const { snapshot, standIns } = buildVoiceProfileSnapshot({ i: f(1063, 2250), u: f(330, 800), ɑ: f(640, 1050) } as Partial<Record<Vowel, CalibratedFormant>>, undefined, undefined, undefined, 'bass');
		expect(snapshot.fR1Source?.i).toBe('surrogate');
		expect(snapshot.fR1.i).not.toBe(1063);
		expect(standIns?.retake).toContainEqual({ vowel: 'i', reason: 'implausible' });
	});

	it('leaves a kept 1063 Hz [i] in place, takes it out of the fit, and reports it as off the shape', () => {
		const t = template('bass').f1;
		const onShape = (v: 'e' | 'ɛ' | 'ɑ' | 'o' | 'u') => f(t[v] * 1.05, MITTON_FR2[v] * 1.05);
		const formants = { i: f(1063, 2250, { plausibilityOverride: true, plausibility: 'implausible' }), e: onShape('e'), ɛ: onShape('ɛ'), ɑ: onShape('ɑ'), o: onShape('o'), u: onShape('u') };
		const { snapshot, standIns } = buildVoiceProfileSnapshot(formants as Partial<Record<Vowel, CalibratedFormant>>, undefined, undefined, undefined, 'bass');
		expect(snapshot.fR1.i).toBe(1063);
		expect(snapshot.fR1Source?.i).toBe('sung');
		const off = standIns?.retake.find((r) => r.vowel === 'i');
		expect(off?.reason).toBe('off-shape');
		expect(off!.semitones!).toBeGreaterThan(3);
	});

	it('adds nothing to a voice with no sung vowel: the page still says nothing was measured', () => {
		const { snapshot, standIns } = buildVoiceProfileSnapshot({}, undefined, undefined, undefined, 'bass');
		expect(snapshot.fR1).toEqual({});
		expect(standIns).toBeUndefined();
	});
});
