/**
 * Vitest config for the N.200 scoring tool. Not a gate: it lives outside `apps/web/src`, as `tools/n168-frequency-run/` does,
 * so the web-test gate never counts its tests.
 *
 * Run from the repository root.
 *   The tool's own tests, on synthetic fry with known resonances:
 *     pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts
 *   Score a folder of the recorder's files (`apps/web/src/lib/voice/engine/capture-file.ts`), unzipped:
 *     N200_DIR=/path/to/folder pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts score.run.ts
 *   (a path given after `--` on the command line is read too). The tables are written to `<folder>/n200-score-out/`, never into
 *   the repository: recordings and what is derived from them are never public (`docs/memory/PRODUCT.md`, "COLLEAGUES' RECORDINGS ARE
 *   NEVER PUBLIC"). `tsx` is not installed, so this runs under vitest.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');

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
		include: ['fidelity-set.test.ts', 'score-core.test.ts', 'score.run.ts', 'synth-gate.run.ts', 'golden.run.ts'],
		testTimeout: 30 * 60 * 1000,
		hookTimeout: 30 * 60 * 1000,
	},
};
