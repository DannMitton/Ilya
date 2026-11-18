/**
 * Lane 67, Step 4 (`docs/sessions/brief-code-lane67-voice-threshold_r2_2026-11-18.md`): the measure that comes before Step 3. Not a gate; see `vitest.config.ts`.
 * By file name only:
 *
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts lane67-measure.run.ts
 *     reads `__golden__/path-600.json`; prints the tables; `N200_LANE67_OUT=<file>` also writes them.
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorByTypeAndVowel, errorTable, leaveOneOut, oddIMoves, oddTable, profilesFromGolden, type GoldenRow } from './lane67-core';

const here = path.dirname(fileURLToPath(import.meta.url));

export function report(): string {
	const rows = (JSON.parse(readFileSync(path.join(here, '__golden__', 'path-600.json'), 'utf8')) as { rows: GoldenRow[] }).rows;
	const profiles = profilesFromGolden(rows);
	const full = profiles.filter((p) => ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'].every((v) => (p.formants as Record<string, unknown>)[v])).length;
	const cases = leaveOneOut(profiles);
	const moves = oddIMoves(profiles);
	const out: string[] = [];
	out.push('# Lane 67, Step 4: the sixth core vowel, three ways\n');
	out.push('The truths are Ilya\'s own templates by type (`fidelity-set.ts:12-14`). The declared-type arm is exact by construction. This run measures how far Bozeman\'s staves differ in shape from their middle, and how far one odd [i] moves a missing vowel. It does not test `middle` against a real voice.\n');
	out.push(`${rows.length} takes in \`path-600.json\`, in ${profiles.length} profiles (5 types by 12 take indexes). ${full} profiles hold all six core readings (a re-prompt gives none); each gives six cuts, so ${cases.length / 3} cuts, each estimated three ways. Errors are the estimate against the set's truth, in semitones; every cell is "median / 90th percentile" of the absolute error (nearest rank). The five sung vowels are the path picker's readings of the synthetic takes, noise included.`);
	out.push('\n## All cuts\n', '### fR1\n', errorTable(cases, 'all', 'e1'), '\n### fR2\n', errorTable(cases, 'all', 'e2'));
	out.push('\n## By type\n', '### fR1\n', errorTable(cases, 'type', 'e1'), '\n### fR2\n', errorTable(cases, 'type', 'e2'));
	out.push('\n## By vowel\n', '### fR1\n', errorTable(cases, 'vowel', 'e1'), '\n### fR2\n', errorTable(cases, 'vowel', 'e2'));
	out.push('\n## By type and vowel\n', '### fR1\n', errorByTypeAndVowel(cases, 'e1'), '\n### fR2\n', errorByTypeAndVowel(cases, 'e2'));
	out.push('\n## One odd [i] (1063 Hz, 2250 Hz; `analysis/adapter-grid.ts:29`) among five core vowels\n', 'Each of the other five core vowels is left out in turn; the [i] is the odd one, and the other four are the profile\'s own. The move is the estimate of the missing vowel with the odd [i] against the same estimate with the profile\'s own [i]: absolute, in semitones, median / 90th percentile / maximum.\n', oddTable(moves));
	return out.join('\n') + '\n';
}

test('lane 67 step 4: the measure', () => {
	const text = report();
	console.log(text);
	if (process.env.N200_LANE67_OUT) writeFileSync(process.env.N200_LANE67_OUT, text);
}, 30 * 60 * 1000);
