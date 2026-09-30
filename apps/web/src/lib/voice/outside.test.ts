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
import { holdKindFor, holdAnnouncement } from './hold';
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

describe('no question during capture', () => {
	it('a take judged implausible holds as a good take does, and a low one as provisional', () => {
		expect(holdKindFor(implausible(1063))).toBe('good');
		expect(holdKindFor(implausible(1063, { confidence: 'low' }))).toBe('provisional');
		expect(holdKindFor(reading(300, { plausibility: 'plausible' }))).toBe('good');
	});

	it('announces an implausible take as captured, with no question in it', () => {
		const T = (k: string) => t(k, 'en');
		const said = holdAnnouncement(holdKindFor(implausible(1063)), 'cardinal-i', T);
		expect(said).toBe('cardinal-i, captured.');
		expect(said).not.toMatch(/\?/);
	});
});

describe('the summary note', () => {
	it('lists exactly the out-of-band readings not yet kept, in roster order', () => {
		const profile = {
			u: implausible(200),
			i: implausible(1063),
			e: reading(500, { plausibility: 'plausible' }),
			o: keepReading(implausible(300)),
			a: reading(700, { plausibility: 'unchecked' })
		};
		expect(outsideVowels(profile, ORDER)).toEqual(['i', 'u']);
		expect(outsideVowels({}, ORDER)).toEqual([]);
	});

	it('Keep clears the note, and a Re-take that lands in band clears it too', () => {
		const profile: Partial<Record<Vowel, CalibratedFormant>> = { i: implausible(1063), u: implausible(200) };
		const kept = { i: keepReading(profile.i!), u: keepReading(profile.u!) };
		expect(outsideVowels(kept, ORDER)).toEqual([]);
		const retaken = { ...profile, i: reading(320, { plausibility: 'plausible' }) };
		expect(outsideVowels(retaken, ORDER)).toEqual(['u']);
	});

	it('names a Tier 1 type and falls back for "Not sure" and no answer', () => {
		expect(outsideNote('bass')).toEqual({ key: 'calib.summary.outside', typeId: 'bass' });
		expect(outsideNote('not-sure')).toEqual({ key: 'calib.summary.outsideNoType' });
		expect(outsideNote(undefined)).toEqual({ key: 'calib.summary.outsideNoType' });
		expect(outsideNote('something typed')).toEqual({ key: 'calib.summary.outsideNoType' });
	});

	it('has every ratified string in both languages, with its placeholders', () => {
		for (const lang of ['en', 'fr'] as const) {
			expect(t('calib.summary.outside', lang)).toContain('{type}');
			for (const k of ['calib.summary.outside', 'calib.summary.outsideNoType'])
				expect(t(k, lang)).toContain('{vowels}');
			expect(t('calib.summary.outsideNoType', lang)).not.toContain('{type}');
			for (const k of ['calib.voiceTypeFirst.heading', 'calib.voiceTypeFirst.hint', 'calib.summary.keepAll', 'calib.roster.kept'])
				expect(t(k, lang)).not.toMatch(/MISSING/);
		}
		expect(t('calib.roster.kept', 'en')).toBe('Beyond Ilya’s reference values');
		expect(t('calib.summary.outside', 'fr')).toContain('{type} : {vowels}');
	});
});

describe('the voice type chosen first routes the guard', () => {
	it('a bass [i] at 247 Hz is in band for a bass and out for a soprano', () => {
		expect(checkPlausibility(247, 'i', 'bass').plausibility).toBe('plausible');
		expect(checkPlausibility(247, 'i', 'soprano').plausibility).toBe('implausible');
		expect(checkPlausibility(247, 'i', 'not-sure').voiceTypeBucket).toBe('union');
	});
});
