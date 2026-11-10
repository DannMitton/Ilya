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

	it('adds nothing to a voice with no sung vowel and no placeholder type: the page still says nothing was measured', () => {
		const { snapshot, standIns, generic } = buildVoiceProfileSnapshot({}, undefined, undefined, undefined, 'contralto');
		expect(snapshot.fR1).toEqual({});
		expect(standIns).toBeUndefined();
		expect(generic).toBe(false);
	});
});

/**
 * QUEUE row 166 (Dann ratified 2026-10-31 13:19 to 13:21): a declared type alone, nothing sung.
 * The five Tier 1 ids take the template whole, every vowel a placeholder; the rest keep the empty profile.
 */
describe('a declared voice type with nothing sung (row 166)', () => {
	const TEN = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'];
	const BUCKET = { soprano: 'soprano', 'mezzo-soprano': 'tenor-mezzo', tenor: 'tenor-mezzo', baritone: 'baritone', bass: 'bass' } as const;
	const f = (f1: number, f2: number): CalibratedFormant =>
		({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;

	for (const id of ['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass'] as const) {
		it(`${id}: the template's six Bozeman values, ten vowels, all 'surrogate', generic true`, () => {
			const a = buildVoiceProfileSnapshot({}, undefined, undefined, undefined, id);
			const t = template(BUCKET[id]);
			expect(a.generic).toBe(true);
			expect(a.completeness.formants).toBe(true);
			expect(Object.keys(a.snapshot.fR1).sort()).toEqual([...TEN].sort());
			for (const v of TEN) expect(a.snapshot.fR1Source?.[v]).toBe('surrogate');
			for (const v of ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'] as const) {
				expect(a.snapshot.fR1[v]).toBeCloseTo(t.f1[v], 0);
				expect(a.snapshot.fR2?.[v]).toBeCloseTo(t.f2[v], 0);
			}
			expect(a.standIns?.bucket).toBe(BUCKET[id]);
			expect(Object.values(a.standIns!.steps).filter((s) => s !== 'derived').every((s) => s === 'template')).toBe(true);
			expect(a.standIns?.retake).toEqual([]);
		});
	}

	for (const id of ['contralto', 'countertenor', 'bass-baritone', 'not-sure', 'other-text', undefined]) {
		it(`${id ?? 'no type'}: today's empty profile, generic false`, () => {
			const a = buildVoiceProfileSnapshot({}, undefined, undefined, undefined, id);
			expect(a.snapshot.fR1).toEqual({});
			expect(a.snapshot.fR1Source).toEqual({});
			expect(a.standIns).toBeUndefined();
			expect(a.generic).toBe(false);
			expect(a.completeness.formants).toBe(false);
		});
	}

	it('one sung vowel yields today\'s fit, generic false', () => {
		const sung = { u: f(330, 800) } as Partial<Record<Vowel, CalibratedFormant>>;
		const a = buildVoiceProfileSnapshot(sung, undefined, undefined, undefined, 'baritone');
		expect(a.generic).toBe(false);
		expect(a.snapshot.fR1Source?.u).toBe('sung');
		expect(a.snapshot.fR1.u).toBe(330);
		expect(a.standIns?.steps.i).toBe('shift');
	});

	it('leaves range, tessitura, and passaggio as typed: none typed means none present', () => {
		const a = buildVoiceProfileSnapshot({}, undefined, undefined, undefined, 'soprano');
		expect(a.snapshot.range).toBeUndefined();
		expect(a.snapshot.tessitura).toBeUndefined();
		expect(a.snapshot.passaggio).toBeUndefined();
		expect(a.completeness).toEqual({ formants: true, range: false, tessitura: false, passaggio: false });
	});

	it('a voice whose every reading the guard fails still takes the placeholders, and reports the retakes', () => {
		const bad = { i: f(1063, 2250) } as Partial<Record<Vowel, CalibratedFormant>>;
		const a = buildVoiceProfileSnapshot(bad, undefined, undefined, undefined, 'bass');
		expect(a.generic).toBe(true);
		expect(a.snapshot.fR1Source?.i).toBe('surrogate');
		expect(a.standIns?.retake).toContainEqual({ vowel: 'i', reason: 'implausible' });
	});
});
