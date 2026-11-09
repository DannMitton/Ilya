/**
 * INTEGRATION STEP 7b (Fable's review of row 181, 2026-11-09): the join runs only on a song read from a scan.
 *
 * It checks that the page's `poemJoin.attach({ ... state })` hands the join no state unless the scan's kept reading is present
 * (`loupePrint.hasScan()`). WHY: Dann's ruling is titled "JOINING POEM TO LYRICS ON A SCAN" (`docs/memory/OPEN.md`); a score opened
 * from a MusicXML or MNX file has words of its own and no print to read, and joining a Poem to those would rewrite words a
 * composer's file spelled. WHEN IT FAILS: the gate was removed from the page, and the join would run on every score with words.
 * It reads the page's source, as `poem-offer-wiring.test.ts` does, because a rule inside a `.svelte` file cannot be run under
 * vitest; it relates to that file and to `poem-join.svelte.ts`, whose header states the rule.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const page = readFileSync(join(__dirname, '../../routes/+page.svelte'), 'utf8');
const attach = (() => {
	const a = page.indexOf('poemJoin.attach(');
	return page.slice(a, page.indexOf('loupePrint.attach(', a));
})();

describe('the join is wired for a song read from a scan only', () => {
	it('lends a state only when the score carries words and the scan\'s kept reading is present', () => {
		expect(attach).toContain('ingestedScore');
		expect(attach).toContain("scoreText !== ''");
		expect(attach).toContain('loupePrint.hasScan()');
	});
	it('lends nothing otherwise (the state is null)', () => {
		expect(attach).toMatch(/\} : null\)/);
	});
});
