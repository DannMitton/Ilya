/**
 * The threshold, both ways, with the arias in the library (row 182, step 7; brief `brief-code-poem-library-arias_r2_2026-11-09.md`).
 *
 * THE LIBRARY IS THE COMMITTED FILE (`data/dictionary.poems.<hash8>.json`): 14 poems of 13 works and 89 arias of 29 operas (a libretto's
 * `work` is its opera). The matcher is unchanged. This file asks two things of it:
 *   - FORWARD, from the arias: a Lyrics made from an aria's own text fills that aria, and no other. Nothing is asked of the margin
 *     between two arias of one opera, because they share a `work` and `rankWorks` scores a work by its best entry (so siblings never
 *     compete); what that costs is measured below (how like a sibling an aria's text is).
 *   - BACK, from the songs: the twelve read Lyrics of `tools/poems/fixtures/` answer as `expected_r2.txt` says, and none fills from an
 *     aria by mistake.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { PoemEntry, PoemLibrary } from './poem-library';
import { align, evaluate, foldLetters, matchPoem, rankWorks } from './poem-match';

const ROOT = join(__dirname, '../../../../..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/dictionary-manifest.json'), 'utf8'));
const library: PoemLibrary = JSON.parse(readFileSync(join(ROOT, 'data', manifest.poemFiles[0]), 'utf8'));
const fixture = (name: string): string => readFileSync(join(ROOT, 'tools/poems/fixtures', `${name}.lyrics.txt`), 'utf8');
const arias = library.entries.filter((e) => e.kind === 'libretto');

const FIXTURES = ['P', 'S', 'T', 'U1', 'U4', 'U5', 'U6', 'r114-song1', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5'];
const FILLS = ['P', 'S', 'T', 'U1', 'U6', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5'];
const REFUSES = ['U4', 'U5', 'r114-song1'];

describe('the library holds the arias', () => {
	it('has 103 entries of 42 works: 14 poems of 13 works and 89 arias of 29 operas', () => {
		expect(library.entries).toHaveLength(103);
		expect(arias).toHaveLength(89);
		expect(new Set(library.entries.map((e) => e.work)).size).toBe(42);
		expect(new Set(arias.map((e) => e.work)).size).toBe(29);
		// no work is shared between the poems and the arias
		const poemWorks = new Set(library.entries.filter((e) => e.kind === undefined).map((e) => e.work));
		for (const e of arias) expect(poemWorks.has(e.work), e.id).toBe(false);
	});

	it('every aria’s work is its opera’s: arias of one opera share one, and an opera has one work', () => {
		const workOf = new Map<string, string>();
		for (const e of arias) {
			const opera = e.opera!.operaRu;
			expect(workOf.get(opera) ?? e.work, opera).toBe(e.work);
			workOf.set(opera, e.work);
		}
	});
});

describe('forward: a Lyrics made from an aria’s own text fills that aria', () => {
	it('fills its own entry for each of the 89 (and the lowest margin is high)', () => {
		let lowest = 1;
		let lowestId = '';
		for (const e of arias) {
			const outcome = evaluate(e.textModern, library);
			expect(outcome.ok, `${e.id} ${e.title}`).toBe(true);
			if (!outcome.ok) continue;
			expect(outcome.match.entry.id, `${e.id} ${e.title}`).toBe(e.id);
			expect(outcome.match.work, e.id).toBe(e.work);
			if (outcome.match.margin < lowest) {
				lowest = outcome.match.margin;
				lowestId = e.id;
			}
		}
		// Measured on this library: 0.944 (Fable, on the same data). The threshold is 0.1; nothing here comes near it.
		expect(lowest, lowestId).toBeGreaterThan(0.9);
	}, 300_000);

	it('fills for a Lyrics with the arias’ own wording only in part: the first half of the text still names the aria', () => {
		let ok = 0;
		let tried = 0;
		for (const e of arias) {
			const lines = e.textModern.split('\n');
			const half = lines.slice(0, Math.max(6, Math.ceil(lines.length / 2))).join('\n');
			if (foldLetters(half).length < 80) continue; // under the floor (`MIN_QUERY_LETTERS`): not asked of it
			tried += 1;
			const m = matchPoem(half, library);
			if (m?.entry.id === e.id) ok += 1;
			// a wrong aria must never be named: either this one, or none
			if (m) expect(m.work, e.id).toBe(e.work);
		}
		expect(tried).toBeGreaterThan(40);
		expect(ok / tried).toBeGreaterThan(0.9);
	}, 300_000);

	it('MEASURED: how like an aria its siblings are (the margin that `work` per opera does not ask of the matcher)', () => {
		// Score each aria's text against every other aria of the SAME opera, as `rankWorks` would if each aria were its own work.
		const byOpera = new Map<string, PoemEntry[]>();
		for (const e of arias) byOpera.set(e.work, [...(byOpera.get(e.work) ?? []), e]);
		let worst = 0;
		let worstPair = '';
		for (const list of byOpera.values()) {
			for (const a of list) {
				const q = foldLetters(a.textModern);
				for (const b of list) {
					if (a.id === b.id) continue;
					const score = align(Uint16Array.from([...q].map((c) => c.charCodeAt(0))), Uint16Array.from([...b.letters].map((c) => c.charCodeAt(0)))).score / (2 * q.length);
					if (score > worst) {
						worst = score;
						worstPair = `${a.id} against ${b.id}`;
					}
				}
			}
		}
		// If the arias were separate works, the margin of the closest pair would be 1 minus this. It is printed for the report.
		console.log(`HIGHEST SCORE OF AN ARIA'S TEXT AGAINST A SIBLING OF ITS OPERA: ${worst.toFixed(3)} (${worstPair}); margin if they were separate works: ${(1 - worst).toFixed(3)}`);
		expect(1 - worst).toBeGreaterThan(0.1); // the margin rule's floor (`MIN_MARGIN`): even per aria, no two arias of an opera would have blocked each other
	}, 300_000);
});

describe('back: the twelve fixture songs answer as expected_r2.txt says, and none fills from an aria', () => {
	it('fills nine, refuses three, and names the poem each fills', () => {
		for (const name of FILLS) expect(matchPoem(fixture(name), library), name).not.toBeNull();
		for (const name of REFUSES) expect(matchPoem(fixture(name), library), name).toBeNull();
	}, 120_000);

	it('row 114: songs 2 to 5 still fill, song 1 still does not', () => {
		for (const n of [2, 3, 4, 5]) expect(matchPoem(fixture(`r114-song${n}`), library), `song ${n}`).not.toBeNull();
		const song1 = evaluate(fixture('r114-song1'), library);
		expect(song1.ok).toBe(false);
		if (!song1.ok) expect(song1.reason).toBe('low-score'); // its top (0.056) is below the floor of 0.15, though it is now an aria's work
	}, 120_000);

	it('no fixture fills from an aria by mistake: every fill is a poem', () => {
		for (const name of FIXTURES) {
			const m = matchPoem(fixture(name), library);
			if (m) expect(m.entry.kind, name).toBeUndefined();
		}
	}, 120_000);

	it('no fixture comes near filling from an aria: the best aria score on each is below the floor', () => {
		for (const name of FIXTURES) {
			const best = rankWorks(foldLetters(fixture(name)), library).find((w) => w.entry.kind === 'libretto');
			if (best) expect(best.score, name).toBeLessThan(0.15);
		}
	}, 120_000);
});
