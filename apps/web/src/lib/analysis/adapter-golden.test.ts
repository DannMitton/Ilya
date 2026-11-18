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
import { BASS, SETS, TYPES, pick } from './adapter-grid';

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
 * Lane 67, Step 2: a golden voice with four core vowels sung gives byte for byte the snapshot of the same voice with none sung, under every type; with five it does not.
 * The moved entries of the golden file are exactly the sets under five core vowels ('i', 'i,u', 'i,e,ɑ', 'e,ɛ,ɑ,o', 'bad i (1063), no override', 'no fR2 on [e]',
 * 'provisional [u], [ɨ] sung'), each now equal to its 'none' twin of the same type.
 */
describe('the threshold in the adapter (lane 67)', () => {
	const snap = (sung: Parameters<typeof buildVoiceProfileSnapshot>[0], type: string | undefined) => JSON.parse(JSON.stringify(buildVoiceProfileSnapshot(JSON.parse(JSON.stringify(sung)), undefined, 'golden', undefined, type)));
	it('four core vowels sung equal none sung, for every type', () => {
		for (const type of TYPES) {
			for (const sung of [pick(['i', 'e', 'ɛ', 'ɑ']), pick(['e', 'ɛ', 'ɑ', 'o']), pick(['i', 'u', 'ɑ', 'o'], { ɨ: BASS['ɨ'], a: BASS.a })]) {
				expect(snap(sung, type), String(type)).toEqual(snap({}, type));
			}
		}
	});
	it('five core vowels sung do not equal none sung, under a type with generic values', () => {
		for (const type of ['soprano', 'tenor', 'baritone', 'bass']) expect(snap(pick(['i', 'e', 'ɛ', 'ɑ', 'o']), type)).not.toEqual(snap({}, type));
	});
	it('the sets under five core vowels are their none twins in the golden file, and the others are not changed by it', () => {
		const golden = JSON.parse(readFileSync(GOLDEN, 'utf8')) as Record<string, unknown>;
		const below = ['i', 'i,u', 'i,e,ɑ', 'e,ɛ,ɑ,o', 'bad i (1063), no override', 'no fR2 on [e]', 'provisional [u], [ɨ] sung'];
		for (const type of TYPES) for (const name of below) expect(golden[`${type ?? '(undefined)'} | ${name}`], `${type} | ${name}`).toEqual(golden[`${type ?? '(undefined)'} | none`]);
	});
});
