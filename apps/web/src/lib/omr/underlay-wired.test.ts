import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* Closing polish lane, step 0b. The scan reader's three files (worker, core, model) reach the built site only if `dev` and `build` run
   `copy-underlay-model.mjs`. They did not, and every scan was read with no words and no error. This test fails if either script drops it. */
const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };

describe('the scan reader’s files are built into the site', () => {
	it.each(['dev', 'build'])('%s copies the underlay reader’s files, after the metre model', (name) => {
		const script = pkg.scripts[name];
		expect(script).toContain('node scripts/copy-underlay-model.mjs');
		expect(script.indexOf('copy-underlay-model.mjs')).toBeGreaterThan(script.indexOf('copy-metre-model.mjs'));
	});
});
