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
import { buildVoiceProfileSnapshot } from './analyze-score-adapter';
import { SETS, TYPES, pick } from './adapter-grid';
import { VOWELS } from '$lib/voice/engine/types';
import { resolveVowelValues } from '$lib/voice/engine/resolve-values';

const GOLDEN = fileURLToPath(new URL('./__golden__/adapter-snapshots.json', import.meta.url));

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

/**
 * Lane 68, Step 1 (it replaces lane 67's rule that a set under five core vowels equals its 'none' twin): every sampled vowel is used as sampled, from the first. A golden
 * voice under five stable core vowels carries each sampled vowel's own values, flagged sung, and every vowel not sampled takes the placeholder of the declared type's
 * staff (`standInBucket`), unscaled, flagged surrogate: the same number the chart's placeholder dot shows (`resolveVowelValues({}, type, { placeholders: 'always' })`). The
 * moved entries of the golden file are exactly the sets under five stable core vowels ('i', 'i,u', 'i,e,ɑ', 'e,ɛ,ɑ,o', 'bad i (1063), no override', 'no fR2 on [e]',
 * 'provisional [u], [ɨ] sung'), under every type; with five or more they do not move.
 */
describe('every sample counts from the first (lane 68)', () => {
	const snap = (sung: Parameters<typeof buildVoiceProfileSnapshot>[0], type: string | undefined) => JSON.parse(JSON.stringify(buildVoiceProfileSnapshot(JSON.parse(JSON.stringify(sung)), undefined, 'golden', undefined, type)));
	const BELOW = ['i', 'i,u', 'i,e,ɑ', 'e,ɛ,ɑ,o', 'bad i (1063), no override', 'no fR2 on [e]', 'provisional [u], [ɨ] sung'];
	const checkBelow = (get: (type: string | undefined, name: string) => { fR1: Record<string, number>; fR2?: Record<string, number>; fR1Source?: Record<string, string>; fR2Source?: Record<string, string> }) => {
		for (const type of TYPES) {
			const placeholder = resolveVowelValues({}, type, { placeholders: 'always' });
			for (const name of BELOW) {
				const snapshot = get(type, name);
				for (const v of VOWELS) {
					const own = SETS[name][v];
					const label = `${type} | ${name} | ${v}`;
					if (own) {
						expect([snapshot.fR1[v], snapshot.fR1Source?.[v]], label).toEqual([own.f1, 'sung']);
						if (own.f2 !== undefined) expect([snapshot.fR2?.[v], snapshot.fR2Source?.[v]], label).toEqual([own.f2, 'sung']);
					} else {
						expect([snapshot.fR1[v], snapshot.fR1Source?.[v]], label).toEqual([placeholder.fR1[v], 'surrogate']);
					}
				}
			}
		}
	};
	it('a set under five stable core vowels carries its sampled values and the type\'s placeholders, for every type', () => {
		checkBelow((type, name) => snap(SETS[name], type).snapshot);
	});
	it('five core vowels sampled do not equal none sampled, under a type with placeholder values', () => {
		for (const type of ['soprano', 'tenor', 'baritone', 'bass']) expect(snap(pick(['i', 'e', 'ɛ', 'ɑ', 'o']), type)).not.toEqual(snap({}, type));
	});
	it('the golden file holds the sets under five as this rule says, and the sets at five or six as the singer\'s own profile', () => {
		const golden = JSON.parse(readFileSync(GOLDEN, 'utf8')) as Record<string, { snapshot: { fR1: Record<string, number>; fR2?: Record<string, number>; fR1Source?: Record<string, string>; fR2Source?: Record<string, string> } }>;
		checkBelow((type, name) => golden[`${type ?? '(undefined)'} | ${name}`].snapshot);
		for (const type of TYPES) for (const name of ['six', 'all ten', 'bad i kept, six', 'verdict stored']) expect(golden[`${type ?? '(undefined)'} | ${name}`].snapshot.fR1Source?.i, `${type} | ${name}`).toBe('sung');
	});
});
