/**
 * The first moments of calibration (Dann, 2026-09-30 12:43; brief
 * `docs/sessions/brief-code-calibration-first-moments_r1_2026-09-30.md`):
 * no question during capture, one note at the summary, and the voice type
 * chosen first routes the guard from the first take.
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import type { CalibratedFormant, Vowel } from './engine/types';
import { checkPlausibility, keepReading } from './engine/plausibility';
import { outsideNote, outsideVowels } from './outside';

const ORDER: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'];
const reading = (f1: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant => ({
	f1,
	f2: 2000,
	confidence: 'high',
	reading: 'captured',
	source: 'measured-user',
	...extra
});
const implausible = (f1: number, extra: Partial<CalibratedFormant> = {}) =>
	reading(f1, { reading: 'provisional', plausibility: 'implausible', ...extra });

const unstable = (f1: number, extra: Partial<CalibratedFormant> = {}) => reading(f1, { confidence: 'low', reading: 'provisional', ...extra });

describe('the summary note (lane 67): the take\'s own steadiness', () => {
	it('lists exactly the unstable readings not yet kept, in roster order', () => {
		const profile = {
			u: unstable(350),
			i: unstable(300),
			e: reading(500),
			o: keepReading(unstable(450)),
			a: unstable(700, { reading: 'estimated' })
		};
		expect(outsideVowels(profile, ORDER)).toEqual(['i', 'u']);
		expect(outsideVowels({}, ORDER)).toEqual([]);
	});

	it('is about confidence, not the status field and not the reference values', () => {
		// A reading with good evidence that an older build left Provisional is not unstable.
		expect(outsideVowels({ i: reading(300, { reading: 'provisional' }) }, ORDER)).toEqual([]);
		// A reading far outside any reference band, steady, is not named: the note is no comparison with reference values.
		expect(outsideVowels({ i: reading(1063, { plausibility: 'implausible' }) }, ORDER)).toEqual([]);
		// A take that placed no first resonance is not sung, so it is not named.
		expect(outsideVowels({ i: unstable(0) }, ORDER)).toEqual([]);
	});

	it('Keep clears the note, and a fresh steady take clears it too', () => {
		const profile: Partial<Record<Vowel, CalibratedFormant>> = { i: unstable(300), u: unstable(350) };
		const kept = { i: keepReading(profile.i!), u: keepReading(profile.u!) };
		expect(outsideVowels(kept, ORDER)).toEqual([]);
		const retaken = { ...profile, i: reading(320) };
		expect(outsideVowels(retaken, ORDER)).toEqual(['u']);
	});

	it('has one sentence, whatever the voice type', () => {
		expect(outsideNote()).toEqual({ key: 'calib.summary.unstable' });
	});

	it('one reading takes its own sentence, two or more the plural one (lane 68)', () => {
		expect(outsideNote('unstable', 1)).toEqual({ key: 'calib.summary.unstableOne' });
		expect(outsideNote('unstable', 2)).toEqual({ key: 'calib.summary.unstable' });
		expect(outsideNote('unstable', 3)).toEqual({ key: 'calib.summary.unstable' });
		expect(outsideNote('igh', 1)).toEqual({ key: 'calib.summary.outsideIgh' });
	});

	it('has the ratified string in both languages, with its placeholder and the OQLF space', () => {
		expect(t('calib.summary.unstable', 'en')).toBe('These readings were unstable: {vowels}. Another try may help.');
		expect(t('calib.summary.unstable', 'fr')).toBe('Ces lectures étaient instables\u00a0: {vowels}. Une reprise pourrait aider.');
		for (const lang of ['en', 'fr'] as const) {
			for (const k of ['calib.voiceTypeFirst.heading', 'calib.voiceTypeFirst.hint', 'calib.summary.keepAll'])
				expect(t(k, lang)).not.toMatch(/MISSING/);
		}
	});
});

describe('the voice type chosen first routes the guard', () => {
	it('a bass [i] at 247 Hz is in band for a bass and out for a soprano', () => {
		expect(checkPlausibility(247, 'i', 'bass').plausibility).toBe('plausible');
		expect(checkPlausibility(247, 'i', 'soprano').plausibility).toBe('implausible');
		expect(checkPlausibility(247, 'i', 'not-sure').voiceTypeBucket).toBe('union');
	});
});
