/**
 * Vitest config for the N.173 gates trial. Not a gate: it lives outside
 * `apps/web/src` for the reason `vitest.config.ts` beside it gives.
 *
 * Run from the repository root:
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n168-frequency-run/gates-trial.config.ts
 */

import base from './vitest.config';

export default {
	...base,
	test: { ...base.test, include: ['gates-trial.run.ts'] },
};
