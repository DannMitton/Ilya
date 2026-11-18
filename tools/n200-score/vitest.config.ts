/**
 * Vitest config for the N.200 scoring tool. Not a gate: it lives outside `apps/web/src`, as `tools/n168-frequency-run/` does,
 * so the web-test gate never counts its tests.
 *
 * Run from the repository root. `<cfg>` below is `--config ../../tools/n200-score/vitest.config.ts`, and every command starts
 * `pnpm --filter @ilya/web exec vitest run <cfg>` (in a cloud workspace that hung once; `apps/web/node_modules/.bin/vitest run <cfg>`
 * from `apps/web` does the same).
 *
 * WHAT RUNS. With no file name, only the two tests: `fidelity-set.test.ts` and `score-core.test.ts`, on synthetic fry with known
 * resonances. A `*.run.ts` runner is included only when its file name is on the command line, written whole (a filter such as
 * `score` does not name it), or, for three of them, when its own variable is set (`RUNNERS` below). The measure pair is by file name
 * only, because both read `N200_SET` and `N200_OUT`. A runner that is not included is not loaded, so no bare command runs the
 * 468 s golden or needs Python.
 *
 * THE RUNNERS
 *   score.run.ts           scores a folder of the recorder's files (`apps/web/src/lib/voice/engine/capture-file.ts`), unzipped.
 *                          `N200_DIR=/path/to/folder`, or a path after the file name; optional `N200_REF`, `N200_NO_BURG=1`.
 *                          Tables go to `<folder>/n200-score-out/`, never into the repository: recordings and what is derived
 *                          from them are never public (`docs/memory/PRODUCT.md`, "COLLEAGUES' RECORDINGS ARE NEVER PUBLIC").
 *   synth-gate.run.ts      the synthetic gate of N.200 Step 3. Writes `N200_SYNTH_OUT` (a JSON file) when set.
 *   golden.run.ts          the golden of `runCapture` on the 600 primary takes; about 468 s. Compares to `__golden__/`;
 *                          `N200_GOLDEN=write` writes it instead; `N200_GOLDEN=write-path` writes the path picker's golden (lane 64).
 *   burg-check.run.ts      the Burg numbers for a report. Needs Python 3 with numpy and scipy; skips, and says so, without them.
 *                          By file name only (it has no variable).
 *   measure.run.ts         the path picker on the synthetic set, rows to `N200_OUT`. `N200_SET=primary|held|third` (lane 64's third set), `N200_TYPE=0..4|all`,
 *                          `N200_STEP5=1`. By file name; it skips unless `N200_SET` and `N200_OUT` are both set.
 *   measure-report.run.ts  the tables from those rows (`N200_SET`, `N200_OUT`). By file name; it skips unless both are set.
 *   lane66-measure.run.ts  lane 66, Step 4: the reading outside the reference values against today's replacement, and what moves when it counts. Golden
 *                          run by file name (`N200_LANE66_OUT=<file>` writes the tables); or a folder of the recorder's files with `N200_LANE66_DIR=<folder>`
 *                          and `N200_LANE66_TYPE=<declared type>`, tables to `<folder>-lane66-out/`, never into the repository.
 *   e.g. `N200_DIR=/path/to/folder pnpm --filter @ilya/web exec vitest run <cfg> score.run.ts`
 *   (a path given after `--` on the command line is read too). `tsx` is not installed, so this runs under vitest.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');

const TESTS = ['fidelity-set.test.ts', 'score-core.test.ts', 'lane66-core.test.ts', 'lane67-core.test.ts'];

/** A runner and the variables that, when any is set, include it without its name on the command line (`[]`: by name only). */
const RUNNERS: [file: string, variables: string[]][] = [
	['score.run.ts', ['N200_DIR']],
	['synth-gate.run.ts', ['N200_SYNTH_OUT']],
	['golden.run.ts', ['N200_GOLDEN']],
	['burg-check.run.ts', []],
	['measure.run.ts', []],
	['measure-report.run.ts', []],
	['lane66-measure.run.ts', ['N200_LANE66_DIR']],
	['lane67-measure.run.ts', []],
];
const argv = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const runners = RUNNERS.filter(([file, vars]) => argv.some((a) => a.includes(file)) || vars.some((v) => process.env[v])).map(([file]) => file);

export default {
	resolve: {
		alias: {
			$lib: path.join(repo, 'apps/web/src/lib'),
		},
	},
	define: {
		__ILYA_RECORDER__: 'false',
		__ILYA_BUILD__: JSON.stringify('n200-score'),
	},
	test: {
		root: here,
		include: [...TESTS, ...runners],
		testTimeout: 30 * 60 * 1000,
		hookTimeout: 30 * 60 * 1000,
	},
};
