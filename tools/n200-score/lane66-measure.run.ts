/**
 * Lane 66, Step 4 (`docs/sessions/brief-code-lane66-follow-ups_r3_2026-11-17.md`): the measure that comes before Step 5. Not a gate; see `vitest.config.ts`.
 * By file name only for the golden run; a folder run is also started by its own variable.
 *
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts lane66-measure.run.ts
 *     reads `__golden__/path-600.json` (the path picker on the 600 primary synthetic takes); prints the tables; `N200_LANE66_OUT=<file>` also writes them.
 *
 *   N200_LANE66_DIR=/path/to/folder N200_LANE66_TYPE=bass pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts lane66-measure.run.ts
 *     reads a folder of the recorder's files (unzipped), judged as the declared type `N200_LANE66_TYPE` (a sidecar holds no voice type; "none" or empty
 *     judges with no type). The tables go to `<folder>-lane66-out/` beside the folder, never into the repository, and print as well. The golden run is
 *     skipped when `N200_LANE66_DIR` is set. (`N200_DIR` is not used: it starts `score.run.ts` and its Burg run.)
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPES } from './fidelity-set';
import { bigMoves, countsTable, judgeGroups, moveCases, outsideCases, profilesFromGolden, questionA, questionB, setAsideLine, type GoldenRow } from './lane66-core';
import { writeFolderReport } from './lane66-folder';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const DIR = process.env.N200_LANE66_DIR;
const TYPE = (() => { const t = process.env.N200_LANE66_TYPE?.trim(); return !t || t === 'none' ? undefined : t; })();

export function goldenReport(): string {
	const rows = (JSON.parse(readFileSync(path.join(here, '__golden__', 'path-600.json'), 'utf8')) as { rows: GoldenRow[] }).rows;
	const profiles = profilesFromGolden(rows);
	const { cases, own, cross } = outsideCases(profiles);
	const mc = moveCases(profiles, cases);
	const out: string[] = [];
	const readings = profiles.reduce((s, p) => s + Object.keys(p.formants).length, 0);
	out.push(`# Lane 66, Step 4: the golden run\n\n${rows.length} takes in \`path-600.json\`, ${readings} readings (a re-prompt gives none), in ${profiles.length} profiles: ${TYPES.length} types by 12 take indexes. Judged as the wizard judges, with the whole profile's anchors.`);
	out.push('\n## The voice types the profiles are judged under\n', 'Ids that route the same way, by the guard\'s bucket and the stand-ins\' bucket, give the same verdicts and the same replacements, so one stands for each group:\n', ...judgeGroups().map((g) => `- ${g.members.join(', ')}`));
	out.push('\n## Judged outside, under the profile\'s own type\n', '| type | readings | judged outside |', '|---|---|---|', ...own.map((o) => `| ${o.type} | ${o.readings} | ${o.outside} |`), `\nTotal: ${own.reduce((s, o) => s + o.outside, 0)} of ${own.reduce((s, o) => s + o.readings, 0)}${own.some((o) => o.items.length) ? ': ' + own.flatMap((o) => o.items.map((i) => `${o.type} ${i}`)).join('; ') : ''}. The truths are the guard's own band centres, so a reading outside its own type's window is a picker error and nothing else. The sets hold no contralto, countertenor, or bass-baritone cells: own-type results describe the picker's error on four buckets, not those voices.`);
	out.push('\n## Judged outside, under every other type\n', '| judged as | readings | judged outside | of which also outside under the profile\'s own type (the picker\'s error) |', '|---|---|---|---|', ...cross.filter((c) => c.readings > 0).map((c) => `| ${c.group.members.join(', ')} | ${c.readings} | ${frac(c.outside, c.readings)} | ${c.alsoOwn} |`));
	out.push(`\n${cases.length} readings in all are outside under a type that is not the profile's own and inside under its own: the cross-type cases below. These are true to the voice: the voice is the profile's, only the declared type differs. A group's readings are counted once per profile and group, so a vowel that is outside under several groups appears in each.`);
	out.push('\n## Question (a): the reading, or today\'s replacement, nearer the truth\n', questionA(cases));
	out.push('\n## Question (b): what moves when the reading counts, other vowels\' values\n', 'Each case is a cut of the profile to n sung vowels, one judged outside and the rest plausible under that type. A value moves by the difference between the case where the reading is excluded and the case where it counts (today\'s Keep). "Nearer / farther / equal" compares each moved value\'s distance to the set\'s truth, before and after. A voice sung under the wrong type is displaced as a whole, so counting its reading can help it.\n', '\n### Cross-type cases\n', questionB(mc.cross), `\n${setAsideLine(mc.cross)}`, '\nWhere the movement sits:\n', bigMoves(mc.cross));
	out.push('\n### A bass with [i] at 1063 Hz (the profile\'s own [i] replaced; judged as a bass)\n', mc.bass1063.length ? questionB(mc.bass1063) : 'No case.', mc.bass1063.length ? `\n${setAsideLine(mc.bass1063)}\n\nWhere the movement sits:\n\n${bigMoves(mc.bass1063)}` : '');
	const ct = countsTable(profiles);
	out.push(`\n## The two counts, over the whole grid\n\nJudged outside and set aside, every profile under every group, own type included. Set aside is read with nothing kept (today's rule: an outside reading is set aside).\n\n${ct.text}\n\nTotal: ${ct.outside} judged outside, ${ct.aside} set aside.`);
	return out.join('\n') + '\n';
}
const frac = (n: number, d: number) => `${n}/${d} (${d ? ((100 * n) / d).toFixed(1) : 'n/a'}%)`;

test.skipIf(!!DIR)('lane 66 Step 4: the golden run', () => {
	const text = goldenReport();
	if (process.env.N200_LANE66_OUT) writeFileSync(process.env.N200_LANE66_OUT, text);
	console.log(text);
});

test.skipIf(!DIR)('lane 66 Step 4: a folder of the recorder\'s files', () => {
	const { out, md } = writeFolderReport(DIR!, TYPE, repo);
	console.log(md);
	console.log(`tables in ${out}`);
});
