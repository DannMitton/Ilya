import { defineConfig } from 'vitest/config';

/**
 * Package-level vitest config. The root config looks for tests in a
 * `tests/` folder, but this package colocates its tests beside their
 * subjects (`src/mnx-parser.test.ts`), the same convention as the Shane
 * engine's tests in apps/web. Without this override, `vitest run
 * --passWithNoTests` finds nothing and passes vacuously — which Dann's
 * first authoritative run caught on 2026-07-12.
 */
export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
	},
});
