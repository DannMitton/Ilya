/**
 * The adapter golden's grid (N.199 Step 1), shared: the sets of sung readings and the voice types that `adapter-golden.test.ts` runs through
 * the adapter, and that `every-sung-reading-counts.test.ts` (lane 66, Step 5) reads again. Test support only: nothing in the app imports it.
 */
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';

export const f = (f1: number, f2: number | undefined, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), f2Quality: f2 === undefined ? 'absent' : 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;

/** A bass's own readings (Mitton 2020, Table 5.3 values where the brief used them). */
export const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311),
	a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804),
};
export const pick = (vs: Vowel[], over: Partial<Record<Vowel, CalibratedFormant>> = {}) => {
	const out: Partial<Record<Vowel, CalibratedFormant>> = {};
	for (const v of vs) out[v] = BASS[v];
	return { ...out, ...over };
};

export const SETS: Record<string, Partial<Record<Vowel, CalibratedFormant>>> = {
	none: {},
	i: pick(['i']),
	'i,u': pick(['i', 'u']),
	'i,e,ɑ': pick(['i', 'e', 'ɑ']),
	'e,ɛ,ɑ,o': pick(['e', 'ɛ', 'ɑ', 'o']),
	'six': pick(['i', 'e', 'ɛ', 'ɑ', 'o', 'u']),
	'all ten': pick(['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u']),
	'bad i (1063), no override': pick(['u', 'ɑ'], { i: f(1063, 2250) }),
	'bad i kept, six': pick(['e', 'ɛ', 'ɑ', 'o', 'u'], { i: f(1063, 2250, { plausibilityOverride: true, plausibility: 'implausible' }) }),
	'no fR2 on [e]': pick(['i', 'ɑ', 'o'], { e: f(381, undefined) }),
	'provisional [u], [ɨ] sung': pick(['i', 'ɨ'], { u: f(346, 804, { reading: 'provisional', confidence: 'low' }) }),
	'verdict stored': pick(['i', 'e', 'u'], { ɑ: f(617, 1013, { plausibility: 'plausible' }), ɛ: f(577, 1311, { plausibility: 'unchecked' }) }),
};
export const TYPES: Array<string | undefined> = [undefined, '', 'soprano', 'mezzo-soprano', 'mezzo', 'contralto', 'tenor', 'countertenor', 'baritone', 'bass', 'bass-baritone', 'not-sure'];

