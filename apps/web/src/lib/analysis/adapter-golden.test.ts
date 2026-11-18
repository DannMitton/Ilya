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
import { SETS, TYPES } from './adapter-grid';

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
