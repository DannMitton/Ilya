/**
 * N.199 Step 1: the adapter's output, byte for byte, across a grid of voices.
 *
 * The golden file `__golden__/adapter-snapshots.json` was written from the adapter AS IT STOOD BEFORE its value
 * resolution moved into `voice/engine/resolve-values.ts`. The move is correct only while this test passes unchanged:
 * the grid is every declared voice type (and none) against twelve sets of sung readings, including a 1063 Hz [i] the
 * guard fails, a kept one, a reading with no fR2, a Provisional one, and a verdict already stored. Regenerate it only
 * for a ruled change of the forecast, with `UPDATE_ADAPTER_GOLDEN=1`, and say so in the commit.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { buildVoiceProfileSnapshot } from './analyze-score-adapter';

const GOLDEN = fileURLToPath(new URL('./__golden__/adapter-snapshots.json', import.meta.url));

const f = (f1: number, f2: number | undefined, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), f2Quality: f2 === undefined ? 'absent' : 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;

/** A bass's own readings (Mitton 2020, Table 5.3 values where the brief used them). */
const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311),
	a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804),
};
const pick = (vs: Vowel[], over: Partial<Record<Vowel, CalibratedFormant>> = {}) => {
	const out: Partial<Record<Vowel, CalibratedFormant>> = {};
	for (const v of vs) out[v] = BASS[v];
	return { ...out, ...over };
};

const SETS: Record<string, Partial<Record<Vowel, CalibratedFormant>>> = {
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
const TYPES: Array<string | undefined> = [undefined, '', 'soprano', 'mezzo-soprano', 'mezzo', 'contralto', 'tenor', 'countertenor', 'baritone', 'bass', 'bass-baritone', 'not-sure'];

function grid() {
	const out: Record<string, unknown> = {};
	for (const type of TYPES) {
		for (const [name, sung] of Object.entries(SETS)) {
			const a = buildVoiceProfileSnapshot(JSON.parse(JSON.stringify(sung)), undefined, 'golden', undefined, type);
			out[`${type ?? '(undefined)'} | ${name}`] = a;
		}
	}
	return out;
}

describe('the adapter output on the grid is unchanged', () => {
	it('matches the golden file byte for byte', () => {
		const actual = JSON.stringify(grid(), null, 1) + '\n';
		if (process.env.UPDATE_ADAPTER_GOLDEN === '1') writeFileSync(GOLDEN, actual);
		expect(actual).toBe(readFileSync(GOLDEN, 'utf8'));
	});
	it('the grid is the size it says', () => {
		expect(Object.keys(grid()).length).toBe(TYPES.length * Object.keys(SETS).length);
	});
});
