/**
 * The last sheet of a print breaks nowhere (closing polish lane, step 12, `print-pages.test.ts:20`). A TEXT TEST over `app.css`: the rule that clears
 * `break-after` on the last `.paper-page` must also match a sheet that is not its parent's last child, as MELODY's is (`MarkupPane.svelte` draws a
 * zero-height wrapper after the sheets), or Chromium prints a blank page after it.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, '../app.css'), 'utf8');

describe('the last sheet breaks nowhere', () => {
	it('clears break-after on the last-child sheet and on the last sheet of its type', () => {
		const rule = /\.paper-page:last-child,\s*\.paper-page:last-of-type\s*\{[^}]*page-break-after:\s*auto;[^}]*break-after:\s*auto;[^}]*\}/.exec(css);
		expect(rule, 'the rule is there').not.toBeNull();
	});
	it('keeps break-after: page on the other sheets', () => {
		expect(/\.paper-page\s*\{[^}]*break-after:\s*page;/.test(css)).toBe(true);
	});
});
