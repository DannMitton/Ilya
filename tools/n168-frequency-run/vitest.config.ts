/**
 * Vitest config for the N.168 frequency run. Not a gate.
 *
 * The run needs Ilya's real vowel resolver (`$lib/shane/vowel-resolver.ts`),
 * which lives in `apps/web`, so it runs under vitest. It lives HERE, outside
 * `apps/web/src`, so that the web-test gate never sees it: a skipped test
 * inside that glob would still move the gate's count string.
 *
 * Every `@ilya/*` package resolves to its `src/index.ts`, exactly where
 * `apps/web/node_modules/@ilya/*` symlinks point, so the run and `$lib` share
 * one module instance. That matters: `setStressDictionary` must reach the same
 * engine the pipeline calls.
 *
 * Run from the repository root:
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n168-frequency-run/vitest.config.ts
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');

export default {
	resolve: {
		alias: {
			$lib: path.join(repo, 'apps/web/src/lib'),
			'@ilya/score-parser': path.join(repo, 'packages/score-parser/src/index.ts'),
			'@ilya/phonology': path.join(repo, 'packages/phonology/src/index.ts'),
			'@ilya/dictionary': path.join(repo, 'packages/dictionary/src/index.ts'),
			'@ilya/blurb': path.join(repo, 'packages/blurb/src/index.ts'),
		},
	},
	test: {
		root: here,
		include: ['frequency-run.run.ts'],
		testTimeout: 30 * 60 * 1000,
		hookTimeout: 30 * 60 * 1000,
	},
};
