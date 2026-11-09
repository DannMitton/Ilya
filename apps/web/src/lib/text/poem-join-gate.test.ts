/**
 * INTEGRATION STEP 7b (Fable's review of row 181, 2026-11-09): the join runs only on a song read from a scan.
 *
 * It checks that the page's `poemJoin.attach(joinDeps({ ... }))` passes the scan's kept reading (`loupePrint.hasScan()`) as the gate;
 * `joinDeps` (`score/loupe-print-wiring.ts`) returns no state without it. WHY: Dann's ruling is titled "JOINING POEM TO LYRICS ON A SCAN" (`docs/memory/OPEN.md`); a score opened
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
	it('lends its state through `joinDeps`, with the scan\'s kept reading as the gate', () => {
		expect(attach).toContain('joinDeps(');
		expect(attach).toContain('hasScan: () => loupePrint.hasScan()');
	});
	/* The state is null unless the score carries words and `hasScan()` holds: that is `joinDeps`, run in
	   `score/loupe-print-wiring.test.ts` ("lends nothing without a score, without words, or without the scan's kept reading"). */
});
