// The capture harness's vitest config. Run with `--root <repo>/apps/web --config <this file>` so the SvelteKit plugin and the
// `$lib` alias resolve exactly as they do for the app's own tests. `test.dir` points at this folder, so no file under apps/ is added.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mergeConfig } from 'vitest/config';
import base from '../../../../apps/web/vite.config.ts';

const here = dirname(fileURLToPath(import.meta.url));

export default (env: { command: 'build' | 'serve'; mode: string }) =>
	mergeConfig((base as unknown as (e: typeof env) => Record<string, unknown>)(env), {
		// the harness folder has no node_modules, so the workspace packages the app imports are resolved from apps/web's own
		resolve: { alias: { '@ilya/score-parser': join(here, '../../../../apps/web/node_modules/@ilya/score-parser') } },
		server: { fs: { strict: false } },
		test: { dir: here, include: ['*.capture.ts'], exclude: [], testTimeout: 1_200_000, hookTimeout: 120_000, fileParallelism: false },
	});
